'use client';

import { TIPO_INSCRIPCION, type Inscripcion } from '@/shared/domain';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { pickAutorizaciones } from '@/features/inscripciones/helpers/detail';
import type { InscripcionDetailModel } from '@/features/inscripciones/hooks/use-inscripcion-detail';
import { AutorizacionesCard } from '@/features/inscripciones/components/detail/autorizaciones-card';
import { DetailDialogs } from '@/features/inscripciones/components/detail/detail-dialogs';
import { InscripcionDetailHeader } from '@/features/inscripciones/components/detail/inscripcion-detail-header';
import { PaymentStatusCard } from '@/features/inscripciones/components/detail/payment-status-card';
import { PaymentHistory } from '@/features/inscripciones/components/detail/payment-history';

interface InscripcionDetailContentProps {
  readonly inscripcion: Inscripcion;
  readonly model: InscripcionDetailModel;
}

/** Detalle cargado: encabezado con acciones, estado de pago, historial y autorizaciones (SA). */
export function InscripcionDetailContent({
  inscripcion,
  model,
}: InscripcionDetailContentProps) {
  const isSA = inscripcion.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <InscripcionDetailHeader inscripcion={inscripcion} model={model} />
      <PaymentStatusCard inscripcion={inscripcion} />
      <div
        className={
          isSA ? 'grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start' : 'grid'
        }
      >
        <PaymentHistory
          inscripcion={inscripcion}
          onEditPago={(movimiento) =>
            model.setDialog({ kind: 'editar-pago', movimiento })
          }
        />
        {isSA ? (
          <AutorizacionesCard
            values={pickAutorizaciones(inscripcion)}
            editHref={inscripcionRoutes.edit(inscripcion.id)}
          />
        ) : null}
      </div>
      <DetailDialogs inscripcion={inscripcion} model={model} />
    </div>
  );
}
