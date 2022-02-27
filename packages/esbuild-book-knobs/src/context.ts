//
// Copyright 2022 DXOS.org
//

import { createContext } from 'react';

import { KnobInstance } from './types';

type KnobContextDef = {
  knobs: KnobInstance[]
  addKnob: (knob: KnobInstance) => void
}

export const KnobsContext = createContext<KnobContextDef>(undefined);
