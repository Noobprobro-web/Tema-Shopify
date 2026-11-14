# PLAN-LIMPIEZA-REPO-20261114: inventario y plan de limpieza del repositorio y de la carpeta local

```text
ID: PLAN-LIMPIEZA-REPO-20261114
Fecha: 2026-11-14
Estado: PROPUESTA (actualizada tras REVIEW-DOCS-20261114-001). Nada se ejecuta sin que se cumpla la condición de cada clase.
Decisión requerida: Johandry y el líder: autorizar, clase por clase, las acciones A, B y C de este plan (cada una indica su condición). Sin autorización no se ejecuta ninguna.
Resumen en 5 líneas:
  1. Inventario de solo lectura del repositorio y de la carpeta local, con clases de acción A, B y C.
  2. Ninguna acción rompe los pins ni la evidencia citada (SHA de run.mjs, run-b02.mjs, capture.mjs).
  3. El SHA final de run.mjs es 5c03c139…a2bc1, commiteado en f81774e; el pin de la línea ~95 ya coincide.
  4. La huella de contenido del ZIP (e280cd2b…) hay que recalcularla tras commitear release-notes.md, base.css y main-collection.liquid (§9).
  5. No se reescribe el historial y el remoto solo se toca con autorización (B-7a).
Autor: Claude (analista, subagente). SOLO LECTURA: no se borró, movió, editó ni commiteó nada.
Archivos tocados: solo este plan (nuevo; cabecera, HEAD y pin actualizados el 2026-11-14).
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Verificación: lectura local con git, grep y sha256sum; demuestra la coherencia documental con el repo local y no demuestra ningún estado de la tienda.
Afirmaciones falsables: el pin D28_RUNNER_SHA256 (run-b02.mjs:29) es 5c03c139…a2bc1 y coincide con sha256sum de run.mjs; ninguna acción del plan modifica run.mjs, run-b02.mjs ni capture.mjs.
Rama/HEAD: inventariado en 76dd94d (clon superficial: is-shallow = true); HEAD actual f81774e.
Árbol sucio al inventariar (fotografía del inventario en 76dd94d; trabajo de otros agentes en paralelo, NO TOCAR):
  M  agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs
  M  agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs
  M  docs/decisions-pending.md, docs/decisions.md, release-notes.md
  ?? agent-comms/inbox-gpt/CLAUDE-TO-GPT-IMAGENES-DEMO-001.md
  ?? agent-comms/outbox-claude/reviews-20261110/REVIEW-STORE-STATE-001.md
  ?? agent-comms/outbox-gpt/harness-GPT-RA-RB-001/{selftest.mjs,stores.json}
  ?? docs/demo-store/{created-content.json,created-products.json}
  ?? scripts/lighthouse-mobile.mjs, scripts/lighthouse-mobile.selftest.mjs
Proceso vivo al inventariar (fotografía del inventario): node scripts/lighthouse-mobile.selftest.mjs (PID 16317) + Chromium headless + lighthouse@13.6.0.
Estado: PROPUESTA. Nada se ejecuta sin que se cumpla la condición de cada clase.
```

## 0. Conclusión en una línea

El repositorio está ordenado en lo que importa (el tema son 95 archivos y 1,2 MB, y el ZIP sale de una lista blanca). El peso, 291,7 MB rastreados, está en `agent-comms/` (275,3 MB, 244,1 MB de ellos en PNG/JPG/PDF), y casi todo es evidencia que se cita o que importan otros arneses. La limpieza segura es pequeña: artefactos locales, un archivo suelto en la raíz, dos borradores sin referencias, dos ramas ya fusionadas y la documentación de orientación. Borrar archivos del árbol **no reduce `.git`** (221 MB en packs). Eso solo se consigue reescribiendo el historial, y eso queda fuera de este plan (§C-8).

---

## 1. Inventario de lo rastreado (`git ls-files`)

Comandos:
`git ls-files | wc -l` -> **2547**.
`git ls-files -z <ruta> | xargs -0 stat -c %s | awk '{t+=$1} END{print t, NR}'` -> tamaños.

| Carpeta raíz | Archivos | Tamaño | Naturaleza |
| --- | ---: | ---: | --- |
| `agent-comms/` | 1856 | 275,3 MB | Comunicación formal + evidencia (RULES/AGENTS) |
| `harness-AUDIT-360-002/` | 218 | 4,2 MB | Arnés de auditoría 360 (raíz) |
| `.agents/` | 90 | 46 KB | Espacios de rol de AUDIT-360 (**ignorado en .gitignore pero rastreado**) |
| `docs/` | 65 | 3,5 MB | Ledger, decisiones, docs del comerciante y de la tienda demo |
| `harness-COMP-001/` | 64 | 3,8 MB | Arnés de comparativa (raíz) |
| `sections/` | 35 | 422 KB | Tema |
| `harness-AUDIT-360-001/` | 35 | 148 KB | Arnés (raíz) |
| `harness-4E-002/` | 25 | 374 KB | Arnés (raíz) |
| `snippets/` | 23 | 118 KB | Tema |
| `templates/` | 18 | 33 KB | Tema |
| `harness-4E-001/` | 18 | 573 KB | Arnés (raíz) |
| `harness-4E-003/` | 17 | 1,5 MB | Arnés (raíz) |
| `harness-4D-002/` | 14 | 199 KB | Arnés (raíz) |
| `scripts/` | 13 | 220 KB | Compuertas y utilidades |
| `harness-4D-001/`, `harness-4D-003/` | 11 + 11 | 306 KB + 90 KB | Arneses (raíz) |
| `listings/` | 9 | 30 KB | Presets (tema, entran en el ZIP) |
| `assets/`, `locales/`, `layout/`, `config/`, `tests/` | 3+3+2+2+2 | 547+91+14+18+560 KB | Tema / tests (axe vendorizado) |
| Raíz: archivos sueltos | 12 | — | ver tabla siguiente |

Totales: tema (`assets config layout locales sections snippets templates listings`) = **95 archivos / 1,2 MB**. Arneses en la raíz (`harness-*`) = **413 archivos / 10,7 MB**. Extensiones más frecuentes: md 642, json 579, png 529, mjs 274, txt 139.

**Archivos sueltos en la raíz:**

