/**
 * Piezas zod comunes al contrato del backend (NestJS + TypeORM, sin serializer
 * global). Ver hallazgos en REGISTRY-detail/domain.md:
 *  - las columnas `decimal` de entidades crudas llegan como **string** (`"1500.50"`)
 *    y como number en DTOs armados a mano y en respuestas de POST → `decimalSchema`;
 *  - en POST, TypeORM omite las columnas nullable sin default que no se mandaron
 *    (la clave falta, no es `null`) → `nullableField`.
 */
import { z } from 'zod';

import { instantSchema } from '@/shared/time';

const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;
const INVALID_DECIMAL_MESSAGE = 'Monto inválido';

/** Decimal del backend (`"1500.50"` o `1500.5`) → `number`. */
export const decimalSchema = z.union([
  z.number().finite(),
  z
    .string()
    .regex(NUMERIC_STRING, { message: INVALID_DECIMAL_MESSAGE })
    .transform(Number),
]);

/** Campo nullable que puede faltar en la respuesta: ausente → `null`. */
export function nullableField<T extends z.ZodTypeAny>(
  schema: T,
): z.ZodEffects<z.ZodOptional<z.ZodNullable<T>>, z.output<T> | null, z.input<T> | null | undefined> {
  return schema.nullish().transform((value): z.output<T> | null => value ?? null);
}

/** Columnas de `BaseEntity` (id + auditoría). `deletedAt` siempre es null en lecturas. */
export const baseEntityShape = {
  id: z.string(),
  createdAt: instantSchema,
  updatedAt: instantSchema,
  deletedAt: nullableField(instantSchema),
};

