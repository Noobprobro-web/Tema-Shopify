# CLAUDE-REPORT-5C-003: Confirmación del parche integral de Gate 5 (Sprint 5C)

```text
ID: CLAUDE-REPORT-5C-003 (responde a CLAUDE-DIRECTIVE-5C-002, Parche Integral de Gate 5)
Estado: CONFIRMADO. El código de la directiva ya está en master y en la tienda, en los 4 temas.
  Yo no apliqué nada nuevo sobre el tema: cuando fui a aplicar la localización, ac14d08 ya la
  había commiteado. La verifiqué en laboratorio y en vivo y sale correcta. Sin commit ni push.
Base: master ac14d08 (sobre a1ab317). Tienda: Couture #165809488115 (main), Sartorial,
  Edition y Archive, leídas el 2026-09-23 a las 23:40 UTC.
Decisión requerida:
  1. Gemini: aceptar o descartar 5C-003-routes-root-url.diff (2 líneas). ac14d08 usa
     request.locale.root_url y la directiva pedía routes.root_url (§3, D1).
  2. Gemini y Johandry: registrar en la tienda las traducciones que ac14d08 ya añadió a
     scripts/translations/es.storefront.json y después retirar los 14 textos fijos en Liquid
     que las sustituyen. Hoy liquid-literals.py da 14 hallazgos; antes de ac14d08 daba 0 (§3, D2).
  3. Johandry: no commitear scripts/verify-live-5c-fixes.mjs tal como está. Lleva la contraseña
     del storefront en claro (§3, D3).
  4. GPT-6: repetir Gate 5 en vivo. El P1 de locale está corregido en los 4 temas (§2).
Resumen en 5 líneas:
  1. A: las dos tarjetas de Catalog apuntan a /es/collections/all en /es y a /collections/all en
     /, en los 4 temas. La tarjeta 1 es ahora manifesto-01.jpg (928 x 1152, 4:5) y el texto sale
     en español.
  2. B: el diff de 5C-002 está en a1ab317 y en vivo en los 4 temas: product-zoom fuera de la
     rejilla (hijos: product-gallery, variant-selects), focusin en theme.js y sizes nuevos.
  3. Laboratorio con el árbol ac14d08: links5c3 (nuevo, 6 tipos de enlace) pasa en /, /es y
     /en-ca; mega5c 13/13 en y es, live5c2 5/5, zoom5b 27/27.
  4. Estático en la carpeta de Johandry: Theme Check 122 archivos sin ofensas; node --check OK;
     gates json, hooks, locales, ledger y syntax en 0. liquid-literals: 14 hallazgos (D2).
  5. npm test no existe en package.json. test:visual necesita `shopify theme dev` en el puerto
     9292, así que no se ejecutó. En su lugar corrí los arneses 5B y 5C.
Archivos tocados en la carpeta: ninguno del tema. En agent-comms: este informe;
  harness-5C-003/5C-003-routes-root-url.diff; harness-5C-001/links5c3.spec.mjs (nuevo) y
  render5c.mjs (ROOT_URL y LOCALE_ROOT_URL para rutas localizadas, y páginas deployed.html y
  mega-links.html).
Desviaciones: ninguna mía. D1 a D3 son observaciones sobre ac14d08.
```

---

## 1. Qué pedía la directiva y dónde está

| Punto | Commit | Estado en la tienda |
|---|---|---|
| A. Enlaces de tarjeta localizados | ac14d08 (`snippets/mega-menu.liquid`) | Correcto en los 4 temas |
| B1. P1-A: ficha a dos columnas | a1ab317 (`sections/main-product.liquid`) | Correcto en los 4 temas |
| B2. P1-B: `focusin` en ThemeDisclosure | a1ab317 (`assets/theme.js`) | Presente en el theme.js servido (minificado por el CDN) de los 4 temas |
| B3. P2-A: `sizes` dinámico y 1100 w | a1ab317 (`snippets/mega-menu.liquid`) | `sizes` 15.1rem para manifesto-01 y 15rem para capsule-look; `srcset` de 240 a 1100 w |

ac14d08 también cambió `sections/announcement-bar.liquid` (mismo tratamiento del enlace), `sections/recently-viewed.liquid` (textos en español), `sections/header-group.json` (imagen de la tarjeta 1) y `scripts/translations/es.storefront.json` (8 entradas nuevas).

---

## 2. Verificación

### 2.1 En vivo (fetch con la sesión del storefront, `?preview_theme_id=` por tema)

```text
Tema        /es/ tarjetas                                   / tarjetas                         Ficha /es: hijos de la rejilla
Couture     /es/collections/all Novedades, Armario cápsula  /collections/all New Arrivals...   product-gallery, variant-selects
Sartorial   igual                                           igual                              igual
Edition     igual                                           igual                              igual
Archive     igual                                           igual                              igual
```

Imagen de la tarjeta 1 en los 4: `manifesto-01.jpg`. Anuncio en /es: `/es/collections/all`, "Envío de cortesía en pedidos superiores a $150". Recently viewed en /es: "Vistos recientemente" / "Piezas que has explorado". Al terminar dejé la sesión en el tema main.

### 2.2 Laboratorio (árbol = ac14d08, copiado de la carpeta y comparado por md5)

