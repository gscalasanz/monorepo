/** Llamadas de `/inscripciones` (port de `InscripcionesApiService`). */
import { API_ENDPOINTS, apiClient, isApiError } from '@/shared/api';
import {
  inscripcionSchema,
  inscripcionesConsolidadoSchema,
  inscripcionesSchema,
  type CreateInscripcionDto,
  type Inscripcion,
  type InscripcionesConsolidado,
  type InscripcionesQuery,
  type MedioPago,
  type PagoInscripcionDto,
  type UpdateInscripcionDto,
} from '@/shared/domain';

/** `PATCH /movimientos/:id` para editar un pago de inscripción. */
export interface UpdatePagoDto {
  readonly monto: number;
  readonly medioPago: MedioPago;
  readonly descripcion?: string;
}

export interface PagoRef {
  readonly inscripcionId: string;
  readonly movimientoId: string;
}

function queryParams(query: InscripcionesQuery) {
  return {
    ano: query.ano,
    tipo: query.tipo,
    tipoDeuda: query.tipoDeuda,
    rama: query.rama,
  };
}

export function fetchInscripciones(params: {
  readonly query: InscripcionesQuery;
  readonly signal?: AbortSignal;
}): Promise<readonly Inscripcion[]> {
  return apiClient.get(API_ENDPOINTS.INSCRIPCIONES, {
    schema: inscripcionesSchema,
    params: queryParams(params.query),
    signal: params.signal,
  });
}

export function fetchConsolidado(params: {
  readonly query: InscripcionesQuery;
  readonly signal?: AbortSignal;
}): Promise<InscripcionesConsolidado> {
  return apiClient.get(API_ENDPOINTS.INSCRIPCIONES_CONSOLIDADO, {
    schema: inscripcionesConsolidadoSchema,
    params: queryParams(params.query),
    signal: params.signal,
  });
}

export function fetchInscripcion(
  id: string,
  signal?: AbortSignal,
): Promise<Inscripcion> {
  return apiClient.get(API_ENDPOINTS.inscripcion(id), {
    schema: inscripcionSchema,
    signal,
  });
}

export function createInscripcion(
  dto: CreateInscripcionDto,
): Promise<Inscripcion> {
  return apiClient.post(API_ENDPOINTS.INSCRIPCIONES, {
    body: dto,
    schema: inscripcionSchema,
  });
}

export function updateInscripcion(
  id: string,
  dto: UpdateInscripcionDto,
): Promise<Inscripcion> {
  return apiClient.patch(API_ENDPOINTS.inscripcion(id), {
    body: dto,
    schema: inscripcionSchema,
  });
}

export function deleteInscripcion(id: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.inscripcion(id));
}

export function pagarInscripcion(
  id: string,
  dto: PagoInscripcionDto,
): Promise<Inscripcion> {
  return apiClient.post(API_ENDPOINTS.inscripcionPagar(id), {
    body: dto,
    schema: inscripcionSchema,
  });
}

/** Edita el movimiento del pago y vuelve a leer la inscripción (paridad con Angular). */
export async function updatePago(
  ref: PagoRef,
  dto: UpdatePagoDto,
): Promise<Inscripcion> {
  await apiClient.patch(API_ENDPOINTS.movimiento(ref.movimientoId), {
    body: dto,
  });
  return fetchInscripcion(ref.inscripcionId);
}

export function deletePago(ref: PagoRef): Promise<Inscripcion> {
  return apiClient.delete(
    API_ENDPOINTS.inscripcionPago({
      id: ref.inscripcionId,
      movimientoId: ref.movimientoId,
    }),
    { schema: inscripcionSchema },
  );
}

/** Fija el monto bonificado total (no un delta), contra el fondo solidario. */
export function bonificarInscripcion(
  id: string,
  monto: number,
): Promise<Inscripcion> {
  return apiClient.patch(API_ENDPOINTS.inscripcionBonificacion(id), {
    body: { monto },
    schema: inscripcionSchema,
  });
}

export function quitarBonificacion(id: string): Promise<Inscripcion> {
  return apiClient.delete(API_ENDPOINTS.inscripcionBonificacion(id), {
    schema: inscripcionSchema,
  });
}

const HTTP_NOT_FOUND = 404;

/** Detalle: `null` si no existe (404 → "Inscripción no encontrada", sin romper la vista). */
export async function fetchInscripcionOrNull(id: string, signal?: AbortSignal): Promise<Inscripcion | null> {
  try {
    return await fetchInscripcion(id, signal);
  } catch (cause) {
    if (isApiError(cause) && cause.status === HTTP_NOT_FOUND) return null;
    throw cause;
  }
}
