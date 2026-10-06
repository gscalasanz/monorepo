'use client';

import { Textarea } from '@/shared/components/reui/textarea';
import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { CONTROL_SURFACE } from '@/shared/components/ui/form/field-styles';
import { FormField } from '@/shared/components/ui/form/form-field';
import type {
  ControlledProps,
  FieldBaseProps,
} from '@/shared/components/ui/form/types';
import {
  controlAria,
  useFieldChrome,
} from '@/shared/components/ui/form/use-field-chrome';
import { cn } from '@/shared/lib/utils';

export interface TextareaFieldProps
  extends Omit<FieldBaseProps, 'valid'>, ControlledProps<string> {
  readonly placeholder?: string;
  readonly rows?: number;
  /** Si se define, limita el largo y muestra el contador `n/max`. */
  readonly maxLength?: number;
}

const DEFAULT_ROWS = 3;

/** Texto multilínea (motivos, descripciones) con contador opcional. */
export function TextareaField(props: TextareaFieldProps) {
  const { ids, chrome } = useFieldChrome(props);
  const { maxLength, value } = props;
  return (
    <FormField {...chrome}>
      <Textarea
        {...controlAria(ids, props)}
        value={value}
        rows={props.rows ?? DEFAULT_ROWS}
        maxLength={maxLength}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        className={cn(
          CONTROL_SURFACE,
          'min-h-24 px-3 py-2 text-base md:text-sm',
        )}
      />
      {maxLength !== undefined && (
        <span
          aria-hidden
          className="self-end text-xs text-ink-subtle tabular-nums"
        >
          {FORM_COPY.charCount(value.length, maxLength)}
        </span>
      )}
    </FormField>
  );
}
