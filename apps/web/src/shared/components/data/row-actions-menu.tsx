'use client';

import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { createElement } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/reui/dropdown-menu';
import { cn } from '@/shared/lib/utils';

export interface RowAction {
  readonly key: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  /** Texto de ayuda (equivale al tooltip de la acción en Angular). */
  readonly description?: string;
  readonly destructive?: boolean;
  readonly onSelect: () => void;
}

export interface RowActionsMenuProps {
  readonly actions: readonly RowAction[];
  /** Nombre accesible del botón ("Acciones para Juan Pérez"). */
  readonly ariaLabel: string;
  readonly className?: string;
}

const TRIGGER_CLASSES =
  'inline-flex size-11 items-center justify-center rounded-md text-ink-muted hover:bg-recessed hover:text-ink ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:size-8 ' +
  'data-popup-open:bg-recessed data-popup-open:text-ink';

const ITEM_CLASSES =
  'min-h-11 cursor-pointer gap-2 px-2 text-sm text-ink md:min-h-9';

const ICON_PROPS = {
  'aria-hidden': true,
  className: 'size-4 text-ink-subtle',
} as const;

/**
 * Menú "⋯" de acciones por fila (equivale a la columna `action` de la tabla de
 * Angular). Accesible con teclado (Base UI Menu); targets ≥44px en mobile.
 */
export function RowActionsMenu({
  actions,
  ariaLabel,
  className,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(TRIGGER_CLASSES, className)}
      >
        <MoreHorizontal aria-hidden className="size-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-auto min-w-44 bg-surface-raised"
      >
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.key}
            title={action.description}
            variant={action.destructive ? 'destructive' : 'default'}
            onClick={action.onSelect}
            className={cn(ITEM_CLASSES, action.destructive && 'text-danger')}
          >
            {action.icon ? createElement(action.icon, ICON_PROPS) : null}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
