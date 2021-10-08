import { Config } from "./config";
import { existsSync } from "fs";
import { resolve } from "path";

export function loadConfig(path: string): Config | undefined {
  const resolved = resolve(path);

  if(!existsSync(resolved)) {
    return undefined;
  }

  const config: Config = require(resolved);

  // TODO: Config validation.

  return config;
}
