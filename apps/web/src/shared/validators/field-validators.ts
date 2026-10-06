/**
 * Validadores de campo (port de `shared/validators/custom-validators.ts`, que es
 * la variante que usan los forms de Angular). Vacío → válido: lo obligatorio
 * lo valida `required`.
 */
import { RAMAS, type Rama } from '@/shared/domain';
import { VALIDATION_MESSAGES as M } from '@/shared/validators/messages';
import type { ValidationResult, Validator } from '@/shared/validators/types';

type FieldValue = string | number | null | undefined;

/** Paridad: `0` (falsy) pasa, igual que en Angular (los pagos mixtos admiten 0 físico). */
function isBlank(value: FieldValue): boolean {
  return !value;
}

export function positiveNumber(value: FieldValue): ValidationResult {
  if (isBlank(value)) return null;
  const num = Number(value);
  return Number.isNaN(num) || num <= 0 ? M.POSITIVE_NUMBER : null;
}

const DECIMAL_SEPARATOR = '.';
const MAX_DECIMAL_PARTS = 2;

export function decimalPlaces(maxDecimals: number): Validator<FieldValue> {
  return (value) => {
    if (isBlank(value)) return null;
    const parts = String(value).split(DECIMAL_SEPARATOR);
    if (parts.length > MAX_DECIMAL_PARTS) return M.INVALID_DECIMAL;
    const decimals = parts[1] ?? '';
    return decimals.length > maxDecimals ? M.MAX_DECIMALS(maxDecimals) : null;
  };
}

/** Caracteres peligrosos (HTML/SQL/XSS) que rechaza el Angular. */
const DANGEROUS_CHARS = /[<>"';&|`]/;

export function safeText(value: string | null | undefined): ValidationResult {
  return value && DANGEROUS_CHARS.test(value) ? M.UNSAFE_TEXT : null;
}

function isRama(value: string): value is Rama {
  return (RAMAS as readonly string[]).includes(value);
}

export function ramaValida(value: string | null | undefined): ValidationResult {
  return value && !isRama(value) ? M.INVALID_RAMA : null;
}

export function maxAmount(max: number): Validator<FieldValue> {
  return (value) =>
    !isBlank(value) && Number(value) > max ? M.MAX_AMOUNT(max) : null;
}
