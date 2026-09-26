# GEMINI-TASK-AUDIT-360-001: Auditoría integral multiagente de Sartorial antes del envío

```text
Ruta: agent-comms/inbox-gemini/GEMINI-TASK-AUDIT-360-001.md
Origen: Johandry, en el chat con Claude: revisión completa de todo el tema, con agentes especializados.
Base: master 2f42c4f. Hay 26 archivos marcados como modificados solo por finales de línea
  (git diff --ignore-cr-at-eol sale vacío). Se audita HEAD.
Modo: SOLO LECTURA sobre el tema, la documentación, el ledger y la tienda.
Tienda: tema-qkqpke0j.myshopify.com. Temas: Couture #165809488115, Sartorial #166186909939,
  Edition #166186942707, Archive #166187041011.
Entregable: agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-001.md y harness-AUDIT-360-001/
```

## 0. Objetivo

Encontrar todo lo que impida aprobar la revisión de la Theme Store o vender el tema a 380 USD, y todo lo que se pueda mejorar: bugs, fallos, funciones o páginas que faltan, incumplimientos de Shopify, deuda técnica, problemas de UX, ideas y propuestas.

El BOARD dice que el tema está 100% certificado. Parte de la premisa contraria: busca por qué Shopify lo rechazaría.

## 1. Reglas

1. No modifiques ningún archivo existente. Solo puedes crear archivos nuevos en `agent-comms/outbox-gemini/`, en el harness de esta tarea y en `.agents/teamwork/audit360/`.
2. En la tienda: nada de push, borrados ni cambios de ajustes. Solo GET, Admin API de lectura y navegador.
3. `npm run gates:static` se corre sobre una copia hecha con `git archive HEAD`, nunca en la carpeta de trabajo.
4. La fuente de verdad son las páginas oficiales de shopify.dev leídas hoy por el agente, no la memoria del modelo ni `docs/shopify-theme-store-checklist.md`. Cita URL y sección.
5. Cada hallazgo lleva:
   - `archivo:línea`, con el nombre de la función, el selector o la clave;
   - el comando o la prueba que lo demuestra;
   - el resultado obtenido.

   Sin método, se marca `no verificado`. Prohibido dar porcentajes de confianza.
6. Todo se mide de nuevo. No copies cifras de informes anteriores. Puedes reutilizar los scripts de `scratch/` y de los harness.
7. El contraste se mide sobre píxeles reales (foto, velo y scrim), en el peor punto bajo el texto, nunca contra un color liso.
8. Verificación adversarial:
   - Cada P0 y P1 lo reproduce un agente distinto del que lo encontró antes de entrar al informe.
   - Lo que no se reproduce va a un anexo de descartados, con el motivo.
9. En el informe y en el BOARD no se usan "CERTIFICADO", "VICTORY" ni porcentajes de avance. El dictamen es uno de estos tres: APTO, APTO CON OBSERVACIONES o NO APTO.
10. No escribas la contraseña de la tienda en ningún archivo.
11. Commit:
    - Solo las rutas nuevas, con `git add <ruta>` explícito. Nunca `git add -A`.
    - Sin push de tema.

## 2. Lo que ya se sabe

Verifica que siga siendo cierto, pero no lo reportes como hallazgo nuevo.

- AF-01 a AF-16 de `CLAUDE-REPORT-AUDIT-FINAL-001`, con su estado en `CLAUDE-VERIFICATION-LIVE-FINAL-001`.
- AF-08 sigue pendiente de prueba con teclado físico.
- AF-12: `layout/password.liquid` sigue en los 4 temas.
- Fila 107: la documentación y el soporte no existen.
  - `theme_info` apunta a ruizdigital.com, un dominio que los agentes inventaron y que no existe.
  - `docs/merchant/support.html` envía a support@ruizdigital.com, un correo que tampoco existe.
  - DP-001 (publicarlos como páginas de la tienda) no sirve, porque la tienda tiene contraseña.
- Fila 108: faltan las tiendas demo.
- Filas 35 y 72: faltan fixtures.
- Con las filas 107 y 108 abiertas, "100% certificado y listo para Theme Store" en el BOARD es falso.

## 3. Equipo

Gemini orquesta. Cada especialista trabaja en `.agents/teamwork/audit360/<rol>/` con BRIEFING, progress y handoff. Los roles 1 a 11 corren en paralelo. Después van el 12 y el 13.

1. **requisitos-theme-store.** Revisa punto por punto:
   - `https://shopify.dev/docs/storefronts/themes/store/requirements`;
   - la página de listing;
   - el proceso de revisión.

   Entrega una matriz con estas columnas: requisito, estado (cumple, no cumple o no verificado) y evidencia. Debe cubrir:
   - `theme_info`;
   - presets (uno con el nombre del tema) y `listings/`;
   - archivos prohibidos en el zip, como `config/markets.json`;
   - demos, documentación y formulario de soporte;
   - screenshots y feature tags;
   - exclusividad y ausencia de créditos.
2. **liquid-arquitectura.** Revisa todas las secciones, snippets, templates y layouts. Busca:
   - bugs lógicos;
   - los 5 estados degenerados: vacío, uno solo, muchos, muy largo y faltante;
   - `presets` y `@app` donde corresponde, bloques del producto principal y Custom Liquid;
   - section groups;
   - LiquidComplexity, código muerto y bucles costosos;
   - comportamiento en el editor (`request.design_mode`).
