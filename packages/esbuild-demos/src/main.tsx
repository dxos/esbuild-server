//
// Copyright 2018 DXOS.org
//

import React from 'react';
import { render } from 'react-dom';

import { TestComponent } from './TestComponent';

const App = () => {
  return (
    <>
      <h1>Hello World!</h1>
      <p>Custom Component</p>
      <TestComponent />
    </>
  );
};

render(<App />, document.getElementById('root'));
