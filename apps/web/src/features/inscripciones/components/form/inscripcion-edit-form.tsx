'use client';

import { useRouter } from 'next/navigation';

import { FormActions } from '@/shared/components/ui/form';
import { TIPO_INSCRIPCION, type Inscripcion } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import type { Autorizaciones } from '@/features/inscripciones/constants/inscripciones';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import type { InscripcionEditModel } from '@/features/inscripciones/hooks/use-inscripcion-edit-form';
import { AutorizacionesSection } from '@/features/inscripciones/components/form/autorizaciones-section';
import { DatosSection } from '@/features/inscripciones/components/form/datos-section';
import { ImportesReadonlySection } from '@/features/inscripciones/components/form/importes-readonly-section';

interface InscripcionEditFormProps {
  readonly inscripcion: Inscripcion;
  readonly autorizaciones: Autorizaciones;
  readonly model: InscripcionEditModel;
}

/** Edición: persona / tipo / año / monto bloqueados; solo autorizaciones (SA). */
export function InscripcionEditForm({
  inscripcion,
  autorizaciones,
  model,
}: InscripcionEditFormProps) {
  const router = useRouter();
  const persona = {
    value: inscripcion.personaId,
    label: inscripcion.persona?.nombre ?? inscripcion.personaId,
  };
  return (
    <form
      noValidate
      onSubmit={(event) => void model.submit(event)}
      className="flex flex-col gap-4"
    >
      <DatosSection
        disabled
        personaId={inscripcion.personaId}
        tipo={inscripcion.tipo}
        ano={inscripcion.ano}
        personaOptions={[persona]}
      />
      <ImportesReadonlySection montoTotal={inscripcion.montoTotal} />
      {inscripcion.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? (
        <AutorizacionesSection
          values={autorizaciones}
          onChange={model.setAutorizacion}
        />
      ) : null}
      <FormActions
        cancelLabel={C.CANCEL}
        saveLabel={C.SAVE}
        saving={model.saving}
        onCancel={() => router.push(inscripcionRoutes.list)}
      />
    </form>
  );
}
