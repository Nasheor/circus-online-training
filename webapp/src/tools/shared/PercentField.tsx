import { useId } from 'react';
import { NumberField } from './NumberField';
import type { NumberErrors } from './NumberField';

interface Props {
  label: string;
  hint?: string;
  /** Share between 0 and 1. */
  value: number;
  onChange: (value: number) => void;
  errors: NumberErrors;
}

/** A share entered either with a slider or as a typed percentage; both stay in step. */
export function PercentField({ label, hint, value, onChange, errors }: Props) {
  const id = useId();
  return (
    <div className="field">
      <span id={`${id}-label`} className="label">
        {label}
      </span>
      <div className="slider-row">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(value * 100)}
          onChange={(event) => onChange(Number(event.target.value) / 100)}
          aria-labelledby={`${id}-label`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-valuetext={`${Math.round(value * 100)}%`}
        />
        <span className="input-unit">
          <NumberField
            value={value}
            onChange={onChange}
            errors={errors}
            min={0}
            max={1}
            scale={100}
            ariaLabelledBy={`${id}-label`}
          />
          <span aria-hidden="true">%</span>
        </span>
      </div>
      {hint && (
        <span id={`${id}-hint`} className="hint">
          {hint}
        </span>
      )}
    </div>
  );
}
