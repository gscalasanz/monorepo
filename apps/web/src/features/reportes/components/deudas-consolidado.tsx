'use client';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import { CONSOLIDADO_COPY as C, TIPO_DEUDA_LABELS } from '@/features/reportes/constants/copy';
import type {
  CampamentoConsolidado,
  ConsolidadoDeudas,
  InscripcionConsolidada,
} from '@/features/reportes/models/consolidado';

export interface DeudasConsolidadoProps {
  readonly consolidado: ConsolidadoDeudas;
  readonly campamentoId: string | undefined;
  readonly isInscripcionSelected: (item: InscripcionConsolidada) => boolean;
  readonly onToggleCampamento: (campamentoId: string) => void;
  readonly onToggleInscripcion: (item: InscripcionConsolidada) => void;
  readonly onClear: () => void;
}

function Stat({ label, amount }: { readonly label: string; readonly amount: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[13px] text-ink-muted">{label}</dt>
      <dd>
        <Money amount={amount} tone="debt" size="figure-md" />
      </dd>
    </div>
  );
}

interface OrigenButtonProps {
  readonly label: string;
  readonly amount: number;
  readonly personas: number;
  readonly selected: boolean;
  readonly onClick: () => void;
}

/** Origen de deuda como toggle: el estado seleccionado se marca con borde, fondo y `aria-pressed`. */
function OrigenButton({ label, amount, personas, selected, onClick }: OrigenButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-11 flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors md:min-h-0',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        selected
          ? 'border-brand bg-brand-soft text-ink'
          : 'border-border bg-surface text-ink hover:bg-recessed',
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-baseline gap-2 text-[13px] text-ink-muted tabular-nums">
        <Money amount={amount} tone="debt" />
        <span>{C.personas(personas)}</span>
      </span>
    </button>
  );
}

function CampamentoButton(props: {
  readonly item: CampamentoConsolidado;
  readonly selected: boolean;
  readonly onToggle: (id: string) => void;
}) {
  const { item, selected, onToggle } = props;
  return (
    <OrigenButton
      label={C.campamento(item.nombre, item.ano)}
      amount={item.deudaTotal}
      personas={item.personasConDeuda}
      selected={selected}
      onClick={() => onToggle(item.campamentoId)}
    />
  );
}

function OrigenesList(props: DeudasConsolidadoProps) {
  const { consolidado: c, campamentoId } = props;
  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
      <p className="text-[13px] text-ink-muted">{C.FILTER_HINT}</p>
      <div className="flex flex-wrap gap-2">
        {c.campamentos.map((item) => (
          <CampamentoButton
            key={item.campamentoId}
            item={item}
            selected={campamentoId === item.campamentoId}
            onToggle={props.onToggleCampamento}
          />
        ))}
        {c.inscripciones.map((item) => (
          <OrigenButton
            key={`${item.tipo}-${item.ano}`}
            label={C.inscripcion(TIPO_DEUDA_LABELS[item.tipo], item.ano)}
            amount={item.deudaTotal}
            personas={item.personasConDeuda}
            selected={props.isInscripcionSelected(item)}
            onClick={() => props.onToggleInscripcion(item)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Consolidado de deuda de plata (viene del backend): totales por tipo y un botón por cada
 * campamento / inscripción que todavía registra deuda. Funciona como filtro del listado.
 */
export function DeudasConsolidado(props: DeudasConsolidadoProps) {
  const { consolidado: c, campamentoId, isInscripcionSelected } = props;
  const hasOrigenes = c.campamentos.length + c.inscripciones.length > 0;
  const hasSelection =
    campamentoId !== undefined || c.inscripciones.some(isInscripcionSelected);
  return (
    <Panel
      title={C.TITLE}
      meta={C.META(c.personasConDeuda)}
      headerExtra={
        hasSelection ? (
          <Button size="sm" variant="secondary" onClick={props.onClear}>
            {C.CLEAR}
          </Button>
        ) : undefined
      }
    >
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label={C.TOTAL} amount={c.deudaTotal} />
        <Stat label={C.CAMPAMENTOS} amount={c.deudaCampamentos} />
        <Stat label={C.INSCRIPCIONES_SCOUT} amount={c.deudaInscripcionesScout} />
        <Stat label={C.INSCRIPCIONES_GRUPO} amount={c.deudaInscripcionesGrupo} />
      </dl>
      {hasOrigenes ? (
        <OrigenesList {...props} />
      ) : (
        <p className="mt-4 text-sm text-ink-muted">{C.EMPTY}</p>
      )}
    </Panel>
  );
}
