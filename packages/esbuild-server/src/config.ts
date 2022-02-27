//
// Copyright 2022 DXOS.org
//

import { BuildOptions, Plugin } from 'esbuild';

export const DEFAFULT_CONFIG_FILE = './esbuild-server.config.js';

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
   * Directory with static files to be served by the dev server.
   */
  staticDir?: string

  /**
   * Esbuild plugins: https://esbuild.github.io/plugins/.
   */
  plugins?: Plugin[]
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
