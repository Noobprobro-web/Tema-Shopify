# REVIEW-F0-001: revisión adversarial del push de sprint/F0 (57b9ebf)

Revisor: cerebro (Claude en claude.ai), solo lectura. Fecha: 2026-10-19. Base: `origin/sprint/F0 @ 57b9ebfff7e7ec3436bba2878f9e2fbdea37385b`, padre `19190b1` (= `origin/master`). Árbol extraído con `git archive` a `scratchpad/review-f0/tree`; diff completo en `scratchpad/review-f0/f0.diff`; salida de compuertas en `scratchpad/review-f0/gates-static.log`.

## Veredicto: RECHAZADO (corrección en la misma rama; no hace falta revertir)

Motivo principal: BOARD.md:687 (línea nueva de este commit) escribe las contraseñas literales de las tiendas, contra la prohibición expresa de la orden, y el informe de Gemini afirma lo contrario (GEMINI-REPORT-F0-001:26 y :57). Además, el aplazamiento de la rotación y del repo privado a PREFLIGHT-001 (decisión de Johandry 2026-10-18) no quedó registrado: BOARD, decisions.md y el informe dicen lo opuesto. El resto son correcciones menores o medias. Tres órdenes pueden arrancar ya (ver al final).

## 1. Commit, padre, autor y archivos

| Comprobación | Resultado |
|---|---|
| `refs/heads/sprint/F0` en origin | `57b9ebf`, existe (hubo que hacer `git fetch origin +refs/heads/sprint/*`; el clon solo traía master) |
| Padre | `19190b1122c8` = `origin/master`; merge-base idéntico; un solo commit nuevo |
| Autor / committer | cuenta GitHub de Johandry (Noobprobro-web); autoría 18:50, commit 19:08 -0400 |
| Mensaje | `chore(F0): bootstrap phase 0, ...`; sin la línea `Refs:` que pide §3e del plan |
| Archivos | 22 (3 M, 19 A), coincide con lo declarado; `+4938 / -42` |
| Archivos del tema o de scripts/tests/package.json/.github | ninguno tocado (verificado con `git diff --name-status`) |
| Fuera de lo ordenado | `docs/PLAN-MAESTRO-ORQUESTACION.md`, `docs/plan-mejoras-contour.md`, `agent-comms/outbox-claude/PLAN-MAESTRO-ORQUESTACION.md` y `agent-comms/outbox-claude/revision-cruzada-gpt-claude.md` son copias duplicadas no pedidas (el plan queda 3 veces; la revisión cruzada 2 veces) |
| Rama `sprint/7B` | no existe en origin (la orden 5.1 paso 2 pedía crearla; CLAUDE-TASK-F0-002 y BOARD:751 la dan por existente) |

Ambos PARTE/informe de Gemini dicen "16 archivos" y "SHA pendiente de commit" (GEMINI-REPORT-F0-001:67-68): desactualizados frente al push real.

## 2. Secretos

Barrido sobre los 22 archivos (patrones: password/contraseña/storefront junto a dígitos, `shpat_`/`shpca_`/`shptka_`/`ghp_`/`figd_`, cookies `_shopify_*` con valor, `accessToken` con valor, correos, hex/base64 largos). Valores no copiados aquí.

| Archivo:línea | Qué hay | Severidad |
|---|---|---|
| `agent-comms/BOARD.md:687` | Línea NUEVA en este commit con las dos contraseñas literales de storefront entre comillas de código (comprobado: no existe en master; aparece como `+` en el diff) | CRÍTICA |
| `agent-comms/BOARD.md:368` | Mención histórica al fallback literal ya presente en master:366; no es nueva | informativa |
| Correos en `outbox-claude/comparativa-temas.md:136,153,195,222`, `plan-mejoras-contour.md:74,473`, `CLAUDE-REVIEW-CRUZADA-001.md:175` (y duplicados) | el `mailto` de soporte citado como hallazgo D-08 en documentos del propio cerebro; no es secreto | ninguna |
| Tokens, cookies con valor, PAT, `accessToken` con valor | ninguno encontrado | - |

