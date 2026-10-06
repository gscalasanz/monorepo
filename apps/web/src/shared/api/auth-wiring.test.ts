/**
 * Invariante: usar `apiClient` desde cualquier lado adjunta el token. Este
 * archivo importa SOLO `@/shared/api` (vitest aísla módulos por archivo).
 */
import { z } from 'zod';

import { apiClient, getRegisteredAuthBridge } from '@/shared/api';
import { createFakeFetch } from '@/shared/api/testing/fake-fetch';

describe('cableado de auth al importar solo @/shared/api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('el AuthBridge de la sesión queda registrado', () => {
    expect(getRegisteredAuthBridge()).not.toBeNull();
  });

  it('apiClient adjunta el access token guardado', async () => {
    localStorage.setItem('accessToken', 'tok');
    const fake = createFakeFetch();
    vi.stubGlobal('fetch', fake.fetchFn);
    fake.reply({ status: 200, body: { ok: true } });
    await apiClient.get('eventos', { schema: z.object({ ok: z.boolean() }) });
    expect(fake.requests[0]?.headers.authorization).toBe('Bearer tok');
  });
});
