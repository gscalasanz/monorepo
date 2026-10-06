import { createSingleFlight } from '@/shared/auth';

describe('createSingleFlight (cola de refresh)', () => {
  it('N llamadas concurrentes comparten UNA ejecución', async () => {
    let resolve: (value: string) => void = () => undefined;
    const task = vi.fn(() => new Promise<string>((r) => (resolve = r)));
    const run = createSingleFlight(task);
    const results = Promise.all([run(), run(), run()]);
    resolve('token');
    await expect(results).resolves.toEqual(['token', 'token', 'token']);
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('si falla, rechaza a todas las que esperaban (no quedan colgadas)', async () => {
    const run = createSingleFlight(async () => {
      throw new Error('refresh falló');
    });
    await expect(Promise.all([run(), run()])).rejects.toThrow('refresh falló');
  });

  it('terminada una ejecución, la próxima llamada arranca otra', async () => {
    const task = vi.fn(async () => 'x');
    const run = createSingleFlight(task);
    await run();
    await run();
    expect(task).toHaveBeenCalledTimes(2);
  });
});
