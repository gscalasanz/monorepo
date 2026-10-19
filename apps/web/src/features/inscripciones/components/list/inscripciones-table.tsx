'use client';

import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { AppDataGrid } from '@/shared/components/data';
import { EmptyState, LoadingState } from '@/shared/components/feedback';
import type { Inscripcion, TipoInscripcion } from '@/shared/domain';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { buildColumns } from '@/features/inscripciones/components/list/inscripciones-columns';
import { InscripcionMobileRow } from '@/features/inscripciones/components/list/inscripcion-mobile-row';

interface InscripcionesTableProps {
  readonly rows: readonly Inscripcion[];
  readonly tipo: TipoInscripcion;
  readonly isLoading: boolean;
  readonly onDelete: (id: string) => void;
}

/** Tabla paginada en cliente (10 por página); en mobile, lista que abre el detalle. */
export function InscripcionesTable({
  rows,
  tipo,
  isLoading,
  onDelete,
}: InscripcionesTableProps) {
  const router = useRouter();
  const columns = useMemo(
    () => buildColumns({ tipo, onDelete }),
    [tipo, onDelete],
  );
  if (isLoading) return <LoadingState label={C.LOADING} />;
  return (
    <AppDataGrid
      columns={columns}
      data={rows}
      ariaLabel={C.TABLE_LABEL}
      getRowId={(row) => row.id}
      emptyState={<EmptyState icon={ClipboardList} title={C.EMPTY} />}
      mobileRow={(row) => <InscripcionMobileRow inscripcion={row} />}
      onRowClick={(row) => router.push(inscripcionRoutes.detail(row.id))}
    />
  );
}
