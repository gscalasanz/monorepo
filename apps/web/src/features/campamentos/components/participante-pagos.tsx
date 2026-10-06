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

/** Historial de pagos/bonificaciones del participante. Solo el pago real se puede eliminar. */
export function ParticipantePagos({
  pagos,
  onEliminarPago,
}: ParticipantePagosProps) {
  if (pagos.length === 0) return null;
  return (
    <ul
      aria-label={C.HISTORIAL}
      className="flex flex-col divide-y divide-border rounded-lg bg-recessed px-3"
    >
      {pagos.map((pago) => (
        <li
          key={pago.movimientoId}
          className="flex min-h-11 items-center gap-3 py-1.5 text-[13px]"
        >
          <span className="w-10 shrink-0 text-ink-subtle tabular-nums">
            {formatDate(pago.fecha, DATE_FORMATS.dayMonthNumeric)}
          </span>
          <Money
            amount={pago.monto}
            sign={isEgreso(pago) ? 'out' : undefined}
            className="shrink-0"
          />
          <span className="min-w-0 flex-1 truncate text-ink-muted">
            {conceptoLabel(pago.concepto)} ·{' '}
            {MEDIO_PAGO_LABELS[pago.medioPago] ?? pago.medioPago}
          </span>
          {isPagoGestionable(pago) && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={C.ELIMINAR_PAGO}
              className="shrink-0 hover:text-danger"
              onClick={() => onEliminarPago(pago)}
            >
              <Trash2 aria-hidden className="size-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
