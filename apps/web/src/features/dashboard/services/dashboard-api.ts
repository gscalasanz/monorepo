/** Llamadas del dashboard (port de los services que usaba `DashboardComponent` + deudas e inscripciones). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  campamentosSchema,
  consolidadoSaldosSchema,
  eventosSchema,
  inscripcionesSchema,
  movimientosSchema,
  personasDeudaSchema,
  type Campamento,
  type ConsolidadoSaldos,
  type Evento,
  type Inscripcion,
  type Movimiento,
  type PersonaDeuda,
} from '@/shared/domain';
import { currentYearBsAs } from '@/shared/time';

export interface DashboardData {
  readonly consolidado: ConsolidadoSaldos | null;
  readonly eventos: readonly Evento[];
  readonly campamentos: readonly Campamento[];
  readonly recientes: readonly Movimiento[];
  readonly deudas: readonly PersonaDeuda[];
  /** Inscripciones del año en curso. */
  readonly inscripciones: readonly Inscripcion[];
}

/** Paridad: si una lista falla, queda vacía (el toast global igual aparece). */
const emptyOnError = <T>(promise: Promise<readonly T[]>): Promise<readonly T[]> =>
  promise.catch(() => []);

export async function fetchDashboardData(signal: AbortSignal): Promise<DashboardData> {
  const [consolidado, eventos, campamentos, recientes, deudas, inscripciones] = await Promise.all([
    apiClient
      .get(API_ENDPOINTS.CAJAS_CONSOLIDADO, { schema: consolidadoSaldosSchema, signal })
      .catch(() => null),
    emptyOnError(apiClient.get(API_ENDPOINTS.EVENTOS, { schema: eventosSchema, signal })),
    emptyOnError(apiClient.get(API_ENDPOINTS.CAMPAMENTOS, { schema: campamentosSchema, signal })),
    emptyOnError(
      apiClient.get(API_ENDPOINTS.MOVIMIENTOS_RECIENTES, { schema: movimientosSchema, signal }),
    ),
    emptyOnError(apiClient.get(API_ENDPOINTS.REPORTES_DEUDAS, { schema: personasDeudaSchema, signal })),
    emptyOnError(
      apiClient.get(API_ENDPOINTS.INSCRIPCIONES, {
        schema: inscripcionesSchema,
        params: { ano: currentYearBsAs() },
        signal,
      }),
    ),
  ]);
  return { consolidado, eventos, campamentos, recientes, deudas, inscripciones };
}
