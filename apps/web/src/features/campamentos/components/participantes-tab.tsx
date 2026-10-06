'use client';

import { SearchX, UserPlus } from 'lucide-react';

import { FilterBar } from '@/shared/components/data';
import { EmptyState, LoadingState } from '@/shared/components/feedback';
import {
  ParticipanteCard,
  type ParticipanteHandlers,
} from '@/features/campamentos/components/participante-card';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import { PARTICIPANTES_FILTER_FIELDS } from '@/features/campamentos/constants/filters';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

export interface ParticipantesTabProps {
  readonly state: CampamentoDetalleState;
  readonly handlers: ParticipanteHandlers;
}

function ParticipantesList({ state, handlers }: ParticipantesTabProps) {
  if (state.participantes.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {state.participantes.map((p) => (
          <ParticipanteCard key={p.id} participante={p} handlers={handlers} />
        ))}
      </div>
    );
  }
  if (state.hasFilter)
    return (
      <EmptyState
        icon={SearchX}
        title={C.NO_RESULTS}
        hint={C.NO_RESULTS_HINT}
      />
    );
  return <EmptyState icon={UserPlus} title={C.EMPTY} hint={C.EMPTY_HINT} />;
}

/** Tab "Participantes": filtros auto-aplicados + cards. */
export function ParticipantesTab({ state, handlers }: ParticipantesTabProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        fields={PARTICIPANTES_FILTER_FIELDS}
        value={state.filterValues}
        onChange={state.onFilterChange}
      />
      {state.refreshing && <LoadingState label={C.SEARCHING} />}
      <ParticipantesList state={state} handlers={handlers} />
    </div>
  );
}
