# CEREBRO-PLAN-001: plan maestro y modelo de orquestación de Sartorial

```text
ID:                 CEREBRO-PLAN-001 (archivo: PLAN-MAESTRO-ORQUESTACION.md)
De:                 cerebro (sesión de Claude en claude.ai)
Para:               Johandry; copia a Gemini (Antigravity), Claude Code y Codex vía repo
Fecha:              2026-10-18
Base:               origin/master 19190b1 (verificado con git fetch hoy; sin commits nuevos)
Fuente del plan:    revision-cruzada.md §6 y §7 (plan unificado y decisiones D-01 a D-25)
Estado:             vigente; la sección 5 está PENDIENTE de ajustar con la respuesta de Antigravity a CLAUDE-BRIEF-ANTIGRAVITY-001
Decisión requerida: sí. D-01 hoy; D-03 a D-07 y el modelo de orquestación antes de emitir 7A y 7B
```

## 0. Lectura en 30 segundos

El envío de Sartorial 1.1.0 a la Theme Store depende de cinco paquetes en serie: F0, 7A con 7B en paralelo, 7C y PREFLIGHT-001. Son 12,5 a 16 días hábiles si Lighthouse móvil da una mediana de 70 o más; 22,5 a 27 si hay que meter el piloto y la partición de JS antes. La rotación de la contraseña del storefront, la reescritura del historial y el paso del repo a privado se hacen al final, dentro de PREFLIGHT-001 (decisión de Johandry 2026-10-18). Todo lo demás (7D a 11B) sale como actualizaciones después del envío. Desde hoy esta sesión planifica y redacta órdenes; Gemini archiva, integra, commitea, despliega y escribe BOARD.md; Claude Code implementa sin commit; Codex audita y verifica; Johandry autoriza lo irreversible y lleva los mensajes.

Tres hechos del repo condicionan las órdenes:

| Hecho | Evidencia | Consecuencia para las órdenes |
|---|---|---|
| No hay `CLAUDE.md` versionado; `.gitignore` lo ignora, igual que `.codex/` y `.agents/` | `.gitignore` de 19190b1 | Si Johandry tiene un `CLAUDE.md` local, el cerebro no lo ve. Toda orden a Claude Code nombra `AGENTS.md` y `agent-comms/RULES.md` de forma explícita y no cuenta con que los cargue solo |
| `AGENTS.md` (Codex lo lee siempre) está desfasado: la introducción dice que Gemini es el cerebro y la lista pone a Claude como líder técnico temporal y a Gemini como consultor | `AGENTS.md:3` y `:7-11` | Hay que actualizar la sección "Autoridad vigente" antes de que Codex trabaje en serio (primera ola). Hasta entonces, cada orden a Codex dice quién manda |
| La CI solo corre en push a `master` y en PR a `master`, y hoy está rota (Node 20) | `ci.yml:3-8` y `:27` | La compuerta de CI de cada paquete es el PR de `sprint/<ID>` a `master`. El parche de Node es lo primero que se integra |

`agent-comms/README.md` también está desfasado (cita `status.md` y `GEMINI-LEAD-HANDOFF.md`); se corrige en 7B-T9 junto con RULES 1.1.

---

## 1. Plan completo en una vista

Nomenclatura del plan unificado: sprints `7A` a `11B` siguiendo BOARD (último cerrado: 6C); `CLAUDE-DIRECTIVE-<sprint>-001`; auditorías `GPT-AUDIT-0nn` desde 022; dictámenes `GEMINI-review-CLAUDE-<sprint>-001`. La columna "GPT" conserva el ID de `docs/contour-reference-plan.md`. "Verifica" es la verificación adversarial de RULES §4.7, siempre por un agente distinto del autor.

### 1.1 Bloque A: bloquea el envío

| Orden | ID | GPT | Objetivo | Implementa | Audita | Verifica | Commitea | Depende de | Días | Versión |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **F0** | CONTOUR-00 | Decisiones, inventario de consumidores, matriz de personalización, línea base Lighthouse, reproducción del 3D, parche de CI | Johandry (decisiones); Gemini (inventario, BOARD, AGENTS, decisions); Codex (línea base, matriz); Claude Code (parche CI, borradores Nivel 1 de 7B) | no aplica | Claude Code sobre Gemini; Gemini sobre Claude Code | Gemini | ninguna | 2 a 3 | 1.0.0 (sin cambio de tema) |
| 2 | **7A** | CONTOUR-01B | Repo y paquete sin secretos, sin lógica de catálogo demo, sin plantillas de desarrollador, docs veraces | Claude Code | Codex (GPT-AUDIT-022) | Gemini | Gemini | F0; D-01, D-03, D-05, D-06, D-07, D-08 | 2 a 3 | 1.0.1 |
| 2 | **7B** | CONTOUR-01A, 06 (gate) | CI verde de verdad, ZIP reproducible con manifest, gates nuevas, higiene, fixture compare-at | Claude Code (Gemini en T9) | Codex (GPT-AUDIT-023) | Gemini; Claude Code sobre la parte de Gemini | Gemini | F0; D-04, D-07, D-17, D-22; en paralelo con 7A | 3 a 4 | 1.0.2 |
| 3 | **7C** | CONTOUR-02 parcial, 04 (ajustes) | `@app` en 7 superficies, migas, ThemeCore, 3D idempotente, ajustes de la matriz | Claude Code | Codex (GPT-AUDIT-024, 2 apps reales) | Gemini | Gemini | 7A y 7B integrados; D-13 | 3 a 4 | 1.1.0 (candidato) |
| 4 | **PREFLIGHT-001** | CONTOUR-02, 06 (instalación) | PF-01 a PF-18 sobre 1.1.0; rotación de la contraseña del storefront, reescritura del historial y repo privado; GO/NO-GO | Claude Code (lista, script, recertificación); Johandry (rotación, conexión del repo, repo privado); Gemini (reescritura) | Codex ejecuta (GPT-AUDIT-025) | Gemini (mide PF-06 en un preset); Claude Code sobre la reescritura de Gemini | Gemini | 7C desplegado en las 6 instancias; D-10, D-11; `STOREFRONT_PASSWORD` exportada; OK escrito de Johandry para `filter-repo` y force push | 3,5 a 5 | 1.1.0 confirmada |
| 5 | Envío | no aplica | Subir `Sartorial-1.1.0.zip` en Partner Dashboard | Johandry | no aplica | no aplica | no aplica | GO ratificado; repo privado | 0,5 | 1.1.0 enviada |

### 1.2 Bloque B: justifica el tier (actualizaciones)

Versiones propuestas; cada sprint emitido sube un menor y se fijan al emitir.

