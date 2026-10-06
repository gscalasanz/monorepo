'use client';

import { MINUTE_STEP_SECONDS } from '@/shared/components/ui/form/constants';
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

export interface TimeFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  /** `HH:mm`. */
  readonly min?: string;
  /** `HH:mm`. */
  readonly max?: string;
  /** Paso en segundos (default 60: horas y minutos, sin segundos). */
  readonly step?: number;
}

/**
 * Hora del día con el picker nativo (`<input type="time">`), `value` `HH:mm`.
 */
export function TimeField(props: TimeFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="time"
        step={props.step ?? MINUTE_STEP_SECONDS}
        min={props.min}
        max={props.max}
        value={props.value}
        valid={props.valid}
        invalid={Boolean(props.error)}
        className="tabular-nums"
        onChange={(event) => props.onChange(event.target.value)}
      />
    </FormField>
  );
}
