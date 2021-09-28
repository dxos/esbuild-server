import { serve } from 'esbuild'
import { join } from 'path'

async function main() {
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

            uiMain(require('${join(__dirname, 'test/story.tsx')}'))
          `
        }))
      }
    }],
    metafile: true,
  })

  console.log('Listening on http://localhost:8080')
}

main()
