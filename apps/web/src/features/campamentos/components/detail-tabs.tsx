'use client';

import { Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { SegmentedTabs } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { CampamentoDetalle } from '@/shared/domain';
import { MovimientosTab } from '@/features/campamentos/components/movimientos-tab';
import type { ParticipanteHandlers } from '@/features/campamentos/components/participante-card';
import { ParticipantesTab } from '@/features/campamentos/components/participantes-tab';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

const TABS = {
  PARTICIPANTES: 'participantes',
  MOVIMIENTOS: 'movimientos',
} as const;
type Tab = (typeof TABS)[keyof typeof TABS];

const TAB_ITEMS = [
  { value: TABS.PARTICIPANTES, label: C.TAB_PARTICIPANTES },
  { value: TABS.MOVIMIENTOS, label: C.TAB_MOVIMIENTOS },
] as const;

const panelId = (tab: Tab): string => `campamento-tab-${tab}`;

export interface DetailTabsProps {
  readonly detalle: CampamentoDetalle;
  readonly state: CampamentoDetalleState;
  readonly handlers: ParticipanteHandlers;
  readonly onAgregar: () => void;
  readonly onGasto: () => void;
}

/** Tabs Participantes / Movimientos con su acción contextual ("Agregar" / "Gasto"). */
export function DetailTabs({
  detalle,
  state,
  handlers,
  onAgregar,
  onGasto,
}: DetailTabsProps) {
  const [tab, setTab] = useState<Tab>(TABS.PARTICIPANTES);
  const isParticipantes = tab === TABS.PARTICIPANTES;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <SegmentedTabs<Tab>
          items={TAB_ITEMS}
          value={tab}
          onValueChange={setTab}
          ariaLabel={C.TABS_LABEL}
          getPanelId={panelId}
        />
        {isParticipantes ? (
          <Button
            icon={<UserPlus aria-hidden className="size-4" />}
            onClick={onAgregar}
          >
            {C.AGREGAR}
          </Button>
        ) : (
          <Button
            icon={<Plus aria-hidden className="size-4" />}
            onClick={onGasto}
          >
            {C.GASTO}
          </Button>
        )}
      </div>
      <div role="tabpanel" id={panelId(tab)}>
        {isParticipantes ? (
          <ParticipantesTab state={state} handlers={handlers} />
        ) : (
          <MovimientosTab
            state={state}
            movimientos={detalle.movimientos}
            actions={handlers.actions}
          />
        )}
      </div>
    </section>
  );
}
