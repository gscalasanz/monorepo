'use client';

import { useState, type FormEvent } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { changePassword } from '@/shared/auth';
import { collectFieldErrors, useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import {
  changePasswordFieldsSchema,
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from '@/features/auth/models/schemas';

const INITIAL: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/** Cambio de contraseña: el backend invalida las sesiones → login forzado. */
export function useChangePassword() {
  const form = useFormState<ChangePasswordFormValues>(INITIAL);
  const validation = useFieldValidation(changePasswordFieldsSchema);
  const [mismatch, setMismatch] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ChangePasswordFormValues>(name: K, value: string): void {
    form.setField(name, value);
    validation.onChange(name, value);
    setMismatch(undefined);
  }

  function checkMatch(): boolean {
    const result = changePasswordFormSchema.safeParse(form.values);
    const error = result.success ? undefined : collectFieldErrors(result.error).confirmPassword;
    setMismatch(form.values.confirmPassword ? error : undefined);
    return result.success;
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const fieldsOk = validation.validateAll(form.values);
    if (!checkMatch() || !fieldsOk) return;
    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.values.currentPassword,
        newPassword: form.values.newPassword,
      });
      notify.success(C.PASSWORD_UPDATED);
    } catch (cause) {
      notify.error(extractErrorMessage(cause, C.PASSWORD_UPDATE_ERROR));
      setSaving(false);
    }
  }

  const errors: Partial<Record<keyof ChangePasswordFormValues, string>> = {
    ...validation.errors,
    confirmPassword: validation.errors.confirmPassword ?? mismatch,
  };
  return { values: form.values, errors, validation, update, submit, saving, checkMatch };
}
