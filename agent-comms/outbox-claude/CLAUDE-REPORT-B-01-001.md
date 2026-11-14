# CLAUDE-REPORT-B-01-001: el menu movil se cierra solo al cruzar el breakpoint

```text
ID: CLAUDE-REPORT-B-01-001 (tarea B-01, plan V4.1; RC-10 / TT-104 / G-20; P2)
Estado: Entregado, SIN COMMIT. Estado maximo sin tienda: `codigo completo`.
Decision requerida: revision D11 (subagente Opus de contexto limpio).
Resumen en 5 lineas:
  1. `ThemeDrawer` escucha `resize` y llama a `closeIfHidden()`: si el cajon esta abierto y el disparador ya no se pinta (`getClientRects().length === 0`) cierra con `setOpen(false)` y mueve el foco al primer control visible que sigue al cajon.
  2. Diff = E1 + E2 + C-1 exactos, +19/-0, solo dentro de `class ThemeDrawer` (`assets/theme.js:299-302`, `:314-328`). Sin CSS, Liquid, schema ni locales (Nivel 1).
  3. Arnes `harness-B-01-001/drawer-breakpoint.mjs`: fix 0 fallos y base (`1fee9e2`) 41 fallos, con y sin MOBILE=1; 11 escenarios incl. teclado virtual, arrastre, vacio y muchos.
  4. Theme Check sin ofensas; sanity, dataset-hooks y json-validate exit 0; `62rem` = 0 dentro de ThemeDrawer.
  5. Pendiente: matriz R-B en tienda (sec. 8). Sin .secrets, tiendas, gate5, entorno ni literal de contrasena.
Archivos tocados: assets/theme.js; agent-comms/outbox-claude/harness-B-01-001/ (arnes + 4 salidas); este informe.
Desviaciones: ninguna. Nota de reinicio: ver sec. 9.
Hallazgos extra fuera de alcance: ninguno nuevo; H-1..H-4 de la R-D siguen como P3 (sec. 6).
Verificacion (comando, resultado y que demuestra/que no):
  - Preflight literal: `git rev-parse HEAD` -> 1fee9e2e0fdd9c62f5b58550487e2236057ac73f; `git status --short --untracked-files=no -- assets/theme.js` -> ` M assets/theme.js`; `git diff --stat HEAD -- assets/theme.js` -> 1 archivo, +19/-0.
  - `node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . fix|base` (con y sin MOBILE=1): fix 0 fallos, base (`1fee9e2`) 41. Demuestra el comportamiento en Chromium local con el CSS/JS reales y markup traducido a mano. No demuestra nada en tienda real (R-B pendiente).
  - Theme Check, sanity, dataset-hooks, json-validate: ver sec. 3. Demuestra sintaxis y que el paquete no empeora; no comportamiento.
Lista de afirmaciones falsables numeradas:
  1. El diff de `assets/theme.js` respecto de `1fee9e2` es +19/-0 y solo cae dentro de `class ThemeDrawer` (`:299-302`, `:314-328`).
  2. Con el arnes en modo fix, 0 fallos en los 11 escenarios, con y sin MOBILE=1.
  3. Con el arnes en modo base (`1fee9e2`), 41 fallos, con y sin MOBILE=1.
  4. `62rem` aparece 0 veces dentro de `ThemeDrawer`; el corte sigue solo en `assets/base.css:4389-4397`.
  5. En arrastre (89 `setViewportSize`), `setOpen(false)` se ejecuta exactamente una vez.
  6. No se tocaron CSS, Liquid, schema ni locales; el literal de contrasena cuenta 0 en los archivos de la entrega.
```

## 1. Base y preflight

```text
HEAD_INICIO = 1fee9e2 (rama lote-b)
$ git log --oneline -1   -> 1fee9e2 Lote A: R-A estatica (aceptado con cambios), ledger y estado
```
La edicion parcial previa en `assets/theme.js` se comparo con E1/E2 de la directiva y el comentario de C-1: coincide exactamente (texto de las 3 lineas de comentario de E1, `{ passive: true }` conservado, cuerpo de E2 identico). Se conserva sin cambios.

