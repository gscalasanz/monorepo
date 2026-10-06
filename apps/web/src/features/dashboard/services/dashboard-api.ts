/** Llamadas del dashboard (port de los services que usaba `DashboardComponent`). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  consolidadoSaldosSchema,
  eventosSchema,
  movimientosSchema,
  type ConsolidadoSaldos,
  type Evento,
  type Movimiento,
} from '@/shared/domain';

export interface DashboardData {
  readonly consolidado: ConsolidadoSaldos | null;
  readonly eventos: readonly Evento[];
  readonly recientes: readonly Movimiento[];
}

/** Paridad: si eventos/recientes fallan, la lista queda vacía (el toast global igual aparece). */
const emptyOnError = <T>(promise: Promise<readonly T[]>): Promise<readonly T[]> =>
  promise.catch(() => []);

export async function fetchDashboardData(signal: AbortSignal): Promise<DashboardData> {
  const [consolidado, eventos, recientes] = await Promise.all([
    apiClient
      .get(API_ENDPOINTS.CAJAS_CONSOLIDADO, { schema: consolidadoSaldosSchema, signal })
      .catch(() => null),
    emptyOnError(apiClient.get(API_ENDPOINTS.EVENTOS, { schema: eventosSchema, signal })),
    emptyOnError(
      apiClient.get(API_ENDPOINTS.MOVIMIENTOS_RECIENTES, { schema: movimientosSchema, signal }),
    ),
  ]);
  return { consolidado, eventos, recientes };
}
