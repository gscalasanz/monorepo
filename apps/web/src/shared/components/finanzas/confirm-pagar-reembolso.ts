import { confirmDialog, type ConfirmResult } from '@/shared/confirm';
import { formatMoney } from '@/shared/format';

import { FINANZAS_COPY } from './copy';

const C = FINANZAS_COPY.reembolso;

export interface ConfirmPagarReembolsoParams {
  readonly monto: number;
  readonly descripcion?: string | null;
  readonly responsableNombre?: string | null;
  /** Marca el gasto como pagado (`PATCH /movimientos/:id {estadoPago:'pagado'}`). */
  readonly action: () => Promise<unknown>;
}

/** Confirm "Confirmar pago de reembolso" que corre la acción dentro del diálogo. */
export function confirmPagarReembolso({
  monto,
  descripcion,
  responsableNombre,
  action,
}: ConfirmPagarReembolsoParams): Promise<ConfirmResult> {
  return confirmDialog.run({
    title: C.title,
    message: C.message,
    confirmText: C.confirmText,
    cancelText: C.cancelText,
    details: [
      { label: C.monto, value: formatMoney(monto) },
      { label: C.descripcion, value: descripcion ?? C.sinDescripcion },
      { label: C.responsable, value: responsableNombre || C.desconocido },
    ],
    action,
  });
}
