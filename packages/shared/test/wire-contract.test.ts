import { describe, expect, it } from 'vitest';

import * as enums from '../src/enums';
import snapshot from './fixtures/wire-values.snapshot.json';

/**
 * Contrato de wire: los valores que viajan entre `web`, `api` y la base son exactamente los
 * del backend original al momento de la consolidación (Fase 0 de MONOREPO.md). Este test es
 * la red: si un valor cambia, cambió el contrato.
 */
type WireValue = string | readonly string[] | Readonly<Record<string, string>>;

const toWire = (value: WireValue): string | readonly string[] =>
  typeof value === 'string' || Array.isArray(value) ? value : Object.values(value);

const exported = enums as unknown as Readonly<Record<string, WireValue>>;

describe('contrato de wire', () => {
  it.each(Object.entries(snapshot))('%s conserva sus valores', (name, expected) => {
    expect(exported[name], `${name} no está exportado por @scout/shared/enums`).toBeDefined();
    expect(toWire(exported[name] as WireValue)).toEqual(expected);
  });
});
