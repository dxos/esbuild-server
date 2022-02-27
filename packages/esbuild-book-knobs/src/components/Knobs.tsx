//
// Copyright 2018 DXOS.org
//

import { css } from '@emotion/css';
import clsx from 'clsx';
import React, { MutableRefObject, forwardRef } from 'react';

import { useKnobsContext, useKnobValue } from '../hooks';
import { ButtonOptions, NumberOptions, SelectOptions, range, BooleanOptions, KnobType, Options } from '../types';

const styles = {
  defaults: css`
    display: flex;

    padding: 8px;
    background: #F5F5F5;

    input, select {
      outline: none;
    }
    
    label {    
      font-variant: all-petite-caps;
    }

    .knob {
      display: flex;
    }
  `,

  floating: css`
    position: absolute;
    right: 8px;
    top: 8px;

    border: 1px solid #CCC;
  `,

  horizontal: css`
    flex-direction: row;
    align-items: cetner;

    border-top: 1px solid #CCC;
    border-bottom: 1px solid #CCC;

    .knob {
      margin-right: 8px;
    }
    
    label {
      margin-right: 8px;
    }
  `,

  vertical: css`
    flex-direction: column;

    border-left: 1px solid #CCC;
    border-right: 1px solid #CCC;

    .knob {
      margin-bottom: 8px;
    }
  
    label {
      width: 100px;
      overflow: hidden;
      text-align: right;
      margin-right: 8px;
    }      
  `
};

interface KnobProps<T extends Options> {
  id: string
  horizontal?: boolean
  options: T
}

const ButtonKnob = ({
  horizontal,
  options: { label, onClick }
}: KnobProps<ButtonOptions>) => {
  return (
    <div className='knob'>
      {!horizontal && (
        <label />
      )}
      <button onClick={onClick}>
        {label}
      </button>
    </div>
  );
};

const BooleanKnob = ({ id, options: { label } }: KnobProps<BooleanOptions>) => {
  const [value, setValue] = useKnobValue<boolean>(id);

  return (
    <div className='knob'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type='checkbox'
        checked={value}
        onChange={event => setValue(event.target.checked)}
      />
    </div>
  );
};

const NumberKnob = ({ id, options: { label, range: { min, max, step = 1 } } }: KnobProps<NumberOptions>) => {
  const [value, setValue] = useKnobValue<number>(id);

  return (
    <div className='knob'>
      <label>{label}</label>
      <select
        value={value}
        onChange={event => setValue(event.target.value !== '' ? parseInt(event.target.value) : undefined)}
      >
        {[...range(min, max, step)].map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

const SelectKnob = ({ id, options: { label, values } }: KnobProps<SelectOptions>) => {
  const [value, setValue] = useKnobValue<string>(id);

  return (
    <div className='knob'>
      <label>{label}</label>
      <select
        value={value ?? ''}
        onChange={event => setValue(event.target.value)}
      >
        <option value=''>Default</option>
        {Object.keys(values).map(key => (
          <option key={key} value={values[key]}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export interface KnobsProps {
  className?: string
  horizontal?: boolean
  floating?: boolean
}

export const Knobs = forwardRef<HTMLDivElement, KnobsProps>(({
  className,
  horizontal = false,
  floating = false
}: KnobsProps, ref: MutableRefObject<HTMLDivElement>) => {
  const { knobs } = useKnobsContext();

  return (
    <div
      ref={ref}
      className={clsx(
        styles.defaults,
        floating && styles.floating,
        horizontal ? styles.horizontal : styles.vertical,
        className
      )}
    >
      {knobs.map(({ id, type, options }) => {
        switch (type) {
          case KnobType.Button: {
            return (
              <ButtonKnob
                key={id}
                id={id}
                options={options as ButtonOptions}
                horizontal={horizontal}
              />
            );
          }

          case KnobType.Select: {
            return (
              <SelectKnob
                key={id}
                id={id}
                options={options as SelectOptions}
              />
            );
          }

          case KnobType.Boolean: {
            return (
              <BooleanKnob
                key={id}
                id={id}
                options={options as BooleanOptions}
              />
            );
          }

          case KnobType.Number: {
            return (
              <NumberKnob
                key={id}
                id={id}
                options={options as NumberOptions}
              />
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
});
