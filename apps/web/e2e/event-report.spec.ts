import { expect, test, type APIRequestContext } from '@playwright/test';

import { apiClientFor, apiLogin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

const EVENT_DATE = '2026-05-25';

/** Evento de venta sin productos: el reporte sale con todas las secciones vacías. */
async function createEvento(
  api: APIRequestContext,
  nombre: string,
): Promise<string> {
  const response = await api.post('eventos', {
    data: {
      nombre,
      fecha: EVENT_DATE,
      tipo: 'venta',
      destinoGanancia: 'caja_grupo',
    },
  });
  expect(response.ok()).toBeTruthy();
  return ((await response.json()) as { id: string }).id;
}

/** El backend sirve `GET /eventos/:id/reporte/publico` solo con `reportePublico = true`. */
async function setReportePublico(
  api: APIRequestContext,
  eventoId: string,
  reportePublico: boolean,
) {
  const response = await api.patch(`eventos/${eventoId}/reporte-publico`, {
    data: { reportePublico },
  });
  expect(response.ok()).toBeTruthy();
}

test.describe('reporte público de evento', () => {
  let api: APIRequestContext;
  let eventoId = '';
  const nombre = `${E2E_PREFIX}Reporte ${uniqueSuffix()}`;

  test.beforeEach(async () => {
    api = await apiClientFor(await apiLogin());
    eventoId = await createEvento(api, nombre);
  });

  test.afterEach(async () => {
    if (eventoId) await api.delete(`eventos/${eventoId}`);
    await api.dispose();
  });

  test('con sesión ve el reporte; anónimo solo si es público', async ({
    page,
    browser,
  }) => {
    const tokens = await apiLogin();
    await page.addInitScript((t) => {
      window.localStorage.setItem('accessToken', t.accessToken);
      window.localStorage.setItem('refreshToken', t.refreshToken);
    }, tokens);
    await page.goto(`/eventos/${eventoId}/reporte`);
    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    await expect(
      page.getByText('Reporte de evento · Grupo Scout'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Volver al evento' }),
    ).toHaveAttribute('href', `/eventos/${eventoId}`);
    await expect(
      page.getByRole('heading', { level: 2, name: /^Egresos del evento/ }),
    ).toBeVisible();

    // Anónimo (contexto nuevo, sin tokens) y reporte NO público → "no disponible", sin toast.
    const anonContext = await browser.newContext();
    const anon = await anonContext.newPage();
    await anon.goto(`/eventos/${eventoId}/reporte`);
    await expect(
      anon.getByRole('heading', { name: 'Reporte no disponible' }),
    ).toBeVisible();
    await expect(
      anon.getByRole('link', { name: 'Iniciar sesión' }),
    ).toHaveAttribute('href', '/login');
    await expect(
      anon.getByRole('link', { name: 'Volver al evento' }),
    ).toHaveCount(0);

    // Se hace público → el anónimo lo ve, sin "Volver al evento".
    await setReportePublico(api, eventoId, true);
    await anon.reload();
    await expect(
      anon.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    await expect(
      anon.getByRole('heading', { level: 2, name: /^Integridad de datos/ }),
    ).toBeVisible();
    await expect(
      anon.getByRole('link', { name: 'Volver al evento' }),
    ).toHaveCount(0);
    await expect(anon).toHaveURL(new RegExp(`/eventos/${eventoId}/reporte$`));
    await anonContext.close();
  });
});
