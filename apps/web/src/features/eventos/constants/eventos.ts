/** Rutas, tabs y límites del módulo eventos. */
import { pathSegment } from '@/shared/api/path-segment';
import { APP_ROUTES } from '@/shared/constants';

export const EVENTO_TAB = {
  PRODUCTOS: 'productos',
  VENTAS: 'ventas',
  ENTREGAS: 'entregas',
  MOVIMIENTOS: 'movimientos',
} as const;

export type EventoTab = (typeof EVENTO_TAB)[keyof typeof EVENTO_TAB];

/** Query param que fija el tab inicial del detalle (`?tab=ventas`). */
export const TAB_QUERY_PARAM = 'tab';

/** Query param de búsqueda por vendedor (ventas / entregas). */
export const VENDEDOR_QUERY_PARAM = 'vendedor';

export const EVENTOS_ROUTES = {
  list: APP_ROUTES.EVENTOS,
  create: `${APP_ROUTES.EVENTOS}/crear`,
  detail: (id: string, tab?: EventoTab): string => {
    const base = `${APP_ROUTES.EVENTOS}/${pathSegment(id)}`;
    return tab ? `${base}?${TAB_QUERY_PARAM}=${tab}` : base;
  },
  edit: (id: string): string =>
    `${APP_ROUTES.EVENTOS}/${pathSegment(id)}/editar`,
  ventasLote: (id: string): string =>
    `${APP_ROUTES.EVENTOS}/${pathSegment(id)}/ventas/registrar`,
  /** Ruta pública (feature `event-report`). */
  reporte: (id: string): string => APP_ROUTES.eventoReportePublico(id),
} as const;

/** Límites de los forms (paridad con `EventosFormBuilder` / DTOs del backend). */
export const EVENTO_LIMITS = {
  NOMBRE_MIN: 3,
  NOMBRE_MAX: 100,
  DESCRIPCION_MAX: 500,
  TIPO_EVENTO_MAX: 50,
  PRODUCTO_NOMBRE_MIN: 2,
  PRODUCTO_NOMBRE_MAX: 100,
  PRECIO_DECIMALES: 2,
  NOTAS_MAX: 500,
} as const;

/** Prefijo de la key de grupos de ventas sin movimiento (legacy). */
export const VENTA_SOLO_KEY_PREFIX = 'solo:';
