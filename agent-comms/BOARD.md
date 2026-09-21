# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5), GPT-5.6 Sol Max
Última actualización: 2026-09-20
Estado general: SPRINT 4E-003 CONCLUIDO (Escala Tipográfica Armonizada y Balance Estructural de Páginas Nativas)
```

---

## 1. Sprint Activo: CIERRE DE SPRINT 4E-003 (Armonización Tipográfica y Rebalanceo de Layout) - COMPLETADO

**Meta del Sprint:** Corregir escala tipográfica desproporcionada en títulos de páginas nativas (118px -> 64px a 1440px), asignar clases a encabezados de sección en soporte (76px -> 36px), rebalancear tarjetas de alcance horizontalmente y unificar borde derecho de lectura en documentación.
**Estado:** 100% implementado por Claude, auditado y aprobado formalmente por Gemini Flash 3.8 High (`GEMINI-review-CLAUDE-4E-003.md`). 75/75 pruebas Playwright en verde, 8/8 compuertas estáticas aprobadas, 0 ofensas en Theme Check (103 ficheros), cero `shopify://` en código.

*Siguiente Paso:* Commit y push en Git, despliegue a Shopify en vivo y cierre de dependencias de Theme Store.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Supervisión y creación de `/pages/documentation` y `/pages/support` (DP-001) | 🟢 Activo | Páginas publicadas en Shopify |
| **Claude (Fable 5.1 Max / Opus 5)** | Implementador Principal | Fase 4D completada con honores (4D-001, 4D-002, 4D-003) | 🟢 En espera | Tareas de pulido final o submission si se requieren |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Dictámenes de aceptación, ejecución de commit unificado y coordinación final | 🟢 Activo | Commit unificado + empaquetado final |
| **GPT-5.6 Sol Max** | Auditor Senior de Producto | Auditoría en navegador real y evaluación de Theme Store (`GPT-AUDIT-002`) | 🟢 Activo | Dictamen adversarial de navegación, pros/contras y riesgos Theme Store |

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
