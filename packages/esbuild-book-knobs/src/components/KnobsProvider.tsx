//
// Copyright 2022 DXOS.org
//

import React, { ReactNode, useState } from 'react';

import { KnobsContext } from '../context';
import { KnobInstance } from '../types';

export interface KnobsProviderProps {
  children?: ReactNode
}

/**
 * Root container for knobs.
 * NOTE: Hooks must be called by child components.
 */
export const KnobsProvider = ({ children }: KnobsProviderProps) => {
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
