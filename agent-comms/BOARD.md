# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-23
Estado general: HOTFIX F01 SPRINT 5B COMPLETADO Y APROBADO (GEMINI-review-CLAUDE-5B-002) -> DESPLIEGUE A TIENDA VIVA Y CERTIFICACIÓN FINAL POR GPT-6 SOL MAX
Próximo hito: Despliegue live del tema Couture (#165809488115), verificación en tienda real y certificación final de Sprint 5B por GPT-6 Sol Max
```

---

## 1. Sprint Activo: SPRINT 5B - LUXURY PDP MEDIA & ACCESSIBLE ZOOM (Hotfix F01 Aplicado)

**Meta del Sprint:** Conforme a `GPT-AUDIT-003`, `CLAUDE-AUDIT-OPUS-001`, `GPT-AUDIT-006` y `GPT-AUDIT-007`, implementar la experiencia multimedia inmersiva de ficha de producto (PDP) propia de un tema de lujo ($380 USD):
1. **Web Component `<product-zoom>` en `assets/product-zoom.js`:** Carga bajo demanda (`defer`) exclusiva en PDP (`main-product.liquid`) cuando el ajuste `enable_media_zoom` está activo (0 KB de impacto en el resto de páginas). 11.945 bytes (3.850 bytes gzipped).
2. **Visor Modal Nativo con `<dialog>` y Pointer Events:**
   - Cero librerías externas.
   - Modo 1x y modo zoom máximo limitado por la resolución real de la fotografía: `min(3, naturalWidth / renderedWidth)`.
   - Soporte gestual táctil: pellizco con dos dedos con ancla absoluta desde el estado inicial, arrastre (pan) y doble toque para alternar zoom.
   - Soporte ratón: clic para alternar y modo "seguir cursor" para inspección de tejido.
   - Navegación por teclado completa (`+`, `-`, `0`, flechas, Home, End, Tab confinado y Escape con restauración de foco al disparador exacto).
   - Modo de movimiento reducido respetado (`prefers-reduced-motion: reduce`).
3. **Hotfix F01 y Blindaje de Foco Modal (Sprint 5B-002):**
   - Transición proactiva de foco antes de ocultar o deshabilitar controles (`assets/product-zoom.js:155-166`).
   - Cobertura de las 6 rutas críticas: Reset zoom -> Acercar; Acercar al máximo -> Alejar; Alejar a 1x -> Acercar; Siguiente en 4/4 -> Anterior; Anterior en 1/4 -> Siguiente; y salvaguarda general ante cualquier blur externo.
   - Cero fugas de foco a `BODY` mientras el visor permanece abierto.
4. **Carga Inteligente de Medios (Zero LCP Penalty):** Marcador transparente en línea; imágenes maestras de alta resolución cargadas de forma perezosa (`data-srcset`) únicamente al abrir el diálogo modal con `fetchpriority="high"` en la foto activa y sus vecinas.
5. **Optimizaciones de Galería PDP:**
   - H-07: Ajuste de `sizes` en `snippets/product-media.liquid` y `sections/main-product.liquid` a `(min-width: 62rem) 30vw, 100vw` en rejilla de 2 columnas de escritorio.
   - H-13: Pausa automática de `<video>` y envío de `postMessage` a YouTube (`pauseVideo`) y Vimeo (`pause`) al cambiar de diapositiva o deslizar carrusel móvil.
   - H-19: Texto alternativo secuencial descriptivo (`snippets/media-alt.liquid`) cuando el catálogo no provea alt individual ("{{ title }} – Image {{ n }} of {{ total }}").

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Agregar filtro "Color" en Search & Discovery. 2) Opcional: activar Gift Cards en Admin. 3) Fotografía de catálogo >= 3000 px para demo de Theme Store. | 🟢 Activo | Configuración de tienda |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Disciplina Técnica | Hotfix F01 entregado con éxito (`CLAUDE-REPORT-5B-002.md`, arnés 25/25). | 🟢 Completado | Standby para feedback final |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Dictamen formal emitido (`GEMINI-review-CLAUDE-5B-002.md`), compuertas estáticas verificadas, commit y despliegue a tienda viva. | 🟢 Activo | Commit, push, deploy y re-evaluación live |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Verificación de remediación de F01 en tienda real y certificación final de cierre de Sprint 5B. | 🔵 Próximo | `agent-comms/outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md` |

---

## 3. Estado de Calidad y Compuertas Estáticas (Sprint 5B-002)

| Compuerta | Herramienta / Verificación | Resultado | Estado |
|---|---|:---:|:---:|
| **Theme Check** | Shopify CLI 3.x (`gates:theme-check`) | 118 archivos inspeccionados, **0 ofensas** | 🟢 SUPERADO |
| **Inventario de Locales** | `scripts/locale-key-inventory.mjs` | 394 claves, 0 sin resolver, 0 huérfanas en storefront | 🟢 SUPERADO |
| **Paridad Bilingüe** | `en.default.json` vs `es.json` | 394 / 394 claves, 100% paridad, 0 diferencias | 🟢 SUPERADO |
| **Dataset Hooks (Contratos)** | `scripts/dataset-hooks.mjs` | 20 componentes con data-* de contrato, 0 rotos | 🟢 SUPERADO |
| **Sintaxis JavaScript** | `node --check assets/*.js` | `theme.js` y `product-zoom.js` limpios | 🟢 SUPERADO |
| **Empaquetado** | `shopify theme package` | `Sartorial-1.0.0.zip` (98 archivos de tema) | 🟢 SUPERADO |
| **Ledger Estructural** | `scripts/ledger-verify.mjs` | 54 filas, 0 incoherencias, 0 errores | 🟢 SUPERADO |
| **Arnés 5B Automatizado** | `harness-5B-001/` (Liquid real + Chromium) | **25/25 tests en inglés y 25/25 en español** | 🟢 SUPERADO |

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 54 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **38** | 70.4% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **14** | 25.9% | Código funcional implementado; pendientes de catálogo comercial o apps externas. |
| `no verificado` | **2** | 3.7% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **54** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias del Merchant (Johandry)

1. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color". Esto activará de inmediato los swatches facetados en la tienda real (el código ya está desplegado).
2. **[Calidad de Imagen] Fotografía de Catálogo para Zoom de Tejido (R3):**
   - Para que el zoom de alta costura despliegue todo su valor ante los evaluadores de Shopify Theme Store, se recomienda subir imágenes con ancho mínimo de 3000 px. El tema respeta la resolución original para evitar pixelaciones.
3. **[Opcional] Activación de Tarjetas de Regalo:**
   - En *Configuración > Tarjetas de regalo*, habilitar si se desea crear y probar el fixture F08 en vivo.
