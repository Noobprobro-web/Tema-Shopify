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

---

## Pendiente: corregir gate5 (ReferenceError)

- **Fichero:** `scripts/gate5-complete-verification.mjs`, línea ~203: `const anonContext = await browser.newContext();` dentro de `runChecksInContext`, que ya no recibe `browser`. Falla al arrancar (`ReferenceError: browser is not defined`).
- **Arreglo sugerido:** usar `context.browser().newContext()` o pasar `browser` como parámetro.
- **Después:** revisión Opus de contexto limpio (con linter `no-undef` si está disponible) y repetir la ejecución en tienda con las reglas de D28 y de la decisión de Johandry.
- **Estado:** PENDIENTE, asignado a GPT o Claude Code. Cuando se retome, indicar en `CLAUDE-CLOUD-STATUS.md`.
- **Referencia:** `CLAUDE-STORE-RUN-002.md` (commit 91fc133).
