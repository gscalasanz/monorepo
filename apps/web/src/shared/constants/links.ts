/**
 * Contrato de URLs entre pantallas: los nombres de los query params que leen Cajas y
 * Movimientos viven acá para que quien enlaza (dashboard…) y quien lee no se desincronicen.
 */
import { pathSegment } from '@/shared/api/path-segment';
import type { PersonaType } from '@/shared/domain';
import { APP_ROUTES, PERSONA_TYPE_ROUTES } from '@/shared/constants/routes';

export const CAJAS_TAB = {
  GRUPO: 'grupo',
  RAMA: 'rama',
  PERSONAL: 'personal',
  FONDO_SOLIDARIO: 'fondo-solidario',
} as const;

export type CajasTab = (typeof CAJAS_TAB)[keyof typeof CAJAS_TAB];

/** Query param de la tab activa (`/cajas?tab=rama`). */
export const CAJAS_TAB_PARAM = 'tab';

/** Query params que respeta la lista de movimientos al cargar. */
export const MOVIMIENTOS_LIST_PARAMS = {
  CAJA_ID: 'cajaId',
  TIPO_CAJA: 'tipoCaja',
  TIPO: 'tipo',
  CONCEPTO: 'concepto',
  ESTADO_PAGO: 'estadoPago',
  FECHA_INICIO: 'fechaInicio',
  FECHA_FIN: 'fechaFin',
} as const;

export interface MovimientosLinkFilters {
  readonly tipo?: string;
  readonly estadoPago?: string;
  readonly concepto?: string;
  readonly fechaInicio?: string;
  readonly fechaFin?: string;
  readonly cajaId?: string;
}

/** Orden estable de los params en la URL generada. */
const MOVIMIENTOS_LINK_ORDER = [
  ['tipo', MOVIMIENTOS_LIST_PARAMS.TIPO],
  ['estadoPago', MOVIMIENTOS_LIST_PARAMS.ESTADO_PAGO],
  ['concepto', MOVIMIENTOS_LIST_PARAMS.CONCEPTO],
  ['fechaInicio', MOVIMIENTOS_LIST_PARAMS.FECHA_INICIO],
  ['fechaFin', MOVIMIENTOS_LIST_PARAMS.FECHA_FIN],
  ['cajaId', MOVIMIENTOS_LIST_PARAMS.CAJA_ID],
] as const;

export function cajasHref(tab?: CajasTab): string {
  return tab ? `${APP_ROUTES.CAJAS}?${CAJAS_TAB_PARAM}=${tab}` : APP_ROUTES.CAJAS;
}

/** `/movimientos` con solo los filtros presentes. */
export function movimientosHref(filters: MovimientosLinkFilters): string {
  const query = new URLSearchParams();
  for (const [key, param] of MOVIMIENTOS_LINK_ORDER) {
    const value = filters[key];
    if (value) query.set(param, value);
  }
  const text = query.toString();
  return text ? `${APP_ROUTES.MOVIMIENTOS}?${text}` : APP_ROUTES.MOVIMIENTOS;
}

/** Ficha de una persona; una agrupación no tiene ficha y va al listado. */
export function personaHref(params: { readonly tipo: PersonaType; readonly id: string }): string {
  const base = PERSONA_TYPE_ROUTES[params.tipo];
  return params.tipo === 'agrupacion' ? base : `${base}/${pathSegment(params.id)}`;
}

/** Formulario de edición de un movimiento (no hay detalle ruteado: Angular tampoco lo tiene). */
export function movimientoEditHref(id: string): string {
  return `${APP_ROUTES.MOVIMIENTOS}/${pathSegment(id)}/editar`;
}
