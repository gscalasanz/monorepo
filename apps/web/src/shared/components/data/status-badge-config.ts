import {
  Check,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Clock,
  Gift,
  Info,
  OctagonAlert,
  Undo2,
  type LucideIcon,
} from 'lucide-react';

import { STATUS_TONE, resolveStatusTone, type StatusTone } from '@/shared/format';

export const BADGE_TONE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  NEUTRAL: 'neutral',
  BRAND: 'brand',
} as const;

export type BadgeTone = (typeof BADGE_TONE)[keyof typeof BADGE_TONE];

export const BADGE_TONE_CLASSES: Readonly<Record<BadgeTone, string>> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-recessed text-ink-muted',
  brand: 'bg-brand-soft text-brand',
};

const TONE_FROM_STATUS: Readonly<Record<StatusTone, BadgeTone>> = {
  [STATUS_TONE.SUCCESS]: BADGE_TONE.SUCCESS,
  [STATUS_TONE.WARNING]: BADGE_TONE.WARNING,
  [STATUS_TONE.DANGER]: BADGE_TONE.DANGER,
  [STATUS_TONE.INFO]: BADGE_TONE.INFO,
  [STATUS_TONE.DEFAULT]: BADGE_TONE.NEUTRAL,
};

/** Estados de pago de DESIGN §Badge que `resolveStatusTone` no conoce. */
const DESIGN_STATUS_TONES: Readonly<Record<string, BadgeTone>> = {
  parcial: BADGE_TONE.WARNING,
  bonificado: BADGE_TONE.INFO,
  'a reembolsar': BADGE_TONE.INFO,
  'a cobrar': BADGE_TONE.WARNING,
};

/** Ícono por estado conocido (DESIGN §Badge: nunca solo color). */
const STATUS_ICONS: Readonly<Record<string, LucideIcon>> = {
  pagado: Check,
  pagada: Check,
  parcial: CircleDashed,
  pendiente: Clock,
  vencido: Clock,
  'a cobrar': Clock,
  bonificado: Gift,
  'a reembolsar': Undo2,
  'en curso': CircleDot,
};

const TONE_ICONS: Readonly<Record<BadgeTone, LucideIcon>> = {
  success: CircleCheck,
  warning: CircleDashed,
  danger: OctagonAlert,
  info: Info,
  neutral: CircleDot,
  brand: CircleDot,
};

export function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[_-]+/g, ' ');
}

export function resolveBadgeTone(status: string): BadgeTone {
  const key = normalizeStatus(status);
  return DESIGN_STATUS_TONES[key] ?? TONE_FROM_STATUS[resolveStatusTone(key)];
}

export function resolveBadgeIcon(params: {
  readonly status?: string;
  readonly tone: BadgeTone;
}): LucideIcon {
  const known = params.status ? STATUS_ICONS[normalizeStatus(params.status)] : undefined;
  return known ?? TONE_ICONS[params.tone];
}
