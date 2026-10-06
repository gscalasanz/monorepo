'use client';

import { CalendarDays, Clock, Mountain, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import type { CampamentoDetalle } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DATE_FORMATS, formatDate, nowMs } from '@/shared/time';
import { DetailDialogs } from '@/features/campamentos/components/detail-dialogs';
import { DetailSummary } from '@/features/campamentos/components/detail-summary';
import { DetailTabs } from '@/features/campamentos/components/detail-tabs';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import { daysUntil } from '@/features/campamentos/helpers/camp-status';
import {
  useCampamentoDetalle,
  type CampamentoDetalleState,
} from '@/features/campamentos/hooks/use-campamento-detalle';
import { useDetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';
import { useDetalleDialogs } from '@/features/campamentos/hooks/use-detalle-dialogs';

function HeaderSubtitle({
  campamento,
}: {
  readonly campamento: CampamentoDetalle['campamento'];
}) {
  const [now] = useState(nowMs);
  const dias = daysUntil(campamento.fechaInicio, now);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden className="size-4" />
        {formatDate(campamento.fechaInicio, DATE_FORMATS.dayMonth)} —{' '}
        {formatDate(campamento.fechaFin, DATE_FORMATS.dayMonthYear)}
      </span>
      {dias !== null && (
        <span className="inline-flex items-center gap-1.5 font-medium text-brand">
          <Clock aria-hidden className="size-4" />
          {C.diasRestantes(dias)}
        </span>
      )}
    </span>
  );
}

function DetailFooter({ onDelete, onEdit }: { readonly onDelete: () => void; readonly onEdit: () => void }) {
  return (
    <footer className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
      <Button variant="danger-soft" icon={<Trash2 aria-hidden className="size-4" />} onClick={onDelete}>
        {C.ELIMINAR}
      </Button>
      <Button icon={<Pencil aria-hidden className="size-4" />} onClick={onEdit}>
        {C.EDITAR}
      </Button>
    </footer>
  );
}

function DetailContent({
  id,
  detalle,
  state,
}: {
  readonly id: string;
  readonly detalle: CampamentoDetalle;
  readonly state: CampamentoDetalleState;
}) {
  const router = useRouter();
  const actions = useDetalleActions(id, state.reload);
  const dialogs = useDetalleDialogs(id, state.reload);
  const onEdit = () => router.push(CAMPAMENTO_ROUTES.edit(id));
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={detalle.campamento.nombre}
        subtitle={<HeaderSubtitle campamento={detalle.campamento} />}
        backHref={CAMPAMENTO_ROUTES.LIST}
        backLabel={C.BACK}
        actions={
          <Button
            variant="secondary"
            size="icon"
            aria-label={C.EDIT_ICON}
            onClick={onEdit}
          >
            <Pencil aria-hidden className="size-4" />
          </Button>
        }
      />
      <DetailSummary detalle={detalle} />
      <DetailTabs
        detalle={detalle}
        state={state}
        handlers={{
          actions,
          onRegistrarPago: (p) => void dialogs.openPago(p),
          onBonificar: dialogs.openBonificar,
        }}
        onAgregar={dialogs.openAgregar}
        onGasto={() => void dialogs.openGasto()}
      />
      <DetailFooter onDelete={() => void actions.deleteCampamento()} onEdit={onEdit} />
      <DetailDialogs detalle={detalle} dialogs={dialogs} />
    </div>
  );
}

/** `/campamentos/:id`: info, KPIs, participantes y movimientos. */
export function CampamentoDetailView({ id }: { readonly id: string }) {
  const router = useRouter();
  const state = useCampamentoDetalle(id);
  const back = () => router.push(CAMPAMENTO_ROUTES.LIST);
  if (state.initialLoading) return <LoadingState label={C.LOADING} />;
  if (state.detalle)
    return <DetailContent id={id} detalle={state.detalle} state={state} />;
  if (state.error) {
    return (
      <ErrorState
        message={state.error || C.ERROR_FALLBACK}
        onRetry={back}
        retryLabel={C.BACK}
      />
    );
  }
  return (
    <EmptyState
      icon={Mountain}
      title={C.NOT_FOUND}
      action={
        <Button variant="secondary" onClick={back}>
          {C.BACK_TO_LIST}
        </Button>
      }
    />
  );
}
