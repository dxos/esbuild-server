//
// Copyright 2022 DXOS.org
//

import React, { ReactNode } from 'react';

import { Knobs, KnobsProvider, useBoolean, useButton, useNumber, useSelect } from '../src';

export default {
  title: '@esbuild-book-knobs/KnobsProvider'
};

const Story = () => {
  useButton('Test', () => {}); // TODO(burdon): Reset option.

  const select = useSelect('Select', { foo: 1, bar: 2 });
  const number = useNumber('Number', { min: 0, max: 100, step: 10 });
  const boolean1 = useBoolean('Boolean 1', true);
  const boolean2 = useBoolean('Boolean 2');

  return (
    <div>
      <table>
        <tbody>
        <tr>
          <td>select</td>
          <td>{String(select)}</td>
        </tr>
        <tr>
          <td>number</td>
          <td>{number}</td>
        </tr>
        <tr>
          <td>boolean 1</td>
          <td>{String(boolean1)}</td>
        </tr>
        <tr>
          <td>boolean 2</td>
          <td>{String(boolean2)}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

const Root = ({ children, vertical = false }: { children: ReactNode, vertical?: boolean }) => (
  <div style={{
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }}>
    {children}
  </div>
);

export const Vertical = () => {
  return (
    <KnobsProvider>
      <Root>
        <div style={{ flex: 1 }}>
          <Story />
        </div>

        <Knobs />
      </Root>
    </KnobsProvider>
  );
};

export const Horizontal = () => {
  return (
    <KnobsProvider>
      <Root vertical>
        <div style={{ flex: 1 }}>
          <Story />
        </div>

        <Knobs horizontal />
      </Root>
    </KnobsProvider>
  );
};

export const Floating = () => {
  return (
    <KnobsProvider>
      <Root>
        <Story />
      </Root>

      <Knobs floating />
    </KnobsProvider>
  );
};
