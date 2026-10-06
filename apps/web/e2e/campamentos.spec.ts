import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from '@playwright/test';

import { apiClientFor, apiLogin, loginAsAdmin } from './support/auth';
import { E2E_PREFIX, uniqueSuffix } from './support/env';

const NAME_PREFIX = `${E2E_PREFIX}camp `;

interface CampamentoRow {
  readonly id: string;
  readonly nombre: string;
}

interface DetalleRow {
  readonly participantes: readonly {
    readonly id: string;
    readonly pagos: readonly {
      readonly movimientoId: string;
      readonly concepto: string;
    }[];
  }[];
  readonly movimientos: readonly { readonly id: string }[];
}

/** Deja el campamento sin pagos, participantes ni gastos y lo borra. */
async function purgeCampamento(
  api: APIRequestContext,
  id: string,
): Promise<void> {
  const detalle = (await (
    await api.get(`campamentos/${id}/detalle`)
  ).json()) as DetalleRow;
  for (const p of detalle.participantes) {
    for (const pago of p.pagos.filter((x) => x.concepto === 'campamento_pago'))
      await api.delete(`campamentos/${id}/pagos/${pago.movimientoId}`);
    await api.delete(`campamentos/${id}/participantes/${p.id}/bonificacion`);
    await api.delete(`campamentos/${id}/participantes/${p.id}`);
  }
  for (const movimiento of detalle.movimientos)
    await api.delete(`movimientos/${movimiento.id}`);
  await api.delete(`campamentos/${id}`);
}

async function createCampamentoViaApi(nombre: string): Promise<string> {
  const api = await apiClientFor(await apiLogin());
  const response = await api.post('campamentos', {
    data: {
      nombre,
      fechaInicio: '2030-01-10',
      fechaFin: '2030-01-15',
      costoPorPersona: 45000,
      costoEducadores: 0,
      cuotasBase: 3,
    },
  });
  const body = (await response.json()) as CampamentoRow;
  await api.dispose();
  return body.id;
}

async function pickFirstOption(page: Page, label: string): Promise<void> {
  await page.getByRole('combobox', { name: label }).click();
  await page.getByRole('option').first().click();
}

test.describe('campamentos', () => {
  test.afterAll(async () => {
    const api = await apiClientFor(await apiLogin());
    const campamentos = (await (
      await api.get('campamentos')
    ).json()) as CampamentoRow[];
    for (const camp of campamentos.filter((c) =>
      c.nombre.startsWith(NAME_PREFIX),
    ))
      await purgeCampamento(api, camp.id);
    await api.dispose();
  });

  test('crear, editar y eliminar un campamento', async ({ page }) => {
    const nombre = `${NAME_PREFIX}${uniqueSuffix()}`;
    await loginAsAdmin(page);

    await page.goto('/campamentos/crear');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Nuevo Campamento' }),
    ).toBeVisible();
    await page.getByLabel(/Nombre del Campamento/).fill(nombre);
    await page.getByLabel(/Fecha de Inicio/).fill('2030-02-01');
    await page.getByLabel(/Fecha de Fin/).fill('2030-02-05');
    await page.getByLabel(/Costo por Persona/).fill('30000');
    await page.getByRole('button', { name: 'Crear Campamento' }).click();

    await expect(
      page.getByText('Campamento creado exitosamente'),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();
    await expect(page.getByText('Total a Recaudar')).toBeVisible();
    await expect(page.getByText('Sin participantes')).toBeVisible();

    await page
      .getByRole('button', { name: 'Editar campamento' })
      .last()
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Editar Campamento' }),
    ).toBeVisible();
    const editado = `${nombre} bis`;
    await page.getByLabel(/Nombre del Campamento/).fill(editado);
    await page.getByRole('button', { name: 'Actualizar' }).click();
    await expect(
      page.getByText('Campamento actualizado exitosamente'),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: editado }),
    ).toBeVisible();

    await page.goto('/campamentos');
    const card = page.getByRole('article').filter({ hasText: editado });
    await card.getByRole('button', { name: 'Eliminar campamento' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Eliminar' })
      .click();
    await expect(
      page.getByText('Campamento eliminado exitosamente'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: editado })).toHaveCount(0);
  });

  test('agregar participante, autorización y gasto', async ({ page }) => {
    const nombre = `${NAME_PREFIX}${uniqueSuffix()}`;
    const id = await createCampamentoViaApi(nombre);
    await loginAsAdmin(page);
    await page.goto(`/campamentos/${id}`);
    await expect(
      page.getByRole('heading', { level: 1, name: nombre }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Agregar', exact: true }).click();
    const agregar = page.getByRole('dialog', { name: 'Agregar Participante' });
    await expect(
      agregar.getByText(/persona\(s\) disponible\(s\)/),
    ).toBeVisible();
    await pickFirstOption(page, 'Seleccionar Persona');
    await agregar.getByRole('button', { name: 'Agregar', exact: true }).click();
    await expect(
      page.getByText('Participante agregado exitosamente'),
    ).toBeVisible();
    await expect(page.getByText(/Inscripto el/)).toBeVisible();

    await page
      .getByRole('button', { name: 'Autorización pendiente' })
      .first()
      .click();
    await expect(
      page.getByText('Autorización actualizada exitosamente'),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Autorización entregada' }).first(),
    ).toBeVisible();

    await page.getByRole('tab', { name: 'Movimientos' }).click();
    await expect(page.getByText('Sin movimientos')).toBeVisible();
    await page.getByRole('button', { name: 'Gasto', exact: true }).click();
    const gasto = page.getByRole('dialog', { name: 'Registrar Gasto' });
    const descripcion = `${E2E_PREFIX}leña ${uniqueSuffix()}`;
    await gasto.getByLabel(/^Monto/).fill('1500');
    await pickFirstOption(page, 'Responsable');
    await gasto.getByLabel(/Descripción/).fill(descripcion);
    await gasto.getByRole('combobox', { name: /Medio de Pago/ }).click();
    await page.getByRole('option', { name: 'Efectivo' }).click();
    await gasto.getByRole('button', { name: 'Registrar Gasto' }).click();
    await expect(page.getByText('Gasto registrado exitosamente')).toBeVisible();
    await expect(page.getByText(descripcion)).toBeVisible();
  });
});
