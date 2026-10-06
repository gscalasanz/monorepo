'use client';

import { ReceiptText } from 'lucide-react';
import Link from 'next/link';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { useInscripcionDetail } from '@/features/inscripciones/hooks/use-inscripcion-detail';
import { InscripcionDetailContent } from '@/features/inscripciones/components/detail/inscripcion-detail-content';

const backToList = (label: string) => (
  <Button
    variant="secondary"
    nativeButton={false}
    render={<Link href={inscripcionRoutes.list} />}
  >
    {label}
  </Button>
);

/** `/inscripciones/:id`: carga → error ("Volver") → no encontrada → detalle. */
export function InscripcionDetailView({ id }: { readonly id: string }) {
  const model = useInscripcionDetail(id);
  if (model.data === undefined && model.isLoading)
    return <LoadingState label={C.LOADING} />;
  if (model.error && !model.data) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ErrorState message={model.error} onRetry={() => void model.reload()} />
        {backToList(C.BACK)}
      </div>
    );
  }
  if (!model.data) {
    return (
      <EmptyState
        icon={ReceiptText}
        title={C.NOT_FOUND}
        action={backToList(C.BACK_TO_LIST)}
      />
    );
  }
  return <InscripcionDetailContent inscripcion={model.data} model={model} />;
}
