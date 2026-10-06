/**
 * Schemas zod de los campos comunes de gasto e ingreso (paridad con los
 * `Validators` de `gasto-campamento-form` e `ingreso-form` de Angular).
 * Los campos nulos del draft se angostan con type guards: la salida es no-nula.
 */
import { z } from 'zod';

import { MEDIO_PAGO_LABELS, type MedioPago } from '@/shared/domain';
import type { FieldOption } from '@/shared/components/ui/form';
import { decimalPlaces, refineWith, safeText } from '@/shared/validators';

import {
  DESCRIPCION_MAX_LENGTH,
  FINANZAS_COPY,
  MONTO_MAX_DECIMALS,
} from './copy';

const C = FINANZAS_COPY.form;

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

export const montoSchema = z
  .number()
  .nullable()
  .refine(isPresent, C.montoRequerido)
  .refine((value) => value > 0, C.montoPositivo)
  .superRefine(refineWith(decimalPlaces(MONTO_MAX_DECIMALS)));

export const descripcionSchema = z
  .string()
  .refine((value) => value.trim().length > 0, C.descripcionRequerida)
  .refine((value) => value.length <= DESCRIPCION_MAX_LENGTH, C.descripcionMax)
  .superRefine(refineWith(safeText));

export const responsableSchema = z
  .string()
  .nullable()
  .refine((value): value is string => Boolean(value), C.responsableRequerido);

/** Select requerido de un subconjunto de valores (`null` = sin elegir). */
export function requiredChoice<T extends string>(params: {
  readonly values: readonly [T, ...T[]];
  readonly message: string;
}) {
  return z.enum(params.values).nullable().refine(isPresent, params.message);
}

export function medioPagoOptions<T extends MedioPago>(
  medios: readonly T[],
): readonly FieldOption<T>[] {
  return medios.map((value) => ({ value, label: MEDIO_PAGO_LABELS[value] }));
}
