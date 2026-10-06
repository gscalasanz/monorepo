/** Constantes del módulo cajas (tabs, límites, rutas de navegación). */
import { pathSegment } from '@/shared/api';
import { APP_ROUTES, PERSONA_TYPE_ROUTES } from '@/shared/constants';
import { CAJA_TYPE, PERSONA_TYPE } from '@/shared/domain';

export const CAJAS_TAB = {
  GRUPO: 'grupo',
  RAMA: 'rama',
  PERSONAL: 'personal',
  FONDO_SOLIDARIO: 'fondo-solidario',
} as const;

export type CajasTab = (typeof CAJAS_TAB)[keyof typeof CAJAS_TAB];

export const CAJAS_TABS: readonly CajasTab[] = Object.values(CAJAS_TAB);

/** Query param de la tab activa (`/cajas?tab=rama`). */
export const TAB_QUERY_PARAM = 'tab';

/** "Últimos Movimientos" de la caja de grupo: primeros N. */
export const ULTIMOS_MOVIMIENTOS_LIMIT = 10;

/** `GET /movimientos` de "Movimientos de Ramas": una sola página de 50 (paginación cliente de 10). */
export const MOVIMIENTOS_RAMAS_QUERY = { page: 1, limit: 50 } as const;

/** Nombre con el que se crea el fondo solidario. */
export const FONDO_SOLIDARIO_NOMBRE = 'Fondo Solidario';

export const FONDO_SOLIDARIO_TIPO = CAJA_TYPE.FONDO_SOLIDARIO;

/** Monto mínimo de una transferencia. */
export const TRANSFER_MIN_MONTO = 0.01;

export const MONTO_MAX_DECIMALS = 2;
export const DESCRIPCION_MAX_LENGTH = 500;

const CAJA_ID_PARAM = 'cajaId';

/** Rutas de otros módulos (las construye otro agente; acá solo se navega). */
export const CAJAS_LINKS = {
  movimientoNuevo: (cajaId: string): string =>
    `${APP_ROUTES.MOVIMIENTOS}/nuevo?${new URLSearchParams({ [CAJA_ID_PARAM]: cajaId }).toString()}`,
  movimientosDeCaja: (cajaId: string): string =>
    `${APP_ROUTES.MOVIMIENTOS}?${new URLSearchParams({ [CAJA_ID_PARAM]: cajaId }).toString()}`,
  movimiento: (id: string): string =>
    `${APP_ROUTES.MOVIMIENTOS}/${pathSegment(id)}`,
  movimientoEditar: (id: string): string =>
    `${APP_ROUTES.MOVIMIENTOS}/${pathSegment(id)}/editar`,
  /** Paridad: Angular siempre abría la ficha de protagonista (sirve igual para educadores). */
  fichaPropietario: (personaId: string): string =>
    `${PERSONA_TYPE_ROUTES[PERSONA_TYPE.PROTAGONISTA]}/${pathSegment(personaId)}`,
} as const;
