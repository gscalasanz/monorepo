'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingState } from '@/shared/components/feedback';
import { useAsyncData } from '@/shared/hooks';
import { PageHeader } from '@/shared/layout';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MOVIMIENTO_ROUTES } from '@/features/movimientos/constants/movimientos';
import { fetchEditFormData } from '@/features/movimientos/services/movimientos-api';
import { MovimientoEditForm } from '@/features/movimientos/components/movimiento-edit-form';

/** `/movimientos/:id/editar`. Paridad: si la carga falla, vuelve a la lista (el toast global avisa). */
export function MovimientoEditView({ id }: { readonly id: string }) {
  const router = useRouter();
  const { data, error } = useAsyncData({
    key: `movimientos:edit:${id}`,
    load: (signal) => fetchEditFormData({ id, signal }),
  });

  useEffect(() => {
    if (error) router.replace(MOVIMIENTO_ROUTES.LIST);
  }, [error, router]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.EDIT_TITLE}
        subtitle={C.EDIT_SUBTITLE}
        backHref={MOVIMIENTO_ROUTES.LIST}
      />
      {data ? (
        <MovimientoEditForm key={data.movimiento.id} data={data} />
      ) : (
        <LoadingState label={C.LOADING_FORM} />
      )}
    </div>
  );
}
