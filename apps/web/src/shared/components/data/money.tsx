import type { MoneyDecimals } from '@/shared/format';
import { formatMoney } from '@/shared/format';
import { cn } from '@/shared/lib/utils';

import { toMoneyParts, type MoneyDirection, type MoneySign } from '@/shared/components/data/money-parts';

const SIZE_CLASSES = {
  inline: 'font-medium',
  'figure-md': 'text-2xl leading-[30px] font-semibold tracking-[-0.025em]',
  figure: 'text-[34px] leading-10 font-semibold tracking-[-0.035em] md:text-[40px] md:leading-[44px]',
} as const;

/** `$` más chico y alineado arriba solo en cifras grandes (DESIGN §Tipografía). */
const SYMBOL_CLASSES = {
  inline: 'mr-[0.18em] font-normal',
  'figure-md': 'mr-[0.18em] align-[0.38em] text-[0.62em] font-medium tracking-normal',
  figure: 'mr-[0.22em] align-[0.62em] text-[0.5em] font-medium tracking-normal',
} as const;

const TONE_CLASSES: Readonly<Record<MoneyDirection | 'debt', string>> = {
  in: 'text-money-in',
  out: 'text-money-out',
  neutral: 'text-ink',
  debt: 'text-danger',
};

export type MoneySize = keyof typeof SIZE_CLASSES;

export interface MoneyProps {
  readonly amount: number | null | undefined;
  /** `in` → `+` verde · `out` → `−` tinta · `auto` según el signo del monto. */
  readonly sign?: MoneySign;
  /** `debt` → rojo, sin signo (la deuda se lee por contexto). */
  readonly tone?: 'debt';
  readonly size?: MoneySize;
  readonly decimals?: MoneyDecimals;
  /** Texto para monto nulo (default el de `formatMoney`: `-`). */
  readonly placeholder?: string;
  readonly className?: string;
}

/** Monto ARS con signo, color semántico y `$` subordinado. Tabular siempre. */
export function Money({
  amount,
  sign,
  tone,
  size = 'inline',
  decimals,
  placeholder,
  className,
}: MoneyProps) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return (
      <span className={cn('text-ink-subtle tabular-nums', className)}>
        {formatMoney(amount, { placeholder })}
      </span>
    );
  }
  const parts = toMoneyParts(amount, { sign: tone ? undefined : sign, decimals });
  const colored = tone !== undefined || parts.direction === 'in';
  return (
    <span
      data-direction={tone ?? parts.direction}
      className={cn(
        'whitespace-nowrap tabular-nums',
        SIZE_CLASSES[size],
        TONE_CLASSES[tone ?? parts.direction],
        className,
      )}
    >
      {parts.sign}
      <span className={cn(SYMBOL_CLASSES[size], colored ? 'opacity-80' : 'text-ink-subtle')}>
        {parts.symbol}
      </span>
      {parts.digits}
    </span>
  );
}
