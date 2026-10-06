/** Constantes del módulo personas (tabs, rutas, límites de validación). */
import { pathSegment } from '@/shared/api';
import { APP_ROUTES, PERSONA_TYPE_ROUTES } from '@/shared/constants';
import {
  RAMA,
  RAMA_TAB_KEYS,
  type PersonaType,
  type RamaTabKey,
} from '@/shared/domain';

export const PERSONA_TAB = {
  EDUCADORES: 'educadores',
  EXTERNOS: 'externos',
} as const;

export type PersonaTabKey = (typeof PERSONA_TAB)[keyof typeof PERSONA_TAB];

/** Tab del listado: una por rama + educadores + externos. */
export type PersonasTab = RamaTabKey | PersonaTabKey;

/** Paridad: la pestaña inicial es Manada. */
export const DEFAULT_TAB: PersonasTab = RAMA_TAB_KEYS[RAMA.MANADA];

/** Clave del filtro de búsqueda en la `FilterBar` del listado. */
export const SEARCH_FILTER_KEY = 'search';

/** Límites de validación (`personas-form.builder.ts`). */
export const PERSONA_LIMITS = {
  NOMBRE_MIN: 2,
  NOMBRE_MAX: 100,
  CONTACTO_MAX: 100,
  PASSWORD_MIN: 8,
} as const;

const CREATE_SEGMENT = 'crear';
const EDIT_SEGMENT = 'editar';

/** Rutas del módulo (bases de `PERSONA_TYPE_ROUTES`). */
export const PERSONA_ROUTES = {
  LIST: APP_ROUTES.PERSONAS,
  detail: (params: {
    readonly tipo: PersonaType;
    readonly id: string;
  }): string => `${PERSONA_TYPE_ROUTES[params.tipo]}/${pathSegment(params.id)}`,
  edit: (params: { readonly tipo: PersonaType; readonly id: string }): string =>
    `${PERSONA_TYPE_ROUTES[params.tipo]}/${pathSegment(params.id)}/${EDIT_SEGMENT}`,
  create: (tipo: PersonaType): string =>
    `${PERSONA_TYPE_ROUTES[tipo]}/${CREATE_SEGMENT}`,
  inscripcion: (id: string): string =>
    `${APP_ROUTES.INSCRIPCIONES}/${pathSegment(id)}`,
  campamento: (id: string): string =>
    `${APP_ROUTES.CAMPAMENTOS}/${pathSegment(id)}`,
} as const;
