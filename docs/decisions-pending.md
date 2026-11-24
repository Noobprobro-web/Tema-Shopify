# decisions-pending.md: Cola de Decisiones Pendientes

```text
Ruta estable: docs/decisions-pending.md
Propósito: Registro vivo de decisiones abiertas técnicas, de producto o de negocio.
Regla: Toda decisión abierta debe tener ID, pregunta clara, decisor, bloqueo asociado y fecha.
Al resolverse una decisión, se traslada formalmente a docs/decisions.md.
```

---

## Cola Abierta

| ID | Pregunta / Decisión Requerida | Decisor | Elementos Bloqueados | Impacto / Riesgo | Fecha Apertura |
|---|---|---|---|---|---|
| **DP-001** | **Dominio y Hosting de Docs y Soporte:** ¿Alojamiento en `ruizdigital.com` o en Shopify Pages? | Johandry | **RESUELTO:** Johandry decide alojar directamente en páginas de la tienda Shopify (`docs/merchant/*.html`). Pendiente publicar y enlazar en `settings_schema.json`. | Bajo (controlado) | 2026-09-13 (Cerrada 2026-09-14). Sustituida por D36 (GitHub Pages), 2026-11-14 |
| **DP-002** | **Estrategia de Ejecución de Gate 5 (Tienda Real):** ¿Ejecutar la suite Playwright/Lighthouse directamente contra la tienda preview `https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115` o mediante túnel local con `shopify theme dev`? | Gemini / Johandry | Cierre de las 18 filas en `código completo` | **P1 Técnico.** Obsoleta en su objeto: la tienda vigente es `sartorial-theme-kvkzl39t` (D38). El preview remoto ya está sincronizado con el zip 1.0.0 y no requiere túneles abiertos en localhost. | 2026-09-14 |
| **DP-003** | **Búsqueda Formal de Marca "Sartorial" y "Ruiz Digital":** Verificación manual en registros de marcas (USPTO / WIPO / TMview) para descartar conflictos de propiedad intelectual con marcas de moda de lujo o agencias registradas. | Johandry | Lanzamiento comercial internacional | **P2 Legal.** La búsqueda informal en Theme Store está limpia; falta verificación formal de registro de marca. | 2026-09-13 |
| **DP-005** | **R-D/G2 Lighthouse:** confirmar repeticiones, viewports y método de aceptación para Home, colección y producto en escritorio/móvil. Un rendimiento móvil <70 ya queda acordado como riesgo que debe informarse y motivar propuesta de mejoras dentro del plan. | Johandry | **Método acordado 2026-11-14 (D31), medición pendiente:** Claude mide Lighthouse móvil en el contenedor (3 repeticiones, mediana, por preset y por página: home, colección y producto), como medición aproximada; el umbral de envío es la media móvil ≥60. Aún no hay resultados nuevos. Aceptación de R-D, repetibilidad de la medición y activación de C-03 según diagnóstico y umbral acordado. | Evita comparar resultados con metodologías no aprobadas; no convierte un score aislado en certificación. | 2026-11-06 |
| **DP-006** | **C-02 tienda limpia:** crear/autorizar una tienda de desarrollo limpia y decidir el resultado canónico por preset. | Johandry | Instalación y comparación de Sartorial, Imprint y Archive en C-02. | Las previews existentes no sustituyen esta tienda limpia. | 2026-11-06 |
| **DP-007** | **R3 · Quantity rules y volume pricing (R3-FO-05, residual G-TSR-01):** ¿se muestran las reglas de cantidad y se implementan los precios por volumen? **Base de trabajo R3 ("Ok" de Johandry, pendiente de confirmación explícita):** mostrar mínimo, incremento y máximo en la ficha y en `featured-product`; quick add con mínimo > 1 lleva a la ficha (R3-SO-04); sin tabla de `quantity_price_breaks`. | Johandry | Fase PDP de Claude (`CLAUDE-R3-ANALISIS-001` §7) | El texto de requisitos de shopify.dev consultado no las lista; no hay tienda B2B para probar price breaks. | 2026-11-24 |
| **DP-008** | **R3 · Procedencia y especificaciones por producto (R3-FB-11):** ¿leer metafields o aceptar residual? **Base de trabajo R3:** residual 1.0 con `info` aclaratorio; metafields en 1.1. | Johandry | `info` en `locales/en.default.schema.json` (Claude) | Las fichas de los 3 presets son equivalentes; riesgo de "presets poco diferenciados". | 2026-11-24 |
| **DP-009** | **R3 · Placeholders del bento en la tienda publicada (R3-SO-02 / R3-FB-39):** **Base de trabajo R3:** solo en el editor (`request.design_mode`), como `curated-showcase`. | Johandry | `sections/bento-discovery.liquid` (Claude) | Imprint trae dos tarjetas de producto vacías. | 2026-11-24 |
| **DP-010** | **R3 · Autorización Nivel 2 en bloque (como D26):** cambiar los defaults de schema de R3-FO-01, R3-FB-09 (`link`/`heading`), R3-FO-03, R3-FO-08 y la semántica de umbrales vacíos de R3-FB-10. **Base de trabajo R3:** autorizado solo para la lista cerrada de `CLAUDE-R3-ANALISIS-001` §3 y `GPT-TASK-R3-001` §5. | Johandry / Gemini | Ramas `claude/clever-gauss-ddhyr2` y `gpt/r3-copy-plantillas` | RULES §3.5: Nivel 2 sin autorización está prohibido. | 2026-11-24 |
| **DP-011** | **R3 · Copy de presets y tienda (R3-FB-12, R3-SO-01, R3-SO-09, R3-FO-03, R3-FO-08, R3-FB-59, promo del mega menú):** **Base de trabajo R3:** se aplica en las ramas y Johandry aprueba el texto final en bloque (D35). | Johandry | Fusión de los PR de R3 | Sin aprobación, el copy queda como propuesta. | 2026-11-24 |
| **DP-012** | **R3 · Combined Listings en la ficha (R3-AS-08):** **Base de trabajo R3:** aplazado y documentado. | Johandry | — | Solo tiendas Plus; no aparece en la lista de requisitos consultada. | 2026-11-24 |
| **DP-013** | **R3 · Sin JS con reglas o planes distintos por variante (R3-AS-04):** **Base de trabajo R3:** se implementa el modo `option_links` (navegación) cuando difieren. | Johandry | Fase PDP de Claude | Shopify ya lo rechaza en servidor; el arreglo evita la página de error. | 2026-11-24 |
| **DP-014** | **R3 · CLS y rendimiento estimados (R3-FB-18, R3-FB-38, R3-FB-48, G-PERF-06):** **Base de trabajo R3:** aplazados hasta la medición de DP-005 (D31). | Johandry | DP-005 | Cifras estimadas, no medidas. | 2026-11-24 |
| **DP-015** | **R3 · Residuales G-xxx de la auditoría:** **Base de trabajo R3:** aceptados con dueño (G-I18N-01, G-SEC-01, G-SEC-03, G-I18N-05, G-I18N-06, G-MANT-01, G-PERF-06, G-UX-01, G-TSR-01 vía DP-007); se arreglan G-SEC-04 (Vimeo `dnt=1`) y G-I18N-04 (etiqueta "Atelier"). | Johandry / Gemini | — | Ninguno figuraba como aceptado en `decisions.md`. | 2026-11-24 |
| **DP-016** | **R3 · Severidad de R3-AS-01 (pickup):** **Base de trabajo R3:** medio (no alto); se arregla en la fase A1 de Claude. | Gemini | — | Carrera estrecha, pero deja `inert` y el focus trap colgados. | 2026-11-24 |

---

## Pendiente: corregir gate5 (ReferenceError)

- **Fichero:** `scripts/gate5-complete-verification.mjs`, línea ~203: `const anonContext = await browser.newContext();` dentro de `runChecksInContext`, que ya no recibe `browser`. Falla al arrancar (`ReferenceError: browser is not defined`).
- **Arreglo sugerido:** usar `context.browser().newContext()` o pasar `browser` como parámetro.
- **Después:** revisión Opus de contexto limpio (con linter `no-undef` si está disponible) y repetir la ejecución en tienda con las reglas de D28 y de la decisión de Johandry.
- **Estado:** PENDIENTE, asignado a GPT o Claude Code. Cuando se retome, indicar en `CLAUDE-CLOUD-STATUS.md`.
- **Referencia:** `CLAUDE-STORE-RUN-002.md` (commit 91fc133).
