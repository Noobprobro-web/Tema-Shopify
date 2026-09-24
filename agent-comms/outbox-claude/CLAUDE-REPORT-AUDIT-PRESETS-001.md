# CLAUDE-REPORT-AUDIT-PRESETS-001: Auditoría en vivo de Couture, Sartorial, Edition y Archive

```text
ID: CLAUDE-REPORT-AUDIT-PRESETS-001 (responde a CLAUDE-DIRECTIVE-AUDIT-PRESETS-001)
Estado: ENTREGADO. Dictamen: APTO CON DOS CORRECCIONES RECOMENDADAS (H1 y H2, parches listos y no
  aplicados). Lo que pide la directiva pasa en los 4 temas: 0 palabras partidas y 0 scroll
  horizontal a 1280, 375 y 360; 100 % de las imágenes cargan; /es en español con 862/862
  enlaces internos con /es; mega menú, zoom, inventario y Recently Viewed funcionan.
  La prueba adversarial fuera de esos anchos encontró dos defectos reales. H1: el hero de
  Archive está descentrado. H2: los lectores de pantalla leen un precio equivocado al cambiar
  de variante, en los 4 temas.
Base: master 824738e (fix de titulares en 793a6fa, comprobado en el CSS servido de los 4 temas).
  Tienda leída entre las 02:05 y las 03:00 UTC del 2026-09-24.
Decisión requerida:
  1. Gemini: aprobar harness-AUDIT-PRESETS-001/hero-center-desktop.diff (solo CSS, H1 y H3). Centra
     el subtítulo del hero de Archive (hoy está 141 px a la izquierda del eje a 1280 px). Además
     pone un tope de 6.2vw al titular, solo en heroes centrados y solo entre 992 y 1277 px.
     Sartorial, Couture y Edition no cambian.
  2. Gemini: aprobar harness-AUDIT-PRESETS-001/pdp-price-sr-labels.diff (theme.js + price.liquid,
     H2). Las etiquetas "Precio de oferta" y "Precio habitual" que leen los lectores de pantalla
     pasarían a seguir al variante elegido. Theme Check sin ofensas y node --check OK.
  3. Johandry: decidir tres cosas de contenido.
     a. Fotos: Couture, Sartorial y Archive usan la misma foto de hero, y Edition usa la del
        "Completa el look" de Sartorial (H5).
     b. Productos QA: los F01 a F11 salen en /es con nombre, "Size" y colores en inglés (H6).
     c. Tamaño en móvil: el titular del hero bajó de 46 a 39 px a 375 por el fix de 793a6fa. En
        Sartorial también, aunque en inglés no partía palabras (H7).
Resumen en 5 líneas:
  1. Titulares: 24 cargas (4 temas x / y /es x 1280, 375 y 360). 0 palabras partidas en header,
     main y footer, 0 px de scroll horizontal, CLS 0 y todas las imágenes cargan.
  2. Bilingüe: 48 páginas (portada + 5 nativas, en / y en /es, por tema), 862 enlaces internos en
     /es, todos con /es. En /es solo coinciden con el inglés la marca, "Showroom" y los nombres
     previstos. El selector EN/ES vuelve a la misma página. 705 traducciones, 0 desfasadas.
  3. Presets: Sartorial conserva intactos tipografía, paleta, botones y tamaños de escritorio
     (idénticos a Couture). Edition es monocromo sans y Archive es un heritage cálido. Contraste
     AA en todos los pares medidos (el mínimo son 5,17:1). El defecto visual está en Archive (H1).
  4. Interacción: mega menú con teclado real (ArrowDown, Tab, Escape) y con ratón; zoom con
     teclado (Enter, ArrowRight, Escape) y foco devuelto; inventario reactivo contra el stock real;
     Recently Viewed de 0 a 4 tarjetas sin desborde a 1280 y 375.
  5. Hallazgos: H1 y H2 (P2) con parche; H3, H4 y H8 (P3); H5 a H7 son decisiones de contenido.
Archivos tocados: ninguno del tema, del diccionario ni del ledger. En agent-comms: este informe y
  harness-AUDIT-PRESETS-001/. No hice commit ni push. La contraseña del storefront no la escribí:
  la sesión ya estaba abierta.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Los dos diffs son propuestas: tocan CSS, JS y Liquid, así
  que son Nivel 2 y necesitan la autorización de Gemini.
Hallazgos extra fuera de alcance (con parche listo): H1/H3 hero-center-desktop.diff; H2
  pdp-price-sr-labels.diff. H4 no tiene parche.
Verificación (comando, resultado y qué demuestra/qué no): §1 a §5 y §7.
Lista de afirmaciones falsables numeradas: §9.
```

