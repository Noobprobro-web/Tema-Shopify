# GEMINI-REPORT-PRODUCT-ZOOM-TOUCH-001: Corrección y Verificación de Zoom Táctil (Transición Pellizco a Arrastre)

**Fecha:** 2026-10-27  
**Autor:** Gemini Flash 3.8 High (Arquitecto y Auditor de Interacción Táctil)  
**ID de Entrega:** `GEMINI-REPORT-PRODUCT-ZOOM-TOUCH-001`  
**Archivo Modificado:** `assets/product-zoom.js`  
**Estado:** Resuelto, verificado al 100% (56/56 pruebas automatizadas en verde)

---

## 1. Resumen Ejecutivo y Diagnóstico

### El Problema Reportado
En simulación táctil del visor de producto (`<product-zoom>` en `assets/product-zoom.js`), tras ampliar con dos dedos (pinch-to-zoom) y levantar uno, el dedo restante no arrastraba la imagen aunque existía margen disponible (`bounds() > 0`).

### Causa Raíz Confirmada
El visor gestiona gestos táctiles mediante Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) almacenando punteros activos en `this.pointers = new Map()`.

1. **Al iniciar el pellizco (2 dedos):**
   - El primer dedo en `pointerdown` establecía `this.start = { event, x: this.x, y: this.y }`.
   - Al tocar el segundo dedo, `this.start` se anulaba intencionalmente (`this.start = pointers.size === 1 ? ... : null;`), y se inicializaba `this.pinch = { gap, scale, x, y, mid }`.
   - Mientras ambos dedos se movían, el bloque `if (pinch && b)` controlaba la ampliación y la traslación.

2. **Al levantar un dedo (quedando 1 en pantalla):**
   - En el código anterior, la liberación de punteros se manejaba con una sola condición excluyente:
     ```javascript
     } else if (pointers.delete(id) && !pointers.size) {
       this.start = this.pinch = null;
       this.dialog.removeAttribute('data-gesture');
       if (pinch) this.announce();
       ...
     }
     ```
   - Al levantarse el primer dedo, `pointers.delete(id)` eliminaba el puntero del mapa y devolvía `true`.
   - Sin embargo, como el otro dedo continuaba apoyado en la pantalla, `pointers.size === 1`. Por lo tanto, `!pointers.size` evaluaba a **`false`**.
   - **Consecuencia:** El bloque `else if` **no se ejecutaba**.
     * `this.start` continuaba siendo `null`.
     * `this.pinch` continuaba reteniendo la referencia al pellizco anterior.
   - En los subsecuentes eventos `pointermove` del dedo restante:
     * `const [a, b] = pointers.values();` -> `b` era `undefined`.
     * `if (pinch && b)` -> evaluaba a `false` (faltaba el segundo dedo).
     * `else if (start)` -> evaluaba a `false` (`start` era `null`).
     * **Resultado:** Ningún bloque de movimiento se ejecutaba. La imagen quedaba totalmente inerte y congelada bajo el dedo del usuario.

---

## 2. Solución Quirúrgica Aplicada en `assets/product-zoom.js`

Se refactorizó el bloque de liberación de punteros (`pointerup` y `pointercancel`) para cubrir de forma determinista todas las transiciones de estado multi-touch:

```javascript
    } else if (pointers.delete(id)) {
      if (pointers.size === 1) {
        const [remaining] = pointers.values();
        this.start = { event: remaining, x: this.x, y: this.y, moved: Boolean(pinch || start?.moved) };
        if (pinch) this.announce();
        this.pinch = null;
        if (this.scale > 1) {
          this.dialog.setAttribute('data-gesture', '');
          try { this.track.setPointerCapture(remaining.pointerId); } catch {}
        }
      } else if (pointers.size >= 2) {
        const [a, b] = pointers.values();
        this.pinch = { gap: gap(a, b) || 1, scale: this.scale, x: this.x, y: this.y, mid: mid(a, b) };
        this.start = null;
      } else {
        this.start = this.pinch = null;
        this.dialog.removeAttribute('data-gesture');
        if (pinch) this.announce();
        else if (type === 'pointerup' && start && !start.moved && event.timeStamp - start.event.timeStamp < 500) {
          this.tap(event, start.event.target);
        }
      }
    }
```

