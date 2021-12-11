import { Plugin } from 'esbuild';
import fs from 'fs';
import { join } from 'path/posix';

import remarkGfm from 'remark-gfm';
// import mdx from '@mdx-js/mdx';
console.log(':::', remarkGfm);

export function createBookPlugin(
  files: string[],
  packageRoot: string,
  projectRoot: string,
  options: any = {}
): Plugin {
  return {
    name: 'esbuild-book',
    setup: ({ onResolve, onLoad, onStart }) => {
      onResolve({ filter: /^entrypoint$/ }, () => ({ namespace: 'esbuild-book', path: 'entrypoint' }))
      onLoad({ namespace: 'esbuild-book', filter: /^entrypoint$/ }, async () => {
        // Load source file.
        const source = (file: string) => JSON.stringify(fs.readFileSync(file, 'utf-8'));

        // TODO(burdon): Factor out.
        // Load README (and process as MDX).
        // https://mdxjs.com/guides/gfm
        // https://www.npmjs.com/package/@mdx-js/mdx
        // https://mdxjs.com
        let readme = undefined;
        const readmePath = join(projectRoot, 'README.md');
        if (fs.existsSync(readmePath)) {
          const content = readme = fs.readFileSync(readmePath, 'utf-8');
          // readme = await mdx(content, { remarkPlugins: [remarkGfm] });
        }

        // Create contents for main function.
        return {
          resolveDir: __dirname,
          contents: `
            import { uiMain } from '${join(packageRoot, 'src/book/ui/main.tsx')}';
  
            const modules = {
              ${files.map(file => `'${file}': { module: require('${file}'), source: ${source(file)} }`).join(',')}
            };

            const spec = {
              basePath: '${process.cwd()}',
              readme: ${JSON.stringify(readme)},
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
