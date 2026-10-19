'use client';

import type { FormFieldProps } from '@/shared/components/ui/form/form-field';
import type { FieldBaseProps } from '@/shared/components/ui/form/types';
import {
  useFieldIds,
  type FieldIds,
} from '@/shared/components/ui/form/use-field-ids';

export type FieldChrome = Omit<FormFieldProps, 'children'>;

/**
 * Ids enlazados + props del `FormField` a partir de las props comunes de un
 * campo. Evita repetir el cableado label/ayuda/error en cada componente.
 */
export function useFieldChrome(props: FieldBaseProps): {
  readonly ids: FieldIds;
  readonly chrome: FieldChrome;
} {
  const { id, label, helper, error, required, className } = props;
  const ids = useFieldIds({
    id,
    hasHelper: Boolean(helper),
    hasError: Boolean(error),
  });
  return { ids, chrome: { ids, label, helper, error, required, className } };
}

/** Atributos ARIA/estado comunes que cada control recibe de su campo. */
export function controlAria(ids: FieldIds, props: FieldBaseProps) {
  return {
    id: ids.controlId,
    name: props.name,
    required: props.required,
    disabled: props.disabled,
    onBlur: props.onBlur,
    'aria-invalid': Boolean(props.error) || undefined,
    'aria-describedby': ids.describedBy,
  } as const;
}
