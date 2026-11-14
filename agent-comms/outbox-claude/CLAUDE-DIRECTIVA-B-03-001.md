# CLAUDE-DIRECTIVA-B-03-001: alta al carrito con respuesta perdida, reconciliar antes de invitar a reintentar

```text
ID: CLAUDE-DIRECTIVA-B-03-001 (tarea B-03 del plan V4.1; hallazgos RC-12 / TT-102 / S-07; P2)
Fecha: 2026-11-05
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo. También el revisor Opus de contexto limpio
  (R-D de esta directiva y revisión de la tarea, D11) y el coordinador Claude (commit y push, D12/D16).
Estado: Aprobada con cambios por CLAUDE-REVIEW-B-03-RD-001; donde difieran, manda la R-D.
Decisión requerida: R-D independiente (subagente Opus de contexto limpio, D11) antes de entregarla al
  implementador. La R-D decide PD-1 a PD-8 (§6.2). Solo PD-8 (autorización de la prueba real de R-B)
  puede requerir a Johandry (§6.4, D10); no bloquea la implementación.
Resumen en 5 líneas:
  1. Si Shopify aplica un POST a /cart/add.js y la respuesta se pierde (red cortada, página HTML 5xx,
     petición colgada), `CartDrawer.addItem` y `CompleteTheLook.addSelectedItems` dicen «try again»
     sin mirar el carrito; el cajón sigue cerrado y el contador viejo. El reintento duplica la línea.
  2. Reproducido en Chromium local con el `theme.js` real (`a0274ce`) y un servidor de carrito simulado
     que aplica el alta y pierde la respuesta: cantidad 2 tras reintentar (D1, D2, D5, E12); una
     petición colgada deja el botón deshabilitado para siempre (D4).
  3. Solución: línea base de cantidades por variante antes del POST (HTML del cajón si está al día; si
     no, GET /cart.js); plazo de 10 s; si no hay JSON, GET /cart.js y comparar: aplicado → éxito;
     intacto → «try again»; dudoso → aviso existente «We could not confirm the update.» + Check cart.
  4. Lista cerrada: `assets/theme.js` (E1-E11: constantes, `CartDrawer` y `CompleteTheLook`), arnés
     `agent-comms/outbox-claude/harness-B-03-001/` e informe. Sin Liquid, locales, CSS ni schema. Nivel 1.
  5. Sin tienda (D22), máximo `código completo`. La prueba del flujo real es de R-B y necesita
     autorización de mutar un carrito en un preview (PD-8).
Archivos tocados (por esta redacción): solo este archivo. Fuera del repo, en el scratch del redactor
  `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b03/`:
  `harness.mjs`, `edits.py`, `gen.py`, `theme-newhead.js`, `theme-d-newhead.js`, `directiva.diff`
  y `salida-*.txt`. Sin git de escritura, sin red externa, sin tiendas, sin `.secrets`.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta redacción. La solución es Nivel 1 (§3.5). El plan
  cita «locales realmente afectados»: no hay ninguno (se reutilizan claves existentes, PD-3).
Hallazgos extra fuera de alcance (con parche listo): H-1 a H-6 en §6.3, sin parche. Ninguno se toca.
Verificación (comando, resultado y qué demuestra/qué no): §2.3. Lectura ESTÁTICA y arnés SINTÉTICO en
  Chromium local. Demuestra el mecanismo con el `theme.js` real; no demuestra el comportamiento del
  servidor de Shopify (orden de aplicación, 504 reales, apps de transformación) ni nada de tiendas.
Lista de afirmaciones falsables numeradas: §8.
```

---

## 0. Fuentes leídas y su autoridad

