import {
  FileWarning,
  OctagonAlert,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { Money } from '@/shared/components/data';
import { cn } from '@/shared/lib/utils';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import type {
  DebtorCategory,
  DebtorKey,
} from '@/features/inscripciones/helpers/consolidado';
import { RamaBreakdown } from '@/features/inscripciones/components/dashboard/rama-breakdown';

const ICONS: Readonly<Record<DebtorKey, LucideIcon>> = {
  dinero: Wallet,
  documentacion: FileWarning,
  ambos: OctagonAlert,
};

const ICON_TONE: Readonly<Record<DebtorKey, string>> = {
  dinero: 'bg-warning-soft text-warning',
  documentacion: 'bg-info-soft text-info',
  ambos: 'bg-danger-soft text-danger',
};

/** Una categoría de deudores: cantidad, monto (si aplica) y desglose por rama. */
export function DebtorCard({
  category,
}: {
  readonly category: DebtorCategory;
}) {
  const Icon = ICONS[category.key];
  return (
    <li className="grid content-start gap-3 rounded-lg border border-border p-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-md',
            ICON_TONE[category.key],
          )}
        >
          <Icon aria-hidden className="size-[18px]" />
        </span>
        <div className="grid">
          <span className="text-sm font-semibold text-ink">
            {category.label}
          </span>
          <span className="text-xs text-ink-subtle">
            {category.description}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-ink tabular-nums">
            {category.count}
          </span>
          <span className="text-[13px] text-ink-muted">{C.PERSONAS}</span>
        </span>
        {category.monto ? (
          <span className="grid text-right">
            <span className="text-xs text-ink-subtle">{C.MONTO_TOTAL}</span>
            <Money
              amount={category.monto}
              tone="debt"
              className="text-sm font-medium"
            />
          </span>
        ) : null}
      </div>
      <RamaBreakdown items={category.breakdown} />
    </li>
  );
}
