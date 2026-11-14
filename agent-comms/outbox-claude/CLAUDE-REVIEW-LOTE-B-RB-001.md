ID: CLAUDE-REVIEW-LOTE-B-RB-001 (R-B del plan V4.1, parte estática; revisor independiente de contexto limpio según D11; no escribió ninguna directiva, R-D ni código del Lote B)
Estado: Revisión emitida. Veredicto: ACEPTADO CON CAMBIOS (un P3 documental nuevo en el ledger, ya aplicado como CR-1). El código del Lote B (`1fee9e2..0e8a401`) se acepta en lo estático sin cambios. La parte de tienda de R-B sigue PENDIENTE: nada pasa a `cumplido`.
Decisión requerida: Ninguna nueva de Johandry. PD-8 de B-03 ya está autorizada en D28 (acotada); PD-3 de B-04 queda fuera (D28). Coordinador: ninguna; CR-1 va en el mismo commit que esta revisión.
Resumen en 5 líneas:
1. Trazabilidad completa: B-01, B-05, B-03 y B-04 tienen directiva, R-D, informe, revisión aceptada y commit (`a0274ce`, `4e5c6d6`, `9834bac`, `0e8a401`). Los cambios de texto que exigían las revisiones están en sus commits. No falta ninguna tarea del Lote B del plan (§4.2 y §8 punto 4). B-02 (en `64862d1`) solo se regresa.
2. Integración sobre `6f22b9d`: Theme Check 93 archivos sin ofensas (LiquidComplexity activo con máximo 120: main-product 120, featured-product 110). `node --check`, sanity, locales, JSON, ledger y hooks con exit 0. `npm run gates:static` exit 0 (el ZIP que deja en la raíz se borró).
3. Harness contra HEAD: A-01/B-02 56/56 (idéntico al entregado; incluye los casos sin JS de B-02), A-03 810 filas/0 fallos (idéntico), B-01 0 fallos con y sin MOBILE=1 (idénticos), B-03 0 fallos (un contador de control varía entre corridas, P3-2), B-04 idéntico al entregado, B-05 todo OK (idéntico).
4. Interacciones cruzadas: sonda nueva con `assets/base.css` y `assets/theme.js` reales, 0 fallos en 6 escenarios (X1 a X4b). B-01 no actúa con el carrito abierto desde el menú; B-03 y B-04 no reintentan el alta y guardan la nota exacta; el payload de B-03 lleva un solo `id` y un solo `selling_plan` (A-01).
5. ZIP de HEAD: 94 archivos, SHA-256 `eecf2f225b1dc7a3719d8efe7d65b212c9808ffe9522d5bbae76746d93b6d96c` (dos generaciones idénticas), huella `c20015b4b29eed0c7dd2352ede0e94dedc41b19e9fbff8b718aaf35588a0cc02`. Frente a lote-a cambian solo los 3 archivos de tema del lote. Literal: 0 fuera de `tests/vendor/axe.min.js`, 0 en `git diff 1fee9e2..HEAD`, 0 en el ZIP y 0 en esta revisión.
Archivos tocados: este archivo (nuevo); `docs/requirements-ledger.md` (CR-1, una línea); `agent-comms/BOARD.md` (secciones 0.x); `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Pruebas en copias `git archive` y en el repo sin escribir en él (scratchpad `…/scratchpad/rb/`). Sin tiendas, sin gate5, sin `.secrets`, sin valores de entorno (solo nombres).
Desviaciones (Nivel 1 o Nivel 2): Nivel 1 documental: CR-1 (localizador de la fila 84 del ledger). Ningún Nivel 2.
Hallazgos extra fuera de alcance (con parche listo): Ninguno con parche de código. P3-2 y P3-3 son de los harness entregados y se dejan anotados (§7); no se tocan harness ya aceptados.
Verificación (comando, resultado y qué demuestra/qué no): §2 a §6, con salidas literales. ESTÁTICA y SINTÉTICA (Chromium local de Playwright, HTML traducido a mano). Demuestra que el lote integrado mantiene las compuertas estáticas y la evidencia sintética de cada tarea, que las tres interacciones pedidas no se rompen en el código real, y que el ZIP corresponde a los blobs de HEAD. No demuestra el render en tienda, ni axe/teclado/Lighthouse reales, ni la respuesta real de Shopify a `/cart/add.js`, `/cart.js` y `/cart/update.js`.
Lista de afirmaciones falsables numeradas:
1. `git rev-parse HEAD origin/lote-b` da `6f22b9d547cccd8837612aa3c7efc7280e04fe01` dos veces y el árbol estaba limpio al empezar. `git diff --stat 1fee9e2 HEAD -- sections snippets layout templates locales config assets` lista solo `assets/theme.js`, `sections/cart-drawer.liquid` y `snippets/localization-selectors.liquid`.
2. Sobre `git archive 6f22b9d`: `npx --no-install shopify theme check --path . --fail-level error` imprime «93 files inspected with no offenses found.». `shopify theme check --print` muestra `LiquidComplexity: enabled: true, severity: 1, maxComplexity: 120`. `c08_complexity.sh` (SHA-256 `4ca494f3…138d`, extraído del anexo de C-08) da featured-product 110 y main-product 120.
3. Sobre la misma copia, `theme-check-sanity`, `locale-key-inventory`, `json-validate`, `ledger-verify` y `dataset-hooks` dan exit 0. `ledger-verify` en HEAD: 61 filas, 47 cumplido, 14 código completo, 0 incoherencias.
4. `npm run gates:static` en la raíz del repo: exit 0. Dejó `Sartorial-1.0.0.zip` (108 entradas = los 94 archivos del ZIP canónico más 14 entradas de directorio), que se borró; `git status --short --ignored` sin nada fuera de `node_modules` después.
5. A-01/B-02 en modo `fix` contra el repo: «MODO=fix total=56 pass=56 fail=0», idéntico byte a byte a `harness-A-01-B-02-001/salida-fix.txt`.
6. A-03: «filas=810 fallos=0», mínimo 7.58, idéntico a `after.txt`; `--rules` idéntico a `rules-count.txt:5-8`.
7. B-01 `fix` con y sin `MOBILE=1`: «resumen fallos=0», idénticos a `salida-fix.txt` y `salida-fix-mobile.txt`.
8. B-03 `fix`: «resumen fallos=0» en 4 corridas; la línea 45 (`POSTchange` del control D6) sale 2 o 3 según la corrida.
9. B-04 `fix`: salida idéntica byte a byte a `salida-final.txt`. B-05 (con la ruta absoluta del repo): «RESULTADO: todo OK en la variante fix», 0 `[FALLA]`, idéntica a `salida-fix.txt`.
10. La sonda `rb/tools/cross-probe.mjs` contra el repo da «resumen fallos=0». Contra `assets/` de `1fee9e2` se corta en X2, porque sin B-03 el alta perdida no abre el cajón (la sonda distingue).
11. `node scripts/package-theme-zip.mjs --out …/rb-candidate.zip` dos veces: 94 archivos, el SHA-256 de §5 y `cmp` sin diferencias. Las 94 entradas son iguales a los blobs de HEAD. Frente a `--rev 1fee9e2` (que reproduce `8f666379…d5f6`) cambian 3 archivos y no se añade ni se quita ninguno.
12. Compuerta del literal (§8): derivación con un único candidato; árbol con 46 apariciones en bruto en 28 archivos (falsos positivos aceptados) y 1 línea en contexto, en `tests/vendor/axe.min.js`; `fuera_de_tests_vendor_axe= 0`; `git diff 1fee9e2..HEAD=0`; ZIP 0 (archivo y contenido).

---

# 0. Identidad y método

- Revisado: rama `lote-b`, `6f22b9d` (= `origin/lote-b`), con base `1fee9e2` (cabeza de `lote-a`). Seis commits lineales: `a0274ce` (B-01), `4e5c6d6` (B-05), `9834bac` (B-03), `0e8a401` (B-04), `8625c39` (traspaso D27) y `6f22b9d` (D28).
- Contrato leído: plan V4.1 §4.2 (Lote B), §5.1 (fila R-B) y §8 punto 4; `AGENTS.md`; `agent-comms/RULES.md` entero; `CLAUDE-HANDOFF-CLOUD-002.md`; `CLAUDE-CLOUD-STATUS.md`; `CLAUDE-DECISION-SESION-002.md` (D27) y `CLAUDE-DECISION-SESION-003.md` (D28). De cada tarea: cabecera y veredicto de directiva, R-D, informe y revisión, más las secciones citadas abajo.
- Copias de prueba: `rb/head` (`git archive 6f22b9d`, con `node_modules` enlazado) y `rb/at-1fee9e2` (solo `assets/`). Scripts propios en `rb/tools/`. Los harness que leen `git show` se ejecutaron sobre el repo (árbol limpio = HEAD); `git status --short` quedó vacío después de cada uno.
- `npm ci` hecho al empezar. Navegadores de Playwright en `PLAYWRIGHT_BROWSERS_PATH`.

# 1. Trazabilidad

| Tarea (plan §4.2) | Directiva | R-D (veredicto) | Informe | Revisión D11 (veredicto) | Cambios exigidos, en el commit | Commit |
| --- | --- | --- | --- | --- | --- | --- |
| B-01 | `CLAUDE-DIRECTIVA-B-01-001` | `CLAUDE-REVIEW-B-01-RD-001`: APROBADA CON CAMBIOS (C-1 a C-4) | `CLAUDE-REPORT-B-01-001` | `CLAUDE-REVIEW-B-01-001`: ACEPTADO CON CAMBIOS MENORES (M-1) | M-1 sí: el informe tiene «Hallazgos extra», «Verificación» y la lista de afirmaciones | `a0274ce` (theme.js +19, harness, ledger fila 50) |
| B-05 | `CLAUDE-DIRECTIVA-B-05-001` | `CLAUDE-REVIEW-B-05-RD-001`: APROBADA CON CAMBIOS (C-1 a C-5) | `CLAUDE-REPORT-B-05-001` | `CLAUDE-REVIEW-B-05-001`: ACEPTADO (4 P3 sin bloqueo) | No aplica | `4e5c6d6` (snippet, harness, ledger filas 46 y 84) |
| B-03 | `CLAUDE-DIRECTIVA-B-03-001` | `CLAUDE-REVIEW-B-03-RD-001`: APROBADA CON CAMBIOS (C-1 a C-3) | `CLAUDE-REPORT-B-03-001` | `CLAUDE-REVIEW-B-03-001`: ACEPTADO CON CAMBIOS MENORES (2 de texto) | Sí: `saveNoteAndNavigate` :3020 a :3159 (informe :81) y la frase de las corridas (informe :134) | `9834bac` (theme.js, harness, ledger fila nueva) |
| B-04 | `CLAUDE-DIRECTIVA-B-04-001` | `CLAUDE-REVIEW-B-04-RD-001`: APROBADA CON CAMBIOS (C-1 a C-5; PD-3 fuera) | `CLAUDE-REPORT-B-04-001` | `CLAUDE-REVIEW-B-04-001`: ACEPTADO (4 P3 documentales) | No aplica | `0e8a401` (theme.js +13/-5, cart-drawer +1/-1, harness) |

- **¿Falta alguna tarea?** No. El plan (§4.2 y §8 punto 4) enumera B-01, B-03, B-04 y B-05, más la regresión de B-02, que se hizo en A (`64862d1`).
- **Listas cerradas frente a lo tocado** (`git show --stat`): B-01 solo `assets/theme.js`; B-05 solo el snippet; B-03 solo `assets/theme.js`; B-04 `assets/theme.js` y `sections/cart-drawer.liquid`. Ningún archivo de tema fuera de esas listas. Ningún Nivel 2.
- **Decisiones posteriores:** D27 (parada tras B-04) y D28 (H-1 de A-03 pasa a tarea nueva del Lote C; PD-3 no se amplía; PD-8 autorizada acotada; fixture pendiente). Ninguna toca código del Lote B.

# 2. Integración sobre `6f22b9d`

```text
$ npx --no-install shopify theme check --path . --fail-level error   (rb/head)
│  93 files inspected with no offenses found.                                  │
$ npx --no-install shopify theme check --print | grep -A3 LiquidComplexity
LiquidComplexity:
  enabled: true
  severity: 1
  maxComplexity: 120
