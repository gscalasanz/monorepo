/** Historial de movimientos para el gráfico de evolución (`GET /movimientos`, único endpoint paginado). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { PAGINATION_DEFAULTS, movimientosPaginatedSchema, type Movimiento } from '@/shared/domain';
import { dayFilterBounds, type LocalDate } from '@/shared/time';
import { MAX_HISTORY_PAGES } from '@/features/dashboard/constants/cash-flow';

export interface MovimientosHistory {
  readonly movimientos: readonly Movimiento[];
  /** `true` si había más páginas que `MAX_HISTORY_PAGES` y se cortó el historial. */
  readonly truncated: boolean;
}

interface PageRequest {
  readonly page: number;
  readonly fechaInicio: string | undefined;
  readonly signal: AbortSignal;
}

function fetchPage({ page, fechaInicio, signal }: PageRequest) {
  return apiClient.get(API_ENDPOINTS.MOVIMIENTOS, {
    schema: movimientosPaginatedSchema,
    params: { page, limit: PAGINATION_DEFAULTS.MAX_LIMIT, fechaInicio },
    signal,
  });
}

/** Todos los movimientos desde `from` (inclusive): página 1 y, con su `totalPages`, el resto en paralelo. */
export async function fetchMovimientosSince(params: {
  readonly from: LocalDate;
  readonly signal: AbortSignal;
}): Promise<MovimientosHistory> {
  const { signal } = params;
  const fechaInicio = dayFilterBounds({ from: params.from }).from;
  const first = await fetchPage({ page: 1, fechaInicio, signal });
  const lastPage = Math.min(first.meta.totalPages, MAX_HISTORY_PAGES);
  const pageNumbers = Array.from({ length: Math.max(0, lastPage - 1) }, (_, i) => i + 2);
  const rest = await Promise.all(pageNumbers.map((page) => fetchPage({ page, fechaInicio, signal })));
  return {
    movimientos: [first, ...rest].flatMap((p) => p.data),
    truncated: first.meta.totalPages > MAX_HISTORY_PAGES,
  };
}
