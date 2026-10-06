/**
 * Filtro Todos/Ingresos/Egresos/Gastos con la definición de "gasto" inyectada:
 * campamentos filtra en el servidor (concepto `campamento_gasto`), eventos en el
 * cliente (egresos sin `uso_saldo_personal`, ver `filterMovimientos` de dominio).
 */
import {
  FILTRO_MOVIMIENTOS,
  FILTRO_MOVIMIENTOS_LABELS,
  TIPO_MOVIMIENTO,
  type FiltroMovimientos,
  type TipoMovimiento,
} from '@/shared/domain';

export interface FilterableByTipo {
  readonly tipo: TipoMovimiento | string;
}

export interface FilterMovimientosByParams<T extends FilterableByTipo> {
  readonly movimientos: readonly T[];
  readonly filtro: FiltroMovimientos;
  /** Qué es un "gasto" para el módulo que filtra. */
  readonly isGasto: (movimiento: T) => boolean;
}

/** Devuelve siempre una lista nueva (no muta la original). */
export function filterMovimientosBy<T extends FilterableByTipo>({
  movimientos,
  filtro,
  isGasto,
}: FilterMovimientosByParams<T>): T[] {
  switch (filtro) {
    case FILTRO_MOVIMIENTOS.INGRESOS:
      return movimientos.filter((m) => m.tipo === TIPO_MOVIMIENTO.INGRESO);
    case FILTRO_MOVIMIENTOS.EGRESOS:
      return movimientos.filter((m) => m.tipo === TIPO_MOVIMIENTO.EGRESO);
    case FILTRO_MOVIMIENTOS.GASTOS:
      return movimientos.filter(isGasto);
    default:
      return [...movimientos];
  }
}

export const MOVIMIENTO_FILTER_ITEMS: readonly {
  readonly value: FiltroMovimientos;
  readonly label: string;
}[] = Object.values(FILTRO_MOVIMIENTOS).map((value) => ({
  value,
  label: FILTRO_MOVIMIENTOS_LABELS[value],
}));