---

## 0. Método y límites del entorno

Todo se hizo en la tienda real, con `?preview_theme_id=<tema>`, desde el navegador integrado y con la sesión del storefront ya abierta. El viewport se emuló a 1280x800, 1366x768, 1024x768, 768x1024, 375x812 y 360x780. Las sondas están en `harness-AUDIT-PRESETS-001/audit-presets-probes.js`.

El panel del navegador no pinta fotogramas: `requestAnimationFrame` no avanza y las capturas por encima del ancho del panel salen a veces recortadas o en blanco. Eso tiene tres consecuencias:

1. Las medidas son de DOM y de geometría (`getBoundingClientRect`, `Range.getClientRects`). Las capturas solo valen a ancho de móvil y en la parte superior de la página; se usaron como apoyo.
2. Las imágenes `loading="lazy"` no se piden solas. Para comprobar que existen y decodifican, las pasé a `eager` en mi pestaña. Esto no mide cuándo carga cada una en un navegador visible.
3. El evento `close` de `<dialog>` no se dispara, ni siquiera en un `<dialog>` de prueba creado en la página y esperado 6 s. Por eso no pude comprobar en vivo que el scroll se desbloquea al cerrar el zoom (§4.3).

## 1. Frente 1: titulares, scroll horizontal e imágenes

Antes de medir comprobé que el fix de 793a6fa está desplegado: el `base.css` servido de los 4 temas contiene `.hero-editorial__heading{…font-size:min(3.25rem,calc(2.75rem * var(--font-heading-scale)),10.5vw);…overflow-wrap:break-word}`, y Archive sirve `--hero-content-width: 46%`.

```text
Tema / ruta        1280x800                          375x812                          360x780
Couture   /        Form | in quiet | movement        Form in quiet | movement         igual que 375
Couture   /es      La forma en | movimiento | sereno La forma en | movimiento | sereno igual
Sartorial /        Form | in quiet | movement        Form in quiet | movement         igual
Sartorial /es      La forma en | movimiento | sereno La forma en | movimiento | sereno igual
Edition   /        Useful | forms, | precisely | considered (1280, 375 y 360)
Edition   /es      Formas | útiles, | pensadas | con | precisión (1280, 375 y 360)
Archive   /        Objects with a | remembered | life (1280, 375 y 360)
Archive   /es      Objetos con | una vida | recordada   Objetos con | una vida | recordada   Objetos | con una | vida recordada
```

En las 24 cargas:

- 0 saltos dentro de palabra en header, main y footer.
- 0 px de scroll horizontal.
- CLS 0 al cargar y tras recorrer la página.
- Todas las imágenes cargan: Couture 25/25, Sartorial 17/17, Edition 16/16 y Archive 13/13 (incluye header y footer).

Fuera de los anchos de la directiva también medí 768, 1024 y 1366. A 768 no hay palabras partidas en ningún tema. A 1024 tampoco, pero en Archive (inglés) "remembered" no cabe en la columna del 46 % y todo el bloque se desplaza 33 px a la derecha (H3).

## 2. Frente 2: coherencia bilingüe y locale