| Fuente | Qué se toma de ella |
| --- | --- |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:254` (fila B-03), `:247-249` (Lote B), `:338-366` (§5.1), `:377` (R-B), `:384-396` (§6), `:418` (orden), `:423` (esfuerzo 1-2 d) | Alcance: «POST aceptado con respuesta perdida: reconciliar carrito antes de invitar a reintentar, conservar cantidades y no duplicar adición. Arnés de red etiquetado sintético, más prueba autorizada del flujo real. El riesgo es duplicar artículos, no un doble cobro demostrado.» |
| `AGENTS.md`, `agent-comms/RULES.md` §1.3-1.4, §2, §3.1-3.9, §4.2-4.4, §5 | Cabecera de entrega, cinco compuertas, niveles de desviación, `código completo` frente a `cumplido`. |
| `CLAUDE-DECISION-AUTONOMIA-001.md` (D9-D18), `CLAUDE-DECISION-LOTE-0-002.md` (D20-D24), `CLAUDE-DECISION-A-01-B-02-001.md` (D25), `CLAUDE-DECISION-C-08-001.md` (D26) | D9: Claude ejecuta aunque la fila nombre a GPT. D10: paradas. D11: revisor de contexto limpio. D12: rama `lote-b`, sin force. D13: tienda solo `tema-qkqpke0j` y solo temas no publicados. D17: sin código de SebastianDev017/atelier, sin metafields, sin credenciales. D22: sin tienda, máximo `código completo`. |
| `CLAUDE-DIRECTIVA-B-01-001.md` y `CLAUDE-REVIEW-B-01-RD-001.md` | Formato, preflight, arnés sin rutas absolutas, ledger solo propuesto, secuencia B-01 → B-03 → B-04. |
| `CLAUDE-DIRECTIVA-B-04-001.md` (§1.4, R-6) y `CLAUDE-REVIEW-B-04-RD-001.md:78-80` | Regiones de B-04 (`handleDrawerClick`, comentario de `handleCrossSellView`, `sections/cart-drawer.liquid:366`) y su dependencia de que `syncCart` no cambie de firma ni de semántica. |
| `docs/requirements-ledger.md:32,50,54,71` | Filas relacionadas (§5). Ninguna cubre hoy la resiliencia del alta. |

---

## 1. Condiciones de entrada, base y preflight

### 1.1 Condiciones de entrada (bloqueantes)

El implementador no edita si falta alguna. Si falta, se detiene y lo comunica al coordinador sin tocar archivos.

1. Existe un dictamen R-D (ID sugerido `CLAUDE-REVIEW-B-03-RD-001`) «apta» o «apta con cambios». Donde difiera de esta directiva, manda la R-D.
2. La rama `lote-b` existe y está activa; la prepara el coordinador. El implementador no crea ramas.
3. B-01 está en `lote-b` (commit `a0274ce`). B-05 (`snippets/localization-selectors.liquid`) está commiteado o fuera de la copia de trabajo: el preflight exige copia limpia.
4. Ningún otro agente escribe en `assets/theme.js` durante el turno. B-04 va después (§1.4).
5. El preflight de §1.3 pasa completo.

### 1.2 Base

- Rama: `lote-b`. Cabeza de referencia de esta redacción: `a0274ce851df2e96dd495a47f00f08bfb31ceb1a` («Lote B: B-01 el menu movil se cierra al cruzar el corte de escritorio»), hija de `1fee9e2`.
- B-01 añadió 19 líneas en `ThemeDrawer` (`:299-302`, `:314-328`), por encima de todo lo que toca B-03. Los números de esta directiva son de `a0274ce`. Si el coordinador integró otro commit antes, localiza siempre por el ancla textual (clase, método, comentario), nunca solo por la línea (RULES §4.4).
- Guarda la cabeza de inicio: `HEAD_INICIO=$(git rev-parse HEAD)`. Todos los diffs del informe se calculan contra ella.

### 1.3 Preflight obligatorio (pega la salida literal en el informe)

```bash
git status --short --branch
git status --short --untracked-files=no          # debe salir vacío («limpio»)
git rev-parse HEAD
git merge-base --is-ancestor a0274ce HEAD && echo DESCIENDE
git log --oneline a0274ce..HEAD
git diff --stat a0274ce HEAD -- assets/theme.js sections/cart-drawer.liquid sections/complete-the-look.liquid locales/en.default.json
node --check assets/theme.js && echo CHECK_OK
grep -n "class CartDrawer extends ThemeElement\|class CompleteTheLook extends ThemeElement\|async addItem(form, submitter) {\|async addCrossSell(button) {\|async addSelectedItems() {\|async syncCart({ reconcile = false } = {}) {\|    checkCart() {" assets/theme.js
grep -n "CART_CROSS_SELL_ADD_TIMEOUT\|CART_ADD_TIMEOUT\|CART_RECONCILE_TIMEOUT\|cartBaseline\|showUnconfirmedAdd\|readCartQuantities\|cartSnapshotStale\|classifyAdd" assets/theme.js
grep -n "fetchCommerce(" assets/theme.js
grep -n "data-cart-url\|data-cart-add-url\|data-update-unconfirmed-message\|data-cart-uncertain\|data-cart-check" sections/cart-drawer.liquid sections/complete-the-look.liquid
grep -n '"update_unconfirmed"\|"check_cart"\|"error": "We could not' locales/en.default.json
grep -n "settings.cart_type == 'drawer'" layout/theme.liquid
```

Valores esperados en `a0274ce`:

- Rama `lote-b`; imprime `DESCIENDE` y `CHECK_OK`; `git status --short --untracked-files=no` vacío.
- `class CartDrawer` `:2293`, `addItem` `:2580`, `addCrossSell` `:2679`, `checkCart` `:2808`, `syncCart` `:3321`, `class CompleteTheLook` `:4018`, `addSelectedItems` `:4145`.
- `CART_CROSS_SELL_ADD_TIMEOUT` en `:2290` (declaración) y `:2696` (uso en `addCrossSell`); ninguno de los otros nombres existe todavía.
- `fetchCommerce(` en `:147` (definición), `:2595` (`addItem`), `:3199` (`changeLine`) y `:4167` (`addSelectedItems`).
- `sections/cart-drawer.liquid:38` (`data-cart-url`), `:39` (`data-cart-add-url`), `:49` (`data-update-unconfirmed-message`), `:86` (`data-cart-uncertain`), `:87` (`data-cart-check`); `sections/complete-the-look.liquid:65` (`data-cart-add-url`) y `:66` (`data-cart-url`).
- `locales/en.default.json:80` (`"error": "We could not update your cart. Please try again."`), `:101` (`update_unconfirmed`), `:102` (`check_cart`), `:142` (error de complete the look).
- `layout/theme.liquid:139` (el cajón solo existe con `cart_type == 'drawer'`).

Condiciones de paso: si alguno de los nombres nuevos ya existe, si `addItem`, `addSelectedItems`, `renderSection` o el bloque de constantes cambiaron desde `a0274ce`, o si `syncCart`/`endMutation` cambiaron de firma, PARA y avisa al coordinador. Que cambien otras regiones no bloquea.

Herramientas: `node --version` (v22.23.4 en el entorno del redactor), `ls "$PLAYWRIGHT_BROWSERS_PATH"` (`/opt/pw-browsers`), `node_modules/playwright` presente. Si Chromium no arranca, no instales nada por red: registra «arnés no ejecutable» y sigue con el resto.

Prohibido en toda la tarea: abrir `.secrets`; leer o imprimir variables de entorno con credenciales; usar Shopify CLI contra tiendas; ejecutar `scripts/gate5-*.mjs`; imprimir el literal de contraseña, ni para contarlo; copiar código de SebastianDev017/atelier; crear o leer metafields; commit, push o force.

### 1.4 Secuencia y regiones de `assets/theme.js` (anclas en `a0274ce`)

| Tarea | Región |
| --- | --- |
| B-01 (hecha, `a0274ce`) | Solo `class ThemeDrawer` (`:274-382`). |
| **B-03 (esta)** | (1) Bloque de constantes entre `class ThemeDrawer`/`ProductCardVariants` y `class CartDrawer` (`:2286-2291`, comentario `// Phase 2 (GPT-021). Cart drawer deadlines.`). (2) `CartDrawer.connectedCallback`: tras `this.noteSavePending = false;` (`:2326`) y tras el listener de Escape (`:2360-2364`). (3) `CartDrawer.addItem` completo (`:2580-2652`) y un método nuevo `cartBaseline()` justo antes. (4) Método nuevo `showUnconfirmedAdd()` justo después de `addItem` (antes del comentario `// /cart/add.js devuelve la linea anadida ({ variant_id })`, `:2654`). (5) Una línea de `addCrossSell` (`:2696`, `const deadline = …`). (6) `renderSection`, tras `this.renderedRevision = this.syncRevision;` (`:3494`). (7) `CompleteTheLook.addSelectedItems` (`:4145-4212`). |
| B-03, solo lectura (NO se modifican) | `fetchCommerce` `:147`, `handleAddSubmit` `:2403`, `open` `:2502`, `close`, `responseHasVariant` `:2655`, `findLineFor` `:2662`, `checkCart` `:2808`, `changeLine` `:3180`, `beginMutation` `:3286`, `endMutation` `:3299`, `syncCart` `:3321`, `requestSection`, `renderCartResponse` `:3366`, `clearMessages`/`showError`/`showStatus` `:3596-3628`. |
| B-04 (después) | `handleDrawerClick` (`:2414-2466`), comentario de `handleCrossSellView` (`:3001-3002`) y `sections/cart-drawer.liquid:366-368`. **B-03 no toca nada de esto**, ni `saveNoteAndNavigate` (`:3020-3061`), ni el listener `input` de la nota, ni la guarda del borrador de `renderSection` (`:3434-3439`). |

Tras el commit de B-03 (neto +187: +242/−55), `handleDrawerClick` pasa de `:2414` a `:2493` (+79) y `handleCrossSellView`/`saveNoteAndNavigate` de `:3003`/`:3020` a `:3141`/`:3158` (+138). Las anclas de B-04 se desplazan sin solape de texto. `syncCart({ reconcile = false } = {})` conserva firma y semántica (R-6 de B-04).

---

## 2. Objetivo, defecto y causa

### 2.1 Objetivo (plan V4.1:254)

Cuando Shopify acepta un alta y la respuesta no llega, el tema lee el carrito antes de decir nada. Si el alta entró, la trata como éxito (cajón abierto, cantidad real). Si no entró y ya no puede entrar, dice «try again». Si no puede saberlo, no invita a reintentar: muestra el aviso existente y Check cart. Conserva cantidades y no duplica líneas.

### 2.2 Inventario de las mutaciones del carrito y causa (ESTÁTICO, `a0274ce`)

| Flujo (quién lo dispara) | Ancla | Endpoint y semántica | Respuesta perdida hoy | B-03 |
| --- | --- | --- | --- | --- |
| Alta del formulario de producto: PDP (`sections/main-product.liquid`), producto destacado (`sections/featured-product.liquid`), compra rápida de tarjeta (`snippets/product-card.liquid:312,398`, `data-quick-buy-form`) y barra fija (`StickyCartBar`, `requestSubmit` en `:1300`) → `handleAddSubmit` `:2403` | `CartDrawer.addItem` `:2580-2652` | `POST {cart_add_url}.js` con FormData; **suma** cantidad | `fetchCommerce` (`:2595`) convierte el error de red en `Error(errorMessage)`; el JSON fallido de una página HTML (`:2607-2610`) también. Se muestra en el formulario «We could not update your cart. Please try again.» (`handleAddSubmit` `:2409-2411`). El cajón no se abre y `endMutation` (`:3299-3317`) solo sincroniza si el cajón está abierto: el contador queda viejo. **Sin plazo**: una petición colgada deja `data-cart-add-pending` y el botón deshabilitados indefinidamente. | **Sí** |
| Venta cruzada del cajón | `CartDrawer.addCrossSell` `:2679-2778` | `POST add.js` JSON `items[]`; suma | Ya clasifica (`:2671-2678`): sin JSON → `uncertain` → «We could not confirm the update.» + Check cart, sin reintento, y `endMutation` reconcilia con `reconcileAfterMutation` (`:3305-3316`). Plazo `CART_CROSS_SELL_ADD_TIMEOUT` (10 s). | Solo el nombre del plazo (E7, PD-4) |
| Completa el look | `CompleteTheLook.addSelectedItems` `:4145-4212` | `POST add.js` JSON `items[]`; suma | Igual que `addItem`: «We could not add this look. Review the selected options and try again.» (`:4041-4044`), sin plazo. Sin cajón (`cart_type` página, `layout/theme.liquid:139`) también falla así. | **Sí** |
| Cantidad y eliminar en el cajón | `CartDrawer.changeLine` `:3180-3233` | `POST change.js` `{id: key, quantity}`; cantidad **absoluta** | Mensaje «try again», pero el cajón está abierto, `endMutation` lo resincroniza y repetir el cambio no duplica (D6). | Fuera (H-1) |
| Nota del cajón | `saveNoteAndNavigate` `:3020-3061` | `POST update.js` `{note}`; absoluta | Contrato propio sin reintento. | Fuera (B-04) |
| Formulario sin JS / `cart_type` página en PDP | Liquid | POST nativo con navegación | Lo gestiona el navegador; no hay JS que reconcilie. | Fuera (H-5) |

Causa común: los dos flujos incrementales tratan «no tengo una respuesta JSON» como «no se aplicó». Un alta es incremental, así que repetirla tras un éxito invisible suma otra vez. Y ninguno de los dos tiene plazo.

### 2.3 Reproducción (SINTÉTICO, Chromium local, sin tienda)

Arnés del redactor: `harness.mjs` en el scratch citado en la cabecera. Sirve por HTTP local una página mínima con el `theme.js` real (`THEMEJS=<archivo>`), un formulario de producto (`data-cart-add-form`, variante 101), un `<complete-the-look>` con dos variantes (201, 202) y un `<cart-drawer>` que traduce a mano el markup relevante de `sections/cart-drawer.liquid:35-92,155-285` (mismos `data-*`). Un servidor Node mantiene el carrito y responde `/cart/add.js`, `/cart/change.js`, `/cart.js` y `/cart?section_id=`. `page.route` decide la suerte de cada POST: `lost` (el servidor aplica el alta y la conexión se corta), `504` (aplica y responde HTML), `hang` (aplica y nunca responde), `late` (no aplica; el servidor lo aplica a los 11 s y la conexión se corta), `drop` (no llega al servidor), `504noapply`/`502noapply` (HTML sin aplicar), `422` y `200empty` (`{}`, la forma medida con F06).

```text
$ THEMEJS=theme-newhead.js OUT=salida-base-a0274ce.txt node harness.mjs x     (git show a0274ce:assets/theme.js)
D1 lost, cajón cerrado    1er clic: servidor 101=1 | formError="We could not update your cart. Please try again." drawerOpen=false headerCount=0
                          reintento: servidor 101=2 | POST add=2                        <- DUPLICADO
D2 504 HTML tras aplicar  1er clic: 101=1, mismo «try again»; reintento: 101=2           <- DUPLICADO
D3 línea previa qty 2     1er clic: 101=3 con headerCount=2; reintento: 101=4             <- DUPLICADO
D4 colgada 12 s           101=1 | addDisabled=true pendingFlag="true"                     <- botón bloqueado
D5 complete the look      1er clic: 201/202=1/1, bundleError «…try again.»; reintento: 2/2 <- DUPLICADO
E12 aplicada a los 11 s   a 10,6 s: addDisabled=true; luego «try again»; final 101=2      <- DUPLICADO
E15 look sin cajón        201/202=1/1 | navegación=- (solo el error)
E18 40 líneas, variante en 2 líneas  101=4 | formError «try again» headerCount=41 (real 42)

$ THEMEJS=theme-d-newhead.js OUT=salida-dir-a0274ce.txt node harness.mjs x    (a0274ce + E1-E11)
D1  101=1 | drawerOpen=true status="Item added to your cart. Wool coat - M" headerCount=1 formError=null
D2  101=1 | igual que D1          D3  101=3 | headerCount=3          D4  a 12 s: 101=1, cajón abierto, botón libre
D5  201/202=1/1 | drawer "Look added."   E5 (qty 3)  101=3, éxito
E1  (no llegó) 101=0 | GET cart.js=1 | formError «try again» -> reintento 101=1
E2  (lost + cart.js y sección caídos) drawerError "We could not confirm the update.", Check cart visible y con foco;
    al volver la red, Check cart -> 101=1, POST add=1
E3  422: 0 GET, mensaje del servidor   E4 éxito normal: 0 GET cart.js   E11 200 {}: «This item could not be added…», 0 GET
E6  doble envío durante una reconciliación lenta: pendingFlag=true, addDisabled=true; final 101=1, POST add=1
E12 aplicada tras el plazo: a 10,6 s «We could not confirm the update.» + Check cart, sin «try again»; final 101=1
E13 504 sin aplicar: Check cart (conservador, PD-2)     E14 502 sin aplicar: «try again» tras 1 GET
E15 look sin cajón, lost: navega a /cart, 201/202=1/1   E16 look sin cajón, no llegó: error del look, sin navegar
E17 cajón obsoleto tras un aviso sin red, 2.ª alta lost: 2 GET cart.js (línea base + reconciliación), éxito, 101=2
E18 40 líneas, variante en 2 líneas: 101=4, éxito, headerCount=42, 1 GET (la línea base sale del cajón)
E8  riesgo residual: otra ventana VISIBLE quita la línea tras cargar; lost -> «try again» falso; reintento 101=2 (§6.1)
E8b lo mismo con la pestaña oculta mientras tanto: 2 GET, éxito, 101=1
```

`node --check` del `theme.js` con E1-E11: OK. Ediciones aplicadas con anclas de cuenta 1 sobre `1fee9e2` y sobre `a0274ce`: ambas OK. Las salidas de `a0274ce` coinciden con las de `1fee9e2` salvo D6 (control de `changeLine`, cuyo mensaje intermedio depende del ritmo; la cantidad final, 3, no cambia).

Qué demuestra: el defecto y la corrección en Chromium con el JS real del tema y las mismas formas de respuesta de Shopify. Qué no: el servidor real de Shopify (orden de aplicación, si un 504 aplicó o no, apps que transforman el carrito), el editor de temas, móvil real ni lectores de pantalla.

---

## 3. Solución

### 3.1 Diseño

1. **Línea base antes del POST.** Cantidad por variante (suma de líneas). Si el HTML del cajón es lo último que pintó el servidor y nada pudo moverlo (`!cartSnapshotStale`, sin mutaciones pendientes, `renderedRevision === syncRevision`), se lee del cajón: 0 peticiones extra en el camino normal (E4, E18). Si no, `GET {cart_url}.js`. `cartSnapshotStale` se activa al ocultarse la página (`visibilitychange`, otra pestaña pudo cambiar el carrito) y tras un alta sin confirmar; se apaga en cada `renderSection`.
2. **Plazo de 10 s** para las altas (`CART_ADD_TIMEOUT`, el valor que ya usaba la venta cruzada, renombrado). Una petición colgada deja de bloquear el botón.
3. **Sin JSON → reconciliar.** Error de red, plazo, cuerpo no JSON (HTML 429/5xx): `GET {cart_url}.js` (plazo propio de 5 s) y `classifyAdd`:
   - `applied`: todas las variantes pedidas crecieron al menos lo pedido → éxito normal (pinta el cajón, anuncia «Item added…» con el título de `/cart.js`, abre el cajón).
   - `not_applied`: ninguna se movió **y** la petición no puede aterrizar después (no fue nuestro plazo ni un 504 de pasarela) → «try again». Ahora es verdad.
   - `unknown`: cualquier otro caso, incluido un carrito ilegible → `showUnconfirmedAdd()`: abre el cajón con «We could not confirm the update.» y Check cart con foco, y `endMutation` relee el carrito. Nada invita a reintentar.
4. **Respuesta JSON → sin cambios.** 422 y otros errores JSON siguen el camino actual (sin GET extra, E3). El control 5A-003 de `{}` (variante que exige plan, F06) sigue igual (E11).
5. **Complete the look** aplica lo mismo. Sin cajón (carrito en página), `applied` y `unknown` navegan a `/cart`, que muestra el carrito real (E15); `not_applied` muestra su error (E16).
6. **Idempotencia sin cabeceras nuevas.** `/cart/add.js` no acepta clave de idempotencia; la protección es no reintentar nunca de forma automática, no invitar a reintentar sin pruebas y bloquear el doble envío durante toda la reconciliación (`data-cart-add-pending` y `busy` siguen activos hasta el `finally`, E6).

### 3.2 Ediciones exactas (lista cerrada, en este orden)

Usa la herramienta de edición con contexto. Cada `old_string` aparece exactamente 1 vez en el archivo tal como esté en ese momento (RULES §3.2); aplícalas en orden E1 → E11 (E5 y E6 dependen del texto que deja E4). Copia los bloques tal cual: comentarios en ASCII, sangría de 2 espacios. No reformatees nada fuera de ellos.

**E1. Plazos del carrito y utilidades de reconciliación (bloque de constantes antes de `class CartDrawer`).** Ancla: `assets/theme.js:2286-2291` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
  // Phase 2 (GPT-021). Cart drawer deadlines. The recommendations read is a complement:
  // when it is late, the cards the server already rendered stay. The cross-sell add and
  // the note save are never retried: a missed deadline leaves their result uncertain.
  const CART_RECOMMENDATIONS_TIMEOUT = 2000;
  const CART_CROSS_SELL_ADD_TIMEOUT = 10000;
  const CART_NOTE_SAVE_TIMEOUT = 3000;
```

`new_string`:

```js
  // Phase 2 (GPT-021). Cart drawer deadlines. The recommendations read is a complement:
  // when it is late, the cards the server already rendered stay. The adds (product form,
  // cross-sell, complete the look) and the note save are never retried: a missed deadline
  // leaves their result uncertain.
  const CART_RECOMMENDATIONS_TIMEOUT = 2000;
  const CART_ADD_TIMEOUT = 10000;
  const CART_NOTE_SAVE_TIMEOUT = 3000;
  // B-03 (RC-12, TT-102). Deadline of the /cart.js read that settles a lost add response.
  const CART_RECONCILE_TIMEOUT = 5000;

  // B-03. Quantity per variant id, summed over lines: one variant can sit on several lines
  // (selling plans, line item properties).
  const quantitiesByVariant = (items) => items.reduce((map, item) => {
    const id = String(item?.variant_id ?? '');
    if (id) map.set(id, (map.get(id) || 0) + (Number(item.quantity) || 0));
    return map;
  }, new Map());

  // B-03. The same convention as CartDrawer.findLineFor: each line's title link carries
  // ?variant=, and the quantity field's defaultValue is what the server rendered (a typed,
  // unsent value does not count). null when the drawer cannot be read.
  const drawerQuantities = (drawer) => {
    if (!drawer?.querySelector?.('[data-cart-drawer-content]')) return null;
    const items = [];
    try {
      for (const row of drawer.querySelectorAll('[data-cart-item-key]')) {
        const href = row.querySelector('.cart-drawer-item__title a[href]')?.getAttribute('href');
        const variantId = href ? new URL(href, window.location.origin).searchParams.get('variant') : null;
        const quantity = Number(row.querySelector('[data-cart-quantity]')?.defaultValue);
        if (!variantId || !Number.isInteger(quantity)) return null;
        items.push({ variant_id: variantId, quantity });
      }
    } catch {
      return null;
    }
    return quantitiesByVariant(items);
  };

  // B-03. GET {cart_url}.js. Never throws: null means the cart could not be read.
  const readCartQuantities = async (cartUrl) => {
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), CART_RECONCILE_TIMEOUT);
    try {
      const url = new URL(`${String(cartUrl || '/cart').replace(/\/$/, '')}.js`, window.location.origin);
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const cart = await response.json();
      if (!cart || !Array.isArray(cart.items)) return null;
      return { items: cart.items, quantities: quantitiesByVariant(cart.items) };
    } catch {
      return null;
    } finally {
      window.clearTimeout(deadline);
    }
  };

  // B-03. Settles an add whose response was lost by comparing the cart before and after.
  // - applied: every requested variant grew by at least the requested quantity.
  // - not_applied: none moved, and the POST could not still land later. A request cut by
  //   our own deadline, or answered 504 by a gateway, may still be applied after the read.
  // - unknown: anything else, including a cart that could not be read. Never a retry prompt.
  const classifyAdd = (requested, before, after, mayStillLand) => {
    if (!before || !after || requested.size === 0) return 'unknown';
    let applied = 0;
    let untouched = 0;
    requested.forEach((quantity, id) => {
      if (!id) return;
      const delta = (after.get(id) || 0) - (before.get(id) || 0);
      if (delta >= quantity) applied += 1;
      else if (delta === 0) untouched += 1;
    });
    if (applied === requested.size) return 'applied';
    if (untouched === requested.size && !mayStillLand) return 'not_applied';
    return 'unknown';
  };
