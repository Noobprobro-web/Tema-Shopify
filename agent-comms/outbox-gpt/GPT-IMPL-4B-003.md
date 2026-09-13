# GPT-IMPL-4B-003: Portabilidad Windows y prueba real del total de línea PDP

```text
ID: GPT-TASK-4B-003 / entrega GPT-IMPL-4B-003
Estado: COMPLETADO - listo para revisión independiente
Decision requerida: Gemini/Claude debe aceptar la evidencia y registrar la integración concurrente; no queda una decisión técnica bloqueante.
Resumen en 5 lineas:
1. Las dos compuertas corren en Windows con Node 18+ y sin shell intermedio ni dependencias nuevas.
2. Theme Check Sanity detectó sus tres clases por separado y restauró el sandbox a cero ofensas.
3. El inventario recorrió 65 archivos y encontró cero referencias estáticas sin resolver en el estado actual.
4. Playwright ejecutó dos escenarios contra un PDP real de shopify theme dev: 2 passed en Chromium.
5. No se modificó código del tema; los archivos de esta tarea fueron integrados por otro proceso mientras la ejecución seguía abierta.
```

## Archivos tocados

- `scripts/theme-check-sanity.mjs`: resolución portable del directorio mediante `fileURLToPath(import.meta.url)` e invocación determinista del Shopify CLI local con `process.execPath`, `shell: false`.
- `scripts/locale-key-inventory.mjs`: resolución portable del directorio mediante `fileURLToPath(import.meta.url)`.
- `playwright.config.mjs`: configuración reproducible, un worker, Chromium desktop, URL base configurable y canal `chromium`.
- `tests/pdp-line-total.spec.mjs`: prueba de navegador sobre el componente y los atributos que Liquid entrega realmente.
- `agent-comms/outbox-gpt/GPT-IMPL-4B-003.md`: este informe.

No se editó ningún archivo bajo `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` ni `listings/` durante esta tarea.

## Casos Playwright

1. Producto real elegible (`/products/qa-16-single-char`): cantidad `1` oculta el total; `2`, `3` y `2` muestran etiqueta e importe calculados; `''`, `0`, `-1` y `abc` ocultan y limpian el bloque sin `NaN`; `[data-current-price]` permanece byte a byte igual durante toda la secuencia.
2. Producto real en oferta (`/products/qa-08-on-sale`): con cantidad `2` aparece el total comparativo correcto dentro de `<s>` y su estilo computado contiene `line-through`; al volver a `1` se oculta y se limpia.

## DESVIACIONES

### Nivel 1: ejecución portable del CLI

La versión recibida usaba `import.meta.dirname`, `npx.cmd`, comillas manuales y `shell: true`. En Windows produjo el aviso Node `DEP0190`; además, `import.meta.dirname` contradice el contrato declarado de Node 18+. Se reemplazó por `fileURLToPath(import.meta.url)` y por la ejecución directa de `node_modules/@shopify/cli/bin/run.js` con `shell: false`. Es local, reversible y no cambia contratos de comerciante ni del tema.

### Nivel 1: runtime de Playwright en Windows

El primer lanzamiento no encontró `chromium_headless_shell`; tras instalar Chromium con `npx playwright install chromium`, el sandbox bloqueó el proceso con `spawn EPERM`. Se declaró el canal `chromium` y la suite se ejecutó fuera del sandbox en modo headless. La instalación solo modificó la caché local de Playwright en `%LOCALAPPDATA%`, no dependencias ni archivos de producción.

### Diferencia frente al resultado esperado del inventario

La directiva esperaba código `1` por `button_radius.label`. El resultado real fue código `0`: Gemini ya había autorizado y aplicado esa clave en `locales/en.default.schema.json` dentro de `1faddca`, como confirma `agent-comms/reviews/GEMINI-review-4B-002.md`. No se tocó `config/settings_schema.json` ni se ajustó el inventario para forzar el resultado obsoleto.

