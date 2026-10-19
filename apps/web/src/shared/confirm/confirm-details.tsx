import { TriangleAlert } from 'lucide-react';

import type { ActiveConfirm } from '@/shared/confirm/confirm-store';

/** Bloque de detalles clave/valor + advertencia del diálogo de confirmación. */
export function ConfirmDetails({ active }: { active: ActiveConfirm }) {
  const details = active.details ?? [];
  return (
    <>
      {details.length > 0 && (
        <dl className="bg-recessed grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg p-3 text-sm">
          {details.map((detail) => (
            <div key={detail.label} className="contents">
              <dt className="text-ink-muted">{detail.label}</dt>
              <dd className="text-ink text-right font-medium">{detail.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {active.warning && (
        <p className="bg-warning-soft text-warning flex gap-2 rounded-lg p-3 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{active.warning}</span>
        </p>
      )}
    </>
  );
}
