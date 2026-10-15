import Link from 'next/link';

import { DirectionTile, Money } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { movimientoEditHref } from '@/shared/constants';
import type { MovimientoGroup as Group } from '@/features/personas/helpers/ficha';

const ROW_CLASSES =
  'group relative flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-recessed/70 ' +
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus md:px-[18px]';

/** Un mes de actividad como línea de tiempo: movimientos con dirección y monto con signo; cada uno abre su edición. */
export function MovimientoGroup({ group }: { readonly group: Group }) {
  return (
    <section aria-label={group.label || undefined}>
      {group.label ? (
        <h3 className="px-4 pt-3 pb-1 text-xs font-medium text-ink-subtle md:px-[18px]">
          {group.label}
        </h3>
      ) : null}
      <ul className="relative before:absolute before:inset-y-3 before:left-[30px] before:w-px before:bg-border md:before:left-8">
        {group.rows.map((row) => (
          <li key={row.id}>
            <Link href={movimientoEditHref(row.id)} className={ROW_CLASSES}>
              <DirectionTile direction={row.direction} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {row.title}
                </p>
                <p className="truncate text-xs text-ink-subtle">{row.detail}</p>
              </div>
              <Money
                amount={row.amount}
                sign="auto"
                className="shrink-0 text-sm"
              />
              <NavChevron />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
