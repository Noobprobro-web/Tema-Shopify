ID: GPT-018-PREPARATION
Estado: Completado (contexto, restricciones y lectura; no se auditaron las tiendas).
Decisión requerida: Ninguna para esta fase. El usuario autorizó expresamente únicamente los pedidos de prueba Bogus solicitados. Antes de ejecutarlos, aislar cada tienda/sesión y comprobar una sola orden de prueba por tienda; cualquier otra mutación de datos sigue prohibida.
Resumen en 5 líneas:
1. Repo Git limpio en `## HEAD (no branch)`; `git status --short --branch` no reporta cambios. Git emitió advertencias de permiso leyendo `C:\Users\Johan\.config\git\ignore`.
2. El tablero reporta paridad/código en verde, pero mantiene B-01 (docs/soporte públicos), B-04 (fotos Edition), M-01/R4 (colección/políticas) y transacciones Bogus pendientes; los hallazgos GPT-017 siguen describiendo bloqueos comerciales.
3. Las tiendas son estado compartido, máximo un navegador por tienda; usar helper de AUDIT-FINAL-002 con pacing/unlock y nunca reintentar ráfagas.
4. No se encontró `CLAUDE-REPORT-LEAD-001.md`, `GPT-REPORT-016` ni `GPT-REPORT-017`; sí existe `GPT-REPORT-014`. Se declara la falta de contexto, no se infiere su contenido.
5. Carrito/checkout puede inspeccionarse hasta la última acción. No pulsar “Pay now”/finalizar sin autorización explícita, pues crea órdenes.
Archivos tocados: `agent-comms/outbox-gpt/harness-GPT-018/context-brief.md`.
Desviaciones (Nivel 1 o Nivel 2): No se abrió navegador ni tienda, no se editaron archivos del tema, BOARD o datos de tienda.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): `git status --short --branch` → `## HEAD (no branch)`; demuestra estado local limpio, no identifica la rama remota. `Get-ChildItem agent-comms/outbox-claude -File | Select-Object -ExpandProperty Name` y equivalente outbox-gpt → no se halló el informe Claude-LEAD ni GPT-REPORT-016/017; sí están los GPT-AUDIT solicitados. No demuestra que estén en otro sitio.
Lista de afirmaciones falsables numeradas:
1. BOARD.md líneas 14–20 lista B-01, B-04, M-01/R4 y pagos Bogus pendientes.
2. GPT-AUDIT-017-post-remediation-commercial-verdict.md líneas 73–83 registra 404 de Edition, discrepancias de fotos/variantes y Archive qty/procedencia/geo.
3. RULES.md líneas 29–37 contiene la cabecera fija aplicada aquí.

# Brief de contexto para GPT-018 (solo lectura preparatoria)

## Estado y autoridad
- Proyecto `Tema Shopify`; el AGENTS.md duplicado enviado por Johandry da autoridad comercial/alcance al usuario. El documento del repo reconoce a Claude como líder técnico temporal por `CLAUDE-HANDOFF-LEAD-001`; el BOARD marca a Gemini escritor único del BOARD y arquitecto consultor. Esta auditoría reporta, no modifica alcance ni decide cambios de producto.
- Regla del usuario para la auditoría: delegar roles, un agente por rol, en paralelo cuando sean independientes; especificar modelo (Sol/Astra para razonamiento complejo, Sol implementación, Luna tareas rápidas). Cada agente entrega informe y el coordinador lee informes concisos, no volcados completos.
- `git status --short --branch` devolvió literalmente `## HEAD (no branch)` y nada más. Advertencia de Git: no puede leer `C:\Users\Johan\.config\git\ignore` (Permission denied). No se observan cambios locales.
- Límites: NO editar `assets/`, `sections/`, `snippets/`, `layout/`, `templates/`, `listings/`, `config/`, `locales/`; no `theme push`, `git push`, escritura en datos de tienda ni BOARD. Solo salidas a `agent-comms/outbox-gpt/`, `demo-assets/`, `agent-comms/outbox-gpt/harness-GPT-018/`. Cualquier hallazgo de código se entrega como `.diff` en harness.
- Checkout Bogus: Johandry autorizó expresamente completar solo el pedido de prueba Bogus solicitado. Una orden por tienda; cualquier otro cambio de datos sigue prohibido. Mantener registro reproducible de artículo/importe y evidencia del pedido; no hacer pedidos adicionales.

