'use client';

import { CircleCheck } from 'lucide-react';
import { useMemo } from 'react';

import { FilterBar, ListPanel, ListToolbar } from '@/shared/components/data';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { currentYearBsAs } from '@/shared/time';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { deudaFilterFields } from '@/features/reportes/constants/filters';
import { DeudasKpis } from '@/features/reportes/components/deudas-kpis';
import { DeudasTable } from '@/features/reportes/components/deudas-table';
import { useDeudas } from '@/features/reportes/hooks/use-deudas';

function DeudasBody({
  state,
}: {
  readonly state: ReturnType<typeof useDeudas>;
}) {
  if (state.isLoading)
    return <LoadingState variant="skeleton" rows={6} label={C.LOADING} />;
  if (state.error)
    return (
      <ErrorState
        message={C.ERROR}
        onRetry={state.reload}
        retryLabel={C.RETRY}
      />
    );
  if (state.deudas.length === 0)
    return <EmptyState icon={CircleCheck} title={C.EMPTY} />;
  return <DeudasTable deudas={state.deudas} />;
}

/** Reporte de deudas: KPIs + un card con filtros (rama/año/tipo, consultan al backend) y la tabla. */
export function DeudasView() {
  const state = useDeudas();
  const fields = useMemo(() => deudaFilterFields(currentYearBsAs()), []);
  const showKpis = !state.isLoading && !state.error && state.deudas.length > 0;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      {showKpis ? <DeudasKpis summary={state.summary} /> : null}
      <ListPanel
        ariaLabel={C.LIST_LABEL}
        toolbar={
          <ListToolbar>
            <FilterBar
              fields={fields}
              value={state.values}
              onChange={state.setValues}
              className="min-w-0 flex-1"
            />
          </ListToolbar>
        }
      >
        <DeudasBody state={state} />
      </ListPanel>
    </div>
  );
}
