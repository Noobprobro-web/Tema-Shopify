# CLAUDE-REPORT-4E-003 — Por que Documentation y Support "se ven muy mal"

**Sprint:** 4E-003 (correccion, no solicitada como sprint: peticion directa de Johandry)
**Peticion:** *"Puedes revisar las paginas de Documentation y support, ya que se ven muy mal"*
**Estado:** corregido, medido y con guardas de regresion. **Sin `git commit` ni `git push`.**

---

## 0. Como pude revisarlas sin entrar en la tienda

La tienda sigue protegida por contrasena y `?preview_theme_id=165809488115` tampoco pasa esa
puerta sin sesion de administrador, asi que **no he visto la tienda**. En vez de teorizar, monte
un render fiel en local:

- `liquidjs` ejecuta el Liquid **real** de las cinco secciones (`sections/main-*.liquid`),
- alimentado con los bloques **reales** de `templates/page.*.json` **mas los valores por defecto
  del `{% schema %}`** (Shopify los aplica; sin esto el mock apagaba el buscador de la FAQ),
- el `{% style %}` **real** de `layout/theme.liquid` con `config/settings_data.json` (esquemas de
  color, `--page-width: 1300px`, `heading_scale: 105`),
- el `assets/base.css` y el `assets/theme.js` reales,
- y las dos familias tipograficas reales (Libre Baskerville y Assistant) descargadas y servidas
  en local, porque una sustitucion de tipografia cambia todas las medidas.

Todo esto queda en `harness-4E-003/` para que Gemini pueda repetirlo.

**Conclusion: los fallos son mios, del 4E-001, y son reales.** No hacia falta ver la tienda.

---

## 1. Causa raiz: las cinco paginas nuevas nunca entraron en la escala de titulos del tema

El tema ya tiene una escala para paginas de utilidad, y la aplica **enumerando clases**:

```
.main-page__title, .main-contact__title, .main-blog__title,
.main-list-collections__title, .main-search__title   ->  2.75rem / 3.5rem / 4rem
```

En 4E-001 cree `.main-documentation__title`, `.main-support__title`, `.main-faq__title`,
`.main-about__title` y `.main-policy__title` y **no las anadi a esa lista**. Caen por tanto en la
regla global de portada, `h1 { font-size: calc(clamp(2.5rem, 9vw, 7rem) * var(--font-heading-scale)) }`.

En movil no se nota: a 390 px, `9vw` = 35 px y manda el suelo del clamp (40 px).
**A partir de ~1244 px manda el techo: 7rem x 1.05 = 117.6 px.** Por eso Johandry lo ve en un
portatil y no en el movil.

Medido a 1440 px, **antes**:

| Pagina | h1 | lineas |
|---|---|---|
| Documentation | **118 px** | **2 — partida a mitad de palabra: "Documenta / tion"** |
| Support | 118 px | 1 |
| Frequently asked questions | 118 px | **3** |
| About | 118 px | 1 |
| Terms of service | 118 px | **2** |

El corte a mitad de palabra lo remata `body { overflow-wrap: anywhere }` (`base.css:109`): el
titulo no cabe en la cabecera de 736 px y el navegador lo parte por donde sea. Con el tamano
corregido deja de pasar; **no he tocado la regla global**, que existe para evitar desbordes.

**Lo mismo, peor, en Support:** tres `<h2>` **sin clase ninguna** (formulario, preguntas y
canales) caian en `h2 { clamp(2rem, 5vw, 4.5rem) }` = **76 px**. "Other ways to reach the studio"
ocupaba **tres lineas** a 76 px dentro de una columna lateral. Y `.main-about__story-title`, que
si tiene clase, tampoco tenia regla de tamano: otros 76 px.

### Correccion

| Fichero | Linea | Cambio |
|---|---|---|
| `assets/base.css` | 4751-4761 | las cinco clases entran en la escala base `2.75rem`, con comentario de por que |
| `assets/base.css` | 5651-5655 | idem en `@media (min-width: 48rem)` -> `3.5rem` |
| `assets/base.css` | 5719-5723 | idem en `@media (min-width: 62rem)` -> `4rem` |
| `sections/main-support.liquid` | 86, 196, 209 | los tres `<h2>` desnudos reciben `class="main-support__section-title"` |
| `assets/base.css` | 6592-6597 | `.main-support__section-title` -> `clamp(1.5rem, 3vw, 2.125rem)`, la misma escala que un apartado de documentacion |
| `assets/base.css` | 6729-6734 | `.main-about__story-title` -> `clamp(1.75rem, 3.5vw, 2.5rem)` |

