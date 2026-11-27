/** Schema del form de transferencia (reglas idénticas a los `Validators` de Angular). */
import { z } from 'zod';

import { TRANSFERENCIA_COPY as C } from './copy';

/** Monto mínimo de una transferencia. */
export const TRANSFER_MIN_MONTO = 0.01;

export const transferenciaSchema = z.object({
  cajaDestinoId: z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== '', C.DESTINO_REQUIRED),
  monto: z
    .number()
    .nullable()
    .refine(
      (value) => value !== null && value >= TRANSFER_MIN_MONTO,
      C.MONTO_INVALIDO,
    ),
  fecha: z.string().min(1, C.FECHA_REQUIRED),
  descripcion: z.string(),
});

export type TransferenciaFormValues = z.input<typeof transferenciaSchema>;
