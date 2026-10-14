import { useId, type ReactNode } from 'react';

interface FormSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

/** Bloque titulado dentro de una tarjeta del form (como "Datos del Movimiento"). */
export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex min-w-0 flex-col gap-4">
      <header className="grid gap-1">
        <h2 id={titleId} className="text-sm font-semibold text-ink">
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
