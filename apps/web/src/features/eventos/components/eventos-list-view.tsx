'use client';

import { CalendarX, Plus, SearchX } from 'lucide-react';

import { KpiStrip } from '@/shared/components/charts';
import { FilterBar } from '@/shared/components/data';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { EventoCard } from '@/features/eventos/components/evento-card';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import { EVENTO_FILTER_FIELDS } from '@/features/eventos/helpers/evento-list';
import { useEventosList } from '@/features/eventos/hooks/use-eventos-list';

const C = EVENTOS_COPY.list;

type ListState = ReturnType<typeof useEventosList>;

function CreateLink() {
  return (
    <ButtonLink href={EVENTOS_ROUTES.create} icon={<Plus aria-hidden />}>
      {C.create}
    </ButtonLink>
  );
}

function EventosGrid({ state }: { readonly state: ListState }) {
  if (state.filtered.length === 0) {
    return <EmptyState icon={SearchX} title={C.filteredEmpty} />;
  }
  return (
    <section
      aria-label={C.gridAria}
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 md:gap-4"
    >
      {state.filtered.map((evento) => (
        <EventoCard
          key={evento.id}
          evento={evento}
          onDelete={(e) => void state.remove(e)}
        />
      ))}
    </section>
  );
}

function EventosBody({ state }: { readonly state: ListState }) {
  if (state.isLoading)
    return <LoadingState variant="skeleton" rows={4} label={C.loading} />;
  if (state.error) {
    return (
      <ErrorState
        message={state.error || C.loadError}
        onRetry={() => void state.reload()}
        retryLabel={C.retry}
      />
    );
  }
  if (state.eventos.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title={C.emptyTitle}
        hint={C.emptyHint}
        action={<CreateLink />}
      />
    );
  }
  return (
    <>
      <KpiStrip
        ariaLabel={C.statsAria}
        items={[
          { id: 'total', label: C.statsTotal, value: state.stats.total },
          { id: 'venta', label: C.statsVenta, value: state.stats.venta },
          { id: 'grupo', label: C.statsGrupo, value: state.stats.grupo },
        ]}
      />
      <FilterBar
        fields={EVENTO_FILTER_FIELDS}
        value={state.values}
        onChange={state.setValues}
      />
      <EventosGrid state={state} />
    </>
  );
}

/** `/eventos`: stats, filtros (nombre + tipo) y grilla de cards. */
export function EventosListView() {
  const state = useEventosList();
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.title}
        subtitle={C.subtitle}
        actions={<CreateLink />}
      />
      <EventosBody state={state} />
    </div>
  );
}
