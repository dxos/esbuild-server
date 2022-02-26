//
// Copyright 2018 DXOS.org
//

import React, { createContext, useContext, useEffect, useState } from 'react';

import { Boolean, Button, Number, NumberRange, Select, SelectMap } from './types';

export type KnobDef = [type: string, options: any]

export const KnobContext = createContext(undefined);

//
// Hooks
//

export const useKnobs = () => {
  return useContext(KnobContext);
};

export const useButton = (label: string, onClick: () => void) => {
  const [, addKnob] = useKnobs();
  useEffect(() => {
    addKnob('button', { label, onClick } as Button)
  }, []);
};

export const useSelect = (label: string, values: SelectMap, defaultValue = undefined) => {
  const [, addKnob] = useKnobs();
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    addKnob('select', { label, values, defaultValue, onChange: value => setValue(value)} as Select)
  }, []);

  return value;
};

export const useBoolean = (label: string, defaultValue = false) => {
  const [, addKnob] = useKnobs();
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    addKnob('boolean', { label, defaultValue, onChange: value => setValue(value)} as Boolean)
  }, []);

  return value;
};

export const useNumber = (label: string, range: NumberRange, defaultValue: number = undefined): number => {
  const [, addKnob] = useKnobs();
  const [value, setValue] = useState(defaultValue ?? range.min);
  useEffect(() => {
    addKnob('number', { label, range, defaultValue, onChange: (value: number) => setValue(value)} as Number)
  }, []);

  return value;
};