| Orden | ID | GPT | Objetivo | Implementa | Audita | Verifica | Commitea | Depende de | Días | Versión |
|---|---|---|---|---|---|---|---|---|---|---|
| 6 | **7D** | CONTOUR-00, H6 | Repo ligero: `tools/harness/`, evidencias fuera (la reescritura del historial pasa a PREFLIGHT-001) | Claude Code (movimientos) | Codex | Gemini | Gemini | 7B; D-02, D-15 a D-21 | 2 | sin cambio de tema |
| 7 | **8A** | CONTOUR-03 | Piloto de módulo (lookbook) y `gates:budget` | Claude Code | Codex (red y editor) | Gemini (cascada) | Gemini | PREFLIGHT-001 (antes si PF-06 < 60) | 2 a 3 | 1.2.0 |
| 8 | **8B** | CONTOUR-03 ext. | Partir `theme.js` en núcleo y módulos | Claude Code | Codex (5 flujos y editor) | Gemini (Lighthouse antes y después) | Gemini | 8A con ahorro demostrado | 7 a 9 | 1.3.0 |
| 9 | **8C** | CONTOUR-03 ext. | Partir `base.css` | Claude Code | Codex (capturas) | Gemini (diff de capturas) | Gemini | 8B; nunca a la vez | 7 a 9 | 1.4.0 |
| 10 | PREFLIGHT-002 | CONTOUR-06 | Preflight de la actualización de monolitos | Claude Code | Codex firma | Gemini GO/NO-GO | Gemini | 8C | 2 | 1.4.0 enviada |
| 11 | **9A** | no aplica | Quick view con `<dialog>` y Section Rendering | Claude Code | Codex (GPT-TASK-028 antes) | Gemini | Gemini | 8A, 8C | 4 a 5 | 1.5.0 |
| 12 | **9B** | no aplica | Popup de newsletter y lista de espera por talla | Claude Code | Codex | Gemini | Gemini | 9A; D-12 | 3 a 4 | 1.6.0 |
| 12 | **9C** | CONTOUR-05 | Prensa, comparador de ajuste, video con fachada | Claude Code | Codex (GPT-TASK-030 antes) | Gemini | Gemini | 8C; en paralelo con 9B | 4 | 1.7.0 |
| 13 | PREFLIGHT-003 | CONTOUR-06 | Preflight de funciones de tier | Claude Code | Codex firma | Gemini | Gemini | 9B y 9C | 2 | 1.7.0 enviada |
| 14 | **10A** | CONTOUR-04, 05 | 2 secciones por preset, `fabric_specs`, metafields | Claude Code; Johandry contenido | Codex (GPT-TASK-031 antes) | Gemini | Gemini | 8C, 9B, 9C | 7 a 9 (+2 Johandry) | 1.8.0 |
| 15 | **10B** | CONTOUR-04, 06 | Layout por preset, `listing.json`, capturas, demos | Claude Code; Johandry contenido | Codex (GPT-TASK-033 antes) | Gemini (diff instalación/demo) | Gemini | 10A; D-24 | 3 a 4 (+2 a 3 Johandry) | 1.9.0 |
| 16 | **11A** | CONTOUR-04 (ES) | `es.schema.json` con gate de paridad | Claude Code | Codex (tono en el editor) | Gemini | Gemini | 10A, 10B | 2 a 3 | 1.10.0 |
| 17 | PREFLIGHT-004 | CONTOUR-06 | Preflight de presets e idioma | Claude Code | Codex firma | Gemini | Gemini | 11A | 2 | 1.10.0 enviada |
| opc. | **11B** | opcional | fr, de, it con revisión nativa | Claude Code; revisor externo | Codex | Gemini | Gemini | 11A; D-14 | 3 a 4 + revisión | 1.11.0 |
| opc. | **10C** | CONTOUR-00 opc. | Theme blocks, solo con tarea de comerciante documentada | Claude Code | Codex | Gemini | Gemini | 10A; tarea real | 3 a 4 | siguiente menor |

### 1.3 Ruta crítica y días

| Tramo | Paquetes | Días hábiles |
|---|---|---|
| Ruta crítica al envío | F0 (2 a 3) → 7A y 7B en paralelo (hasta 4) → 7C (3 a 4) → PREFLIGHT-001 (3,5 a 5, con rotación, reescritura y repo privado) → envío | **12,5 a 16** |
| Si PF-06 da < 60 en algún caso | se insertan 8A y 8B antes del envío | **22,5 a 27** |
| Si PF-06 da 60 a 70 | Johandry decide con la cifra en la mano | 12,5 a 27 |
| Reescritura del historial (`filter-repo`) | dentro de PREFLIGHT-001, después de la rotación y antes del repo privado; medio día de Gemini más reclonado | ya incluida en PREFLIGHT-001 (+0,5 a 1) |
| Bloque B sin 10C ni 11B | suma de la tabla 1.2 (incluye 3 preflights) | 47 a 58 de Claude, más 4 a 5 de Johandry |
| Bloque B si 8A no demuestra ahorro | se omiten 8B y 8C | restar 14 a 18 |

La ruta crítica real es la cadena de decisiones de Johandry: sin D-01, D-03 a D-07 firmadas, 7A y 7B no se emiten.

---

## 2. Desarrollo de cada paquete

### F0 Fase 0 (CONTOUR-00)
Johandry firma D-03 a D-07; como recomendación no bloqueante, revoca y regenera el PAT de Figma y la key de Composio. La rotación de la contraseña del storefront y el repo privado no van en F0: son pasos de PREFLIGHT-001. Claude Code prepara el parche de CI (`node-version-file: .nvmrc` en `.github/workflows/ci.yml`) y, en `sprint/7B`, los archivos Nivel 1 nuevos: `scripts/package-theme.mjs`, `scripts/secrets-scan.mjs`, `.gitattributes`, `.shopifyignore` y la especificación del fixture compare-at. Gemini archiva el brief, este plan y los documentos del Project; escribe la sección nueva de BOARD, `docs/decisions.md` y el inventario de consumidores (`docs/inventario-herramientas.md`); reproduce el 3D en el editor con el navegador de Antigravity. Codex mide la línea base (9 URLs x 2 dispositivos x 3 corridas sobre 1.0.0) y construye la matriz de personalización.
Cierre: D-01, D-03 a D-07 en `decisions.md` con fecha; CI con el paso Node en verde en un PR; informes de inventario, línea base, matriz y 3D en sus outbox.
Riesgo: que la CI, ya con Node 22, falle en un paso posterior (por ejemplo `gates:package` o Theme Check en el runner); se documenta como hallazgo y no frena el merge del parche.

### 7A Saneamiento (CONTOUR-01B)
T1 scripts `gate5-*` y `capture-presets.mjs` solo con variable de entorno y fail-closed. T2 sacar del índice los 24 HTML con `accessToken` y ampliar `.gitignore`. T3 borrar `page.documentation`, `page.support`, `main-documentation`, `main-support`, sus claves y su CSS. T4 `product-technical-specs.liquid` y `product-provenance.liquid` solo con metafields o setting, con caso negativo (handle `brass` sin metafields no pinta nada). T5 Imprint en ledger y decisiones. T6 `theme_version` 1.0.1 y `release-notes.md`. T7 `docs/merchant/docs.html` sin Edition ni "automatic threshold calculation"; `support.html` sin `mailto` ajeno.
Cierre: `rg "STOREFRONT_PASSWORD \|\|" scripts` = 0; `rg "brass|paperweight|contains '19'" snippets` = 0; 15 plantillas JSON; ficha correcta con y sin metafields en las 3 demos; GPT-AUDIT-022 y GEMINI-review-CLAUDE-7A-001.
Riesgo: páginas de las tiendas que usan `page.documentation` o `page.support` quedan huérfanas; Johandry las reasigna antes del push.

