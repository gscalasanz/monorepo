'use client';

import { ArrowRight, CircleAlert } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { PasswordField, TextField } from '@/shared/components/ui/form';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';

/** Form de login: email + contraseña, error inline y redirección post-login. */
export function LoginForm() {
  const { values, validation, update, submit, submitting, error } =
    useLoginForm();
  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="flex flex-col gap-5"
    >
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      )}
      <TextField
        label={C.EMAIL_LABEL}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={C.EMAIL_PLACEHOLDER}
        required
        value={values.email}
        error={validation.errors.email}
        onChange={(value) => update('email', value)}
        onBlur={() => validation.onBlur('email', values.email)}
      />
      <PasswordField
        label={C.PASSWORD_LABEL}
        name="password"
        autoComplete="current-password"
        placeholder={C.PASSWORD_PLACEHOLDER}
        required
        value={values.password}
        error={validation.errors.password}
        onChange={(value) => update('password', value)}
        onBlur={() => validation.onBlur('password', values.password)}
      />
      <Button type="submit" loading={submitting} className="mt-1 w-full">
        {submitting ? C.SUBMITTING : C.SUBMIT}
        {!submitting && <ArrowRight aria-hidden />}
      </Button>
    </form>
  );
}
