# CLAUDE-COPY-001: Strings faltantes de `locales/en.default.json` para los P0

```text
ID: CLAUDE-COPY-001
Autor: Claude (redacción editorial, rol asignado en docs/phase-4-plan.md)
Para: Johandry y Gemini. Aplicable por cualquiera, no consume tokens de GPT
Modo: READ-ONLY respetado. Esto es copy propuesto, no una sobreescritura del archivo
Fecha: 2026-09-13
```

## Por qué existe este documento

GPT-4A-001 escribió el Liquid de cuatro P0 y se quedó sin tokens antes de llegar a los locales, al CSS y al JS. El Liquid referencia **25 claves de traducción que no existen** en `locales/en.default.json`. Verificado comparando todas las claves `| t` de los archivos nuevos y modificados contra el archivo de locales.

Consecuencia inmediata: Theme Check ya no está en 0 ofensas, porque la regla `TranslationKeyExists` va a reportar las 25. Y cualquier string de esos que se renderice sale en pantalla como `Translation missing: en.default.<clave>`.

Redactar strings no necesita a GPT. Con su presupuesto de tokens agotado, lo peor que puede hacer el equipo es gastar los próximos tokens de GPT en copy. Esto lo absorbo yo a costo cero para él.

---

## 1. Bloques nuevos de primer nivel

Insertar como bloques hermanos de `general`, `sections`, `products`, etc. El orden alfabético dentro del archivo no afecta el funcionamiento, solo la legibilidad.

```json
"newsletter": {
  "eyebrow": "Private correspondence",
  "heading": "Notes from the atelier",
  "copy": "New objects, material studies and private previews, sent with restraint.",
  "email_label": "Email address",
  "email_placeholder": "name@example.com",
  "submit": "Subscribe",
  "success": "Thank you. Your first note will arrive soon.",
  "error_heading": "Please check your email address:"
},
"predictive_search": {
  "search_label": "Search",
  "placeholder": "Search products, materials and stories",
  "dialog_label": "Search the atelier",
  "results_label": "Search suggestions",
  "loading": "Searching",
  "no_results": "No suggestions yet. Press enter to search the full catalog.",
  "clear": "Clear search",
  "products": "Products",
  "collections": "Collections",
  "articles": "Journal",
  "pages": "Pages",
  "view_all": "View all results for \"{{ terms }}\""
}
```

## 2. Claves a insertar dentro de bloques existentes

### Dentro de `general`, como objeto nuevo junto a `navigation` y `search`

```json
"localization": {
  "country": "Country/region",
  "language": "Language",
  "update": "Update preferences"
}
```

### Dentro de `sections.footer`, junto a `copyright`

```json
"payment_methods": "Accepted payment methods"
```

### Dentro de `products.product`, junto a `media_gallery`

```json
"view_in_space": "View in your space"
```

---

## 3. Decisiones editoriales detrás de cada string, para que se puedan discutir

**`predictive_search.placeholder`** reusa exactamente el texto de `search.form.placeholder` ("Search products, materials and stories"). Deliberado: el buscador del header y el de la página de búsqueda son el mismo acto y decir dos cosas distintas hace que el tema se sienta hecho por dos personas.

**`predictive_search.dialog_label`** reusa `search.header.eyebrow` ("Search the atelier") por la misma razón.

**`predictive_search.articles`** dice "Journal", no "Articles", para ser consistente con `search.tabs.articles` y con `templates.blog.title`. Si en algún momento se decide sacar "Journal" a un setting (lo recomendé en la auditoría), estas tres claves se mueven juntas.

**`predictive_search.loading`** va sin puntos suspensivos. Los tres puntos en un `aria-live` los lee el lector de pantalla como "punto punto punto". Si se quiere el efecto visual, va con CSS, no en el string.

**`predictive_search.no_results`** dice qué hacer, no solo que no hay nada. "No suggestions yet" más la salida ("Press enter to search the full catalog") en vez de un callejón sin salida.

**`newsletter.submit`** dice "Subscribe" y no "Join the list" ni "Request access". Es terminología estándar de Shopify, que el requisito pide, y el registro elevado ya está puesto en el eyebrow y el heading. La sofisticación va en el texto que acompaña, no en el botón: un botón que no dice claramente qué hace es un botón que no se presiona.

**`newsletter.email_placeholder`** no repite el label. Un placeholder que duplica la etiqueta no aporta y desaparece al escribir. `name@example.com` muestra el formato esperado.

**`general.localization.country`** dice "Country/region" exactamente como lo dice Shopify. Aquí no hay espacio para voz de marca: es un control de sistema y el cliente lo busca por su nombre conocido.

**`general.localization.update`** dice "Update preferences" y no "Update". Ese botón solo aparece sin JavaScript, donde puede ser el único texto que acompaña a dos selects, así que tiene que decir qué actualiza.

**`sections.footer.payment_methods`** solo se usa en un `aria-label` y en un `visually-hidden`, o sea nunca se ve. Por eso es descriptivo y plano ("Accepted payment methods") y no editorial.

---

## 4. Claves que recomiendo agregar, pero todavía no

Estas tres las pedí en la auditoría y siguen haciendo falta, pero **ningún código las referencia aún**. Agregarlas ahora crearía claves huérfanas. Van en el mismo commit que el código que las use.

```json
"sections": { "cart": { "network_error": "We could not reach the store. Check your connection and try again." } }
"general": { "accessibility": { "error": "Error", "loading": "Loading" } }
```

`sections.cart.network_error` es la que cierra el hallazgo P1-13: hoy, si se cae la red al añadir al carrito, `showError(error.message)` imprime el "Failed to fetch" del navegador, en inglés y sin traducir, dentro del drawer.

---

## 5. Qué sigue necesitando tokens de GPT, y qué no

Reparto sugerido ahora que el presupuesto de GPT es el recurso escaso del proyecto.

**No necesita a GPT** y lo puedo entregar yo o cualquiera:

- Estos 25 strings.
- Los labels de schema renombrados y la traducción completa a claves `t:` (tabla lista en la sección 4.4 de `CLAUDE-BLUEPRINT-001`).
- Los `info` de cada setting con dependencia externa.
- El catálogo hostil de QA.
- El copy y el catálogo de las tres demo stores.

**Sí necesita a GPT**, y conviene que sus próximos tokens vayan solo a esto:

- El JavaScript de `<predictive-search>`. Hoy el elemento no está definido en `theme.js`, así que el markup existe y el comportamiento no: el ícono de lupa del header no hace nada al presionarlo.
- El JavaScript de `<localization-form>` para el auto-submit al cambiar de select. Sin él, el selector solo funciona con el botón de respaldo que hoy está marcado `no-js-only`, o sea invisible cuando hay JS.
- El CSS de los componentes nuevos. Cero reglas en `base.css` para `predictive-search`, `localization-form`, la sección de newsletter, los iconos de pago y `product-media`.
- Los cinco `| escape` del hallazgo P0-8.
- El `step` y el arreglo de formato en el filtro de precio (P0-7).