## Archivos de contexto solicitados y disponibilidad
- Leídos: `AGENTS.md`; `agent-comms/RULES.md`; `agent-comms/BOARD.md` (solo lectura); `agent-comms/outbox-gpt/GPT-AUDIT-016-{atelier,edition,archive,crosscutting}-notes.md`; `GPT-AUDIT-017-{brand,merchandising,policy,transactions}-notes.md` y `GPT-AUDIT-017-post-remediation-commercial-verdict.md`; `GPT-REPORT-014-catalog-and-copy-matrix.md`; `agent-comms/outbox-claude/harness-AUDIT-FINAL-002/lib.mjs`.
- No hallados: `outbox-claude/CLAUDE-REPORT-LEAD-001.md`, `GPT-REPORT-016*`, `GPT-REPORT-017*`. Alternativa más cercana: `agent-comms/outbox-claude/CLAUDE-REPORT-AUDIT-FINAL-003.md` (verificación final previa; líneas 66, 84 y 218 señalan checkout disponible pero pago no enviado; no sustituye el informe lead ausente). También existe `agent-comms/inbox-claude/CLAUDE-HANDOFF-LEAD-001.md` como directiva de handoff, no informe de estado. La preparación usa el informe final como referencia provisional y declara que el lead report solicitado falta.
- Regla de formato de RULES §1.4 (líneas 29–37): las entregas comienzan con los diez campos literales que aparecen arriba. Evidencia falsable, breve; citar archivo:línea, salida, captura o URL, y distinguir observado, inferido y no verificado.

