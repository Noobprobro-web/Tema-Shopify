# CLAUDE-REPORT-LOCALE-AUDIT-001: Inglés residual en /es, auditoría Liquid y traducciones en la tienda real

```text
ID: CLAUDE-REPORT-LOCALE-AUDIT-001 (responde a CLAUDE-TASK-LOCALE-AUDIT-001)
Estado: 196 traducciones registradas en la tienda real con translationsRegister, 0 errores,
        0 desfasadas. /es verificado página por página: 0 textos ingleses de origen visibles.
        Frente A encontró 1 literal en Liquid (del commit 9c46e2a, ya desplegado) y queda corregido
        en local. Gates verdes.
Decisión requerida:
  1. Gemini: revisar y commitear los 6 archivos de tema, los 2 de scripts/ y el arnés (§10).
     Desplegar el tema y después registrar las 4 traducciones que dependen del despliegue (§4.5).
  2. Gemini: autorizar el parche de Nivel 2 de §7.3 (page.contact.json y header-group.json).
     Sin él, 4 textos de /es/pages/contact y el enlace del anuncio siguen en inglés.
  3. Gemini y Johandry: decidir si vuelve el selector de país (§7.1). Riesgo de rechazo en la
     Theme Store para tiendas que venden en varios países.
  4. Johandry: validar las decisiones de voz nuevas de §3.2 (p. ej. "Punto" para Knitwear,
     "Sobre nosotros" para About, "Estilos" para presets en la documentación).
  5. Johandry: títulos de producto y textos alternativos de imágenes siguen en inglés. Son datos
     del catálogo: traducir con Translate & Adapt (§6.2) o autorizar que amplíe el script.
Resumen en 5 líneas:
  1. Frente A: el escáner (ahora con 4 barridos) halla en 46 archivos Liquid un único literal: snippets/localization-selectors.liquid:24 imprime la clave "sections.collection_template.filters_selected.one" sin | t y el texto "active". En vivo, el lector de pantalla lee "Español (sections.collection_template.filters_selected.one)". Corregido con la clave nueva general.localization.current_language.
  2. Frente B: scripts/translations/es.storefront.json guarda 169 entradas de plantilla, 23 títulos y el cuerpo de la política, cada una con su inglés de origen y su español.
  3. Frente C: scripts/translate-storefront.mjs registra solo si sha256(inglés) coincide con el digest vivo. Ejecutado vía Admin GraphQL: 196 traducciones en 43 recursos (7 plantillas, cabecera, 6 páginas, 18 enlaces, 7 colecciones, 4 menús), 0 userErrors.
  4. Verificación en vivo: 222 de 223 textos españoles esperados aparecen en el HTML de /es, más 1 en el endpoint de recomendaciones; el que falta es el botón del CTA de FAQ, que no se pintaba en ningún idioma porque le faltaba la URL (corregido en page.faq.json). 0 textos ingleses de origen en /es.
  5. Gates: gates:static exit 0 (Theme Check 87 archivos, 0 ofensas), inventario 0 sin resolver y 0 huérfanas en storefront, paridad es.json 375 claves y 0 problemas.
Archivos tocados: 6 modificados (+9 líneas, -2), 2 nuevos en scripts/, 1 carpeta de arnés nueva (§10).
Desviaciones (Nivel 1 o Nivel 2): 3 de Nivel 1 aplicadas (§8). 1 de Nivel 2 propuesta, no aplicada (§7.3).
Hallazgos extra (con parche listo): 8 (§7).
Verificación (comando, resultado y qué demuestra/qué no): §9.
Lista de afirmaciones falsables numeradas: §11.
```

---

## 1. Qué se hizo y con qué

