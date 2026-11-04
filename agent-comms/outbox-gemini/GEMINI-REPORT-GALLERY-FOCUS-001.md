# INFORME TÉCNICO: CORRECCIÓN QUIRÚRGICA DEL FOCO ACCESIBLE EN LA GALERÍA MÓVIL (WCAG 2.4.3 / 2.4.7)

```text
ID de Documento: GEMINI-REPORT-GALLERY-FOCUS-001
Emisor: Gemini Flash 3.8 High (Arquitecto Consultor & Soporte Analítico)
Destinatarios: Johandry (Dueño del Proyecto), Claude (Líder Técnico & Estratégico), GPT-6 Sol Max (Auditor Senior)
Fecha: 2026-10-27T04:15:00Z
Referencia de Entrada: Instrucción de corrección de foco en galería móvil (Preview 189707452659, /products/qa5a-f04-colour-size)
Archivo Modificado: assets/theme.js (líneas 477–494)
Estado: COMPLETADO Y VERIFICADO Determinísticamente (9/9 Tests Pasados)
```

---

## 1. RESUMEN EJECUTIVO Y DIAGNÓSTICO FORENSE

### 1.1. Problema Reportado
En el preview `189707452659` (tienda remota de desarrollo), en el producto `/products/qa5a-f04-colour-size`:
- Al usar el botón de navegación **Previous** (`[data-gallery-step="-1"]`) para retroceder de la imagen 2 a la 1, el botón alcanza el límite inferior del carrusel y se deshabilita (`disabled = true`).
- En ese instante exacto, los navegadores (Chromium, WebKit, Firefox) expulsan el foco activo (`document.activeElement`) directamente hacia `document.body`.
- **Impacto de Accesibilidad (WCAG 2.4.3 Focus Order & 2.4.7 Focus Visible):** La pérdida de foco a `BODY` desorienta por completo a usuarios de navegación por teclado y tecnologías asistivas (NVDA, JAWS, VoiceOver), reiniciando la secuencia de tabulación al inicio de la página y perdiendo la posición de navegación en la galería.

### 1.2. Causa Raíz en el Código
En `assets/theme.js`, dentro de la clase `ProductGallery`, el método `applySlide(index, announce)` actualizaba los botones de paginación mediante:
```javascript
this.steps.forEach((step) => {
  const direction = Number(step.dataset.galleryStep);
  step.disabled = direction < 0 ? index === 0 : index === this.slides.length - 1;
});
```
Cuando el botón presionado (con foco activo) pasa a `disabled = true`, el DOM revoca la propiedad de enfoque interactivo. Si no se transfiere programáticamente el foco a otro elemento navegable antes o inmediatamente en la misma ráfaga de ejecución, el navegador revierte el foco al contenedor raíz (`document.body`).

### 1.3. Solución Arquitectónica
Se aplicó un patrón canónico idéntico al ya existente y probado en el stepper de cantidad de la tienda (`assets/theme.js`, líneas 5766–5770):
1. Detectar previamente si el elemento actualmente enfocado (`document.activeElement`) es uno de los botones de paso (`this.steps`) o reside dentro de él (`step.contains(document.activeElement)`).
2. Ejecutar la actualización de `disabled` en cada botón.
3. Si el botón recién enfocado resultó inhabilitado (`focusedStep && focusedStep.disabled`), transferir el foco al botón hermano disponible (`!step.disabled`) o, en su defecto, a la pista desplazable (`this.track`), impidiendo que el foco caiga al `body`.
4. Si el foco no estaba en los botones (ej. deslizamiento táctil con el dedo, scroll nativo, o clic en selectores de variantes), **no se interfiere con el foco**, evitando cualquier salto involuntario.

---

## 2. DIFF EXACTO DE IMPLEMENTACIÓN

El cambio se realizó de manera mínimamente invasiva, exclusivamente en `assets/theme.js`, respetando los lineamientos de codificación y documentación del repositorio:

