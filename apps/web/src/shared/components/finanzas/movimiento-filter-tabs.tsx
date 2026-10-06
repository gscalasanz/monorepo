'use client';

import { SegmentedTabs } from '@/shared/components/data';
import type { FiltroMovimientos } from '@/shared/domain';

import { FINANZAS_COPY } from './copy';
import { MOVIMIENTO_FILTER_ITEMS } from './movimiento-filter';

export interface MovimientoFilterTabsProps {
  readonly value: FiltroMovimientos;
  readonly onValueChange: (value: FiltroMovimientos) => void;
  readonly className?: string;
}

/** Filtros "Todos / Ingresos / Egresos / Gastos" (botones `aria-pressed`). */
export function MovimientoFilterTabs({
  value,
  onValueChange,
  className,
}: MovimientoFilterTabsProps) {
  return (
    <SegmentedTabs<FiltroMovimientos>
      items={MOVIMIENTO_FILTER_ITEMS}
      value={value}
      onValueChange={onValueChange}
      ariaLabel={FINANZAS_COPY.filters.ariaLabel}
      semantics="toggle"
      className={className}
    />
  );
}
