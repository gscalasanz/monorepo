import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

/** Mismas alturas y colores que `Button` (DESIGN §Formularios), pero navega. */
const VARIANT_CLASSES = {
  primary: 'bg-brand text-on-brand hover:bg-brand-hover',
  secondary:
    'border border-border-strong bg-surface text-ink hover:bg-recessed',
} as const;

const SIZE_CLASSES = {
  md: 'h-11 px-4 text-[15px] md:h-[38px] md:px-3.5 md:text-sm',
  sm: 'h-10 px-3 text-sm md:h-8 md:px-2.5 md:text-[13px]',
} as const;

export interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly icon?: ReactNode;
  readonly variant?: keyof typeof VARIANT_CLASSES;
  readonly size?: keyof typeof SIZE_CLASSES;
  readonly className?: string;
}

/** Link con apariencia de botón (navegación, no acción). */
export function ButtonLink({
  href,
  children,
  icon,
  variant = 'primary',
  size = 'md',
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&_svg]:size-4',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
