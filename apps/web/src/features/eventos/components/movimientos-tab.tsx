'use client';

import { ArrowLeftRight, CirclePlus, CircleMinus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ListPanel, ListToolbar } from '@/shared/components/data';
import { EmptyState, LoadingState } from '@/shared/components/feedback';
import {
  GastoFormDialog,
  IngresoFormDialog,
  MovimientoFilterTabs,
  MovimientosTable,
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

function useFilteredCards(params: {
  readonly movimientos: readonly Movimiento[] | undefined;
  readonly filtro: FiltroMovimientos;
}) {
  const cards = useMemo(
    () => (params.movimientos ?? []).map(toCardData),
    [params.movimientos],
  );
  const filtered = useMemo(
    () =>
      filterMovimientosBy({
        movimientos: cards,
        filtro: params.filtro,
        isGasto,
      }),
    [cards, params.filtro],
  );
  return { cards, filtered };
}

function MovimientosBody(props: {
  readonly tab: MovimientosTabProps;
  readonly cards: readonly MovimientoCardData[];
  readonly filtered: readonly MovimientoCardData[];
}) {
  const { tab, cards, filtered } = props;
  const actions = useMovimientoActions(tab.onChanged);
  const readonly = tab.evento.estaCerrado;
  if (tab.movimientos === undefined) return <LoadingState />;
  if (cards.length === 0)
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title={C.emptyTitle}
        hint={C.emptyHint}
      />
    );
  if (filtered.length === 0) return <EmptyState title={C.filteredEmpty} />;
  return (
    <MovimientosTable
      movimientos={filtered}
      ariaLabel={C.tableLabel}
      deletable={!readonly}
      onDelete={(m) => void actions.remove(m)}
      onPagarReembolso={readonly ? undefined : (m) => void actions.pagar(m)}
    />
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

function RegisterButtons(props: {
  readonly evento: Evento;
  readonly onOpen: (kind: Exclude<DialogKind, null>) => void;
}) {
  const { evento, onOpen } = props;
  if (evento.estaCerrado) return null;
  return (
    <div className="flex flex-wrap gap-2 md:ml-auto">
      {evento.tipo === TIPO_EVENTO.GRUPO && (
        <Button
          variant="secondary"
          icon={<CirclePlus aria-hidden />}
          onClick={() => onOpen('ingreso')}
        >
          {C.registrarIngreso}
        </Button>
      )}
      <Button
        variant="secondary"
        icon={<CircleMinus aria-hidden />}
        onClick={() => onOpen('gasto')}
      >
        {C.registrarGasto}
      </Button>
    </div>
  );
}

/** Tab Movimientos: un card con filtros y registro arriba y la tabla de ingresos / gastos. */
export function MovimientosTab(props: MovimientosTabProps) {
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [filtro, setFiltro] = useState<FiltroMovimientos>(
    FILTRO_MOVIMIENTOS.TODOS,
  );
  const { cards, filtered } = useFilteredCards({
    movimientos: props.movimientos,
    filtro,
  });
  const close = (open: boolean) => !open && setDialog(null);
  return (
    <>
      <ListPanel
        toolbar={
          <ListToolbar>
            <MovimientoFilterTabs value={filtro} onValueChange={setFiltro} />
            <RegisterButtons evento={props.evento} onOpen={setDialog} />
          </ListToolbar>
        }
      >
        <MovimientosBody tab={props} cards={cards} filtered={filtered} />
      </ListPanel>
      <MovimientoDialogs dialog={dialog} close={close} props={props} />
    </>
  );
}
