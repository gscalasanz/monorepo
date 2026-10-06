'use client';

import { CircleCheck } from 'lucide-react';
import { useMemo } from 'react';

import { FilterBar } from '@/shared/components/data';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { currentYearBsAs } from '@/shared/time';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { deudaFilterFields } from '@/features/reportes/constants/filters';
import { DeudasKpis } from '@/features/reportes/components/deudas-kpis';
import { DeudasList } from '@/features/reportes/components/deudas-list';
import { useDeudas } from '@/features/reportes/hooks/use-deudas';

function DeudasBody({ state }: { readonly state: ReturnType<typeof useDeudas> }) {
  if (state.isLoading) return <LoadingState variant="skeleton" rows={6} label={C.LOADING} />;
  if (state.error) return <ErrorState message={C.ERROR} onRetry={state.reload} retryLabel={C.RETRY} />;
  if (state.deudas.length === 0) return <EmptyState icon={CircleCheck} title={C.EMPTY} />;
  return (
    <>
      <DeudasKpis summary={state.summary} />
      <DeudasList deudas={state.deudas} />
    </>
  );
}

/** Reporte de deudas: filtros (rama/año/tipo) que consultan al backend. */
export function DeudasView() {
  const state = useDeudas();
  const fields = useMemo(() => deudaFilterFields(currentYearBsAs()), []);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      <FilterBar fields={fields} value={state.values} onChange={state.setValues} />
      <DeudasBody state={state} />
    </div>
  );
}
