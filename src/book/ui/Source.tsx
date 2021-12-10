//
// Copyright 2021 DXOS.org
//

import React from 'react';

export interface SourceProps {
  source: string
}

export const Source = ({ source }: SourceProps) => {
  return (
    <pre>
      {source}
    </pre>
  );
};
