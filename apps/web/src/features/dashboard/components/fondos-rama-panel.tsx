import Link from 'next/link';

import { ProgressTrack } from '@/shared/components/charts';
import { Money, RamaChip } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { Panel } from '@/shared/components/ui/panel';
import { CAJAS_TAB, cajasHref } from '@/shared/constants';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { RAMA_TRACK_COLOR } from '@/features/dashboard/constants/dashboard';
import type { FondoRamaRow } from '@/features/dashboard/helpers/view-model';

const RAMA_HREF = cajasHref(CAJAS_TAB.RAMA);
const ROW_CLASSES =
  'group grid gap-2 px-4 py-3 transition-colors hover:bg-recessed focus-visible:outline-2 focus-visible:outline-offset-[-2px] ' +
  'focus-visible:outline-focus md:px-[18px]';

/** Fondos de rama: punto + nombre, saldo y pista relativa al mayor fondo. Cada fila lleva a Cajas › Fondos de rama. */
export function FondosRamaPanel({ rows, className }: { readonly rows: readonly FondoRamaRow[]; readonly className?: string }) {
  const max = Math.max(0, ...rows.map((row) => row.saldo));
  return (
    <Panel title={C.FONDOS} flush className={className}>
      {rows.length === 0 ? (
        <EmptyState title={C.NO_FONDOS} />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.rama}>
              <Link href={RAMA_HREF} className={ROW_CLASSES}>
                <span className="flex items-center justify-between gap-3">
                  <RamaChip rama={row.rama} variant="dot" className="text-sm" />
                  <span className="flex items-center gap-1">
                    <Money amount={row.saldo} className="text-sm font-medium" />
                    <NavChevron />
                  </span>
                </span>
                <ProgressTrack value={row.saldo} max={max} color={RAMA_TRACK_COLOR[row.rama]} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
