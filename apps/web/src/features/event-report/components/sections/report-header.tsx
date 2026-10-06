import type { ReactNode } from 'react';

import { DESTINO_GANANCIA_LABELS, TIPO_EVENTO_LABELS } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReporteMeta } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.header;

function Fact({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <li className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-ink-muted">
      {label}: <b className="font-medium text-ink">{children}</b>
    </li>
  );
}

/** Encabezado del reporte: eyebrow, nombre (h1) y fecha/tipo/destino/estado. */
export function ReportHeader({ evento }: { readonly evento: ReporteMeta }) {
  return (
    <header className="grid gap-3">
      <div className="grid gap-1">
        <p className="text-xs font-medium text-ink-subtle">{COPY.eyebrow}</p>
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.02em] text-ink md:text-[28px] md:leading-9">
          {evento.nombre}
        </h1>
      </div>
      <ul className="flex flex-wrap gap-2">
        <Fact label={COPY.fecha}>
          {formatDate(evento.fecha, DATE_FORMATS.longDate)}
        </Fact>
        <Fact label={COPY.tipo}>{TIPO_EVENTO_LABELS[evento.tipo]}</Fact>
        {evento.destinoGanancia ? (
          <Fact label={COPY.destino}>
            {DESTINO_GANANCIA_LABELS[evento.destinoGanancia]}
          </Fact>
        ) : null}
        <Fact label={COPY.estado}>
          {evento.estaCerrado ? COPY.cerrado : COPY.abierto}
        </Fact>
      </ul>
    </header>
  );
}