Nota: el literal ya estaba en master en `scripts/gate5-*.mjs`, así que la exposición marginal es nula, pero la orden decía "nunca escribir contraseñas ni tokens" y el informe afirma "cero secretos expuestos".

## 3. AGENTS.md y agent-comms/README.md

Lo reescrito (AGENTS.md:3, 7-11; README completo) es coherente con el plan §3a. Los problemas están en lo que no se tocó: la orden pedía "reescribe solo Autoridad vigente y los nombres de modelo", y los nombres de modelo del resto del archivo quedaron viejos, de modo que el archivo se contradice.

| Archivo:línea | Contradicción | Severidad |
|---|---|---|
| `AGENTS.md:96-98` | "Gemini Flash 3.8 High toma las decisiones de arquitectura ... coordina las fases"; "Claude (Opus 5.5 Extra) es el implementador principal"; "GPT-6 Sol Max" frente a AGENTS.md:8-11 (Claude en claude.ai = cerebro; Claude Code = implementador) | ALTA |
| `AGENTS.md:53-62` | "Tareas ideales para Gemini": mantener el contexto maestro y convertir recomendaciones en prompts cerrados; ahora es del cerebro | MEDIA |
| `AGENTS.md:64,66,72` | "Tareas de Claude (Opus 5 - Implementador Principal)", "alcance escrito por Gemini", "crear commit/push solo cuando la directiva de Gemini ... lo autorice" frente a AGENTS.md:10 "sin commit, sin push, sin `git add`" | MEDIA |
| `AGENTS.md:74` | "GPT-5.6 Sol Max" frente a "Codex / GPT" en :11 | BAJA |
| `AGENTS.md:20,26,87` | "Gemini apruebe", "directiva de Gemini", "Gemini delega implementación": aceptable si se lee como "Gemini archiva y autoriza Nivel 2 técnico", pero conviene añadir "redactada por el cerebro" | BAJA |
| `agent-comms/README.md:9` | Declara `docs/PLAN-MAESTRO-ORQUESTACION.md` como "plan maestro vinculante"; esa copia ya está desactualizada (74 líneas distintas del plan local) y el plan lo mantiene el cerebro en el Project; el repo guarda copias archivadas | MEDIA |
| `agent-comms/README.md:19` | "Gemini y Codex realizan verificación adversarial" omite que Claude Code verifica lo de Gemini (AGENTS.md:10 y plan §1 fila F0) | BAJA |
| `agent-comms/RULES.md:5,8,101` (no modificado) | "Gemini Flash 3.8 High (arquitecto líder)", modelos viejos, "emite tareas (Gemini y GPT)" frente a AGENTS.md:8 (emite el cerebro). RULES §3.5 (Nivel 2 lo autoriza Gemini) y §4.7 (verifica un agente distinto) sí son coherentes | MEDIA (puede ir a una tarea aparte, dueño Gemini) |

## 4. BOARD.md §15 y tabla de correspondencia frente al plan local §1

| Archivo:línea | Hallazgo | Severidad |
|---|---|---|
| `BOARD.md:687` | Secreto literal (ver §2) | CRÍTICA |
| `BOARD.md:16`, `:686-687`, `:700`, `:726` | Rotación y repo privado como P0 inmediato y dentro de F0; el plan local los saca de F0 y los lleva a PREFLIGHT-001 (P1 rotación, P2 `filter-repo`, P3 conexión del repo al cerebro, P4 repo privado) | ALTA |
| `BOARD.md:704` | Fila PREFLIGHT-001 sin rotación, reescritura ni repo privado | ALTA (misma causa) |
| `BOARD.md:705` | Fila 7D incluye "`git filter-repo` y purga de historial"; el plan local lo quita de 7D | MEDIA |
| `BOARD.md:706-708` | Correspondencia errónea en el único punto donde la renumeración desplazó IDs: el borrador `CLAUDE-DIRECTIVE-8A-001` es la partición de `theme.js` (borrador :364) y `8B-001` la de `base.css` (borrador :454). En el plan unificado 8A = piloto lookbook (sin borrador previo), 8B = `theme.js` (viene de 8A-001), 8C = `base.css` (viene de 8B-001). No existe ningún `CLAUDE-DIRECTIVE-8C-001` en el borrador | ALTA (es el objeto de la tabla) |
| `BOARD.md:19`, `:735`, `:738-739` | Días desactualizados: 12 a 15 / 22 a 26 / PREFLIGHT 3-4; el plan local dice 12,5 a 16 / 22,5 a 27 / 3,5 a 5 | BAJA |
| `BOARD.md:674` | "Documento Maestro: docs/PLAN-MAESTRO-ORQUESTACION.md": apunta a la copia desactualizada | MEDIA |
| `BOARD.md:751` | F0-002 sobre `sprint/7B`, rama que no está en origin | MEDIA |
| `BOARD.md:755` | Fila GEMINI-F0-001 de "Archivos en vuelo" lista 5 archivos; Gemini tocó 22 (inbox-*, outbox-*, docs/PLAN-MAESTRO, docs/plan-mejoras) | BAJA |
| Resto de 15.2 (7A, 7B, 7C, 9A-9C, 10A, 10B←10C-001, 10C←10B-001, 11A, 11B←11A-001, PREFLIGHT-00n) | correcto frente al borrador y al plan | OK |
| Cabecera y línea 595 | fecha corregida; "CUMPLIDOS AL 100%" retirada (ahora :597); 0 apariciones restantes | OK |

