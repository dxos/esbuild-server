import { serve } from 'esbuild'
import { join, resolve } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import glob from 'glob'
import { promisify } from 'util'
import http, { IncomingMessage, ServerResponse } from 'http'
import { RequestOptions } from 'https'

interface DevCommandArgv {
  stories: string[]
  port: number
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
      }),
    async argv => {
      const files = (await resolveFiles(argv.stories)).map(file => resolve(file))

      console.log(`🔎 Found ${files.length} files with stories`)


      const serveResult = await serve({
        servedir: join(__dirname, 'ui/public'),
      }, {
        entryPoints: {
          'index': 'entrypoint'
        },
        bundle: true,
        platform: 'browser',
        format: 'iife',
        plugins: [{
          name: 'esbuild-book',
          setup: ({ onResolve, onLoad }) => {
            onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
            onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => ({
              resolveDir: __dirname,
              contents: `
                import { uiMain } from '${join(__dirname, 'ui/index.tsx')}';

                const storyModules = {
                  ${files.map(file => `"${file}": require("${file}")`).join(',')}
                };
    
                uiMain({
                  storyModules,
                  basePath: "${process.cwd()}",
                });
              `
            }))
          }
        }],
        metafile: true,
      })

      http.createServer((req, res) => {
        const options: RequestOptions = {
          hostname: serveResult.host,
          port: serveResult.port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        }

        const proxyReq = http.request(options, proxyRes => {
          if (proxyRes.statusCode === 404) {
            const options: RequestOptions = {
              hostname: serveResult.host,
              port: serveResult.port,
              path: '/',
              method: 'GET',
            }
            const proxyReq = http.request(options, proxyRes => {
              res.writeHead(proxyRes.statusCode!, proxyRes.headers);
              proxyRes.pipe(res, { end: true });
            })
            proxyReq.end()
          } else {
            // Otherwise, forward the response from esbuild to the client
            res.writeHead(proxyRes.statusCode!, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          }
        });

        // Forward the body of the request to esbuild
        req.pipe(proxyReq, { end: true });
      }).listen(argv.port);
      
      console.log('🚀 Listening on http://localhost:8080')
    }
  )
  .demandCommand()
  .argv

async function resolveFiles (globs: string[]): Promise<string[]> {
  const results = await Promise.all(globs.map(pattern => promisify(glob)(pattern)));
  return Array.from(new Set(results.flat(1)));
}
