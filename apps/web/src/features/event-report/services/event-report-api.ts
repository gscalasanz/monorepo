import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { reporteEventoSchema, type ReporteEvento } from '@/shared/domain';

export interface FetchReportInput {
  readonly eventoId: string;
  readonly signal: AbortSignal;
}

/** `GET /eventos/:id/reporte` (con sesión: ve el reporte siempre; errores con toast global). */
export function fetchReporte({
  eventoId,
  signal,
}: FetchReportInput): Promise<ReporteEvento> {
  return apiClient.get(API_ENDPOINTS.eventoReporte(eventoId), {
    schema: reporteEventoSchema,
    signal,
  });
}

/**
 * `GET /eventos/:id/reporte/publico` (anónimo). 404 si el reporte no es público:
 * lo maneja la pantalla ("no disponible"), sin toast global.
 */
export function fetchReportePublico({
  eventoId,
  signal,
}: FetchReportInput): Promise<ReporteEvento> {
  return apiClient.get(API_ENDPOINTS.eventoReportePublico(eventoId), {
    schema: reporteEventoSchema,
    signal,
    skipGlobalError: true,
  });
}
