'use client';

import { UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  AppDataGrid,
  FilterBar,
  type FilterField,
} from '@/shared/components/data';
import { EmptyState, ErrorState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { CAJAS_RAMA_EDUCADORES, RAMAS, RAMA_LABELS } from '@/shared/domain';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CUENTAS_COLUMNS } from '@/features/cajas/components/cuentas-columns';
import { CuentaMobileRow } from '@/features/cajas/components/cuenta-mobile-row';
import type { CuentaRow } from '@/features/cajas/helpers/cuentas';
import { useCuentasPersonales } from '@/features/cajas/hooks/use-cuentas-personales';

const FILTER_FIELDS: readonly FilterField[] = [
  {
    key: 'search',
    type: 'search',
    label: C.BUSCAR,
    placeholder: C.BUSCAR_PLACEHOLDER,
  },
  {
    key: 'rama',
    type: 'select',
    label: C.RAMA,
    options: [
      ...RAMAS.map((rama) => ({ value: rama, label: RAMA_LABELS[rama] })),
      { value: CAJAS_RAMA_EDUCADORES, label: C.EDUCADORES },
    ],
  },
];

/** Tab "Cuentas Personales": saldo de cada persona, filtro por rama y búsqueda. */
export function CuentasPersonalesTab() {
  const router = useRouter();
  const { rows, isLoading, error, hasData, filters, setFilters } =
    useCuentasPersonales();
  const openFicha = (row: CuentaRow) => {
    if (row.propietarioId)
      router.push(CAJAS_LINKS.fichaPropietario(row.propietarioId));
  };

  return (
    <Panel
      title={C.TAB_PERSONAL}
      meta={hasData ? rows.length : undefined}
      flush
    >
      <div className="border-b border-border px-4 py-3 md:px-[18px]">
        <FilterBar
          fields={FILTER_FIELDS}
          value={filters}
          onChange={setFilters}
        />
      </div>
      {error && !isLoading ? (
        <ErrorState message={error} />
      ) : (
        <AppDataGrid
          columns={CUENTAS_COLUMNS}
          data={rows}
          isLoading={isLoading}
          getRowId={(row) => row.id}
          ariaLabel={C.TAB_PERSONAL}
          onRowClick={openFicha}
          emptyState={<EmptyState icon={UserX} title={C.NO_CUENTAS} />}
          mobileRow={(row) => <CuentaMobileRow row={row} />}
        />
      )}
    </Panel>
  );
}
