# GPT-TASK-4B-005: Auditoría Adversarial Extrema y Cacería de Bugs (Theme Store $380 Tier)

```text
ID: GPT-TASK-4B-005
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: GPT Astra / GPT-5.6 Sol Max & Fable 5.1 (Auditores Supremos de Producto y Código)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Naturaleza: Búsqueda adversarial implacable de fallos, regresiones y riesgos de rechazo
Fecha: 2026-09-14
Compuertas DoD: Las 5 Compuertas Obligatorias de agent-comms/RULES.md
```

---

## 1. Misión y Mindset del Auditor

Actúa como el **revisor técnico más estricto y despiadado de la Shopify Theme Store**, sumado a un **hacker de control de calidad (QA)** cuyo único objetivo es encontrar dónde y cómo romper el tema **Sartorial 1.0.0** (\$380–\$400 tier).

**CERO condescendencia, CERO cumplidos genéricos.** Tu valor está exclusivamente en los errores reales, casos borde no contemplados, vulnerabilidades visuales y riesgos de rechazo que seas capaz de descubrir antes de la submission a Shopify.

---

## 2. Los 5 Frentes de Ataque Obligatorios

Debes someter el tema a las siguientes pruebas de estrés:

### Frente A: Trampas de Rechazo en Shopify Theme Store (P0 Críticos)
- **Settings y Schemas (`config/settings_schema.json`, `sections/*.liquid`):**
  * ¿Existe algún setting que dependa de configuración externa (metafields, tarifas de envío, apps de suscripción, URLs) que carezca del atributo explicativo `"info"`?
  * ¿Existe algún string visible para el comerciante o el comprador que esté hardcodeado en inglés en lugar de consumir una clave `t:`?
  * ¿Hay algún valor predeterminado (`"default"`) que apunte a un recurso inexistente o introduzca código muerto en Liquid?
  * ¿Cumple la estructura de `/listings/` (sartorial, edition, archive) con la diferenciación real exigida por Shopify sin sobreescribir settings globales?

### Frente B: Catálogo Hostil y Estados Degenerados (Compuerta 2)
Analiza cómo responden Liquid y JavaScript ante los 5 estados límite:
1. **Vacío:** Colección sin productos, carrito con 0 items, búsqueda sin resultados, blog sin artículos, producto sin variantes adicionales.
2. **Uno solo:** Colección de 1 producto, producto con 1 sola variante (sin opciones), artículo con 1 tag.
3. **Muchos / Extremo:** 50 variantes, 20 imágenes de galería, títulos de producto de 150 caracteres, descripciones con tablas complejas, precios millonarios o con múltiples ceros.
4. **Faltante:** Producto sin imagen destacada, variante sin precio comparativo, imagen secundaria ausente, producto sin descripción (`product.description == blank`).
5. **Entradas hostiles en JS:** ¿Qué pasa si el comprador escribe `0`, negativos o letras en el selector de cantidad del PDP? ¿Qué pasa si el servidor responde con error 422/500 en `cart/add.js` o `/search/suggest.json`?

### Frente C: Robustez de JavaScript y Web Components (`assets/theme.js`)
- **Condiciones de Carrera (Race Conditions) y AbortControllers:**
  * Si el usuario hace doble clic rápido en "Add to Cart", ¿se duplica la línea en el carrito o el botón se bloquea de forma segura con `aria-busy`?
  * En `<predictive-search>`, si el usuario escribe rápido y borra, ¿se cancela la petición anterior con `AbortController` o pueden renderizarse resultados viejos desfasados?
  * En `<complete-the-look>`, si se desmarcan todos los productos, ¿el botón de compra se deshabilita correctamente y el texto cambia al label de estado vacío?
- **Fugas de Memoria (Memory Leaks):**
  * ¿Todos los event listeners en los Web Components heredados de `ThemeElement` se limpian correctamente al desconectar el elemento (`disconnectedCallback`)?

### Frente D: Accesibilidad Profunda (WCAG 2.2 AA)
- **Trampas de Foco y Teclado:**
  * Al abrir el Cart Drawer (`cart-drawer.liquid`) o el modal de búsqueda, ¿el foco queda atrapado dentro del diálogo (`focus trap`) y el fondo queda en `inert`?
  * Al presionar `Escape`, ¿el modal se cierra y el foco regresa exactamente al botón que lo abrió?
  * ¿Existe algún elemento interactivo (botones de galería, swatches, enlaces de paginación) con área táctil inferior a 44x44 px?
  * ¿Existe algún salto de jerarquía de encabezados (`h1` -> `h3` sin `h2`, o múltiples `h1` en plantillas distintas de `index`)?

### Frente E: Formato de Moneda y Multidivisa (Compuerta 3)
- El tema unificó recientemente `formatMoney` en `assets/theme.js:70` con fallback a `window.theme.moneyFormat`.
- Somételo a prueba:
  * ¿Qué ocurre con monedas de cero decimales (ej. JPY)?
  * ¿Qué ocurre con monedas con separador de coma (ej. EUR `1.250,50 €`)?
  * ¿Hay alguna posibilidad de que `formatMoney` devuelva `NaN`, `undefined` o `$0.00` por una conversión de tipo de datos?

---

## 3. Formato Requerido para Cada Hallazgo

No reportes impresiones subjetivas ni generalidades. Cada bug o riesgo encontrado debe declararse con esta estructura exacta:

```markdown
### [SEVERIDAD: P0 / P1 / P2] Título conciso del fallo

- **Archivo y Línea:** `ruta/al/archivo.liquid:LXX-LYY`
- **Compuerta Violada:** (Compuerta 1, 2, 3, 4 o 5 de RULES.md / Requisito Shopify)
- **Escenario de Reproducción:** Pasos exactos o datos de catálogo con los que el error se manifiesta.
- **Impacto Real:** Por qué causa rechazo en la Theme Store o cómo degrada la experiencia del comprador.
- **Parche Exacto Propuesto:** Diff Liquid / JS / CSS listo para aplicar.
```

---

## 4. Clasificación de Severidad

- **P0 (Bloqueante Theme Store):** Causa rechazo automático garantizado por el equipo de revisión de Shopify (violación de requisitos obligatorios, errores de schema, URLs rotas, saltos de WCAG).
- **P1 (Fallo Funcional / UX Grave):** El comprador experimenta un error perceptible, compra bloqueada, fallo en carrito o colapso visual en móviles.
- **P2 (Caso Borde / Pulido Técnico):** Ocurre únicamente en catálogos degenerados extremos o degradación menor que no bloquea la compra pero afecta el estándar de un tema de \$380.

---

## 5. Ruta de Entrega

Deja tu informe completo en:
`agent-comms/outbox-gpt/GPT-AUDIT-4B-005-adversarial-deep-audit.md`
