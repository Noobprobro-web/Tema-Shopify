# GEMINI-4B-002: Estado verificado del repo, inventario de entregas y el hilo de Fase 4

```text
ID: GEMINI-4B-002
Emisor: Johandry (dueño del proyecto)
Destinatario: Gemini Flash 3.8 High
Verificación técnica: Claude, archivo por archivo sobre el repo real
Contexto: GPT-5.6 Sol Max sigue sin presupuesto de tokens. Esta directiva es de
          planificación y dictamen, no de implementación
Fecha: 2026-09-13
```

---

## 1. Corrección de un informe previo mío

En el mensaje anterior dije que GPT-4A-001 había quedado a medias con solo el andamiaje de Liquid. Verifiqué archivo por archivo y **fui pesimista**. GPT alcanzó a hacer bastante más antes de quedarse sin tokens, incluido trabajo que yo había dado por pendiente. Lo corrijo abajo con evidencia.

Lo que sigue reemplaza cualquier lectura anterior del estado.

---

## 2. Estado real del repo, verificado

### Archivos nuevos que GPT creó

```
snippets/localization-selectors.liquid   2.869 bytes
snippets/predictive-search.liquid        5.567 bytes
snippets/social-meta-tags.liquid         2.172 bytes
snippets/product-media.liquid            1.166 bytes
sections/newsletter.liquid               3.561 bytes
```

### Archivos que modificó

`layout/theme.liquid`, `sections/header.liquid`, `sections/footer.liquid`, `sections/main-product.liquid`, `sections/main-collection.liquid`, `sections/main-search.liquid`, `sections/cart-drawer.liquid`, `sections/main-cart-items.liquid`, `config/settings_schema.json`.

### Los tres archivos que NO tocó, y de ahí sale todo lo que falta

```
locales/en.default.json    sin cambios
assets/base.css            sin cambios
assets/theme.js            sin cambios
```

Consecuencias medidas, no inferidas:

- **25 claves de traducción referenciadas que no existen.** Comparé todas las claves `| t` de los archivos nuevos y modificados contra el archivo de locales. Theme Check ya no está en 0 ofensas: la regla `TranslationKeyExists` va a reportar las 25.
- **`<predictive-search>` y `<localization-form>` no están definidos en `theme.js`.** Un custom element sin definir renderiza sus hijos como HTML inerte. El ícono de lupa del header existe y **no hace nada al presionarlo**.
- **Cero reglas CSS** para `predictive-search`, `localization-form`, la sección de newsletter, los iconos de pago y `product-gallery__view-in-space`.

---

## 3. Estado P0 por P0, con el veredicto de ledger que corresponde

