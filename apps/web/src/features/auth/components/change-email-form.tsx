'use client';

import { PasswordField, TextField } from '@/shared/components/ui/form';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { FormSubmitRow } from '@/features/auth/components/form-submit-row';
import { useChangeEmail } from '@/features/auth/hooks/use-change-email';

/** Sección "Cambiar email" de Mi Perfil. */
export function ChangeEmailForm() {
  const { values, validation, update, submit, saving } = useChangeEmail();
  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="flex h-full flex-col gap-4"
    >
      <h3 className="text-sm font-semibold text-ink">{C.CHANGE_EMAIL_TITLE}</h3>
      <TextField
        label={C.NEW_EMAIL_LABEL}
        type="email"
        autoComplete="email"
        placeholder={C.NEW_EMAIL_PLACEHOLDER}
        required
        value={values.newEmail}
        error={validation.errors.newEmail}
        onChange={(value) => update('newEmail', value)}
        onBlur={() => validation.onBlur('newEmail', values.newEmail)}
      />
      <PasswordField
        label={C.CURRENT_PASSWORD_LABEL}
        autoComplete="current-password"
        required
        value={values.currentPassword}
        error={validation.errors.currentPassword}
        onChange={(value) => update('currentPassword', value)}
        onBlur={() =>
          validation.onBlur('currentPassword', values.currentPassword)
        }
      />
      <FormSubmitRow label={C.SAVE_EMAIL} saving={saving} />
    </form>
  );
}
