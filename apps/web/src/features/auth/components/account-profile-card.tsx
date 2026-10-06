'use client';

import { UserRound } from 'lucide-react';

import { useSession } from '@/shared/auth';
import { KeyValueList } from '@/shared/components/data';
import { PERSONA_TYPE_LABELS } from '@/shared/domain';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { ChangeEmailForm } from '@/features/auth/components/change-email-form';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

/** Card "Mi Perfil": datos de solo lectura + cambio de email y de contraseña. */
export function AccountProfileCard() {
  const { user } = useSession();
  return (
    <section
      aria-labelledby="profile-title"
      className="rounded-xl border border-border bg-surface shadow-xs"
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3 md:px-[18px]">
        <UserRound className="size-4 text-ink-subtle" aria-hidden />
        <h2 id="profile-title" className="text-sm font-semibold text-ink">
          {C.PROFILE_TITLE}
        </h2>
      </header>
      <div className="flex flex-col gap-6 p-4 md:p-[18px]">
        {user && (
          <KeyValueList
            columns={2}
            items={[
              { label: C.PROFILE_NAME, value: user.nombre },
              { label: C.PROFILE_TYPE, value: PERSONA_TYPE_LABELS[user.tipo] },
            ]}
          />
        )}
        <hr className="border-border" />
        <ChangeEmailForm />
        <hr className="border-border" />
        <ChangePasswordForm />
      </div>
    </section>
  );
}
