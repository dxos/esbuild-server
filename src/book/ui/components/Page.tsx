//
// Copyright 2021 DXOS.org
//

import { MDXComponents } from 'mdx/types';
import React, { ReactNode } from 'react';
import { ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

// https://github.com/system-ui/theme-ui
// https://theme-ui.com/mdx-components
// https://theme-ui.com/guides/how-it-works
const theme = {
  colors: {
    background: '#fafafa'
  }
};

// https://mdxjs.com/packages/react
// https://mdxjs.com/table-of-components
const components: MDXComponents = {
  h1: 'h2',
  pre: (props) => <pre {...props} style={{ padding: 10, backgroundColor: '#EEE' }} />
};

export interface PageProps {
  children: ReactNode
}

export const Page = ({ children }: PageProps) => {
  // TODO(burdon): Colorize code blocks?
  // TODO(burdon): Embedded story components?
  return (
    <div style={{
      padding: '0 32px'
    }}>
      <MDXProvider components={components}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </MDXProvider>
    </div>
  );
};
