'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId } from 'react';

import { SegmentedTabs } from '@/shared/components/data';
import type { CampamentoDetalle } from '@/shared/domain';
import { MovimientosTab } from '@/features/campamentos/components/movimientos-tab';
import type { ParticipanteHandlers } from '@/features/campamentos/components/participante-row-actions';
import { ParticipantesTab } from '@/features/campamentos/components/participantes-tab';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import {
  CAMP_TAB,
  CAMP_TAB_QUERY_PARAM,
  resolveCampTab,
  type CampTab,
} from '@/features/campamentos/helpers/detalle-tabs';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

export interface DetailTabsProps {
  readonly detalle: CampamentoDetalle;
  readonly state: CampamentoDetalleState;
  readonly handlers: ParticipanteHandlers;
  readonly onGasto: () => void;
}

/** Tab activo en la URL (`?tab=`), igual que el detalle de eventos. */
function useActiveTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = resolveCampTab(searchParams.get(CAMP_TAB_QUERY_PARAM));
  const select = (tab: CampTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(CAMP_TAB_QUERY_PARAM, tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return { active, select };
}

function tabItems({
  detalle,
  state,
}: Pick<DetailTabsProps, 'detalle' | 'state'>) {
  return [
    {
      value: CAMP_TAB.PARTICIPANTES,
      label: C.TAB_PARTICIPANTES,
      count: state.participantes.length,
    },
    {
      value: CAMP_TAB.MOVIMIENTOS,
      label: C.TAB_MOVIMIENTOS,
      count: detalle.movimientos.length,
    },
  ];
}

/** Pestañas Participantes / Movimientos con su contador. */
export function DetailTabs({
  detalle,
  state,
  handlers,
  onGasto,
}: DetailTabsProps) {
  const { active, select } = useActiveTab();
  const baseId = useId();
  const panelId = (tab: CampTab) => `${baseId}-${tab}`;
  return (
    <section className="flex flex-col gap-4">
      <SegmentedTabs<CampTab>
        items={tabItems({ detalle, state })}
        value={active}
        onValueChange={select}
        ariaLabel={C.TABS_LABEL}
        getPanelId={panelId}
        className="self-start"
      />
      <div
        role="tabpanel"
        id={panelId(active)}
        tabIndex={0}
        className="focus-visible:outline-none"
      >
        {active === CAMP_TAB.PARTICIPANTES ? (
          <ParticipantesTab state={state} handlers={handlers} />
        ) : (
          <MovimientosTab
            state={state}
            movimientos={detalle.movimientos}
            actions={handlers.actions}
            onGasto={onGasto}
          />
        )}
      </div>
    </section>
  );
}