## 2. Codigo completo (`git diff HEAD -- assets/theme.js`)

```diff
diff --git a/assets/theme.js b/assets/theme.js
index 35f737f..b5dc3b8 100644
--- a/assets/theme.js
+++ b/assets/theme.js
@@ -296,6 +296,10 @@
         event.preventDefault();
         this.setOpen(false, true);
       });
+      // B-01 (TT-104). El corte movil/escritorio vive solo en el CSS (base.css oculta
+      // .site-header__mobile-menu en escritorio). Si el cajon abierto deja de pintarse por un
+      // cambio de ancho o un giro, se cierra aqui y devuelve scroll, inert y foco sin Escape.
+      this.listen(window, 'resize', () => this.closeIfHidden(), { passive: true });
     }
 
     disconnectedCallback() {
@@ -307,6 +311,21 @@
       return this.trigger?.getAttribute('aria-expanded') === 'true';
     }
 
+    // Cerrar sin restoreFocus: el disparador ya no se ve y focus() sobre el no haria nada.
+    // Si el foco estaba en el cajon (o cayo a BODY al ocultarse), pasa al primer control
+    // visible que sigue al cajon en su seccion: en escritorio, la navegacion principal.
+    closeIfHidden() {
+      if (!this.isOpen || this.trigger.getClientRects().length > 0) return;
+      const active = document.activeElement;
+      const focusWasInside = !active || active === document.body || this.contains(active);
+      this.setOpen(false);
+      if (!focusWasInside) return;
+      const scope = this.closest('[data-section-id]') || document.body;
+      const target = getFocusableElements(scope).find((element) => !this.contains(element)
+        && (this.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING));
+      target?.focus({ preventScroll: true });
+    }
+
     setOpen(open, restoreFocus = false) {
       if (!this.trigger || !this.overlay || !this.panel) return;
 
```

## 3. Verificacion ESTATICA (comando y salida literal)

```text
$ git diff --stat HEAD -- assets/theme.js
   assets/theme.js | 19 +++++++++++++++++++
   1 file changed, 19 insertions(+)
$ node --check assets/theme.js; echo exit=$?
  exit=0
$ grep -n 'class ThemeDrawer\|class ProductGallery\|closeIfHidden' assets/theme.js
  274:  class ThemeDrawer extends ThemeElement {
  302:      this.listen(window, 'resize', () => this.closeIfHidden(), { passive: true });
  317:    closeIfHidden() {
  384:  class ProductGallery extends ThemeElement {
$ grep -n '62rem\|61.99rem\|47.99rem' assets/theme.js
  414:    // 4F-001. Carrusel movil. Por debajo de 62rem la galeria (stack o grid) es una fila
  427:      this.carouselQuery = window.matchMedia('(max-width: 61.99rem)');
  1880:      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
  3807:      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
  4500:        if (disclosure && window.matchMedia('(max-width: 61.99rem)').matches) {
$ sed -n '274,383p' assets/theme.js | grep -c 62rem
  0
$ npx --no-install shopify theme check --path . 2>&1 | grep -i offenses
  │  93 files inspected with no offenses found.                                  │
$ node scripts/theme-check-sanity.mjs >/dev/null 2>&1; echo exit=$?
  exit=0
$ node scripts/dataset-hooks.mjs >/dev/null 2>&1; echo exit=$?
  exit=0
$ node scripts/json-validate.mjs >/dev/null 2>&1; echo exit=$?
  exit=0
```
Criterio corregido (C-1): `62rem` dentro de `ThemeDrawer` (`:274-383`) = 0; las 5 apariciones restantes (`:414`, `:427`, `:1880`, `:3807`, `:4500`) son las preexistentes (`:395`, `:408`, `:1861`, `:3788`, `:4481` en `1fee9e2`, desplazadas +19), ninguna en `ThemeDrawer`. `git diff HEAD --stat -- . ':!agent-comms'` lista tambien `snippets/localization-selectors.liquid`, que es de B-05 (otro agente), no de B-01. Demuestra: sintaxis y que el paquete no empeora. No demuestra comportamiento.

