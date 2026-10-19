import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  ERROR_CLASSES,
  HELPER_CLASSES,
} from '@/shared/components/ui/form/field-styles';
import type { FieldIds } from '@/shared/components/ui/form/use-field-ids';

export interface FieldMessageProps {
  readonly ids: FieldIds;
  readonly helper?: ReactNode;
  readonly error?: string;
}

/**
 * Mensaje bajo el control: el error (ícono + texto, `role="alert"`) reemplaza a
 * la ayuda. Los ids coinciden con el `aria-describedby` del control.
 */
export function FieldMessage({ ids, helper, error }: FieldMessageProps) {
  if (error) {
    return (
      <p id={ids.errorId} role="alert" className={ERROR_CLASSES}>
        <CircleAlert aria-hidden className="mt-px size-4 shrink-0" />
        <span>{error}</span>
      </p>
    );
  }
  if (!helper) return null;
  return (
    <p id={ids.helperId} className={HELPER_CLASSES}>
      {helper}
    </p>
  );
}