Probé la portada y las 5 páginas nativas (about, contact, faq, support y documentation) de cada tema, en / y en /es: 48 páginas. En cada una comparé los nodos de texto de main, header y footer, más los `aria-label`, `alt` y `placeholder`.

```text
Textos de /es iguales a los de /                       Motivo
LINEA NOVE, © 2026 LINEA NOVE                           marca
Showroom (contact)                                      es la cadena de locales/es.json
Sartorial-1.0.0.zip, nombres de preset y 5 nombres de
  sección del editor (documentation)                    previstos: son los nombres del editor
Material (Edition, portada)                             igual en español
F04 Colour and Size Knit (Couture, lookbook)            nombre de producto QA (H6)
alt de imágenes de producto en inglés (3 textos)        texto alternativo del catálogo (H6)
```

- Enlaces: 862 `a[href^="/"]` en las 24 páginas de /es. Ninguno sale sin `/es`.
- En / (inglés) no aparece ningún texto en español. La única coincidencia es "Update preferences: Español", que es el nombre del idioma dentro del selector.
- Botones de la portada en /es (los 4 temas): "Descubre la colección" o equivalente → `/es/collections/all`. Botón secundario → `/es/collections` en los presets y `/es/collections/the-autumn-series` en Couture. "Conoce nuestro proceso" → `/es/collections/all` en los presets y `/es/pages/about` en Couture. "Descubre la historia" en el bento.
- Mega menú en /es: 7 enlaces y 2 tarjetas, todos en español. Las tarjetas llevan a `/es/collections/all` en los 4 temas.
- Selector de idioma: en `/es/pages/about` (Sartorial), pulsar EN lleva a `/pages/about` en inglés y ES vuelve a `/es/pages/about`, sin perder el preview. Al terminar dejé la preferencia en EN.
- Traducciones: releí los 32 recursos después del despliegue de 793a6fa. Hay 189, 177, 163 y 176 traducciones (Couture, Sartorial, Edition, Archive), ninguna desfasada. Redesplegar el index de Archive no invalidó nada.

## 3. Frente 3: identidad de los presets

Tokens leídos en vivo a 1280 en /es:

```text
                Couture / Sartorial          Edition                      Archive
Titulares       Libre Baskerville 400        Assistant 400                Libre Baskerville 400
Hero h1         75,6 px                      72 px                        79,2 px
Texto           Assistant 16 px              Assistant 16 px              Assistant 16 px
Fondo / texto   #F7F3EA / #1D1B18            #FFFFFF / #111111            #EFE6D9 / #2E241C
Botón hero      #D8A85D sobre #1D1B18, 0 px  #111 / #FFF, 0 px            #B5885C / #241F19, 0 px
Acentos         manifiesto #E0DBCE           manifiesto pizarra #2E3440   marquee #6E482F, anuncio #2F3327
Hero            cinematic, texto a la izq.   split 50/50, texto a la dcha cinematic centrado, scrim
```

Contraste WCAG calculado con esos colores (el mínimo exigido es 4,5 para texto y 3 para bordes):

```text
Sartorial: texto 15,52; botón oro 7,92; manifiesto 12,43; newsletter 13,95; footer 7,91
Edition:   texto 18,88; manifiesto 11,14; gris 16,87; footer 9,53
Archive:   texto 12,27; botón hero 5,17; manifiesto 9,69; borde del botón 3,72; marquee 7,58;
           botón newsletter 5,53; anuncio 10,46; footer 6,49
```

**Sartorial.** Es el preset por defecto (`config/settings_data.json`: presets Sartorial, Edition y Archive; los valores de `current` son los de Sartorial). Por eso sus tokens coinciden con Couture uno a uno. En escritorio no cambió nada: sigue con serif Libre Baskerville en titulares, eyebrows Assistant 700 en mayúsculas con 1,44 px de tracking, botón oro de esquinas rectas y los mismos tamaños (75,6 px en el hero; 48 a 64 px en las secciones). Lo único distinto es el titular en móvil (H7). La captura a 375 en /es muestra el hero con su foto, el titular entero y los dos botones en español.

