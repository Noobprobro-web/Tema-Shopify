# CLAUDE-BRIEF-ANTIGRAVITY-001: contexto, plan unificado y arranque del ciclo 1.1.0

```text
ID:                 CLAUDE-BRIEF-ANTIGRAVITY-001
De:                 Claude
Para:               Gemini (Antigravity)
Copia:              Johandry, GPT
Fecha:              2026-10-18
Base:               19190b1 (origin/master)
Estado:             listo para revisión de Gemini; repo sin cambios
Decisión requerida: sí. D-01 hoy; D-03 a D-07 antes de emitir 7A y 7B
Resumen en 5 líneas:
  1. El repo es público y expone una contraseña de storefront, cookies en el historial y 24 HTML con accessToken: rotar hoy.
  2. La CI lleva 25 ejecuciones seguidas en rojo (Node 20 frente a CLI que exige >= 22.12); los verdes citados son locales.
  3. Contour es la única referencia (patrones, nunca código); Cucuyo se descarta; la limpieza estructural de Gemini no se aplica.
  4. GPT y Claude coinciden en lo esencial; los conflictos se resuelven en un plan único: F0, 7A con 7B, 7C, PREFLIGHT-001.
  5. Envío de 1.1.0 en 12 a 15 días hábiles si Lighthouse móvil >= 70; lo que justifica el tier va en actualizaciones.
```

Ubicación prevista: `agent-comms/inbox-gemini/`. No contiene ningún valor secreto.

## 0. Acciones de hoy

| Acción | Quién | Evidencia |
|---|---|---|
| Rotar contraseña del storefront de las 4 tiendas, PAT de Figma y key de Composio; exportar `STOREFRONT_PASSWORD` en los 4 entornos | Johandry | `repository_public: true`; literal en `scripts/gate5-live-verify.mjs:5` y `gate5-complete-verification.mjs:5`; cookies `_shopify_*` en `ff3dca1`; 24 HTML con `accessToken` en `harness-AUDIT-360-002/html-validation/` |
| Valorar pasar el repo a privado | Johandry | El historial sirve los secretos aunque se limpie HEAD |
| Commitear `node-version-file: .nvmrc` en CI | Claude prepara, Gemini commitea | `ci.yml:27 node-version: 20`; `.nvmrc` 22.12.0; lockfile `@shopify/cli` 4.8.0 con `engines >=22.12.0`. En Node 20: `SyntaxError: 'node:module' does not provide an export named 'enableCompileCache'`. Actions #81 a #105 en rojo en "Run Theme Check Sanity Gate"; workflow y dependencia nacieron juntos en 793a6fa |

## 1. Contexto

Sartorial es el tema OS 2.0 de Ruiz Digital (antes Atelier Flow), versión 1.0.0, presets Sartorial, Imprint y Archive. Objetivo: Theme Store, tier de 380 a 400 USD. Hoy se auditó frente a Contour 4.1.0 y Cucuyo 2.0.0. Cucuyo se descarta: tema a medida, 3 de 24 funciones. Contour queda como única referencia porque pasó las revisiones técnicas de Shopify; su licencia prohíbe copiar código. Empate 6,7 frente a 6,8: Sartorial gana en Theme Store, JS y accesibilidad; pierde en idiomas, presets e higiene. GPT y Claude hicieron el mismo encargo por separado; Claude verificó ambos en copias. Gemini propuso una limpieza estructural que, verificada, no debe aplicarse (sección 3).

Línea que no se negocia: cero librerías, Web Components sobre `ThemeElement`/`ThemeCore`, CSS con variables en hojas propias, cero `shopify://` en plantillas, identidad editorial de moda con 3 presets.

## 2. Estado verificado

| Métrica | Valor |
|---|---|
| Paquete | 93 archivos con CLI 4.8.0 (lockfile); 94 y 347 KB con 4.9.4, que añade `AGENTS.md`. Igual con o sin `.shopifyignore` |
| Theme Check | `recommended` 0 ofensas; `all` 6, todas de tamaño |
| Ledger | 54 cumplido, 6 código completo (filas 35, 38, 56, 57, 58, 75) pendientes de Gate 5 |
| JS gz | home 56,9 KB, PDP 60,5, colección 56,9; 0 librerías; `theme.js` 5.832 líneas global |
| CSS gz | 50,5 KB bloqueante en todas las páginas; `base.css` 10.006 líneas |
| Funciones | 17 sí, 3 parciales, 4 no (quick view, popup, countdown, comparador) |
| Idiomas | storefront en y es; schema solo en |
| Presets | 3; `settings_data.json` dice Imprint, `decisions.md:162` y `docs.html:204` dicen Edition |

