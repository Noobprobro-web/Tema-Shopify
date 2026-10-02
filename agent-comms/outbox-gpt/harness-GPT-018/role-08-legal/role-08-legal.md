ID: GPT-018-ROLE-08
Estado: Investigación documental completada; candidatos pendientes de refutación cruzada y evidencia remota actual.
Decisión requerida: Johandry debe resolver DP-003 y el parecido Edition/Editions antes de fijar la ficha.
Resumen en 5 líneas:
1. GSAP permite uso comercial sin cargo; no encontré GSAP en el snapshot local inspeccionado.
2. Edition tiene un vecino nominal real: Editions de Pixel Union.
3. DP-003 sigue abierto: no equivale a infracción probada ni a autorización de marca.
4. La cesión contractual de imágenes IA no garantiza exclusividad ni elimina derechos de terceros.
5. Políticas y marcas visibles requieren evidencia de tienda actual; los informes de septiembre no se reciclan como prueba de hoy.
Archivos tocados: únicamente esta carpeta de evidencia.
Desviaciones (Nivel 1 o Nivel 2): ninguna; sin implementación.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): comandos y fuentes debajo. No inspección jurídica universal ni búsqueda formal completa.
Lista de afirmaciones falsables numeradas: L1–L5.

Fecha de revisión: 2026-10-01, America/Caracas. Snapshot: `60599ab199ec7214c4206a6db6fff0f8161289d0`.

## L1 — GSAP: descartar el supuesto bloqueo por ser tema de pago

