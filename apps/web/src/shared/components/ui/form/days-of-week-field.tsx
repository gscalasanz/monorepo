'use client';

import { Button } from '@/shared/components/ui/button';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { DayToggle } from '@/shared/components/ui/form/day-toggle';
import { FormField } from '@/shared/components/ui/form/form-field';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import { useFieldChrome } from '@/shared/components/ui/form/use-field-chrome';
import {
  DAY_OF_WEEK_LABELS,
  DAYS_OF_WEEK_IN_ORDER,
  type DayOfWeek,
} from '@/shared/domain';
import { toggleDay } from '@/shared/forms';

export type DaysOfWeekFieldProps = Omit<FieldBaseProps, 'valid'> &
  ControlledProps<readonly DayOfWeek[]>;

/**
 * Selector múltiple de días (port de `app-days-selector`): botones toggle con
 * `aria-pressed` + atajos "Todos" / "Ninguno". Entrega los días en orden
 * lunes→domingo.
 */
export function DaysOfWeekField(props: DaysOfWeekFieldProps) {
  const { chrome } = useFieldChrome(props);
  const { value, onChange, disabled } = props;
  return (
    <FormField as="fieldset" {...chrome}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => onChange([...DAYS_OF_WEEK_IN_ORDER])}
        >
          {FORM_COPY.selectAllDays}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => onChange([])}
        >
          {FORM_COPY.clearAllDays}
        </Button>
      </div>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"
        onBlur={props.onBlur}
      >
        {DAYS_OF_WEEK_IN_ORDER.map((day) => (
          <DayToggle
            key={day}
            label={DAY_OF_WEEK_LABELS[day]}
            pressed={value.includes(day)}
            disabled={disabled}
            invalid={Boolean(props.error)}
            onToggle={() => onChange(toggleDay(value, day))}
          />
        ))}
      </div>
    </FormField>
  );
}
