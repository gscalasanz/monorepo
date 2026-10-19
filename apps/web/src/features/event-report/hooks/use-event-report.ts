'use client';

import { useHasTokens } from '@/shared/auth';
import { useAsyncData } from '@/shared/hooks';
import { loadEventReport } from '@/features/event-report/helpers/load-report';
import type { EventReportOutcome } from '@/features/event-report/models/report';

export type EventReportState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | EventReportOutcome;

export interface EventReportResult {
  readonly state: EventReportState;
  /** `true` si hay tokens (muestra "Volver al evento"). */
  readonly withSession: boolean;
  readonly reload: () => Promise<void>;
}

/**
 * Carga el reporte con el endpoint que corresponde a la sesión. Espera a
 * conocer los tokens (cliente) para no pegarle al endpoint equivocado.
 */
export function useEventReport(eventoId: string): EventReportResult {
  const hasTokens = useHasTokens();
  const withSession = hasTokens === true;
  const query = useAsyncData({
    key: `${eventoId}|${String(withSession)}`,
    load: (signal) => loadEventReport({ eventoId, withSession, signal }),
    enabled: hasTokens !== null,
  });
  const state: EventReportState =
    hasTokens === null || query.isLoading
      ? { status: 'loading' }
      : query.error !== null
        ? { status: 'error' }
        : (query.data ?? { status: 'loading' });
  return { state, withSession, reload: query.reload };
}
