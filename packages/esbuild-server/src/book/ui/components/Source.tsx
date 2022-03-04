//
// Copyright 2022 DXOS.org
//

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// eslint-disable-next-line no-restricted-imports
import style from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import styled from 'styled-components';

import { Mode } from '../theme';

// TODO(burdon): Configure only required languages? (html, tsx, json).

const SourceContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  pre {
    display: flex;
    flex: 1;
    margin: 0 !important;
  }
  code {
    font-size: 16px !important;
  }
`;

export interface SourceProps {
  code?: string
  mode?: Mode
}

/**
 * Syntax highlighting source.
 * https://www.npmjs.com/package/react-syntax-highlighter
 * https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo
 * https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/HEAD/AVAILABLE_STYLES_PRISM.MD
 */
export const Source = ({ code = '', mode = undefined }: SourceProps) => {
  return (
    <SourceContainer>
      <SyntaxHighlighter
        showLineNumbers
        language='tsx'
        style={mode === 'dark' ? style : undefined}
      >
        {code}
      </SyntaxHighlighter>
    </SourceContainer>
  );
};
