/** Respuestas de `/inscripciones` (`inscripcion-response.dto.ts`, `inscripciones-consolidado.dto.ts`). */
import { z } from 'zod';

import { nullableField } from '@/shared/domain/common';
import {
  ESTADO_INSCRIPCION,
  TIPO_DEUDA,
  TIPO_INSCRIPCION,
} from '@/shared/domain/inscripcion/enums';
import {
  conceptoMovimientoSchema,
  medioPagoSchema,
  tipoMovimientoSchema,
} from '@/shared/domain/movimiento';
import { personaTypeSchema, ramaSchema } from '@/shared/domain/persona';
import { instantSchema } from '@/shared/time';

export const tipoInscripcionSchema = z.nativeEnum(TIPO_INSCRIPCION);
export const estadoInscripcionSchema = z.nativeEnum(ESTADO_INSCRIPCION);
export const tipoDeudaSchema = z.nativeEnum(TIPO_DEUDA);

export const movimientoInscripcionSchema = z.object({
  id: z.string(),
  monto: z.number(),
  medioPago: medioPagoSchema,
  fecha: instantSchema,
  descripcion: nullableField(z.string()),
  tipo: tipoMovimientoSchema,
  concepto: conceptoMovimientoSchema,
});

export type MovimientoInscripcion = z.infer<typeof movimientoInscripcionSchema>;

/** `InscripcionResponseDto`: la inscripción nunca se devuelve cruda. Montos ya en number. */
export const inscripcionSchema = z.object({
  id: z.string(),
  personaId: z.string(),
  tipo: tipoInscripcionSchema,
  ano: z.number().int(),
  montoTotal: z.number(),
  montoBonificado: z.number(),
  declaracionDeSalud: z.boolean(),
  autorizacionDeImagen: z.boolean(),
  salidasCercanas: z.boolean(),
  autorizacionIngreso: z.boolean(),
  certificadoAptitudFisica: z.boolean(),
  createdAt: instantSchema,
  updatedAt: instantSchema,
  estado: estadoInscripcionSchema,
  montoPagado: z.number(),
  saldoPendiente: z.number(),
  /** Presente en listados y `/persona/:id`; ausente en findOne/create/pagar. */
  persona: z
    .object({
      id: z.string(),
      nombre: z.string(),
      tipo: personaTypeSchema,
      rama: nullableField(ramaSchema),
    })
    .optional(),
  movimientos: z.array(movimientoInscripcionSchema),
});

export type Inscripcion = z.infer<typeof inscripcionSchema>;
export const inscripcionesSchema = z.array(inscripcionSchema);

const distribucionPorRamaSchema = z.object({
  total: z.number(),
  manada: z.number(),
  unidad: z.number(),
  caminantes: z.number(),
  rovers: z.number(),
  educadores: z.number(),
});

export type DistribucionPorRama = z.infer<typeof distribucionPorRamaSchema>;

/** `GET /inscripciones/consolidado` (`tipoDeuda` se refleja en filtros pero no cambia los conteos). */
export const inscripcionesConsolidadoSchema = z.object({
  filtros: z.object({
    ano: z.number().optional(),
    tipo: tipoInscripcionSchema.optional(),
    tipoDeuda: tipoDeudaSchema.optional(),
    rama: z.string().optional(),
  }),
  total: z.number(),
  porRama: distribucionPorRamaSchema,
  financiero: z.object({
    montoEsperado: z.number(),
    montoPagado: z.number(),
    montoAdeudado: z.number(),
    montoBonificado: z.number(),
  }),
  deudores: z.object({
    dinero: z.object({ total: z.number(), monto: z.number(), porRama: distribucionPorRamaSchema }),
    documentacion: z.object({ total: z.number(), porRama: distribucionPorRamaSchema }),
    ambos: distribucionPorRamaSchema,
  }),
  fecha: instantSchema,
});

export type InscripcionesConsolidado = z.infer<typeof inscripcionesConsolidadoSchema>;
