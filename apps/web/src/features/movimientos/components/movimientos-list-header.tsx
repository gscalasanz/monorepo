'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/layout';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MOVIMIENTO_ROUTES } from '@/features/movimientos/constants/movimientos';

/** Título, "{total} registros" y "Nuevo Movimiento". */
export function MovimientosListHeader({ total }: { readonly total: number }) {
  const router = useRouter();
  return (
    <PageHeader
      title={C.LIST_TITLE}
      subtitle={C.LIST_SUBTITLE}
      actions={
        <>
          <span
            className="text-sm text-ink-muted tabular-nums"
            aria-live="polite"
          >
            {C.records(total)}
          </span>
          <Button
            icon={<Plus className="size-4" aria-hidden />}
            onClick={() => router.push(MOVIMIENTO_ROUTES.NEW)}
          >
            {C.NEW}
          </Button>
        </>
      }
    />
  );
}
