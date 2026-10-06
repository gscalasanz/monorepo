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

export interface DateFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  /** `YYYY-MM-DD`. */
  readonly min?: string;
  /** `YYYY-MM-DD`. */
  readonly max?: string;
}

/**
 * Fecha calendario con el picker nativo. `value` es `YYYY-MM-DD` (o `''`), el
 * formato que espera el backend; para convertir usar `toDateInputValue`.
 */
export function DateField(props: DateFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="date"
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