- **Frente A.** Escáner propio `harness-LOCALE-001/liquid-literals.py` sobre `sections/`, `snippets/`, `layout/`, `templates/` y `blocks/`. Busca texto visible sin `| t` en nodos de texto, atributos que el comprador ve o escucha, literales dentro de etiquetas Liquid y, desde esta tarea, literales impresos por salidas `{{ }}`. Antes de dar por buena la versión, lo probé con un archivo mutado con 3 textos inyectados (los detectó los 3).
- **Frente B.** Traducción al español neutro y cuidado de todo el texto traducible que la tienda expone para las plantillas `index`, `page.about`, `page.contact`, `page.documentation`, `page.faq`, `page.support` y `product`, el anuncio de la cabecera, los títulos de páginas, enlaces, menús y colecciones, y el cuerpo de la página de envíos y devoluciones. Voz de MULTI-LANG: tú, "carrito", "Añadir", "envío de cortesía", "atelier".
- **Frente C.** Lectura de `translatableResources` en la tienda, comprobación de que el SHA-256 del inglés local coincide con el digest vivo en las 172 claves de texto, y registro con `translationsRegister` en 5 llamadas a la Admin API (cada una confirmada en el host). Después: relectura de `translations(locale: "es")` y comprobación en el HTML real de /es.
- **Frente D.** Los tres comandos de la tarea en una copia del repositorio byte a byte idéntica a la de Johandry: los 72 archivos del tema dan el mismo hash agregado (`34a19d03de3242a9b42f23089b9a5047`) en ambos lados.

---

## 2. Frente A: texto en inglés escrito a mano en Liquid

### 2.1 Resultado
```text
$ python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .     (antes de corregir)
snippets/localization-selectors.liquid | 24 | key-without-t | sections.collection_template.filters_selected.one
snippets/localization-selectors.liquid | 24 | output-literal | active
46 archivos Liquid, 2 hallazgos                                                   exit 1

$ python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .     (después)
46 archivos Liquid, 0 hallazgos                                                   exit 0
```
Es una sola línea con dos defectos. Llegó con el commit `9c46e2a` ("fix(a11y): expand language switcher tap target…"), posterior a mi última sincronización, y ya está desplegado.

### 2.2 El defecto
`snippets/localization-selectors.liquid:24` (versión de 9c46e2a):
```liquid
<span class="visually-hidden">{{ language.endonym_name | capitalize | escape }} ({{ 'sections.collection_template.filters_selected.one' | default: 'active' }})</span>
```
- La cadena no pasa por `| t`, así que se imprime la clave tal cual. El `default: 'active'` nunca actúa porque la cadena no está vacía.
- La clave además no existe en `en.default.json` ni en `es.json`, y aun existiendo sería una clave de filtros con `{{ count }}`.
- Ninguna compuerta lo veía: el inventario solo mira lo que pasa por `| t` y Theme Check no marca literales.

Comprobado en la tienda real (HTML de `/` y `/es`, 2 selectores por página, cabecera y menú móvil):
```text
"/":   ["English (sections.collection_template.filters_selected.one)", …]
"/es": ["Español (sections.collection_template.filters_selected.one)", …]
```

### 2.3 Corrección
`snippets/localization-selectors.liquid:24-25`:
```liquid
{%- assign active_language_name = language.endonym_name | capitalize -%}
<span class="visually-hidden">{{ 'general.localization.current_language' | t: language: active_language_name }}</span>
```
- `locales/en.default.json:35`: `"current_language": "Current language: {{ language }}"`
- `locales/es.json:35`: `"current_language": "Idioma actual: {{ language }}"`
- Sin `| escape` previo: el filtro `t` ya escapa las variables interpoladas y escapar dos veces rompería un endónimo con "&".

Render del fragmento con liquidjs (`harness-LOCALE-001/render-selector.mjs`):
```text
antes:   en → "English (sections.collection_template.filters_selected.one)"   es → "Español (sections.collection_template.filters_selected.one)"
después: en → "Current language: English"                                      es → "Idioma actual: Español"
```

### 2.4 El punto ciego del escáner
La versión que usé en MULTI-LANG solo marcaba literales con espacio o mayúscula dentro de `default:` y trataba cualquier `a.b.c` en minúscula como una clave legítima. Por eso no habría visto este caso. El barrido 4 nuevo marca:
- una clave de traducción impresa sin `| t`;
- un `default:`/`append:`/`prepend:` con letras cuando la salida está en un nodo de texto.

Los `default:` dentro de atributos o de CSS (`'#F7F3EA'`, `'scheme-1'`, `'subtle'`) no cuentan: no son texto de lectura. En el tema actual este barrido da 0 falsos positivos.

