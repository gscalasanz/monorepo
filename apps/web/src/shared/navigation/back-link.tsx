'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

import { useGoBack } from '@/shared/navigation/use-go-back';

export interface BackLinkProps {
  /** Destino si no hay historial interno (y `href` del <a> para abrir en pestaña nueva). */
  readonly fallbackHref: string;
  readonly children: ReactNode;
  readonly className?: string;
}

const isPlainLeftClick = (e: MouseEvent): boolean =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/** Link "Volver" que retrocede en el historial; con ctrl/cmd-click conserva el href de respaldo. */
export function BackLink({ fallbackHref, children, className }: BackLinkProps) {
  const goBack = useGoBack(fallbackHref);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(e)) return;
    e.preventDefault();
    goBack();
  };
  return (
    <Link href={fallbackHref} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