```

**E2. Estado inicial `cartSnapshotStale` (`CartDrawer.connectedCallback`).** Ancla: `assets/theme.js:2325-2328` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
      this.noteVersion = 0;
      this.noteSavePending = false;

      if (!this.overlay || !this.panel) return;
```

`new_string`:

```js
      this.noteVersion = 0;
      this.noteSavePending = false;
      // B-03. The drawer HTML may no longer mirror the server (another tab, an unsettled add).
      this.cartSnapshotStale = false;

      if (!this.overlay || !this.panel) return;
```

**E3. Listener `visibilitychange` (final de `CartDrawer.connectedCallback`, tras el listener de Escape).** Ancla: `assets/theme.js:2362-2369` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
        event.preventDefault();
        this.close(true);
      });
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.crossSellController?.abort();
```

`new_string`:

```js
        event.preventDefault();
        this.close(true);
      });
      // B-03. While the page is hidden another tab can change the cart.
      this.listen(document, 'visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.cartSnapshotStale = true;
      });
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.crossSellController?.abort();
```

**E4. `cartBaseline()` nuevo y cuerpo de `addItem` hasta `addedItem`.** Ancla: `assets/theme.js:2580-2630` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
    async addItem(form, submitter) {
      // Blocks a second submit while the first is in flight, which otherwise buys the
      // item twice. Switching variant mid-request used to re-enable the button through
      // updateForms; that path now reads this flag and leaves it disabled.
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      const revision = this.beginMutation();
      this.clearMessages(form);
      this.setFormBusy(form, submitter, true);

      try {
        const formData = new FormData(form);
        formData.set('sections', this.renderSectionIds().join(','));
        formData.set('sections_url', `${window.location.pathname}${window.location.search}`);

        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: formData,
        }, this.dataset.errorMessage);
        // Shopify and upstream proxies answer 429/5xx with an HTML error page. Parsing it
        // as JSON throws "Unexpected token '<'" straight at the shopper, so the parse
        // failure is turned into the localized message instead. A deliberate abort keeps
        // its own name, because callers use it to stay silent.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

        await this.renderCartResponse(result, revision);

        // 5A-003, GPT-AUDIT-005 H1. Un 200 no prueba que la linea exista: con una variante
        // que exige plan de venta Shopify devuelve {} (medido en la tienda con F06) y el
        // cajon anunciaba un exito falso. El exito solo se anuncia si la respuesta trae la
        // variante pedida y, cuando fue esta respuesta la que se pinto, si el carrito fresco
        // tiene su linea. Si otra mutacion la adelanto, basta con la respuesta.
        const requestedId = String(formData.get('id') || '');
        const addedLine = this.findLineFor({ variant_id: requestedId });
        const renderedHere = this.renderedRevision === revision;
        if (!this.responseHasVariant(result, requestedId) || (renderedHere && !addedLine)) {
          throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
        }

        const addedItem = Array.isArray(result.items)
          ? result.items.find((item) => String(item.variant_id || item.id) === requestedId)
          : result;
```

