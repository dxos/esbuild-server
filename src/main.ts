import { build, BuildResult, OutputFile, Plugin, serve } from 'esbuild'
import { dirname, join, resolve } from 'path'
import yargs, { string } from 'yargs'
import { hideBin } from 'yargs/helpers'
import glob from 'glob'
import { promisify } from 'util'
import http from 'http'
import { RequestOptions } from 'https'
import { loadConfig } from './load-config'
import { sync as findPackageJson } from 'pkg-up' 
import assert from 'assert'
import { Trigger } from './trigger'
import { readFile } from 'fs/promises'

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

      const devServer = new DevServer(argv.port, join(packageRoot, 'src/ui/public'), argv.verbose);
      
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
          createPlugin(files, packageRoot, process.cwd()),
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

interface ResolvedFile {
  path: string
  contents: Uint8Array
}

class DevServer {
  private buildTrigger = new Trigger<BuildResult>();

  constructor(
    readonly port: number,
    readonly staticDir: string,
    readonly logRequests: boolean
  ) {}

  createPlugin(): Plugin {
    return {
      name: 'esapp-serve',
      setup: ({ onStart, onEnd }) => {
        let startTime: number = 0;
        onStart(() => {
          console.log(`Build started`)
          startTime = Date.now()

          this.buildTrigger.reset();
        })
  
        onEnd((result) => {
          console.log(`Build ended in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`)
  
          this.buildTrigger.wake(result);
        })
      }
    }
  }

  private async resolveFile(url: string): Promise<ResolvedFile | undefined> {
    const buildResult = await this.buildTrigger.wait()
    
    const output = buildResult.outputFiles?.find(file => file.path === url)
    if(output) {
      return {
        path: output.path,
        contents: output.contents,
      }
    }

    try {
      const path = join(this.staticDir, url)
      const contents = await readFile(path)

      return {
          path,
          contents,
      }
    } catch {}

    if(url === '/') {
      return this.resolveFile('index.html')
    }

    return undefined
  }

  listen() {
    http.createServer(async (req, res) => {
      const start = Date.now()

      this.logRequests && console.log(`=> ${req.method} ${req.url} ${req.headers['accept']}`)

      const respondWithFile = (file: ResolvedFile) => {
        this.logRequests && console.log(`<= 200 ${file.path} (${file.contents.length} bytes) ${Date.now() - start}ms`)

        res.writeHead(200)
        res.write(file?.contents)
        res.end()
      }

      const file = await this.resolveFile(req.url!)
      if(file) {
        respondWithFile(file)
        return
      }

      const indexFile = await this.resolveFile('/')
      if(indexFile) {
        respondWithFile(indexFile)
        return
      }

      this.logRequests && console.log(`<= 404`)

      res.writeHead(404, 'Not found')
      res.end()
    }).listen(this.port)
  }
}

function createPlugin(files: string[], packageRoot: string, projectRoot: string): Plugin {
  return {
    name: 'esapp-book',
    setup: ({ onResolve, onLoad, onStart, onEnd }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => ({
        resolveDir: __dirname,
        contents: `
                import { uiMain } from '${join(packageRoot, 'src/ui/index.tsx')}';

                const storyModules = {
                  ${files.map(file => `"${file}": require("${file}")`).join(',')}
                };
    
                uiMain({
                  storyModules,
                  basePath: "${process.cwd()}",
                });
              `
      }))

      let reactResolved: string;

      onResolve({ filter: /^react$/ }, () => ({ path: reactResolved }));

      onStart(() => {
        reactResolved = require.resolve('react', { paths: [projectRoot] })
      })
    }
  }
}

async function resolveFiles (globs: string[]): Promise<string[]> {
  const results = await Promise.all(globs.map(pattern => promisify(glob)(pattern)));
  return Array.from(new Set(results.flat(1)));
}

