# CLAUDE-DIRECTIVA-B-01-001: el menú móvil se cierra solo al cruzar el breakpoint

```text
ID: CLAUDE-DIRECTIVA-B-01-001 (tarea B-01 del plan V4.1; hallazgos RC-10 / TT-104 / G-20; P2)
Fecha: 2026-11-04
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo. También el revisor Opus de contexto limpio
  (R-D de esta directiva y revisión de la tarea, D11) y el coordinador Claude (commit y push, D12/D16).
Estado: Aprobada con cambios por CLAUDE-REVIEW-B-01-RD-001; donde difieran, manda la R-D.
Decisión requerida: R-D independiente (subagente Opus de contexto limpio, D11) antes de entregarla al
  implementador. La R-D decide PD-1 a PD-6 (§6.2). Ninguna requiere a Johandry (§6.4, D10).
Resumen en 5 líneas:
  1. Con el menú móvil (`theme-drawer`) abierto, al pasar de 992 px el CSS oculta el componente
     (`assets/base.css:4389-4397`), pero el JS no se entera: siguen `data-open`, `body[data-drawer-open]`
     (overflow: hidden), `inert` en main, footer, nav de escritorio y logo, y el foco cae a BODY.
  2. Reproducido hoy en Chromium local con `theme.js` y `base.css` reales de `1fee9e2`: 25 fallos en 7
     escenarios (390→1280, giro de tableta 820×1180→1180×820, 991→992). Solo Escape lo recupera.
  3. Solución: en `ThemeDrawer`, escuchar `resize` y, si el cajón está abierto y su disparador ya no se
     pinta (`getClientRects().length === 0`), cerrarlo con `setOpen(false)` y mover el foco al primer
     control visible que le sigue en la cabecera. El CSS sigue siendo la única fuente del corte: no hay
     `62rem` ni `61.99rem` nuevos en JS. Prototipo en memoria: 0 fallos en los mismos 7 escenarios.
  4. Lista cerrada: `assets/theme.js` (solo la clase `ThemeDrawer`, líneas 274-363), el arnés
     `agent-comms/outbox-claude/harness-B-01-001/` y el informe. Sin CSS, Liquid, schema ni locales. Nivel 1.
  5. Sin tienda (D22), el máximo es `código completo`. El resize real en preview es de R-B.
Archivos tocados (por esta redacción): solo este archivo. Fuera del repo, en el scratch del redactor
  `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b01/`:
  `harness.mjs`, `harness-mobile.mjs`, `dump.mjs`, `theme-base.js`, `theme-proto.js` y
  `salida-{base,proto}{,-mobile}.txt`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta redacción. La solución es Nivel 1 (§3.4). El plan cita
  `assets/base.css` como candidato; aquí queda fuera (PD-6).
Hallazgos extra fuera de alcance (con parche listo): H-1 a H-4 en §6.3, sin parche. Ninguno se toca en B-01.
Verificación (comando, resultado y qué demuestra/qué no): §2.3. Lectura estática y arnés SINTÉTICO en
  Chromium local. Demuestra el mecanismo en el navegador; no demuestra el resize real de un dispositivo
  ni nada de tiendas.
Lista de afirmaciones falsables numeradas: §8.
```

---

## 0. Fuentes leídas y su autoridad