### Mecánica de la Corrección:
1. **Transición Pellizco -> Arrastre (`pointers.size === 1`):**
   - Se toma el puntero restante (`const [remaining] = pointers.values()`).
   - Se re-inicializa `this.start` con el puntero restante, anclando `start.x = this.x` y `start.y = this.y` (las coordenadas actuales de la imagen). Esto garantiza **cero salto visual** al iniciar el arrastre con el dedo restante.
   - Se marca `moved: Boolean(pinch || start?.moved)` para asegurar que al levantar el último dedo no se confunda con un tap accidental que cerraría o reajustaría el zoom.
   - Se anuncia el nivel final de zoom alcanzado en el live region para accesibilidad (`if (pinch) this.announce()`).
   - Se resetea `this.pinch = null`.
   - Si `this.scale > 1`, se preserva el atributo `data-gesture` (que desactiva transiciones CSS para tracking a 60fps) y se intenta asegurar la captura de puntero del dedo restante.
2. **Multi-touch con más de 2 dedos (`pointers.size >= 2`):**
   - Si el usuario tenía 3 dedos y levanta 1, se recalculan el `mid` y el `gap` con los 2 dedos restantes para evitar saltos bruscos.
3. **Liberación Total (`!pointers.size`):**
   - Limpieza completa del estado táctil (`this.start = this.pinch = null`, eliminación de `data-gesture`).
   - Si fue un toque simple sin movimiento (<500ms y sin previo pellizco), se activa el `tap` (zoom-in/zoom-out o cierre).

---

## 3. Pruebas Automatizadas y Evidencia de Ejecución

Se construyó una suite de pruebas exhaustiva en `scratch/test-product-zoom-touch.mjs` utilizando Playwright con emulación táctil activada (`hasTouch: true`).

