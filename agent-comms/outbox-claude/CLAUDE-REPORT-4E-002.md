# CLAUDE-REPORT-4E-002 — Refinamiento de páginas nativas y navegación en el header

**Sprint:** 4E-002 · **Directiva:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-4E-002-refine-paginas-y-header-nav.md`
**Implementador:** Claude · **Fecha:** 2026-09-16
**Estado:** entregado en árbol local, **sin `git commit` ni `git push`**.

---

## 0. Resumen

Bloques A y B completos. Un hallazgo importante: **la forma literal que pedía la directiva para el punto A4 habría dejado la página About permanentemente en blanco**, y está explicado en §4.

| Compuerta | Exigido | Resultado |
| :--- | :--- | :--- |
| `shopify theme check` | 0 ofensas | **0 ofensas** (85 ficheros) |
| `npm run gates:static` | 8/8, exit 0 | **verde**, exit 0 |
| Harness Playwright | verde | **63/63** (52 previas + 11 nuevas), dos ejecuciones seguidas |
| Claves nuevas con `t:` y sentence case | 100 % | **100 %**; 0 de 358 claves sin usar |
| Inglés quemado en Liquid | cero | **cero** (5 coincidencias, entidades HTML preexistentes) |
| `shopify://` | cero | **cero** |
| Tokens CSS nuevos | cero | **cero** |

Diff sobre la entrega de 4E-001: 226 líneas en `base.css`, 153 en `theme.js`, 46 en `main-faq.liquid`, 9 y 8 en los locales, más `header.liquid` y tres líneas en `main-documentation.liquid`.

---

## 1. Bloque A — Las cinco páginas

### A1 Documentación

**Marca de copiado** (`main-documentation.liquid:123`, `theme.js:2833–2840`, `base.css:6443–6489`). El botón gana una marca de verificación que solo existe cuando hay algo que confirmar: entra con escala, no reservando hueco, porque reservarlo desplazaría la etiqueta al aparecer. El estado vive en un atributo `data-copied` sobre el elemento, de modo que el CSS decide cómo se ve y el JavaScript solo dice qué ha pasado. El anuncio para lector de pantalla sigue en su región viva aparte, porque cambiar la etiqueta de un botón que ya tiene el foco no se lee.

**Indicador del índice** (`base.css:6309–6350`). El apartado en pantalla se marca ahora con una **línea de acento a la izquierda**, dibujada con `border-inline-start` sobre un borde transparente que ya ocupaba su sitio: animar un ancho movería el texto de toda la lista cada vez que cambia el apartado activo. La entrada pasó a rejilla `1.25rem / 1fr` para que un título de dos líneas alinee la segunda con la primera y no debajo del número.

**Índice móvil.** Ya colapsaba al elegir un apartado desde 4E-001; ahora está fijado por prueba, incluida la contraparte: en escritorio **no** se cierra, porque ahí la barra lateral es la navegación permanente.

### A2 Soporte

**Validación sutil** (`base.css:6903–6912`). Se usa `:user-invalid`, no `:invalid`. La diferencia importa: `:invalid` pinta de error un formulario recién abierto, antes de que nadie haya escrito nada; `:user-invalid` solo actúa después de que la persona haya interactuado con el campo. La señal es un borde y una barra interior de 2 px, no color: el tema no comunica estado solo con color en ninguna otra parte.

**Tarjetas de alcance** (`base.css:6914–6939`). Borde de pelo (`--color-border-hairline`) y viñeta de raya en lugar de punto, que es la marca editorial que el tema ya usa en sus hilos de separación y se alinea con el texto en vez de flotar sobre él.

**Acordeones.** Reutilizan la misma pieza que FAQ, así que heredan la animación de A3 sin una línea propia.

### A3 Preguntas frecuentes

**Apertura sedosa** (`base.css:6849–6880`). Aquí hay una restricción real que conviene dejar escrita: **un `<details>` nativo no renderiza su contenido cuando está cerrado**, así que una transición de ida no tiene fotograma inicial del que partir y no ocurre. Una `animation` sí arranca en el momento en que el contenido pasa a existir. Por eso la apertura se anima con `faq-answer-in` (opacidad más 6 px de desplazamiento, `--motion-base`, curva de entrada) y el cierre es instantáneo a propósito: retenerlo obligaría a gobernar el atributo `open` desde JavaScript y a pelearse con el teclado y con el editor de temas. Gobernado por `html[data-animations]`, así que las dos llaves de apagado del sistema de movimiento lo siguen apagando.

