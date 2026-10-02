# CLAUDE-HANDOFF-LEAD-001: Transferencia Temporal de Autoridad y Contexto Maestro

```text
ID: CLAUDE-HANDOFF-LEAD-001
De: Gemini Flash 3.8 High (Orquestador Saliente)
Para: Claude (Opus 5.5 Extra) · Líder Técnico y Estratégico Temporal
Autorizado por: Johandry / Ruiz Digital (Propietario del Proyecto)
Fecha: 2026-09-30T19:20:00-04:00
Estado: ACTIVO Y VINCULANTE
Propósito: Transferencia formal de liderazgo técnico y estratégico a Claude para dirigir la resolución
           de los bloqueantes finales de la Shopify Theme Store y proponer opciones a Johandry.
```

---

## 1. Declaración de Autoridad y Cambio de Rol

Por instrucción directa y explícita del usuario y dueño del proyecto (**Johandry / Ruiz Digital**):
1. **Claude (Opus 5.5 Extra)** asume temporalmente la **Autoridad Líder de Orquestación y Dirección Técnica**.
2. Claude tiene facultades para:
   - Priorizar y decidir la secuencia de resolución de los bloqueantes restantes.
   - Presentar a Johandry opciones claras y accionables sobre por dónde empezar.
   - Definir la estrategia de hosting de documentación, curación de catálogo y políticas.
   - Mantener la disciplina técnica y guiar los próximos commits y despliegues.
3. **Gemini** pasa a rol de apoyo analítico y soporte cuando sea requerido.

---

## 2. Estado Exacto del Código, Git y Tiendas Remotas

Base actual del repositorio:
- **Git Commit:** `ea3e3dc` en rama `master` (sincronizado con `origin/master`).
- **Paquete:** `Sartorial-1.0.0.zip` (regenerado y verificado en la raíz).
- **Compuertas Estáticas:** `npm run gates:static` pasa **100% verde** (Theme Check con 0 ofensas en 429 archivos, contratos JS-Liquid intactos, locales y schema sin huérfanas, LiquidComplexity en `main-product.liquid` $\le 120$).
- **Tiendas Remotas:** Las 3 demos oficiales tienen el código sincronizado mediante `shopify theme push --allow-live --nodelete`:
  - Sartorial Atelier: `#188743188704`
  - Sartorial Edition: `#188655599784`
  - Sartorial Archive: `#191153275192`
  - Couture (Benchmark / Sandbox): `#165809488115`

### Lo que Gemini resolvió tras tu informe `CLAUDE-REPORT-AUDIT-FINAL-003.md`:
1. **B-02 (Paridad ZIP vs Demos - Resuelto):**
   - Incorporados al repositorio los 5 archivos Liquid de P-04 que estaban en las demos pero faltaban en git:
     - `snippets/responsive-image.liquid` (soporta parámetro `eager`).
     - `snippets/product-card.liquid` (pasa `eager: eager_image` a imagen primaria).
     - `sections/main-collection.liquid` (asigna `is_eager_card` en primeras 4 tarjetas de pág 1).
     - `sections/main-404.liquid` (asigna `is_eager_404_card` en primeras 4 tarjetas).
     - `sections/main-list-collections.liquid` (asigna `is_eager_collection` en primeras 3 colecciones).
   - Ahora el repositorio local, el ZIP y las 3 tiendas remotas están **100% en paridad**.

2. **B-03 (Regresión de stock en 6 - Resuelto):**
   - Corregido en `assets/theme.js` (`VariantSelects.updateQuantityRules`):
     ```javascript
     let effectiveMax = variant.quantity_max ?? null;
     if (effectiveMax === null && variant.inventory_management && variant.inventory_policy === 'deny') {
       const inventoryEl = this.querySelector('product-inventory') || this.closest('section')?.querySelector('product-inventory');
       const threshold = inventoryEl ? (Number(inventoryEl.dataset.threshold) || 0) : 1;
       const qty = Number(variant.inventory_quantity);
       if (Number.isFinite(qty) && qty > 0 && qty <= threshold) {
         effectiveMax = qty;
       }
     }
     ```
   - **Resultado:** Si hay 25 unidades en stock, `effectiveMax` es `null` (la UI no impone ningún tope artificial de 6). Si es una pieza 1-de-1 (como en Archive), `effectiveMax` es 1 y el selector queda limitado a 1.
   - Retirado el bloque `v_quantity_max` de `sections/featured-product.liquid` y evitado agregar condicionales complejos en `sections/main-product.liquid`, preservando la regla de privacidad AF-07 y manteniendo `LiquidComplexity` $\le 120$.

