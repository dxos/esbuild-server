import { BuildOptions, Plugin } from "esbuild";

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
