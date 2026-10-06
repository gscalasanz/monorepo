import type { ReactNode } from 'react';

import { PageHeader } from '@/shared/layout';
import { CONFIG_COPY as C } from '@/features/configuracion/constants/copy';
import { BackupsCard } from '@/features/configuracion/components/backups-card';
import { InscripcionConfigCard } from '@/features/configuracion/components/inscripcion-config-card';

/**
 * Página de configuración. La card "Mi Perfil" vive en el feature `auth` y la
 * compone la ruta (`app/`), así ningún feature importa de otro.
 */
export function ConfiguracionView({ profileSlot }: { profileSlot: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      {profileSlot}
      <BackupsCard />
      <InscripcionConfigCard />
    </div>
  );
}
