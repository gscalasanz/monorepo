/** Lista de deudores del dashboard, desde `GET /reportes/deudas`. */
import { personaHref } from '@/shared/constants';
import type { PersonaDeuda } from '@/shared/domain';
import { DEBTORS_LIMIT } from '@/features/dashboard/constants/dashboard';

export type DebtConcept = 'inscripcion' | 'campamento';

export interface DebtorRow {
  readonly id: string;
  readonly nombre: string;
  /** Valor de dominio (`Unidad`, `Educadores`…): `RamaChip` resuelve el color. */
  readonly rama: string;
  readonly concepts: readonly DebtConcept[];
  readonly amount: number;
  /** Ficha de la persona. */
  readonly href: string;
}

export interface DebtorsSummary {
  /** Los mayores deudores (máx. `DEBTORS_LIMIT`). */
  readonly rows: readonly DebtorRow[];
  /** Cantidad y total de TODOS los deudores, no solo de los visibles. */
  readonly count: number;
  readonly total: number;
}

const hasOpenBalance = (items: readonly { readonly saldo: number }[]): boolean =>
  items.some((item) => item.saldo > 0);

function conceptsOf(deuda: PersonaDeuda): readonly DebtConcept[] {
  const hasInscripcion = hasOpenBalance(deuda.inscripcionesGrupo) || hasOpenBalance(deuda.inscripcionesScout);
  return [
    ...(hasInscripcion ? (['inscripcion'] as const) : []),
    ...(hasOpenBalance(deuda.campamentos) ? (['campamento'] as const) : []),
  ];
}

export function buildDebtors(deudas: readonly PersonaDeuda[]): DebtorsSummary {
  const debtors = deudas.filter((d) => d.deudaTotal > 0);
  const rows = [...debtors]
    .sort((a, b) => b.deudaTotal - a.deudaTotal)
    .slice(0, DEBTORS_LIMIT)
    .map((d) => ({
      id: d.personaId,
      nombre: d.nombre,
      rama: d.rama,
      concepts: conceptsOf(d),
      amount: d.deudaTotal,
      href: personaHref({ tipo: d.tipo, id: d.personaId }),
    }));
  return {
    rows,
    count: debtors.length,
    total: debtors.reduce((sum, d) => sum + d.deudaTotal, 0),
  };
}
