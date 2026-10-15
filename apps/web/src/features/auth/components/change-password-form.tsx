'use client';

import { PasswordField } from '@/shared/components/ui/form';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { FormSubmitRow } from '@/features/auth/components/form-submit-row';
import { useChangePassword } from '@/features/auth/hooks/use-change-password';

/** Sección "Cambiar contraseña" de Mi Perfil (invalida las sesiones). */
export function ChangePasswordForm() {
  const { values, errors, validation, update, submit, saving, checkMatch } =
    useChangePassword();
  return (
    <form
      noValidate
      onSubmit={(event) => void submit(event)}
      className="flex h-full flex-col gap-4"
    >
      <h3 className="text-sm font-semibold text-ink">
        {C.CHANGE_PASSWORD_TITLE}
      </h3>
      <PasswordField
        label={C.CURRENT_PASSWORD_LABEL}
        autoComplete="current-password"
        required
        value={values.currentPassword}
        error={errors.currentPassword}
        onChange={(value) => update('currentPassword', value)}
        onBlur={() =>
          validation.onBlur('currentPassword', values.currentPassword)
        }
      />
      <PasswordField
        label={C.NEW_PASSWORD_LABEL}
        autoComplete="new-password"
        required
        value={values.newPassword}
        error={errors.newPassword}
        onChange={(value) => update('newPassword', value)}
        onBlur={() => validation.onBlur('newPassword', values.newPassword)}
      />
      <PasswordField
        label={C.CONFIRM_PASSWORD_LABEL}
        autoComplete="new-password"
        required
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={(value) => update('confirmPassword', value)}
        onBlur={() => {
          validation.onBlur('confirmPassword', values.confirmPassword);
          checkMatch();
        }}
      />
      <FormSubmitRow label={C.SAVE_PASSWORD} saving={saving} />
    </form>
  );
}
