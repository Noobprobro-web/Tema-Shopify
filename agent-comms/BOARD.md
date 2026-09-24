# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-24
Estado general: SPRINT 6 TOTALMENTE CERRADO Y CERTIFICADO EN TIENDA REAL -> FILAS 63, 78, 79, 80, 81 Y 82 EN CUMPLIDO -> LEDGER ALCANZA 48 CUMPLIDO (84.2%)
Próximo hito: Sprint 6B (Filtros Facetados Nativos en Colección y Búsqueda, Fila 76) y Sprint 6C (Punto Focal, Contrastes WCAG, Modelos 3D y Zoom táctil)
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.
- **Sprint 5C - The Luxury Triple Crown ($380 USD Tier):** Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`). Mega Menú editorial bilingüe (0 CLS, tarjetas 4:5, links dinámicos localizados), Recently Viewed nativo (0-4 tarjetas, persistencia 8 IDs, sin overflow 390/360 px), inventario reactivo multi-estado (in_stock, low_stock, sold_out, preorder), acordeones bilingües y anuncio accesible de carrito. Filas 83-85 del ledger pasadas a `cumplido`.
- **Auditoría de Presets y Cierre de Fila 106:** Certificado en tienda real en los 4 temas independientes (`CLAUDE-REPORT-AUDIT-PRESETS-001`). Dictamen APTO. Sartorial 100% preservado. Parches H1 y H2 aplicados (`af6ee6d`). Fila 106 en `cumplido`.
- **Sprint 6 - Storefront Certification & Hardening (Filas 63, 78, 79, 80, 81, 82):** Certificado integralmente en tienda real (`CLAUDE-REPORT-6A-001` y mediciones Playwright automatizadas). 
  - Fila 80 (Idioma): Toggle bilingüe probado en desktop y drawer móvil, POST nativo sin JS, 44x44, 7.87:1.
  - Fila 78 (Búsqueda Predictiva): Debounce (4 eventos -> 1 petición), 4 entidades, navegación teclado real, parches D1 y H-A desplegados, axe-core **0 violaciones**.
  - Fila 79 (País / Moneda): 2 mercados activos (US/ES), cambio verificado con auto-submit, precios recalculados dinámicamente a Euros ("1.890,00 €"), fallback sin JS listo.
  - Fila 82 (Iconos de Pago en Footer): 6 SVGs oficiales renderizados, responsivo flex-wrap sin scroll horizontal en móvil (375px), parche H-C aplicado.
  - Fila 81 (Newsletter): Envío manual por comerciante completado, estados `role="status"` y `role="alert"`.
  - Fila 63 (Checkout Acelerado): "Buy it now" activo y reactivo a variantes agotadas, tipografía homologada (14px uppercase), soporte nativo `additional_checkout_buttons`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Acciones de Admin cumplidas con éxito (Bogus Gateway, 2do Mercado). Traducción de productos en curso con app oficial de Shopify. | 🟢 Activo | Dirección de prioridades |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Verificación empírica ejecutada con éxito. Filas 63, 79, 81 y 82 pasadas a cumplido. Ledger en 84.2%. | 🟢 Cumplido | Definición de Sprint 6B |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Auditor UX | Auditorías de Sprint 6A y parches completados al 100%. En espera de directiva para Sprint 6B. | 🟢 Cumplido | Standby para siguiente tarea |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Standby (reemplazado por Claude para esta auditoría por disponibilidad de usuario). | ⚪ En reposo | N/A |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 57 filas oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **48** | 84.2% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **7** | 12.3% | Código funcional implementado; pendientes pruebas en tienda real / Gate 5. |
| `no verificado` | **2** | 3.5% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **57** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Próximos Pasos Técnicos y Comerciales

1. **Sprint 6B — Filtros Facetados Nativos en Colección y Búsqueda (Fila 76):**
   - Asegurar paridad completa entre `main-collection.liquid` y `main-search.liquid` con soporte de swatches y filtros nativos.
2. **Sprint 6C — Accesibilidad y Medios Especializados (Filas 35, 46, 47, 53, 72, 73):**
   - Certificación de punto focal nativo, contrastes WCAG 2.2 AA (>= 4.5:1 y 3:1), live regions y modelos 3D / media.
3. **Fase Comercial del Comerciante (Filas 107 y 108):**
   - Publicación de páginas de documentación y soporte en dominio propio (`ruizdigital.com`).
   - Fotografía final y catálogo demo auténtico sin placeholders.
