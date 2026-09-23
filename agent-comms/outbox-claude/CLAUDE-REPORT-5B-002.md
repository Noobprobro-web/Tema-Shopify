# CLAUDE-REPORT-5B-002: Hotfix F01, foco perdido en el visor de zoom

```text
ID: CLAUDE-REPORT-5B-002 (responde a CLAUDE-DIRECTIVE-5B-002 y a GPT-AUDIT-007 F01)
Estado: ENTREGADO. Sin commit ni push. Working tree listo para la auditoría de Gemini.
Base: master d2a6aeb (el código del tema es el de a946c3b, Sprint 5B-001).
Decisión requerida:
  1. Gemini: auditar el diff (assets/product-zoom.js +25 -28, fila 73 del ledger y el arnés) y
     autorizar commit y despliegue.
  2. Gemini: aceptar o revertir D1 y D2 (§4). Las dos amplían el destino del foco que fija la
     directiva a casos que F01 no cubría; ninguna cambia ids, claves ni marcado.
  3. GPT o Gemini: repetir en la tienda la ruta de F01 (F04 EN 1280 y ES 360, clic y Enter) tras
     el despliegue. El arnés reproduce el defecto en Chromium, pero no sustituye la Compuerta 5.
Resumen en 5 líneas:
  1. F01 confirmado y ampliado: en Chromium, un botón enfocado que recibe `hidden` o `disabled`
     suelta el foco a body en el acto (medido). Pasa con Reset y también con Acercar al máximo,
     Alejar a 1x y Anterior o Siguiente en los extremos: 6 rutas, todas con el diálogo abierto.
  2. Arreglo: `set()` (product-zoom.js:155-166) mueve el foco antes de desactivar u ocultar, y
     después aplica la salvaguarda general `dialog.open && !dialog.contains(activeElement)`.
  3. Reset lleva el foco a Acercar. Acercar al máximo lo lleva a Alejar, no a Cerrar: si no, un
     Enter más cerraría el visor (D1). Los extremos de la galería lo llevan al otro paso (D2).
  4. Arnés 5B: 25/25 en inglés y en español. Las 9 pruebas nuevas fallan en el código de
     5B-001 (16 pasan, 9 fallan) y las 16 anteriores siguen pasando.
  5. product-zoom.js: 11.945 bytes (antes 11.970), 3.850 en gzip. gates:static exit 0; 118
     archivos sin ofensas en la carpeta de Johandry; 394 claves con paridad.
Archivos tocados: assets/product-zoom.js, docs/requirements-ledger.md (fila 73: el localizador
  1-288 quedaba fuera de rango y la compuerta del ledger fallaba), harness-5B-001/zoom5b.spec.mjs
  (9 pruebas nuevas), harness-5B-001/5B-002-hotfix.diff y las sondas probe-f01b.mjs y
  probe-f01c.mjs (nuevas), y este informe.
Desviaciones (Nivel 1 o Nivel 2): D1 y D2 de Nivel 1 (§4). Ninguna de Nivel 2.
Hallazgos extra fuera de alcance: §5.
Verificación (comando, resultado y qué demuestra/qué no): §6.
Lista de afirmaciones falsables numeradas: §7.
```

---

## 1. Diagnóstico

GPT tenía razón en el mecanismo. En 5B-001, `apply()` ocultaba o desactivaba los botones y **después** leía `document.activeElement` para rescatar el foco, pero para entonces Chromium ya lo había soltado. Lo medí en el arnés (Chromium 141, `probe-f01b`), con el diálogo abierto:

```text
reset.focus(); reset.hidden = true        -> document.activeElement: BODY (en la misma línea)
out.focus();   out.disabled = true        -> document.activeElement: BODY
reset.focus(); zoom.zoomTo(1) (5B-001)    -> BODY al salir de apply()
```

La guarda de 5B-001 (`dialog.contains(active) && (active.disabled || active.hidden)`) nunca veía el botón enfocado, así que no hacía nada. El daño es mayor que un anillo de foco perdido: con el foco en body, los `keydown` ya no llegan al diálogo y `+`, `-`, `0`, las flechas, Home y End dejan de responder hasta que se pulsa Tab.

El mismo patrón afecta a todo botón que pueda pasar a inactivo con el foco encima. Lo medí ruta por ruta en el código de 5B-001 y en el arreglado (1280 px, `probe-f01c`):

| Ruta | 5B-001 | 5B-002 |
|---|---|---|
| Reset zoom (clic) | BODY | Zoom in |
| Acercar con Enter hasta el máximo | BODY | Zoom out |
| Tres Enter más desde ahí | BODY, visor abierto | Zoom in, visor abierto (vuelve a 1x, no se cierra) |
| Alejar con Enter hasta 1x | BODY | Zoom in |
| Siguiente hasta la 4/4 | BODY | Previous image |
| Anterior hasta la 1/4 | BODY | Next image |

