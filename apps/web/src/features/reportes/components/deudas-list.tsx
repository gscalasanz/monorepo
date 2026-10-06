'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { DEUDA_GRID, DeudaRow } from '@/features/reportes/components/deuda-row';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

/** Tabla de deudores (lista en mobile). Una sola fila expandida a la vez. */
export function DeudasList({ deudas }: { readonly deudas: readonly PersonaDeuda[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const toggle = (id: string) => setSelected((current) => (current === id ? null : id));
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
      <div
        aria-hidden
        className={cn(
          'hidden border-b border-border bg-recessed px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase',
          DEUDA_GRID,
        )}
      >
        <span>{C.COL_NOMBRE}</span>
        <span>{C.COL_RAMA}</span>
        <span>{C.COL_DEUDAS}</span>
        <span className="text-right">{C.COL_TOTAL}</span>
      </div>
      <ul aria-label={C.TITLE}>
        {deudas.map((persona) => (
          <DeudaRow
            key={persona.personaId}
            persona={persona}
            expanded={selected === persona.personaId}
            onToggle={toggle}
          />
        ))}
      </ul>
    </div>
  );
}
