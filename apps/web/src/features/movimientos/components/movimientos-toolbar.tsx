'use client';

import {
  FilterBar,
  ListToolbar,
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

/** Una sola línea: tabs Todos / Ingresos / Egresos + filtros (Concepto, Estado de Pago, Rango de Fechas). */
export function MovimientosToolbar({
  tab,
  onTabChange,
  filters,
  onFiltersChange,
}: MovimientosToolbarProps) {
  return (
    <ListToolbar>
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
        className="min-w-0 basis-full md:basis-0 md:flex-1"
      />
    </ListToolbar>
  );
}
