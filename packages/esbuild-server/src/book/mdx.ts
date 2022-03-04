//
// Copyright 2022 DXOS.org
//

import { Plugin } from 'esbuild';

/**
 * https://esbuild.github.io/plugins
 */
export async function createMdxPlugin (): Promise<Plugin> {
  // TODO(burdon): Figure out how to use EMS with CJS.
  // eslint-disable-next-line no-eval
  const { default: plugin } = await eval('import("@mdx-js/esbuild")');

  // TODO(burdon): Syntax highlighting.
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
      // highlight
    ],

    // Required to support MDXProvider (i.e., custom components).
    providerImportSource: '@mdx-js/react'
  });
}
