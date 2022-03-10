//
// Copyright 2022 DXOS.org
//

import chalk from 'chalk';
import { build } from 'esbuild';
import { mkdir } from 'fs/promises';
import { ncp } from 'ncp';
import { promisify } from 'util';
import { CommandModule } from 'yargs';

import { DEFAFULT_CONFIG_FILE, validateConfigForApp } from '../config';
import { loadConfig } from '../load-config';

interface BuildCommandArgv {
  config: string
}

export const buildCommand: CommandModule<{}, BuildCommandArgv> = {
  command: 'build',
  describe: 'Builds the app for production.',
  builder: yargs => yargs
    .option('config', {
      type: 'string',
      default: DEFAFULT_CONFIG_FILE
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    const overrides = config?.overrides || {};

    if (config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    } else {
      throw new Error('Config not found');
    }

    validateConfigForApp(config ?? {});

    const outdir = config.outdir || './out';

    console.log(chalk`📦 {dim Building to} ${outdir}`);
    console.log(chalk`🏎️  {dim Build started}`);
    const startTime = Date.now();

    try {
      if (config.staticDir) {
        try {
          await mkdir(outdir, { recursive: true });

          await promisify(ncp)(config.staticDir, outdir);
        } catch (err) {
          console.error(err);
          throw err;
        }
      }

      await build({
        entryPoints: config.entryPoints,
        outdir,
        bundle: true,
        write: true,
        platform: 'browser',
        format: 'iife',
        plugins: config.plugins,
        metafile: true,
        sourcemap: true,
        loader: {
          '.jpg': 'file',
          '.png': 'file',
          '.svg': 'file'
        },
        ...overrides
      });
      console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
    } catch (err) {
      console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
      process.exit(1);
    }
  }
};
