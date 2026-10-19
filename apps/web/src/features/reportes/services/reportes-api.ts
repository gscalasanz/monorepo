import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { consolidadoDeudasSchema, type ConsolidadoDeudas } from '@/features/reportes/models/consolidado';
import {
  personasDeudaSchema,
  type ConsolidadoFilters,
  type DeudaFilters,
  type PersonaDeuda,
} from '@/features/reportes/models/deudas';

/** `GET /reportes/deudas?rama&ano&tipo&q&campamentoId`. El error lo muestra la pantalla (sin toast global). */
export function fetchDeudas(filters: DeudaFilters, signal: AbortSignal): Promise<readonly PersonaDeuda[]> {
  return apiClient.get(API_ENDPOINTS.REPORTES_DEUDAS, {
    schema: personasDeudaSchema,
    params: { ...filters },
    signal,
    skipGlobalError: true,
  });
}

/** `GET /reportes/deudas/consolidado?rama`: deuda por origen, solo lo que todavía debe plata. */
export function fetchConsolidado(filters: ConsolidadoFilters, signal: AbortSignal): Promise<ConsolidadoDeudas> {
  return apiClient.get(API_ENDPOINTS.REPORTES_DEUDAS_CONSOLIDADO, {
    schema: consolidadoDeudasSchema,
    params: { ...filters },
    signal,
    skipGlobalError: true,
  });
}
