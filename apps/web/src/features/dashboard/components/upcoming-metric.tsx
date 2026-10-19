import Link from 'next/link';

import type { KpiItem } from '@/shared/components/charts';
import { StatusBadge } from '@/shared/components/data';
import type { BadgeTone } from '@/shared/components/data/status-badge-config';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { UPCOMING_KIND, type UpcomingItem, type UpcomingKind } from '@/features/dashboard/helpers/view-model';

const KIND_BADGE: Readonly<Record<UpcomingKind, { readonly label: string; readonly tone: BadgeTone }>> = {
  [UPCOMING_KIND.VENTA]: { label: C.EVENT_VENTA, tone: 'success' },
  [UPCOMING_KIND.GRUPO]: { label: C.EVENT_GRUPO, tone: 'info' },
  [UPCOMING_KIND.CAMPAMENTO]: { label: C.EVENT_CAMPAMENTO, tone: 'neutral' },
};

const shortDate = (item: UpcomingItem): string => formatDate(item.fecha, DATE_FORMATS.dayMonth).replace('.', '');

function UpcomingRow({ item }: { readonly item: UpcomingItem }) {
  const badge = KIND_BADGE[item.kind];
  return (
    <li>
      <Link href={item.href} className="-mx-2 flex min-h-11 items-center gap-2 rounded-md px-2 text-[13px] hover:bg-recessed md:min-h-8">
        <span className="shrink-0 text-xs font-medium whitespace-nowrap text-ink-subtle tabular-nums">{shortDate(item)}</span>
        <span className="min-w-0 flex-1 truncate font-medium text-ink">{item.nombre}</span>
        <StatusBadge label={badge.label} tone={badge.tone} hideIcon />
      </Link>
    </li>
  );
}

/** Celda de la franja de métricas: fecha del próximo y lista (máx. 3) de eventos y campamentos por venir. */
export function upcomingMetric(items: readonly UpcomingItem[]): KpiItem {
  const next = items[0];
  return {
    id: 'proximos',
    label: C.UPCOMING,
    value: next ? shortDate(next) : C.EMPTY,
    footer:
      items.length === 0 ? (
        <p className="text-[13px] text-ink-muted">{C.NO_UPCOMING}</p>
      ) : (
        <ul className="grid gap-0.5">
          {items.map((item) => <UpcomingRow key={`${item.kind}-${item.id}`} item={item} />)}
        </ul>
      ),
  };
}
