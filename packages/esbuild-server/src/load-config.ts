//
// Copyright 2022 DXOS.org
//

import { existsSync } from 'fs';
import { resolve } from 'path';

import { Config } from './config';

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