### 7B CI, paquete y compuertas (CONTOUR-01A y 06 gate)
T8 primero (si no entró en F0). T2b `package-theme.mjs` con staging en `os.tmpdir()`, lista blanca, manifest con sha256 por archivo y `--verify`, enganchado a `theme:package` y `gates:package`. T1 `.gitattributes`, T2 `.shopifyignore` mínimo, T3 a T5 README, DEVELOPMENT, LICENSE. T6 layout (preconnect, preload de fuentes, favicon, skip link). T7 gates: `shopify://`, pasos de `range`, `richtext`, máximo 25 secciones, `secrets-scan`, `syntax` con glob, paridad de locales, `ledger-verify` con columna ID. Fixture compare-at y paso de CI que corra los 2 tests PDP cuando haya credenciales. T9 (Gemini): decisiones retroactivas, RULES 1.1, AGENTS.md, README de agent-comms.
Cierre: CI de GitHub con todos los pasos en verde por primera vez; "Manifest OK"; sin `AGENTS.md` en el ZIP con CLI 4.8.0 y 4.9.4; `gates:static` 10/10.
Riesgo: choque con 7A en `.gitignore`, `theme_version` y `release-notes.md` (ver 3d); tests PDP sin credenciales en CI quedan como descubrimiento, nunca como prueba.

### 7C Extensibilidad y editor (CONTOUR-02 parcial, 04 ajustes)
`@app` en `main-collection`, `main-cart-items`, `cart-drawer`, `header`, `footer`, `main-page` y `main-article`. Migas en `snippets/breadcrumbs.liquid` sin JS. `applyBackgroundInert` y `motionAllowed()` en `ThemeCore` (`assets/theme.js`, con revisión de Fable 5.1). Inicialización 3D idempotente con `shopify:section:load` en `featured-product.liquid` y `layout/theme.liquid` si F0 lo reprodujo. Los 2 o 3 ajustes que la matriz justifique (espaciado local en una sección piloto, columnas móviles) si D-13 los autoriza. `theme_version` 1.1.0.
Cierre: 2 apps reales visibles en 5 superficies; migas con teclado y lector a 390 px; sección con modelo 3D añadida en vivo en el editor funciona sin recargar; `gates:hooks` sin contratos rotos.
Riesgo: tocar el núcleo de `theme.js`; un subagente por sección y T3 después de T1.

### PREFLIGHT-001 (CONTOUR-02 y 06 instalación)
Claude Code escribe `docs/theme-store-preflight.md` (PF-01 a PF-18), `scripts/preflight.mjs` (`gates:preflight`, fuera de `gates:static`) y recertifica las 6 filas en `código completo`. Codex ejecuta sin leer antes el informe de Claude Code: Lighthouse 3 presets x 3 plantillas x 2 dispositivos x 3 corridas, axe en 16 plantillas con estados ocultos, PF-17 matriz de navegación y PF-18 instalación limpia y actualización por preset. Gemini mide PF-06 en un preset. Johandry hace PF-01, PF-02, PF-16 y ratifica.
Con las mediciones hechas (con la contraseña vigente) y antes del GO/NO-GO y del envío, en este orden:

| Paso | Quién | Qué | Listo cuando |
|---|---|---|---|
| P1 | Johandry | Rotar la contraseña del storefront en sartorial-atelier, sartorial-edition, sartorial-archive y tema-qkqpke0j: una distinta y larga por tienda, entregada solo por la variable `STOREFRONT_PASSWORD` en cada consola | Las 4 tiendas abren con la nueva y rechazan la anterior; ningún valor en chat, documentos ni scripts |
| P2 | Gemini, con OK escrito de Johandry; verifica Claude Code | Reescribir el historial en ventana exclusiva (§3d.7) con una sola pasada de `git filter-repo` y la lista completa de rutas de estructura-repo §5: evidencias crudas pesadas (`agent-comms/**/*.{png,jpg,jpeg,pdf,har}`, `harness-*/**/*.{png,jpg,pdf}`, `**/raw-*.json`, `docs/gate5-reports/lh-*.json`), los `harness-*/html-validation/**` con `accessToken`, `agent-comms/outbox-claude/harness-REVIEW-AUDIT-360/vnu-24-paginas.json` y `harness-AUDIT-360-001/lh-headers.json` con las cookies; en la misma pasada, el blob con el PAT de Figma y la key de Composio que cita BOARD.md. Antes: mirror de respaldo y copia de los crudos a `sartorial-evidence`. Después: force push, reclonado de los 4 entornos, purga en GitHub Support | `du -sh .git` < 30 MB; `git log --all -- harness-AUDIT-360-001/lh-headers.json` vacío; ningún PNG ni PDF en `git rev-list --objects --all`; CI verde tras reclonar; SHA nuevo de 1.1.0 en el dossier |
| P3 | Johandry | Conectar el repo a la sesión del cerebro en claude.ai | El cerebro hace `git fetch` por la conexión |
| P4 | Johandry | Pasar el repo a privado | GitHub lo muestra privado y el cerebro sigue leyendo |
| P5 | Gemini | Reconstruir `Sartorial-1.1.0.zip` sobre el SHA nuevo con `--verify` y escribir el GO/NO-GO en BOARD | "Manifest OK"; GO/NO-GO firmado |

Cierre: 18 ítems con evidencia y firma; P1 a P5 hechos; GO/NO-GO en BOARD. Regla D-10: mediana móvil >= 70 en los 9 casos envía; 60 a 70 decide Johandry; < 60 abre 8A.
Riesgo: demos con contraseña bloquean la medición; la exportación de `STOREFRONT_PASSWORD` en cada consola es requisito y tras P1 hay que reexportar la nueva. El force push rompe clones y worktrees y cambia todos los SHA; nadie trabaja durante la ventana. Si P4 va antes que P3, el cerebro pierde la lectura del repo.

### 7D Estructura e historial
`git mv` de las 9 `harness-*` y `cobertura-360-002.csv` a `tools/harness/`, `.agents/teamwork` a `agent-comms/archive/`, borrar `.playwright-mcp`; 621 crudos a `sartorial-evidence` con la línea "Evidencia cruda" en los informes; `gates:weight`; `scripts/deploy/` si Johandry entrega los scripts de `scratch/` (D-18). Sin reescritura de historial: la purga de los crudos pesados, los `html-validation` con `accessToken` y `lh-headers.json` ocurre en la única pasada de `git filter-repo` de PREFLIGHT-001 (paso P2), después de la rotación; 7D no necesita otra ventana.
Cierre: `gates:static` igual que antes; `git archive` < 10 MB; CI verde.
Riesgo: rutas movidas que rompen consumidores (scripts, CI, `playwright.config`); el inventario de F0 es la lista de control.

### 8A Piloto de modularidad (CONTOUR-03)
`lookbook.js` y `lookbook.css` propios, cargados desde la sección con `defer` estático; en `design_mode` carga todo. `scripts/js-budget.mjs` como `gates:budget`. Medición antes y después con tolerancias D-25 (CLS +0,01, LCP y TBT +10 %) y 10 ciclos de añadir, duplicar, reordenar y borrar en el editor.
Cierre: una página sin lookbook no pide sus assets; bytes bajan; sin regresión visual; informe con decisión de seguir o no.
Riesgo: bajo; el precedente es `product-zoom.js`.

