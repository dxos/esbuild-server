import { MDXComponents } from 'mdx/types';
import React, { ReactChildren, ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import styled  from 'styled-components';
import { ThemeProvider } from '@emotion/react';
import { MDXProvider } from '@mdx-js/react';

// TODO(burdon): Syntax highlighting.
// TODO(burdon): Custom collapsible code block (see Mui).
// TODO(burdon): Apply theme-ui consistently across app (sidebar, code, pages, etc.)
// TODO(burdon): Avoid material? Style components vs. emotion vs. @jsxImportSource theme-ui

const Pre = styled.pre`
  width: 100%;
  margin: 16px 0;
  padding: 12px 10px;
  font-size: 16px;
  background-color: #EEE;
`;

const CodeBlock = styled.div`
  display: 'flex';
  border: 8px solid grey;
  pre { // NOTE: Cannot do nested rules as inline styles.
    margin: 0;
  }
`;

// TODO(burdon): Not working externally.
// TODO(burdon): Factor out.
// https://mdxjs.com/packages/react
// https://mdxjs.com/table-of-components
const components: MDXComponents = {
  pre: ({ children }: { children?: ReactNode }) => (
    <Pre>{children}</Pre>
  ),

  // TODO(burdon): Remove (testing).
  CodeBlock: ({ children }: { children?: ReactChildren }) => {
    return (
      <CodeBlock>
        {children}
      </CodeBlock>
    )
  },

  // TODO(burdon): Remove (testing).
  Blink: ({ children, ...props }: { children?: ReactChildren }) => {
    const [_, setCount] = useState(10);
    const [on, setOn] = useState(true);
    useEffect(() => {
      const t = setInterval(() => {
        setOn(on => !on);
        setCount(count => {
          if (count <= 0) {
            setOn(true);
            clearInterval(t);
          }
          return count - 1;
        });
      }, 500);

      return () => clearInterval(t);
    }, []);

    return (
      <span style={{ opacity: on ? 1 : 0.5, ...props}}>
        {children}
      </span>
    );
  }
};

// TODO(burdon): Factor out.
// https://github.com/system-ui/theme-ui
// https://theme-ui.com/theme-spec
// https://theme-ui.com/mdx-components
// https://theme-ui.com/guides/how-it-works
const theme = {
  colors: {
    background: '#fafafa',
    heading: '#222',
    body: '#333'
  },
  fonts: {
    body: 'system-ui, sans-serif',
    monospace: 'Menlo, monospace'
  },
  styles: {
    root: {
      color: 'body',
      fontFamily: 'body',
      fontWeight: 100
    },
    h1: { // TODO(burdon): Only shows up externally.
      color: 'heading',
      fontSize: 32,
      fontWeight: 100
    }
  }
};

export interface PageProps {
  children: ReactNode
}

export const PageContainer = ({ children }: PageProps) => {
  return (
    <div style={{
      width: '100%',
      overflow: 'auto',
      padding: '0 32px'
    }}>
      <ThemeProvider theme={theme}>
        <MDXProvider components={components}>
          {children}
        </MDXProvider>
      </ThemeProvider>
    </div>
  );
};

/**
 * Dynamically load MDX file via esbuild mdx plugin.
 *
 * https://mdxjs.com/packages/esbuild/#mdxoptions
 * https://reactjs.org/docs/code-splitting.html#reactlazy
 */
// TODO(burdon): Experimental -- remove.
export const Wrapper = ({ path }: { path: string }) => {
  // Imported dynamically but path must be static.
  // Compiled using mdx esbuild plugin.
  const LazyComponent = lazy(() => import('../../../../README.md'));

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
};
