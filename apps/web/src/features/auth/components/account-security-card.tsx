import { Panel } from '@/shared/components/ui/panel';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { ChangeEmailForm } from '@/features/auth/components/change-email-form';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

/** Panel "Seguridad": cambiar email y contraseña en dos columnas desde `md`. */
export function AccountSecurityCard() {
  return (
    <Panel title={C.SECURITY_TITLE}>
      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0 [&>*]:py-6 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0 md:[&>*]:py-0 md:[&>*:first-child]:pr-[18px] md:[&>*:last-child]:pl-[18px]">
        <ChangeEmailForm />
        <ChangePasswordForm />
      </div>
    </Panel>
  );
}
