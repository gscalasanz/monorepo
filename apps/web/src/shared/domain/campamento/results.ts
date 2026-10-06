/** Respuestas de acciones/cálculos de `/campamentos`. */
import { z } from 'zod';

import { conceptoMovimientoSchema, medioPagoSchema } from '@/shared/domain/movimiento';
import { instantSchema } from '@/shared/time';

/** `POST /campamentos/:id/pagos/:personaId` (201). */
export const resultadoPagoCampamentoSchema = z.object({
  movimientoIngreso: z.object({
    id: z.string(),
    monto: z.number(),
    concepto: conceptoMovimientoSchema,
    medioPago: medioPagoSchema,
  }),
  movimientoEgresoPersonal: z.object({ id: z.string(), monto: z.number() }).optional(),
  desglose: z.object({
    montoSaldoPersonal: z.number(),
    montoFisico: z.number(),
    total: z.number(),
  }),
});

export type ResultadoPagoCampamento = z.infer<typeof resultadoPagoCampamentoSchema>;

/** `DELETE /campamentos/:id/pagos/:movimientoId` */
export const eliminarPagoCampamentoResultSchema = z.object({
  movimientosEliminados: z.array(z.string()),
  montoRevertido: z.number(),
});

export type EliminarPagoCampamentoResult = z.infer<typeof eliminarPagoCampamentoResultSchema>;

/** `GET /campamentos/:id/resumen-financiero` */
export const resumenFinancieroCampamentoSchema = z.object({
  totalEsperado: z.number(),
  totalRecaudado: z.number(),
  totalGastado: z.number(),
  totalPendienteReembolso: z.number(),
  saldo: z.number(),
  participantes: z.number(),
});

export type ResumenFinancieroCampamento = z.infer<typeof resumenFinancieroCampamentoSchema>;

/** `GET /campamentos/:id/pagos-por-participante` */
export const pagosPorParticipanteSchema = z.array(
  z.object({
    participanteId: z.string(),
    participanteNombre: z.string(),
    montoAsignado: z.number(),
    montoBonificado: z.number(),
    totalPagado: z.number(),
    saldoPendiente: z.number(),
    pagos: z.array(z.object({ fecha: instantSchema, monto: z.number(), medioPago: medioPagoSchema })),
  }),
);

export type PagosPorParticipante = z.infer<typeof pagosPorParticipanteSchema>;
