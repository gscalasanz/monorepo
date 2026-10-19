'use client';

import { List } from 'lucide-react';
import Link from 'next/link';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/layout';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { useInscripcionesDashboard } from '@/features/inscripciones/hooks/use-inscripciones-dashboard';
import { DashboardContent } from '@/features/inscripciones/components/dashboard/dashboard-content';
import { InscripcionesToolbar } from '@/features/inscripciones/components/shared/inscripciones-toolbar';

/** `/inscripciones/dashboard`: KPIs del consolidado según tab y filtros. */
export function InscripcionesDashboardView() {
  const dashboard = useInscripcionesDashboard();
  const { consolidado, isLoading, error } = dashboard;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.TITLE}
        subtitle={C.SUBTITLE}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={<List aria-hidden />}
            nativeButton={false}
            render={<Link href={inscripcionRoutes.list} />}
          >
            {C.VIEW_LIST}
          </Button>
        }
      />
      <InscripcionesToolbar
        tipo={dashboard.filters.tipo}
        onTipoChange={dashboard.setTipo}
        filterValues={dashboard.filterValues}
        onFiltersChange={dashboard.onFiltersChange}
        currentYear={dashboard.currentYear}
        bare
      />
      {isLoading && !consolidado ? (
        <LoadingState variant="skeleton" rows={6} label={C.LOADING} />
      ) : null}
      {error && !isLoading ? (
        <ErrorState message={error} onRetry={() => void dashboard.reload()} />
      ) : null}
      {consolidado && !error ? (
        <DashboardContent consolidado={consolidado} />
      ) : null}
    </div>
  );
}
