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
| **DP-024** | **Tipo de la tienda `sartorial-theme-kvkzl39t.myshopify.com`:** confirmar en el Dev Dashboard si es una tienda de desarrollo o client transfer. | Johandry | Si es de desarrollo, solo sirve como tienda de QA (D67) y los scripts de catálogo T1-T3 se ejecutan después en tres tiendas client transfer nuevas; si es client transfer, puede ser además la tienda demo de un preset. | Shopify no admite una tienda de desarrollo como tienda demo del Theme Store. El encargo GPT-TASK-R4-001 funciona en los dos casos. | 2026-11-25 |
| **DP-025** | **Fuente y derechos de las imágenes de tema:** elegir de dónde salen las imágenes de hero, lookbook, manifesto, mega menú y portadas del blog de cada preset (imágenes propias, Shopify Burst o las generadas por GPT según D37) y acreditar sus derechos. | Johandry | Paquete P1 (overlays) y cierre de M-07; la demo no puede enviarse con placeholders. | Ruta crítica del envío (D73). | 2026-11-25 |
| **DP-026** | **Recorte silencioso al tope de stock en carrito y cajón:** con la línea ya en el tope de stock (8), escribir 20 no envía petición ni muestra aviso. **Causa (anterior a R6, no es regresión):** Liquid emite `max` por stock (`sections/main-cart-items.liquid:147-148,176`; `sections/cart-drawer.liquid:311-312,342`), `snapQuantityField` recorta (`assets/theme.js:7188-7201`) y `readCartPageUpdates` no encola nada (`:7293-7296`); en el cajón `handleDrawerChange` sale en `:3443-3445`. **Propuesta:** no emitir `max` nativo cuando el tope viene solo del stock (usar `data-quantity-stock-max` y mantener «+» deshabilitado); `readQuantityRules` devuelve `stockMax` solo para los botones; `snapQuantityField` no recorta por stock en `[data-cart-quantity]` (sí por `quantity_rule` y rejilla). Así se envía la petición, Shopify responde 422 con su texto localizado y R6 lo muestra en la línea (en el cajón, con `showError`). Pruebas en `tests/r6-cart-line-error.spec.mjs` con un tope de stock simulado. Tamaño S/M. **Alternativa descartada:** texto propio en cliente «Maximum 8» (exige aprobación de copy). | Johandry | Si se aprueba, lo implementa GPT en la ronda R7. **Estado: pendiente de autorización del usuario** (toca el cajón, cambia el alcance). | Bajo-moderado. WCAG 3.3.1 débil: un revisor que pida más unidades que el stock ve el recorte sin explicación. | 2026-11-26 |

DP-007 a DP-018 se resolvieron el 2026-11-24 y pasaron a `docs/decisions.md` como D44 a D55 (DP-011 en D44). DP-019 a DP-023 se resolvieron el mismo día y pasaron a D56 a D60. DP-006 se resolvió el 2026-11-25 y pasó a D67.

---

## Pendiente: corregir gate5 (ReferenceError)

- **Fichero:** `scripts/gate5-complete-verification.mjs`, línea ~203: `const anonContext = await browser.newContext();` dentro de `runChecksInContext`, que ya no recibe `browser`. Falla al arrancar (`ReferenceError: browser is not defined`).
- **Arreglo sugerido:** usar `context.browser().newContext()` o pasar `browser` como parámetro.
- **Después:** revisión Opus de contexto limpio (con linter `no-undef` si está disponible) y repetir la ejecución en tienda con las reglas de D28 y de la decisión de Johandry.
- **Estado:** PENDIENTE, asignado a GPT o Claude Code. Cuando se retome, indicar en `CLAUDE-CLOUD-STATUS.md`.
- **Referencia:** `CLAUDE-STORE-RUN-002.md` (commit 91fc133).
