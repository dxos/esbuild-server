//
// Copyright 2022 DXOS.org
//

import { build, BuildOptions, Plugin } from 'esbuild';

import { UPDATE_EVENTS, DevServer, DevServerConfig } from './dev-server';

export interface DevBundlerConfig {
  entryPoints: string[] | Record<string, string>
  plugins: Plugin[]
  devServer: DevServerConfig,
  overrides?: BuildOptions
}

export function startDevBundler (config: DevBundlerConfig) {
  const devServer = new DevServer(config.devServer);
  const overrides = config?.overrides || {};

  void build({
    entryPoints: config.entryPoints,
    outdir: '/', // TODO(burdon): Configure?
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    incremental: true,
    sourcemap: true,
    plugins: [
      ...config.plugins,
      devServer.createPlugin()
    ],
    metafile: true,
    loader: {
      '.jpg': 'file',
      '.png': 'file',
      '.svg': 'file'
    },
    // https://esbuild.github.io/api/#watch
    // https://github.com/evanw/esbuild/issues/802
    banner: {
      js: `(() => new EventSource("${UPDATE_EVENTS}").onmessage = () => location.reload())();`
    },
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
