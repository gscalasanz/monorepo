import {
  CONCEPTO_MOVIMIENTO,
  FILTRO_MOVIMIENTOS,
  TIPO_MOVIMIENTO,
  type ConceptoMovimiento,
  type FiltroMovimientos,
  type TipoMovimiento,
} from '@/shared/domain/movimiento/enums';

/**
 * Conceptos que ofrece la carga manual, según el tipo. Quedan afuera los que
 * siempre van en pareja ligada (transferencias, bonificaciones, uso de saldo:
 * cargar una sola pata rompe el saldo de la otra caja) y los pagos de
 * inscripción/campamento (el back solo permite borrarlos desde su flujo).
 */
export const CONCEPTOS_MANUALES_POR_TIPO: Readonly<
  Record<TipoMovimiento, readonly ConceptoMovimiento[]>
> = {
  ingreso: [
    CONCEPTO_MOVIMIENTO.EVENTO_VENTA_INGRESO,
    CONCEPTO_MOVIMIENTO.EVENTO_VENTA_RECUPERO_COSTO,
    CONCEPTO_MOVIMIENTO.EVENTO_GRUPO_INGRESO,
    CONCEPTO_MOVIMIENTO.ASIGNACION_FONDO_RAMA,
    CONCEPTO_MOVIMIENTO.AJUSTE_INICIAL,
  ],
  egreso: [
    CONCEPTO_MOVIMIENTO.CAMPAMENTO_GASTO,
    CONCEPTO_MOVIMIENTO.EVENTO_VENTA_GASTO,
    CONCEPTO_MOVIMIENTO.EVENTO_GRUPO_GASTO,
    CONCEPTO_MOVIMIENTO.GASTO_GENERAL,
    CONCEPTO_MOVIMIENTO.REEMBOLSO,
    CONCEPTO_MOVIMIENTO.AJUSTE_INICIAL,
  ],
};

/** Forma mínima para clasificar un movimiento (entidad o DTO). */
export interface FilterableMovimiento {
  readonly tipo: string;
  readonly concepto: string;
}

const MATCHERS: Readonly<Record<FiltroMovimientos, (m: FilterableMovimiento) => boolean>> = {
  todos: () => true,
  ingresos: (m) => m.tipo === TIPO_MOVIMIENTO.INGRESO,
  egresos: (m) => m.tipo === TIPO_MOVIMIENTO.EGRESO,
  gastos: (m) =>
    m.tipo === TIPO_MOVIMIENTO.EGRESO && m.concepto !== CONCEPTO_MOVIMIENTO.USO_SALDO_PERSONAL,
};

/**
 * Filtro de la lista de movimientos de campamentos y eventos (port de
 * `filtrarMovimientos`). Siempre devuelve una lista nueva.
 */
export function filterMovimientos<T extends FilterableMovimiento>(
  movimientos: readonly T[],
  filtro: FiltroMovimientos = FILTRO_MOVIMIENTOS.TODOS,
): T[] {
  return movimientos.filter(MATCHERS[filtro]);
}
