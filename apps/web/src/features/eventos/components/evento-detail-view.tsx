'use client';

import { CalendarX } from 'lucide-react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { EventoDetailHeader } from '@/features/eventos/components/evento-detail-header';
import {
  EntregasPorProducto,
  EventoKpis,
} from '@/features/eventos/components/evento-kpis';
import { EventoTabs } from '@/features/eventos/components/evento-tabs';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import {
  useEventoDetail,
  type EventoDetailData,
} from '@/features/eventos/hooks/use-evento-detail';

const C = EVENTOS_COPY.detail;

function BackLink() {
  return (
    <ButtonLink href={EVENTOS_ROUTES.list} variant="secondary">
      {C.back}
    </ButtonLink>
  );
}

function EventoDetailContent({
  evento,
  data,
}: {
  readonly evento: Evento;
  readonly data: EventoDetailData;
}) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <EventoDetailHeader evento={evento} data={data} />
      <EventoKpis evento={evento} kpis={data.kpis.data} />
      {evento.tipo === TIPO_EVENTO.VENTA && (
        <EntregasPorProducto stock={data.entregas.query.data?.stock ?? []} />
      )}
      <EventoTabs evento={evento} data={data} />
    </div>
  );
}

/** `/eventos/:id` — header, KPIs, entregas por producto y tabs. */
export function EventoDetailView({ id }: { readonly id: string }) {
  const data = useEventoDetail(id);
  const evento = data.evento.data;
  if (evento) return <EventoDetailContent evento={evento} data={data} />;
  if (data.evento.error) {
    return (
      <div className="mt-8 grid justify-items-center gap-2">
        <ErrorState
          title={C.loadError}
          message={data.evento.error}
          onRetry={() => void data.evento.reload()}
        />
        <BackLink />
      </div>
    );
  }
  if (data.evento.isLoading) return <LoadingState className="mt-8" />;
  return (
    <EmptyState icon={CalendarX} title={C.notFound} action={<BackLink />} />
  );
}