| Ruta | Tamaño | ¿Estructura de tema o proyecto? |
| --- | ---: | --- |
| `AGENTS.md`, `README.md` | 8,3 KB / 1,8 KB | Proyecto (README desfasado, §7) |
| `package.json`, `package-lock.json`, `.nvmrc`, `playwright.config.mjs` | 1,3 / 42 / 0 / 0,6 KB | Tooling del proyecto (CI los usa) |
| `.gitignore`, `.shopifyignore`, `.theme-check.yml` | 1,1 / 0,05 / 5,6 KB | Configuración |
| `.github/workflows/ci.yml` | 1,5 KB | CI |
| `release-notes.md` | 1,1 KB | Tema (entra en el ZIP: `scripts/package-theme-zip.mjs:83`) |
| **`cobertura-360-002.csv`** | 117 KB | **No es estructura**: salida de `harness-AUDIT-360-002/generate-cobertura.mjs:198` |
| **`.playwright-mcp/page-2026-09-29T16-44-13-777Z.yml`** | 511 B | **No es estructura**: snapshot suelto del MCP de Playwright (página de contraseña "Contour") |
| **`.agents/teamwork/**`** (90) | 46 KB | **No es estructura**: generado por `harness-AUDIT-360-00x/setup-role-workspaces.mjs` |
| **`harness-4D-001..COMP-001/`** (9 carpetas) | 10,7 MB | Arneses históricos de sprint fuera de `agent-comms/` |

`git ls-files -i -c --exclude-standard` -> los únicos archivos rastreados que contradicen `.gitignore` son los **90 de `.agents/teamwork/`**.

**Peso dentro de `agent-comms/`:**

| Subcarpeta | Archivos | Tamaño | Qué pesa |
| --- | ---: | ---: | --- |
| `outbox-claude/harness-LEAD-001/` | 370 | 111,8 MB | 291 PNG/JPG (`audit-atelier/archive/edition`) |
| `outbox-claude/harness-MOTION-002/` | 148 | 108,9 MB | 18 PDF de impresión = 68,5 MB; 93 binarios en total |
| `outbox-gemini/harness-TECH-AUDIT-001/` | 117 | 31,6 MB | `raw-vnu-validation.json` 5,2 MB + 72 PNG |
| `outbox-gpt/harness-GPT-RA-RB-001/` | 27 | 6,5 MB | 25 JSON de resultados |
| `outbox-claude/harness-4F-001/`, `-4F-002/` | 26 / 19 | 4,8 / 3,0 MB | capturas |
| `outbox-claude/harness-AUDIT-FINAL-002/`, `-003/` | 135 / 96 | 3,0 / 2,4 MB | `lib.mjs` compartido (lo importan 30+ scripts) |
| resto | ~1000 | ~10 MB | md/json/txt |

---

## 2. Grafo de dependencias que condiciona cualquier movimiento

Comandos: `git grep -nE "from '\.\./|'\.\./\.\./|path\.join\(.*\.\./" -- 'agent-comms/**/*.mjs' 'scripts/*.mjs'` y `git grep -nE 'SHA256|sha256' -- '*.mjs' '*.js' '*.py'`.

**Hashes fijados (verificados hoy, árbol de trabajo):**

| Pin | Dónde | Objetivo | sha256 actual | ¿Coincide? |
| --- | --- | --- | --- | --- |
| `D28_RUNNER_SHA256` | `agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs:29` (ruta en `:27`, relativa `../../outbox-gpt/harness-GPT-RA-RB-001/run.mjs`) | `harness-GPT-RA-RB-001/run.mjs` | `5c03c13957dfd0fef8fd241f89f44d8b471da20819162e10438ed55d578a2bc1` | Sí (commiteado en `f81774e`; coincide con D32) |
| `CAPTURE_SHA256` | `agent-comms/outbox-claude/harness-C-01-ID-001/measure.mjs:45` (ruta en `:44`, `REPO + 'agent-comms/outbox-gpt/harness-GPT-C01-COLLECTION-001/capture.mjs'`) | `capture.mjs` | `ce2dab82…d1eb` | Sí |
| `CANONICAL_SHA256` / `CRLF_SHA256` | `agent-comms/outbox-gemini/package-reproducible-zip.py:32-33` | ZIP histórico | — | Fijo en histórico (citado en `docs/decisions.md`) |
| Snapshots de `run.mjs` | `docs/decisions.md:271`, `:309` | `harness-GPT-RA-RB-001/run.mjs` | — | Evidencia de aceptación |

Nota: el encargo situaba `measure.mjs` en `harness-GPT-C01-COLLECTION-001`. En realidad está en `outbox-claude/harness-C-01-ID-001/`, y el que lleva el pin es `capture.mjs`, de GPT.

**Imports y rutas relativas acopladas a la profundidad de carpeta:**
- `outbox-claude/harness-AUDIT-FINAL-002/lib.mjs`: lo importan 19 scripts de `harness-LEAD-001/audit-*/` (`'../../harness-AUDIT-FINAL-002/lib.mjs'`), 4 de `outbox-gemini/harness-TECH-AUDIT-001/` (`'../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs'`) y 7 de `outbox-gpt/harness-GPT-018/`.
- `outbox-claude/harness-AUDIT-FINAL-003/lib.mjs`: lo importan `harness-LEAD-001/11-*.mjs`, `12-*.mjs` y `harness-MOTION-002/01-motion-check.mjs`.
- `outbox-gpt/harness-GPT-C01-COLLECTION-001/`: lo importan `harness-C-01-ID-001/measure.mjs` y `harness-GPT-C07-VARIANTS-001/run.mjs`.
- Raíz del repo resuelta con `'../../..'`: `harness-5A-001/render5a.mjs:15`, `5A-003:19`, `5B-001:18`, `5C-001:17`, `6B-001:5`, `AUDIT-FINAL-002/07-parity-catalog.mjs:7`, `AUDIT-FINAL-003/20-compliance.mjs:7`, `B-05-001/harness.mjs:8`, `CURRENCY-001/liquid-currency-test.mjs:6`, `LEAD-001/08-*.mjs:11`, `10-*.mjs:11` y los 4 `run-*.mjs` de TECH-AUDIT-001.
- Arneses de la raíz: usan `process.cwd()` más rutas literales (`harness-AUDIT-360-002/aggregate-cwv-full.mjs:4`, `harness-AUDIT-360-001/test-chrome-port.mjs:7`, `generate-cobertura.mjs:198` escribe `cobertura-360-002.csv` en la raíz, `verify-rule10.mjs:26` lo lee de la raíz, `setup-role-workspaces.mjs:5` escribe `.agents/teamwork/audit360-002`). `harness-4E-003/render.mjs:5` apunta a `/home/claude/w2`, así que ya no se puede reproducir.
- **Consecuencia:** cualquier `git mv` dentro de `agent-comms/` que cambie la profundidad o el nombre de una carpeta `harness-*` rompe imports o pins. Mover los arneses de la raíz rompe su reejecución (cwd + rutas literales) y las citas textuales de los informes.

