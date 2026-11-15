# Indice de docs/

Descripcion de lo que hay en `docs/`. La vigencia se indica solo cuando se puede comprobar en el propio archivo; ante la duda, mandan `requirements-ledger.md` y `decisions.md`.

## Vivos (se actualizan durante el proyecto)

| Ruta | Contenido |
| --- | --- |
| `requirements-ledger.md` | Ledger de requisitos con evidencia; lo verifica `npm run gates:ledger` |
| `decisions.md` | Decisiones tomadas |
| `decisions-pending.md` | Cola de decisiones abiertas |
| `demo-store/` | Kit para montar una tienda de desarrollo limpia (`README.md`, `products.csv`, colecciones, paginas, menus, blog, `SETUP-TIENDA-NUEVA.md`, `created-*.json` con lo creado) |
| `demo-import/` | Entregables de importacion manual por preset (CSV de productos y fotos, notas D-01); `scripts/demo-import.mjs` los genera y comprueba desde `demo-import/data/` |
| `merchant/` | Paginas HTML de documentacion y soporte para comerciantes (`index.html`, `docs.html`, `support.html`) |
| `gate5-reports/` | Informe y resultados crudos de la verificacion empirica (los genera `scripts/gate5-empirical.mjs`; citados por el ledger) |

## Referencia y planificacion (puntuales)

| Ruta | Contenido |
| --- | --- |
| `shopify-theme-store-acceptance-matrix.md` | Matriz de criterios de aceptacion de Theme Store |
| `shopify-theme-store-checklist.md` | Checklist inicial basado en requisitos publicos |
| `design-tokens.json` | Tokens de diseno (formato W3C) |
| `figma/` | SVG y material de diseno exportado |
| `contour-reference-plan.md` | Plan de mejoras con una referencia externa (GPT-PLAN-CONTOUR-001) |
| `phase-4-plan.md` | Plan maestro de la fase 4 |

## Estructura de la raiz del repositorio

Tema: `assets config layout locales sections snippets templates listings` y `release-notes.md`. Tooling: `scripts/`, `tests/`, `playwright.config.mjs`, `package.json`, `.github/`. Proyecto: `docs/`, `agent-comms/`, `AGENTS.md`. Los arneses historicos que estaban en la raiz (`harness-4D-*`, `harness-4E-*`, `harness-COMP-001`, `harness-AUDIT-360-*`, `cobertura-360-002.csv`, `.agents/teamwork/`) viven ahora en `agent-comms/archive/harness-root/` y `agent-comms/archive/audit-360/`; sus README tienen la tabla de rutas antes -> ahora.

## Historicos de fases tempranas

`mvp-scope.md`, `roadmap.md`, `strategy-brief.md`, `phase-2-architecture-plan.md`, `theme-concept-proposals.md`, `top-theme-benchmark.md` y `gemini-task-01-report.md` documentan el planteamiento inicial. Pueden no reflejar el estado actual del tema.

Los borradores `gemini-context-prompt.md` y `gemini-task-01.md` se movieron a `agent-comms/archive/`.
