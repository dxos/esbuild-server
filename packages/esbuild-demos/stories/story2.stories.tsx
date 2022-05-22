//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'examples/story-2'
};

const value: [size: number, color: string][] = [
  [80, 'orange'],
  [160, 'seagreen'],
  [320, 'lightblue']
];

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: 80 }}>
    {value.map(([size, color], i) => (
      <div key={i} style={{ margin: 16 }}>
        <TestComponent
          label={color}
          color={color}
          size={size}
        />
      </div>
    ))}
  </div>
);
