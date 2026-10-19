'use client';

import { CirclePlus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/reui/dialog';
import type { CajaConSaldo } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { QuickMovimientoForm } from '@/features/cajas/components/quick-movimiento-form';

export interface QuickMovimientoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly caja: CajaConSaldo;
  /** Movimiento registrado (el caller refresca el drawer). */
  readonly onSuccess: () => void;
}

/** "Nuevo Movimiento" rápido sobre una caja fija (desde el drawer). */
export function QuickMovimientoDialog({
  open,
  onOpenChange,
  caja,
  onSuccess,
}: QuickMovimientoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-surface-raised shadow-lg sm:max-w-xl">
        <DialogTitle className="flex items-center gap-2 text-base font-semibold text-ink">
          <CirclePlus className="size-5 text-brand" aria-hidden />
          {C.QUICK_TITLE}
        </DialogTitle>
        {open && (
          <QuickMovimientoForm
            caja={caja}
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
