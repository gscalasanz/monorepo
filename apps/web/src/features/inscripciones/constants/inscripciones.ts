/** Constantes del módulo Inscripciones (ramas, filtros, autorizaciones). */
import {
  INSCRIPCIONES_RAMA_EDUCADOR,
  MEDIO_PAGO,
  MEDIO_PAGO_LABELS,
  RAMA,
  TIPO_DEUDA,
  TIPO_INSCRIPCION,
  TIPO_INSCRIPCION_LABELS,
  type DistribucionPorRama,
  type MedioPago,
  type TipoInscripcion,
} from '@/shared/domain';
import {
  AUTH_COPY,
  FILTER_COPY,
} from '@/features/inscripciones/constants/copy';

/** Medios de pago ofrecidos (sin saldo personal ni mixto, como Angular). */
export const MEDIO_PAGO_OPTIONS: readonly {
  readonly value: MedioPago;
  readonly label: string;
}[] = [
  { value: MEDIO_PAGO.EFECTIVO, label: MEDIO_PAGO_LABELS.efectivo },
  { value: MEDIO_PAGO.TRANSFERENCIA, label: MEDIO_PAGO_LABELS.transferencia },
];

/** Marcadores de sección del form (01 Datos, 02 Importes, 03 Autorizaciones). */
export const SECTION_MARKERS = {
  DATOS: '01',
  IMPORTES: '02',
  AUTORIZACIONES: '03',
} as const;

/** Clave de rama en `porRama` del consolidado (sin `total`). */
export type RamaKey = Exclude<keyof DistribucionPorRama, 'total'>;

export interface RamaConfig {
  readonly key: RamaKey;
  readonly label: string;
  /** Color de token (las ramas tienen el suyo; educadores usa el burgundy de identidad). */
  readonly color: string;
}

/** Orden y colores de Angular (`ramaConfigs`) mapeados a tokens de marca. */
export const RAMA_CONFIGS: readonly RamaConfig[] = [
  { key: 'manada', label: RAMA.MANADA, color: 'var(--color-rama-manada)' },
  { key: 'unidad', label: RAMA.UNIDAD, color: 'var(--color-rama-unidad)' },
  {
    key: 'caminantes',
    label: RAMA.CAMINANTES,
    color: 'var(--color-rama-caminantes)',
  },
  { key: 'rovers', label: RAMA.ROVERS, color: 'var(--color-rama-rovers)' },
  {
    key: 'educadores',
    label: FILTER_COPY.EDUCADORES,
    color: 'var(--color-accent-2)',
  },
];

export const DEFAULT_TIPO: TipoInscripcion = TIPO_INSCRIPCION.SCOUT_ARGENTINA;

export const TIPO_TABS: readonly {
  readonly value: TipoInscripcion;
  readonly label: string;
}[] = [
  {
    value: TIPO_INSCRIPCION.SCOUT_ARGENTINA,
    label: TIPO_INSCRIPCION_LABELS.scout_argentina,
  },
  { value: TIPO_INSCRIPCION.GRUPO, label: TIPO_INSCRIPCION_LABELS.grupo },
];

/** Opciones del select "Tipo" del form (orden de Angular: Grupo, Scout Argentina). */
export const TIPO_OPTIONS: readonly {
  readonly value: TipoInscripcion;
  readonly label: string;
}[] = [
  { value: TIPO_INSCRIPCION.GRUPO, label: TIPO_INSCRIPCION_LABELS.grupo },
  {
    value: TIPO_INSCRIPCION.SCOUT_ARGENTINA,
    label: TIPO_INSCRIPCION_LABELS.scout_argentina,
  },
];

export const TIPO_DEUDA_OPTIONS = [
  { value: TIPO_DEUDA.DINERO, label: FILTER_COPY.DEUDA_DINERO },
  { value: TIPO_DEUDA.DOCUMENTACION, label: FILTER_COPY.DEUDA_DOCUMENTACION },
  { value: TIPO_DEUDA.AMBOS, label: FILTER_COPY.DEUDA_AMBOS },
] as const;

export const RAMA_FILTER_OPTIONS = [
  { value: RAMA.MANADA, label: RAMA.MANADA },
  { value: RAMA.UNIDAD, label: RAMA.UNIDAD },
  { value: RAMA.CAMINANTES, label: RAMA.CAMINANTES },
  { value: RAMA.ROVERS, label: RAMA.ROVERS },
  { value: INSCRIPCIONES_RAMA_EDUCADOR, label: FILTER_COPY.EDUCADORES },
] as const;

/** Años ofrecidos en el filtro: año actual ± 1 (Angular). */
export const YEAR_SPAN = 1;

/** Query params que sincroniza la lista / dashboard. */
export const URL_PARAMS = {
  TIPO: 'tipo',
  ANO: 'ano',
  TIPO_DEUDA: 'tipoDeuda',
  RAMA: 'rama',
} as const;

/** Rango válido del año en el form (Angular: min 2000, max 2100). */
export const ANO_MIN = 2020;
export const ANO_MAX = 2100;

/** Monto mínimo de un pago editado (Angular: `Validators.min(1)`). */
export const MIN_PAGO_EDITADO = 1;

export const PERCENT = 100;

/** Las 5 autorizaciones de Scout Argentina, en el orden de Angular. */
export const AUTORIZACION_KEYS = [
  'declaracionDeSalud',
  'autorizacionDeImagen',
  'salidasCercanas',
  'autorizacionIngreso',
  'certificadoAptitudFisica',
] as const;

export type AutorizacionKey = (typeof AUTORIZACION_KEYS)[number];

export type Autorizaciones = Readonly<Record<AutorizacionKey, boolean>>;

export const EMPTY_AUTORIZACIONES: Autorizaciones = {
  declaracionDeSalud: false,
  autorizacionDeImagen: false,
  salidasCercanas: false,
  autorizacionIngreso: false,
  certificadoAptitudFisica: false,
};

export interface AutorizacionConfig {
  readonly key: AutorizacionKey;
  readonly label: string;
  readonly description: string;
  /** Label corto (detalle). */
  readonly short: string;
}

export const AUTORIZACIONES: readonly AutorizacionConfig[] = [
  {
    key: 'declaracionDeSalud',
    label: AUTH_COPY.SALUD,
    description: AUTH_COPY.SALUD_DESC,
    short: AUTH_COPY.SHORT_SALUD,
  },
  {
    key: 'autorizacionDeImagen',
    label: AUTH_COPY.IMAGEN,
    description: AUTH_COPY.IMAGEN_DESC,
    short: AUTH_COPY.SHORT_IMAGEN,
  },
  {
    key: 'salidasCercanas',
    label: AUTH_COPY.SALIDAS,
    description: AUTH_COPY.SALIDAS_DESC,
    short: AUTH_COPY.SHORT_SALIDAS,
  },
  {
    key: 'autorizacionIngreso',
    label: AUTH_COPY.INGRESO,
    description: AUTH_COPY.INGRESO_DESC,
    short: AUTH_COPY.SHORT_INGRESO,
  },
  {
    key: 'certificadoAptitudFisica',
    label: AUTH_COPY.APTITUD,
    description: AUTH_COPY.APTITUD_DESC,
    short: AUTH_COPY.SHORT_APTITUD,
  },
];
