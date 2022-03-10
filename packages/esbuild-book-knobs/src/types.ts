//
// Copyright 2018 DXOS.org
//

export type SelectMap = { [index: string]: any }

export type NumberRange = { min: number, max: number, step?: number }

export function * range (min: number, max: number, step = 1): Generator<number> {
  yield min;
  if (min >= max) {
    return;
  }

  yield * range(parseFloat(Number(min + step).toPrecision(10)), max, step);
}

export enum KnobType {
  Button,
  Select,
  Boolean,
  Number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Options {}

export interface ButtonOptions extends Options {
  label: string
  onClick: () => void
}

export interface SelectOptions extends Options {
  label: string
  values: SelectMap
}

export interface BooleanOptions extends Options {
  label: string
}

export interface NumberOptions extends Options {
  label: string
  range: NumberRange
}

export type KnobInstance = {
  id: string
  type: KnobType
  options: Options
  setValue: (value: any) => void
  onUpdate?: (value: any) => void
  defaultValue?: any
}
