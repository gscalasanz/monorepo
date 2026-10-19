/** Filtro "Origen de deuda": un campamento o una inscripción (tipo + año) que todavía registra deuda. */
import { formatMoney } from '@/shared/format';
import type { FilterOption } from '@/shared/components/data';
import { CONSOLIDADO_COPY as C, TIPO_DEUDA_LABELS } from '@/features/reportes/constants/copy';
import type { ConsolidadoDeudas } from '@/features/reportes/models/consolidado';
import {
  isTipoDeudaFilter,
  type DeudaFilters,
} from '@/features/reportes/models/deudas';

const SEPARATOR = ':';
const KIND = { CAMPAMENTO: 'campamento', INSCRIPCION: 'inscripcion' } as const;

const encodeCampamento = (campamentoId: string): string =>
  [KIND.CAMPAMENTO, campamentoId].join(SEPARATOR);

const encodeInscripcion = (tipo: string, ano: number): string =>
  [KIND.INSCRIPCION, tipo, ano].join(SEPARATOR);

const optionLabel = (name: string, amount: number): string =>
  `${name} · ${formatMoney(amount)}`;

/** Opciones del filtro, salidas del consolidado del backend (solo orígenes con deuda). */
export function origenOptions(consolidado: ConsolidadoDeudas): readonly FilterOption[] {
  return [
    ...consolidado.campamentos.map((c) => ({
      value: encodeCampamento(c.campamentoId),
      label: optionLabel(C.campamento(c.nombre, c.ano), c.deudaTotal),
    })),
    ...consolidado.inscripciones.map((i) => ({
      value: encodeInscripcion(i.tipo, i.ano),
      label: optionLabel(C.inscripcion(TIPO_DEUDA_LABELS[i.tipo], i.ano), i.deudaTotal),
    })),
  ];
}

/**
 * Valor del filtro → parámetros del backend: un campamento (`campamentoId`) o una inscripción
 * (`tipo` + `ano`). Un valor desconocido no filtra.
 */
export function parseOrigen(value: string): Pick<DeudaFilters, 'campamentoId' | 'tipo' | 'ano'> {
  const [kind, first, second] = value.split(SEPARATOR);
  if (kind === KIND.CAMPAMENTO && first) return { campamentoId: first };
  const ano = Number(second);
  if (kind === KIND.INSCRIPCION && first && isTipoDeudaFilter(first) && Number.isInteger(ano)) {
    return { tipo: first, ano };
  }
  return {};
}
