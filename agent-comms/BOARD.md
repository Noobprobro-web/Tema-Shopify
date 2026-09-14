# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-14
Estado general: FASE 4B (Endurecimiento, Gate 5 y Preparación de Submission)
```

---

## 1. Sprint Activo: SPRINT-4B-007 (Remediación Post-Reverificación Adversarial) - COMPLETADO

**Meta del Sprint:** Corregir la condición de carrera en `syncCart` (R01, P1) y los tres pulidos (R02: exclusión universal de diálogos; R03: captura de errores de transporte fetch; R04: preservación de scroll lock en desmontaje) identificados por GPT en `GPT-AUDIT-4B-007`.
**Resultado:** Aceptado formalmente en `GEMINI-review-CLAUDE-4B-007.md`. 8 compuertas en verde, 0 ofensas en Theme Check (87 archivos).

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Creación de páginas de docs y soporte en tienda Shopify (`docs/merchant/*.html`) | 🟢 En progreso | Páginas creadas en Shopify y URLs enlazadas en `settings_schema.json` |
| **Claude (Opus 5)** | Implementador Principal | Implementación de R01 a R04 (`CLAUDE-TASK-4B-007`) | 🟢 Aceptado | `CLAUDE-IMPL-4B-007` aprobado sin regresiones |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Preparación y ejecución de Gate 5 (tienda real) | 🟡 En preparación | Medición Lighthouse, accesibilidad y certificación final |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Re-verificación completada (`GPT-AUDIT-4B-007`) | 🟢 Entregado | Reporte con 4 parches propuestos resueltos al 100% |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 53 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **31** | 58.5% | Verificados con código y evidencia empírica / estática cerrada. |
| `código completo` | **18** | 34.0% | Código escrito y validado estáticamente; pendientes de medición en tienda real (Gate 5). |
| `no verificado` | **4** | 7.5% | Pendientes de prueba de tienda (Lighthouse, axe), URLs de soporte o registros de marca. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **53** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

*Filas clave que aguardan Gate 5 (Medición en Tienda Real):*
- Lighthouse Mobile Performance (>= 60) y Accessibility (>= 90).
- Contraste de texto (4.5:1) e interfaz (3:1) en los 15 esquemas de color.
- CLS < 0.1 en PDP, Collection y Home con imágenes reales.
- Jerarquía de encabezados (`h1` único por plantilla, sin saltos de nivel auditado con axe).
- Áreas táctiles (>= 44x44px).
- Navegación por teclado completa (focus ring, focus trap en drawer y modal).
- Live regions (`aria-live`) en filtros facetados y paginación.
- Búsqueda predictiva y Complete the Look formateando con `shop.money_format`.

---

## 4. Bloqueadores y Dependencias Críticas

1. **[P0 - Comercial] URLs de Documentación y Soporte:**
   - Resuelto por Johandry (DP-001): se publicarán en la tienda Shopify a partir de `docs/merchant/docs.html` y `support.html`. Una vez activas, se enlazarán en `settings_schema.json`.
2. **[P1 - Técnico] Violación de Compuerta 3 en `assets/theme.js`:**
   - **RESUELTO Y CERRADO:** 0 ocurrencias de `Intl.NumberFormat`, `formatMoney` centralizado con fallback seguro a la moneda de la tienda. Aceptado en `GEMINI-review-CLAUDE-4B-003.md`.

---

## 5. Decisiones Pendientes

Ver cola viva en [`docs/decisions-pending.md`](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/docs/decisions-pending.md).