### 8B Partición de theme.js
Núcleo de 10 KB gz o menos con helpers, `ThemeElement`, `ThemeCore` y diálogos; 15 módulos IIFE por sección (`cart-drawer.js`, `predictive-search.js`, `product.js`, `facets.js`, `motion.js`, etc.); `featured-product` sin `VariantSelects` completo. Fable 5.1 fija la arquitectura antes de los módulos; un subagente por módulo.
Cierre: `gates:budget` dentro de umbrales; 28 custom elements definidos en su plantilla; 0 errores de consola en 16 plantillas x 3 presets; sección con JS añadida en vivo se inicializa.
Riesgo: medio alto por volumen; HTML del cajón por Section Rendering sin `<script>`.

### 8C Partición de base.css
Primero mover los parches tardíos a su componente, `color-mix()` en lugar de los 9 hex de movimiento, revisar los 47 `!important`; luego hojas por sección con `stylesheet_tag` y hojas de movimiento por estilo. Un commit por hoja para poder revertir una sola.
Cierre: `theme-check:all` sin ofensas de tamaño; 96 capturas sin diferencias fuera de tolerancia; `!important` < 47.
Riesgo: alto, la cascada cambia de orden; nunca abierto a la vez que 8B.

### 9A Quick view
`sections/quick-view.liquid`, `snippets/quick-view-dialog.liquid` en `layout/theme.liquid`, `assets/quick-view.js` con `<dialog>` y Section Rendering; setting global `quick_view`. Antes, GPT-TASK-028 fija el contrato de UX.
Cierre: abrir, cambiar variante, añadir y cerrar con Escape, teclado y lector en tema-qkqpke0j; sin JS lleva a la ficha; axe con el diálogo abierto.
Riesgo: doble `<variant-selects>` en la ficha; filtrar eventos por `section_id`.

### 9B Popup y lista de espera
`sections/overlay-group.json`, `newsletter-popup.liquid` y su JS (retraso mínimo 3 s, nunca antes del LCP ni en password, cart o políticas); lista de espera por talla con formulario de contacto etiquetado. Se aparta del mandato "solo Contour": lo justifica el tier (D-12).
Cierre: Lighthouse de home no baja más de 2 puntos; contacto `waitlist` visible en Admin.
Riesgo: hallazgo típico de revisión si tapa el LCP o no tiene cierre accesible.

### 9C Prensa, ajuste, video
`press-quotes.liquid`, `fit-comparison.liquid` (tabla con `scope`, primera columna fija) y `campaign-video.liquid` con fachada; hojas propias; sin JS salvo la fachada. Antes, GPT-TASK-030.
Cierre: 0 peticiones a YouTube o Vimeo antes del clic; tabla navegable a 390 px.
Riesgo: bajo.

### 10A Secciones por preset
Dos secciones por preset (Sartorial: `atelier-process`, `fabric-library`; Imprint: `drop-calendar`, `look-index`; Archive: `provenance-ledger` y la que fije GPT-TASK-031), `fabric_specs` sustituye a `technical_specs`; Johandry crea metafields y contenido. Criterio de promoción de GPT: pregunta real del comprador, contenido real, estado vacío diseñado.
Cierre: cada sección con contenido real en su demo y estado vacío en tienda limpia; `gates:locales` en paridad.
Riesgo: medio; seis fuentes nuevas de estados degenerados.

### 10B Layout por preset, listado y demos
`settings_data.json` por preset dentro de pasos de `range`, `listings/<preset>/templates` con las secciones de 10A, `listing.json`, capturas 2000x2496, 750x1334 y 1600x1200, demos actualizadas. Copy del listado tras GPT-TASK-033.
Cierre: diff `listings/<preset>/templates` contra `theme pull` de cada demo = solo imágenes; gate de listing y PNG en verde.
Riesgo: cambiar ancho y fuentes mueve todo el layout de Imprint y Archive; capturas de regresión.

### 11A Español del editor
Consolidar 62 etiquetas repetidas en `sections.all`, `scripts/locale-scaffold.mjs`, `locales/es.schema.json`, gate con 0 `null` y 0 cadenas idénticas al inglés fuera de lista blanca.
Cierre: editor en español sin cadenas en inglés (captura) y una sección añadida y configurada en ES.
Riesgo: bajo; inventario de claves congelado tras 10B.

### 11B fr, de, it (opcional)
Solo si Johandry contrata revisión nativa (D-14). Mismo scaffold y glosario.
Cierre: revisión nativa firmada; "5 languages" en el listado solo entonces.
Riesgo: calidad en idiomas que el equipo no habla.

### 10C Theme blocks (opcional)
5 bloques genéricos y `@theme` en las secciones nuevas, solo con una tarea de comerciante documentada que los bloques locales no resuelven.
Cierre: añadir, reordenar y borrar bloques anidados sin errores; preview de 16 plantillas.
Riesgo: cambia el flujo de eventos del editor.

### PREFLIGHT-00n
Misma lista y mismo script antes de cada actualización enviada (tras 8C, 9C y 11A). Dossier con SHA, theme ID, antes y después. Codex firma, Gemini da GO/NO-GO, Johandry ratifica. Un fallo abre un hotfix `HF-nn` (versión de parche, por ejemplo 1.1.1) con su directiva.

---

## 3. Modelo de orquestación

### 3a. Roles

| Rol | Hace | No hace |
|---|---|---|
| **Cerebro** (esta sesión en claude.ai) | Mantiene este plan; redacta directivas completas y órdenes cortas; lee el repo con `git fetch` (ramas, informes, diffs, `git grep` sobre la ref) y la página pública de Actions; revisa informes contra el código; decide aceptar, devolver o escalar; propone decisiones a Johandry | No escribe en el repo ni en tiendas; no commitea; no ve archivos ignorados ni el disco de la laptop; su revisión no sustituye la verificación adversarial formal de RULES §4.7, la complementa; nunca recibe secretos |
| **Gemini en Antigravity** (arquitecto y orquestador en el repo) | Único escritor de `agent-comms/BOARD.md`; archiva las directivas en `inbox-*`; crea ramas y worktrees; commitea, abre PR, mergea y pushea; despliega con `theme push --nodelete` (tema de desarrollo sin pedir; demos live con OK de Johandry); escribe `docs/decisions.md`, `AGENTS.md`, `RULES.md`; verifica adversarialmente lo de Claude Code (`reviews/GEMINI-review-CLAUDE-<ID>.md`); usa el navegador de Antigravity para pruebas en el editor; autoriza Nivel 2 técnico por escrito en la directiva | No reescribe el contenido de una entrega sin anotarlo en su review; no implementa código del tema salvo integración de cruces; no verifica su propio trabajo; no ejecuta lo irreversible sin autorización escrita de Johandry; si discrepa del cerebro, no cambia la orden: la devuelve como objeción |
| **Claude Code** (implementador) | Implementa exactamente la lista cerrada de archivos de su directiva, con un subagente por tarea; corre compuertas; escribe `outbox-claude/CLAUDE-REPORT-<ID>.md` con la cabecera de RULES §1.4, su `.diff` y su `harness-<ID>/`; verifica adversarialmente lo que escribe Gemini (`reviews/CLAUDE-review-GEMINI-<ID>.md`) | Sin commit, sin push, sin `git add`, salvo autorización escrita; no toca BOARD, decisions ni archivos fuera de lista; Nivel 2 no autorizado se detiene y se reporta; hallazgos fuera de alcance van con diff a "Hallazgos extra" |
| **Codex** (auditor de producto, UX y comercio; verificador adversarial independiente) | Audita sobre un SHA fijo y en la tienda de desarrollo; mide (Lighthouse, axe); escribe solo en `outbox-gpt/` y `outbox-gpt/harness-GPT-<ID>/`; en preflight trabaja sin leer antes el informe del autor | No toca código del tema, scripts, tests ni config; sin commit ni push; no guarda evidencias crudas pesadas en el repo; no audita algo que haya escrito él |
| **Johandry** (dueño) | Decide D-01 a D-21 y D-25; autoriza Nivel 2 de alcance, despliegue a demos live, borrado de plantillas, cambios de versión, `filter-repo`, force push, visibilidad del repo, envío; rota secretos y los exporta como variable de entorno (la contraseña del storefront y el repo privado, en PREFLIGHT-001); trabaja en Admin (fixtures, metafields, contenido); lleva órdenes y partes entre chat y herramientas | No pega secretos en el chat ni en órdenes; no edita el repo a mano mientras haya un paquete abierto |