**Compuertas y lo que leen** (para saber qué no puede desaparecer):
- `scripts/ledger-verify.mjs:36`: resuelve las citas `archivo:línea` del ledger solo en `assets config layout locales sections snippets templates scripts tests blocks listings`. **`tests/` y `scripts/` no pueden moverse.**
- `scripts/json-validate.mjs:23`: recorre TODO el repo salvo `node_modules .git .tmp test-results playwright-report dist scratch`. Borrar JSON de `agent-comms` solo cambia el recuento; nunca rompe la compuerta.
- `scripts/package-theme-zip.mjs:78-83`: lista blanca `assets/ config/ layout/ locales/ sections/ snippets/ templates/ listings/ blocks/` + `release-notes.md`, `update_extension.json`, leída de blobs de git (`git ls-tree -r`, `:164`). **Ninguna limpieza fuera del tema altera el contenido del ZIP.**
- `.github/workflows/ci.yml`: `npm ci`, gates json/hooks/sanity/locales/ledger/theme-check/syntax/package y `npx playwright test --list` (necesita `playwright.config.mjs` y `tests/`).
- `.theme-check.yml:55-100`: ya excluye `.agents/** .playwright-mcp/** scratch/** agent-comms/** harness-*/** docs/** scripts/** tests/** test-results/** demo-assets/** _to_delete/** "Claude outputs/**"`. Deja `.tmp/` dentro **a propósito** (`theme-check-sanity.mjs`).

**Línea base del ZIP (medida hoy, sin escribir en el repo):**
`node scripts/package-theme-zip.mjs --out <scratchpad>/baseline.zip` ->
`rev 76dd94d`, `archivos 92`, `tamano 287924`, **`sha256 fe096602adfcf3f311e43b794ede459716fc60a513904427e0b34b6b0a1636f4`**, **`contenido e280cd2b127fa71dc3736749ecc26c6e1f8fbba2de48cdba746032ee00422af4`**.
El `sha256` del ZIP depende de la fecha del commit (DOS-time): un commit de limpieza lo cambia, y es lo esperado. La huella de **contenido** NO debe cambiar.

---

## 3. Basura local no rastreada o ignorada

Comandos: `git status --ignored --short`, `du -sh`, `ls -la`, `ps -eo pid,etime,cmd`, `find . \( -name .DS_Store -o -name '*.log' -o -name '*.orig' -o -name '*.rej' -o -name '*~' -o -name '*.swp' \)`.

| Ruta | Tamaño | ¿Se regenera? | Observación |
| --- | ---: | --- | --- |
| `dist/theme.zip` | 281 KB (287487 B) | Sí: `npm run gates:package` | **Obsoleto**: el de HEAD mide 287924 B |
| `.tmp/` | vacío | Sí: lo crea `theme-check-sanity.mjs` | Sin sandboxes `theme-check-sanity-*` sobrantes |
| `node_modules/` | 70 MB | Sí: `npm ci` (lockfile presente) | Lo necesitan las compuertas: **no** borrar antes de la verificación final |
| `/tmp/c01-pull-{Q35xOE,UB8KNA,ch2ZeD}` | 3 × 4 KB, vacíos | Los crea `harness-C-01-ID-001/identity.mjs:182` (`mkdtemp`) | Del 2026-11-10, huérfanos |
| `/tmp/c01-selftest-Hq2Sw7` | 7,0 MB | Lo crea `harness-C-01-ID-001/selftest.mjs:19` | Del 2026-11-10, huérfano |
| `/tmp/lh-mobile-5ZM853`, `/tmp/lh-selftest-5uAp1z`, `/tmp/playwright-artifacts-3vGTGG` | 2,4 MB / 4 KB / 4 KB | Los crea `scripts/lighthouse-mobile.mjs:147` | **EN USO ahora** (PID 16317/16329): no tocar mientras haya proceso |
| `/tmp/node-compile-cache`, `/tmp/claude-code*.log`, `/tmp/ruby-build*.log`, `/tmp/*.diag.log` | 8 MB + logs | Del sistema o de la sesión | Fuera del proyecto: **no se proponen** |
| `scratch/`, `test-results/`, `playwright-report/`, `coverage/`, `.shopify/`, `.theme/`, `demo-assets/`, `_to_delete/`, `Claude outputs/`, `.claude/`, `.codex/`, `.vscode/`, `.secrets/` | — | — | **No existen** en disco |
| `.DS_Store`, `Thumbs.db`, `*.log`, `*.orig`, `*.rej`, `*~`, `*.swp` | 0 | — | Ninguno (fuera de `node_modules`/`.git`) |
| `.git/` | 221 MB (2 packs, 95 objetos sueltos de 704 KB, garbage 0) | — | Sin stash ni worktrees extra |

---

## 4. Duplicados, obsoletos y archivos vacíos (evidencia frente a ruido)

