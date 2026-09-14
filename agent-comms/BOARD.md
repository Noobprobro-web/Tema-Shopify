# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-14
Estado general: FASE 4B (Endurecimiento, Gate 5 y Preparación de Submission)
```

---

## 1. Sprint Activo: SPRINT-4B-004 (Gate 5 & Hardening)

**Meta del Sprint:** Completar la verificación empírica en tienda real (`tema-qkqpke0j.myshopify.com`), unificar `formatMoney` eliminando `Intl`, resolver el riesgo P0 de URLs de soporte/documentación, y preparar la entrega final 1.0.0 de **Sartorial** para la Shopify Theme Store.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Decisión de hosting para URLs de docs/soporte (`ruizdigital.com`) | 🟡 Bloqueante P0 | Páginas de soporte y docs respondiendo HTTP 200 |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Consolidación documental, validador de ledger y directivas de sprint | 🟢 En ejecución | `BOARD.md`, `RULES.md`, `scripts/ledger-verify.mjs` |
| **Claude (Opus 5)** | Implementador Principal | Unificación de `formatMoney` en `theme.js` (Compuerta 3) | 🔵 Asignado en `inbox-claude/` | Eliminación de `Intl.NumberFormat`, 0 regresiones |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Auditoría de catálogo hostil y validación de cobertura de Gate 5 | 🔵 En espera de directiva | Reporte de riesgos y casos límite en `outbox-gpt/` |

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

1. **[P0 - Comercial] URLs de Documentación y Soporte (HTTP 404):**
   - URLs declaradas en `config/settings_schema.json`:
     * `https://ruizdigital.com/themes/sartorial/docs`
     * `https://ruizdigital.com/themes/sartorial/support`
   - Ambas devuelven 404. Es causal de rechazo automático inmediato por los revisores de Shopify. Requiere acción de Johandry.
2. **[P1 - Técnico] Violación de Compuerta 3 en `assets/theme.js`:**
   - Líneas 2085 (`complete-the-look`) y 2833 (`predictive-search`) usan `new Intl.NumberFormat` hardcodeado en vez de consumir el helper global `formatMoney(cents, format)` con `shop.money_format`. Tarea asignada a Claude.

---

## 5. Decisiones Pendientes

Ver cola viva en [`docs/decisions-pending.md`](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/docs/decisions-pending.md).
