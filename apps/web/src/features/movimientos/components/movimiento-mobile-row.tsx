'use client';

import { DirectionTile, Money } from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { formatDate } from '@/shared/time';
import { EstadoPagoBadge } from '@/shared/components/finanzas';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MONEY_DECIMALS } from '@/features/movimientos/constants/movimientos';
import {
  conceptoLabel,
  toCardData,
  isIngreso,
  responsableText,
} from '@/features/movimientos/helpers/view-model';
import { MovimientoRowActions } from '@/features/movimientos/components/movimiento-row-actions';

interface MovimientoMobileRowProps {
  readonly movimiento: Movimiento;
  readonly onDelete: (id: string) => void;
}

function detailOf(m: Movimiento): string {
  const parts = [m.descripcion, formatDate(m.fecha), responsableText(m)];
  return parts
    .filter((part) => part && part !== C.EMPTY_CELL)
    .join(C.DETAIL_SEPARATOR);
}

/** Fila de la lista mobile (DESIGN §Tabla densa): concepto + detalle, monto y estado, acciones. */
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
        <EstadoPagoBadge movimiento={toCardData(movimiento)} />
      </div>
      <MovimientoRowActions id={movimiento.id} onDelete={onDelete} />
    </div>
  );
}
