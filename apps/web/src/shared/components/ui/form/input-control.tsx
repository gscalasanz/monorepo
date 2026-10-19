'use client';

import type { ComponentProps, ReactNode } from 'react';

import { Input } from '@/shared/components/reui/input';
import {
  ControlStatusIcon,
  statusIconCount,
} from '@/shared/components/ui/form/control-status-icon';
import {
  CONTROL_SIZE,
  CONTROL_SURFACE,
  LEADING_PADDING,
  TRAILING_PADDING,
  type ControlSize,
} from '@/shared/components/ui/form/field-styles';
import { cn } from '@/shared/lib/utils';

type NativeInputProps = Omit<ComponentProps<'input'>, 'size' | 'prefix'>;

export interface InputControlProps extends NativeInputProps {
  readonly invalid?: boolean;
  readonly valid?: boolean;
  /** Adorno a la izquierda (no interactivo), p. ej. `$`. */
  readonly prefix?: ReactNode;
  /** Adorno interactivo a la derecha (p. ej. toggle de contraseña). */
  readonly suffix?: ReactNode;
  readonly size?: ControlSize;
}

/**
 * Input de marca sobre el `Input` de ReUI: contrato de tamaños/estados, check de
 * válido o candado de deshabilitado adentro, y slots de prefijo/sufijo.
 */
export function InputControl({
  invalid = false,
  valid = false,
  prefix,
  suffix,
  size = 'md',
  disabled,
  className,
  ...props
}: InputControlProps) {
  const status = { disabled, valid: valid && !invalid };
  const trailing = statusIconCount(status) + (suffix ? 1 : 0);

  return (
    <div className="relative w-full">
      {prefix && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-muted',
            size === 'lg' ? 'text-2xl font-semibold' : 'text-base md:text-sm',
          )}
        >
          {prefix}
        </span>
      )}
      <Input
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL_SURFACE,
          CONTROL_SIZE[size],
          prefix ? LEADING_PADDING[size] : undefined,
          TRAILING_PADDING[Math.min(trailing, TRAILING_PADDING.length - 1)],
          className,
        )}
        {...props}
      />
      {trailing > 0 && (
        <span className="absolute inset-y-0 right-2 flex items-center gap-1">
          <ControlStatusIcon {...status} />
          {suffix}
        </span>
      )}
    </div>
  );
}
