# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-21
Estado general: SPRINT MULTI-LANG-001 CONCLUIDO (Soporte Multi-Idioma Español, Calibración de Presets WCAG AA y Escala Tipográfica)
```

---

## 1. Sprint Activo: SPRINT MULTI-LANG-001 (Multi-Idioma Español y Calibración de Presets) - COMPLETADO Y APROBADO

**Meta del Sprint:** Entregar paridad total en español (`locales/es.json` con 374 claves), auditar accesibilidad en los 15 esquemas de color de los 3 presets (`Sartorial`, `Edition`, `Archive`), calibrar contrastes WCAG AA (texto secundario al 78% y Archive scheme-4 a `#6E482F`), y armonizar la escala tipográfica (`--font-heading-scale`) en títulos de exhibición.
**Estado:** 100% implementado y validado (`CLAUDE-REPORT-MULTI-LANG-001.md`, `GEMINI-review-CLAUDE-MULTI-LANG-001.md`). 0 ofensas en Theme Check (108 archivos), `locale-parity.mjs` en verde (374/374 claves), 8/8 compuertas estáticas aprobadas.

*Siguiente Paso:* Commit y despliegue a la tienda en vivo (`Couture` #165809488115), activación del español en Admin por Johandry, y arranque del sprint de funcionalidades de lujo (Zoom de tejido, Quick Buy con tallas y Swatches).

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Publicar Español en Admin (*Settings > Languages*) y previsualizar Presets | 🟢 Activo | Pruebas de storefront en vivo |
| **Claude (Fable 5.1 Max / Opus 5)** | Implementador Principal | `es.json` y auditoría de presets completados con honores | 🟢 Listo | En espera de directiva técnica para Sprint de Lujo (Zoom, Quick Buy, Swatches) |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Calibración de presets, revisión formal y despliegue a Shopify | 🟢 Activo | Coordinación de directivas técnicas y roadmap |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | En espera de reanudación de cuota para segunda opinión sobre presets y roadmap | 🟡 En espera | Auditoría de catálogo en español y roadmap |

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
- **Modo Reducción de Movimiento:** Verificado con `@media (prefers-reduced-motion: reduce)` activo; el tema desactiva 100% de transiciones e ignorar reveal.

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

1. **[P0 - Comercial] URLs de Documentación y Soporte:**
   - Resuelto por Johandry (DP-001): se publicarán en la tienda Shopify a partir de `docs/merchant/docs.html` y `support.html`. Una vez activas, se enlazarán en `settings_schema.json`.
2. **[P1 - Técnico] Violación de Compuerta 3 en `assets/theme.js`:**
   - **RESUELTO Y CERRADO:** 0 ocurrencias de `Intl.NumberFormat`, `formatMoney` centralizado con fallback seguro a la moneda de la tienda.
