'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';

import { useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import type { TipoInscripcion } from '@/shared/domain';
import { loadInscripcionConfig, montoByTipo } from '@/shared/settings';
import { currentYearBsAs } from '@/shared/time';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import {
  applyPersonaNueva,
  applyTipo,
  buildCreateDto,
  fondoInsuficiente,
  initialCreateValues,
  montosExcedenTotal,
  validateCreate,
  type CreateFormValues,
  type MontoForTipo,
} from '@/features/inscripciones/helpers/create-form';
import { useCreateFormData } from '@/features/inscripciones/hooks/use-create-form-data';
import { createInscripcion } from '@/features/inscripciones/services/inscripciones-api';

/** Valida y crea; vuelve a la lista con el tab del tipo creado. */
function useCreateSubmit(params: {
  readonly values: CreateFormValues;
  readonly blocked: boolean;
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { values, blocked } = params;

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitted(true);
    const { personaId, ano } = values;
    if (
      !personaId ||
      ano === null ||
      blocked ||
      Object.keys(validateCreate(values)).length > 0
    )
      return;
    setSaving(true);
    try {
      await createInscripcion(buildCreateDto({ ...values, personaId, ano }));
      notify.success(C.CREATED);
      router.push(
        inscripcionRoutes.withQuery(
          inscripcionRoutes.list,
          `tipo=${values.tipo}`,
        ),
      );
    } catch {
      // El mensaje del backend ya se muestra como toast global (paridad con Angular).
      setSaving(false);
    }
  }

  return { submit, saving, errors: submitted ? validateCreate(values) : {} };
}

/** Form "Nueva Inscripción": monto desde la config local, pago inicial, saldo personal y bonificación. */
export function useInscripcionCreateForm(initialTipo: TipoInscripcion) {
  const montoFor = useMemo<MontoForTipo>(() => {
    const config = loadInscripcionConfig();
    return (tipo) => montoByTipo(config, tipo);
  }, []);
  const form = useFormState<CreateFormValues>(
    initialCreateValues({
      tipo: initialTipo,
      ano: currentYearBsAs(),
      montoFor,
    }),
  );
  const { values } = form;
  const data = useCreateFormData(values.personaId);
  const exceden = montosExcedenTotal(values);
  const fondoBajo = fondoInsuficiente(values, data.saldoFondo);
  const { submit, saving, errors } = useCreateSubmit({
    values,
    blocked: exceden || fondoBajo,
  });

  return {
    values,
    data,
    errors,
    exceden,
    fondoBajo,
    saving,
    submit,
    setField: form.setField,
    setTipo: (tipo: TipoInscripcion) =>
      form.setValues(applyTipo(values, { tipo, montoFor })),
    setPersonaNueva: (esNueva: boolean) =>
      form.setValues(applyPersonaNueva(values, { esNueva, montoFor })),
  };
}

export type CreateFormModel = ReturnType<typeof useInscripcionCreateForm>;
