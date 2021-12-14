import { Plugin } from 'esbuild';

export async function createMdxPlugin (): Promise<Plugin> {
  // TODO(burdon): Figure out how to use EMS with CJS.
  const { default: mdx } = await eval('import("@mdx-js/esbuild")');
  const remarkGfm = await eval('import("remark-gfm")');
  // const highlight = await eval('import("rehype-highlight")');

  // https://mdxjs.com/packages/esbuild/#mdxoptions
  return mdx({
    // allowDangerousRemoteMdx: true,

    // https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    remarkPlugins: [
      // Support GFM features such as autolink literals, footnotes, strikethrough, tables, and task lists.
      // https://mdxjs.com/guides/gfm
      remarkGfm,

      // TODO(burdon): No effect. Configure for code blocks?
      // highlight
    ],

    providerImportSource: '@mdx-js/react' // Support MDXProvider.
  });
}
