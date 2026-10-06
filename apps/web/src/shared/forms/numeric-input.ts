import { LOCALE } from '@/shared/constants';

/**
 * Parseo de lo que el usuario tipea en campos numéricos/de monto. Acepta formato
 * es-AR (`1.234,56`) y también punto decimal (`12.5`). Nunca devuelve `NaN`:
 * texto vacío o inválido → `null`.
 */
const MONEY_ALLOWED_CHARS = /[^\d.,]/g;
const DOT = '.';
const COMMA = ',';
const THOUSANDS_GROUP_LENGTH = 3;
const PLAIN_NUMBER = /^-?\d+(\.\d+)?$/;
const MAX_FRACTION_DIGITS = 2;
/** Un separador final (`'500,'`, `'1.234,'`) es un decimal a medio tipear: se ignora. */
const TRAILING_SEPARATOR = /[.,]$/;

const MONEY_FORMATTER = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: MAX_FRACTION_DIGITS,
});

/** Deja solo dígitos y separadores (lo que el campo de monto acepta tipear). */
export function sanitizeMoneyInput(input: string): string {
  return input.replace(MONEY_ALLOWED_CHARS, '');
}

function isThousandsDot(text: string): boolean {
  const parts = text.split(DOT);
  if (parts.length > 2) return true;
  return (parts[1] ?? '').length === THOUSANDS_GROUP_LENGTH;
}

function normalizeSeparators(text: string): string {
  if (text.includes(COMMA)) {
    return text.split(DOT).join('').replace(COMMA, DOT);
  }
  if (text.includes(DOT) && isThousandsDot(text)) {
    return text.split(DOT).join('');
  }
  return text;
}

/** Convierte texto plano (`'12.5'`, `'-3'`) a número finito o `null`. */
export function parseNumberInput(input: string): number | null {
  const text = input.trim();
  if (!PLAIN_NUMBER.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

/** Convierte un monto tipeado (`'1.234,56'`, `'1234.5'`, `'$ 500'`) a número o `null`. */
export function parseMoneyInput(input: string): number | null {
  const text = sanitizeMoneyInput(input).replace(TRAILING_SEPARATOR, '');
  if (!text) return null;
  return parseNumberInput(normalizeSeparators(text));
}

/** Formato es-AR para mostrar un monto en el input (`1.234,5`); `''` si es null. */
export function formatMoneyInput(value: number | null): string {
  return value === null || !Number.isFinite(value)
    ? ''
    : MONEY_FORMATTER.format(value);
}