Nivel 1 y Nivel 2 (D-04, regla dividida, pendiente de firma): Nivel 1 lo implementa Claude Code y lo documenta. Nivel 2 técnico (un `id`, un `default`, opciones de un select, archivo fuera de lista) lo autoriza Gemini por escrito en la directiva. Nivel 2 de alcance (función nueva, setting visible, borrar plantillas, versión) lo autoriza Johandry y Gemini lo transcribe con fecha. El cerebro marca en cada directiva qué Nivel 2 trae y quién lo firma.

### 3b. Ciclo de un paquete

| Paso | Quién | Qué pasa | Listo cuando |
|---|---|---|---|
| 1. Redacción | Cerebro | Escribe la directiva completa (formato de directiva del repo, cabecera con "Redacta: cerebro") y las órdenes cortas por herramienta; comprueba que ningún archivo de su lista esté en vuelo en otro paquete | IDs asignados; lista cerrada de archivos; criterios medibles; Nivel 2 listado con firmante; decisiones de las que depende ya firmadas o con las dos opciones escritas |
| 2. Autorización | Johandry | Lee la directiva y autoriza el alcance si trae Nivel 2 de alcance | "Autorizo <ID>" en el chat o en la orden a Gemini |
| 3. Emisión | Gemini | Archiva la directiva en `inbox-<agente>/`, crea `sprint/<ID>` desde `master` y los worktrees, añade el paquete a "Archivos en vuelo" en BOARD, commitea y pushea la rama | El cerebro ve la directiva en `origin/sprint/<ID>` con el mismo contenido |
| 4. Implementación | Claude Code | Johandry pega la orden corta; Claude Code lee AGENTS, RULES y la directiva, implementa en su worktree, corre `gates:static`, escribe informe y diff, imprime el PARTE | Informe con cabecera RULES §1.4; cada criterio con comando y salida; `gates:static` exit 0; árbol sin archivos fuera de lista (`git status` pegado) |
| 5. Integración | Gemini | Commitea código e informe en `sprint/<ID>`, pushea, abre PR a `master`, despliega la rama al tema de desarrollo de tema-qkqpke0j | PR abierto; CI del PR corrida; theme ID y SHA desplegados en el PARTE |
| 6. Verificación y auditoría | Gemini y Codex (en paralelo) | Gemini escribe `reviews/GEMINI-review-CLAUDE-<ID>.md` intentando falsar cada afirmación; Codex audita sobre el SHA y en tienda, escribe `GPT-AUDIT-0nn`; Gemini commitea ambos en la rama | Dos dictámenes con veredicto ACEPTAR o DEVOLVER y afirmaciones falsables numeradas |
| 7. Revisión del cerebro | Cerebro | `git fetch`, lee informe, review, auditoría, diff contra `master`, estado de CI; repite los `rg` de aceptación sobre la ref | Decisión escrita: aceptar, devolver con `-002`, o escalar a Johandry |
| 8. Cierre | Gemini | Mergea el PR, pushea `master`, despliega a las 3 demos si Johandry lo autoriza, actualiza BOARD (sección del sprint, filas del ledger, archivos en vuelo) y `decisions.md` | `master` contiene el merge; CI de `master` verde; BOARD actualizado; el cerebro lo confirma con `git fetch` |
| 9. Replan | Cerebro | Actualiza este plan (estado, días reales, desvíos) y redacta el siguiente paquete | Plan con fecha nueva en el Project |

Devolución: una corrección es una directiva `-002` sobre la misma rama, con solo lo que falló. Tres devoluciones del mismo paquete escalan a Johandry.

### 3c. Canal de ida y vuelta

Formato del parte que Johandry pega en este chat (cada herramienta lo imprime al final; Johandry lo copia tal cual):

```text
PARTE <ID>
Herramienta: Claude Code | Codex | Antigravity
Estado: listo | parcial | bloqueado | objeción
Rama y SHA: sprint/<ID> @ <sha corto> | sin commit
Archivos tocados: <n> (<lista corta o "ver informe">)
Compuertas: gates:static <n/n> exit <x>; CI PR #<n> <verde | rojo en paso X | no corrida>
Informe: <ruta en agent-comms>
Dudas o decisiones: <una línea por punto, o "ninguna">
```

| Situación | Qué pega Johandry |
|---|---|
| Gemini ya pusheó la rama o `master` con el informe dentro | Solo el PARTE de Gemini (rama y SHA bastan); el cerebro lee el resto del repo |
| Claude Code o Codex terminaron y Gemini aún no integró | El PARTE de la herramienta; el cerebro espera al push para revisar el detalle, salvo que el estado sea "bloqueado" u "objeción" |
| Bloqueo, objeción o pregunta de una herramienta | PARTE más el texto literal de la duda |
| Respuesta de Antigravity a un brief o plan | El texto completo de la respuesta (o la ruta si lo dejó en `outbox-gemini/` y pusheó) |
| Algo que la herramienta hizo fuera de lo pedido | Aviso inmediato, aunque no haya parte |
| Nunca | Contraseñas, tokens, cookies, valores de `.env`, contenido de archivos ignorados con secretos |

El repo pasa a privado al final, en PREFLIGHT-001 (paso P4). Antes (paso P3), Johandry conecta el repo a esta sesión de claude.ai para que el cerebro no pierda la lectura; si la conexión falla, Johandry pega informes completos.

### 3d. Reglas contra choques

1. **Un archivo, un paquete abierto.** Cada directiva lleva lista cerrada; BOARD mantiene una tabla "Archivos en vuelo" (paquete, archivos, herramienta). El cerebro no emite una directiva que solape esa tabla.
2. **Dueños fijos por carpeta:**

