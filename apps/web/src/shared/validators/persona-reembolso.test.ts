import {
  VALIDATION_MESSAGES,
  personaAReembolsarOnEstadoChange,
  personaAReembolsarOnResponsableChange,
  personaAReembolsarRequerida,
} from '@/shared/validators';

/** Port de persona-reembolso.validator.spec.ts como funciones puras. */
describe('persona a reembolsar', () => {
  it('pendiente_reembolso sin persona es inválido', () => {
    expect(
      personaAReembolsarRequerida({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: null,
      }),
    ).toBe(VALIDATION_MESSAGES.PERSONA_A_REEMBOLSAR);
  });

  it('con persona, o en otro estado, es válido', () => {
    expect(
      personaAReembolsarRequerida({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'p',
      }),
    ).toBeNull();
    expect(
      personaAReembolsarRequerida({
        estadoPago: 'pagado',
        personaAReembolsarId: null,
      }),
    ).toBeNull();
  });

  it('al pasar a pendiente_reembolso precarga el responsable', () => {
    expect(
      personaAReembolsarOnEstadoChange({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: null,
        responsableId: 'resp-1',
      }),
    ).toBe('resp-1');
  });

  it('respeta una persona ya cargada (edición)', () => {
    expect(
      personaAReembolsarOnEstadoChange({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'persona-1',
        responsableId: 'resp-1',
      }),
    ).toBe('persona-1');
  });

  it('al volver a pagado la limpia', () => {
    expect(
      personaAReembolsarOnEstadoChange({
        estadoPago: 'pagado',
        personaAReembolsarId: 'persona-1',
        responsableId: 'resp-1',
      }),
    ).toBeNull();
  });

  it('sigue al responsable si la persona no fue tocada', () => {
    expect(
      personaAReembolsarOnResponsableChange({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'resp-1',
        previousResponsableId: 'resp-1',
        responsableId: 'resp-2',
      }),
    ).toBe('resp-2');
  });

  it('precarga cuando el responsable se elige después del estado', () => {
    expect(
      personaAReembolsarOnResponsableChange({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: null,
        previousResponsableId: null,
        responsableId: 'resp-1',
      }),
    ).toBe('resp-1');
  });

  it('respeta la persona elegida a mano aunque cambie el responsable', () => {
    expect(
      personaAReembolsarOnResponsableChange({
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'otra',
        previousResponsableId: 'resp-1',
        responsableId: 'resp-2',
      }),
    ).toBe('otra');
  });

  it('fuera de pendiente_reembolso el responsable no la toca', () => {
    expect(
      personaAReembolsarOnResponsableChange({
        estadoPago: 'pagado',
        personaAReembolsarId: null,
        previousResponsableId: null,
        responsableId: 'resp-1',
      }),
    ).toBeNull();
  });
});
