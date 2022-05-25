//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'examples/story-3'
};

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'space-around', margin: 80 }}>
    {[40, 80, 120, 80, 40].map((size, i) => (
      <div key={i}>
        <TestComponent size={size} label={String(size)} />
      </div>
    ))}
  </div>
);
