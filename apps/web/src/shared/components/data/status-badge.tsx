import type { LucideIcon } from 'lucide-react';
import { createElement } from 'react';

import { humanize } from '@/shared/format';
import { cn } from '@/shared/lib/utils';

import {
  BADGE_TONE_CLASSES,
  resolveBadgeIcon,
  resolveBadgeTone,
  type BadgeTone,
} from './status-badge-config';

/** Ícono de lucide resuelto por estado (createElement: el componente viene de un mapa estático). */
const ICON_PROPS = { 'aria-hidden': true, className: 'size-[13px] shrink-0', strokeWidth: 2 } as const;

export interface StatusBadgeProps {
  /** Estado crudo del backend (`pagado`, `IN_PROGRESS`…): define tono, ícono y texto. */
  readonly status?: string;
  /** Texto visible (default: `status` humanizado en sentence case). */
  readonly label?: string;
  /** Fuerza el tono (si no, se resuelve con `resolveStatusTone`). */
  readonly tone?: BadgeTone;
  readonly icon?: LucideIcon;
  /** Sin ícono: solo para badges neutros/categoría (no estados). */
  readonly hideIcon?: boolean;
  readonly className?: string;
}

/** Badge rectangular 22px: fondo `-soft` + ícono + texto (DESIGN §Badge de estado). */
export function StatusBadge({
  status,
  label,
  tone,
  icon,
  hideIcon = false,
  className,
}: StatusBadgeProps) {
  const resolvedTone = tone ?? (status ? resolveBadgeTone(status) : 'neutral');
  const text = label ?? humanize(status, 'sentence');
  return (
    <span
      data-tone={resolvedTone}
      className={cn(
        'inline-flex h-[22px] items-center gap-[5px] rounded-sm pr-[7px] pl-1.5 text-xs leading-4 font-medium whitespace-nowrap',
        hideIcon && 'pl-[7px]',
        BADGE_TONE_CLASSES[resolvedTone],
        className,
      )}
    >
      {hideIcon ? null : createElement(icon ?? resolveBadgeIcon({ status, tone: resolvedTone }), ICON_PROPS)}
      {text}
    </span>
  );
}
