import { cn } from '@/shared/lib/utils';
import { TreasurySummary } from '@/features/dashboard/components/treasury-summary';
import type { MonthFlow } from '@/features/dashboard/helpers/cash-flow';
import type { TreasuryModel } from '@/features/dashboard/helpers/view-model';

export interface TreasuryPanelProps {
  readonly treasury: TreasuryModel;
  readonly currentMonth: MonthFlow | undefined;
  readonly className?: string;
}

/** Panel protagonista (DESIGN §Panel "Dinero del grupo"): la cifra y de dónde sale. */
export function TreasuryPanel({ treasury, currentMonth, className }: TreasuryPanelProps) {
  return (
    <div className={cn('min-w-0 rounded-xl border border-border bg-surface shadow-xs', className)}>
      <TreasurySummary treasury={treasury} currentMonth={currentMonth} />
    </div>
  );
}
