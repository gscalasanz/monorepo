import { pathSegment } from '@/shared/api';
import { APP_ROUTES } from '@/shared/constants';

/** Rutas del módulo (paridad con `campamentos.routes.ts` de Angular). */
export const CAMPAMENTO_ROUTES = {
  LIST: APP_ROUTES.CAMPAMENTOS,
  CREATE: `${APP_ROUTES.CAMPAMENTOS}/crear`,
  detail: (id: string): string => `${APP_ROUTES.CAMPAMENTOS}/${pathSegment(id)}`,
  edit: (id: string): string => `${APP_ROUTES.CAMPAMENTOS}/${pathSegment(id)}/editar`,
} as const;
