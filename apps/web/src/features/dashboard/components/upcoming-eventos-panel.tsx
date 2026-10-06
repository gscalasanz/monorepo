import Link from 'next/link';

import { StatusBadge } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { APP_ROUTES } from '@/shared/constants';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';

const CATEGORY_LABEL = { [TIPO_EVENTO.VENTA]: 'Venta', [TIPO_EVENTO.GRUPO]: 'Grupo' } as const;

/** Próximos 3 eventos con badge de fecha y categoría. */
export function UpcomingEventosPanel({ eventos }: { eventos: readonly Evento[] }) {
  return (
    <Panel title={C.UPCOMING} action={{ label: C.SEE_ALL, href: APP_ROUTES.EVENTOS }} flush>
      {eventos.length === 0 ? (
        <EmptyState title={C.NO_UPCOMING} />
      ) : (
        <ul className="divide-y divide-border">
          {eventos.map((evento) => (
            <li key={evento.id}>
              <Link
                href={`${APP_ROUTES.EVENTOS}/${evento.id}`}
                className="flex min-h-16 items-center gap-3 px-4 py-2.5 hover:bg-recessed/70 md:px-[18px]"
              >
                <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-recessed leading-none">
                  <span className="text-[11px] font-medium text-ink-subtle uppercase">
                    {formatDate(evento.fecha, DATE_FORMATS.monthShort).replace('.', '')}
                  </span>
                  <span className="text-base font-semibold text-ink">{formatDate(evento.fecha, DATE_FORMATS.dayOfMonth)}</span>
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{evento.nombre}</span>
                <StatusBadge
                  label={CATEGORY_LABEL[evento.tipo]}
                  tone={evento.tipo === TIPO_EVENTO.VENTA ? 'success' : 'info'}
                  hideIcon
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
