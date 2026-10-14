'use client';

import { useCallback, useId } from 'react';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { FormActions } from '@/shared/components/ui/form';
import { useAsyncData } from '@/shared/hooks';
import { PageHeader } from '@/shared/layout';
import { CampamentoFormFields } from '@/features/campamentos/components/campamento-form-fields';
import {
  DETAIL_COPY,
  FORM_COPY as C,
} from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  EMPTY_CAMPAMENTO_DRAFT,
  draftFromCampamento,
  type CampamentoDraft,
} from '@/features/campamentos/helpers/campamento-form';
import { useCampamentoForm } from '@/features/campamentos/hooks/use-campamento-form';
import { fetchCampamento } from '@/features/campamentos/services/campamentos-api';

interface CampamentoFormProps {
  readonly initial: CampamentoDraft;
  readonly id?: string;
}

function CampamentoForm({ initial, id }: CampamentoFormProps) {
  const form = useCampamentoForm({ initial, id });
  const formId = useId();
  return (
    <form
      id={formId}
      noValidate
      onSubmit={form.submit}
      className="flex flex-col gap-4 md:gap-6"
    >
      <CampamentoFormFields form={form} />
      <FormActions
        onCancel={form.cancel}
        cancelLabel={C.CANCEL}
        saveLabel={id ? C.SUBMIT_EDIT : C.SUBMIT_NEW}
        saving={form.saving}
        saveDisabled={!form.canSubmit}
      />
    </form>
  );
}

function EditLoader({ id }: { readonly id: string }) {
  const load = useCallback(
    (signal: AbortSignal) => fetchCampamento(id, signal),
    [id],
  );
  const query = useAsyncData({ key: id, load });
  if (query.data)
    return (
      <CampamentoForm
        key={id}
        id={id}
        initial={draftFromCampamento(query.data)}
      />
    );
  if (query.error && !query.isLoading) {
    return (
      <ErrorState
        message={query.error || C.LOAD_ERROR}
        onRetry={query.reload}
      />
    );
  }
  return <LoadingState label={C.LOADING} />;
}

/** `/campamentos/crear` y `/campamentos/:id/editar`. */
export function CampamentoFormView({ id }: { readonly id?: string }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={id ? C.titleEdit : C.titleNew}
        subtitle={id ? C.subtitleEdit : C.subtitleNew}
        backHref={id ? CAMPAMENTO_ROUTES.detail(id) : CAMPAMENTO_ROUTES.LIST}
        backLabel={DETAIL_COPY.BACK}
      />
      {id ? (
        <EditLoader id={id} />
      ) : (
        <CampamentoForm initial={EMPTY_CAMPAMENTO_DRAFT} />
      )}
    </div>
  );
}