**Edition.** Monocromo y sans: blanco, #111 y gris #F2F2F2, con un único acento pizarra en el manifiesto. El botón "Ver colecciones" lleva a `/es/collections` y su versión en inglés, "Browse collections", a `/collections`. Los dos botones del hero quedan dentro del primer viewport a 1280 (borde inferior 754 px de 800). Observación H8: en /es el titular ocupa 5 líneas a cualquier ancho.

**Archive.** Heritage cálido: pergamino, marrón tabaco, cobre y oliva, con serif. El hero está centrado sobre la foto con scrim. La proporción de la columna (46 %) funciona para el titular a 1280 y 1440, pero el subtítulo no está centrado (H1).

## 4. Frente 4: componentes

### 4.1 Mega menú (Sartorial /es, 1280, teclado real)

```text
Foco en "Catálogo" + ArrowDown  -> abre, aria-expanded=true, foco en "Ver todo en Catálogo"
Tab x2                          -> foco en "Punto", sigue dentro del panel
Escape                          -> cierra, aria-expanded=false, foco vuelve a "Catálogo"
Enter + Tab x10                 -> foco en "Contacto" (cabecera): sigue abierto, como dice el código
Tab x8 más                      -> el foco sale de la cabecera: se cierra (focusin de 5C-002)
Clic en "Catálogo"              -> abre; panel de 0-1265 x 125-566, tarjetas 240x300, imágenes cargan
Clic fuera (foto del hero)      -> cierra
```

En Couture, Edition y Archive lo comprobé con clic programático: abre, tiene las dos tarjetas en `/es/collections/all` y cierra.

### 4.2 Ficha (qa5a-f04-colour-size, /es, 1280x800)

```text
Tema        Rejilla                        Hijos                            Borde inferior del ATC
Couture     767px 396.7px                  product-gallery, variant-selects 780 de 800
Sartorial   igual                          igual                            780
Edition     igual                          igual                            775
Archive     igual                          igual                            785
```

A 1366x768 el ATC termina en 780: queda 12 px por debajo del pliegue (H9).

### 4.3 Zoom (Sartorial, teclado real)

```text
Foco en "Ampliar imagen 2 de 4" + Enter -> dialog modal, body[data-modal-open], foco en "Cerrar zoom",
                                            contador 2 / 4, estado "Imagen 2 de 4, zoom 100 %"
ArrowRight                              -> 3 / 4, imagen cargada (1280 px)
Escape                                  -> dialog cerrado, foco vuelve a "Ampliar imagen 2 de 4"
```

En los otros 3 temas, con clic programático: abre en modo modal con el foco dentro, y cierra.

No verificado en vivo: al cerrar, `body[data-modal-open]` y `product-zoom[data-open]` siguieron puestos y el scroll quedó bloqueado. La causa es que el evento `close` no llega en este panel. Un `<dialog>` de prueba sin ningún código del tema tampoco lo recibe en 6 s, y `requestAnimationFrame` no avanza. `product-zoom.js` libera el bloqueo en `handleClose`, que escucha `close`. El laboratorio lo verifica: `harness-5B-001/zoom5b.spec.mjs`, líneas 134 y 138, comprueba que el atributo se quita al cerrar. No lo cuento como defecto, pero conviene que GPT o Johandry lo confirmen en un navegador normal (§9, n.º 12).

### 4.4 Inventario reactivo (contra el stock real de la tienda)

Stock leído por Admin: Camel / S y M = 0; Olive / S, M y L = 4; Olive / XL no existe.

