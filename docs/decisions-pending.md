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
| **DP-001** | **Dominio y Hosting de Docs y Soporte:** ¿Alojamiento en `ruizdigital.com` o en Shopify Pages? | Johandry | **RESUELTO:** Johandry decide alojar directamente en páginas de la tienda Shopify (`docs/merchant/*.html`). Pendiente publicar y enlazar en `settings_schema.json`. | Bajo (controlado) | 2026-09-13 (Cerrada 2026-09-14) |
| **DP-002** | **Estrategia de Ejecución de Gate 5 (Tienda Real):** ¿Ejecutar la suite Playwright/Lighthouse directamente contra la tienda preview `https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115` o mediante túnel local con `shopify theme dev`? | Gemini / Johandry | Cierre de las 18 filas en `código completo` | **P1 Técnico.** El preview remoto ya está sincronizado con el zip 1.0.0 y no requiere túneles abiertos en localhost. | 2026-09-14 |
| **DP-003** | **Búsqueda Formal de Marca "Sartorial" y "Ruiz Digital":** Verificación manual en registros de marcas (USPTO / WIPO / TMview) para descartar conflictos de propiedad intelectual con marcas de moda de lujo o agencias registradas. | Johandry | Lanzamiento comercial internacional | **P2 Legal.** La búsqueda informal en Theme Store está limpia; falta verificación formal de registro de marca. | 2026-09-13 |
