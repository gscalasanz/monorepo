import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { Money, StatusBadge } from '@/shared/components/data';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { DocChip } from '@/features/reportes/components/doc-chip';
import {
  debtCards,
  hasDocDeuda,
  inscripcionDocItems,
  missingAutorizaciones,
  personalDocItems,
} from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

function Section({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-ink-muted">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function MonetarySection({ persona }: { readonly persona: PersonaDeuda }) {
  const cards = debtCards(persona);
  if (cards.length === 0) return null;
  return (
    <Section title={C.SECTION_MONETARIAS}>
      {cards.map((card) => (
        <div
          key={`${card.label}-${card.ano}-${card.name}`}
          className="flex min-w-28 flex-col gap-1 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5"
        >
          <span className="text-xs font-semibold text-danger">
            {card.label} <span className="font-medium">{card.ano}</span>
          </span>
          <span className="max-w-36 truncate text-xs text-ink-muted">{card.name}</span>
          <Money amount={card.saldo} tone="debt" className="text-sm" />
        </div>
      ))}
    </Section>
  );
}

/** Detalle expandido de una persona: deudas, autorizaciones y documentación. */
export function DeudaDetail({ persona }: { readonly persona: PersonaDeuda }) {
  const autorizaciones = missingAutorizaciones(persona);
  return (
    <div className="flex flex-col gap-4 border-t border-border bg-surface px-4 pt-3 pb-4">
      <MonetarySection persona={persona} />
      {autorizaciones.length > 0 ? (
        <Section title={C.SECTION_AUTORIZACIONES}>
          {autorizaciones.map((camp) => (
            <StatusBadge
              key={camp.campamentoId}
              tone="warning"
              icon={TriangleAlert}
              label={C.AUT_CAMPAMENTO(camp.nombre, camp.ano)}
              className="h-auto max-w-full whitespace-normal"
            />
          ))}
        </Section>
      ) : null}
      {hasDocDeuda(persona) ? (
        <Section title={C.SECTION_DOCUMENTACION}>
          {[...personalDocItems(persona), ...persona.documentacionInscripcion.flatMap(inscripcionDocItems)].map(
            (doc, index) => (
              <DocChip key={`${index}-${doc.label}`} doc={doc} />
            ),
          )}
        </Section>
      ) : null}
    </div>
  );
}
