import { MDXComponents } from 'mdx/types';
import React, { ReactNode, Suspense, lazy } from 'react';
import { ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

// https://mdxjs.com/packages/react
// https://mdxjs.com/table-of-components
const components: MDXComponents = {
  pre: (props) => <pre {...props} style={{ padding: 10, backgroundColor: '#EEE' }} />,

  // TODO(burdon): Custom tags not working (unless imported).
  TestComponent: ({ label }: { label?: string }) => {
    return (
      <div>[==={label}===]</div>
    );
  }
};

// https://github.com/system-ui/theme-ui
// https://theme-ui.com/mdx-components
// https://theme-ui.com/guides/how-it-works
const theme = {
  fonts: {
    heading: 'cursive'
  },
  styles: {
    h1: { // TODO(burdon): Not working.
      color: 'red',
      fontSize: 32,
      fontFamily: 'heading'
    },
  },
  colors: {
    background: '#fafafa'
  }
};

export interface PageProps {
  children: ReactNode
}

export const Page = ({ children }: PageProps) => {
  // TODO(burdon): Colorize code blocks?
  // TODO(burdon): Embedded story components?
  return (
    <div style={{
      width: '100%',
      overflow: 'auto',
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

/**
 * Dynamically load MDX file via esbuild mdx plugin.
 *
 * https://mdxjs.com/packages/esbuild/#mdxoptions
 * https://reactjs.org/docs/code-splitting.html#reactlazy
 */
export const Wrapper = ({ path }: { path: string }) => {
  // Path must be static.
  const OtherComponent = lazy(() => import('../../../../README.md'));

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
