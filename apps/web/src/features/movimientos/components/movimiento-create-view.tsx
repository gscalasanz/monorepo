'use client';

import { useSearchParams } from 'next/navigation';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { useAsyncData } from '@/shared/hooks';
import { PageHeader } from '@/shared/layout';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  CREATE_CAJA_PARAM,
  MOVIMIENTO_ROUTES,
} from '@/features/movimientos/constants/movimientos';
import { fetchCreateFormData } from '@/features/movimientos/services/movimientos-api';
import { MovimientoCreateForm } from '@/features/movimientos/components/movimiento-create-form';

const CREATE_FORM_KEY = 'movimientos:create-form';

/** `/movimientos/nuevo` (`?cajaId` precarga la caja). */
export function MovimientoCreateView() {
  const initialCajaId = useSearchParams().get(CREATE_CAJA_PARAM);
  const { data, error, isLoading, reload } = useAsyncData({
    key: CREATE_FORM_KEY,
    load: fetchCreateFormData,
  });
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.CREATE_TITLE}
        subtitle={C.CREATE_SUBTITLE}
        backHref={MOVIMIENTO_ROUTES.LIST}
      />
      {isLoading && !data ? <LoadingState label={C.LOADING_FORM} /> : null}
      {error && !data && !isLoading ? (
        <ErrorState
          message={error}
          onRetry={() => void reload()}
          retryLabel={C.RETRY}
        />
      ) : null}
      {data ? (
        <MovimientoCreateForm data={data} initialCajaId={initialCajaId} />
      ) : null}
    </div>
  );
}
