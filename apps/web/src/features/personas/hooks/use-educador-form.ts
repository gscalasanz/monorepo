'use client';

import { useState } from 'react';

import { EDUCADOR_FORM_COPY as E } from '@/features/personas/constants/form-copy';
import {
  createEducadorDto,
  updateEducadorDto,
} from '@/features/personas/helpers/forms';
import { usePersonaForm } from '@/features/personas/hooks/use-persona-form';
import {
  credencialesErrors,
  educadorFormSchema,
  type CredencialesErrors,
  type EducadorFormValues,
} from '@/features/personas/models/form-schemas';
import {
  createEducador,
  updatePersona,
} from '@/features/personas/services/personas-api';

/** Form de educador: además de los campos, valida que email y contraseña vayan juntos (solo al crear). */
export function useEducadorForm(params: {
  readonly initial: EducadorFormValues;
  readonly editId?: string;
}) {
  const { initial, editId } = params;
  const [credenciales, setCredenciales] = useState<CredencialesErrors>({});
  const form = usePersonaForm({
    schema: educadorFormSchema,
    initial,
    save: (parsed) =>
      editId
        ? updatePersona({ id: editId, dto: updateEducadorDto(parsed) })
        : createEducador(createEducadorDto(parsed)),
    successMessage: editId ? E.UPDATED_OK : E.CREATED_OK,
    extraCheck: (values) => {
      const errors = editId ? {} : credencialesErrors(values);
      setCredenciales(errors);
      return Object.keys(errors).length === 0;
    },
  });

  /** Al salir de email/contraseña: valida el campo y el vínculo entre ambos. */
  function blurCredencial(name: 'email' | 'password'): void {
    form.blur(name);
    const message = credencialesErrors(form.values)[name];
    setCredenciales((prev) => ({ ...prev, [name]: message }));
  }

  function updateCredencial(name: 'email' | 'password', value: string): void {
    form.update(name, value);
    setCredenciales({});
  }

  const errors: Readonly<Record<string, string | undefined>> = {
    ...form.errors,
    email: form.errors.email ?? credenciales.email,
    password: form.errors.password ?? credenciales.password,
  };
  return { ...form, errors, blurCredencial, updateCredencial };
}