```diff
diff --git a/assets/theme.js b/assets/theme.js
index 3953331..0ea2dff 100644
--- a/assets/theme.js
+++ b/assets/theme.js
@@ -477,10 +477,21 @@
       });
 
       if (this.counter) this.counter.textContent = String(index + 1);
+      const focusedStep = this.steps.find(
+        (step) => step === document.activeElement || step.contains(document.activeElement),
+      );
       this.steps.forEach((step) => {
         const direction = Number(step.dataset.galleryStep);
         step.disabled = direction < 0 ? index === 0 : index === this.slides.length - 1;
       });
+      // Si el boton recien pulsado toca el limite y se deshabilita, el foco caeria al
+      // body desorientando a tecnologias asistivas: se pasa al boton opuesto disponible
+      // o a la pista del carrusel.
+      if (focusedStep && focusedStep.disabled) {
+        const fallback = this.steps.find((step) => !step.disabled)
+          || (this.track && this.track.tabIndex >= 0 ? this.track : null);
+        fallback?.focus();
+      }
 
       if (announce && this.carouselStatus) {
         const template = this.pager.dataset.viewMediaTemplate || '';
```

---

## 3. COMPUERTAS DE CALIDAD Y ESTADOS DEGENERADOS (DOD)

Siguiendo la **Compuerta 2 de Estados Degenerados** de `AGENTS.md`:

| Estado Límite | Comportamiento del Componente | Resultado del Foco |
| :--- | :--- | :--- |
| **Extremo 1: Inicio (Límite Inferior, 2 a 1)** | `prev.disabled = true`, `next.disabled = false`. | El foco en `prev` se transfiere inmediatamente a `next`. `document.activeElement` es `next`, nunca `BODY`. |
| **Extremo 2: Fin (Límite Superior, 1 a 2)** | `next.disabled = true`, `prev.disabled = false`. | El foco en `next` se transfiere inmediatamente a `prev`. `document.activeElement` es `prev`, nunca `BODY`. |
| **Intermedio: 3+ Imágenes (Sin Inhabilitación)** | `prev.disabled = false`, `next.disabled = false`. | `focusedStep.disabled` es `false`. El foco permanece en el botón pulsado para permitir navegación continua. |
| **Degenerado: 1 sola imagen** | `this.slides.length < 2`. `initCarousel` retorna de inmediato; `pager` permanece oculto (`hidden`). | No se inicializan listeners en pasos. Foco inalterado en el contexto global. |
| **Evento Externo: Selección de Variante** | `theme:variant-change` invoca `goToSlide(index, false)`. | `focusedStep` es `undefined` (el foco está en el swatch). No se roba el foco del botón de variante. |

---

## 4. EVIDENCIA DE VERIFICACIÓN DETERMINISTA LOCAL

Se creó y ejecutó el arnés de prueba automatizado con Playwright Chromium local (`scratch/test-gallery-focus-suite.mjs`):

