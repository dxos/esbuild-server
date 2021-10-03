import assert from 'assert'
import chalk from 'chalk'
import { build, Plugin } from 'esbuild'
import { dirname, join, resolve } from 'path'
import { sync as findPackageJson } from 'pkg-up'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createBookPlugin } from './book/plugin'
import { resolveFiles } from './book/resolver'
import { DevServer, DevServerConfig } from './dev-server'
import { loadConfig } from './load-config'

interface DevCommandArgv {
  stories: string[]
  port: number
  config: string
  verbose: boolean
}

yargs(hideBin(process.argv))
  .command<DevCommandArgv>(
    'dev',
    'start the dev server',
    yargs => yargs
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
    async argv => {
      const config = loadConfig(argv.config);

      if(config) {
        console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
      } else {
        throw new Error('Config not found')
      }

      if(!config.entryPoints) {
        throw new Error('At least one entrypoint must be specified')
      }

      startDevBundler({
        entryPoints: config?.entryPoints,
        plugins: config?.plugins ?? [],
        devServer: {
          port: argv.port,
          staticDir: config?.staticDir,
          logRequests: argv.verbose
        }
      })

      console.log(chalk`🚀 {dim Listening on} {white http://localhost:${argv.port}}`)
    }
  )
  .command<DevCommandArgv>(
    'book <stories...>',
    'start the dev server with a book of components',
    yargs => yargs
      .positional('stories', {
        describe: 'glob to find story files',
        type: 'string',
        array: true,
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
    async argv => {
      const config = loadConfig(argv.config);

      if(config) {
        console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
      }

      const files = (await resolveFiles(argv.stories)).map(file => resolve(file))

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
  )
  .demandCommand()
  .argv

function getPackageRoot() {
  const pkg = findPackageJson({ cwd: __dirname });
  assert(pkg);
  return dirname(pkg);
}

interface DevBundlerConfig {
  entryPoints: string[] | Record<string, string>
  plugins: Plugin[]
  devServer: DevServerConfig
}

function startDevBundler(config: DevBundlerConfig) {
  const devServer = new DevServer(config.devServer);
  
  build({
    entryPoints: config.entryPoints,
    outdir: '/',
    bundle: true,
    watch: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    incremental: true,
    plugins: [
      ...config.plugins,
      devServer.createPlugin(),
    ],
    metafile: true,
  })

  devServer.listen();
}
