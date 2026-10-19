'use client';

import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Button as ReuiButton } from '@/shared/components/reui/button';
import { cn } from '@/shared/lib/utils';

/**
 * Botón de marca sobre el `Button` de ReUI. Alturas del contrato (DESIGN.md
 * §Formularios): 38px desktop, 44px mobile (touch). `loading` deshabilita y
 * muestra spinner sin cambiar el ancho del texto.
 */
const VARIANT_CLASSES = {
  primary: 'bg-brand text-on-brand hover:bg-brand-hover',
  secondary: 'border-border-strong bg-surface text-ink hover:bg-recessed',
  ghost: 'bg-transparent text-ink-muted hover:bg-recessed hover:text-ink',
  danger: 'bg-danger text-on-brand hover:bg-danger/90',
  'danger-soft': 'bg-danger-soft text-danger hover:bg-danger-soft/70',
  link: 'h-auto bg-transparent px-0 text-brand underline-offset-4 hover:underline',
} as const;

const SIZE_CLASSES = {
  md: 'h-11 px-4 text-[15px] md:h-[38px] md:px-3.5 md:text-sm',
  sm: 'h-10 px-3 text-sm md:h-8 md:px-2.5 md:text-[13px]',
  icon: 'size-11 md:size-[38px]',
  'icon-sm': 'size-10 md:size-8',
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;
export type ButtonSize = keyof typeof SIZE_CLASSES;

type ReuiButtonProps = Omit<ComponentProps<typeof ReuiButton>, 'variant' | 'size'>;

export interface ButtonProps extends ReuiButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <ReuiButton
      variant={variant === 'secondary' ? 'outline' : 'default'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'rounded-md font-medium',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : icon}
      {children}
    </ReuiButton>
  );
}
