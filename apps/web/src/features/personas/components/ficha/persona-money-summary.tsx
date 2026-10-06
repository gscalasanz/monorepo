import { CircleAlert, Wallet } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { cn } from '@/shared/lib/utils';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { saldoTone, type SaldoTone } from '@/features/personas/helpers/ficha';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { DeudaBreakdownRow } from '@/features/personas/components/ficha/deuda-breakdown-row';
import { SummaryCellTitle } from '@/features/personas/components/ficha/summary-cell-title';

const SALDO_CLASSES: Readonly<Record<SaldoTone, string>> = {
  positive: 'text-money-in',
  negative: 'text-danger',
  zero: 'text-ink',
};

/** Saldo de la cuenta personal (cifra principal) + deuda total con su desglose. */
export function PersonaMoneySummary({
  dashboard,
}: {
  readonly dashboard: PersonaDashboard;
}) {
  const { saldo } = dashboard.cuentaPersonal;
  const deuda = dashboard.deudaTotal;
  return (
    <section className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-xs md:grid-cols-2 [&>*]:bg-surface">
      <div className="flex flex-col gap-2 p-4 md:p-[18px]">
        <SummaryCellTitle icon={Wallet}>{C.SALDO}</SummaryCellTitle>
        <Money
          amount={saldo}
          sign={saldo < 0 ? 'auto' : undefined}
          size="figure"
          className={cn(SALDO_CLASSES[saldoTone(saldo)])}
        />
        <p className="text-[13px] text-ink-muted">{C.SALDO_HINT}</p>
      </div>
      <div className="flex flex-col gap-3 p-4 md:p-[18px]">
        <SummaryCellTitle icon={CircleAlert}>{C.DEUDA_TOTAL}</SummaryCellTitle>
        <Money
          amount={deuda.total}
          tone={deuda.total > 0 ? 'debt' : undefined}
          size="figure"
        />
        <ul
          aria-label={C.DEUDA_BREAKDOWN_LABEL}
          className="flex flex-col gap-3"
        >
          <DeudaBreakdownRow
            label={C.DEUDA_INSCRIPCIONES}
            amount={deuda.inscripciones}
            total={deuda.total}
          />
          <DeudaBreakdownRow
            label={C.DEUDA_CAMPAMENTOS}
            amount={deuda.campamentos}
            total={deuda.total}
          />
        </ul>
      </div>
    </section>
  );
}
