import { Plugin } from 'esbuild';
import fs from 'fs';
import { join } from 'path/posix';

export function createBookPlugin(
  files: string[], packageRoot: string, projectRoot: string, options: any  = {}
): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => {
        const source = (file: string) => JSON.stringify(fs.readFileSync(file, 'utf-8'));

        return {
          resolveDir: __dirname,
          contents: `
            import { uiMain } from '${join(packageRoot, 'src/book/ui/main.tsx')}';
  
            const storyModules = {
              ${files.map(file => `'${file}': { module: require('${file}'), source: ${source(file)} }`).join(',')}
            };
  
            uiMain({
              storyModules,
              basePath: '${process.cwd()}', 
            }, ${JSON.stringify(options)});
          `
        };
      });

      // Map our own react to the client one.
      let reactResolved: string;
      onStart(() => {
        reactResolved = require.resolve('react', { paths: [projectRoot] })
      })

      onResolve({ filter: /^react$/ }, () => ({ path: reactResolved }));
    }
  }
}
