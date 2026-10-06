import { DirectionTile, Money } from '@/shared/components/data';
import type { MovimientoGroup as Group } from '@/features/personas/helpers/ficha';

/** Un mes de actividad: encabezado + movimientos con dirección y monto con signo. */
export function MovimientoGroup({ group }: { readonly group: Group }) {
  return (
    <section aria-label={group.label || undefined}>
      {group.label ? (
        <h3 className="px-4 pt-3 pb-1 text-xs font-medium text-ink-subtle md:px-[18px]">
          {group.label}
        </h3>
      ) : null}
      <ul>
        {group.rows.map((row) => (
          <li
            key={row.id}
            className="flex min-h-14 items-center gap-3 px-4 py-2 md:px-[18px]"
          >
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
          </li>
        ))}
      </ul>
    </section>
  );
}