3. **L-01, L-02, L-03 (Bajos - Resueltos):**
   - **L-01:** `document.querySelectorAll('[data-quantity-stepper]').forEach(syncQuantityStepper);` añadido en `initQuantitySteppers()` para sincronizar el botón `+` desde el arranque (en Archive nace apagado).
   - **L-02:** En `[data-cart-quantity]`, al pulsar Enter se llama `event.target.blur()` para disparar un único `change` nativo sin duplicar peticiones `POST`.
   - **L-03:** En `updateLineTotal()`, se comprueba `isFieldValid` antes de mostrar números para evitar pintar totales de cantidades inválidas.

---

## 3. Matriz de Bloqueantes Abiertos para Resolver

Claude, los dos informes de auditoría (`CLAUDE-REPORT-AUDIT-FINAL-003.md` y `GPT-AUDIT-017`) señalan estos 4 puntos críticos pendientes:

### 1. B-01 (P0): Documentación y Soporte Público (Sin Contraseña)
- **Diagnóstico:** `config/settings_schema.json` apunta a URLs en `sartorial-atelier.myshopify.com/pages/...`. En ventana de incógnito sin cookies, devuelven `302 → /password`. Shopify exige acceso 100% público sin contraseña antes de enviar.
- **Hallazgo clave del proyecto:** En `docs/merchant/docs.html` y `docs/merchant/support.html` existen dos archivos HTML completos, de diseño editorial premium, listos para servir. Enlazan entre sí vía `./support.html` y `./docs.html` (sin 404s).
- **Vías posibles:**
  - *Opción A (GitHub Pages):* Activar GitHub Pages en el repo `Noobprobro-web/Tema-Shopify` con origen en `/docs`. Da URLs públicas inmediatas:
    - `https://noobprobro-web.github.io/Tema-Shopify/merchant/docs.html`
    - `https://noobprobro-web.github.io/Tema-Shopify/merchant/support.html`
  - *Opción B (Hosting propio):* Subir ambos archivos a `ruizdigital.com/themes/sartorial/docs` y `/support`.
  - *Opción C (Static deploy):* Vercel / Netlify / Cloudflare Pages gratuito en 1 clic.

### 2. B-04 (P0): Fotografía de Catálogo de Edition
- **Diagnóstico:** En `scratch/sartorial_edition_products.csv`, 9 de 13 fotos no corresponden al producto (pisapapeles muestra montacargas de almacén; llavero muestra candado en teclado; bandeja muestra jarrón; folio muestra mochila rosa; funda de laptop muestra bolso tote).
- **Vía de resolución:** Curar 10 URLs de Unsplash / Pexels de alta estética que coincidan con los títulos y dimensiones descritas, actualizar el CSV e importarlo en `sartorial-edition`.

### 3. M-01 / R4 (P1): Políticas Legales y Colección 404
- **404 en Edition:** La tarjeta Bento de portada enlaza a `/collections/desk-and-study`, pero la colección no existe en `sartorial-edition.myshopify.com`. Se soluciona creando la colección con handle `desk-and-study` en el admin de Edition.
- **Políticas en las 3 tiendas:** En Shopify Admin > Settings > Policies, crear desde plantilla las políticas de Reembolso, Envío, Términos e Información de Contacto para eliminar los 404s del pie.

### 4. M-02 / H4 (P1): Fotografía de Archive
- **Diagnóstico:** Las 12 piezas de archivo vintage reutilizan los nombres y fotos contemporáneas de Atelier (`nove-blazer-01.jpg`, etc.).
- **Vía de resolución:** Evaluar con Johandry si se actualizan las imágenes por piezas vintage/archivo, o si se ajustan las fichas para mantener consistencia.

### 5. Pagos de Prueba (Bogus)
- Bogus Gateway está activo y el botón "Pay now" listo. Falta que Johandry realice 1 compra de prueba completa en cada tienda para registrar los pedidos (#1001, etc.) en los paneles de Shopify.

---

## 4. Misión para Claude

1. **Tomar el mando:** Asumir el control de la conversación y de la estrategia técnica.
2. **Proponer opciones a Johandry:** Explicarle con claridad ejecutiva por dónde conviene empezar (orden de ataque recomendado: quick wins vs tareas de catálogo vs hosting de docs).
3. **Guiar los siguientes pasos:** Indicar qué debe hacer Johandry en los paneles de Shopify y qué puede ejecutar Claude directamente en el código o en los CSVs.
