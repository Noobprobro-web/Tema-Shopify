# CLAUDE-DIRECTIVE-6A-001: Certificación en Tienda Real de Búsqueda Predictiva, Mercados, Newsletter, Pagos y Checkout Acelerado (Filas 78, 79, 80, 81, 82, 63)

```text
Ruta: agent-comms/inbox-claude/CLAUDE-DIRECTIVE-6A-001.md
Autoridad: Johandry / Ruiz Digital (Dueño) · Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Auditor Senior UX/UI)
Referencia directa: Orden de Johandry ("dale todo a claude")
Insumos: CLAUDE-REPORT-AUDIT-PRESETS-001.md, parches af6ee6d desplegados en vivo
Estado: AUTORIZADO PARA EJECUCIÓN INMEDIATA
Fecha: 2026-09-24
```

---

## 1. Contexto y Estado del Proyecto

1. **Cierre formal de la Fila 106 (`Presets Diferenciados`):**
   - Con la auditoría completa de los 4 temas en vivo (`CLAUDE-REPORT-AUDIT-PRESETS-001.md`), el despliegue de parches H1/H2 (`af6ee6d`), el empaquetado de `Sartorial-1.0.0.zip` y 0 ofensas de Theme Check, la Fila 106 ha pasado oficialmente a **`cumplido`** en `docs/requirements-ledger.md`.
   - El ledger se sitúa en **42 cumplido (73.7%)**, con 13 filas en `código completo` y 2 en `no verificado`.
2. **Sartorial intacto:** La dirección visual, tipografía editorial, paleta de colores y espaciados de escritorio de Sartorial se mantienen 100% inalterados según la directiva del usuario.
3. **Misión de este Sprint (Sprint 6):** Realizar la validación empírica en tienda real (`tema-qkqpke0j.myshopify.com`, password `<redactado>`) de las 6 funcionalidades del storefront que cuentan con código completo pero requieren certificación Gate 5 para ser promovidas a `cumplido`.

---

## 2. Tiendas y Entornos de Prueba