| Ruta | Dueño exclusivo |
|---|---|
| `agent-comms/BOARD.md`, `docs/decisions*.md`, `AGENTS.md`, `agent-comms/RULES.md`, `agent-comms/README.md`, `agent-comms/inbox-*/`, `outbox-gemini/`, `reviews/GEMINI-*` | Gemini |
| `outbox-claude/`, `reviews/CLAUDE-*` y los archivos que liste su directiva | Claude Code |
| `outbox-gpt/` (incluido `harness-GPT-*`), `reviews/GPT-*` | Codex |
| Shopify Admin, secretos, ajustes de GitHub | Johandry |

3. **Un worktree por herramienta, fuera de OneDrive.** Gemini trabaja en el clon principal; Claude Code en `../ts-claude` sobre `sprint/<ID>` (un worktree por paquete si 7A y 7B corren a la vez, con dos sesiones de Claude Code); Codex en `../ts-codex` en modo detached sobre el SHA que audita. Nadie ejecuta `checkout`, `reset`, `stash` ni `clean` en un worktree ajeno.
4. **Archivos de cruce.** Cuando dos paquetes paralelos necesitan el mismo archivo, uno es dueño y el otro deja el cambio descrito en su informe para que Gemini lo aplique. En 7A con 7B: 7A es dueño de `config/settings_schema.json` (`theme_version`), `release-notes.md` y `.gitignore`; 7B de `package.json` y `ci.yml`. Gemini integra en el orden 7A, 7B.
5. **Integra solo Gemini**, por PR a `master`; resuelve conflictos y lo anota en su review.
6. **Despliegue solo desde Gemini**: la rama del paquete al tema de desarrollo para Gate 5; las demos live solo desde `master` y con OK de Johandry.
7. **Ventanas exclusivas** para `filter-repo` y force push: ninguna herramienta abierta; al terminar, se reclonan los worktrees. La única ventana prevista es PREFLIGHT-001 paso P2, después de la rotación.

### 3e. Convención de nombres

| Artefacto | Patrón | Ejemplo |
|---|---|---|
| Orden pegada en una herramienta (chat) | `ORDEN <ID> para <herramienta>` | ORDEN CLAUDE-DIRECTIVE-7A-001 para Claude Code |
| Directiva de sprint para Claude Code | `inbox-claude/CLAUDE-DIRECTIVE-<sprint>-<nnn>.md` (correcciones `-002`, `-003`) | CLAUDE-DIRECTIVE-7A-002.md |
| Tarea suelta para Claude Code (F0, verificaciones) | `inbox-claude/CLAUDE-TASK-<ID>.md` | CLAUDE-TASK-F0-001.md |
| Informe de Claude Code | `outbox-claude/CLAUDE-REPORT-<ID>.md`, `.diff`, `harness-<ID>/` | CLAUDE-REPORT-7A-001.md |
| Encargo a Codex | `inbox-gpt/GPT-TASK-<NNN>-<slug>.md`; en F0 `GPT-TASK-F0-<nnn>-<slug>.md` | GPT-TASK-F0-001-linea-base.md |
| Informe de Codex | `outbox-gpt/GPT-AUDIT-<NNN>-<slug>.md` (auditoría) o `GPT-REPORT-<NNN>-<slug>.md` (medición o brief); mismo número que el encargo | GPT-AUDIT-022-saneamiento-7a.md |
| Encargo a Gemini | `inbox-gemini/GEMINI-TASK-<ID>-<slug>.md` | GEMINI-TASK-F0-001-arranque.md |
| Informe de Gemini | `outbox-gemini/GEMINI-REPORT-<ID>-<slug>.md` | GEMINI-REPORT-F0-001-arranque.md |
| Dictámenes | `reviews/<VERIFICADOR>-review-<AUTOR>-<ID>.md` en minúscula `review` | GEMINI-review-CLAUDE-7A-001.md, CLAUDE-review-GEMINI-F0-001.md |
| Documentos del cerebro | `CEREBRO-<TIPO>-<nnn>`, archivados por Gemini en `inbox-gemini/` | CEREBRO-PLAN-001.md (este), CEREBRO-REVIEW-7A-001.md |
| Rama | `sprint/<ID>` | sprint/7A, sprint/F0 |
| Commit | `<tipo>(<ID>): <resumen>` y línea `Refs: <directiva>` | fix(7A): remove handle inference from product specs |
| Filas del ledger | prefijo de sección de F0-07 (A, P, X, C, S, L) | L-06 |
| Hotfix tras preflight | `HF-<nn>`, versión de parche | HF-01, 1.1.1 |

El brief ya entregado conserva su nombre `CLAUDE-BRIEF-ANTIGRAVITY-001`; desde ahora `CLAUDE-*` en el repo significa Claude Code y `CEREBRO-*` esta sesión.

### 3f. Reglas para todas las herramientas

| # | Regla | Aplica a |
|---|---|---|
| 1 | No escribir secretos nuevos en chats, documentos ni scripts; solo variables de entorno | Cerebro, Gemini, Claude Code, Codex y Johandry |

---

## 4. Plantillas de órdenes

Cortas, sin código de ejemplo, con el mínimo contexto. El detalle vive en la directiva archivada; la orden solo apunta a ella. Los campos entre `< >` los rellena el cerebro.

### 4.1 Antigravity (Gemini)

```text
ORDEN <ID> para Antigravity
Redacta: cerebro. Autoriza: Johandry <fecha> | no requiere.
Objetivo: <una línea>.
Lee: AGENTS.md, agent-comms/RULES.md, <directiva o adjunto>.
Haz: <acciones numeradas: archivar, rama y worktrees, integrar, PR, desplegar a dev, BOARD>.
Archivos permitidos: <lista cerrada>.
No toques: código del tema salvo integración de lo entregado; nada fuera de la lista; demos live sin OK de Johandry; nada irreversible.
Aceptación: <criterios medibles>; rama y SHA pusheados.
Informe: agent-comms/outbox-gemini/GEMINI-REPORT-<ID>-<slug>.md y sección en BOARD. Termina con el PARTE de CEREBRO-PLAN-001 §3c.
Si discrepas, no cambies la orden: responde "objeción" en el PARTE con el motivo.
```

### 4.2 Claude Code

```text
ORDEN <ID> para Claude Code
Lee AGENTS.md, agent-comms/RULES.md y agent-comms/inbox-claude/<ID>.md. Manda la directiva.
Objetivo: <una línea>.
Trabaja en <worktree>, rama <rama>. Sin commit, sin push, sin git add.
Archivos permitidos: <lista cerrada>.
No toques: todo lo demás, BOARD.md, docs/decisions*.md. Ningún secreto en archivos ni en el informe.
Nivel 2 autorizado: <lista | ninguno>. Otro Nivel 2: detente y repórtalo.
Aceptación: <criterios medibles>; npm run gates:static exit 0.
Subagentes: uno por tarea; <modelo por tarea si aplica>.
Informe: agent-comms/outbox-claude/CLAUDE-REPORT-<ID>.md con cabecera RULES §1.4 y .diff. Termina con el PARTE.
```

### 4.3 Codex

