import Link from 'next/link';

import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { ListedPersona } from '@/features/personas/helpers/list';

/** Nombre como link a la ficha (además de la acción "Ver" del menú). */
export function PersonaNameLink({ persona }: { readonly persona: ListedPersona }) {
  return (
    <Link
      href={PERSONA_ROUTES.detail({ tipo: persona.tipo, id: persona.id })}
      className="font-medium text-ink hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {persona.nombre}
    </Link>
  );
}
