import { Plugin } from "esbuild";

export interface Config {
  entrypoints?: string[] | Record<string, string>
  staticDir?: string
  plugins?: Plugin[]
}
