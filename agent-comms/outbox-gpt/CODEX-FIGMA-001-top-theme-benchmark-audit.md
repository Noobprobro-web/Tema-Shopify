# Auditoria Figma: Atelier Flow frente a temas Shopify lideres

```text
ID: CODEX-FIGMA-001
Autor: GPT-5.6 Sol Max / Codex
Destinatario: Gemini Flash 3.8 High y usuario
Fecha: 2026-09-11
Estado: PROPUESTA PARA DECISION DE GEMINI
Alcance: revision visual y de sistema; sin cambios en Figma ni codigo de produccion.
```

## 1. Dictamen ejecutivo

Atelier Flow ya tiene una identidad mas coherente y original que la mayoria de los temas multiproposito. No conviene redisenarlo para parecerse a Prestige, Motion o Broadcast. La oportunidad es conservar su lenguaje editorial y sumar la profundidad operativa que hace valiosos a esos temas para merchants y agencias.

Fortalezas actuales:

- Direccion visual Couture reconocible, consistente y sin apariencia generica.
- Cobertura desktop/mobile de homepage, PDP, collection, cart, navigation, blog, article, search, 404, password, about y contact.
- Muy buen tratamiento de paginas normalmente descuidadas, especialmente search vacio, 404, password y articulo.
- Jerarquia editorial fuerte, buen uso de hairlines, asimetria controlada y media con encuadres estables.
- Contraste y targets ya auditados con WCAG 2.2 AA.
- Lookbook, materiales y artesanos forman una propuesta de producto diferenciada.

Brechas principales:

- El archivo Figma es una coleccion de blueprints, no todavia un sistema de diseno reusable.
- Faltan estados comerciales y variantes que los temas lideres resuelven sin apps.
- Studio y Archive son direcciones de preset, pero no experiencias completas equivalentes a Couture.
- La media vectorial oculta problemas reales de fotografia, video, focal point, crop y contenido variable.

Evaluacion:

| Dimension | Estado |
| --- | --- |
| Identidad y originalidad | Excelente |
| Cobertura de plantillas | Excelente |
| Continuidad desktop/mobile | Muy buena |
| Accesibilidad visual | Muy buena |
| Conversion nativa | Buena, aun incompleta |
| Flexibilidad para merchants/agencias | Media |
| Madurez del sistema Figma | Inicial |

## 2. Evidencia del archivo Figma

Archivo auditado: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

- Una pagina contiene los 13 imports SVG aprobados.
- Los frames estan dispersos en un lienzo amplio y conservan sufijos automaticos `1`.
- Figma informa una fuente faltante: `Georgia`.
- El panel Variables indica: `No se crearon variables en este archivo`.
- No aparece una biblioteca local de componentes.
- Los frames seleccionados usan disposicion libre, no Auto Layout.
- No hay conexiones de prototipo visibles para los flujos principales.
- La cuenta gratuita deja dos paginas adicionales disponibles.

Estas limitaciones no invalidan los blueprints. Si se inicia Phase 3B sin resolverlas, aumentara la probabilidad de inconsistencias entre secciones, estados olvidados y decisiones repetidas durante la implementacion.

## 3. Benchmark actual

El benchmark se eligio por relevancia, adopcion, valoracion y cercania funcional, no para copiar su estetica.

