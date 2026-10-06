import { DirectionTile } from '@/shared/components/data';
import { TIPO_MOVIMIENTO_LABELS, type TipoMovimiento } from '@/shared/domain';
import { isIngreso } from '@/features/cajas/helpers/movimientos';

/** Tipo de movimiento: flecha + texto (el estado nunca solo por color). */
export function TipoMovimientoLabel({
  tipo,
}: {
  readonly tipo: TipoMovimiento;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink">
      <DirectionTile
        direction={isIngreso({ tipo }) ? 'in' : 'out'}
        decorative
      />
      {TIPO_MOVIMIENTO_LABELS[tipo]}
    </span>
  );
}
