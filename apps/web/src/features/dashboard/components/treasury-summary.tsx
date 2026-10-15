import { Landmark, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { ChartLegend, DistributionBar } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { formatMoney } from '@/shared/format';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { CAJAS_HREF, PENDING_LINKS } from '@/features/dashboard/constants/dashboard';
import { monthName, type MonthFlow } from '@/features/dashboard/helpers/cash-flow';
import type { TreasuryModel } from '@/features/dashboard/helpers/view-model';

const PENDING_ROW_CLASSES =
  'group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-md px-2 text-[13px] transition-colors hover:bg-recessed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus md:min-h-8';

function NetOfMonth({ month }: { readonly month: MonthFlow }) {
  return (
    <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
      <TrendingUp aria-hidden className="size-3.5 text-money-in" />
      <Money amount={month.ingresos - month.egresos} sign="auto" className="font-medium" />
      <span>neto de {monthName(month.month)}</span>
    </p>
  );
}

function PendingRow({ label, amount, href }: { readonly label: string; readonly amount: number; readonly href: string }) {
  return (
    <li>
      <Link href={href} className={PENDING_ROW_CLASSES}>
        <span className="text-ink-muted">{label}</span>
        <span className="flex items-center gap-1">
          <Money amount={amount} className="font-medium text-ink" />
          <NavChevron />
        </span>
      </Link>
    </li>
  );
}

/** Saldo de cada caja como fila-link de la leyenda (monto alineado + chevron). */
function legendItems(treasury: TreasuryModel) {
  return treasury.segments.map((segment) => ({
    label: segment.label,
    color: segment.color,
    value: formatMoney(segment.value),
    href: segment.href,
  }));
}

/**
 * Tesorería en dos columnas: a la izquierda la cifra protagonista y la barra de reparto; a la
 * derecha el detalle por caja y los pendientes. Todo navega a su pantalla.
 */
export function TreasurySummary({ treasury, currentMonth }: { readonly treasury: TreasuryModel; readonly currentMonth: MonthFlow | undefined }) {
  return (
    <div className="grid gap-5 p-4 md:p-[18px] lg:grid-cols-2 lg:gap-10">
      <div className="flex min-w-0 flex-col justify-between gap-4">
        <Link href={CAJAS_HREF} className="group inline-flex w-fit items-center gap-2 text-[13px] text-ink-muted hover:text-ink">
          <Landmark aria-hidden className="size-4 text-ink-subtle" />
          {C.TREASURY}
          <NavChevron />
        </Link>
        <div className="grid gap-1.5">
          <Money amount={treasury.total} size="figure" />
          {currentMonth ? <NetOfMonth month={currentMonth} /> : null}
        </div>
        <DistributionBar segments={treasury.segments} showLegend={false} />
      </div>
      <div role="group" aria-label={C.SALDOS_LABEL} className="flex min-w-0 flex-col justify-center gap-3">
        <ChartLegend items={legendItems(treasury)} />
        <ul className="grid gap-0.5 border-t border-border pt-2">
          <PendingRow label={C.KPI_REEMBOLSOS} amount={treasury.reembolsos} href={PENDING_LINKS.reembolsos} />
          <PendingRow label={C.KPI_COBROS} amount={treasury.cobros} href={PENDING_LINKS.cobros} />
        </ul>
      </div>
    </div>
  );
}
