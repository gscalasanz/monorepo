'use client';

import { Info } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/reui/popover';

export interface InfoHintProps {
  /** Nombre de lo que se explica (da el nombre accesible del botón). */
  readonly label: string;
  /** Qué representa el dato. */
  readonly text: string;
}

const HINT_COPY = {
  trigger: (label: string): string => `Qué significa ${label}`,
} as const;

/**
 * ⓘ que explica un dato: se abre con hover (desktop), tap (mobile) o teclado.
 * Es un Popover y no un Tooltip porque el tooltip no existe en táctil.
 */
export function InfoHint({ label, text }: InfoHintProps) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={150}
        aria-label={HINT_COPY.trigger(label)}
        className="relative z-10 inline-flex size-[18px] cursor-help items-center justify-center rounded-full text-ink-subtle hover:bg-recessed hover:text-ink focus-visible:outline-2 focus-visible:outline-focus"
      >
        <Info aria-hidden className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-64 text-[13px] leading-[18px] text-ink"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}
