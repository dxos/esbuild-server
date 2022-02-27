//
// Copyright 2018 DXOS.org
//

import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { KnobsContext } from './context';

import {
  BooleanOptions,
  ButtonOptions, KnobInstance,
  KnobType,
  NumberOptions,
  NumberRange,
  Options,
  SelectMap,
  SelectOptions,
} from './types';

export const useKnobsContext = () => {
  return useContext(KnobsContext);
};

/**
 * Reset all values.
 */
export const useReset = () => {
  const { knobs } = useKnobsContext();
  const knobsRef = useRef(knobs);
  useEffect(() => { knobsRef.current = knobs }, [knobs]);

  return () => {
    knobsRef.current.forEach(({ setValue, defaultValue }) => setValue(defaultValue));
  };
};

/**
 * Get value subscription.
 * @param id
 */
export const useKnobValue = <T extends any> (id: string): [T, (value: T) => void] => {
  const { knobs } = useKnobsContext();
  const knob = useMemo(() => knobs.find(knob => knob.id === id), []);
  const [value, setValue] = useState<T>(knob.defaultValue);
  useEffect(() => {
    // Callback.
    knob.onUpdate = (value: T) => setValue(value);
  }, [knob]);

  return [value, knob.setValue];
};

/**
 * Create a knob instance.
 * @param type
 * @param options
 * @param defaultValue
 */
export const useKnob = <T extends Options, R> (type: KnobType, options: T, defaultValue?: R) => {
  const { addKnob } = useKnobsContext();
  const id = useMemo(() => String(Math.random()), []);
  const [value, setValue] = useState<R>(defaultValue);
  useEffect(() => {
    const updateValue = (value: R) => {
      setValue(value);

      // Update control.
      knob.onUpdate?.(value);
    };

    const knob: KnobInstance = { id, type, options, setValue: updateValue, defaultValue };
    addKnob(knob);
  }, []);

  return value;
}

//
// Type-specific knobs.
//

export const useButton = (label: string, onClick: () => void) => {
  useKnob<ButtonOptions, void>(KnobType.Button, { label, onClick });
};

export const useBoolean = (label: string, defaultValue = false): boolean => {
  return useKnob<BooleanOptions, boolean>(KnobType.Boolean, { label }, defaultValue);
};

export const useNumber = (label: string, range: NumberRange, defaultValue: number = undefined): number => {
  return useKnob<NumberOptions, number>(KnobType.Number, { label, range }, defaultValue ?? range.min);
};

export const useSelect = (label: string, values: SelectMap, defaultValue = undefined): string => {
  return useKnob<SelectOptions, string>(KnobType.Select, { label, values }, defaultValue);
};
