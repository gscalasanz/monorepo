'use client';

import { AlertDialogFooter } from '@/shared/components/reui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { CONFIRM_COPY } from '@/shared/confirm/copy';
import type { ActiveConfirm } from '@/shared/confirm/confirm-store';
import type { useConfirmFlow } from '@/shared/confirm/use-confirm-flow';

interface ConfirmFooterProps {
  readonly active: ActiveConfirm;
  readonly flow: ReturnType<typeof useConfirmFlow>;
}

/** Botonera del diálogo: Cancelar/Confirmar, o Cerrar tras un error. */
export function ConfirmFooter({ active, flow }: ConfirmFooterProps) {
  if (flow.phase === 'error') {
    return (
      <AlertDialogFooter className="bg-recessed">
        <Button variant="secondary" onClick={flow.onCancel}>
          {CONFIRM_COPY.CLOSE}
        </Button>
      </AlertDialogFooter>
    );
  }
  const loading = flow.phase === 'loading';
  return (
    <AlertDialogFooter className="bg-recessed">
      <Button variant="secondary" onClick={flow.onCancel} disabled={loading}>
        {active.cancelText ?? CONFIRM_COPY.CANCEL}
      </Button>
      <Button
        variant={active.destructive ? 'danger' : 'primary'}
        loading={loading}
        onClick={() => void flow.onConfirm()}
      >
        {active.confirmText ?? CONFIRM_COPY.CONFIRM}
      </Button>
    </AlertDialogFooter>
  );
}
