#!/usr/bin/env bash
# PostToolUse hook — formatea el archivo recién editado con Prettier.
# DEFENSIVO: si todavía no hay toolchain (pre-scaffold), termina sin hacer nada.
# No bloquea nunca: siempre exit 0.
set -euo pipefail

# El payload del hook llega por stdin como JSON: { tool_input: { file_path }, ... }
payload="$(cat)"

# Extraer file_path sin depender de jq (puede no estar instalado).
file_path="$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"

[ -z "$file_path" ] && exit 0
[ -f "$file_path" ] || exit 0

# Solo archivos que Prettier entiende en este stack.
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css|*.scss|*.md|*.yml|*.yaml) ;;
  *) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Pre-scaffold: sin package.json o sin node_modules → no-op silencioso.
[ -f "$root/package.json" ] || exit 0
[ -d "$root/node_modules" ] || exit 0
command -v pnpm >/dev/null 2>&1 || exit 0

# Formatear solo si Prettier está disponible en el workspace.
if pnpm exec prettier --version >/dev/null 2>&1; then
  pnpm exec prettier --write --log-level warn "$file_path" >/dev/null 2>&1 || true
fi

exit 0