```text
Ink/S (inicial)  -> "Pocas existencias: 4 disponibles" | Añadir al carrito
Camel/S          -> "Agotado" | Agotado (desactivado), insignia Agotado visible
Camel/M          -> "Agotado" | Agotado (desactivado)
Olive/M, Olive/S -> "Pocas existencias: 4 disponibles" | Añadir al carrito
Olive/XL         -> "Esta opción no está disponible" | No disponible (desactivado), id vacío
```

El mensaje tiene `aria-live="polite"`. Los 4 temas dan el mismo resultado. Observación H4: con Olive/XL la URL conserva `?variant=` de Olive/S.

### 4.5 Recently Viewed (Sartorial /es)

Guardé ids de producto en `theme:recently-viewed` y llamé a `load()` del componente. Al terminar restauré el valor original.

```text
Ids guardados  1280 (4 columnas)                          375 (2 columnas)
0              sección oculta
1              1 tarjeta, 20-314 px                       1 tarjeta, 160 px
2 / 3          2 / 3 tarjetas, alineadas a la izquierda
4              4 tarjetas, 20-1245 px, sin desborde       2 filas de 2, sin desborde
6              4 tarjetas (tope products_to_show = 4)
```

En los 4 casos el scroll horizontal es 0. Las tarjetas salen en español ("Abrigo Serra", "Trench cruzado"...), con enlace a `/es/products/...`, y respetan el orden guardado.

## 5. Hallazgos

**H1 (P2, visual, Archive). El subtítulo del hero no está centrado.** Hoy el hero de Archive es el único centrado (`hero-editorial--align-center`). `.hero-editorial__subheading` tiene `max-width: 38ch` (299 px) y no tiene `margin-inline: auto`. La caja queda pegada a la izquierda de la columna, con el texto centrado dentro de ella.

```text
Desplazamiento del centro del subtítulo respecto al eje de la columna
Archive /es 1280: -141 px     Archive /es 1024: -82 px     (en /es, eyebrow, h1 y botones en 0)
Archive /   1024: -82 px, y el resto del bloque +33 px (H3)
```

Al ensanchar la columna de 30 a 46 % el efecto creció: con el 30 % eran unos -40 px. Probé el parche en mi pestaña: con él, los cuatro bloques quedan en 0 px a 1024 y a 1280. La misma clase de defecto afecta a `align-right`; el parche lo cubre, pero ningún preset lo usa, así que no lo medí.

**H2 (P2, accesibilidad, 4 temas). El precio que se lee al cambiar de variante es incorrecto.** `snippets/price.liquid` pone etiquetas ocultas según el variante con el que se carga la página. `updatePrice()` en `assets/theme.js` (≈ línea 833) cambia el precio y el precio tachado, pero no esas etiquetas. La tarjeta (`product-card-variants`, ≈ línea 1915) ya las reconstruye bien.

```text
Olive/M cargado desde el servidor:           "Precio habitual $320.00"
Olive/M tras pasar desde Ink/S (en oferta):   "Precio de oferta $320.00 Precio habitual"   <- falso
Ink/S tras pasar desde un variante sin oferta: "Precio habitual $320.00 $380.00"            <- falso
```

`pdp-price-sr-labels.diff` añade `data-label-sale` y `data-label-regular` al contenedor del precio y reconstruye las etiquetas en `updatePrice`. No toca el caso "Desde…" ni cambia nada visible. Qué comprobé:

- Theme Check sobre una copia del tema con el parche: 76 archivos, sin ofensas.
- `node --check` OK y `git apply --check` OK.
- En mi pestaña simulé la lógica sobre la ficha real: Olive queda "Precio habitual $320.00" e Ink "Precio de oferta $320.00 / Precio habitual $380.00".

Misma clase de defecto: `updateItemPrice` de "Completa el look" (≈ línea 3176) solo toca el precio tachado. No lo medí en vivo.

