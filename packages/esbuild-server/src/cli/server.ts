//
// Copyright 2022 DXOS.org
//

import chalk from 'chalk';
import { CommandModule } from 'yargs';

import { DEFAULT_CONFIG_FILE, loadConfig, validateConfigForApp } from '../config';
import { Scheme, startDevBundler } from '../server';

interface ServerCommandArgv {
  port: number
  config: string
  verbose: boolean
}

export const serverCommand: CommandModule<{}, ServerCommandArgv> = {
  command: 'server',
  aliases: ['dev'],
  describe: 'Starts the dev server.',
  builder: yargs => yargs
    .option('port', {
      alias: 'p',
      type: 'number',
      default: 8080
    })
    .option('https', {
      type: 'boolean'
    })
    .option('config', {
      type: 'string',
      default: DEFAULT_CONFIG_FILE
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      default: false
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    if (!config) {
      throw new Error('Config not found.');
    }

    console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);

    validateConfigForApp(config);

    void startDevBundler({
      entryPoints: config.entryPoints!,
      plugins: config.plugins ?? [],
      devServer: {
        port: argv.port,
        staticDir: config.staticDir,
        logRequests: argv.verbose
      },
      scheme: argv.https ? Scheme.HTTPS : Scheme.HTTP,
      overrides: config.overrides
    });
  }
};
