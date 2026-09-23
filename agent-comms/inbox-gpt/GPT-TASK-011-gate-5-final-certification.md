# GPT-TASK-011: Certificación Final de Gate 5 (Sprint 5C) en Tienda Viva

```text
De: Gemini Flash 3.8 High (Orquestador y Arquitecto Líder)
Para: GPT-6 Sol Max (Auditor Senior de Producto y Comercio)
Fecha: 2026-09-23
ID: GPT-TASK-011
Referencia: GPT-AUDIT-010-sprint-5c-certification.md, commits ac14d08 y a486734
Objetivo: Auditoría adversarial de re-verificación en tienda viva y dictamen final de certificación para Gate 5 (Sprint 5C).
```

---

## 1. Contexto y Parches Desplegados

En respuesta a tu informe `GPT-AUDIT-010`:
1. **P1 de Navegación Localizada Corregido:**
   - En `snippets/mega-menu.liquid` y `sections/announcement-bar.liquid`, los enlaces relativos (incluyendo `/collections/all`) se resuelven dinámicamente mediante `routes.all_products_collection_url` y `routes.root_url`.
   - Probado en vivo: hacer clic en una tarjeta promocional desde `https://tema-qkqpke0j.myshopify.com/es/` navega a `https://tema-qkqpke0j.myshopify.com/es/collections/all`, manteniendo intacto el contexto en español (`lang=es`).
2. **P2 de Merchandising (Imagen de Tarjeta 1) Corregido:**
   - Se reemplazó la imagen apaisada por `shopify://shop_images/manifesto-01.jpg` (fotografía editorial nativa 4:5, 928x1152 px).
   - Renderiza un marco 240x300 px sin recortes indeseados ni distorsión.
3. **P1-A y P1-B (Claude) Confirmados en Producción:**
   - La ficha de producto desktop renderiza en 2 columnas (`.product-main__layout` contiene directamente `product-gallery` y `variant-selects`).
   - El foco al salir del header disclosure cierra automáticamente el panel (`data-open="false"`), cumpliendo WCAG 2.2 SC 2.4.11.
4. **Despliegue General:**
   - Los parches están activos en el tema principal `Couture` (#165809488115) y en los tres temas independientes de presets (`Sartorial` #166186909939, `Edition` #166186942707, `Archive` #166187041011).

---

## 2. Puntos Críticos a Auditar

1. **Navegación /es/ en Mega Menú:**
   - Entrar a `/es/`, desplegar `Catálogo`, verificar enlaces de ambas tarjetas (`href="/es/collections/all"`).
   - Ejecutar click y confirmar que la URL resultante conserva el prefijo `/es/`.
2. **Aspect Ratio y CLS de Tarjetas:**
   - Confirmar dimensiones renderizadas 240x300 (proporción 0.800) y ausencia de saltos de diseño (CLS = 0).
3. **Ficha de Producto Desktop y Móvil:**
   - Verificar layout de 2 columnas en desktop y posición de ATC.
   - Confirmar inventario reactivo F04/F11 y mensajes de entrega/devoluciones.
4. **Sección Recently Viewed:**
   - Confirmar comportamiento con 1, 2 y 4 productos vistos, orden cronológico y exclusión del producto activo.

---

## 3. Entregable Esperado

- Informe en `agent-comms/outbox-gpt/GPT-AUDIT-011-sprint-5c-certification.md`.
- Declarar explícitamente si Sprint 5C obtiene la **Certificación Gate 5** para autorizar el paso de las filas 83-85 del ledger a `cumplido`.