| P0 | Qué hizo GPT | Qué falta | Fila del ledger |
| --- | --- | --- | --- |
| **P0-1 Localización** | `localization-selectors.liquid` con el `{% form 'localization' %}` nativo, renderizado en el nav móvil del header y en el footer. Bien construido | JS de `<localization-form>` para el auto-submit. Sin él, el único envío es el botón de respaldo, que está marcado `no-js-only` y por tanto invisible con JS activo: el selector no funciona. Más CSS y 3 claves | **parcial** |
| **P0-2 Búsqueda predictiva** | `predictive-search.liquid` con `role="combobox"`, `aria-autocomplete`, panel con `inert`, y un `<details>` de respaldo sin JS. Renderizado en el header | **Todo el comportamiento.** No hay clase `<predictive-search>` en `theme.js`, no hay fetch a `/search/suggest`. Más CSS y 12 claves | **parcial** |
| **P0-3 Newsletter** | `sections/newsletter.liquid` con preset, **y montado en el footer** vía el setting `show_newsletter`. Yo había dicho que no estaba montado y me equivoqué | CSS y 8 claves | **parcial**, cerca de cerrar |
| **P0-4 theme_info** | Nombre Couture, autor Ruiz Digital, URLs de docs y soporte en ruizdigital.com | **Que las dos URLs resuelvan a páginas reales.** Ver decisión C | **parcial hasta que existan las páginas** |
| **P0-5 Media 3D** | `product-media.liquid` con el visor y el disparador AR, `model-viewer-ui.css` desde el CDN de Shopify, `shopify-xr.js` vía `shopify_asset_url`, y `Shopify.loadFeatures` para `model-viewer-ui`. **Esto yo lo había dado por ausente y sí está** | 1 clave (`products.product.view_in_space`), CSS del botón, y verificación en tienda con un modelo real | **parcial**, casi cerrada |
| **P0-6 Open Graph y Twitter** | `social-meta-tags.liquid` completo: `og:site_name`, `og:url`, `og:title`, `og:type` por tipo de recurso, `og:description`, `og:image` con ancho y alto, `twitter:card summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`. Renderizado en `theme.liquid` y sin duplicar el bloque viejo | Nada. No necesita CSS, ni JS, ni claves | **CUMPLIDO** |
| **P0-8 Escapado de atributos** | Los cinco arreglados: `value.value` en collection y search, `remove_item` con `item.title` en drawer y cart page, y el `href` de `link_url` del tile | Nada | **CUMPLIDO** |
| **P0-7 Filtro de precio** | Agregó `step="any"`, que sí desbloquea el envío sin JS. Cambió la sanitización de `replace: ',', ''` a `strip \| replace: ' ', ''` | **No está arreglado, está cambiado.** Ver decisión D | **parcial** |

**Dos filas pueden ponerse en verde con evidencia: P0-6 y P0-8.** Las demás son `parcial`, y la de búsqueda predictiva tiene una prueba de un clic: abrir la tienda, presionar la lupa, no pasa nada.

---

## 4. Lo único que queda y que solo GPT puede hacer

El presupuesto de GPT es el recurso escaso del proyecto, así que esta lista es corta a propósito. Cuando se restaure, sus tokens van solo a esto:

1. **Clase `<predictive-search>` en `theme.js`.** Fetch a `/search/suggest.json`, render del listbox, navegación con flechas, debounce, `AbortController`, y el `aria-live` de estado que el markup ya tiene preparado.
2. **Clase `<localization-form>` en `theme.js`.** Auto-submit al cambiar cualquiera de los dos selects.
3. **CSS en `base.css`** para `predictive-search`, `localization-form`, la sección de newsletter, los iconos de pago del footer y `product-gallery__view-in-space`.
4. **La conversión numérica del filtro de precio** (decisión D).

Cuatro cosas. Nada más de la lista de P0 necesita a GPT.

---

## 5. Lo que ya está entregado y no consume tokens de GPT

Todo en `agent-comms/outbox-claude/`, salvo la primera que va a `inbox-gemini/`.

| Archivo | Qué es | Estado |
| --- | --- | --- |
| `GEMINI-4B-001-reset-de-coordinacion.md` | La directiva de reset, ya ejecutada por ti | Cerrada |
| `CLAUDE-AUDIT-001-review.md` | Auditoría, 9 P0 y 56 P1 | Entregada y validada |
| `CLAUDE-BLUEPRINT-001-experiencia-premium.md` | Los 4 pilares: hero dual, galería de PDP, 10 settings nuevos con matriz de presets, y nomenclatura | Entregada y aprobada |
| `CLAUDE-COPY-001-locales-p0.md` | **Las 25 claves que faltan**, escritas, con la decisión editorial de cada una | Lista para pegar |
| `CLAUDE-SCHEMA-001-labels-y-traduccion.md` | Mapa de los 275 labels literales a claves `t:`, más 31 renombrados | Lista para aplicar |
| `en.default.schema.propuesta.json` | El archivo de traducción de schemas completo. 360 strings, 185 claves únicas, validado programáticamente: 0 claves del mapa faltan | Listo, hay que copiarlo a `locales/` |
| `CLAUDE-QA-001-catalogo-hostil.md` + `qa-catalogo-hostil.csv` | 18 productos en 54 filas, cada uno reproduce un hallazgo concreto. Verificado ida y vuelta | Listo para importar |
| `CLAUDE-DEMO-001-couture-demo-store.md` | Demo store de Couture: marca ficticia LINEA NOVE, 24 productos con descripciones, 6 colecciones, copy de las 8 secciones del homepage, 2 páginas de marca, contacto con 6 FAQ, 3 artículos de journal, guía de tallas y página de contraseña | Lista para montar |

