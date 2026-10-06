'use client';

import {
  AppDataGrid,
  FilterBar,
  type FilterField,
} from '@/shared/components/data';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { CONCEPTO_MOVIMIENTO_LABELS, TIPO_MOVIMIENTO } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { FondosRamaStats } from '@/features/cajas/components/fondos-rama-stats';
import { RAMAS_COLUMNS } from '@/features/cajas/components/movimiento-columns';
import { MovimientoMobileRow } from '@/features/cajas/components/movimiento-mobile-row';
import { RamaChipsFilter } from '@/features/cajas/components/rama-chips-filter';
import { movimientoCajaLabel } from '@/features/cajas/helpers/movimientos';
import { useFondosRama } from '@/features/cajas/hooks/use-fondos-rama';

const FILTER_FIELDS: readonly FilterField[] = [
  {
    key: 'tipo',
    type: 'select',
    label: C.TIPO,
    options: [
      { value: TIPO_MOVIMIENTO.INGRESO, label: C.FILTER_INGRESOS },
      { value: TIPO_MOVIMIENTO.EGRESO, label: C.FILTER_EGRESOS },
    ],
  },
  {
    key: 'concepto',
    type: 'select',
    label: C.CONCEPTO,
    options: Object.entries(CONCEPTO_MOVIMIENTO_LABELS).map(
      ([value, label]) => ({ value, label }),
    ),
  },
  { key: 'fecha', type: 'date-range', label: C.FECHA },
];

/** Tab "Fondos de Rama": saldos por fondo + movimientos filtrables de las ramas. */
export function FondosRamaTab() {
  const f = useFondosRama();
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {f.fondosLoading && <LoadingState label={C.LOADING_FONDOS} />}
      {!f.fondosLoading && f.fondosError && (
        <ErrorState message={f.fondosError} />
      )}
      {!f.fondosLoading && !f.fondosError && (
        <FondosRamaStats stats={f.stats} />
      )}

      <Panel title={C.MOVIMIENTOS_RAMAS} flush>
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:px-[18px]">
          <RamaChipsFilter selected={f.ramas} onToggle={f.toggleRama} />
          <FilterBar
            fields={FILTER_FIELDS}
            value={f.filters}
            onChange={f.setFilters}
          />
        </div>
        {f.movimientosError && !f.movimientosLoading ? (
          <ErrorState message={f.movimientosError} />
        ) : (
          <AppDataGrid
            columns={RAMAS_COLUMNS}
            data={f.movimientos}
            isLoading={f.movimientosLoading}
            getRowId={(row) => row.id}
            ariaLabel={C.MOVIMIENTOS_RAMAS}
            emptyState={<EmptyState title={C.NO_MOVIMIENTOS} />}
            mobileRow={(row) => (
              <MovimientoMobileRow
                movimiento={row}
                detail={[movimientoCajaLabel(row), row.descripcion]
                  .filter(Boolean)
                  .join(' · ')}
              />
            )}
          />
        )}
      </Panel>
    </div>
  );
}
