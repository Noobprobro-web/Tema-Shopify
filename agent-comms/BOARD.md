# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-14
Estado general: FASE 4C (Activación Visual, Sistema de Movimiento y Pulido Final)
```

---

## 1. Sprint Activo: SPRINT-4C-002 (Sistema de Movimiento Cinemático - Bloque B) - COMPLETADO Y ACEPTADO

**Meta del Sprint:** Implementar el sistema de movimiento unificado propuesto en `CLAUDE-PLAN-4C-001` (B0 tokens en `:root`, B1 setting maestro `animations`, B2 scroll reveal progresivo sin tocar LCP, B3 hero cinemático, B4 hover/quick-add en product-card, B5 View Transitions API, B6 galería PDP, B7 cabecera condensada y cart drawer escalonado).
**Resultado:** APROBADO Y ACEPTADO formalmente en `GEMINI-review-CLAUDE-4C-002.md`. 8 compuertas estáticas en código 0, Theme Check en 91 archivos con 0 ofensas, y banco de pruebas Playwright en 24/24 PASS.

*Siguiente Fase:* Transición final a Submission: cierre de filas de requisitos en `docs/requirements-ledger.md`, generación de catálogo demo y publicación de páginas de documentación.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Generación de imágenes demo según guía de Claude (`CLAUDE-PLAN-4C-001`) | 🟢 En marcha | 24 imágenes de producto y 11 de escena en `demo-assets/images/` |
| **Claude (Opus 5)** | Implementador Principal | Sprint 4C-002 completado y aceptado | 🟢 Entregado | `CLAUDE-REPORT-4C-002` aprobado |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Consolidación de mediciones en `requirements-ledger.md` y commit/push | 🟢 Activo | Registro de commit y actualización matemática del ledger |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Standby / Auditoría de activación visual y merchandising | 🟢 Listo | Segunda opinión UX sobre el homepage activo y presets |

---

## 3. Resultados Empíricos de Compuerta 5 (Medición en Tienda Real con Movimiento Activo)

*Medición certificada con Google Lighthouse 13.4.1 y Playwright Chromium sobre proxy dev en tienda real:*

| Plantilla | Performance Móvil (Req >= 60) | Accesibilidad (Req >= 90) | CLS Móvil (Req < 0.1) | TBT | Estado |
|---|:---:|:---:|:---:|:---:|:---:|
| **Home (`/`)** *(8 secciones + movimiento)* | **72 / 100** | **100 / 100** | **0.022** | 180 ms | **CUMPLIDO** |
| **Colección (`/collections/all`)** | **77 / 100** | **100 / 100** | **0.003** | 70 ms | **CUMPLIDO** |
| **PDP (`/products/...`)** | **87 / 100** | **100 / 100** | **0.001** | 180 ms | **CUMPLIDO** |

*Validaciones Estructurales y WCAG 2.2 AA con axe-core 4.10.2:*
- **Jerarquía de Encabezados (h1 único):** 100% PASS en Home, Colección, PDP, Búsqueda y 404. Cero saltos de nivel.
- **Desbordamiento Horizontal en Móvil (390px):** 100% PASS (0px de overflow).
- **Interactividad y Foco por Teclado (`CartDrawer`):** 100% PASS (apertura, focus trap, Escape, restauración de foco).
- **Violaciones de accesibilidad en toda la tienda:** **0 violaciones** (100% limpio).
- **Modo Reducción de Movimiento:** Verificado con `@media (prefers-reduced-motion: reduce)` activo; el tema desactiva 100% de transiciones e ignorar reveal.

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 53 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **39** | 73.6% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **12** | 22.6% | Código funcional implementado; pendientes de carga de catálogo comercial final. |
| `no verificado` | **2** | 3.8% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **53** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias Críticas

1. **[P0 - Comercial] URLs de Documentación y Soporte:**
   - Resuelto por Johandry (DP-001): se publicarán en la tienda Shopify a partir de `docs/merchant/docs.html` y `support.html`. Una vez activas, se enlazarán en `settings_schema.json`.
2. **[P1 - Técnico] Violación de Compuerta 3 en `assets/theme.js`:**
   - **RESUELTO Y CERRADO:** 0 ocurrencias de `Intl.NumberFormat`, `formatMoney` centralizado con fallback seguro a la moneda de la tienda.
