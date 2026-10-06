'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/reui/select';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import {
  CONTROL_SIZE,
  CONTROL_SURFACE,
  TOUCH_ROW,
} from '@/shared/components/ui/form/field-styles';
import { FormField } from '@/shared/components/ui/form/form-field';
import type {
  ControlledProps,
  FieldBaseProps,
  FieldOption,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';
import { cn } from '@/shared/lib/utils';

export interface SelectFieldProps<T extends string>
  extends FieldBaseProps, ControlledProps<T | null> {
  readonly options: readonly FieldOption<T>[];
  readonly placeholder?: string;
}

const TRIGGER_CLASSES = cn(
  CONTROL_SURFACE,
  CONTROL_SIZE.md,
  'w-full pr-2.5 data-placeholder:text-ink-subtle',
  'data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-recessed data-disabled:text-ink-muted data-disabled:opacity-100',
);

/**
 * Select de marca sobre el `Select` de ReUI (Base UI): navegable con teclado
 * (flechas, typeahead, Enter/Espacio) y táctil. Para listas largas con búsqueda
 * usar `ComboboxField`.
 */
export function SelectField<T extends string>(props: SelectFieldProps<T>) {
  const { ids, chrome } = useFieldChrome(props);
  const { id, name, required, disabled, ...triggerAria } = controlAria(
    ids,
    props,
  );
  return (
    <FormField {...chrome}>
      <Select<T>
        value={props.value}
        onValueChange={(next) => props.onChange(next)}
        items={props.options}
        {...{ name, required, disabled }}
      >
        <SelectTrigger id={id} {...triggerAria} className={TRIGGER_CLASSES}>
          <SelectValue
            placeholder={props.placeholder ?? FORM_COPY.selectPlaceholder}
          />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(TOUCH_ROW, 'text-base md:text-sm')}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
