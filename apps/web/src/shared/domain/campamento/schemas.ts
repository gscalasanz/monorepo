/** Respuestas de `/campamentos` (`campamentos.service.ts`, `dtos/campamento-detalle.dto.ts`). */
import { z } from 'zod';

import { ESTADO_PAGO_CAMPAMENTO } from '@/shared/domain/campamento/enums';
import {
  baseEntityShape,
  decimalSchema,
  nullableField,
} from '@/shared/domain/common';
import {
  conceptoMovimientoSchema,
  estadoPagoSchema,
  medioPagoSchema,
  tipoMovimientoSchema,
} from '@/shared/domain/movimiento';
import {
  personaSchema,
  personaTypeSchema,
  ramaSchema,
} from '@/shared/domain/persona';
import { instantSchema, localDateSchema } from '@/shared/time';

export const estadoPagoCampamentoSchema = z.nativeEnum(ESTADO_PAGO_CAMPAMENTO);

export const campamentoParticipanteSchema = z.object({
  ...baseEntityShape,
  campamentoId: z.string(),
  personaId: z.string(),
  autorizacionEntregada: z.boolean(),
  /** Snapshot del costo al agregar al participante. */
  montoAsignado: decimalSchema,
  montoBonificado: decimalSchema,
  persona: personaSchema.optional(),
});

export type CampamentoParticipante = z.infer<
  typeof campamentoParticipanteSchema
>;

/**
 * Entidad cruda (`GET /campamentos`, `/:id`, POST/PATCH). Decimales string en GET,
 * number en POST; fechas `YYYY-MM-DD` en GET, ISO de medianoche en POST/PATCH.
 */
export const campamentoSchema = z.object({
  ...baseEntityShape,
  nombre: z.string(),
  fechaInicio: localDateSchema,
  fechaFin: localDateSchema,
  costoPorPersona: decimalSchema,
  /** Aporte esperado de educadores. 0 = exentos. */
  costoEducadores: decimalSchema,
  cuotasBase: z.number().int(),
  descripcion: nullableField(z.string()),
  participantes: z.array(campamentoParticipanteSchema).optional(),
});

export type Campamento = z.infer<typeof campamentoSchema>;
export const campamentosSchema = z.array(campamentoSchema);

const pagoParticipanteSchema = z.object({
  movimientoId: z.string(),
  fecha: instantSchema,
  monto: z.number(),
  medioPago: medioPagoSchema,
  tipo: tipoMovimientoSchema,
  /** `campamento_pago` = pago real; `bonificacion_*` no suman a totalPagado. */
  concepto: conceptoMovimientoSchema,
});

export const participantePagoSchema = z.object({
  /** = personaId */
  id: z.string(),
  nombre: z.string(),
  tipo: personaTypeSchema,
  rama: nullableField(ramaSchema),
  montoAsignado: z.number(),
  montoBonificado: z.number(),
  totalPagado: z.number(),
  saldoPendiente: z.number(),
  estadoPago: estadoPagoCampamentoSchema,
  /** Saldo disponible en la cuenta personal para pagos mixtos. */
  saldoCuentaPersonal: z.number(),
  autorizacionEntregada: z.boolean(),
  fechaInscripcion: instantSchema,
  pagos: z.array(pagoParticipanteSchema),
});

export type ParticipantePago = z.infer<typeof participantePagoSchema>;

export const movimientoCampamentoSchema = z.object({
  id: z.string(),
  fecha: instantSchema,
  tipo: tipoMovimientoSchema,
  concepto: conceptoMovimientoSchema,
  monto: z.number(),
  descripcion: nullableField(z.string()),
  medioPago: medioPagoSchema,
  estadoPago: estadoPagoSchema,
  responsableId: z.string(),
  responsableNombre: z.string(),
});

export type MovimientoCampamento = z.infer<typeof movimientoCampamentoSchema>;

export const campamentoKpisSchema = z.object({
  totalARecaudar: z.number(),
  totalRecaudado: z.number(),
  totalBonificado: z.number(),
  totalGastado: z.number(),
  totalPendienteReembolso: z.number(),
  balance: z.number(),
  deudaTotal: z.number(),
  cantidadParticipantes: z.number(),
  participantesPagadosCompleto: z.number(),
  participantesPagadosParcial: z.number(),
  participantesPendientes: z.number(),
  participantesExentos: z.number(),
});

export type CampamentoKpis = z.infer<typeof campamentoKpisSchema>;

/** `GET /campamentos/:id/detalle` */
export const campamentoDetalleSchema = z.object({
  campamento: z.object({
    id: z.string(),
    nombre: z.string(),
    fechaInicio: localDateSchema,
    fechaFin: localDateSchema,
    costoPorPersona: z.number(),
    costoEducadores: z.number(),
    cuotasBase: z.number().int(),
    descripcion: nullableField(z.string()),
  }),
  participantes: z.array(participantePagoSchema),
  movimientos: z.array(movimientoCampamentoSchema),
  kpis: campamentoKpisSchema,
});

export type CampamentoDetalle = z.infer<typeof campamentoDetalleSchema>;