### Ejecución de la Suite:
```
================================================================
    TEST SUITE: PRODUCT ZOOM TOUCH INTERACTION & REGRESSION    
================================================================

--- TEST 1: Inicialización y dimensiones base ---
  PASS: El modal de zoom está abierto
  PASS: Escala inicial es 1
  PASS: Escala máxima es 3.0
  PASS: Coordenadas iniciales son (0, 0)

--- TEST 2: Transición de Pellizco (2 dedos) a Arrastre (1 dedo) ---
  PASS: Pointers map tiene 2 dedos registrados
  PASS: Pinch está activo
  PASS: data-gesture está activo durante pellizco
  PASS: Escala ampliada con 2 dedos es 2.0 (actual: 2)
  PASS: Margen horizontal disponible es 200px (actual: 200)
  PASS: Margen vertical disponible es 100px (actual: 100)
  PASS: Queda exactamente 1 dedo registrado
  PASS: El estado de pinch fue finalizado limpiamente
  PASS: El dedo restante fue re-anclado como start
  PASS: El puntero re-anclado es el dedo restante (id 10)
  PASS: start.x y start.y coinciden con la posición previa (3, 40)
  PASS: start.moved está en true para evitar falso tap
  PASS: data-gesture se mantiene activo para arrastre fluido
  PASS: Live region anunció el nivel de zoom final (200%): "1 of 2, zoom 200%"
  PASS: El dedo restante arrastró la imagen en X en +50px a 53px (actual: 53px)
  PASS: Posición Y se mantiene sin salto en 40px (actual: 40px)
  PASS: Transform refleja translate3d(53px, 40px)
  PASS: Posición X se mantiene en 53px
  PASS: El dedo restante arrastró la imagen en Y en +40px a 80px (actual: 80px)
  PASS: Transform refleja translate3d(53px, 80px)
  PASS: Clamping en X funciona correctamente (tope en boundX 200px, actual: 200px)
  PASS: Clamping en Y funciona correctamente (tope en boundY 100px, actual: 100px)
  PASS: Todos los punteros están libres (size 0)
  PASS: start se reseteó a null
  PASS: pinch se mantiene en null
  PASS: data-gesture fue retirado tras soltar
  PASS: La escala no se modificó por error al soltar (se mantiene 2.0)

--- TEST 3: Transición levantando el Dedo 1 (Dedo 2 restante arrastra) ---
  PASS: Dedo 2 restante arrastra hacia la izquierda a -40px (actual: -40px)
  PASS: Transform refleja translate3d(-40px, 0)
  PASS: Punteros completamente limpios

--- TEST 4: Verificación de Tap y Doble Tap ---
  PASS: Doble tap en imagen amplía a zoom máximo 3x (actual: 3)
  PASS: Segundo doble tap devuelve la imagen a escala 1x (actual: 1)

--- TEST 5: Controles de Teclado ---
  PASS: Tecla '+' amplía por factor 1.5 (actual: 1.5)
  PASS: Flecha derecha desplaza en X negativamente (paneo)
  PASS: Tecla '-' reduce escala (actual: 1)
  PASS: Tecla '0' resetea escala a 1x (actual: 1)

--- TEST 6: Botones de UI (+, -, Reset, Close) ---
  PASS: Botón Zoom In amplía a 1.5x
  PASS: Botón Zoom Out reduce a 1.0x
  PASS: Zoom In sucesivo amplía
  PASS: Botón Reset devuelve a 1.0x

--- TEST 7: Multi-turn (Pellizco -> Arrastre -> Nuevo Pellizco -> Arrastre) ---
  PASS: Turno 1: Escala inicial de pellizco es 1.5x
  PASS: Turno 1: Dedo restante arrastra exactamente +30px en X (actual: 30px)
  PASS: Turno 2: Segundo pellizco incrementa escala (actual: 3)
  PASS: Turno 2: Nuevo dedo restante arrastra exactamente +25px en Y (actual: 25px)
  PASS: Estado multi-turn totalmente libre de punteros residuales
  PASS: data-gesture retirado al soltar

--- TEST 8: Manejo de PointerCancel ---
  PASS: Tras pointercancel de un dedo, queda 1 puntero
  PASS: El dedo restante pasa a ser start para arrastre
  PASS: Pinch queda cancelado
  PASS: Tras cancelar todos los dedos, 0 punteros
  PASS: start reseteado a null
  PASS: data-gesture removido tras cancelación

================================================================
TOTAL PRUEBAS: 56 | EXITOSAS: 56 | FALLOS: 0
================================================================
```

---

## 4. Distinción: Simulación Sintética vs. Dispositivo Físico Real

Es fundamental documentar las diferencias arquitectónicas entre el entorno de pruebas automatizadas y la interacción en hardware físico:

| Dimensión | Simulación Sintética (Playwright / CDP) | Dispositivo Físico Real (iOS / Android) |
| :--- | :--- | :--- |
| **Generación de Eventos** | Eventos `PointerEvent` y `TouchEvent` inyectados vía script o CDP con coordenadas matemáticas exactas. | Sensores táctiles capacitivos con ruido analógico, micro-vibraciones y deformación del área de contacto del dedo. |
| **Tasa de Muestreo (Sampling Rate)** | Discreta y sincrónica al ciclo de ejecución del test. | Tasa de hardware de 120Hz a 240Hz, desacoplada de la tasa de refresco visual (60Hz / 120Hz ProMotion). Los navegadores aplican *event coalescing* (`event.getCoalescedEvents()`). |
| **Gestos del Sistema Operativo** | No existen gestos del sistema operativo que compitan (no hay barra de navegación ni bordes activos). | - **iOS Safari:** El deslizamiento desde el borde izquierdo activa la navegación histórica de Safari ("swipe to go back").<br>- **Android:** Los gestos de navegación del sistema pueden interceptar movimientos perimetrales. |
| **Cancelación de Punteros (PointerCancel)** | Sólo ocurre si el arnés de prueba despacha deliberadamente `pointercancel`. | Ocurre con frecuencia cuando: (a) la palma reposa involuntariamente sobre la pantalla (*palm rejection*), (b) se despliega el Centro de Control o notificaciones, o (c) el navegador decide tomar el control del scroll si no se previno adecuadamente. |
| **Prevención de Scroll Nativo** | Validada mediante `event.defaultPrevented` en listeners activos. | Requiere coordinación estricta entre CSS (`touch-action: none` en `.product-zoom[data-zoomed] .product-zoom__slide`) y JS (`event.preventDefault()` en `touchmove` con `{ passive: false }` cuando `scale > 1`). Ambas medidas están activas en el tema. |

