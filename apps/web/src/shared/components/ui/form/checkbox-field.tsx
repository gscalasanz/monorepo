'use client';

import type { ReactNode } from 'react';

import { Checkbox } from '@/shared/components/reui/checkbox';
import { ChoiceRow } from '@/shared/components/ui/form/choice-row';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';

export interface CheckboxFieldProps
  extends Omit<FieldBaseProps, 'valid'>, ControlledProps<boolean> {
  /** Texto secundario bajo el label. */
  readonly description?: ReactNode;
}

const CHECKBOX_CLASSES =
  'size-5 rounded-sm border-border-strong bg-surface md:size-4 dark:bg-surface ' +
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/25 ' +
  'aria-invalid:border-danger aria-invalid:ring-danger/18 dark:aria-invalid:ring-danger/18 ' +
  'data-checked:border-brand data-checked:bg-brand data-checked:text-on-brand dark:data-checked:bg-brand ' +
  'data-disabled:border-border data-disabled:bg-recessed';

/** Checkbox con label a la derecha y fila táctil ≥44px. */
export function CheckboxField(props: CheckboxFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <ChoiceRow
      {...chrome}
      description={props.description}
      disabled={props.disabled}
      controlPosition="start"
      control={
        <Checkbox
          {...controlAria(ids, props)}
          checked={props.value}
          onCheckedChange={(checked) => props.onChange(checked)}
          className={CHECKBOX_CLASSES}
        />
      }
    />
  );
}