Tres cosas que quiero que registres en el plan como asignadas y no pendientes: **las 25 claves, los 275 labels y la demo store de Couture ya están escritas.** No son trabajo futuro.

---

## 6. Cuatro decisiones que necesitan tu dictamen

### A. Los 31 renombrados de sección y label

`CLAUDE-SCHEMA-001` cambia lo que el comerciante ve en el editor. Entre otros: **Bento discovery** pasa a Mixed content grid, **Interactive lookbook** a Shoppable image, **Complete the look** a Shop the set, **Curated showcase** a Collection tabs, **Editorial marquee** a Scrolling text, y **Eyebrow** a Small label en todas partes.

El razonamiento de Claude es que un comerciante que abre "Agregar sección" y lee los nombres nuevos entiende su catálogo sin documentación, y que la voz de la marca vive en la vitrina y no en la barra lateral del editor.

**Esto no lo absorbas en silencio.** Es una decisión de producto sobre la identidad del tema y es de Johandry. Preséntala como decisión, con la recomendación y con el costo de revertirla, que es cambiar cinco valores del JSON.

### B. Verificación del nombre "Couture"

La regla de Shopify sobre nombres de tema y preset pide, textualmente, que sean de una o dos palabras, bajo 30 caracteres, y **distintos de productos, empresas e industrias de Shopify**.

"Couture" cumple longitud y formato. Lo que hay que verificar es lo último: es un término que nombra la industria de moda a la que sirve el tema, y un revisor podría leerlo como descriptor de industria. No tengo certeza de que sea rechazo, y hay temas publicados con nombres adyacentes a su nicho. Pero el costo de verificarlo ahora es cero y el costo de descubrirlo en la submission es un reempaquetado.

Dos comprobaciones concretas antes de poner esa fila en verde: buscar conflicto en el directorio de la Theme Store, y buscar el nombre como marca registrada en clase 25 y clase 42. Si aparece riesgo, el cambio es una pasada de buscar y reemplazar y el preset principal se renombra con el tema.

### C. Las URLs de theme_info

`https://ruizdigital.com/themes/couture/docs` y `/support` están escritas en `settings_schema.json`. **Una URL que devuelve 404 en theme_info es peor que el enlace a GitHub que tenía antes**, porque el requisito no es tener una URL, es tener documentación y un formulario de contacto de soporte funcionando antes del lanzamiento.

Mientras esas dos páginas no existan, la fila del ledger es `parcial`. Y el plan necesita una línea para producirlas con dueño y fecha, porque no es código y hoy no está asignado.

### D. El filtro de precio, que cambió de bug en lugar de arreglarse

Esto es técnico y necesita tu criterio de arquitectura.

**Antes:** `filter.range_max | money_without_currency | replace: ',', ''`. En una tienda con formato `1.234,56` daba `1.23456`, o sea el valor equivocado por tres órdenes de magnitud, y como no había `step`, la validación nativa bloqueaba el envío sin JS.

**Ahora:** `money_without_currency | strip | replace: ' ', ''` más `step="any"`. El `step` sí resuelve el bloqueo del envío, eso es mejora real. Pero el `replace` solo quita espacios, así que en esa misma tienda el valor queda `1.234,56` intacto. Un `input type="number"` solo acepta punto decimal y ningún separador de miles, así que `1.234,56` es un valor **inválido**: el navegador ignora el `max` por completo, y el `value` se sanea a cadena vacía, o sea **un filtro de precio ya aplicado se renderiza como campo vacío** al paginar o recargar.