$ TMPDIR=… bash c08_complexity.sh .
sections/featured-product.liquid 110
sections/main-product.liquid 120
$ node --check assets/theme.js        -> syntax_theme=0
$ node --check assets/product-zoom.js -> syntax_zoom=0
$ for s in theme-check-sanity locale-key-inventory json-validate ledger-verify dataset-hooks; do node scripts/$s.mjs; echo $s exit=$?; done
theme-check-sanity exit=0
locale-key-inventory exit=0
json-validate exit=0
ledger-verify exit=0
dataset-hooks exit=0
    [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
    Sin resolver en storefront: 0 / Sin resolver en schema: 0 / Construidas en runtime: 0 / Huerfanas: 0 y 0
    Filas de requisito: 61 / 47 cumplido / 14 código completo / Incoherencias: 0
$ npm run gates:static   (raíz del repo)
gates_static_exit=0
    (json → hooks → sanity → locales → ledger → theme-check → syntax → package; «Your local theme was packaged in Sartorial-1.0.0.zip»)
$ unzip -l Sartorial-1.0.0.zip | tail -1  ->  1230462   108 files
$ rm Sartorial-1.0.0.zip ; git status --short --ignored | grep -v node_modules  -> (vacío)
```

Las 108 entradas del ZIP de la CLI son los mismos 94 archivos del ZIP canónico más 14 entradas de directorio (comparado con `zipfile`: 0 archivos de diferencia).

## 2.1 Harness entregados contra HEAD

```text
$ node harness-A-01-B-02-001/harness.mjs . fix
MODO=fix total=56 pass=56 fail=0
FALLAN: []
A01_IDENTICAL                                   (diff -q con salida-fix.txt)
$ node harness-A-03-001/focus-contrast.mjs assets/base.css config/settings_data.json --label "DESPUES (A-03)"
filas=810 fallos=0 / ratio_minimo_controles_objetivo=7.58 -> AFTER_IDENTICAL ; --rules -> RULES_IDENTICAL
$ node harness-B-01-001/drawer-breakpoint.mjs . fix            -> resumen fallos=0  (IDENTICAL)
$ MOBILE=1 node harness-B-01-001/drawer-breakpoint.mjs . fix   -> resumen fallos=0  (IDENTICAL)
$ node harness-B-03-001/cart-lost-response.mjs . fix           -> resumen fallos=0  (4 corridas)
    run1 101=3 POSTchange=2 / run2 101=3 POSTchange=3 / run3 101=3 POSTchange=2   (línea 45; ver P3-2)
$ node harness-B-04-001/harness.mjs . fix                      -> IDENTICAL a salida-final.txt
$ OUT=… node harness-B-05-001/harness.mjs /home/user/Tema-Shopify
RESULTADO: todo OK en la variante fix   ([FALLA]=0; diff con salida-fix.txt: 0 líneas)
```

- **Regresión sin JS de B-02:** los casos sin JS del harness de A-01/B-02 pasan en PDP y featured: H-6b, H-7 (p1 y p8), H-8 (`theme.js` 404), H-9b (`?variant=102`), H-10, H-11 (agotadas), H-12a y H-18b (`theme.js` que lanza), además de H-23 (conteos del Liquid real). El Lote B no toca `sections/main-product.liquid`, `sections/featured-product.liquid`, `snippets/variant-no-js-select.liquid` ni `layout/theme.liquid` (afirmación 1).
- **Contrato B-04 de R-B (plan §4.2):** la salida idéntica de B-04 cubre nota limpia (T02), sucia (T01), oculta y textarea ausente (T03), doble clic (T04), pendiente y destino (T05, T06), edición en vuelo (T07), fallos HTTP/JSON/eco/red/timeout (T08 a T12), mutaciones (T15, T16), último artículo (T17), Checkout nativo con JS (T14) y sin JS (T20). El veredicto sigue siendo manual (P3-4 de la revisión de B-04, abierto).
- **Harness históricos** (`harness-4B-006` … `harness-UNIFIED-POLISH-001`, 27 carpetas): son de sprints anteriores al plan V4.1, con bases y tiendas propias; no forman parte del contrato de R-A ni de R-B y no se ejecutaron. Se ejecutaron los seis del plan (A-01/B-02, A-03, B-01, B-03, B-04, B-05).

# 3. Interacciones cruzadas en `assets/theme.js`

Sonda propia `rb/tools/cross-probe.mjs`. SINTÉTICA: sirve `assets/base.css` y `assets/theme.js` reales y traduce a mano el `theme-drawer` de `sections/header.liquid`, el cajón de `sections/cart-drawer.liquid` y un formulario de compra con `id`, `selling_plan` y `quantity`.

```text
## X1 B-01 x cajon del carrito abierto desde el menu: 390 -> 1280, cerrar, -> 390
  OK   abrir el carrito desde el menu cierra el menu
  OK   a 1280 el carrito sigue abierto; closeIfHidden no actua (menu ya cerrado)
  OK   cerrar a 1280: sin bloqueo ni inert residual            (outsideInert=0, overflow visible/visible)
  INFO foco tras cerrar a 1280 = BODY (H-2 P3 preexistente si es BODY)
  OK   Tab avanza tras cerrar (sin trampa)                     ("d-about")
  OK   de vuelta a 390 el menu abre y Escape cierra con foco al disparador
## X1b mismo flujo cerrando a 390 (control)
  OK   a 390 el foco vuelve al disparador del menu
## X2 B-03 x B-04: alta con respuesta perdida (sin resolver), nota sucia, View cart
  OK   aviso de alta sin confirmar, un solo POST
  OK   View cart guarda la nota exacta y navega; no reintenta el alta   {"updates":1,"adds":1,"navs":["/cart"]}
## X3 B-03 x B-04: View cart con nota sucia mientras la reconciliacion de un alta sigue en vuelo
  OK   alta en reconciliacion; la nota sucia se conserva                {"pending":1,"dirty":"true"}
  OK   guarda la nota y navega con la reconciliacion pendiente; un solo POST de alta
## X4 A-01 x B-03: payload del alta con plan de venta y reconciliacion por variante
  OK   el POST de B-03 lleva un solo id, un solo selling_plan y la cantidad del formulario
       {"id":"101","sp":"7","qty":"2","sections":"cd","nId":1,"nSp":1}
  OK   respuesta perdida y linea de plan aparte: se reconcilia como aplicada (sumada por variante), sin reintento
## X4b A-01 x B-03: plan deshabilitado (compra unica) no viaja en el payload
  OK   sin selling_plan en el payload cuando el control esta deshabilitado
resumen fallos=0          (todas las secciones: «sin pageerror» OK)
```

Lectura del código (cuerpo actual de las funciones):

- **B-01 × carrito desde el menú.** `CartDrawer.open()` (`assets/theme.js:2590`) toma el disparador del menú como retorno y llama a `closeOtherDialogs(this)` antes de abrir. El menú queda cerrado, así que `ThemeDrawer.closeIfHidden()` (`:317-327`) sale en su primera guarda (`!this.isOpen`). B-01 no cambia el resultado: es el H-2 preexistente (foco en BODY al cerrar en escritorio, sin trampa ni `inert` residual). Sigue como P3 abierto, ya registrado.
- **B-03 × B-04.** `addItem` (`:2680`) construye el payload con `new FormData(form)` y nunca reintenta. `handleCrossSellView` / `saveNoteAndNavigate` (`:3151`, `:3168`) no dependen de `pendingMutations`: guardan la nota con `/cart/update.js`, que no toca líneas, y navegan solo con eco exacto. Si la navegación corta una reconciliación, `/cart` muestra lo que tiene el servidor; no hay duplicado. `renderSection` conserva el borrador sucio (comprobado en X3: la nota sigue sucia durante la reconciliación).
- **A-01 × B-03.** El `selling_plan` habilitado viaja una vez; el deshabilitado no viaja (X4b). `quantitiesByVariant` (`:2298`) suma por variante, así que una línea de plan aparte cuenta en la reconciliación (X4). El camino JSON (`{}` con plan requerido, 5A-003) no cambia.

Conclusión: ninguna regresión cruzada.

# 4. Ledger

| Fila (línea) | Requisito | Estado en HEAD | Lo que movió el lote | Esta R-B |
| --- | --- | --- | --- | --- |
| 46 | Lighthouse Accesibilidad >= 90 | `cumplido` | B-05: solo la redacción de la evidencia (axe 4.10.2 con etiquetas no ejecuta la regla experimental) | Sin cambio. La R-D de B-05 decidió no cambiar el estado: la puntuación medida no se contradice. Observación O-1 (§7) |
| 50 | Focus Trap y gestión en modales/drawers | `código completo` | B-01 | Sin cambio. Pasa a `cumplido` con la matriz B-01 en tienda (solo credenciales) |
| 67 | Alta al carrito con respuesta perdida sin duplicar líneas (fila nueva) | `código completo` | B-03 | Sin cambio. Pasa a `cumplido` con la prueba en previews bajo PD-8 (D28) |
| 70 | Selector de variantes y swatches | `código completo` | Nada (A-01/B-02 en el Lote A) | Sin cambio; la regresión sin JS sigue en verde |
| 84 | Selector de idioma | `código completo` | B-05 | **CR-1:** localizador `assets/theme.js:4841` → `:5057` (`class LocalizationForm`). Pasa a `cumplido` con axe (regla forzada) y teclado en preview |

- B-04 no tiene fila propia (directiva §6); su contrato queda en «código completo» según el informe y la revisión.
- Ninguna fila tocada por el lote está por encima de «código completo», salvo la 46, cuyo estado no movió el lote (O-1).
- Tras CR-1: `node scripts/ledger-verify.mjs` → 47 cumplido / 14 código completo / Incoherencias: 0 / exit 0 (en el árbol de trabajo, antes del commit).

# 5. Empaquetado

```text
$ node scripts/package-theme-zip.mjs --out /tmp/claude-0/…/scratchpad/rb/rb-candidate.zip
rev:      HEAD -> 6f22b9d547cccd8837612aa3c7efc7280e04fe01
fecha:    1793841634 (2026-11-05T01:20:34.000Z), DOS UTC con floor a 2 s
archivos: 94
tamano:   287063 bytes
sha256:   eecf2f225b1dc7a3719d8efe7d65b212c9808ffe9522d5bbae76746d93b6d96c
contenido: c20015b4b29eed0c7dd2352ede0e94dedc41b19e9fbff8b718aaf35588a0cc02 (huella independiente de zlib)
zlib:     1.3.1-e00f703 (node 22.23.4)
$ (segunda generación en rb-candidate-2.zip) ; cmp   -> BYTE_IDENTICAL
$ … --rev 0e8a401  -> mismo sha256 y misma huella (los dos commits posteriores son solo documentales)
$ … --rev 1fee9e2  -> archivos: 94 / sha256 8f666379…d5f6 / contenido 2afbc7a8…c4f5   (= ZIP de lote-a)
$ comparación de contenidos (python zipfile, frente a 1fee9e2 y frente a git show HEAD:<ruta>)
solo_HEAD [] solo_A [] cambiados ['assets/theme.js', 'sections/cart-drawer.liquid', 'snippets/localization-selectors.liquid'] distintos_de_blob 0
```

El candidato final se fija en R-G, no aquí. CR-1 solo toca `docs/`, que no entra en el paquete.

# 6. Pendientes de tienda, por dependencia

Las tres variables existen en el entorno (`SHOPIFY_CLI_THEME_TOKEN`, `STOREFRONT_PASSWORD`, `SHOPIFY_FLAG_STORE`: comprobado solo «presente»); la conectividad la confirmó el coordinador. Todo lo de abajo depende **solo de credenciales**, salvo lo que se indica.

| Tarea | Prueba en tienda (previews no publicados de `tema-qkqpke0j`, D13) | Dependencia |
| --- | --- | --- |
| B-01 | Resize real 390 → 1280 → 390; giros 820x1180 ↔ 1180x820 y 390x844 ↔ 844x390; teclado y axe a 390 y 1280 tras cada cruce; editor con el menú abierto; carrito abierto desde el menú, cruce y cierre (H-2) | Solo credenciales |
| B-05 | axe con la regla `label-content-name-mismatch` forzada (y 4.14.0 si es posible, con versión registrada); comprobación por palabra en el árbol de accesibilidad; header a 1280 y footer a 390; teclado y cambio de idioma real | Solo credenciales |
| B-03 | Flujo real de alta con respuesta perdida y reconciliación | Credenciales + PD-8, ya autorizada en D28: solo previews no publicados, solo el carrito de la sesión de prueba, vaciarlo al terminar, nunca pagar |
| B-04 | Nota sucia/limpia/oculta con View cart; C-4 (foco en Safari al fallar el guardado) | Solo credenciales; Safari real si hay dispositivo. Guardar la nota muta el carrito de la sesión de prueba: mismo marco que PD-8 (D28) |
| B-02 (regresión) | A → B sin JS en PDP y featured, URL de variante, payload y stock; línea de carrito solo dentro de PD-8 | Solo credenciales |

Antes de la primera ejecución en tienda siguen pendientes los 3 P3 de gate5 (HANDOFF-002 §7 paso 3).

# 7. Hallazgos

No hay P0, P1 ni P2.

| ID | Prioridad | Hallazgo | Acción |
| --- | --- | --- | --- |
| P3-1 | P3 (nuevo, documental) | La fila 84 del ledger citaba `class LocalizationForm` en `assets/theme.js:4841`. La clase estaba en `:4860` ya en `4e5c6d6` (B-01 había sumado 19 líneas) y está en `:5057` en HEAD (B-03 sumó más). `ledger-verify` no lo detecta porque la línea existe | **CR-1 aplicado:** `:4841` → `:5057`. `ledger-verify` exit 0 |
| P3-2 | P3 (nuevo, harness) | `harness-B-03-001` en modo `fix` no es estable byte a byte: el contador `POSTchange` del control D6 (`changeLine`) sale 2 o 3 según la corrida. El informe y la revisión de B-03 dicen que `fix` es idéntico byte a byte. El veredicto y el total no cambian | Anotado; no se toca un harness aceptado. Para próximas tareas: no imprimir contadores que dependen del ritmo |
| P3-3 | P3 (nuevo, harness) | `harness-B-05-001/harness.mjs` falla con una ruta de repo relativa (`createRequire` exige ruta absoluta: `ERR_INVALID_ARG_VALUE` con `.`). Sin argumento, o con ruta absoluta, funciona | Anotado; el uso documentado sigue valiendo si se pasa una ruta absoluta |
| H-2 de B-01 | P3 (abierto, preexistente) | Confirmado en X1: al cerrar en escritorio el carrito abierto desde el menú, el foco cae en BODY; sin trampa ni `inert` residual, y el siguiente Tab avanza | Sigue registrado; se observa de nuevo en tienda |
| Arrastrados | P3 | P3-1 a P3-3 de B-05; P3-1 a P3-4 de B-04; R-1 de B-01; residuo PD-2 de A-01; localizadores desplazados del ledger (filas 50 y 85, anteriores al lote) | Sin cambio |

Observaciones (no son defectos):

- **O-1.** La fila 46 sigue en `cumplido` aunque B-05 cambió su redacción. Lo decidió la R-D de B-05: la puntuación medida no se contradice, solo la frase «cero violaciones». Conviene volver a medir Lighthouse y axe en R-G sobre el candidato.
- **O-2.** Ningún harness entregado probaba las tres interacciones juntas (el de A-01/B-02 no tiene cajón; el de B-03 no tiene plan de venta). La sonda X1 a X4b cubre ese hueco en lo sintético.

# 8. Compuerta del literal

Método de `CLAUDE-HANDOFF-CLOUD-002.md` §5, en `rb/tools/lit.py`. Deriva el literal solo en memoria, comparando `git show 09f8342:<ruta>` y `git show HEAD:<ruta>` de los dos documentos CMP-01 en la posición del marcador, e imprime solo conteos. «Contexto» = la misma línea contiene una palabra de contraseña.

```text
$ git ls-files <los dos documentos CMP-01>   -> los dos existen
$ python3 -I lit.py derive
candidatos= 1 bytes= 4
$ python3 -I lit.py tree
crudo_total= 46 archivos= 28            (= cifra aceptada de HANDOFF-002 §5: falsos positivos)
tests/vendor/axe.min.js lineas_literal_contexto= 1
total_lineas_literal_contexto= 1
fuera_de_tests_vendor_axe= 0
$ python3 -I lit.py diff 1fee9e2..HEAD
git diff 1fee9e2..HEAD=0
$ python3 -I lit.py zip …/rb-candidate.zip
…/rb-candidate.zip=0 contenido_descomprimido= 0 entradas= 94
$ python3 -I lit.py files rb/tools/cross-probe.mjs rb/out/cross-probe.txt
…/cross-probe.mjs=0 / …/cross-probe.txt=0
```

El recuento de este archivo, de los otros tres archivos del commit y del diff publicado se hizo después de escribirlos. El resultado está en el mensaje de vuelta al coordinador y en `CLAUDE-CLOUD-STATUS.md`; añadirlo aquí no cambia el conteo.
