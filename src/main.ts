import { Plugin, serve } from 'esbuild'
import { dirname, join, resolve } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import glob from 'glob'
import { promisify } from 'util'
import http from 'http'
import { RequestOptions } from 'https'
import { loadConfig } from './load-config'
import { sync as findPackageJson } from 'pkg-up' 
import assert from 'assert'

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

      const serveResult = await serve({
        servedir: join(packageRoot, 'src/ui/public'),
      }, {
        entryPoints: {
          'index': 'entrypoint'
        },
        bundle: true,
        platform: 'browser',
        format: 'iife',
        plugins: [
          createPlugin(files, packageRoot, process.cwd()),
          ...(config?.plugins ?? [])
        ],
        metafile: true,
      })

      createProxy(serveResult.host, serveResult.port).listen(argv.port);
      
      console.log('🚀 Listening on http://localhost:8080')
    }
  )
  .demandCommand()
  .argv

function createProxy(esbuildHost: string, esbuildPort: number) {
  return http.createServer((req, res) => {
    const options: RequestOptions = {
      hostname: esbuildHost,
      port: esbuildPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }

    const proxyReq = http.request(options, proxyRes => {
      if (proxyRes.statusCode === 404) {
        const options: RequestOptions = {
          hostname: esbuildHost,
          port: esbuildPort,
          path: '/',
          method: 'GET',
        }
        const proxyReq = http.request(options, proxyRes => {
          res.writeHead(proxyRes.statusCode!, proxyRes.headers)
          proxyRes.pipe(res, { end: true })
        })
        proxyReq.end()
      } else {
        // Otherwise, forward the response from esbuild to the client
        res.writeHead(proxyRes.statusCode!, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      }
    })

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true })
  })
}

function getPackageRoot() {
  const pkg = findPackageJson({ cwd: __dirname });
  assert(pkg);
  return dirname(pkg);
}

function createPlugin(files: string[], packageRoot: string, projectRoot: string): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad }) => {
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
      })),

      onResolve({ filter: /^react$/ }, () => ({ path: require.resolve('react', { paths: [projectRoot] }) }))
    }
  }
}

async function resolveFiles (globs: string[]): Promise<string[]> {
  const results = await Promise.all(globs.map(pattern => promisify(glob)(pattern)));
  return Array.from(new Set(results.flat(1)));
}
