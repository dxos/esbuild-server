import React from 'react';
import { render } from 'react-dom';
import { TestComponent } from './TestComponent';

const App = () => {
  return (
    <>
      <h1>Hello world</h1>
      <p>Custom Component:</p>
      <TestComponent />
    </>
  );
};

render(<App />, document.getElementById('root'));
