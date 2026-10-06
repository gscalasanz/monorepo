'use client';

import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { Campamento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CampBadge } from '@/features/campamentos/components/camp-badge';
import { CARD_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import { CAMPAMENTO_LIMITS } from '@/features/campamentos/helpers/campamento-form';
import type { CardBadge } from '@/features/campamentos/helpers/camp-status';

export interface CampamentoCardProps {
  readonly campamento: Campamento;
  readonly badge: CardBadge;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

function CardStat({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col-reverse gap-0.5">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="truncate text-sm font-semibold text-ink tabular-nums">{children}</dd>
    </div>
  );
}

function CardFooter({ campamento, onEdit, onDelete }: Omit<CampamentoCardProps, 'badge'>) {
  return (
    <footer className="relative z-10 mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
      <Link
        href={CAMPAMENTO_ROUTES.detail(campamento.id)}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand hover:underline md:min-h-0"
      >
        <Eye aria-hidden className="size-4" />
        {C.VER_DETALLE}
      </Link>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon-sm" aria-label={C.EDITAR} onClick={() => onEdit(campamento.id)}>
          <Pencil aria-hidden className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={C.ELIMINAR}
          className="hover:text-danger"
          onClick={() => onDelete(campamento.id)}
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      </div>
    </footer>
  );
}

function CardTitle({ campamento, badge }: Pick<CampamentoCardProps, 'campamento' | 'badge'>) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-base font-semibold text-ink">
          <Link
            href={CAMPAMENTO_ROUTES.detail(campamento.id)}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-focus"
          >
            {campamento.nombre}
          </Link>
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
          <CalendarDays aria-hidden className="size-3.5" />
          {formatDate(campamento.fechaInicio, DATE_FORMATS.dayMonth)} —{' '}
          {formatDate(campamento.fechaFin, DATE_FORMATS.dayMonth)}
        </span>
      </div>
      <CampBadge badge={badge} />
    </div>
  );
}

/** Card de campamento: toda la card abre el detalle (link estirado); acciones encima. */
export function CampamentoCard(props: CampamentoCardProps) {
  const { campamento } = props;
  return (
    <article className="relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs transition-colors hover:border-border-strong">
      <CardTitle campamento={campamento} badge={props.badge} />
      <dl className="grid grid-cols-3 gap-3 rounded-lg bg-recessed px-3 py-2.5">
        <CardStat label={C.PARTICIPANTES}>{campamento.participantes?.length ?? 0}</CardStat>
        <CardStat label={C.COSTO}>
          <Money amount={campamento.costoPorPersona} />
        </CardStat>
        <CardStat label={C.CUOTAS}>{campamento.cuotasBase ?? CAMPAMENTO_LIMITS.DEFAULT_CUOTAS}</CardStat>
      </dl>
      {campamento.descripcion && (
        <p className="line-clamp-2 text-[13px] text-ink-muted">{campamento.descripcion}</p>
      )}
      <CardFooter campamento={campamento} onEdit={props.onEdit} onDelete={props.onDelete} />
    </article>
  );
}
