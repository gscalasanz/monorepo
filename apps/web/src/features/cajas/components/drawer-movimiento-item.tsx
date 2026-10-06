import { DirectionTile, Money } from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { conceptoLabel, isIngreso } from '@/features/cajas/helpers/movimientos';

/** Ítem del drawer: flecha, concepto, fecha dd/MM/yyyy y monto con signo. */
export function DrawerMovimientoItem({
  movimiento,
}: {
  readonly movimiento: Movimiento;
}) {
  const ingreso = isIngreso(movimiento);
  return (
    <li className="flex min-h-14 items-center gap-3 px-4 py-2.5">
      <DirectionTile direction={ingreso ? 'in' : 'out'} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {conceptoLabel(movimiento)}
        </p>
        <p className="text-xs text-ink-subtle">
          {formatDate(movimiento.fecha, DATE_FORMATS.date)}
        </p>
      </div>
      <Money
        amount={movimiento.monto}
        sign={ingreso ? 'in' : 'out'}
        className="shrink-0 text-sm"
      />
    </li>
  );
}