`new_string`:

```js
    // B-03. Cart quantities before an add. The drawer HTML is used when it is the last
    // thing the server rendered and nothing can have moved since; otherwise /cart.js is
    // read. The freshness test runs synchronously, so callers invoke this before
    // beginMutation() and await the promise just before their POST.
    async cartBaseline() {
      const fresh = !this.cartSnapshotStale && !this.pendingMutations
        && this.renderedRevision === this.syncRevision;
      const fromDrawer = fresh ? drawerQuantities(this) : null;
      if (fromDrawer) return fromDrawer;
      return (await readCartQuantities(this.dataset.cartUrl))?.quantities || null;
    }

    async addItem(form, submitter) {
      // Blocks a second submit while the first is in flight, which otherwise buys the
      // item twice. Switching variant mid-request used to re-enable the button through
      // updateForms; that path now reads this flag and leaves it disabled.
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      const baseline = this.cartBaseline();
      const revision = this.beginMutation();
      this.clearMessages(form);
      this.setFormBusy(form, submitter, true);
      // B-03. Without a deadline a hung request kept the button disabled for good.
      const controller = new AbortController();
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_ADD_TIMEOUT);

      try {
        const formData = new FormData(form);
        formData.set('sections', this.renderSectionIds().join(','));
        formData.set('sections_url', `${window.location.pathname}${window.location.search}`);
        const requestedId = String(formData.get('id') || '');
        const requested = new Map([[requestedId, Math.max(1, Number(formData.get('quantity')) || 1)]]);
        const before = await baseline;

        // B-03 (RC-12, TT-102). A lost response (network error, deadline, or a body that is
        // not JSON, such as an HTML 429/5xx page) does not prove the add failed: Shopify may
        // have applied it. The cart is read before the shopper is told anything, so the
        // "try again" message only appears when nothing was added. A JSON answer, error or
        // not, keeps the path below.
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
            signal: controller.signal,
          });
          result = await response.json();
        } catch {
          result = null;
        }
        window.clearTimeout(deadline);

        let reconciledItems = null;
        if (!response || result === null || typeof result !== 'object') {
          const after = await readCartQuantities(this.dataset.cartUrl);
          const mayStillLand = timedOut || response?.status === 504;
          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
          if (outcome === 'unknown') {
            this.showUnconfirmedAdd(submitter);
            return;
          }
          reconciledItems = after.items;
          // The cart already confirms the add. A render that fails only leaves the drawer
          // stale, and endMutation() then fetches fresh HTML.
          await this.renderCartResponse({}, revision).catch(() => {});
        } else {
          if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

          await this.renderCartResponse(result, revision);

          // 5A-003, GPT-AUDIT-005 H1. Un 200 no prueba que la linea exista: con una variante
          // que exige plan de venta Shopify devuelve {} (medido en la tienda con F06) y el
          // cajon anunciaba un exito falso. El exito solo se anuncia si la respuesta trae la
          // variante pedida y, cuando fue esta respuesta la que se pinto, si el carrito fresco
          // tiene su linea. Si otra mutacion la adelanto, basta con la respuesta.
          const renderedLine = this.findLineFor({ variant_id: requestedId });
          const renderedHere = this.renderedRevision === revision;
          if (!this.responseHasVariant(result, requestedId) || (renderedHere && !renderedLine)) {
            throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
          }
        }

        const addedItems = reconciledItems || (Array.isArray(result.items) ? result.items : [result]);
        const addedItem = addedItems.find((item) => String(item?.variant_id ?? item?.id ?? '') === requestedId);
```

