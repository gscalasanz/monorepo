import type { ReactNode } from 'react';

import { FieldLabelText } from '@/shared/components/ui/form/field-label-text';
import { FieldMessage } from '@/shared/components/ui/form/field-message';
import { TOUCH_ROW } from '@/shared/components/ui/form/field-styles';
import type { FieldIds } from '@/shared/components/ui/form/use-field-ids';
import { cn } from '@/shared/lib/utils';

export interface ChoiceRowProps {
  readonly ids: FieldIds;
  readonly label: string;
  readonly control: ReactNode;
  /** `start` (checkbox) o `end` (switch). */
  readonly controlPosition: 'start' | 'end';
  readonly description?: ReactNode;
  readonly helper?: ReactNode;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Fila táctil (≥44px) de control binario + label + descripción + mensaje. */
export function ChoiceRow(props: ChoiceRowProps) {
  const { ids, control, controlPosition, disabled } = props;
  const label = (
    <label
      id={ids.labelId}
      htmlFor={ids.controlId}
      className={cn(
        'flex flex-col gap-0.5 text-base text-ink md:text-sm',
        disabled ? 'cursor-not-allowed text-ink-muted' : 'cursor-pointer',
      )}
    >
      <span>
        <FieldLabelText label={props.label} required={props.required} />
      </span>
      {props.description && (
        <span className="text-[13px] text-ink-muted">{props.description}</span>
      )}
    </label>
  );
  return (
    <div className={cn('flex flex-col gap-1', props.className)}>
      <div
        className={cn(
          'flex items-center gap-3',
          TOUCH_ROW,
          controlPosition === 'end' && 'justify-between gap-4',
        )}
      >
        {controlPosition === 'start' && control}
        {label}
        {controlPosition === 'end' && control}
      </div>
      <FieldMessage ids={ids} helper={props.helper} error={props.error} />
    </div>
  );
}
