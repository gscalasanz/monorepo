/** HTTP del módulo eventos (eventos, KPIs, cierre, reporte público, ingresos/gastos). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  ESTADO_PAGO,
  eventoKpisSchema,
  eventoSchema,
  eventosSchema,
  movimientoSchema,
  movimientosSchema,
  type CreateEventoDto,
  type Evento,
  type EventoKpis,
  type Movimiento,
  type RegistrarGastoEventoDto,
  type RegistrarIngresoEventoDto,
  type UpdateEventoDto,
} from '@/shared/domain';

/** `GET /eventos` (fecha DESC, con `productos`). */
export function fetchEventos(signal?: AbortSignal): Promise<readonly Evento[]> {
  return apiClient.get(API_ENDPOINTS.EVENTOS, {
    schema: eventosSchema,
    signal,
  });
}

/** `GET /eventos/:id` (el `resumenFinanciero` se lee de `/kpis`). */
export function fetchEvento(id: string, signal?: AbortSignal): Promise<Evento> {
  return apiClient.get(API_ENDPOINTS.evento(id), {
    schema: eventoSchema,
    signal,
  });
}

export function createEvento(dto: CreateEventoDto): Promise<Evento> {
  return apiClient.post(API_ENDPOINTS.EVENTOS, {
    body: dto,
    schema: eventoSchema,
  });
}

export function updateEvento(params: {
  readonly id: string;
  readonly dto: UpdateEventoDto;
}): Promise<Evento> {
  return apiClient.patch(API_ENDPOINTS.evento(params.id), {
    body: params.dto,
    schema: eventoSchema,
  });
}

export function deleteEvento(id: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.evento(id));
}

export function cerrarEvento(id: string): Promise<Evento> {
  return apiClient.post(API_ENDPOINTS.eventoCerrar(id), {
    body: {},
    schema: eventoSchema,
  });
}

/** Irreversible: el backend genera los movimientos de las ventas ya cargadas. */
export function habilitarMovimientos(id: string): Promise<Evento> {
  return apiClient.post(API_ENDPOINTS.eventoHabilitarMovimientos(id), {
    body: {},
    schema: eventoSchema,
  });
}

export function updateReportePublico(params: {
  readonly id: string;
  readonly reportePublico: boolean;
}): Promise<Evento> {
  return apiClient.patch(API_ENDPOINTS.eventoReportePublicoToggle(params.id), {
    body: { reportePublico: params.reportePublico },
    schema: eventoSchema,
  });
}

export function fetchEventoKpis(
  id: string,
  signal?: AbortSignal,
): Promise<EventoKpis> {
  return apiClient.get(API_ENDPOINTS.eventoKpis(id), {
    schema: eventoKpisSchema,
    signal,
  });
}

/** `GET /eventos/:id/movimientos` (con `responsable`). */
export function fetchEventoMovimientos(
  id: string,
  signal?: AbortSignal,
): Promise<readonly Movimiento[]> {
  return apiClient.get(API_ENDPOINTS.eventoMovimientos(id), {
    schema: movimientosSchema,
    signal,
  });
}

/** Solo eventos de grupo. Devuelve void (la lista se recarga). */
export function registrarIngreso(params: {
  readonly id: string;
  readonly dto: RegistrarIngresoEventoDto;
}): Promise<void> {
  return apiClient.post(API_ENDPOINTS.eventoIngresos(params.id), {
    body: params.dto,
  });
}

/** El DTO NO lleva `fecha` (`toGastoEventoDto`): el backend la rechaza con 400. */
export function registrarGasto(params: {
  readonly id: string;
  readonly dto: RegistrarGastoEventoDto;
}): Promise<void> {
  return apiClient.post(API_ENDPOINTS.eventoGastos(params.id), {
    body: params.dto,
  });
}

export function deleteMovimiento(movimientoId: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.movimiento(movimientoId));
}

/** Marca un gasto pendiente de reembolso como pagado. */
export function pagarReembolso(movimientoId: string): Promise<Movimiento> {
  return apiClient.patch(API_ENDPOINTS.movimiento(movimientoId), {
    body: { estadoPago: ESTADO_PAGO.PAGADO },
    schema: movimientoSchema,
  });
}