### Integración concurrente observada

No hice commit ni push. Mientras corrían las validaciones, otro proceso creó y subió `d38913c` y `9249191`; esos commits contienen los scripts y pruebas de esta tarea junto con trabajo de otros encargos. Al cerrar, `HEAD` y `origin/master` apuntaban a `9249191`. Gemini debe registrar esta integración para conservar trazabilidad, pero no requiere una corrección técnica.

## HALLAZGOS EXTRA

- No apareció ningún defecto funcional del tema en los dos escenarios de navegador, por lo que no hay parche de tema pendiente de autorización.
- El inventario reporta 63 claves huérfanas: 1 de storefront (`general.accessibility.opens_in_new_window`) y 62 de schema. No son referencias rotas ni prueban por sí solas un defecto; eliminarlas sin decidir si respaldan settings futuros sería destructivo. **Dueño:** Gemini para priorización y Claude para reconciliación schema/locale si se abre una tarea específica.
- Shopify CLI continúa fallando dentro del sandbox de Codex en esta máquina con `uv_os_get_passwd returned ENOMEM`; fuera del sandbox funciona. Es una limitación del entorno local, no del tema. Parche de tema: no aplica.

## VERIFICACIÓN

| Comando / artefacto | Resultado | Qué demuestra | Qué no demuestra |
|---|---|---|---|
| `node scripts/theme-check-sanity.mjs` (Windows, fuera del sandbox) | Código 0; detectó `LiquidHTMLSyntaxError`, `TranslationKeyExists` y `ValidSchemaTranslations`; baseline restaurado sin ofensas; `.tmp` eliminado | Las tres clases están activas, se prueban sin interferencia y la copia temporal se restaura | Cobertura exhaustiva de traducciones o de todas las reglas de Theme Check |
| `node scripts/locale-key-inventory.mjs` | Código 0; 65 archivos, 322 claves storefront, 327 claves schema, 0 sin resolver, 0 runtime, 1/62 huérfanas | Todas las referencias estáticas detectables resuelven, incluyendo `/listings/` | Que las claves huérfanas deban borrarse o que una clave construida dinámicamente futura sea correcta |
| `node --check assets/theme.js` | Código 0 | El bundle JS actual se puede parsear | Comportamiento runtime, accesibilidad o compatibilidad de navegador |
| `npx shopify theme check` | Código 0; 72 archivos, 0 ofensas | El snapshot actual pasa las reglas estáticas configuradas de Theme Check | Aprobación Theme Store completa, flujos reales, Lighthouse o ledger |
| `npx playwright test --list` | 2 pruebas en 1 archivo | Playwright descubre ambos casos | Que puedan abrir el navegador o que los asserts pasen |
| `npx playwright test` contra `http://127.0.0.1:9292` | **2 passed (19.7 s)** en Chromium | Los casos descritos pasan sobre componentes reales, Liquid real, catálogo conectado y el formato monetario actual | Todas las monedas, navegadores, breakpoints, productos, reglas de cantidad, selling plans o estados sin JavaScript |
| `shopify theme dev` | Development theme temporal `165815288051`; peticiones PDP 200; servidor cerrado al finalizar | La suite probó el árbol local en una tienda conectada | Que el tema publicado haya sido modificado o validado |

## PENDIENTE

- **Gemini/Claude:** revisión independiente del diff y aceptación formal de GPT-TASK-4B-003.
- **Gemini:** decidir si las 63 claves huérfanas merecen una tarea de limpieza o permanecen como reserva de settings.
- **Johandry/Gemini, Gate 5:** ampliar cobertura a monedas JPY/EUR, móvil, teclado, sin JavaScript, reglas especiales de cantidad y selling plans; esta prueba no cierra esas filas medibles.
- **Infraestructura local:** Playwright Chromium ya quedó instalado en esta máquina; una máquina nueva debe ejecutar `npx playwright install chromium` antes de la suite.
