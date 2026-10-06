'use client';

import { useSearchParams } from 'next/navigation';

import { LoadingState } from '@/shared/components/feedback';
import { TIPO_INSCRIPCION, tipoInscripcionSchema } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { URL_PARAMS } from '@/features/inscripciones/constants/inscripciones';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { useInscripcionCreateForm } from '@/features/inscripciones/hooks/use-inscripcion-create-form';
import { AnoBadge } from '@/features/inscripciones/components/form/ano-badge';
import { InscripcionCreateForm } from '@/features/inscripciones/components/form/inscripcion-create-form';

/** `/inscripciones/crear` (tipo inicial desde `?tipo`, default Scout Argentina). */
export function InscripcionCreateView() {
  const tipoParam = tipoInscripcionSchema.safeParse(
    useSearchParams().get(URL_PARAMS.TIPO),
  );
  const form = useInscripcionCreateForm(
    tipoParam.success ? tipoParam.data : TIPO_INSCRIPCION.SCOUT_ARGENTINA,
  );
  const { personasLoading, personaOptions } = form.data;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.CREATE_TITLE}
        subtitle={C.CREATE_SUBTITLE}
        backHref={inscripcionRoutes.list}
        actions={<AnoBadge ano={form.values.ano} />}
      />
      {personasLoading && personaOptions.length === 0 ? (
        <LoadingState label={C.LOADING} />
      ) : (
        <InscripcionCreateForm form={form} />
      )}
    </div>
  );
}
