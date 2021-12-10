import { Plugin } from 'esbuild';
import { join } from 'path/posix';

export function createBookPlugin(files: string[], packageRoot: string, projectRoot: string): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => ({
        resolveDir: __dirname,
        contents: `
          import { uiMain } from '${join(packageRoot, 'src/book/ui/index.tsx')}';

          const storyModules = {
            ${files.map(file => `'${file}': { module: require('${file}'), source: 'xxx' }`).join(',')}
          };

          uiMain({
            storyModules,
            basePath: '${process.cwd()}'
          });
        `
      }))

      // Map our own react to the client one.
      let reactResolved: string;
      onStart(() => {
        reactResolved = require.resolve('react', { paths: [projectRoot] })
      })

      onResolve({ filter: /^react$/ }, () => ({ path: reactResolved }));
    }
  }
}
