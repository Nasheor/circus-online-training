import { useEffect, useId, useState } from 'react';
import { fill, parseNumber } from '../../i18n/format';

export interface NumberErrors {
  number: string;
  min: string;
  max: string;
  whole: string;
}

interface Props {
  value: number;
  onChange: (value: number) => void;
  errors: NumberErrors;
  min?: number;
  max?: number;
  whole?: boolean;
  /** Multiplier between what is stored and what is shown, e.g. 100 for a share shown as a percentage. */
  scale?: number;
  id?: string;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const show = (value: number) => String(Math.round(value * 1e6) / 1e6);

/**
 * Text input for a number. Accepts a decimal comma or point, keeps the last
 * valid value while the user is mid-edit, and explains what is wrong.
 */
export function NumberField({
  value, onChange, errors, min = 0, max, whole = false, scale = 1,
  id, className = 'input input--number', ariaLabel, ariaLabelledBy, ariaDescribedBy,
}: Props) {
  const errorId = useId();
  const [text, setText] = useState(() => show(value * scale));
  const [error, setError] = useState<string | null>(null);

  // Follow changes made elsewhere (loading a scenario, reset, another tab).
  useEffect(() => {
    const typed = parseNumber(text);
    if (typed === null || Math.abs(typed / scale - value) > 1e-9) {
      setText(show(value * scale));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, scale]);

  const handle = (next: string) => {
    setText(next);
    const typed = parseNumber(next);
    if (typed === null) return setError(errors.number);
    if (whole && !Number.isInteger(typed)) return setError(errors.whole);
    if (typed < min * scale) return setError(fill(errors.min, { min: min * scale }));
    if (max !== undefined && typed > max * scale) return setError(fill(errors.max, { max: max * scale }));
    setError(null);
    onChange(typed / scale);
  };

  return (
    <>
      <input
        id={id}
        className={className}
        type="text"
        inputMode={whole ? 'numeric' : 'decimal'}
        autoComplete="off"
        value={text}
        onChange={(event) => handle(event.target.value)}
        // Typing into a field replaces its content, so "0" never has to be deleted first.
        onFocus={(event) => event.target.select()}
        onBlur={() => {
          if (!error) setText(show(value * scale));
        }}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={error ? true : undefined}
        aria-describedby={[error ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined}
      />
      {error && (
        <span id={errorId} className="error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
