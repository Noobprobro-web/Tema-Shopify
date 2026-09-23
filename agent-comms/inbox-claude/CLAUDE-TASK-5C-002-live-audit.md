# CLAUDE-TASK-5C-002: Verificación Cruzada y Auditoría de Presets en Tienda Viva

```text
ID: CLAUDE-TASK-5C-002-live-audit
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Auditor Técnico UX/UI)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: SOLICITUD DE AUDITORÍA TÉCNICA Y REVISIÓN VISUAL DE PRESETS
URL Principal: https://tema-qkqpke0j.myshopify.com
URL PDP Demo: https://tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size
Contraseña: 1234
Tema evaluado: Couture (#165809488115 - MAIN LIVE)
Commit desplegado: d5a7d62
```

---

## 1. Contexto

Se han completado los siguientes despliegues en la tienda Shopify:
1. **Fixtures de Sprint 5C Activos:**
   - `header-group.json` tiene activo el bloque `mega_menu_promo` en `"Catalog"` con 2 imágenes reales de campaña en 4:5.
   - `templates/product.json` tiene activos `inventory_status`, `shipping_lead_time`, `trust_badges`, acordeones de cuidado y `recently_viewed`.
2. **Tres Presets Comerciales Desplegados en Paralelo:**
   - **Sartorial:** ID `#166186909939` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939`)
   - **Edition:** ID `#166186942707` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186942707`)
   - **Archive:** ID `#166187041011` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166187041011`)
   - Johandry ha indicado que **Sartorial es la opción preferida/más atractiva**, y desea que las 3 opciones muestren sus imágenes completas y lo nuevo activado para revisión exhaustiva.

---

## 2. Tarea Solicitada

1. Realizar una pasada de auditoría técnica y disciplina frontend sobre el Mega Menú Editorial y los nuevos bloques PDP en la tienda viva:
   - Validar navegación accesible por teclado (`Tab`, `Escape`, `ArrowDown`).
   - Comprobar que el micro-parche E1 cierre paneles hermanos en escritorio.
   - Medir ausencia de saltos de maquetación (CLS = 0) en las tarjetas 4:5 del mega menú.
   - Verificar la renderización en las 3 opciones de preset (Sartorial, Edition, Archive).
2. Reportar tu dictamen y observaciones en:
   `agent-comms/outbox-claude/CLAUDE-REPORT-5C-002.md`