---

## 3. Frente B: traducciones

### 3.1 Dónde están
`scripts/translations/es.storefront.json` (819 líneas). Cada entrada lleva el inglés de origen y el español, para que Gemini y GPT puedan revisar las dos columnas sin abrir la tienda.

| Origen | Entradas | Vivas hoy | Pendientes de despliegue |
| :--- | ---: | ---: | ---: |
| `index.json` | 52 | 50 | 2 (`brand_manifesto.button_label`, `bento_editorial.link_label`) |
| `page.about.json` | 15 | 15 | 0 |
| `page.contact.json` | 18 | 14 | 4 (requieren el parche de §7.3) |
| `page.documentation.json` | 35 | 35 | 0 |
| `page.faq.json` | 23 | 22 | 1 (`cta.button_url`) |
| `page.support.json` | 19 | 18 | 1 (`sla`) |
| `product.json` | 5 | 5 | 0 |
| `sections/header-group.json` | 2 | 1 | 1 (enlace del anuncio, parche de §7.3) |
| Títulos (páginas, enlaces, menús, colecciones) | 23 | 23 (usadas en 35 recursos) | 0 |
| Cuerpo de `/pages/policy` | 1 | 1 | 0 |

No se traducen, a propósito:
- las 9 anclas de la documentación (`quick-start`, `presets`…), que son ids y destinos del índice;
- el nombre de archivo `Sartorial-1.0.0.zip`;
- las 6 imágenes;
- los nombres propios de los estilos (Sartorial, Edition, Archive);
- los handles de páginas y colecciones. Traducirlos cambiaría las URL y rompería los enlaces escritos a mano.

`page.policy.json` no tiene ajustes de texto: su contenido es el cuerpo de la página, traducido como recurso `PAGE`.

### 3.2 Decisiones de voz nuevas (para validar)
| Inglés | Español | Motivo |
| :--- | :--- | :--- |
| Knitwear | Punto | Término de oficio en moda; "Tejidos" confunde con telas. |
| Outerwear | Prendas de abrigo | "Abrigos" deja fuera gabardinas y chaquetas. |
| About | Sobre nosotros | Neutro en toda la región. Alternativa de marca: "La casa". |
| Theme presets | Estilos del tema | Es el nombre que usa el editor de Shopify en español. |
| Made-to-order work is final sale | Los trabajos por encargo no admiten devolución | Coherente en FAQ, ficha y política. |
| Head of atelier | Dirección del atelier | Evita marcar género en una cita sin nombre. |
| $150 | $150 | Se mantiene el formato de la tienda (USD); igual que en el anuncio. |

Términos coherentes en las 4 fuentes que hablan de envío (FAQ, contacto, ficha, política): "tres días hábiles", "catorce días", "envío de cortesía", "trabajos por encargo".

### 3.3 URL escritas a mano
5 ajustes `url` guardan rutas escritas a mano (`/collections/all`, `/pages/about`…). Shopify no les pone el prefijo de idioma, así que en /es sacaban al comprador del español. Se traducen a `/es/...`. Verificado: los botones del hero en /es apuntan a `/es/collections/all` y `/es/collections/the-autumn-series`. Esto depende de que el español se sirva en `/es` del dominio principal. Si algún día el español va en un dominio propio, hay que cambiar esas 5 entradas.

---

## 4. Frente C: registro en la tienda real

### 4.1 El script
`scripts/translate-storefront.mjs` (219 líneas, Node 18+, sin dependencias):

| Modo | Qué hace |
| :--- | :--- |
| `--check` | Sin red. Compara cada inglés del diccionario con la plantilla local; exige mismas etiquetas HTML en inglés y español; falla si una traducción está vacía o es igual al inglés. |
| `--snapshot <json>` | Planifica contra una instantánea de `translatableResources`. |
| `--store <tienda> [--apply] [--verify]` | Lee la tienda con `SHOPIFY_ADMIN_TOKEN`, registra y relee `translations(locale)` comparando valor y `outdated`. |
| `--emit <carpeta>` | Escribe cada lote como documento GraphQL con variables, listo para ejecutar desde cualquier cliente. |