- **Tienda Principal (Couture):** `#165809488115` (`https://tema-qkqpke0j.myshopify.com`)
- **Preset Favorito (Sartorial):** `#166186909939` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939`)
- **Resoluciones obligatorias de auditoría:**
  - Desktop: 1280x800
  - Mobile: 375x812 y 360x780

---

## 3. Alcance Obligatorio por Pista (Tracks de Certificación)

### Track 1: Fila 78 — Búsqueda Predictiva (`/search/suggest`)
- **Archivos de referencia:**
  - Marcado: `snippets/predictive-search.liquid:1-143`
  - Lógica JS: `assets/theme.js:4004-4270` (`class PredictiveSearch`)
  - Estilos: `assets/base.css:5335-5490`
- **Requisitos a certificar en tienda viva:**
  1. **Disparo y diálogo modal:** Abrir búsqueda desde cabecera (botón `[data-predictive-search-open]`). Verificar `aria-expanded="true"`, foco en `input[type="search"]`, e inert/trap de fondo.
  2. **Debounce y consulta reactiva:** Teclear términos reales ("coat", "dress", "jacket", "wool") y comprobar que la petición a `/search/suggest` responde y renderiza sugerencias.
  3. **4 Entidades Shopify:** Comprobar si se devuelven grupos para:
     - `products` (imagen con srcset optimizado 72/144/216px, título, precio formateado con `formatMoney` usando `shop.money_format`, badge de sold out si aplica).
     - `collections`
     - `articles`
     - `pages`
  4. **Estados Límite / Degenerados:**
     - *Término sin resultados:* (ej. `xyznoresults999`). Verificar renderizado del mensaje accesible (`data-no-results-text`).
     - *Término largo:* Cadena de más de 40 caracteres sin desbordamiento.
  5. **Accesibilidad WAI-ARIA Combobox:**
     - Navegación con teclado: `ArrowDown`, `ArrowUp` cambia el `[role="option"]` seleccionado y actualiza `aria-selected="true"`.
     - `Enter` sobre opción navega al recurso.
     - `Escape` cierra el diálogo y devuelve el foco al botón disparador.
     - Botón "Limpiar" (`[data-predictive-search-clear]`) y botón "Cerrar" (`[data-predictive-search-close]`).
  6. **Enlace "Ver todos los resultados":** Verificar que el botón al pie del diálogo conduce a la página completa `/search?q=...` (o `/es/search?q=...` en español).

---

### Track 2: Filas 79 y 80 — Selectores de País / Moneda e Idioma (`form 'localization'`)
- **Archivos de referencia:**
  - Marcado: `snippets/localization-selectors.liquid:1-65`
  - Lógica JS: `assets/theme.js:3977-4003` (`class LocalizationForm`)
  - Estilos: `assets/base.css:5224-5250`
- **Requisitos a certificar en tienda viva:**
  1. **Selector de Idioma (Toggle EN/ES):**
     - Ubicado en cabecera desktop (`header.liquid:191`) y cajón móvil (`header.liquid:127`).
     - Probar el cambio entre EN y ES: verificar que se envía el formulario `form 'localization'`, se preserva la ruta actual con el prefijo `/es/`, y el elemento activo muestra `aria-current="true"`.
     - Verificar que el botón inactivo tiene accesible `aria-label="{{ 'general.localization.update' | t }}: Español"`.
  2. **Selector de País / Moneda:**
     - Probar el elemento `<select name="country_code">` en `snippets/localization-selectors.liquid:55`.
     - Verificar auto-submit en `change` (`onchange="this.form.requestSubmit()"` / `[data-localization-select]`).
     - Comprobar que al cambiar de país/moneda (ej. CAD, EUR o USD según mercados disponibles en la tienda), los precios en storefront se recalculan con el símbolo de la moneda correspondiente.
  3. **Compuerta sin JS:** Confirmar que sin JavaScript habilitado, el formulario sigue enviando la petición POST estándar a `/localization`.

---

### Track 3: Fila 81 — Formulario de Newsletter en Storefront
- **Archivos de referencia:**
  - Sección independiente: `sections/newsletter.liquid:1-105`
  - Sección pie de página: `sections/footer.liquid:20-75`
  - Estilos: `assets/base.css:5255-5330`
- **Requisitos a certificar en tienda viva:**
  1. **Envío válido:** Probar el envío de un correo válido (`test-audit@example.com`).
     - Verificar el estado `form.posted_successfully?` con mensaje de éxito marcado con `role="status"`.
  2. **Envío inválido / Errores:**
     - Probar envío con formato erróneo. Verificar `aria-invalid="true"`, `aria-describedby` y contenedor de error con `role="alert"`.
  3. **Honeypot y etiquetas accesibles:**
     - Presencia de `<input type="hidden" name="contact[tags]" value="newsletter">`.
     - Campo de email con `autocomplete="email"`, `autocapitalize="off"`, `autocorrect="off"`, y etiqueta asociada (`visually-hidden`).
     - Dimensiones táctiles del botón de suscripción (`min-height: 44px`, `min-width: 44px`).

---

### Track 4: Fila 82 — Iconos de Métodos de Pago en Footer
- **Archivos de referencia:**
  - Marcado: `sections/footer.liquid:111-120` (`{{ type | payment_type_svg_tag }}`)
  - Estilos: `assets/base.css:5280-5305`
- **Requisitos a certificar en tienda viva:**
  1. **Renderizado SVG nativo:** Verificar que se renderizan los iconos de pago de `shop.enabled_payment_types` en `site-footer__payment-list`.
  2. **Responsividad sin overflow:** En 1280px, 375px y 360px, los iconos se acomodan en flex-wrap ordenado con separación adecuada y `overflow: visible` sin generar scrollbar horizontal.
  3. **Estado degenerado (Cero métodos):** Comprobar que `{%- if shop.enabled_payment_types.size > 0 -%}` envuelve el contenedor para evitar wrappers vacíos en el DOM.

---

### Track 5: Fila 63 — Checkout Acelerado (`additional_checkout_buttons`)
- **Archivos de referencia:**
  - Ficha de Producto: `sections/main-product.liquid:633` (`{{ form | payment_button }}`)
  - Cajón de Carrito: `sections/cart-drawer.liquid:500-504` (`{{ content_for_additional_checkout_buttons }}`)
  - Página de Carrito: `sections/main-cart-items.liquid:219-223` (`{{ content_for_additional_checkout_buttons }}`)
- **Requisitos a certificar en tienda viva:**
  1. **PDP (Botón de Pago Dinámico):** Verificar que `{{ form | payment_button }}` se renderiza adecuadamente cuando el bloque `buy_buttons` tiene activado `show_dynamic_checkout`. Comprobar armonía con el botón ATC principal.
  2. **Cajón y Carrito:** Verificar la condición `{%- if additional_checkout_buttons -%}` y la integración de botones de pasarela (Shop Pay, PayPal, etc.).
  3. **Estado deshabilitado / Sold out:** Comprobar que el botón dinámico se oculta o deshabilita cuando la variante activa no tiene inventario disponible.

---

## 4. Reglas de Ejecución y Entrega (Obligatorio DoD)

1. **No tocar archivos innecesarios:** Si algún track detecta un defecto menor que requiere corrección de código (CSS, JS o Liquid), reportarlo como propuesta clara con diff Nivel 2 o resolverlo respetando `RULES.md` si es puramente un fix de bug.
2. **Evidencias empíricas con mediciones reales:**
   - Para cada uno de los 5 tracks, proporcionar la evidencia concreta: selector DOM medido, respuesta HTTP observada, atributos ARIA verificados y comportamiento ante teclado/ratón.
3. **Informe de entrega:**
   - Archivo destino: `agent-comms/outbox-claude/CLAUDE-REPORT-6A-001.md`.
   - Comenzar con el bloque compacto obligatorio de 9 líneas estipulado en `RULES.md §1.4`.
   - Dictamen explícito sobre cada una de las 6 filas: ¿Apta para pasar a `cumplido`? (Sí / No, con justificación y evidencia).
