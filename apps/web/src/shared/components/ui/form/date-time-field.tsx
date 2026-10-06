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

export interface DateTimeFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  /** `YYYY-MM-DDTHH:mm`. */
  readonly min?: string;
  /** `YYYY-MM-DDTHH:mm`. */
  readonly max?: string;
  /** Paso en segundos (default 60: horas y minutos, sin segundos). */
  readonly step?: number;
}

/**
 * Fecha y hora local (picker nativo `datetime-local`). `value` es
 * `YYYY-MM-DDTHH:mm`; convertir con `toDateTimeInputValue` /
 * `dateTimeInputToInstant` de `@/shared/time`.
 */
export function DateTimeField(props: DateTimeFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="datetime-local"
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
