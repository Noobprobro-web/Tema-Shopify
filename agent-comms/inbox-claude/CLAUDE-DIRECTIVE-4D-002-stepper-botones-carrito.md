# DIRECTIVA TÉCNICA: SPRINT 4D-002 — STEPPER DE CANTIDAD (+ / −) EN CART DRAWER Y PÁGINA DE CARRITO

```text
ID: CLAUDE-DIRECTIVE-4D-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Fable 5.1 Max / Opus 5 - Implementador Principal)
Autoridad: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-15
Objetivo: Implementar botones accesibles de incremento y decremento (+ / −) en el selector de cantidad del carrito (Cart Drawer y página /cart), integrándolos sobre el sistema de concurrencia ya blindado en 4D-001.
```

---

## 1. Justificación y Mandato

En la entrega 4D-001 señalaste con acierto que el carrito solo contaba con `<input type="number">`. Johandry y Gemini han acordado su implementación inmediata antes de realizar el commit definitivo.

En un tema de \$380–\$400 USD para Shopify Theme Store, depender de las micro-flechas nativas del navegador perjudica la conversión en dispositivos móviles (en iOS Safari no existen y en Android son difíciles de pulsar). Disponer de botones dedicados con un área táctil mínima de 44px es un estándar indispensable.

---

## 2. Alcance y Especificación Técnica

### A. Markup en Liquid (`sections/cart-drawer.liquid` y `sections/main-cart-items.liquid`)
1. Reemplazar el input aislado por un componente stepper semántico:
   - Contenedor con clase `.quantity-stepper` (o `cart-drawer-item__stepper`).
   - Botón Decremento (`−`):
     - `type="button"`.
     - `name="minus"`.
     - `aria-label="{{ 'sections.cart.decrease_quantity' | t: title: item.title | escape }}"`.
     - Atributo `disabled` si `item.quantity <= min_qty` (respetando `item.variant.quantity_rule.min`).
   - Campo numérico (`<input type="number">`):
     - Conserva todos los atributos existentes: `data-cart-quantity`, `data-line="{{ forloop.index }}"`, `value="{{ item.quantity }}"`, `min`, `max`, `step`, `inputmode="numeric"`.
   - Botón Incremento (`+`):
     - `type="button"`.
     - `name="plus"`.
     - `aria-label="{{ 'sections.cart.increase_quantity' | t: title: item.title | escape }}"`.
     - Atributo `disabled` si `max` está definido y `item.quantity >= max_qty`.
2. Mantener sincronía de diseño y comportamiento idéntico entre el **Cart Drawer** (`cart-drawer.liquid`) y la **Página de Carrito** (`main-cart-items.liquid`).

### B. Comportamiento en JavaScript (`assets/theme.js`)
1. Delegar eventos de clic en los botones `[name="minus"]` y `[name="plus"]`:
   - Leer el input asociado, respetar el `step` (por defecto 1), `min` y `max`.
   - Al pulsar `+`: calcular `current + step`. Si no supera `max`, actualizar el valor del input y disparar `change` o invocar `this.changeLine(line, newQuantity)`.
   - Al pulsar `−`: calcular `current - step`. Si `current - step >= min`, actualizar y disparar; si llega por debajo de `min` y el comerciante/usuario quiere vaciar, permitir cambiar a 0 (o dejar que el botón delete lo gestione si `min > 1`).
2. **Concurrencia blindada:** Utilizar el pipeline ya construido en 4D-001 (`beginMutation()`, `revision`, `changeLine()`) para que ráfagas rápidas de pulsaciones en `+` o `−` nunca provoquen desincronización de revisiones en el DOM.
3. Deshabilitar visualmente o marcar busy los botones mientras la línea esté en mutación.

### C. Estilos y Micro-interacción en CSS (`assets/base.css`)
1. Diseño minimalista de lujo acorde a la estética *Atelier / LINEA NOVE*:
   - Borde sutil `var(--border-width)` con color `var(--color-border)`.
   - Botones centrados con tipografía limpia o glifos SVG / signos matemáticos refinados.
   - Ocultar spinners nativos del navegador (`-moz-appearance: textfield`, `::-webkit-inner-spin-button { display: none }`).
2. **Accesibilidad y Área Táctil:**
   - Altura mínima y ancho mínimo de área de toque de **44px × 44px** en móvil (`--tap-target-min: 44px`), sin que el diseño se vea tosco en desktop.
   - Estados de `:focus-visible` claros respetando las variables del tema.

### D. Textos y Localización (`locales/en.default.json`)
Agregar las claves bajo `sections.cart`:
```json
"decrease_quantity": "Decrease quantity for {{ title }}",
"increase_quantity": "Increase quantity for {{ title }}"
```
Cero cadenas en inglés quemadas en Liquid. 100% `t:`.

---

## 3. Compuertas y Verificación Exigidas

1. **Theme Check:** 0 errores, 0 advertencias (`shopify theme check`).
2. **Pruebas Estáticas:** `npm run gates:static` en verde (8/8).
3. **Tests de Concurrencia:** Extender `stress.spec.mjs` para verificar pulsaciones rápidas sobre los nuevos botones `+` y `−`.
4. **Sin commit ni push:** Entregar en árbol local con reporte en `agent-comms/outbox-claude/CLAUDE-REPORT-4D-002.md`.