## 5. docs/decisions.md

| Archivo:línea | Hallazgo | Severidad |
|---|---|---|
| `docs/decisions.md:248,250,254` | "Rotación obligatoria inmediata" y "privatizar el repositorio" como decisión del 2026-10-18 y rotación dentro de F0: es lo contrario de lo decidido por Johandry; la orden pedía registrar "rotación y repo privado al final (Johandry 2026-10-18)" | ALTA |
| `docs/decisions.md:240` | 7D "con `filter-repo` bajo ventana autorizada" (plan viejo) | MEDIA |
| `docs/decisions.md:239` | "Contour superó las revisiones técnicas oficiales de Shopify": sobredimensiona; `comparativa-temas.md:218` dice que el repo de Contour no guarda veredicto alguno de la Theme Store, solo rechazos técnicos de subida corregidos | BAJA |
| `docs/decisions.md:237` | Atribuye la decisión a "Johandry, Claude en claude.ai, Gemini en Antigravity, Codex"; Codex no participó; la decisión de referencia única es de Johandry | BAJA |
| Faltantes pedidos en la orden (punto 6) | No hay entrada para retiro de GSAP (MOTION-002), rechazo de Lenis, eliminación de marquee-drift, URLs en GitHub Pages (BOARD:142), ni una entrada explícita "numeración por sprint" ni "rotación y repo privado al final" | MEDIA |
| `docs/decisions.md:208-224` | Entradas 2026-10-02 (6A/6B/6C, Imprint) y 2026-10-17 (TEC2, layout de contraseña) reconstruidas desde BOARD; coherentes con BOARD §9-§14; firmantes con nombres de modelo viejos (aceptable por ser históricas) | OK |
| `docs/decisions.md:226` | Se cambió el título de una entrada ya existente ("única" → "inicial", "(Johandry)" → "(Johandry y GPT)"); un registro de decisiones no debería reescribir entradas previas | BAJA |

## 6. Órdenes emitidas frente a PLAN-MAESTRO §5 local