| Tema | Fortaleza a incorporar | Diferencia actual de Atelier Flow |
| --- | --- | --- |
| [Prestige](https://themes.shopify.com/themes/prestige/presets/prestige) | Lujo editorial, 30+ secciones, quick view, recently viewed, hotspots y sticky cart | Atelier Flow iguala la narrativa, pero no la amplitud de secciones y estados |
| [Motion](https://themes.shopify.com/themes/motion/presets/motion) | Quick add con seleccion de talla, video, animacion y experiencia mobile-first | Falta definir quick-buy sheet y un sistema de motion real |
| [Broadcast](https://themes.shopify.com/themes/broadcast/presets/broadcast) | 1-click add, product upsell, promociones y 30+ secciones configurables | Falta cross-sell discreto y arquitectura merchant-first |
| [Enterprise](https://themes.shopify.com/themes/enterprise/presets/enterprise) | Rendimiento, pre-order, back-in-stock, recently viewed e infinite scroll | Falta especificar estados de catalogo grande y presupuesto de performance |
| [Symmetry](https://themes.shopify.com/themes/symmetry/presets/symmetry) | Amplia personalizacion drag-and-drop y adopcion declarada en mas de 70k tiendas | Falta convertir composiciones en bloques combinables por merchants |
| [Concept](https://themes.shopify.com/themes/concept/presets/concept) | Carruseles tactiles y cierres de popup con sensacion de app movil | Falta documentar gestos, swipe, focus y transiciones mobile |
| [Stiletto](https://themes.shopify.com/themes/stiletto/presets/stiletto) | Cart upsells, sticky buy, shipping bar, hotspots y promotion tiles en collection | Shipping y sticky existen; faltan upsell, gift wrap y promo tile nativos |

## 4. Mejoras P0 antes de ampliar Phase 3B

### P0.1 Resolver tipografia en Figma

- Sustituir las capas importadas como `Georgia` por Playfair Display Regular.
- Crear estilos `Display`, `Heading`, `Subheading`, `Body`, `Label`, `Eyebrow` y `Micro`.
- Reservar Micro para metadata secundaria; no usar texto esencial por debajo de 12 px.
- Subir body mobile a 14 px y body desktop a 16 px cuando sea contenido transaccional o de lectura.

Motivo: hoy un colaborador puede ver una composicion distinta por el fallback faltante.

### P0.2 Crear foundations reales

Usar una coleccion local de variables con tres modos:

- `Couture`
- `Studio`
- `Archive`

Variables minimas:

- Color semantico: background, surface, subtle, foreground, muted, border, accent y accent contrast.
- Spacing: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64 y 96.
- Shape: card, button, input y border width.
- Layout: gutter mobile, gutter desktop, target minimo y container max.

Los nombres deben coincidir con `docs/design-tokens.json` para mantener trazabilidad Figma a CSS.

### P0.3 Construir componentes de alto riesgo

Crear primero estos component sets, no toda la biblioteca a la vez:

| Componente | Variantes minimas |
| --- | --- |
| Button | Primary, Secondary, Text; default, hover, focus, loading, disabled |
| Form field | Empty, filled, focus, error, success, disabled |
| Product card | Available, sale, sold out, single variant, multiple variants |
| Variant option | Default, selected, unavailable, focus |
| Price | Regular, compare-at, unit price, range |
| Accordion | Collapsed, expanded, focus |
| Header | Default, sticky, transparent, search open, mega-menu open |
| Cart item | Default, updating, error, unavailable |
| Drawer | Closed, opening, open, empty, error |
| Predictive result | Default, hover, keyboard active, unavailable |
| Hotspot | Idle, hover, focus, open, edge-flipped |
| Sticky ATC | Hidden, visible, loading, success, error, unavailable |

Usar Auto Layout y constraints para que copy, precios, traducciones y apps no rompan la composicion.

### P0.4 Prototipar cinco recorridos

1. Header -> mega-menu -> collection.
2. Product card -> choose options -> add -> cart drawer.
3. PDP variant change -> sticky ATC -> added/error.
4. Search -> keyboard navigation -> results/zero results.
5. Contact o FAQ -> validation/expanded/success.

Probar cada recorrido a 1440, 768, 390 y 320 px. El breakpoint 768 detectara problemas que no aparecen comparando solo desktop y mobile.

## 5. Mejoras P1 de producto y conversion

### Header y navegacion

- Agregar announcement bar opcional de 36-44 px para envio, lanzamiento o cita de showroom.
- Definir header sticky con estado hide/reveal y variante transparente sobre media.
- Conectar el icono Search con el overlay predictivo ya disenado.
- Mantener el mega-menu curado; no convertirlo en un sitemap denso.

### Homepage

- Agregar una banda opcional de press coverage o una cita de cliente, sin carrusel automatico.
- Convertir Lookbook en seccion reusable con 2-6 hotspots y mobile product rail.
- Anadir una seccion `Editorial product story` que combine producto, material y CTA.
- Definir tres intensidades de motion: None, Subtle y Editorial, siempre con reduced motion.
- Ofrecer 18-24 secciones realmente distintas antes de intentar igualar cifras de 30+.

### Product card y collection

- Mostrar segunda imagen en hover y cambio de media por swatch.
- Usar `Quick add` solo para productos de una variante; usar `Choose options` cuando haya talla/color.
- Crear quick-buy sheet mobile con selector de talla, disponibilidad y feedback de agregado.
- Agregar promotion tile como bloque dentro del grid de collection.
- Hacer sticky la toolbar Filter/Sort despues del encabezado.
- Permitir densidad de grid 2/3/4 desktop y 1/2 mobile.
- Conservar `Load more`, pero con paginacion HTML funcional como fallback.
- Incluir estados de loading, no results, filter error y collection vacia.

### PDP

- Cambiar el CTA mobile `ADD` por `Add to bag` o `Choose options`.
- Disenar media zoom, video, 3D, thumbnail rail y selected-variant media.
- Anadir estados de pre-order, back-in-stock, unavailable y low stock.
- Incorporar selling plans, quantity rules/price breaks y pickup availability.
- Mostrar estimacion de entrega y devolucion cerca del CTA, con disclosure.
- Anadir `Complete the study` con 1-3 complementary products bajo el buy box.
- Documentar alturas variables del bloque `@app`; no asumir una review card fija.
- Mantener size guide por metaobjeto con modal accesible.

### Cart drawer

- Mantener shipping progress y gift note, que ya estan bien resueltos.
- Anadir gift wrap opcional como producto o block configurable.
- Incluir un solo upsell compacto, nunca un carrusel invasivo por defecto.
- Definir footer sticky y zona scrolleable para 5 o mas line items.
- Disenar estados updating, quantity error, item unavailable y checkout error.
- Evaluar accelerated checkout como setting, no como elemento obligatorio visible.

### Search y discovery

- Agrupar resultados en Products, Collections, Pages y Journal.
- Mostrar match de variante y precio desde en el resultado de producto.
- Incluir estado loading y seleccion activa por teclado.
- Mantener el estado cero actual: es mejor que el de muchos temas comerciales.
- Agregar recently viewed como seccion opcional, no como dependencia del search.

### Blog y contenido

- Agregar progreso de lectura discreto y related stories al final.
- Incluir author profile y next/previous article como bloques opcionales.
- Mantener `Objects featured in this story`; es una de las mejores ideas del sistema.

## 6. Mejoras P2 para agencias y presets

### Presets funcionalmente distintos

No publicar Studio y Archive como simples cambios de color/tipografia.

Studio debe demostrar:

- Homepage modular de galeria.
- PDP con media full-bleed y buy box compacto.
- Collection mas limpia, swatches grandes y quick-buy sheet.

Archive debe demostrar:

- Navegacion indexada y metadata tecnica.
- Collection con list/grid toggle y especificaciones visibles.
- PDP de ficha tecnica con trazabilidad, lote, material y cuidado.

Cada preset necesita como minimo homepage, PDP y collection en desktop/mobile antes de declararse preset terminado.

### Merchant y agency handoff

- Documentar para cada seccion: objetivo, blocks permitidos, maximo de blocks y fallbacks.
- Anotar el origen Shopify de cada dato: product, variant, metafield, metaobject, collection filter o app block.
- Crear recetas de pagina para Fashion, Home/Objects y Small catalog.
- Probar copy largo en espanol, aleman y frances, y una pasada RTL estructural.
- Preparar estados con datos pobres: una imagen, titulo largo, sin compare-at y sin metafields.

### Funciones que no deben liderar el roadmap

- Countdown timer.
- Age verifier.
- Promo popups.
- Autoplay agresivo.
- Wishlist propia sin integracion/app block.

Son utiles para ciertos merchants, pero no deben diluir el posicionamiento editorial ni aumentar el peso inicial.

## 7. Organizacion Figma para cuenta gratuita

La cuenta muestra dos paginas libres adicionales. Usar solo tres:

1. `01 Foundations + Components`
2. `02 Couture Screens + Flows`
3. `03 Presets + QA`

Dentro de cada pagina, usar Figma Sections para Desktop, Tablet, Mobile, States y Deprecated. Renombrar frames sin el sufijo `1`, por ejemplo `PDP/Couture/Desktop/Default`.

## 8. Orden recomendado

1. Figma hardening: fonts, variables, styles, componentes y Auto Layout.
2. Prototipos de recorridos y prueba tablet/320 px.
3. Phase 3B core: product card, quick buy, PDP, cart y search.
4. Phase 3B merchandising: promotion tile, complementary products y recently viewed.
5. Sustitucion por fotografia/video real y QA de focal points.
6. Studio y Archive funcionales.
7. Revision final de arquitectura, accesibilidad, performance y Theme Store.

## 9. Recomendacion de modelos

- Gemini Flash 3.8 High: priorizar P0/P1 y emitir directivas cerradas.
- GPT-5.6 Sol Max: construir componentes Figma y luego Liquid/CSS/JS.
- Claude: revision editorial, labels, mensajes de error, localizacion y UX heuristica despues de tener estados reales.
- Astra: reservar para auditoria integral previa a submission, no para esta fase de definicion.

## 10. Decision solicitada a Gemini

Aceptar o ajustar una fase corta `Phase 3A.5 - Figma System Hardening` antes de continuar con toda Phase 3B. El objetivo no es redisenar las pantallas aprobadas; es convertirlas en un sistema reusable, probar los recorridos de mayor riesgo y cerrar las brechas P0 descritas arriba.
