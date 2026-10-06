/**
 * Form de gasto (campamentos y eventos): schema, valores y mapeo a DTO.
 * Paridad con `gasto-campamento-form` de Angular.
 */
import { z } from 'zod';

import {
  ESTADO_PAGO,
  ESTADO_PAGO_LABELS,
  MEDIO_PAGO,
  type RegistrarGastoCampamentoDto,
  type RegistrarGastoEventoDto,
} from '@/shared/domain';
import type { FieldOption } from '@/shared/components/ui/form';
import { todayBsAs } from '@/shared/time';
import { personaAReembolsarRequerida } from '@/shared/validators';

import { FINANZAS_COPY } from './copy';
import {
  descripcionSchema,
  medioPagoOptions,
  montoSchema,
  requiredChoice,
  responsableSchema,
} from './field-schemas';

const C = FINANZAS_COPY.form;

const GASTO_MEDIOS = [MEDIO_PAGO.EFECTIVO, MEDIO_PAGO.TRANSFERENCIA] as const;
const GASTO_ESTADOS = [
  ESTADO_PAGO.PAGADO,
  ESTADO_PAGO.PENDIENTE_REEMBOLSO,
] as const;

export type GastoMedioPago = (typeof GASTO_MEDIOS)[number];
export type GastoEstadoPago = (typeof GASTO_ESTADOS)[number];

export const GASTO_MEDIO_PAGO_OPTIONS = medioPagoOptions(GASTO_MEDIOS);

export const GASTO_ESTADO_PAGO_OPTIONS: readonly FieldOption<GastoEstadoPago>[] =
  GASTO_ESTADOS.map((value) => ({ value, label: ESTADO_PAGO_LABELS[value] }));

/** Campos sueltos (validación on-blur por campo con `useFieldValidation`). */
export const gastoFieldsSchema = z.object({
  monto: montoSchema,
  fecha: z.string().min(1, C.fechaRequerida),
  responsableId: responsableSchema,
  descripcion: descripcionSchema,
  medioPago: requiredChoice({
    values: GASTO_MEDIOS,
    message: C.medioPagoRequerido,
  }),
  estadoPago: requiredChoice({
    values: GASTO_ESTADOS,
    message: C.estadoPagoRequerido,
  }),
  personaAReembolsarId: z.string().nullable(),
});

/** Form completo: suma la regla cruzada de la persona a reembolsar. */
export const gastoFormSchema = gastoFieldsSchema.superRefine((values, ctx) => {
  if (personaAReembolsarRequerida(values) !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FINANZAS_COPY.gasto.personaAReembolsarRequerida,
      path: ['personaAReembolsarId'],
    });
  }
});

/** Estado editable del form (selects sin elegir = `null`). */
export type GastoFormDraft = z.input<typeof gastoFieldsSchema>;
/** Valores validados que recibe `onSubmit`. */
export type GastoFormValues = z.output<typeof gastoFormSchema>;

export function initialGastoDraft(): GastoFormDraft {
  return {
    monto: null,
    fecha: todayBsAs(),
    responsableId: null,
    descripcion: '',
    medioPago: null,
    estadoPago: ESTADO_PAGO.PAGADO,
    personaAReembolsarId: null,
  };
}

function personaAReembolsar(values: GastoFormValues): {
  readonly personaAReembolsarId?: string;
} {
  const pendiente = values.estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO;
  return pendiente && values.personaAReembolsarId
    ? { personaAReembolsarId: values.personaAReembolsarId }
    : {};
}

/**
 * `POST /eventos/:id/gastos`: el DTO del backend NO acepta `fecha`
 * (`forbidNonWhitelisted` → 400), igual que Angular que la descarta.
 */
export function toGastoEventoDto(
  values: GastoFormValues,
): RegistrarGastoEventoDto {
  return {
    monto: values.monto,
    descripcion: values.descripcion,
    responsableId: values.responsableId,
    medioPago: values.medioPago,
    estadoPago: values.estadoPago,
    ...personaAReembolsar(values),
  };
}

/** `POST /campamentos/:id/gastos` (persona solo si queda pendiente de reembolso). */
export function toGastoDto(
  values: GastoFormValues,
): RegistrarGastoCampamentoDto {
  return { ...toGastoEventoDto(values), fecha: values.fecha };
}
