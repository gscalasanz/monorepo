'use client';

import { useRouter } from 'next/navigation';

import { FormActions } from '@/shared/components/ui/form';
import { TIPO_INSCRIPCION } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import type { CreateFormModel } from '@/features/inscripciones/hooks/use-inscripcion-create-form';
import { AutorizacionesSection } from '@/features/inscripciones/components/form/autorizaciones-section';
import { DatosSection } from '@/features/inscripciones/components/form/datos-section';
import { InscripcionFormCard } from '@/features/inscripciones/components/form/form-card';
import { ImportesSection } from '@/features/inscripciones/components/form/importes-section';

/** Tarjeta izquierda: a quién (persona, tipo, año) y autorizaciones de Scout Argentina. */
function DatosCard({ form }: { readonly form: CreateFormModel }) {
  const { values, data } = form;
  return (
    <InscripcionFormCard>
      <DatosSection
        personaId={values.personaId}
        tipo={values.tipo}
        ano={values.ano}
        personaOptions={data.personaOptions}
        errors={form.errors}
        onPersonaChange={(personaId) => form.setField('personaId', personaId)}
        onTipoChange={form.setTipo}
        onAnoChange={(ano) => form.setField('ano', ano)}
      />
      {values.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? (
        <AutorizacionesSection values={values} onChange={form.setField} />
      ) : null}
    </InscripcionFormCard>
  );
}

/** Alta en dos tarjetas: a quién (datos + autorizaciones SA) · cuánto (importes) + acciones. */
export function InscripcionCreateForm({
  form,
}: {
  readonly form: CreateFormModel;
}) {
  const router = useRouter();
  const { values, data } = form;
  return (
    <form
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
        <DatosCard form={form} />
        <InscripcionFormCard>
          <ImportesSection
            values={values}
            saldoFondo={data.saldoFondo}
            saldoPersonal={data.saldoPersonal}
            saldoLoading={data.saldoLoading}
            fondoBajo={form.fondoBajo}
            exceden={form.exceden}
            saldoExcedido={form.saldoExcedido}
            onChange={form.setField}
            onPersonaNuevaChange={form.setPersonaNueva}
          />
        </InscripcionFormCard>
      </div>
      <FormActions
        cancelLabel={C.CANCEL}
        saveLabel={C.CREATE}
        saving={form.saving}
        saveDisabled={form.fondoBajo || form.exceden || form.saldoExcedido}
        onCancel={() => router.push(inscripcionRoutes.list)}
      />
    </form>
  );
}
