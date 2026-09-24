# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-23
Estado general: PULIDO UNIFICADO DE TRADUCCIONES COMPLETADO (CLAUDE-REPORT-UNIFIED-POLISH-001) -> CORRECCIÓN VISUAL DE TITULARES DESPLEGADA -> AUDITORÍA INTEGRAL DE PRESETS (GPT-TASK-012)
Próximo hito: Auditoría visual, bilingüe y de producto de GPT-6 Sol Max en los 4 temas (GPT-AUDIT-012)
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.
- **Sprint 5C - The Luxury Triple Crown ($380 USD Tier):** Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`). Mega Menú editorial bilingüe (0 CLS, tarjetas 4:5, links dinámicos localizados), Recently Viewed nativo (0-4 tarjetas, persistencia 8 IDs, sin overflow 390/360 px), inventario reactivo multi-estado (in_stock, low_stock, sold_out, preorder), acordeones bilingües y anuncio accesible de carrito. Filas 83-85 del ledger pasadas a `cumplido`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Decisión de diseño: Sartorial seleccionado como preset favorito. | 🟢 Activo | Feedback y dirección |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Fix de titulares (`overflow-wrap: break-word` + `content_width: 46` en Archive) desplegado a los 4 temas. Tarea de auditoría emitida a GPT-6. | 🟢 Activo | Supervisión y cierre |
| Claude (Opus 5.5 Extra) | Implementador Principal / Auditor UX | 28 traducciones registradas en Couture y presets (`CLAUDE-REPORT-UNIFIED-POLISH-001`). 0 userErrors, 0 outdated. | 🟢 Cumplido | `CLAUDE-REPORT-UNIFIED-POLISH-001.md` |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Auditoría integral exhaustiva de los 3 presets y tema principal (`GPT-TASK-012-final-unified-audit.md`). | 🟡 En curso | `GPT-AUDIT-012` |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 57 filas oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **41** | 71.9% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **14** | 24.6% | Código funcional implementado; pendientes pruebas en tienda real / Gate 5. |
| `no verificado` | **2** | 3.5% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **57** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias del Merchant (Johandry)

1. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color" para activar las muestras facetadas en tienda viva.
2. **[Calidad de Imagen] Fotografía de Catálogo para Zoom de Tejido (R3):**
   - Subir fotografías de alta costura con resolución >= 3000 px de ancho para exhibir el detalle textil en PDP.
