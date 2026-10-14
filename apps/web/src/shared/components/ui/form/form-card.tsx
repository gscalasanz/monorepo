import { useId, type ReactNode } from 'react';

export interface FormCardProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

/** Tarjeta de formulario: título corto (+ descripción) y los campos de esa sección. */
export function FormCard({ title, description, children }: FormCardProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6"
    >
      <header className="grid gap-1">
        <h2 id={titleId} className="text-base font-semibold text-ink">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-ink-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