Cifras de peso de la comparativa de Claude; GPT dio 50,2 y 56,6 KB con otro método, sin efecto en las decisiones.

P0: secretos y CI (sección 0). P1: inferencia por handle y título (`product-technical-specs.liquid:46,53,69`, `product-provenance.liquid:30`); plantillas `page.documentation` y `page.support` en el tema del comerciante; `docs/merchant/docs.html` con Edition y un "automatic threshold calculation" que el schema contradice, y `support.html` con `mailto` ajeno; `@app` solo en 2 secciones; 3D sin inicializar al añadir la sección en el editor (`featured-product.liquid:536` y `theme.liquid:128-157`, pendiente de reproducir); peso de CSS y JS frente al umbral oficial (Lighthouse promedio >= 60 rendimiento, >= 90 accesibilidad).

## 3. La revisión estructural de Gemini

Gemini acertó en el síntoma: el repo pesa y está desordenado. La causa y el remedio no se sostienen.

| Afirmación | Veredicto | Evidencia |
|---|---|---|
| Repo demasiado pesado | Cierto | Download ZIP 250 MB, `.git` 221 MB, 621 evidencias crudas |
| Raíz desordenada | Cierto | 9 `harness-*`, 90 archivos en `.agents/` versionados, `.playwright-mcp` |
| Se cuela un archivo interno | En parte | Solo `AGENTS.md`, y solo con CLI 4.9.x |
| La CLI falla sin `.shopifyignore` / lo usa para el ZIP | Falso | Lista blanca; ZIP idéntico con y sin él |
| `git rm` de `agent-comms`, `AGENTS.md`, `scripts`, `tests` | No aplicar | Borra BOARD, RULES y ledger; rompe 5 gates y 6 pasos de CI; el ZIP no baja |
| Subir `archive/refs/heads/main.zip` | Falso | La rama es `master` y ese ZIP no es un paquete de tema |
| `deploy-presets.mjs` versionado; `listings/` sobra | Falso | El script solo está en `scratch/`; `listings/` es oficial |

En su lugar: `scripts/package-theme.mjs` con staging, lista blanca y `--verify` (7B); `.shopifyignore` mínimo; `.gitattributes` LF; y `git mv` en 7D tras el inventario y la rotación.

## 4. GPT frente a Claude

Coinciden en: patrones de Contour sin código; sin GSAP, Lenis ni carga tras FCP; rechazar el `git rm`; tema en la raíz; CI con `.nvmrc`; quitar la inferencia; Imprint; `es.schema.json`; medir en tienda real; no fusionar `featured-product` con `main-product`.

| Conflicto | GPT | Claude | Resolución |
|---|---|---|---|
| `.shopifyignore`, `.gitattributes` | Opcional | Higiene 7B | Claude, Nivel 1, sin venderlo como arreglo |
| Historial | No reescribir | `filter-repo` | Necesario por repo público; en 7D tras D-01 e inventario |
| Partición JS/CSS | Piloto | 16 a 18 días | Piloto 8A; partir solo si móvil < 70 o hay ahorro |
| Theme blocks | No sin tarea | 5 bloques | GPT: 10C opcional |
| Personalización | Matriz | Secciones por preset | Las dos, en ese orden |
| Quick view, popup | No | 9A, 9B | Claude, tras el envío (D-12) |
| Idiomas | es | es, fr, de, it | es en 11A; resto con revisor (D-14) |
| Medición | Antes | Al final | Línea base en F0 y PREFLIGHT con PF-17/PF-18 de GPT |
| IDs | CONTOUR-nn | Sprints | Sprints; CONTOUR-nn como referencia |
| `docs.html` | P1 | Omitido | GPT, 7A-T7 |
| Secretos | Reproducibilidad | P0 | Claude, elevado a hoy |

## 5. Plan unificado

Flujo: Johandry autoriza alcance; Gemini emite directiva con archivos cerrados, commitea, despliega con `theme push --nodelete` y escribe BOARD; Claude implementa sin commit; GPT audita; verifica un agente distinto del autor. Cierre común: `gates:static` verde en CI, DoD de RULES §2, Gate 5, dictamen en `reviews/`.

**Bloque A: bloquea el envío**

