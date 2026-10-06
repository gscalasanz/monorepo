import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

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

const LINK_CLASSES =
  'flex min-h-16 items-start gap-3 px-4 py-3 hover:bg-recessed/70 focus-visible:outline-2 ' +
  'focus-visible:-outline-offset-2 focus-visible:outline-focus md:px-[18px]';

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
          className="grid size-7 shrink-0 place-items-center rounded-md bg-recessed text-ink-muted ring-1 ring-border"
        >
          <Icon className="size-3.5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-medium text-ink">{title}</span>
            <span className="text-xs text-ink-subtle tabular-nums">{year}</span>
            {badges}
          </span>
          <span className="flex items-center gap-3">
            <ProgressBar
              ratio={paidRatio({ pagado, total })}
              fillClassName={pendiente > 0 ? 'bg-warning' : 'bg-success'}
              className="max-w-36"
            />
            <span className="text-xs whitespace-nowrap text-ink-subtle tabular-nums">
              {C.PAGADO_DE(formatMoney(pagado), formatMoney(total))}
            </span>
          </span>
        </span>
        <ObligacionSaldo pendiente={pendiente} />
      </Link>
    </li>
  );
}
