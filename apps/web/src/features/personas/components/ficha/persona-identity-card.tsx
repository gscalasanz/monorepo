'use client';

import { ArrowLeftRight, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { PersonaBadges } from '@/features/personas/components/ficha/persona-badges';

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
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:flex-row md:items-center md:justify-between md:p-[18px]">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] break-words text-ink">
          {persona.nombre}
        </h1>
        <PersonaBadges persona={persona} />
      </div>
      <div className="flex flex-wrap gap-2 [&>*]:flex-1 md:[&>*]:flex-none">
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
      </div>
    </section>
  );
}
