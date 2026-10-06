import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { personasDeudaSchema, type DeudaFilters, type PersonaDeuda } from '@/features/reportes/models/deudas';

/** `GET /reportes/deudas?rama&ano&tipo`. El error lo muestra la pantalla (sin toast global). */
export function fetchDeudas(filters: DeudaFilters, signal: AbortSignal): Promise<readonly PersonaDeuda[]> {
  return apiClient.get(API_ENDPOINTS.REPORTES_DEUDAS, {
    schema: personasDeudaSchema,
    params: { ...filters },
    signal,
    skipGlobalError: true,
  });
}
