/** Respuestas de `/cajas` (`cajas.service.ts`, `dtos/caja-response.dto.ts`, `consolidado-saldos.dto.ts`). */
import { z } from 'zod';

import { CAJA_TYPE, FONDO_RAMA_TYPES } from '@/shared/domain/caja/enums';
import { baseEntityShape, nullableField } from '@/shared/domain/common';
import { estadoPersonaSchema } from '@/shared/domain/persona';
import { instantSchema } from '@/shared/time';

export const cajaTypeSchema = z.nativeEnum(CAJA_TYPE);

/** Caja cruda (`POST /cajas`, relación `caja` de un movimiento): sin saldo. */
export const cajaSchema = z.object({
  ...baseEntityShape,
  tipo: cajaTypeSchema,
  nombre: nullableField(z.string()),
  propietarioId: nullableField(z.string()),
});

export type Caja = z.infer<typeof cajaSchema>;

export const cajaPropietarioSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  estado: estadoPersonaSchema,
  /** Rama del propietario, o null (educador sin rama / externo). */
  rama: nullableField(z.string()),
});

export type CajaPropietario = z.infer<typeof cajaPropietarioSchema>;

/** `CajaResponseDto` (`GET /cajas`, `/cajas/grupo`, `/cajas/:id`). Sin `deletedAt`. */
export const cajaResponseSchema = z.object({
  id: z.string(),
  tipo: cajaTypeSchema,
  nombre: nullableField(z.string()),
  propietarioId: nullableField(z.string()),
  /** Siempre null en `/cajas/grupo` y `/cajas/fondo-solidario` (relación no cargada). */
  propietario: nullableField(cajaPropietarioSchema),
  saldoActual: z.number(),
  createdAt: instantSchema,
  updatedAt: instantSchema,
});

export type CajaConSaldo = z.infer<typeof cajaResponseSchema>;
export const cajasResponseSchema = z.array(cajaResponseSchema);

/** `GET /movimientos/saldo/:cajaId` */
export const saldoCajaSchema = z.object({ cajaId: z.string(), saldo: z.number() });
export type SaldoCaja = z.infer<typeof saldoCajaSchema>;

/** `GET /cajas/personal/:personaId/saldo` */
export const saldoPersonalSchema = z.object({ saldo: z.number() });
export type SaldoPersonal = z.infer<typeof saldoPersonalSchema>;

/** `GET /cajas/fondo-solidario` */
export const fondoSolidarioSchema = z.object({
  caja: nullableField(cajaResponseSchema),
  historial: z.array(
    z.object({
      movimientoId: z.string(),
      fecha: instantSchema,
      monto: z.number(),
      personaId: z.string(),
      personaNombre: z.string(),
      destino: z.string(),
    }),
  ),
});

export type FondoSolidario = z.infer<typeof fondoSolidarioSchema>;

const totalCantidadSchema = z.object({ total: z.number(), cantidad: z.number() });

/** `GET /cajas/consolidado` (todo number). */
export const consolidadoSaldosSchema = z.object({
  fecha: instantSchema,
  resumen: z.object({
    totalGeneral: z.number(),
    totalDisponible: z.number(),
    totalPorCobrar: z.number(),
  }),
  /** `id` es `''` si no existe la caja grupo. */
  cajaGrupo: z.object({ id: z.string(), saldo: z.number() }),
  fondosRama: z.object({
    total: z.number(),
    detalle: z.array(
      z.object({
        tipo: z.enum(FONDO_RAMA_TYPES),
        id: z.string(),
        nombre: z.string(),
        saldo: z.number(),
      }),
    ),
  }),
  cuentasPersonales: totalCantidadSchema,
  /** Su saldo NO es parte de la caja grupo. */
  fondoSolidario: z.object({
    id: nullableField(z.string()),
    saldo: z.number(),
    bonificacionesOtorgadas: z.number(),
  }),
  reembolsosPendientes: totalCantidadSchema,
  cobrosPendientes: totalCantidadSchema,
  deudasTotales: z.object({
    total: z.number(),
    inscripciones: totalCantidadSchema,
    campamentos: totalCantidadSchema,
  }),
});

export type ConsolidadoSaldos = z.infer<typeof consolidadoSaldosSchema>;
