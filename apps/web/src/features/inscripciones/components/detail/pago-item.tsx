import { Pencil } from 'lucide-react';

import { DirectionTile, Money, RowActionsMenu } from '@/shared/components/data';
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  type MovimientoInscripcion,
} from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { isPagoEditable } from '@/features/inscripciones/helpers/detail';

interface PagoItemProps {
  readonly movimiento: MovimientoInscripcion;
  readonly onEdit: (movimiento: MovimientoInscripcion) => void;
}

/** Fila del historial (columnas fijas): tile · concepto + fecha corta y medio · monto · ⋯ (solo pagos reales). */
export function PagoItem({ movimiento, onEdit }: PagoItemProps) {
  const egreso = movimiento.tipo === TIPO_MOVIMIENTO.EGRESO;
  const monto = formatMoney(movimiento.monto);
  return (
    <li className="grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto_2.75rem] items-center gap-3 px-4 py-2.5 md:grid-cols-[auto_minmax(0,1fr)_auto_2rem] md:px-[18px]">
      <DirectionTile direction={egreso ? 'out' : 'in'} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">
          {CONCEPTO_MOVIMIENTO_LABELS[movimiento.concepto]}
        </p>
        <p className="truncate text-xs text-ink-subtle">
          <time
            dateTime={movimiento.fecha}
            title={formatDate(movimiento.fecha, DATE_FORMATS.dayMonthYear)}
            className="tabular-nums"
          >
            {formatDate(movimiento.fecha, DATE_FORMATS.dayMonthPadded)}
          </time>
          {` · ${MEDIO_PAGO_LABELS[movimiento.medioPago]}`}
        </p>
      </div>
      <Money
        amount={movimiento.monto}
        sign={egreso ? 'out' : 'in'}
        className="text-sm font-medium"
      />
      {isPagoEditable(movimiento) ? (
        <RowActionsMenu
          ariaLabel={C.pagoActions(monto)}
          actions={[
            {
              key: 'edit',
              label: C.EDIT_PAGO,
              icon: Pencil,
              onSelect: () => onEdit(movimiento),
            },
          ]}
        />
      ) : (
        <span aria-hidden />
      )}
    </li>
  );
}
