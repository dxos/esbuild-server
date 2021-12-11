//
// Copyright 2021 DXOS.org
//

import React, { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';

export interface PageProps {
  children: ReactNode
}

export const Page = ({ children }: PageProps) => {
  // TODO(burdon): Style.
  //   https://mdxjs.com/packages/react
  //   https://mdxjs.com/table-of-components
  //   https://github.com/system-ui/theme-ui
  //     https://theme-ui.com/mdx-components
  //     https://theme-ui.com/guides/how-it-works
  // TODO(burdon): Embedded story components?
  // TODO(burdon): Colorize snippets?
  return (
    <div style={{
      padding: '0 32px'
    }}>
      <MDXProvider components={{
        h1: 'h2',
        pre: (props) => <pre {...props} style={{ padding: 10, backgroundColor: '#EEE' }} />
      }}>
        {children}
      </MDXProvider>
    </div>
  );
};
