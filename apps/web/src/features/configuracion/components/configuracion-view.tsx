import type { ReactNode } from 'react';

import { PageHeader } from '@/shared/layout';
import {
  CONFIG_COPY as C,
  CONFIG_SECTIONS,
  type ConfigSectionId,
} from '@/features/configuracion/constants/copy';
import { BackupsCard } from '@/features/configuracion/components/backups-card';
import { ConfigSectionIndex } from '@/features/configuracion/components/config-section-index';
import { InscripcionConfigCard } from '@/features/configuracion/components/inscripcion-config-card';

interface ConfiguracionViewProps {
  /** "Mi Perfil" y "Seguridad" viven en el feature `auth`: los compone la ruta, así ningún feature importa de otro. */
  readonly profileSlot: ReactNode;
  readonly securitySlot: ReactNode;
}

function Section({
  id,
  children,
}: {
  readonly id: ConfigSectionId;
  readonly children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-6">
      {children}
    </div>
  );
}

/** Página de configuración: ancho acotado (880px) con índice lateral desde `lg`; el orden lo fija `CONFIG_SECTIONS`. */
export function ConfiguracionView({
  profileSlot,
  securitySlot,
}: ConfiguracionViewProps) {
  const content: Readonly<Record<ConfigSectionId, ReactNode>> = {
    perfil: profileSlot,
    inscripciones: <InscripcionConfigCard />,
    backup: <BackupsCard />,
    seguridad: securitySlot,
  };
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      <div className="grid gap-6 lg:grid-cols-[160px_minmax(0,880px)] lg:items-start">
        <ConfigSectionIndex />
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          {CONFIG_SECTIONS.map(({ id }) => (
            <Section key={id} id={id}>
              {content[id]}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
