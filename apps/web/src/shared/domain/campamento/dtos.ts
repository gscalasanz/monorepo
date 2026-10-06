/** Bodies de `/campamentos`. Fechas calendario como `YYYY-MM-DD`. */
import type { EstadoPago, MedioPago } from '@/shared/domain/movimiento';

/** `POST /campamentos` */
export interface CreateCampamentoDto {
  readonly nombre: string;
  readonly descripcion?: string;
  readonly fechaInicio: string;
  readonly fechaFin: string;
  readonly costoPorPersona: number;
  /** 0 = educadores exentos. */
  readonly costoEducadores?: number;
  readonly cuotasBase?: number;
}

/** `PATCH /campamentos/:id` */
export type UpdateCampamentoDto = Partial<CreateCampamentoDto>;

/** `POST /campamentos/:id/participantes` */
export interface AddParticipanteDto {
  readonly personaId: string;
  readonly autorizacionEntregada?: boolean;
}

/** `PATCH /campamentos/:id/participantes/:personaId` */
export interface UpdateParticipanteAutorizacionDto {
  readonly autorizacionEntregada: boolean;
}

/** `POST /campamentos/:id/pagos/:personaId` (pago mixto: físico + saldo personal). */
export interface RegistrarPagoCampamentoDto {
  /** Efectivo/transferencia (≥ 0). */
  readonly montoPagado: number;
  readonly montoConSaldoPersonal?: number;
  /** Obligatorio si `montoPagado` > 0. */
  readonly medioPago?: MedioPago;
  readonly descripcion?: string;
}

/** `POST /campamentos/:id/gastos` */
export interface RegistrarGastoCampamentoDto {
  readonly monto: number;
  readonly descripcion: string;
  readonly responsableId: string;
  readonly medioPago: MedioPago;
  readonly estadoPago: EstadoPago;
  readonly fecha: string;
  readonly personaAReembolsarId?: string;
}
