//
// Copyright 2022 DXOS.org
//

import chalk from 'chalk';
import { build } from 'esbuild';
import { mkdir } from 'fs/promises';
import defaultsDeep from 'lodash.defaultsdeep';
import { ncp } from 'ncp';
import { promisify } from 'util';
import { CommandModule } from 'yargs';

import { DEFAULT_CONFIG_FILE, defaultBuildOptions, loadConfig, validateConfigForApp } from '../config';

interface BuildCommandArgv {
  config: string
}

export const buildCommand: CommandModule<{}, BuildCommandArgv> = {
  command: 'build',
  describe: 'Builds the app for production.',
  builder: yargs => yargs
    .option('config', {
      type: 'string',
      default: DEFAULT_CONFIG_FILE
    })
    .option('minify', {
      type: 'boolean'
    })
    .option('watch', {
      type: 'boolean'
    })
    .option('verbose', {
      type: 'boolean'
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    const overrides = defaultsDeep({}, config?.overrides, {
      // https://esbuild.github.io/api/#minify
      minify: argv.minify ? true : undefined,
      // https://esbuild.github.io/api/#watch
      watch: argv.watch ? {
        onRebuild (error: any) {
          if (error) {
            console.log(chalk`🚫 {dim Build} {red failed}`, error);
          } else {
            console.log(chalk`🏁 {dim Build} {green updated}`);
          }
        }
      } : undefined
    });

    if (argv.verbose) {
      console.log(chalk`🔧 ${JSON.stringify(overrides, undefined, 2)}`);
    }

    if (config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    } else {
      throw new Error('Config not found.');
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
        ...defaultBuildOptions,

        entryPoints: config.entryPoints,
        outdir,
        plugins: config.plugins,
        write: true,

        ...overrides
      });
      console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
    } catch (err) {
      console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
      process.exit(1);
    }
  }
};
