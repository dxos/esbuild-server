import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'examples/story-2'
};

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: 80 }}>
    {[100, 200, 300].map((size) => (
      <TestComponent size={size} label='Primary' />
    ))}
  </div>
);
