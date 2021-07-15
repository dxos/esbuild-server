import { serve } from 'esbuild'
import { join } from 'path'

async function main() {
  await serve({
    servedir: join(__dirname, 'ui/public'),
    port: 8080
  }, {
    entryPoints: [join(__dirname, 'ui/index.tsx')],
    bundle: true,
    platform: 'browser',
    format: 'iife'
  })

  console.log('Listening on http://localhost:8080')
}

main()
