import { formatMoney, type MoneyDecimals } from '@/shared/format';

/** Signo menos tipográfico (U+2212), no guion: DESIGN §Tipografía. */
export const MINUS_SIGN = '−';
export const PLUS_SIGN = '+';

export type MoneySign = 'in' | 'out' | 'auto';
export type MoneyDirection = 'in' | 'out' | 'neutral';

export interface MoneyParts {
  readonly sign: string;
  readonly symbol: string;
  readonly digits: string;
  readonly direction: MoneyDirection;
}

const SYMBOL_PATTERN = /^(\$)\s*(.*)$/u;

function resolveDirection(amount: number, sign?: MoneySign): MoneyDirection {
  if (sign === 'in' || sign === 'out') return sign;
  if (sign === 'auto' && amount !== 0) return amount > 0 ? 'in' : 'out';
  return 'neutral';
}

function signFor(amount: number, direction: MoneyDirection): string {
  if (direction === 'in') return PLUS_SIGN;
  if (direction === 'out' || amount < 0) return MINUS_SIGN;
  return '';
}

/**
 * Parte un monto en signo / `$` / cifra para poder estilar el `$` aparte.
 * Formatea el valor absoluto con `formatMoney` (es-AR) y pone el signo propio.
 */
export function toMoneyParts(
  amount: number,
  options: { readonly sign?: MoneySign; readonly decimals?: MoneyDecimals } = {},
): MoneyParts {
  const direction = resolveDirection(amount, options.sign);
  const formatted = formatMoney(Math.abs(amount), { decimals: options.decimals });
  const match = SYMBOL_PATTERN.exec(formatted);
  return {
    sign: signFor(amount, direction),
    symbol: match?.[1] ?? '',
    digits: match?.[2] ?? formatted,
    direction,
  };
}

/** Versión texto plano (`+$ 60.000`, `−$ 17.600`) para aria-labels y tooltips. */
export function formatSignedMoney(
  amount: number,
  options: { readonly sign?: MoneySign; readonly decimals?: MoneyDecimals } = {},
): string {
  const parts = toMoneyParts(amount, options);
  return `${parts.sign}${parts.symbol} ${parts.digits}`;
}
