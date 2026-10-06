import { RadioGroupItem } from '@/shared/components/reui/radio-group';
import type { FieldOption } from '@/shared/components/ui/form/types';
import { cn } from '@/shared/lib/utils';

export interface RadioCardProps {
  readonly id: string;
  readonly option: FieldOption;
  readonly invalid?: boolean;
}

const CARD_CLASSES =
  'flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border-strong bg-surface p-3 transition-colors ' +
  'hover:bg-recessed has-data-checked:border-brand has-data-checked:bg-brand-soft ' +
  'has-focus-visible:ring-3 has-focus-visible:ring-focus/25 ' +
  'has-data-disabled:cursor-not-allowed has-data-disabled:border-border has-data-disabled:bg-recessed';

const RADIO_CLASSES =
  'mt-0.5 size-5 border-border-strong bg-surface focus-visible:ring-0 md:size-4 dark:bg-surface ' +
  'data-checked:border-brand data-checked:bg-brand dark:data-checked:bg-brand';

/** Una tarjeta de `RadioCardsField`: radio + título + descripción. */
export function RadioCard({ id, option, invalid = false }: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(CARD_CLASSES, invalid && 'border-danger')}
    >
      <RadioGroupItem
        id={id}
        value={option.value}
        disabled={option.disabled}
        className={RADIO_CLASSES}
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-base font-medium text-ink md:text-sm">
          {option.label}
        </span>
        {option.description && (
          <span className="text-[13px] text-ink-muted">
            {option.description}
          </span>
        )}
      </span>
    </label>
  );
}
