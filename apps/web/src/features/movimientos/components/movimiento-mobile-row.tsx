'use client';

import { DirectionTile, Money } from '@/shared/components/data';
import { ESTADO_PAGO, type Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EstadoPagoBadge } from '@/shared/components/finanzas';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MONEY_DECIMALS } from '@/features/movimientos/constants/movimientos';
import {
  conceptoLabel,
  toCardData,
  isIngreso,
} from '@/features/movimientos/helpers/view-model';
import { MovimientoRowActions } from '@/features/movimientos/components/movimiento-row-actions';

interface MovimientoMobileRowProps {
  readonly movimiento: Movimiento;
  readonly onDelete: (id: string) => void;
}

function detailOf(m: Movimiento): string {
  const parts = [formatDate(m.fecha, DATE_FORMATS.dayMonthPadded), m.descripcion];
  return parts
    .filter((part) => part && part !== C.EMPTY_CELL)
    .join(C.DETAIL_SEPARATOR);
}

/** Fila mobile del mockup: concepto + «fecha · descripción», monto; el estado solo si no está pagado. */
export function MovimientoMobileRow({
  movimiento,
  onDelete,
}: MovimientoMobileRowProps) {
  const ingreso = isIngreso(movimiento);
  return (
    <div className="flex w-full min-w-0 items-center gap-3">
      <DirectionTile direction={ingreso ? 'in' : 'out'} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">
          {conceptoLabel(movimiento)}
        </p>
        <p className="truncate text-xs text-ink-subtle">
          {detailOf(movimiento)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Money
          amount={movimiento.monto}
          sign={ingreso ? 'in' : 'out'}
          decimals={MONEY_DECIMALS}
          className="tabular-nums"
        />
        {movimiento.estadoPago !== ESTADO_PAGO.PAGADO ? (
          <EstadoPagoBadge movimiento={toCardData(movimiento)} />
        ) : null}
      </div>
      <MovimientoRowActions
        id={movimiento.id}
        label={conceptoLabel(movimiento)}
        onDelete={onDelete}
      />
    </div>
  );
}
