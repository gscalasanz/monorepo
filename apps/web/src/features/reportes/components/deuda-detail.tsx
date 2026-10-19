import { cn } from '@/shared/lib/utils';
import { DeudasMonetarias } from '@/features/reportes/components/deudas-monetarias';
import { DocumentacionGroups } from '@/features/reportes/components/documentacion-groups';
import { debtCards, docGroups } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

/** Desglose de la fila: deudas de dinero (si hay) y documentación agrupada. */
export function DeudaDetail({ persona }: { readonly persona: PersonaDeuda }) {
  const cards = debtCards(persona);
  const groups = docGroups(persona);
  return (
    <div
      className={cn(
        'grid gap-4 px-4 py-4 md:pl-14 lg:items-start',
        cards.length > 0 ? 'lg:grid-cols-2' : 'lg:max-w-4xl',
      )}
    >
      {cards.length > 0 ? (
        <DeudasMonetarias persona={persona} cards={cards} />
      ) : null}
      <DocumentacionGroups persona={persona} groups={groups} />
    </div>
  );
}
