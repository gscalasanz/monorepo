'use client';

import { Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import type { CampamentoDetalle, ParticipantePago } from '@/shared/domain';
import { CampamentoDetailHeader } from '@/features/campamentos/components/campamento-detail-header';
import { CampamentoKpis } from '@/features/campamentos/components/campamento-kpis';
import { DetailDialogs } from '@/features/campamentos/components/detail-dialogs';
import { DetailTabs } from '@/features/campamentos/components/detail-tabs';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  useCampamentoDetalle,
  type CampamentoDetalleState,
} from '@/features/campamentos/hooks/use-campamento-detalle';
import { useDetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';
import { useDetalleDialogs } from '@/features/campamentos/hooks/use-detalle-dialogs';

function DetailContent({
  id,
  detalle,
  state,
}: {
  readonly id: string;
  readonly detalle: CampamentoDetalle;
  readonly state: CampamentoDetalleState;
}) {
  const actions = useDetalleActions(id, state.reload);
  const dialogs = useDetalleDialogs(id, state.reload);
  const { openPago, openBonificar } = dialogs;
  const handlers = useMemo(
    () => ({
      actions,
      onRegistrarPago: (p: ParticipantePago) => void openPago(p),
      onBonificar: openBonificar,
    }),
    [actions, openPago, openBonificar],
  );
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <CampamentoDetailHeader
        campamento={detalle.campamento}
        onAgregar={dialogs.openAgregar}
        onDelete={() => void actions.deleteCampamento()}
      />
      <CampamentoKpis detalle={detalle} />
      <DetailTabs
        detalle={detalle}
        state={state}
        handlers={handlers}
        onGasto={() => void dialogs.openGasto()}
      />
      <DetailDialogs detalle={detalle} dialogs={dialogs} />
    </div>
  );
}

/** `/campamentos/:id`: encabezado con acciones, KPIs y pestañas participantes / movimientos. */
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
