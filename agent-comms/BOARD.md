# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: SPRINT 5A 100% COMPLETADO, VERIFICADO EN TIENDA REAL Y APROBADO (Compuerta 5 Certificada)
Próximo hito: Auditoría adversarial senior de UX/comercio por GPT-5.6 Sol Max y preparación para Sprint 5B (Zoom & PDP Media)
```

---

## 1. Sprint Activo: SPRINT 5A - LUXURY COMMERCE (Compuerta 5 Certificada)

**Meta del Sprint:** Conforme a `GPT-AUDIT-003` y `GPT-AUDIT-004`, implementar y validar en tienda real las funcionalidades P0 de conversión y reducción de fricción:
1. **Quick Buy interactivo con selector de tallas y variantes en tarjetas de producto:** 1 clic en variantes únicas, popover en escritorio y bottom sheet modal en móvil para tallas, 44×44px mínimo, intercepción global por `CartDrawer` y degradación a PDP para productos complejos.
2. **Swatches nativos de color/material en tarjetas y filtros:** Muestras de `swatch.color` y `swatch.image` con hover para preview y click para commit; 2 swatches + `+N` en móvil de 2 columnas; swatches en filtros de colección y búsqueda. Respeto estricto a regla SW-01 (cero colores deducidos artificialmente).
3. **Optimización de Cross-Sell en CartDrawer:** Exclusión de productos agotados o ya presentes en el carrito, foco en la línea añadida.
4. **Parches de Accesibilidad Nivel 2:** Ratio de contraste corregido en selector de idioma inactivo (>= 4.5:1) y eliminación de contenedores de sección redundantes en header/footer para cumplir landmarks axé/Lighthouse.

**Estado:** 100% implementado, auditado en tienda real con 8 fixtures publicados en `/collections/qa-sprint-5a` (`CLAUDE-REPORT-5A-002`, `GEMINI-review-CLAUDE-5A-002`). Theme Check: 116 archivos con 0 ofensas, paridad bilingüe perfecta (380 claves), 0 errores en todas las compuertas estáticas.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Agregar filtro "Color" en Search & Discovery. 2) Opcional: activar Gift Cards en Admin. | 🟢 Activo | Configuración de tienda |
| **Claude (Opus 5)** | Implementador Principal | Sprint 5A completado con distinción máxima; en reposo para Sprint 5B | 🟢 Completado | Listo para siguiente sprint |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Aprobación de Compuerta 5, actualización de Ledger/Board, despacho a GPT | 🟢 Activo | Orquestación y control |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Auditoría adversarial de producto sobre `/collections/qa-sprint-5a` (`GPT-TASK-005`) | 🔵 En ejecución | `agent-comms/outbox-gpt/GPT-AUDIT-005-sprint-5a-adversarial.md` |

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
