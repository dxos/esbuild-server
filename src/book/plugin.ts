import { Plugin } from 'esbuild';
import fs from 'fs';
import { join } from 'path/posix';

import { compileMdx } from './mdx';

export function createBookPlugin(
  projectRoot: string,
  packageRoot: string,
  files: string[],
  options: any = {}
): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, async () => {
        // Load source file.
        const source = (file: string) => JSON.stringify(fs.readFileSync(file, 'utf-8'));

        // Process README MDX file.
        // TODO(burdon): Create MDX files for each story?
        // TODO(burdon): Is this the right location (e.g., for static build?)
        const output = join(__dirname, 'mdx');
        const readme = await compileMdx(join(projectRoot, 'README.md'), output);

        // Create contents for main function.
        return {
          resolveDir: __dirname,
          contents: `
            import { uiMain } from '${join(packageRoot, 'src/book/ui/main.tsx')}';

            // Import the compiled README file.
            const Component = require('${readme}');
             
            const modules = {
              ${files.map(file => `'${file}': { module: require('${file}'), source: ${source(file)} }`).join(',')}
            };

            const spec = {
              basePath: '${process.cwd()}',
              readme: Component.default,
              modules
            };
  
            uiMain(spec, ${JSON.stringify(options)});
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
