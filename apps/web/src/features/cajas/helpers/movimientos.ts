/** Helpers de presentación de movimientos (drawer y tablas de cajas). */
import {
  CAJA_TYPE_LABELS,
  CONCEPTO_MOVIMIENTO_LABELS,
  FILTRO_MOVIMIENTOS,
  TIPO_MOVIMIENTO,
  filterMovimientos,
  type Movimiento,
} from '@/shared/domain';
import { ULTIMOS_MOVIMIENTOS_LIMIT } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';

/** Filtro del drawer (Todos / Ingresos / Egresos). */
export const DRAWER_FILTER = {
  TODOS: FILTRO_MOVIMIENTOS.TODOS,
  INGRESOS: FILTRO_MOVIMIENTOS.INGRESOS,
  EGRESOS: FILTRO_MOVIMIENTOS.EGRESOS,
} as const;

export type DrawerFilter = (typeof DRAWER_FILTER)[keyof typeof DRAWER_FILTER];

export const DRAWER_FILTER_OPTIONS: readonly {
  readonly value: DrawerFilter;
  readonly label: string;
}[] = [
  { value: DRAWER_FILTER.TODOS, label: C.FILTER_TODOS },
  { value: DRAWER_FILTER.INGRESOS, label: C.FILTER_INGRESOS },
  { value: DRAWER_FILTER.EGRESOS, label: C.FILTER_EGRESOS },
];

const EMPTY_MESSAGES: Readonly<Record<DrawerFilter, string>> = {
  todos: C.EMPTY_TODOS,
  ingresos: C.EMPTY_INGRESOS,
  egresos: C.EMPTY_EGRESOS,
};

export function drawerEmptyMessage(filter: DrawerFilter): string {
  return EMPTY_MESSAGES[filter];
}

export function filterDrawerMovimientos(
  movimientos: readonly Movimiento[],
  filter: DrawerFilter,
): Movimiento[] {
  return filterMovimientos(movimientos, filter);
}

export function isIngreso(movimiento: Pick<Movimiento, 'tipo'>): boolean {
  return movimiento.tipo === TIPO_MOVIMIENTO.INGRESO;
}

export function conceptoLabel(
  movimiento: Pick<Movimiento, 'concepto'>,
): string {
  return CONCEPTO_MOVIMIENTO_LABELS[movimiento.concepto];
}

/** Nombre de la caja de un movimiento (relación cruda, sin saldo). */
export function movimientoCajaLabel(
  movimiento: Pick<Movimiento, 'caja'>,
): string {
  const { caja } = movimiento;
  if (!caja) return C.EMPTY_CELL;
  return caja.nombre ?? CAJA_TYPE_LABELS[caja.tipo];
}

/** "Últimos Movimientos" de la caja de grupo (ya vienen fecha DESC). */
export function ultimosMovimientos(
  movimientos: readonly Movimiento[],
): Movimiento[] {
  return movimientos.slice(0, ULTIMOS_MOVIMIENTOS_LIMIT);
}
