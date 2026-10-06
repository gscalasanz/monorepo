import { STATUS_TONE, resolveStatusTone } from '@/shared/format';

describe('resolveStatusTone (datos de StatusConfigService, sin estilos)', () => {
  it.each([
    ['activo', STATUS_TONE.SUCCESS],
    ['deshabilitado', STATUS_TONE.DANGER],
    ['pagado', STATUS_TONE.SUCCESS],
    ['pendiente', STATUS_TONE.WARNING],
    ['en curso', STATUS_TONE.INFO],
    ['vencido', STATUS_TONE.DANGER],
    ['IN_PROGRESS', STATUS_TONE.INFO],
    ['in_progress', STATUS_TONE.INFO],
    ['  Pagado ', STATUS_TONE.SUCCESS],
    ['CANCELLED', STATUS_TONE.DANGER],
  ])('%s → %s', (status, tone) => {
    expect(resolveStatusTone(status)).toBe(tone);
  });

  it.each([null, undefined, '', 'parcial', 'desconocido'])(
    '%s → default',
    (status) => {
      expect(resolveStatusTone(status)).toBe(STATUS_TONE.DEFAULT);
    },
  );
});
