import { serve } from 'esbuild'
import { join, resolve } from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import glob from 'glob'
import { promisify } from 'util'

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


      await serve({
        servedir: join(__dirname, 'ui/public'),
        port: 8080,
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

                const stories = {
                  ${files.map(file => `"${file}": require("${file}")`).join(',')}
                };
    
                uiMain(stories)
              `
            }))
          }
        }],
        metafile: true,
      })
    
      console.log('🚀 Listening on http://localhost:8080')
    }
  )
  .demandCommand()
  .argv

async function resolveFiles (globs: string[]): Promise<string[]> {
  const results = await Promise.all(globs.map(pattern => promisify(glob)(pattern)));
  return Array.from(new Set(results.flat(1)));
}