| Candidato | Tamaño | Referencias halladas | Veredicto |
| --- | ---: | --- | --- |
| Plan v1 `outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md` | 18,8 KB | `CLAUDE-REVIEW-PLAN-SARTORIAL-001.md:9`, `GEMINI-REVIEW-PLAN-IMPLEMENTACION-001.md:8,20` | **C**: objeto de una revisión |
| Plan v2 `…-v2.md` | 66,8 KB | `CLAUDE-REVIEW-PLAN-SARTORIAL-002.md:9`, `CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001.md:10`, `GEMINI-ANALYSIS-CLAUDE-GPT-ALIGNMENT-001.md:10`, `v3.md:37`, `v4.1.md:37` | **C** |
| Plan v3 `…-v3.md` | 95,7 KB | `CLAUDE-REVIEW-PLAN-SARTORIAL-003.md:9`, `CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001.md:3`, `CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md:10` (con sha256), `v4.md:45`, `v4.1.md:45` | **C** |
| Plan v4 `…-v4.md` | 108,2 KB | `CLAUDE-REVIEW-PLAN-SARTORIAL-004.md:24`, `CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001.md:5`, `v4.1.md:46,573` (Get-FileHash) | **C** |
| Plan v4.1 | 111,2 KB | `BOARD.md:58,104`, `CLAUDE-HANDOFF-CLOUD-001.md:14`, `CLAUDE-DIRECTIVA-C-08-001.md:30` | **C** (rector) |
| `harness-MOTION-002/run-2026-10-02{,-b,-print,-print-fix,-print-live}/` | ~108 MB | Ledger `:56-57` cita `01-motion-check.mjs`. Los `results-*.json` de print-fix y print-live citan los PDF por nombre (`print-chromium-full-home.pdf`). `GPT-CONTOUR-QA-001.md` cita `run-2026-10-02-print-live` | **C**: evidencia interna encadenada (fallo B-6 de impresión, `CLAUDE-REPORT-MOTION-002.md:304`) |
| `harness-LEAD-001/audit-*/` (291 binarios) | ~101 MB | Ledger `:115` cita `results-01-public-docs.txt` y `results-04-support-form-e2e.json`. `CLAUDE-REPORT-LEAD-001.md` cita las carpetas `audit-*`. 19 scripts importan `AUDIT-FINAL-002/lib.mjs` | **C** |
| `harness-AUDIT-FINAL-002/*.run1*`, `*.run1-429*`, `*.run1-503*` (corridas fallidas) | ~100 KB | Sin cita por nombre. El incidente 429 se narra en `CLAUDE-REPORT-AUDIT-FINAL-002.md:344` | **C**: evidencia del incidente; ahorro despreciable |
| `harness-GPT-RA-RB-001/results/`: 7 JSON sin ninguna cita por nombre, UUID ni marca de tiempo (`…002052881Z-a581e41a`, `…003925932Z-6bc70dc0`, `…004602511Z-8b8ab2ae`, `…181805513Z-49f70cbf`, `…185233284Z-7528225b`, `…185332883Z-23f15300`; `…190050695Z-fb44b01f` lo cita por marca de tiempo `reviews-20261110/REVIEW-AXE-SHA-001.md`) | 6 sin cita (se excluye `…190050695Z`) × ≈1,7 MB en total | `run.mjs:80` solo escribe, nunca lee `results/` | **B diferido** (B-6): el arnés está en edición ahora mismo |
| `docs/gemini-context-prompt.md` | 2,1 KB | 0 (`git grep -F gemini-context-prompt.md`) | **B** (B-2) |
| `docs/gemini-task-01.md` | 1,5 KB | 0 (`gemini-task-01-report.md` sí tiene 3 referencias: se queda) | **B** (B-2) |
| `inbox-claude/CLAUDE-DIRECTIVE-AUDIT-FINAL-002.md` | 0 B | `CLAUDE-REPORT-AUDIT-FINAL-002.md:7` ("Responde a:") | **C**: vacío pero citado |
| `outbox-gpt/GPT-AUDIT-014-final-presets-certification.md` | 0 B | `GPT-TASK-015…:59`, `GPT-AUDIT-015…:12` (dice expresamente que estaba vacío) | **C** |
| `outbox-gpt/harness-GPT-018/role-08-legal/gsap-search.txt` | 0 B | `role-08-legal.md:22` (salida vacía de `rg` = prueba de ausencia de GSAP) | **C** |
| 7 `.gitkeep` en carpetas de `agent-comms/` que ya tienen contenido | 0 B | Sin referencias en scripts ni CI | **B opcional** (B-5): ruido mínimo |
| `docs/gate5-reports/lh-{collection,home-motion,pdp}.json` | 2,0 MB | 0 por nombre; la carpeta la escribe `scripts/gate5-empirical.mjs:11` y el ledger cita `gate5-empirical-report.md` (filas `:31,37,46,49,51,52,75,85`) | **C**: crudos del informe citado |
| `cobertura-360-002.csv` (raíz) | 117 KB | `GEMINI-REPORT-AUDIT-360-002.md:11,21,57`, `BOARD.md:167` (la descalifica como "generada por script sintético"), `verify-rule10.mjs:26`, `generate-cobertura.mjs:198` | **C** (archivable, §C-3) |
| `.agents/teamwork/**` (90) | 46 KB | `harness-AUDIT-360-00{1,2}/verify-rule10.mjs:23/24`, `setup-role-workspaces.mjs:5`, `GEMINI-REPORT-AUDIT-360-00{1,2}.md`, `CLAUDE-REVIEW-GEMINI-AUDIT-360.md` | **C** (archivable, §C-3) |
| `.playwright-mcp/page-2026-09-29T16-44-13-777Z.yml` | 511 B | 0 por nombre. La carpeta solo aparece como destino de capturas en `harness-COMP-001/shots.js:10-33` e `interact.js:57-77` (Playwright crea la carpeta) y en `.theme-check.yml` | **B** (B-1) |

**Citas rotas detectadas (para corregir sin borrar nada):**
- `docs/requirements-ledger.md:71` cita "arnés Playwright `harness-lv05/run.js` v5". **No existe** en el repo ni en `/tmp`. `ledger-verify` no lo detecta porque la cita no lleva `:línea`.
- `docs/decisions.md:14,34` citan `agent-comms/token-efficiency-rules.md`, `protocol.md` y `GEMINI-LEAD-HANDOFF.md`, que hoy están en `agent-comms/archive/`. Es un registro histórico: se corrige con una nota añadida al final, sin reescribir.
- `AGENTS.md` ("Tareas de Claude") cita `PROTOCOL-IMPLEMENTATION.md`, que está en `agent-comms/archive/PROTOCOL-IMPLEMENTATION.md`.
- `agent-comms/README.md:7,19,27` dice que el punto de entrada es `GEMINI-LEAD-HANDOFF.md` + `status.md`, archivados ya. El vigente es `BOARD.md` + `RULES.md`.

---

## 5. Ramas, tags y PR

Comandos: `git branch -a -vv`, `git for-each-ref`, `git ls-remote --heads --tags origin` y `gh api repos/Noobprobro-web/Tema-Shopify/compare/<a>...<b>` (REST, solo lectura; no se hizo `fetch`).

| Rama | Dónde | Frente a `master` (09f8342) | Frente a `lote-e-claude` | Propuesta |
| --- | --- | --- | --- | --- |
| `master` | local + remoto | — | 117 por detrás | **Intocable** |
| `lote-e-claude` (HEAD) | local + remoto | ahead 117 | — | Conservar (activa) |
| `lote0/base-09f8342` | remoto | ahead 12, sin fusionar | ancestro (behind 105) | Conservar hasta fusionar `lote-e-claude` en `master`; después, borrable (B-7b) |
| `lote-a` | remoto | ahead 17 | ancestro (behind 100) | ídem |
| `lote-b` | remoto | ahead 32 | ancestro (behind 85) | ídem |
| `lote-c` | remoto | ahead 35 | ancestro (behind 82) | ídem |
| `lote-c-impl` | remoto | ahead 72 | ancestro (behind 45) | ídem |
| `lote-d` | remoto | ahead 58 | ancestro (behind 59) | ídem. **PR #1 abierto** `lote-d -> master` ("borrador, sin fusionar"): cerrarlo o redirigirlo cuando se abra el PR de `lote-e-claude` |
| `fix/argon-recently-viewed-edition` | remoto | diverged: 1 propio (`35b952c`) | diverged | **Conservar** (commit sin fusionar por hash; parecido a `a34bd19` de master, pero no está demostrado que sea equivalente) |
| `sprint/7B` | remoto | diverged: 2 propios (`35b952c`, merge `f46ee38`) | diverged | **Conservar** |
| `sprint/F0` | remoto | diverged: 2 propios (`3e5957d`, `c4dca23`) | diverged | **Conservar** |
| `fix/revert-listings-exclusion` | remoto | **idéntica** (09f8342) | ancestro | **Borrable** (B-7a) |
| `claude/nice-mendel-84sxat` | solo local + ref remota obsoleta (ya no está en `ls-remote`) | fusionada (`merge-base --is-ancestor` OK) | — | **Borrable** local + `fetch --prune` (B-7a) |