Regla de seguridad (`translate-storefront.mjs:112`): una traducción solo se envía si `sha256(inglés del diccionario) === digest vivo`. Si alguien cambia el inglés en el editor, la entrada sale como "desfasada" y no se registra encima de un texto que ya no dice lo mismo. Comprobé antes que el digest de Shopify es exactamente el SHA-256 hexadecimal del valor: `sha256("Cart drawer") = 0b49755053c1…`, igual al de la tienda.

### 4.2 Ejecución
Esta sesión no tiene un token de Admin propio, así que los lotes que emite el script (`--emit`) se ejecutaron con la conexión Admin GraphQL de la sesión. Cada llamada la confirmó el host.

| Llamada | Recursos | Traducciones | userErrors |
| :--- | :--- | ---: | ---: |
| 1 | plantilla `index` | 50 | 0 |
| 2 | `page.about`, `page.contact` | 29 | 0 |
| 3 | `page.documentation`, `page.faq` | 57 | 0 |
| 4 | `page.support`, `product`, `header-group`, 6 páginas, 18 enlaces, 6 colecciones, 4 menús | 59 | 0 |
| 5 | colección "Home page" (detectada en la verificación de §5) | 1 | 0 |
| **Total** | **43 recursos** | **196** | **0** |

Los lotes 1 a 3 de `harness-LOCALE-001/batches/` son idénticos a lo ejecutado. El lote 4 del arnés ya incluye la colección de la llamada 5, porque se añadió al diccionario después.

### 4.3 Relectura en la Admin API
`translatableResourcesByIds` con `translations(locale: "es") { key outdated }` sobre los 43 recursos devuelve 196 claves, todas con `outdated: false`. Por recurso: index 50, about 15, contact 14, documentation 35, faq 22, support 18, product 5, header-group 1, páginas 7 (6 títulos y 1 cuerpo), enlaces 18, colecciones 7, menús 4.

### 4.4 Qué no cubre la base de traducciones
- Un ajuste que no está escrito en la plantilla usa el valor por defecto del esquema. Ese texto no existe como contenido traducible y sale en inglés en cualquier idioma. `harness-LOCALE-001/schema-defaults.py` encontraba 14 en todo el tema antes de esta tarea (hoy 11, tras declarar los 3 de §8). Los 8 que afectan a las páginas de la tarea están en el diccionario como `pending_deploy`: 3 se resuelven con los cambios locales de §8 y 5 con el parche de §7.3. La novena entrada pendiente (`cta.button_url`) no era un valor por defecto sino un ajuste que faltaba.
- Los restantes (eyebrow de `list-collections`, `blog` y 4 textos de `password`) están fuera del alcance de esta tarea. Se resuelven igual si se quiere.

### 4.5 Después del despliegue de Gemini
Cuando las plantillas con los valores explícitos estén en la tienda, Shopify crea las claves nuevas. Para registrarlas:
```bash
SHOPIFY_ADMIN_TOKEN=… node scripts/translate-storefront.mjs --store tema-qkqpke0j.myshopify.com --apply --verify
```
Es idempotente: vuelve a enviar las 196 con el mismo valor y añade las nuevas. También puedo hacerlo yo desde aquí con la conexión Admin, como en §4.2. Resultado esperado: 200 traducciones, 0 desfasadas; 205 si antes se aplica el parche de §7.3.

---

## 5. Evidencia en la tienda real (/es)

`harness-LOCALE-001/verify-es-storefront.js`, ejecutado en la tienda. Descarga el HTML de cada página /es, calcula el SHA-256 del texto de cada elemento y de cada `href`, y lo cruza con las huellas que `verify-expected.py` saca del diccionario:
- unidades españolas esperadas: cada párrafo, cada ítem de lista, cada título, cada texto corto y cada URL traducida;
- unidades inglesas de origen, que no deben aparecer.