```text
ORDEN <ID> para Codex
Lee AGENTS.md, agent-comms/RULES.md §1.4 y §4, y agent-comms/inbox-gpt/<ID>.md.
Objetivo: <una línea>.
Base: <rama> @ <SHA> en <worktree>; tienda <tema y theme ID>. <No leas el informe del autor hasta terminar.>
Escribe solo en: agent-comms/outbox-gpt/<archivo> y outbox-gpt/harness-GPT-<ID>/ (sin crudos pesados).
No toques: código del tema, scripts, tests, config, BOARD.md. Sin commit ni push. Credenciales solo por variable de entorno.
Aceptación: <qué debe contener>; veredicto ACEPTAR o DEVOLVER; afirmaciones falsables numeradas.
Informe: <ruta>. Termina con el PARTE.
```

---

## 5. Primera ola: F0

**PENDIENTE de ajustar con la respuesta de Antigravity.** Si Gemini renumera IDs, cambia el reparto de F0 o propone otra mecánica de ramas, el cerebro reescribe estos bloques antes de que Johandry los pegue. En F0 se usa la vía rápida: la orden pegada vale como encargo y Gemini archiva una copia en el `inbox-*` correspondiente al integrar.

Orden de pegado: 5.4 (Johandry) en paralelo con 5.1; luego 5.2a y 5.3a y 5.3b a la vez; 5.2b cuando Gemini haya archivado los documentos; 5.1b cuando haya fixture 3D; 5.2c cuando Gemini haya pusheado F0-001.

### 5.1 Antigravity

```text
ORDEN GEMINI-TASK-F0-001 para Antigravity
Redacta: cerebro. Autoriza: Johandry 2026-10-18 (modelo de orquestación y roles en AGENTS.md).
Objetivo: arrancar F0 del plan unificado sin tocar código del tema.
Lee: AGENTS.md, agent-comms/RULES.md, CLAUDE-BRIEF-ANTIGRAVITY-001 y CEREBRO-PLAN-001 (te los pasa Johandry).
Haz:
1. Archiva en inbox-gemini/ el brief y CEREBRO-PLAN-001.md; en outbox-claude/ los 4 documentos del Project (comparativa-temas, plan-mejoras-contour, directivas-borrador-contour, estructura-repo) y la revisión cruzada como CLAUDE-REVIEW-CRUZADA-001.md. Antes, busca patrones de secreto en esos archivos.
2. Crea sprint/F0 y sprint/7B desde master. Worktrees fuera de OneDrive: ../ts-claude en sprint/F0 y ../ts-codex detached en master.
3. Cuando Claude Code entregue CLAUDE-TASK-F0-001 (CI): commit en sprint/F0, PR a master, espera la CI. Si el paso de Node pasa, mergea aunque falle un paso posterior y anota cuál.
4. BOARD.md: sección nueva con repo público, CI rota, rotación de la contraseña del storefront y repo privado aplazados a PREFLIGHT-001, plan y ruta crítica, modelo de orquestación (cerebro, tú, Claude Code, Codex, Johandry) y tabla "Archivos en vuelo". Corrige la fecha de cabecera y retira la línea de requisitos cumplidos al 100 % (BOARD.md:595).
5. AGENTS.md: reescribe solo "Autoridad vigente" y los nombres de modelo según CEREBRO-PLAN-001 §3a. Nada más del archivo.
6. docs/decisions.md: Cucuyo descartado, Contour única referencia, limpieza estructural no aplicada, numeración por sprint, modelo de orquestación, rotación y repo privado al final (Johandry 2026-10-18), y las decisiones que Johandry firme hoy con su fecha.
7. docs/inventario-herramientas.md (nuevo): cada ruta fuera del tema (harness-*, .agents, .playwright-mcp, cobertura-360-002.csv, docs/gate5-reports, outbox-*/harness-*, scripts, tests) con sus consumidores (scripts, CI, package.json, playwright.config, ledger) y el comando que lo prueba.
Archivos permitidos: los nombrados arriba.
No toques: assets, sections, snippets, templates, config, layout, locales, scripts, tests; ni tu limpieza estructural propuesta.
Aceptación: rama sprint/F0 pusheada con los archivos; PR de CI con resultado; BOARD y AGENTS sin otros cambios.
Informe: outbox-gemini/GEMINI-REPORT-F0-001-arranque.md. Termina con el PARTE.
```

```text
ORDEN GEMINI-TASK-F0-002 para Antigravity
Redacta: cerebro. Requiere: producto con modelo 3D en tema-qkqpke0j (fixture de Johandry).
Objetivo: reproducir o descartar el fallo del 3D en el editor de temas.
Haz: con el navegador de Antigravity, en el editor del tema de desarrollo Sartorial (#166186909939), añade en vivo una sección featured-product con el producto 3D y cambia un setting de main-product en la plantilla de producto. Observa si model-viewer recibe su interfaz y si hay errores de consola, sin recargar.
Escribe solo en: outbox-gemini/GEMINI-REPORT-F0-002-3d-editor.md. Capturas fuera del repo; en el informe, ruta local y hash.
No toques: ningún archivo del tema ni del repo fuera de ese informe.
Aceptación: veredicto reproducido o no reproducido para cada superficie, con pasos, consola y capturas citadas.
Termina con el PARTE.
```

### 5.2 Claude Code

```text
ORDEN CLAUDE-TASK-F0-001 para Claude Code
Lee AGENTS.md y agent-comms/RULES.md.
Objetivo: que la CI use la versión de Node de .nvmrc.
Trabaja en ../ts-claude, rama sprint/F0. Sin commit, sin push, sin git add.
Archivos permitidos: .github/workflows/ci.yml.
No toques: nada más. Si ves otro paso que fallará en CI, va a Hallazgos extra con su diff.
Aceptación: el paso de setup de Node lee .nvmrc; con Node 22.12 local, npm ci y npm run gates:static con salida pegada; diff de una o dos líneas.
Informe: agent-comms/outbox-claude/CLAUDE-REPORT-F0-001.md con cabecera RULES §1.4 y .diff. Termina con el PARTE.
```

```text
ORDEN CLAUDE-TASK-F0-002 para Claude Code
Lee AGENTS.md, agent-comms/RULES.md y, en outbox-claude/, directivas-borrador-contour (7B tareas 2.1, 2.2, 2.2b y 2.7) y estructura-repo §3.
Objetivo: dejar listos los archivos nuevos Nivel 1 de 7B y la especificación del fixture compare-at.
Trabaja en un worktree de sprint/7B. Sin commit, sin push, sin git add.
Archivos permitidos (todos nuevos): scripts/package-theme.mjs, scripts/secrets-scan.mjs, .gitattributes, .shopifyignore.
No toques: package.json, ci.yml, .gitignore ni ningún archivo existente; no ejecutes renormalize.
Aceptación: package-theme con --verify da "Manifest OK", manifest con sha256 por archivo y ZIP sin AGENTS.md con el CLI del lockfile (y con 4.9.x si está instalado), con prueba negativa; secrets-scan falla hoy en los 2 scripts gate5 sin imprimir valores; .shopifyignore sin patrones de carpeta; informe con producto y variante exactos que necesita tests/pdp-line-total.spec.mjs para no saltarse el segundo test.
Subagentes: uno por archivo; Fable 5.1 revisa package-theme y secrets-scan.
Informe: agent-comms/outbox-claude/CLAUDE-REPORT-F0-002.md con cabecera RULES §1.4. Termina con el PARTE.
```

