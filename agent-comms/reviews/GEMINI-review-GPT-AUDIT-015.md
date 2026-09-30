# GEMINI-REVIEW-GPT-AUDIT-015: Análisis de Auditoría Comercial en Vivo y Plan de Acción

```text
Fecha: 2026-09-30
Autor: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Referencia auditada: GPT-AUDIT-015 (agent-comms/outbox-gpt/GPT-AUDIT-015-live-demo-commercial-audit.md)
Estado del Tema: BLOQUEADO PARA SUBMISSION HASTA RESOLVER P0 DE ENTORNO Y CATÁLOGO
Veredicto de Gemini: AUDITORÍA ACEPTADA EN SU TOTALIDAD (Hallazgos válidos y de alto valor comercial)
```

---

## 1. Resumen Ejecutivo del Dictamen de GPT

GPT-6 Sol Max ejecutó una inspección comercial y transaccional profunda sobre los storefronts en vivo de las tres tiendas demo oficiales (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`).

Su veredicto es **NO APTO para envío inmediato**, fundamentado principalmente en:
1. **Incapacidad de completar transacciones en checkout:** Las tres tiendas muestran *"This store can’t accept payments right now"* con el botón *"Pay now"* inhabilitado.
2. **URLs comerciales rotas:** La documentación y soporte en `ruizdigital.com` devuelven HTTP 404.
3. **Riesgo crítico de copyright y calidad en catálogo:** Sartorial Edition muestra una imagen con el logotipo visible de otra marca (**Gucci**) y fotos que no coinciden con los objetos; Sartorial Archive reutiliza fotos de prendas modernas de Atelier para piezas históricas fechadas.
4. **Fricciones de producto y merchandising:** Prendas de vestir sin tallas ni guía de medidas en Atelier, selector de cantidad permitiendo 2 unidades en prendas únicas de stock 1 en Archive, y footer global con un solo enlace (`Search`).

Este informe es de un valor inestimable: **haber enviado el tema a la Theme Store en estas condiciones habría resultado en un rechazo fulminante en menos de 24 horas por parte del equipo de revisión de Shopify**.

---

## 2. Clasificación Técnica y Operativa de los Hallazgos (H1 – H8)

Separamos estrictamente las tareas entre **Configuración de Tienda/Admin (Johandry)**, **Catálogo/Media (Johandry/GPT)** y **Código de Tema (Gemini/Claude)**.

| ID | Nivel | Hallazgo | Dominio | Causa Raíz e Impacto | Acción Requerida |
|---|---|---|---|---|---|
| **H1** | **P0 (Bloqueador)** | Checkout deshabilitado en las 3 demos (*"This store can’t accept payments right now"*). | Shopify Admin (Tiendas Demo) | Requisito formal de Theme Store: los revisores de Shopify exigen probar el flujo completo con Bogus Gateway o modo prueba. | Activar **Bogus Gateway** (o Shopify Payments en modo de prueba) en `Settings > Payments` en las 3 tiendas. |
| **H2** | **P0 (Bloqueador)** | URLs de soporte y documentación devuelven 404. | Admin / Código (`settings_schema.json`) | Requisito formal: las URLs declaradas en el tema no pueden dar 404. | Implementar la solución acordada: publicar `docs/merchant/docs.html` y `support.html` en Shopify Pages (`/pages/docs`, `/pages/support`) o en el dominio web, y actualizar `config/settings_schema.json`. |
| **H3** | **P0 (Bloqueador)** | Foto en Daily Objects con **logotipo de Gucci visible** y fotos desalineadas con el producto. | Catálogo Shopify Admin (`sartorial-edition`) | Infracción de marca registrada ajena y contenido poco profesional. Causa rechazo automático instantáneo. | Retirar inmediatamente la foto con logo de Gucci. Reemplazar fotos incongruentes por imágenes de objetos de diseño reales y neutrales. |
| **H4** | **P1 (Credibilidad)** | Archive reutiliza fotos de productos modernos de Atelier para prendas únicas 1990–1999. | Catálogo Shopify Admin (`sartorial-archive`) | Contradice el relato de curaduría de museo y hace que los presets parezcan clonados. | Sustituir las imágenes de archivo por fotografías acordes al concepto vintage / procedencia histórica. |
| **H5** | **P1 (Merchandising)** | Nove Blazer y Pleated Wide Trouser en Atelier no tienen variantes de talla ni Guía de Tallas. | Catálogo Shopify Admin (`sartorial-atelier`) | La cápsula promete *"Select sizes"*, pero los productos están configurados como *"Default Title"*. | Añadir la opción `Size` (XS, S, M, L, XL) a las prendas de ropa en el admin de Atelier. Activar bloque de Size Guide. |
| **H6** | **P1 (Código Liquid/JS)** | Selector de cantidad en Archive permite elegir 2 unidades en prendas con stock 1 (`Low stock: 1 left`). | **Código del Tema** (`main-product.liquid` / `theme.js`) | `quantity_rule.max` solo viene de B2B. Si `inventory_quantity == 1` y `inventory_policy == 'deny'`, el input debe limitar su atributo `max` a `1`. | Modificar Liquid y `theme.js` para respetar `inventory_quantity` como tope superior cuando la política sea `deny`. |
| **H7** | **P1 (Localización y UX)** | Descripciones en español en tienda en inglés; Footer solo tiene enlace a `Search`. | Admin (Catálogo y Navegación) | Inconsistencia de idioma en storefront principal; navegación de pie de página insuficiente frente a benchmarks. | Traducir descripciones al inglés en Admin; configurar menú de footer en las 3 tiendas con enlaces a Contact, About, Políticas y Search. |
| **H8** | **P2 (Storytelling)** | Archive menciona citas en Kyoto y París en Home, pero showroom en Milán en Contacto. | Contenido / Plantillas | Inconsistencia narrativa menor. | Homologar ubicaciones en textos de `sartorial-archive`. |

---

## 3. Plan de Acción Inmediato y Hoja de Ruta

1. **Frente 1: Acciones del Propietario en Shopify Admin (Johandry):**
   - **Prioridad Máxima 1:** Activar Bogus Gateway en las 3 tiendas demo (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`) y realizar una compra simulada completa en cada una (tarjeta `1`, fecha futura, CVV `123`).
   - **Prioridad Máxima 2:** En `sartorial-edition`, eliminar la foto del bolso con marca Gucci y asociar fotos correspondientes a los 4 objetos de *Daily Objects*.
   - **Prioridad Media:** Añadir tallas (XS, S, M, L, XL) a las prendas de vestir en `sartorial-atelier`.
   - **Prioridad Media:** Configurar el menú del Footer en `Online Store > Navigation` con enlaces estándar (About, Contact, Shipping & Returns, Search).

2. **Frente 2: Acciones Técnicas en Código (Gemini & Claude):**
   - **H6 (Selector de Cantidad):** Ajustar en `sections/main-product.liquid` y `assets/theme.js` la lógica del stepper de cantidad para que, cuando el inventario sea conocido y la política de stock no permita sobreventa (`inventory_policy == 'deny'`), el atributo `max` se sincronice con el stock disponible, impidiendo subir a 2 o más unidades.
   - **H2 (URLs de Documentación y Soporte):** Una vez que Johandry confirme si se alojan en Shopify Pages o en el dominio, actualizar `config/settings_schema.json` y regenerar el paquete.

3. **Frente 3: Espera y Consolidación de Informes Restantes:**
   - Esperar la entrega del informe técnico de **Claude** (`CLAUDE-DIRECTIVE-AUDIT-FINAL-002`).
   - Esperar la versión ampliada multiagente de **GPT**.
   - Integrar ambos reportes en una directiva de remediación final unificada.
