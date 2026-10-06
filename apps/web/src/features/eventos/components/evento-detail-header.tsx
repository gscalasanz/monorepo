'use client';

import {
  BarChart3,
  Globe,
  GlobeLock,
  Link2,
  Lock,
  Pencil,
  Wallet,
} from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { Evento } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { ButtonLink } from '@/features/eventos/components/button-link';
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

function HeaderMeta({ evento }: { readonly evento: Evento }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <EventoTipoBadge tipo={evento.tipo} />
      <span className="tabular-nums">
        {formatDate(evento.fecha, DATE_FORMATS.dayMonthYear)}
      </span>
      {evento.tipoEvento && <span>· {evento.tipoEvento}</span>}
      {evento.estaCerrado && (
        <StatusBadge label={C.cerrado} tone="neutral" icon={Lock} />
      )}
    </span>
  );
}

type Actions = ReturnType<typeof useEventoActions>;

interface ActionsProps {
  readonly evento: Evento;
  readonly actions: Actions;
}

function ReporteActions({ evento, actions }: ActionsProps) {
  return (
    <>
      <ButtonLink
        href={EVENTOS_ROUTES.reporte(evento.id)}
        variant="secondary"
        size="sm"
        icon={<BarChart3 aria-hidden />}
      >
        {C.verReporte}
      </ButtonLink>
      <Button
        variant="secondary"
        size="sm"
        loading={actions.toggling}
        aria-pressed={evento.reportePublico}
        icon={
          evento.reportePublico ? (
            <Globe aria-hidden />
          ) : (
            <GlobeLock aria-hidden />
          )
        }
        onClick={() => void actions.toggleReportePublico()}
      >
        {evento.reportePublico ? C.reportePublico : C.hacerPublico}
      </Button>
      {evento.reportePublico && (
        <Button
          variant="secondary"
          size="sm"
          icon={<Link2 aria-hidden />}
          onClick={() => void actions.copiarLink()}
        >
          {C.copiarLink}
        </Button>
      )}
    </>
  );
}

function EstadoActions({ evento, actions }: ActionsProps) {
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
      {!evento.estaCerrado && (
        <>
          <ButtonLink
            href={EVENTOS_ROUTES.edit(evento.id)}
            variant="secondary"
            size="sm"
            icon={<Pencil aria-hidden />}
          >
            <span className="sr-only">{C.editar}</span>
          </ButtonLink>
          <Button
            variant="danger-soft"
            size="sm"
            icon={<Lock aria-hidden />}
            onClick={() => void actions.cerrar()}
          >
            {C.cerrar}
          </Button>
        </>
      )}
    </>
  );
}

function HeaderActions({ evento, data }: HeaderProps) {
  const actions = useEventoActions({ data, evento });
  return (
    <>
      <ReporteActions evento={evento} actions={actions} />
      <EstadoActions evento={evento} actions={actions} />
    </>
  );
}

/** Encabezado del detalle: nombre, tipo, fecha, estado y acciones del evento. */
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