## 4. Verificacion SINTETICA (Chromium local, sin tienda)

Arnes: `agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs`. Uso: `node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . <fix|base> [SHA]` (SHA por defecto `1fee9e2`, valido tras el commit), `MOBILE=1` para tactil en todos los escenarios. Sin rutas absolutas ni parches en memoria; salida determinista (segunda ejecucion identica, `diff` vacio).

```text
MOBILE=0 fix -> resumen fallos=0
MOBILE=0 base -> resumen fallos=41
MOBILE=1 fix -> resumen fallos=0
MOBILE=1 base -> resumen fallos=41
```
En `base` (`1fee9e2`) fallan S1, S2, S4, submenu, vacio, muchos y arrastre (41 fallos en total con los degenerados); pasan S3 (sin cruce), teclado virtual, Escape y cajon cerrado. Salidas completas, con los 11 escenarios y los estados degenerados: `harness-B-01-001/salida-fix.txt`, `salida-base.txt`, `salida-fix-mobile.txt`, `salida-base-mobile.txt`. Resumen del modo fix:

```text
## S1 escritorio: 390x844 -> 1280x800 -> 390x844
  OK   tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)
  OK   tras cruzar: sin bloqueo de scroll
  OK   tras cruzar: sin inert en fondo
  OK   tras cruzar: foco en elemento visible (d-shop)
  OK   Tab alcanza el siguiente control (d-about)
  OK   rueda desplaza la pagina (scrollY>0: true)
  OK   vuelta: cerrado y coherente
  OK   reabre normalmente con foco en Cerrar
  OK   Cerrar devuelve el foco al disparador
## S2 giro tableta: 820x1180 -> 1180x820 -> 820x1180
  OK   tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)
  OK   tras cruzar: sin bloqueo de scroll
  OK   tras cruzar: sin inert en fondo
  OK   tras cruzar: foco en elemento visible (d-shop)
  OK   Tab alcanza el siguiente control (d-about)
  OK   rueda desplaza la pagina (scrollY>0: true)
  OK   vuelta: cerrado y coherente
  OK   reabre normalmente con foco en Cerrar
  OK   Cerrar devuelve el foco al disparador
## S3 giro movil (sin cruce): 390x844 -> 844x390 -> 390x844
  OK   sin cruce: sigue abierto con bloqueo e inert
## S4 justo en el corte: 991x800 -> 992x800 -> 991x800
  OK   tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)
  OK   tras cruzar: sin bloqueo de scroll
  OK   tras cruzar: sin inert en fondo
  OK   tras cruzar: foco en elemento visible (d-shop)
  OK   Tab alcanza el siguiente control (d-about)
  OK   rueda desplaza la pagina (scrollY>0: true)
  OK   vuelta: cerrado y coherente
  OK   reabre normalmente con foco en Cerrar
  OK   Cerrar devuelve el foco al disparador
## Degenerado vacio (nav sin enlaces: foco al logo): 390x844 -> 1280x800 -> 390x844
  OK   tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)
  OK   tras cruzar: sin bloqueo de scroll
  OK   tras cruzar: sin inert en fondo
  OK   tras cruzar: foco en elemento visible (logo)
  OK   Tab alcanza el siguiente control (cart)
  OK   rueda desplaza la pagina (scrollY>0: true)
## Degenerado muchos (40 enlaces, 5 submenus): 390x844 -> 1280x800 -> 390x844
  OK   tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)
  OK   tras cruzar: sin bloqueo de scroll
  OK   tras cruzar: sin inert en fondo
  OK   tras cruzar: foco en elemento visible (d-1)
  OK   Tab alcanza el siguiente control (d-2)
  OK   rueda desplaza la pagina (scrollY>0: true)
  OK   vuelta: cerrado y coherente
  OK   reabre normalmente con foco en Cerrar
  OK   Cerrar devuelve el foco al disparador
## Teclado virtual: 390x844 -> 390x420 -> 390x844 (solo cambia el alto)
  OK   sigue abierto con bloqueo, inert y foco en Cerrar
  OK   vuelta: sigue abierto con foco en Cerrar
## Arrastre: 89 setViewportSize de 400 a 1280 sin esperar entre pasos
  OK   setOpen(false) exactamente 1 vez
  OK   estado final coherente y foco visible en d-shop
## Regresion Escape a 390
  OK   Escape cierra y devuelve foco al disparador
## Cajon cerrado, foco en main, 390 -> 1280
  OK   foco intacto (main-link) y nada cambia
## Submenu abierto, foco en enlace interior, 390 -> 1280 -> 390
  OK   cerrado, sin inert, foco visible en d-shop
resumen fallos=0
```
Demuestra: el mecanismo con `theme.js` y `base.css` reales. No demuestra: dispositivo real, teclado virtual real, editor de temas ni tecnologia asistiva.

