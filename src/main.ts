import assert from 'assert'
import { build } from 'esbuild'
import { dirname, join, resolve } from 'path'
import { sync as findPackageJson } from 'pkg-up'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createBookPlugin } from './book/plugin'
import { resolveFiles } from './book/resolver'
import { DevServer } from './dev-server'
import { loadConfig } from './load-config'

interface DevCommandArgv {
  stories: string[]
  port: number
  config: string
  verbose: boolean
}

yargs(hideBin(process.argv))
  .command<DevCommandArgv>(
    'dev <stories...>',
    'start the dev server',
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
        console.log(`🔧 Loaded config from ${argv.config}`);
      }

      const files = (await resolveFiles(argv.stories)).map(file => resolve(file))

      console.log(`🔎 Found ${files.length} files with stories`)

      if(argv.verbose) {
        for(const file of files) {
          console.log(`    ${file}`)
        }
      }

      const packageRoot = getPackageRoot();

      const devServer = new DevServer({
        port: argv.port,
        staticDir: join(packageRoot, 'src/book/ui/public'),
        logRequests: argv.verbose
      });
      
      build({
        entryPoints: {
          'index': 'entrypoint'
        },
        outdir: '/',
        bundle: true,
        watch: true,
        write: false,
        platform: 'browser',
        format: 'iife',
        incremental: true,
        plugins: [
          createBookPlugin(files, packageRoot, process.cwd()),
          devServer.createPlugin(),
          ...(config?.plugins ?? [])
        ],
        metafile: true,
      })

      devServer.listen();

      console.log(`🚀 Listening on http://localhost:${argv.port}`)
    }
  )
  .demandCommand()
  .argv

function getPackageRoot() {
  const pkg = findPackageJson({ cwd: __dirname });
  assert(pkg);
  return dirname(pkg);
}