| Página | Estado | `lang` | Español esperado | Encontrado | Inglés de origen visible |
| :--- | :--- | :--- | ---: | ---: | ---: |
| `/es` | 200 | es | 64 | 64 | 0 |
| `/es/pages/about` | 200 | es | 16 | 16 | 0 |
| `/es/pages/contact` | 200 | es | 15 | 15 | 0 |
| `/es/pages/documentation` | 200 | es | 53 | 53 | 0 |
| `/es/pages/faq` | 200 | es | 23 | 22 | 0 |
| `/es/pages/support` | 200 | es | 23 | 23 | 0 |
| `/es/pages/policy` | 200 | es | 14 | 14 | 0 |
| `/es/products/bias-cut-slip-dress` | 200 | es | 9 | 8 | 0 |
| `/es/collections` | 200 | es | 6 | 6 | 0 |

Los dos que faltan:
- **FAQ, "Escribe al atelier".** El botón no se pinta en ningún idioma: `main-faq.liquid:134` exige `button_label` y `button_url`, y la plantilla solo tenía la etiqueta. Comprobado en `/pages/faq`: tampoco existe en inglés. Corregido en §8.
- **Ficha, "Continúa el estudio".** Las recomendaciones llegan por `fetch`. En su endpoint (`/es/recommendations/products?section_id=template--23525538070771__recommendations…`) el eyebrow es "Continúa el estudio" y el título "También te puede interesar".

Otras comprobaciones en vivo:
- Menú principal en /es: Inicio, Catálogo (Prendas de abrigo, Punto, Sastrería, Accesorios, La serie de otoño, La colección permanente), Contacto, con `href` en `/es/…`.
- Pie en /es: Buscar, Sobre nosotros, Preguntas frecuentes, Envíos y devoluciones, Documentación, Soporte, Tus opciones de privacidad.
- Anuncio en /es: "Envío de cortesía en pedidos superiores a $150".
- `/` y `/pages/faq` siguen en inglés sin cambios (`lang="en"`, h1 "Form in quiet movement", "Frequently asked questions").

---

## 6. Lo que sigue en inglés en /es

### 6.1 Barrido de palabras inglesas en 12 páginas /es
Incluye carrito y búsqueda. Tras descartar falsos positivos por palabras compartidas ("color", "en"), queda:

| Texto | Dónde | Por qué | Estado |
| :--- | :--- | :--- | :--- |
| "Read our process", "Explore the story" | `/es` | valor por defecto del esquema | resuelto en local (§8), registrar tras desplegar |
| "Average response time: under 24 business hours" | `/es/pages/support` | valor por defecto del esquema | resuelto en local (§8), registrar tras desplegar |
| 4 textos de cabecera de contacto | `/es/pages/contact` | valor por defecto del esquema | parche Nivel 2 (§7.3) |
| Títulos de producto ("Bias-Cut Slip Dress"…) | tarjetas y fichas | dato del catálogo | §6.2 |
| Textos alternativos de imágenes de producto y colección | `/es`, ficha, `/es/collections` | dato del catálogo | §6.2 |
| "Tema" en el `<title>` | todas | nombre de la tienda | pendiente de Johandry desde 4F-002 |

Las descripciones de producto y de colección ya estaban en español en la tienda.

### 6.2 Catálogo: procedimiento con Translate & Adapt
1. Admin → Configuración → Idiomas → Español → Localizar (abre Translate & Adapt).
2. Productos: traducir **Título** de cada producto. Opcional: tipo de producto y opciones si se muestran.
3. Contenido multimedia de cada producto y colección: traducir el **texto alternativo** de cada imagen.
4. Guardar. No hace falta publicar nada: /es lo muestra al momento.

Alternativa sin app: ampliar `translate-storefront.mjs` con los tipos `PRODUCT` y `MEDIA_IMAGE` y un bloque de títulos y alt en el diccionario. No lo hice porque es contenido del comerciante, no del tema, y la tarea no lo pide.

---

## 7. Hallazgos extra (con parche listo)

### 7.1 El selector de país desapareció (riesgo Theme Store)
Desde `c2bb9d9`, `localization-selectors.liquid` solo ofrece idioma. Un comprador de una tienda que vende en varios países ya no puede elegir país ni moneda. Los requisitos de la Theme Store piden que el tema permita cambiar de país y moneda cuando el comerciante vende en varios mercados.

