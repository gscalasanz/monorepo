import { PasswordField, TextField } from '@/shared/components/ui/form';
import { EDUCADOR_FORM_COPY as E } from '@/features/personas/constants/form-copy';
import type { EducadorFormValues } from '@/features/personas/models/form-schemas';

export interface EducadorCredentialsFieldsProps {
  readonly values: Pick<EducadorFormValues, 'email' | 'password'>;
  readonly errors: { readonly email?: string; readonly password?: string };
  readonly onChange: (name: 'email' | 'password', value: string) => void;
  readonly onBlur: (name: 'email' | 'password') => void;
}

/** Email + contraseña de acceso (solo al crear; opcionales pero van juntos). */
export function EducadorCredentialsFields({
  values,
  errors,
  onChange,
  onBlur,
}: EducadorCredentialsFieldsProps) {
  return (
    <>
      <TextField
        label={E.EMAIL}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="off"
        placeholder={E.EMAIL_PLACEHOLDER}
        helper={E.EMAIL_HINT}
        value={values.email}
        error={errors.email}
        onChange={(value) => onChange('email', value)}
        onBlur={() => onBlur('email')}
      />
      <PasswordField
        label={E.PASSWORD}
        name="password"
        autoComplete="new-password"
        placeholder={E.PASSWORD_PLACEHOLDER}
        helper={E.PASSWORD_HINT}
        value={values.password}
        error={errors.password}
        onChange={(value) => onChange('password', value)}
        onBlur={() => onBlur('password')}
      />
    </>
  );
}
