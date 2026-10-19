'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/components/reui/combobox';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { TOUCH_ROW } from '@/shared/components/ui/form/field-styles';
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

export interface ComboboxFieldProps<T extends string>
  extends FieldBaseProps, ControlledProps<T | null> {
  readonly options: readonly FieldOption<T>[];
  readonly placeholder?: string;
  readonly emptyText?: string;
}

/** El borde vive en el `InputGroup` de ReUI: se pisa con el contrato de marca. */
const GROUP_CLASSES = cn(
  'h-[46px] w-full rounded-md border-border-strong bg-surface md:h-[38px] dark:bg-surface',
  'has-[[data-slot=input-group-control]:focus-visible]:border-focus has-[[data-slot=input-group-control]:focus-visible]:ring-focus/25',
  'has-[[data-slot][aria-invalid=true]]:border-danger has-[[data-slot][aria-invalid=true]]:ring-danger/18 dark:has-[[data-slot][aria-invalid=true]]:ring-danger/18',
  'has-disabled:border-border has-disabled:bg-recessed has-disabled:opacity-100 dark:has-disabled:bg-recessed',
  '[&_input]:text-base [&_input]:text-ink [&_input]:placeholder:text-ink-subtle md:[&_input]:text-sm',
);

const ITEM_CLASSES = cn(TOUCH_ROW, 'text-base md:text-sm');

/**
 * Select con búsqueda (listas largas, p. ej. personas) sobre el `Combobox` de
 * ReUI (Base UI): filtra mientras se tipea, teclado completo y táctil.
 */
export function ComboboxField<T extends string>(props: ComboboxFieldProps<T>) {
  const { ids, chrome } = useFieldChrome(props);
  const { name, required, disabled, ...inputAria } = controlAria(ids, props);
  const selected =
    props.options.find((option) => option.value === props.value) ?? null;
  return (
    <FormField {...chrome}>
      <Combobox<FieldOption<T>>
        items={props.options}
        value={selected}
        onValueChange={(next) => props.onChange(next?.value ?? null)}
        itemToStringLabel={(option) => option.label}
        isItemEqualToValue={(item, current) => item.value === current.value}
        {...{ name, required, disabled }}
      >
        <ComboboxInput
          {...inputAria}
          disabled={disabled}
          placeholder={props.placeholder ?? FORM_COPY.comboboxPlaceholder}
          className={GROUP_CLASSES}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {props.emptyText ?? FORM_COPY.comboboxEmpty}
          </ComboboxEmpty>
          <ComboboxList>
            {(option: FieldOption<T>) => (
              <ComboboxItem
                key={option.value}
                value={option}
                disabled={option.disabled}
                className={ITEM_CLASSES}
              >
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FormField>
  );
}
