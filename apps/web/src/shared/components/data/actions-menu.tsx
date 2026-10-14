'use client';

import { ChevronDown, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { createElement } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/reui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

export interface ActionLink {
  readonly key: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: LucideIcon;
}

export interface ActionsMenuProps {
  /** Texto del botón ("Acciones"). */
  readonly label: string;
  readonly items: readonly ActionLink[];
  /** `primary` = CTA principal de la vista (color de marca). */
  readonly variant?: 'primary' | 'secondary';
  readonly className?: string;
}

const TRIGGER_BASE =
  'inline-flex h-11 items-center gap-1.5 rounded-md px-4 text-[15px] font-medium ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:h-[38px] md:px-3.5 md:text-sm';

const TRIGGER_VARIANTS = {
  primary: 'bg-brand text-on-brand hover:bg-brand-hover data-popup-open:bg-brand-hover',
  secondary: 'border border-border-strong bg-surface text-ink hover:bg-recessed data-popup-open:bg-recessed',
} as const;

const ITEM_CLASSES = 'min-h-11 cursor-pointer gap-2 px-2 text-sm text-ink md:min-h-9';
const ICON_PROPS = { 'aria-hidden': true, className: 'size-4 text-ink-subtle' } as const;

/** Botón con menú de accesos directos (cada opción es un link real: abre en pestaña nueva, etc.). */
export function ActionsMenu({ label, items, variant = 'secondary', className }: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(TRIGGER_BASE, TRIGGER_VARIANTS[variant], className)}>
        {label}
        <ChevronDown aria-hidden className={cn('size-4', variant === 'secondary' && 'text-ink-subtle')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-48 bg-surface-raised">
        {items.map((item) => (
          <DropdownMenuItem key={item.key} render={<Link href={item.href} />} className={ITEM_CLASSES}>
            {item.icon ? createElement(item.icon, ICON_PROPS) : null}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
