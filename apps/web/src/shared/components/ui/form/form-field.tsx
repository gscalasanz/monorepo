import type { ReactNode } from 'react';

import { FieldLabelText } from '@/shared/components/ui/form/field-label-text';
import { FieldMessage } from '@/shared/components/ui/form/field-message';
import { LABEL_CLASSES } from '@/shared/components/ui/form/field-styles';
import type { FieldIds } from '@/shared/components/ui/form/use-field-ids';
import { cn } from '@/shared/lib/utils';

export interface FormFieldProps {
  readonly ids: FieldIds;
  readonly label: string;
  readonly helper?: ReactNode;
  readonly error?: string;
  readonly required?: boolean;
  /** `fieldset` para grupos (radio-cards, días): el label pasa a `legend`. */
  readonly as?: 'div' | 'fieldset';
  /** Oculta visualmente el label (sigue disponible para lectores de pantalla). */
  readonly hideLabel?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Envoltorio base de todos los campos: label 13/500 arriba, el control, y debajo
 * la ayuda o el error. Los ids (`useFieldIds`) enlazan label↔control y
 * `aria-describedby`. Uso: `const ids = useFieldIds({ id, hasHelper, hasError })`
 * y pasarle `ids.controlId` / `ids.describedBy` al control hijo.
 */
export function FormField({
  ids,
  label,
  helper,
  error,
  required = false,
  as = 'div',
  hideLabel = false,
  className,
  children,
}: FormFieldProps) {
  const labelClass = cn(LABEL_CLASSES, hideLabel && 'sr-only');
  const text = <FieldLabelText label={label} required={required} />;
  const isGroup = as === 'fieldset';
  const Root = as;

  return (
    <Root
      className={cn('flex min-w-0 flex-col gap-1.5 border-0 p-0', className)}
      aria-describedby={isGroup ? ids.describedBy : undefined}
    >
      {isGroup ? (
        <legend id={ids.labelId} className={cn(labelClass, 'mb-1.5 p-0')}>
          {text}
        </legend>
      ) : (
        <label id={ids.labelId} htmlFor={ids.controlId} className={labelClass}>
          {text}
        </label>
      )}
      {children}
      <FieldMessage ids={ids} helper={helper} error={error} />
    </Root>
  );
}