**H3 (P3, visual, Archive).** Entre 992 y unos 1270 px, "remembered" (79,2 px) es más ancho que la columna del 46 %. A 1024 el titular se sale 66 px y todo el bloque se desplaza 33 px a la derecha. El mismo diff pone un tope de `6.2vw` solo en heroes centrados y solo en escritorio: a 1024 el titular queda en 63,5 px, entero y centrado, y a partir de 1280 no cambia nada.

**H4 (P3, ficha).** Con una combinación que no existe (Olive/XL), la ficha hace bien lo importante: ATC "No disponible" y el id del formulario vacío. Pero la URL conserva `?variant=` del variante anterior. Si se recarga o se comparte, abre Olive/S. Sin parche.

**H5 (contenido, presets). Las fotos se repiten entre temas.** `hero-campaign-01.jpg` es el hero de Couture, Sartorial y Archive. Edition usa `capsule-look-01.jpg` (la foto de "Completa el look" en Sartorial) y `lookbook-scene-01.jpg` en su sección "set". `manifesto-01`, los dos del bento y los tres productos de colecciones son los mismos en los 4 temas. Hoy los presets se distinguen por paleta, tipografía y composición, no por fotografía. Para Theme Store y para la identidad de cada preset convendría un hero propio por preset. Lo decide Johandry.

**H6 (contenido, catálogo).** Los productos QA F01 a F11 salen en /es con título, "Size" y colores en inglés. Los de demo ("Abrigo Serra"...) sí están traducidos y no tienen opciones. Además hay 3 `alt` de imagen de producto en inglés en las portadas de /es. Es catálogo, no tema. Dos salidas: sacar los F01 a F11 de la colección `all` y del lookbook de Couture, o traducirlos.

**H7 (decisión, móvil).** El fix de 793a6fa baja el titular del hero a 39,4 px a 375 y a 37,8 px a 360 (antes 46,2 px en Sartorial y Couture y 48,4 px en Archive), en los 4 temas y en los dos idiomas. Es lo que evita "movimient|o", pero también reduce el titular de Sartorial en inglés, que no lo necesitaba. Con 11.5vw el titular quedaría más grande (43 px), pero según mi cálculo "remembered" de Archive no cabría a 375 (unos 288 px en una columna de 288 px). Queda a elección de Johandry.

**H8 (P3, Edition /es).** "Formas útiles, pensadas con precisión" ocupa 5 líneas a cualquier ancho ("Formas | útiles, | pensadas | con | precisión"), con "con" sola en una línea. Lo causa `max-width: 11ch` con una sans ancha, y a 375 deja casi la mitad de la columna vacía (captura). Salida de contenido: una traducción más corta, por ejemplo "Formas útiles y precisas".

**H9 (P3, ficha).** A 1366x768 el botón de añadir al carrito queda 12 px bajo el pliegue en la primera carga (título de producto en 2 líneas). A 1280x800 y más, cabe.

## 6. Matriz por tema e idioma

```text
                         Couture        Sartorial      Edition        Archive
                         /      /es     /      /es     /      /es     /      /es
Titular 1280/375/360     OK     OK      OK     OK      OK     OK(H8)  OK     OK
Scroll horizontal        0      0       0      0       0      0       0      0
Imágenes                 25/25  25/25   17/17  17/17   16/16  16/16   13/13  13/13
CLS                      0      0       0      0       0      0       0      0
Texto en el otro idioma  -      marca   -      marca   -      marca   -      marca
Enlaces internos sin /es -      0       -      0       -      0       -      0
Mega menú (abre/cierra)  OK     OK      OK     OK      OK     OK      OK     OK
Centrado del hero        n/a    n/a     n/a    n/a     n/a    n/a     H1,H3  H1
Ficha: 2 columnas + ATC  -      OK      -      OK      -      OK      -      OK
Zoom / inventario        -      OK      -      OK      -      OK      -      OK
Precio para lector       -      H2      -      H2      -      H2      -      H2
```

## 7. Verificación

