'use client';

import { useId } from 'react';

/** Ids enlazados de un campo: control, ayuda, error y el `aria-describedby`. */
export interface FieldIds {
  readonly controlId: string;
  /** Id del `label`/`legend` (para `aria-labelledby` de grupos). */
  readonly labelId: string;
  readonly helperId: string;
  readonly errorId: string;
  readonly describedBy: string | undefined;
}

export interface FieldIdsOptions {
  readonly id?: string;
  readonly hasHelper: boolean;
  readonly hasError: boolean;
}

export function useFieldIds(options: FieldIdsOptions): FieldIds {
  const generated = useId();
  const controlId = options.id ?? `field-${generated}`;
  const labelId = `${controlId}-label`;
  const helperId = `${controlId}-helper`;
  const errorId = `${controlId}-error`;
  const describedBy = options.hasError
    ? errorId
    : options.hasHelper
      ? helperId
      : undefined;
  return { controlId, labelId, helperId, errorId, describedBy };
}
