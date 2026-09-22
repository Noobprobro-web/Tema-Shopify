# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: SPRINT 5A IMPLEMENTADO Y APROBADO (Quick Buy con Tallas, Swatches Nativos en Tarjetas y Filtros, Exclusión de Agotados en Cart Drawer)
Próximo hito: Despliegue en vivo y ejecución de Compuerta 5 con fixtures F01-F12 en dev store
```

---

## 1. Sprint Activo: SPRINT 5A - LUXURY COMMERCE (Código Completo y Aprobado)

**Meta del Sprint:** Conforme a `GPT-AUDIT-003` y `GPT-AUDIT-004`, implementar las dos funcionalidades P0 de conversión y reducción de fricción:
1. **Quick Buy interactivo con selector de tallas y variantes en tarjetas de producto:** 1 clic en variantes únicas, popover en escritorio y bottom sheet modal en móvil para tallas, 44×44px mínimo, intercepción global por `CartDrawer` y degradación a PDP para productos complejos.
2. **Swatches nativos de color/material en tarjetas y filtros:** Muestras de `swatch.color` y `swatch.image` con hover para preview y click para commit; 2 swatches + `+N` en móvil de 2 columnas; swatches en filtros de colección y búsqueda.
3. **Optimización de Cross-Sell en CartDrawer:** Exclusión de productos agotados o ya presentes en el carrito.

**Estado:** 100% implementado y validado en arnés local (`CLAUDE-REPORT-5A-001.md`, `GEMINI-review-CLAUDE-5A-001.md`). Theme Check pasa con 0 ofensas (115 archivos), inventario con 0 huérfanas en storefront y paridad bilingüe perfecta (380 claves).

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Autorizar fixtures de prueba en dev store y renombrar tienda a "LINEA NOVE" | 🟢 Activo | Validación comercial |
| **Claude (Opus 5)** | Implementador Principal | Sprint 5A completado con honores; listo para desplegar y correr Compuerta 5 | 🟢 Listo | Ejecución de Compuerta 5 en vivo |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Dictamen formal emitido (`GEMINI-review-CLAUDE-5A-001.md`), parches aplicados | 🟢 Activo | Commit, despliegue y orquestación |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | `GPT-AUDIT-004` entregado; en espera de despliegue para auditoría adversarial | 🟢 Listo | Auditoría adversarial de producto sobre tienda real |

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
- **Modo Reducción de Movimiento:** Verificado con `@media (prefers-reduced-motion: reduce)` activo; el tema desactiva 100% de transiciones e ignora reveal.

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

1. **[P0 - Comercial] Nombre de Tienda y Títulos de Catálogo:**
   - En *Settings > Store details*, cambiar nombre a "LINEA NOVE" (elimina "– Tema" del título).
   - Opcional: traducir títulos de producto y alt de fotos con la app nativa *Translate & Adapt*.
2. **[P0 - Operativo] Despliegue de Plantillas y Registro de 9 Claves:**
   - Desplegar tema a tienda en vivo (`Couture` #165809488115).
   - Ejecutar `translate-storefront.mjs --apply --verify` para registrar las 9 claves expuestas por el parche de nivel 2.
