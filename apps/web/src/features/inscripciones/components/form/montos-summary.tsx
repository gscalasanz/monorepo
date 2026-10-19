import { CircleAlert } from 'lucide-react';
import { Fragment } from 'react';

import { Money } from '@/shared/components/data';
import { cn } from '@/shared/lib/utils';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';

interface MontosSummaryProps {
  readonly total: number;
  readonly saldoPersonal: number;
  readonly bonificacion: number;
  readonly aPagar: number;
  readonly exceden: boolean;
}

interface Part {
  readonly label: string;
  readonly amount: number;
  /** Operador que precede al ítem. */
  readonly operator?: string;
  readonly result?: boolean;
}

const MINUS = '−';
const EQUALS = '=';

function parts({
  total,
  saldoPersonal,
  bonificacion,
  aPagar,
}: MontosSummaryProps): readonly Part[] {
  return [
    { label: C.TOTAL, amount: total },
    ...(saldoPersonal > 0
      ? [{ label: C.SALDO_PERSONAL, amount: saldoPersonal, operator: MINUS }]
      : []),
    ...(bonificacion > 0
      ? [{ label: C.BONIFICACION, amount: bonificacion, operator: MINUS }]
      : []),
    { label: C.A_PAGAR, amount: aPagar, operator: EQUALS, result: true },
  ];
}

/** Total − Saldo Personal − Bonificación = A pagar (+ error si la suma supera el total). */
export function MontosSummary(props: MontosSummaryProps) {
  return (
    <div className="grid gap-2">
      {props.exceden ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {C.MONTOS_EXCEDEN}
        </p>
      ) : null}
      <div
        aria-label={C.SUMMARY_LABEL}
        aria-live="polite"
        className={cn(
          'flex flex-wrap items-end gap-x-4 gap-y-2 rounded-lg bg-recessed px-3 py-2.5',
          props.exceden && 'ring-1 ring-danger',
        )}
      >
        {parts(props).map((part) => (
          <Fragment key={part.label}>
            {part.operator ? (
              <span aria-hidden className="pb-0.5 text-ink-subtle">
                {part.operator}
              </span>
            ) : null}
            <span className="grid">
              <span className="text-xs text-ink-subtle">{part.label}</span>
              <Money
                amount={part.amount}
                className={cn(
                  'text-sm',
                  part.result ? 'font-semibold text-ink' : 'font-medium',
                )}
              />
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
