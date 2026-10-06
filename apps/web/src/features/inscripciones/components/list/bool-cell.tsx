import { Check, X } from 'lucide-react';

import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';

/** Check / cruz con texto para lectores (el estado nunca solo por ícono/color). */
export function BoolCell({ value }: { readonly value: boolean }) {
  const Icon = value ? Check : X;
  return (
    <span className={value ? 'text-success' : 'text-ink-subtle'}>
      <Icon aria-hidden className="size-4" />
      <span className="sr-only">{value ? C.YES : C.NO}</span>
    </span>
  );
}
