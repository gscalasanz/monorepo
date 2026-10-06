'use client';

import { ArrowLeft, CircleAlert, UserX } from 'lucide-react';
import Link from 'next/link';

import { LoadingState } from '@/shared/components/feedback';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { usePersonaFicha } from '@/features/personas/hooks/use-persona-ficha';
import { BackToListState } from '@/features/personas/components/back-to-list-state';
import { PersonaFichaContent } from '@/features/personas/components/ficha/persona-ficha-content';

/** Ficha de protagonista/educador (`/personas/{protagonistas|educadores}/:id`). */
export function PersonaFichaView({ id }: { readonly id: string }) {
  const { dashboard, error, isLoading, transfer } = usePersonaFicha(id);
  const settled = !isLoading && !dashboard;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link
        href={PERSONA_ROUTES.LIST}
        className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink md:min-h-0"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {C.BACK}
      </Link>
      {isLoading ? (
        <LoadingState variant="skeleton" rows={6} label={C.LOADING} />
      ) : null}
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
      {dashboard ? (
        <PersonaFichaContent
          dashboard={dashboard}
          onTransfer={() => void transfer()}
        />
      ) : null}
    </div>
  );
}