**E5. Línea para el foco y `clearTimeout` en el `finally` de `addItem`.** Ancla: `assets/theme.js:2639-2642` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
        // Desde una tarjeta, el foco aterriza en la linea que se acaba de anadir.
        this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
      } finally {
        delete form.dataset.cartAddPending;
```

`new_string`:

```js
        // Desde una tarjeta, el foco aterriza en la linea que se acaba de anadir.
        const addedLine = this.findLineFor({ variant_id: requestedId });
        this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
      } finally {
        window.clearTimeout(deadline);
        delete form.dataset.cartAddPending;
```

**E6. Método nuevo `showUnconfirmedAdd()` (entre `addItem` y `responseHasVariant`).** Ancla: `assets/theme.js:2649-2654` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
        if (card?.isConnected) card.syncQuickBuy();
        this.endMutation();
      }
    }

    // /cart/add.js devuelve la linea anadida ({ variant_id }) o, con items[], { items: [...] }.
```

`new_string`:

```js
        if (card?.isConnected) card.syncQuickBuy();
        this.endMutation();
      }
    }

    // B-03. An add whose outcome the cart could not settle: nothing invites a retry. The
    // drawer opens on the same notice and Check cart as an uncertain cross-sell add, and
    // endMutation() re-reads the cart even while an option panel is in use.
    showUnconfirmedAdd(trigger = null) {
      this.reconcileAfterMutation = true;
      this.cartSnapshotStale = true;
      this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
      const uncertain = this.querySelector('[data-cart-uncertain]');
      if (uncertain) uncertain.hidden = false;
      const checkButton = uncertain?.querySelector('[data-cart-check]') || null;
      if (!this.isOpen) this.open(trigger, checkButton);
      else checkButton?.focus();
    }

    // /cart/add.js devuelve la linea anadida ({ variant_id }) o, con items[], { items: [...] }.
```

**E7. `addCrossSell`: solo el nombre del plazo.** Ancla: `assets/theme.js:2696-2696` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
      const deadline = window.setTimeout(() => controller.abort(), CART_CROSS_SELL_ADD_TIMEOUT);
```

`new_string`:

```js
      const deadline = window.setTimeout(() => controller.abort(), CART_ADD_TIMEOUT);
```

**E8. `renderSection`: el cajón vuelve a reflejar el servidor.** Ancla: `assets/theme.js:3494-3496` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
      this.renderedRevision = this.syncRevision;

      this.updateHeaderCount();
```

`new_string`:

```js
      this.renderedRevision = this.syncRevision;
      // B-03. The drawer mirrors the server again: cartBaseline() may read it.
      this.cartSnapshotStale = false;

      this.updateHeaderCount();
```

**E9. `CompleteTheLook.addSelectedItems`: cabecera (plazo, línea base y cantidades pedidas).** Ancla: `assets/theme.js:4149-4157` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
      this.clearMessages();
      this.setBusy(true);
      this.requestController?.abort();
      this.requestController = new AbortController();
      const drawer = document.querySelector('cart-drawer');
      const revision = drawer?.beginMutation?.();
      const requestBody = {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      };
```

`new_string`:

```js
      this.clearMessages();
      this.setBusy(true);
      this.requestController?.abort();
      const controller = new AbortController();
      this.requestController = controller;
      // B-03. The drawer adds' deadline. Only this timeout, not a deliberate abort, is
      // settled by reading the cart.
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_ADD_TIMEOUT);
      const drawer = document.querySelector('cart-drawer');
      // B-03. Taken before beginMutation(). Without a drawer (cart type "page") /cart.js is read.
      const baseline = typeof drawer?.cartBaseline === 'function'
        ? drawer.cartBaseline()
        : readCartQuantities(this.dataset.cartUrl).then((cart) => cart?.quantities || null);
      const revision = drawer?.beginMutation?.();
      const requestBody = {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      };
      const requested = new Map();
      selectedItems.forEach(({ id, quantity }) => {
        const key = String(id);
        requested.set(key, (requested.get(key) || 0) + (Number(quantity) || 1));
      });
```

**E10. `CompleteTheLook.addSelectedItems`: petición y reconciliación.** Ancla: `assets/theme.js:4166-4184` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
      try {
        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(requestBody),
          signal: this.requestController.signal,
        }, this.dataset.errorMessage);
        // See addItem: an HTML error page must surface as the localized message, not as
        // a JSON SyntaxError, and an abort must stay an abort.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) {
```

`new_string`:

```js
      try {
        const before = await baseline;
        // B-03. See addItem: a lost response (network error, deadline, an HTML error page)
        // is settled by reading the cart before the shopper is invited to try again.
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          result = await response.json();
        } catch (error) {
          if (error.name === 'AbortError' && !timedOut) throw error;
          result = null;
        }
        window.clearTimeout(deadline);

        if (!response || result === null || typeof result !== 'object') {
          const after = await readCartQuantities(this.dataset.cartUrl);
          const mayStillLand = timedOut || response?.status === 504;
          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
          if (outcome === 'unknown' && typeof drawer?.showUnconfirmedAdd === 'function') {
            drawer.showUnconfirmedAdd(this.submitButton);
            return;
          }
          const canOpenDrawer = typeof drawer?.renderCartResponse === 'function'
            && typeof drawer.open === 'function';
          if (outcome === 'unknown' || !canOpenDrawer) {
            // The cart page shows what the server holds.
            window.location.assign(this.dataset.cartUrl);
            return;
          }
          await drawer.renderCartResponse({}, revision).catch(() => {});
          drawer.showStatus?.(this.dataset.addedMessage);
          drawer.open(this.submitButton);
          this.showStatus(this.dataset.addedMessage);
          return;
        }

        if (!response.ok) {
```

**E11. `CompleteTheLook.addSelectedItems`: `clearTimeout` en el `finally`.** Ancla: `assets/theme.js:4205-4210` en `a0274ce`.

`old_string` (aparece 1 vez):

```js
        drawer.showStatus?.(this.dataset.addedMessage);
        drawer.open(this.submitButton);
        this.showStatus(this.dataset.addedMessage);
      } finally {
        this.setBusy(false);
        drawer?.endMutation?.();
```

`new_string`:

```js
        drawer.showStatus?.(this.dataset.addedMessage);
        drawer.open(this.submitButton);
        this.showStatus(this.dataset.addedMessage);
      } finally {
        window.clearTimeout(deadline);
        this.setBusy(false);
        drawer?.endMutation?.();
```

Diff esperado contra `a0274ce`: un archivo; `git diff --stat` da `1 file changed, 242 insertions(+), 55 deletions(-)` (±3 si tu herramienta parte distinto los bloques movidos). Debe coincidir con `directiva.diff`/`theme-d-newhead.js` del scratch.

### 3.3 Por qué así

- **Lee el carrito, no adivina.** El plan pide reconciliar antes de invitar a reintentar; `/cart.js` es la fuente de verdad pública del carrito. Comparar cantidades por variante es robusto ante el orden de líneas, las líneas partidas por plan o propiedades (E18) y las líneas de otras variantes.
- **Reutiliza el patrón existente.** `addCrossSell` ya clasifica la incertidumbre y usa el mismo aviso, el mismo botón Check cart y `reconcileAfterMutation` (`:2671-2678`, `:2768-2774`, `:3305-3316`). B-03 lleva ese contrato a las otras dos altas y le añade la lectura que lo resuelve en la mayoría de los casos.
- **Coste cero en el camino feliz.** La línea base sale del HTML del cajón cuando es fiable (misma convención que `findLineFor`, `:2662-2669`: el enlace del título lleva `?variant=`; la cantidad, el `defaultValue` del campo, `sections/cart-drawer.liquid:270-283`). Solo hay GET extra cuando el cajón puede estar viejo o cuando la respuesta se perdió.
- **Conservador donde el servidor puede aplicar tarde.** Abortar en el cliente no cancela el POST en Shopify, y un 504 de pasarela tampoco prueba nada (E12, E13): en esos casos «intacto» se trata como `unknown`.
- **`fetchCommerce` queda en uso** (`changeLine`, `:3199`); no se borra.
- **Sin claves nuevas.** `sections.cart.update_unconfirmed` y `sections.cart.check_cart` ya existen y ya se traducen en todos los locales del tema; no hay copy nuevo para el comprador ni para el comerciante.

### 3.4 Alternativas descartadas

