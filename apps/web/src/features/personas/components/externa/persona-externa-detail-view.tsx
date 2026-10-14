'use client';

import { ArrowLeft, CircleAlert, UserX } from 'lucide-react';
import Link from 'next/link';

import { LoadingState } from '@/shared/components/feedback';
import { EXTERNA_DETAIL_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { usePersonaExternaDetail } from '@/features/personas/hooks/use-persona-externa-detail';
import { BackToListState } from '@/features/personas/components/back-to-list-state';
import { PersonaExternaCard } from '@/features/personas/components/externa/persona-externa-card';

/** `/personas/personas-externas/:id`: misma composición que la ficha (volver · encabezado · panel). */
export function PersonaExternaDetailView({ id }: { readonly id: string }) {
  const { persona, isLoading, error, edit, remove } =
    usePersonaExternaDetail(id);
  const settled = !isLoading && !persona;
  return (
    <div className="flex w-full max-w-6xl flex-col gap-4 md:gap-6">
      <Link
        href={PERSONA_ROUTES.LIST}
        className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink md:min-h-0"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {C.BACK}
      </Link>
      {isLoading ? <LoadingState label={C.LOADING} /> : null}
      {settled && error ? (
        <BackToListState
          role="alert"
          icon={CircleAlert}
          title={error}
          actionLabel={C.BACK}
        />
      ) : null}
      {settled && !error ? (
        <BackToListState
          icon={UserX}
          title={C.NOT_FOUND}
          actionLabel={C.BACK_TO_LIST}
        />
      ) : null}
      {persona ? (
        <PersonaExternaCard
          persona={persona}
          onEdit={edit}
          onDelete={() => void remove()}
        />
      ) : null}
    </div>
  );
}