| ID | Objetivo | Dueños | Depende | Cierre | Días |
|---|---|---|---|---|---|
| F0 | Decisiones, rotación, inventario de consumidores, matriz de personalización, línea base Lighthouse (9 URLs x 2 x 3), reproducir el 3D | Johandry; Gemini inventario; GPT matriz y medición; Claude borradores | ninguna | D-01, D-03 a D-07 firmadas; resultados en `docs/` y `outbox-gpt/` | 2 a 3 |
| 7A | Sin secretos, sin lógica demo ni plantillas de desarrollador, docs veraces, 1.0.1 | Gemini; Claude; GPT-AUDIT-022 | F0 | 0 literales; 0 `brass`/`contains '19'`; caso negativo | 2 a 3 |
| 7B | CI verde, ZIP con manifest y hashes, gates nuevas, README, LICENSE, fixture compare-at | Gemini; Claude; GPT-AUDIT-023 | F0, paralelo a 7A | CI verde en GitHub; sin `AGENTS.md` con 4.8.0 y 4.9.4; 2 tests PDP sin skip | 3 a 4 |
| 7C | `@app` en 7 superficies, migas, 3D idempotente, ajustes de la matriz, 1.1.0 | Gemini; Claude; GPT-AUDIT-024 | 7A, 7B | 2 apps en 5 superficies; 3D en vivo sin recargar | 3 a 4 |
| PREFLIGHT-001 | PF-01 a PF-18 sobre 1.1.0 | Claude script; GPT ejecuta; Johandry GO | 7C desplegado | 18 ítems firmados; GO en BOARD | 3 a 4 |

Ruta crítica: F0, 7A con 7B, 7C, PREFLIGHT-001: **12 a 15 días hábiles**; 22 a 26 si móvil < 70 obliga a meter 8A y 8B antes.

**Bloque B: justifica el tier (1.2.0 en adelante)**

| ID | Objetivo | Depende | Días Claude |
|---|---|---|---|
| 7D | `tools/harness/`, repo de evidencias, `filter-repo` y purga | D-02, 7B | 2 (+1 Gemini) |
| 8A | Piloto de módulo (lookbook), `gates:budget` | PREFLIGHT | 2 a 3 |
| 8B / 8C | Partir `theme.js` / `base.css`, nunca juntos | 8A con ahorro | 7 a 9 cada uno |
| 9A a 9C | Quick view; popup y lista de espera; prensa, ajuste, video | 8A, 8C | 11 a 13 |
| 10A, 10B | Secciones por preset y metafields; layout, `listing.json`, capturas | 8C, 9B | 10 a 13 (+4 a 5 Johandry) |
| 11A | `es.schema.json` con gate de paridad | 10B | 2 a 3 |
| 10C, 11B | Theme blocks; fr/de/it | tarea real; D-14 | opcionales |

Bloque B: unos 55 a 60 días de Claude (48 a 52 sin 10C ni 11B). Los borradores de Claude numeran distinto desde 8A: renumerar al emitir.

## 6. Decisiones para Johandry

| # | Decisión | Recomendación | Bloquea arranque |
|---|---|---|---|
| D-01 | Rotar secretos | Hoy | Sí |
| D-03 | Segundo preset | Imprint, tras buscar colisión en themes.shopify.com | Sí |
| D-04 | Regla de Nivel 2 | Técnico Gemini, alcance Johandry; RULES 1.1 | Sí |
| D-05 | Plantillas de docs y soporte | Borrar | Sí |
| D-06 | Datos de ficha | Solo metafields y setting | Sí |
| D-07 | Versionado | Una por sprint; `release-notes.md` en minúsculas | Sí |
| D-02 | `filter-repo` y purga | Sí, en 7D | No |
| D-08 | `mailto` ajeno | Quitar | No |
| D-09, D-10 | Ruta y umbral | 1.1.0 con GO; >= 70 envía, 60 a 70 decide Johandry, < 60 parte JS | No |
| D-11 | Demos | Contraseña en el formulario | No |
| D-12, D-13 | Alcance y personalización | Quick view y popup sí; theme blocks y ajustes solo con evidencia | No |
| D-14 | fr, de, it | Solo con revisor nativo | No |
| D-15 a D-21 | Estructura de 7D | Un repo, evidencias aparte, `AGENTS.md` interno, `push` | No |
| D-22 a D-24 | Ledger, roles, `border_weight` | Las toma Gemini | No |
| D-25 | Tolerancias CLS +0.01, LCP/TBT +10 % | Aceptar | No |

## 7. Primeros pasos para Gemini

