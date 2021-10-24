import chalk from "chalk";
import { dirname, join, resolve } from "path";
import { CommandModule } from "yargs";
import { resolveFiles } from "../book/resolver";
import { loadConfig } from "../load-config";
import { sync as findPackageJson } from 'pkg-up'
import assert from "assert";
import { startDevBundler } from "../dev-bundler";
import { createBookPlugin } from "../book/plugin";

interface BookCommandArgv {
  stories: string[]
  port: number
  config: string
  verbose: boolean
}

export const bookCommand: CommandModule<{}, BookCommandArgv> = {
  command: 'book <stories...>',
  describe: 'start the dev server with a book of components',
  builder: yargs => yargs
    .positional('stories', {
      describe: 'glob to find story files',
      type: 'string',
      array: true,
      default: [],
    })
    .option('port', { 
      alias: 'p',
      type: 'number',
      default: 8080,
    })
    .option('config', { 
      type: 'string',
      default: './esapp.config.js',
    })
    .option('verbose', { 
      alias: 'v',
      type: 'boolean',
      default: false,
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);

    if(config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    }

    const files = (await resolveFiles(argv.stories)).map(file => resolve(file))

    if(files.length === 0) {
      console.log(chalk`{red error}: No stories found.`)
      process.exit(1)
    }

    console.log(chalk`🔎 {dim Found} {white ${files.length}} {dim files with stories}`)

    if(argv.verbose) {
      for(const file of files) {
        console.log(`    ${file}`)
      }
    }

    const packageRoot = getPackageRoot();
    startDevBundler({
      entryPoints: {
        'index': 'entrypoint'
      },
      plugins: [
        createBookPlugin(files, packageRoot, process.cwd()),
        ...(config?.plugins ?? [])
      ],
      devServer: {
        port: argv.port,
        staticDir: join(packageRoot, 'src/book/ui/public'),
        logRequests: argv.verbose
      }
    })
    
    console.log(chalk`🚀 {dim Listening on} {white http://localhost:${argv.port}}`)
  }
}

function getPackageRoot() {
  const pkg = findPackageJson({ cwd: __dirname });
  assert(pkg);
  return dirname(pkg);
}
