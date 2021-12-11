//
// Copyright 2021 DXOS.org
//

import React from 'react';

export interface PageProps {
  children?: string
}

export const Page = ({ children }: PageProps) => {
  return (
    <>
      {children}
    </>
  );
};
