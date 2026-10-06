'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { changeEmail, useSession } from '@/shared/auth';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import {
  changeEmailFormSchema,
  type ChangeEmailFormValues,
} from '@/features/auth/models/schemas';

/** Cambio de email: precarga el actual y limpia la contraseña al guardar. */
export function useChangeEmail() {
  const { user } = useSession();
  const form = useFormState<ChangeEmailFormValues>({ newEmail: '', currentPassword: '' });
  const validation = useFieldValidation(changeEmailFormSchema);
  const [saving, setSaving] = useState(false);
  const currentEmail = user?.email ?? '';
  const { setField } = form;

  useEffect(() => {
    if (currentEmail) setField('newEmail', currentEmail);
  }, [currentEmail, setField]);

  function update<K extends keyof ChangeEmailFormValues>(name: K, value: string): void {
    form.setField(name, value);
    validation.onChange(name, value);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!validation.validateAll(form.values)) return;
    setSaving(true);
    try {
      await changeEmail({
        newEmail: form.values.newEmail.trim(),
        currentPassword: form.values.currentPassword,
      });
      notify.success(C.EMAIL_UPDATED);
      form.setField('currentPassword', '');
      validation.reset();
    } catch (cause) {
      notify.error(extractErrorMessage(cause, C.EMAIL_UPDATE_ERROR));
    } finally {
      setSaving(false);
    }
  }

  return { values: form.values, validation, update, submit, saving };
}
