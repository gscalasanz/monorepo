'use client';

import { FORM_COPY } from '@/shared/components/ui/form/copy';
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
import {
  phoneDisplayFromValue,
  phoneValueFromInput,
  type PhoneValueFormat,
} from '@/shared/forms';

export interface PhoneFieldProps
  extends FieldBaseProps, ControlledProps<string> {
  /** Formato del valor entregado (default E.164 como Angular: `+541112345678`). */
  readonly valueFormat?: PhoneValueFormat;
  readonly placeholder?: string;
}

/** Teléfono AR con máscara `(11) 1234-5678` mientras se tipea. */
export function PhoneField(props: PhoneFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  const format = props.valueFormat ?? 'E164';
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={phoneDisplayFromValue(props.value)}
        placeholder={props.placeholder ?? FORM_COPY.phonePlaceholder}
        valid={props.valid}
        invalid={Boolean(props.error)}
        onChange={(event) =>
          props.onChange(
            phoneValueFromInput({ input: event.target.value, format }),
          )
        }
      />
    </FormField>
  );
}
