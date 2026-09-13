# Entrega GPT-3B-004: Paginas de Contenido, Sistema y Cierre de Plantillas

```text
ID: GPT-3B-004
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: revisar la implementacion y autorizar commit/push antes del siguiente sprint.
```

## Resumen en 5 lineas

1. Las ocho plantillas pendientes ahora montan secciones reales Couture y `main-placeholder` queda sin referencias en `templates/*.json`.
2. Contacto, comentarios, busqueda, newsletter y acceso por contrasena usan formularios nativos y conservan una ruta funcional sin JavaScript.
3. Blog, articulo, pagina, 404 y directorio de colecciones incorporan jerarquia editorial, contenido configurable y reutilizacion de snippets existentes.
4. FAQ y modal de contrasena se implementaron como Web Components sobre `ThemeCore.ThemeElement`, con listeners limpiables, foco controlado e `inert`.
5. El estado final pasa JavaScript, JSON, schemas, traducciones, smoke responsive y Shopify Theme Check con 0 ofensas.

## Archivos creados

- `sections/main-page.liquid`
- `sections/main-contact.liquid`
- `sections/main-blog.liquid`
- `sections/main-article.liquid`
- `sections/main-search.liquid`
- `sections/main-404.liquid`
- `sections/main-password.liquid`
- `sections/main-list-collections.liquid`
- `agent-comms/outbox-gpt/GPT-3B-004-content-and-system-templates.md`

## Archivos modificados

- `templates/page.json`
- `templates/page.contact.json`
- `templates/blog.json`
- `templates/article.json`
- `templates/search.json`
- `templates/404.json`
- `templates/password.json`
- `templates/list-collections.json`
- `assets/base.css`
- `assets/theme.js`
- `locales/en.default.json`

## Implementacion

### Paginas institucionales

- `main-page` ofrece titulo, eyebrow, introduccion y lectura estrecha, mas bloques OS 2.0 de imagen, cita y firma de atelier.
- `main-contact` incorpora formulario `contact`, datos del estudio, FAQ nativo con `details/summary` y contactos directos configurables.
- Estados exitosos usan `role="status"`; errores de formularios usan `role="alert"`, `aria-invalid` y asociaciones descriptivas.

### Revista y articulo

- `main-blog` incluye ensayo destacado, tags de filtro, tiempos de lectura, grilla editorial y paginacion.
- `main-article` conserva titulo completo, autor, fecha, tiempo de lectura, hero con caption, pull quotes y productos editoriales.
- Comentarios nativos se muestran y paginan; el formulario `new_comment` contempla moderacion, errores y valores persistidos.

### Busqueda y recuperacion

- `main-search` reutiliza `<facet-filters-form>` con filtros `search.filters`, ordenamiento, conteo y mejora progresiva mediante GET.
- Los tipos All, Products, Journal y Pages tienen URLs navegables; productos reutilizan `product-card` y el resto usa tarjetas editoriales.
- `main-404` integra busqueda, retorno al catalogo y productos recomendados con fallback a la coleccion `all`.

### Password y colecciones

- `main-password` usa `customer` para lista de espera y `storefront_password` dentro de un drawer/modal accesible.
- Con JavaScript, el modal controla Escape, click exterior, trap de foco, restauracion de foco, `aria-modal` e `inert`; sin JavaScript, el formulario permanece visible y operable en flujo normal.
- `main-list-collections` pagina el directorio y usa imagen de coleccion, con fallback a la primera imagen de producto.

### Sistema visual y localizacion

- Se anadieron layouts responsive Couture, lectura editorial, formularios de 52px, targets minimos de 44px, FAQ, resultados, 404 y password.
- Toda cadena estatica del storefront agregada por el sprint usa `| t`; el schema del editor conserva el patron en ingles ya establecido por el tema.
- No se agregaron dependencias, Sass/SCSS ni cambios fuera de los archivos autorizados.

## Validaciones

```text
node --check assets/theme.js
PASS (exit 0)

npx shopify theme check
PASS: 52 archivos inspeccionados, 0 ofensas

Auditoria JSON global
PASS: 22 archivos JSON parseados

Auditoria de schemas Liquid
PASS: 24 bloques {% schema %} parseados

Auditoria de traducciones Liquid
PASS: 347 referencias estaticas, 259 claves unicas, 0 ausentes

Auditoria de plantillas
PASS: 8/8 plantillas apuntan a su seccion real
PASS: 0 referencias a main-placeholder en templates/*.json

git diff --check
PASS; solo avisos informativos LF -> CRLF de Windows

Smoke test responsive con Chrome
PASS: 375, 390, 768, 1024 y 1440 px
0 errores de pagina, 0 overflow horizontal y 0 targets auditados menores de 44px
FAQ single-open y aria-expanded sincronizados
Modal: foco inicial/restaurado, Escape/cierre, body lock e inert correctos
No-JS: formulario de contrasena visible, estatico y operable
```

## Riesgos y siguiente accion

- Hacer un smoke test en una tienda Shopify conectada con filtros configurados, comentarios activos/moderados, errores reales de formularios y password incorrecto/correcto.
- La calidad visual final depende de imagenes, extractos y contenido merchant; conviene revisar estados con datos vacios, largos y reales desde el Theme Editor.
- Gemini debe revisar el diff y la evidencia antes de autorizar commit/push.
- No se realizo commit ni push.
