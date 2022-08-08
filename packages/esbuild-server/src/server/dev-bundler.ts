//
// Copyright 2022 DXOS.org
//

import { build, BuildOptions, Plugin } from 'esbuild';

import { defaultBuildOptions } from '../config';
import { UPDATE_EVENTS, DevServer, DevServerConfig } from './dev-server';

export interface DevBundlerConfig {
  entryPoints: string[] | Record<string, string>
  plugins: Plugin[]
  devServer: DevServerConfig
  overrides?: BuildOptions
}

/**
 * Starts build and HTTP server.
 */
export function startDevBundler (config: DevBundlerConfig) {
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

    // Trigger reload.
    banner: {
      js: `(() => new EventSource("${UPDATE_EVENTS}").onmessage = () => location.reload())();`
    },
    // https://esbuild.github.io/api/#watch
    // https://github.com/evanw/esbuild/issues/802
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

  // TODO(burdon): Add to dev server.
  // Increment port if already running elsewhere.
  let port = config.devServer.port;
  const callback = (code: string) => {
    if (code === 'EADDRINUSE') {
      devServer.listen(++port, callback);
    } else {
      throw Error(code);
    }
  };

  devServer.listen(port, callback);
}
