import Link from 'next/link';

import { DirectionTile, Money } from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { conceptoLabel, isIngreso } from '@/features/cajas/helpers/movimientos';

export interface MovimientoMobileRowProps {
  readonly movimiento: Movimiento;
  /** Texto extra bajo el concepto (caja, responsable…). */
  readonly detail?: string;
}

/** Fila mobile de un movimiento: link al detalle con flecha, concepto, fecha y monto con signo. */
export function MovimientoMobileRow({
  movimiento,
  detail,
}: MovimientoMobileRowProps) {
  const ingreso = isIngreso(movimiento);
  const fecha = formatDate(movimiento.fecha, DATE_FORMATS.date);
  return (
    <Link
      href={CAJAS_LINKS.movimiento(movimiento.id)}
      className="-mx-4 -my-2.5 flex min-h-14 w-[calc(100%+2rem)] items-center gap-3 px-4 py-2.5 hover:bg-recessed/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
    >
      <DirectionTile direction={ingreso ? 'in' : 'out'} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {conceptoLabel(movimiento)}
        </span>
        <span className="block truncate text-xs text-ink-subtle">
          {detail ? `${fecha} · ${detail}` : fecha}
        </span>
      </span>
      <Money
        amount={movimiento.monto}
        sign={ingreso ? 'in' : 'out'}
        className="shrink-0 text-sm"
      />
    </Link>
  );
}
