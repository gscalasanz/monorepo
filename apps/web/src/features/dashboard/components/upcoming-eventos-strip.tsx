import Link from 'next/link';

import { StatusBadge } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { APP_ROUTES } from '@/shared/constants';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';

const CATEGORY_LABEL = { [TIPO_EVENTO.VENTA]: C.EVENT_VENTA, [TIPO_EVENTO.GRUPO]: C.EVENT_GRUPO } as const;

function EventChip({ evento }: { readonly evento: Evento }) {
  return (
    <li>
      <Link
        href={`${APP_ROUTES.EVENTOS}/${evento.id}`}
        className="group inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm hover:bg-recessed md:min-h-9"
      >
        <span className="text-xs font-medium whitespace-nowrap text-ink-subtle tabular-nums">
          {formatDate(evento.fecha, DATE_FORMATS.dayMonth).replace('.', '')}
        </span>
        <span className="font-medium text-ink">{evento.nombre}</span>
        <StatusBadge label={CATEGORY_LABEL[evento.tipo]} tone={evento.tipo === TIPO_EVENTO.VENTA ? 'success' : 'info'} hideIcon />
        <NavChevron />
      </Link>
    </li>
  );
}

/** Fila compacta con los próximos eventos (máx. 3): fecha corta, nombre y categoría. */
export function UpcomingEventosStrip({ eventos }: { readonly eventos: readonly Evento[] }) {
  return (
    <section
      aria-label={C.UPCOMING}
      className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-surface px-4 py-2 shadow-xs md:flex-nowrap md:px-[18px]"
    >
      <h2 className="text-sm font-semibold text-ink">{C.UPCOMING}</h2>
      {eventos.length === 0 ? (
        <p className="order-3 w-full text-[13px] text-ink-muted md:order-2 md:w-auto">{C.NO_UPCOMING}</p>
      ) : (
        <ul className="order-3 flex w-full min-w-0 flex-wrap items-center gap-x-1 md:order-2 md:w-auto md:flex-1">
          {eventos.map((evento) => <EventChip key={evento.id} evento={evento} />)}
        </ul>
      )}
      <Link href={APP_ROUTES.EVENTOS} className="group order-2 ml-auto inline-flex min-h-11 items-center gap-0.5 text-[13px] font-medium text-brand hover:underline md:order-3 md:min-h-9">
        {C.UPCOMING_ALL}
        <NavChevron className="size-3.5 text-brand group-hover:text-brand" />
      </Link>
    </section>
  );
}
