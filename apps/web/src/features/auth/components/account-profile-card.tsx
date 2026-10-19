'use client';

import { useSession } from '@/shared/auth';
import { KeyValueList } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { PERSONA_TYPE_LABELS } from '@/shared/domain';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';

/** Panel "Mi Perfil": datos de solo lectura de la cuenta. */
export function AccountProfileCard() {
  const { user } = useSession();
  return (
    <Panel title={C.PROFILE_TITLE}>
      {user ? (
        <KeyValueList
          columns={2}
          items={[
            { label: C.PROFILE_NAME, value: user.nombre },
            { label: C.PROFILE_TYPE, value: PERSONA_TYPE_LABELS[user.tipo] },
          ]}
        />
      ) : null}
    </Panel>
  );
}
