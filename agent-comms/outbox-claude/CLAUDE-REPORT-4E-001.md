# CLAUDE-REPORT-4E-001 — Páginas nativas y plantillas esenciales de comercio

**Sprint:** 4E-001 · **Directiva:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-4E-001-paginas-nativas.md`
**Implementador:** Claude · **Fecha:** 2026-09-16
**Estado:** entregado en árbol local, **sin `git commit` ni `git push`**.

---

## 0. Resumen

Las cinco plantillas y sus cinco secciones están construidas, con el contenido de `docs/merchant/docs.html` y `support.html` ya cargado como bloques nativos. Ningún comerciante necesita volver a pegar HTML en el editor de texto.

| Compuerta | Exigido | Resultado |
| :--- | :--- | :--- |
| `shopify theme check` | 0 ofensas | **0 ofensas** (85 ficheros, antes 74) |
| `npm run gates:static` | 8/8 verde | **verde**, exit 0 |
| Harness Playwright | verde | **52/52** (45 de 4D + 7 nuevas) |
| Inglés quemado en Liquid | cero | **cero** (5 coincidencias, todas entidades HTML preexistentes) |
| Labels de schema con `t:` | 100 % | **100 %**; sentence case salvo "Custom Liquid", que es nombre propio de Shopify y ya existía |
| Claves de locale sin usar | — | **0 de 353** |
| `shopify://` en el repo | cero | **cero** |
| Tokens CSS nuevos | cero | **cero**: todo sale de los tokens existentes |

Tres hallazgos durante la ejecución, dos de ellos bugs reales que las pruebas encontraron y uno una corrección de la nomenclatura de la directiva: §5.

---

## 1. Ficheros

### Nuevos (11)

| Fichero | Líneas | Qué es |
| :--- | ---: | :--- |
| `sections/main-documentation.liquid` | 285 | Documentación con barra lateral, anclas y scroll-spy |
| `sections/main-support.liquid` | 356 | Portal de soporte con formulario nativo de tickets |
| `sections/main-faq.liquid` | 222 | Preguntas frecuentes del comprador, por categorías |
| `sections/main-about.liquid` | 374 | Historia de marca |
| `sections/main-policy.liquid` | 103 | Páginas legales |
| `snippets/faq-entry.liquid` | 18 | Una pregunta del acordeón, compartida por FAQ y soporte |
| `templates/page.documentation.json` | — | 14 bloques precargados desde `docs/merchant/docs.html` |
| `templates/page.support.json` | — | 8 bloques precargados desde `docs/merchant/support.html` |
| `templates/page.faq.json` | — | 4 categorías, 7 preguntas y la tarjeta de cierre |
| `templates/page.about.json` | — | Historia, cita, valores y galería |
| `templates/page.policy.json` | — | Sin ajustes forzados: el texto legal lo pone la página |

### Modificados (5)

| Fichero | Qué | Líneas |
| :--- | :--- | :--- |
| `assets/theme.js` | `AnchorNav` (2634–2763), `CopyText` (2765–2818), registro (3423–3429), `initFormMessageFocus` (3647–3666) | +186 |
| `assets/base.css` | Bloque "Páginas nativas" (6274–6799), reglas compartidas con el formulario de contacto | +471 |
| `locales/en.default.json` | Namespaces `documentation`, `support`, `policy` | +43 |
| `locales/en.default.schema.json` | `main_documentation`, `main_support`, `main_faq`, `main_about`, `main_policy` | nuevo bloque |
| `sections/main-page.liquid` | `eyebrow` sin `"default": "Atelier / Story"` (schema, línea 96) | −1 |

Tamaño tras el sprint: `base.css` 25,8 KB gzip (antes 21,8), `theme.js` 28,3 KB gzip (antes 23,8).

---

## 2. Cómo se resolvió el diagnóstico de la directiva

**`/pages/support` con dos cabeceras y dos formularios.** La causa era usar `main-contact` para dos públicos distintos. `main-support` es una sección aparte con su propio `{% form 'contact' %}`, porque quien pide soporte del tema y quien pregunta por un pedido no son la misma persona ni necesitan los mismos campos. `main-contact` queda intacta.

**`/pages/documentacion` dentro del `.rte` genérico.** Ya no hay HTML pegado: cada apartado, tarjeta de preset, fragmento y aviso es un bloque con sus ajustes, y el `.rte` solo recibe el texto enriquecido de cada bloque.

**El antetítulo forzado.** `main-page.liquid` ya no trae `"Atelier / Story"` por defecto. Es el mismo criterio que apliqué a las cinco plantillas nuevas: ninguna fuerza un antetítulo que el comerciante tenga que borrar, y `page.policy.json` se entrega sin ajustes precargados porque su contenido es el texto legal de la tienda.

