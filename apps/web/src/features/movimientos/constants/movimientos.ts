/** Constantes de la lista y los forms de movimientos. */
import { pathSegment } from '@/shared/api';
import { APP_ROUTES, MOVIMIENTOS_LIST_PARAMS } from '@/shared/constants';
import { ESTADO_PAGO, MEDIO_PAGO, TIPO_MOVIMIENTO } from '@/shared/domain';

/** Paridad: `MovimientosStateService._pageSize = signal(25)`. */
export const MOVIMIENTOS_DEFAULT_PAGE_SIZE = 25;

/** Tabs de la lista: `''` = todos. */
export const TIPO_TAB = {
  TODOS: '',
  INGRESO: TIPO_MOVIMIENTO.INGRESO,
  EGRESO: TIPO_MOVIMIENTO.EGRESO,
} as const;

export type TipoTab = (typeof TIPO_TAB)[keyof typeof TIPO_TAB];

/** Query params de la URL que respeta la lista al cargar. */
export const LIST_URL_PARAMS = MOVIMIENTOS_LIST_PARAMS;

/** Claves de la FilterBar. */
export const FILTER_KEYS = {
  CONCEPTO: 'concepto',
  ESTADO_PAGO: 'estadoPago',
  FECHA: 'fecha',
} as const;

/** Medios de la carga manual (paridad: Efectivo / Transferencia). */
export const MEDIOS_PAGO_MANUALES = [
  MEDIO_PAGO.EFECTIVO,
  MEDIO_PAGO.TRANSFERENCIA,
] as const;

/** Estados del form (paridad: Pagado / Pendiente de Reembolso). */
export const ESTADOS_PAGO_FORM = [
  ESTADO_PAGO.PAGADO,
  ESTADO_PAGO.PENDIENTE_REEMBOLSO,
] as const;

export const DESCRIPCION_MAX_LENGTH = 500;
export const MONTO_MAX_DECIMALS = 2;
/** Paridad: `formatMoney(v, 2)` en la tabla y `money:2` en el resumen. */
export const MONEY_DECIMALS = 2;
export const DESCRIPCION_ROWS = 3;

/** Query param `?cajaId` del form de alta. */
export const CREATE_CAJA_PARAM = 'cajaId';

export const MOVIMIENTO_ROUTES = {
  LIST: APP_ROUTES.MOVIMIENTOS,
  NEW: `${APP_ROUTES.MOVIMIENTOS}/nuevo`,
  edit: (id: string): string =>
    `${APP_ROUTES.MOVIMIENTOS}/${pathSegment(id)}/editar`,
} as const;

/** Anchos (px) de las columnas de la tabla: el Concepto lleva el espacio de sobra. */
export const COLUMN_SIZE = {
  fecha: 80,
  concepto: 300,
  caja: 150,
  medio: 120,
  estado: 125,
  responsable: 170,
  monto: 115,
  acciones: 48,
} as const;
