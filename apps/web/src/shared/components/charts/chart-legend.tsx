import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { NavChevron } from '@/shared/components/ui/nav-chevron';

export interface LegendItem {
  readonly label: string;
  readonly color: string;
  /** Valor ya formateado (alineado a la derecha, tabular). */
  readonly value?: string;
  /** Si está, la fila entera es un link (con chevron) a la pantalla de esa parte. */
  readonly href?: string;
}

export interface ChartLegendProps {
  readonly items: readonly LegendItem[];
  readonly className?: string;
}

const ROW_CLASSES = 'grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 text-[13px] text-ink';
const LINK_CLASSES =
  'group -mx-2 min-h-11 grid-cols-[10px_minmax(0,1fr)_auto_16px] rounded-md px-2 transition-colors hover:bg-recessed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus md:min-h-7';

function LegendContent({ item }: { readonly item: LegendItem }) {
  return (
    <>
      <span aria-hidden className="size-2 rounded-[2px]" style={{ background: item.color }} />
      <span className="truncate text-ink-muted">{item.label}</span>
      {item.value === undefined ? null : <span className="font-medium tabular-nums">{item.value}</span>}
      {item.href ? <NavChevron /> : null}
    </>
  );
}

/** Leyenda: swatch + nombre (ink) + monto alineado. Identidad nunca solo por color. */
export function ChartLegend({ items, className }: ChartLegendProps) {
  // Las filas-link ya traen su propia altura táctil: entre ellas alcanza un espacio mínimo.
  const linked = items.some((item) => item.href);
  return (
    <ul className={cn('grid', linked ? 'gap-0.5' : 'gap-2', className)}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {item.href ? (
            <Link href={item.href} className={cn(ROW_CLASSES, LINK_CLASSES)}>
              <LegendContent item={item} />
            </Link>
          ) : (
            <div className={ROW_CLASSES}>
              <LegendContent item={item} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
