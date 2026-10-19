import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

import featureBoundaries from '../feature-boundaries.mjs';

const ELEMENT_TYPES = 'boundaries/element-types';
const ENTRY_POINT = 'boundaries/entry-point';

const fixturesRoot = fileURLToPath(new URL('../__fixtures__/web', import.meta.url));

function makeESLint() {
  return new ESLint({
    cwd: fixturesRoot,
    overrideConfigFile: true,
    overrideConfig: [
      { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser, sourceType: 'module' } },
      ...featureBoundaries,
    ],
  });
}

async function lintFile(relPath) {
  const results = await makeESLint().lintFiles([relPath]);
  return results[0].messages;
}

const ofRule = (messages, id) => messages.filter((m) => m.ruleId === id);

test('un feature no puede importar de otro feature (su barrel)', async () => {
  const messages = await lintFile('src/features/a/cross-feature.ts');
  assert.equal(ofRule(messages, ELEMENT_TYPES).length, 1);
});

test('solo se importa el barrel de un feature (no sus internals)', async () => {
  const messages = await lintFile('src/app/deep-import.ts');
  assert.equal(ofRule(messages, ENTRY_POINT).length, 1);
});

test('app importando el barrel de un feature es válido', async () => {
  const messages = await lintFile('src/app/valid-barrel.ts');
  assert.equal(ofRule(messages, ELEMENT_TYPES).length, 0);
  assert.equal(ofRule(messages, ENTRY_POINT).length, 0);
});

test('un feature importando lo suyo y `shared` es válido', async () => {
  const messages = await lintFile('src/features/a/components/widget.ts');
  assert.equal(ofRule(messages, ELEMENT_TYPES).length, 0);
  assert.equal(ofRule(messages, ENTRY_POINT).length, 0);
});
