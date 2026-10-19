/** Schemas de los forms de auth (reglas idénticas a los `Validators` de Angular). */
import { z } from 'zod';

import {
  AUTH_FEATURE_COPY as C,
  PASSWORD_MIN_LOGIN,
  PASSWORD_MIN_PROFILE,
} from '@/features/auth/constants/copy';

const email = z.string().trim().min(1, C.EMAIL_REQUIRED).email(C.EMAIL_INVALID);

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, C.PASSWORD_REQUIRED).min(PASSWORD_MIN_LOGIN, C.PASSWORD_MIN),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

const profilePassword = z.string().min(1, C.REQUIRED_F).min(PASSWORD_MIN_PROFILE, C.MIN_8);

export const changeEmailFormSchema = z.object({
  newEmail: email,
  currentPassword: profilePassword,
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailFormSchema>;

export const changePasswordFieldsSchema = z.object({
  currentPassword: profilePassword,
  newPassword: profilePassword,
  confirmPassword: z.string().min(1, C.REQUIRED_F),
});

export const changePasswordFormSchema = changePasswordFieldsSchema.refine(
  (values) => values.newPassword === values.confirmPassword,
  { message: C.PASSWORD_MISMATCH, path: ['confirmPassword'] },
);

export type ChangePasswordFormValues = z.infer<typeof changePasswordFieldsSchema>;
