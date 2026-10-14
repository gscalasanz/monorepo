'use client';

import { ListPanel } from '@/shared/components/data';
import { ErrorState } from '@/shared/components/feedback';
import type { useInscripcionesList } from '@/features/inscripciones/hooks/use-inscripciones-list';
import { InscripcionesTable } from '@/features/inscripciones/components/list/inscripciones-table';
import { InscripcionesToolbar } from '@/features/inscripciones/components/shared/inscripciones-toolbar';

type ListState = ReturnType<typeof useInscripcionesList>;

/** Card único de la lista: tabs + filtros arriba, tabla (o error) y paginador adentro. */
export function InscripcionesListPanel({ list }: { readonly list: ListState }) {
  return (
    <ListPanel
      toolbar={
        <InscripcionesToolbar
          tipo={list.filters.tipo}
          onTipoChange={list.setTipo}
          filterValues={list.filterValues}
          onFiltersChange={list.onFiltersChange}
          currentYear={list.currentYear}
          withSearch
        />
      }
    >
      {list.error && !list.isLoading ? (
        <ErrorState
          message={list.error}
          onRetry={() => void list.reload()}
          className="p-6"
        />
      ) : (
        <InscripcionesTable
          rows={list.rows}
          tipo={list.filters.tipo}
          isLoading={list.isLoading}
          onDelete={list.remove}
        />
      )}
    </ListPanel>
  );
}
