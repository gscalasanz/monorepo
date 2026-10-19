/** Contrato de `GET /reportes/deudas/consolidado` (backend `ConsolidadoDeudasDto`). */
import { z } from 'zod';

import { tipoDeudaFilterSchema } from '@/features/reportes/models/deudas';

export const campamentoConsolidadoSchema = z.object({
  campamentoId: z.string(),
  nombre: z.string(),
  ano: z.number(),
  deudaTotal: z.number(),
  personasConDeuda: z.number(),
});

export const inscripcionConsolidadaSchema = z.object({
  /** Valor del filtro `tipo` (`inscripcionesScout` | `inscripcionesGrupo`). */
  tipo: tipoDeudaFilterSchema,
  ano: z.number(),
  deudaTotal: z.number(),
  personasConDeuda: z.number(),
});

export const consolidadoDeudasSchema = z.object({
  personasConDeuda: z.number(),
  deudaTotal: z.number(),
  deudaCampamentos: z.number(),
  deudaInscripcionesScout: z.number(),
  deudaInscripcionesGrupo: z.number(),
  campamentos: z.array(campamentoConsolidadoSchema),
  inscripciones: z.array(inscripcionConsolidadaSchema),
});

export type CampamentoConsolidado = z.infer<typeof campamentoConsolidadoSchema>;
export type InscripcionConsolidada = z.infer<typeof inscripcionConsolidadaSchema>;
export type ConsolidadoDeudas = z.infer<typeof consolidadoDeudasSchema>;