Además, `:43-45` deja un `<span class="visually-hidden">Country/region</span>` suelto que no etiqueta nada: el lector de pantalla lee "País o región" en mitad del grupo de idioma.

Parche (Nivel 2, decisión de diseño de Gemini), en lugar de las líneas 42-44:
```liquid
{%- if localization.available_countries.size > 1 -%}
  <label class="visually-hidden" for="{{ localization_form_id }}-country">{{ 'general.localization.country' | t }}</label>
  <select id="{{ localization_form_id }}-country" class="localization-form__country" name="country_code" onchange="this.form.requestSubmit()">
    {%- for country in localization.available_countries -%}
      <option value="{{ country.iso_code }}"{% if country.iso_code == localization.country.iso_code %} selected{% endif %}>{{ country.name | escape }} ({{ country.currency.iso_code }} {{ country.currency.symbol }})</option>
    {%- endfor -%}
  </select>
{%- endif -%}
```
Queda fuera del `role="group"` de idioma. No añade claves nuevas: `general.localization.country` ya existe en ambos idiomas.

### 7.2 El CTA de FAQ nunca se mostró (error mío de 4F-002)
En 4F-002 escribí `page.faq.json` con `button_label` y sin `button_url`, y `main-faq.liquid:134` exige los dos. Corregido en `templates/page.faq.json:84` con `"button_url": "/pages/contact"`. La traducción `/es/pages/contact` ya está en el diccionario. Esto sí cambia lo que se ve: aparece el botón "Contact the atelier" en inglés y "Escribe al atelier" en español.

### 7.3 Valores por defecto que no se pueden traducir (parche Nivel 2)
`harness-LOCALE-001/patch-template-defaults-level2.diff`:
- declara en `page.contact.json` los 4 ajustes que hoy salen del esquema (eyebrow, intro, horario, dirección del showroom);
- declara en `header-group.json` el enlace del anuncio.

Los valores son exactamente los del esquema (comprobado por script), así que en inglés no cambia nada. Es Nivel 2 solo porque esos dos archivos no están entre las páginas de la tarea. Tras aplicarlo y desplegar, el script registra las 5 traducciones que ya están en el diccionario.

### 7.4 Colección de prueba visible
La colección "Prueba" (`gid://shopify/Collection/475593212147`) aparece en `/collections` y `/es/collections`. Recomendación para Johandry: quitarla del canal Tienda online. No la toqué.

### 7.5 El diagnóstico citaba textos que no existen
"The Atelier Craft" y "Autumn in Motion" no aparecen en `templates/index.json` (0 coincidencias) ni en la tienda. Todos los titulares reales de la portada están traducidos (§5, 64/64).

### 7.6 Handles sin traducir, a propósito
Las URL siguen siendo `/es/pages/faq`, `/es/collections/outerwear`… Traducir handles (p. ej. `/es/pages/preguntas-frecuentes`) mejora el SEO en español, pero obliga a cambiar las 5 URL escritas a mano y cualquier enlace externo. Si se quiere, es una línea por handle en el diccionario más esas 5 URL.

### 7.7 Durabilidad tras cada despliegue
Las traducciones de plantilla viven en la base de datos de Shopify, no en archivos: `theme pull` no las trae y `theme push` no las borra mientras la clave y el inglés sigan iguales. Si alguien edita un texto inglés, esa traducción queda `outdated` y el script la marca como desfasada. Conviene correr `--verify` después de cada despliegue que toque plantillas.

### 7.8 Nombre de la tienda
El `<title>` de todas las páginas termina en "– Tema". El cambio a "LINEA NOVE" sigue pendiente desde 4F-002: requiere que Johandry inicie sesión en el admin.

---

## 8. Desviaciones

