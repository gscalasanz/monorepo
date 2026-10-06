/**
 * `GET /personas/:id/dashboard` (`PersonaDashboardDto` del backend). Solo lo usa
 * la ficha de personas, por eso vive en el feature. Los montos pasan por
 * `decimalSchema` (number o string) para no depender de la serialización.
 */
import { z } from 'zod';

import {
  cargoEducadorSchema,
  decimalSchema,
  estadoInscripcionSchema,
  estadoPersonaSchema,
  medioPagoSchema,
  nullableField,
  personaTypeSchema,
  ramaSchema,
  tipoInscripcionSchema,
  tipoMovimientoSchema,
} from '@/shared/domain';

const resumenSchema = z.object({ total: decimalSchema, cantidad: z.number() });

export const documentacionPersonalSchema = z.object({
  partidaNacimiento: z.boolean(),
  dni: z.boolean(),
  dniPadres: z.boolean(),
  carnetObraSocial: z.boolean(),
  completa: z.boolean(),
});

export const inscripcionDashboardItemSchema = z.object({
  id: z.string(),
  tipo: tipoInscripcionSchema,
  ano: z.number(),
  montoTotal: decimalSchema,
  montoBonificado: decimalSchema,
  montoPagado: decimalSchema,
  saldoPendiente: decimalSchema,
  estado: estadoInscripcionSchema,
});

export const campamentoDashboardItemSchema = z.object({
  /** Es el `campamentoId` (la ficha navega a `/campamentos/:id`). */
  id: z.string(),
  nombre: z.string(),
  ano: z.number(),
  montoTotal: decimalSchema,
  montoPagado: decimalSchema,
  saldoPendiente: decimalSchema,
  autorizacionEntregada: z.boolean(),
});

export const movimientoDashboardSchema = z.object({
  id: z.string(),
  fecha: z.string(),
  tipo: tipoMovimientoSchema,
  /** `descripcion` del movimiento o, si no tiene, el concepto crudo. */
  concepto: z.string(),
  monto: decimalSchema,
  medioPago: medioPagoSchema,
});

export const personaDashboardSchema = z.object({
  persona: z.object({
    id: z.string(),
    nombre: z.string(),
    tipo: personaTypeSchema,
    estado: estadoPersonaSchema,
    rama: nullableField(ramaSchema),
    cargo: cargoEducadorSchema.optional(),
  }),
  cuentaPersonal: z.object({ id: z.string(), saldo: decimalSchema }),
  documentacionPersonal: nullableField(documentacionPersonalSchema),
  inscripciones: z.object({
    resumen: resumenSchema,
    items: z.array(inscripcionDashboardItemSchema),
  }),
  campamentos: z.object({
    resumen: resumenSchema,
    items: z.array(campamentoDashboardItemSchema),
  }),
  deudaTotal: z.object({
    total: decimalSchema,
    inscripciones: decimalSchema,
    campamentos: decimalSchema,
  }),
  ultimosMovimientos: z.array(movimientoDashboardSchema),
});

export type PersonaDashboard = z.infer<typeof personaDashboardSchema>;
export type DocumentacionPersonal = z.infer<typeof documentacionPersonalSchema>;
export type InscripcionDashboardItem = z.infer<
  typeof inscripcionDashboardItemSchema
>;
export type CampamentoDashboardItem = z.infer<
  typeof campamentoDashboardItemSchema
>;
export type MovimientoDashboard = z.infer<typeof movimientoDashboardSchema>;
