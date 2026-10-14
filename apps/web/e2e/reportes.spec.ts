import { expect, test, type APIRequestContext } from '@playwright/test';

import { apiClientFor, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

/** Protagonista sin documentación: aparece en el reporte como deuda de docs. */
async function createProtagonista(
  api: APIRequestContext,
  nombre: string,
): Promise<string> {
  const response = await api.post('personas/protagonistas', {
    data: { nombre, rama: 'Manada' },
  });
  expect(response.ok()).toBeTruthy();
  return ((await response.json()) as { id: string }).id;
}

test.describe('reportes', () => {
  let api: APIRequestContext;
  let personaId = '';
  const nombre = `${E2E_PREFIX}Deudor ${uniqueSuffix()}`;

  test.beforeEach(async ({ page }) => {
    const tokens = await loginAsAdmin(page);
    api = await apiClientFor(tokens);
    personaId = await createProtagonista(api, nombre);
  });

  test.afterEach(async () => {
    if (personaId) await api.delete(`personas/${personaId}`);
    await api.dispose();
  });

  test('deudas: filtra por rama, expande el detalle y enlaza a la ficha', async ({
    page,
  }) => {
    await page.goto('/reportes');
    await expect(page).toHaveURL(/\/reportes\/deudas$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Reportes' }),
    ).toBeVisible();
    await expect(page.getByLabel('Resumen de deudas')).toBeVisible();

    await page.getByRole('button', { name: /^Rama/ }).first().click();
    await page
      .getByRole('group', { name: 'Rama' })
      .getByRole('button', { name: 'Manada' })
      .click();
    await expect(page).toHaveURL(/\/reportes\/deudas$/);

    await page
      .getByRole('button', { name: `Ver detalle de ${nombre}` })
      .click();
    await expect(
      page.getByText('Documentación', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Partida nac.')).toBeVisible();
    await expect(
      page.getByRole('link', { name: nombre, exact: true }),
    ).toHaveAttribute('href', `/personas/protagonistas/${personaId}`);
    await expect(
      page.getByRole('link', { name: `Ver ficha de ${nombre}` }),
    ).toHaveAttribute('href', `/personas/protagonistas/${personaId}`);
  });

  test('placeholders heredados y ruta desconocida', async ({ page }) => {
    await page.goto('/reportes/caja');
    await expect(page.getByText('Reporte de Caja')).toBeVisible();
    await page.goto('/reportes/inexistente');
    await expect(page.locator('#not-found-title')).toBeVisible();
  });
});