GPT-AUDIT-007 reportó la primera ruta. Las otras cinco son el mismo defecto y las cubre el mismo arreglo.

---

## 2. Cambio en assets/product-zoom.js

### 2.1 El arreglo (líneas 112, 152 y 155-166)
```diff
@@ select(index, force)
-    this.steps.forEach((step) => {
-      step.disabled = !this.slides[index + Number(step.dataset.zoomStep)];
-    });
+    this.set(this.steps.map((step) => [step, !this.slides[index + Number(step.dataset.zoomStep)]]), this.steps);
@@ apply()
-    this.inButton.disabled = fit.max < 1.25 || scale >= fit.max - 0.01;
-    this.outButton.disabled = scale <= 1;
-    this.resetButton.hidden = scale <= 1;
-    const active = document.activeElement;
-    if (dialog.contains(active) && (active.disabled || active.hidden)) {
-      [this.inButton, this.outButton, ...this.steps, this.closeButton].find((button) => !button.disabled && !button.hidden)?.focus();
-    }
+    this.set([[this.inButton, fit.max < 1.25 || scale >= fit.max - 0.01], [this.outButton, scale <= 1], [this.resetButton, scale <= 1]]);
+  }
+
+  // F01: Chromium deja el foco en body si el boton enfocado se oculta o se desactiva; antes
+  // pasa al primer control que sigue activo (Alejar antes que Cerrar).
+  set(states, prefer = []) {
+    const next = new Map(states);
+    const move = () => [...prefer, this.inButton, this.outButton, ...this.steps, this.closeButton]
+      .find((button) => !(next.has(button) ? next.get(button) : button.disabled || button.hidden))?.focus();
+    if (next.get(document.activeElement)) move();
+    next.forEach((off, button) => {
+      button[button === this.resetButton ? 'hidden' : 'disabled'] = off;
+    });
+    if (this.dialog.open && !this.dialog.contains(document.activeElement)) move();
   }
```
Cómo cumple la directiva, punto por punto (§2.A):
1. **Comprobar el foco antes de mutar:** `next.get(document.activeElement)` se evalúa antes de tocar ningún atributo.
2. **Mover antes de ocultar o desactivar:** si el botón enfocado va a quedar inactivo, `move()` enfoca el destino antes del `forEach` que aplica `hidden` y `disabled`. El destino se elige con el estado **futuro** (`next`), así que nunca cae en un botón que está a punto de desactivarse.
3. **Aplicar después** los tres estados de la directiva, más los de Anterior y Siguiente desde `select()`.
4. **Salvaguarda general:** `this.dialog.open && !this.dialog.contains(document.activeElement)` devuelve el foco al primer control disponible de `[inButton, outButton, ...steps, closeButton]`, la lista de la directiva. Cubre cualquier otra pérdida (un `blur()` de otro script, por ejemplo) en la siguiente actualización del visor.

Orden de destino: el `prefer` del llamador y después la lista de la directiva. Desde `apply()` (sin `prefer`): Acercar, Alejar, pasos, Cerrar. Desde `select()`: primero el otro paso.

### 2.2 Presupuesto (< 12 KB)
El arreglo, con la guarda anterior ya quitada, sumaba 643 bytes (12.613). Para seguir por debajo de 12.000 bytes (y no solo de 12.288), recorté sin cambiar comportamiento:
- `indexFromScroll()` pasa a línea dentro del manejador de scroll, su único uso;
- `disconnectedCallback` usa `this.dialog?.close()`, porque `close()` no hace nada si el diálogo no está abierto;
- `setPointerCapture` sin `?.`, porque existe en todo navegador con Pointer Events;
- `statusTemplate` sin `|| ''`, porque el snippet siempre lo emite y `gates:hooks` lo comprueba;
- cuatro comentarios acortados o quitados, y el `still` de `goTo` reescrito como `smoothly`.

Resultado: 11.970 → 11.945 bytes, 288 → 285 líneas. Las 16 pruebas de 5B-001 siguen pasando con el archivo nuevo.

---

## 3. Arnés (`harness-5B-001/zoom5b.spec.mjs`, líneas 184-282)

Instrumento: `watchFocus` (187-195) registra cada `focusout` del diálogo abierto cuyo `relatedTarget` queda fuera de él. Es la huella exacta de F01 aunque un arreglo posterior devuelva el foco en la misma tarea. `focusState` (196-205) lee dentro o fuera, `tagName`, qué control tiene el foco y la escala. `ES` ahora se deduce del sufijo `-es` del sitio (línea 7), para correr el árbol previo en español.

