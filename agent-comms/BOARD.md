# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-22
Estado general: AUDITORÍAS CONCLUIDAS (GPT-6 Sol Max & Opus 5.5 Extra) -> DIRECTIVA DE REMEDIACIÓN UNIFICADA 5A-003 EMITIDA
Próximo hito: Ejecución quirúrgica por Opus 5.5 Extra, verificación estática y despliegue final antes de Sprint 5B
```

---

## 1. Sprint Activo: SPRINT 5A - LUXURY COMMERCE (Fase de Remediación P0/P1 Unificada)

**Meta del Sprint:** Conforme a `GPT-AUDIT-005` y `CLAUDE-AUDIT-OPUS-001`, ejecutar en un pase único las 8 correcciones de alta prioridad:
1. **Fail-Closed en Selling Plans (GPT H1 - P0):** Deshabilitar Add/Buy it now en PDP cuando un producto requiere selling plan pero carece de asignaciones válidas.
2. **Quick Buy Trigger ante Color Agotado (GPT H2 - P0/P1):** Deshabilitar disparador `.quick-buy__trigger` y marcar "Agotado" en tarjeta cuando el color seleccionado no tiene tallas disponibles.
3. **Eliminación de Doble Escape (Claude H-01 - P1):** Corregir 40 ocurrencias de `| t: ... | escape` en Liquid para evitar entidades visibles como `&amp;` o `O&#39;Brien`.
4. **Efectividad de `logo_width` (Claude H-02 - P1):** Conectar setting de schema con variables CSS en header.
5. **Requisito Theme Store `secondary_menu` (Claude H-03 - P1):** Declarar default `"main-menu"` en schema y prevenir duplicidad.
6. **Neutralización de Cart Drawer (Claude H-04 & GPT H3 - P1):** Default `false` para progress tiered y textos neutros sin términos de marca no configurados.
7. **Ergonomía de Marca Móvil a 390 px (Claude H-05 & GPT H4 - P1/P2):** Ajustar posición de contador, cuenta y font clamp para evitar elipsis en "LINEA NOVE".
8. **Colección Vacía (Claude H-09 - P2):** Distinguir estado de colección vacía nativa ("Esta colección está vacía") de colección filtrada sin resultados.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Agregar filtro "Color" en Search & Discovery. 2) Opcional: activar Gift Cards en Admin. | 🟢 Activo | Configuración de tienda |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Disciplina Técnica | Ejecutar remediación unificada P0/P1 (`CLAUDE-DIRECTIVE-5A-003`) | 🔵 En ejecución | `agent-comms/outbox-claude/CLAUDE-REPORT-5A-003.md` |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Supervisión técnica, auditoría de diffs, compuertas estáticas y autorización de commits | 🟢 Activo | Validación y cierre de Sprint 5A |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Auditoría adversarial 005 completada con éxito; en reposo para revisión final | 🟢 Completado | Listo para re-evaluación post-remediación |

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
