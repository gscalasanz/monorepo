import { StatusBadge } from '@/shared/components/data';
import { ESTADO_PERSONA_LABELS, isPersonaDisabled } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import {
  docValue,
  type DocKey,
  type ListedPersona,
} from '@/features/personas/helpers/list';
import type { PersonaRowActions as Actions } from '@/features/personas/hooks/use-persona-row-actions';
import { PersonaNameLink } from '@/features/personas/components/list/persona-name-link';
import { PersonaRowActions } from '@/features/personas/components/list/persona-row-actions';

export interface PersonaMobileRowProps {
  readonly persona: ListedPersona;
  readonly docKeys: readonly DocKey[];
  readonly actions: Actions;
}

/** Fila de la lista mobile: nombre + estado/documentación resumida + menú de acciones. */
export function PersonaMobileRow({
  persona,
  docKeys,
  actions,
}: PersonaMobileRowProps) {
  const entregados = docKeys.filter((key) => docValue({ persona, key })).length;
  return (
    <div className="flex w-full min-w-0 items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate">
          <PersonaNameLink persona={persona} />
        </span>
        <span className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
          {isPersonaDisabled(persona) ? (
            <StatusBadge status={ESTADO_PERSONA_LABELS[persona.estado]} />
          ) : null}
          {docKeys.length > 0
            ? C.DOC_SUMMARY(entregados, docKeys.length)
            : null}
        </span>
      </div>
      <PersonaRowActions persona={persona} actions={actions} />
    </div>
  );
}
