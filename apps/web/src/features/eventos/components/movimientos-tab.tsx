'use client';

import { ArrowLeftRight, CirclePlus, CircleMinus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState, LoadingState } from '@/shared/components/feedback';
import {
  GastoFormDialog,
  IngresoFormDialog,
  MovimientoCard,
  MovimientoFilterTabs,
  confirmPagarReembolso,
  filterMovimientosBy,
  toGastoEventoDto,
  toIngresoDto,
  type MovimientoCardData,
} from '@/shared/components/finanzas';
import { Button } from '@/shared/components/ui/button';
import { confirmDialog } from '@/shared/confirm';
import {
  CONCEPTO_MOVIMIENTO,
  FILTRO_MOVIMIENTOS,
  TIPO_EVENTO,
  TIPO_MOVIMIENTO,
  type Evento,
  type FiltroMovimientos,
  type Movimiento,
  type Persona,
} from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  deleteMovimiento,
  pagarReembolso,
  registrarGasto,
  registrarIngreso,
} from '@/features/eventos/services/eventos-api';

const C = EVENTOS_COPY.movimientos;

export interface MovimientosTabProps {
  readonly evento: Evento;
  readonly movimientos: readonly Movimiento[] | undefined;
  readonly personas: readonly Persona[];
  readonly onChanged: () => Promise<void>;
}

type DialogKind = 'ingreso' | 'gasto' | null;

/** Gastos = egresos que no son uso de saldo personal (paridad `filtrarMovimientos`). */
const isGasto = (m: { tipo: string; concepto?: string }) =>
  m.tipo === TIPO_MOVIMIENTO.EGRESO &&
  m.concepto !== CONCEPTO_MOVIMIENTO.USO_SALDO_PERSONAL;

function toCardData(movimiento: Movimiento): MovimientoCardData {
  return {
    ...movimiento,
    responsableNombre: movimiento.responsable?.nombre ?? '',
  };
}

function useMovimientoActions(onChanged: () => Promise<void>) {
  const remove = async (movimiento: MovimientoCardData): Promise<void> => {
    const result = await confirmDialog.runDelete(
      EVENTOS_COPY.entities.movimiento,
      {
        action: () => deleteMovimiento(movimiento.id),
      },
    );
    if (!result.confirmed) return;
    notify.success(C.deleted);
    await onChanged();
  };
  const pagar = async (movimiento: MovimientoCardData): Promise<void> => {
    const result = await confirmPagarReembolso({
      ...movimiento,
      action: () => pagarReembolso(movimiento.id),
    });
    if (result.confirmed) await onChanged();
  };
  return { remove, pagar };
}

function MovimientosList({ props }: { readonly props: MovimientosTabProps }) {
  const [filtro, setFiltro] = useState<FiltroMovimientos>(
    FILTRO_MOVIMIENTOS.TODOS,
  );
  const cards = useMemo(
    () => (props.movimientos ?? []).map(toCardData),
    [props.movimientos],
  );
  const filtered = useMemo(
    () => filterMovimientosBy({ movimientos: cards, filtro, isGasto }),
    [cards, filtro],
  );
  const actions = useMovimientoActions(props.onChanged);
  const readonly = props.evento.estaCerrado;
  if (props.movimientos === undefined) return <LoadingState />;
  if (cards.length === 0)
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title={C.emptyTitle}
        hint={C.emptyHint}
      />
    );
  return (
    <div className="flex flex-col gap-3">
      <MovimientoFilterTabs value={filtro} onValueChange={setFiltro} />
      {filtered.length === 0 ? (
        <EmptyState title={C.filteredEmpty} />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((movimiento) => (
            <li key={movimiento.id}>
              <MovimientoCard
                movimiento={movimiento}
                deletable={!readonly}
                onDelete={(m) => void actions.remove(m)}
                onPagarReembolso={
                  readonly ? undefined : (m) => void actions.pagar(m)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MovimientoDialogs({
  dialog,
  close,
  props,
}: {
  readonly dialog: DialogKind;
  readonly close: (open: boolean) => void;
  readonly props: MovimientosTabProps;
}) {
  const { evento, onChanged } = props;
  return (
    <>
      <IngresoFormDialog
        open={dialog === 'ingreso'}
        onOpenChange={close}
        personas={props.personas}
        onSubmit={async (values) => {
          await registrarIngreso({ id: evento.id, dto: toIngresoDto(values) });
          notify.success(C.ingresoOk);
          void onChanged();
        }}
      />
      <GastoFormDialog
        open={dialog === 'gasto'}
        onOpenChange={close}
        personas={props.personas}
        onSubmit={async (values) => {
          await registrarGasto({
            id: evento.id,
            dto: toGastoEventoDto(values),
          });
          notify.success(C.gastoOk);
          void onChanged();
        }}
      />
    </>
  );
}

/** Tab Movimientos: ingresos (solo grupo), gastos, filtros, reembolsos y borrado. */
export function MovimientosTab(props: MovimientosTabProps) {
  const [dialog, setDialog] = useState<DialogKind>(null);
  const { evento } = props;
  const close = (open: boolean) => !open && setDialog(null);
  return (
    <div className="flex flex-col gap-4">
      {!evento.estaCerrado && (
        <div className="flex flex-wrap gap-2">
          {evento.tipo === TIPO_EVENTO.GRUPO && (
            <Button
              variant="secondary"
              icon={<CirclePlus aria-hidden />}
              onClick={() => setDialog('ingreso')}
            >
              {C.registrarIngreso}
            </Button>
          )}
          <Button
            variant="secondary"
            icon={<CircleMinus aria-hidden />}
            onClick={() => setDialog('gasto')}
          >
            {C.registrarGasto}
          </Button>
        </div>
      )}
      <MovimientosList props={props} />
      <MovimientoDialogs dialog={dialog} close={close} props={props} />
    </div>
  );
}