`links5c3.spec.mjs` es nuevo. Renderiza el `header-group.json` desplegado y un menú con 6 enlaces de tarjeta: `/collections/all`, `/pages/appointments`, un externo con `&`, uno de protocolo relativo `//`, `/es/pages/about` y `/eshop`.

```text
SITE / ROOT_URL                  links5c3   mega5c   live5c2   zoom5b
site-ac14      /                 2/2        13/13    5/5       27/27
site-ac14-es   /es               2/2        13/13
site-ac14-mkt  /en-ca            2/2
site-a1ab-es   /es (a1ab317)     0/2  (reproduce el P1 de GPT: /collections/all sin /es)
```

Con `/es` las rutas internas llevan `/es` delante. La externa, la de protocolo relativo y `/es/pages/about` salen intactas. `/eshop` pasa a `/es/eshop`: se compara el comienzo exacto de la ruta, no una subcadena. En el HTML el `&` sale como `&amp;`.

### 2.3 Estático (carpeta de Johandry, HEAD ac14d08)

```text
shopify theme check                   122 files inspected with no offenses found.
node --check theme.js, product-zoom.js OK
npm run gates:json|hooks|locales|ledger|syntax   exit 0 los cinco
liquid-literals.py .                  52 archivos Liquid, 14 hallazgos (D2)
```

No ejecuté `gates:sanity` ni `gates:package` en la carpeta.

---

## 3. Observaciones sobre ac14d08

**D1. `request.locale.root_url` en lugar de `routes.root_url` (P2).** La directiva y GPT-AUDIT-010 piden `routes.root_url`, que Shopify documenta para generar URL en tiendas con varios idiomas. `shop_locale.root_url` se documenta como "la URL raíz del idioma". No está documentado si incluye la subcarpeta de un mercado (`/en-ca`). Hoy la tienda solo tiene `/es`, donde los dos valores coinciden, y por eso en vivo sale bien. En laboratorio, si el idioma no llevara el prefijo del mercado (`ROOT_URL=/en-ca`, `LOCALE_ROOT_URL=/`), ac14d08 deja `/pages/appointments` sin prefijo. Con el diff, las 2 pruebas pasan. Aun así, ese comportamiento de Shopify es una suposición: no lo pude verificar. `harness-5C-003/5C-003-routes-root-url.diff` cambia esa línea en el mega menú y en el anuncio. Con el diff: links5c3 2/2 en `/es` y en el mercado simulado, mega5c 13/13 en español y Theme Check sin ofensas.

**D2. Textos fijos en Liquid (P2, regla del proyecto).** ac14d08 traduce en Liquid, cuando el locale es `es` y el texto coincide exactamente, los textos de demo de 3 archivos: el mega menú (4 textos), el anuncio (1) y recently viewed (2). El escáner de LOCALE-AUDIT-001 pasa de 0 a 14 hallazgos. Esto tiene tres problemas:
- Rompe la regla "cero textos quemados en Liquid".
- Solo funciona con el texto de la demo y con el código `es` exacto.
- Si un comerciante escribe "New Arrivals" a propósito, en español lo verá cambiado.

El camino que ya usa el proyecto es la base de traducciones. ac14d08 añadió las 8 entradas a `es.storefront.json`, así que basta con registrarlas: `node scripts/translate-storefront.mjs --store --apply --verify`. Es una escritura en la tienda, así que necesita la confirmación de Johandry. Después se pueden retirar los tres bloques de textos fijos. Me ofrezco a hacer las dos cosas si se autorizan.

**D3. `scripts/verify-live-5c-fixes.mjs` sin seguimiento con la contraseña en claro (P3, higiene).** El script escribe la contraseña del storefront en el campo del formulario. Si se commitea, la contraseña queda en el historial de Git, algo que OPUS-AUDIT-001 ya señaló en los docs. Propuesta: leerla de una variable de entorno, o no commitear el script.

**Nota menor.** Con manifesto-01.jpg (928 px de ancho), el `srcset` servido sigue anunciando 1100 w. Shopify no quita los anchos mayores que el original. El CDN devuelve la foto de 928 px con esa etiqueta, así que el navegador cree tener un poco más de densidad de la real. A 240 px CSS solo importa con DPR 4 o más. No hace falta tocar nada.

---

## 4. Afirmaciones falsables
1. En la tienda, con cualquiera de los 4 temas, las dos `.mega-menu__promo-card` de `/es/` tienen `href="/es/collections/all"`, y en `/` tienen `href="/collections/all"`.
2. En la ficha /es/products/qa5a-f04-colour-size de los 4 temas, los hijos de `.product-main__layout` son `product-gallery` y `variant-selects`.
3. El theme.js servido de los 4 temas contiene `this.listen(document,"focusin"`.
4. Con el árbol de a1ab317 y `ROOT_URL=/es`, `links5c3.spec.mjs` falla 2/2. Con el de ac14d08 pasa 2/2 en `/`, `/es` y `/en-ca`.
5. `python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .` en HEAD ac14d08 da 14 hallazgos en `announcement-bar.liquid`, `recently-viewed.liquid` y `mega-menu.liquid`.
6. `shopify theme check` en la carpeta de Johandry: 122 archivos sin ofensas.
