'use client';

import { ClipboardCheck, FileWarning, Tent } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Money,
  SegmentedTabs,
  StatusBadge,
  type SegmentedTabItem,
} from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { ESTADO_INSCRIPCION_LABELS } from '@/shared/domain';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import {
  OBLIGACION_KIND,
  buildObligaciones,
  obligacionYears,
  obligacionesOfYear,
  type Obligacion,
} from '@/features/personas/helpers/obligaciones';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { ObligacionItem } from '@/features/personas/components/ficha/obligacion-item';

export interface ObligacionesPanelProps {
  readonly inscripciones: PersonaDashboard['inscripciones'];
  readonly campamentos: PersonaDashboard['campamentos'];
}

function badgesOf(item: Obligacion) {
  if (item.kind === OBLIGACION_KIND.INSCRIPCION && item.estado) {
    return (
      <StatusBadge
        status={item.estado}
        label={ESTADO_INSCRIPCION_LABELS[item.estado]}
      />
    );
  }
  return item.autorizacionEntregada === false ? (
    <StatusBadge
      label={C.FALTA_AUTORIZACION}
      tone="warning"
      icon={FileWarning}
    />
  ) : null;
}

function rowOf(item: Obligacion) {
  const isInscripcion = item.kind === OBLIGACION_KIND.INSCRIPCION;
  return (
    <ObligacionItem
      key={`${item.kind}-${item.id}`}
      href={
        isInscripcion
          ? PERSONA_ROUTES.inscripcion(item.id)
          : PERSONA_ROUTES.campamento(item.id)
      }
      icon={isInscripcion ? ClipboardCheck : Tent}
      title={item.title}
      year={item.ano}
      badges={badgesOf(item)}
      pagado={item.pagado}
      total={item.total}
      pendiente={item.pendiente}
    />
  );
}

/** Inscripciones y campamentos en un solo panel; el año se elige solo si hay más de uno. */
export function ObligacionesPanel({
  inscripciones,
  campamentos,
}: ObligacionesPanelProps) {
  const all = useMemo(
    () =>
      buildObligaciones({
        inscripciones: inscripciones.items,
        campamentos: campamentos.items,
      }),
    [inscripciones.items, campamentos.items],
  );
  const years = obligacionYears(all);
  const [chosen, setChosen] = useState<number | null>(null);
  const year = chosen ?? years[0];
  const deuda = inscripciones.resumen.total + campamentos.resumen.total;
  const yearItems: readonly SegmentedTabItem[] = years.map((value) => ({
    value: String(value),
    label: String(value),
  }));
  return (
    <Panel
      title={C.OBLIGACIONES}
      meta={deuda > 0 ? <Money amount={deuda} tone="debt" /> : undefined}
      headerExtra={
        years.length > 1 && year !== undefined ? (
          <SegmentedTabs
            items={yearItems}
            value={String(year)}
            onValueChange={(value) => setChosen(Number(value))}
            ariaLabel={C.YEAR_LABEL}
            semantics="toggle"
          />
        ) : undefined
      }
      flush
    >
      {year === undefined ? (
        <EmptyState icon={ClipboardCheck} title={C.NO_OBLIGACIONES} />
      ) : (
        <ul className="divide-y divide-border">
          {obligacionesOfYear(all, year).map(rowOf)}
        </ul>
      )}
    </Panel>
  );
}