**Nivel 1, aplicadas:**
1. **Valores explícitos iguales al esquema** en `templates/index.json:150` (`button_label`), `templates/index.json:174` (`link_label`) y `templates/page.support.json:78` (`sla`). Sin cambio visible en inglés. Hacen traducibles tres textos que hoy salen en inglés en /es.
2. **`templates/page.faq.json:83-84`**: `button_url` del CTA (§7.2). Cambia lo visible: aparece un botón que antes nunca se pintaba.
3. **Registros más allá de la lista literal de la tarea:**
   - la plantilla de contacto (14);
   - las 7 colecciones (títulos);
   - los enlaces de cuenta y privacidad (3);
   - los títulos de los 4 menús.

   Entran en "menús" y "secciones clave de la tienda" y se ven en /es.

**Nivel 2, propuesta sin aplicar:** §7.3. El selector de país (§7.1) es decisión de Gemini.

---

## 9. Verificación

| Comando | Resultado | Qué demuestra | Qué no demuestra |
| :--- | :--- | :--- | :--- |
| `npm run gates:static` | exit 0. JSON 41 archivos 0 fallos; Theme Check "87 files inspected with no offenses found"; paquete `Sartorial-1.0.0.zip` | Que el tema sigue válido con la clave nueva y las plantillas editadas | Que las traducciones de la tienda estén bien |
| `node scripts/locale-key-inventory.mjs` | "Sin resolver en storefront: 0", "Huerfanas en storefront: 0", 375 hojas en en.default.json, "OK: todas las referencias estaticas resuelven" | Que `general.localization.current_language` existe y se usa | Las 62 huérfanas de schema, que son anteriores y no cambian |
| `node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .` | "es.json: 375 claves, 0 problemas" | Paridad de claves, variables y HTML entre inglés y español | Calidad de la traducción |
| `python3 …/harness-LOCALE-001/liquid-literals.py .` | "46 archivos Liquid, 0 hallazgos" (antes de corregir: 2) | Que no queda texto visible escrito a mano en Liquid bajo los 4 patrones | Texto construido en JavaScript (theme.js se barrió en MULTI-LANG, sin cambios desde entonces) |
| `node scripts/translate-storefront.mjs --check` | "160 … coinciden, 4 listas para registrar tras el despliegue, 5 requieren declarar el valor en la plantilla … 0 problemas" | Que el diccionario encaja con las plantillas locales y respeta el HTML | Nada sobre la tienda |
| `node scripts/translate-storefront.mjs --snapshot …/live-snapshot-2026-09-22.json --theme-id 165809488115 --emit …` | "196 traducciones en 43 recursos … 0 desfasadas, 0 sin traducción, 9 sin clave viva" | Que el plan cubre todo el texto traducible vivo | La instantánea se reconstruyó a partir de las claves y digests vivos transcritos más los valores locales. Por eso la prueba fuerte es §4.2 y §4.3 |
| 5 × `translationsRegister` | 196 traducciones, 0 userErrors | Shopify aceptó cada digest: el inglés de origen coincide con el vivo | Que el valor español no tenga erratas: eso lo prueba §5 |
| `translatableResourcesByIds … translations(locale:"es") { key outdated }` | 196 claves, 0 `outdated` | Que están guardadas y al día | |
| `verify-es-storefront.js` en la tienda | 222/223 más 1 por endpoint, 0 inglés de origen | Que el español registrado es exactamente el del diccionario y se ve en /es | Textos del catálogo (§6) |
| `render-selector.mjs` | antes: literal de clave; después: "Idioma actual: Español" | Que la corrección del Frente A produce el texto correcto en ambos idiomas | El render real de Shopify, que llegará con el despliegue |

---

## 10. Archivos

**Modificados** (idénticos en la carpeta de Johandry y en mi copia de trabajo; hashes MD5):

| Archivo | Líneas | MD5 |
| :--- | :--- | :--- |
| `snippets/localization-selectors.liquid` | 24-25 | `3ae8617158624d81bf562e2f5625dba0` |
| `locales/en.default.json` | 35 | `ea6cb857d0ec7edd7f37f4f76e19fe71` |
| `locales/es.json` | 35 | `743c116fad8a57990f6f471661cb6c1f` |
| `templates/index.json` | 150, 174 | `70dfe65c155ddbdc5aebfb321acb2a84` |
| `templates/page.faq.json` | 83-84 | `1888319e7252646a9d22b2ba8ef8ed1b` |
| `templates/page.support.json` | 78 | `0a4488b59c2b9304d6fd7590c2998a30` |

