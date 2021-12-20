import { Plugin } from 'esbuild';
import fs from 'fs';
import { join } from 'path/posix';

export function createBookPlugin(
  projectRoot: string,
  packageRoot: string,
  pages: string[],
  files: string[],
  options: any = {}
): Plugin {
  const { mdx } = options;

  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => {
        // Load source file.
        const readSource = (file: string) => JSON.stringify(fs.readFileSync(file, 'utf-8'));

        // Create contents for main function.
        return {
          resolveDir: __dirname,
          contents: `
            import { uiMain } from '${join(packageRoot, 'src/book/ui/main.tsx')}';

            // MDX Pages.
            const pages = ${mdx} ? [
              ['${join(projectRoot, 'README.md')}', require('${join(projectRoot, 'README.md')}').default],
              ${pages.map(page => `['${page}', require('${page}').default]`).join(',')}
            ]: [];

            // Dynamically import stories with sources.
            const modules = {
              ${files.map(file => `'${file}': { 
                module: require('${file}'), 
                source: ${readSource(file)} 
              }`).join(',')}
            };

            const spec = {
              basePath: '${process.cwd()}',
              pages,
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