Tags: `checkpoint-phase-3b-start` (anotado, `5d9b0cf` -> `d140d21`), solo en el remoto. Se conserva. No hay tags locales.

---

## 6. `.gitignore` y `.shopifyignore`

**`.gitignore` (estado):** cubre `node_modules/ .tmp/ dist/ *.zip *.log test-results/ playwright-report/ scratch/ .secrets/ .env* *cookies* *headers.json *.har temp-*.json/txt raw-lighthouse-*.json .claude/ .codex/ .vscode/ .mcp.json CLAUDE.md`. Está bien en secretos.

Huecos y defectos:
1. Falta `.playwright-mcp/`. Es lo que dejó entrar el snapshot de la raíz.
2. `.agents/` está ignorado, pero tiene 90 archivos rastreados. Es incoherente: los cambios se rastrean y los archivos nuevos no. Hay que decidirlo (§C-3) y documentarlo con un comentario.
3. Faltan perfiles y sandboxes de arnés: `harness-*/chrome-profile/` (`harness-AUDIT-360-001/test-chrome-port.mjs:7` lo crearía dentro del repo) y `**/results/*.partial.json` si se adopta ese patrón.
4. Redundancias inocuas: `*.cookies.json` y `*cookies.json` (el segundo ya cubre el primero); `*cookies.txt`.
5. Faltan `.DS_Store` en subcarpetas: el patrón `.DS_Store` ya aplica a cualquier nivel, así que está bien.

Bloque propuesto (B-3, para añadir al final):
```gitignore
# Herramientas locales de navegador y perfiles de arnés (nunca evidencia)
.playwright-mcp/
harness-*/chrome-profile/
**/chrome-profile/
# .agents/: ignorado para lo nuevo; los 90 archivos de .agents/teamwork/ siguen
# rastreados porque los citan GEMINI-REPORT-AUDIT-360-00x (ver PLAN-LIMPIEZA-REPO-20261114 C-3).
```

**`.shopifyignore` (estado):** `agent-comms/`, `agent-comms/**`, `scratch/`, `scratch/**`, `*.md`.
- El ZIP canónico **no lo usa**: sale de la lista blanca de `package-theme-zip.mjs:78-83`. Ningún cambio en `.shopifyignore` altera el ZIP.
- `shopify theme push`/`dev` solo sincronizan las carpetas del tema, así que `harness-*`, `docs/` o `scripts/` no suben, con o sin regla. *Esto viene de la documentación de Shopify CLI y no se ha verificado empíricamente en esta sesión.* Por eso se propone reforzarlo por defensa en profundidad, no porque haya hoy una fuga demostrada.
- `*.md` no afecta a nada dentro de las carpetas del tema (no hay `.md` en ellas). Excluye `release-notes.md` de un push, lo cual es correcto: ese archivo es del ZIP, no del tema vivo.
- Bloque propuesto (B-4): añadir `harness-*/`, `docs/`, `scripts/`, `tests/`, `.agents/`, `.playwright-mcp/`, `node_modules/`, `dist/`, `.tmp/`, `*.csv`, `*.mjs`. Antes, comprobar con `shopify theme push --unpublished --dry-run`… **no existe dry-run**, así que la verificación es: `shopify theme push --development --json` contra un tema de desarrollo y revisar la lista. **No hacerlo sin autorización** (toca tienda; instrucción de no usar `mcp__Shopify__*`).

---

## 7. Documentación de orientación

| Archivo | Estado | Propuesta |
| --- | --- | --- |
| `README.md` (43 líneas) | **Desfasado**: título "Shopify Theme Project", sin nombre del tema (Sartorial), sin presets, sin compuertas, sin estructura, fases 1-8 genéricas. Dice "Node 22.12+" (coincide con `.nvmrc` 22.12.0), pero el CI usa `node-version: 20` (`ci.yml`), y la nota sobre `uv_os_get_passwd` es de una sesión Windows antigua | Reescribir (B-8): qué es, estructura de carpetas, `npm ci` + `npm run gates:static`, cómo empaquetar, dónde está la gobernanza (`AGENTS.md`, `agent-comms/BOARD.md`, `RULES.md`, `docs/requirements-ledger.md`, `docs/decisions.md`). Alinear Node: o el CI pasa a 22, o `.nvmrc`/README bajan a 20.15+ (mínimo de `zlib.crc32`, `package-theme-zip.mjs:41`) |
| Índice de estructura | **No existe** `docs/README.md` | Crear `docs/README.md` (B-8) con una línea por archivo de `docs/` y su vigencia: vivo (ledger, decisions, decisions-pending, merchant/, demo-store/, demo-import/), histórico (contour-reference-plan, phase-*-plan, roadmap, strategy-brief, theme-concept-proposals, top-theme-benchmark, gemini-task-01-report, figma/) |
| `agent-comms/README.md` | Desfasado (§4) | Apuntar a `BOARD.md` + `RULES.md`; marcar `archive/` como histórico |
| `AGENTS.md` | Enlace roto a `PROTOCOL-IMPLEMENTATION.md`. **Contradicción de autoridad**: la cabecera dice "Gemini es el cerebro" y "BOARD.md (único escritor: Gemini)", mientras que la lista de autoridad pone a Claude como líder temporal y `BOARD.md:5` dice "Escritor único: Claude (D24…)" y `:7` "D24 modifica AGENTS.md:84 y :96 … AGENTS.md no se editó" | Corrección mínima propuesta: ruta `agent-comms/archive/PROTOCOL-IMPLEMENTATION.md` y una nota que remita a D24 para el escritor de BOARD. Requiere autorización de Johandry (no alterar gobernanza sin directiva) |
| `agent-comms/BOARD.md` | Cabecera `Última actualización: 2026-11-05`, rama `lote-b`, base `6f22b9d`. Al inventariar, HEAD era `lote-e-claude` @ 76dd94d (hoy 303bf4d), 117 commits sobre master | **No editado.** Propuesta para su escritor (D24: Claude, con revisión de un subagente limpio): actualizar la cabecera (fecha, rama, HEAD, estado de los lotes C-E), añadir una sección "Mapa del repositorio" que enlace `docs/README.md` y registrar este plan |
| `package.json` | `"name": "shopify-theme-project"`, `version 0.1.0` | Cosmético: renombrar a `sartorial-theme` (opcional, sin efecto en CI ni en el ZIP) |

