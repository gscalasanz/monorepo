'use client';

import { ReceiptText } from 'lucide-react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { useGoBack } from '@/shared/navigation';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { useInscripcionDetail } from '@/features/inscripciones/hooks/use-inscripcion-detail';
import { InscripcionDetailContent } from '@/features/inscripciones/components/detail/inscripcion-detail-content';

function BackButton({ label }: { readonly label: string }) {
  const goBack = useGoBack(inscripcionRoutes.list);
  return (
    <Button variant="secondary" onClick={goBack}>
      {label}
    </Button>
  );
}

/** `/inscripciones/:id`: carga → error ("Volver") → no encontrada → detalle. */
export function InscripcionDetailView({ id }: { readonly id: string }) {
  const model = useInscripcionDetail(id);
  if (model.data === undefined && model.isLoading)
    return <LoadingState label={C.LOADING} />;
  if (model.error && !model.data) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ErrorState message={model.error} onRetry={() => void model.reload()} />
        <BackButton label={C.BACK} />
      </div>
    );
  }
  if (!model.data) {
    return (
      <EmptyState
        icon={ReceiptText}
        title={C.NOT_FOUND}
        action={<BackButton label={C.BACK_TO_LIST} />}
      />
    );
  }
  return <InscripcionDetailContent inscripcion={model.data} model={model} />;
}
