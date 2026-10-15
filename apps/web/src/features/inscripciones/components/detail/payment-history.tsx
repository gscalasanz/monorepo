import { ReceiptText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import type { Inscripcion, MovimientoInscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { PagoItem } from '@/features/inscripciones/components/detail/pago-item';

interface PaymentHistoryProps {
  readonly inscripcion: Inscripcion;
  readonly onEditPago: (movimiento: MovimientoInscripcion) => void;
}

/** "Historial de pagos" a sangre; registrar un pago vive en el encabezado. */
export function PaymentHistory({
  inscripcion,
  onEditPago,
}: PaymentHistoryProps) {
  const { movimientos } = inscripcion;
  return (
    <Panel
      title={C.HISTORIAL}
      meta={
        movimientos.length > 0 ? C.pagosCount(movimientos.length) : undefined
      }
      flush
    >
      {movimientos.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title={C.SIN_PAGOS}
          hint={C.PRIMER_PAGO}
        />
      ) : (
        <ul aria-label={C.PAGOS_LABEL} className="divide-y divide-border">
          {movimientos.map((movimiento) => (
            <PagoItem
              key={movimiento.id}
              movimiento={movimiento}
              onEdit={onEditPago}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
