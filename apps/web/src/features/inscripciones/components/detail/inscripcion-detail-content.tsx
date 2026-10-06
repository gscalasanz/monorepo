'use client';

import { StatusBadge } from '@/shared/components/data';
import {
  ESTADO_INSCRIPCION_LABELS,
  TIPO_INSCRIPCION,
  TIPO_INSCRIPCION_LABELS,
  type Inscripcion,
} from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { pickAutorizaciones } from '@/features/inscripciones/helpers/detail';
import type { InscripcionDetailModel } from '@/features/inscripciones/hooks/use-inscripcion-detail';
import { AutorizacionesCard } from '@/features/inscripciones/components/detail/autorizaciones-card';
import { DetailActions } from '@/features/inscripciones/components/detail/detail-actions';
import { DetailDialogs } from '@/features/inscripciones/components/detail/detail-dialogs';
import { PaymentCard } from '@/features/inscripciones/components/detail/payment-card';
import { PaymentHistory } from '@/features/inscripciones/components/detail/payment-history';

interface InscripcionDetailContentProps {
  readonly inscripcion: Inscripcion;
  readonly model: InscripcionDetailModel;
}

/** Detalle cargado: encabezado, card de pago, historial, autorizaciones (SA) y acciones. */
export function InscripcionDetailContent({
  inscripcion,
  model,
}: InscripcionDetailContentProps) {
  const { setDialog, mutations } = model;
  const isSA = inscripcion.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA;
  const estado = (
    <StatusBadge
      status={inscripcion.estado}
      label={ESTADO_INSCRIPCION_LABELS[inscripcion.estado]}
    />
  );
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={inscripcion.persona?.nombre ?? C.SIN_NOMBRE}
        subtitle={C.subtitle(
          TIPO_INSCRIPCION_LABELS[inscripcion.tipo],
          inscripcion.ano,
        )}
        backHref={inscripcionRoutes.list}
        backLabel={C.BACK}
        actions={estado}
      />
      <PaymentCard
        inscripcion={inscripcion}
        onBonificar={() => setDialog({ kind: 'bonificar' })}
        onQuitarBonificacion={() =>
          void mutations.quitarBonificacion().catch(() => undefined)
        }
      />
      <div className={isSA ? 'grid gap-4 md:gap-6 lg:grid-cols-2' : 'grid'}>
        <PaymentHistory
          inscripcion={inscripcion}
          onAddPago={() => setDialog({ kind: 'pago' })}
          onEditPago={(movimiento) =>
            setDialog({ kind: 'editar-pago', movimiento })
          }
        />
        {isSA ? (
          <AutorizacionesCard values={pickAutorizaciones(inscripcion)} />
        ) : null}
      </div>
      <DetailActions id={inscripcion.id} onDelete={() => void model.remove()} />
      <DetailDialogs inscripcion={inscripcion} model={model} />
    </div>
  );
}
