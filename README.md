# Sartorial (Shopify theme)

Tema de Shopify en desarrollo (`theme_name` "Sartorial", `theme_version` 1.0.0 en `config/settings_schema.json`). Incluye tres presets (Sartorial, Imprint, Archive) en `listings/`. Este repositorio contiene el tema y, junto a el, el tooling, la documentacion y la evidencia del proyecto. Su estado de cumplimiento esta en `docs/requirements-ledger.md`; este README no afirma que el tema este listo para ninguna submission.

## Estructura

Tema (lo que entra en el paquete ZIP, segun `scripts/package-theme-zip.mjs`):

- `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`
- `listings/` (plantillas de cada preset) y `release-notes.md`

Tooling y proyecto (no forman parte del tema):

- `scripts/`: compuertas y utilidades (empaquetado, validacion de JSON, ledger, locales, etc.)
- `tests/`: pruebas Playwright y `axe` vendorizado
- `docs/`: ledger, decisiones, documentacion del comerciante y de la tienda demo (indice en `docs/README.md`)
- `agent-comms/`: comunicacion entre agentes, informes y evidencia
- `harness-*/`: arneses historicos de auditoria en la raiz
- `.github/workflows/ci.yml`, `package.json`, `.nvmrc`, `playwright.config.mjs`, `.theme-check.yml`

## Requisitos locales

- Node: `.nvmrc` indica 22.12.0. Ojo: el CI (`.github/workflows/ci.yml`) usa hoy Node 20, discrepancia pendiente de resolver.
- `npm ci` instala Shopify CLI y Playwright.

## Compuertas

```bash
npm ci
npm run gates:json        # valida todos los JSON
npm run gates:hooks       # cruza los data-* que lee el JS con los que emite el Liquid
npm run gates:sanity      # theme-check-sanity.mjs (sanidad de la configuracion de Theme Check)
npm run gates:locales     # inventario de claves de locale
npm run gates:ledger      # citas archivo:linea del ledger
npm run gates:theme-check # shopify theme check
npm run gates:syntax      # node --check de assets/theme.js y product-zoom.js
npm run gates:package     # ZIP reproducible en dist/theme.zip
npm run gates:static      # todas las anteriores en orden
```

Las compuertas son locales y estaticas. No sustituyen la verificacion en una tienda real.

## Gobernanza y documentacion

- `AGENTS.md`: reglas de colaboracion y definicion de terminado
- `agent-comms/RULES.md`: reglamento operativo; `agent-comms/BOARD.md`: tablero de estado
- `docs/decisions.md` y `docs/decisions-pending.md`: decisiones tomadas y abiertas
- `docs/requirements-ledger.md`: requisitos y evidencia
- `docs/demo-store/README.md`: kit de la tienda demo
- `agent-comms/outbox-claude/HANDOFF-SESION-NUEVA-20261114.md`: traspaso de sesion vigente
