# CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001

Revisión independiente de la auditoría comparativa de Antigravity (Sartorial frente a Atelier, anexo Cucuyo). Solo lectura en todas las fuentes. Sin cambios en el plan de GPT, el tema, Git ni tiendas. No se abrieron archivos .secrets. Ningún valor de contraseña se copia aquí: donde aparece uno se dice "literal de contraseña".

| Campo | Valor |
|---|---|
| Fecha | 2026-10-30 |
| Revisor | Claude, revisor independiente |
| Documento revisado | `agent-comms/outbox-gemini/GEMINI-AUDIT-COMPARATIVA-001.md` (31.876 B, 224 líneas, sha256 `7e2184f2d521e1514b10135c0eea34d9799ac3db59027c7b042a6cf15dbe25a0`, mtime 2026-10-30 04:36 UTC). Declara estado COMPLETO, 20 hallazgos verificados y 3 supuestos |
| Línea base | Plan V3 (`GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v3.md`, sha256 `ff08f71d…85d7fc`), revisión 003 (`CLAUDE-REVIEW-PLAN-SARTORIAL-003.md`, sha256 `23a1b990…500345`), revisión previa de Antigravity (`CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001.md`, sha256 `edb36c72…be1f9`), maestras Claude MASTER, LIVE e INITIAL (búsqueda por ID) |
| Código contrastado | ZIP integrado en `/home/claude/themes/sartorial-zip`; checkout conectado "Tema Shopify" en `b45e913` (rama local `sprint/F0`) y, por `git show`, el SHA que Antigravity dice auditar, `09f834295074402d9b93aa8ead83a732d78e6608`; Atelier `1576d06` en `/home/claude/sebastiandev017/atelier`; Cucuyo `727c0d4` en `/home/claude/sebastiandev017/cucuyo` (solo para contrastar el anexo) |
| Veredicto | **La comparativa no aporta ningún hallazgo nuevo de Sartorial.** De sus 20 hallazgos, 11 ya están en el plan V3, 7 son de Atelier (fuera de alcance por plan §1) y 2 quedan refutados; los 3 supuestos no son verificables. Los dos P0 siguen refutados. Al revisar de nuevo GEM-G-001 apareció evidencia nueva que no aporta Antigravity y que cambia el encuadre de M2 y de 0-01 (§2.2). La matriz 71/71 no está sustentada |

---

## 1. Clasificación

Categorías: (a) ya en plan V3, con tarea; (b) en nuestras auditorías pero no en el plan; (c) nuevo y confirmado en código; (d) refutado; (e) no verificable. En (b) se separa b1 (Sartorial, va a GPT) de b2 (Atelier, excluido por plan §1).

### 1.1 Tabla P0 y P1 de Antigravity (§5.1)