| Orden | ID, objetivo, archivos permitidos, no tocar, aceptación, informe | Corta, sin código | Depende de la rotación | Hallazgos |
|---|---|---|---|---|
| CLAUDE-TASK-F0-001 | completa | sí | no | Fiel al plan; `.nvmrc` = `22.12.0` (verificado); `ci.yml:27` hoy `node-version: 20`; pide `node-version-file: .nvmrc`. OK |
| CLAUDE-TASK-F0-002 | completa | sí | no | Fiel; omite "Fable 5.1 revisa package-theme y secrets-scan" (dice "revisión especializada"); `sprint/7B` (:8, :18) no existe en origin |
| CLAUDE-TASK-F0-003 | completa (escribe solo en reviews/) | sí | no | (a) El plan y la orden (:12) apuntan al trabajo de Gemini (GEMINI-TASK-F0-001), no al de Claude Code: no hay autoverificación. El riesgo es el rótulo ambiguo "F0-001" (GEMINI-REPORT:42, BOARD:752) y la frase "e integrado por Gemini": cuando Gemini integre el parche de CI de Claude Code en sprint/F0, la orden tal cual abarcaría también ese parche. Hay que nombrar `GEMINI-TASK-F0-001` y excluir `.github/workflows/ci.yml` (lo verifica Gemini, plan §1 fila F0). (b) El criterio :21 remite a "PLAN-MAESTRO-ORQUESTACION.md §3a"; la copia del repo es la vieja |
| GPT-TASK-F0-001 | completa | sí (un `process.env.X` inline, tolerable) | no: usa la contraseña vigente vía `STOREFRONT_PASSWORD`; Johandry debe exportarla antes | Pierde la referencia del plan a "el mismo mecanismo de `scripts/gate5-live-verify.mjs` sin editarlo" (:25); el resto es fiel y añade las URLs explícitas |
| GPT-TASK-F0-002 | completa | sí | no | Fiel |
| Las 5 | - | - | - | Todas llevan "Autoriza: Johandry (2026-10-18)"; en el plan solo la orden a Gemini llevaba esa línea. Ninguna trae Nivel 2, así que no hace daño, pero es una atribución que Gemini añadió por su cuenta |

## 7. Compuertas sobre la copia del árbol (Node 22.22, Shopify CLI 4.9.4)

`npm run gates:static`: 8/8, exit 0. json OK; hooks 22 contratos 0 rotos; sanity OK; locales 0 sin resolver / 0 huérfanas; ledger 60 filas 0 incoherencias; **Theme Check 92 archivos, 0 ofensas**; syntax OK; package genera `Sartorial-1.0.0.zip` (en la copia, no en el clon). Coincide con lo declarado. Log en `scratchpad/review-f0/gates-static.log`.

## 8. Copias en outbox-claude e inbox-gemini frente a /home/claude/

| Archivo del repo | Frente al local |
|---|---|
| `outbox-claude/comparativa-temas.md`, `plan-mejoras-contour.md`, `directivas-borrador-contour.md`, `estructura-repo.md` | idénticos (`cmp`) |
| `outbox-claude/CLAUDE-REVIEW-CRUZADA-001.md` y `outbox-claude/revision-cruzada-gpt-claude.md` | idénticos al local; están duplicados entre sí |
| `inbox-gemini/CLAUDE-BRIEF-ANTIGRAVITY-001.md` | idéntico |
| `inbox-gemini/CEREBRO-PLAN-001.md`, `docs/PLAN-MAESTRO-ORQUESTACION.md`, `outbox-claude/PLAN-MAESTRO-ORQUESTACION.md` | las 3 iguales entre sí y las 3 son la versión ANTERIOR del plan (74 líneas distintas: días, F0 sin rotación, PREFLIGHT-001 con P1-P5, 7D sin filter-repo, §3f nuevo, §7 decisiones) |
| `docs/plan-mejoras-contour.md` | idéntico al local; copia no pedida |

## 9. Inventario (`docs/inventario-herramientas.md`)

| Línea | Hallazgo | Severidad |
|---|---|---|
| :22, :25 | `harness-5B-001/` y `harness-AUDIT-FINAL-001/` listados en raíz; en el árbol están bajo `agent-comms/outbox-claude/` | MEDIA |
| matriz completa | Omite las 7 carpetas de raíz `harness-4D-001..003`, `harness-4E-001..003`, `harness-COMP-001` y unas 24 `harness-*` de `agent-comms/outbox-*` (hay 30 bajo agent-comms; el inventario cita 5) | ALTA (7D depende de esta lista; F0-003 exige "sin rutas omitidas") |
| :21 | `playwright.config.js`; el archivo real es `playwright.config.mjs` | BAJA |
| :30-33 | "Comando de verificación" es `Get-ChildItem`/`Test-Path` (existencia en PowerShell), no una prueba del consumidor; además no se verificó que `scripts/`, `tests/`, `.github/`, `package.json` y `playwright.config.mjs` no referencien ningún `harness-*` (comprobado aquí: 0 referencias) | MEDIA |

