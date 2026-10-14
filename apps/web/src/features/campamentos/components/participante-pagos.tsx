'use client';

import { Trash2 } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { MEDIO_PAGO_LABELS, type ParticipantePago } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import {
  conceptoLabel,
  isEgreso,
  isPagoGestionable,
} from '@/features/campamentos/helpers/detalle';

type Pago = ParticipantePago['pagos'][number];

export interface ParticipantePagosProps {
  readonly pagos: readonly Pago[];
  readonly onEliminarPago: (pago: Pago) => void;
}

function PagoItem({
  pago,
  onEliminarPago,
}: {
  readonly pago: Pago;
  readonly onEliminarPago: (pago: Pago) => void;
}) {
  return (
    <li className="flex min-h-11 items-center gap-3 py-1 text-[13px]">
      <span
        className="w-12 shrink-0 text-ink-subtle tabular-nums"
        title={formatDate(pago.fecha, DATE_FORMATS.longDate)}
      >
        {formatDate(pago.fecha, DATE_FORMATS.dayMonthPadded)}
      </span>
      <span className="min-w-0 flex-1 truncate text-ink-muted">
        {conceptoLabel(pago.concepto)} ·{' '}
        {MEDIO_PAGO_LABELS[pago.medioPago] ?? pago.medioPago}
      </span>
      <Money
        amount={pago.monto}
        sign={isEgreso(pago) ? 'out' : undefined}
        className="shrink-0 tabular-nums"
      />
      <span className="flex w-11 shrink-0 justify-end md:w-8">
        {isPagoGestionable(pago) && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={C.ELIMINAR_PAGO}
            className="hover:text-danger"
            onClick={() => onEliminarPago(pago)}
          >
            <Trash2 aria-hidden className="size-4" />
          </Button>
        )}
      </span>
    </li>
  );
}

/** Historial de pagos/bonificaciones (contenido de la fila expandida). Solo el pago real se elimina. */
export function ParticipantePagos({
  pagos,
  onEliminarPago,
}: ParticipantePagosProps) {
  if (pagos.length === 0) {
    return (
      <p className="px-4 py-3 text-[13px] text-ink-subtle md:pl-14">
        {C.SIN_PAGOS}
      </p>
    );
  }
  return (
    <ul
      aria-label={C.HISTORIAL}
      className="flex flex-col divide-y divide-border px-4 py-1 md:pl-14"
    >
      {pagos.map((pago) => (
        <PagoItem
          key={pago.movimientoId}
          pago={pago}
          onEliminarPago={onEliminarPago}
        />
      ))}
    </ul>
  );
}
