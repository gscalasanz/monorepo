import { Money } from '@/shared/components/data';
import { paidRatio } from '@/features/personas/helpers/ficha';
import { ProgressBar } from '@/features/personas/components/ficha/progress-bar';

export interface DeudaBreakdownRowProps {
  readonly label: string;
  readonly amount: number;
  /** Deuda total: la barra muestra la proporción de esta parte. */
  readonly total: number;
}

/** Parte de la deuda total (inscripciones / campamentos) con su barra proporcional. */
export function DeudaBreakdownRow({
  label,
  amount,
  total,
}: DeudaBreakdownRowProps) {
  return (
    <li className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-3 text-[13px] text-ink-muted">
        {label}
        <Money
          amount={amount}
          tone={amount > 0 ? 'debt' : undefined}
          className="text-sm"
        />
      </span>
      <ProgressBar
        ratio={total > 0 ? paidRatio({ pagado: amount, total }) : 0}
        fillClassName="bg-danger"
      />
    </li>
  );
}
