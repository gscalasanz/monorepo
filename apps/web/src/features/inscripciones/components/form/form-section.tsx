import type { ReactNode } from 'react';

interface FormSectionProps {
  /** "01", "02"… (marcador de sección de Angular). */
  readonly marker: string;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

/** Sección numerada del form de inscripción. */
export function FormSection({
  marker,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="grid gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:grid-cols-[48px_minmax(0,1fr)] md:p-[18px]">
      <span
        aria-hidden
        className="text-[13px] font-semibold text-ink-subtle tabular-nums"
      >
        {marker}
      </span>
      <div className="flex min-w-0 flex-col gap-4">
        <header className="grid gap-1">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="text-sm text-ink-muted">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
