/**
 * Validadores de varios campos (port de `custom-validators` y
 * `shared/forms/validators/*`). Funciones puras: se usan con `refineWith`.
 */
import { ESTADO_INSCRIPCION } from '@/shared/domain';
import { msFromInstant, resolveBackendDate } from '@/shared/time';
import { VALIDATION_MESSAGES as M } from '@/shared/validators/messages';
import type { ValidationResult } from '@/shared/validators/types';

export interface DateRangeValue {
  readonly start: unknown;
  readonly end: unknown;
}

/** -1/0/1 entre dos fechas, o `null` si alguna falta o es inválida. */
function compareDates({ start, end }: DateRangeValue): number | null {
  const from = resolveBackendDate(start);
  const to = resolveBackendDate(end);
  if (!from || !to) return null;
  return Math.sign(msFromInstant(to) - msFromInstant(from));
}

/** `dateRangeValidator`: fin ≥ inicio (el que usa el form de campamentos). */
export function dateRange(value: DateRangeValue): ValidationResult {
  const comparison = compareDates(value);
  return comparison !== null && comparison < 0 ? M.INVALID_DATE_RANGE : null;
}

export interface FechasCampamentoValue {
  readonly fechaInicio: unknown;
  readonly fechaFin: unknown;
}

/** `fechaCampamentoValidator`: fin estrictamente posterior al inicio. */
export function fechasCampamento({
  fechaInicio,
  fechaFin,
}: FechasCampamentoValue): ValidationResult {
  const comparison = compareDates({ start: fechaInicio, end: fechaFin });
  return comparison !== null && comparison <= 0 ? M.FECHAS_CAMPAMENTO : null;
}

export interface CredencialesValue {
  readonly email?: string | null;
  readonly password?: string | null;
}

/** Email y password de un educador: ambos o ninguno. */
export function credencialesCompletas({
  email,
  password,
}: CredencialesValue): ValidationResult {
  const hasEmail = (email ?? '').trim().length > 0;
  const hasPassword = (password ?? '').trim().length > 0;
  return hasEmail === hasPassword ? null : M.CREDENCIALES_INCOMPLETAS;
}

export interface ComprobanteValue {
  readonly requiereComprobante?: boolean;
  readonly comprobanteEntregado?: boolean | null;
}

export function comprobanteEntregado(
  value: ComprobanteValue,
): ValidationResult {
  return value.requiereComprobante && !value.comprobanteEntregado
    ? M.COMPROBANTE_PENDIENTE
    : null;
}

export interface BonificacionValue {
  readonly aplicar: boolean;
  readonly ano: number;
  readonly inscripciones: readonly {
    readonly ano: number;
    readonly estado?: string;
  }[];
}

/** No más de una inscripción bonificada por año. */
export function bonificacionDisponible({
  aplicar,
  ano,
  inscripciones,
}: BonificacionValue): ValidationResult {
  if (!aplicar) return null;
  const yaBonificada = inscripciones.some(
    (i) => i.ano === ano && i.estado === ESTADO_INSCRIPCION.BONIFICADO,
  );
  return yaBonificada ? M.BONIFICACION_NO_DISPONIBLE : null;
}

export interface SaldoValue {
  readonly monto: unknown;
  readonly saldo: number;
}

export function saldoSuficiente({
  monto,
  saldo,
}: SaldoValue): ValidationResult {
  const amount = Number(monto);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return amount > saldo ? M.SALDO_INSUFICIENTE(saldo) : null;
}
