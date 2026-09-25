# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-25
Estado general: SPRINT 6B TOTALMENTE CERRADO Y CERTIFICADO EN TIENDA REAL -> FILAS 76, 47, 53 Y 73 EN CUMPLIDO -> LEDGER ALCANZA 52 CUMPLIDO (91.2%)
Próximo hito: Cierre de Filas 35, 46 y 72 (Punto Focal, Contraste de Texto y Medios 3D) para alcanzar el 96.5% técnico
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.
- **Sprint 5C - The Luxury Triple Crown ($380 USD Tier):** Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`). Mega Menú editorial bilingüe (0 CLS, tarjetas 4:5, links dinámicos localizados), Recently Viewed nativo (0-4 tarjetas, persistencia 8 IDs, sin overflow 390/360 px), inventario reactivo multi-estado (in_stock, low_stock, sold_out, preorder), acordeones bilingües y anuncio accesible de carrito. Filas 83-85 del ledger pasadas a `cumplido`.
- **Auditoría de Presets y Cierre de Fila 106:** Certificado en tienda real en los 4 temas independientes (`CLAUDE-REPORT-AUDIT-PRESETS-001`). Dictamen APTO. Sartorial 100% preservado. Parches H1 y H2 aplicados (`af6ee6d`). Fila 106 en `cumplido`.
- **Sprint 6A - Storefront Certification & Hardening (Filas 63, 78, 79, 80, 81, 82):** Certificado integralmente en tienda real (`CLAUDE-REPORT-6A-001` y mediciones Playwright automatizadas). 
  - Fila 80 (Idioma): Toggle bilingüe probado en desktop y drawer móvil, POST nativo sin JS, 44x44, 7.87:1.
  - Fila 78 (Búsqueda Predictiva): Debounce (4 eventos -> 1 petición), 4 entidades, navegación teclado real, parches D1 y H-A desplegados, axe-core **0 violaciones**.
  - Fila 79 (País / Moneda): Toggle minimalista `USD$/EUR€` verificado en vivo con recálculo dinámico a Euros ("1.890,00 €"), fallback sin JS listo.
  - Fila 82 (Iconos de Pago en Footer): 6 SVGs oficiales renderizados, responsivo flex-wrap sin scroll horizontal en móvil (375px), parche H-C aplicado.
  - Fila 81 (Newsletter): Envío manual por comerciante completado, estados `role="status"` y `role="alert"`.
  - Fila 63 (Checkout Acelerado): "Buy it now" activo y reactivo a variantes agotadas, tipografía homologada (14px uppercase), soporte nativo `additional_checkout_buttons`.
- **Sprint 6B - Píldoras de Filtros Activos, Accesibilidad y Zoom PDP (Filas 76, 47, 53, 73):** Certificado integralmente en tienda real Couture #165809488115 y Sartorial #166186909939 (`CLAUDE-REPORT-6B-001` y `scratch/verify-sprint6b-live.mjs`).
  - Fila 76 (Filtros Facetados): Píldoras de filtros activos (`snippets/facets-active-filters.liquid`) con `url_to_remove` individuales, eliminación AJAX instantánea, botón "Clear all", recálculo de rango de precios y targets táctiles de 44px en móvil sin overflow.
  - Fila 47 (Contraste No-Texto): Borde de inputs 4.19-4.39 (claro) y 6.35 (oscuro), chips 3.28:1, foco `:focus-visible` >= 15.52:1. axe 0 violaciones.
  - Fila 53 (Live Regions): Regiones vivas operativas en adición a carrito (con delay accesible de 100ms H-2), cambio de variantes en PDP, filtrado de colecciones y búsqueda.
  - Fila 73 (Zoom PDP): Web Component `<product-zoom>` verificado con apertura modal, pan con ratón a 1280px, pellizco multitouch a 375px y retorno atómico de foco.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Decisión sobre H-1 (hero contrast en Sartorial), fijar punto focal en imagen hero y subir 1 vídeo/3D a catálogo. | 🟢 Activo | Acciones de Admin |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Sprint 6B certificado en tienda real y desplegado a los 4 temas. Ledger actualizado a 52/57 (91.2%). | 🟢 Cumplido | Coordinación de Sprint 6C |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Auditor UX | Entrega CLAUDE-REPORT-6B-001 completada. Píldoras implementadas y compuertas estáticas en verde (150 archivos). | 🟢 Cumplido | Standby para siguiente tarea |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Standby (reemplazado por Claude para esta auditoría por disponibilidad de usuario). | ⚪ En reposo | N/A |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 57 filas oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **52** | 91.2% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **3** | 5.3% | Código funcional implementado; pendientes ajustes de datos de catálogo (35, 46, 72). |
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
