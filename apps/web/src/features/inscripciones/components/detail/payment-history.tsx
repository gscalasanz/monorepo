import { Plus, ReceiptText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { Panel } from '@/shared/components/ui/panel';
import type { Inscripcion, MovimientoInscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { PagoItem } from '@/features/inscripciones/components/detail/pago-item';

interface PaymentHistoryProps {
  readonly inscripcion: Inscripcion;
  readonly onAddPago: () => void;
  readonly onEditPago: (movimiento: MovimientoInscripcion) => void;
}

/** "Historial de pagos" con "+ Pago" mientras haya saldo pendiente. */
export function PaymentHistory({
  inscripcion,
  onAddPago,
  onEditPago,
}: PaymentHistoryProps) {
  const addButton =
    inscripcion.saldoPendiente > 0 ? (
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus aria-hidden />}
        aria-label={C.ADD_PAGO_LABEL}
        onClick={onAddPago}
      >
        {C.ADD_PAGO}
      </Button>
    ) : undefined;
  return (
    <Panel title={C.HISTORIAL} headerExtra={addButton} flush>
      {inscripcion.movimientos.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title={C.SIN_PAGOS}
          hint={C.PRIMER_PAGO}
        />
      ) : (
        <ul aria-label={C.PAGOS_LABEL} className="divide-y divide-border">
          {inscripcion.movimientos.map((movimiento) => (
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
