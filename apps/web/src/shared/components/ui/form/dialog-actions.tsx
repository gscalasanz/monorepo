import type { ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';
import { FORM_COPY } from '@/shared/components/ui/form/copy';

export interface DialogActionsProps {
  readonly onCancel: () => void;
  readonly submitLabel: string;
  readonly submitIcon?: ReactNode;
  readonly saving: boolean;
  readonly disabled?: boolean;
}

/** Pie de diálogo con form: Cancelar + submit (botones a lo ancho en mobile). */
export function DialogActions({
  onCancel,
  submitLabel,
  submitIcon,
  saving,
  disabled = false,
}: DialogActionsProps) {
  return (
    <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-border bg-recessed p-4 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={saving}
      >
        {FORM_COPY.cancel}
      </Button>
      <Button
        type="submit"
        loading={saving}
        disabled={disabled}
        icon={submitIcon}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
