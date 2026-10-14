'use client';

import { UserX } from 'lucide-react';
import { useMemo } from 'react';

import { AppDataGrid } from '@/shared/components/data';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import type { DocKey, ListedPersona } from '@/features/personas/helpers/list';
import type { PersonaRowActions as Actions } from '@/features/personas/hooks/use-persona-row-actions';
import { buildPersonaColumns } from '@/features/personas/components/list/persona-columns';
import { PersonaMobileRow } from '@/features/personas/components/list/persona-mobile-row';

export interface PersonasTableProps {
  readonly rows: readonly ListedPersona[];
  readonly docKeys: readonly DocKey[];
  readonly showDisabled: boolean;
  readonly actions: Actions;
  readonly isLoading: boolean;
  readonly error: string | null;
  /** Cambia con tab/filtros: reinicia la paginación (página 1). */
  readonly resetKey: string;
  readonly panelId: string;
}

/** Tabla paginada (10, cliente) con estados de carga, error y vacío de Angular. */
export function PersonasTable(props: PersonasTableProps) {
  const {
    rows,
    docKeys,
    showDisabled,
    actions,
    isLoading,
    error,
    resetKey,
    panelId,
  } = props;
  const columns = useMemo(
    () => buildPersonaColumns({ docKeys, showDisabled, actions }),
    [docKeys, showDisabled, actions],
  );
  if (isLoading) return <LoadingState label={C.LOADING} className="py-10" />;
  if (error && rows.length === 0)
    return <ErrorState message={error} className="py-10" />;
  return (
    <div id={panelId} role="tabpanel">
      <AppDataGrid<ListedPersona>
        key={resetKey}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        ariaLabel={C.TABLE_LABEL}
        emptyState={
          <EmptyState icon={UserX} title={C.EMPTY} hint={C.EMPTY_HINT} />
        }
        onRowClick={actions.view}
        mobileRow={(persona) => (
          <PersonaMobileRow
            persona={persona}
            docKeys={docKeys}
            actions={actions}
          />
        )}
      />
    </div>
  );
}