## 10. Informe de Gemini (`outbox-gemini/GEMINI-REPORT-F0-001-arranque.md`)

| Línea | Hallazgo | Severidad |
|---|---|---|
| :26, :57 | "cero secretos expuestos" / "Ningún archivo modificado contiene contraseñas": falso (BOARD:687) | ALTA |
| :71 | "Esperando que Johandry ejecute rotación de secretos y privatización de repo": contradice la decisión de aplazar | ALTA |
| :67-68 | "SHA pendiente de commit", "16 archivos": el push real es 57b9ebf con 22 | BAJA |
| :25 | "Eliminadas copias temporales duplicadas": quedan 3 copias del plan y 2 de la revisión cruzada | BAJA |

## 11. Dudas de Gemini

1. Rotación y privatización ya: **no**. Johandry lo aplazó el 2026-10-18 a PREFLIGHT-001 (P1 rotación, P2 `filter-repo`, P3 conectar el repo al cerebro, P4 repo privado). Lo único de hoy: Johandry exporta `STOREFRONT_PASSWORD` (la vigente) en las tres consolas; regenerar el PAT de Figma y la key de Composio es recomendado y no bloqueante. Gemini no debe condicionar ninguna orden de F0 a la rotación.
2. Worktrees `Tema-Shopify-claude` y `Tema-Shopify-codex` sobre `origin/sprint/F0`: **no tal cual**. Tres problemas frente a §3d: (a) Codex debe estar detached en el SHA que audita (`19190b1` para GPT-F0-002; GPT-F0-001 ni siquiera necesita árbol), no en una rama que va a moverse con los commits de Gemini; sobre `sprint/F0` perdería la base fija. (b) Git no permite la misma rama checked-out en dos worktrees, así que dos worktrees "sobre sprint/F0" solo funcionan si uno está detached; eso confirma que Codex va detached. (c) CLAUDE-TASK-F0-002 escribe en `sprint/7B`, no en `sprint/F0`; hace falta un segundo worktree de Claude Code sobre `sprint/7B` (o correr F0-002 después de F0-001 en el mismo worktree cambiando de rama, pero el plan prevé worktree por paquete). El nombre de carpeta da igual siempre que esté fuera de OneDrive y las órdenes y BOARD usen el mismo nombre; hoy las órdenes dicen `../ts-claude` y `ts-codex`. Regla "un archivo, un dueño" no se rompe porque cada herramienta escribe en su `outbox-*`, pero "un SHA fijo" sí.

## 12. Correcciones que Gemini debe aplicar en sprint/F0 antes de que arranquen F0-002, F0-003 y de que Johandry lea BOARD como verdad

