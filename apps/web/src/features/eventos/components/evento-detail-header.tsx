'use client';

import { BarChart3, Lock, Wallet } from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { DESTINO_GANANCIA_LABELS, type Evento } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { EventoHeaderMenu } from '@/features/eventos/components/evento-header-menu';
import { EventoTipoBadge } from '@/features/eventos/components/evento-tipo-badge';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import { puedeHabilitarMovimientos } from '@/features/eventos/helpers/evento-detail';
import type { EventoDetailData } from '@/features/eventos/hooks/use-evento-detail';
import { useEventoActions } from '@/features/eventos/hooks/use-evento-actions';

const C = EVENTOS_COPY.detail;

interface HeaderProps {
  readonly evento: Evento;
  readonly data: EventoDetailData;
}

function EstadoBadge({ evento }: { readonly evento: Evento }) {
  return evento.estaCerrado ? (
    <StatusBadge label={C.cerrado} tone="neutral" icon={Lock} />
  ) : (
    <StatusBadge label={C.enCurso} tone="brand" />
  );
}

/** Tipo · fecha · tipo de evento · destino de la ganancia · estado. */
function HeaderMeta({ evento }: { readonly evento: Evento }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <EventoTipoBadge tipo={evento.tipo} />
      <span className="tabular-nums">
        {formatDate(evento.fecha, DATE_FORMATS.dayMonthYear)}
      </span>
      {evento.tipoEvento && <span>{evento.tipoEvento}</span>}
      {evento.destinoGanancia && (
        <span>{DESTINO_GANANCIA_LABELS[evento.destinoGanancia]}</span>
      )}
      <EstadoBadge evento={evento} />
    </span>
  );
}

function HeaderActions({ evento, data }: HeaderProps) {
  const actions = useEventoActions({ data, evento });
  return (
    <>
      {puedeHabilitarMovimientos(evento) && (
        <Button
          size="sm"
          icon={<Wallet aria-hidden />}
          onClick={() => void actions.habilitar()}
        >
          {C.habilitar}
        </Button>
      )}
      <ButtonLink
        href={EVENTOS_ROUTES.reporte(evento.id)}
        variant="secondary"
        size="sm"
        icon={<BarChart3 aria-hidden />}
      >
        {C.verReporte}
      </ButtonLink>
      <EventoHeaderMenu evento={evento} actions={actions} />
    </>
  );
}

/** Encabezado del detalle: nombre, metadatos, estado y acciones del evento. */
export function EventoDetailHeader({ evento, data }: HeaderProps) {
  return (
    <PageHeader
      title={evento.nombre}
      subtitle={<HeaderMeta evento={evento} />}
      backHref={EVENTOS_ROUTES.list}
      backLabel={C.back}
      actions={<HeaderActions evento={evento} data={data} />}
    />
  );
}
