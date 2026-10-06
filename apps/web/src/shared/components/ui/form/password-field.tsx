'use client';

import { useState } from 'react';

import { FormField } from '@/shared/components/ui/form/form-field';
import { InputControl } from '@/shared/components/ui/form/input-control';
import { PasswordToggle } from '@/shared/components/ui/form/password-toggle';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';

export interface PasswordFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  readonly placeholder?: string;
  /** `current-password` (login) o `new-password` (alta/cambio). */
  readonly autoComplete?: 'current-password' | 'new-password';
}

/** Contraseña con botón mostrar/ocultar (nombre accesible + `aria-pressed`). */
export function PasswordField(props: PasswordFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  const [visible, setVisible] = useState(false);
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type={visible ? 'text' : 'password'}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete ?? 'current-password'}
        valid={props.valid}
        invalid={Boolean(props.error)}
        onChange={(event) => props.onChange(event.target.value)}
        suffix={
          <PasswordToggle
            visible={visible}
            controls={ids.controlId}
            disabled={props.disabled}
            onToggle={() => setVisible((prev) => !prev)}
          />
        }
      />
    </FormField>
  );
}