| Alternativa | Motivo |
| --- | --- |
| `GET /cart.js` antes de cada alta, siempre | Elimina el riesgo residual E8, pero añade un viaje de ida y vuelta a cada alta del tema. Queda como PD-1. |
| Reintento automático del POST | Exactamente lo que duplica. Prohibido. |
| Clave de idempotencia o propiedad oculta en la línea (`_b03_token`) | `/cart/add.js` no deduplica por ella; una propiedad nueva parte líneas iguales y aparece en pedidos y apps. Cambio de contrato visible. |
| Comparar solo `item_count` | Falla si otra variante cambia a la vez y no sabe qué variante entró. |
| Mensaje nuevo específico para el alta | Exige claves en todos los locales y copy nuevo; el existente describe el caso con exactitud (PD-3). |
| Reconciliar también `addCrossSell` con `/cart.js` | Ya cumple el criterio (no invita a reintentar y reconcilia el cajón abierto). Cambiarlo amplía el alcance (PD-5). |

### 3.5 Archivos permitidos (lista CERRADA) y nivel

| Archivo | Operación |
| --- | --- |
| `assets/theme.js` | Solo E1-E11. |
| `agent-comms/outbox-claude/harness-B-03-001/` (nuevo) | `cart-lost-response.mjs`, `salida-base.txt`, `salida-fix.txt` (§4.2). No entra en el ZIP (`scripts/package-theme-zip.mjs` solo empaqueta carpetas del tema). |
| `agent-comms/outbox-claude/CLAUDE-REPORT-B-03-001.md` (nuevo) | Informe (§7). |

Prohibido tocar: `sections/*` (incluido `cart-drawer.liquid`, que es de B-04), `snippets/*`, `layout/*`, `templates/*`, `listings/*`, `config/*`, `locales/*`, `assets/base.css`, `docs/requirements-ledger.md`, `agent-comms/BOARD.md` y `CLAUDE-CLOUD-STATUS.md`. Dentro de `assets/theme.js`, nada fuera de E1-E11: ni `changeLine`, ni `syncCart`, ni `endMutation`, ni `checkCart`, ni `handleDrawerClick`, ni `saveNoteAndNavigate`, ni `fetchCommerce`.

**Nivel 1 (RULES §3.5):** no cambia ningún `id`, `name`, `default`, setting, opción, clave `t:`, ni atributo `data-*`/`aria-*` del markup; solo lee atributos que ya existen. Cambia un comportamiento dentro del alcance del plan: tras una respuesta perdida, éxito real o aviso de incertidumbre en lugar de «try again».

Preflight de directiva (RULES §4.2):

- Ramas alcanzables: `applied` (D1-D5, E5, E7, E17, E18), `not_applied` (E1, E9, E14, E16), `unknown` por carrito ilegible (E2, E10), por plazo (E12) y por 504 (E13); cajón ausente con `applied`/`not_applied` (E15, E16). `unknown` sin cajón y sin red navega a `/cart` (rama de guarda; el arnés puede forzarla con `nodrawer` + `lost` + `/cart.js` caído). `cartBaseline` desde el cajón (E4, E18) y desde `/cart.js` (E8b, E17). `mayStillLand` verdadero (E12, E13) y falso (E1, E14). La rama `requested.size === 0` es una guarda: `addSelectedItems` sale antes si no hay selección.
- Sin IDs ni `name` nuevos en formularios. Sin `aria-*` nuevos: el foco y `aria` del cajón los gestionan `open()` y `trapFocus` existentes.
- Sin Nivel 2.

---

## 4. Criterios de aceptación y pruebas sin tienda

### 4.1 Criterios falsables

1. `git diff --stat $HEAD_INICIO -- . ':!agent-comms'` lista solo `assets/theme.js`, con unas +242/−55 (±3).
2. `git diff -U0 $HEAD_INICIO -- assets/theme.js` solo tiene hunks en las 7 regiones de §1.4. Ninguno entre `handleDrawerClick(event) {` y el final de ese método, ni entre `handleCrossSellView(event, link) {` y el final de `saveNoteAndNavigate`, ni en `changeLine`, `beginMutation`, `endMutation`, `syncCart`, `checkCart`. Compruébalo con `grep -n` de esas anclas y los números de hunk.
3. `grep -c "CART_CROSS_SELL_ADD_TIMEOUT" assets/theme.js` = 0; `grep -c "CART_ADD_TIMEOUT"` = 4 (declaración, `addItem`, `addCrossSell`, `addSelectedItems`); `grep -c "fetchCommerce("` = 1 (solo `changeLine`; la definición `const fetchCommerce =` sigue); `grep -c "readCartQuantities("` = 4; `grep -c "showUnconfirmedAdd"` = 4; `grep -c "cartSnapshotStale"` = 5; `grep -c "cartBaseline"` = 5; `grep -c "classifyAdd"` = 3.
4. `node --check assets/theme.js` sin salida, exit 0.
5. Ninguna ruta de `/cart/add.js` se reintenta sola: `grep -n "cartAddUrl" assets/theme.js` devuelve exactamente 3 líneas, las tres `await fetch(this.dataset.cartAddUrl, {` de `addItem`, `addCrossSell` y `addSelectedItems`, ninguna en un bucle ni en un `catch`.
6. Arnés (§4.2) en modo `fix`: `resumen fallos=0`. En modo `base` contra `$HEAD_INICIO`: fallan D1, D2, D3, D4, D5, E2, E5, E7, E10, E12, E13, E15, E17 y E18; pasan D0, D6, E1, E3, E4, E9, E11, E14 y E16. E8 es informativo en ambos modos (riesgo residual, §6.1). Se informa el total de cada modo.
7. Sin regresiones: con respuesta JSON el número de GET a `/cart.js` es 0 (E3, E4, E11); el mensaje 422 del servidor llega intacto al formulario (E3); `{}` sigue dando «This item could not be added to your cart.» (E11).
8. Compuertas estáticas: `npx --no-install shopify theme check --fail-level error` («no offenses found»), `node scripts/theme-check-sanity.mjs` (exit 0), `node scripts/dataset-hooks.mjs` (exit 0; en `a0274ce` pasa) y `node scripts/json-validate.mjs` (exit 0). `node scripts/locale-key-inventory.mjs` es opcional: no se tocan locales. Pega la salida literal. Ninguna prueba el comportamiento (RULES §3.1).

### 4.2 Arnés entregable (SINTÉTICO, Chromium local)

Crea `agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs`. Puedes partir del `harness.mjs` del scratch del redactor (código del propio proyecto); cópialo y adáptalo: **quita la ruta absoluta** del `import` de Playwright.

- Uso: `node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs <repo> <fix|base> [SHA]`. `fix` lee `assets/theme.js` de la copia de trabajo; `base` lo lee con `git show <SHA>:assets/theme.js`. Sin parches en memoria.
- Playwright desde `<repo>/node_modules/playwright/index.mjs` con `pathToFileURL`. Servidor en `127.0.0.1`, puerto 0. Sin red externa. Sin rutas absolutas en código ni salidas.
- Página: `<html class="js">`; enlace de cabecera a `/cart` con `.site-header__cart-count` y `data-cart-count-enabled`; formulario `data-cart-add-form` (`name=id` 101, `name=quantity`, botón `name=add`, `[data-product-form-error]`); `<complete-the-look>` con `data-cart-add-url`, `data-cart-url`, `data-error-message`, `data-added-message`, dos `[data-bundle-item]` (201 y 202) con `[data-bundle-select]` marcados y `[data-bundle-variant]`, botón `[data-complete-look-submit]`, `[data-bundle-status]`, `[data-bundle-error]`; y `<cart-drawer>` con los `data-*` de `sections/cart-drawer.liquid:35-51`, `[data-cart-status]`, `[data-cart-error]`, `[data-cart-uncertain]` con `[data-cart-check]`, y en `[data-cart-drawer-content]` una fila `[data-cart-item-key]` por línea con `.cart-drawer-item__title a[href="/products/x?variant=ID"]` y `input[data-cart-quantity][value]`. Opción `nodrawer`: la misma página sin `<cart-drawer>`.
- Servidor: carrito en memoria; `/cart/add.js` (FormData o JSON `items[]`; suma a la línea existente), `/cart/change.js`, `/cart.js` (`{ item_count, items: [{ key, id, variant_id, quantity, product_title, variant_title, url }] }`) y `/cart?section_id=` (HTML del cajón). Cuenta POST de alta, POST de cambio y GET de `/cart.js`.
- Modos de `page.route('**/cart/add.js')`: `ok`, `lost`, `504`, `hang`, `late`, `drop`, `504noapply`, `502noapply`, `422`, `200empty` (§2.3). `**/cart.js` y `**/cart?section_id=*`: `ok`, `fail` (`internetdisconnected`), `delay` (1,5 s).
- Escenarios y resultado esperado en `fix` (cada uno con `OK`/`FAIL`):

