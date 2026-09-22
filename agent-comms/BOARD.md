# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: OLA 1 CERTIFICADA POR GPT-6 SOL MAX (GPT-AUDIT-006) -> AVANCE OFICIAL A SPRINT 5B (Zoom & Galería de Medios PDP)
Próximo hito: Directiva e implementación de Sprint 5B por Opus 5.5 Extra (Web Component <product-zoom>, modal dialog, gestos táctiles y optimización de media)
```

---

## 1. Sprint Activo: SPRINT 5B - LUXURY PDP MEDIA & ACCESSIBLE ZOOM

**Meta del Sprint:** Conforme a `GPT-AUDIT-003`, `CLAUDE-AUDIT-OPUS-001` y el dictamen de avance de `GPT-AUDIT-006`, implementar la experiencia multimedia inmersiva de ficha de producto (PDP) propia de un tema de lujo ($380 USD):
1. **Web Component `<product-zoom>` en `assets/product-zoom.js`:** Carga bajo demanda (`defer`) exclusiva en PDP (`main-product.liquid`) cuando el ajuste `enable_media_zoom` está activo (0 KB de impacto en el resto de páginas).
2. **Visor Modal Nativo con `<dialog>` y Pointer Events:**
   - Cero librerías externas.
   - Modo 1x y modo zoom máximo limitado por la resolución real de la fotografía: `min(3, naturalWidth / renderedWidth)`.
   - Soporte gestual táctil: pellizco con dos dedos, arrastre (pan) y doble toque para alternar zoom.
   - Soporte ratón: clic para alternar y modo "seguir cursor" para inspección de tejido.
   - Navegación por teclado completa (`+`, `-`, `0`, flechas, Home, End, Tab confinado y Escape con restauración de foco).
   - Modo de movimiento reducido respetado (`prefers-reduced-motion: reduce`).
3. **Carga Inteligente de Medios (Zero LCP Penalty):** Imágenes maestras de alta resolución cargadas de forma perezosa (`data-srcset`) únicamente al abrir el diálogo modal.
4. **Optimizaciones de Galería PDP:**
   - H-07: Ajuste de `sizes` en `snippets/product-media.liquid` para evitar sobre-descarga en rejilla de 2 columnas.
   - H-13: Pausa automática de `<video>` al deslizar o salir del foco en carrusel móvil.
   - H-19: Texto alternativo secuencial descriptivo cuando el catálogo no provea alt individual ("{{ title }}, imagen {{ n }} de {{ total }}").

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Agregar filtro "Color" en Search & Discovery. 2) Opcional: activar Gift Cards en Admin. | 🟢 Activo | Configuración de tienda |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Disciplina Técnica | Implementación de Sprint 5B (`assets/product-zoom.js`, markup, gestos, a11y) | 🔵 En preparación | `agent-comms/outbox-claude/CLAUDE-REPORT-5B-001.md` |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Emisión de directiva 5B, supervisión técnica, compuertas y despliegue | 🟢 Activo | Directiva técnica vinculante |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Certificación de Ola 1 completada en GPT-AUDIT-006; en reposo para auditar 5B | 🟢 Completado | Auditoría de producto de Sprint 5B |

---

## 3. Resultados Empíricos de Compuerta 5 en Tienda Real (Sprint 5A)

*Medición certificada en navegador real sobre `tema-qkqpke0j.myshopify.com/collections/qa-sprint-5a`:*

| Métrica / Comprobación | Escritorio (1280×800 px) | Móvil (390×844 px) | Resultado |
|---|:---:|:---:|:---:|
| **Áreas Táctiles Mínimas (>= 44×44 px)** | 19 a 23 áreas medidas: mín 44×44 px | 19 a 24 áreas medidas: mín 44×44 px | **100% CUMPLIDO (0 por debajo)** |
| **Solapamientos de Elementos** | 0 solapes detectados | 0 solapes detectados | **100% CUMPLIDO** |
| **Desbordamiento Horizontal (Overflow)** | 0 px | 0 px | **100% CUMPLIDO** |
| **axe-core 4.10.2 (Sprint 5A Components)** | 0 violaciones en cards, popover, sheet, cart | 0 violaciones | **100% CUMPLIDO** |
| **Transacción en Vivo (Inglés /collections/...)** | Quick Buy F03 L -> Drawer en 1.07s -> Foco en línea -> Borrado 0 | Idem | **100% CUMPLIDO** |
| **Transacción en Vivo (Español /es/collections/...)** | Quick Buy F03 S -> Drawer en 1.07s -> Foco en línea -> Borrado 0 | Idem | **100% CUMPLIDO** |
| **Swatches Nativos e Interacción** | Hover preview, commit en click, precios y tallas actualizados | Tap commit, bottom sheet modal accesible | **100% CUMPLIDO** |

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 53 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **38** | 71.7% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **13** | 24.5% | Código funcional implementado; pendientes de catálogo comercial o apps externas. |
| `no verificado` | **2** | 3.8% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **53** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias del Merchant (Johandry)

1. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color". Esto activará de inmediato los swatches facetados en la tienda real (el código ya está desplegado).
2. **[Opcional] Activación de Tarjetas de Regalo:**
   - En *Configuración > Tarjetas de regalo*, habilitar si se desea crear y probar el fixture F08 en vivo.
