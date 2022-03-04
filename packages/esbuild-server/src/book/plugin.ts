//
// Copyright 2022 DXOS.org
//

import { Plugin } from 'esbuild';
import fs from 'fs';
import { join } from 'path/posix';

// UX entrypoint.
const main = 'src/book/ui/main.tsx';

/**
 * https://esbuild.github.io/plugins
 */
export function createBookPlugin (
  projectRoot: string,
  packageRoot: string,
  pages: string[],
  stories: string[],
  options: any = {}
): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }));
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, () => {
        // Load source file.
        const readSource = (file: string) => JSON.stringify(fs.readFileSync(file, 'utf-8'));

        // Create contents for main function.
        return {
          resolveDir: __dirname,
          contents: `
            import { main } from '${join(packageRoot, main)}';

            // MDX Pages.
            const pages = [
              ${pages.map(file => `{
                path: '${file}', 
                page: require('${file}').default // Uses MDX plugin if configured.
              }`).join(',')}
            ];

            // Dynamically import stories with sources.
            const stories = [
              ${stories.map(file => `{
                path: '${file}',
                module: require('${file}'), 
                source: ${readSource(file)} 
              }`).join(',')}
            ];

            const spec = {
              basePath: '${process.cwd()}',
              pages,
              stories
            };

            main(spec, ${JSON.stringify(options)});
          `
        };
      });

      // Map our own esbuild-server packages instead of the client one.
      let reactResolved: string;
      let mdxReactResolved: string;
      onStart(() => {
        reactResolved = require.resolve('react', { paths: [projectRoot] });
        mdxReactResolved = require.resolve('@mdx-js/react', { paths: [projectRoot] });
      });

      onResolve({ filter: /^react$/ }, () => ({ path: reactResolved }));
      onResolve({ filter: /^@mdx-js\/react$/ }, () => {
        return { path: mdxReactResolved };
      });
    }
  };
}
