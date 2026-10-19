'use client';

import { SearchX, UserPlus } from 'lucide-react';

import { FilterBar, ListPanel, ListToolbar } from '@/shared/components/data';
import { EmptyState, LoadingState } from '@/shared/components/feedback';
import type { ParticipanteHandlers } from '@/features/campamentos/components/participante-row-actions';
import { ParticipantesTable } from '@/features/campamentos/components/participantes-table';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import { PARTICIPANTES_FILTER_FIELDS } from '@/features/campamentos/constants/filters';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

export interface ParticipantesTabProps {
  readonly state: CampamentoDetalleState;
  readonly handlers: ParticipanteHandlers;
}

function ParticipantesBody({ state, handlers }: ParticipantesTabProps) {
  if (state.participantes.length > 0) {
    return (
      <ParticipantesTable
        participantes={state.participantes}
        handlers={handlers}
      />
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

/** Tab "Participantes": un card con filtros (auto-aplicados) y la tabla. */
export function ParticipantesTab({ state, handlers }: ParticipantesTabProps) {
  return (
    <ListPanel
      toolbar={
        <ListToolbar>
          <FilterBar
            fields={PARTICIPANTES_FILTER_FIELDS}
            value={state.filterValues}
            onChange={state.onFilterChange}
            className="min-w-0 flex-1"
          />
        </ListToolbar>
      }
    >
      {state.refreshing && <LoadingState label={C.SEARCHING} />}
      <ParticipantesBody state={state} handlers={handlers} />
    </ListPanel>
  );
}