---

## 8. PLAN

Convenciones: todos los comandos se ejecutan desde `/home/user/Tema-Shopify`. **Precondición global**: `git status --short` limpio de trabajo ajeno (o al menos sin cambios en las rutas afectadas) y ningún proceso de arnés vivo: `pgrep -fa 'lighthouse|playwright|chrome-headless|run-b02|run.mjs'` debe salir vacío.

### CLASE A: segura, se ejecuta sin consulta (locales, no rastreadas o ignoradas, regenerables)

| # | Ruta | Tamaño | Referencias | Riesgo | Acción | Orden |
| --- | --- | ---: | --- | --- | --- | --- |
| A-1 | `dist/theme.zip` | 281 KB | Ignorado (`dist/`, `*.zip`); lo regenera `gates:package` | Bajo | `rm -f dist/theme.zip && rmdir dist` | 1 |
| A-2 | `.tmp/` (vacío) | 0 | Ignorado; lo recrea `theme-check-sanity.mjs` | Bajo | `rmdir .tmp` (falla sin daño si no está vacío; si contiene `theme-check-sanity-*`, `rm -rf .tmp/theme-check-sanity-*`, como pide `.theme-check.yml`) | 2 |
| A-3 | `/tmp/c01-pull-Q35xOE`, `/tmp/c01-pull-UB8KNA`, `/tmp/c01-pull-ch2ZeD` | 12 KB | `mkdtemp` de `identity.mjs:182`; vacíos, del 2026-11-10 | Bajo | `rmdir /tmp/c01-pull-*` | 3 |
| A-4 | `/tmp/c01-selftest-Hq2Sw7` | 7,0 MB | `mkdtemp` de `selftest.mjs:19`, del 2026-11-10 | Bajo | `rm -rf /tmp/c01-selftest-Hq2Sw7` | 4 |
| A-5 | `/tmp/lh-mobile-*`, `/tmp/lh-selftest-*`, `/tmp/playwright-artifacts-*` | 2,4 MB | `lighthouse-mobile.mjs:147`; **EN USO al inventariar** | Bajo **solo si** `pgrep -f lighthouse-mobile` está vacío | `pgrep -f lighthouse-mobile \|\| rm -rf /tmp/lh-mobile-* /tmp/lh-selftest-* /tmp/playwright-artifacts-*` | 5 |
| A-6 | `node_modules/` | 70 MB | Ignorado; `npm ci` lo regenera | Bajo, pero rompe las compuertas hasta reinstalar | **Solo al final**, tras la verificación de §9, y solo si se quiere la carpeta mínima: `rm -rf node_modules` (reinstalar con `npm ci`) | 99 (último, opcional) |

Total clase A: **5 ítems obligatorios (A-1 a A-5) que liberan unos 9,7 MB** + 1 opcional (A-6, 70 MB). Reversibilidad: todo se regenera con `npm run gates:package`, `npm ci` o reejecutando el arnés.
No se proponen: logs del sistema en `/tmp`, `/tmp/node-compile-cache` ni nada de `.git/` (sin `git gc`/`prune` con agentes en paralelo).

### CLASE B: archivos rastreados SIN referencias comprobadas (recuperable por git; requiere commit autorizado)

| # | Ruta | Tamaño | Referencias (comando) | Riesgo | Acción exacta | Orden |
| --- | --- | ---: | --- | --- | --- | --- |
| B-1 | `.playwright-mcp/page-2026-09-29T16-44-13-777Z.yml` | 511 B | `git grep -F page-2026-09-29` -> 0. La carpeta solo es destino de `harness-COMP-001/{shots,interact}.js` (Playwright crea la carpeta) | Bajo | `git rm .playwright-mcp/page-2026-09-29T16-44-13-777Z.yml` (+ B-3) | 1 |
| B-2 | `docs/gemini-context-prompt.md`, `docs/gemini-task-01.md` | 2,1 + 1,5 KB | `git grep -F <basename>` -> 0 cada uno | Bajo | `git mv docs/gemini-context-prompt.md agent-comms/archive/gemini-context-prompt.md && git mv docs/gemini-task-01.md agent-comms/archive/gemini-task-01.md` (junto a los `prompt-for-gemini*.md` ya archivados) | 2 |
| B-3 | `.gitignore` (edición) | — | — | Bajo | Añadir el bloque de §6 | 3 |
| B-4 | `.shopifyignore` (edición) | — | — | Bajo para el ZIP (no lo lee); medio para `theme push` (sin verificación empírica) | Añadir patrones de §6; validar en un tema de desarrollo **con autorización** | 4 |
| B-5 | 6 `.gitkeep` redundantes: `agent-comms/{inbox-claude,inbox-gpt,outbox-claude,outbox-gemini,outbox-gpt,reviews}/.gitkeep` | 0 B | `git grep -F .gitkeep -- scripts .github '*.mjs'` -> 0; cada carpeta tiene 37-1209 archivos | Bajo | `git rm agent-comms/{inbox-claude,inbox-gpt,outbox-claude,outbox-gemini,outbox-gpt,reviews}/.gitkeep` (se conserva `archive/.gitkeep`). Opcional | 5 |
| B-6 | 6 resultados huérfanos de `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/`: `RA-RB-read-only-20261106T002052881Z-a581e41a-….json`, `…T003925932Z-6bc70dc0-….json`, `…T004602511Z-8b8ab2ae-….json`, `…T181805513Z-49f70cbf-….json`, `…T185233284Z-7528225b-….json`, `…T185332883Z-23f15300-….json` | ≈1,7 MB | Ninguna cita por nombre, UUID ni marca de tiempo; `run.mjs:80` solo escribe | **Medio**: arnés en edición activa y bajo la política D28 (`docs/decisions.md:264-309`) | **Diferido**: solo cuando GPT/Claude cierren RA-RB y el BOARD lo registre. Mejor `git mv` a `results/superseded/` que `git rm` (no cambia ningún pin: el pin es de `run.mjs`) | 6 (diferido) |
| B-7a | Ramas fusionadas | — | `compare master...fix/revert-listings-exclusion` = identical; `merge-base --is-ancestor claude/nice-mendel-84sxat master` = sí | Bajo | `git fetch --prune origin` · `git branch -d claude/nice-mendel-84sxat` (con `-d`, no `-D`: se niega si no está fusionada) · `git push origin --delete fix/revert-listings-exclusion` (**autorización de Johandry**: borra en el remoto). Reversión: `git push origin 09f8342:refs/heads/fix/revert-listings-exclusion` | 7 |
| B-7b | `lote0/base-09f8342`, `lote-a`, `lote-b`, `lote-c`, `lote-c-impl`, `lote-d` | — | Todas ancestros de `lote-e-claude`, todas SIN fusionar en master | — | **No ahora.** Solo después de fusionar `lote-e-claude` en `master` y comprobar con `gh api …/compare/master...<rama>` que `ahead_by = 0`. Antes, anotar los SHA (§5) para poder restaurarlas | 8 (condicionado) |
| B-8 | Documentación: `README.md` (reescritura), `docs/README.md` (nuevo), `agent-comms/README.md` (actualizar), `AGENTS.md` (ruta rota + nota D24), nota añadida al final de `docs/decisions.md` sobre las rutas archivadas, corrección de la cita `harness-lv05/run.js` en `ledger:71` | — | §4 y §7 | Bajo en lo técnico, medio en gobernanza | Ediciones; `AGENTS.md` y el ledger requieren el visto bueno de Gemini/Johandry. BOARD lo edita solo su escritor | 9 |

