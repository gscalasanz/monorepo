/** Contrato de `GET /reportes/deudas` (backend `PersonaDeudaDto`). Solo lo usa este feature. */
import { z } from 'zod';

import { RAMAS, estadoPersonaSchema, personaTypeSchema, type Rama } from '@/shared/domain';

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

/** Valor de dominio del backend (`RAMA_EDUCADORES`): agrupa a todos los educadores. */
export const RAMA_EDUCADORES = 'Educadores';
export const DEUDA_RAMA_FILTERS: readonly (Rama | typeof RAMA_EDUCADORES)[] = [...RAMAS, RAMA_EDUCADORES];
export type DeudaRamaFilter = (typeof DEUDA_RAMA_FILTERS)[number];

/** Backend `TipoDeudaFilter`. */
export const TIPO_DEUDA_FILTER = {
  DINERO: 'dinero',
  CAMPAMENTOS: 'campamentos',
  INSCRIPCIONES_SCOUT: 'inscripcionesScout',
  INSCRIPCIONES_GRUPO: 'inscripcionesGrupo',
  DOCUMENTACION: 'documentacion',
} as const;
export type TipoDeudaFilter = (typeof TIPO_DEUDA_FILTER)[keyof typeof TIPO_DEUDA_FILTER];

const TIPO_VALUES: readonly string[] = Object.values(TIPO_DEUDA_FILTER);
const RAMA_VALUES: readonly string[] = DEUDA_RAMA_FILTERS;

export const isTipoDeudaFilter = (value: string): value is TipoDeudaFilter => TIPO_VALUES.includes(value);
export const isDeudaRamaFilter = (value: string): value is DeudaRamaFilter => RAMA_VALUES.includes(value);

export interface DeudaFilters {
  readonly rama?: DeudaRamaFilter;
  readonly ano?: number;
  readonly tipo?: TipoDeudaFilter;
}