| ID | Sev. AG | Cat. | Tarea V3 | Verificación propia y evidencia |
|---|---|---|---|---|
| GEM-B-001 | P0 | **d** | Ninguna | Refutado de nuevo. Guarda previa de tipo de medio en Liquid: `sections/main-product.liquid:47` filtra `zoom_images = product.media \| where: 'media_type', 'image'`; los disparadores solo se pintan para `media.media_type == 'image'` (`:85-93`, índice `data-zoom-open` contado sobre imágenes); `:788` pasa solo `zoom_images` al snippet; `snippets/product-zoom.liquid:12` documenta "video y 3D no se amplian" y `:60-73` pinta un `<img>` en cada `[data-zoom-slide]`, con `src` GIF en línea desde el HTML. `featured-product.liquid` no monta el visor (grep). Idéntico en `09f8342`, `b45e913` y ZIP (en `09f8342` y `b45e913`, `assets/product-zoom.js:78-88` es el `layout()` citado). Ver §2.1 |
| GEM-G-001 | P0 | **a** (residuo) | 0-05-P3 | P0 refutado. La evidencia citada es falsa para el SHA declarado: en `09f8342` la línea 5 de ambos gate5 no contiene literal sino un marcador de redacción. El literal de contraseña sí sigue en `b45e913`. `scripts/` no entra en el ZIP. Evidencia nueva en §2.2; genera CMP-01 y CMP-02 (c) |
| TT-100 | P1 | a | A-01 | Confirmado en ZIP: `select name="selling_plan"` en `sections/main-product.liquid:577` dentro de `.no-js-only`, que `assets/base.css:5653-5655` solo oculta; `assets/theme.js` deshabilita `[data-selling-plan-select]` e input (`:770`, `:775`) pero nunca el select no-JS (grep sin coincidencias). Plan A-01 caso C lo cubre |
| TT-02 | P1 | a | A-03 | Confirmado: reglas `technical` y `heritage` en `assets/base.css:9097` y `:9121` de `09f8342`/`b45e913` (ZIP `:9102-9107` y `:9126-9131`). Severidad del plan: Imprint P1 condicionado, Archive P2 |
| TT-03 / GEM-C-001 | P1 | a | A-02 | Confirmado en `09f8342`: `snippets/product-technical-specs.liquid:46-74` (heurística `is_non_textile`, "Solid milled brass", "Precision machined") y `product-provenance.liquid:28-32`. A-02 retira además las catorce fuentes |
| TT-04 / GEM-E-001 | P1 | a | C-04-N | Ya verificado en la revisión 003 (`docs/merchant/docs.html:204`, `support.html:254`). Se mantiene P2: son docs del repositorio, no del ZIP |
| TT-07 | P1 | b2 | Excluido (§1) | Atelier. `assets/cart.js:38, :214, :336` llaman `res.json()` sin `res.ok` (las líneas de AG no coinciden). Sartorial sí comprueba `response.ok` (`theme.js:1186, :1705, :1800, :2582, :3192, :3327`) |
| TT-08 | P1 | b2 | Excluido (§1) | Atelier, colisión de nombres de preset (MASTER TT-08) |
| TT-09 | P1 | b2 | Excluido (§1) | Atelier, contrato de diseño declarado como extraído (MASTER TT-09) |
| TT-31 | P1 | b2 | Excluido (§1) | Atelier. Literal de contraseña en `DEVELOPMENT.md` (confirmado). Error de evidencia: `listings/contour/listing.json:5` es `support_email`, no una contraseña (eso es TT-33) |

### 1.2 Tabla P2 de Antigravity (§5.2)

| ID | Sev. AG | Cat. | Tarea V3 | Verificación propia y evidencia |
|---|---|---|---|---|
| GEM-B-002 | P2 | **d** | Ninguna | Mecanismo exacto, severidad refutada: `assets/theme.js:18-22` filtra con `getClientRects()` y `trapFocus` lo llama por cada Tab (`:28`). Una lectura de layout por pulsación, sin escrituras intercaladas; no hay reflujo continuo. Cachear la lista rompería drawers que se re-renderizan. Sin medición. P3 sin acción, como en la revisión previa |
| TT-101 | P2 | a | B-02 | Plan lo ejecuta en A con P1 condicionado (RC-01) |
| TT-104 | P2 | a | B-01 | Igual |
| TT-102 | P2 | a | B-03 | Igual |
| TT-103 | P2 | a | B-04 | Igual; contrato `saveNoteAndNavigate` ya revisado en 002 y 003 |
| TT-12 | P2 | a | C-03 | Cifras reproducidas en el ZIP: `base.css` 259.143 B (50.557 B gz), `theme.js` 248.554 B (57.494 B gz). C-03 sigue condicionado a G2 |
| TT-17 | P2 | a | E-01 | Diferido con motivo |
| TT-20 | P2 | b2 | Excluido (§1) | Atelier |
| TT-25 | P2 | b2 | Excluido (§1) | Atelier. Sartorial no tiene el patrón: los únicos `settings.* \| default: '...'` de secciones y snippets son esquemas de color y enumeraciones (7 coincidencias), ningún texto para el comprador |
| TT-107 | P2 | b2 | Excluido (§1) | Atelier |

### 1.3 Supuestos (§5.3)

| ID | Cat. | Motivo |
|---|---|---|
| SUP-001 | e | Lighthouse menor que 60: sin medición. Lo resuelve G2; C-03 se activa solo si G2 falla |
| SUP-002 | e | `variant-selects` coincide con Dawn (`theme.js:5316-5317`), pero no hay regla de Shopify sobre nombres de custom elements; criterio humano no reproducible |
| SUP-003 | e | Sin apps instaladas; no reproducible |

### 1.4 Afirmaciones de §4 que no están en las tablas