| Esc. | Situación | Esperado en `fix` |
| --- | --- | --- |
| D0 | Alta normal | 101=1, cajón abierto, estado «Item added to your cart. Wool coat - M» |
| D1 | `lost`, cajón cerrado; si hay «try again», reintenta | 101=1, cajón abierto con el estado de éxito, sin error de formulario, contador 1; no hay reintento |
| D2 | `504` tras aplicar | Como D1 |
| D3 | Línea previa qty 2 + `lost` | 101=3, contador 3, sin error |
| D4 | `hang` (aplicada), espera 12 s | 101=1, cajón abierto con éxito, botón habilitado, sin `data-cart-add-pending` |
| D5 | Look, `lost` | 201/202=1/1, cajón abierto, «Look added.» en cajón y bloque |
| D6 | `changeLine` 1→3 `lost`, reintento | 101=3 (control; informativo el mensaje intermedio) |
| E1 | `drop` y reintento | Tras 1.er clic: 101=0, 1 GET, «try again»; tras reintento 101=1 |
| E2 | `lost` + `/cart.js` y sección `fail`; luego red `ok` y clic en Check cart | Cajón abierto, error «We could not confirm the update.», Check cart visible y enfocado, sin error de formulario; tras Check cart: 101=1, POST add=1, cantidad 1 en el cajón |
| E3 | `422` | Mensaje del servidor en el formulario, 0 GET |
| E4 | Alta normal | 0 GET, 1 POST |
| E5 | Cantidad 3 + `lost` | 101=3, éxito |
| E6 | `lost` + `/cart.js` `delay`; segundo envío durante la reconciliación | Durante: pendiente y botón deshabilitado; final 101=1, POST add=1 |
| E7 | Otra «pestaña» añade 101 tras cargar (visible) + `lost` | 101=2, éxito |
| E8 | Otra ventana visible quita 101 tras cargar + `lost` | INFORMATIVO (riesgo residual): hoy «try again» falso |
| E8b | Igual, con `visibilitychange` a oculto y visible entre medias | 2 GET, éxito, 101=1 |
| E9 | Look, `drop` | 201/202=0/0, error del look |
| E10 | Look, `lost` + `/cart.js` y sección `fail` | Cajón abierto con «We could not confirm the update.» y Check cart; sin error del look |
| E11 | `200empty` | «This item could not be added to your cart.», 0 GET |
| E12 | `late` (aplica a 11 s) | A 10,6 s: cajón con «We could not confirm the update.» y Check cart, sin «try again»; al final 101=1 y ningún POST extra |
| E13 | `504noapply` | Check cart (`unknown`), 1 GET, sin «try again» |
| E14 | `502noapply` | «try again», 1 GET |
| E15 | `nodrawer`, look `lost` | Navega a `/cart`; 201/202=1/1 |
| E16 | `nodrawer`, look `drop` | Error del look, sin navegar |
| E17 | E2 sin red, cerrar cajón, red de `/cart.js` vuelve (sección sigue `fail`), 2.ª alta `lost` | 2 GET en la 2.ª alta, estado de éxito, 101=2 |
| E18 | 40 líneas, 101 en 2 líneas (1+2) + `lost` | 101=4, éxito, contador 42, 1 GET |

- Registra en cada paso: error del formulario, cajón abierto, error y estado del cajón, Check cart visible, contador de cabecera, cantidades del cajón, botón deshabilitado, `data-cart-add-pending`, error/estado del look, `document.activeElement`, POST y GET contados, navegación. `pageerror` cuenta como fallo.
- Salida: una línea por estado, `OK`/`FAIL` por criterio, `resumen fallos=N`, exit 1 si hay fallos, y la etiqueta `SINTÉTICO (Chromium local, servidor de carrito simulado, sin tienda)`. Guarda `salida-base.txt` (contra `$HEAD_INICIO`) y `salida-fix.txt`.
- Antes de entregar, confirma que los archivos del arnés no contienen ninguna ruta absoluta (`grep -n "/tmp/\|/home/" agent-comms/outbox-claude/harness-B-03-001/*` sin salida) ni credenciales. El recuento del literal de contraseña lo hace el coordinador con su script; tú no lo imprimes ni lo buscas.

Límites: no ejecuta el servidor de Shopify ni sus apps, ni el header y cajón renderizados por Shopify, ni el editor. Es evidencia preliminar y no cierra filas (RULES §3.7).

### 4.3 Compuertas de calidad (RULES §2)

| Compuerta | Qué entregar |
| --- | --- |
| Requisitos | §5, con afirmación y evidencia `archivo:línea` + escenario del arnés. |
| Estados degenerados | **Vacío:** carrito vacío (D1, E1). **Uno:** una línea (D3). **Muchos:** 40 líneas y variante en 2 líneas (E18). **Muy largo:** títulos de 120 caracteres no intervienen (la clasificación usa ids y cantidades); el título del aviso sale de `/cart.js` igual que hoy sale de la respuesta; se justifica. **Faltante:** cajón ausente (E15, E16), `/cart.js` ilegible (E2, E10), fila sin enlace `?variant=` o sin campo de cantidad → `drawerQuantities` devuelve `null` y se usa `/cart.js` (declararlo y, si es fácil, añadir un escenario). Cantidades límite: cantidad 3 (E5); reglas min/paso no cambian (la cantidad pedida sale del propio formulario). Planes: la línea con plan cuenta en la suma por variante (E18) y `{}` sigue fallando cerrado (E11). |
| Consistencia | Un solo plazo de alta (`CART_ADD_TIMEOUT`, criterio 3); mensajes y Check cart reutilizados (`data-update-unconfirmed-message`, `[data-cart-uncertain]`); misma convención de variante que `findLineFor`. Sin `Intl`, sin moneda, sin selectores ni textos nuevos en Liquid. |
| Superficie del comerciante | No aplica: sin schema, labels, `t:` ni `info`. Se declara. |
| Tienda real | Pendiente (§4.4). Máximo `código completo`. |

### 4.4 Pendiente de credenciales y autorización: prueba de R-B (no la ejecuta el implementador)

La ejecuta el revisor de R-B (plan `:377`) en un preview no publicado de `tema-qkqpke0j` (D13), con autorización expresa para mutar un carrito de prueba (PD-8). Matriz en Sartorial, Imprint y Archive, escritorio y móvil simulado:

- Respuesta perdida real: Playwright contra el preview con `page.route('**/cart/add.js')` que hace `route.fetch()` (Shopify aplica) y luego `route.abort('connectionreset')`. Comprobar éxito, contador y una sola línea en PDP, producto destacado, compra rápida, barra fija y complete the look. Luego `drop` (no aplicado): «try again» y reintento a 1.
- Variantes con plan de venta (F06, regresión de `{}`), cantidad con reglas min/paso, producto en dos líneas (con y sin plan), carrito con muchas líneas.
- `cart_type` página: complete the look navega a `/cart` con la cantidad real.
- Teclado y lector de pantalla en el aviso: foco en Check cart, anuncio del `role="alert"`.
- Apps de transformación del carrito o bundles, si el preview tiene alguna (H-2).
- Etiquetar cada resultado como TIENDA; no mezclar con el arnés SINTÉTICO.

---

## 5. Filas del ledger y estado máximo sin tienda

`docs/requirements-ledger.md` no numera filas; se citan por nombre y línea en `a0274ce`. **El implementador no edita el ledger**; lo propone en su informe y lo actualiza su responsable (plan §6:396).

| Fila (línea) | Estado actual | Afirmación de B-03 | Estado máximo sin tienda | Cierre |
| --- | --- | --- | --- | --- |
| Ninguna fila cubre hoy la resiliencia del alta ante respuesta perdida | — | Propuesta (PD-7): fila nueva «Resiliencia del alta al carrito ante respuesta perdida (sin duplicar líneas)», fuente plan V4.1 B-03 (RC-12/TT-102/S-07), evidencia `assets/theme.js` (`classifyAdd`, `CartDrawer.addItem`, `CompleteTheLook.addSelectedItems`) y arnés `harness-B-03-001`, dueño Claude | `código completo` | R-B (§4.4) |
| «Planes de Venta / Suscripciones» (`:71`) | `código completo` | Sin cambio de estado: el control de `{}` (5A-003) se conserva (E11). Nota B-03. | `código completo` | R-B |
| «Live Regions (`aria-live`)» (`:54`) | `cumplido` | Sin cambio: el éxito reconciliado usa la misma región `[data-cart-status]` y `showStatus`; el aviso usa el `role="alert"` existente. | sin cambio | — |
| «Focus Trap y Gestión en Modales/Drawers» (`:50`) | `código completo` (B-01) | Sin cambio: `showUnconfirmedAdd` abre el cajón con `open()`/`trapFocus` existentes. | sin cambio | — |
| «JavaScript Modular Vanilla (Zero Libs)» (`:32`) | `cumplido` | Sin dependencias nuevas. | sin cambio | — |

