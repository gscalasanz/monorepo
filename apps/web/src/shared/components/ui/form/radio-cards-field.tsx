'use client';

import { RadioGroup } from '@/shared/components/reui/radio-group';
import { FormField } from '@/shared/components/ui/form/form-field';
import { RadioCard } from '@/shared/components/ui/form/radio-card';
import type {
  ControlledProps,
  FieldBaseProps,
  FieldOption,
} from '@/shared/components/ui/form/types';
import { useFieldChrome } from '@/shared/components/ui/form/use-field-chrome';
import { cn } from '@/shared/lib/utils';

export interface RadioCardsFieldProps<T extends string>
  extends Omit<FieldBaseProps, 'valid'>, ControlledProps<T | null> {
  readonly options: readonly FieldOption<T>[];
  /** Columnas desde `sm` (en mobile siempre 1). */
  readonly columns?: 1 | 2 | 3;
}

const COLUMN_CLASSES = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
} as const;

/**
 * Opciones como tarjetas con descripción (DESIGN.md: "Medio de pago como
 * radio-cards"). Grupo accesible: `fieldset` + `legend`, flechas para moverse.
 */
export function RadioCardsField<T extends string>(
  props: RadioCardsFieldProps<T>,
) {
  const { ids, chrome } = useFieldChrome(props);
  const { options, error } = props;
  const handleChange = (next: unknown): void => {
    const match = options.find((option) => option.value === next);
    if (match) props.onChange(match.value);
  };
  return (
    <FormField as="fieldset" {...chrome}>
      <RadioGroup
        value={props.value ?? ''}
        onValueChange={handleChange}
        name={props.name}
        disabled={props.disabled}
        required={props.required}
        onBlur={props.onBlur}
        aria-labelledby={ids.labelId}
        aria-describedby={ids.describedBy}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          'grid grid-cols-1 gap-2',
          COLUMN_CLASSES[props.columns ?? 1],
        )}
      >
        {options.map((option) => (
          <RadioCard
            key={option.value}
            id={`${ids.controlId}-${option.value}`}
            option={option}
            invalid={Boolean(error)}
          />
        ))}
      </RadioGroup>
    </FormField>
  );
}
