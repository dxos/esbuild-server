//
// Copyright 2022 DXOS.org
//

import { BuildOptions, Plugin } from 'esbuild';
import { existsSync } from 'fs';
import { resolve } from 'path';

export const defaultBuildOptions: BuildOptions = {
  bundle: true,
  format: 'iife',
  loader: {
    '.jpg': 'file',
    '.png': 'file',
    '.svg': 'file'
  },
  metafile: true,
  platform: 'browser',
  sourcemap: true
};

export const DEFAULT_CONFIG_FILE = './esbuild-server.config.js';

export interface Config {
  /**
   * List of entry points to bundle.
   * Those are then can be requested from the dev server.
   * Read more: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: string[] | Record<string, string>

  /**
   * Directory to output production build to.
   */
  outdir?: string

  /**
   * Override esapp default settings for esbuild
   */
  overrides?: BuildOptions

  /**
   * Esbuild plugins:
   * https://esbuild.github.io/plugins
   * https://github.com/esbuild/community-plugins
   */
  plugins?: Plugin[]

  /**
   * Directory with static files to be served by the dev server.
   */
  staticDir?: string

  /**
   * Book-specific config.
   */
  book?: {
    /**
     * Additional entrypoints for book to build.
     */
    entryPoints?: string[]

    /**
     * Directory to output static build to.
     */
    outdir?: string
  }
}

const DISALLOWED_OVERRIDES = [
  'bundle',
  'outfile',
  'outdir',
  'outbase',
  'entryPoints'
];

export function validateConfig (config: Config) {
  const forbiddenKeys = Object.keys(config.overrides ?? {}).filter(key => DISALLOWED_OVERRIDES.includes(key));
  if (forbiddenKeys.length > 0) {
    throw new Error(`Following overrides are forbidden: ${forbiddenKeys.join(', ')}`);
  }
}

export function validateConfigForApp (config: Config) {
  validateConfig(config);
  if (!config.entryPoints) {
    throw new Error('At least one entrypoint must be specified');
  }
}

export function loadConfig (path: string): Config | undefined {
  const resolved = resolve(path);

  if (!existsSync(resolved)) {
    return undefined;
  }

  // TODO: Config validation.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: Config = require(resolved);
  return config;
}
