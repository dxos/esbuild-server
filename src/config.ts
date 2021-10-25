import { Plugin } from 'esbuild';

export const DEFAFULT_CONFIG_FILE = './esbuild-server.config.js';

export interface Config {
  /**
   * List of entry points to bundle.
   *
   * Those are then can be requested from the dev server.
   *
   * Read more: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: string[] | Record<string, string>

  /**
   * Directory to output production build to.
   */
  outdir?: string

  /**
   * Directory with static files to be served by the dev server.
   */
  staticDir?: string

  /**
   * Esbuild plugins: https://esbuild.github.io/plugins/.
   */
  plugins?: Plugin[]
}
