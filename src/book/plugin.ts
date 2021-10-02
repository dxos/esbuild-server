import { Plugin } from "esbuild";
import { join } from "path/posix";

export function createBookPlugin(files: string[], packageRoot: string, projectRoot: string): Plugin {
  return {
    name: 'esapp-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esapp-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esapp-book', filter: /^entrypoint$/ }, () => ({
        resolveDir: __dirname,
        contents: `
                import { uiMain } from '${join(packageRoot, 'src/book/ui/index.tsx')}';

                const storyModules = {
                  ${files.map(file => `"${file}": require("${file}")`).join(',')}
                };
    
                uiMain({
                  storyModules,
                  basePath: "${process.cwd()}",
                });
              `
      }))

      // Map our own react to the client one      
      let reactResolved: string;
      onStart(() => {
        reactResolved = require.resolve('react', { paths: [projectRoot] })
      })

      onResolve({ filter: /^react$/ }, () => ({ path: reactResolved }));
    }
  }
}