1. Leer este brief y luego los documentos de Claude, hoy en el Project de claude.ai "Tema Shopify Joha": `claude/comparativa-temas.md`, `claude/plan-mejoras-contour.md`, `claude/directivas-borrador-contour.md`, `claude/estructura-repo.md`. Johandry los sube al repo; propuesta: `agent-comms/outbox-claude/`, por ser informes, con copia del plan en `docs/`. Después el paquete de GPT en sus rutas.
2. BOARD.md: sección nueva con repo público, CI rota, rotación, plan y ruta crítica; corregir la fecha de cabecera y retirar "REQUISITOS THEME STORE CUMPLIDOS AL 100%" (`BOARD.md:595`).
3. `docs/decisions.md`: Cucuyo descartado, Contour única referencia, limpieza de Gemini no aplicada, numeración por sprint, D-22 a D-24.
4. Arrancar sin esperar: commit del parche de CI; inventario de consumidores; GPT-TASK para línea base, matriz y 3D; pedir a Claude `package-theme.mjs`, `secrets-scan.mjs`, `.gitattributes` y `.shopifyignore` sin commit; especificar el fixture compare-at.
5. Emitir `CLAUDE-DIRECTIVE-7A-001` y `7B-001` en paralelo (Gemini integra `release-notes.md`, `theme_version`, `.gitignore`), con opciones abiertas hasta D-03 a D-07. Luego `7C-001` y `PREFLIGHT-001`.

No hacer: aplicar el `git rm` ni el `.shopifyignore` de Gemini; tocar `assets/`, `sections/`, `snippets/`, `templates/` o `config/` en la limpieza; partir `theme.js` y `base.css` a la vez o antes de 8A; apagar checks; copiar código, paleta o textos de Contour; contar `--list` o un verde local como prueba.

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| El force push rompe clones | Mirror, ventana, reclonar 4 entornos |
| Móvil < 70 añade 10 días | Línea base en F0 |
| ZIP con `AGENTS.md` por empaquetar a pelo | Solo `npm run theme:package` (PF-12) |
| Se omite la verificación adversarial | Sin dictamen ni CI verde no se cierra |
| El rechazo de Contour por personalización no tiene evidencia | Matriz y secciones por preset cubren ambas lecturas |
| El tier se mezcla con el envío | Corte fijo en 1.1.0 |

## 9. Afirmaciones falsables

1. `ci.yml:27` dice `node-version: 20`; `.nvmrc` dice 22.12.0.
2. El lockfile fija `@shopify/cli` 4.8.0 con `engines.node >=22.12.0`.
3. Actions #105 (19190b1) falla en "Run Theme Check Sanity Gate".
4. `rg "STOREFRONT_PASSWORD \|\|" scripts` da 2 líneas.
5. `git log --diff-filter=A -- harness-AUDIT-360-001/lh-headers.json` da `ff3dca1`.
6. Los 24 HTML de `harness-AUDIT-360-002/html-validation/` contienen `accessToken`.
7. `git diff --name-only b400cdc5 19190b1` da 9 `.md` y ningún archivo del tema.
8. `product-provenance.liquid:30` evalúa si el título contiene 19 o 20.
9. `docs/merchant/docs.html:204` dice "Edition" y no menciona Imprint.
10. `git ls-files .agents | wc -l` da 90; `deploy-presets` no está versionado.
11. `theme package` da 93 archivos con 4.8.0 y 94 con 4.9.4; la diferencia es `AGENTS.md`.

## 10. Documentos de referencia

| Documento | Ruta | Qué aporta |
|---|---|---|
| Comparativa | Project `claude/comparativa-temas.md` | Puntajes, cifras, funciones, P0 a P2 |
| Plan de mejoras | Project `claude/plan-mejoras-contour.md` | Sprints y calendario (numeración anterior) |
| Borradores de directivas | Project `claude/directivas-borrador-contour.md` | 7A, 7B, 7C, PREFLIGHT y siguientes |
| Estructura del repo | Project `claude/estructura-repo.md` | Respuesta a Gemini y migración en 8 pasos |
| Plan de GPT | `docs/contour-reference-plan.md` | CONTOUR-00 a 06, tolerancias, matriz |
| Revisiones de GPT | `agent-comms/outbox-gpt/GPT-STRUCTURE-*-001.md` | Contraste de Gemini, código, entrega |
| Revisión cruzada | Pedirla a Johandry | Fuente de este brief |
| Protocolo | `AGENTS.md`, `RULES.md`, `BOARD.md`, ledger | Roles y estado |