```text
================================================================
       AUTOMATED TEST SUITE: PRODUCT GALLERY FOCUS WCAG         
================================================================

--- TEST CASO 1: 2 imágenes (img 2 -> img 1 con Previous) ---
  1A Setup en slide 2: { current: '2', prevDisabled: false, nextDisabled: true }
  1A Resultado tras Click Prev: {
  current: '1',
  prevDisabled: true,
  nextDisabled: false,
  activeTag: 'BUTTON',
  activeStep: '1',
  isBody: false,
  isNext: true
}
  -> Sub-caso 1A (Click): PASSED (Foco transferido a Next)
  1B Resultado tras Enter en Prev: {
  current: '1',
  prevDisabled: true,
  nextDisabled: false,
  activeTag: 'BUTTON',
  activeStep: '1',
  isBody: false,
  isNext: true
}
  -> Sub-caso 1B (Enter): PASSED (Foco transferido a Next)

--- TEST CASO 2: 2 imágenes (img 1 -> img 2 con Next) ---
  2A Setup en slide 1: { current: '1', prevDisabled: true, nextDisabled: false }
  2A Resultado tras Click Next: {
  current: '2',
  prevDisabled: false,
  nextDisabled: true,
  activeTag: 'BUTTON',
  activeStep: '-1',
  isBody: false,
  isPrev: true
}
  -> Sub-caso 2A (Click): PASSED (Foco transferido a Prev)
  2B Resultado tras Enter en Next: {
  current: '2',
  prevDisabled: false,
  nextDisabled: true,
  activeTag: 'BUTTON',
  activeStep: '-1',
  isBody: false,
  isPrev: true
}
  -> Sub-caso 2B (Enter): PASSED (Foco transferido a Prev)

--- TEST CASO 3: 3+ imágenes en posición intermedia ---
  3A De slide 1 a slide 2 con Next: {
  current: '2',
  prevDisabled: false,
  nextDisabled: false,
  activeStep: '1',
  isNext: true,
  isBody: false
}
  -> Sub-caso 3A (Next intermedio): PASSED (Foco permanece en Next)
  3B De slide 2 a slide 3 con Next: {
  current: '3',
  prevDisabled: false,
  nextDisabled: false,
  activeStep: '1',
  isNext: true
}
  -> Sub-caso 3B (Next intermedio): PASSED (Foco permanece en Next)
  3C De slide 3 a slide 2 con Prev: {
  current: '2',
  prevDisabled: false,
  nextDisabled: false,
  activeStep: '-1',
  isPrev: true
}
  -> Sub-caso 3C (Prev intermedio): PASSED (Foco permanece en Prev)

--- TEST CASO 4: 1 sola imagen (extremo degenerado) ---
  4 Resultado galería 1 imagen: {
  pagerHidden: true,
  trackTabindex: null,
  activeTag: 'BODY',
  isBody: true,
  hasStepsInitialized: false
}
  -> Caso 4 (1 imagen): PASSED (Pager oculto, carrusel no inicializado, foco inalterado)

--- TEST CASO EXTRA: Cambio de variante (no roba foco a swatches) ---
  Resultado tras cambio de variante: { activeId: 'swatch-2', currentSlide: 1 }
  -> Caso Extra (Variantes): PASSED (Foco retenido en el swatch sin interferencia)

================================================================
                       RESUMEN DE PRUEBAS                       
================================================================
[PASS] 1. Caso 1A: 2 imagenes click Prev -> foco en Next
[PASS] 2. Caso 1B: 2 imagenes Enter Prev -> foco en Next
[PASS] 3. Caso 2A: 2 imagenes click Next -> foco en Prev
[PASS] 4. Caso 2B: 2 imagenes Enter Next -> foco en Prev
[PASS] 5. Caso 3A: 4 imagenes, paso 1->2 Next mantiene foco en Next
[PASS] 6. Caso 3B: 4 imagenes, paso 2->3 Next mantiene foco en Next
[PASS] 7. Caso 3C: 4 imagenes, paso 3->2 Prev mantiene foco en Prev
[PASS] 8. Caso 4: 1 sola imagen pager oculto y sin saltos de foco
[PASS] 9. Caso Extra: cambio de variante no roba foco del swatch

TOTAL: 9/9 pruebas pasadas.
TODAS LAS PRUEBAS PASARON EXITOSAMENTE.
```

Además, `npm run gates:syntax` valida que la sintaxis de JavaScript es 100% limpia y sin errores de parseo:
```text
> shopify-theme-project@0.1.0 gates:syntax
> node --check assets/theme.js && node --check assets/product-zoom.js
(Exit code: 0)
```

---

## 5. CUMPLIMIENTO ESTRICTO DE RESTRICCIONES

1. **`assets/base.css`:** Intacto, cero líneas tocadas.
2. **`docs/requirements-ledger.md`:** Intacto, sin modificaciones.
3. **Archivos ZIP:** Ningún ZIP modificado o generado.
4. **Informes en `agent-comms/outbox-gpt/`:** Intactos y no modificados.
5. **Tiendas Shopify:** Cero escrituras o mutaciones remotas ejecutadas.
6. **Git:** Cero commits realizados, cero push ejecutados.
7. **Sincronización:** Documento replicado fielmente en los repositorios espejo requeridos:
   - `C:\Users\Johan\OneDrive\Documentos\Drive\Tema Shopify\agent-comms\outbox-gemini\GEMINI-REPORT-GALLERY-FOCUS-001.md`
   - `C:\Users\Johan\Documents\Drive\Tema-Shopify-codex\agent-comms\outbox-gemini\GEMINI-REPORT-GALLERY-FOCUS-001.md`
   - `C:\Users\Johan\Documents\Drive\Tema Shopify\agent-comms\outbox-gemini\GEMINI-REPORT-GALLERY-FOCUS-001.md`