Total clase B: **3 archivos sueltos + 6 `.gitkeep` opcionales (unos 4 KB), 6 resultados diferidos (≈1,7 MB), 2 ramas inmediatas + 6 condicionadas y 6 ediciones de documentación/configuración.**

Commit sugerido (cuando haya autorización):
`git commit -m "chore(repo): remove stray Playwright MCP snapshot, archive orphan Gemini drafts, tighten ignores" -m "Refs: PLAN-LIMPIEZA-REPO-20261114"`
Reversión total: `git revert <sha>`, o `git checkout <sha>^ -- <ruta>` para un archivo suelto.

### CLASE C: NO tocar (evidencia citada, pins, rutas importadas)

| # | Ruta | Tamaño | Por qué no | Cómo se podría archivar en el futuro sin romper nada |
| --- | --- | ---: | --- | --- |
| C-1 | `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs` y todo `harness-B-02-STORE-001/` | 78 KB + 95 KB | Pin `D28_RUNNER_SHA256` (`run-b02.mjs:29`) + ruta relativa `:27`; snapshots aceptados en `docs/decisions.md:271,309`. **En edición ahora** | Mover juntos y conservando la profundidad relativa (`../../outbox-gpt/...`), o actualizar `D28_RUNNER_PATH` en un commit con revisión independiente, como manda D28. Nunca modificar el contenido de `run.mjs` para "limpiarlo" |
| C-2 | `agent-comms/outbox-gpt/harness-GPT-C01-COLLECTION-001/capture.mjs` + `outbox-claude/harness-C-01-ID-001/` + `outbox-gpt/harness-GPT-C07-VARIANTS-001/` | 6 + 165 + 14 KB | Pin `CAPTURE_SHA256` (`measure.mjs:45`) y ruta absoluta desde REPO (`:44`); C07 importa C01 | Igual que C-1: mover el trío en un solo commit y actualizar solo la constante de ruta. El hash no cambia si el contenido no cambia |
| C-3 | `cobertura-360-002.csv`, `.agents/teamwork/**`, `harness-AUDIT-360-001/`, `harness-AUDIT-360-002/` | 117 KB + 46 KB + 148 KB + 4,2 MB | Citados en `GEMINI-REPORT-AUDIT-360-00{1,2}.md`, `CLAUDE-REVIEW-GEMINI-AUDIT-360.md` y `BOARD.md:166-167`. Los scripts usan `process.cwd()` y rutas literales de raíz | Archivado propuesto, solo con autorización: `git mv` de los cuatro a `agent-comms/archive/audit-360/` (conservando nombres) + `agent-comms/archive/audit-360/README.md` con la tabla de rutas "antes -> ahora" y la advertencia de que se ejecutan con `cwd` = esa carpeta. No reescribir los informes (son evidencia): la tabla de redirección basta. Ningún pin afectado |
| C-4 | `harness-4D-001/`, `-4D-002/`, `-4D-003/`, `-4E-001/`, `-4E-002/`, `-4E-003/`, `harness-COMP-001/` (raíz) | 7,0 MB | Citados por `CLAUDE-REPORT-4D-00{1,2,3}.md`, `CLAUDE-REPORT-4E-00{1,2,3}.md`, `CLAUDE-MASTER-REMEDIATION-001.md`, `CLAUDE-REPORT-COMP-001.md`, `BOARD.md` (4E-002) y `.theme-check.yml:75` | El mismo patrón que C-3 -> `agent-comms/archive/harness-root/` con tabla de redirección. Ganancia: raíz limpia (9 carpetas menos). Riesgo medio (citas textuales). Si se hace, mantener `harness-*/**` en `.theme-check.yml` o sustituirlo por `agent-comms/**`, que ya cubre el destino |
| C-5 | `agent-comms/outbox-claude/harness-AUDIT-FINAL-002/lib.mjs`, `harness-AUDIT-FINAL-003/lib.mjs` | — | Importados por 30+ scripts de LEAD-001, MOTION-002, TECH-AUDIT-001 y GPT-018 | No mover nunca por separado |
| C-6 | `harness-LEAD-001/` (111,8 MB), `harness-MOTION-002/` (108,9 MB), `outbox-gemini/harness-TECH-AUDIT-001/` (31,6 MB) | 252 MB | Ledger `:56,57,115`, `BOARD.md:273,309,336`; los resultados JSON citan los PNG/PDF por nombre; importan `lib.mjs` | Como mucho, en el futuro: (a) Git LFS para `*.png *.jpg *.pdf` de `agent-comms/**` (`git lfs migrate import --include=…` **reescribe el historial**: requiere a Johandry y un force-push coordinado), o (b) publicar los binarios como asset de una Release de GitHub con su sha256 y dejar en el árbol un `MANIFEST.sha256`. Ninguna de las dos se propone ahora |
| C-7 | Planes v1, v2, v3, v4 y v4.1 de `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001` | 400 KB | Cada versión es objeto de una revisión formal (`CLAUDE-REVIEW-PLAN-SARTORIAL-00{1..4}`), con sha256 en `CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md:10` y `v4.1.md:573`; v4.1 es el plan rector (`BOARD.md:58,104`) | Si se quiere orden visual: `git mv` de v1-v4 a `agent-comms/outbox-gpt/superseded/` + una línea de redirección en v4.1. Los hashes de contenido se conservan (mover no cambia bytes), pero las rutas citadas quedan como históricas |
| C-8 | `.git/` (221 MB) | 221 MB | Es la historia | Solo `git filter-repo` / LFS migrate con autorización expresa; invalida SHAs y rompe `package-theme-zip --rev <sha antiguo>` y las citas `git show <sha>:…` de los informes. **No recomendado antes de la submission** |
| C-9 | `tests/` (`pdp-line-total.spec.mjs`, `vendor/axe.min.js`), `scripts/`, `playwright.config.mjs`, `package*.json`, `.nvmrc`, `.github/` | — | `ledger-verify.mjs:36` resuelve citas en `scripts/` y `tests/`; el ledger cita `tests/vendor/axe.min.js`; el CI hace `playwright test --list` | — |
| C-10 | `docs/requirements-ledger.md`, `docs/decisions*.md`, `docs/gate5-reports/**`, `docs/demo-*`, `docs/merchant/**`, `docs/figma/**`, `docs/design-tokens.json` | 3,5 MB | Ledger (filas `:31-85`), decisiones y publicación en GitHub Pages (`docs/merchant/*.html`, ledger `:115`) | Solo el índice `docs/README.md` (B-8) |
| C-11 | Archivos vacíos citados: `inbox-claude/CLAUDE-DIRECTIVE-AUDIT-FINAL-002.md`, `outbox-gpt/GPT-AUDIT-014-final-presets-certification.md`, `harness-GPT-018/role-08-legal/gsap-search.txt` | 0 B | Citados (§4); el vacío es en sí la evidencia | — |
| C-12 | Corridas fallidas `harness-AUDIT-FINAL-002/*.run1*` | ~100 KB | Incidente 429/503 narrado en `CLAUDE-REPORT-AUDIT-FINAL-002.md:344` | — |
| C-13 | Ramas `fix/argon-recently-viewed-edition`, `sprint/7B`, `sprint/F0`, `master`, `lote-e-claude`, tag `checkpoint-phase-3b-start` | — | Commits sin fusionar o rama base | Para `fix/argon`/`sprint/7B`, comprobar si `35b952c` es equivalente a `a34bd19` de master con `git range-diff` tras un `fetch`. Solo entonces, borrarlas |
| C-14 | Todo lo sin rastrear o modificado de §0 (cabecera) | — | Trabajo en curso de otros agentes | Lo cierran sus autores |

