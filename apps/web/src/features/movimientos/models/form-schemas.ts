/**
 * Schemas de los forms de movimientos (reglas de `MovimientosFormBuilder`).
 * La regla cruzada "persona a reembolsar" vive en `@/shared/validators`.
 */
import { z } from 'zod';

import {
  CATEGORIA_MOVIMIENTO,
  CONCEPTO_MOVIMIENTO,
  ESTADO_PAGO,
  MEDIO_PAGO,
  TIPO_MOVIMIENTO,
  type CategoriaMovimiento,
  type ConceptoMovimiento,
  type EstadoPago,
  type MedioPago,
  type TipoMovimiento,
} from '@/shared/domain';
import {
  VALIDATION_MESSAGES,
  decimalPlaces,
  positiveNumber,
  refineWith,
  safeText,
} from '@/shared/validators';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  DESCRIPCION_MAX_LENGTH,
  MONTO_MAX_DECIMALS,
} from '@/features/movimientos/constants/movimientos';

export interface MovimientoCreateValues {
  readonly cajaId: string | null;
  readonly tipo: TipoMovimiento;
  readonly monto: number | null;
  readonly concepto: ConceptoMovimiento | null;
  readonly categoria: CategoriaMovimiento | null;
  readonly responsableId: string | null;
  readonly medioPago: MedioPago;
  readonly fecha: string;
  readonly descripcion: string;
  readonly estadoPago: EstadoPago;
  readonly personaAReembolsarId: string | null;
}

export interface MovimientoEditValues {
  readonly descripcion: string;
  readonly estadoPago: EstadoPago;
  readonly personaAReembolsarId: string | null;
  readonly comprobanteEntregado: boolean;
}

/** `null`/vacío → mensaje de requerido (los selects entregan `null`). */
const requiredId = (message: string) =>
  z
    .string({ required_error: message, invalid_type_error: message })
    .min(1, message);

const requiredEnum = <T extends Record<string, string>>(
  values: T,
  message: string,
) =>
  z.nativeEnum(values, {
    required_error: message,
    invalid_type_error: message,
  });

const descripcion = z
  .string()
  .max(
    DESCRIPCION_MAX_LENGTH,
    VALIDATION_MESSAGES.MAX_LENGTH(DESCRIPCION_MAX_LENGTH),
  )
  .superRefine(refineWith(safeText));

/** Paridad: `positiveNumber` deja pasar el 0 (HALLAZGOS); el back lo rechaza. */
const monto = z
  .number({
    required_error: C.MONTO_REQUIRED,
    invalid_type_error: C.MONTO_REQUIRED,
  })
  .superRefine(refineWith(positiveNumber))
  .superRefine(refineWith(decimalPlaces(MONTO_MAX_DECIMALS)));

/** Campos del alta (sin la regla cruzada: se valida aparte con `personaAReembolsarRequerida`). */
export const movimientoCreateSchema = z.object({
  cajaId: requiredId(C.CAJA_REQUIRED),
  tipo: z.nativeEnum(TIPO_MOVIMIENTO),
  monto,
  concepto: requiredEnum(CONCEPTO_MOVIMIENTO, C.CONCEPTO_REQUIRED),
  categoria: z.nativeEnum(CATEGORIA_MOVIMIENTO).nullable(),
  responsableId: requiredId(C.RESPONSABLE_REQUIRED),
  medioPago: z.nativeEnum(MEDIO_PAGO),
  fecha: z.string().min(1, C.FECHA_REQUIRED),
  descripcion,
  estadoPago: z.nativeEnum(ESTADO_PAGO),
  personaAReembolsarId: z.string().nullable(),
});

export const movimientoEditSchema = z.object({
  descripcion: z
    .string()
    .max(
      DESCRIPCION_MAX_LENGTH,
      VALIDATION_MESSAGES.MAX_LENGTH(DESCRIPCION_MAX_LENGTH),
    ),
  estadoPago: z.nativeEnum(ESTADO_PAGO),
  personaAReembolsarId: z.string().nullable(),
  comprobanteEntregado: z.boolean(),
});

/** Valores del alta ya validados (ids y concepto presentes). */
export type MovimientoCreateParsed = z.infer<typeof movimientoCreateSchema>;
