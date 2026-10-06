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
  formatMoneyInput,
  parseMoneyInput,
  sanitizeMoneyInput,
  useNumericDraft,
} from '@/shared/forms';

export interface MoneyFieldProps
  extends FieldBaseProps, ControlledProps<number | null> {
  readonly placeholder?: string;
  /** `lg` (default) = input grande 24px/600 del contrato; `md` para filas densas. */
  readonly size?: 'md' | 'lg';
}

/**
 * Monto en pesos: prefijo `$`, acepta enteros y decimales (`1.234,56` o
 * `1234.56`), entrega `number | null` (nunca `NaN`) y al salir del campo
 * reformatea en es-AR.
 */
export function MoneyField(props: MoneyFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  const { draft, handleChange, handleBlur } = useNumericDraft({
    value: props.value,
    onChange: props.onChange,
    parse: parseMoneyInput,
    format: formatMoneyInput,
    sanitize: sanitizeMoneyInput,
  });
  return (
    <FormField {...chrome}>
      <InputControl
        {...controlAria(ids, props)}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        size={props.size ?? 'lg'}
        prefix={FORM_COPY.moneyPrefix}
        value={draft}
        placeholder={props.placeholder ?? FORM_COPY.moneyPlaceholder}
        valid={props.valid}
        invalid={Boolean(props.error)}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => {
          handleBlur();
          props.onBlur?.();
        }}
      />
    </FormField>
  );
}
