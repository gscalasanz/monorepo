import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { LoadingState } from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { FORM_COPY as F } from '@/features/personas/constants/form-copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { BackToListState } from '@/features/personas/components/back-to-list-state';

export interface PersonaFormFrameProps {
  readonly title: string;
  readonly subtitle: string;
  /** Solo en modo edición: estado de la carga de `GET /personas/:id`. */
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly wrongType?: boolean;
  readonly children: ReactNode;
}

/** Página de formulario a todo el ancho: encabezado + estados de carga/error de la persona a editar. */
export function PersonaFormFrame({
  title,
  subtitle,
  loading,
  error,
  wrongType,
  children,
}: PersonaFormFrameProps) {
  const failure = error ?? (wrongType ? F.WRONG_TYPE : null);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        backHref={PERSONA_ROUTES.LIST}
      />
      {loading ? <LoadingState label={F.LOADING} /> : null}
      {!loading && failure ? (
        <BackToListState
          role="alert"
          icon={CircleAlert}
          title={failure}
          actionLabel={F.BACK_TO_LIST}
        />
      ) : null}
      {!loading && !failure ? children : null}
    </div>
  );
}
