'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { ErrorState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/layout';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { dashboardSearch } from '@/features/inscripciones/helpers/filters';
import { useInscripcionesList } from '@/features/inscripciones/hooks/use-inscripciones-list';
import { InscripcionesStatsBar } from '@/features/inscripciones/components/list/inscripciones-stats-bar';
import { InscripcionesTable } from '@/features/inscripciones/components/list/inscripciones-table';
import { InscripcionesToolbar } from '@/features/inscripciones/components/shared/inscripciones-toolbar';

/** `/inscripciones`: stats por rama, tabs SA/Grupo, filtros en la URL y tabla. */
export function InscripcionesListView() {
  const list = useInscripcionesList();
  const { filters, consolidado } = list;
  const createHref = inscripcionRoutes.withQuery(
    inscripcionRoutes.create,
    `tipo=${filters.tipo}`,
  );
  const dashboardHref = inscripcionRoutes.withQuery(
    inscripcionRoutes.dashboard,
    dashboardSearch(filters),
  );
  const newButton = (
    <Button
      icon={<Plus aria-hidden />}
      nativeButton={false}
      render={<Link href={createHref} />}
    >
      {C.NEW}
    </Button>
  );
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} actions={newButton} />
      {consolidado ? (
        <InscripcionesStatsBar
          consolidado={consolidado}
          dashboardHref={dashboardHref}
        />
      ) : null}
      <InscripcionesToolbar
        tipo={filters.tipo}
        onTipoChange={list.setTipo}
        filterValues={list.filterValues}
        onFiltersChange={list.onFiltersChange}
        currentYear={list.currentYear}
        withSearch
      />
      {list.error && !list.isLoading ? (
        <ErrorState message={list.error} onRetry={() => void list.reload()} />
      ) : (
        <InscripcionesTable
          rows={list.rows}
          tipo={filters.tipo}
          isLoading={list.isLoading}
          onDelete={list.remove}
        />
      )}
    </div>
  );
}