```text
CSS servido (fetch de base.css de cada tema)       10.5vw + overflow-wrap:break-word en los 4; Archive --hero-content-width: 46%
translatableResourcesByIds (32 recursos)           705 traducciones es, 0 outdated
__run() x 24 (1280, 375, 360)                      breaks [], hScroll 0, cls 0, fails []
__centers() Archive 1024 / 1280, con y sin CSS     sub -82 / -141 -> 0 / 0
teclado real en mega menú y zoom (§4.1, §4.3)      estados y foco como se describe
__pdp() x 4 temas                                  mismas respuestas en los 4
Theme Check (copia del tema con pdp-price-sr-labels.diff)   76 files inspected with no offenses found
node --check (theme.js con el parche)              OK
git apply --check de los dos diffs                 OK en la carpeta
```

Qué no demuestra:

- El tiempo de carga real de las imágenes lazy.
- El desbloqueo del scroll al cerrar el zoom en vivo (§4.3).
- Cómo queda visualmente a 1280 más allá de la geometría (no hay capturas fiables a ese ancho).

## 8. Material

`agent-comms/outbox-claude/harness-AUDIT-PRESETS-001/`:

```text
audit-presets-probes.js                     sondas de §1 a §4
readback-2026-09-24-post-793a6fa.json       lectura de vuelta de las traducciones (32 recursos)
hero-center-desktop.diff                    H1 y H3 (CSS), no aplicado
pdp-price-sr-labels.diff                    H2 (theme.js + price.liquid), no aplicado
```

Al terminar dejé el navegador en su tamaño normal y la sesión en Couture. `/` y `/es/` sin parámetro devuelven Couture, la preferencia de idioma está en EN y `theme:recently-viewed` está restaurado.

## 9. Afirmaciones falsables

1. El `base.css` servido por los 4 temas contiene `10.5vw` y `overflow-wrap:break-word` en `.hero-editorial__heading`. El hero de Archive lleva `--hero-content-width: 46%`.
2. A 1280, 375 y 360, en / y /es de los 4 temas, ningún nodo de texto de header, main o footer salta de línea entre dos letras seguidas, y `scrollWidth - clientWidth` = 0.
3. A 1280 en /es/?preview_theme_id=166187041011, el centro del texto de `.hero-editorial__subheading` está 141 px a la izquierda del centro de `.hero-editorial__content`. A 1024 son 82 px.
4. Con el CSS de `hero-center-desktop.diff`, en esos dos casos el desplazamiento es 0 px, y a 1024 en / el titular mide 63,5 px y no se sale de la columna.
5. En la ficha qa5a-f04-colour-size de Sartorial (el código es el mismo en los 4 temas), tras cargar Ink/S y elegir Olive, el texto de `.product-main__details .price__values` es "Precio de oferta $320.00 Precio habitual". Cargada directamente con el variante de Olive/M es "Precio habitual $320.00".
6. En esa ficha, Camel/S da "Agotado" y ATC desactivado; Olive/XL da "Esta opción no está disponible", ATC "No disponible" e `input[name="id"]` vacío.
7. En /es de los 4 temas no hay ningún `a[href^="/"]` sin prefijo /es en la portada ni en las 5 páginas nativas (862 enlaces).
8. En el mega menú de Sartorial /es, ArrowDown sobre "Catálogo" abre el panel con el foco en "Ver todo en Catálogo", y Escape lo cierra devolviendo el foco a "Catálogo".
9. Recently Viewed con 6 ids guardados muestra 4 tarjetas, sin desborde a 1280 ni a 375.
10. `translatableResourcesByIds` sobre los 32 recursos devuelve 189, 177, 163 y 176 traducciones es, ninguna con `outdated: true`.
11. `git apply --check` pasa con los dos diffs sobre 824738e.
12. En un navegador normal, cerrar el zoom con Escape quita `data-modal-open` del body y el scroll vuelve. Lo afirma el laboratorio; aquí no se pudo medir.
