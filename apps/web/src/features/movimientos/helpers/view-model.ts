/** Etiquetas y mapeos de la lista de movimientos (paridad con `tableData` de Angular). */
import type { FilterField } from '@/shared/components/data';
import type { MovimientoCardData } from '@/shared/components/finanzas';
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  ESTADO_PAGO_LABELS,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  TIPO_MOVIMIENTO_LABELS,
  type Movimiento,
} from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  FILTER_KEYS,
  TIPO_TAB,
  type TipoTab,
} from '@/features/movimientos/constants/movimientos';

/** Adaptador a `MovimientoCardData` para reusar `EstadoPagoBadge` de `@/shared/components/finanzas`. */
export function toCardData(m: Movimiento): MovimientoCardData {
  return {
    id: m.id,
    fecha: m.fecha,
    tipo: m.tipo,
    concepto: m.concepto,
    monto: m.monto,
    descripcion: m.descripcion,
    medioPago: m.medioPago,
    estadoPago: m.estadoPago,
    responsableNombre: responsableText(m),
  };
}

export const tipoLabel = (m: Movimiento): string =>
  TIPO_MOVIMIENTO_LABELS[m.tipo];
export const conceptoLabel = (m: Movimiento): string =>
  CONCEPTO_MOVIMIENTO_LABELS[m.concepto] ?? m.concepto;
export const medioPagoLabel = (m: Movimiento): string =>
  MEDIO_PAGO_LABELS[m.medioPago] ?? m.medioPago;
export const descripcionText = (m: Movimiento): string =>
  m.descripcion || C.EMPTY_CELL;
export const cajaText = (m: Movimiento): string =>
  m.caja?.nombre || C.EMPTY_CELL;
export const responsableText = (m: Movimiento): string =>
  m.responsable?.nombre ?? C.EMPTY_CELL;
export const comprobanteText = (m: Movimiento): string =>
  m.comprobanteEntregado ? C.YES : C.NO;

export const isIngreso = (m: Movimiento): boolean =>
  m.tipo === TIPO_MOVIMIENTO.INGRESO;

const EMPTY_HINTS: Readonly<Record<TipoTab, string>> = {
  [TIPO_TAB.TODOS]: C.EMPTY_TODOS,
  [TIPO_TAB.INGRESO]: C.EMPTY_INGRESOS,
  [TIPO_TAB.EGRESO]: C.EMPTY_EGRESOS,
};

export function emptyHint(tab: TipoTab): string {
  return EMPTY_HINTS[tab];
}

export const TIPO_TABS: readonly {
  readonly value: TipoTab;
  readonly label: string;
}[] = [
  { value: TIPO_TAB.TODOS, label: C.TAB_TODOS },
  { value: TIPO_TAB.INGRESO, label: C.TAB_INGRESOS },
  { value: TIPO_TAB.EGRESO, label: C.TAB_EGRESOS },
];

const toOptions = (labels: Readonly<Record<string, string>>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

/** Filtros de la lista: Concepto, Estado de Pago y Rango de Fechas. */
export const LIST_FILTER_FIELDS: readonly FilterField[] = [
  {
    key: FILTER_KEYS.CONCEPTO,
    type: 'select',
    label: C.FILTER_CONCEPTO,
    options: toOptions(CONCEPTO_MOVIMIENTO_LABELS),
  },
  {
    key: FILTER_KEYS.ESTADO_PAGO,
    type: 'select',
    label: C.FILTER_ESTADO,
    options: toOptions(ESTADO_PAGO_LABELS),
  },
  { key: FILTER_KEYS.FECHA, type: 'date-range', label: C.FILTER_FECHAS },
];