## Estado vivo reportado por BOARD (solo lectura)
- Encabezado, líneas 1–20: BOARD actualizado 2026-09-30; estado “código 100% en paridad y compuertas en verde”; B-01 P0 docs/soporte público, B-04 P0 imágenes Edition, M-01/R4 P1 colección y políticas, pedido Bogus por tienda.
- Líneas 73–82: informe A360/CR previo menciona URLs de docs/soporte rotas y tiendas Client Transfer pendientes de Johandry; otros ítems ya tratados. No presentar el texto del tablero como nueva verificación en vivo.
- Líneas 113–115: nombres de demos y tema/preset: Atelier / Sartorial (#188743188704), Edition (#188655599784), Archive (#191153275192).
- BOARD afirma en línea 19 “Registrar 1 pedido Bogus por tienda”. La orden crea datos persistentes; el usuario autorizó exclusivamente los pedidos Bogus solicitados, y no otras modificaciones de tienda.

## Hallazgos previos útiles (no asumir que siguen vigentes; revalidar en vivo)
- GPT-AUDIT-016 Edition: 13/13 productos disponibles y ninguna variante con imagen propia; variedad de fotos manifiestamente incongruente con SKU, monograma GG de tercero en Compact Crossbody; carrito/checkout previo bloqueado en revisión anterior. Evidencia en `GPT-AUDIT-016-edition-notes.md`, especialmente inicio, matriz 13 productos y líneas 5–9 de método (líneas exactas para nuevas citas, usar `rg -n`).
- GPT-AUDIT-016 Archive: 12 piezas y señales de reutilización de imágenes Atelier; checkout antes de pagar, sin transacción; no se acreditó procedencia individual. `GPT-AUDIT-016-archive-notes.md` líneas 7–15, 31–56.
- GPT-AUDIT-017 post-remediation, resumen en líneas 63–83: Atelier mejoró a 24 descripciones y 87 valores de talla; las 24 PDP aún una sola imagen y sin guía de talla visible; enlace lookbook apunta a colección. Edition: enlace `desk-and-study` responde 404, 10/13 imágenes no corresponden al objeto y variantes sin imagen específica. Archive: nombre de producto/foto de chaqueta 1990 incongruentes; cantidad 2 visible para inventario 1; home Kyoto/Paris vs Contact Milan pendiente revalidación.
- Mismo informe líneas 119–126: docs/soporte requieren acceso público sin password; texto autenticado no prueba acceso público; formulario mailto no se confirmó. Pagos de prueba aparecieron configurados pero ninguna orden final está verificada. Licencias de imagen, marcas/presets (DP-003), alta de Client Transfer, instalación limpia, accesibilidad manual, idiomas y prueba Bogus permanecen no verificados según la revisión previa.
- GPT-REPORT-014: inventario editorial propuesto no equivale a verdad de catálogo; líneas 110–116 explican límites (sin importación ni tienda escrita). No asumir que propuesta sea catálogo instalado.
- Usar `rg -n` sobre los informes para recuperar cita de línea exacta antes de pegar en informe final.

## Harness y sesiones de tienda
- Helper autorizado: `agent-comms/outbox-claude/harness-AUDIT-FINAL-002/lib.mjs`. Define `STORES` con URLs `https://sartorial-{atelier,edition,archive}.myshopify.com`, password default `1234` y `launch()`, `unlock(context, storeUrl)`, `pace(context)`, `attachConsole(page,sink)`.
- `unlock` llama a `pace`, usa cookies temporales fuera del repo, visita `/cart`, ingresa contraseña solo si se muestra pantalla `/password`, y escribe cookie fuera de Git. `pace` intercepta `page.goto`, aplica separación mínima entre navegaciones; si hay 429 de myshopify espera 60 segundos/reintenta hasta 8 veces. Unlock espera 30 segundos entre fallos. No crear un segundo navegador concurrente contra la misma tienda. Un 429 es limitación/rate-control, no defecto del producto.
- Antes de prueba de flujo confirmar que ningún otro rol navega esa tienda; coordinar turnos/tiendas para que cada tienda tenga como máximo una sesión de navegador activa. Guardar evidencias sin datos de cliente; no almacenar/exportar cookies.
- Navegador disponible vía Playwright, dependencia importada por helper. Alternativa UI de escritorio: MCP `mcp__cua_repl.js` (requiere leer primero skill computer-use y su documentación inicial); no iniciar un segundo cliente simultáneo de la misma tienda.

## Skills aplicables para agentes (anunciar uso y leer según tarea)
- Navegador/tienda: `C:/Users/Johan/.agents/skills/synced/8a0ea06f-7738-4144-9c1b-bbbddf95eee1_0356a7ae-f0a4-4919-b099-4b477581e993/computer-use/SKILL.md` si se usa UI/CUA; para Playwright, leer `C:/Users/Johan/.codex/skills/playwright-web-testing/SKILL.md` si el agente implementa/ejecuta una prueba de navegador. La herramienta no debe duplicar navegación por tienda.
- Generación de imágenes: `C:/Users/Johan/.codex/skills/.system/imagegen/SKILL.md` (alias r2/imagegen/SKILL.md); usar el generador de imagen disponible y anotar autoría/modelo, fecha, prompt/resumen, transformaciones, dimensiones y restricciones conocidas en PROVENANCE.md. Generar según solicitud: hero 16:9 ≥2752 px; colores Edition 4:5, 2000×2500. Verificar dimensiones y formato por herramienta local sin cambiar archivos del tema.
- Shopify/licencias/legal y Theme Store: usar documentación oficial primaria; skill de investigación solo si se usa su flujo de investigación (`C:/Users/Johan/.agents/skills/synced/8a0ea06f-7738-4144-9c1b-bbbddf95eee1_0356a7ae-f0a4-4919-b099-4b477581e993/deep-research/SKILL.md`). No declarar legalidad de marca/licencia sin evidencia primaria/contrato.
- Las rutas indicadas se basan en catálogo de skills entregado en contexto; los agentes deben comprobar que la ruta está accesible antes de invocar.

## Herramientas disponibles en esta sesión para coordinación
- `collaboration.spawn_agent` / `wait_agent` / `send_message` y `functions.exec` para delegación, recepción y filesystem permitido; al crear agente se debe elegir modelo explícito por instrucción del usuario y hacer fork con `fork_turns: "none"` para activar override.
- Herramienta `image_gen.imagegen` disponible para crear arte nuevo; llamada inicial requiere 120 s. No afirmar derechos más allá de los términos/política actuales, comprobarlos con fuentes primarias.
- `web__run` disponible para consulta de fuentes actuales (obligatorio para temas cambiantes y cuestiones legales/políticas); en temas técnicos Shopify, usar documentos oficiales primarios.
- Browser local por Playwright harness; `mcp__cua_repl.js` como alternativa UI, sujeto a skill computer-use.

