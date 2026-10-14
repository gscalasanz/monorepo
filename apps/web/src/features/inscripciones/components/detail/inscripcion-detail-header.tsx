'use client';

import { CircleMinus, HandHeart, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  RamaChip,
  RowActionsMenu,
  StatusBadge,
  type RowAction,
} from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { ButtonLink } from '@/shared/components/ui/button-link';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { personaHref } from '@/shared/constants/links';
import {
  ESTADO_INSCRIPCION_LABELS,
  TIPO_INSCRIPCION_LABELS,
  type Inscripcion,
} from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import type { InscripcionDetailModel } from '@/features/inscripciones/hooks/use-inscripcion-detail';

interface HeaderProps {
  readonly inscripcion: Inscripcion;
  readonly model: InscripcionDetailModel;
}

/** Rama · tipo y año · estado. */
function HeaderMeta({ inscripcion }: { readonly inscripcion: Inscripcion }) {
  const { persona } = inscripcion;
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {persona?.rama && <RamaChip rama={persona.rama} />}
      <span className="tabular-nums">
        {C.subtitle(TIPO_INSCRIPCION_LABELS[inscripcion.tipo], inscripcion.ano)}
      </span>
      <StatusBadge
        status={inscripcion.estado}
        label={ESTADO_INSCRIPCION_LABELS[inscripcion.estado]}
      />
    </span>
  );
}

function menuActions(
  { inscripcion, model }: HeaderProps,
  push: (href: string) => void,
): readonly RowAction[] {
  const bonificado = inscripcion.montoBonificado > 0;
  const quitar: readonly RowAction[] = bonificado
    ? [
        {
          key: 'quitar-bonificacion',
          label: C.QUITAR_BONIFICACION,
          icon: CircleMinus,
          onSelect: () =>
            void model.mutations.quitarBonificacion().catch(() => undefined),
        },
      ]
    : [];
  return [
    {
      key: 'edit',
      label: C.EDIT,
      icon: Pencil,
      onSelect: () => push(inscripcionRoutes.edit(inscripcion.id)),
    },
    {
      key: 'bonificar',
      label: bonificado ? C.AJUSTAR_BONIFICACION : C.BONIFICAR,
      icon: HandHeart,
      onSelect: () => model.setDialog({ kind: 'bonificar' }),
    },
    ...quitar,
    {
      key: 'delete',
      label: C.DELETE,
      icon: Trash2,
      destructive: true,
      onSelect: () => void model.remove(),
    },
  ];
}

function HeaderActions(props: HeaderProps) {
  const router = useRouter();
  const { persona } = props.inscripcion;
  return (
    <>
      {props.inscripcion.saldoPendiente > 0 && (
        <Button
          size="sm"
          icon={<Plus aria-hidden />}
          onClick={() => props.model.setDialog({ kind: 'pago' })}
        >
          {C.REGISTRAR_PAGO}
        </Button>
      )}
      {persona && (
        <ButtonLink
          href={personaHref({ tipo: persona.tipo, id: persona.id })}
          variant="secondary"
          size="sm"
        >
          {C.VER_FICHA}
          <NavChevron className="text-current" />
        </ButtonLink>
      )}
      <RowActionsMenu
        ariaLabel={C.MAS_ACCIONES}
        actions={menuActions(props, (href) => router.push(href))}
      />
    </>
  );
}

/** Encabezado del detalle (como campamentos/eventos): acción principal + ⋯ con el resto. */
export function InscripcionDetailHeader(props: HeaderProps) {
  return (
    <PageHeader
      title={props.inscripcion.persona?.nombre ?? C.SIN_NOMBRE}
      subtitle={<HeaderMeta inscripcion={props.inscripcion} />}
      backHref={inscripcionRoutes.list}
      backLabel={C.BACK}
      actions={<HeaderActions {...props} />}
    />
  );
}
