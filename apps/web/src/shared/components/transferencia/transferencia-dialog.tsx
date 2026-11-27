'use client';

import { ArrowLeftRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/reui/dialog';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import { TransferenciaForm } from '@/shared/components/transferencia/transferencia-form';
import type { TransferenciaOrigen } from '@/shared/components/transferencia/transferencia';

export interface TransferenciaDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Caja origen (fija): caja de grupo, cuenta personal, etc. */
  readonly origen: TransferenciaOrigen;
  /** Título del diálogo (default "Transferir entre Cajas"). */
  readonly title?: string;
  /** Ofrece cuentas personales como destino (default `false`). */
  readonly incluirPersonales?: boolean;
  /** Transferencia registrada (el caller recarga). Sin toast de éxito, como Angular. */
  readonly onSuccess: () => void;
}

/** "Transferir entre Cajas" (Caja de Grupo, Fondo Solidario y ficha de Personas). */
export function TransferenciaDialog({
  open,
  onOpenChange,
  origen,
  title = C.TRANSFER_TITLE,
  incluirPersonales,
  onSuccess,
}: TransferenciaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-surface-raised shadow-lg sm:max-w-lg">
        <DialogTitle className="flex items-center gap-2 text-base font-semibold text-ink">
          <ArrowLeftRight className="size-5 text-brand" aria-hidden />
          {title}
        </DialogTitle>
        {open && (
          <TransferenciaForm
            origen={origen}
            incluirPersonales={incluirPersonales}
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
