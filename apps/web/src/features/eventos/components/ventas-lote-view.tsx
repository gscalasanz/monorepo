'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { FormActions } from '@/shared/components/ui/form';
import { Panel } from '@/shared/components/ui/panel';
import { PageHeader } from '@/shared/layout';
import { CantidadesTable } from '@/features/eventos/components/cantidades-table';
import {
  PagoFields,
  VendedorFields,
} from '@/features/eventos/components/ventas-lote-fields';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  useVentasLote,
  type VentasLoteState,
} from '@/features/eventos/hooks/use-ventas-lote';

const C = EVENTOS_COPY.lote;

function LoteForm({ state }: { readonly state: VentasLoteState }) {
  const router = useRouter();
  const formId = useId();
  return (
    <form
      id={formId}
      noValidate
      onSubmit={(event) => void state.submit(event)}
      className="flex flex-col gap-4"
    >
      <Panel title={C.vendedorSection}>
        <VendedorFields state={state} />
      </Panel>
      <Panel title={C.medioSection}>
        <PagoFields state={state} />
      </Panel>
      <Panel title={C.cantidadesSection}>
        <CantidadesTable
          productos={state.productos}
          cantidades={state.form.values.cantidades}
          onChange={(cantidades) =>
            state.form.setField('cantidades', cantidades)
          }
        />
      </Panel>
      <FormActions
        onCancel={() => router.push(state.backHref)}
        cancelLabel={C.cancelar}
        saveLabel={state.saving ? C.registrando : C.registrar}
        saving={state.saving}
        saveDisabled={
          state.productos.length === 0 || state.rules.agrupacionInvalida
        }
      />
    </form>
  );
}

function LoteBody({ state }: { readonly state: VentasLoteState }) {
  const { evento } = state.data;
  if (state.isLoading && !evento.data)
    return <LoadingState label={C.loading} />;
  if (evento.error && !evento.data) {
    return (
      <ErrorState message={evento.error} onRetry={() => void evento.reload()} />
    );
  }
  return <LoteForm state={state} />;
}

/** `/eventos/:id/ventas/registrar`: un vendedor, un medio de pago y cantidades por producto. */
export function VentasLoteView({ id }: { readonly id: string }) {
  const state = useVentasLote(id);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.title}
        subtitle={C.subtitle}
        backHref={state.backHref}
        backLabel={EVENTOS_COPY.detail.back}
      />
      <LoteBody state={state} />
    </div>
  );
}