```text
ORDEN CLAUDE-TASK-F0-003 para Claude Code
Lee agent-comms/RULES.md §4 y outbox-gemini/GEMINI-REPORT-F0-001-arranque.md en origin/sprint/F0.
Objetivo: verificación adversarial de lo que escribió Gemini en F0-001.
Trabaja en solo lectura sobre origin/sprint/F0.
Escribe solo en: agent-comms/reviews/CLAUDE-review-GEMINI-F0-001.md.
Aceptación: cada afirmación de Gemini comprobada con comando y salida; AGENTS.md coincide con CEREBRO-PLAN-001 §3a; BOARD sin cambios fuera de la sección nueva, la fecha y la línea 595; inventario sin rutas omitidas; veredicto ACEPTAR o DEVOLVER.
Termina con el PARTE.
```

### 5.3 Codex

```text
ORDEN GPT-TASK-F0-001 para Codex
Lee AGENTS.md y agent-comms/RULES.md §1.4 y §4.
Objetivo: línea base de Lighthouse de 1.0.0 antes de cambiar nada.
Base: las 3 demos de BOARD.md §14.1 (sartorial-atelier, sartorial-edition, sartorial-archive); home, una colección y una ficha en cada una; móvil y escritorio; 3 corridas; mediana.
Acceso: STOREFRONT_PASSWORD de entorno, con el mismo mecanismo de scripts/gate5-live-verify.mjs sin editarlo.
Escribe solo en: agent-comms/outbox-gpt/GPT-REPORT-F0-001-linea-base.md. Crudos fuera del repo; en el informe, ruta local y hash.
No toques: nada del repo. Sin commit ni push.
Aceptación: tabla de 18 medianas de rendimiento y accesibilidad; versiones de Lighthouse y Chrome y modo de throttling; URLs exactas; casos por debajo de 70 y de 60 marcados; qué no demuestra la medición frente al dataset oficial.
Termina con el PARTE.
```

```text
ORDEN GPT-TASK-F0-002 para Codex
Lee AGENTS.md, agent-comms/RULES.md §4 y docs/contour-reference-plan.md (CONTOUR-04).
Objetivo: matriz de personalización de Sartorial.
Base: master @ 19190b1 en ../ts-codex, solo lectura de schemas en sections/, blocks/, config/settings_schema.json.
Escribe solo en: agent-comms/outbox-gpt/GPT-REPORT-F0-002-matriz-personalizacion.md.
No toques: nada más. Sin commit ni push.
Aceptación: por tarea de comerciante, control (global, sección o bloque), propagación, herencia, móvil y persistencia; marca lo que solo se confirma en el editor; 2 o 3 ajustes candidatos con herencia que conserve el aspecto actual y criterio "dos composiciones originales en un preset sin código".
Termina con el PARTE.
```

### 5.4 Johandry, hoy

Aplazado por decisión de Johandry (2026-10-18 18:40): la rotación de la contraseña del storefront y el paso del repo a privado van al final, en PREFLIGHT-001 (pasos P1 a P4).

- [ ] Exportar `STOREFRONT_PASSWORD` (la vigente) como variable de entorno en las consolas de Antigravity, Claude Code y Codex. Nunca en un archivo del repo ni en el chat.
- [ ] Recomendado, no bloqueante: revocar y regenerar el PAT de Figma y la API key de Composio, que según BOARD.md están en un blob del `.git` del repo público. Los valores nuevos, solo como variable de entorno.
- [ ] Firmar en el chat D-03 (Imprint), D-04 (Nivel 2 dividido), D-05 (borrar plantillas de docs y soporte), D-06 (solo metafields, con la lista de claves), D-07 (una versión por sprint y `release-notes.md`). Recomendado también D-08 (quitar el `mailto`) y D-17 (`AGENTS.md` interno).
- [ ] Autorizar el modelo de orquestación de §3 y la reescritura de "Autoridad vigente" en `AGENTS.md`.
- [ ] Decir si existe un `CLAUDE.md` local en la carpeta del repo (está en `.gitignore`) y, si existe, pegar su contenido aquí.
- [ ] Pasar a Antigravity el brief, este plan, los 4 documentos del Project y la revisión cruzada.
- [ ] Pegar aquí la respuesta de Antigravity al brief.
- [ ] Cuando se pueda: un producto con modelo 3D en tema-qkqpke0j (para F0-002) y el fixture compare-at que especifique Claude Code.

---

## 6. Qué revisa el cerebro cuando llegue la respuesta de Antigravity

| # | Qué buscar | Qué hace el cerebro |
|---|---|---|
| 1 | Aceptación, cambios o rechazo por paquete (F0, 7A, 7B, 7C, PREFLIGHT-001, bloque B) | Aplica los cambios a las tablas de §1 y a días y dependencias |
| 2 | Renumeración de IDs: GPT-AUDIT-022 a 025 frente a los encargos de F0; numeración 8A a 11B frente a los borradores antiguos; prefijos del ledger; uso de `CEREBRO-*`; hotfixes `HF-nn` | Fija una tabla de equivalencias única y reescribe las órdenes de §5 |
| 3 | Decisiones que Gemini quiera tomar (D-22 a D-24) o elevar a Johandry | Las mueve a la lista de Johandry o las da por cerradas en `decisions.md` |
| 4 | Conflictos con BOARD.md: Claude como líder temporal (LEAD-001) frente al cerebro; la línea del 100 %; TEC2-01..06 sin directiva; AF-12 de `layout/password.liquid` | Decide qué corrige la sección nueva de BOARD y qué espera a 7B-T9 |
| 5 | Objeciones a la mecánica: worktrees, PR como compuerta de CI, deploy de la rama a desarrollo, vía rápida de F0 | Ajusta §3b y §3d |
| 6 | Capacidades reales: navegador para el editor, `gh` disponible, worktrees fuera de OneDrive, qué archivos de reglas carga Antigravity (AGENTS.md, GEMINI.md, `.agents/`) | Reparte de nuevo las tareas de editor y medición si falta algo |
| 7 | Si mantiene o retira su limpieza estructural (`git rm`, `.shopifyignore` amplio) | Si la mantiene, la eleva a Johandry con la evidencia del brief §3 |
| 8 | Scripts de `scratch/` (D-18) y estado real del despliegue | Decide si 7B-T12 o 7D los recoge |
| 9 | Commits o pushes hechos desde 19190b1 | `git fetch` y diff antes de dar por buena cualquier afirmación |
| 10 | Disponibilidad y orden que propone para 7A y 7B | Recalcula la ruta crítica |

Unión rápida: el cerebro contesta en un solo mensaje con la tabla de cambios aceptados, la primera ola reescrita y la lista de decisiones que siguen abiertas.

---

## 7. Decisiones del plan

| Fecha | Decisión | Decide | Efecto en el plan |
|---|---|---|---|
| 2026-10-18 18:40 | Rotación y repo privado al final (decidido por Johandry 2026-10-18) | Johandry | Salen de F0 y del checklist de hoy; pasan a PREFLIGHT-001 (P1 rotación, P2 `filter-repo`, P3 conexión del repo al cerebro, P4 repo privado), antes del GO/NO-GO y del envío; 7D ya no reescribe historial; ruta crítica 12,5 a 16 días |
