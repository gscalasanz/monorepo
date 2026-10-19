import Link from 'next/link';

import { NavChevron } from '@/shared/components/ui/nav-chevron';
import type { Movimiento } from '@/shared/domain';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { conceptoLabel } from '@/features/cajas/helpers/movimientos';

/** Chevron de fila: abre la edición del movimiento (no hay pantalla de detalle). */
export function MovimientoLink({
  movimiento,
}: {
  readonly movimiento: Movimiento;
}) {
  return (
    <Link
      href={CAJAS_LINKS.movimientoEditar(movimiento.id)}
      aria-label={C.abrirMovimiento(conceptoLabel(movimiento))}
      className="group -m-2 flex size-8 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus"
    >
      <NavChevron />
    </Link>
  );
}
