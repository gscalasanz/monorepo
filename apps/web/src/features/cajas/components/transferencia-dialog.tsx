'use client';

import { ArrowLeftRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/reui/dialog';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { TransferenciaForm } from '@/features/cajas/components/transferencia-form';
import type { TransferenciaOrigen } from '@/features/cajas/helpers/transferencia';

export interface TransferenciaDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Caja origen (siempre la caja de grupo). */
  readonly origen: TransferenciaOrigen;
  /** Transferencia registrada (el caller recarga). Sin toast de éxito, como Angular. */
  readonly onSuccess: () => void;
}

/** "Transferir entre Cajas" (compartido por Caja de Grupo y Fondo Solidario). */
export function TransferenciaDialog({
  open,
  onOpenChange,
  origen,
  onSuccess,
}: TransferenciaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-surface-raised shadow-lg sm:max-w-lg">
        <DialogTitle className="flex items-center gap-2 text-base font-semibold text-ink">
          <ArrowLeftRight className="size-5 text-brand" aria-hidden />
          {C.TRANSFER_TITLE}
        </DialogTitle>
        {open && (
          <TransferenciaForm
            origen={origen}
            onCancel={() => onOpenChange(false)}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
