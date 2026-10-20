#!/usr/bin/env bash
# Prepara un worktree de git del monorepo para correr las apps y los tests.
#
#  - Enlaza (symlink, nunca copia) los `.env.local` de cada app desde el repo principal:
#    un worktree no queda con una copia vieja ni duplica secretos.
#  - Compila el `dist/` de los packages internos (las apps los consumen ya buildeados).
#
# Idempotente: se puede correr las veces que haga falta. Nunca lee el contenido de los env.
set -euo pipefail

readonly ENV_NAME=".env.local"
readonly APPS=("apps/api" "apps/web")

GIT_COMMON_DIR="$(git rev-parse --git-common-dir)"
MAIN_ROOT="$(cd "$(dirname "${GIT_COMMON_DIR}")" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

link_env() {
  local app="$1"
  local source="${MAIN_ROOT}/${app}/${ENV_NAME}"
  local target="${HERE}/${app}/${ENV_NAME}"
  if [[ ! -e "${source}" ]]; then
    echo "✖ No existe ${source}." >&2
    echo "  Crealo en el repo principal (ver ${app}/CLAUDE.md o .env.example) y volvé a correr." >&2
    return 1
  fi
  if [[ "${HERE}" == "${MAIN_ROOT}" ]]; then
    echo "• ${app}: repo principal, ${ENV_NAME} ya está en su lugar."
    return 0
  fi
  ln -sfn "${source}" "${target}"
  echo "✓ ${app}/${ENV_NAME} → ${source} (symlink)"
}

missing=0
for app in "${APPS[@]}"; do
  link_env "${app}" || missing=1
done

echo "• Compilando los dist de los packages internos…"
pnpm --filter "./packages/*" build

if [[ "${missing}" -ne 0 ]]; then
  echo "✖ Worktree incompleto: faltan env (ver arriba)." >&2
  exit 1
fi
echo "✓ Worktree listo."
