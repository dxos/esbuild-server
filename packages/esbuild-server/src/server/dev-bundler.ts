//
// Copyright 2022 DXOS.org
//

import { CertificateManager, CertificateStore } from '@rushstack/debug-certificate-manager';
import { ConsoleTerminalProvider, Terminal } from '@rushstack/node-core-library';
import { build, BuildOptions, Plugin } from 'esbuild';

import { defaultBuildOptions } from '../config';
import { UPDATE_EVENTS, DevServer, DevServerConfig } from './dev-server';

export enum Scheme {
  HTTP,
  HTTPS
}

export interface DevBundlerConfig {
  entryPoints: string[] | Record<string, string>
  plugins: Plugin[]
  devServer: DevServerConfig
  overrides?: BuildOptions
  scheme?: Scheme
}

/**
 * Starts build and HTTP server.
 */
export async function startDevBundler (config: DevBundlerConfig) {
  const devServer = new DevServer(config.devServer);
  const overrides = config?.overrides || {};

  void build({
    ...defaultBuildOptions,
    entryPoints: config.entryPoints,
    plugins: [
      ...config.plugins,
      devServer.createPlugin()
    ],

    outdir: '/',
    write: false,

    // https://esbuild.github.io/api/#watch
    // https://github.com/evanw/esbuild/issues/802
    // Trigger reload.
    banner: {
      js: `(() => new EventSource("${UPDATE_EVENTS}").onmessage = () => location.reload())();`
    },
    incremental: true,
    watch: {
      onRebuild (error, result) {
        if (error) {
          console.error(error);
        } else {
          devServer.update();
        }
      }
    },

    ...overrides
  });

  const options = {
    port: config.devServer.port
  };

  // https://www.npmjs.com/package/@rushstack/debug-certificate-manager
  if (config.scheme === Scheme.HTTPS) {
    const certificateStore: CertificateStore = new CertificateStore();
    const certificateManager: CertificateManager = new CertificateManager();
    const terminal = new Terminal(new ConsoleTerminalProvider());
    await certificateManager.ensureCertificateAsync(true, terminal);
    Object.assign(options, {
      tls: {
        cert: certificateStore.certificateData,
        key: certificateStore.keyData
      }
    });
  }

  // Increment port if already running elsewhere.
  const callback = (code: string) => {
    if (code === 'EADDRINUSE') {
      options.port++;
      void devServer.listen(options, callback);
    } else {
      throw Error(code);
    }
  };

  void devServer.listen(options, callback);
}
