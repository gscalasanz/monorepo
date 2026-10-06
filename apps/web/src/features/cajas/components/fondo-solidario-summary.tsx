'use client';

import { ArrowLeftRight, HandHeart, Heart, Plus } from 'lucide-react';

import { StatCard } from '@/shared/components/charts';
import { Button } from '@/shared/components/ui/button';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { FondoSolidarioView } from '@/features/cajas/helpers/fondo-solidario';

export interface FondoSolidarioSummaryProps {
  readonly view: FondoSolidarioView;
  readonly creating: boolean;
  readonly onCrear: () => void;
  readonly onTransferir: () => void;
}

/** Hint, saldo disponible, bonificado y la acción (crear o transferir al fondo). */
export function FondoSolidarioSummary({
  view,
  creating,
  onCrear,
  onTransferir,
}: FondoSolidarioSummaryProps) {
  return (
    <>
      <p className="max-w-prose text-sm text-ink-muted">{C.FS_HINT}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={HandHeart}
          title={C.SALDO_DISPONIBLE}
          value={view.saldo}
          format="currency"
          variant={view.saldo > 0 ? 'success' : 'info'}
        />
        <StatCard
          icon={Heart}
          title={C.BONIFICADO}
          value={view.bonificado}
          format="currency"
          variant="info"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {view.cajaId ? (
          <Button
            variant="secondary"
            icon={<ArrowLeftRight aria-hidden />}
            disabled={!view.cajaGrupo}
            onClick={onTransferir}
          >
            {C.TRANSFERIR_FS}
          </Button>
        ) : (
          <Button
            icon={<Plus aria-hidden />}
            loading={creating}
            onClick={onCrear}
          >
            {C.CREAR_FS}
          </Button>
        )}
      </div>
    </>
  );
}
