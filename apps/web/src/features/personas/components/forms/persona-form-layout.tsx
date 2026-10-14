import type { FormEvent, ReactNode } from 'react';

export interface PersonaFormLayoutProps {
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Las tarjetas (`FormCard`): lado a lado desde `lg`. */
  readonly children: ReactNode;
  readonly actions: ReactNode;
}

/** Misma composición que movimientos/eventos/campamentos: dos tarjetas + `FormActions` sticky. */
export function PersonaFormLayout({
  onSubmit,
  children,
  actions,
}: PersonaFormLayoutProps) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
        {children}
      </div>
      {actions}
    </form>
  );
}
