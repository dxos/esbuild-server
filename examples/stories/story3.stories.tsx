import React from 'react';

import { TestComponent } from '../src';

export default {
  title: 'more-examples/story-3'
};

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'space-around', margin: 80 }}>
    {[40, 80, 120, 80, 40].map((size, i) => (
      <TestComponent key={i} size={size} label={String(size)} />
    ))}
  </div>
);
