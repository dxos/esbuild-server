//
// Copyright 2022 DXOS.org
//

import React, { ReactNode, useState } from 'react';

import { KnobsContext } from '../context';
import { KnobInstance } from '../types';

/**
 * Root container for knobs.
 * NOTE: Hooks must be called by child components.
 */
export const KnobsProvider = ({ children }: { children: ReactNode }) => {
  const [knobs, setKnobs] = useState<KnobInstance[]>([]);
  const addKnob = (knob: KnobInstance) => {
    setKnobs(knobs => [...knobs, knob]);
  };

  return (
    <KnobsContext.Provider value={{ knobs, addKnob }}>
      {children}
    </KnobsContext.Provider>
  );
};