| Prueba | Viewports | Qué comprueba justo después de activar |
|---|---|---|
| F01 `${w}px click` | 1280×800, 360×800 | Reset con ratón: escala 1, `open`, `dialog.contains(activeElement)`, `tagName !== 'BODY'`, foco en Acercar, 0 focusout fuera, Reset oculto y 8 Tab dentro |
| F01 `${w}px Enter` | 1280, 360 | Lo mismo activando Reset con Enter |
| F01 `${w}px Space` | 1280, 360 | Lo mismo con Espacio |
| F01 `${w}px`: extremos | 1280, 360 | Acercar con Enter ×3 → 3x, Acercar inactivo, foco en Alejar. Alejar con Espacio ×3 → 1x, foco en Acercar. Siguiente con Enter ×3 → 4/4, foco en Anterior. Anterior ×3 → 1/4, foco en Siguiente. 0 focusout fuera en toda la secuencia |
| F01 salvaguarda | 1280 | `blur()` con el visor abierto (foco en BODY) y `zoomTo(1.5)`: el foco vuelve a Acercar |

Son 9 pruebas; con `SITE=site` (inglés) y `SITE=site-es` (español) cubren EN y ES, como pide §2.B.5.

---

## 4. Desviaciones de Nivel 1

| # | Directiva | Implementado | Por qué |
|---|---|---|---|
| D1 | Destino: Acercar y, si no está disponible, Cerrar | Acercar, Alejar, pasos y Cerrar (la lista de la salvaguarda de la propia directiva) | Cuando Acercar llega al máximo se desactiva él mismo. Con "Acercar o Cerrar", el foco saltaría a Cerrar y el siguiente Enter del comprador, que sigue pulsando para ampliar, cerraría el visor. Con Alejar, tres Enter más lo devuelven a 1x con el visor abierto (§1) |
| D2 | No especifica Anterior y Siguiente | Al desactivarse un paso en un extremo, el foco pasa al otro paso (`prefer = this.steps`) | Mismo defecto (medido: BODY al llegar a 4/4). El otro paso es el control que el comprador busca a continuación |

Para Reset, el caso de F01, el destino es exactamente el de la directiva: Acercar. Cerrar solo queda como último recurso, cuando no hay otro control activo (una foto sin zoom en un producto de una sola foto).

---

## 5. Hallazgos extra fuera de alcance (no aplicados)
- **E1, desmontaje con el visor abierto.** `dialog.close()` dispara `close` en una tarea posterior, y para entonces `super.disconnectedCallback()` ya quitó los listeners: si el editor de temas vuelve a pintar la sección con el visor abierto, `handleClose` no corre. `body[data-modal-open]` se corrige solo, porque el componente ya no está en el documento; el foco no vuelve al disparador, que también fue reemplazado. Es igual en 5B-001 y solo ocurre en el editor. Parche posible: llamar `this.handleClose()` en `disconnectedCallback` si estaba abierto.
- **E2, fila 73 del ledger.** Gemini la añadió citando `assets/product-zoom.js:1-288`. Con 285 líneas, `gates:ledger` daba "fuera de rango" y `gates:static` salía con 1. Actualicé el localizador a `1-285`, añadí la cita del hotfix (`112,152-166`) y cambié "16/16" por "25/25". El estado sigue en `código completo`.

---

## 6. Verificación

### 6.1 Arnés 5B (Chromium, Liquid real con liquidjs, JS y CSS reales)
```text
SITE=site            (árbol 5B-002, inglés)    25 passed
SITE=site-es         (árbol 5B-002, español)   25 passed
SITE=site-5b001      (product-zoom.js de 5B-001, inglés)   9 failed, 16 passed
SITE=site-5b001-es   (product-zoom.js de 5B-001, español)  9 failed, 16 passed
SITE=site-before     (árbol b1125bd, sin zoom)             25 failed
```
En 5B-001 fallan exactamente las 9 pruebas nuevas:
```text
F01 1280px click|Enter|Space   Expected: true  Received: false   (dialog.contains(activeElement))
F01 360px  click|Enter|Space   Expected: true  Received: false
F01 1280px / 360px extremos     [true, "out", []]  recibido  [false, null, ["Zoom in"]]   (es: ["Acercar"])
F01 salvaguarda                 inside: false, isIn: false
```

### 6.2 Regresión (renders regenerados, assets enlazados al árbol final)
```text
Arnés 5A-003 (28)                 en 28/28   es 28/28
Arnés 5A (36)                     en 36/36   es 36/36
Arnés heredado 4B a 4F (106)      101/106; los mismos 5 typescale T1 que antes de 5B
```

