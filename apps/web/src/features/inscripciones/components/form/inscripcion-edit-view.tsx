'use client';

import { ReceiptText } from 'lucide-react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import {
  DETAIL_COPY,
  FORM_COPY as C,
} from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { useInscripcionEditForm } from '@/features/inscripciones/hooks/use-inscripcion-edit-form';
import { AnoBadge } from '@/features/inscripciones/components/form/ano-badge';
import { InscripcionEditForm } from '@/features/inscripciones/components/form/inscripcion-edit-form';

/** `/inscripciones/:id/editar` y `/inscripciones/:id/pago` (paridad: mismo form). */
export function InscripcionEditView({ id }: { readonly id: string }) {
  const model = useInscripcionEditForm(id);
  const { inscripcion, autorizaciones } = model;
  const body = model.isLoading ? (
    <LoadingState label={C.LOADING} />
  ) : model.error && !inscripcion ? (
    <ErrorState message={model.error} onRetry={() => void model.reload()} />
  ) : inscripcion && autorizaciones ? (
    <InscripcionEditForm
      inscripcion={inscripcion}
      autorizaciones={autorizaciones}
      model={model}
    />
  ) : (
    <EmptyState icon={ReceiptText} title={DETAIL_COPY.NOT_FOUND} />
  );
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.EDIT_TITLE}
        subtitle={C.EDIT_SUBTITLE}
        backHref={inscripcionRoutes.list}
        actions={<AnoBadge ano={inscripcion?.ano ?? null} />}
      />
      {body}
    </div>
  );
}
