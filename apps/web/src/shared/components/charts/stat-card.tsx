import type { LucideIcon } from 'lucide-react';

import { formatMoney } from '@/shared/format';
import { LOCALE } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

const VARIANT_CLASSES = {
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
} as const;

export type StatCardVariant = keyof typeof VARIANT_CLASSES;
export type StatCardFormat = 'number' | 'currency';

const numberFormatter = new Intl.NumberFormat(LOCALE);

export interface StatCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly value: number;
  readonly variant?: StatCardVariant;
  readonly format?: StatCardFormat;
  readonly className?: string;
}

/** Una métrica suelta (paridad con `stat-card` de Angular). Para varias juntas usar `KpiStrip`. */
export function StatCard({ icon: Icon, title, value, variant = 'info', format = 'number', className }: StatCardProps) {
  const display = format === 'currency' ? formatMoney(value) : numberFormatter.format(value);
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-4 shadow-xs md:px-[18px]', className)}>
      <span aria-hidden className={cn('grid size-9 shrink-0 place-items-center rounded-lg', VARIANT_CLASSES[variant])}>
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] text-ink-muted">{title}</p>
        <p className="text-2xl leading-[30px] font-semibold tracking-[-0.025em] text-ink tabular-nums">{display}</p>
      </div>
    </div>
  );
}
