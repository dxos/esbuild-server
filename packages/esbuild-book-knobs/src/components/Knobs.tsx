//
// Copyright 2018 DXOS.org
//

import { css } from '@emotion/css';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

import { useKnobsContext, useKnobValue } from '../hooks';
import { ButtonOptions, NumberOptions, SelectOptions, range, BooleanOptions, KnobType, Options } from '../types';

const styles = {
  defaults: css`
    display: flex;

    padding: 8px;
    background-color: #F5F5F5;

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

  horizontal: css`
    flex-direction: row;
    align-items: center;

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
  `,

  floating: {
    default: css`
      position: absolute;
      border: 1px solid #CCC;
    `,
    'top-left': css`
      left: 8px;
      top: 8px;
    `,
    'top-right': css`
      right: 8px;
      top: 8px;
    `,
    'bottom-left': css`
      left: 8px;
      bottom: 8px;
    `,
    'bottom-right': css`
      right: 8px;
      bottom: 8px;
    `
  }
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
  const [value, setValue] = useKnobValue<number | undefined>(id);

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
  const [value, setValue] = useKnobValue<any>(id);

  return (
    <div className='knob'>
      <label>{label}</label>
      <select
        value={value ?? ''}
        onChange={event => setValue(event.target.value)}
      >
        <option value=''>Default</option>
        {Object.keys(values).map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface KnobsProps {
  className?: string
  horizontal?: boolean
  floating?: Position
}

export const Knobs = forwardRef<HTMLDivElement, KnobsProps>(({
  className,
  horizontal = false,
  floating
}: KnobsProps, ref) => {
  const { knobs } = useKnobsContext();

  return (
    <div
      ref={ref}
      className={clsx(
        styles.defaults,
        floating && [styles.floating.default, styles.floating[floating]],
        horizontal ? styles.horizontal : styles.vertical,
        className
      )}
    >
      {knobs.map(({ id, type, options }) => {
        switch (type) {
          case KnobType.Button: {
            return (
              <div key={id}>
                <ButtonKnob
                  id={id}
                  options={options as ButtonOptions}
                  horizontal={horizontal}
                />
              </div>
            );
          }

          case KnobType.Select: {
            return (
              <div key={id}>
                <SelectKnob
                  id={id}
                  options={options as SelectOptions}
                />
              </div>
            );
          }

          case KnobType.Boolean: {
            return (
              <div key={id}>
                <BooleanKnob
                  id={id}
                  options={options as BooleanOptions}
                />
              </div>
            );
          }

          case KnobType.Number: {
            return (
              <div key={id}>
                <NumberKnob
                  id={id}
                  options={options as NumberOptions}
                />
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
});
