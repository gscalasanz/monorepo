'use client';

import { CircleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId } from 'react';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { FormActions } from '@/shared/components/ui/form';
import { DESTINO_GANANCIA_LABELS, type Evento } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { PageHeader } from '@/shared/layout';
import { EventoFormFields } from '@/features/eventos/components/evento-form-fields';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import {
  INITIAL_EVENTO_DRAFT,
  draftFromEvento,
} from '@/features/eventos/helpers/evento-form';
import { useEventoForm } from '@/features/eventos/hooks/use-evento-form';
import { fetchEvento } from '@/features/eventos/services/eventos-api';

const C = EVENTOS_COPY.form;

interface EventoFormProps {
  readonly evento?: Evento;
}

function EventoForm({ evento }: EventoFormProps) {
  const router = useRouter();
  const formId = useId();
  const form = useEventoForm({
    initial: evento ? draftFromEvento(evento) : INITIAL_EVENTO_DRAFT,
    eventoId: evento?.id,
  });
  const backHref = evento
    ? EVENTOS_ROUTES.detail(evento.id)
    : EVENTOS_ROUTES.list;
  return (
    <form
      id={formId}
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-4"
    >
      {form.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {form.error}
        </p>
      )}
      <EventoFormFields form={form} isEditing={Boolean(evento)} />
      <FormActions
        onCancel={() => router.push(backHref)}
        cancelLabel={C.cancel}
        saveLabel={evento ? C.update : C.create}
        saving={form.saving}
      />
    </form>
  );
}

function DestinoMeta({ evento }: { readonly evento: Evento }) {
  if (!evento.destinoGanancia) return null;
  return (
    <p className="text-[13px] text-ink-muted">
      {C.destinoMeta}{' '}
      <span className="font-medium text-ink">
        {DESTINO_GANANCIA_LABELS[evento.destinoGanancia]}
      </span>
    </p>
  );
}

/** `/eventos/crear` */
export function EventoCreateView() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.newTitle}
        subtitle={C.newSubtitle}
        backHref={EVENTOS_ROUTES.list}
      />
      <EventoForm />
    </div>
  );
}

/** `/eventos/:id/editar` (carga el evento y recién ahí monta el form). */
export function EventoEditView({ id }: { readonly id: string }) {
  const query = useAsyncData({
    key: `evento:${id}:edit`,
    load: (signal) => fetchEvento(id, signal),
  });
  const evento = query.data;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.editTitle}
        subtitle={C.editSubtitle}
        backHref={EVENTOS_ROUTES.detail(id)}
      />
      {evento && <DestinoMeta evento={evento} />}
      {!evento && query.error && (
        <ErrorState message={query.error} onRetry={() => void query.reload()} />
      )}
      {!evento && !query.error && <LoadingState label={C.loading} />}
      {evento && <EventoForm evento={evento} />}
    </div>
  );
}