[Licencia oficial GSAP](https://gsap.com/community/standard-license/) consultada: concede uso, reproducción, presentación e implementación para usos permitidos; FAQ confirma uso comercial sin cargo. Mantiene la prohibición de eliminar avisos y limita herramientas visuales de animación que compitan con Webflow. La FAQ menciona expresamente temas/plugins y no los prohíbe por categoría. Inferencia acotada: vender un tema no activa por sí solo una obligación de licencia pagada; esto no certifica cualquier editor visual ni sublicencia irrestricta.

Comando: `rg -n -i --max-count 6 'gsap|scrolltrigger|license' assets layout snippets package.json` → salida vacía, exit 1. Inventario `rg --files assets | rg -i 'gsap|scrolltrigger'` → vacío. Se conserva `gsap-search.txt` vacío, no una licencia inventada. No prueba ausencia en ZIP distinto, remote o binarios ajenos al alcance. No hay defecto de código demostrado ni .diff justificable.

Acción exacta de Claude si el snapshot definitivo incorpora GSAP: identificar versión/archivo, conservar cabecera original, guardar referencia y fecha de licencia, contrastar controles del editor con restricción de constructor visual. Si existen capacidades equiparables a un constructor de animación, obtener aclaración escrita de Webflow. No afirmar que hay que comprar Business Green ni retirar GSAP solamente por cobrar $380.

## L2 — P2 confirmado como riesgo de nombre, no rechazo automático: Edition / Editions

Clase: contenido de ficha y decisión de producto. Dueño: Johandry.

Evidencia local: `rg -n 'Sartorial|Edition|Archive' config/settings_data.json` → `80: "Sartorial": {`, `100: "Edition": {`, `120: "Archive": {`. Evidencia externa: existe [Editions de Pixel Union](https://themes.shopify.com/themes/editions/presets/editions), con preset Editions. [Shopify exige nombres únicos y distintos](https://shopify.dev/docs/storefronts/themes/store/requirements#naming-themes-and-theme-presets); son requisitos de catálogo, distintos de marcas registradas. [La ficha indica que el nombre no se cambia tras cargar](https://shopify.dev/docs/storefronts/themes/store/review-process/listings).

Refutación posible: singular y plural no son idénticos; Shopify podría considerar suficiente la diferencia. Esto impide afirmar infracción/rechazo seguro, pero no elimina el parecido verificable.

Corrección propuesta: antes de subida definitiva, escoger un nombre más distintivo o resolver la aceptabilidad con Shopify. Mantener un preset llamado Sartorial conforme al requisito del nombre matriz. No parchear nombres ni rutas ahora: depende de decisión comercial expresa. Cierre: decisión de nombre documentada y comprobación actual del catálogo, no sólo ausencia de coincidencia exacta.

## L3 — P2 documental: DP-003 continúa abierto

Clase: contenido/decisión legal. Dueño: Johandry.

`rg -n 'DP-003' docs/decisions-pending.md` → línea 18 registra búsqueda formal Sartorial/Ruiz Digital pendiente en USPTO/WIPO/TMview. No se encontró resolución en el archivo leído. Esto acredita falta de cierre documental; no acredita conflicto real ni obliga a registrar la marca para Shopify.

Acción: búsquedas exactas y de similares de Sartorial, Ruiz Digital y nombres finales de presets en [USPTO](https://www.uspto.gov/trademarks/search), [WIPO](https://www.wipo.int/en/web/global-brand-database) y registros de mercados objetivo; registrar fecha, términos, titulares, clases/bienes, estado y decisión. Revisar software y servicios relevantes, no limitar a prendas de moda. Refutación: Johandry puede tener dictamen fuera del repo; aportarlo cierra la brecha documental. Aquí sólo se consultaron portales oficiales, no se ejecutó un clearance formal ni se obtuvo un resultado de marcas negativo.

## L4 — Contenido IA y marcas en imágenes: criterio de aceptación

[OpenAI Terms](https://openai.com/policies/row-terms-of-use/) asigna derechos sobre Output entre las partes hasta donde la ley permite, responsabiliza al usuario del Input y advierte que Output puede no ser único. [U.S. Copyright Office](https://www.copyright.gov/ai/) distingue autoría humana de generación automática; no convertir permiso contractual en copyright exclusivo mundial. Se debe guardar el acuerdo aplicable al servicio/cuenta usado realmente, no asumir que toda imagen previa usó OpenAI.

[Shopify, requisitos demo](https://shopify.dev/docs/storefronts/themes/store/requirements#demo-stores) requiere derechos de assets y permiso del titular para marcas/contenido ajeno. No basta la etiqueta IA. Las menciones STOCKMAN Paris/BAUHAUS provienen del encargo; no fueron observadas en vivo por este rol y no se presenta infracción confirmada. BAUHAUS también puede aludir a un movimiento/obra histórica: investigar el activo concreto antes de acusar uso ilícito.

Acción exacta para entrega de arte: PROVENANCE por archivo con generador, fecha, prompt, referencias/inputs y permisos, transformaciones, dimensiones y checksum; inspección visual de rótulos, marcas, personas y similitudes; registro de destino SKU/variante. Para imágenes actuales, aportar licencia específica o sustituir por entregables revisados. Refutación: puede existir permiso válido externo al repo; entonces no hay defecto de licencia demostrado. Prioridad P1 sólo si se confirma marca/contenido ajeno sin respaldo de permiso; no incluir como infracción confirmada basándose sólo en este informe.

## L5 — Políticas: evidencia histórica, no hallazgo nuevo confirmado

`GPT-AUDIT-016-crosscutting-notes.md` sección C3 documentó refund/shipping 404 y privacy presente el 30-09; `GPT-AUDIT-017-policy-notes.md` H7 no cerró navegación/políticas. No se reservó navegador ni se solicitó tienda en este rol; ninguna visita adicional que pudiera generar 429. No afirmar que hoy faltan.

Instrucción exacta para Johandry si el recorrido actual confirma ausencia: Admin → Settings → Policies; completar devolución, privacidad, términos y envíos con hechos de cada demo (plazos, regiones, costes, contacto e identidad), guardar y enlazar desde el menú de footer en Content → Menus; verificar endpoints estándar y promesas PDP en EN/ES. No copiar plazos comerciales inventados ni declarar que las tres venden mercancía real. La ausencia por sí sola se clasifica como brecha de confianza, no incumplimiento legal universal sin mercado/contexto.

## Límites y cierre

Leídos AGENTS, RULES, BOARD, notas GPT pertinentes. `CLAUDE-REPORT-LEAD-001.md`, `GPT-REPORT-016/017` y `demo-assets/` no existían al consultar este checkout; ello impide certificar alineación con estado solicitado. No se modificó ledger; ninguna fila se cierra. No theme edits, .diff, push, admin writes ni prueba de políticas remotas. Candidatos que el revisor puede confirmar sólo con este material: L2 parecido de nombre y L3 DP-003 abierto. GSAP pagado obligatorio queda refutado; infracción IA/marcas y políticas actuales quedan no verificadas.
