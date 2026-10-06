/** Dinero ARS (port exacto de `money.pipe`: `$ 1.234`, `-` si no hay valor). */
import { CURRENCY, LOCALE } from '@/shared/constants';

export type MoneyDecimals = 0 | 2;

export interface MoneyOptions {
  /** 0 (default, convención dominante de la app) o 2 para centavos. */
  readonly decimals?: MoneyDecimals;
  /** Texto para null/undefined/NaN. */
  readonly placeholder?: string;
}

const EMPTY_PLACEHOLDER = '-';

const formatters: Readonly<Record<MoneyDecimals, Intl.NumberFormat>> = {
  0: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  2: new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

export function formatMoney(
  value: number | null | undefined,
  { decimals = 0, placeholder = EMPTY_PLACEHOLDER }: MoneyOptions = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return placeholder;
  }
  return formatters[decimals].format(value);
}
