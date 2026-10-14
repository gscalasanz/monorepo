'use client';

import { Mountain, Plus, SearchX } from 'lucide-react';

import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import { FilterBar, ListPanel, ListToolbar } from '@/shared/components/data';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { ButtonLink } from '@/shared/components/ui/button-link';
import { PageHeader } from '@/shared/layout';
import { CampamentosTable } from '@/features/campamentos/components/campamentos-table';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import type { CampStats } from '@/features/campamentos/helpers/camp-status';
import { CAMPAMENTO_FILTER_FIELDS } from '@/features/campamentos/helpers/campamento-list';
import { useCampamentosList } from '@/features/campamentos/hooks/use-campamentos-list';

type ListState = ReturnType<typeof useCampamentosList>;

function statsItems(stats: CampStats): readonly KpiItem[] {
  return [
    {
      id: 'total',
      label: C.STAT_TOTAL,
      hint: C.HINT_TOTAL,
      value: stats.total,
    },
    {
      id: 'upcoming',
      label: C.STAT_UPCOMING,
      hint: C.HINT_UPCOMING,
      value: stats.upcoming,
    },
    {
      id: 'active',
      label: C.STAT_ACTIVE,
      hint: C.HINT_ACTIVE,
      value: stats.active,
    },
    { id: 'past', label: C.STAT_PAST, hint: C.HINT_PAST, value: stats.past },
  ];
}

function CreateLink() {
  return (
    <ButtonLink href={CAMPAMENTO_ROUTES.CREATE} icon={<Plus aria-hidden />}>
      {C.CREATE}
    </ButtonLink>
  );
}

function CampamentosGrid({ state }: { readonly state: ListState }) {
  if (state.filtered.length === 0)
    return <EmptyState icon={SearchX} title={C.FILTERED_EMPTY} />;
  return (
    <CampamentosTable
      campamentos={state.filtered}
      onDelete={(camp) => void state.remove(camp.id)}
    />
  );
}

function ListBody({ state }: { readonly state: ListState }) {
  if (state.isLoading)
    return <LoadingState variant="skeleton" rows={4} label={C.LOADING} />;
  if (state.error && state.campamentos.length === 0) {
    return (
      <ErrorState
        message={state.error || C.ERROR_FALLBACK}
        onRetry={state.reload}
        retryLabel={C.RETRY}
      />
    );
  }
  if (state.campamentos.length === 0) {
    return (
      <EmptyState
        icon={Mountain}
        title={C.EMPTY_TITLE}
        hint={C.EMPTY_HINT}
        action={<CreateLink />}
      />
    );
  }
  return (
    <>
      <KpiStrip items={statsItems(state.stats)} ariaLabel={C.STATS_LABEL} />
      <ListPanel
        toolbar={
          <ListToolbar>
            <FilterBar
              fields={CAMPAMENTO_FILTER_FIELDS}
              value={state.values}
              onChange={state.setValues}
              className="min-w-0 flex-1"
            />
          </ListToolbar>
        }
      >
        <CampamentosGrid state={state} />
      </ListPanel>
    </>
  );
}

/** `/campamentos`: resumen por estado + tabla con filtros (como eventos). */
export function CampamentosListView() {
  const state = useCampamentosList();
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.TITLE}
        subtitle={C.SUBTITLE}
        actions={<CreateLink />}
      />
      <ListBody state={state} />
    </div>
  );
}