1. `agent-comms/BOARD.md:687`: quitar los dos literales; dejar "rotar la contraseña del storefront de las 4 tiendas (valor solo por `STOREFRONT_PASSWORD`)". Opción recomendada si Claude Code aún no abrió `../ts-claude`: `commit --amend` y force push de `sprint/F0` en ventana exclusiva (§3d.7) para que el literal no entre al historial de la rama; si ya hay trabajo encima, commit normal y la purga queda para PREFLIGHT-001 P2.
2. BOARD.md:16, :686-687, :700, :704, :705, :726 y decisions.md:240, :248, :250, :254: registrar el aplazamiento (rotación, `filter-repo` y repo privado en PREFLIGHT-001 P1-P4, decisión de Johandry 2026-10-18 18:40); quitar rotación de F0 y de 7D; añadirlos a la fila PREFLIGHT-001. Actualizar días (12,5 a 16 / 22,5 a 27 / PREFLIGHT 3,5 a 5) en BOARD:19, :735, :738-739 y decisions:253.
3. BOARD.md:706-708: corregir la correspondencia: 8A = nuevo (piloto lookbook, sin borrador; origen plan-mejoras/revisión cruzada); 8B ← `CLAUDE-DIRECTIVE-8A-001` (theme.js); 8C ← `CLAUDE-DIRECTIVE-8B-001` (base.css).
4. Reemplazar las 3 copias del plan por la versión local actual de `/home/claude/PLAN-MAESTRO-ORQUESTACION.md` (la que incluye §3f y §7) y dejar UNA sola copia canónica: `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md`. Borrar `docs/PLAN-MAESTRO-ORQUESTACION.md`, `outbox-claude/PLAN-MAESTRO-ORQUESTACION.md`, `docs/plan-mejoras-contour.md` y `outbox-claude/revision-cruzada-gpt-claude.md`. Actualizar README.md:9 y BOARD.md:674 para apuntar a `inbox-gemini/CEREBRO-PLAN-001.md` y decir que el plan vivo lo mantiene el cerebro.
5. `AGENTS.md`: actualizar nombres de modelo y roles en :53 (título), :64, :66, :72, :74, :96-98 para que no contradigan :7-11 (la orden original ya lo permitía: "y los nombres de modelo"). Opcional: :20, :26, :87 añadir "redactada por el cerebro".
6. `docs/decisions.md`: añadir las entradas faltantes (MOTION-002 retiro de GSAP, rechazo de Lenis, eliminación de marquee-drift, URLs de docs en GitHub Pages, numeración por sprint, rotación y repo privado al final); rebajar :239 a "ha pasado varias rondas de corrección técnica frente a Shopify" y quitar a Codex de :237; restaurar el título original de :226.
7. `docs/inventario-herramientas.md`: incluir las 9 `harness-*` de raíz y todas las de `agent-comms/outbox-*` (30), corregir la ubicación de `harness-5B-001` y `harness-AUDIT-FINAL-001`, `playwright.config.mjs`, y sustituir `Get-ChildItem`/`Test-Path` por el comando que prueba al consumidor (por ejemplo `rg -n "harness-" scripts tests .github package.json playwright.config.mjs docs/requirements-ledger.md`).
8. `inbox-claude/CLAUDE-TASK-F0-003.md`: objetivo "verificación adversarial de GEMINI-TASK-F0-001 (commit 57b9ebf y su corrección)"; excluir expresamente `.github/workflows/ci.yml`; en :21 remitir a `inbox-gemini/CEREBRO-PLAN-001.md §3a` (versión actualizada). Actualizar BOARD:752 y GEMINI-REPORT:42 con el mismo rótulo.
9. Crear y pushear `sprint/7B` desde `master` (orden 5.1 paso 2); corregir CLAUDE-TASK-F0-002:8,18 y BOARD:751 si cambia el nombre del worktree.
10. `GEMINI-REPORT-F0-001`: corregir :26 y :57 (hubo un secreto, corregido en <sha>), :67-68 (SHA real, 22 archivos), :71 (rotación aplazada); añadir línea `Refs: GEMINI-TASK-F0-001` al mensaje del commit corrector.
11. BOARD.md:755: completar la fila GEMINI-F0-001 con todos los archivos tocados.
12. `GPT-TASK-F0-001:25`: reponer "con el mismo mecanismo de `scripts/gate5-live-verify.mjs`, sin editarlo".
13. Pendiente para una tarea aparte (no bloquea): RULES.md:5, :8, :101 con los roles y nombres nuevos; puede ir en 7B-T9.

## 13. Qué puede arrancar ya, sin esperar las correcciones

| Orden | Arranca ya | Condición |
|---|---|---|
| CLAUDE-TASK-F0-001 (CI, `ci.yml`) | sí | Si Gemini va a hacer amend + force push de `sprint/F0`, que lo haga antes de que Claude Code abra el worktree; si no, Claude Code arranca y Gemini corrige con commit normal |
| GPT-TASK-F0-002 (matriz) | sí | Solo lectura sobre `master @ 19190b1`, detached; no toca nada de F0 |
| GPT-TASK-F0-001 (línea base) | sí | Johandry exporta `STOREFRONT_PASSWORD` vigente en la consola de Codex; no depende de la rotación |
| CLAUDE-TASK-F0-002 (prep 7B) | no | Espera a que `sprint/7B` exista en origin y a la orden corregida del worktree |
| CLAUDE-TASK-F0-003 (verifica a Gemini) | no | Espera al commit corrector de Gemini y a la orden re-rotulada; si corriera hoy daría DEVOLVER por §2, §4 y §9 |
| GEMINI-TASK-F0-002 (3D en el editor) | no cambia | Espera el fixture 3D de Johandry |
