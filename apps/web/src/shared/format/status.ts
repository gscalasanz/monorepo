/**
 * Estado → tono semántico (solo los datos de `StatusConfigService`; los
 * colores los define el design system a partir del tono).
 */
export const STATUS_TONE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
  DEFAULT: 'default',
} as const;

export type StatusTone = (typeof STATUS_TONE)[keyof typeof STATUS_TONE];

const { SUCCESS, INFO, WARNING, DANGER } = STATUS_TONE;

/** Claves en minúscula (se normaliza antes de buscar). */
const STATUS_TONES: Readonly<Record<string, StatusTone>> = {
  activo: SUCCESS,
  deshabilitado: DANGER,
  completado: SUCCESS,
  confirmado: SUCCESS,
  aprobado: SUCCESS,
  pagado: SUCCESS,
  pendiente: WARNING,
  'en progreso': INFO,
  'en curso': INFO,
  programado: INFO,
  cancelado: DANGER,
  rechazado: DANGER,
  error: DANGER,
  vencido: DANGER,
  active: SUCCESS,
  completed: SUCCESS,
  confirmed: SUCCESS,
  approved: SUCCESS,
  paid: SUCCESS,
  pending: WARNING,
  'in progress': INFO,
  in_progress: INFO,
  scheduled: INFO,
  cancelled: DANGER,
  canceled: DANGER,
  rejected: DANGER,
  expired: DANGER,
};

export function resolveStatusTone(
  status: string | null | undefined,
): StatusTone {
  if (!status) return STATUS_TONE.DEFAULT;
  return STATUS_TONES[status.toLowerCase().trim()] ?? STATUS_TONE.DEFAULT;
}
