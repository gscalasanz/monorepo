import { isApiError } from '@/shared/api';
import type { EventReportOutcome } from '@/features/event-report/models/report';
import {
  fetchReporte,
  fetchReportePublico,
} from '@/features/event-report/services/event-report-api';

const HTTP_NOT_FOUND = 404;

export interface LoadReportInput {
  readonly eventoId: string;
  /** Hay tokens → endpoint autenticado; si no, el público. */
  readonly withSession: boolean;
  readonly signal: AbortSignal;
}

/**
 * Con sesión usa el endpoint autenticado (ve el reporte siempre). Anónimo usa
 * el público: un 404 ahí significa "no es público" → `unavailable`, no error.
 * Cualquier otro error se propaga (pantalla de error).
 */
export async function loadEventReport({
  eventoId,
  withSession,
  signal,
}: LoadReportInput): Promise<EventReportOutcome> {
  try {
    const reporte = withSession
      ? await fetchReporte({ eventoId, signal })
      : await fetchReportePublico({ eventoId, signal });
    return { status: 'ok', reporte };
  } catch (cause) {
    if (!withSession && isApiError(cause) && cause.status === HTTP_NOT_FOUND) {
      return { status: 'unavailable' };
    }
    throw cause;
  }
}
