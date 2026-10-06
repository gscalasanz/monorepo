'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { consumeRedirectUrl, login } from '@/shared/auth';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { loginErrorMessage } from '@/features/auth/helpers/login-error';
import { loginFormSchema, type LoginFormValues } from '@/features/auth/models/schemas';

const INITIAL: LoginFormValues = { email: '', password: '' };

/** Estado y submit del login: valida, autentica y vuelve a `redirectUrl`. */
export function useLoginForm() {
  const router = useRouter();
  const form = useFormState<LoginFormValues>(INITIAL);
  const validation = useFieldValidation(loginFormSchema);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof LoginFormValues>(name: K, value: LoginFormValues[K]): void {
    form.setField(name, value);
    validation.onChange(name, value);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!validation.validateAll(form.values)) return;
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: form.values.email.trim(), password: form.values.password });
      router.replace(consumeRedirectUrl());
    } catch (cause) {
      setError(loginErrorMessage(cause));
      setSubmitting(false);
    }
  }

  return { values: form.values, validation, update, submit, submitting, error };
}