| Afirmación | Cat. | Tarea / evidencia |
|---|---|---|
| 4.a.1: 33 secciones (20 con presets) frente a 60 (43) | a | E-01. Cifras correctas (`ls sections/*.liquid` y grep `"presets"` en ambos). No es defecto |
| 4.b.1: schemas del editor sin localizar | **b1** | TT-56 (P3, MASTER §9.5 e INITIAL): `locales/` del ZIP solo tiene `en.default.schema.json`. La página de requisitos de Shopify no exige traducir el editor (consulta del 2026-10-30 a shopify.dev/docs/storefronts/themes/store/requirements). Se mantiene P3 |
| 4.b.2: kit `listings/` con `listing.json` y `preview.png` "requerido" | **d** | Refutado: el requisito solo pide plantillas por preset en `/listings`; no nombra `listing.json` ni `preview.png` (misma consulta; INITIAL A1-07 ya lo descartó). En Atelier esos archivos exponen un email personal y suman unos 14 MB (MASTER TT-33) |
| 4.b.3: notas de versión | a | C-04-R. El requisito es "version number and release notes" (§19); el plan ya pide `release-notes.md` en la raíz del ZIP |
| 4.b.4: diferenciación de presets | a | E-01 y C-02. El requisito duro es "unique set of templates" por preset; el enlace que cita AG es la lista de guía "Increasing clarity and discoverability" |
| 4.b.5: Lighthouse 60 y 90 | a | G2. Requisito confirmado: media mínima 60 de rendimiento y 90 de accesibilidad en home, producto y colección, escritorio y móvil |
| Anexo A (Cucuyo) | fuera de alcance | Plan §1. Dos errores de hecho en §4 de este informe |

### 1.5 Conteo

| Categoría | Hallazgos de AG (23) | IDs |
|---|---|---|
| a | 11 | GEM-G-001 (residuo), TT-100, TT-02, TT-03, TT-04, TT-101, TT-104, TT-102, TT-103, TT-12, TT-17 |
| b | 7 | b2 Atelier: TT-07, TT-08, TT-09, TT-31, TT-20, TT-25, TT-107 |
| c | 0 de AG; 2 derivados de mi verificación de GEM-G-001 | CMP-01, CMP-02 (§2.2) |
| d | 2 | GEM-B-001, GEM-B-002 |
| e | 3 | SUP-001, SUP-002, SUP-003 |

Además, de §4: cuatro en (a), una en (b1) (TT-56) y una en (d) (kit de listings).

---

## 2. Los dos P0, de nuevo

### 2.1 GEM-B-001: sin evidencia nueva, sigue refutado

La comparativa repite la tesis ("desestructurar `img.dataset` sobre slides con videos o modelos 3D") sin reproducción, sin error de consola y sin abrir el Liquid que genera las diapositivas. La guarda que pide existe antes de la línea citada, en tres capas: filtro `where: 'media_type', 'image'` (`main-product.liquid:47`), disparadores solo en medios de imagen (`:85`), y el snippet como único productor de `[data-zoom-slide]`, siempre con `<img>` (`product-zoom.liquid:60-61`). Ningún otro archivo del tema crea `[data-zoom-slide]` ni `data-zoom-open` (grep en `*.liquid`). El `TypeError` solo es alcanzable editando el snippet. Conclusión sin cambio: no es defecto; una guarda `if (!img)` sería endurecimiento opcional fuera del camino de envío.

### 2.2 GEM-G-001: evidencia nueva que cambia el encuadre, no la severidad

Hallazgos de esta revisión (comandos en §6):

1. En `09f8342` (el SHA que AG dice haber verificado, y HEAD remoto según `git ls-remote` de hoy), la línea 5 de `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs` no contiene un literal de contraseña: contiene un marcador de redacción sin comillas. **La evidencia de AG es falsa para su propio SHA.**
2. Las cuatro ramas remotas (`master`/`fix/revert-listings-exclusion` en `09f8342`, `sprint/F0` en `c4dca23`, `sprint/7B` en `f46ee38`, `fix/argon-recently-viewed-edition` en `35b952c`) tienen ese mismo marcador. El BOARD de `09f8342`, §15.2 (2026-10-22T20:30Z), registra con autorización de Johandry: D1 rotación de contraseñas en `tema-qkqpke0j` y las tres demos, D2 eliminación de fallbacks con modo fail-closed y D10 reescritura con `git-filter-repo` y `push --force`.
3. El checkout de coordinación no se resincronizó: `b45e913` (`sprint/F0` local) no desciende de `c4dca23` ni de `09f8342`; su gemelo reescrito es `c4dca23` (mismo mensaje) y difieren solo en cuatro archivos rastreados, los cuatro con el marcador en el remoto: los dos gate5, `agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md` y `agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md`. En `b45e913` los dos gate5 conservan el literal de contraseña (comprobado por patrón, sin imprimirlo). Las ramas locales `sprint/F0`, `master`, `sprint/7B`, `codex/argon-001-integrate-7b`, `backup/ee235e8-preservado`, `fix/argon-recently-viewed-edition`, `worktree-claude` y `worktree-codex` contienen el commit previo a la reescritura `44a8948`. El BOARD local (línea 16) aún dice que la rotación está aplazada.
4. En el linaje reescrito, el marcador sin comillas rompe los scripts: `node --check` sobre la versión de `09f8342` devuelve `SyntaxError: Unexpected token '**'`; la de `b45e913` parsea. D2 dice fail-closed, pero esos dos scripts no llegan a ejecutarse.

