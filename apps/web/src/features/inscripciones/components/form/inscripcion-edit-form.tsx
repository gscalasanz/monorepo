'use client';

import { useRouter } from 'next/navigation';

import { FormActions } from '@/shared/components/ui/form';
import { TIPO_INSCRIPCION, type Inscripcion } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import type { Autorizaciones } from '@/features/inscripciones/constants/inscripciones';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import type { InscripcionEditModel } from '@/features/inscripciones/hooks/use-inscripcion-edit-form';
import { AutorizacionesSection } from '@/features/inscripciones/components/form/autorizaciones-section';
import { InscripcionFormCard } from '@/features/inscripciones/components/form/form-card';
import { InscripcionSummary } from '@/features/inscripciones/components/form/inscripcion-summary';

interface InscripcionEditFormProps {
  readonly inscripcion: Inscripcion;
  readonly autorizaciones: Autorizaciones;
  readonly model: InscripcionEditModel;
}

/** Edición como movimientos: izquierda los datos de solo lectura, derecha las autorizaciones (SA). */
export function InscripcionEditForm({
  inscripcion,
  autorizaciones,
  model,
}: InscripcionEditFormProps) {
  const router = useRouter();
  return (
    <form
      noValidate
      onSubmit={(event) => void model.submit(event)}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
        <InscripcionFormCard>
          <InscripcionSummary inscripcion={inscripcion} />
        </InscripcionFormCard>
        {inscripcion.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? (
          <InscripcionFormCard>
            <AutorizacionesSection
              values={autorizaciones}
              onChange={model.setAutorizacion}
            />
          </InscripcionFormCard>
        ) : null}
      </div>
      <FormActions
        cancelLabel={C.CANCEL}
        saveLabel={C.SAVE}
        saving={model.saving}
        onCancel={() => router.push(inscripcionRoutes.list)}
      />
    </form>
  );
}