**Nuevos:**
- `scripts/translate-storefront.mjs` (219 líneas, `047e73705d999915ebf9af406b32c38c`)
- `scripts/translations/es.storefront.json` (819 líneas, `c6e76137d5b8ca45fe8e0f67505962bd`)
- `agent-comms/outbox-claude/harness-LOCALE-001/`:

| Archivo | Contenido |
| :--- | :--- |
| `liquid-literals.py` | escáner del Frente A, 4 barridos |
| `render-selector.mjs` | render antes/después del selector (usa liquidjs solo en el arnés) |
| `live-keys-2026-09-22.txt` | claves y prefijos de digest vivos transcritos |
| `live-snapshot-2026-09-22.json` | instantánea para `--snapshot` |
| `schema-defaults.py` | ajustes que salen del valor por defecto del esquema (§4.4) |
| `batches/batch-1..4.graphql` y `.variables.json` | lotes emitidos por el script |
| `check.log`, `plan.log` | salidas de `--check` y del plan |
| `verify-expected.py`, `verify-es-storefront.js`, `verify-labels.json` | verificación en /es |
| `patch-template-defaults-level2.diff` | parche de §7.3 |

Sin commit ni push.

---

## 11. Afirmaciones falsables

1. `python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .` imprime "46 archivos Liquid, 0 hallazgos" y sale con 0.
2. Con la versión de `snippets/localization-selectors.liquid` de `9c46e2a`, el mismo comando imprime 2 hallazgos en la línea 24 y sale con 1.
3. En la tienda en vivo, antes del próximo despliegue, `.localization-form__item.is-active .visually-hidden` contiene "(sections.collection_template.filters_selected.one)" en `/` y en `/es`.
4. `locales/en.default.json` y `locales/es.json` tienen 375 hojas cada uno y `general.localization.current_language` en la línea 35 de ambos.
5. `npm run gates:static` sale con 0 y Theme Check informa 0 ofensas.
6. `node scripts/locale-key-inventory.mjs` informa 0 sin resolver y 0 huérfanas en storefront.
7. `node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .` imprime "es.json: 375 claves, 0 problemas".
8. `node scripts/translate-storefront.mjs --check` sale con 0 e informa 160 entradas coincidentes, 4 listas tras el despliegue y 5 que requieren parche de plantilla.
9. Para las 172 claves de texto vivas de las 7 plantillas y la cabecera, el SHA-256 del valor en las plantillas locales coincide con el digest que devuelve `translatableResources`.
10. `translatableResourcesByIds` sobre los 43 recursos de §4.3 devuelve 196 traducciones `es`, ninguna con `outdated: true`.
11. En `/es`, el h1 es "La forma en movimiento sereno" y el primer botón del hero apunta a `/es/collections/all`.
12. En `/es/pages/faq` aparecen las 7 preguntas en español y no aparece "When will my order be dispatched?".
13. `/es/pages/policy` muestra los 6 subtítulos "Preparación del pedido", "Envío", "Devoluciones", "Reembolsos", "Cambios" y "Artículos dañados o incorrectos".
14. En la ficha de producto en /es, los acordeones se titulan "Composición y cuidados" y "Envío y devoluciones de cortesía".
15. `/es/collections` lista "Página de inicio" y no "Home page".
16. En `/` y `/pages/faq` el contenido sigue en inglés ("Form in quiet movement", "Frequently asked questions").
17. `/pages/faq` no contiene hoy ningún `.main-faq__cta-button`. Tras desplegar `templates/page.faq.json`, contiene uno que apunta a `/pages/contact`.
18. Los valores de `patch-template-defaults-level2.diff` son idénticos a los `default` del esquema de `main-contact` y del bloque `announcement`.
19. Los 72 archivos del tema en la carpeta de Johandry y en la copia donde corrí los gates tienen el mismo hash agregado `34a19d03de3242a9b42f23089b9a5047` (`find assets config layout locales sections snippets templates -type f | sort | xargs md5sum | md5sum`).
20. "The Atelier Craft" y "Autumn in Motion" aparecen 0 veces en `templates/index.json`.
