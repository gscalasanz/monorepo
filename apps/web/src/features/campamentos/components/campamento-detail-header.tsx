'use client';

import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { RowActionsMenu } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { CampamentoDetalle } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DATE_FORMATS, formatDate, nowMs, todayBsAs } from '@/shared/time';
import { CampBadge } from '@/features/campamentos/components/camp-badge';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';
import {
  cardBadge,
  daysUntil,
} from '@/features/campamentos/helpers/camp-status';

type Campamento = CampamentoDetalle['campamento'];

export interface CampamentoDetailHeaderProps {
  readonly campamento: Campamento;
  readonly onAgregar: () => void;
  readonly onDelete: () => void;
}

/** Fechas · días que faltan · estado · descripción. */
function HeaderMeta({ campamento }: { readonly campamento: Campamento }) {
  const [today] = useState(todayBsAs);
  const [now] = useState(nowMs);
  const dias = daysUntil(campamento.fechaInicio, now);
  return (
    <span className="flex flex-col gap-1.5">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="tabular-nums">
          {formatDate(campamento.fechaInicio, DATE_FORMATS.dayMonth)} —{' '}
          {formatDate(campamento.fechaFin, DATE_FORMATS.dayMonthYear)}
        </span>
        {dias !== null && <span>{C.diasRestantes(dias)}</span>}
        <CampBadge badge={cardBadge({ camp: campamento, today, nowMs: now })} />
      </span>
      {campamento.descripcion && <span>{campamento.descripcion}</span>}
    </span>
  );
}

function HeaderActions({
  campamento,
  onAgregar,
  onDelete,
}: CampamentoDetailHeaderProps) {
  const router = useRouter();
  return (
    <>
      <Button size="sm" icon={<UserPlus aria-hidden />} onClick={onAgregar}>
        {C.AGREGAR}
      </Button>
      <RowActionsMenu
        ariaLabel={C.MAS_ACCIONES}
        actions={[
          {
            key: 'edit',
            label: C.EDITAR,
            icon: Pencil,
            onSelect: () => router.push(CAMPAMENTO_ROUTES.edit(campamento.id)),
          },
          {
            key: 'delete',
            label: C.ELIMINAR,
            icon: Trash2,
            destructive: true,
            onSelect: onDelete,
          },
        ]}
      />
    </>
  );
}

/** Encabezado del detalle (como eventos): acción principal + ⋯ con Editar / Eliminar. */
export function CampamentoDetailHeader(props: CampamentoDetailHeaderProps) {
  return (
    <PageHeader
      title={props.campamento.nombre}
      subtitle={<HeaderMeta campamento={props.campamento} />}
      backHref={CAMPAMENTO_ROUTES.LIST}
      backLabel={C.BACK}
      actions={<HeaderActions {...props} />}
    />
  );
}
