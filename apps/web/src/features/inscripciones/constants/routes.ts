/** Rutas internas del módulo Inscripciones. */
import { pathSegment } from '@/shared/api';
import { APP_ROUTES } from '@/shared/constants';

const BASE = APP_ROUTES.INSCRIPCIONES;

export const inscripcionRoutes = {
  list: BASE,
  dashboard: `${BASE}/dashboard`,
  create: `${BASE}/crear`,
  detail: (id: string): string => `${BASE}/${pathSegment(id)}`,
  edit: (id: string): string => `${BASE}/${pathSegment(id)}/editar`,
  withQuery: (path: string, query: string): string =>
    query ? `${path}?${query}` : path,
} as const;