| Fuente | Qué se toma de ella |
| --- | --- |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:253` (fila B-01), `:247-249` (Lote B), `:338-347` (§5.1 R-D), `:377` (R-B), `:382`, `:384-396` (§6), `:418` (orden), `:520` (O4: fuente coherente del breakpoint) | Alcance, criterio de aceptación, contratos de revisión y prioridad P2. |
| `AGENTS.md`, `agent-comms/RULES.md` §1.3-1.4, §2, §3.1-3.9, §4.2-4.4, §5 | Cabecera de entrega, cinco compuertas, niveles de desviación, `código completo`. |
| `agent-comms/outbox-claude/CLAUDE-DECISION-AUTONOMIA-001.md` (D9-D18), `CLAUDE-DECISION-LOTE-0-002.md` (D20-D24), `CLAUDE-DECISION-A-01-B-02-001.md` (D25), `CLAUDE-DECISION-C-08-001.md` (D26) | D9: Claude ejecuta aunque la fila nombre a GPT. D10: paradas. D11: revisor de contexto limpio. D12: rama `lote-b`, sin force. D13: tienda solo con credenciales. D17: no copiar de SebastianDev017/atelier, no metafields, ninguna credencial. D22: sin tienda, máximo `código completo`. D25 y D26 no amplían nada a B-01. |
| `agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md:171,327` y `CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md:150,206` | Antecedente: TT-104 reproducido en Chromium y en tienda (main y submission): `overflow: hidden`, main y header con `inert`, foco en BODY, Tab no alcanza nada hasta Escape. |
| `agent-comms/outbox-gemini/GEMINI-AUDIT-COMPARATIVA-001.md:113` | Propone un `matchMedia` de 992 px en JS. Se descarta en §3.3 porque duplica el corte. |
| Formato: `CLAUDE-DIRECTIVA-A-03-001.md` y `CLAUDE-DIRECTIVA-A-01-B-02-001.md`, con sus R-D | Estructura y condiciones habituales de la R-D (rama la prepara el coordinador, «limpio» = `git status --short --untracked-files=no` vacío, arnés sin rutas absolutas, ledger solo propuesto). |
| `docs/requirements-ledger.md:49-50` | Filas afectadas (§5). |

`g20_g23.js`, que cita el plan, no está en el repositorio (`git ls-files | grep -i g20` sin salida) ni en el sistema de archivos (`find / -name 'g20_g23*'` sin salida). Se sustituye por el arnés etiquetado de §4.2.

---

## 1. Condiciones de entrada, base y preflight

### 1.1 Condiciones de entrada (bloqueantes)

El implementador no edita si falta alguna. Si falta, se detiene y lo informa al coordinador sin tocar archivos.

1. Existe un dictamen R-D (ID sugerido `CLAUDE-REVIEW-B-01-RD-001`) «apta» o «apta con cambios». Donde difiera de esta directiva, manda la R-D.
2. La rama `lote-b` existe y está activa; la prepara el coordinador. El implementador no crea ramas.
3. Ningún otro agente escribe en `assets/theme.js` durante el turno. B-03 y B-04 también editan `assets/theme.js` (clase `CartDrawer`); los turnos son secuenciales, con commit del coordinador entre turnos (§1.4).
4. El preflight de §1.3 pasa completo.

### 1.2 Base

- Rama: `lote-b`. Cabeza de referencia de esta redacción: `1fee9e2e0fdd9c62f5b58550487e2236057ac73f` («Lote A: R-A estatica (aceptado con cambios), ledger y estado»).
- Si B-03, B-04 o B-05 ya hicieron commit en `lote-b`, los números de línea de `assets/theme.js` pueden haberse desplazado. Localiza siempre por el ancla textual que acompaña a cada número (clase, método, selector), nunca solo por la línea (RULES §4.4).
- Guarda la cabeza de inicio del turno: `HEAD_INICIO=$(git rev-parse HEAD)`. Todos los diffs del informe se calculan contra ella, no contra `1fee9e2`, para no atribuirte commits de otras tareas.

### 1.3 Preflight obligatorio (pega la salida literal en el informe)

```bash
git status --short --branch
git status --short --untracked-files=no          # debe estar vacío («limpio»)
git rev-parse HEAD
git merge-base --is-ancestor 1fee9e2 HEAD && echo DESCIENDE
git diff --stat 1fee9e2 HEAD -- assets/theme.js assets/base.css sections/header.liquid
node --check assets/theme.js && echo CHECK_OK
grep -n "class ThemeDrawer extends ThemeElement\|class ProductGallery extends ThemeElement" assets/theme.js
grep -n "closeIfHidden\|this.listen(window, 'resize'" assets/theme.js
grep -n "const getFocusableElements\|const syncDialogScrollLocks\|const DIALOGS_WITH_SET_OPEN" assets/theme.js
grep -n "62rem\|61.99rem\|47.99rem" assets/theme.js
sed -n '4389,4397p' assets/base.css
grep -n "theme-drawer\|data-drawer-trigger\|data-drawer-panel\|data-section-id" sections/header.liquid
```

Valores esperados en `1fee9e2`:

- Rama `lote-b`, imprime `DESCIENDE` y `CHECK_OK`; el `git status` sin seguimiento puede listar `.tmp/` u otros scratch ignorados, pero el comando con `--untracked-files=no` sale vacío.
- `class ThemeDrawer` en `:274` y `class ProductGallery` en `:365`. La clase `ThemeDrawer` ocupa `274-363`.
- `closeIfHidden` no existe. El único `this.listen(window, 'resize'` está en `:3883` (otra clase, popovers del lookbook).
- `getFocusableElements` en `:18`, `DIALOGS_WITH_SET_OPEN` en `:61`, `syncDialogScrollLocks` en `:76`.
- `62rem|61.99rem|47.99rem` aparece solo en `:395` (comentario), `:408`, `:1861`, `:3788` y `:4481`. Ninguna en `ThemeDrawer`.
- `base.css:4389-4397`: `@media (min-width: 62rem) { … .site-header__mobile-menu { display: none; } …`.
- `sections/header.liquid:34` emite `data-section-id` en `<header>`; `:36` abre `<theme-drawer class="site-header__mobile-menu">`; `:42` `data-drawer-trigger`; `:57` `data-drawer-panel`; `:128` cierra `</theme-drawer>`.

Condiciones de paso: si `closeIfHidden` ya existe, si `ThemeDrawer` tiene cambios desde `1fee9e2` o si el corte de `base.css` ya no oculta `.site-header__mobile-menu`, PARA y avisa al coordinador. Cambios de B-03/B-04 en `CartDrawer` no bloquean.

Herramientas: `node --version` (v22.23.4 en el entorno del redactor), `ls "$PLAYWRIGHT_BROWSERS_PATH"` (Chromium `chromium-1243` en `/opt/pw-browsers`), `node_modules/playwright` presente. Si Chromium no arranca, no instales nada por red: registra «arnés no ejecutable» y sigue con el resto.

Prohibido en toda la tarea: abrir `.secrets`; leer o imprimir variables de entorno con credenciales; usar Shopify CLI contra tiendas (`theme push`, `theme dev`, `theme pull`…); ejecutar `scripts/gate5-*.mjs`; imprimir el literal de contraseña, ni para contarlo; copiar código de SebastianDev017/atelier; crear o leer metafields; commit, push o force.

### 1.4 Secuencia con B-03 y B-04 (regiones de `assets/theme.js`)

| Tarea | Región que edita en `assets/theme.js` (anclas en `1fee9e2`) |
| --- | --- |
| **B-01 (esta)** | Solo dentro de `class ThemeDrawer` (`:274-363`): un listener (4 líneas con su comentario) al final de `connectedCallback()` (tras el listener de Escape, `:294-298`) y un método nuevo entre `get isOpen()` (`:306-308`) y `setOpen()` (`:310`). Unas +19 líneas, todas antes de `:311`. |
| B-01, solo lectura | `getFocusableElements` (`:18-22`), `closeOtherDialogs` (`:64-74`), `syncDialogScrollLocks` (`:76-79`). No se modifican. `CartDrawer.open()` (`:2483-2510`) lee `theme-drawer[data-open]`; no se modifica. |
| B-03 / B-04 | `class CartDrawer` (`:2274` en adelante): `handleDocumentClick` `:2368`, `handleDrawerClick` `:2395`, `handleDrawerChange` `:2449`, `addItem` `:2561`, `handleCrossSellView` `:2984`, `saveNoteAndNavigate` `:3001` y la reconciliación. |

No hay solapamiento de texto. Pero B-01 inserta líneas por encima de la región de B-03/B-04: si B-01 entra primero, todas las líneas de `CartDrawer` se desplazan unas +19. Cualquier orden vale si cada turno localiza por ancla y el coordinador hace commit entre turnos. Recomendación: B-01 primero, porque es el diff más pequeño y no lee nada de `CartDrawer`.

---

## 2. Objetivo, defecto y causa

### 2.1 Objetivo (plan V4.1:253)

Abrir el menú a 390 px, cruzar a 1280 px y volver, y girar el dispositivo: scroll, `inert`, foco y estados quedan coherentes sin depender de Escape. El corte se toma de una sola fuente, el contrato CSS existente, sin duplicar `62rem` en JS.

### 2.2 Causa (estático, `1fee9e2`)

- `assets/base.css:627-629` muestra `.site-header__mobile-menu` (el propio `<theme-drawer>`) y `:4389-4397` lo oculta con `display: none` desde `min-width: 62rem` (992 px con 16 px de raíz). Es el **único** sitio donde vive el corte del menú.
- `ThemeDrawer.setOpen(true)` (`assets/theme.js:310-334`) pone `aria-expanded`, `data-open`, `overlay.hidden = false`, `body[data-drawer-open]` vía `syncDialogScrollLocks()` (`:76-79`), aplica `inert` a todos los hermanos de cada ancestro hasta `body` (`applyBackgroundInert`, `:336-355`) y activa la trampa de foco (`:327`).
- `body[data-drawer-open] { overflow: hidden; }` está en `assets/base.css:142-145`.
- `ThemeDrawer` solo se cierra por el botón (`:288-290`), el `pointerdown` del overlay (`:291-293`), Escape (`:294-298`), `closeOtherDialogs` desde otro diálogo o `disconnectedCallback` (`:301-304`). **No escucha `resize`, `orientationchange`, `matchMedia` ni `ResizeObserver`**. Cuando el CSS lo oculta, el estado del JS queda abierto.
- Efecto en escritorio: el cajón no se ve, pero `main`, footer, la nav de escritorio y el logo siguen `inert`, el `body` no desplaza y el foco, que estaba en el panel ya oculto, cae a BODY. La página queda muerta a ratón, rueda y teclado. En táctil (girar una tableta) no hay Escape.
- Al volver a móvil, el cajón reaparece abierto, con el foco en BODY.
- Barrido de la clase de defecto (RULES §4.3): los otros diálogos con `inert` de fondo (`CartDrawer`, `SizeGuideModal`, `PickupAvailability`, `PasswordModal`, `ProductCardVariants`, `PredictiveSearch`) no se ocultan por un corte de CSS en su contenedor, así que no comparten este defecto. El único componente que el CSS oculta por ancho mientras puede estar abierto es `theme-drawer`. `ThemeDisclosure` del mega menú de escritorio se oculta al bajar de 992 px, pero no aplica `inert` de fondo ni bloquea scroll (`:177-272`); queda fuera.

### 2.3 Reproducción (SINTÉTICO, Chromium local, sin tienda)

Arnés del redactor: `harness.mjs` en el scratch citado en la cabecera. Sirve por HTTP local el `assets/base.css` y el `assets/theme.js` de un commit (`git show`), y una página que traduce a mano el markup de `sections/header.liquid:34-128` (disparador, overlay, panel con `role="dialog"`, submenú `theme-disclosure`, nav de escritorio, logo y carrito), con `main` alto y footer. Cambia el viewport con `page.setViewportSize`, que dispara `resize` real en la página, sin pulsar Escape. Modo `proto`: aplica el cambio de §3.1 en memoria, con anclas de cuenta 1.

```text
$ node harness.mjs /home/user/Tema-Shopify base 1fee9e2      (extracto)
## S1 escritorio: 390x844 -> 1280x800 -> 390x844
  abierto  : open=true expanded=true overlayHidden=false panelInert=false bodyLock=true overflow=hidden inert=MainContent,footer,desktop-nav,logo triggerRendered=true active=Close
  cruzado  : open=true expanded=true overlayHidden=false panelInert=false bodyLock=true overflow=hidden inert=MainContent,footer,desktop-nav,logo triggerRendered=false active=BODY
  FAIL Tab alcanza un control (BODY)
  FAIL rueda desplaza la pagina (scrollY=0)
  vuelta   : open=true ... bodyLock=true overflow=hidden inert=MainContent,footer,desktop-nav,logo triggerRendered=true active=BODY
  FAIL reabre normalmente (trigger tapado por el overlay)
## S3 giro movil (sin cruce): 390x844 -> 844x390 -> 390x844
  OK   sin cruce: sigue abierto
## Regresion Escape a 390
  OK   Escape cierra y devuelve foco
resumen fallos=25

$ node harness.mjs /home/user/Tema-Shopify proto 1fee9e2     (extracto)
## S1 escritorio: 390x844 -> 1280x800 -> 390x844
  cruzado  : open=false expanded=false overlayHidden=true panelInert=true bodyLock=false overflow=visible inert=- triggerRendered=false active=d-shop
  OK   Tab alcanza un control (d-about)
  OK   rueda desplaza la pagina (scrollY=600)
  vuelta   : open=false expanded=false overlayHidden=true panelInert=true bodyLock=false overflow=visible inert=- triggerRendered=true active=BODY
  info: Tab tras volver -> logo
  OK   reabre normalmente
  OK   cierre con boton devuelve foco al trigger
## S2 giro tableta: 820x1180 -> 1180x820 -> 820x1180     (todo OK)
## S3 giro movil (sin cruce): 390x844 -> 844x390 -> 390x844  OK sin cruce: sigue abierto
## S4 justo en el corte: 991x800 -> 992x800 -> 991x800   (todo OK)
## Submenu abierto, foco en enlace interior, 390 -> 1280 -> 390
  OK   cerrado, sin inert, foco en d-shop
  submenu aria-expanded tras volver: true (informativo: igual que tras un cierre por boton)
resumen fallos=0
```

Con contexto `isMobile: true, hasTouch: true` y apertura por `tap` (`harness-mobile.mjs`): base 25 fallos, proto 0. `node --check` del `theme.js` prototipo: OK.

Qué demuestra: el mecanismo del defecto y de la corrección en Chromium, con el CSS y el JS reales. Qué no: el `resize` de un iOS/Android real, el editor de temas, el header real renderizado por Shopify, ni lectores de pantalla.

---

## 3. Solución

### 3.1 Cambio exacto (lista cerrada de ediciones en `assets/theme.js`)

Usa la herramienta de edición con contexto; cada `old_string` debe aparecer exactamente 1 vez (RULES §3.2). Todo va dentro de `class ThemeDrawer`.

**E1.** Al final de `connectedCallback()`, justo después del listener de Escape (el bloque `this.listen(document, 'keydown', (event) => { if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return; … });`, `:294-298`) y antes de la llave que cierra el método, añade:

```js
      // B-01 (TT-104). El corte movil/escritorio vive solo en el CSS (base.css oculta
      // .site-header__mobile-menu desde 62rem). Si el cajon abierto deja de pintarse por un
      // cambio de ancho o un giro, se cierra aqui y devuelve scroll, inert y foco sin Escape.
      this.listen(window, 'resize', () => this.closeIfHidden(), { passive: true });
```

**E2.** Entre `get isOpen() { … }` (`:306-308`) y `setOpen(open, restoreFocus = false) {` (`:310`), añade el método:

```js
    // Cerrar sin restoreFocus: el disparador ya no se ve y focus() sobre el no haria nada.
    // Si el foco estaba en el cajon (o cayo a BODY al ocultarse), pasa al primer control
    // visible que sigue al cajon en su seccion: en escritorio, la navegacion principal.
    closeIfHidden() {
      if (!this.isOpen || this.trigger.getClientRects().length > 0) return;
      const active = document.activeElement;
      const focusWasInside = !active || active === document.body || this.contains(active);
      this.setOpen(false);
      if (!focusWasInside) return;
      const scope = this.closest('[data-section-id]') || document.body;
      const target = getFocusableElements(scope).find((element) => !this.contains(element)
        && (this.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING));
      target?.focus({ preventScroll: true });
    }
```

Los comentarios van en ASCII, como el resto del archivo. No cambies nada más:

- Ni `setOpen`, ni `applyBackgroundInert`/`restoreBackgroundInert`, ni `disconnectedCallback`, ni los listeners existentes.
- Ni las funciones globales (`getFocusableElements`, `closeOtherDialogs`, `syncDialogScrollLocks`, `trapFocus`).
- Ni `CartDrawer` (B-03/B-04), ni las otras consultas de `61.99rem`/`47.99rem` (H-1).

Diff esperado: un archivo, unas 19 líneas añadidas (4 de E1; 15 de E2: 3 de comentario, 11 del método y 1 en blanco), 0 borradas. Debe coincidir con el diff `theme-base.js` → `theme-proto.js` del scratch, más los comentarios.

### 3.2 Por qué así

- **Una sola fuente del corte.** JS no conoce `62rem`: pregunta al CSS si el disparador se pinta. `getClientRects().length > 0` ya es el modismo del archivo para «visible» (`getFocusableElements`, `:21`; `visibleSwatches`, `:1919`). Si mañana cambia el corte en `base.css`, el JS sigue acertando sin tocarse. Funciona también con zoom del navegador, que cambia el ancho en rem y dispara `resize`.
- **Reutiliza el cierre existente.** `setOpen(false)` ya devuelve `aria-expanded="false"`, `aria-hidden="true"`, `inert` del panel, `overlay.hidden`, `data-open`, `body[data-drawer-open]` (recalculado por `syncDialogScrollLocks`, que respeta un `cart-drawer` abierto) y el `inert` de fondo exacto que puso (`restoreBackgroundInert` solo quita lo que no era `inert` antes). No se duplica lógica de estado.
- **Solo cierra si el cajón desapareció.** La barra de URL móvil, el teclado virtual o un giro sin cruce (390×844 → 844×390) disparan `resize`, pero el disparador sigue pintado y no pasa nada (escenario S3).
- **Foco.** Se cierra sin `restoreFocus`, porque el disparador oculto no acepta foco. Si el foco estaba dentro (o ya cayó a BODY por el ocultamiento), pasa al primer control visible que sigue al cajón en la misma sección (`<header data-section-id>`, `sections/header.liquid:34`): el primer enlace de la nav de escritorio; si el menú está vacío, el logo. Si el foco estaba fuera del cajón, no se mueve. Es la posición lógica más cercana (WCAG 2.4.3) y no fuerza scroll (`preventScroll`).
- **Ciclo de vida.** `this.listen` cuelga el listener del `AbortController` de `ThemeElement` (`:152-175`, ThemeElement): `disconnectedCallback` lo retira, también en recargas de sección del editor. Es el mismo patrón que `this.listen(window, 'resize', …)` en `:3883`.
- **Coste.** Con el cajón cerrado, el handler sale en la primera comparación. Con el cajón abierto, `getClientRects` fuerza un layout que el `resize` ya iba a necesitar.

### 3.3 Alternativas descartadas

| Alternativa | Motivo |
| --- | --- |
| `matchMedia('(min-width: 62rem)')` en JS (GEMINI-AUDIT-COMPARATIVA-001:113) | Duplica el corte a ciegas; el plan lo pide evitar (`:253`, `:520`). Ya hay cuatro duplicados (H-1) y no se añade un quinto. |
| Custom property CSS (`--drawer-enabled`) leída con `getComputedStyle` | Exige tocar `base.css` y crear un contrato nuevo para lo que `display: none` ya expresa. |
| `ResizeObserver` sobre `theme-drawer` | También detecta el `display: none` y cubre cambios de CSS sin `resize`, pero exige `disconnect()` manual, porque el `AbortController` no lo cubre. Es más código para un caso (cambio de tamaño de fuente raíz sin `resize`) que no se da en el tema. Queda como PD-1. |
| Mantener abierto pero quitar `inert`/scroll mientras está oculto, y reponerlos al volver | Más estado y más ramas; al volver, el cajón reaparecería abierto sin que nadie lo pidiera. |
| Llamar a `setOpen(false, true)` | `this.trigger.focus()` sobre un elemento con `display: none` no hace nada: el foco queda en BODY (comprobado en base). |

### 3.4 Archivos permitidos (lista CERRADA) y nivel

| Archivo | Operación |
| --- | --- |
| `assets/theme.js` | Solo E1 y E2, dentro de `class ThemeDrawer`. |
| `agent-comms/outbox-claude/harness-B-01-001/` (nuevo) | `drawer-breakpoint.mjs`, `salida-base.txt`, `salida-fix.txt`, `salida-base-mobile.txt` y `salida-fix-mobile.txt` (§4.2). No entra en el ZIP: `scripts/package-theme-zip.mjs` solo empaqueta carpetas del tema. |
| `agent-comms/outbox-claude/CLAUDE-REPORT-B-01-001.md` (nuevo) | Informe (§7). |

Prohibido tocar: `assets/base.css`, `sections/*`, `snippets/*`, `layout/*`, `templates/*`, `listings/*`, `config/*`, `locales/*`, `docs/requirements-ledger.md`, `agent-comms/BOARD.md` y `CLAUDE-CLOUD-STATUS.md`. Las tres últimas las actualiza el coordinador tras la revisión.

**Nivel 1 (RULES §3.5):** no cambia ningún `id`, `name`, `default`, opción de select, setting, clave `t:` ni atributo `data-*`/`aria-*` del markup. No hay archivos fuera de lista. El único cambio de comportamiento es que el menú se cierra cuando deja de verse.

Preflight de directiva (RULES §4.2):
- Ramas alcanzables: `isOpen && no pintado` se alcanza en S1, S2 y S4; `isOpen && pintado` en S3; `!isOpen` en «cajón cerrado»; `focusWasInside === false` solo si algo sacó el foco del cajón abierto (la trampa lo impide en uso normal; la rama es una guarda, y el arnés la ejercita con el caso «cajón cerrado» por la salida temprana). `target` indefinido si no hay ningún control visible después: queda la guarda `?.`.
- No se crean IDs ni `name` en formularios. No se tocan `aria-*`: `setOpen` ya los gestiona.
- Sin Nivel 2.

---

## 4. Criterios de aceptación y pruebas sin tienda

### 4.1 Criterios falsables

1. `git diff --stat $HEAD_INICIO -- assets/theme.js`: 1 archivo, ~19 inserciones, 0 borrados. `git diff --stat $HEAD_INICIO -- . ':!agent-comms'` no lista ningún otro archivo.
2. `git diff -U0 $HEAD_INICIO -- assets/theme.js` solo tiene hunks entre `class ThemeDrawer` y `class ProductGallery` (comprueba con `grep -n "class ThemeDrawer\|class ProductGallery\|closeIfHidden" assets/theme.js` que `closeIfHidden` aparece 2 veces, ambas entre las dos clases).
3. `grep -n "62rem\|61.99rem\|47.99rem" assets/theme.js` devuelve las mismas 5 apariciones que en el preflight (desplazadas), ninguna dentro de `ThemeDrawer`.
4. `node --check assets/theme.js` sin salida, exit 0.
5. Arnés en modo `fix` (theme.js de la copia de trabajo): `resumen fallos=0`, con y sin `MOBILE=1`. En modo `base` contra `$HEAD_INICIO`: los escenarios S1, S2, S4 y «submenú» fallan (25 fallos en `1fee9e2`), y S3, Escape y «cajón cerrado» pasan.
6. Tras cruzar a escritorio, en S1, S2 y S4: `data-open` ausente, `aria-expanded="false"`, overlay `hidden`, panel `inert`, `body` sin `data-drawer-open` y `overflow` distinto de `hidden`, ningún `inert` en main, footer, nav de escritorio ni logo, foco en el primer enlace de la nav de escritorio, `Tab` alcanza el siguiente control y la rueda desplaza la página. Nada de esto usa Escape.
7. Al volver a móvil: cajón cerrado y coherente; el disparador lo reabre con foco en Cerrar, y el botón Cerrar devuelve el foco al disparador.
8. Regresiones: S3 (giro sin cruce) sigue abierto con su `inert` y su bloqueo; Escape a 390 sigue cerrando y devolviendo el foco; con el cajón cerrado, un `resize` no mueve el foco.
9. Compuertas estáticas: `npx --no-install shopify theme check --fail-level error` («… no offenses found»), `node scripts/theme-check-sanity.mjs` (exit 0), `node scripts/dataset-hooks.mjs` (exit 0; en `1fee9e2` pasa) y `node scripts/json-validate.mjs` (exit 0). `node scripts/locale-key-inventory.mjs` es opcional: no se tocan locales. Pega la salida literal. Ninguna de ellas prueba el comportamiento: solo que el paquete no empeora (RULES §3.1).

### 4.2 Arnés entregable (SINTÉTICO, Chromium local)

Crea `agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs`. Si el scratch del redactor sigue disponible, puedes partir de su `harness.mjs` (código del propio proyecto, no de terceros); si no, reconstrúyelo con esta especificación:

- Uso: `node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs <repo> <fix|base> [SHA]`. `fix` lee `assets/base.css` y `assets/theme.js` de la copia de trabajo; `base` los lee con `git show <SHA>:…`. Sin aplicar parches en memoria. Variable `MOBILE=1`: contexto `isMobile` y `hasTouch`, apertura con `tap`.
- Importa Playwright desde `<repo>/node_modules/playwright/index.mjs` con `pathToFileURL`; sin rutas absolutas de máquina en el código ni en las salidas. Servidor HTTP local en `127.0.0.1` y puerto 0; sin red externa.
- La página traduce a mano `sections/header.liquid:34-128` (disparador, overlay `hidden`, panel con `role="dialog"`, `aria-modal`, `aria-hidden`, `tabindex="-1"`, `inert`, botón `data-drawer-close`, un `theme-disclosure` con submenú, un enlace simple) y la cabecera de escritorio (nav con 2 enlaces, logo, carrito) dentro de `<div class="shopify-section section-header"><header class="site-header color-scheme-1" data-section-id="header">`. `<html class="js">`, skip link, `<main id="MainContent" tabindex="-1">` con un enlace y 3000 px de alto, y footer con un enlace.
- Escenarios: S1 390×844 → 1280×800 → 390×844; S2 820×1180 → 1180×820 → 820×1180; S3 390×844 → 844×390 → 390×844 (sin cruce); S4 991×800 → 992×800 → 991×800; Escape a 390; cajón cerrado con foco en main y 390 → 1280; submenú abierto con foco en un enlace interior y 390 → 1280 → 390.
- Estados degenerados (añadir a los anteriores, solo en S1): **vacío**, nav de escritorio y lista móvil sin enlaces (el foco debe ir al logo); **muchos**, 40 enlaces en ambas navs y 5 submenús (foco al primer enlace de escritorio; el panel no deja `inert` residual).
- En cada paso registra: `data-open`, `aria-expanded`, `overlay.hidden`, `panel.inert`, `body[data-drawer-open]`, `overflow` calculado del `body`, qué de main/footer/nav/logo es `inert`, si el disparador se pinta y `document.activeElement`. Tras cruzar: `Tab` y rueda (`page.mouse.wheel(0, 600)`, `scrollY > 0`). Espera dos `requestAnimationFrame` tras cada cambio de viewport. Usa `page.click` con `timeout` corto para que el modo `base` no se cuelgue cuando el overlay tapa el disparador.
- Salida: una línea por estado, `OK`/`FAIL` por criterio, `resumen fallos=N`, código de salida 1 si hay fallos, y la etiqueta `SINTÉTICO (Chromium local, sin tienda)`. Guarda `salida-base.txt` (contra `$HEAD_INICIO`), `salida-fix.txt` y sus variantes `-mobile`.
- Antes de entregar, cuenta en los archivos del arnés el literal de contraseña sin imprimirlo (debe ser 0) y confirma que no aparece ninguna ruta absoluta del scratch.

Límites: no renderiza el header real de Shopify, ni el editor de temas, ni un dispositivo físico; `setViewportSize` emula el cambio de ancho. Es evidencia preliminar y no cierra filas (RULES §3.7).

### 4.3 Compuertas de calidad (RULES §2)

| Compuerta | Qué entregar |
| --- | --- |
| Requisitos | Filas de §5 con afirmación y evidencia `archivo:línea` y arnés. |
| Estados degenerados | Vacío (menú sin enlaces) y muchos (40 enlaces, 5 submenús) en el arnés. Uno: equivale a S1 con un solo enlace; se declara cubierto por «vacío» y «muchos» o se añade. Muy largo: títulos de 120 caracteres no cambian el mecanismo (el panel tiene `overflow-y: auto`, `base.css:779-788`); se justifica. Faltante: sin `data-drawer-trigger`/overlay/panel, `connectedCallback` sale antes de registrar listeners (`:284`), así que `closeIfHidden` nunca corre con `this.trigger` nulo; se declara. |
| Consistencia | Criterio 3 (sin cortes nuevos en JS) y prueba de que el corte sigue solo en `base.css:4389-4397`. Reutiliza `getFocusableElements` y `setOpen`; ningún selector ni constante nuevos. |
| Superficie del comerciante | No aplica: no cambian schema, labels, `t:` ni `info`. Se declara. |
| Tienda real | Pendiente (§4.4). Estado máximo: `código completo`. |

### 4.4 Pendiente de credenciales: prueba de R-B (no la ejecuta el implementador)

La ejecuta personalmente el revisor de R-B (plan `:377`, `:382`) en previews acreditados, con D13 (solo temas no publicados en la tienda autorizada). Matriz, en Sartorial, Imprint y Archive:

- Resize real de ventana en escritorio: abrir a 390, arrastrar a 1280 y volver; anotar foco, scroll, `inert` y estado en cada paso.
- Orientación en móvil simulado y, si está disponible, en tableta real: 820×1180 ↔ 1180×820 y 390×844 ↔ 844×390.
- Teclado y axe a 390 y 1280 tras cada cruce; editor de temas cambiando entre vista móvil y escritorio con el menú abierto.
- Interacción con el carrito: abrir el carrito desde el menú móvil, cruzar a escritorio y cerrar el carrito (H-2).
- Etiquetar cada resultado como TIENDA; no mezclar con el arnés SINTÉTICO.

---

## 5. Filas del ledger y estado máximo sin tienda

`docs/requirements-ledger.md` no numera filas; se citan por nombre y línea en `1fee9e2`. **El implementador no edita el ledger.** Lo propone en su informe; la actualización la hace su responsable (plan §6:396). Si cambia algún estado, el coordinador recalcula la cabecera con `node scripts/ledger-verify.mjs`.

| Fila (línea) | Estado actual | Afirmación que aporta B-01 | Estado máximo sin tienda | Cierre |
| --- | --- | --- | --- | --- |
| «Focus Trap y Gestión en Modales/Drawers», WCAG 2.4.3 (`:50`) | `cumplido`, dueño GPT. Su evidencia cita `assets/theme.js:1010-1080` y `:2780-2810`, que ya no corresponden a esos diálogos, y no cubre el menú móvil. TT-104 (reproducido en tienda) contradice el `cumplido` para `theme-drawer`. | Tras B-01, el menú se cierra al dejar de pintarse y devuelve scroll, `inert` y foco (`assets/theme.js`, `ThemeDrawer.closeIfHidden`); 0 fallos SINTÉTICOS en 7 escenarios. | `código completo` para `theme-drawer` | R-B (§4.4). |
| «Navegación por Teclado e Indicador de Foco», WCAG 2.4.7 (`:49`) | `código completo` (nota de A-03). | Tras cruzar el corte, el teclado vuelve a alcanzar la página (en `1fee9e2`, Tab no alcanzaba nada). | `código completo` (sin cambio de estado; añadir nota B-01). | R-B. |

Si `:50` debe bajar ya a `código completo` hasta R-B, o mantenerse con una nota, lo decide la R-D (PD-4).

---

## 6. Riesgos, dudas y hallazgos

### 6.1 Riesgos y prohibiciones

- No añadir `matchMedia` con `62rem`/`61.99rem`, ni tocar `base.css` para crear un contrato nuevo.
- No cambiar `setOpen` ni el reparto de `inert`: otras rutas (`closeOtherDialogs`, `CartDrawer.open`) dependen de él.
- No cerrar en cualquier `resize`: en móvil, la barra de URL y el teclado virtual lo disparan con el cajón visible (S3 lo vigila).
- No mover el foco si no estaba en el cajón.
- No declarar `cumplido` ninguna fila (D22, RULES §3.8). Etiquetas: el arnés es SINTÉTICO, la lectura es ESTÁTICA y no hay TIENDA.
- Riesgo residual: un navegador que oculte el disparador sin disparar `resize` (cambio de tamaño de fuente raíz en caliente) dejaría el defecto; Escape sigue recuperándolo. Se documenta (PD-1).

### 6.2 Dudas para la R-D

- **PD-1. Detección.** ¿`resize` + `getClientRects` del disparador (propuesto), o `ResizeObserver` sobre `theme-drawer` con `disconnect()` en `disconnectedCallback`?
- **PD-2. Destino del foco tras el cierre automático.** Propuesto: el primer control visible que sigue al cajón en su sección (nav de escritorio; logo si el menú está vacío). Alternativas: dejarlo en BODY o enviarlo a `#MainContent`.
- **PD-3. Submenús internos.** Tras el cierre automático, un `theme-disclosure` abierto dentro del cajón sigue abierto al volver (igual que tras cerrar con el botón hoy). ¿Se acepta, o se pliegan? Plegarlos ampliaría el cambio a todos los cierres.
- **PD-4. Fila `:50` del ledger.** ¿Bajarla ya a `código completo` (y actualizar su evidencia obsoleta) o esperar a R-B con una nota? Mismo caso que el D-1 de A-03.
- **PD-5. Vuelta a móvil con el foco en un control solo de escritorio.** Al volver a 390, el enlace de escritorio que recibió el foco se oculta y el foco cae a BODY; Chromium continúa el Tab desde ese punto (hacia el logo). Es comportamiento genérico del CSS responsive, no del cajón. Se propone dejarlo fuera de B-01 (H-3).
- **PD-6. `assets/base.css` fuera de la lista.** El plan lo cita como candidato; la solución no lo necesita. ¿Confirma la R-D que queda fuera?

### 6.3 Hallazgos extra fuera de alcance (no se tocan en B-01)

- **H-1. Cortes duplicados en JS.** `assets/theme.js:408` (`ProductGallery`, `max-width: 61.99rem`), `:4481` (índice de páginas legales, `61.99rem`), `:1861` y `:3788` (`47.99rem`). Duplican cortes de `base.css` (`:8491` y otros). P3 propuesto, higiene. Sin parche: cada uno necesita su propio contrato.
- **H-2. Carrito abierto desde el menú y cruce de corte.** `CartDrawer.open()` (`assets/theme.js:2489-2492`) fija como destino de vuelta el disparador del menú cuando el carrito se abre desde el cajón. Si luego se cruza a escritorio y se cierra el carrito, `focus()` sobre el disparador oculto no hace nada y el foco queda en BODY. ESTÁTICO, no verificado en el arnés. P3 propuesto; R-B lo observa (§4.4).
- **H-3. Foco en controles solo de escritorio al volver a móvil** (PD-5). Genérico; P3.
- **H-4. Evidencia obsoleta en la fila `:50`.** Cita `assets/theme.js:1010-1080` y `:2780-2810`; en `1fee9e2`, `ThemeDrawer` está en `:274-363` y los cierres de otros diálogos en otras líneas. Lo corrige el responsable del ledger (PD-4).

### 6.4 Conflictos y Johandry (D10)

- El plan nombra a GPT como dueño y cita `g20_g23.js`. D9 asigna la ejecución a Claude y el archivo no existe; se usa el arnés de §4.2. No requiere a Johandry.
- GEMINI-AUDIT-COMPARATIVA-001:113 propone `matchMedia` de 992 px; se descarta (§3.3). No requiere a Johandry.
- B-01 es P2, está en el plan, es Nivel 1 y no escribe en tiendas: **no requiere a Johandry**. Solo lo requeriría que la R-D clasificara H-2 como P0/P1 nuevo o ampliara el alcance fuera del plan.
- R-B sin credenciales: queda pendiente por D22/D13; la parada ya está registrada.

---

## 7. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-B-01-001.md`. Contenido obligatorio:

1. Cabecera RULES §1.4 completa: `ID: CLAUDE-REPORT-B-01-001`, Estado, `Decisión requerida: revisión D11 (subagente Opus de contexto limpio)`, resumen en 5 líneas, archivos tocados con líneas exactas tras la edición, desviaciones (Nivel 1/2), hallazgos extra, verificación y afirmaciones falsables numeradas.
2. `HEAD_INICIO` y el preflight de §1.3 con comandos y salida literal.
3. `git diff` completo de `assets/theme.js` y `git diff --stat $HEAD_INICIO -- . ':!agent-comms'`.
4. Salidas de los criterios 1 a 9 de §4.1, pegadas literalmente, cada una etiquetada (ESTÁTICO / SINTÉTICO) y con «qué demuestra / qué no».
5. Salidas completas del arnés: `base` y `fix`, con y sin `MOBILE=1`, incluidos los estados degenerados.
6. Compuertas de §4.3, una por una.
7. Propuesta de filas del ledger (§5), sin editar el ledger.
8. La matriz de §4.4 como «pendiente de credenciales / R-B», sin resultados inventados.
9. Declaración explícita: no se abrió `.secrets`, no se usaron tiendas ni gate5, no se imprimieron variables de entorno ni el literal de contraseña, no se copió código de SebastianDev017/atelier, no se tocaron metafields y no se hizo commit ni push.

Esfuerzo estimado: 2 a 3 h (edición, arnés con degenerados e informe). La matriz de R-B en previews es parte de la banda 0,5-1 d del plan.

---

## 8. Afirmaciones falsables de este borrador

1. En `1fee9e2`, `class ThemeDrawer` ocupa `assets/theme.js:274-363` y no registra ningún listener de `resize`, `orientationchange`, `matchMedia` ni `ResizeObserver`; el único `this.listen(window, 'resize'` del archivo está en `:3883`.
2. `assets/base.css:4389-4397` oculta `.site-header__mobile-menu` con `display: none` desde `min-width: 62rem`, y `sections/header.liquid:36` pone esa clase en el propio `<theme-drawer>`.
3. `body[data-drawer-open]` aplica `overflow: hidden` (`assets/base.css:142-145`) y solo lo retira `syncDialogScrollLocks` (`assets/theme.js:76-79`) cuando ningún `theme-drawer`/`cart-drawer` tiene `data-open`.
4. Con el arnés sintético sobre `1fee9e2`: abrir a 390 y pasar a 1280 deja `data-open`, `overflow: hidden`, `inert` en main, footer, nav de escritorio y logo, y el foco en BODY; Tab no alcanza nada y la rueda no desplaza. Total: 25 fallos, igual con `isMobile`/`hasTouch`.
5. Con E1 y E2 aplicados en memoria, los mismos escenarios dan 0 fallos; el foco pasa al primer enlace de la nav de escritorio; S3 (844 px, sin cruce) sigue abierto; Escape sigue funcionando.
6. `theme.js` contiene hoy cortes literales en `:408`, `:1861`, `:3788` y `:4481` (más el comentario de `:395`); ninguno en `ThemeDrawer`, y E1/E2 no añaden ninguno.
7. `g20_g23.js` no está en `git ls-files` ni en el sistema de archivos del entorno.
8. `sections/header.liquid:34` emite `data-section-id` en `<header>`, que es el `closest('[data-section-id]')` de `theme-drawer`.
9. `node --check` del `theme.js` con E1 y E2 aplicados termina sin error.
10. `node scripts/dataset-hooks.mjs` termina con exit 0 en `1fee9e2`.
