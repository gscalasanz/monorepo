'use client';

import {
  FilterBar,
  SegmentedTabs,
  type FilterValues,
} from '@/shared/components/data';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import type { TipoTab } from '@/features/movimientos/constants/movimientos';
import {
  LIST_FILTER_FIELDS,
  TIPO_TABS,
} from '@/features/movimientos/helpers/view-model';

interface MovimientosToolbarProps {
  readonly tab: TipoTab;
  readonly onTabChange: (tab: TipoTab) => void;
  readonly filters: FilterValues;
  readonly onFiltersChange: (filters: FilterValues) => void;
}

/** Tabs Todos / Ingresos / Egresos + filtros (Concepto, Estado de Pago, Rango de Fechas). */
export function MovimientosToolbar({
  tab,
  onTabChange,
  filters,
  onFiltersChange,
}: MovimientosToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 md:px-[18px]">
      <SegmentedTabs
        items={TIPO_TABS}
        value={tab}
        onValueChange={onTabChange}
        ariaLabel={C.TABS_LABEL}
        semantics="toggle"
        className="self-start"
      />
      <FilterBar
        fields={LIST_FILTER_FIELDS}
        value={filters}
        onChange={onFiltersChange}
      />
    </div>
  );
}
