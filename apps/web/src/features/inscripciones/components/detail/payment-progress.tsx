import type { Inscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  progressPercent,
  progressTone,
  type ProgressTone,
} from '@/features/inscripciones/helpers/detail';
import {
  ProgressMeter,
  type MeterTone,
} from '@/features/inscripciones/components/shared/progress-meter';

const TONE: Readonly<Record<ProgressTone, MeterTone>> = {
  success: 'success',
  partial: 'warning',
  pending: 'danger',
};

/** Barra "N% completado" + cantidad de pagos. */
export function PaymentProgress({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  const percent = progressPercent(inscripcion);
  const pagos = inscripcion.movimientos.length;
  return (
    <div className="grid gap-1.5">
      <ProgressMeter
        value={percent}
        tone={TONE[progressTone(inscripcion)]}
        label={C.progressLabel(percent)}
      />
      <div className="flex justify-between text-xs text-ink-subtle">
        <span>{C.progress(percent)}</span>
        {pagos > 0 ? <span>{C.pagosCount(pagos)}</span> : null}
      </div>
    </div>
  );
}
