# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: LOCALE-AUDIT-001 APROBADO (Paridad Bilingüe Total, 196+9 Traducciones Storefront, Selector Minimalista EN/ES 44px + Fallback Multipaís)
Próxima fase: SPRINT 5A - LUXURY COMMERCE (Quick Buy con Selector de Tallas & Swatches Nativos en Tarjetas y Filtros)
```

---

## 1. Sprint Activo: SPRINT 5A - LUXURY COMMERCE (En Ejecución por Claude)

**Meta del Sprint:** Conforme a la auditoría senior de producto `GPT-AUDIT-003` y los benchmarks competitivos de $380-$400 (Prestige, Focal, Impulse), implementar las dos funcionalidades P0 inmediatas de conversión y reducción de fricción:
1. **Quick Buy con selector interactivo de talla y variante en tarjetas de producto:** Permite añadir al carrito directamente desde la colección y módulos de recomendación sin abandonar el flujo de exploración, manejando stock, estados agotados, accesibilidad WCAG y feedback háptico/visual.
2. **Swatches nativos de color/material en tarjetas y filtros facetados:** Renderizado de muestras visuales basadas en categoría nativa de Shopify, sincronizadas con el cambio de imagen y estado de variante compartida con el Quick Buy.

**Directiva emitida:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-5A-001.md`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Revisar tienda en vivo `/es`, renombrar tienda a "LINEA NOVE" en Admin | 🟢 Activo | Validación comercial |
| **Claude (Opus 5)** | Implementador Principal | Implementando Sprint 5A (Quick Buy & Swatches) según directiva | 🔵 En ejecución | `agent-comms/outbox-claude/CLAUDE-REPORT-5A-001.md` |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Supervisión técnica de arquitectura, compuertas y soporte a Claude | 🟢 Activo | Revisión y compuertas Sprint 5A |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Preparando criterios de auditoría UX/conversión sobre Quick Buy y Swatches | 🟢 Listo | Auditoría de producto sobre entrega de Claude |

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
