/** Respuestas de `/movimientos` (entidad cruda: `monto` llega como string). */
import { z } from 'zod';

import { cajaSchema } from '@/shared/domain/caja';
import {
  baseEntityShape,
  decimalSchema,
  nullableField,
  paginatedSchema,
} from '@/shared/domain/common';
import {
  CATEGORIA_MOVIMIENTO,
  CONCEPTO_MOVIMIENTO,
  ESTADO_PAGO,
  MEDIO_PAGO,
  TIPO_MOVIMIENTO,
} from '@/shared/domain/movimiento/enums';
import { personaSchema } from '@/shared/domain/persona';
import { instantSchema } from '@/shared/time';

export const tipoMovimientoSchema = z.nativeEnum(TIPO_MOVIMIENTO);
export const conceptoMovimientoSchema = z.nativeEnum(CONCEPTO_MOVIMIENTO);
export const medioPagoSchema = z.nativeEnum(MEDIO_PAGO);
export const estadoPagoSchema = z.nativeEnum(ESTADO_PAGO);
export const categoriaMovimientoSchema = z.nativeEnum(CATEGORIA_MOVIMIENTO);

/**
 * Movimiento. Las relaciones (`caja`, `responsable`, `personaAReembolsar`) solo
 * vienen en las rutas que las cargan (ver REGISTRY-detail/domain.md).
 */
export const movimientoSchema = z.object({
  ...baseEntityShape,
  cajaId: z.string(),
  tipo: tipoMovimientoSchema,
  monto: decimalSchema,
  concepto: conceptoMovimientoSchema,
  categoria: nullableField(categoriaMovimientoSchema),
  descripcion: nullableField(z.string()),
  responsableId: z.string(),
  medioPago: medioPagoSchema,
  requiereComprobante: z.boolean(),
  comprobanteEntregado: nullableField(z.boolean()),
  estadoPago: estadoPagoSchema,
  personaAReembolsarId: nullableField(z.string()),
  fecha: instantSchema,
  eventoId: nullableField(z.string()),
  campamentoId: nullableField(z.string()),
  inscripcionId: nullableField(z.string()),
  movimientoRelacionadoId: nullableField(z.string()),
  registradoPorId: nullableField(z.string()),
  caja: cajaSchema.optional(),
  responsable: personaSchema.optional(),
  personaAReembolsar: personaSchema.nullish(),
});

export type Movimiento = z.infer<typeof movimientoSchema>;

export const movimientosSchema = z.array(movimientoSchema);

/** `GET /movimientos` (único endpoint paginado). */
export const movimientosPaginatedSchema = paginatedSchema(movimientoSchema);

/** `POST /movimientos/transferencia` */
export const transferenciaResultSchema = z.object({
  egreso: movimientoSchema,
  ingreso: movimientoSchema,
});

export type TransferenciaResult = z.infer<typeof transferenciaResultSchema>;

/** `GET /movimientos/reembolsos-pendientes` y `/cobros-pendientes` (agrupados por persona). */
export const pendientesPorPersonaSchema = z.array(
  z.object({
    personaId: z.string(),
    personaNombre: z.string(),
    totalPendiente: z.number(),
    movimientos: movimientosSchema,
  }),
);

export type PendientesPorPersona = z.infer<typeof pendientesPorPersonaSchema>;
