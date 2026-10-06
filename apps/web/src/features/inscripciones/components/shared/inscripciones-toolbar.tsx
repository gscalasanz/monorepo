'use client';

import { useMemo } from 'react';

import {
  FilterBar,
  SegmentedTabs,
  type FilterValues,
} from '@/shared/components/data';
import type { TipoInscripcion } from '@/shared/domain';
import { LIST_COPY } from '@/features/inscripciones/constants/copy';
import { TIPO_TABS } from '@/features/inscripciones/constants/inscripciones';
import { buildFilterFields } from '@/features/inscripciones/helpers/filters';

interface InscripcionesToolbarProps {
  readonly tipo: TipoInscripcion;
  readonly onTipoChange: (tipo: TipoInscripcion) => void;
  readonly filterValues: FilterValues;
  readonly onFiltersChange: (values: FilterValues) => void;
  readonly currentYear: number;
  /** La lista agrega "Buscar" (filtro local por nombre). */
  readonly withSearch?: boolean;
}

/** Tabs Scout Argentina / Grupo + filtros Año / Tipo de Deuda / Rama. */
export function InscripcionesToolbar({
  tipo,
  onTipoChange,
  filterValues,
  onFiltersChange,
  currentYear,
  withSearch = false,
}: InscripcionesToolbarProps) {
  const fields = useMemo(
    () => buildFilterFields({ currentYear, withSearch }),
    [currentYear, withSearch],
  );
  return (
    <div className="flex flex-col gap-3">
      <SegmentedTabs
        items={TIPO_TABS}
        value={tipo}
        onValueChange={onTipoChange}
        ariaLabel={LIST_COPY.TABS_LABEL}
        className="self-start"
      />
      <FilterBar
        fields={fields}
        value={filterValues}
        onChange={onFiltersChange}
      />
    </div>
  );
}
