/** Llamadas de movimientos (port de `MovimientosApiService`). */
import { API_ENDPOINTS, apiClient, type QueryParams } from '@/shared/api';
import {
  movimientoSchema,
  movimientosPaginatedSchema,
  type CajaConSaldo,
  type CreateMovimientoDto,
  type Movimiento,
  type PaginatedResponse,
  type Persona,
  type UpdateMovimientoDto,
} from '@/shared/domain';
import { fetchCajas, fetchPersonasActivas } from '@/shared/queries';

/** `GET /movimientos?page&limit&…` → `{ data, meta }`. */
export function fetchMovimientosPage(params: {
  readonly query: QueryParams;
  readonly signal: AbortSignal;
}): Promise<PaginatedResponse<Movimiento>> {
  return apiClient.get(API_ENDPOINTS.MOVIMIENTOS, {
    schema: movimientosPaginatedSchema,
    params: params.query,
    signal: params.signal,
  });
}

/** `GET /movimientos/:id` (con caja, responsable y persona a reembolsar). */
export function fetchMovimiento(
  id: string,
  signal?: AbortSignal,
): Promise<Movimiento> {
  return apiClient.get(API_ENDPOINTS.movimiento(id), {
    schema: movimientoSchema,
    signal,
  });
}

/** Los errores se muestran en el form (toast propio), no en el bus global. */
export function createMovimiento(dto: CreateMovimientoDto): Promise<void> {
  return apiClient.post(API_ENDPOINTS.MOVIMIENTOS, {
    body: dto,
    skipGlobalError: true,
  });
}

export function updateMovimiento(
  id: string,
  dto: UpdateMovimientoDto,
): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.movimiento(id), {
    body: dto,
    skipGlobalError: true,
  });
}

/** El error (400 del back) se muestra dentro del diálogo de confirmación. */
export function deleteMovimiento(id: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.movimiento(id), {
    skipGlobalError: true,
  });
}

export interface MovimientoFormOptions {
  readonly cajas: readonly CajaConSaldo[];
  readonly personas: readonly Persona[];
}

/** Datos del form de alta: `GET /cajas` + `GET /personas?soloActivos=true`. */
export async function fetchCreateFormData(
  signal: AbortSignal,
): Promise<MovimientoFormOptions> {
  const [cajas, personas] = await Promise.all([
    fetchCajas(signal),
    fetchPersonasActivas(signal),
  ]);
  return { cajas, personas };
}

export interface MovimientoEditData {
  readonly movimiento: Movimiento;
  readonly personas: readonly Persona[];
}

/** Datos del form de edición: el movimiento + personas activas para el selector. */
export async function fetchEditFormData(params: {
  readonly id: string;
  readonly signal: AbortSignal;
}): Promise<MovimientoEditData> {
  const [movimiento, personas] = await Promise.all([
    fetchMovimiento(params.id, params.signal),
    fetchPersonasActivas(params.signal),
  ]);
  return { movimiento, personas };
}