### 6.3 Compuertas (copia en la nube, árbol final, sin las carpetas `site*` del arnés)
```text
$ npm run gates:static                                                        exit 0
  Archivos .json comprobados: 36 | Fallos de parseo: 0
  JS leido: assets/product-zoom.js, assets/theme.js | <product-zoom> 1 claves 1 montaje(s) | Contratos rotos: 0
  [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
  Claves en en.default.json: 394 hojas | Sin resolver en storefront: 0 | Sin resolver en schema: 0 | Huerfanas en storefront: 0
  Filas de requisito: 54 | Incoherencias: 0        (con la fila 73 de d2a6aeb: 1 incoherencia, "1-288 fuera de rango")
  84 files inspected with no offenses found.
  > node --check assets/theme.js && node --check assets/product-zoom.js      ok
  Your local theme was packaged in Sartorial-1.0.0.zip
$ wc -c assets/product-zoom.js ; gzip -9c | wc -c ; wc -l                    11945 ; 3850 ; 285
```

### 6.4 En la carpeta de Johandry (después de entregar)
```text
md5sum -c (6 archivos, LF, antes de copiar este informe)            6/6 OK
npm run gates:json | gates:hooks | gates:locales | gates:ledger | gates:syntax   exit 0 los cinco
./node_modules/.bin/shopify theme check --no-color                  118 files inspected with no offenses found.   exit 0
node harness-ML-001/locale-parity.mjs .                             es.json: 394 claves, 0 problemas
python3 harness-LOCALE-001/liquid-literals.py .                     48 archivos Liquid, 0 hallazgos
wc -c assets/product-zoom.js                                        11945
git status --short                                                  M assets/product-zoom.js, M docs/requirements-ledger.md,
                                                                    M harness-5B-001/zoom5b.spec.mjs; ?? 5B-002-hotfix.diff,
                                                                    probe-f01b.mjs, probe-f01c.mjs y este informe
                                                                    (+ main-search.liquid, solo CRLF, previo)
git diff --ignore-cr-at-eol --stat -- assets docs                   2 files changed, 26 insertions(+), 29 deletions(-)
git log -1                                                          d2a6aeb (sin commit)
```
No corrí `gates:sanity` ni `gates:package` en la carpeta de Johandry: el primero deja un sandbox que el puente no puede borrar y el segundo sobrescribe `Sartorial-1.0.0.zip`. Los dos pasan en la copia (§6.3).

### 6.5 Comandos (desde `agent-comms/outbox-claude/harness-5B-001/`)
```text
OUT_DIR=site node render5b.mjs
OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5b.mjs
SITE=site    npx playwright test -c pw.config.mjs
SITE=site-es npx playwright test -c pw.config.mjs
npx playwright test -c pw.config.mjs -g F01        # solo las 9 de este hotfix
```
Para reproducir el árbol previo: un `THEME_ROOT` con el `product-zoom.js` de a946c3b y `OUT_DIR=site-5b001`. El diff completo del hotfix (JS, ledger y arnés) está en `harness-5B-001/5B-002-hotfix.diff`.

### 6.6 Qué no demuestra
- Chromium de escritorio. Safari y Firefox aplican la regla de reparación del foco en otro momento: el arreglo mueve el foco antes de mutar y no depende de cuándo lo hace cada motor, pero no está medido en ellos.
- Sin lector de pantalla real. La prueba comprueba que el foco nunca pasa por body (0 `focusout` fuera del diálogo), que es lo que evita el anuncio de "documento" o el silencio.

---

## 7. Afirmaciones falsables
1. `wc -c assets/product-zoom.js` da 11945 y `node --check` pasa.
2. En `set()` (product-zoom.js:157-166), el `move()` de la línea 161 se ejecuta antes del `forEach` que asigna `hidden` y `disabled` (162-164); la salvaguarda está en la 165.
3. Con el visor abierto en la foto de 3000 px, Acercar y luego Reset (por clic, Enter o Espacio, a 1280 o 360 px), `document.activeElement` es el botón `[data-zoom-in]` y no hay ningún `focusout` con `relatedTarget` fuera del diálogo.
4. Con Acercar en el máximo, el foco está en `[data-zoom-out]`, no en `[data-zoom-close]`, y tres Enter más dejan el visor abierto a 1x.
5. Con Siguiente en la última foto, el foco está en `[data-zoom-step="-1"]`; con Anterior en la primera, en `[data-zoom-step="1"]`.
6. Con el visor abierto, tras `document.activeElement.blur()` y `zoomTo(1.5)`, el foco vuelve a `[data-zoom-in]`.
7. Con el `product-zoom.js` de a946c3b, esas mismas 9 pruebas fallan y las 16 de 5B-001 pasan.
8. `npm run gates:static` sale con 0; `gates:ledger` da 54 filas y 0 incoherencias; en la carpeta de Johandry, Theme Check da 118 archivos sin ofensas.
9. `en.default.json` y `es.json` siguen con 394 claves y paridad; este hotfix no toca locales, Liquid ni CSS.
10. No hay commit: `git log -1` sigue en d2a6aeb.
