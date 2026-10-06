/** Llamadas HTTP del módulo personas (port de `PersonasApiService`). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  personaSchema,
  personasSchema,
  transferirSaldoResultSchema,
  type CreateEducadorDto,
  type CreatePersonaExternaDto,
  type CreateProtagonistaDto,
  type EstadoPersona,
  type Persona,
  type TransferirSaldoResult,
  type UpdatePersonaDto,
} from '@/shared/domain';
import {
  personaDashboardSchema,
  type PersonaDashboard,
} from '@/features/personas/models/dashboard-schema';

/** `GET /personas`: todas (incluidas las deshabilitadas), orden nombre ASC. */
export function fetchPersonas(signal: AbortSignal): Promise<Persona[]> {
  return apiClient.get(API_ENDPOINTS.PERSONAS, {
    schema: personasSchema,
    signal,
  });
}

export function fetchPersona(params: {
  readonly id: string;
  readonly signal: AbortSignal;
}): Promise<Persona> {
  return apiClient.get(API_ENDPOINTS.persona(params.id), {
    schema: personaSchema,
    signal: params.signal,
  });
}

export function fetchPersonaDashboard(params: {
  readonly id: string;
  readonly signal: AbortSignal;
}): Promise<PersonaDashboard> {
  return apiClient.get(API_ENDPOINTS.personaDashboard(params.id), {
    schema: personaDashboardSchema,
    signal: params.signal,
  });
}

export function createProtagonista(
  dto: CreateProtagonistaDto,
): Promise<Persona> {
  return apiClient.post(API_ENDPOINTS.PROTAGONISTAS, {
    body: dto,
    schema: personaSchema,
  });
}

export function createEducador(dto: CreateEducadorDto): Promise<Persona> {
  return apiClient.post(API_ENDPOINTS.EDUCADORES, {
    body: dto,
    schema: personaSchema,
  });
}

export function createPersonaExterna(
  dto: CreatePersonaExternaDto,
): Promise<Persona> {
  return apiClient.post(API_ENDPOINTS.PERSONAS_EXTERNAS, {
    body: dto,
    schema: personaSchema,
  });
}

export function updatePersona(params: {
  readonly id: string;
  readonly dto: UpdatePersonaDto;
}): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.persona(params.id), {
    body: params.dto,
  });
}

/**
 * Deshabilitar/rehabilitar. Sin toast global: el error se muestra dentro del
 * diálogo de confirmación.
 */
export function setPersonaEstado(params: {
  readonly id: string;
  readonly estado: EstadoPersona;
}): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.persona(params.id), {
    body: { estado: params.estado } satisfies UpdatePersonaDto,
    skipGlobalError: true,
  });
}

/** Soft delete. El 400 del backend ("es responsable de N movimiento(s)") se muestra en el diálogo. */
export function deletePersona(id: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.persona(id), { skipGlobalError: true });
}

export function transferirSaldoAGrupo(
  id: string,
): Promise<TransferirSaldoResult> {
  return apiClient.post(API_ENDPOINTS.personaTransferirSaldo(id), {
    schema: transferirSaldoResultSchema,
    skipGlobalError: true,
  });
}
