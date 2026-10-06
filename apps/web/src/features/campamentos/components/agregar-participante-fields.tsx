'use client';

import { Info } from 'lucide-react';
import { useMemo } from 'react';

import { LoadingState } from '@/shared/components/feedback';
import {
  CheckboxField,
  ComboboxField,
  MoneyField,
  SelectField,
  type FieldOption,
} from '@/shared/components/ui/form';
import {
  MEDIO_PAGO_LABELS,
  RAMAS,
  RAMA_LABELS,
  type Persona,
  type Rama,
} from '@/shared/domain';
import { AGREGAR_COPY as C } from '@/features/campamentos/constants/copy';
import {
  personaLabel,
  type AgregarDraft,
  type AgregarState,
} from '@/features/campamentos/helpers/agregar-participante';
import {
  PAGO_MEDIOS,
  type PagoMedio,
} from '@/features/campamentos/helpers/pago';

/** Opción para volver a "todas las ramas" (el select no admite vaciarse). */
const ALL_RAMAS = 'todas';
type RamaFilter = Rama | typeof ALL_RAMAS;

const RAMA_OPTIONS: readonly FieldOption<RamaFilter>[] = [
  { value: ALL_RAMAS, label: C.RAMA_ALL },
  ...RAMAS.map((r) => ({ value: r, label: RAMA_LABELS[r] })),
];
const MEDIO_OPTIONS: readonly FieldOption<PagoMedio>[] = PAGO_MEDIOS.map(
  (value) => ({
    value,
    label: MEDIO_PAGO_LABELS[value],
  }),
);

export interface AgregarParticipanteFieldsProps {
  readonly draft: AgregarDraft;
  readonly state: AgregarState;
  readonly personas: readonly Persona[];
  readonly loading: boolean;
  readonly onPatch: (next: Partial<AgregarDraft>) => void;
}

function PersonaField({
  draft,
  personas,
  loading,
  onPatch,
}: Omit<AgregarParticipanteFieldsProps, 'state'>) {
  const options = useMemo(
    () => personas.map((p) => ({ value: p.id, label: personaLabel(p) })),
    [personas],
  );
  if (loading) return <LoadingState label={C.LOADING} />;
  if (personas.length === 0) {
    return (
      <p className="rounded-lg bg-recessed px-3 py-2.5 text-sm text-ink-muted">
        {C.NO_PERSONAS}
      </p>
    );
  }
  return (
    <ComboboxField
      label={C.PERSONA}
      required
      placeholder={C.PERSONA_PLACEHOLDER}
      options={options}
      value={draft.personaId}
      onChange={(personaId) => onPatch({ personaId })}
    />
  );
}

function MontosFields({
  draft,
  state,
  onPatch,
}: Pick<AgregarParticipanteFieldsProps, 'draft' | 'state' | 'onPatch'>) {
  if (!state.montosVisibles) return null;
  return (
    <>
      <MoneyField
        label={C.BONIFICAR}
        size="md"
        helper={C.maximo(state.maxBonificable)}
        value={draft.montoBonificado}
        onChange={(montoBonificado) => onPatch({ montoBonificado })}
        error={
          state.bonificarExcede ? C.excede(state.maxBonificable) : undefined
        }
      />
      <MoneyField
        label={C.PAGO}
        size="md"
        helper={C.maximo(state.maxPago)}
        value={draft.montoPago}
        onChange={(montoPago) => onPatch({ montoPago })}
        error={state.pagoExcede ? C.excede(state.maxPago) : undefined}
      />
      {state.pago > 0 && (
        <SelectField
          label={C.MEDIO_PAGO}
          required
          options={MEDIO_OPTIONS}
          value={draft.medioPago}
          onChange={(medioPago) => medioPago && onPatch({ medioPago })}
        />
      )}
    </>
  );
}

/** Campos en el orden del selector de Angular. */
export function AgregarParticipanteFields(
  props: AgregarParticipanteFieldsProps,
) {
  const { draft, personas, loading, onPatch } = props;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted">{C.SUBTITLE}</p>
      <SelectField<RamaFilter>
        label={C.RAMA}
        helper={C.RAMA_HINT}
        placeholder={C.RAMA_ALL}
        options={RAMA_OPTIONS}
        value={draft.rama}
        onChange={(rama) =>
          onPatch({ rama: rama === ALL_RAMAS ? null : rama, personaId: null })
        }
      />
      <PersonaField
        draft={draft}
        personas={personas}
        loading={loading}
        onPatch={onPatch}
      />
      <CheckboxField
        label={C.AUTORIZACION}
        value={draft.autorizacionEntregada}
        onChange={(autorizacionEntregada) => onPatch({ autorizacionEntregada })}
      />
      <MontosFields draft={draft} state={props.state} onPatch={onPatch} />
      {!loading && personas.length > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <Info aria-hidden className="size-3.5" />
          {C.disponibles(personas.length)}
        </p>
      )}
    </div>
  );
}
