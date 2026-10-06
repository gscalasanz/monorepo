import { Money, RamaChip } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import type { FondoRamaRow } from '@/features/dashboard/helpers/view-model';

/** Saldo de cada fondo de rama. */
export function FondosRamaPanel({ rows }: { rows: readonly FondoRamaRow[] }) {
  return (
    <Panel title={C.FONDOS} flush>
      {rows.length === 0 ? (
        <EmptyState title={C.NO_FONDOS} />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.rama} className="flex min-h-14 items-center justify-between gap-3 px-4 md:px-[18px]">
              <RamaChip rama={row.rama} variant="dot" className="text-sm" />
              <Money amount={row.saldo} className="text-sm font-medium" />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
