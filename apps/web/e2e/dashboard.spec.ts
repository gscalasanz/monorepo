import { expect, test } from '@playwright/test';

import { loginAsAdmin } from './support/auth';

test.describe('dashboard', () => {
  test('muestra el dinero del grupo, las métricas y las listas', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await expect(
      page.getByRole('heading', { level: 1, name: /^(Buen día|Buenas tardes|Buenas noches)/ }),
    ).toBeVisible();
    const saldos = page.getByLabel('Saldos del grupo');
    for (const label of ['Caja de Grupo', 'Fondos de Rama', 'Cuentas Personales', 'Fondo Solidario']) {
      await expect(saldos.getByText(label)).toBeVisible();
    }
    await expect(page.getByLabel('Resumen del mes').getByText('Deuda a cobrar')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Últimos movimientos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fondos de rama' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Deudores' })).toBeVisible();
    await expect(page.getByRole('img', { name: /^Saldo del grupo de/ })).toBeVisible();
  });

  test('los accesos rápidos están en el menú Acciones', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Acciones' }).click();
    await page.getByRole('menuitem', { name: 'Nuevo movimiento' }).click();
    await expect(page).toHaveURL(/\/movimientos\/nuevo$/);
  });

  test('la evolución se agrupa por día, semana o mes', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    const group = page.getByRole('group', { name: 'Agrupar la evolución por' });
    await expect(group.getByRole('button', { name: 'Mes' })).toHaveAttribute('aria-pressed', 'true');
    await group.getByRole('button', { name: 'Día' }).click();
    await expect(group.getByRole('button', { name: 'Día' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('img', { name: /^Saldo del grupo de/ })).toBeVisible();
  });

  test('dinero del grupo y deuda a cobrar llevan a sus pantallas', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.getByLabel('Saldos del grupo').getByRole('link', { name: /Fondos de Rama/ }).click();
    await expect(page).toHaveURL(/\/cajas\?tab=rama$/);
    await page.goto('/dashboard');
    await page.getByLabel('Resumen del mes').getByRole('link', { name: 'Deuda a cobrar' }).click();
    await expect(page).toHaveURL(/\/reportes\/deudas$/);
  });

  test('un deudor lleva a su ficha', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    const debtors = page.getByRole('region', { name: 'Deudores' }).or(page.locator('section', { has: page.getByRole('heading', { name: 'Deudores' }) }));
    await debtors.getByRole('link', { name: /\$/ }).first().click();
    await expect(page).toHaveURL(/\/personas\/(protagonistas|educadores|personas-externas)\/[^/]+$/);
  });

  test('"Ver todos" lleva al listado de movimientos', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'Ver todos' }).click();
    await expect(page).toHaveURL(/\/movimientos$/);
  });
});