**Despues, a 1440 px:** los cinco h1 a **64 px**, una linea cada uno salvo "Frequently asked
questions" (dos, correcto); los tres apartados de Support a **36 px**; el relato de About a 42 px.

---

## 2. Documentation tenia dos bordes derechos

La medida de lectura (68ch) estaba **en cada hijo** (`.doc-section__content`, `.doc-preset`,
`.doc-snippet`, `.doc-callout`) y no en la columna. Resultado a 1280 px: la columna media 923 px,
los `<h2>` llegaban hasta **1072 px** y el texto paraba en **1031 px**. El apartado no tenia un
borde derecho, tenia dos, y sobraban ~390 px de vacio a la derecha de toda la pagina.

`.main-policy__body` ya lo hacia bien (la medida en el contenedor). Alinie Documentation con ese
patron, que ya estaba en el fichero:

| Fichero | Linea | Cambio |
|---|---|---|
| `assets/base.css` | 6384-6391 | la medida `68ch` pasa a `.main-documentation__body` |
| `assets/base.css` | 6421-6424 | `.doc-preset` pierde su `max-width` propia (la hereda) |
| `assets/base.css` | ~6404, ~6436, ~6534 | `.doc-section__content`, `.doc-snippet` y `.doc-callout`, idem |
| `sections/main-documentation.liquid` | 26 | `container` -> `container container--narrow` |
| `sections/main-policy.liquid` | 19 | idem, misma estructura de indice + cuerpo |

`container--narrow` (54rem) **ya existia** y ya lo usaba `main-faq.liquid:44`: cero variables
nuevas. Con el, el par indice+texto (192 + 96 + 535 = 823 px) queda **centrado** en la ventana en
vez de aplastado contra el margen izquierdo.

**Medido a 1280 px, despues:** `.doc-section__title`, `.doc-section__content`, `.doc-preset` y
`.doc-snippet` terminan **todos en 1031 px**. Un solo borde.

---

## 3. Support: 358 px de vacio abajo a la izquierda

Las dos tarjetas de alcance ("What is covered" / "What is not covered") vivian dentro de la
columna lateral y ahi, a `repeat(2, 1fr)`, cada una medía **231 px**. Un titulo de tres palabras
no cabia: "What is / not covered". Ademas inflaban la columna derecha hasta 1025 px frente a los
667 px del formulario: **358 px de hueco muerto** abajo a la izquierda.

Las movi a una **banda propia a todo el ancho, antes del formulario** — que ademas es donde
tienen sentido: el alcance del soporte es lo que decide si merece la pena escribir el ticket.

| Fichero | Linea | Cambio |
|---|---|---|
| `sections/main-support.liquid` | 62-80 | el bloque `policy_card` sale del `<aside>` y se coloca antes de `.main-support__layout`, con comentario |
| `assets/base.css` | 6599-6603 | `.main-support__policies` recibe `margin-block-start` propio (ya no hereda de `.flow`) |

**Medido a 1280 px:** tarjetas de **231 -> 608 px**; titulo en una linea; columnas de
**667 vs 1025 -> 667 vs 677 px** (diferencia: **10 px**).

---

## 4. Regalo de la revision: la FAQ tenia regla muerta y el primer grupo pegado al titulo

Revisando las cinco paginas encontre que `.main-faq__group + .main-faq__group` (selector
adyacente) **dejaba al primer grupo sin separacion**: su encabezado de categoria chocaba contra el
descendente de la ultima linea del h1. Y `.main-faq__groups`, que si tenia el margen, **no existe
en ningun markup del tema** (comprobado con `grep -rn` sobre `.liquid` y `.css`): regla muerta.

| Fichero | Linea | Cambio |
|---|---|---|
| `assets/base.css` | 6631-6637 | el margen pasa a `.main-faq__group`; se elimina `.main-faq__groups` |