El indicador gira 180° al abrir, encima del morfismo de más a menos que ya existía.

**Buscador instantáneo** (`main-faq.liquid:58–85`, `theme.js:2860–2944`). Mejora progresiva estricta: el campo lleva la utilidad `js-only` que el tema ya tenía, así que sin JavaScript no aparece y la página se lee con todas las preguntas. No navega, no recarga y no toca la URL. Filtra sobre pregunta **y** respuesta, indexadas una sola vez al arrancar. Compara sin acentos ni mayúsculas, porque quien escribe "envio" espera encontrar "envío". Una categoría sin resultados se retira entera, para que no quede un título colgando sobre una lista vacía. `Escape` limpia el campo sin sacarle el foco. El conteo se anuncia en una región viva que **reserva su línea**, o el primer carácter escrito empujaría la lista entera hacia abajo.

Nuevo ajuste `show_search`, activo por defecto, y el campo no se emite si la página tiene menos de dos preguntas.

### A4 Historia de marca

Ver §4: los bloques entran con el sistema de movimiento, pero declarados en `REVEAL_TARGETS` (`theme.js:3619–3622`), no con atributos en el Liquid.

**Comillas editoriales** (`base.css:6942–6951`): comilla serif grande en la familia de titulares, a 0.35 de opacidad, con margen negativo para que se lea como ornamento y no como una línea más del texto.

### A5 Páginas legales

La medida (70ch) y el interlineado (1.75) ya cumplían desde 4E-001 y se verifican en prueba. Lo añadido: **enlaces con subrayado decorativo** a 40 % de opacidad que se llena al pasar el cursor (`base.css:6954–6964`), y la **sangría francesa** del índice descrita en A1, que es donde más se nota porque los títulos legales son largos.

---

## 2. Bloque B — Navegación del header

**Panel desplegable** (`base.css:6966–6991`). Misma restricción que el acordeón: el panel pasa de no existir a existir, así que lo que entra es una animación, no una transición. `desktop-nav-panel-in` hace `opacity 0 → 1` con `translateY(4px) → 0` en `--motion-fast`. Borde a `--color-border-hairline` y sombra de elevación más baja y más abierta que la anterior.

**Teclado** (`theme.js:175–228`). Lo que ya funcionaba: `Enter` y `Space` abren, porque el disparador es un `<button>` de verdad; `Tab` recorre; `Escape` cierra y devuelve el foco; el panel cerrado es `inert`, no solo `hidden`. Lo añadido: flechas. Desde el disparador, `ArrowDown` abre y entra en el primer enlace, que ahorra un `Tab`. Dentro, `ArrowUp`/`ArrowDown`/`Home`/`End` recorren la lista **sin ciclar**: por arriba se sale al disparador y por abajo no se mueve, porque envolver la lista deja a quien no ve la pantalla sin saber dónde termina.

Las flechas son **opcionales**, por `data-disclosure-arrows` (`header.liquid:107`). En un menú de divulgación la navegación esperada es `Tab`, y `<theme-disclosure>` también monta el menú móvil, donde capturar `ArrowDown` le quitaría el desplazamiento al teclado dentro del cajón. Las pide quien las quiere.

**Menú secundario** (`header.liquid:83–93` y `:172–182`, schema `:224–229`). Ajuste `link_list` opcional `secondary_menu`. Si está configurado se renderiza en dos sitios: junto a las acciones del header, en versalitas discretas y **solo desde 62rem**; y al pie del cajón lateral en móvil, sobre el selector de idioma y moneda. No se duplica en móvil porque en una cabecera estrecha le quitaría sitio al carrito.

---

## 3. Pruebas nuevas: `refine.spec.mjs` (11) + fixtures `about.html`, `faq.html`, `nav.html`, `support.html`

