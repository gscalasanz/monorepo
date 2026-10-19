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

export interface TextFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  readonly type?: 'text' | 'email' | 'search' | 'url';
  readonly placeholder?: string;
  readonly autoComplete?: string;
  readonly maxLength?: number;
  readonly inputMode?: 'text' | 'email' | 'search' | 'url' | 'numeric';
}

/** Campo de texto/email controlado (`value: string`). */
export function TextField(props: TextFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type={props.type ?? 'text'}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        maxLength={props.maxLength}
        inputMode={props.inputMode}
        valid={props.valid}
        invalid={Boolean(props.error)}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </FormField>
  );
}
