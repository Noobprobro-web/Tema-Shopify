# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: SPRINT 5A - OLA 1 DE REMEDIACIÓN APROBADA Y CERTIFICADA (Theme Check 116 archivos 0 ofensas, 384 claves en/es)
Próximo hito: Despliegue en tienda viva (Couture #165809488115), re-evaluación por GPT-6 Sol Max y arranque de Sprint 5B (Zoom & PDP Media)
```

---

## 1. Sprint Activo: SPRINT 5A - LUXURY COMMERCE (Ola 1 Implementada y Aprobada)

**Meta del Sprint:** Conforme a `GPT-AUDIT-005`, `CLAUDE-AUDIT-OPUS-001` y `CLAUDE-REPORT-5A-003`, se resolvieron las 8 tareas críticas + 2 parches de consistencia (E1 y E2):
1. **Fail-Closed en Selling Plans (GPT H1 - P0):** Implementado en Liquid (`main-product.liquid:13-26,570-597` y `featured-product.liquid:14-25,350-375`), `VariantSelects` (`theme.js:733-742`) y `CartDrawer.addItem` (`theme.js:2203-2217`).
2. **Quick Buy Trigger ante Color Agotado (GPT H2 - P0/P1):** Disparador deshabilitado con label "Agotado" / "Sold out" cuando el color seleccionado no tiene tallas disponibles (`theme.js:1829-1838` y `snippets/product-card.liquid`).
3. **Eliminación de Doble Escape (Claude H-01 - P1):** Corregidas 41 instancias de `| t: ... | escape` con `| escape_once` a lo largo de 14 archivos. Cero entidades HTML crudas visibles.
4. **Efectividad de `logo_width` (Claude H-02 - P1):** Conectado `--logo-width` en `header.liquid` y `base.css:650-659` con tope móvil de 3rem de alto para seguridad.
5. **Requisito Theme Store `secondary_menu` (Claude H-03 - P1):** Declarado default `"main-menu"` en schema y prevenida la duplicación en cabecera si es idéntico a `menu`.
6. **Neutralización de Cart Drawer (Claude H-04 & GPT H3 - P1):** Default `false` para progress tiered; textos neutros ("Free shipping and gift unlocked").
7. **Ergonomía de Marca Móvil a 390 px (Claude H-05 & GPT H4 - P1/P2):** Ajustada posición de contador, delimitada cuenta a 44px y font clamp optimizado con `column-gap` móvil: "LINEA NOVE" no se corta a 360 px ni a 390 px.
8. **Colección Vacía (Claude H-09 - P2):** Distingue colección vacía ("Esta colección está vacía") de colección filtrada sin resultados.
9. **Parches de Consistencia E1 y E2:** Cobertura de planes de venta en producto destacado y respeto al setting `show_cart_count`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Agregar filtro "Color" en Search & Discovery. 2) Opcional: activar Gift Cards en Admin. | 🟢 Activo | Configuración de tienda |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Disciplina Técnica | Ola 1 completada con honores (23 archivos tocados); en reposo para Sprint 5B | 🟢 Completado | Listo para Sprint 5B |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Aprobación de Ola 1, actualización de Ledger/Board, despliegue y pase a GPT | 🟢 Activo | Orquestación continua |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Re-verificación de F06 y F04 en tienda real post-despliegue | 🔵 En espera | Dictamen de cierre definitivo 5A |

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