Si se crea la fila nueva, el coordinador recalcula la cabecera con `node scripts/ledger-verify.mjs` (hoy: 60 filas, 47 `cumplido`, 13 `código completo`).

---

## 6. Riesgos, dudas y hallazgos

### 6.1 Riesgos y prohibiciones

- No reintentar ningún POST de forma automática, ni en `catch`, ni tras el plazo.
- No usar `fetchCommerce` en las dos altas tocadas: convierte el error de red en un mensaje y oculta la diferencia entre «sin respuesta» y «error JSON».
- No tocar `syncCart`, `endMutation`, `changeLine`, `checkCart` ni las regiones de B-04 (§1.4).
- No añadir claves de locale, atributos Liquid ni propiedades de línea.
- **Riesgo residual E8:** si otra ventana **visible** reduce o quita la misma variante entre el último render del cajón y el alta, y además se pierde la respuesta, la línea base del cajón es más alta que la real, el delta sale 0 y se dice «try again» con el alta ya aplicada. Exige dos ventanas visibles a la vez y una respuesta perdida. Con la pestaña oculta en medio, no ocurre (E8b). PD-1 lo elimina a cambio de un GET por alta.
- **Respuesta parcial** (look con una variante añadida y otra no): `unknown` → Check cart; nunca «try again».
- No declarar `cumplido` ninguna fila (D22, RULES §3.8).

### 6.2 Dudas para la R-D

- **PD-1. Línea base.** ¿Cajón cuando está al día y `/cart.js` si no (propuesto, 0 GET en el camino normal, riesgo E8), o `/cart.js` antes de cada alta (sin E8, +1 viaje por alta)?
- **PD-2. 504.** ¿Se trata un 504 HTML como «puede aterrizar después» (propuesto: `unknown`, Check cart) o como cualquier otro 5xx (`not_applied` si el delta es 0)?
- **PD-3. Texto del caso dudoso.** ¿Basta `sections.cart.update_unconfirmed` + `check_cart` (propuesto, sin locales nuevos) o se quiere un texto propio del alta? Esto último exige claves en todos los locales y amplía la lista cerrada.
- **PD-4. Renombrar `CART_CROSS_SELL_ADD_TIMEOUT` a `CART_ADD_TIMEOUT`.** Propuesto: sí, un solo plazo para las tres altas (E1, E7). Alternativa: dejar el nombre y reutilizarlo tal cual.
- **PD-5. `addCrossSell`.** Propuesto: fuera (ya cumple). ¿O se le aplica también `classifyAdd` para poder decir «try again» cuando la lectura prueba que no entró?
- **PD-6. `changeLine`.** Propuesto: fuera (H-1); es idempotente y el cajón se resincroniza.
- **PD-7. Ledger.** ¿Fila nueva (propuesto) o solo notas en `:71`?
- **PD-8. Prueba real de R-B.** Exige mutar un carrito en un preview no publicado. ¿La cubre D13 (solo subir temas no publicados) o es «escritura en tiendas» de D10 y la autoriza Johandry? No bloquea la implementación ni el arnés.

### 6.3 Hallazgos extra fuera de alcance (no se tocan en B-03)

- **H-1. `changeLine` con respuesta perdida** muestra «We could not update your cart. Please try again.» aunque el cambio se aplicó; el cajón se resincroniza (`endMutation`) y repetirlo no duplica. P3, copy. Sin parche.
- **H-2. Apps de transformación del carrito (bundles por fusión).** Si una app sustituye la línea pedida por otra variante, el delta de la variante pedida no crece: B-03 diría `not_applied`/`unknown`, y hoy el camino feliz ya falla con «This item could not be added» por `responseHasVariant`. Preexistente; R-B lo observa si hay app. P3.
- **H-3. Riesgo residual E8** (§6.1). P3 si la R-D mantiene PD-1 propuesto.
- **H-4. Alta aplicada después del plazo (E12):** el aviso queda con el cajón sin esa línea hasta pulsar Check cart. Intencionado: nada invita a reintentar. P3, observación.
- **H-5. Sin JS o con carrito en página, el formulario de producto** hace POST nativo; un fallo de red lo gestiona el navegador. Fuera del tema.
- **H-6. Contador tras éxito reconciliado con la sección caída (E17):** el estado dice «Item added…» pero el contador no se actualiza hasta el siguiente render (falla `requestSection`). P3; el siguiente `open()`/`syncCart` lo corrige.

### 6.4 Conflictos y Johandry (D10)

- El plan nombra a GPT como dueño; D9 asigna la ejecución a Claude. No requiere a Johandry.
- B-03 es P2, está en el plan, es Nivel 1 y no escribe en tiendas: **la implementación no requiere a Johandry.**
- Solo PD-8 (mutar un carrito real en R-B) puede requerirlo si la R-D concluye que D13 no lo cubre.

---

## 7. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-B-03-001.md`. Contenido obligatorio:

1. Cabecera RULES §1.4 completa: `ID: CLAUDE-REPORT-B-03-001`, Estado, `Decisión requerida: revisión D11 (subagente Opus de contexto limpio)`, resumen en 5 líneas, archivos tocados con líneas exactas tras la edición, desviaciones, hallazgos extra, verificación y afirmaciones falsables numeradas.
2. `HEAD_INICIO` y el preflight de §1.3 con comandos y salida literal.
3. `git diff` completo de `assets/theme.js` y `git diff --stat $HEAD_INICIO -- . ':!agent-comms'`.
4. Salidas de los criterios 1 a 8 de §4.1, literales, etiquetadas (ESTÁTICO / SINTÉTICO) y con «qué demuestra / qué no».
5. Salidas completas del arnés en `base` y `fix`.
6. Compuertas de §4.3, una por una.
7. Propuesta de filas del ledger (§5), sin editar el ledger.
8. La matriz de §4.4 como «pendiente de credenciales y autorización / R-B», sin resultados inventados.
9. Declaración explícita: no se abrió `.secrets`, no se usaron tiendas ni gate5, no se imprimieron variables de entorno ni el literal de contraseña, no se copió código de SebastianDev017/atelier, no se tocaron metafields y no se hizo commit ni push.

Esfuerzo estimado: 3 a 5 h (ediciones, arnés con 25 escenarios e informe). La matriz de R-B en previews forma parte de la banda 1-2 d del plan.

---

## 8. Afirmaciones falsables de este borrador

1. En `a0274ce`, `CartDrawer.addItem` (`assets/theme.js:2580-2652`) usa `fetchCommerce` sin `signal` ni plazo y, ante un error de red o un cuerpo no JSON, lanza `Error(this.dataset.errorMessage)` sin leer el carrito.
2. En `a0274ce`, `CompleteTheLook.addSelectedItems` (`:4145-4212`) hace lo mismo con su propio mensaje, y su `requestController` solo se aborta al iniciar otra alta.
3. `endMutation` (`:3299-3317`) solo llama a `syncCart` si el cajón está abierto: tras un alta perdida con el cajón cerrado, el contador de cabecera no cambia.
4. `addCrossSell` (`:2679-2778`) ya trata la falta de JSON como `uncertain`, muestra `data-update-unconfirmed-message` y Check cart y no reintenta.
5. `changeLine` envía una cantidad absoluta por clave de línea (`:3199-3211`): repetirla no suma.
6. `locales/en.default.json` ya contiene `update_unconfirmed` (`:101`) y `check_cart` (`:102`); B-03 no necesita claves nuevas.
7. Con el arnés sintético sobre `a0274ce`, una respuesta perdida tras aplicar seguida de un reintento deja 2 unidades en D1, D2 y D5 (2/2), 4 en D3 y 2 en E12; en D4 el botón sigue deshabilitado a los 12 s.
8. Con E1-E11 aplicadas, los mismos escenarios dejan 1 unidad (3 en D3, 1/1 en D5), con el cajón abierto y sin «try again»; E1 y E14 siguen invitando a reintentar tras 1 GET a `/cart.js`; E3, E4 y E11 hacen 0 GET.
9. E1-E11 aplican con anclas de cuenta 1 sobre `1fee9e2` y sobre `a0274ce`, y `node --check` del resultado termina sin error.
10. Ninguna de E1-E11 toca `handleDrawerClick`, `handleCrossSellView`, `saveNoteAndNavigate`, `syncCart`, `endMutation`, `changeLine` ni `checkCart`.
11. `layout/theme.liquid:139-140` solo monta `<cart-drawer>` con `cart_type == 'drawer'`; `sections/complete-the-look.liquid:66` emite `data-cart-url`, que E9-E10 usan cuando no hay cajón.