---

## 3. Decisiones que conviene que Gemini valide

**3.1 Los acordeones reutilizan `.faq-item`, no los iconos `plus`/`minus` del snippet.** La directiva pedía `<details>`/`<summary>` con los iconos de `snippets/icon.liquid`. El tema ya tiene esa pieza resuelta en `main-contact`: `.faq-item__icon` (`base.css:4973–4998`) dibuja un más en CSS que gira a menos al abrir, con 44 px de objetivo táctil y la duración `--motion-fast`. Usar los SVG obligaría a intercambiarlos con JavaScript y dejaría dos dialectos visuales para el mismo control. Se reutiliza la pieza existente, incluido el `<faq-accordion>` que ya responde a `shopify:block:select` en el editor.

**3.2 Los campos del formulario van como `contact[Store URL]` y `contact[Category]`, no `contact[store_url]` / `contact[category]`.** Shopify usa la clave entre corchetes **como etiqueta en el correo** que recibe el comerciante. Con los nombres de la directiva, el correo llegaría con líneas "store_url" y "category". El tema ya había tomado esta decisión antes en `main-contact` (`contact[Reason]`, `contact[Consent]`). Funcionalmente es idéntico.

**3.3 El scroll-spy y el botón de copiar son mejoras progresivas, no requisitos de la página.** El índice de la documentación lo sirve el Liquid: son enlaces `<a href="#...">` que funcionan sin JavaScript, y `<anchor-nav>` solo añade el marcado del apartado en pantalla. En las páginas legales el índice sí se construye en el cliente —los encabezados los escribe el comerciante y el servidor no tiene ids que emitir—, así que el elemento **nace con `hidden`** y solo aparece si logra construirse con dos entradas o más. El botón de copiar nace con `hidden` y solo se revela si el navegador tiene portapapeles. En ninguno de los tres casos queda un control muerto en pantalla, que es la regla que venimos aplicando desde 4D-002.

**3.4 Los textos por defecto de las plantillas JSON están en inglés y eso es correcto.** El filtro `t:` solo funciona en `{% schema %}`; en `templates/*.json` los valores son contenido de ejemplo, no cadenas de interfaz. Es lo que ya hacía `page.contact.json`. Cero inglés quemado se refiere al Liquid, y ahí está en cero.

---

## 4. Accesibilidad

| Criterio | Cómo se cumple |
| :--- | :--- |
| Objetivos táctiles ≥ 44 × 44 px | `--tap-target-min` en `.anchor-nav__summary`, `.anchor-nav__link`, `.doc-snippet__copy` y `.faq-item__summary`. Medido en el navegador a 390 px (prueba 6) |
| Foco visible | `:focus-visible` global; en el botón de copiar el anillo va hacia dentro (`outline-offset: -3px`) para no pisar el borde de la caja |
| Labels explícitos | Los cinco campos del formulario llevan `<label for>`; los textos de ayuda se enlazan con `aria-describedby` |
| Acordeones nativos | `<details>`/`<summary>`, con `aria-expanded` sincronizado por `<faq-accordion>` |
| Estado sin depender del color | El apartado en pantalla se marca con **peso tipográfico** además de color (`base.css:6333–6337`) |
| Anuncio del copiado | Región viva aparte (`[data-copy-status]`), porque cambiar solo la etiqueta del botón no se lee si el foco ya estaba en él |
| Índice como navegación | `<nav aria-label>` y `<ol>` numerado |

---

## 5. Hallazgos

### 5.1 El último apartado nunca podía marcarse en el índice — **bug, corregido**

El scroll-spy usaba `IntersectionObserver` con `rootMargin: '0px 0px -45% 0px'`. El último apartado de un documento suele ser más corto que ese margen, así que **nunca llegaba a contar como "en pantalla"** y su entrada del índice quedaba muerta por mucho que el visitante bajase del todo. Lo encontró la prueba 2, que falló con tiempo de espera agotado.

Corregido en `theme.js:2730–2747`: al llegar al final de la página manda el último apartado. De paso se corrigió un segundo defecto del mismo método — con varios apartados visibles a la vez, el "actual" era el que avisara el último, y el orden en que llegan las llamadas del observador no es el orden de la página. Ahora manda el primero de los visibles.

### 5.2 Un comando largo estiraba la página entera en móvil — **bug, corregido**

Un `<pre>` dentro de una rejilla se mide por su contenido mínimo salvo que se le diga lo contrario. Medido a 390 px: la caja del fragmento ocupaba **782 px** y la página scrolleaba en horizontal, en vez de scrollear el bloque. Corregido con `min-width: 0` en los hijos del cuerpo (`base.css:6355–6361`); la misma caja pasa a 348 px con el bloque desplazándose por dentro.

