import { Minus } from 'lucide-react';

import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import type { DocGroup, DocItem } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const CARD =
  'flex flex-col overflow-hidden rounded-lg border border-border bg-surface';
const TITLE =
  'border-b border-border px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase';

/** Documento faltante: ícono + "Falta" visible; nunca solo color. */
function DocRow({ doc }: { readonly doc: DocItem }) {
  return (
    <li className="flex min-h-9 items-center gap-2 text-sm text-ink">
      <span
        aria-hidden
        className="grid size-5 shrink-0 place-items-center rounded-full bg-warning-soft text-warning"
      >
        <Minus className="size-3" strokeWidth={2.5} />
      </span>
      <span className="flex-1">{doc.label}</span>
      <span className="text-xs text-warning">{C.DOC_FALTA}</span>
    </li>
  );
}

/** "Documentación": solo lo faltante, un bloque por grupo (personal, cada inscripción, autorizaciones). */
export function DocumentacionGroups({
  persona,
  groups,
}: {
  readonly persona: PersonaDeuda;
  readonly groups: readonly DocGroup[];
}) {
  return (
    <section aria-label={C.docsDe(persona.nombre)} className={CARD}>
      <h3 className={TITLE}>{C.SECTION_DOCUMENTACION}</h3>
      {groups.length > 0 ? (
        <div className="grid gap-x-6 gap-y-3 px-4 py-3 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              <h4 className="text-xs font-medium text-ink-subtle">
                {group.title}
              </h4>
              <ul>
                {group.items.map((doc) => (
                  <DocRow key={doc.label} doc={doc} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 py-3 text-sm text-ink-subtle">{C.SIN_FALTANTES}</p>
      )}
    </section>
  );
}
