import type { ReactNode } from 'react';

/** Tarjeta del form (misma superficie que `FormCard`); los bloques de adentro llevan su título. */
export function InscripcionFormCard({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6">
      {children}
    </div>
  );
}
