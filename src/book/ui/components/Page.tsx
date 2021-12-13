import styled  from 'styled-components';
import { MDXComponents } from 'mdx/types';
import React, { FunctionComponent, ReactChildren, ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { ThemeProvider } from 'theme-ui';
import { MDXProvider } from '@mdx-js/react';

// TODO(burdon): Syntax highlighting.
// TODO(burdon): Custom collapsible code block (see Mui).
// TODO(burdon): Apply theme-ui consistently across app (sidebar, code, pages, etc.)
// TODO(burdon): Avoid material? Style components vs. emotion vs. @jsxImportSource theme-ui

export type PageType = [page: string, component: FunctionComponent]

const Pre = styled.pre`
  width: 100%;
  margin: 16px 0;
  padding: 12px 10px;
  font-size: 16px;
  background-color: #EEE;
`

const CodeBlock = styled.div`
  display: 'flex';
  border: 8px solid grey;
  pre { // NOTE: Cannot do nested rules as inline styles.
    margin: 0;
  }
`

// TODO(burdon): Factor out.
// https://mdxjs.com/packages/react
// https://mdxjs.com/table-of-components
const components: MDXComponents = {
  h1: 'h2',

  pre: ({ children }: { children?: ReactNode }) => (
    <Pre>{children}</Pre>
  ),

  CodeBlock: ({ children }: { children?: ReactChildren }) => {
    return (
      <CodeBlock>
        {children}
      </CodeBlock>
    )
  },

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
          return count - 1
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
// https://theme-ui.com/mdx-components
// https://theme-ui.com/guides/how-it-works
const theme = {
  fonts: {
    body: 'system-ui, sans-serif'
  },
  styles: {
    root: {
      fontFamily: 'body'
    },
    h2: { // TODO(burdon): Not working.
      color: 'red',
      fontSize: 24
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
}
