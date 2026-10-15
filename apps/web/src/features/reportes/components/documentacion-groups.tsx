import { Check, Minus } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import type { DocGroup, DocItem } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const CARD =
  'flex flex-col overflow-hidden rounded-lg border border-border bg-surface';
const TITLE =
  'border-b border-border px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase';

/** Documento: ✓ entregado (texto solo para lectores) o "Falta" visible; nunca solo color. */
function DocRow({ doc }: { readonly doc: DocItem }) {
  const Icon = doc.ok ? Check : Minus;
  return (
    <li className="flex min-h-9 items-center gap-2 text-sm text-ink">
      <span
        aria-hidden
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full',
          doc.ok
            ? 'bg-success-soft text-success'
            : 'bg-warning-soft text-warning',
        )}
      >
        <Icon className="size-3" strokeWidth={2.5} />
      </span>
      <span className={cn('flex-1', doc.ok && 'text-ink-muted')}>
        {doc.label}
      </span>
      {doc.ok ? (
        <span className="sr-only">{C.DOC_OK}</span>
      ) : (
        <span className="text-xs text-warning">{C.DOC_FALTA}</span>
      )}
    </li>
  );
}

/** "Documentación": un bloque por grupo (personal, cada inscripción, autorizaciones de campamento). */
export function DocumentacionGroups({
  persona,
  groups,
}: {
  readonly persona: PersonaDeuda;
  readonly groups: readonly DocGroup[];
}) {
  const faltantes = groups.some((g) => g.items.some((i) => !i.ok));
  return (
    <section aria-label={C.docsDe(persona.nombre)} className={CARD}>
      <h3 className={TITLE}>{C.SECTION_DOCUMENTACION}</h3>
      {faltantes ? (
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
