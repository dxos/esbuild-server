import chalk from "chalk";
import { build } from "esbuild";
import { ncp } from "ncp";
import { promisify } from "util";
import { CommandModule } from "yargs";
import { loadConfig } from "../load-config";

interface BuildCommandArgv {
  config: string
}

export const buildCommand: CommandModule<{}, BuildCommandArgv> = {
  command: 'build',
  describe: 'build the app for production',
  builder: yargs => yargs
    .option('config', {
      type: 'string',
      default: './esapp.config.js'
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);

    if (config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    } else {
      throw new Error('Config not found');
    }

    if (!config.entryPoints) {
      throw new Error('At least one entrypoint must be specified');
    }

    const outdir = config.outdir || './dist';

    console.log(chalk`📦 {dim Building to} ${outdir}`)


    console.log(chalk`🏎️  {dim Build started}`)
    const startTime = Date.now()

    try {
      if (config.staticDir) {
        try {
          await promisify(ncp)(config.staticDir, outdir);
        } catch(err) {
          console.error(err)
          throw err
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
        loader: {
          '.jpg': 'file',
          '.png': 'file',
          '.svg': 'file',
        }
      });
      console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`)
    } catch(err) {
      console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`)
      process.exit(1);
    }
  }
}
