//
// Copyright 2021 DXOS.org
//

import React from 'react';

export interface TestComponentProps {
  label?: string
  color?: string
  size?: number
}

export const TestComponent = ({
  label = 'TestComponent',
  color = '#EEE',
  size = 200
}: TestComponentProps) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      border: `8px solid ${color}`
    }}>
      {label}
    </div>
  );
};
