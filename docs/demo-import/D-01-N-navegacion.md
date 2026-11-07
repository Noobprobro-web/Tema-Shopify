# D-01-N: navegación de las demos (creación manual de menús)

Plan: `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:302` (LV-26: menú con solo Home, Catalog y Contact). El criterio pide una navegación útil por preset, con enlaces y páginas reales. No basta con cambiar rótulos, y no se inventan destinos. Alcance según D23: entregable en el repo y la importación la hace Johandry.

## Directiva

Cada enlace apunta solo a destinos que crean los entregables de D-01: sus colecciones, tres páginas (About, FAQ, Contact) y las políticas de la tienda. `node scripts/demo-import.mjs check` falla si un enlace apunta a un destino no definido. El elemento de primer nivel se sigue llamando **Catalog** porque el mega menú está enganchado a ese título (`sections/header-group.json:31`, `menu_item: "Catalog"`). Si se renombra, se pierde la tarjeta promocional.

## Entregable

Los menús están en `docs/demo-import/data/<preset>.json` (clave `menus`). Shopify no importa menús, así que se crean a mano con esta tabla.

### Menú principal (`main-menu`)

| Sartorial | Imprint | Archive |
|---|---|---|
| **Catalog** → `/collections/all` | **Catalog** → `/collections/all` | **Catalog** → `/collections/all` |
| · New forms → `/collections/new-forms` | · Leather goods → `/collections/leather-goods` | · Permanent archive → `/collections/permanent-archive` |
| · Permanent collection → `/collections/permanent-collection` | · Daily objects → `/collections/daily-objects` | · Restored pieces → `/collections/restored-pieces` |
| · Tailoring → `/collections/tailoring` | · Desk and study → `/collections/desk-and-study` | |
| · Knitwear → `/collections/knitwear` | | |
| · Outerwear → `/collections/outerwear` | | |
| · Accessories → `/collections/accessories` | | |
| Tailoring → `/collections/tailoring` | Desk and study → `/collections/desk-and-study` | Restored pieces → `/collections/restored-pieces` |
| About → `/pages/about` | About → `/pages/about` | About → `/pages/about` |
| Contact → `/pages/contact` | Contact → `/pages/contact` | Contact → `/pages/contact` |

### Menú del pie (`footer`), igual en los tres presets

FAQ → `/pages/faq` · Contact → `/pages/contact` · Shipping policy → `/policies/shipping-policy` · Refund policy → `/policies/refund-policy` · Privacy policy → `/policies/privacy-policy` · Terms of service → `/policies/terms-of-service`

### Páginas que hay que crear

| Título | Handle | Plantilla del tema |
|---|---|---|
| About | `about` | `page.about` |
| FAQ | `faq` | `page.faq` |
| Contact | `contact` | `page.contact` |

## Pasos (Johandry)

1. Antes, crea las colecciones de D-01 (paso 3 de `D-01-catalogo-y-fotos.md`).
2. Tienda online > Páginas > Añadir página: crea las tres páginas, cada una con su handle y su plantilla.
3. Configuración > Políticas: rellena las cuatro políticas. Si alguna no se publica, quita su enlace del pie, porque sin ella el destino no existe.
4. Contenido > Menús > `main-menu`: crea los elementos de la tabla. Los hijos van anidados bajo **Catalog** y se arrastran dentro de él.
5. Contenido > Menús > `footer`: crea los seis enlaces.
6. Opcional, en el editor del tema (Encabezado > tarjeta promocional del mega menú): apunta `link_1` y `link_2` a las mismas colecciones que las imágenes `image_1`/`image_2` de `<preset>-photos.csv`. Hoy los dos enlaces van a `/collections/all`.
7. Recorre los enlaces en móvil y escritorio. Ninguno debe dar 404.

## Pendiente de Johandry

- Aprobar la arquitectura del menú, porque el plan exige «menú aprobado».
- Texto de las páginas About y FAQ. Las plantillas del tema traen contenido propio. GPT-REPORT-014 propone textos About y FAQ en inglés por preset, pero hay que contrastarlos con la política real de envíos, garantías y devoluciones.
- Contenido de las cuatro políticas: es legal y lo pone el comerciante.
