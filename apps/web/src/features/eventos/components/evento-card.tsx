'use client';

import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { EventoTipoBadge } from '@/features/eventos/components/evento-tipo-badge';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';

const C = EVENTOS_COPY.card;

export interface EventoCardProps {
  readonly evento: Evento;
  readonly onDelete: (evento: Evento) => void;
}

function EventoStat({ evento }: { readonly evento: Evento }) {
  if (evento.tipo === TIPO_EVENTO.VENTA) {
    return (
      <p className="text-sm text-ink-muted">
        <span className="font-semibold text-ink tabular-nums">
          {evento.productos?.length ?? 0}
        </span>{' '}
        {C.productos}
      </p>
    );
  }
  if (!evento.tipoEvento) return null;
  return (
    <p className="flex flex-col text-sm">
      <span className="font-medium text-ink">{evento.tipoEvento}</span>
      <span className="text-xs text-ink-subtle">{C.tipoEvento}</span>
    </p>
  );
}

function CardFooter({ evento, onDelete }: EventoCardProps) {
  return (
    <footer className="mt-auto flex items-center gap-2 border-t border-border pt-3">
      <ButtonLink
        href={EVENTOS_ROUTES.detail(evento.id)}
        size="sm"
        variant="secondary"
        icon={<Eye aria-hidden />}
      >
        {C.verDetalle}
      </ButtonLink>
      <div className="ml-auto flex gap-1">
        <Link
          href={EVENTOS_ROUTES.edit(evento.id)}
          aria-label={C.editar}
          className="grid size-10 place-items-center rounded-md text-ink-muted hover:bg-recessed hover:text-ink focus-visible:outline-2 focus-visible:outline-focus md:size-8"
        >
          <Pencil aria-hidden className="size-4" />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={C.eliminar}
          onClick={() => onDelete(evento)}
          className="hover:text-danger"
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      </div>
    </footer>
  );
}

/** Card de la grilla de eventos (port de `app-evento-card`). */
export function EventoCard({ evento, onDelete }: EventoCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs">
      <EventoTipoBadge tipo={evento.tipo} />
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold break-words text-ink">
          <Link
            href={EVENTOS_ROUTES.detail(evento.id)}
            className="hover:underline"
          >
            {evento.nombre}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
          <CalendarDays aria-hidden className="size-3.5" />
          {formatDate(evento.fecha, DATE_FORMATS.dayMonthYear)}
        </p>
      </header>
      <EventoStat evento={evento} />
      {evento.descripcion && (
        <p className="line-clamp-2 text-[13px] text-ink-muted">
          {evento.descripcion}
        </p>
      )}
      <CardFooter evento={evento} onDelete={onDelete} />
    </article>
  );
}
