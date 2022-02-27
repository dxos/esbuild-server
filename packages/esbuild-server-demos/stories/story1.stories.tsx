//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'examples/story-1'
};

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: 80 }}>
    <TestComponent label='Primary' />
  </div>
);

export const Secondary = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: 80 }}>
    <TestComponent size={120} color='orange' label='Secondary' />
  </div>
);
