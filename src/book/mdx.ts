import fs from 'fs';
import { join } from 'path/posix';

/**
 * Compiles MDX file into a React component.
 * https://mdxjs.com
 * https://www.npmjs.com/package/@mdx-js/mdx
 * @param path
 * @param dir
 */
export async function compileMdx (path: string, dir: string): Promise<string | undefined> {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf-8');

    // TODO(burdon): Investigate esbuild MDX plugin: https://mdxjs.com/packages/esbuild

    // TODO(burdon): Figure out how to use EMS with CJS.
    const { compile } = await eval('import("@mdx-js/mdx")');
    const remarkGfm = await eval('import("remark-gfm")');
    const highlight = await eval('import("rehype-highlight")');

    // https://mdxjs.com/packages/mdx/#compilefile-options
    // https://mdxjs.com/guides/gfm
    // https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    // Support GFM features such as autolink literals, footnotes, strikethrough, tables, and task lists.
    const compiled = await compile(content, {
      remarkPlugins: [
        remarkGfm,
        highlight // TODO(burdon): No effect. Configure for code blocks?
      ],
      providerImportSource: '@mdx-js/react' // Support MDXProvider.
    });

    const filename = join(dir, 'Readme.js');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(filename, String(compiled));

    return filename;
  }
}
