'use client';

import { Mountain, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/layout';
import { nowMs, todayBsAs } from '@/shared/time';
import { CampamentoCard } from '@/features/campamentos/components/campamento-card';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import { cardBadge, type CampStats } from '@/features/campamentos/helpers/camp-status';
import { useCampamentosList } from '@/features/campamentos/hooks/use-campamentos-list';

type ListState = ReturnType<typeof useCampamentosList>;

function statsItems(stats: CampStats): readonly KpiItem[] {
  return [
    { id: 'total', label: C.STAT_TOTAL, value: stats.total },
    { id: 'upcoming', label: C.STAT_UPCOMING, value: stats.upcoming },
    { id: 'active', label: C.STAT_ACTIVE, value: stats.active },
    { id: 'past', label: C.STAT_PAST, value: stats.past },
  ];
}

function CampamentosGrid({ state }: { readonly state: ListState }) {
  const router = useRouter();
  const [today] = useState(todayBsAs);
  const [now] = useState(nowMs);
  return (
    <section aria-label={C.GRID_LABEL} className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
      {state.campamentos.map((campamento) => (
        <CampamentoCard
          key={campamento.id}
          campamento={campamento}
          badge={cardBadge({ camp: campamento, today, nowMs: now })}
          onEdit={(id) => router.push(CAMPAMENTO_ROUTES.edit(id))}
          onDelete={(id) => void state.remove(id)}
        />
      ))}
    </section>
  );
}

function ListBody({ state, onCreate }: { readonly state: ListState; readonly onCreate: () => void }) {
  if (state.isLoading) return <LoadingState variant="skeleton" rows={4} label={C.LOADING} />;
  if (state.error && state.campamentos.length === 0) {
    return <ErrorState message={state.error || C.ERROR_FALLBACK} onRetry={state.reload} retryLabel={C.RETRY} />;
  }
  if (state.campamentos.length === 0) {
    return (
      <EmptyState
        icon={Mountain}
        title={C.EMPTY_TITLE}
        hint={C.EMPTY_HINT}
        action={
          <Button icon={<Plus aria-hidden className="size-4" />} onClick={onCreate}>
            {C.CREATE}
          </Button>
        }
      />
    );
  }
  return (
    <>
      <KpiStrip items={statsItems(state.stats)} ariaLabel={C.STATS_LABEL} />
      <CampamentosGrid state={state} />
    </>
  );
}

/** `/campamentos`: resumen por estado + grilla de cards. */
export function CampamentosListView() {
  const router = useRouter();
  const state = useCampamentosList();
  const onCreate = () => router.push(CAMPAMENTO_ROUTES.CREATE);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.TITLE}
        subtitle={C.SUBTITLE}
        actions={
          <Button icon={<Plus aria-hidden className="size-4" />} onClick={onCreate}>
            {C.CREATE}
          </Button>
        }
      />
      <ListBody state={state} onCreate={onCreate} />
    </div>
  );
}
