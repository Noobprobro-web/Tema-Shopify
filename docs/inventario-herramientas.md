# Inventario de Herramientas, Arneses y Rutas Fuera del Tema

```text
ID:                 INVENTARIO-HERRAMIENTAS-001
Documento:          docs/inventario-herramientas.md
Autor:              Gemini en Antigravity (Orquestador en Repo)
Referencia:         CEREBRO-PLAN-001 §5.1 Tarea 7 / CEREBRO-REVIEW-F0-001 §9, §12.7
Fecha:              2026-10-19
Estado:             Vigente para Fase 0 y base de preparación para Sprint 7D
```

Este inventario documenta exhaustivamente todas las rutas, arneses, scripts y carpetas fuera del tema Shopify (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`, `listings/`), identificando sus consumidores reales (`scripts/`, `package.json`, `.github/workflows/ci.yml`, `playwright.config.mjs`, `docs/requirements-ledger.md`) y el comando exacto para verificar su no-regresión antes de cualquier movimiento en Sprint 7D.

### Comprobación de Consumidores en Código Activo

Comando ejecutado:
```bash
git grep -n "harness-" scripts tests .github package.json playwright.config.mjs docs/requirements-ledger.md
```
**Resultado verificado:**
- `scripts/`: 0 referencias.
- `tests/`: 0 referencias.
- `.github/`: 0 referencias.
- `package.json`: 0 referencias.
- `playwright.config.mjs`: 0 referencias.
- `docs/requirements-ledger.md`: 3 referencias exactas (filas 56 y 57 para `agent-comms/outbox-claude/harness-MOTION-002/` y fila 110 para `agent-comms/outbox-claude/harness-LEAD-001/`).

Ningún script de CI, compuerta estática de producción ni suite principal de Playwright depende de las carpetas `harness-*`. Todas corresponden a evidencias históricas y arneses de auditoría de agentes.

---

## 1. Matriz de Rutas de Infraestructura y Soporte

| Ruta en el Repositorio | Descripción / Contenido | Consumidores Oficiales | Comando de Verificación del Consumidor | Destino Previsto (Sprint 7D) |
| :--- | :--- | :--- | :--- | :--- |
| `scripts/` | Scripts de compuertas estáticas, saneamiento, empaquetado y validación de locales | `package.json` (`npm run gates:*`), `.github/workflows/ci.yml` | `npm run gates:static` | Se mantiene en raíz (`scripts/`) |
| `tests/` | Pruebas visuales y de interacción Playwright (`tests/pdp-line-total.spec.mjs`, etc.) | `package.json` (`npm run test:visual`), `playwright.config.mjs` | `npx playwright test` | Se mantiene en raíz (`tests/`) |
| `.agents/` | Configuración de agentes, herramientas y teamwork histórico | Antigravity IDE, agentes locales | `git status .agents` | `agent-comms/archive/agents/` en 7D |
| `.playwright-mcp/` | Caché y estado temporal del servidor MCP Playwright | Herramientas MCP locales (no versionado ni necesario) | `git status .playwright-mcp` | Borrado seguro en 7D / añadido a `.gitignore` |
| `cobertura-360-002.csv` | Reporte de matriz de cobertura de requisitos 360 | Referenciado en ledger y auditorías Claude/GPT | `git grep -n "cobertura-360-002.csv" docs/ agent-comms/` | `docs/reports/cobertura-360-002.csv` |
| `docs/gate5-reports/` | Reportes de evidencia de compuertas en tiendas vivas | `docs/requirements-ledger.md` | `git grep -n "gate5-reports" docs/ agent-comms/` | `docs/gate5-reports/` (se preserva) |
| `scratch/` | Scripts de depuración, pruebas temporales y scripts ad-hoc | Ningún script de compuerta oficial | `git status scratch/` (no versionar residuos) | Limpieza de scripts obsoletos; útiles a `scripts/deploy/` (D-18) |

---

## 2. Arneses en Raíz (9 Carpetas)

| Ruta en el Repositorio | Descripción / Contenido | Consumidores Oficiales | Comando de Verificación | Destino Previsto (Sprint 7D) |
| :--- | :--- | :--- | :--- | :--- |
| `harness-4D-001/` | Arneses de auditoría y fixtures de Sprint 4D | Histórico / outbox Claude | `git grep -n "harness-4D-001" docs/ agent-comms/` | `tools/harness/4D-001/` |
| `harness-4D-002/` | Arneses de pruebas complementarias 4D | Histórico / outbox Claude | `git grep -n "harness-4D-002" docs/ agent-comms/` | `tools/harness/4D-002/` |
| `harness-4D-003/` | Arneses de regresión y validación 4D | Histórico / outbox Claude | `git grep -n "harness-4D-003" docs/ agent-comms/` | `tools/harness/4D-003/` |
| `harness-4E-001/` | Arneses de auditoría de variantes y PDP 4E | Histórico / outbox Claude | `git grep -n "harness-4E-001" docs/ agent-comms/` | `tools/harness/4E-001/` |
| `harness-4E-002/` | Pruebas de interacción de variantes 4E | Histórico / outbox Claude | `git grep -n "harness-4E-002" docs/ agent-comms/` | `tools/harness/4E-002/` |
| `harness-4E-003/` | Validación de stock y live updates 4E | Histórico / outbox Claude | `git grep -n "harness-4E-003" docs/ agent-comms/` | `tools/harness/4E-003/` |
| `harness-AUDIT-360-001/` | Arneses de auditoría técnica integral (axe, cls, responsive) | Referenciado en ledger y `docs/gate5-reports/` | `git grep -n "harness-AUDIT-360-001" docs/ agent-comms/` | `tools/harness/AUDIT-360-001/` (crudos a repo externo) |
| `harness-AUDIT-360-002/` | Validación de HTML, contraste y accesibilidad con 24 snapshots | Referenciado en brief de Antigravity (contiene snapshots) | `git grep -n "harness-AUDIT-360-002" docs/ agent-comms/` | Desindexar snapshots; arnés a `tools/harness/AUDIT-360-002/` |
| `harness-COMP-001/` | Arneses de prueba comparativa de componentes | Histórico / outbox Claude | `git grep -n "harness-COMP-001" docs/ agent-comms/` | `tools/harness/COMP-001/` |

---

## 3. Arneses en `agent-comms/outbox-*` (30 Carpetas)

### 3.1 `agent-comms/outbox-claude/` (27 Carpetas)

| Ruta en el Repositorio | Descripción / Propósito | Consumidores Oficiales | Comando de Verificación | Destino Previsto (Sprint 7D) |
| :--- | :--- | :--- | :--- | :--- |
| `agent-comms/outbox-claude/harness-4B-006/` | Verificación de arquitectura y micro-optimizaciones 4B | Histórico Claude | `git grep -n "harness-4B-006" agent-comms/ docs/` | `tools/harness/claude/4B-006/` |
| `agent-comms/outbox-claude/harness-4F-001/` | Validación de renderizado y facetas 4F | Histórico Claude | `git grep -n "harness-4F-001" agent-comms/ docs/` | `tools/harness/claude/4F-001/` |
| `agent-comms/outbox-claude/harness-4F-002/` | Pruebas de debounce y respuesta AJAX 4F | Histórico Claude | `git grep -n "harness-4F-002" agent-comms/ docs/` | `tools/harness/claude/4F-002/` |
| `agent-comms/outbox-claude/harness-5A-001/` | Pruebas de catálogo de alta costura y swatches 5A | Histórico Claude | `git grep -n "harness-5A-001" agent-comms/ docs/` | `tools/harness/claude/5A-001/` |
| `agent-comms/outbox-claude/harness-5A-002/` | Validación de filtros por color y talla 5A | Histórico Claude | `git grep -n "harness-5A-002" agent-comms/ docs/` | `tools/harness/claude/5A-002/` |
| `agent-comms/outbox-claude/harness-5A-003/` | Pruebas de accesibilidad en swatches 5A | Histórico Claude | `git grep -n "harness-5A-003" agent-comms/ docs/` | `tools/harness/claude/5A-003/` |
| `agent-comms/outbox-claude/harness-5B-001/` | Arneses de prueba automatizada para zoom modal y PDP | `docs/requirements-ledger.md` (filas 73, 74) | `git grep -n "harness-5B-001" docs/ agent-comms/` | `tools/harness/claude/5B-001/` |
| `agent-comms/outbox-claude/harness-5C-001/` | Pruebas de Mega Menú editorial bilingüe 5C | Histórico Claude | `git grep -n "harness-5C-001" agent-comms/ docs/` | `tools/harness/claude/5C-001/` |
| `agent-comms/outbox-claude/harness-5C-002/` | Validación de Recently Viewed nativo 5C | Histórico Claude | `git grep -n "harness-5C-002" agent-comms/ docs/` | `tools/harness/claude/5C-002/` |
| `agent-comms/outbox-claude/harness-5C-003/` | Pruebas de inventario reactivo multi-estado 5C | Histórico Claude | `git grep -n "harness-5C-003" agent-comms/ docs/` | `tools/harness/claude/5C-003/` |
| `agent-comms/outbox-claude/harness-6A-001/` | Certificación de conmutador bilingüe y búsqueda 6A | Histórico Claude | `git grep -n "harness-6A-001" agent-comms/ docs/` | `tools/harness/claude/6A-001/` |
| `agent-comms/outbox-claude/harness-6B-001/` | Certificación de píldoras de filtros activos y WCAG 6B | Histórico Claude | `git grep -n "harness-6B-001" agent-comms/ docs/` | `tools/harness/claude/6B-001/` |
| `agent-comms/outbox-claude/harness-A360-001/` | Verificación de regresión integral A360 | Histórico Claude | `git grep -n "harness-A360-001" agent-comms/ docs/` | `tools/harness/claude/A360-001/` |
| `agent-comms/outbox-claude/harness-AUDIT-FINAL-001/`| Auditoría pre-submission de código y estilos | Histórico Claude | `git grep -n "harness-AUDIT-FINAL-001" agent-comms/` | `tools/harness/claude/AUDIT-FINAL-001/` |
| `agent-comms/outbox-claude/harness-AUDIT-FINAL-002/`| Arneses de paridad entre repositorio y despliegue | Histórico Claude | `git grep -n "harness-AUDIT-FINAL-002" agent-comms/` | `tools/harness/claude/AUDIT-FINAL-002/` |
| `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/`| Arneses de verificación remota post-deploy | Histórico Claude | `git grep -n "harness-AUDIT-FINAL-003" agent-comms/` | `tools/harness/claude/AUDIT-FINAL-003/` |
| `agent-comms/outbox-claude/harness-AUDIT-PRESETS-001/` | Auditoría de presets Sartorial, Imprint y Archive | Histórico Claude | `git grep -n "harness-AUDIT-PRESETS-001" agent-comms/` | `tools/harness/claude/AUDIT-PRESETS-001/` |
| `agent-comms/outbox-claude/harness-CURRENCY-001/` | Pruebas de selectores de divisa y mercados Shopify | Histórico Claude | `git grep -n "harness-CURRENCY-001" agent-comms/` | `tools/harness/claude/CURRENCY-001/` |
| `agent-comms/outbox-claude/harness-FIXES-AUDIT-FINAL-001/` | Verificación de correcciones de auditoría final | Histórico Claude | `git grep -n "harness-FIXES-AUDIT-FINAL-001"` | `tools/harness/claude/FIXES-AUDIT-FINAL-001/` |
| `agent-comms/outbox-claude/harness-FIXES-PRE-SUBMISSION-001/` | Remediaciones pre-submission | Histórico Claude | `git grep -n "harness-FIXES-PRE-SUBMISSION-001"` | `tools/harness/claude/FIXES-PRE-SUBMISSION-001/` |
| `agent-comms/outbox-claude/harness-LEAD-001/` | Verificación de theme_info y docs en GitHub Pages | `docs/requirements-ledger.md` (fila 110) | `git grep -n "harness-LEAD-001" docs/ agent-comms/` | `tools/harness/claude/LEAD-001/` |
| `agent-comms/outbox-claude/harness-LOCALE-001/` | Validación de integridad de locales en/es | Histórico Claude | `git grep -n "harness-LOCALE-001" agent-comms/` | `tools/harness/claude/LOCALE-001/` |
| `agent-comms/outbox-claude/harness-ML-001/` | Pruebas multi-idioma de navegación y drawers | Histórico Claude | `git grep -n "harness-ML-001" agent-comms/` | `tools/harness/claude/ML-001/` |
| `agent-comms/outbox-claude/harness-MOTION-002/` | Motor CSS scroll-driven y prefers-reduced-motion | `docs/requirements-ledger.md` (filas 56, 57) | `git grep -n "harness-MOTION-002" docs/ agent-comms/` | `tools/harness/claude/MOTION-002/` |
| `agent-comms/outbox-claude/harness-PRESETS-I18N-001/`| Validación de etiquetas i18n por preset | Histórico Claude | `git grep -n "harness-PRESETS-I18N-001" agent-comms/` | `tools/harness/claude/PRESETS-I18N-001/` |
| `agent-comms/outbox-claude/harness-REVIEW-AUDIT-360/`| Verificación cruzada de auditoría 360 | Histórico Claude | `git grep -n "harness-REVIEW-AUDIT-360" agent-comms/` | `tools/harness/claude/REVIEW-AUDIT-360/` |
| `agent-comms/outbox-claude/harness-UNIFIED-POLISH-001/`| Pulido unificado pre-congelamiento | Histórico Claude | `git grep -n "harness-UNIFIED-POLISH-001" agent-comms/`| `tools/harness/claude/UNIFIED-POLISH-001/` |

### 3.2 `agent-comms/outbox-gemini/` (1 Carpeta)

| Ruta en el Repositorio | Descripción / Propósito | Consumidores Oficiales | Comando de Verificación | Destino Previsto (Sprint 7D) |
| :--- | :--- | :--- | :--- | :--- |
| `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/` | Crawler, auditoría axe y responsive de auditoría 360 Gemini | Histórico Gemini / BOARD.md | `git grep -n "harness-TECH-AUDIT-001" agent-comms/` | `tools/harness/gemini/TECH-AUDIT-001/` |

### 3.3 `agent-comms/outbox-gpt/` (2 Carpetas)

| Ruta en el Repositorio | Descripción / Propósito | Consumidores Oficiales | Comando de Verificación | Destino Previsto (Sprint 7D) |
| :--- | :--- | :--- | :--- | :--- |
| `agent-comms/outbox-gpt/harness-DOCS-VERIFY-001/` | Verificación HTTP y validación W3C de documentación | Histórico GPT | `git grep -n "harness-DOCS-VERIFY-001" agent-comms/` | `tools/harness/gpt/DOCS-VERIFY-001/` |
| `agent-comms/outbox-gpt/harness-GPT-018/` | Pruebas y mediciones de auditoría GPT-018 | Histórico GPT | `git grep -n "harness-GPT-018" agent-comms/` | `tools/harness/gpt/GPT-018/` |

---

## 4. Protocolo de No-Regresión para Sprint 7D

Antes de ejecutar cualquier movimiento de arneses hacia `tools/harness/` en Sprint 7D:
1. Ejecutar `npm run gates:static` para confirmar Exit Code 0 (8/8 compuertas en verde).
2. Ejecutar `git grep -n "harness-" scripts tests .github package.json playwright.config.mjs` para garantizar que ningún build ni suite activa apunte a las rutas antiguas.
3. Asegurar que las referencias de `docs/requirements-ledger.md` (filas 56, 57 y 110) se actualicen atómicamente en el mismo commit que desplace los arneses correspondientes a `tools/harness/`.