| # | Prueba | Cubre |
| :---: | :--- | :--- |
| 1 | About: el texto, la cita, los valores y la galería reciben `data-reveal` del motor; **la imagen del primer panel nunca**; el escalonado reinicia en cada rejilla | §4 y regla de oro del LCP |
| 2 | About: al llegar al final, ningún bloque visible se queda sin revelar | §4, red de seguridad |
| 3 | FAQ: filtra por pregunta y por respuesta, sin acentos, retira categorías vacías, anuncia el conteo, muestra el vacío y `Escape` limpia sin perder el foco | buscador |
| 4 | FAQ: sin JavaScript el buscador no aparece y se ven las cuatro preguntas | degradación |
| 5 | FAQ: al abrir corre `faq-answer-in` a 0,68 s, el indicador gira y la respuesta queda a opacidad 1 | apertura animada |
| 6 | FAQ: con `data-animations="none"` la respuesta aparece entera igual | llave de apagado |
| 7 | Header: `ArrowDown` abre y entra, `Home`/`End`, sin ciclo arriba ni abajo, `Escape` devuelve el foco | teclado |
| 8 | Header: el panel cerrado es `hidden` **e** `inert`; al abrir corre `desktop-nav-panel-in` a 0,16 s | panel |
| 9 | Header: el menú secundario se ve en escritorio con enlaces de 44 px y se retira a 390 px | menú secundario |
| 10 | Documentación: copiar deja marca visible, atributo de estado y anuncio, y todo vuelve solo | micro-interacción |
| 11 | Documentación: en móvil el índice colapsa al elegir; en escritorio **no** | índice móvil |

---

## 4. Hallazgo: `data-reveal` escrito en el Liquid habría dejado About en blanco

La directiva A4 pide "aplicar atributos `data-reveal` a los bloques". Hacerlo literalmente rompe la página, y conviene que quede registrado porque no es evidente.

El motor de 4D-001 recorre `REVEAL_TARGETS`, y su guardia de idempotencia dice (`theme.js:3659`):

```js
if (node.hasAttribute('data-reveal') || node.closest('.hero-editorial')) return;
```

Un bloque que ya trae `data-reveal` desde el servidor **se salta el observador**, así que nunca recibe `data-revealed`. Y la regla de CSS que lo oculta es `html[data-reveal-ready] [data-reveal]:not([data-revealed])`, con `data-reveal-ready` puesto por el propio motor. Resultado: en cuanto el motor arranca, esos bloques quedan **ocultos para siempre**. Sin JavaScript se verían; con JavaScript, no. Es el peor tipo de fallo: invisible en desarrollo con las animaciones apagadas.

Implementado como lo hace el resto del tema: las secciones se declaran en `REVEAL_TARGETS` y el motor reparte atributo, índice de escalonado y observador. Añadido un comentario junto al guardia para que nadie lo intente después. La prueba 2 es la red de seguridad permanente: recorre la página hasta el final y falla si queda algún `[data-reveal]` visible sin revelar.

**Una decisión dentro del hallazgo:** entra `.main-about__story-text`, no `.main-about__story`. En esa página la fotografía del primer panel es el LCP, y esconderla aunque sea medio segundo es exactamente lo que prohíbe la regla de oro de 4D-001. El texto entra con la cadencia; la imagen está desde el primer pintado. La prueba 1 lo fija por los dos lados.

---

## 5. Dos notas de nomenclatura de la directiva

- **`--focus-ring`** (punto A2) no existe en el tema. El anillo de foco se dibuja con `--focus-width` sobre la regla global `:focus-visible` (`base.css:261`), que ya cubre todos los campos nuevos. No se creó un token paralelo.
- **`grid-template-rows: 0fr → 1fr`** (punto A3) es la técnica correcta cuando uno controla el colapso, pero no funciona con `<details>` nativo por la razón de §A3. La directiva daba `opacity`/`transform` como alternativa y es la que se usó.

---

## 6. Verificación

```
shopify theme check     → 85 ficheros, 0 ofensas
npm run gates:static    → 8/8 verde, exit 0
npx playwright test     → 63 passed (verify 10, r007 7, motion 10, stress 14, pdp 4, pages 7, refine 11)
grep -rn "shopify://"   → 0 resultados
claves de locale        → 358, 0 sin usar
```

Capturas en `harness-4E-002/`: tarjetas de alcance, validación tras interactuar, FAQ con buscador y respuesta abierta, índice con la línea de acento, confirmación de copiado y cabecera con el menú secundario.

---

## 7. Para verlo en la tienda

El menú secundario necesita un `linklist` en el admin: **Online store > Navigation > Add menu**, con los enlaces a las páginas de documentación, soporte y about, y luego elegirlo en el ajuste "Secondary menu" de la cabecera.

Sigue pendiente de 4E-001 y no es mío: asignar las cinco plantillas a sus páginas en el admin y **vaciar el HTML pegado en el cuerpo de `/pages/support` y `/pages/documentacion`**, o el contenido se verá dos veces.