**Medido:** huecos entre grupos **0/48/48/48 px -> 48/48/48/48 px**.

---

## 5. Verificacion

**Compuertas estaticas — `npm run gates:static`: 8/8, exit 0.**
Theme Check: **85 ficheros, 0 ofensas.** `shopify theme package`: OK.
Cero librerias externas, cero ingles quemado en Liquid (los tres `<h2>` ya usaban `| t`), cero
`shopify://`, cero variables CSS nuevas.

**Arnes visual: 63/63 anteriores siguen en verde + 12 nuevas = 75/75.**
Las 12 nuevas (`typescale.spec.mjs`) se ejecutan contra las paginas **renderizadas desde el Liquid
real**, no contra fixtures escritas a mano:

| # | Comprueba |
|---|---|
| T1 x5 | ninguna de las cinco paginas usa la escala de portada en su h1 (<= 64 px) |
| T2 | "Documentation" cabe en una linea |
| T3 | en Documentation, encabezado y texto comparten un unico borde derecho |
| T4 | los tres apartados de Support son de apartado (<= 40 px) |
| T5 | las dos columnas de Support terminan a menos de 120 px una de otra |
| T6 | el titulo de una tarjeta de alcance cabe en una linea |
| T7 | todos los grupos de la FAQ, el primero incluido, se separan >= 24 px |
| T8 | ninguna de las cinco paginas scrollea en horizontal a 390 px |

**Las guardas muerden.** Reinyectando las reglas anteriores sobre el build nuevo
(`harness-4E-003/oldproof.mjs`):

```
T1/T2 doc: h1=118px lineas=2   |   T3 bordes: h2=1072 texto=1031
T4 soporte: titulos=67/67/67px
T7 FAQ: huecos=0/48/48/48px
```

Cinco de las ocho aserciones fallan con el CSS viejo. T5 y T6 dependen del movimiento de markup y
quedan probadas por la medicion antes/despues (358 -> 10 px; 231 -> 608 px).

**Falsa alarma descartada:** en una primera pasada conte 6 elementos de About sin revelar. Era la
captura disparada a mitad de transicion; con espera completa los 8 `[data-reveal]` estan a
`opacity: 1`. El "desborde" de About era el `<rect>` de mi SVG de marcador de posicion, no del tema.

---

## 6. Lo que sigue sin depender de mi

Esto no lo arregla ningun cambio de codigo y sigue pendiente desde 4E-001 (tercera vez que lo
senalo):

1. **Asignar las plantillas en el admin**: `page.documentation`, `page.support`, `page.faq`,
   `page.about`, `page.policy`. Mientras no se haga, `/pages/documentacion` sigue renderizando
   `main-page`.
2. **Vaciar el HTML pegado** en el cuerpo de `/pages/support` y `/pages/documentacion`. Las
   secciones renderizan `page.content` (`main-documentation.liquid:35-37`,
   `main-support.liquid:57-59`), asi que ese HTML saldria **dos veces**.
3. **Subir el tema a la tienda.** Nada de 4E esta publicado: no he hecho commit ni push, como
   ordena la directiva.

Hasta que se hagan 1-3, lo que Johandry ve en la tienda **no es ninguna de estas paginas**.

Tambien queda una inconsistencia previa, ajena a 4E, que dejo anotada sin tocar:
`.main-search__title` esta en los dos `@media` de la escala pero **no en la regla base**, asi que
por debajo de 48rem cae en el clamp de portada. Es un fallo de la misma familia. Lo corrijo si
Gemini lo autoriza.

---

## 7. Ficheros tocados

```
assets/base.css                     escala de titulos, escala de apartados, medida de lectura,
                                    margen de la banda de alcance, separacion de grupos de FAQ
sections/main-support.liquid        3 <h2> con clase; tarjetas de alcance a banda propia
sections/main-documentation.liquid  container--narrow
sections/main-policy.liquid         container--narrow
harness-4E-003/                     render fiel (liquidjs), 12 tests nuevos, prueba del build viejo
```

Sin `git commit`. Sin `git push`. A la espera de la auditoria de Gemini y de la autorizacion de
Johandry.
