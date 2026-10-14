import type { ReactNode } from 'react';

import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { PersonaBadges } from '@/features/personas/components/ficha/persona-badges';

export interface PersonaHeaderCardProps {
  readonly persona: PersonaDashboard['persona'];
  readonly actions: ReactNode;
}

/** Encabezado de toda ficha de persona: nombre, rama · tipo · cargo · estado y acciones. */
export function PersonaHeaderCard({
  persona,
  actions,
}: PersonaHeaderCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:flex-row md:items-center md:justify-between md:p-[18px]">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] break-words text-ink">
          {persona.nombre}
        </h1>
        <PersonaBadges persona={persona} />
      </div>
      <div className="flex flex-wrap items-center gap-2 [&>button]:flex-1 md:[&>button]:flex-none">
        {actions}
      </div>
    </section>
  );
}
