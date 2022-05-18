//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'examples/story-2'
};

const value: [size: number, color: string][] = [[100, 'orange'], [200, 'seagreen'], [300, 'lightblue']];

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: 80 }}>
    {value.map(([size, color], i) => (
      <div key={i} style={{ margin: 8 }}>
        <TestComponent label={color} color={color} size={size} />
      </div>
    ))}
  </div>
);
