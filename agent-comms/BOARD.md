# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-23
Estado general: SPRINT 5C INTEGRADO Y REVISADO (GEMINI-review-SPRINT-5C) -> DESPLIEGUE A TIENDA VIVA Y AUDITORÍA ADVERSARIAL DE CIERRE (GPT-AUDIT-009)
Próximo hito: Push de tema a tienda real (#165809488115), fixture de Mega Menú y certificación Gate 5 por GPT-6
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.

---

## 2. Sprint Integrado: SPRINT 5C - THE LUXURY TRIPLE CROWN ($380 USD Tier)

**Objetivo Logrado:**
1. **Track 1 (Claude Opus 5.5 Extra):**
   - **Mega Menú Editorial Multicolumna (`sections/header.liquid`, `snippets/mega-menu.liquid`):** Navegación fluida por columnas para enlaces de 2º y 3º nivel; hasta 2 tarjetas promocionales editoriales con imágenes 4:5 y `loading="lazy"`. 0 KB de JS nuevo sobre `<theme-disclosure>`.
   - **Pulido P2-01 en `assets/product-zoom.js`:** Actualización dinámica de live region (`announce()`) al reescalar por giro o resize manteniendo el zoom abierto. Peso: 11.988 bytes (< 12.000 bytes).
2. **Track 2 (GPT-6 Sol Max):**
   - **Sección Recently Viewed (`sections/recently-viewed.liquid`):** Web Component `<recently-viewed>` en `assets/theme.js` persistiendo hasta 8 IDs en `localStorage` y renderizado mediante `/search?type=product&q=id:X OR id:Y`.
   - **Inventario Reactivo por Variante (`snippets/product-inventory.liquid`):** Estados semánticos (`in_stock`, `low_stock`, `preorder`, `sold_out`) reactivos al evento `theme:variant-change`.
   - **Acordeones Nativos (`snippets/product-accordion.liquid`):** `<details>` nativos accesibles sin JS con soporte para contenido de página o texto estático.
   - **Anuncio Accesible de Carrito:** Confirmación por lector de pantalla con nombre y variante al añadir producto al carrito.
3. **Micro-Parches de Integración (Gemini):**
   - Exclusividad de paneles en menú de escritorio (cierre automático de disclosures hermanos).
   - Apertura/cierre automático de mega menú en el Theme Editor ante `shopify:block:select` y `shopify:block:deselect`.

---

## 3. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Decisión de diseño: Sartorial seleccionado como preset principal. | 🟢 Activo | Feedback y dirección |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | P1 de locale y P2 de imagen corregidos y desplegados (`ac14d08`, `a486734`). Directivas emitidas. | 🟢 Activo | Supervisión de certificación |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Auditor UX | Registro de traducciones storefront y limpieza de Liquid fallbacks (`CLAUDE-DIRECTIVE-5C-003`). | 🔵 Asignado | `CLAUDE-REPORT-5C-004.md` |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Certificación final en vivo de Gate 5 con P1 resuelto (`GPT-TASK-011`). | 🔵 Asignado | `GPT-AUDIT-011-sprint-5c-certification.md` |

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 57 filas oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **38** | 66.7% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **17** | 29.8% | Código funcional implementado; pendientes pruebas en tienda real / Gate 5. |
| `no verificado` | **2** | 3.5% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **57** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias del Merchant (Johandry)

1. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color" para activar las muestras facetadas en tienda viva.
2. **[Calidad de Imagen] Fotografía de Catálogo para Zoom de Tejido (R3):**
   - Subir fotografías de alta costura con resolución >= 3000 px de ancho para exhibir el detalle textil en PDP.
