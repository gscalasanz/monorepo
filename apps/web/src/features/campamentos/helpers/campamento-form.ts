/**
 * Form de campamento (alta/edición): schema zod, draft y mapeo a DTO.
 * Paridad con `CampamentosFormBuilder.buildCreateForm` de Angular.
 */
import { z } from 'zod';

import type { Campamento, CreateCampamentoDto } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/campamentos/constants/copy';
import { dateRange, decimalPlaces, refineWith, safeText } from '@/shared/validators';

export const CAMPAMENTO_LIMITS = {
  NOMBRE_MIN: 3,
  NOMBRE_MAX: 100,
  DESCRIPCION_MAX: 500,
  CUOTAS_MIN: 1,
  CUOTAS_MAX: 12,
  DECIMALS: 2,
  DEFAULT_CUOTAS: 1,
  DEFAULT_COSTO_EDUCADORES: 0,
} as const;

const L = CAMPAMENTO_LIMITS;

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

/** Un único mensaje por campo, como el `<span error>` de Angular. */
function decimals(message: string) {
  return (value: number, ctx: z.RefinementCtx): void => {
    if (decimalPlaces(L.DECIMALS)(value) !== null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }
  };
}

export const campamentoFieldsSchema = z.object({
  nombre: z
    .string()
    .refine((v) => v.trim().length >= L.NOMBRE_MIN && v.length <= L.NOMBRE_MAX, C.NOMBRE_REQUERIDO)
    .refine((v) => safeText(v) === null, C.NOMBRE_REQUERIDO),
  fechaInicio: z.string().min(1, C.FECHA_INICIO_REQUERIDA),
  fechaFin: z.string().min(1, C.FECHA_FIN_REQUERIDA),
  costoPorPersona: z
    .number()
    .nullable()
    .refine(isPresent, C.COSTO_REQUERIDO)
    .refine((v) => v > 0, C.COSTO_REQUERIDO)
    .superRefine(decimals(C.COSTO_REQUERIDO)),
  cuotasBase: z
    .number()
    .nullable()
    .refine(isPresent, C.CUOTAS_RANGO)
    .refine((v) => Number.isInteger(v) && v >= L.CUOTAS_MIN && v <= L.CUOTAS_MAX, C.CUOTAS_RANGO),
  costoEducadores: z
    .number()
    .nullable()
    .refine(isPresent, C.COSTO_EDUCADORES_NEGATIVO)
    .refine((v) => v >= 0, C.COSTO_EDUCADORES_NEGATIVO)
    .superRefine(decimals(C.COSTO_EDUCADORES_NEGATIVO)),
  descripcion: z
    .string()
    .max(L.DESCRIPCION_MAX)
    .superRefine(refineWith(safeText)),
});

/** Rango: inicio > fin es inválido (mismo día OK). */
export const campamentoFormSchema = campamentoFieldsSchema.superRefine((values, ctx) =>
  refineWith(dateRange, { path: ['fechaFin'] })(
    { start: values.fechaInicio, end: values.fechaFin },
    ctx,
  ),
);

export type CampamentoDraft = z.input<typeof campamentoFieldsSchema>;
export type CampamentoValues = z.output<typeof campamentoFormSchema>;

export const EMPTY_CAMPAMENTO_DRAFT: CampamentoDraft = {
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
  costoPorPersona: null,
  cuotasBase: L.DEFAULT_CUOTAS,
  costoEducadores: L.DEFAULT_COSTO_EDUCADORES,
  descripcion: '',
};

export function draftFromCampamento(campamento: Campamento): CampamentoDraft {
  return {
    nombre: campamento.nombre,
    fechaInicio: campamento.fechaInicio,
    fechaFin: campamento.fechaFin,
    costoPorPersona: campamento.costoPorPersona,
    cuotasBase: campamento.cuotasBase ?? L.DEFAULT_CUOTAS,
    costoEducadores: campamento.costoEducadores ?? L.DEFAULT_COSTO_EDUCADORES,
    descripcion: campamento.descripcion ?? '',
  };
}

/** Body de POST/PATCH (descripción vacía → se omite). */
export function toCampamentoDto(values: CampamentoValues): CreateCampamentoDto {
  return {
    nombre: values.nombre.trim(),
    fechaInicio: values.fechaInicio,
    fechaFin: values.fechaFin,
    costoPorPersona: values.costoPorPersona,
    costoEducadores: values.costoEducadores,
    cuotasBase: values.cuotasBase,
    ...(values.descripcion && { descripcion: values.descripcion }),
  };
}
