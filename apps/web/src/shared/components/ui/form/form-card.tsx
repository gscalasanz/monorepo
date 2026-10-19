import type { ReactNode } from 'react';

export interface FormCardProps {
  /** Nombre accesible de la sección (no se muestra: las tarjetas de formulario no llevan título). */
  readonly label: string;
  readonly children: ReactNode;
}

/** Tarjeta de formulario: misma superficie que las de movimientos; dos lado a lado desde `lg`. */
export function FormCard({ label, children }: FormCardProps) {
  return (
    <section
      aria-label={label}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6"
    >
      {children}
    </section>
  );
}
