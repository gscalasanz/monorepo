import { expect, test, type APIRequestContext } from '@playwright/test';

import { apiClientFor, apiLogin, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

const CONFIG = { montoScoutArgentina: 1000, montoGrupo: 1000 };

async function inscripcionIdsOf(
  api: APIRequestContext,
  personaId: string,
): Promise<string[]> {
  const response = await api.get(`inscripciones/persona/${personaId}`);
  if (!response.ok()) return [];
  return ((await response.json()) as { id: string }[]).map(
    (inscripcion) => inscripcion.id,
  );
}

test.describe.serial('inscripciones', () => {
  let api: APIRequestContext;
  let personaId = '';
  const nombre = `${E2E_PREFIX}Protagonista ${uniqueSuffix()}`;

  test.beforeAll(async () => {
    api = await apiClientFor(await apiLogin());
    const response = await api.post('personas/protagonistas', {
      data: { nombre, rama: 'Manada' },
    });
    expect(response.ok()).toBeTruthy();
    personaId = ((await response.json()) as { id: string }).id;
  });

  test.afterAll(async () => {
    if (personaId) {
      for (const id of await inscripcionIdsOf(api, personaId))
        await api.delete(`inscripciones/${id}`);
      await api.delete(`personas/${personaId}`);
    }
    await api.dispose();
  });

  test('alta de Grupo, pago y borrado desde el detalle', async ({ page }) => {
    await loginAsAdmin(page);
    await page.addInitScript((config) => {
      window.localStorage.setItem(
        'scout_inscripcion_config',
        JSON.stringify(config),
      );
    }, CONFIG);

    // Alta (Grupo, año actual, pago inicial 0)
    await page.goto('/inscripciones/crear?tipo=grupo');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nueva Inscripción' }),
    ).toBeVisible();
    await page
      .getByRole('combobox', { name: /Persona a inscribir/ })
      .fill(nombre);
    await page.getByRole('option', { name: nombre }).click();
    await expect(page.getByLabel('Monto Total')).toHaveValue(/1\.000/);
    await page.getByRole('button', { name: 'Crear inscripción' }).click();
    await expect(page).toHaveURL(/\/inscripciones\?tipo=grupo$/);

    const [inscripcionId] = await inscripcionIdsOf(api, personaId);
    expect(inscripcionId).toBeTruthy();

    // Detalle: saldo pendiente completo
    await page.goto(`/inscripciones/${inscripcionId}`);
    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    const kpis = page.getByRole('region', { name: 'Estado de pago' });
    await expect(kpis.getByText('Debe', { exact: true })).toBeVisible();
    await expect(kpis.getByText('0% completado')).toBeVisible();

    // Registrar un pago de 100
    await page.getByRole('button', { name: 'Registrar pago' }).click();
    const pagoDialog = page.getByRole('dialog');
    await pagoDialog.getByLabel('Pago en Efectivo/Transferencia').fill('100');
    await pagoDialog.getByRole('button', { name: 'Registrar Pago' }).click();
    await expect(page.getByText('Pago registrado exitosamente')).toBeVisible();
    await expect(kpis.getByText('10% completado')).toBeVisible();

    // Eliminar el pago desde "Editar Pago"
    await page.getByRole('button', { name: /^Acciones para pago de/ }).click();
    await page.getByRole('menuitem', { name: 'Editar pago' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Eliminar' })
      .click();
    await expect(page.getByText('Pago eliminado exitosamente')).toBeVisible();
    await expect(page.getByText('Sin pagos')).toBeVisible();

    // Eliminar la inscripción
    await page
      .getByRole('button', { name: 'Más acciones de la inscripción' })
      .click();
    await page.getByRole('menuitem', { name: 'Eliminar' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Eliminar' })
      .click();
    await expect(page).toHaveURL(/\/inscripciones$/);
    expect(await inscripcionIdsOf(api, personaId)).toEqual([]);
  });

  test('/inscripciones/:id/pago no existe', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/inscripciones/cualquiera/pago');
    await expect(page.locator('#not-found-title')).toBeVisible();
  });
});
