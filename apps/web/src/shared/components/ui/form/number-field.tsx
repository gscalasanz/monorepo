'use client';

import { FormField } from '@/shared/components/ui/form/form-field';
import { InputControl } from '@/shared/components/ui/form/input-control';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';
import { parseNumberInput, useNumericDraft } from '@/shared/forms';

export interface NumberFieldProps
  extends FieldBaseProps, ControlledProps<number | null> {
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly placeholder?: string;
}

const DEFAULT_STEP = 1;

const formatPlain = (value: number | null): string =>
  value === null ? '' : String(value);

/** Número controlado (`number | null`, nunca `NaN`). Vacío → `null`. */
export function NumberField(props: NumberFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  const step = props.step ?? DEFAULT_STEP;
  const { draft, handleChange, handleBlur } = useNumericDraft({
    value: props.value,
    onChange: props.onChange,
    parse: parseNumberInput,
    format: formatPlain,
  });
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="number"
        inputMode={Number.isInteger(step) ? 'numeric' : 'decimal'}
        step={step}
        min={props.min}
        max={props.max}
        value={draft}
        placeholder={props.placeholder}
        valid={props.valid}
        invalid={Boolean(props.error)}
        className="tabular-nums"
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => {
          handleBlur();
          props.onBlur?.();
        }}
      />
    </FormField>
  );
}
