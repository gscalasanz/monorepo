import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { formatMoney } from '@/shared/format';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { paidRatio } from '@/features/personas/helpers/ficha';
import { ObligacionSaldo } from '@/features/personas/components/ficha/obligacion-saldo';
import { ProgressBar } from '@/features/personas/components/ficha/progress-bar';

export interface ObligacionItemProps {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly year: number;
  /** Badges de estado (ícono + texto). */
  readonly badges?: ReactNode;
  readonly pagado: number;
  readonly total: number;
  readonly pendiente: number;
}

/**
 * Grilla de la fila: en mobile el badge baja debajo del título; desde `md` tiene su propia
 * columna de ancho fijo, así los badges de todas las filas quedan alineados.
 */
const LINK_CLASSES =
  'group grid min-h-16 grid-cols-[1.75rem_minmax(0,1fr)_auto_1rem] items-center gap-x-3 gap-y-1.5 px-4 py-3 ' +
  'hover:bg-recessed/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ' +
  'md:grid-cols-[1.75rem_minmax(0,1fr)_10.5rem_auto_1rem] md:px-[18px]';

/** Obligación (inscripción o campamento): progreso de pago y saldo pendiente; navega al detalle. */
export function ObligacionItem({
  href,
  icon: Icon,
  title,
  year,
  badges,
  pagado,
  total,
  pendiente,
}: ObligacionItemProps) {
  return (
    <li>
      <Link href={href} className={LINK_CLASSES}>
        <span
          aria-hidden
          className="row-span-3 grid size-7 shrink-0 place-items-center self-start rounded-md bg-recessed text-ink-muted ring-1 ring-border md:row-span-2"
        >
          <Icon className="size-3.5" />
        </span>
        <span className="col-start-2 row-start-1 flex min-w-0 items-baseline gap-2">
          <span className="truncate text-sm font-medium text-ink">{title}</span>
          <span className="text-xs text-ink-subtle tabular-nums">{year}</span>
        </span>
        <span className="col-start-2 row-start-2 flex md:col-start-3 md:row-span-2 md:row-start-1 md:self-center">
          {badges}
        </span>
        <span className="col-start-2 row-start-3 flex items-center gap-3 md:row-start-2">
          <ProgressBar
            ratio={paidRatio({ pagado, total })}
            fillClassName={pendiente > 0 ? 'bg-warning' : 'bg-success'}
            className="max-w-36"
          />
          <span className="text-xs whitespace-nowrap text-ink-subtle tabular-nums">
            {C.PAGADO_DE(formatMoney(pagado), formatMoney(total))}
          </span>
        </span>
        <span className="col-start-3 row-span-3 row-start-1 md:col-start-4 md:row-span-2">
          <ObligacionSaldo pendiente={pendiente} />
        </span>
        <NavChevron className="col-start-4 row-span-3 row-start-1 md:col-start-5 md:row-span-2" />
      </Link>
    </li>
  );
}
