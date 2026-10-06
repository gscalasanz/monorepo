'use client';

import { UserPlus } from 'lucide-react';
import { useId, useMemo, useState, type FormEvent } from 'react';

import { FormDialogShell, useDialogSubmit } from '@/shared/components/finanzas';
import type { CampamentoDetalle } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { fetchPersonasActivas } from '@/shared/queries';
import { AgregarParticipanteFields } from '@/features/campamentos/components/agregar-participante-fields';
import { AGREGAR_COPY as C } from '@/features/campamentos/constants/copy';
import {
  INITIAL_AGREGAR_DRAFT,
  agregarState,
  montoMaximoPara,
  personasDisponibles,
  toInscripcionPlan,
  type AgregarDraft,
  type InscripcionPlan,
} from '@/features/campamentos/helpers/agregar-participante';

const PERSONAS_KEY = 'personas-activas';

export interface AgregarParticipanteDialogProps {
  readonly campamento: CampamentoDetalle['campamento'];
  /** Ya inscriptos (se excluyen del selector). */
  readonly inscriptosIds: readonly string[];
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (plan: InscripcionPlan) => Promise<void>;
}

function useAgregarForm(props: AgregarParticipanteDialogProps) {
  const personasQuery = useAsyncData({ key: PERSONAS_KEY, load: fetchPersonasActivas });
  const [draft, setDraft] = useState<AgregarDraft>(INITIAL_AGREGAR_DRAFT);
  const { inscriptosIds } = props;
  const disponibles = useMemo(
    () => personasDisponibles({ personas: personasQuery.data ?? [], excludeIds: inscriptosIds, rama: draft.rama }),
    [personasQuery.data, inscriptosIds, draft.rama],
  );
  const persona = disponibles.find((p) => p.id === draft.personaId);
  const state = agregarState(draft, montoMaximoPara(persona, props.campamento));
  const dialog = useDialogSubmit({ onSubmit: props.onSubmit, onOpenChange: props.onOpenChange });
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const plan = state.canSubmit ? toInscripcionPlan(draft, state) : null;
    if (plan) void dialog.submit(plan);
  };
  const patch = (next: Partial<AgregarDraft>) => setDraft((current) => ({ ...current, ...next }));
  return { personasQuery, draft, disponibles, state, dialog, onFormSubmit, patch };
}

/** "Agregar Participante": persona activa + autorización + bonificación/pago opcionales. */
export function AgregarParticipanteDialog(props: AgregarParticipanteDialogProps) {
  const formId = useId();
  const f = useAgregarForm(props);
  return (
    <FormDialogShell
      open
      onOpenChange={f.dialog.handleOpenChange}
      title={C.TITLE}
      icon={<UserPlus aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      submitLabel={C.SUBMIT}
      saving={f.dialog.saving}
      error={f.dialog.error ?? f.personasQuery.error}
      submitDisabled={!f.state.canSubmit || f.personasQuery.isLoading}
    >
      <form id={formId} noValidate onSubmit={f.onFormSubmit}>
        <AgregarParticipanteFields
          draft={f.draft}
          state={f.state}
          personas={f.disponibles}
          loading={f.personasQuery.isLoading}
          onPatch={f.patch}
        />
      </form>
    </FormDialogShell>
  );
}
