'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';

import { Button, type ButtonProps } from '@/shared/components/ui/button';

export interface LinkButtonProps extends Omit<
  ButtonProps,
  'render' | 'nativeButton' | 'onClick'
> {
  readonly href: string;
  /** Para links dentro de filas clickeables (no dispara el click de la fila). */
  readonly stopPropagation?: boolean;
}

/** Navegación con aspecto de botón (es un `<a>` real: abre en pestaña nueva, etc.). */
export function LinkButton({
  href,
  stopPropagation = false,
  ...props
}: LinkButtonProps) {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (stopPropagation) event.stopPropagation();
  };
  return (
    <Button
      {...props}
      nativeButton={false}
      // Base UI marca `role="button"` sin botón nativo: acá es navegación real.
      role="link"
      render={<Link href={href} />}
      onClick={handleClick}
    />
  );
}
