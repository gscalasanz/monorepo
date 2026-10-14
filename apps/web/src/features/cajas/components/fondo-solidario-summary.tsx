'use client';

import { ArrowLeftRight, Plus } from 'lucide-react';

import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { FondoSolidarioView } from '@/features/cajas/helpers/fondo-solidario';

function kpiItems(view: FondoSolidarioView): readonly KpiItem[] {
  return [
    {
      id: 'saldo',
      label: C.SALDO_DISPONIBLE,
      value: (
        <Money
          amount={view.saldo}
          size="figure-md"
          tone={view.saldo < 0 ? 'debt' : undefined}
        />
      ),
    },
    {
      id: 'bonificado',
      label: C.BONIFICADO,
      value: <Money amount={view.bonificado} size="figure-md" />,
    },
  ];
}

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
      <KpiStrip ariaLabel={C.FS_LABEL} items={kpiItems(view)} />
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
