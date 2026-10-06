/** Reglas puras de los diálogos de pago y bonificación (port de los dialogs de Angular). */
import type { MedioPago, PagoInscripcionDto } from '@/shared/domain';
import { MIN_PAGO_EDITADO } from '@/features/inscripciones/constants/inscripciones';
import type { UpdatePagoDto } from '@/features/inscripciones/services/inscripciones-api';

const amount = (value: number | null): number => value ?? 0;

export interface PagoCreateValues {
  readonly montoPagado: number | null;
  readonly montoConSaldoPersonal: number | null;
  readonly medioPago: MedioPago | null;
  readonly descripcion: string;
}

export interface PagoCreateContext {
  readonly pendiente: number;
  readonly saldoPersonal: number;
}

export interface PagoCreateSummary {
  readonly total: number;
  readonly restante: number;
  readonly excedePendiente: boolean;
  readonly excedeSaldo: boolean;
  readonly invalid: boolean;
}

export function summarizePagoCreate(
  values: PagoCreateValues,
  context: PagoCreateContext,
): PagoCreateSummary {
  const efectivo = amount(values.montoPagado);
  const saldo = amount(values.montoConSaldoPersonal);
  const total = efectivo + saldo;
  const excedePendiente = total > context.pendiente;
  const excedeSaldo = saldo > context.saldoPersonal;
  const empty = efectivo <= 0 && saldo <= 0;
  return {
    total,
    restante: Math.max(0, context.pendiente - total),
    excedePendiente,
    excedeSaldo,
    invalid:
      empty || excedePendiente || excedeSaldo || values.medioPago === null,
  };
}

/** "Usar todo": todo lo posible desde el saldo personal y el efectivo en 0. */
export function usarTodoPago(
  values: PagoCreateValues,
  context: PagoCreateContext,
): PagoCreateValues {
  return {
    ...values,
    montoPagado: 0,
    montoConSaldoPersonal: Math.min(context.saldoPersonal, context.pendiente),
  };
}

const optionalText = (text: string): string | undefined =>
  text.trim() ? text : undefined;

export function buildPagoDto(
  values: PagoCreateValues & { readonly medioPago: MedioPago },
): PagoInscripcionDto {
  return {
    montoPagado: amount(values.montoPagado),
    montoConSaldoPersonal: values.montoConSaldoPersonal || undefined,
    medioPago: values.medioPago,
    descripcion: optionalText(values.descripcion),
  };
}

export interface PagoEditValues {
  readonly monto: number | null;
  readonly medioPago: MedioPago | null;
  readonly descripcion: string;
}

export interface PagoEditContext {
  readonly pendiente: number;
  readonly original: number;
}

export interface PagoEditSummary {
  readonly max: number;
  readonly restante: number;
  readonly belowMin: boolean;
  readonly aboveMax: boolean;
  readonly invalid: boolean;
}

/** Edición: el máximo es pendiente + el pago original (se reemplaza). */
export function summarizePagoEdit(
  values: PagoEditValues,
  context: PagoEditContext,
): PagoEditSummary {
  const monto = amount(values.monto);
  const max = context.pendiente + context.original;
  const belowMin = monto < MIN_PAGO_EDITADO;
  const aboveMax = monto > max;
  return {
    max,
    restante: Math.max(0, max - monto),
    belowMin,
    aboveMax,
    invalid: belowMin || aboveMax || values.medioPago === null,
  };
}

export function buildUpdatePagoDto(
  values: PagoEditValues & { readonly medioPago: MedioPago },
): UpdatePagoDto {
  return {
    monto: amount(values.monto),
    medioPago: values.medioPago,
    descripcion: optionalText(values.descripcion),
  };
}

export interface BonificarContext {
  readonly montoTotal: number;
  readonly bonificadoActual: number;
  readonly saldoFondo: number;
}

export interface BonificarSummary {
  readonly excedeTotal: boolean;
  readonly saldoInsuficiente: boolean;
  readonly canConfirm: boolean;
}

/** Ajustar de 5.000 a 6.000 solo necesita 1.000 nuevos en el fondo (se compara el delta). */
export function summarizeBonificar(
  monto: number | null,
  context: BonificarContext,
): BonificarSummary {
  const value = amount(monto);
  const adicional = Math.max(0, value - context.bonificadoActual);
  const excedeTotal = value > context.montoTotal;
  const saldoInsuficiente = adicional > context.saldoFondo;
  return {
    excedeTotal,
    saldoInsuficiente,
    canConfirm:
      monto !== null && value >= 0 && !excedeTotal && !saldoInsuficiente,
  };
}
