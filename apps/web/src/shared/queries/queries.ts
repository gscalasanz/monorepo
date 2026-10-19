/**
 * Lecturas que comparten varios features (personas para selectores, cajas,
 * fondo solidario, saldo personal). Cada feature tiene sus propios services
 * para lo suyo; esto evita duplicar las consultas transversales.
 */
import { API_ENDPOINTS, QUERY_PARAMS, apiClient } from '@/shared/api';
import {
  cajasResponseSchema,
  fondoSolidarioSchema,
  personasSchema,
  saldoPersonalSchema,
  type CajaConSaldo,
  type FondoSolidario,
  type Persona,
} from '@/shared/domain';

/** `GET /personas?soloActivos=true`: personas habilitadas para selectores (sin agrupación). */
export function fetchPersonasActivas(signal?: AbortSignal): Promise<readonly Persona[]> {
  return apiClient.get(API_ENDPOINTS.PERSONAS, {
    schema: personasSchema,
    params: { [QUERY_PARAMS.SOLO_ACTIVOS]: true },
    signal,
  });
}

/** `GET /personas`: todas (incluye deshabilitadas). Ojo: `soloActivos=false` se lee como `true`. */
export function fetchPersonasTodas(signal?: AbortSignal): Promise<readonly Persona[]> {
  return apiClient.get(API_ENDPOINTS.PERSONAS, { schema: personasSchema, signal });
}

/** `GET /cajas` (todas, con `saldoActual`). */
export function fetchCajas(signal?: AbortSignal): Promise<readonly CajaConSaldo[]> {
  return apiClient.get(API_ENDPOINTS.CAJAS, { schema: cajasResponseSchema, signal });
}

/** `GET /cajas/fondo-solidario` → `{ caja | null, historial }`. */
export function fetchFondoSolidario(signal?: AbortSignal): Promise<FondoSolidario> {
  return apiClient.get(API_ENDPOINTS.CAJAS_FONDO_SOLIDARIO, { schema: fondoSolidarioSchema, signal });
}

/** Saldo disponible del fondo solidario (0 si la caja no existe). */
export async function fetchSaldoFondoSolidario(signal?: AbortSignal): Promise<number> {
  const { caja } = await fetchFondoSolidario(signal);
  return caja?.saldoActual ?? 0;
}

/** `GET /cajas/personal/:personaId/saldo` → saldo de la cuenta personal. */
export async function fetchSaldoPersonal(personaId: string, signal?: AbortSignal): Promise<number> {
  const { saldo } = await apiClient.get(API_ENDPOINTS.saldoPersonal(personaId), {
    schema: saldoPersonalSchema,
    signal,
  });
  return saldo;
}
