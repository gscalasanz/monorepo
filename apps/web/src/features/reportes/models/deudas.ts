/** Contrato de `GET /reportes/deudas` (backend `PersonaDeudaDto`). Solo lo usa este feature. */
import { z } from 'zod';

import { estadoPersonaSchema, personaTypeSchema } from '@/shared/domain';

const campamentoDeudaSchema = z.object({
  campamentoId: z.string(),
  nombre: z.string(),
  ano: z.number(),
  montoTotal: z.number(),
  montoPagado: z.number(),
  saldo: z.number(),
  autorizacionEntregada: z.boolean(),
});

const inscripcionDeudaSchema = z.object({
  inscripcionId: z.string(),
  tipo: z.string(),
  ano: z.number(),
  montoTotal: z.number(),
  montoBonificado: z.number(),
  montoPagado: z.number(),
  saldo: z.number(),
});

const documentacionPersonalSchema = z.object({
  dni: z.boolean(),
  partidaNacimiento: z.boolean(),
  dniPadres: z.boolean(),
  carnetObraSocial: z.boolean(),
});

const docInscripcionSchema = z.object({
  inscripcionId: z.string(),
  ano: z.number(),
  declaracionDeSalud: z.boolean(),
  autorizacionDeImagen: z.boolean(),
  salidasCercanas: z.boolean(),
  autorizacionIngreso: z.boolean(),
  certificadoAptitudFisica: z.boolean(),
});

export const personaDeudaSchema = z.object({
  personaId: z.string(),
  nombre: z.string(),
  tipo: personaTypeSchema,
  estado: estadoPersonaSchema,
  rama: z.string(),
  esMayorDeEdad: z.boolean(),
  deudaTotal: z.number(),
  campamentos: z.array(campamentoDeudaSchema),
  inscripcionesGrupo: z.array(inscripcionDeudaSchema),
  inscripcionesScout: z.array(inscripcionDeudaSchema),
  documentacionPersonal: documentacionPersonalSchema.nullable(),
  documentacionInscripcion: z.array(docInscripcionSchema),
});

export const personasDeudaSchema = z.array(personaDeudaSchema);

export type PersonaDeuda = z.infer<typeof personaDeudaSchema>;
export type DocInscripcion = z.infer<typeof docInscripcionSchema>;

export interface DeudaFilters {
  readonly rama?: string;
  readonly ano?: number;
  readonly tipo?: string;
}
