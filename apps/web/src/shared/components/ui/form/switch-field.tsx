'use client';

import type { ReactNode } from 'react';

import { Switch } from '@/shared/components/reui/switch';
import { ChoiceRow } from '@/shared/components/ui/form/choice-row';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';

export interface SwitchFieldProps
  extends Omit<FieldBaseProps, 'valid'>, ControlledProps<boolean> {
  readonly description?: ReactNode;
}

const SWITCH_CLASSES =
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/25 ' +
  'data-checked:bg-brand data-unchecked:bg-border-strong dark:data-unchecked:bg-border-strong';

/** Interruptor on/off con label a la izquierda (preferencias, "es público"). */
export function SwitchField(props: SwitchFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  return (
    <ChoiceRow
      {...chrome}
      description={props.description}
      disabled={props.disabled}
      controlPosition="end"
      control={
        <Switch
          {...controlAria(ids, props)}
          checked={props.value}
          onCheckedChange={(checked) => props.onChange(checked)}
          className={SWITCH_CLASSES}
        />
      }
    />
  );
}