Qué cambia y qué no:

1. Severidad: sigue sin ser P0 de submission (no viaja en el ZIP, y el remoto ya no tiene el literal). El P3 de 0-05-P3 se mantiene.
2. Riesgo real nuevo (CMP-01): publicar cualquier ref local previa a la reescritura (un push forzado de `sprint/F0`, o cualquier rama nueva creada desde `b45e913`, `master` local o los worktrees) devolvería el literal al remoto público. La revisión previa y el plan V3 tratan `b45e913` como base de coordinación sin advertirlo; la revisión 002 y el plan V3 lo heredaron de nosotros.
3. Defecto nuevo menor (CMP-02): en el linaje remoto, los dos gate5 no parsean. Encaja en 0-05-P3, que ya va a editar la línea 5.
4. M2 se reencuadra: la rotación sigue siendo tarea de Johandry, ahora como confirmación de que la D1 del 2026-10-22 cubrió las cuatro tiendas (o su repetición). Ningún agente prueba credenciales antiguas contra tiendas para comprobarlo.
5. 0-01 debe elegir la base en el linaje reescrito o reconciliarla con él antes de cualquier commit, y prohibir publicar refs previas a la reescritura.

---

## 3. Matriz 71/71

La puntuación es dudosa y no debe usarse como insumo del plan. Motivos:

1. Sin rúbrica. Cinco categorías de 20 puntos sin subcriterios ni pesos; "calibración analítica estática y sintética" no está definida, y el propio informe declara el estado formal NE mientras su resumen ejecutivo usa las cifras.
2. Descansa en hallazgos refutados. La categoría 5 de Sartorial penaliza el `TypeError` de GEM-B-001 y el veredicto "no apto" se apoya en GEM-B-001 y GEM-G-001.
3. Penaliza por requisitos inexistentes. La categoría 4 resta a Sartorial por no localizar el editor en idiomas europeos (no es requisito; TT-56 P3) y §4.b.2 presenta como carencia un kit de listings que Shopify no pide.
4. Contradice nuestra evidencia en vivo. La categoría 3 dice "cero violaciones" de teclado en Sartorial; LIVE LV-01 registró `label-content-name-mismatch` (serious) en los selectores de idioma (plan B-05).
5. Mezcla de temas y criterios. La categoría 2 de Atelier resta por TT-25 (contenido del comerciante), y la 1 empata dos penalizaciones sin escala común (similitud Jaccard frente a un P1 de propiedad intelectual).
6. Severidades incoherentes. Un literal de contraseña en un script de repositorio es P0 para Sartorial (GEM-G-001) y el mismo tipo de exposición, en un archivo de documentación de un repo público, es P1 para Atelier (TT-31).
7. Lo "verificado" no es independiente. De los 20 hallazgos, 17 llevan IDs TT de las maestras de Claude y GPT; AG no aporta reproducción propia (ni consola, ni capturas, ni comandos).

El empate es coherente aritméticamente, pero es el resultado de juicios sin escala explícita. No propongo puntuación alternativa.

---

## 4. Otros errores de hecho

1. Cucuyo: el SHA completo declarado (`727c0d402bca…`) no coincide con el de la instantánea local (`727c0d4f9f68…`); solo comparten el prefijo de siete caracteres.
2. Cucuyo: "ausencia total de archivos en `locales/`" es falso; existe `locales/en.default.json`. Lo demás del anexo (sin `@app`, unos 26 MB de JPG en `assets/`) coincide; queda fuera de alcance.
3. TT-02 y otros localizadores de AG corresponden a `09f8342`/`b45e913` (por ejemplo `base.css:9097`, `:9121`), no al ZIP integrado (`:9102`, `:9126`). No lo declara.
4. §7.2 afirma que Claude y GPT "afirmaron erróneamente" 0 P0. No aporta evidencia nueva que lo sostenga.