---

## 5. Validación de Sintaxis y Compuertas de Calidad

```bash
npm run gates:syntax
```
**Resultado:**
```
> shopify-theme-project@0.1.0 gates:syntax
> node --check assets/theme.js && node --check assets/product-zoom.js
```
`assets/theme.js` y `assets/product-zoom.js` compilan y pasan la verificación de sintaxis de Node.js con código de salida `0`.

---

## 6. Diff Completo Aplicado en `assets/product-zoom.js`

```diff
diff --git a/assets/product-zoom.js b/assets/product-zoom.js
index c7d3d90..75ec0a2 100644
--- a/assets/product-zoom.js
+++ b/assets/product-zoom.js
@@ -246,12 +246,27 @@ if (window.ThemeCore && !customElements.get('product-zoom')) customElements.defi
         this.y = start.y + event.clientY - start.event.clientY;
         this.apply();
       }
-    } else if (pointers.delete(id) && !pointers.size) {
-      this.start = this.pinch = null;
-      this.dialog.removeAttribute('data-gesture');
-      if (pinch) this.announce();
-      else if (type === 'pointerup' && start && !start.moved && event.timeStamp - start.event.timeStamp < 500) {
-        this.tap(event, start.event.target);
+    } else if (pointers.delete(id)) {
+      if (pointers.size === 1) {
+        const [remaining] = pointers.values();
+        this.start = { event: remaining, x: this.x, y: this.y, moved: Boolean(pinch || start?.moved) };
+        if (pinch) this.announce();
+        this.pinch = null;
+        if (this.scale > 1) {
+          this.dialog.setAttribute('data-gesture', '');
+          try { this.track.setPointerCapture(remaining.pointerId); } catch {}
+        }
+      } else if (pointers.size >= 2) {
+        const [a, b] = pointers.values();
+        this.pinch = { gap: gap(a, b) || 1, scale: this.scale, x: this.x, y: this.y, mid: mid(a, b) };
+        this.start = null;
+      } else {
+        this.start = this.pinch = null;
+        this.dialog.removeAttribute('data-gesture');
+        if (pinch) this.announce();
+        else if (type === 'pointerup' && start && !start.moved && event.timeStamp - start.event.timeStamp < 500) {
+          this.tap(event, start.event.target);
+        }
       }
     }
   }
```

---

## 7. Cumplimiento de Restricciones del Usuario

- [x] **Modificar ÚNICAMENTE `assets/product-zoom.js`**: Único archivo del tema modificado en esta tarea.
- [x] **Conservar intactos los cambios en `assets/theme.js`**: Los cambios de la Tarea 1 en `assets/theme.js` se mantienen al 100%.
- [x] **NO tocar `assets/base.css`**: Intacto.
- [x] **NO tocar `docs/requirements-ledger.md`**: Intacto.
- [x] **NO tocar archivos ZIP**: Intacto.
- [x] **NO tocar ni modificar informes en `agent-comms/outbox-gpt/`**: Intacto.
- [x] **CERO escrituras en tiendas de Shopify**: Todas las pruebas se ejecutaron en local/offline con Playwright.
- [x] **CERO git commit / git push**: Ningún commit ni push ejecutado.
- [x] **Pruebas de no-regresión de teclado y gestos**: 56 pruebas pasando con cero fallos.