---

## 9. Verificación posterior (obligatoria tras B; recomendada tras A)

```bash
cd /home/user/Tema-Shopify
npm ci                                   # solo si se ejecutó A-6
npm run gates:json                       # 0 JSON inválidos (el recuento baja como mucho en los JSON movidos o borrados)
npm run gates:hooks
npm run gates:sanity                     # recrea .tmp/ y lo limpia
npm run gates:locales
npm run gates:ledger                     # 0 incoherencias; los localizadores no apuntan a nada de lo tocado
npm run gates:theme-check                # 0 ofensas; mismo recuento de archivos inspeccionados que antes
npm run gates:syntax
npx playwright test --list               # el paso del CI
# ZIP: reproducibilidad del commit base y contenido intacto en el HEAD nuevo
node scripts/package-theme-zip.mjs --rev 76dd94d --out /tmp/zip-base.zip \
  --expect-count 92 \
  --expect-sha256 fe096602adfcf3f311e43b794ede459716fc60a513904427e0b34b6b0a1636f4 \
  --expect-content-sha256 e280cd2b127fa71dc3736749ecc26c6e1f8fbba2de48cdba746032ee00422af4
node scripts/package-theme-zip.mjs --out dist/theme.zip \
  --expect-count 92 \
  --expect-content-sha256 e280cd2b127fa71dc3736749ecc26c6e1f8fbba2de48cdba746032ee00422af4
#   (el sha256 del ZIP del HEAD nuevo cambia por la fecha del commit: esperado. La huella de contenido NO.
#    Si entre tanto otro agente cambia el tema o release-notes.md, recalcular la base en ese commit.)
#   AVISO (2026-11-14): la huella e280cd2b… ya NO vale para el HEAD nuevo. Hay que recalcularla tras commitear
#   release-notes.md, assets/base.css y sections/main-collection.liquid (hoy modificados sin commitear), antes de la limpieza.
#   La comprobación `--rev 76dd94d` sigue valiendo.
# Pins
sha256sum agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs \
  | grep -q "$(sed -nE "s/.*D28_RUNNER_SHA256 = '([0-9a-f]+)'.*/\1/p" agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs)" && echo D28 OK
sha256sum agent-comms/outbox-gpt/harness-GPT-C01-COLLECTION-001/capture.mjs | grep -q ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb && echo CAPTURE OK
# Imports intactos (todas las rutas relativas siguen resolviendo)
node --check agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs
node -e "import('./agent-comms/outbox-claude/harness-AUDIT-FINAL-002/lib.mjs').then(()=>console.log('lib OK'))"
git status --short                       # solo los cambios previstos
git ls-files -i -c --exclude-standard    # tras B-3 debe seguir listando solo .agents/teamwork/** (decisión C-3)
```

Criterio de aceptación: todas las compuertas en verde, las huellas de contenido iguales a las de §2, los dos pins con "OK" y `git diff --stat` limitado a las rutas de B-1 a B-5 y B-8.

---

## 10. Resumen en cifras

- Rastreado: 2547 archivos / 291,7 MB. El tema son 95 archivos / 1,2 MB; `agent-comms/` 1856 / 275,3 MB (244,1 MB binarios); arneses de la raíz 413 / 10,7 MB; `.git` 221 MB.
- **Clase A**: 5 ítems seguros (A-1 a A-5), unos 9,7 MB locales (`dist` 281 KB, `.tmp` vacío, 4 sandboxes huérfanos de `/tmp` 7 MB, sandboxes de Lighthouse 2,4 MB **solo cuando termine el proceso vivo**), + `node_modules` 70 MB opcional al final.
- **Clase B**: 3 archivos sueltos sin referencias (≈4 KB), 6 `.gitkeep` opcionales, 6 resultados RA-RB huérfanos (≈1,7 MB, diferidos), 2 ramas borrables ya (`fix/revert-listings-exclusion`, `claude/nice-mendel-84sxat`) + 6 `lote-*` condicionadas a fusionar en master, y 6 ediciones de configuración y documentación.
- **Clase C**: 14 grupos protegidos (unos 280 MB): 2 pins SHA-256, 2 `lib.mjs` con 30+ importadores, 13 rutas `../../..`, evidencia del ledger/BOARD, planes v1-v4.1 con revisiones y sha256, y 3 ramas sin fusionar.
- Defectos de orden: README desfasado, sin `docs/README.md`, `agent-comms/README.md` desfasado, `AGENTS.md` con ruta rota y autoridad contradictoria con D24, BOARD con cabecera del 2026-11-05, la cita del ledger `harness-lv05/run.js` sin archivo y `.agents/` ignorado pero rastreado.
