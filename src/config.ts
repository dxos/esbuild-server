import { Plugin } from "esbuild";

export interface Config {
  entryPoints?: string[] | Record<string, string>
  staticDir?: string
  plugins?: Plugin[]
}
