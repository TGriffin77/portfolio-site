#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SEED_SCRIPT="$SCRIPT_DIR/seed-technologies.mjs"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run this seed script." >&2
  exit 1
fi

POCKETBASE_URL=${POCKETBASE_URL:-https://www.thomasgriffin.dev}
export POCKETBASE_URL

if [ -z "${POCKETBASE_ADMIN_EMAIL:-}" ]; then
  printf 'PocketBase admin email: '
  IFS= read -r POCKETBASE_ADMIN_EMAIL
  export POCKETBASE_ADMIN_EMAIL
fi

if [ -z "${POCKETBASE_ADMIN_PASSWORD:-}" ]; then
  printf 'PocketBase admin password: '
  stty -echo
  IFS= read -r POCKETBASE_ADMIN_PASSWORD
  stty echo
  printf '\n'
  export POCKETBASE_ADMIN_PASSWORD
fi

node "$SEED_SCRIPT"
