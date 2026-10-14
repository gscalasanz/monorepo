'use client';

import { ArrowLeftRight, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { PersonaHeaderCard } from '@/features/personas/components/ficha/persona-header-card';

export interface PersonaIdentityCardProps {
  readonly persona: PersonaDashboard['persona'];
  readonly canTransfer: boolean;
  readonly onTransfer: () => void;
}

/** Encabezado de la ficha: nombre, rama · tipo · cargo, estado y acciones. */
export function PersonaIdentityCard({
  persona,
  canTransfer,
  onTransfer,
}: PersonaIdentityCardProps) {
  const router = useRouter();
  const editHref = PERSONA_ROUTES.edit({ tipo: persona.tipo, id: persona.id });
  return (
    <PersonaHeaderCard
      persona={persona}
      actions={
        <>
          <Button
            variant="secondary"
            icon={<Pencil aria-hidden className="size-4" />}
            onClick={() => router.push(editHref)}
          >
            {C.EDIT}
          </Button>
          {canTransfer ? (
            <Button
              icon={<ArrowLeftRight aria-hidden className="size-4" />}
              onClick={onTransfer}
            >
              {C.TRANSFER}
            </Button>
          ) : null}
        </>
      }
    />
  );
}
