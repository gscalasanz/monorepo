'use client';

import { useRouter } from 'next/navigation';

import { FormActions } from '@/shared/components/ui/form';
import { FORM_COPY as F } from '@/features/personas/constants/form-copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';

export interface PersonaFormActionsProps {
  readonly editing: boolean;
  readonly saving: boolean;
  /** "Crear Protagonista" / "Crear Educador" / "Crear Persona Externa". */
  readonly createLabel: string;
}

function saveLabelOf({
  editing,
  saving,
  createLabel,
}: PersonaFormActionsProps): string {
  if (saving) return F.SAVING;
  return editing ? F.SAVE_CHANGES : createLabel;
}

/** Cancelar (→ `/personas`) / Crear o "Guardar Cambios" ("Guardando..." mientras guarda). */
export function PersonaFormActions(props: PersonaFormActionsProps) {
  const router = useRouter();
  return (
    <FormActions
      onCancel={() => router.push(PERSONA_ROUTES.LIST)}
      cancelLabel={F.CANCEL}
      saveLabel={saveLabelOf(props)}
      saving={props.saving}
    />
  );
}