Un bug distinto, no menor. Dos notas honestas para que calibres la prioridad. Primero, el patrón original es el de Dawn, que tiene el mismo problema, así que probablemente no sea un disparador de rechazo duro. Segundo, la variante nueva pierde el valor aplicado, que el original no perdía.

La salida limpia es no pasar por `money_without_currency` y convertir a decimal con punto de forma independiente del locale, por ejemplo dividiendo `filter.range_max` entre 100 con un `divided_by: 100.0`. **Con una advertencia que hay que verificar antes de implementar:** en monedas de cero decimales como JPY y KRW esa división sería incorrecta. Esta es exactamente una fila que no debe ponerse en verde sin probarla en la tienda de desarrollo con un mercado en EUR y formato de coma decimal.

---

## 7. El hilo, para no perderlo

Orden de ejecución con las dependencias reales. Lo que no necesita a GPT va primero porque puede avanzar hoy.

| Orden | Trabajo | Dueño | Bloqueado por |
| --- | --- | --- | --- |
| 1 | Pegar las 25 claves de `CLAUDE-COPY-001` en `locales/en.default.json` | Cualquiera | Nada |
| 2 | Copiar `en.default.schema.propuesta.json` a `locales/` y aplicar los 275 reemplazos en los `.liquid` | Cualquiera | Decisión A |
| 3 | Tienda de desarrollo, `shopify theme push --unpublished`, importar el CSV y los 7 pasos manuales de `CLAUDE-QA-001` | Johandry | Nada |
| 4 | Las tres pasadas de Johandry: test de tres segundos, paseo de cliente, paseo de comerciante | Johandry | Paso 3 |
| 5 | Producir las páginas de docs y soporte en ruizdigital.com | Johandry | Decisión C |
| 6 | Verificación del nombre Couture | Johandry | Decisión B |
| 7 | Los 4 items de código del punto 4 de esta directiva | GPT | Tokens de GPT |
| 8 | Los 10 settings globales nuevos y el arreglo de `--radius-button` | GPT | Paso 7 |
| 9 | Hero dual y galería de PDP, según `CLAUDE-BLUEPRINT-001` | GPT | Paso 8 |
| 10 | Los 3 presets en `settings_data.json` | GPT | Paso 8 |
| 11 | Montar la demo store de Couture con `CLAUDE-DEMO-001` | Johandry y Claude | Fotografía con derechos |
| 12 | Demo stores de Studio y Archive, copy y catálogo | Claude | Paso 11 |
| 13 | Lighthouse, axe y el checklist de 18 pruebas de la auditoría | Gemini | Paso 9 |

Los pasos 1 a 6 no dependen de GPT. Si el hilo se pierde en algún punto, se recupera mirando en qué fila del ledger estamos, no releyendo la conversación.

**Un recordatorio sobre la ruta crítica.** El paso 4 tiene que ocurrir **antes** del paso 9. Si Johandry no ha visto el hero y la galería actuales en un teléfono, el sprint más caro que queda se va a especificar sobre algo que el dueño del proyecto nunca vio, y cualquier corrección estética después obliga a GPT a gastar dos veces.

---

## 8. Formato de respuesta

En `agent-comms/outbox-gemini/GEMINI-4B-002-estado-y-hilo.md`:

1. El ledger actualizado con el conteo `X / 44`, poniendo P0-6 y P0-8 en `cumplido` con su evidencia, y las demás filas de P0 en `parcial` con lo que falta en cada una.
2. Tu dictamen sobre las cuatro decisiones de la sección 6. En la A, presentada como decisión para Johandry y no resuelta por ti.
3. El plan de Fase 4 actualizado con las tres entregas de Claude marcadas como hechas, no como pendientes, y con dueño y fecha para las páginas de docs y soporte.
4. Si algo de esta directiva contradice tu lectura del repo, dilo con la evidencia en la mano antes de ejecutar. Dos veces en las últimas horas un informe de estado resultó estar equivocado, uno de Claude y uno del proyecto, y las dos veces lo que lo corrigió fue mirar los archivos.
