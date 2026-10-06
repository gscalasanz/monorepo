/**
 * Form de ingreso de eventos de grupo: schema, valores y mapeo a DTO.
 * Paridad con `shared/components/ingreso-form` de Angular (sin fecha).
 */
import { z } from 'zod';

import {
  MEDIO_PAGO,
  type RegistrarIngresoEventoDto,
} from '@/shared/domain';

import { FINANZAS_COPY } from './copy';
import {
  descripcionSchema,
  medioPagoOptions,
  montoSchema,
  requiredChoice,
  responsableSchema,
} from './field-schemas';

const INGRESO_MEDIOS = [
  MEDIO_PAGO.EFECTIVO,
  MEDIO_PAGO.TRANSFERENCIA,
  MEDIO_PAGO.SALDO_PERSONAL,
  MEDIO_PAGO.MIXTO,
] as const;

export const INGRESO_MEDIO_PAGO_OPTIONS = medioPagoOptions(INGRESO_MEDIOS);

export const ingresoFormSchema = z.object({
  monto: montoSchema,
  descripcion: descripcionSchema,
  responsableId: responsableSchema,
  medioPago: requiredChoice({
    values: INGRESO_MEDIOS,
    message: FINANZAS_COPY.form.medioPagoRequerido,
  }),
});

export type IngresoFormDraft = z.input<typeof ingresoFormSchema>;
export type IngresoFormValues = z.output<typeof ingresoFormSchema>;

export const INITIAL_INGRESO_DRAFT: IngresoFormDraft = {
  monto: null,
  descripcion: '',
  responsableId: null,
  medioPago: null,
};

/** `POST /eventos/:id/ingresos`. */
export function toIngresoDto(
  values: IngresoFormValues,
): RegistrarIngresoEventoDto {
  return {
    monto: values.monto,
    descripcion: values.descripcion,
    responsableId: values.responsableId,
    medioPago: values.medioPago,
  };
}
