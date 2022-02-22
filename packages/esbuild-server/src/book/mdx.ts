import { Plugin } from 'esbuild';

export async function createMdxPlugin (): Promise<Plugin> {
  // TODO(burdon): Figure out how to use EMS with CJS.
  const { default: plugin } = await eval('import("@mdx-js/esbuild")');

  // const remarkGfm = await eval('import("remark-gfm")');
  // const highlight = await eval('import("rehype-highlight")');

  // https://mdxjs.com/packages/esbuild/#mdxoptions (same as compile).
  return plugin({
    // allowDangerousRemoteMdx: true,

    // https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    remarkPlugins: [
      // https://mdxjs.com/guides/gfm
      // Support GFM features such as autolink literals, footnotes, strikethrough, tables, and task lists.
      // remarkGfm,

      // TODO(burdon): No effect. Configure for code blocks?
      // highlight
    ],

    // Required to support MDXProvider (i.e., custom components).
    // TODO(burdon): Creates external dependency error:
    //   Could not resolve "@mdx-js/react" (mark it as external to exclude it from the bundle)
    providerImportSource: '@mdx-js/react'
  });
}
