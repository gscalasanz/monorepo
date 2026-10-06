'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { useRef } from 'react';

import { cn } from '@/shared/lib/utils';

export interface SegmentedTabItem<TValue extends string = string> {
  readonly value: TValue;
  readonly label: ReactNode;
  readonly icon?: ReactNode;
  /** Contador opcional (ej. cantidad por rama). */
  readonly count?: number;
  readonly disabled?: boolean;
}

export interface SegmentedTabsProps<TValue extends string = string> {
  readonly items: readonly SegmentedTabItem<TValue>[];
  readonly value: TValue;
  readonly onValueChange: (value: TValue) => void;
  /** Nombre accesible del grupo. */
  readonly ariaLabel: string;
  /**
   * `tabs` (default) = `role="tablist"` (cambia de vista; pasá `getPanelId`).
   * `toggle` = grupo de botones `aria-pressed` (filtros como Todos/Ingresos/Egresos).
   */
  readonly semantics?: 'tabs' | 'toggle';
  /** Id del panel que controla cada tab (`aria-controls`). */
  readonly getPanelId?: (value: TValue) => string;
  readonly className?: string;
}

const NEXT_KEYS: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

function nextEnabledIndex<TValue extends string>(params: {
  readonly items: readonly SegmentedTabItem<TValue>[];
  readonly from: number;
  readonly step: number;
}): number {
  const { items, from, step } = params;
  for (let offset = 1; offset <= items.length; offset += 1) {
    const index = (from + step * offset + items.length) % items.length;
    if (!items[index]?.disabled) return index;
  }
  return from;
}

/** Tab que recibe `tabIndex=0`: el seleccionado o, si no hay match, el primero habilitado. */
function resolveTabStop<TValue extends string>(
  items: readonly SegmentedTabItem<TValue>[],
  value: TValue,
): TValue | undefined {
  const selected = items.find((item) => item.value === value && !item.disabled);
  return (selected ?? items.find((item) => !item.disabled))?.value;
}

/**
 * Control segmentado (equivale a `button-tabs` de Angular y al `.seg` del mockup).
 * Navegación con flechas + activación automática; foco roving.
 */
export function SegmentedTabs<TValue extends string = string>({
  items,
  value,
  onValueChange,
  ariaLabel,
  semantics = 'tabs',
  getPanelId,
  className,
}: SegmentedTabsProps<TValue>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const isTabs = semantics === 'tabs';
  const tabStopValue = resolveTabStop(items, value);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = NEXT_KEYS[event.key];
    if (!isTabs || step === undefined) return;
    event.preventDefault();
    const target = nextEnabledIndex({ items, from: index, step });
    const item = items[target];
    if (!item) return;
    refs.current[target]?.focus();
    onValueChange(item.value);
  };

  return (
    <div
      role={isTabs ? 'tablist' : 'group'}
      aria-label={ariaLabel}
      className={cn('inline-flex max-w-full overflow-x-auto rounded-md bg-recessed p-0.5 ring-1 ring-border ring-inset', className)}
    >
      {items.map((item, index) => (
        <SegmentButton
          key={item.value}
          item={item}
          selected={item.value === value}
          tabStop={item.value === tabStopValue}
          isTabs={isTabs}
          panelId={getPanelId?.(item.value)}
          buttonRef={(node) => { refs.current[index] = node; }}
          onSelect={() => onValueChange(item.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  );
}

interface SegmentButtonProps<TValue extends string> {
  readonly item: SegmentedTabItem<TValue>;
  readonly selected: boolean;
  /** Único tab con `tabIndex=0` en el roving focus. */
  readonly tabStop: boolean;
  readonly isTabs: boolean;
  readonly panelId?: string;
  readonly buttonRef: (node: HTMLButtonElement | null) => void;
  readonly onSelect: () => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

function SegmentButton<TValue extends string>({
  item,
  selected,
  tabStop,
  isTabs,
  panelId,
  buttonRef,
  onSelect,
  onKeyDown,
}: SegmentButtonProps<TValue>) {
  return (
    <button
      ref={buttonRef}
      type="button"
      role={isTabs ? 'tab' : undefined}
      aria-selected={isTabs ? selected : undefined}
      aria-pressed={isTabs ? undefined : selected}
      aria-controls={panelId}
      tabIndex={isTabs && !tabStop ? -1 : 0}
      disabled={item.disabled}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm px-3 text-sm font-medium whitespace-nowrap text-ink-muted transition-colors md:h-7 md:px-2.5 md:text-xs',
        'hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-45',
        selected && 'bg-surface-raised text-ink shadow-sm',
      )}
    >
      {item.icon}
      {item.label}
      {item.count === undefined ? null : (
        <span className="text-ink-subtle tabular-nums">{item.count}</span>
      )}
    </button>
  );
}

/** Alias de paridad con `app-button-tabs` de Angular. */
export const ButtonTabs = SegmentedTabs;
