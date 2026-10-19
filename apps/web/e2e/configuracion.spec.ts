import { expect, test } from '@playwright/test';

import { loginAsAdmin } from './support/auth';

test.describe('configuración', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('guarda los montos de inscripción en el navegador', async ({ page }) => {
    await page.goto('/configuracion');
    await expect(page.getByRole('heading', { level: 1, name: 'Configuración' })).toBeVisible();
    const grupo = page.getByLabel(/Monto Inscripción de Grupo/);
    await grupo.fill('1234');
    await page.getByRole('button', { name: 'Guardar', exact: true }).click();
    await expect(page.getByText('Configuración guardada exitosamente')).toBeVisible();
    await page.reload();
    await expect(page.getByLabel(/Monto Inscripción de Grupo/)).toHaveValue(/1\.?234/);
  });

  test('descarga la exportación a Excel', async ({ page }) => {
    await page.goto('/configuracion');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exportar a Excel/ }).click();
    expect((await download).suggestedFilename()).toBe('scout-export.xlsx');
    await expect(page.getByText('Exportación descargada')).toBeVisible();
  });
});
