import { expect, test } from '@playwright/test';

import { loginAsAdmin } from './support/auth';

test.describe('dashboard', () => {
  test('muestra saldos, accesos y listas', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    const kpis = page.getByLabel('Saldos del grupo');
    for (const label of ['Caja de Grupo', 'Fondos de Rama', 'Cuentas Personales', 'Fondo Solidario']) {
      await expect(kpis.getByText(label)).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Movimientos Recientes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fondos por Rama' })).toBeVisible();
    await page.getByRole('link', { name: 'Ver más' }).click();
    await expect(page).toHaveURL(/\/movimientos$/);
  });
});
