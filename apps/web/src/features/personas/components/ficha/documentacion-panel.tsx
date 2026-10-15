import { Check, Minus } from 'lucide-react';

import { Panel } from '@/shared/components/ui/panel';
import type { Rama } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { docItems } from '@/features/personas/helpers/ficha';
import type { DocumentacionPersonal } from '@/features/personas/models/dashboard-schema';

export interface DocumentacionPanelProps {
  readonly documentacion: DocumentacionPersonal;
  readonly rama: Rama | null;
  /** Ruta de edición de la persona (donde se actualizan los papeles). */
  readonly editHref: string;
}

/** Checklist de documentación personal en grilla: solo lo que falta lleva texto visible (solo protagonistas; Rovers sin "DNI Padres"). */
export function DocumentacionPanel({
  documentacion,
  rama,
  editHref,
}: DocumentacionPanelProps) {
  const items = docItems({ documentacion, rama });
  const entregados = items.filter((item) => item.delivered).length;
  return (
    <Panel
      title={C.DOCUMENTACION}
      meta={C.DOC_COUNT(entregados, items.length)}
      action={{ label: C.DOC_UPDATE, href: editHref }}
      flush
    >
      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.delivered ? Check : Minus;
          return (
            <li
              key={item.key}
              className="flex min-h-12 items-center gap-2.5 border-b border-border px-4 py-2.5 text-sm text-ink md:px-[18px] sm:odd:border-r"
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full',
                  item.delivered
                    ? 'bg-success-soft text-success'
                    : 'bg-warning-soft text-warning',
                )}
              >
                <Icon className="size-3" strokeWidth={2.5} />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.delivered ? (
                <span className="sr-only">{C.DOC_DELIVERED}</span>
              ) : (
                <span className="text-xs text-warning">{C.DOC_PENDING}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
