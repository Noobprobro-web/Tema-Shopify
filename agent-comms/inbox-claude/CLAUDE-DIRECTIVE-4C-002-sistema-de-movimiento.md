# CLAUDE-DIRECTIVE-4C-002: Sistema de Movimiento Cinemático (Bloque B)

```text
ID: CLAUDE-DIRECTIVE-4C-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal de Código)
Copia: Johandry (Ruiz Digital), GPT-5.6 Sol Max (Auditor Senior)
Fecha: 2026-09-14
Estado: DIRECTIVA VINCULANTE DE IMPLEMENTACIÓN
Nivel de cambio: Nivel 2 (Tokens CSS, setting de tema, observer de scroll y microinteracciones)
Commit/Push: PROHIBIDO hasta revisión y autorización expresa de Gemini
```

---

## 1. Contexto y Objetivos del Sprint

Tras la finalización exitosa del Sprint 4C-001 (donde activamos las 8 secciones del homepage, corregimos los defaults y eliminamos la última violación de accesibilidad, logrando **0 violaciones axe-core en toda la tienda**), procedemos a la implementación del **Bloque B: Sistema de Movimiento Cinemático**.

Un tema de $390 USD debe transmitir lujo, calma y sofisticación en cada interacción. Este sprint dota al tema de un sistema de movimiento unificado, de costo cero en librerías y con total protección sobre Core Web Vitals.

---

## 2. Contrato Técnico y Restricciones No Negociables

1. **Cero librerías externas:** Prohibido GSAP, Framer Motion, Motion One o scripts de terceros. 100% CSS nativo + JavaScript vanilla mínimo sobre la arquitectura existente (`ThemeElement`).
2. **Blindaje de LCP (Regla Sagrada de CWV):** El elemento LCP (la imagen del Hero editorial y el titular principal above-the-fold) **NUNCA DEBE SER ANIMADO NI OCULTADO**. Animar el LCP destruye la puntuación en Theme Store.
3. **Mejora Progresiva (Progressive Enhancement):** Todo el contenido **nace visible** (`opacity: 1`). Si JavaScript está deshabilitado o el observer falla, la tienda se lee al 100% sin espacios en blanco ni elementos ocultos.
4. **Respeto Absoluto a la Accesibilidad (WCAG 2.3.3):**
   - El setting maestro `animations: none` debe dejar el tema completamente estático.
   - `prefers-reduced-motion: reduce` a nivel de sistema operativo desactiva inmediatamente todo movimiento, transiciones y escalados (duración a 0.01ms / none).
5. **Compuerta de Localización (Gate 4):** 100% de las nuevas claves de schema deben traducirse en `locales/en.default.schema.json`.
6. **Compuertas Estáticas:** `npm run gates:static` debe terminar en código 0 con Theme Check en **0 offenses**.

---

## 3. Especificación Detallada del Bloque B

### B0. Tokens de Movimiento Unificados (`assets/base.css`)
Declarar en `:root` una sola familia armónica de duraciones y curvas de aceleración para todo el tema:
```css
:root {
  --motion-fast: 160ms;
  --motion-base: 320ms;
  --motion-slow: 640ms;
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-move: cubic-bezier(0.65, 0, 0.35, 1);
}
```
Sustituir las transiciones dispersas y hardcodeadas en `base.css` por estos tokens.

### B1. Setting Maestro de Animaciones
1. En `config/settings_schema.json`, incorporar el setting de animaciones con opciones `none`, `subtle` y `full` (default: `subtle`).
2. Declarar las claves correspondientes en `locales/en.default.schema.json`.
3. En `layout/theme.liquid`, inyectar el atributo en `<html>`:
   ```liquid
   <html class="no-js" lang="{{ request.locale.iso_code }}" dir="{{ request.locale.direction }}" data-animations="{{ settings.animations | default: 'subtle' }}">
   ```
4. En `assets/base.css`, gobernar el comportamiento:
   - `html[data-animations='none']` desactiva todo el sistema de movimiento cinemático.

### B2. Motor de Scroll Reveal Progresivo
1. Implementar en `assets/theme.js` un observador ligero basado en `IntersectionObserver` que detecte elementos con `[data-reveal]` y marque `[data-revealed]`.
2. Soporte de escalonamiento elegante con `--reveal-index` para rejillas de tarjetas y bloques.
3. Solo utilizar propiedades de composición GPU: `transform` (translateY suave, máx 12-16px) y `opacity`.
4. El Hero editorial principal queda excluido del scroll reveal para blindar el LCP.

### B3. Hero Editorial Cinemático
1. En modo `subtle`/`full`, añadir micro-interacción refinada en la imagen de campaña y entrada suave en el contenido sin bloquear renderizado.

### B4. Tarjeta de Producto (`product-card`)
1. Armonizar la transición entre imagen primaria y secundaria con `--motion-base` y `--ease-enter`.
2. Para el botón de Quick-Add (`.product-card__action`), implementar una transición suave de deslizamiento/aparición desde el borde inferior de la tarjeta o imagen en hover/focus desktop, manteniendo usabilidad táctil directa en móvil.

### B5. Transiciones de Página Nativas (View Transitions API)
1. Incorporar en `assets/base.css` la regla estándar de View Transitions para MPAs:
   ```css
   @view-transition {
     navigation: auto;
   }
   ```
2. Asignar `view-transition-name` sutiles en elementos clave si procede. Los navegadores que no lo soporten lo ignorarán de forma 100% inocua.

### B6. Galería de PDP
1. Transición suave y limpia entre imágenes de la galería al cambiar de variante o pulsar miniaturas.

### B7. Cabecera y Drawer de Carrito
1. **Cabecera:** Al hacer scroll (`window.scrollY > 40`), aplicar una clase o atributo `[data-header-scrolled]` que condense sutilmente el padding y aplique un leve efecto de elevación/desenfoque.
2. **Cart Drawer:** Al abrir el carrito, escalonar la entrada de las líneas de producto con un micro-retraso (`--item-index * 40ms`).

---

## 4. Verificación Obligatoria y Entrega

1. Ejecutar `npm run gates:static` (las 8 compuertas deben dar código 0).
2. Verificar que `git status` no contenga archivos ajenos.
3. No hacer commit ni push.
4. Entregar reporte detallado en `agent-comms/outbox-claude/CLAUDE-REPORT-4C-002.md` documentando:
   - Archivos y líneas modificados.
   - Salida de `npm run gates:static`.
   - Confirmación del blindaje de LCP y soporte de `prefers-reduced-motion`.
