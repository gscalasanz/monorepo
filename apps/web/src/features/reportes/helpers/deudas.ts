/** Lógica pura del reporte de deudas (paridad exacta con `ReporteDeudasComponent`). */
import type { FilterValues } from '@/shared/components/data';
import { DEBT_LABELS as L, DOC_LABELS as D } from '@/features/reportes/constants/copy';
import { FILTER_KEYS } from '@/features/reportes/constants/filters';
import {
  isDeudaRamaFilter,
  isTipoDeudaFilter,
  type DeudaFilters,
  type DocInscripcion,
  type PersonaDeuda,
} from '@/features/reportes/models/deudas';

export interface DebtCard {
  readonly label: string;
  readonly name: string;
  readonly ano: number;
  readonly saldo: number;
}

export interface DocItem {
  readonly ok: boolean;
  readonly label: string;
}

/** Deudas monetarias con saldo > 0, ordenadas por año y luego por etiqueta. */
export function debtCards(p: PersonaDeuda): readonly DebtCard[] {
  return [
    ...p.campamentos.map((c) => ({ label: L.CAMPAMENTO, name: c.nombre, ano: c.ano, saldo: c.saldo })),
    ...p.inscripcionesScout.map((i) => ({ label: L.SCOUT, name: L.INSCRIPCION, ano: i.ano, saldo: i.saldo })),
    ...p.inscripcionesGrupo.map((i) => ({ label: L.GRUPO, name: L.INSCRIPCION, ano: i.ano, saldo: i.saldo })),
  ]
    .filter((d) => d.saldo > 0)
    .sort((a, b) => a.ano - b.ano || a.label.localeCompare(b.label));
}

/** Documentación personal (educadores: ninguna; mayores: sin "DNI padres"). */
export function personalDocItems(p: PersonaDeuda): readonly DocItem[] {
  const doc = p.documentacionPersonal;
  if (!doc) return [];
  const dniPadres = p.esMayorDeEdad ? [] : [{ ok: doc.dniPadres, label: D.DNI_PADRES }];
  return [
    { ok: doc.dni, label: D.DNI },
    { ok: doc.partidaNacimiento, label: D.PARTIDA },
    ...dniPadres,
    { ok: doc.carnetObraSocial, label: D.OBRA_SOCIAL },
  ];
}

/** Documentos de una inscripción Scout AR. */
export function inscripcionDocItems(doc: DocInscripcion): readonly DocItem[] {
  return [
    { ok: doc.declaracionDeSalud, label: `${D.SALUD} ${doc.ano}` },
    { ok: doc.autorizacionDeImagen, label: `${D.IMAGEN} ${doc.ano}` },
    { ok: doc.salidasCercanas, label: `${D.SALIDAS} ${doc.ano}` },
    { ok: doc.autorizacionIngreso, label: `${D.INGRESO} ${doc.ano}` },
    { ok: doc.certificadoAptitudFisica, label: `${D.APTITUD} ${doc.ano}` },
  ];
}

export function missingAutorizaciones(p: PersonaDeuda): PersonaDeuda['campamentos'] {
  return p.campamentos.filter((c) => !c.autorizacionEntregada);
}

export function hasDocDeuda(p: PersonaDeuda): boolean {
  return (
    personalDocItems(p).some((d) => !d.ok) ||
    p.documentacionInscripcion.length > 0 ||
    missingAutorizaciones(p).length > 0
  );
}

export function countDocsFaltantes(p: PersonaDeuda): number {
  const personal = personalDocItems(p).filter((d) => !d.ok).length;
  const inscripciones = p.documentacionInscripcion.reduce(
    (acc, doc) => acc + inscripcionDocItems(doc).filter((d) => !d.ok).length,
    0,
  );
  return personal + inscripciones + missingAutorizaciones(p).length;
}

export interface DeudasSummary {
  readonly personas: number;
  readonly totalDeuda: number;
  readonly docsFaltantes: number;
}

export function summarize(deudas: readonly PersonaDeuda[]): DeudasSummary {
  return {
    personas: deudas.length,
    totalDeuda: deudas.reduce((sum, p) => sum + p.deudaTotal, 0),
    docsFaltantes: deudas.filter(hasDocDeuda).length,
  };
}

const asText = (value: FilterValues[string]): string => (typeof value === 'string' ? value : '');

/** Valores de la FilterBar → query del backend (vacío = sin filtrar). */
export function toDeudaFilters(values: FilterValues): DeudaFilters {
  const rama = asText(values[FILTER_KEYS.RAMA]);
  const ano = asText(values[FILTER_KEYS.ANO]);
  const tipo = asText(values[FILTER_KEYS.TIPO]);
  return {
    ...(isDeudaRamaFilter(rama) ? { rama } : {}),
    ...(ano ? { ano: Number(ano) } : {}),
    ...(isTipoDeudaFilter(tipo) ? { tipo } : {}),
  };
}
