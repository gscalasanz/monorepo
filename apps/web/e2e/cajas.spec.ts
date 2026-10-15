import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from '@playwright/test';

import { apiClientFor, apiLogin, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

interface CajaDto {
  readonly id: string;
  readonly tipo: string;
}

interface MovimientoDto {
  readonly id: string;
  readonly descripcion: string | null;
}

const MONTO = 1;
const suffix = uniqueSuffix();
const SEED_DESC = `${E2E_PREFIX}seed cajas ${suffix}`;
const TRANSFER_DESC = `${E2E_PREFIX}transferencia ${suffix}`;
const QUICK_DESC = `${E2E_PREFIX}quick ${suffix}`;

async function json<T>(api: APIRequestContext, url: string): Promise<T> {
  const response = await api.get(url);
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as T;
}

/** Deja $1 extra en la caja de grupo para que la transferencia nunca falle por saldo. */
async function seedCajaGrupo(api: APIRequestContext): Promise<void> {
  const grupo = await json<CajaDto>(api, 'cajas/grupo');
  const me = await json<{ id: string }>(api, 'auth/me');
  const response = await api.post('movimientos', {
    data: {
      cajaId: grupo.id,
      tipo: 'ingreso',
      monto: MONTO,
      concepto: 'ajuste_inicial',
      responsableId: me.id,
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      requiereComprobante: false,
      descripcion: SEED_DESC,
    },
  });
  expect(response.ok()).toBeTruthy();
}

/** Borra todo movimiento con el sufijo de este spec (una pata de transferencia borra la otra). */
async function cleanup(api: APIRequestContext): Promise<void> {
  const { data } = await json<{ data: MovimientoDto[] }>(
    api,
    'movimientos?page=1&limit=100',
  );
  const mine = data.filter(
    (m) =>
      m.descripcion?.startsWith(E2E_PREFIX) && m.descripcion.includes(suffix),
  );
  for (const movimiento of mine) {
    const response = await api.delete(`movimientos/${movimiento.id}`);
    expect([200, 204, 404]).toContain(response.status());
  }
}

async function openCajas(page: Page): Promise<void> {
  await loginAsAdmin(page);
  await page.goto('/cajas');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Cajas' }),
  ).toBeVisible();
}

test.describe.serial('cajas', () => {
  let api: APIRequestContext;

  test.beforeAll(async () => {
    api = await apiClientFor(await apiLogin());
    await seedCajaGrupo(api);
  });

  test.afterAll(async () => {
    await cleanup(api);
    await api.dispose();
  });

  test('cada tab renderiza su contenido', async ({ page }) => {
    await openCajas(page);
    const tabs = page.getByRole('tablist', { name: 'Secciones de cajas' });
    await expect(page.getByText('Saldo Caja de Grupo')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Últimos Movimientos' }),
    ).toBeVisible();

    await tabs.getByRole('tab', { name: 'Fondos de Rama' }).click();
    await expect(page).toHaveURL(/tab=rama/);
    await expect(page.getByText('Total Fondos Rama')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Movimientos de Ramas' }),
    ).toBeVisible();

    await tabs.getByRole('tab', { name: 'Cuentas Personales' }).click();
    await expect(
      page.getByRole('heading', { name: /Cuentas Personales/ }),
    ).toBeVisible();

    await tabs.getByRole('tab', { name: 'Fondo Solidario' }).click();
    await expect(page.getByText('Saldo Disponible')).toBeVisible();
    await expect(page.getByText('Bonificado a la Fecha')).toBeVisible();
  });

  test('transferir $1 de la caja de grupo a un fondo de rama', async ({
    page,
  }) => {
    await openCajas(page);
    await page.getByRole('button', { name: 'Transferir a Rama' }).click();
    const dialog = page.getByRole('dialog', { name: 'Transferir entre Cajas' });
    await expect(dialog.getByText('Caja de Grupo')).toBeVisible();

    await dialog.getByRole('combobox', { name: /Destino/ }).click();
    await page.getByRole('option', { name: 'Fondo Manada' }).click();
    await dialog.getByLabel(/Monto/).fill(String(MONTO));
    await dialog.getByLabel('Descripción').fill(TRANSFER_DESC);
    await dialog.getByRole('button', { name: 'Transferir' }).click();
    await expect(dialog).toBeHidden();

    await page.goto('/cajas?tab=rama');
    await expect(page.getByText(TRANSFER_DESC).first()).toBeVisible();
  });

  test('registrar un movimiento rápido desde el drawer', async ({ page }) => {
    await openCajas(page);
    await page.getByRole('button', { name: 'Ver Detalles' }).click();
    const drawer = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('button', { name: 'Cerrar drawer' }) });
    await expect(drawer).toBeVisible();
    await drawer
      .getByRole('button', { name: 'Registrar', exact: true })
      .click();

    const quick = page.getByRole('dialog', { name: 'Nuevo Movimiento' });
    await expect(quick.getByLabel(/Concepto/)).toBeVisible();
    await quick.getByLabel(/Concepto/).click();
    await page.getByRole('option', { name: 'Ajuste Inicial' }).click();
    await quick.getByLabel(/Monto/).fill(String(MONTO));
    await quick.getByRole('combobox', { name: /Responsable/ }).click();
    await page.getByRole('option').first().click();
    await quick.getByLabel('Descripción (opcional)').fill(QUICK_DESC);
    await quick.getByRole('button', { name: 'Registrar', exact: true }).click();

    await expect(
      page.getByText('Movimiento registrado exitosamente'),
    ).toBeVisible();
    await expect(quick).toBeHidden();
    await expect(drawer.getByText('Ajuste Inicial').first()).toBeVisible();
  });
});
