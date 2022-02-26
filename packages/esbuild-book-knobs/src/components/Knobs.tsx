//
// Copyright 2018 DXOS.org
//

import { css } from '@emotion/css';
import clsx from 'clsx';
import React, { MutableRefObject, forwardRef, useEffect, useMemo, useState } from 'react';

import { Button, Number, Select, range, Boolean } from '../types';
import { useKnobs } from '../hooks';

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

// TODO(burdon): Get values from context (support reset). Unique ID set per knob.

const BooleanKnob = ({ label, defaultValue, onChange }: Boolean) => {
  const id = useMemo(() => String(Math.random()), []);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => onChange(value), [value]);

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

const SelectionKnob = ({ label, defaultValue, values, onChange }: Select) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => onChange(value), [value]);

  return (
    <div className='knob'>
      <label>{label}</label>
      <select
        value={defaultValue}
        onChange={event => setValue(event.target.value !== '' ? values[event.target.value] : undefined)}
      >
        <option value={undefined}>Default</option>
        {Object.keys(values).map(key => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

const NumberRangeKnob = ({ label, defaultValue, range: { min, max, step = 1 }, onChange }: Number) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => onChange(value), [value]);

  return (
    <div className='knob'>
      <label>{label}</label>
      <select
        value={defaultValue}
        onChange={event => setValue(event.target.value !== '' ? parseInt(event.target.value) : defaultValue)}
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

export interface KnobsProps {
  className?: string
  horizontal?: boolean
  floating?: boolean
}

export const Knobs = forwardRef<HTMLDivElement, KnobsProps>(({
  className,
  horizontal = false,
  floating = false
}: KnobsProps,
  ref: MutableRefObject<HTMLDivElement>
) => {
  const [knobs] = useKnobs();

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
      {knobs.map(([type, options], i) => {
        switch (type) {
          case 'button': {
            const { label, onClick } = options as Button;
            return (
              <div key={i} className='knob'>
                {!horizontal && (
                  <label />
                )}
                <button onClick={onClick}>
                  {label}
                </button>
              </div>
            );
          }

          case 'select': {
            return (
              <SelectionKnob key={i} {...options} />
            );
          }

          case 'boolean': {
            return (
              <BooleanKnob key={i} {...options} />
            );
          }

          case 'number': {
            return (
              <NumberRangeKnob key={i} {...options} />
            );
          }
        }
      })}
    </div>
  );
});