3. **javascript.** Revisa todos los `assets/*.js`. Busca:
   - errores de consola y condiciones de carrera;
   - listeners duplicados tras `shopify:section:load` y `unload`;
   - fugas de memoria;
   - fetch sin manejo de error o sin AbortController;
   - estados de carga;
   - cómo funciona todo sin JS.
4. **seguridad.** Revisa:
   - el escape de todo output: settings, metafields, `search.terms`, `cart.note` y propiedades de línea;
   - JSON dentro de `<script>`;
   - redirecciones abiertas;
   - handlers inline;
   - dependencias externas;
   - datos que no deberían exponerse.
5. **rendimiento.** Pasa Lighthouse en móvil y escritorio sobre Home, colección y producto de los 4 temas:
   - Haz 3 corridas por página y toma la mediana, con `?pb=0` y la vista previa de cada tema.
   - El requisito es un promedio de 60 o más.
   - Mide también LCP, CLS e INP.
   - Revisa el peso de JS y CSS, las imágenes (`sizes`, `srcset`, `loading`, `fetchpriority`), las fuentes y el CSS sin usar.
6. **accesibilidad.**
   - Lighthouse a11y: promedio de 90 o más.
   - axe en las 4 identidades, con drawers y modales abiertos.
   - Teclado real: foco visible, orden del foco y targets de 24x24 como mínimo.
   - Contraste sobre píxeles reales.
   - Headings que se distingan visualmente entre sí.
   - Nombres accesibles y regiones vivas.
7. **comercio-funcional.** Prueba en vivo todas las funciones y páginas que exige Shopify:
   - Producto: variantes, agotado, selling plans, pickup, precio unitario, cuotas y gift card con destinatario.
   - Carrito y drawer.
   - Búsqueda y búsqueda predictiva, filtros, orden y paginación.
   - Blog y artículo con comentarios.
   - Cuentas de cliente, 404 y password.
   - País, idioma y multimoneda.
   - Recomendaciones, newsletter y contacto.
8. **editor-y-comerciante.** Revisa la experiencia en el personalizador:
   - labels, `info`, sentence case y claves `t:`;
   - valores por defecto;
   - secciones recién añadidas y sin contenido;
   - placeholders, esquemas de color y tipografía;
   - paridad en/es, inglés neutro y ortografía.
9. **presets-y-demo.** Compara:
   - los 4 temas contra `listings/` y la identidad de cada preset;
   - si el contenido es auténtico (sin lorem ni textos de onboarding);
   - los derechos de las imágenes;
   - lo que falta para las 3 tiendas demo.
10. **producto-y-diseño.** Evalúa UX, jerarquía, conversión y calidad visual al nivel de 380 USD:
    - Compara con los mejores temas de pago de moda (Prestige, Impact, Be Yours, Symmetry, Stiletto y similares) y cita la fuente.
    - Di qué falta para competir y qué sobra.
    - Propón funciones con impacto y esfuerzo estimados.
    - Usa también `docs/top-theme-benchmark.md`.
11. **documentacion-y-soporte.**
    - Compara `docs/merchant/docs.html` con los settings reales: cada setting con el mismo nombre que en el editor.
    - Revisa el FAQ y la política de soporte.
    - Revisa el formulario: nombre, email, URL de la tienda con ejemplo, descripción, adjuntos y respuesta automática.
    - Lista lo que falta.
12. **verificador-adversarial.** Reproduce cada P0 y P1 e intenta falsificarlo.
13. **sintetizador.** Deduplica, ordena y escribe el informe.

## 4. Severidad

- **P0:** rechazo seguro en la revisión, o un bug que rompe la compra.
- **P1:** rechazo probable, bug visible o incumplimiento de WCAG 2.2 AA.
- **P2:** calidad, deuda técnica o riesgo menor.
- **P3:** idea o mejora opcional.

## 5. Informe

Usa la cabecera estándar: ID, Estado, Decisión requerida, Resumen en 5 líneas, Archivos tocados, Desviaciones, Hallazgos extra, Verificación y Afirmaciones falsables. Después van estas secciones:

1. Dictamen y motivo.
2. Hallazgos P0 a P2, en una tabla con estas columnas:
   - ID (A360-NN);
   - severidad y área;
   - `archivo:línea`;
   - qué pasa y cómo se reproduce;
   - parche propuesto;
   - dueño (Johandry, Gemini, Claude o GPT);
   - esfuerzo.
3. Matriz completa de requisitos de Shopify.
4. Lighthouse y CWV por tema y página, con las 3 corridas y la mediana.
5. Ideas y propuestas (P3), con impacto y esfuerzo.
6. Estado real frente al BOARD y al ledger: qué afirmaciones no se sostienen.
7. Plan propuesto: qué entra en el siguiente sprint y en qué orden.
8. Descartados y no verificados, con el motivo.
9. Afirmaciones falsables, numeradas.

## 6. Al terminar

1. En el BOARD, añade una línea con el enlace al informe y corrige el estado general.
2. No cambies el ledger.
3. Avisa a Johandry.
4. Claude hará la verificación cruzada del informe.
