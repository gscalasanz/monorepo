'use client';

import { CircleAlert, UserX } from 'lucide-react';

import { LoadingState } from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { EXTERNA_DETAIL_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { usePersonaExternaDetail } from '@/features/personas/hooks/use-persona-externa-detail';
import { BackToListState } from '@/features/personas/components/back-to-list-state';
import { PersonaExternaCard } from '@/features/personas/components/externa/persona-externa-card';

/** `/personas/personas-externas/:id`: datos de contacto + editar / eliminar. */
export function PersonaExternaDetailView({ id }: { readonly id: string }) {
  const { persona, isLoading, error, edit, remove } =
    usePersonaExternaDetail(id);
  const settled = !isLoading && !persona;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.TITLE}
        backHref={PERSONA_ROUTES.LIST}
        backLabel={C.BACK}
      />
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