---

## 5. Comparación con Atelier (solo para entender)

Nada de Atelier se propone copiar. Contraste útil: los dos patrones de Atelier que AG señala en compra (TT-07, `res.json()` sin `res.ok`) y en contenido (TT-25, textos con `default` imborrables) no existen en Sartorial (§1.1 y §1.2). La ventaja de Atelier en número de secciones y en localización del editor es real, pero pertenece a E-01 (diferido) y a TT-56 (P3), no al camino de envío.

---

## 6. Decisiones delegadas sobre la revisión 003

Johandry delegó M2 a M5 y K1 a K6. Criterio: la opción más prudente. El texto de cada orden está en `CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001.md`.

| Punto | Decisión | Razón |
|---|---|---|
| M1 | Resuelto por Johandry el 2026-10-30 por chat | Autorizó retirar las lecturas `product.metafields.custom.*` y `sartorial.*` y el nuevo copy |
| M2 | Rotación en manos de Johandry; 0-05-P3 edita una sola vez, sobre la base de 0-01 y tras su confirmación; prohibido publicar refs previas a la reescritura | Evidencia de §2.2 |
| M3 | Corregir a `sections/product-recommendations.liquid` | El archivo de `snippets/` no existe |
| M4 | A-02 es cambio de contrato de Nivel 2, autorizado por la decisión de M1; declararlo en R-D y en `release-notes.md` | Un comerciante con esos metafields deja de verlos |
| M5 | IDs GEM-E-002, GEM-G-004, GEM-H-002 y GEM-G-001 en los tres P3 | Trazabilidad estable |
| K1 | Citar solo `support.html:254` | :255 no contiene Edition |
| K2 | Claves reales `circa_year`, `show_unique_piece`, `condition_grade`, `provenance_notes` (`listings/archive/templates/product.json:75-78`; `index.json:108-111`) | El plan usa nombres abreviados |
| K3 | Nombrar los dos efectos y probarlos en R-A | Evita mostrar `circa_year` o `gsm` en productos sin respaldo |
| K4 | Enumerar como conservadas las cadenas con Atelier o Haute Couture; señalar a Johandry, en 0-04, que "haute couture" es una denominación protegida en Francia | Conservar sin decisión nueva es lo prudente; la denominación merece su decisión |
| K5 | Cambiar a "sin parche" | Contradicción interna |
| K6 | Rangos exactos del ZIP: `handleDocumentClick:2357-2371`, `handleDrawerClick:2384-2436`, rama de venta cruzada `:2408-2415`, `handleCrossSellView:2973-2984`, `saveNoteAndNavigate:2990-3031` | Revalidados por función hoy |

---

## 7. Verificación y límites

Lectura completa de GEMINI-AUDIT-COMPARATIVA-001, CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001, CLAUDE-REVIEW-PLAN-SARTORIAL-003 y del plan V3; búsqueda por ID en las tres maestras Claude. Código: ZIP (`product-zoom.js`, `product-zoom.liquid`, `main-product.liquid:40-100, :568-602`, `base.css:5650-5656, :9095-9132`, `theme.js:14-46, :2357-2438, :2968-3032`, grep de `response.ok`, `default:` y custom elements, `listings/*/templates`); checkout: `git rev-parse`, `git show` de `09f8342`, `c4dca23`, `f46ee38`, `35b952c` y HEAD para `product-zoom.js`, `main-product.liquid`, `product-zoom.liquid`, `base.css`, gate5 (línea 5 solo como conteo de patrones o con el valor sustituido), `git merge-base --is-ancestor`, `git branch --contains 44a8948`, `git diff --name-only c4dca23 HEAD`, BOARD de `09f8342` §15.2. Remoto: `git ls-remote` desde el contenedor (el proxy del contenedor podría aportar credenciales, así que no prueba visibilidad pública). Atelier y Cucuyo: `ls`, grep y conteos. Requisitos de Shopify: consulta a la página oficial de requirements el 2026-10-30.

`node --check` se ejecutó sobre copias temporales en `/tmp` del equipo, fuera de las carpetas conectadas, borradas al terminar. No se ejecutaron Theme Check, Lighthouse, axe ni arneses; no se abrió ninguna tienda; no se probó ninguna credencial. Los únicos archivos escritos son este informe y `CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001.md`. Ninguna conclusión garantiza la aprobación de Shopify.
