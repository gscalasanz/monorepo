/** Rutas de la app (paridad con `frontend/src/app/app.routes.ts`). */
import { pathSegment } from '@/shared/api';
import type { PersonaType } from '@/shared/domain';

export const APP_ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  /** Destino post-login si no había `redirectUrl` guardada. */
  DEFAULT_AFTER_LOGIN: '/dashboard',
  PERSONAS: '/personas',
  CAJAS: '/cajas',
  MOVIMIENTOS: '/movimientos',
  INSCRIPCIONES: '/inscripciones',
  EVENTOS: '/eventos',
  CAMPAMENTOS: '/campamentos',
  REPORTES: '/reportes',
  CONFIGURACION: '/configuracion',
  /** Reporte público: accesible sin sesión. */
  eventoReportePublico: (eventoId: string): string =>
    `/eventos/${pathSegment(eventoId)}/reporte`,
} as const;

/** Ruta base de cada tipo de persona (port de `PERSONA_TYPE_ROUTES`). */
export const PERSONA_TYPE_ROUTES: Readonly<Record<PersonaType, string>> = {
  protagonista: '/personas/protagonistas',
  educador: '/personas/educadores',
  externo: '/personas/personas-externas',
  // Una agrupación no tiene ficha propia: apunta al listado.
  agrupacion: '/personas',
};
