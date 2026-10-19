/**
 * Llamadas HTTP de Campamentos (port de `campamentos-api.service.ts`). Las
 * lecturas validan con los schemas de `@/shared/domain`; los errores de las
 * mutaciones disparan el toast global salvo que se pida `skipGlobalError`.
 */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  ESTADO_PAGO,
  campamentoDetalleSchema,
  campamentoSchema,
  campamentosSchema,
  eliminarPagoCampamentoResultSchema,
  resultadoPagoCampamentoSchema,
  type AddParticipanteDto,
  type Campamento,
  type CampamentoDetalle,
  type CreateCampamentoDto,
  type EliminarPagoCampamentoResult,
  type RegistrarGastoCampamentoDto,
  type RegistrarPagoCampamentoDto,
  type ResultadoPagoCampamento,
  type UpdateCampamentoDto,
} from '@/shared/domain';
import type { DetalleQuery } from '@/features/campamentos/helpers/detalle-query';

/** Opción común: los diálogos muestran el error inline en vez del toast global. */
export interface MutationOptions {
  readonly skipGlobalError?: boolean;
}

export interface ParticipanteRef {
  readonly campamentoId: string;
  readonly personaId: string;
}

export function fetchCampamentos(signal: AbortSignal): Promise<readonly Campamento[]> {
  return apiClient.get(API_ENDPOINTS.CAMPAMENTOS, { schema: campamentosSchema, signal });
}

export function fetchCampamento(id: string, signal: AbortSignal): Promise<Campamento> {
  return apiClient.get(API_ENDPOINTS.campamento(id), { schema: campamentoSchema, signal });
}

/** `GET /campamentos/:id/detalle?filtroMovimientos&nombre&rama` */
export function fetchCampamentoDetalle(
  query: DetalleQuery,
  signal: AbortSignal,
): Promise<CampamentoDetalle> {
  const { id, ...params } = query;
  return apiClient.get(API_ENDPOINTS.campamentoDetalle(id), {
    schema: campamentoDetalleSchema,
    params: { ...params },
    signal,
  });
}

export function createCampamento(dto: CreateCampamentoDto): Promise<Campamento> {
  return apiClient.post(API_ENDPOINTS.CAMPAMENTOS, { body: dto, schema: campamentoSchema });
}

export function updateCampamento(id: string, dto: UpdateCampamentoDto): Promise<Campamento> {
  return apiClient.patch(API_ENDPOINTS.campamento(id), { body: dto, schema: campamentoSchema });
}

export function deleteCampamento(id: string, options: MutationOptions = {}): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.campamento(id), options);
}

export function addParticipante(
  campamentoId: string,
  dto: AddParticipanteDto,
): Promise<void> {
  return apiClient.post(API_ENDPOINTS.campamentoParticipantes(campamentoId), {
    body: dto,
    skipGlobalError: true,
  });
}

export function removeParticipante(ref: ParticipanteRef): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.campamentoParticipante(ref.campamentoId, ref.personaId), {
    skipGlobalError: true,
  });
}

export function updateAutorizacion(
  ref: ParticipanteRef,
  autorizacionEntregada: boolean,
): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.campamentoParticipante(ref.campamentoId, ref.personaId), {
    body: { autorizacionEntregada },
  });
}

/** `PATCH …/bonificacion {monto}`: `monto` es el TOTAL deseado, no un delta. */
export function bonificarParticipante({
  campamentoId,
  personaId,
  monto,
}: ParticipanteRef & { readonly monto: number }): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.campamentoBonificacion(campamentoId, personaId), {
    body: { monto },
    skipGlobalError: true,
  });
}

export function quitarBonificacion(
  ref: ParticipanteRef,
  options: MutationOptions = {},
): Promise<void> {
  return apiClient.delete(
    API_ENDPOINTS.campamentoBonificacion(ref.campamentoId, ref.personaId),
    options,
  );
}

export function registrarPago(
  ref: ParticipanteRef,
  dto: RegistrarPagoCampamentoDto,
): Promise<ResultadoPagoCampamento> {
  return apiClient.post(API_ENDPOINTS.campamentoPagos(ref.campamentoId, ref.personaId), {
    body: dto,
    schema: resultadoPagoCampamentoSchema,
    skipGlobalError: true,
  });
}

export function eliminarPago(
  campamentoId: string,
  movimientoId: string,
): Promise<EliminarPagoCampamentoResult> {
  return apiClient.delete(API_ENDPOINTS.campamentoPagos(campamentoId, movimientoId), {
    schema: eliminarPagoCampamentoResultSchema,
    skipGlobalError: true,
  });
}

export function registrarGasto(
  campamentoId: string,
  dto: RegistrarGastoCampamentoDto,
): Promise<void> {
  return apiClient.post(API_ENDPOINTS.campamentoGastos(campamentoId), {
    body: dto,
    skipGlobalError: true,
  });
}

/** `PATCH /movimientos/:id {estadoPago:'pagado'}` (pago de reembolso pendiente). */
export function marcarReembolsoPagado(movimientoId: string): Promise<void> {
  return apiClient.patch(API_ENDPOINTS.movimiento(movimientoId), {
    body: { estadoPago: ESTADO_PAGO.PAGADO },
    skipGlobalError: true,
  });
}