## 5. Compuertas (directiva 4.3)

- Requisitos: filas en sec. 7. Evidencia `assets/theme.js:299-302`, `:314-328` y arnes.
- Estados degenerados: vacio (nav sin enlaces, foco al logo) y muchos (40 enlaces, 5 submenus, foco `d-1`, sin `inert` residual) en el arnes; uno = cubierto por vacio/muchos; muy largo: no cambia el mecanismo (el panel ya tiene `overflow-y: auto`, `assets/base.css:779-788`); faltante: sin trigger/overlay/panel `connectedCallback` sale antes de registrar listeners, `closeIfHidden` nunca corre con `this.trigger` nulo.
- Consistencia: corte solo en `assets/base.css:4389-4397`; ningun literal nuevo en JS; reutiliza `getFocusableElements` y `setOpen`.
- Superficie del comerciante: no aplica (sin schema, labels, `t:` ni `info`).
- Tienda real: pendiente (sec. 8).

## 6. Hallazgos extra

Ninguno nuevo. H-1..H-4 (R-D) siguen como P3 fuera de B-01.

## 7. Propuesta de ledger (NO editado)

- «Focus Trap y Gestion en Modales/Drawers» (`docs/requirements-ledger.md:50`): propuesta `codigo completo` para `theme-drawer`, con evidencia `ThemeDrawer.closeIfHidden` y arnes `harness-B-01-001` (0 fallos SINTETICOS), nota «pendiente R-B»; reemplazar la evidencia obsoleta (H-4) (PD-4). El coordinador recalcula con `node scripts/ledger-verify.mjs`.
- «Navegacion por Teclado e Indicador de Foco» (`:49`): sin cambio de estado, nota B-01.

## 8. Pendiente de credenciales / R-B (no ejecutado)

Matriz en Sartorial, Imprint y Archive (solo temas no publicados, D13): resize real de ventana 390 -> 1280 -> 390; orientacion 820x1180 <-> 1180x820 y 390x844 <-> 844x390 (tableta real si hay); teclado y axe a 390 y 1280 tras cada cruce; editor de temas cambiando entre vista movil y escritorio con el menu abierto; carrito abierto desde el menu, cruce y cierre (H-2). Etiquetar como TIENDA. No hay resultados de tienda en este informe.

## 9. Nota del reinicio y declaraciones

Retomado tras un reinicio del contenedor: la edicion parcial sin commit se verifico contra E1/E2/C-1 y se conservo. El arnes se reconstruyo desde `b01/` y `rd-b01/` del scratch y se amplio segun C-3 (teclado virtual, arrastre >= 50 pasos con `setOpen(false)` = 1, MOBILE=1 en todos, foco visible con `getClientRects`). Compuerta del literal: `ruta=N` = 0 en `assets/theme.js`, el arnes, las 4 salidas y este informe. No se abrio `.secrets`, no se usaron tiendas ni gate5, no se imprimieron variables de entorno ni el literal de contrasena, no se copio codigo de SebastianDev017/atelier, no se tocaron metafields, no se hizo add/commit/stash/checkout/reset/push.
