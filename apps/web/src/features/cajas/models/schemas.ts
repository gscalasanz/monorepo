/** Schemas de los forms de cajas (reglas idénticas a los `Validators` de Angular). */
import { z } from 'zod';

import {
  CONCEPTO_MOVIMIENTO,
  ESTADO_PAGO,
  MEDIO_PAGO,
  TIPO_MOVIMIENTO,
} from '@/shared/domain';
import {
  VALIDATION_MESSAGES,
  decimalPlaces,
  positiveNumber,
  refineWith,
  safeText,
} from '@/shared/validators';
import {
  DESCRIPCION_MAX_LENGTH,
  MONTO_MAX_DECIMALS,
} from '@/features/cajas/constants/cajas';

const REQUIRED = VALIDATION_MESSAGES.REQUIRED;

function requiredId(message: string) {
  return z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== '', message);
}

/** Medios que ofrece la carga rápida. */
export const QUICK_MEDIO_PAGO = [
  MEDIO_PAGO.EFECTIVO,
  MEDIO_PAGO.TRANSFERENCIA,
] as const;
export type QuickMedioPago = (typeof QUICK_MEDIO_PAGO)[number];

/** Estados que ofrece la carga rápida. */
export const QUICK_ESTADO_PAGO = [
  ESTADO_PAGO.PAGADO,
  ESTADO_PAGO.PENDIENTE_REEMBOLSO,
] as const;
export type QuickEstadoPago = (typeof QUICK_ESTADO_PAGO)[number];

const montoMovimiento = z
  .number()
  .nullable()
  .superRefine((value, ctx) => {
    if (value === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: REQUIRED });
      return;
    }
    refineWith(positiveNumber)(value, ctx);
    refineWith(decimalPlaces(MONTO_MAX_DECIMALS))(value, ctx);
  });

export const quickMovimientoSchema = z.object({
  tipo: z.nativeEnum(TIPO_MOVIMIENTO),
  concepto: z
    .nativeEnum(CONCEPTO_MOVIMIENTO)
    .nullable()
    .refine((value) => value !== null, REQUIRED),
  monto: montoMovimiento,
  responsableId: requiredId(REQUIRED),
  medioPago: z.enum(QUICK_MEDIO_PAGO),
  estadoPago: z.enum(QUICK_ESTADO_PAGO),
  personaAReembolsarId: z.string().nullable(),
  descripcion: z
    .string()
    .max(
      DESCRIPCION_MAX_LENGTH,
      VALIDATION_MESSAGES.MAX_LENGTH(DESCRIPCION_MAX_LENGTH),
    )
    .superRefine(refineWith(safeText)),
});

export type QuickMovimientoFormValues = z.input<typeof quickMovimientoSchema>;
