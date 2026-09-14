# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-14
Estado general: FASE 4C (Activación Visual, Sistema de Movimiento y Pulido Final)
```

---

## 1. Sprint Activo: SPRINT-4C-001 (Activación Bloque A y Pulidos Gate 5) - EN EJECUCIÓN

**Meta del Sprint:**
1. Resolver los 3 micro-ajustes detectados en la auditoría empírica Gate 5 (contraste del botón dinámico de Shopify, tap target del logo en móvil, aspect ratio de la galería en desktop, más higiene de `.gitignore`).
2. Implementar el **Bloque A de Activación Total** propuesto en `CLAUDE-PLAN-4C-001` (8 secciones en `templates/index.json`, defaults canónicos para 10 settings de `url`, presets poblados para `hero-editorial` y `newsletter`, fallbacks SVG y defaults en `settings_data.json`).

**Directiva vinculante:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-4C-001-activacion-y-pulido.md`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Generación de imágenes demo según guía de Claude (`CLAUDE-PLAN-4C-001`) | 🟢 En marcha | 24 imágenes de producto y 11 de escena en `demo-assets/images/` |
| **Claude (Opus 5)** | Implementador Principal | Implementación de Sprint 4C-001 (`CLAUDE-DIRECTIVE-4C-001`) | 🟡 En ejecución | Código en árbol de trabajo, 8 compuertas en verde e informe en outbox-claude |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Supervisión de Sprint 4C-001 y preparación de Sprint 4C-002 (Movimiento) | 🟢 Activo | Revisión de diffs, re-verificación empírica y actualización de ledger |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Standby / Auditoría de activación visual y merchandising | 🟢 Listo | Segunda opinión UX sobre el homepage activo y presets |

---

## 3. Resultados Empíricos de Compuerta 5 (Medición en Tienda Real)

*Medición certificada con Google Lighthouse 13.4.1 y Playwright Chromium sobre proxy dev en tienda real:*

| Plantilla | Performance Móvil (Req >= 60) | Accesibilidad (Req >= 90) | CLS Móvil (Req < 0.1) | TBT | Estado |
|---|:---:|:---:|:---:|:---:|:---:|
| **Home (`/`)** | **83 / 100** | **100 / 100** | **0.001** | 140 ms | **CUMPLIDO** |
| **Colección (`/collections/all`)** | **77 / 100** | **100 / 100** | **0.003** | 70 ms | **CUMPLIDO** |
| **PDP (`/products/...`)** | **87 / 100** | **97 / 100** (100 con parche de botón) | **0.001** | 180 ms | **CUMPLIDO** |

*Validaciones Estructurales y WCAG 2.2 AA con axe-core 4.10.2:*
- **Jerarquía de Encabezados (h1 único):** 100% PASS en Home, Colección, PDP, Búsqueda y 404. Cero saltos de nivel.
- **Desbordamiento Horizontal en Móvil (390px):** 100% PASS (0px de overflow).
- **Interactividad y Foco por Teclado (`CartDrawer`):** 100% PASS (apertura, focus trap, Escape, restauración de foco).

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 53 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **31** | 58.5% | Verificados con código y evidencia empírica / estática cerrada. |
| `código completo` | **18** | 34.0% | Código escrito; evidencia empírica recolectada lista para consolidación en ledger. |
| `no verificado` | **4** | 7.5% | 2 filas de Lighthouse ya medidas empíricamente (listas para transición a `cumplido`); 2 filas comerciales en curso (URLs de soporte y catálogo demo). |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **53** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias Críticas

1. **[P0 - Comercial] URLs de Documentación y Soporte:**
   - Resuelto por Johandry (DP-001): se publicarán en la tienda Shopify a partir de `docs/merchant/docs.html` y `support.html`. Una vez activas, se enlazarán en `settings_schema.json`.
2. **[P1 - Técnico] Violación de Compuerta 3 en `assets/theme.js`:**
   - **RESUELTO Y CERRADO:** 0 ocurrencias de `Intl.NumberFormat`, `formatMoney` centralizado con fallback seguro a la moneda de la tienda.