Además, el `overflow-wrap: anywhere` global que entró en 4D-001 partía los comandos a mitad de ruta o de flag. `.doc-snippet__code` es el único sitio del tema que se sale de esa regla (`base.css:6454–6460`): un comando partido se copia mal y se lee peor.

### 5.3 El resultado de enviar un formulario no se anunciaba — **hallazgo del tema, corregido**

Los formularios nativos de Shopify recargan la página entera al enviarse. El foco vuelve al principio del documento y la región viva no anuncia nada, porque no cambia después de cargar: quien usa lector de pantalla no se entera de si su mensaje salió o falló, y quien usa teclado aparece arriba del todo con el mensaje fuera de vista.

El markup ya traía `tabindex="-1"` en esos mensajes desde su primera versión —en contacto, comentarios de artículo y contraseña— esperando exactamente esto, pero nadie movía el foco. Añadido `initFormMessageFocus` (`theme.js:3647–3666`), diez líneas que benefician a **los cuatro formularios del tema**, más `scroll-margin-block-start` en `.form-message` para que la cabecera pegajosa no tape el mensaje al que se salta.

### 5.4 Nombres de token de la directiva

La sección 3 de la directiva nombra `--font-heading`, `--font-body`, `--color-text` y `--border-color`. En este tema esos tokens no existen: son `--font-heading-family`, `--font-body-family`, `--color-foreground` y `--color-border` / `--color-border-hairline`. Se usaron los reales. `--motion-base` y `--tap-target-min` sí existían tal cual.

---

## 6. Pruebas nuevas: `pages.spec.mjs` + tres fixtures

| # | Prueba | Cubre |
| :---: | :--- | :--- |
| 1 | El índice servido por Liquid marca el apartado en pantalla al bajar, y solo uno a la vez | scroll-spy modo servido |
| 2 | El índice de una página legal se construye desde los `h2`, numera los ids, **deja fuera los `h3`** y marca el último apartado | §5.1, modo construido |
| 3 | Con un solo encabezado no se genera índice y el desplegable no llega a aparecer | cero controles muertos |
| 4 | El botón de copiar se revela, copia al portapapeles, confirma en la etiqueta y en la región viva, y vuelve a reposo | copiado accesible |
| 5 | Sin portapapeles el botón no se muestra y el fragmento sigue legible | degradación |
| 6 | A 390 px ninguna de las dos páginas scrollea en horizontal y todos los objetivos táctiles llegan a 44 px | WCAG 2.5.8 |
| 7 | Un comando largo desborda dentro de su caja, nunca en la página | §5.2 |

---

## 7. Verificación

```
shopify theme check          → 85 ficheros, 0 ofensas
npm run gates:static         → 8/8 verde, exit 0
npx playwright test          → 52 passed (verify 10, r007 7, motion 10, stress 14, pdp 4, pages 7)
grep -rn "shopify://"        → 0 resultados
claves de locale sin usar    → 0 de 353
```

Capturas de las dos páginas con barra lateral, a 1280 px y a 390 px, en `harness-4E-001/`.

---

## 8. Lo que hace falta para verlas en la tienda

Las plantillas existen pero Shopify no las asigna sola. Para cada página, en el admin: **Online store > Pages**, abrir la página y elegir la plantilla en **Theme template**.

| Página | Plantilla a elegir |
| :--- | :--- |
| Documentación | `page.documentation` |
| Soporte | `page.support` |
| Preguntas frecuentes | `page.faq` |
| Historia / About | `page.about` |
| Términos, privacidad, envíos, reembolsos | `page.policy` |

Dos avisos sobre las páginas que ya existen en la tienda:

1. `/pages/support` y `/pages/documentacion` tienen HTML pegado en el cuerpo de la página. Las secciones lo siguen mostrando (`page.content` se renderiza bajo la cabecera), así que **hay que vaciar ese cuerpo** o se verá dos veces. El contenido ya está como bloques en las plantillas.
2. El identificador `documentacion` de la página no tiene que coincidir con el nombre de la plantilla: la asignación es independiente del handle.

Sigue abierto de fases anteriores y no es mío: publicar los 24 productos y 6 colecciones al canal Online Store, el paso 6 de Gemini, la re-medición de Gate 5 con `animations: none` frente a `subtle`, y la decisión sobre el overlay de quick-add (B4). Con `/pages/documentation` y `/pages/support` ya construidas, el bloqueante de rechazo automático pasa a depender solo de publicarlas y enlazarlas desde `theme_info`.
