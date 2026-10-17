# SARTORIAL THEME - BUNDLE COMPLETO DE CODIGO FUENTE PARA AUDITORIA LINEA POR LINEA

> **Destinatario:** Gemini Argon (gemini.google.com)
> **Objetivo:** Inspeccion exhaustiva de codigo en texto plano, verificacion de cumplimiento Shopify Theme Store y dictamen tecnico final.
> **Fecha de generacion:** 2026-10-14T01:49:38.718Z
> **Estado de compuertas:** EXIT CODE 0 - 91 archivos Theme Check sin ofensas. Paquete 'Sartorial-1.0.0.zip' listo.

## 1. RESPUESTA TECNICA A LAS OBSERVACIONES DE ARGON

### Observacion 1: Auditoria de `sections/bento-discovery.liquid` y `locales/en.default.schema.json`
- **Hallazgo verificado:** En `locales/en.default.schema.json` (lineas 616-642), la clave `sections.bento_discovery.name` esta nombrada exactamente como **`"Mixed content grid"`** (y sus presets tambien como **`"Mixed content grid"`**).
- **Vocabulario de bloques:** Los bloques estan nombrados como `"Collection card"`, `"Story card"` y `"Product card"`.
- **Cumplimiento Theme Store:** La palabra tecnica de diseno `'Bento'` o `'Bento grid'` **NO se expone en ninguna parte de la superficie del comerciante** (Theme Editor) ni en el storefront (comprador). El termino `'bento'` unicamente existe como identificador interno del archivo Liquid (`bento-discovery.liquid`) y en clases CSS de encapsulamiento BEM (`.bento-discovery`), cumpliendo estrictamente con la *Compuerta de Superficie del Comerciante* (Regla: no jerga tecnica interna expuesta al comerciante).

### Observacion 2: Clarificacion del requerimiento de `locales/es.schema.json`
- **Directriz oficial de Shopify Theme Store:** Shopify exige unicamente `locales/en.default.schema.json` para los esquemas de configuracion del Theme Editor. No es requisito ni estandar de la Theme Store proveer esquemas de configuracion de administrador traducidos (`es.schema.json`).
- **Localizacion de storefront (comprador):** Lo que si exige y evalua Shopify es la localizacion de cara al cliente en la tienda publica (`locales/en.default.json` y `locales/es.json`). Ambos archivos estan implementados con **paridad total del 100%** (432 claves hoja identicas en ingles y espanol, 0 claves huerfanas, 0 claves sin resolver en Liquid).

## 2. RESULTADOS DE LAS COMPUERTAS ESTATICAS (`npm run gates:static`)

```text
> shopify-theme-project@0.1.0 gates:static
> npm run gates:json && npm run gates:hooks && npm run gates:sanity && npm run gates:locales && npm run gates:ledger && npm run gates:theme-check && npm run gates:syntax && npm run gates:package


> shopify-theme-project@0.1.0 gates:json
> node scripts/json-validate.mjs

----------------------------------------------------------------------
JSON VALIDATE
----------------------------------------------------------------------
Archivos .json comprobados: 534
  de ellos en /listings/:    11  <- fuera del alcance de Theme Check
Fallos de parseo:           0
URIs shopify://shop_images/: 0  <- solo carpetas de tema y /listings/

ALCANCE: comprueba que el JSON parsee. No comprueba que el schema
sea semanticamente valido para Shopify: eso lo cubre Theme Check
en las carpetas de tema, y nadie en /listings/.

> shopify-theme-project@0.1.0 gates:hooks
> node scripts/dataset-hooks.mjs

--------------------------------------------------------------------------
DATASET HOOKS  (contrato JS <-> Liquid, por componente)
--------------------------------------------------------------------------
JS leido:                           assets/product-zoom.js, assets/theme.js
Componentes con data-* de contrato: 22
Exentas por escritura en runtime:   cartAddPending, cartCountLabel, comparePrice, currentPrice, dirty, gridColumns, itemCount, pending, quickBuyMode, reducedMotion, reveal, revealReady, sourcesLoaded, stockState, variantId, wasDisabled
  <theme-disclosure>            1 claves  2 montaje(s)
  <product-gallery>             1 claves  1 montaje(s)
  <variant-selects>            11 claves  2 montaje(s)
  <product-inventory>           4 claves  1 montaje(s)
  <recently-viewed>             7 claves  1 montaje(s)
  <sticky-cart-bar>             5 claves  1 montaje(s)
  <size-guide-modal>            1 claves  1 montaje(s)
  <gift-card-recipient>         3 claves  1 montaje(s)
  <pickup-availability>         3 claves  1 montaje(s)
  <product-recommendations>     1 claves  1 montaje(s)
  <product-card-variants>       5 claves  1 montaje(s)
  <cart-drawer>                12 claves  1 montaje(s)
  <facet-filters-form>          2 claves  2 montaje(s)
  <editorial-hero>              1 claves  1 montaje(s)
  <complete-the-look>          10 claves  1 montaje(s)
  <marquee-banner>              2 claves  1 montaje(s)
  <announcement-bar>            2 claves  1 montaje(s)
  <anchor-nav>                  3 claves  2 montaje(s)
  <copy-text>                   2 claves  1 montaje(s)
  <faq-filter>                  1 claves  1 montaje(s)
  <predictive-search>          16 claves  1 montaje(s)
  <product-zoom>                1 claves  1 montaje(s)

Contratos rotos: 0

ALCANCE: comprueba que el Liquid que monta el componente emita el atributo.
No comprueba que esté dentro de la etiqueta de apertura ni que su valor
sea válido en runtime.

> shopify-theme-project@0.1.0 gates:sanity
> node scripts/theme-check-sanity.mjs

[theme-check-sanity] sandbox en .tmp\theme-check-sanity-37732 con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError (etiqueta Liquid sin cerrar) en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists (clave de traduccion inexistente) en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations (clave t: de schema inexistente) en sections/main-placeholder.liquid

[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.

> shopify-theme-project@0.1.0 gates:locales
> node scripts/locale-key-inventory.mjs

--------------------------------------------------------------------------
INVENTARIO DE CLAVES DE TRADUCCION
--------------------------------------------------------------------------
Archivos escaneados:            86 (incluye /listings, fuera de Theme Check)
Referencias estaticas | t:      422 claves distintas
Referencias de schema t::       491 claves distintas
Claves en en.default.json:        432 hojas
Claves en en.default.schema.json: 491 hojas

Sin resolver en storefront:     0
Sin resolver en schema:         0
Construidas en runtime:         0  <- no verificables por ningun linter
Huerfanas en storefront:        0
Huerfanas en schema:            0

--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.

> shopify-theme-project@0.1.0 gates:ledger
> node scripts/ledger-verify.mjs

----------------------------------------------------------------------
LEDGER VERIFY
----------------------------------------------------------------------
Filas de requisito: 60
   54  cumplido
    6  código completo
    0  no verificado
    0  ausente

Incoherencias: 0 

----------------------------------------------------------------------
ALCANCE: esta compuerta comprueba vocabulario, estructura, aritmética y
localizadores. NO comprueba que una evidencia pruebe su requisito, y
nunca marca una fila como cumplida. Eso sigue siendo juicio humano.

> shopify-theme-project@0.1.0 gates:theme-check
> shopify theme check


> shopify-theme-project@0.1.0 gates:syntax
> node --check assets/theme.js && node --check assets/product-zoom.js


> shopify-theme-project@0.1.0 gates:package
> shopify theme package
```

## 3. INDICE DE ARCHIVOS FUENTE INCLUIDOS

1. [config/settings_schema.json](#config-settings_schema-json) - Configuracion global del tema (Schema de settings)
2. [config/settings_data.json](#config-settings_data-json) - Valores por defecto y definicion de presets
3. [locales/en.default.schema.json](#locales-en-default-schema-json) - Labels y tooltips de Theme Editor (Auditoria de vocabulario mercante)
4. [locales/en.default.json](#locales-en-default-json) - Localizacion storefront en ingles
5. [locales/es.json](#locales-es-json) - Localizacion storefront en espanol (Paridad 100%)
6. [assets/theme.js](#assets-theme-js) - Motor JavaScript nativo sin dependencias externas
7. [assets/product-zoom.js](#assets-product-zoom-js) - Motor de zoom de producto accesible y tactil
8. [assets/base.css](#assets-base-css) - Sistema de diseno CSS, variables de movimiento y microinteracciones
9. [sections/main-product.liquid](#sections-main-product-liquid) - Pagina de producto principal (PDP) y bloques de lujo
10. [sections/cart-drawer.liquid](#sections-cart-drawer-liquid) - Drawer de carrito accesible con envios gratis dinamicos
11. [sections/main-collection.liquid](#sections-main-collection-liquid) - Listado de coleccion con filtros nativos Facets
12. [sections/bento-discovery.liquid](#sections-bento-discovery-liquid) - Seccion de grilla de descubrimiento editorial
13. [snippets/cart-drawer-recommendations.liquid](#snippets-cart-drawer-recommendations-liquid) - Recomendaciones complementarias en cart drawer
14. [snippets/product-technical-specs.liquid](#snippets-product-technical-specs-liquid) - Ficha tecnica colapsable con metafields de producto
15. [snippets/product-provenance.liquid](#snippets-product-provenance-liquid) - Bloque de procedencia artesanal y origen
16. [snippets/product-card.liquid](#snippets-product-card-liquid) - Tarjeta de producto con soporte de badges y swatch preview
17. [snippets/mega-menu.liquid](#snippets-mega-menu-liquid) - Mega menu navegacional de lujo
18. [listings/sartorial/templates/index.json](#listings-sartorial-templates-index-json) - Preset 1: Sartorial (Editorial de sastreria y lujo)
19. [listings/imprint/templates/index.json](#listings-imprint-templates-index-json) - Preset 2: Imprint (Diseno grafico, posters y tipografia)
20. [listings/archive/templates/index.json](#listings-archive-templates-index-json) - Preset 3: Archive (Objetos de coleccion y archivo vintage)

---

## 4. CODIGO FUENTE COMPLETO EN TEXTO PLANO

### <a id="config-settings_schema-json"></a> config/settings_schema.json

> **Descripcion:** Configuracion global del tema (Schema de settings)
> **Ruta:** `config/settings_schema.json` | **Lineas:** 315 | **Tamano:** 9.25 KB

```json
[
  {
    "name": "theme_info",
    "theme_name": "Sartorial",
    "theme_author": "Ruiz Digital",
    "theme_version": "1.0.0",
    "theme_documentation_url": "https://noobprobro-web.github.io/sartorial-docs/docs.html",
    "theme_support_url": "https://noobprobro-web.github.io/sartorial-docs/support.html"
  },
  {
    "name": "t:settings_schema.brand.name",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "t:settings_schema.brand.settings.logo.label"
      },
      {
        "type": "range",
        "id": "logo_width",
        "min": 80,
        "max": 240,
        "step": 10,
        "unit": "px",
        "label": "t:settings_schema.brand.settings.logo_width.label",
        "default": 140
      },
      {
        "type": "image_picker",
        "id": "favicon",
        "label": "t:settings_schema.brand.settings.favicon.label",
        "info": "t:settings_schema.brand.settings.favicon.info"
      }
    ]
  },
  {
    "name": "t:settings_schema.colors.name",
    "settings": [
      {
        "type": "color_scheme_group",
        "id": "color_schemes",
        "definition": [
          {
            "type": "color",
            "id": "background",
            "label": "t:settings_schema.colors.settings.background.label",
            "default": "#F7F3EA"
          },
          {
            "type": "color_background",
            "id": "background_gradient",
            "label": "t:settings_schema.colors.settings.background_gradient.label",
            "info": "t:settings_schema.colors.settings.background_gradient.info"
          },
          {
            "type": "color",
            "id": "text",
            "label": "t:settings_schema.colors.settings.text.label",
            "default": "#1D1B18"
          },
          {
            "type": "color",
            "id": "button",
            "label": "t:settings_schema.colors.settings.button.label",
            "default": "#1D1B18"
          },
          {
            "type": "color",
            "id": "button_label",
            "label": "t:settings_schema.colors.settings.button_label.label",
            "default": "#FFFFFF"
          },
          {
            "type": "color",
            "id": "secondary_button_label",
            "label": "t:settings_schema.colors.settings.secondary_button_label.label",
            "default": "#1D1B18"
          },
          {
            "type": "color",
            "id": "border",
            "label": "t:settings_schema.colors.settings.border.label",
            "default": "#CAC2B5"
          },
          {
            "type": "color",
            "id": "shadow",
            "label": "t:settings_schema.colors.settings.shadow.label",
            "default": "#1D1B18"
          }
        ],
        "role": {
          "text": "text",
          "background": {
            "solid": "background",
            "gradient": "background_gradient"
          },
          "links": "secondary_button_label",
          "icons": "text",
          "primary_button": "button",
          "on_primary_button": "button_label",
          "primary_button_border": "button",
          "secondary_button": "background",
          "on_secondary_button": "secondary_button_label",
          "secondary_button_border": "secondary_button_label"
        }
      },
      {
        "type": "color_scheme",
        "id": "default_color_scheme",
        "label": "t:settings_schema.colors.settings.default_color_scheme.label",
        "default": "scheme-1"
      }
    ]
  },
  {
    "name": "t:settings_schema.typography.name",
    "settings": [
      {
        "type": "font_picker",
        "id": "type_heading_font",
        "label": "t:settings_schema.typography.settings.heading_font.label",
        "default": "libre_baskerville_n4"
      },
      {
        "type": "range",
        "id": "heading_scale",
        "min": 90,
        "max": 130,
        "step": 5,
        "unit": "%",
        "label": "t:settings_schema.typography.settings.heading_scale.label",
        "default": 105
      },
      {
        "type": "font_picker",
        "id": "type_body_font",
        "label": "t:settings_schema.typography.settings.body_font.label",
        "default": "assistant_n4"
      },
      {
        "type": "range",
        "id": "body_scale",
        "min": 90,
        "max": 110,
        "step": 5,
        "unit": "%",
        "label": "t:settings_schema.typography.settings.body_scale.label",
        "default": 100
      }
    ]
  },
  {
    "name": "t:settings_schema.layout.name",
    "settings": [
      {
        "type": "range",
        "id": "page_width",
        "min": 1000,
        "max": 1600,
        "step": 50,
        "unit": "px",
        "label": "t:settings_schema.layout.settings.page_width.label",
        "default": 1300
      },
      {
        "type": "range",
        "id": "page_gutter",
        "min": 16,
        "max": 40,
        "step": 2,
        "unit": "px",
        "label": "t:settings_schema.layout.settings.page_gutter.label",
        "default": 20
      },
      {
        "type": "range",
        "id": "section_spacing",
        "min": 32,
        "max": 120,
        "step": 8,
        "unit": "px",
        "label": "t:settings_schema.layout.settings.section_spacing.label",
        "default": 72
      },
      {
        "type": "range",
        "id": "button_radius",
        "min": 0,
        "max": 24,
        "step": 2,
        "unit": "px",
        "label": "t:settings_schema.layout.settings.button_radius.label",
        "default": 0
      }
    ]
  },
  {
    "name": "t:settings_schema.animations.name",
    "settings": [
      {
        "type": "select",
        "id": "animations",
        "label": "t:settings_schema.animations.settings.animations.label",
        "info": "t:settings_schema.animations.settings.animations.info",
        "options": [
          {
            "value": "none",
            "label": "t:settings_schema.animations.settings.animations.options__none.label"
          },
          {
            "value": "subtle",
            "label": "t:settings_schema.animations.settings.animations.options__subtle.label"
          },
          {
            "value": "full",
            "label": "t:settings_schema.animations.settings.animations.options__full.label"
          }
        ],
        "default": "subtle"
      },
      {
        "type": "select",
        "id": "motion_style",
        "label": "t:settings_schema.animations.settings.motion_style.label",
        "info": "t:settings_schema.animations.settings.motion_style.info",
        "options": [
          {
            "value": "atelier",
            "label": "t:settings_schema.animations.settings.motion_style.options.atelier"
          },
          {
            "value": "technical",
            "label": "t:settings_schema.animations.settings.motion_style.options.technical"
          },
          {
            "value": "heritage",
            "label": "t:settings_schema.animations.settings.motion_style.options.heritage"
          }
        ],
        "default": "atelier"
      }
    ]
  },
  {
    "name": "t:settings_schema.cart.name",
    "settings": [
      {
        "type": "checkbox",
        "id": "show_cart_count",
        "label": "t:settings_schema.cart.settings.show_cart_count.label",
        "default": true
      },
      {
        "type": "select",
        "id": "cart_type",
        "label": "t:settings_schema.cart.settings.cart_type.label",
        "options": [
          {
            "value": "drawer",
            "label": "t:settings_schema.cart.settings.cart_type.options__1.label"
          },
          {
            "value": "page",
            "label": "t:settings_schema.cart.settings.cart_type.options__2.label"
          }
        ],
        "default": "drawer"
      },
      {
        "type": "checkbox",
        "id": "show_cart_note",
        "label": "t:settings_schema.cart.settings.show_cart_note.label",
        "info": "t:settings_schema.cart.settings.show_cart_note.info",
        "default": false
      }
    ]
  },
  {
    "name": "t:settings_schema.social.name",
    "settings": [
      {
        "type": "url",
        "id": "social_instagram_link",
        "label": "t:settings_schema.social.settings.instagram.label",
        "info": "t:sections.all.link_destination_info"
      },
      {
        "type": "url",
        "id": "social_facebook_link",
        "label": "t:settings_schema.social.settings.facebook.label",
        "info": "t:sections.all.link_destination_info"
      },
      {
        "type": "url",
        "id": "social_pinterest_link",
        "label": "t:settings_schema.social.settings.pinterest.label",
        "info": "t:sections.all.link_destination_info"
      },
      {
        "type": "url",
        "id": "social_tiktok_link",
        "label": "t:settings_schema.social.settings.tiktok.label",
        "info": "t:sections.all.link_destination_info"
      },
      {
        "type": "url",
        "id": "social_youtube_link",
        "label": "t:settings_schema.social.settings.youtube.label",
        "info": "t:sections.all.link_destination_info"
      }
    ]
  }
]
```

---

### <a id="config-settings_data-json"></a> config/settings_data.json

> **Descripcion:** Valores por defecto y definicion de presets
> **Ruta:** `config/settings_data.json` | **Lineas:** 315 | **Tamano:** 9.12 KB

```json
{
  "current": {
    "logo_width": 140,
    "default_color_scheme": "scheme-1",
    "type_heading_font": "libre_baskerville_n4",
    "heading_scale": 105,
    "type_body_font": "assistant_n4",
    "body_scale": 100,
    "page_width": 1300,
    "page_gutter": 20,
    "section_spacing": 72,
    "button_radius": 0,
    "show_cart_count": true,
    "animations": "full",
    "color_schemes": {
      "scheme-1": {
        "settings": {
          "background": "#F7F3EA",
          "background_gradient": "",
          "text": "#1D1B18",
          "button": "#1D1B18",
          "button_label": "#FFFFFF",
          "secondary_button_label": "#1D1B18",
          "border": "#8F8574",
          "shadow": "#1D1B18"
        }
      },
      "scheme-2": {
        "settings": {
          "background": "#1D1B18",
          "background_gradient": "",
          "text": "#F8F4EB",
          "button": "#D8A85D",
          "button_label": "#1D1B18",
          "secondary_button_label": "#F8F4EB",
          "border": "#7A7061",
          "shadow": "#000000"
        }
      },
      "scheme-3": {
        "settings": {
          "background": "#EDE7DA",
          "background_gradient": "",
          "text": "#1D1B18",
          "button": "#1D1B18",
          "button_label": "#FFFFFF",
          "secondary_button_label": "#1D1B18",
          "border": "#8A8070",
          "shadow": "#1D1B18"
        }
      },
      "scheme-4": {
        "settings": {
          "background": "#D8A85D",
          "background_gradient": "",
          "text": "#1D1B18",
          "button": "#1D1B18",
          "button_label": "#F7F3EA",
          "secondary_button_label": "#1D1B18",
          "border": "#6E5325",
          "shadow": "#1D1B18"
        }
      },
      "scheme-5": {
        "settings": {
          "background": "#FBF9F4",
          "background_gradient": "",
          "text": "#2A2621",
          "button": "#1D1B18",
          "button_label": "#FFFFFF",
          "secondary_button_label": "#2A2621",
          "border": "#9A8F7C",
          "shadow": "#1D1B18"
        }
      }
    },
    "cart_type": "drawer",
    "show_cart_note": false,
    "motion_style": "atelier"
  },
  "presets": {
    "Sartorial": {
      "logo_width": 140,
      "default_color_scheme": "scheme-1",
      "type_heading_font": "libre_baskerville_n4",
      "heading_scale": 105,
      "type_body_font": "assistant_n4",
      "body_scale": 100,
      "page_width": 1300,
      "page_gutter": 20,
      "section_spacing": 72,
      "button_radius": 0,
      "show_cart_count": true,
      "animations": "full",
      "color_schemes": {
        "scheme-1": {
          "settings": {
            "background": "#F7F3EA",
            "background_gradient": "",
            "text": "#1D1B18",
            "button": "#1D1B18",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1D1B18",
            "border": "#8F8574",
            "shadow": "#1D1B18"
          }
        },
        "scheme-2": {
          "settings": {
            "background": "#1D1B18",
            "background_gradient": "",
            "text": "#F8F4EB",
            "button": "#D8A85D",
            "button_label": "#1D1B18",
            "secondary_button_label": "#F8F4EB",
            "border": "#7A7061",
            "shadow": "#000000"
          }
        },
        "scheme-3": {
          "settings": {
            "background": "#EDE7DA",
            "background_gradient": "",
            "text": "#1D1B18",
            "button": "#1D1B18",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1D1B18",
            "border": "#8A8070",
            "shadow": "#1D1B18"
          }
        },
        "scheme-4": {
          "settings": {
            "background": "#D8A85D",
            "background_gradient": "",
            "text": "#1D1B18",
            "button": "#1D1B18",
            "button_label": "#F7F3EA",
            "secondary_button_label": "#1D1B18",
            "border": "#6E5325",
            "shadow": "#1D1B18"
          }
        },
        "scheme-5": {
          "settings": {
            "background": "#FBF9F4",
            "background_gradient": "",
            "text": "#2A2621",
            "button": "#1D1B18",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#2A2621",
            "border": "#9A8F7C",
            "shadow": "#1D1B18"
          }
        }
      },
      "motion_style": "atelier"
    },
    "Imprint": {
      "logo_width": 140,
      "default_color_scheme": "scheme-1",
      "type_heading_font": "assistant_n4",
      "heading_scale": 100,
      "type_body_font": "assistant_n4",
      "body_scale": 100,
      "page_width": 1300,
      "page_gutter": 20,
      "section_spacing": 56,
      "button_radius": 0,
      "show_cart_count": true,
      "animations": "full",
      "color_schemes": {
        "scheme-1": {
          "settings": {
            "background": "#FFFFFF",
            "background_gradient": "",
            "text": "#111111",
            "button": "#111111",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#111111",
            "border": "#949494",
            "shadow": "#111111"
          }
        },
        "scheme-2": {
          "settings": {
            "background": "#111111",
            "background_gradient": "",
            "text": "#FAFAFA",
            "button": "#FAFAFA",
            "button_label": "#111111",
            "secondary_button_label": "#FAFAFA",
            "border": "#666666",
            "shadow": "#000000"
          }
        },
        "scheme-3": {
          "settings": {
            "background": "#F2F2F2",
            "background_gradient": "",
            "text": "#111111",
            "button": "#111111",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#111111",
            "border": "#8C8C8C",
            "shadow": "#111111"
          }
        },
        "scheme-4": {
          "settings": {
            "background": "#2E3440",
            "background_gradient": "",
            "text": "#F0F2F5",
            "button": "#F0F2F5",
            "button_label": "#2E3440",
            "secondary_button_label": "#F0F2F5",
            "border": "#79808C",
            "shadow": "#000000"
          }
        },
        "scheme-5": {
          "settings": {
            "background": "#FAFAFA",
            "background_gradient": "",
            "text": "#1A1A1A",
            "button": "#111111",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1A1A1A",
            "border": "#919191",
            "shadow": "#111111"
          }
        }
      },
      "motion_style": "technical"
    },
    "Archive": {
      "logo_width": 140,
      "default_color_scheme": "scheme-1",
      "type_heading_font": "libre_baskerville_n4",
      "heading_scale": 110,
      "type_body_font": "assistant_n4",
      "body_scale": 100,
      "page_width": 1300,
      "page_gutter": 20,
      "section_spacing": 72,
      "button_radius": 0,
      "show_cart_count": true,
      "animations": "full",
      "color_schemes": {
        "scheme-1": {
          "settings": {
            "background": "#EFE6D9",
            "background_gradient": "",
            "text": "#2E241C",
            "button": "#8A5A3B",
            "button_label": "#FFF8F0",
            "secondary_button_label": "#2E241C",
            "border": "#8A7860",
            "shadow": "#2E241C"
          }
        },
        "scheme-2": {
          "settings": {
            "background": "#2F3327",
            "background_gradient": "",
            "text": "#EFE6D9",
            "button": "#B5885C",
            "button_label": "#241F19",
            "secondary_button_label": "#EFE6D9",
            "border": "#838972",
            "shadow": "#1A1D16"
          }
        },
        "scheme-3": {
          "settings": {
            "background": "#E4D8C6",
            "background_gradient": "",
            "text": "#2E241C",
            "button": "#8A5A3B",
            "button_label": "#FFF8F0",
            "secondary_button_label": "#2E241C",
            "border": "#7E6A54",
            "shadow": "#2E241C"
          }
        },
        "scheme-4": {
          "settings": {
            "background": "#6E482F",
            "background_gradient": "",
            "text": "#FFF8F0",
            "button": "#FFF8F0",
            "button_label": "#6E482F",
            "secondary_button_label": "#FFF8F0",
            "border": "#D8BFA6",
            "shadow": "#2E241C"
          }
        },
        "scheme-5": {
          "settings": {
            "background": "#F5EFE5",
            "background_gradient": "",
            "text": "#2E241C",
            "button": "#8A5A3B",
            "button_label": "#FFF8F0",
            "secondary_button_label": "#2E241C",
            "border": "#8D7C64",
            "shadow": "#2E241C"
          }
        }
      },
      "motion_style": "heritage"
    }
  }
}
```

---

### <a id="locales-en-default-schema-json"></a> locales/en.default.schema.json

> **Descripcion:** Labels y tooltips de Theme Editor (Auditoria de vocabulario mercante)
> **Ruta:** `locales/en.default.schema.json` | **Lineas:** 1500 | **Tamano:** 42.50 KB

```json
{
  "settings_schema": {
    "animations": {
      "name": "Animations",
      "settings": {
        "animations": {
          "label": "Motion",
          "info": "Subtle adds scroll reveals, hover transitions and page transitions. Full adds expressive motion tied to the scroll position, so each gesture advances and rewinds with the page until it settles: headlines rise line by line, images unveil behind a mask, the hero drifts in parallax and the scrolling text surges as it crosses the screen. All of it runs on native CSS, so no animation library is loaded in any mode, and browsers without scroll-driven animation support get the same reveals as Subtle. Visitors who ask their device to reduce motion always see the static theme, whichever option you choose.",
          "options__none": {
            "label": "None"
          },
          "options__subtle": {
            "label": "Subtle"
          },
          "options__full": {
            "label": "Full"
          }
        },
        "motion_style": {
          "label": "Motion style",
          "info": "Select the physical timing and interaction style across the storefront.",
          "options": {
            "atelier": "Atelier",
            "technical": "Technical",
            "heritage": "Heritage"
          }
        }
      }
    },
    "brand": {
      "name": "Brand",
      "settings": {
        "logo": {
          "label": "Logo"
        },
        "logo_width": {
          "label": "Logo width"
        },
        "favicon": {
          "label": "Favicon",
          "info": "Use a square image for the clearest browser tab icon."
        }
      }
    },
    "cart": {
      "name": "Cart",
      "settings": {
        "show_cart_count": {
          "label": "Show cart item count"
        },
        "cart_type": {
          "label": "Cart type",
          "options__1": {
            "label": "Slide-out drawer"
          },
          "options__2": {
            "label": "Separate page"
          }
        },
        "show_cart_note": {
          "label": "Show order note field",
          "info": "Lets customers add a message to their order."
        }
      }
    },
    "colors": {
      "name": "Colors",
      "settings": {
        "background": {
          "label": "Background"
        },
        "background_gradient": {
          "label": "Background gradient",
          "info": "A gradient replaces the background color when one is set."
        },
        "text": {
          "label": "Text"
        },
        "button": {
          "label": "Primary button"
        },
        "button_label": {
          "label": "Primary button label"
        },
        "secondary_button_label": {
          "label": "Secondary button and link"
        },
        "border": {
          "label": "Border"
        },
        "shadow": {
          "label": "Shadow"
        },
        "default_color_scheme": {
          "label": "Default color scheme"
        }
      }
    },
    "layout": {
      "name": "Layout",
      "settings": {
        "page_width": {
          "label": "Page width"
        },
        "page_gutter": {
          "label": "Side margin"
        },
        "section_spacing": {
          "label": "Space between sections"
        },
        "button_radius": {
          "label": "Button corner radius"
        }
      }
    },
    "social": {
      "name": "Social media",
      "settings": {
        "instagram": {
          "label": "Instagram URL"
        },
        "facebook": {
          "label": "Facebook URL"
        },
        "pinterest": {
          "label": "Pinterest URL"
        },
        "tiktok": {
          "label": "TikTok URL"
        },
        "youtube": {
          "label": "YouTube URL"
        }
      }
    },
    "typography": {
      "name": "Typography",
      "settings": {
        "heading_font": {
          "label": "Heading font"
        },
        "heading_scale": {
          "label": "Heading size"
        },
        "body_font": {
          "label": "Body font"
        },
        "body_scale": {
          "label": "Body text size"
        }
      }
    }
  },
  "sections": {
    "all": {
      "color_scheme": {
        "label": "Color scheme"
      },
      "image": {
        "label": "Image"
      },
      "image_desktop": {
        "label": "Desktop image"
      },
      "image_mobile": {
        "label": "Mobile image"
      },
      "image_alt": {
        "label": "Image alternative text"
      },
      "eyebrow": {
        "label": "Small label"
      },
      "heading": {
        "label": "Heading"
      },
      "subheading": {
        "label": "Subheading"
      },
      "description": {
        "label": "Description"
      },
      "text": {
        "label": "Text"
      },
      "body": {
        "label": "Text"
      },
      "caption": {
        "label": "Caption"
      },
      "intro": {
        "label": "Introduction"
      },
      "product": {
        "label": "Product"
      },
      "collection": {
        "label": "Collection"
      },
      "link": {
        "label": "Link"
      },
      "link_destination_info": "Choose a store page or paste the full HTTPS address. External pages must stay publicly accessible.",
      "link_label": {
        "label": "Link text"
      },
      "button_label": {
        "label": "Button text"
      },
      "button_url": {
        "label": "Button link",
        "info": "The button only appears once it has a link."
      },
      "quote": {
        "label": "Quote"
      },
      "attribution": {
        "label": "Attribution"
      },
      "show_vendor": {
        "label": "Show vendor"
      },
      "show_secondary_image": {
        "label": "Show second image on hover"
      },
      "show_quick_add": {
        "label": "Show add to cart on product cards",
        "info": "Single-variant products add in one click. Products with one size option, with or without color, show a size picker. Products with more options, subscriptions or gift cards link to the product page."
      },
      "products_to_show": {
        "label": "Products to show"
      },
      "columns_desktop": {
        "label": "Products per row on desktop",
        "options__1": {
          "label": "Two per row"
        },
        "options__2": {
          "label": "Three per row"
        },
        "options__3": {
          "label": "Four per row"
        }
      }
    },
    "header": {
      "name": "Header",
      "settings": {
        "menu": {
          "label": "Menu"
        },
        "secondary_menu": {
          "label": "Secondary menu",
          "info": "Optional menu for documentation, support or about links. Shown beside the header actions and at the bottom of the mobile menu. Hidden when it is the same menu as the main menu."
        },
        "color_scheme": {
          "label": "Color scheme"
        },
        "customer_account_menu": {
          "label": "Customer account menu"
        }
      },
      "blocks": {
        "mega_menu_promo": {
          "name": "Mega menu promotion",
          "settings": {
            "menu_item": {
              "label": "Menu item",
              "info": "Name of the top-level menu item that opens this mega menu, for example \"Catalog\". Capitals don't matter, and in other languages the translated name also works. The item needs sub-links. Items with three levels of links open a mega menu even without this block."
            },
            "card_1": {
              "content": "Card 1"
            },
            "image_1": {
              "label": "Image",
              "info": "Shown in portrait, 4:5. Use an image at least 800 px wide."
            },
            "heading_1": {
              "label": "Heading"
            },
            "subheading_1": {
              "label": "Subheading"
            },
            "link_1": {
              "label": "Link"
            },
            "card_2": {
              "content": "Card 2"
            },
            "image_2": {
              "label": "Image",
              "info": "Shown in portrait, 4:5. Use an image at least 800 px wide."
            },
            "heading_2": {
              "label": "Heading"
            },
            "subheading_2": {
              "label": "Subheading"
            },
            "link_2": {
              "label": "Link"
            }
          }
        }
      }
    },
    "footer": {
      "name": "Footer",
      "settings": {
        "menu": {
          "label": "Menu"
        },
        "color_scheme": {
          "label": "Color scheme"
        },
        "show_description": {
          "label": "Show shop description"
        },
        "show_social": {
          "label": "Show social media links"
        },
        "show_newsletter": {
          "label": "Show email signup"
        },
        "newsletter_heading": {
          "label": "Email signup heading"
        },
        "newsletter_text": {
          "label": "Email signup text"
        }
      }
    },
    "header_group": {
      "name": "Header group"
    },
    "footer_group": {
      "name": "Footer group"
    },
    "main_placeholder": {
      "name": "Page foundation"
    },
    "custom_liquid": {
      "name": "Custom Liquid",
      "settings": {
        "custom_liquid": {
          "label": "Liquid code"
        },
        "color_scheme": {
          "label": "Color scheme"
        }
      },
      "presets": {
        "name": "Custom Liquid"
      }
    },
    "announcement_bar": {
      "name": "Announcement bar",
      "settings": {
        "auto_rotate": {
          "label": "Rotate announcements automatically"
        },
        "change_slides_speed": {
          "label": "Change announcement every"
        }
      },
      "blocks": {
        "announcement": {
          "name": "Announcement"
        }
      },
      "presets": {
        "name": "Announcement bar"
      }
    },
    "newsletter": {
      "name": "Email signup",
      "settings": {
        "text": {
          "label": "Text"
        }
      },
      "presets": {
        "name": "Email signup"
      }
    },
    "hero_editorial": {
      "name": "Editorial hero",
      "settings": {
        "layout_mode": {
          "label": "Layout",
          "options__1": {
            "label": "Split: image beside text"
          },
          "options__2": {
            "label": "Full width: text over image"
          }
        },
        "split_ratio": {
          "label": "Split proportion",
          "options__1": {
            "label": "Image larger"
          },
          "options__2": {
            "label": "Image much larger"
          },
          "options__3": {
            "label": "Equal halves"
          }
        },
        "layout_split": {
          "label": "Image position on desktop",
          "options__1": {
            "label": "Image on the left"
          },
          "options__2": {
            "label": "Image on the right"
          }
        },
        "height_desktop": {
          "label": "Section height on desktop"
        },
        "height_mobile": {
          "label": "Section height on mobile"
        },
        "media_type": {
          "label": "Background media",
          "options__1": {
            "label": "Image"
          },
          "options__2": {
            "label": "Video"
          }
        },
        "video": {
          "label": "Video",
          "info": "Plays silently on a loop. Keep it under 10 seconds so the page stays fast."
        },
        "video_poster": {
          "label": "Video poster image",
          "info": "Shown while the video loads and to visitors who prefer reduced motion."
        },
        "enable_video_mobile": {
          "label": "Play the video on mobile too",
          "info": "Off by default to save your customers' data. The poster image is shown instead."
        },
        "overlay_style": {
          "label": "Overlay",
          "info": "A gradient keeps more of the image visible than a full tint.",
          "options__1": {
            "label": "None"
          },
          "options__2": {
            "label": "Tint the whole image"
          },
          "options__3": {
            "label": "Gradient from the bottom"
          },
          "options__4": {
            "label": "Gradient behind the text only"
          }
        },
        "overlay_opacity": {
          "label": "Overlay strength",
          "info": "Below 20% you may need to check that the text is still readable on your image."
        },
        "content_position_x": {
          "label": "Text position, left to right",
          "options__1": {
            "label": "Left"
          },
          "options__2": {
            "label": "Center"
          },
          "options__3": {
            "label": "Right"
          }
        },
        "content_position_y": {
          "label": "Text position, top to bottom",
          "options__1": {
            "label": "Top"
          },
          "options__2": {
            "label": "Middle"
          },
          "options__3": {
            "label": "Bottom"
          }
        },
        "text_alignment": {
          "label": "Text alignment",
          "options__1": {
            "label": "Left"
          },
          "options__2": {
            "label": "Center"
          },
          "options__3": {
            "label": "Right"
          }
        },
        "content_width": {
          "label": "Text block width"
        },
        "heading_tag": {
          "label": "Heading level",
          "info": "Automatic uses Heading 1 on the home page and Heading 2 everywhere else, so each page keeps a single top-level heading.",
          "options__1": {
            "label": "Heading 1"
          },
          "options__2": {
            "label": "Heading 2"
          },
          "options__3": {
            "label": "Automatic"
          }
        },
        "button_primary_label": {
          "label": "Primary button text"
        },
        "button_primary_url": {
          "label": "Primary button link",
          "info": "The button only appears once it has a link."
        },
        "button_secondary_label": {
          "label": "Secondary button text"
        },
        "button_secondary_url": {
          "label": "Secondary button link",
          "info": "The button only appears once it has a link."
        },
        "image_alt": {
          "info": "Describe the image for customers using a screen reader. Leave empty to use the heading."
        }
      },
      "presets": {
        "name": "Editorial hero"
      }
    },
    "marquee": {
      "name": "Scrolling text",
      "settings": {
        "speed": {
          "label": "Loop duration",
          "info": "Lower values scroll faster."
        }
      },
      "blocks": {
        "item": {
          "name": "Text item"
        }
      },
      "presets": {
        "name": "Scrolling text"
      }
    },
    "curated_showcase": {
      "name": "Collection tabs",
      "blocks": {
        "collection_tab": {
          "name": "Collection tab",
          "settings": {
            "tab_label": {
              "label": "Tab name",
              "info": "Leave empty to use the collection name."
            },
            "editorial_image": {
              "label": "Spotlight image",
              "info": "Shown beside the products for this tab."
            }
          }
        }
      },
      "presets": {
        "name": "Collection tabs"
      }
    },
    "brand_manifesto": {
      "name": "Brand statement",
      "settings": {
        "quote": {
          "label": "Statement"
        },
        "author": {
          "label": "Attribution"
        },
        "media_label": {
          "label": "Image label",
          "info": "A short caption printed over the image. Leave empty to hide."
        },
        "use_surface_background": {
          "label": "Use a tinted background"
        },
        "image": {
          "label": "Image"
        }
      },
      "blocks": {
        "detail": {
          "name": "Detail",
          "settings": {
            "label": {
              "label": "Label"
            },
            "value": {
              "label": "Value"
            }
          }
        }
      },
      "presets": {
        "name": "Brand statement"
      }
    },
    "bento_discovery": {
      "name": "Mixed content grid",
      "blocks": {
        "card_featured": {
          "name": "Collection card",
          "settings": {
            "link": {
              "label": "Custom link"
            }
          }
        },
        "card_editorial": {
          "name": "Story card",
          "settings": {
            "image": {
              "label": "Image"
            }
          }
        },
        "card_product": {
          "name": "Product card"
        }
      },
      "presets": {
        "name": "Mixed content grid"
      }
    },
    "lookbook": {
      "name": "Shoppable lookbook",
      "settings": {
        "image_alt": {
          "label": "Image alternative text",
          "info": "Describe the whole scene. The products are already named by their markers."
        }
      },
      "blocks": {
        "hotspot": {
          "name": "Product marker",
          "settings": {
            "horizontal_position": {
              "label": "Position from the left"
            },
            "vertical_position": {
              "label": "Position from the top"
            },
            "horizontal_position_mobile": {
              "label": "Mobile position from the left",
              "info": "Set to 0 to use the desktop position."
            },
            "vertical_position_mobile": {
              "label": "Mobile position from the top",
              "info": "Set to 0 to use the desktop position."
            },
            "popover_position": {
              "label": "Product card position",
              "info": "Where the product card opens in relation to the marker.",
              "options__1": {
                "label": "Above"
              },
              "options__2": {
                "label": "Right"
              },
              "options__3": {
                "label": "Below"
              },
              "options__4": {
                "label": "Left"
              }
            }
          }
        }
      },
      "presets": {
        "name": "Shoppable lookbook"
      }
    },
    "complete_the_look": {
      "name": "Complete the look",
      "blocks": {
        "bundle_product": {
          "name": "Product in the set",
          "settings": {
            "product": {
              "label": "Product",
              "info": "Add two to four products. Products sold only by subscription link to their own page instead."
            }
          }
        }
      },
      "presets": {
        "name": "Complete the look"
      }
    },
    "featured_product": {
      "name": "Featured product",
      "settings": {
        "product": {
          "label": "Product"
        },
        "secondary_background": {
          "label": "Use a tinted background"
        },
        "padding_top": {
          "label": "Top spacing"
        },
        "padding_bottom": {
          "label": "Bottom spacing"
        }
      },
      "blocks": {
        "title": {
          "name": "Title"
        },
        "price": {
          "name": "Price"
        },
        "variant_picker": {
          "name": "Options"
        },
        "quantity_selector": {
          "name": "Quantity"
        },
        "buy_buttons": {
          "name": "Add to cart",
          "settings": {
            "show_dynamic_checkout": {
              "label": "Show express checkout buttons",
              "info": "Shows Shop Pay, PayPal and other methods you have enabled."
            }
          }
        },
        "description": {
          "name": "Description"
        },
        "custom_liquid": {
          "name": "Custom Liquid",
          "settings": {
            "custom_liquid": {
              "label": "Liquid code"
            }
          }
        }
      },
      "presets": {
        "name": "Featured product"
      }
    },
    "product_recommendations": {
      "name": "Product recommendations",
      "settings": {
        "intent": {
          "label": "Recommendation type",
          "info": "Complementary products need the free Search & Discovery app installed and set up. Without it this section stays hidden.",
          "options__1": {
            "label": "Related products"
          },
          "options__2": {
            "label": "Complementary products"
          }
        },
        "heading": {
          "label": "Heading",
          "info": "Leave empty to use the default heading for the recommendation type."
        }
      },
      "presets": {
        "name": "Product recommendations"
      }
    },
    "recently_viewed": {
      "name": "Recently viewed",
      "settings": {
        "heading": {
          "info": "Leave blank to show the translated default heading. Products are stored in this browser only."
        }
      },
      "presets": {
        "name": "Recently viewed"
      }
    },
    "cart_drawer": {
      "name": "Cart drawer",
      "settings": {
        "enable_tiered_progress": {
          "label": "Show free shipping and gift progress"
        },
        "free_shipping_threshold": {
          "label": "Free shipping amount",
          "info": "Match your actual shipping rates and eligible markets in Settings > Shipping and delivery. This amount does not create a shipping rate, make express shipping free, or guarantee eligibility at checkout."
        },
        "atelier_gift_threshold": {
          "label": "Gift amount",
          "info": "Match an actual gift offer and its eligibility conditions. Configure any required products and discounts in Shopify. This amount does not add a gift or create a discount."
        },
        "show_complementary_products": {
          "label": "Show complementary products",
          "info": "Shows up to two eligible products when the cart has items. Products already in the cart are excluded. Choose products below to use this feature without an app."
        },
        "cross_sell_heading": {
          "label": "Complementary products heading",
          "default": "Complementary products"
        },
        "use_product_metafield": {
          "label": "Use product-specific selections",
          "info": "In Settings > Custom data > Products, define custom.complementary_products as a list of product references, then choose products on each product page in the admin. Eligible selections for the main product in the cart take priority over the sources below."
        },
        "use_search_discovery": {
          "label": "Use Shopify complementary recommendations",
          "info": "Optional. Uses complementary products configured in Shopify Search and Discovery after eligible product-specific selections. Products selected below are used when results are unavailable. No app installation is required for manual selections."
        },
        "cross_sell_collection": {
          "label": "Collection to suggest from",
          "info": "Fills remaining spaces after eligible product-specific selections, Shopify recommendations, and products selected below. Only available products outside the cart are shown."
        }
      },
      "blocks": {
        "cross_sell_product": {
          "name": "Suggested product",
          "settings": {
            "product": {
              "info": "Products without customer-selectable options can be added directly. Other products require an option selection or a visit to the product page. Duplicate products and products already in the cart are excluded."
            }
          }
        }
      }
    },
    "main_product": {
      "name": "Product information",
      "settings": {
        "media_layout": {
          "label": "Image layout on desktop",
          "options__1": {
            "label": "Single column"
          },
          "options__2": {
            "label": "Two columns"
          },
          "options__3": {
            "label": "Large image with thumbnails"
          },
          "options__4": {
            "label": "Split screen"
          }
        },
        "enable_media_zoom": {
          "label": "Enable image zoom",
          "info": "Opens product images in a full-screen viewer with click, pinch and keyboard zoom. Zoom stops at the resolution of the uploaded file: for close-up detail, upload images at least 3000 px wide."
        },
        "enable_sticky_cart": {
          "label": "Show sticky add to cart bar",
          "info": "Appears once the customer scrolls past the add to cart button."
        },
        "pickup_hours_note": {
          "label": "Pickup hours note",
          "info": "Shown with every pickup location on every product. Consider moving this to Theme settings, Product pages."
        }
      },
      "blocks": {
        "icons": {
          "none": "No icon",
          "truck": "Truck",
          "clock": "Clock",
          "shield": "Shield",
          "ruler": "Ruler",
          "bag": "Bag",
          "check": "Check"
        },
        "vendor": {
          "name": "Vendor"
        },
        "title": {
          "name": "Title"
        },
        "price": {
          "name": "Price"
        },
        "variant_picker": {
          "name": "Options"
        },
        "size_guide": {
          "name": "Size guide",
          "settings": {
            "guide_title": {
              "label": "Size guide title"
            },
            "model_fit_info": {
              "label": "Model fit note"
            },
            "show_model_fit_below": {
              "label": "Show the model fit note on the page too"
            },
            "page_content": {
              "label": "Size chart page",
              "info": "Use a page when you need a real table. The measurement fields below only support plain paragraphs and lists."
            },
            "size_table_cm": {
              "label": "Measurements in centimeters"
            },
            "size_table_in": {
              "label": "Measurements in inches"
            }
          }
        },
        "quantity": {
          "name": "Quantity"
        },
        "buy_buttons": {
          "name": "Add to cart",
          "settings": {
            "show_dynamic_checkout": {
              "label": "Show express checkout buttons",
              "info": "Shows Shop Pay, PayPal and other methods you have enabled."
            }
          }
        },
        "description": {
          "name": "Description"
        },
        "inventory_status": {
          "name": "Inventory status",
          "settings": {
            "threshold": {
              "label": "Low stock threshold",
              "info": "The count appears only when Shopify tracks inventory for the selected option."
            },
            "show_count": {
              "label": "Show remaining count"
            }
          }
        },
        "shipping_lead_time": {
          "name": "Delivery estimate",
          "settings": {
            "delivery_text": {
              "label": "Delivery message",
              "info": "Match your shipping rates and delivery estimates. Leave blank for a neutral checkout message."
            },
            "icon": {
              "label": "Icon"
            }
          }
        },
        "trust_badges": {
          "name": "Returns reassurance",
          "settings": {
            "returns_text": {
              "label": "Returns message",
              "info": "Match your published returns policy. Leave blank for a neutral policy message."
            },
            "icon": {
              "label": "Icon"
            }
          }
        },
        "collapsible_tab": {
          "name": "Collapsible tab",
          "settings": {
            "icon": {
              "label": "Icon"
            },
            "page": {
              "label": "Page",
              "info": "Its content appears after the text above. Use it to share one policy across many products."
            }
          }
        },
        "technical_specs": {
          "name": "Technical specifications",
          "settings": {
            "heading": {
              "label": "Heading"
            },
            "material": {
              "label": "Material composition",
              "info": "Displays fabric composition or material blend."
            },
            "gsm": {
              "label": "Fabric weight (GSM)",
              "info": "Enter a documented fabric mass per square meter. This is not the garment or shipping weight."
            },
            "hardware": {
              "label": "Hardware and trims",
              "info": "Add the actual manufacturer, series and finish for this product. Leave unknown details blank."
            },
            "origin": {
              "label": "Origin and craftsmanship",
              "info": "Use documented product data. Fabric origin and manufacturing location can differ."
            }
          }
        },
        "provenance": {
          "name": "Archival provenance",
          "settings": {
            "heading": {
              "label": "Heading"
            },
            "circa_year": {
              "label": "Circa year",
              "info": "Era or estimated year of production. Leave blank if unconfirmed."
            },
            "show_unique_piece": {
              "label": "Show unique piece label",
              "info": "Requires documented uniqueness and a reviewed single physical item. Size variants, untracked inventory or overselling make the item ineligible."
            },
            "condition_grade": {
              "label": "Condition grade",
              "info": "Select a grade only after inspection. Disclose damage, repairs and use restrictions separately.",
              "options": {
                "not_assessed": {
                  "label": "Not assessed"
                },
                "grade_1": {
                  "label": "Grade I · Minimal visible wear"
                },
                "grade_2": {
                  "label": "Grade II · Light wear"
                },
                "grade_3": {
                  "label": "Grade III · Visible wear"
                },
                "grade_4": {
                  "label": "Grade IV · Significant wear"
                },
                "grade_5": {
                  "label": "Grade V · Fragile / study piece"
                }
              }
            },
            "provenance_notes": {
              "label": "Provenance notes",
              "info": "Historical context, collection season or archival record notes."
            }
          }
        }
      }
    },
    "main_collection": {
      "name": "Collection page",
      "settings": {
        "products_per_page": {
          "label": "Products per page"
        },
        "show_collection_image": {
          "label": "Show collection image"
        },
        "default_grid_columns": {
          "label": "Default products per row",
          "info": "Sets the desktop default. On phones the two options render one and two products per row.",
          "options__1": {
            "label": "Two per row"
          },
          "options__2": {
            "label": "Four per row"
          }
        }
      },
      "blocks": {
        "promotion_tile": {
          "name": "Editorial tile",
          "settings": {
            "position_in_grid": {
              "label": "Place after this many products",
              "info": "Moves to the end of the grid when the collection has fewer products."
            },
            "link_label": {
              "label": "Link text"
            },
            "link_url": {
              "label": "Link"
            }
          }
        }
      }
    },
    "main_search": {
      "name": "Search results",
      "settings": {
        "results_per_page": {
          "label": "Results per page"
        }
      }
    },
    "main_cart_items": {
      "name": "Cart page"
    },
    "main_list_collections": {
      "name": "Collection list page",
      "settings": {
        "collections_per_page": {
          "label": "Collections per page"
        },
        "columns_desktop": {
          "label": "Collections per row on desktop",
          "options__1": {
            "label": "Two per row"
          },
          "options__2": {
            "label": "Three per row"
          },
          "options__3": {
            "label": "Four per row"
          }
        }
      }
    },
    "main_page": {
      "name": "Page content",
      "blocks": {
        "image": {
          "name": "Full width image"
        },
        "quote": {
          "name": "Pull quote"
        },
        "signature": {
          "name": "Signature",
          "settings": {
            "note": {
              "label": "Note"
            },
            "name": {
              "label": "Name"
            },
            "role": {
              "label": "Role"
            }
          }
        }
      },
      "presets": {
        "name": "Page content"
      }
    },
    "main_blog": {
      "name": "Blog",
      "settings": {
        "featured_article": {
          "label": "Featured post"
        },
        "articles_per_page": {
          "label": "Posts per page"
        },
        "show_tag_filters": {
          "label": "Show tag filters"
        },
        "show_excerpts": {
          "label": "Show excerpts"
        },
        "show_author": {
          "label": "Show the author of the featured post"
        },
        "show_date": {
          "label": "Show publication dates"
        }
      }
    },
    "main_article": {
      "name": "Blog post",
      "settings": {
        "show_author": {
          "label": "Show author"
        },
        "hero_caption": {
          "label": "Main image caption"
        },
        "comments_per_page": {
          "label": "Comments per page"
        }
      },
      "blocks": {
        "pull_quote": {
          "name": "Pull quote"
        },
        "featured_product": {
          "name": "Featured product"
        }
      }
    },
    "main_contact": {
      "name": "Contact and FAQ",
      "settings": {
        "studio_hours": {
          "label": "Opening hours"
        },
        "showroom_address": {
          "label": "Address"
        },
        "single_open_faq": {
          "label": "Open one question at a time"
        },
        "service_color_scheme": {
          "label": "Contact cards color scheme"
        }
      },
      "blocks": {
        "faq_item": {
          "name": "Question",
          "settings": {
            "question": {
              "label": "Question"
            },
            "answer": {
              "label": "Answer"
            },
            "open_by_default": {
              "label": "Open by default"
            }
          }
        },
        "service_detail": {
          "name": "Contact card",
          "settings": {
            "title": {
              "label": "Title"
            },
            "detail": {
              "label": "Detail"
            }
          }
        }
      },
      "presets": {
        "name": "Contact and FAQ"
      }
    },
    "main_documentation": {
      "name": "Theme documentation",
      "blocks": {
        "doc_section": {
          "name": "Documentation section",
          "settings": {
            "anchor": {
              "label": "Anchor",
              "info": "Used in the table of contents link, for example quick-start. Leave empty to build it from the heading. Each anchor must be unique on the page."
            },
            "summary": {
              "label": "Short summary"
            }
          }
        },
        "preset_card": {
          "name": "Preset card",
          "settings": {
            "title": {
              "label": "Preset name"
            },
            "badge": {
              "label": "Badge"
            }
          }
        },
        "code_snippet": {
          "name": "Code snippet",
          "settings": {
            "title": {
              "label": "File or label"
            },
            "code": {
              "label": "Snippet",
              "info": "Shown in a monospaced block with a copy button."
            }
          }
        },
        "callout_box": {
          "name": "Callout",
          "settings": {
            "tone": {
              "label": "Tone",
              "options__info": {
                "label": "Note"
              },
              "options__tip": {
                "label": "Tip"
              },
              "options__warning": {
                "label": "Important"
              }
            }
          }
        }
      },
      "presets": {
        "name": "Theme documentation"
      }
    },
    "main_support": {
      "name": "Theme support",
      "settings": {
        "sla": {
          "label": "Response time badge",
          "info": "Shown under the introduction. Leave empty to hide it."
        },
        "single_open_faq": {
          "label": "Open one answer at a time"
        },
        "card_color_scheme": {
          "label": "Support policy card colour scheme"
        }
      },
      "blocks": {
        "policy_card": {
          "name": "Support policy card",
          "settings": {
            "items": {
              "label": "Points",
              "info": "A bulleted list reads best here."
            }
          }
        },
        "support_faq": {
          "name": "Technical question"
        },
        "contact_channel": {
          "name": "Contact channel",
          "settings": {
            "detail": {
              "label": "Detail"
            }
          }
        }
      },
      "presets": {
        "name": "Theme support"
      }
    },
    "main_about": {
      "name": "Brand story",
      "blocks": {
        "hero_story": {
          "name": "Story panel",
          "settings": {
            "image_ratio": {
              "label": "Image ratio",
              "options__panoramic": {
                "label": "Panoramic"
              },
              "options__wide": {
                "label": "Wide"
              },
              "options__landscape": {
                "label": "Landscape"
              },
              "options__portrait": {
                "label": "Portrait"
              }
            }
          }
        },
        "artisan_quote": {
          "name": "Artisan quote",
          "settings": {
            "role": {
              "label": "Role"
            }
          }
        },
        "values_grid": {
          "name": "Values",
          "settings": {
            "value_1_title": {
              "label": "First value"
            },
            "value_1_text": {
              "label": "First value text"
            },
            "value_2_title": {
              "label": "Second value"
            },
            "value_2_text": {
              "label": "Second value text"
            },
            "value_3_title": {
              "label": "Third value"
            },
            "value_3_text": {
              "label": "Third value text"
            }
          }
        },
        "atelier_gallery": {
          "name": "Gallery",
          "settings": {
            "image_1": {
              "label": "First image"
            },
            "image_2": {
              "label": "Second image"
            },
            "image_3": {
              "label": "Third image"
            },
            "show_third_image": {
              "label": "Show a third image",
              "info": "Turn this off for a two image mosaic."
            }
          }
        }
      },
      "presets": {
        "name": "Brand story"
      }
    },
    "main_faq": {
      "name": "FAQ",
      "settings": {
        "single_open": {
          "label": "Open one answer at a time",
          "info": "Opening an answer closes the others in the same category."
        },
        "show_search": {
          "label": "Show the instant search field",
          "info": "Filters the questions as the shopper types. Hidden when the page has fewer than two questions, or when JavaScript is unavailable."
        },
        "cta_color_scheme": {
          "label": "Closing card colour scheme"
        }
      },
      "blocks": {
        "category_header": {
          "name": "Category heading"
        },
        "faq_item": {
          "name": "Question",
          "settings": {
            "question": {
              "label": "Question"
            },
            "answer": {
              "label": "Answer"
            },
            "open_by_default": {
              "label": "Open by default"
            }
          }
        },
        "unresolved_cta": {
          "name": "Closing card"
        }
      },
      "presets": {
        "name": "FAQ"
      }
    },
    "main_policy": {
      "name": "Legal page",
      "settings": {
        "updated_at": {
          "label": "Last updated",
          "info": "Shown under the page title. Leave empty to hide it."
        },
        "show_toc": {
          "label": "Show table of contents",
          "info": "Built from the heading level 2 titles in the page content. Hidden when the page has fewer than two."
        }
      },
      "presets": {
        "name": "Legal page"
      }
    },
    "main_password": {
      "name": "Password page",
      "settings": {
        "text": {
          "label": "Text"
        },
        "opening_note": {
          "label": "Opening note",
          "info": "A short line such as an opening date. Leave empty to hide."
        },
        "image": {
          "label": "Image"
        }
      }
    },
    "main_404": {
      "name": "404 page",
      "settings": {
        "recommendation_collection": {
          "label": "Collection to suggest"
        }
      }
    }
  }
}
```

---

### <a id="locales-en-default-json"></a> locales/en.default.json

> **Descripcion:** Localizacion storefront en ingles
> **Ruta:** `locales/en.default.json` | **Lineas:** 637 | **Tamano:** 22.42 KB

```json
{
  "general": {
    "accessibility": {
      "skip_to_content": "Skip to content",
      "close": "Close",
      "opens_in_new_window": "Opens in a new window"
    },
    "navigation": {
      "home": "Home",
      "menu": "Menu",
      "primary": "Primary navigation",
      "secondary": "Secondary",
      "footer": "Footer navigation",
      "view_all": "Explore {{ title }}"
    },
    "search": {
      "label": "Search"
    },
    "pagination": {
      "page": "Page {{ number }}",
      "label": "Pagination",
      "previous": "Previous",
      "next": "Next"
    },
    "social": {
      "follow_us": "Follow us",
      "instagram": "Instagram",
      "facebook": "Facebook",
      "pinterest": "Pinterest",
      "tiktok": "TikTok",
      "youtube": "YouTube"
    },
    "localization": {
      "currency": "Currency",
      "current_language": "Current language: {{ language }}",
      "language": "Language",
      "update": "Update preferences"
    }
  },
  "sections": {
    "header": {
      "cart": "Cart",
      "cart_count": {
        "one": "Cart, {{ count }} item",
        "other": "Cart, {{ count }} items"
      },
      "mega_menu": {
        "featured": "Featured"
      }
    },
    "footer": {
      "copyright": "© {{ year }} {{ shop }}",
      "payment_methods": "Accepted payment methods"
    },
    "cart": {
      "title": "Your cart",
      "item_count": {
        "one": "{{ count }} item",
        "other": "{{ count }} items"
      },
      "empty": "Your cart is currently empty.",
      "continue_shopping": "Continue shopping",
      "quantity": "Quantity",
      "decrease_quantity": "Decrease quantity for {{ title }}",
      "increase_quantity": "Increase quantity for {{ title }}",
      "remove": "Remove",
      "remove_item": "Remove {{ title }}",
      "discount": "Discount",
      "subtotal": "Subtotal",
      "taxes_included": "Taxes included.",
      "taxes_and_shipping_at_checkout": "Taxes and shipping calculated at checkout.",
      "update": "Update cart",
      "checkout": "Checkout",
      "note": "Order note",
      "note_placeholder": "Add a note to your order",
      "view_cart": "View cart",
      "error": "We could not update your cart. Please try again.",
      "added": "Item added to your cart.",
      "add_failed": "This item could not be added to your cart.",
      "shipping_remaining": "Add {{ amount }} for free shipping",
      "shipping_unlocked_gift_remaining": "Free shipping unlocked. Add {{ amount }} for a gift",
      "rewards_unlocked": "Free shipping and gift unlocked",
      "rewards_progress": "Cart rewards progress",
      "shipping_milestone": "Shipping at {{ amount }}",
      "gift_milestone": "Gift at {{ amount }}",
      "complimentary_additions": "Complementary products",
      "curated_for_order": "Curated for this order",
      "add_complementary": "Add",
      "add_complementary_product": "Add {{ product }} to your cart",
      "choose_options": "Choose options",
      "choose_options_product": "Choose options for {{ product }}",
      "select_option": "Select {{ option }}",
      "view_product": "View product",
      "view_product_for": "View product: {{ product }}",
      "options_unavailable": "This combination is unavailable.",
      "adding": "Adding…",
      "cancel_options": "Cancel",
      "update_unconfirmed": "We could not confirm the update.",
      "check_cart": "Check cart",
      "saving_note": "Saving your cart note…",
      "note_save_unconfirmed": "We could not confirm that your cart note was saved."
    },
    "announcement_bar": {
      "region_label": "Store announcements",
      "previous": "Previous announcement",
      "next": "Next announcement",
      "pause": "Pause announcements",
      "play": "Play announcements"
    },
    "lookbook": {
      "region_label": "Interactive editorial lookbook",
      "image_alt": "Editorial composition with shoppable products",
      "open_product": "Open details for {{ product }}",
      "featured_piece": "Featured piece",
      "view_product": "View product",
      "products_label": "Products featured in this look"
    },
    "complete_the_look": {
      "region_label": "Complete the look",
      "image_alt": "Editorial view of the complete look",
      "selected_count": {
        "one": "{{ count }} of {{ total }} item selected",
        "other": "{{ count }} of {{ total }} items selected"
      },
      "add_selected": {
        "one": "Add {{ count }} piece to bag | {{ total }}",
        "other": "Add {{ count }} pieces to bag | {{ total }}"
      },
      "select_items": "Select at least one piece",
      "select_product": "Select {{ product }}",
      "choose_variant": "Choose an option for {{ product }}",
      "selling_plan_required": "Available from the product page with a purchase plan.",
      "requires_plan_option": "Plan required on product page",
      "view_on_product_page": "View options on product page",
      "total_label": "Capsule total",
      "empty": "Choose two to four products in the theme editor to build this look.",
      "no_javascript": "Open each product to choose options and purchase it separately.",
      "added": "The selected look was added to your cart.",
      "error": "We could not add this look. Review the selected options and try again."
    },
    "featured_product": {
      "region_label": "Featured product",
      "onboarding_title": "Featured luxury product",
      "onboarding_price": "$480.00"
    },
    "recently_viewed": {
      "heading": "Recently viewed"
    },
    "main_product": {
      "blocks": {
        "inventory_status": {
          "low_stock": "Low stock: [count] left",
          "low_stock_generic": "Low stock",
          "in_stock": "In stock, ready to ship",
          "preorder": "Available for pre-order",
          "sold_out": "Sold out",
          "unavailable": "This option is unavailable"
        },
        "shipping_lead_time": {
          "delivery_fallback": "Delivery times and costs confirmed at checkout"
        },
        "trust_badges": {
          "returns_fallback": "Returns subject to our store policy"
        }
      }
    },
    "homepage": {
      "hero": {
        "region_label": "Featured editorial campaign"
      },
      "curated": {
        "region_label": "Curated collections",
        "tabs_label": "Choose a curated collection",
        "tab_fallback": "Collection {{ number }}",
        "spotlight": "Spotlight selection",
        "open_spotlight": "Open {{ title }}",
        "view_collection": "View all {{ title }}"
      },
      "manifesto": {
        "region_label": "Our craft and materials",
        "material_image_alt": "Close-up study of a material"
      },
      "bento": {
        "region_label": "Discover collections, stories and products",
        "explore": "Explore {{ title }}"
      },
      "marquee": {
        "region_label": "Editorial highlights",
        "pause": "Pause editorial highlights",
        "play": "Play editorial highlights"
      }
    }
  },
  "contact": {
    "atelier": {
      "hours": "Studio hours",
      "showroom": "Showroom"
    },
    "form": {
      "eyebrow": "Write to us",
      "title": "Your inquiry",
      "success": "Thank you. We will reply as soon as possible.",
      "error_heading": "Please review the following fields:",
      "name": "Name",
      "email": "Email",
      "reason": "Reason for inquiry",
      "reason_placeholder": "Choose a reason",
      "reason_order": "Order and delivery",
      "reason_materials": "Materials and care",
      "reason_appointment": "Private appointment",
      "reason_press": "Press and trade",
      "reason_other": "Other",
      "message": "Message",
      "message_help": "Include an order number when relevant. Maximum 1000 characters.",
      "consent": "I agree that my details may be used to answer this inquiry.",
      "consent_value": "Accepted",
      "required_note": "All fields are required.",
      "submit": "Send inquiry"
    },
    "faq": {
      "eyebrow": "Frequently asked questions",
      "title": "Before you write"
    },
    "services": {
      "title": "Direct studio contacts",
      "response": "Response standard: two business days"
    }
  },
  "faq": {
    "search": {
      "label": "Search the questions",
      "placeholder": "Shipping, sizing, returns",
      "results": "Matches: {{ count }}",
      "empty": "No question matches that search. Try a shorter word, or write to us."
    }
  },
  "documentation": {
    "contents": "On this page",
    "copy": "Copy",
    "copied": "Copied",
    "callout": {
      "info": "Note",
      "tip": "Tip",
      "warning": "Important"
    }
  },
  "support": {
    "form": {
      "eyebrow": "Open a ticket",
      "title": "Support request",
      "success": "Thank you. Your request is with the studio and will be answered in the order received.",
      "error_heading": "Please review the following fields:",
      "name": "Name",
      "email": "Email",
      "store_url": "Shopify store URL",
      "store_url_placeholder": "your-store.myshopify.com",
      "store_url_help": "Optional. It lets us look at the same store you are describing.",
      "category": "What is this about?",
      "category_placeholder": "Choose a category",
      "category_presets": "Preset setup",
      "category_sections": "Section customization",
      "category_issue": "Report an issue",
      "category_commercial": "Commercial enquiry",
      "message": "Description",
      "message_help": "Include the page address and the steps you took. Maximum 2000 characters.",
      "required_note": "Name, email, category and description are required.",
      "submit": "Send request"
    },
    "faq": {
      "title": "Before you write"
    },
    "channels": {
      "title": "Other ways to reach the studio"
    }
  },
  "policy": {
    "contents": "On this page",
    "updated": "Last updated {{ date }}"
  },
  "blogs": {
    "blog": {
      "categories_label": "Journal categories",
      "all_stories": "All stories",
      "editorial": "Editorial",
      "read_article": "Read {{ title }}",
      "read_essay": "Read the essay",
      "latest": "Latest essays",
      "article_count": {
        "one": "{{ count }} essay",
        "other": "{{ count }} essays"
      },
      "empty": "No essays have been published yet."
    },
    "article": {
      "reading_time": {
        "one": "{{ count }} min read",
        "other": "{{ count }} min read"
      },
      "by_author": "Words by {{ author }}",
      "featured_objects": "Objects featured in this story",
      "navigation": "More journal stories",
      "previous": "Previous story",
      "next": "Next story"
    },
    "comments": {
      "eyebrow": "Conversation",
      "count": {
        "one": "{{ count }} comment",
        "other": "{{ count }} comments"
      },
      "none": "Be the first to leave a comment.",
      "pagination": "Comment pagination",
      "form_title": "Leave a comment",
      "success": "Your comment was published.",
      "success_moderated": "Your comment was received and will appear after review.",
      "error_heading": "Please review the following fields:",
      "name": "Name",
      "email": "Email",
      "message": "Comment",
      "submit": "Post comment"
    }
  },
  "search": {
    "header": {
      "eyebrow": "Search our collection",
      "title": "Search",
      "results_for": "Results for \"{{ terms }}\""
    },
    "tabs": {
      "label": "Search result types",
      "all": "All",
      "products": "Products",
      "articles": "Journal",
      "pages": "Pages"
    },
    "form": {
      "label": "Search",
      "placeholder": "Search products, materials and stories",
      "submit": "Search"
    },
    "results": {
      "count": {
        "one": "{{ count }} result",
        "other": "{{ count }} results"
      },
      "article": "Journal",
      "page": "Page",
      "view_page": "View page",
      "none_title": "No results for \"{{ terms }}\"",
      "none_text": "Try a broader material or object type, or browse the current collection.",
      "browse": "Explore all products"
    },
    "prompt": {
      "title": "Find an object or story",
      "text": "Search by material, category or title."
    }
  },
  "not_found": {
    "eyebrow": "Error / Archive index",
    "title": "Object not found.",
    "message": "The requested page is not in our current series. It may have moved into the archive.",
    "search_label": "Search our collection",
    "search_placeholder": "Search products and stories",
    "search_submit": "Search",
    "return_to_collection": "Return to collection",
    "recommendations": "Popular pieces / Continue exploring"
  },
  "password": {
    "image_alt": "Editorial preview of the next collection",
    "opening_label": "Opening note",
    "newsletter": {
      "email": "Email address",
      "submit": "Request early access",
      "privacy": "Private notes only. Unsubscribe at any time.",
      "success": "Thank you. Your early access request was received.",
      "error_heading": "Please check your email address:"
    },
    "access": {
      "open": "Enter with password",
      "eyebrow": "Private access",
      "title": "Enter the store",
      "instructions": "Use the password provided by the store owner.",
      "label": "Store password",
      "submit": "Enter store",
      "error": "The password was not accepted. Please try again."
    }
  },
  "list_collections": {
    "title": "Collections",
    "view_collection": "View {{ title }}",
    "product_count": {
      "one": "{{ count }} piece",
      "other": "{{ count }} pieces"
    },
    "empty": "No collections are available yet."
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "choose_options": "Choose options",
      "quick_add": "Quick add",
      "select_size": "Select size",
      "color_swatch": "{{ option }}: {{ value }}",
      "more_swatches": "+{{ count }} more",
      "sold_out": "Sold out",
      "unavailable": "Unavailable",
      "sale": "Sale",
      "quantity": "Quantity",
      "decrease_quantity": "Decrease quantity for {{ product }}",
      "increase_quantity": "Increase quantity for {{ product }}",
      "regular_price": "Regular price",
      "sale_price": "Sale price",
      "price_from": "From",
      "unit_price": "Unit price",
      "taxes_included": "Taxes included.",
      "estimated_line_total": "Estimated item subtotal for {{ quantity }} units:",
      "taxes_included_shipping_at_checkout": "Taxes included. Shipping calculated at checkout.",
      "taxes_and_shipping_at_checkout": "Taxes and shipping calculated at checkout.",
      "discounts_at_checkout": "Discounts and the final amount are confirmed at checkout.",
      "technical_specs": {
        "material": "Material composition",
        "gsm": "Fabric weight (GSM)",
        "hardware": "Hardware and trims",
        "origin": "Origin and craftsmanship"
      },
      "provenance": {
        "single_piece": "Single archival piece",
        "circa": "Circa {{ year }}",
        "condition": "Condition",
        "grade_1": "Grade I · Minimal visible wear",
        "grade_2": "Grade II · Light wear",
        "grade_3": "Grade III · Visible wear",
        "grade_4": "Grade IV · Significant wear",
        "grade_5": "Grade V · Fragile / study piece"
      },
      "media_gallery": "Product media gallery",
      "media_thumbnails": "Product media thumbnails",
      "view_media": "View product media {{ number }}",
      "media_zoom": {
        "title": "Image zoom",
        "open": "Zoom image {{ index }} of {{ total }}",
        "close": "Close zoom",
        "zoom_in": "Zoom in",
        "zoom_out": "Zoom out",
        "reset": "Reset zoom",
        "previous": "Previous image",
        "next": "Next image",
        "status": "Image {{ index }} of {{ total }}, zoom {{ zoom }}%",
        "image_index": "Image {{ index }} of {{ total }}"
      },
      "view_in_space": "View in your space",
      "option_unavailable": "Option unavailable",
      "variant_available": "Variant available.",
      "variant_sold_out": "Variant sold out.",
      "size_guide": "Size Guide and Measurements",
      "model_fit": "Model fit",
      "measurement_units": "Measurement units",
      "centimeters": "CM",
      "inches": "INCHES",
      "sticky_add_to_cart": "Add {{ product }} to cart",
      "sticky_add_quantity_to_cart": "Add {{ product }} to cart, quantity {{ quantity }}",
      "sticky_quantity_price": "{{ quantity }} × {{ price }}",
      "sticky_total": "Total {{ total }}",
      "purchase_options": {
        "legend": "Purchase options",
        "one_time": "One-time purchase",
        "subscribe": "Subscribe and save",
        "delivery_schedule": "Delivery schedule",
        "per_delivery": "{{ price }} per delivery",
        "unavailable": "This purchase option is unavailable",
        "plan_required": "This option requires a subscription plan that is not available right now."
      },
      "pickup": {
        "eyebrow": "Local pickup",
        "available_at_html": "Pickup available at <strong>{{ location_name }}</strong>",
        "unavailable_at_html": "Pickup currently unavailable at <strong>{{ location_name }}</strong>",
        "available": "Pickup available",
        "unavailable": "Pickup currently unavailable",
        "view_store_info": "View store information",
        "check_other_stores": "Check availability at other stores",
        "hours": "Pickup hours",
        "update_error": "Pickup availability could not be updated."
      },
      "recipient": {
        "checkbox": "I want to send this as a gift",
        "expanded": "Gift card recipient fields expanded",
        "collapsed": "Gift card recipient fields collapsed",
        "error_heading": "Please review the recipient details:",
        "email": "Recipient email",
        "email_optional": "Recipient email (optional without JavaScript)",
        "name": "Recipient name (optional)",
        "message": "Message (optional)",
        "characters_remaining": {
          "one": "{{ count }} character remaining",
          "other": "{{ count }} characters remaining"
        },
        "send_on": "Send on (optional)"
      }
    },
    "recommendations": {
      "related_heading": "You may also consider",
      "complementary_heading": "Complete the composition"
    }
  },
  "collections": {
    "general": {
      "collection": "Collection",
      "products_count": {
        "one": "{{ count }} product",
        "other": "{{ count }} products"
      },
      "no_products": "No products match your selection.",
      "empty": "This collection is empty.",
      "browse_all": "Browse all products"
    },
    "filters": {
      "title": "Filter and sort",
      "active_count": {
        "one": "{{ count }} active filter",
        "other": "{{ count }} active filters"
      },
      "from": "From",
      "to": "To",
      "sort_by": "Sort by",
      "apply": "Apply",
      "clear_all": "Clear all",
      "active_filters": "Active filters",
      "remove_filter": "Remove filter {{ filter }}:",
      "swatch_color": "{{ filter }}: {{ value }}"
    },
    "pagination": {
      "label": "Collection pagination",
      "previous": "Previous",
      "next": "Next"
    },
    "grid": {
      "label": "Choose product grid density",
      "title": "Grid",
      "one_column": "Show one product per row",
      "two_columns": "Show two products per row",
      "four_columns": "Show four products per row",
      "list_view": "Show products as a list"
    },
    "merchandising": {
      "promotion": "Editorial collection feature"
    }
  },
  "templates": {
    "home": {
      "title": "{{ shop }}",
      "message": "A flexible editorial storefront is taking shape."
    },
    "product": {
      "title": "Product"
    },
    "collection": {
      "title": "Collection"
    },
    "list_collections": {
      "title": "Collections"
    },
    "cart": {
      "title": "Cart",
      "empty": "Your cart is currently empty."
    },
    "search": {
      "title": "Search",
      "results_for": "Search results for “{{ terms }}”",
      "prompt": "Use search to explore the catalog."
    },
    "not_found": {
      "title": "Page not found",
      "message": "The page you requested could not be found.",
      "link": "Return home"
    },
    "page": {
      "title": "Page"
    },
    "blog": {
      "title": "Journal"
    },
    "article": {
      "title": "Article"
    },
    "password": {
      "title": "Opening soon",
      "message": "This shop is preparing its next chapter.",
      "password_label": "Store password",
      "submit": "Enter store"
    }
  },
  "gift_cards": {
    "issued": {
      "title": "Your {{ value }} gift card for {{ shop }}",
      "gift_card": "Gift card",
      "remaining_html": "{{ balance }} remaining",
      "expired": "Expired",
      "disabled": "This gift card is no longer active.",
      "expires_on": "Expires {{ expires_on }}",
      "use_at_checkout": "Use this code at checkout",
      "shop_link": "Continue shopping",
      "print": "Print gift card",
      "add_to_apple_wallet": "Add to Apple Wallet",
      "qr_code_alt": "QR code for this gift card"
    }
  },
  "newsletter": {
    "eyebrow": "Private correspondence",
    "heading": "Notes from the studio",
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
    "dialog_label": "Search our collection",
    "results_label": "Search suggestions",
    "loading": "Searching",
    "no_results": "No suggestions yet. Press enter to search the full catalog.",
    "clear": "Clear search",
    "in_stock": "In stock",
    "products": "Products",
    "collections": "Collections",
    "articles": "Journal",
    "pages": "Pages",
    "view_all": "View all results for \"{{ terms }}\"",
    "results_count": {
      "one": "1 suggestion available",
      "other": "{{ count }} suggestions available"
    }
  }
}
```

---

### <a id="locales-es-json"></a> locales/es.json

> **Descripcion:** Localizacion storefront en espanol (Paridad 100%)
> **Ruta:** `locales/es.json` | **Lineas:** 637 | **Tamano:** 23.92 KB

```json
{
  "general": {
    "accessibility": {
      "skip_to_content": "Saltar al contenido",
      "close": "Cerrar",
      "opens_in_new_window": "Se abre en una ventana nueva"
    },
    "navigation": {
      "home": "Inicio",
      "menu": "Menú",
      "primary": "Navegación principal",
      "secondary": "Navegación secundaria",
      "footer": "Navegación del pie de página",
      "view_all": "Ver todo en {{ title }}"
    },
    "search": {
      "label": "Buscar"
    },
    "pagination": {
      "page": "Página {{ number }}",
      "label": "Paginación",
      "previous": "Anterior",
      "next": "Siguiente"
    },
    "social": {
      "follow_us": "Síguenos",
      "instagram": "Instagram",
      "facebook": "Facebook",
      "pinterest": "Pinterest",
      "tiktok": "TikTok",
      "youtube": "YouTube"
    },
    "localization": {
      "currency": "Moneda",
      "current_language": "Idioma actual: {{ language }}",
      "language": "Idioma",
      "update": "Actualizar preferencias"
    }
  },
  "sections": {
    "header": {
      "cart": "Carrito",
      "cart_count": {
        "one": "Carrito, {{ count }} artículo",
        "other": "Carrito, {{ count }} artículos"
      },
      "mega_menu": {
        "featured": "Destacados"
      }
    },
    "footer": {
      "copyright": "© {{ year }} {{ shop }}",
      "payment_methods": "Métodos de pago aceptados"
    },
    "cart": {
      "title": "Tu carrito",
      "item_count": {
        "one": "{{ count }} artículo",
        "other": "{{ count }} artículos"
      },
      "empty": "Tu carrito está vacío.",
      "continue_shopping": "Seguir comprando",
      "quantity": "Cantidad",
      "decrease_quantity": "Reducir la cantidad de {{ title }}",
      "increase_quantity": "Aumentar la cantidad de {{ title }}",
      "remove": "Eliminar",
      "remove_item": "Eliminar {{ title }}",
      "discount": "Descuento",
      "subtotal": "Subtotal",
      "taxes_included": "Impuestos incluidos.",
      "taxes_and_shipping_at_checkout": "Los impuestos y el envío se calculan al finalizar la compra.",
      "update": "Actualizar carrito",
      "checkout": "Finalizar compra",
      "note": "Nota del pedido",
      "note_placeholder": "Añade una nota a tu pedido",
      "view_cart": "Ver carrito",
      "error": "No pudimos actualizar tu carrito. Inténtalo de nuevo.",
      "added": "Artículo añadido a tu carrito.",
      "add_failed": "No se pudo añadir este artículo al carrito.",
      "shipping_remaining": "Añade {{ amount }} para el envío gratuito",
      "shipping_unlocked_gift_remaining": "Envío gratuito desbloqueado. Añade {{ amount }} para recibir un obsequio",
      "rewards_unlocked": "Envío gratuito y obsequio desbloqueados",
      "rewards_progress": "Progreso de las ventajas del carrito",
      "shipping_milestone": "Envío desde {{ amount }}",
      "gift_milestone": "Obsequio desde {{ amount }}",
      "complimentary_additions": "Productos complementarios",
      "curated_for_order": "Seleccionado para este pedido",
      "add_complementary": "Añadir",
      "add_complementary_product": "Añadir {{ product }} a tu carrito",
      "choose_options": "Elegir opciones",
      "choose_options_product": "Elegir opciones para {{ product }}",
      "select_option": "Seleccionar {{ option }}",
      "view_product": "Ver producto",
      "view_product_for": "Ver producto: {{ product }}",
      "options_unavailable": "Esta combinación no está disponible.",
      "adding": "Añadiendo…",
      "cancel_options": "Cancelar",
      "update_unconfirmed": "No pudimos confirmar la actualización.",
      "check_cart": "Comprobar carrito",
      "saving_note": "Guardando la nota del pedido…",
      "note_save_unconfirmed": "No pudimos confirmar si la nota del pedido se guardó."
    },
    "announcement_bar": {
      "region_label": "Avisos de la tienda",
      "previous": "Aviso anterior",
      "next": "Aviso siguiente",
      "pause": "Pausar los avisos",
      "play": "Reproducir los avisos"
    },
    "lookbook": {
      "region_label": "Lookbook editorial interactivo",
      "image_alt": "Composición editorial con prendas disponibles para comprar",
      "open_product": "Ver detalles de {{ product }}",
      "featured_piece": "Pieza destacada",
      "view_product": "Ver producto",
      "products_label": "Piezas presentes en este look"
    },
    "complete_the_look": {
      "region_label": "Completa el look",
      "image_alt": "Vista editorial del look completo",
      "selected_count": {
        "one": "{{ count }} de {{ total }} pieza seleccionada",
        "other": "{{ count }} de {{ total }} piezas seleccionadas"
      },
      "add_selected": {
        "one": "Añadir {{ count }} pieza | {{ total }}",
        "other": "Añadir {{ count }} piezas | {{ total }}"
      },
      "select_items": "Selecciona al menos una pieza",
      "select_product": "Seleccionar {{ product }}",
      "choose_variant": "Elige una opción para {{ product }}",
      "selling_plan_required": "Disponible desde la página del producto con un plan de compra.",
      "requires_plan_option": "Requiere plan en la página del producto",
      "view_on_product_page": "Ver opciones en la página del producto",
      "total_label": "Total de la cápsula",
      "empty": "Elige de dos a cuatro productos en el editor de temas para componer este look.",
      "no_javascript": "Abre cada producto para elegir sus opciones y comprarlo por separado.",
      "added": "El look seleccionado se añadió a tu carrito.",
      "error": "No pudimos añadir este look. Revisa las opciones seleccionadas e inténtalo de nuevo."
    },
    "featured_product": {
      "region_label": "Producto destacado",
      "onboarding_title": "Producto de lujo destacado",
      "onboarding_price": "$480.00"
    },
    "recently_viewed": {
      "heading": "Vistos recientemente"
    },
    "main_product": {
      "blocks": {
        "inventory_status": {
          "low_stock": "Pocas existencias: [count] disponibles",
          "low_stock_generic": "Pocas existencias",
          "in_stock": "En existencias, listo para enviar",
          "preorder": "Disponible bajo pedido",
          "sold_out": "Agotado",
          "unavailable": "Esta opción no está disponible"
        },
        "shipping_lead_time": {
          "delivery_fallback": "Plazos y costes de entrega confirmados al pagar"
        },
        "trust_badges": {
          "returns_fallback": "Devoluciones sujetas a la política de la tienda"
        }
      }
    },
    "homepage": {
      "hero": {
        "region_label": "Campaña editorial destacada"
      },
      "curated": {
        "region_label": "Colecciones seleccionadas",
        "tabs_label": "Elige una colección",
        "tab_fallback": "Colección {{ number }}",
        "spotlight": "Selección destacada",
        "open_spotlight": "Abrir {{ title }}",
        "view_collection": "Ver todo en {{ title }}"
      },
      "manifesto": {
        "region_label": "Nuestro oficio y nuestros materiales",
        "material_image_alt": "Estudio en detalle de un material"
      },
      "bento": {
        "region_label": "Descubre colecciones, historias y productos",
        "explore": "Explorar {{ title }}"
      },
      "marquee": {
        "region_label": "Destacados editoriales",
        "pause": "Pausar los destacados editoriales",
        "play": "Reproducir los destacados editoriales"
      }
    }
  },
  "contact": {
    "atelier": {
      "hours": "Horario del estudio",
      "showroom": "Showroom"
    },
    "form": {
      "eyebrow": "Escríbenos",
      "title": "Tu consulta",
      "success": "Gracias. Te responderemos lo antes posible.",
      "error_heading": "Revisa los siguientes campos:",
      "name": "Nombre",
      "email": "Correo electrónico",
      "reason": "Motivo de la consulta",
      "reason_placeholder": "Elige un motivo",
      "reason_order": "Pedido y entrega",
      "reason_materials": "Materiales y cuidados",
      "reason_appointment": "Cita privada",
      "reason_press": "Prensa y profesionales",
      "reason_other": "Otro",
      "message": "Mensaje",
      "message_help": "Incluye el número de pedido si procede. Máximo 1000 caracteres.",
      "consent": "Acepto que mis datos se utilicen para responder a esta consulta.",
      "consent_value": "Aceptado",
      "required_note": "Todos los campos son obligatorios.",
      "submit": "Enviar consulta"
    },
    "faq": {
      "eyebrow": "Preguntas frecuentes",
      "title": "Antes de escribirnos"
    },
    "services": {
      "title": "Contactos directos del estudio",
      "response": "Plazo de respuesta: dos días hábiles"
    }
  },
  "faq": {
    "search": {
      "label": "Buscar en las preguntas",
      "placeholder": "Envíos, tallas, devoluciones",
      "results": "Coincidencias: {{ count }}",
      "empty": "Ninguna pregunta coincide con esa búsqueda. Prueba con una palabra más corta o escríbenos."
    }
  },
  "documentation": {
    "contents": "En esta página",
    "copy": "Copiar",
    "copied": "Copiado",
    "callout": {
      "info": "Nota",
      "tip": "Consejo",
      "warning": "Importante"
    }
  },
  "support": {
    "form": {
      "eyebrow": "Abrir una solicitud",
      "title": "Solicitud de soporte",
      "success": "Gracias. Tu solicitud ya está en el estudio y se atenderá por orden de llegada.",
      "error_heading": "Revisa los siguientes campos:",
      "name": "Nombre",
      "email": "Correo electrónico",
      "store_url": "URL de la tienda Shopify",
      "store_url_placeholder": "tu-tienda.myshopify.com",
      "store_url_help": "Opcional. Nos permite ver la misma tienda que describes.",
      "category": "¿Sobre qué es tu consulta?",
      "category_placeholder": "Elige una categoría",
      "category_presets": "Configuración de estilos del tema",
      "category_sections": "Personalización de secciones",
      "category_issue": "Informar de un problema",
      "category_commercial": "Consulta comercial",
      "message": "Descripción",
      "message_help": "Incluye la dirección de la página y los pasos que seguiste. Máximo 2000 caracteres.",
      "required_note": "Nombre, correo electrónico, categoría y descripción son obligatorios.",
      "submit": "Enviar solicitud"
    },
    "faq": {
      "title": "Antes de escribirnos"
    },
    "channels": {
      "title": "Otras formas de contactar con el estudio"
    }
  },
  "policy": {
    "contents": "En esta página",
    "updated": "Última actualización: {{ date }}"
  },
  "blogs": {
    "blog": {
      "categories_label": "Categorías del diario",
      "all_stories": "Todas las historias",
      "editorial": "Editorial",
      "read_article": "Leer {{ title }}",
      "read_essay": "Leer el ensayo",
      "latest": "Ensayos recientes",
      "article_count": {
        "one": "{{ count }} ensayo",
        "other": "{{ count }} ensayos"
      },
      "empty": "Aún no se ha publicado ningún ensayo."
    },
    "article": {
      "reading_time": {
        "one": "{{ count }} min de lectura",
        "other": "{{ count }} min de lectura"
      },
      "by_author": "Texto de {{ author }}",
      "featured_objects": "Objetos presentes en esta historia",
      "navigation": "Más historias del diario",
      "previous": "Historia anterior",
      "next": "Historia siguiente"
    },
    "comments": {
      "eyebrow": "Conversación",
      "count": {
        "one": "{{ count }} comentario",
        "other": "{{ count }} comentarios"
      },
      "none": "Deja el primer comentario.",
      "pagination": "Paginación de los comentarios",
      "form_title": "Deja un comentario",
      "success": "Tu comentario se ha publicado.",
      "success_moderated": "Hemos recibido tu comentario. Aparecerá tras su revisión.",
      "error_heading": "Revisa los siguientes campos:",
      "name": "Nombre",
      "email": "Correo electrónico",
      "message": "Comentario",
      "submit": "Publicar comentario"
    }
  },
  "search": {
    "header": {
      "eyebrow": "Buscar en la tienda",
      "title": "Buscar",
      "results_for": "Resultados para «{{ terms }}»"
    },
    "tabs": {
      "label": "Tipos de resultado",
      "all": "Todo",
      "products": "Productos",
      "articles": "Diario",
      "pages": "Páginas"
    },
    "form": {
      "label": "Buscar",
      "placeholder": "Busca productos, materiales e historias",
      "submit": "Buscar"
    },
    "results": {
      "count": {
        "one": "{{ count }} resultado",
        "other": "{{ count }} resultados"
      },
      "article": "Diario",
      "page": "Página",
      "view_page": "Ver página",
      "none_title": "Sin resultados para «{{ terms }}»",
      "none_text": "Prueba con un material o un tipo de objeto más amplio, o explora la colección actual.",
      "browse": "Explorar todos los productos"
    },
    "prompt": {
      "title": "Encuentra un objeto o una historia",
      "text": "Busca por material, categoría o nombre."
    }
  },
  "not_found": {
    "eyebrow": "Error / Índice del archivo",
    "title": "Página no encontrada.",
    "message": "La página que buscas no forma parte de la serie actual. Es posible que haya pasado al archivo.",
    "search_label": "Buscar en la tienda",
    "search_placeholder": "Busca productos e historias",
    "search_submit": "Buscar",
    "return_to_collection": "Volver a la colección",
    "recommendations": "Piezas destacadas / Sigue explorando"
  },
  "password": {
    "image_alt": "Avance editorial de la próxima colección",
    "opening_label": "Nota de apertura",
    "newsletter": {
      "email": "Correo electrónico",
      "submit": "Solicitar acceso anticipado",
      "privacy": "Solo notas privadas. Puedes darte de baja cuando quieras.",
      "success": "Gracias. Hemos recibido tu solicitud de acceso anticipado.",
      "error_heading": "Revisa tu correo electrónico:"
    },
    "access": {
      "open": "Entrar con contraseña",
      "eyebrow": "Acceso privado",
      "title": "Entra a la tienda",
      "instructions": "Usa la contraseña que te facilitó el propietario de la tienda.",
      "label": "Contraseña de la tienda",
      "submit": "Entrar en la tienda",
      "error": "La contraseña no es correcta. Inténtalo de nuevo."
    }
  },
  "list_collections": {
    "title": "Colecciones",
    "view_collection": "Ver {{ title }}",
    "product_count": {
      "one": "{{ count }} pieza",
      "other": "{{ count }} piezas"
    },
    "empty": "Todavía no hay colecciones disponibles."
  },
  "products": {
    "product": {
      "add_to_cart": "Añadir al carrito",
      "choose_options": "Elegir opciones",
      "quick_add": "Añadir rápido",
      "select_size": "Seleccionar talla",
      "color_swatch": "{{ option }}: {{ value }}",
      "more_swatches": "+{{ count }} más",
      "sold_out": "Agotado",
      "unavailable": "No disponible",
      "sale": "Oferta",
      "quantity": "Cantidad",
      "decrease_quantity": "Reducir la cantidad de {{ product }}",
      "increase_quantity": "Aumentar la cantidad de {{ product }}",
      "regular_price": "Precio habitual",
      "sale_price": "Precio de oferta",
      "price_from": "Desde",
      "unit_price": "Precio unitario",
      "taxes_included": "Impuestos incluidos.",
      "estimated_line_total": "Subtotal estimado del artículo para {{ quantity }} unidades:",
      "taxes_included_shipping_at_checkout": "Impuestos incluidos. Envío calculado al pagar.",
      "taxes_and_shipping_at_checkout": "Impuestos y envío calculados al pagar.",
      "discounts_at_checkout": "Los descuentos y el importe final se confirman al pagar.",
      "technical_specs": {
        "material": "Composición del material",
        "gsm": "Gramaje (GSM)",
        "hardware": "Herrajes y avíos",
        "origin": "Origen y confección"
      },
      "provenance": {
        "single_piece": "Pieza de archivo única",
        "circa": "Circa {{ year }}",
        "condition": "Estado",
        "grade_1": "Grado I · Desgaste visible mínimo",
        "grade_2": "Grado II · Desgaste leve",
        "grade_3": "Grado III · Desgaste visible",
        "grade_4": "Grado IV · Desgaste significativo",
        "grade_5": "Grado V · Frágil / pieza de estudio"
      },
      "media_gallery": "Galería de imágenes del producto",
      "media_thumbnails": "Miniaturas del producto",
      "view_media": "Ver imagen {{ number }} del producto",
      "media_zoom": {
        "title": "Zoom de imagen",
        "open": "Ampliar imagen {{ index }} de {{ total }}",
        "close": "Cerrar zoom",
        "zoom_in": "Acercar",
        "zoom_out": "Alejar",
        "reset": "Restablecer zoom",
        "previous": "Imagen anterior",
        "next": "Imagen siguiente",
        "status": "Imagen {{ index }} de {{ total }}, zoom {{ zoom }} %",
        "image_index": "Imagen {{ index }} de {{ total }}"
      },
      "view_in_space": "Ver en tu espacio",
      "option_unavailable": "Opción no disponible",
      "variant_available": "Variante disponible.",
      "variant_sold_out": "Variante agotada.",
      "size_guide": "Guía de tallas y medidas",
      "model_fit": "Talla de referencia",
      "measurement_units": "Unidades de medida",
      "centimeters": "CM",
      "inches": "PULGADAS",
      "sticky_add_to_cart": "Añadir {{ product }} al carrito",
      "sticky_add_quantity_to_cart": "Añadir {{ product }} al carrito, cantidad {{ quantity }}",
      "sticky_quantity_price": "{{ quantity }} × {{ price }}",
      "sticky_total": "Total {{ total }}",
      "purchase_options": {
        "legend": "Opciones de compra",
        "one_time": "Compra única",
        "subscribe": "Suscríbete y ahorra",
        "delivery_schedule": "Frecuencia de entrega",
        "per_delivery": "{{ price }} por entrega",
        "unavailable": "Esta opción de compra no está disponible",
        "plan_required": "Esta opción requiere un plan de suscripción que ahora no está disponible."
      },
      "pickup": {
        "eyebrow": "Recogida en tienda",
        "available_at_html": "Recogida disponible en <strong>{{ location_name }}</strong>",
        "unavailable_at_html": "Recogida no disponible por ahora en <strong>{{ location_name }}</strong>",
        "available": "Recogida disponible",
        "unavailable": "Recogida no disponible por ahora",
        "view_store_info": "Ver información de la tienda",
        "check_other_stores": "Consultar la disponibilidad en otras tiendas",
        "hours": "Horario de recogida",
        "update_error": "No se pudo actualizar la disponibilidad de recogida."
      },
      "recipient": {
        "checkbox": "Quiero enviar esta tarjeta como regalo",
        "expanded": "Campos del destinatario de la tarjeta regalo desplegados",
        "collapsed": "Campos del destinatario de la tarjeta regalo contraídos",
        "error_heading": "Revisa los datos del destinatario:",
        "email": "Correo electrónico del destinatario",
        "email_optional": "Correo electrónico del destinatario (opcional sin JavaScript)",
        "name": "Nombre del destinatario (opcional)",
        "message": "Mensaje (opcional)",
        "characters_remaining": {
          "one": "Queda {{ count }} carácter",
          "other": "Quedan {{ count }} caracteres"
        },
        "send_on": "Fecha de envío (opcional)"
      }
    },
    "recommendations": {
      "related_heading": "También te puede interesar",
      "complementary_heading": "Completa la composición"
    }
  },
  "collections": {
    "general": {
      "collection": "Colección",
      "products_count": {
        "one": "{{ count }} producto",
        "other": "{{ count }} productos"
      },
      "no_products": "Ningún producto coincide con tu selección.",
      "empty": "Esta colección está vacía.",
      "browse_all": "Ver todos los productos"
    },
    "filters": {
      "title": "Filtrar y ordenar",
      "active_count": {
        "one": "{{ count }} filtro activo",
        "other": "{{ count }} filtros activos"
      },
      "from": "Desde",
      "to": "Hasta",
      "sort_by": "Ordenar por",
      "apply": "Aplicar",
      "clear_all": "Borrar todo",
      "active_filters": "Filtros activos",
      "remove_filter": "Quitar filtro {{ filter }}:",
      "swatch_color": "{{ filter }}: {{ value }}"
    },
    "pagination": {
      "label": "Paginación de la colección",
      "previous": "Anterior",
      "next": "Siguiente"
    },
    "grid": {
      "label": "Elige la densidad de la cuadrícula",
      "title": "Cuadrícula",
      "one_column": "Mostrar un producto por fila",
      "two_columns": "Mostrar dos productos por fila",
      "four_columns": "Mostrar cuatro productos por fila",
      "list_view": "Mostrar productos en lista"
    },
    "merchandising": {
      "promotion": "Destacado editorial de la colección"
    }
  },
  "templates": {
    "home": {
      "title": "{{ shop }}",
      "message": "Una tienda editorial y flexible está tomando forma."
    },
    "product": {
      "title": "Producto"
    },
    "collection": {
      "title": "Colección"
    },
    "list_collections": {
      "title": "Colecciones"
    },
    "cart": {
      "title": "Carrito",
      "empty": "Tu carrito está vacío."
    },
    "search": {
      "title": "Buscar",
      "results_for": "Resultados de búsqueda para «{{ terms }}»",
      "prompt": "Usa el buscador para explorar el catálogo."
    },
    "not_found": {
      "title": "Página no encontrada",
      "message": "No encontramos la página que buscas.",
      "link": "Volver al inicio"
    },
    "page": {
      "title": "Página"
    },
    "blog": {
      "title": "Diario"
    },
    "article": {
      "title": "Artículo"
    },
    "password": {
      "title": "Próxima apertura",
      "message": "Esta tienda prepara su próximo capítulo.",
      "password_label": "Contraseña de la tienda",
      "submit": "Entrar en la tienda"
    }
  },
  "gift_cards": {
    "issued": {
      "title": "Tu tarjeta regalo de {{ value }} para {{ shop }}",
      "gift_card": "Tarjeta regalo",
      "remaining_html": "Saldo disponible: {{ balance }}",
      "expired": "Caducada",
      "disabled": "Esta tarjeta regalo ya no está activa.",
      "expires_on": "Caduca el {{ expires_on }}",
      "use_at_checkout": "Usa este código al finalizar la compra",
      "shop_link": "Seguir comprando",
      "print": "Imprimir tarjeta regalo",
      "add_to_apple_wallet": "Añadir a Apple Wallet",
      "qr_code_alt": "Código QR de esta tarjeta regalo"
    }
  },
  "newsletter": {
    "eyebrow": "Correspondencia privada",
    "heading": "Notas del estudio",
    "copy": "Nuevos objetos, estudios de materiales y avances privados, enviados con mesura.",
    "email_label": "Correo electrónico",
    "email_placeholder": "nombre@ejemplo.com",
    "submit": "Suscribirse",
    "success": "Gracias. Tu primera nota llegará pronto.",
    "error_heading": "Revisa tu correo electrónico:"
  },
  "predictive_search": {
    "search_label": "Buscar",
    "placeholder": "Busca productos, materiales e historias",
    "dialog_label": "Buscar en la tienda",
    "results_label": "Sugerencias de búsqueda",
    "loading": "Buscando",
    "no_results": "Aún no hay sugerencias. Pulsa Enter para buscar en todo el catálogo.",
    "clear": "Borrar la búsqueda",
    "in_stock": "Disponible",
    "products": "Productos",
    "collections": "Colecciones",
    "articles": "Diario",
    "pages": "Páginas",
    "view_all": "Ver todos los resultados para «{{ terms }}»",
    "results_count": {
      "one": "1 sugerencia disponible",
      "other": "{{ count }} sugerencias disponibles"
    }
  }
}
```

---

### <a id="assets-theme-js"></a> assets/theme.js

> **Descripcion:** Motor JavaScript nativo sin dependencias externas
> **Ruta:** `assets/theme.js` | **Lineas:** 5652 | **Tamano:** 230.24 KB

```javascript
(() => {
  'use strict';

  if (window.ThemeCore?.initialized) return;

  const focusableSelector = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'details > summary:first-of-type',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusableElements = (container) =>
    Array.from(container.querySelectorAll(focusableSelector)).filter((element) => {
      if (element.closest('[hidden], [inert]')) return false;
      return element.getClientRects().length > 0;
    });

  const trapFocus = (container, initialFocus = null) => {
    const handleKeydown = (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeydown);

    requestAnimationFrame(() => {
      const focusTarget = initialFocus || getFocusableElements(container)[0] || container;
      focusTarget.focus();
    });

    return () => container.removeEventListener('keydown', handleKeydown);
  };

  // Only one dialog may own the focus trap and the inert background at a time. Two open
  // at once make each other's ancestors inert, which leaves the visible dialog's own
  // controls unclickable and sends Escape to the wrong surface. Every dialog therefore
  // dismisses the others as it opens.
  const DIALOGS_WITH_SET_OPEN = 'theme-drawer[data-open], predictive-search[data-open]';
  const DIALOGS_WITH_CLOSE = 'cart-drawer[data-open], size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open], product-card-variants[data-open]';

  const closeOtherDialogs = (except = null) => {
    document.querySelectorAll(DIALOGS_WITH_SET_OPEN).forEach((dialog) => {
      if (dialog === except || typeof dialog.setOpen !== 'function') return;
      dialog.setOpen(false);
    });

    document.querySelectorAll(DIALOGS_WITH_CLOSE).forEach((dialog) => {
      if (dialog === except || typeof dialog.close !== 'function') return;
      dialog.close(false);
    });
  };

  const syncDialogScrollLocks = () => {
    document.body.toggleAttribute('data-drawer-open', Boolean(document.querySelector('theme-drawer[data-open], cart-drawer[data-open]')));
    document.body.toggleAttribute('data-modal-open', Boolean(document.querySelector('size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open], predictive-search[data-open], product-card-variants[data-modal], product-zoom[data-open]')));
  };

  // 5B-001, H-13. Una diapositiva que sale de la vista no puede seguir sonando: <video> se
  // pausa y los reproductores de YouTube y Vimeo (media_tag con su API activa) reciben la
  // orden de pausa por postMessage, el mismo mensaje que documenta cada plataforma.
  const pauseMedia = (container) => {
    container.querySelectorAll('video').forEach((video) => video.pause());
    container.querySelectorAll('iframe').forEach((frame) => {
      const source = frame.getAttribute('src') || '';
      if (source.includes('youtube')) {
        frame.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else if (source.includes('vimeo')) {
        frame.contentWindow?.postMessage('{"method":"pause"}', '*');
      }
    });
  };

  // The eight amount tokens Shopify allows inside money_format / money_with_currency_format.
  const MONEY_PATTERNS = {
    amount: { precision: 2, thousands: ',', decimal: '.' },
    amount_no_decimals: { precision: 0, thousands: ',', decimal: '.' },
    amount_with_comma_separator: { precision: 2, thousands: '.', decimal: ',' },
    amount_no_decimals_with_comma_separator: { precision: 0, thousands: '.', decimal: ',' },
    amount_with_apostrophe_separator: { precision: 2, thousands: "'", decimal: '.' },
    amount_no_decimals_with_space_separator: { precision: 0, thousands: ' ', decimal: '.' },
    amount_with_space_separator: { precision: 2, thousands: ' ', decimal: ',' },
    amount_with_period_and_space_separator: { precision: 2, thousands: ' ', decimal: '.' },
  };

  const MONEY_TOKEN = /\{\{\s*(\w+)\s*\}\}/;

  // Last-resort template. Only reached when the shop exposes no usable money_format,
  // and exists so a price degrades to a readable number instead of an empty node.
  const DEFAULT_MONEY_FORMAT = '${{amount}}';

  // Accepts cents as a number, or as a string of digits. A decimal string such as
  // "12.34" is rejected rather than silently read as 12 cents.
  const isCentsLike = (cents) => typeof cents === 'number'
    || (typeof cents === 'string' && /^-?\d+$/.test(cents.trim()));

  const formatMoney = (cents, format) => {
    if (!isCentsLike(cents)) return '';
    const amount = Math.round(Number(cents));
    if (!Number.isFinite(amount)) return '';

    const template = [
      format,
      window.theme?.moneyFormat,
      document.documentElement.dataset.moneyFormat,
      DEFAULT_MONEY_FORMAT,
    ].find((candidate) => typeof candidate === 'string'
      && Object.hasOwn(MONEY_PATTERNS, candidate.match(MONEY_TOKEN)?.[1]));
    if (!template) return '';

    const pattern = MONEY_PATTERNS[template.match(MONEY_TOKEN)[1]];
    // Decodes entities a merchant may have typed into money_format (&pound;, &#36;)
    // while keeping any markup inert, since the result is written with textContent.
    const decoder = document.createElement('textarea');
    decoder.innerHTML = template.replace(/</g, '&lt;');
    const textTemplate = decoder.value;
    const fixed = (amount / 100).toFixed(pattern.precision);
    const [whole, fraction] = fixed.split('.');
    const grouped = whole.replace(/(\d)(?=(\d{3})+$)/g, `$1${pattern.thousands}`);
    const value = fraction ? `${grouped}${pattern.decimal}${fraction}` : grouped;

    return textTemplate.replace(new RegExp(MONEY_TOKEN.source, 'g'), value);
  };

  const fetchCommerce = (url, options, errorMessage) => fetch(url, options).catch((error) => {
    if (error.name === 'AbortError') throw error;
    throw new Error(errorMessage);
  });

  class ThemeElement extends HTMLElement {
    startListening() {
      this.stopListening();
      this.abortController = new AbortController();
      return this.abortController.signal;
    }

    listen(target, eventName, handler, options = {}) {
      if (!this.abortController) this.startListening();
      target.addEventListener(eventName, handler, {
        ...options,
        signal: this.abortController.signal,
      });
    }

    stopListening() {
      this.abortController?.abort();
      this.abortController = null;
    }

    disconnectedCallback() {
      this.stopListening();
    }
  }

  class ThemeDisclosure extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-disclosure-trigger]');
      this.panel = this.querySelector('[data-disclosure-panel]');

      if (!this.trigger || !this.panel) return;

      this.setOpen(false);
      this.listen(this.trigger, 'click', () => this.setOpen(!this.isOpen));
      this.listen(document, 'pointerdown', (event) => {
        if (this.isOpen && !this.contains(event.target)) this.setOpen(false);
      });
      this.listen(this, 'shopify:block:select', () => this.setOpen(true));
      this.listen(this, 'shopify:block:deselect', () => this.setOpen(false));
      // 5C-002. En escritorio el panel tapa la pagina bajo la cabecera: si el foco llega a algo
      // de fuera, se cierra para no dejarlo debajo (WCAG 2.4.11). Dentro de la cabecera no tapa
      // nada y Shift+Tab sigue volviendo al panel. El cajon movil no lo necesita.
      const header = this.closest('.desktop-nav') && this.closest('.site-header');
      if (header) {
        this.listen(document, 'focusin', (event) => {
          if (this.isOpen && !header.contains(event.target)) this.setOpen(false);
        });
      }
      this.listen(this, 'keydown', (event) => {
        if (event.key === 'Escape' && this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          this.setOpen(false, true);
          return;
        }

        // Las flechas son opcionales en un menu de divulgacion: la navegacion esperada es
        // Tab, y en el cajon movil capturar ArrowDown le quitaria el scroll al teclado.
        // Por eso las pide quien las quiere, con data-disclosure-arrows.
        if (this.dataset.disclosureArrows !== undefined) this.handleArrowKeys(event);
      });
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    get focusableLinks() {
      return Array.from(this.panel?.querySelectorAll('a[href]') || []);
    }

    handleArrowKeys(event) {
      const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;

      // Desde el disparador, bajar abre el panel y entra en el: es el gesto que espera
      // quien navega con teclado, y ahorra un Tab.
      if (event.target === this.trigger && event.key === 'ArrowDown') {
        event.preventDefault();
        if (!this.isOpen) this.setOpen(true);
        this.focusableLinks[0]?.focus();
        return;
      }

      const links = this.focusableLinks;
      const index = links.indexOf(event.target);
      if (index === -1) return;

      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowDown') next = index + 1;
      else if (event.key === 'ArrowUp') next = index - 1;
      else if (event.key === 'Home') next = 0;
      else next = links.length - 1;

      // Sin ciclo: al pasarse por arriba se vuelve al disparador, y por abajo no se mueve.
      // Envolver la lista deja a quien no ve la pantalla sin saber donde termina.
      if (next < 0) {
        this.trigger.focus();
        return;
      }
      links[Math.min(next, links.length - 1)]?.focus();
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.panel) return;

      if (open) {
        this.closest('.desktop-nav')?.querySelectorAll('theme-disclosure[data-open]')
          .forEach((other) => other !== this && other.setOpen(false));
      }

      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.hidden = !open;
      this.panel.inert = !open;
      this.toggleAttribute('data-open', open);

      if (!open && restoreFocus) this.trigger.focus();
    }
  }

  class ThemeDrawer extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-drawer-trigger]');
      this.overlay = this.querySelector('[data-drawer-overlay]');
      this.panel = this.querySelector('[data-drawer-panel]');
      this.closeButtons = this.querySelectorAll('[data-drawer-close]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;

      if (!this.trigger || !this.overlay || !this.panel) return;

      this.setOpen(false);
      this.listen(this.trigger, 'click', () => this.setOpen(true));
      this.closeButtons.forEach((button) => {
        this.listen(button, 'click', () => this.setOpen(false, true));
      });
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.setOpen(false, true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.setOpen(false, true);
      });
    }

    disconnectedCallback() {
      this.setOpen(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.overlay || !this.panel) return;

      // Runs before this drawer touches body[data-drawer-open] or the inert background,
      // so a closing cart drawer cannot strip the state this one is about to set.
      if (open) closeOtherDialogs(this);

      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.setAttribute('aria-hidden', String(!open));
      this.panel.inert = !open;
      this.overlay.hidden = !open;
      this.toggleAttribute('data-open', open);
      syncDialogScrollLocks();

      if (open) {
        this.applyBackgroundInert();
        const initialFocus = this.querySelector('[data-drawer-close]');
        this.releaseFocusTrap = trapFocus(this.panel, initialFocus);
      } else {
        this.releaseFocusTrap?.();
        this.releaseFocusTrap = null;
        this.restoreBackgroundInert();
        if (restoreFocus) this.trigger.focus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class ProductGallery extends ThemeElement {
    connectedCallback() {
      this.startListening();
      if (this.dataset.layout !== 'thumbnails') {
        this.initCarousel();
        return;
      }

      this.items = Array.from(this.querySelectorAll('[data-product-media-id]'));
      this.thumbnails = Array.from(this.querySelectorAll('[data-product-thumbnail]'));
      this.status = this.querySelector('[data-product-gallery-status]');
      if (this.items.length === 0 || this.thumbnails.length === 0) return;

      this.thumbnails.forEach((thumbnail) => {
        this.listen(thumbnail, 'click', () => this.selectMedia(thumbnail.dataset.mediaId, true));
      });

      const productSection = this.closest('[data-section-id]');
      if (productSection) {
        this.listen(productSection, 'theme:variant-change', (event) => {
          const mediaId = event.detail?.variant?.featured_media_id;
          if (mediaId) this.selectMedia(mediaId, false);
        });
      }

      const initialMedia = this.items.find((item) => item.hasAttribute('data-selected'))
        || this.items[0];
      this.selectMedia(initialMedia.dataset.productMediaId, false);
    }

    // 4F-001. Carrusel movil. Por debajo de 62rem la galeria (stack o grid) es una fila
    // con scroll-snap que el CSS ya hace deslizable sin JavaScript. Aqui solo se anade lo
    // que el CSS no sabe hacer: contador, botones anterior y siguiente, foco de teclado en
    // la pista y saltar a la imagen de la variante elegida.
    initCarousel() {
      this.track = this.querySelector('[data-gallery-track]');
      this.pager = this.querySelector('[data-gallery-pager]');
      this.slides = Array.from(this.querySelectorAll('[data-product-media-id]'));
      if (!this.track || !this.pager || this.slides.length < 2) return;

      this.counter = this.pager.querySelector('[data-gallery-current]');
      this.carouselStatus = this.pager.querySelector('[data-gallery-status]');
      this.steps = Array.from(this.pager.querySelectorAll('[data-gallery-step]'));
      this.carouselQuery = window.matchMedia('(max-width: 61.99rem)');
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.currentSlide = -1;

      this.steps.forEach((step) => {
        this.listen(step, 'click', () => {
          this.goToSlide(this.currentSlide + Number(step.dataset.galleryStep), true);
        });
      });

      // El indice sale de la posicion de scroll, que es lo que ve el comprador tanto si
      // desliza con el dedo, con el trackpad o con las flechas del teclado.
      let frame = 0;
      this.listen(this.track, 'scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => this.syncSlide(false));
      }, { passive: true });

      this.listen(this.carouselQuery, 'change', () => this.syncCarouselMode());

      const productSection = this.closest('[data-section-id]');
      if (productSection) {
        this.listen(productSection, 'theme:variant-change', (event) => {
          const mediaId = event.detail?.variant?.featured_media_id;
          const index = this.slides.findIndex(
            (slide) => String(slide.dataset.productMediaId) === String(mediaId),
          );
          if (index >= 0) this.goToSlide(index, false);
        });
      }

      this.syncCarouselMode();
    }

    syncCarouselMode() {
      const active = this.carouselQuery.matches;
      this.pager.hidden = !active;

      // Una pista desplazable tiene que poder recibir el foco para que el teclado la mueva
      // (axe: scrollable-region-focusable). Fuera del carrusel no es desplazable y no debe
      // ser una parada de tabulacion vacia.
      if (active) {
        this.track.tabIndex = 0;
        this.track.setAttribute('aria-label', this.getAttribute('aria-label') || '');
      } else {
        this.track.removeAttribute('tabindex');
        this.track.removeAttribute('aria-label');
      }

      this.syncSlide(false);
    }

    slideIndexFromScroll() {
      const width = this.track.clientWidth;
      if (!width) return 0;
      // En RTL scrollLeft es negativo; el valor absoluto cuenta desde el inicio igual.
      const index = Math.round(Math.abs(this.track.scrollLeft) / width);
      return Math.min(Math.max(index, 0), this.slides.length - 1);
    }

    syncSlide(announce) {
      this.applySlide(this.slideIndexFromScroll(), announce);
    }

    applySlide(index, announce) {
      if (index === this.currentSlide && !announce) return;
      this.currentSlide = index;
      this.slides.forEach((slide, position) => {
        if (position !== index) pauseMedia(slide);
      });

      if (this.counter) this.counter.textContent = String(index + 1);
      this.steps.forEach((step) => {
        const direction = Number(step.dataset.galleryStep);
        step.disabled = direction < 0 ? index === 0 : index === this.slides.length - 1;
      });

      if (announce && this.carouselStatus) {
        const template = this.pager.dataset.viewMediaTemplate || '';
        this.carouselStatus.textContent = template.replace('[number]', String(index + 1));
      }
    }

    goToSlide(index, announce) {
      if (!this.carouselQuery?.matches) return;
      const target = Math.min(Math.max(index, 0), this.slides.length - 1);
      const rtl = getComputedStyle(this.track).direction === 'rtl';
      const left = target * this.track.clientWidth * (rtl ? -1 : 1);

      this.track.scrollTo({ left, behavior: this.reducedMotionQuery.matches ? 'auto' : 'smooth' });
      // El contador salta ya al destino: esperar al scroll suave lo dejaria unos cientos
      // de milisegundos en la imagen de origen, y con la pista ya en su sitio no habria
      // evento scroll que lo corrigiera.
      this.applySlide(target, announce);
    }

    selectMedia(mediaId, announce) {
      const selectedItem = this.items.find(
        (item) => String(item.dataset.productMediaId) === String(mediaId),
      );
      if (!selectedItem) return;

      this.items.forEach((item) => {
        const selected = item === selectedItem;
        item.hidden = !selected;
        item.toggleAttribute('data-selected', selected);
        if (!selected) pauseMedia(item);
      });

      let selectedThumbnail = null;
      this.thumbnails.forEach((thumbnail) => {
        const selected = String(thumbnail.dataset.mediaId) === String(mediaId);
        thumbnail.setAttribute('aria-pressed', String(selected));
        if (selected) selectedThumbnail = thumbnail;
      });

      if (announce && this.status && selectedThumbnail) {
        this.status.textContent = selectedThumbnail.getAttribute('aria-label') || '';
      }
    }
  }

  class VariantSelects extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.variantData = this.getVariantData();

      if (this.variantData.length === 0) return;

      this.moneyFormat = this.dataset.moneyFormat || '';
      this.quantityInput = this.querySelector('[data-quantity-input]');
      this.lineTotal = this.querySelector('[data-line-total]');

      if (this.quantityInput && this.lineTotal) {
        const recalculate = () => this.updateLineTotal();
        this.listen(this.quantityInput, 'input', recalculate);
        this.listen(this.quantityInput, 'change', recalculate);
      }

      this.listen(this, 'change', (event) => {
        if (event.target.matches('[data-option-position]')) {
          this.updateSelectedOptionLabels();
          this.updateOptionAvailability();
          this.updateVariant();
          return;
        }

        if (event.target.matches('[data-purchase-option]')) {
          this.updatePurchaseSelection();
          return;
        }

        if (event.target.matches('[data-selling-plan-select]')) {
          this.updatePurchaseSelection();
        }
      });

      this.currentVariant = this.getInitialVariant();
      this.cachePurchaseOptionElements();
      this.updateSelectedOptionLabels();
      this.updateOptionAvailability();
      this.updatePurchaseOptions(this.currentVariant);
      this.updateForms(this.currentVariant);
      this.updatePrice(this.currentVariant);
      this.updateQuantityRules(this.currentVariant);
    }

    getVariantData() {
      const dataElement = this.querySelector('[data-variant-json]');
      if (!dataElement) return [];

      try {
        return JSON.parse(dataElement.textContent);
      } catch {
        return [];
      }
    }

    getInitialVariant() {
      const variantId = this.querySelector('[data-variant-id]')?.value;
      return this.variantData.find((variant) => String(variant.id) === String(variantId))
        || this.variantData[0];
    }

    cachePurchaseOptionElements() {
      this.sellingPlans = this.querySelector('[data-selling-plans]');
      this.sellingPlanInput = this.querySelector('[data-selling-plan-input]');
      this.sellingPlanSelect = this.querySelector('[data-selling-plan-select]');
      this.sellingPlanDetails = this.querySelector('[data-selling-plan-details]');
      this.sellingPlanStatus = this.querySelector('[data-selling-plan-status]');
      this.perDeliveryPrice = this.querySelector('[data-selling-plan-per-delivery]');
      this.oneTimeInput = this.querySelector('[data-purchase-option="one_time"]');
      this.subscriptionInput = this.querySelector('[data-purchase-option="subscription"]');
      this.oneTimePrice = this.querySelector('[data-one-time-price]');
      this.subscriptionPrice = this.querySelector('[data-subscription-price]');
      this.currentAllocation = null;
    }

    getSelectedOptions() {
      const selectedOptions = [];

      this.querySelectorAll('[data-option-position]:checked').forEach((input) => {
        selectedOptions[Number(input.dataset.optionPosition) - 1] = input.value;
      });

      return selectedOptions;
    }

    updateSelectedOptionLabels() {
      this.querySelectorAll('[data-option-position]:checked').forEach((input) => {
        const output = this.querySelector(`[data-selected-option="${input.dataset.optionPosition}"]`);
        if (output) output.textContent = input.value;
      });
    }

    // A360-05. El aviso de agotado depende de la combinacion con las demas opciones
    // elegidas. Solo se desactiva un valor sin ninguna variante disponible: desactivar por
    // combinacion dejaria combinaciones en stock inalcanzables (Camel/L y Black/S, por ejemplo).
    updateOptionAvailability() {
      const selectedOptions = this.getSelectedOptions();
      this.querySelectorAll('[data-option-position]').forEach((input) => {
        const optionIndex = Number(input.dataset.optionPosition) - 1;
        const inStock = this.variantData.filter(
          (variant) => variant.available && variant.options[optionIndex] === input.value,
        );
        const availableHere = inStock.some((variant) => variant.options.every(
          (value, index) => index === optionIndex || selectedOptions[index] == null || value === selectedOptions[index],
        ));
        const unavailableLabel = this.querySelector(
          `label[for="${input.id}"] [data-unavailable-label]`,
        );

        input.disabled = inStock.length === 0;
        input.setAttribute('aria-disabled', String(input.disabled));
        if (unavailableLabel) unavailableLabel.hidden = availableHere;
      });
    }

    updateVariant() {
      const selectedOptions = this.getSelectedOptions();
      const variant = this.variantData.find(
        (candidate) =>
          candidate.options.length === selectedOptions.length &&
          candidate.options.every((option, index) => option === selectedOptions[index]),
      );

      this.currentVariant = variant;
      this.updatePurchaseOptions(variant);
      this.updateForms(variant);
      this.updatePrice(variant);
      this.updateQuantityRules(variant);
      this.updateMedia(variant);
      this.updateStatus(variant);
      this.updateUrl(variant);
      this.dispatchEvent(
        new CustomEvent('theme:variant-change', {
          bubbles: true,
          detail: { variant },
        }),
      );
      this.dispatchPurchaseOptionChange();
    }

    updatePurchaseSelection() {
      this.updatePurchaseOptions(this.currentVariant);
      this.updateForms(this.currentVariant);
      this.updatePrice(this.currentVariant);
      this.updateStatus(this.currentVariant);
      this.updateUrl(this.currentVariant);
      this.dispatchPurchaseOptionChange();
    }

    updatePurchaseOptions(variant) {
      if (!this.sellingPlans) {
        this.currentAllocation = null;
        return;
      }

      const allocations = variant?.selling_plan_allocations || [];
      const allocationIds = new Set(allocations.map((allocation) => String(allocation.id)));

      this.sellingPlanSelect?.querySelectorAll('[data-selling-plan-option]').forEach((option) => {
        const available = allocationIds.has(String(option.value));
        option.disabled = !available;
        option.hidden = !available;
      });
      this.sellingPlanSelect?.querySelectorAll('[data-selling-plan-group]').forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll('[data-selling-plan-option]')).some(
          (option) => !option.disabled,
        );
      });

      const requestedPlanId = this.sellingPlanSelect?.value || this.sellingPlanInput?.value;
      const selectedAllocation = allocations.find(
        (allocation) => String(allocation.id) === String(requestedPlanId),
      ) || allocations[0] || null;
      const oneTimeAvailable = Boolean(variant?.available && !variant.requires_selling_plan);
      const subscriptionAvailable = Boolean(variant?.available && selectedAllocation);

      if (this.oneTimeInput) this.oneTimeInput.disabled = !oneTimeAvailable;
      if (this.subscriptionInput) this.subscriptionInput.disabled = !subscriptionAvailable;

      let purchaseMode = this.getPurchaseMode();
      if (variant?.requires_selling_plan && subscriptionAvailable) {
        purchaseMode = 'subscription';
      } else if (purchaseMode === 'subscription' && !subscriptionAvailable) {
        purchaseMode = oneTimeAvailable ? 'one_time' : null;
      } else if (purchaseMode === 'one_time' && !oneTimeAvailable) {
        purchaseMode = subscriptionAvailable ? 'subscription' : null;
      } else if (!purchaseMode) {
        purchaseMode = oneTimeAvailable ? 'one_time' : (subscriptionAvailable ? 'subscription' : null);
      }

      if (this.oneTimeInput) this.oneTimeInput.checked = purchaseMode === 'one_time';
      if (this.subscriptionInput) this.subscriptionInput.checked = purchaseMode === 'subscription';
      if (this.sellingPlanSelect && selectedAllocation) {
        this.sellingPlanSelect.value = String(selectedAllocation.id);
      }

      const subscriptionSelected = purchaseMode === 'subscription' && selectedAllocation;
      this.currentAllocation = subscriptionSelected ? selectedAllocation : null;

      if (this.sellingPlanDetails) this.sellingPlanDetails.hidden = !subscriptionSelected;
      if (this.sellingPlanSelect) this.sellingPlanSelect.disabled = !subscriptionSelected;
      if (this.sellingPlanInput) {
        const previousPlanId = this.sellingPlanInput.value;
        const wasDisabled = this.sellingPlanInput.disabled;
        this.sellingPlanInput.value = subscriptionSelected ? selectedAllocation.id : '';
        this.sellingPlanInput.disabled = !subscriptionSelected;
        if (
          previousPlanId !== String(this.sellingPlanInput.value)
          || wasDisabled !== this.sellingPlanInput.disabled
        ) {
          this.sellingPlanInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      if (this.oneTimePrice) this.oneTimePrice.textContent = variant?.price || '';
      if (this.subscriptionPrice) {
        this.subscriptionPrice.textContent = selectedAllocation?.price
          || this.dataset.sellingPlanUnavailableText;
      }
      if (this.sellingPlanStatus) {
        if (subscriptionSelected) {
          this.sellingPlanStatus.textContent = `${selectedAllocation.name}: ${selectedAllocation.price}`;
        } else if (oneTimeAvailable) {
          this.sellingPlanStatus.textContent = `${this.dataset.oneTimeText}: ${variant.price}`;
        } else {
          this.sellingPlanStatus.textContent = this.dataset.sellingPlanUnavailableText;
        }
      }
      if (this.perDeliveryPrice) {
        const showPerDelivery = Boolean(
          subscriptionSelected
          && selectedAllocation.per_delivery_price
          && selectedAllocation.per_delivery_price !== selectedAllocation.price,
        );
        this.perDeliveryPrice.hidden = !showPerDelivery;
        this.perDeliveryPrice.textContent = showPerDelivery
          ? this.dataset.perDeliveryTemplate.replace('[price]', selectedAllocation.per_delivery_price)
          : '';
      }
    }

    getPurchaseMode() {
      return this.querySelector('[data-purchase-option]:checked')?.dataset.purchaseOption || null;
    }

    isPurchaseOptionValid(variant) {
      if (!variant?.available) return false;
      // 5A-003, GPT-AUDIT-005 H1. Sin bloque de planes en la ficha (el producto no tiene
      // grupos que ofrecer) una variante que exige plan tampoco se puede comprar: Shopify
      // responde 200 a /cart/add sin crear la linea. Falla cerrado, igual que el Liquid.
      if (!this.sellingPlans) return !variant.requires_selling_plan;
      if (this.getPurchaseMode() === 'subscription') return Boolean(this.currentAllocation);
      return !variant.requires_selling_plan;
    }

    dispatchPurchaseOptionChange() {
      const variant = this.currentVariant;
      this.dispatchEvent(
        new CustomEvent('theme:purchase-option-change', {
          bubbles: true,
          detail: {
            variant,
            allocation: this.currentAllocation,
            price: this.currentAllocation?.price || variant?.price || '',
          },
        }),
      );
    }

    updateForms(variant) {
      this.querySelectorAll('[data-variant-id]').forEach((input) => {
        const nextValue = variant?.id || '';
        const valueChanged = String(input.value) !== String(nextValue);
        input.value = nextValue;
        if (valueChanged) input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const purchaseOptionValid = this.isPurchaseOptionValid(variant);
      this.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        // Never re-enable a button whose form still has an add-to-cart request in flight.
        button.disabled = !purchaseOptionValid || button.form?.dataset.cartAddPending === 'true';
        const label = button.querySelector('[data-add-to-cart-text]');
        if (!label) return;

        if (!variant) {
          label.textContent = this.dataset.unavailableText;
        } else if (!variant.available) {
          label.textContent = this.dataset.soldOutText;
        } else if (!purchaseOptionValid) {
          label.textContent = this.dataset.sellingPlanUnavailableText;
        } else {
          label.textContent = this.dataset.addToCartText;
        }
      });

      this.querySelectorAll('.product-form__dynamic-checkout').forEach((container) => {
        container.hidden = !purchaseOptionValid;
      });

      // El motivo se explica solo cuando es ese: variante disponible que exige un plan y no
      // tiene ninguno asignado. Agotada o inexistente ya lo dice la etiqueta del boton.
      const planMissing = Boolean(
        variant?.available
        && variant.requires_selling_plan
        && !(variant.selling_plan_allocations || []).length,
      );
      this.querySelectorAll('[data-plan-required-notice]').forEach((notice) => {
        notice.hidden = !planMissing;
      });
    }

    updatePrice(variant) {
      const priceSource = this.currentAllocation || variant;
      const currentPrice = this.querySelector('[data-current-price]');
      const comparePrice = this.querySelector('[data-compare-price]');
      const saleBadge = this.querySelector('[data-sale-badge]');
      const soldOutBadge = this.querySelector('[data-sold-out-badge]');
      const unitPrice = this.querySelector('[data-unit-price]');

      if (currentPrice && priceSource) currentPrice.textContent = priceSource.price;

      if (comparePrice) {
        comparePrice.hidden = !priceSource?.compare_at_price;
        comparePrice.textContent = priceSource?.compare_at_price || '';
      }

      if (saleBadge) saleBadge.hidden = !priceSource?.compare_at_price;

      // AUDIT-PRESETS-001. Las etiquetas para lectores de pantalla siguen al estado de oferta del
      // variante elegido, como ya hace la tarjeta (product-card-variants). Sin esto, pasar de un
      // variante en oferta a uno sin oferta se sigue leyendo "Precio de oferta ... Precio habitual".
      const values = currentPrice?.closest('.price__values');
      const wrapper = currentPrice?.closest('[data-price-wrapper]');
      const varies = values && [...values.children].some((child) => child.tagName === 'SPAN'
        && !child.classList.contains('visually-hidden') && !child.hasAttribute('data-current-price'));
      if (values && wrapper?.dataset.labelSale && !varies) {
        const label = (text) => Object.assign(document.createElement('span'), { className: 'visually-hidden', textContent: text });
        values.querySelectorAll(':scope > .visually-hidden').forEach((node) => node.remove());
        if (priceSource?.compare_at_price) {
          currentPrice.before(label(wrapper.dataset.labelSale));
          comparePrice?.before(label(wrapper.dataset.labelRegular));
        } else {
          currentPrice.before(label(wrapper.dataset.labelRegular));
        }
      }
      if (soldOutBadge) soldOutBadge.hidden = Boolean(variant?.available);

      if (unitPrice) {
        const hasUnitPrice = Boolean(priceSource?.unit_price);
        unitPrice.hidden = !hasUnitPrice;

        if (hasUnitPrice) {
          const value = unitPrice.querySelector('[data-unit-price-value]');
          const reference = unitPrice.querySelector('[data-unit-price-reference]');
          if (value) value.textContent = priceSource.unit_price;
          if (reference) {
            const referenceValue = variant.unit_reference_value === 1 ? '' : variant.unit_reference_value;
            reference.textContent = `${referenceValue || ''}${variant.unit_reference_unit || ''}`;
          }
        }
      }

      this.updateLineTotal();
    }

    // Shows what the line will cost, without ever touching the unit price above it.
    updateLineTotal() {
      if (!this.lineTotal || !this.quantityInput) return;

      const label = this.lineTotal.querySelector('[data-line-total-label]');
      const current = this.lineTotal.querySelector('[data-line-total-current]');
      const compare = this.lineTotal.querySelector('[data-line-total-compare]');
      const compareValue = this.lineTotal.querySelector('[data-line-total-compare-value]');
      const priceSource = this.currentAllocation || this.currentVariant;
      let quantity = Number.parseInt(this.quantityInput.value, 10);
      const maxAttr = this.quantityInput.getAttribute('max');
      if (maxAttr !== null && maxAttr !== '' && Number.isFinite(Number(maxAttr))) {
        const maxVal = Number(maxAttr);
        if (quantity > maxVal) {
          quantity = maxVal;
          this.quantityInput.value = String(maxVal);
        }
      }
      const unitCents = Number(priceSource?.price_cents);

      const minQty = Number.parseInt(this.quantityInput.min, 10) || 1;
      const isFieldValid = !this.quantityInput.checkValidity || this.quantityInput.checkValidity();
      // Una variante agotada no se puede comprar: anunciar lo que costarian 3 confunde.
      const showTotal = isFieldValid
        && this.currentVariant?.available !== false
        && priceSource?.price_cents != null
        && priceSource.price_cents !== ''
        && Number.isFinite(quantity)
        && (quantity > 1 || minQty > 1)
        && Number.isFinite(unitCents);

      if (!showTotal) {
        this.lineTotal.setAttribute('data-empty', '');
        if (label) label.textContent = '';
        if (current) current.textContent = '';
        if (compareValue) compareValue.textContent = '';
        if (compare) compare.hidden = true;
        return;
      }

      const compareCents = Number(priceSource?.compare_at_price_cents);
      const hasCompare = Number.isFinite(compareCents) && compareCents > unitCents;

      if (label) {
        label.textContent = (this.dataset.lineTotalTemplate || '')
          .replace('[quantity]', String(quantity));
      }
      if (current) current.textContent = formatMoney(unitCents * quantity, this.moneyFormat);
      if (compareValue) {
        compareValue.textContent = hasCompare
          ? formatMoney(compareCents * quantity, this.moneyFormat)
          : '';
      }
      if (compare) compare.hidden = !hasCompare;

      this.lineTotal.removeAttribute('data-empty');
    }

    updateQuantityRules(variant) {
      const quantityInput = this.querySelector('[data-quantity-input]');
      if (!quantityInput || !variant) return;

      const before = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      quantityInput.min = variant.quantity_min;
      quantityInput.step = variant.quantity_increment;
      quantityInput.value = Math.max(Number(quantityInput.value), Number(variant.quantity_min));

      let effectiveMax = variant.quantity_max ?? null;
      if (effectiveMax === null && variant.inventory_management && variant.inventory_policy === 'deny') {
        const inventoryEl = this.querySelector('product-inventory') || this.closest('section')?.querySelector('product-inventory');
        const threshold = inventoryEl ? (Number(inventoryEl.dataset.threshold) || 0) : 1;
        const qty = Number(variant.inventory_quantity);
        if (Number.isFinite(qty) && qty > 0 && qty <= threshold) {
          effectiveMax = qty;
        }
      }

      // Agotada: la cantidad se queda en el minimo y el + se apaga (syncQuantityStepper lee
      // max). Sin esto el stepper seguia subiendo en una pieza que no se puede comprar.
      if (variant.available === false) {
        effectiveMax = Number(variant.quantity_min) || 1;
      }

      if (effectiveMax === null) {
        quantityInput.removeAttribute('max');
      } else {
        quantityInput.max = effectiveMax;
        quantityInput.value = Math.min(Number(quantityInput.value), Number(effectiveMax));
      }

      const after = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      // Cambiar de variante puede mover el minimo o el maximo, y con ellos la cantidad.
      // Nadie se enteraba: el total de linea lo calcula updatePrice(), que corre ANTES que
      // esto, asi que se quedaba anunciando la cantidad anterior; y el stepper no tenia
      // forma de saber que la rejilla habia cambiado bajo sus pies. Un 'change' avisa a
      // los dos por el mismo camino que usa el visitante al teclear.
      if (before !== after) quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updateMedia(variant) {
      const productSection = this.closest('[data-section-id]');
      productSection?.querySelectorAll('[data-product-media-id]').forEach((media) => {
        media.toggleAttribute('data-selected', String(media.dataset.productMediaId) === String(variant?.featured_media_id));
      });
    }

    updateStatus(variant) {
      const status = this.querySelector('[data-variant-status]');
      if (!status) return;

      if (!variant) {
        status.textContent = this.dataset.unavailableText;
      } else if (!this.isPurchaseOptionValid(variant)) {
        status.textContent = this.dataset.sellingPlanUnavailableText;
      } else {
        const availability = variant.available
          ? this.dataset.availableStatus
          : this.dataset.soldOutStatus;
        status.textContent = `${variant.title}: ${availability}`;
      }
    }

    updateUrl(variant) {
      if (!variant || !this.dataset.productUrl) return;

      const url = new URL(this.dataset.productUrl, document.baseURI);
      url.searchParams.set('variant', variant.id);
      if (this.currentAllocation) {
        url.searchParams.set('selling_plan', this.currentAllocation.id);
      } else {
        url.searchParams.delete('selling_plan');
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  class ProductInventory extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.message = this.querySelector('[data-inventory-message]');
      const variants = this.closest('variant-selects');
      if (!variants || !this.message) return;

      this.listen(variants, 'theme:variant-change', (event) => {
        this.update(event.detail?.variant);
      });
    }

    update(variant) {
      const quantity = Number(variant?.inventory_quantity);
      let state = 'inStock';

      if (!variant) {
        state = 'unavailable';
      } else if (!variant.available) {
        state = 'soldOut';
      } else if (variant.inventory_management === 'shopify') {
        if (variant.inventory_policy === 'continue' && quantity <= 0) {
          state = 'preorder';
        } else if (quantity > 0 && quantity <= Number(this.dataset.threshold)) {
          state = 'lowStock';
        }
      }

      this.dataset.stockState = state.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      this.message.textContent = state === 'lowStock'
        ? (this.dataset.showCount === 'true'
          ? this.dataset.lowStockTemplate.replace('[count]', String(quantity))
          : this.dataset.lowStockGeneric)
        : this.dataset[state];
    }
  }

  const recentViewsKey = 'theme:recently-viewed';
  const readRecentViews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(recentViewsKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return [...new Set(stored.map(String).filter((id) => /^\d{1,20}$/.test(id)))].slice(0, 8);
    } catch {
      return [];
    }
  };

  const rememberViewedProduct = () => {
    const productId = document.querySelector('[data-recently-viewed-product-id]')
      ?.dataset.recentlyViewedProductId;
    if (!/^\d{1,20}$/.test(productId || '')) return;
    try {
      localStorage.setItem(
        recentViewsKey,
        JSON.stringify([productId, ...readRecentViews().filter((id) => id !== productId)].slice(0, 8)),
      );
    } catch {
      // Storage can be unavailable in private contexts; the storefront remains usable.
    }
  };

  class RecentlyViewed extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.grid = this.querySelector('[data-recently-viewed-grid]');
      this.requestController = null;
      if (!this.grid || !this.dataset.sectionId || !this.dataset.searchUrl) return;

      this.listen(window, 'storage', (event) => {
        if (event.key === recentViewsKey) this.load();
      });
      this.load();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    async load() {
      this.requestController?.abort();
      this.grid.replaceChildren();
      this.hidden = true;

      const ids = readRecentViews()
        .filter((id) => id !== this.dataset.currentProductId)
        .slice(0, Math.min(8, Number(this.dataset.productsToShow) || 4));
      if (ids.length === 0) return;

      const request = new AbortController();
      this.requestController = request;
      const params = new URLSearchParams({
        section_id: this.dataset.sectionId,
        type: 'product',
        q: ids.map((id) => `id:${id}`).join(' OR '),
      });
      this.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(`${this.dataset.searchUrl}?${params}`, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: request.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        if (request !== this.requestController || !this.isConnected) return;
        const parsed = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const source = parsed.querySelector('recently-viewed');
        if (!source) return;

        const cards = new Map(
          Array.from(source.querySelectorAll('[data-recently-viewed-card]'))
            .map((card) => [card.dataset.productId, card]),
        );
        const selected = ids.map((id) => cards.get(id)).filter(Boolean);
        if (selected.length === 0) return;

        selected.forEach((card) => {
          if (this.dataset.showSecondaryImage !== 'true') {
            card.querySelectorAll('.product-card__image--secondary').forEach((image) => image.remove());
          }
          if (this.dataset.showVendor !== 'true') {
            card.querySelectorAll('.product-card__vendor').forEach((vendor) => vendor.remove());
          }
          if (this.dataset.showQuickAdd !== 'true') {
            card.querySelectorAll('.product-card__action').forEach((action) => action.remove());
            const variants = card.querySelector('product-card-variants');
            if (variants) variants.dataset.quickBuyMode = 'none';
          }
        });

        this.grid.replaceChildren(...selected);
        this.hidden = false;
      } catch (error) {
        if (error.name !== 'AbortError') this.hidden = true;
      } finally {
        if (request === this.requestController) this.setAttribute('aria-busy', 'false');
      }
    }
  }

  class StickyCartBar extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.productForm = document.getElementById(this.dataset.productFormId);
      this.primaryButton = this.productForm?.querySelector('[data-add-to-cart]');
      this.submitButton = this.querySelector('[data-sticky-submit]');
      this.variantOutput = this.querySelector('[data-sticky-variant]');
      this.priceOutput = this.querySelector('[data-sticky-price]');
      this.totalOutput = this.querySelector('[data-sticky-total]');
      this.label = this.querySelector('[data-sticky-label]');
      this.spinner = this.querySelector('[data-loading-icon]');
      this.variantSelects = this.closest('[data-section-id]')?.querySelector('variant-selects');

      if (!this.productForm || !this.primaryButton || !this.submitButton) return;

      // 4F-002. La barra aparece cuando el formulario ya no se ve, asi que tiene que decir
      // lo mismo que el: cuantas unidades se anaden y cuanto suman. La cantidad sale del
      // campo del formulario (dentro o asociado con form="") y el total, del total de linea
      // que ya pinta VariantSelects, nunca de una segunda cuenta.
      const quantityField = this.productForm.elements.namedItem('quantity');
      this.quantityInput = quantityField instanceof HTMLInputElement ? quantityField : null;
      this.lineTotal = this.closest('[data-section-id]')?.querySelector('[data-line-total]') || null;
      this.unitPrice = this.priceOutput?.textContent.trim() || '';
      this.defaultAriaLabel = this.submitButton.getAttribute('aria-label') || '';

      if (this.quantityInput) {
        this.listen(this.quantityInput, 'input', () => this.renderQuantity());
        this.listen(this.quantityInput, 'change', () => this.renderQuantity());
      }
      if (this.lineTotal) {
        // El total de linea se reescribe despues de cada cambio de cantidad, variante o
        // plan de compra: observarlo evita depender del orden en que corren los listeners.
        this.lineTotalObserver = new MutationObserver(() => this.renderQuantity());
        this.lineTotalObserver.observe(this.lineTotal, {
          attributes: true,
          attributeFilter: ['data-empty'],
          childList: true,
          characterData: true,
          subtree: true,
        });
      }

      this.setVisible(false);
      this.listen(this.submitButton, 'click', () => {
        if (!this.submitButton.disabled) this.productForm.requestSubmit(this.primaryButton);
      });

      if (this.variantSelects) {
        this.listen(this.variantSelects, 'theme:variant-change', (event) => {
          this.updateVariant(event.detail?.variant);
        });
        this.listen(this.variantSelects, 'theme:purchase-option-change', (event) => {
          this.unitPrice = event.detail?.price || '';
          this.renderQuantity();
          this.syncButtonState();
        });
      }

      this.buttonObserver = new MutationObserver(() => this.syncButtonState());
      this.buttonObserver.observe(this.primaryButton, {
        attributes: true,
        attributeFilter: ['aria-busy', 'disabled'],
        childList: true,
        subtree: true,
      });

      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
          this.setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
        });
        this.intersectionObserver.observe(this.primaryButton);
      } else {
        const updateVisibility = () => {
          const bounds = this.primaryButton.getBoundingClientRect();
          this.setVisible(bounds.bottom <= 0);
        };
        this.listen(window, 'scroll', updateVisibility, { passive: true });
        updateVisibility();
      }

      this.renderQuantity();
      this.syncButtonState();
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.buttonObserver?.disconnect();
      this.lineTotalObserver?.disconnect();
      this.setVisible(false);
      super.disconnectedCallback();
    }

    setVisible(visible) {
      // A360-04 (WCAG 2.4.3): inert sobre un subarbol con foco lo tira a <body>.
      if (!visible && this.contains(document.activeElement)) this.handOffFocus();
      this.toggleAttribute('data-visible', visible);
      this.setAttribute('aria-hidden', String(!visible));
      this.inert = !visible;
      document.body.toggleAttribute('data-sticky-cart-visible', visible);
      // AF-08 (AUDIT-FINAL-001, WCAG 2.4.11): con la barra visible, el foco por teclado se detiene
      // por encima de ella. Es el mismo mecanismo que --header-offset usa arriba.
      document.documentElement.style.setProperty('--sticky-cart-offset', visible ? `${this.offsetHeight}px` : '0px');
    }

    // La barra se oculta porque el ATC principal ya esta en pantalla: el foco pasa a el.
    handOffFocus() {
      const target = this.primaryButton && !this.primaryButton.disabled
        ? this.primaryButton
        : Array.from(this.productForm?.elements || []).find(
          (element) => !element.disabled && element.type !== 'hidden' && !this.contains(element)
            && element.checkVisibility?.() !== false,
        );
      target?.focus({ preventScroll: target === this.primaryButton });
    }

    updateVariant(variant) {
      if (this.variantOutput && !this.hasAttribute('data-single-variant')) {
        this.variantOutput.textContent = variant?.title || this.dataset.unavailableText;
      }
      this.unitPrice = variant?.price || '';
      this.renderQuantity();
      this.syncButtonState();
    }

    renderQuantity() {
      const quantity = Number.parseInt(this.quantityInput?.value || '', 10);
      const multiple = Number.isFinite(quantity) && quantity > 1;
      const total = this.lineTotal && !this.lineTotal.hasAttribute('data-empty')
        ? this.lineTotal.querySelector('[data-line-total-current]')?.textContent.trim() || ''
        : '';

      if (this.priceOutput) {
        this.priceOutput.textContent = multiple && this.unitPrice
          ? (this.dataset.quantityPriceTemplate || '')
            .replace('[quantity]', String(quantity))
            .replace('[price]', this.unitPrice)
          : this.unitPrice;
      }

      if (this.totalOutput) {
        const showTotal = multiple && total !== '';
        this.totalOutput.hidden = !showTotal;
        this.totalOutput.textContent = showTotal
          ? (this.dataset.totalTemplate || '').replace('[total]', total)
          : '';
      }

      const ariaLabel = multiple && this.dataset.quantityLabelTemplate
        ? this.dataset.quantityLabelTemplate.replace('[quantity]', String(quantity))
        : this.defaultAriaLabel;
      if (ariaLabel) this.submitButton.setAttribute('aria-label', ariaLabel);
    }

    syncButtonState() {
      if (!this.primaryButton || !this.submitButton) return;

      const busy = this.primaryButton.getAttribute('aria-busy') === 'true';
      const primaryLabel = this.primaryButton.querySelector('[data-add-to-cart-text]');
      this.submitButton.disabled = this.primaryButton.disabled;
      this.submitButton.setAttribute('aria-busy', String(busy));
      if (this.label && primaryLabel) this.label.textContent = primaryLabel.textContent.trim();
      if (this.spinner) this.spinner.hidden = !busy;
    }
  }

  class SizeGuideModal extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-size-guide-open]');
      this.overlay = this.querySelector('[data-size-guide-overlay]');
      this.panel = this.querySelector('[data-size-guide-panel]');
      this.closeButton = this.querySelector('[data-size-guide-close]');
      this.unitButtons = Array.from(this.querySelectorAll('[data-size-guide-unit]'));
      this.unitPanels = Array.from(this.querySelectorAll('[data-size-guide-panel-unit]'));
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.closeButton) return;

      this.setClosedState();
      this.setUnit(this.dataset.defaultUnit || 'cm');
      this.listen(this.trigger, 'click', () => this.open());
      this.listen(this.closeButton, 'click', () => this.close(true));
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });
      this.unitButtons.forEach((button) => {
        this.listen(button, 'click', () => this.setUnit(button.dataset.sizeGuideUnit));
        this.listen(button, 'keydown', (event) => this.handleUnitKeydown(event));
      });
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open() {
      if (this.isOpen) return;

      const returnTarget = document.activeElement;
      closeOtherDialogs(this);

      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      document.body.setAttribute('data-modal-open', '');
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(this.panel, this.closeButton);
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel || !this.trigger) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    setUnit(unit, focus = false) {
      const selectedButton = this.unitButtons.find(
        (button) => button.dataset.sizeGuideUnit === unit,
      );
      if (!selectedButton) return;

      this.unitButtons.forEach((button) => {
        const selected = button === selectedButton;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      this.unitPanels.forEach((panel) => {
        panel.hidden = panel.dataset.sizeGuidePanelUnit !== unit;
      });
      if (focus) selectedButton.focus();
    }

    handleUnitKeydown(event) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      const currentIndex = this.unitButtons.indexOf(event.currentTarget);
      let nextIndex = currentIndex;

      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = this.unitButtons.length - 1;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + this.unitButtons.length) % this.unitButtons.length;
      }
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.unitButtons.length;

      this.setUnit(this.unitButtons[nextIndex].dataset.sizeGuideUnit, true);
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class GiftCardRecipient extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.toggle = this.querySelector('[data-recipient-toggle]');
      this.fields = this.querySelector('[data-recipient-fields]');
      this.email = this.querySelector('[data-recipient-email]');
      this.message = this.querySelector('[data-recipient-message]');
      this.characterCount = this.querySelector('[data-recipient-character-count]');
      this.timezoneOffset = this.querySelector('[data-recipient-offset]');
      this.status = this.querySelector('[data-recipient-status]');

      if (!this.toggle || !this.fields) return;

      this.listen(this.toggle, 'change', () => this.syncState(true));
      if (this.message) this.listen(this.message, 'input', () => this.updateCharacterCount());
      this.syncState(false);
      this.updateCharacterCount();
    }

    syncState(announce) {
      const enabled = this.toggle.checked;
      this.toggle.setAttribute('aria-expanded', String(enabled));
      this.fields.hidden = !enabled;
      this.toggleAttribute('data-enabled', enabled);

      this.querySelectorAll('[data-recipient-field]').forEach((field) => {
        field.disabled = !enabled;
      });
      if (this.email) {
        this.email.required = enabled;
        this.email.setAttribute('aria-required', String(enabled));
      }
      if (this.timezoneOffset) {
        this.timezoneOffset.disabled = !enabled;
        this.timezoneOffset.value = enabled ? String(new Date().getTimezoneOffset()) : '';
      }
      if (announce && this.status) {
        this.status.textContent = enabled
          ? this.dataset.enabledStatus
          : this.dataset.disabledStatus;
      }
    }

    updateCharacterCount() {
      if (!this.message || !this.characterCount) return;
      const remaining = Math.max(0, Number(this.message.maxLength) - this.message.value.length);
      this.characterCount.textContent = this.dataset.charactersTemplate.replace('[count]', remaining);
    }
  }

  class PickupAvailability extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;
      this.refreshElements();
      this.setClosedState();

      this.listen(this, 'click', (event) => this.handleClick(event));
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });

      const variantSelects = this.closest('variant-selects');
      if (variantSelects) {
        this.listen(variantSelects, 'theme:variant-change', (event) => {
          this.updateForVariant(event.detail?.variant);
        });
      }
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    refreshElements() {
      this.trigger = this.querySelector('[data-pickup-open]');
      this.overlay = this.querySelector('[data-pickup-overlay]');
      this.panel = this.querySelector('[data-pickup-panel]');
      this.closeButton = this.querySelector('[data-pickup-close]');
    }

    handleClick(event) {
      const openButton = event.target.closest('[data-pickup-open]');
      if (openButton) {
        this.open(openButton);
        return;
      }

      const closeButton = event.target.closest('[data-pickup-close]');
      if (closeButton) {
        this.close(true);
        return;
      }

      if (event.target === this.overlay) this.close(true);
    }

    setClosedState() {
      if (!this.overlay || !this.panel) return;
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-modal', 'false');
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger?.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open(trigger) {
      if (!this.overlay || !this.panel || this.isOpen) return;

      const returnTarget = trigger || document.activeElement;
      closeOtherDialogs(this);
      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-modal', 'true');
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger?.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      document.body.setAttribute('data-modal-open', '');
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(this.panel, this.closeButton || this.panel);
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    async updateForVariant(variant) {
      this.close(false);
      this.requestController?.abort();

      if (!variant?.id || !this.dataset.productUrl || !this.dataset.sectionId) {
        this.hidden = true;
        return;
      }

      const requestController = new AbortController();
      this.requestController = requestController;
      this.setAttribute('aria-busy', 'true');

      try {
        const url = new URL(this.dataset.productUrl, document.baseURI);
        url.searchParams.set('variant', variant.id);
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error(this.dataset.updateError);

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextPickup = documentFragment.querySelector('pickup-availability');
        if (!nextPickup) throw new Error(this.dataset.updateError);

        this.innerHTML = nextPickup.innerHTML;
        this.dataset.variantId = String(variant.id);
        this.hidden = nextPickup.hidden || !this.querySelector('[data-pickup-content]');
        this.refreshElements();
        this.setClosedState();
      } catch (error) {
        if (error.name === 'AbortError') return;
        this.hidden = true;
      } finally {
        if (this.requestController === requestController) {
          this.requestController = null;
          this.setAttribute('aria-busy', 'false');
        }
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this.overlay;

      while (currentElement?.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class ProductRecommendations extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.hasLoaded = Boolean(this.querySelector('[data-recommendations-content]'));

      if (this.hasLoaded || !this.dataset.url) {
        this.setAttribute('aria-busy', 'false');
        return;
      }

      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            this.intersectionObserver.disconnect();
            this.load();
          },
          { rootMargin: '0px 0px 200% 0px' },
        );
        this.intersectionObserver.observe(this);
      } else {
        this.load();
      }
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    async load() {
      if (this.hasLoaded) return;
      this.requestController?.abort();
      this.requestController = new AbortController();
      this.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(this.dataset.url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: this.requestController.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextRecommendations = documentFragment.querySelector('product-recommendations');
        const nextContent = nextRecommendations?.querySelector('[data-recommendations-content]');

        if (!nextContent) {
          this.hidden = true;
          this.hasLoaded = true;
          return;
        }

        this.innerHTML = nextRecommendations.innerHTML;
        this.hidden = false;
        this.hasLoaded = true;
      } catch (error) {
        if (error.name === 'AbortError') return;
        this.hidden = true;
      } finally {
        this.setAttribute('aria-busy', 'false');
      }
    }
  }

  // 5A. Tarjeta de producto con swatches y compra rapida. Un solo estado de variante (el
  // color comprometido) alimenta foto, enlaces, precio y selector de tallas. El cursor solo
  // previsualiza la foto; el clic, el toque o el teclado comprometen el color. La adicion al
  // carrito no se duplica aqui: el formulario lleva data-cart-add-form y el CartDrawer lo
  // intercepta igual que en la ficha de producto.
  class ProductCardVariants extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.data = this.readData();
      this.swatches = Array.from(this.querySelectorAll('[data-card-swatch]'));
      this.trigger = this.querySelector('[data-quick-buy-trigger]');
      this.dialog = this.querySelector('[data-quick-buy-panel]');
      this.form = this.dialog?.querySelector('[data-cart-add-form]') || null;
      this.idInput = this.querySelector('[data-quick-buy-id]');
      this.directButton = this.querySelector('[data-quick-buy-direct]');
      this.links = Array.from(this.querySelectorAll('[data-card-link]'));
      this.image = this.querySelector('.product-card__image--primary');
      this.defaultImage = this.image
        ? { src: this.image.getAttribute('src'), srcset: this.image.getAttribute('srcset'), alt: this.image.getAttribute('alt') }
        : null;
      this.loadedSources = new Set(this.defaultImage?.src ? [this.defaultImage.src] : []);
      this.imageRequest = 0;
      this.releaseFocusTrap = null;
      this.selectedValue = this.swatches
        .find((swatch) => swatch.getAttribute('aria-checked') === 'true')?.dataset.swatchValue ?? null;
      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');

      if (this.swatches.length > 0 && this.data) this.bindSwatches();
      if (this.trigger && this.dialog) this.bindQuickBuy();
    }

    disconnectedCallback() {
      this.resizeObserver?.disconnect();
      if (this.isOpen) this.close(false);
      super.disconnectedCallback();
    }

    readData() {
      const element = this.querySelector('[data-card-variants]');
      if (!element) return null;

      try {
        const data = JSON.parse(element.textContent);
        return Array.isArray(data.variants) ? data : null;
      } catch {
        return null;
      }
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    // ---------- swatches ----------

    bindSwatches() {
      const group = this.querySelector('[data-card-swatches]');

      this.swatches.forEach((swatch) => {
        this.listen(swatch, 'click', () => this.selectSwatch(swatch));
        // El cursor solo previsualiza: seleccionar al pasar cambiaria la variante a quien
        // cruza la fila camino del boton de compra.
        this.listen(swatch, 'pointerenter', (event) => {
          if (event.pointerType === 'mouse') this.showImageFor(swatch.dataset.swatchValue);
        });
      });

      if (!group) return;
      this.listen(group, 'pointerleave', (event) => {
        if (event.pointerType === 'mouse') this.showImageFor(this.selectedValue);
      });
      this.listen(group, 'keydown', (event) => this.handleSwatchKeys(event));

      // Cuantos swatches caben depende del ancho de la tarjeta (2 o 4): el unico tab stop
      // tiene que ser uno visible.
      this.refreshTabStop();
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.refreshTabStop());
        this.resizeObserver.observe(group);
      }
    }

    visibleSwatches() {
      return this.swatches.filter((swatch) => swatch.getClientRects().length > 0);
    }

    refreshTabStop() {
      const visible = this.visibleSwatches();
      const checked = visible.find((swatch) => swatch.getAttribute('aria-checked') === 'true');
      const stop = checked || visible[0];
      this.swatches.forEach((swatch) => { swatch.tabIndex = swatch === stop ? 0 : -1; });
    }

    // Patron radiogroup: las flechas mueven foco y seleccion con ciclo entre los visibles;
    // Tab entra y sale del grupo por un solo swatch.
    handleSwatchKeys(event) {
      const visible = this.visibleSwatches();
      const current = visible.indexOf(event.target.closest('[data-card-swatch]'));
      if (current === -1) return;

      const rtl = getComputedStyle(this).direction === 'rtl';
      const steps = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = visible.length - 1;
      else if (event.key in steps) next = (current + steps[event.key] + visible.length) % visible.length;
      else return;

      event.preventDefault();
      visible[next].focus();
      this.selectSwatch(visible[next]);
    }

    selectSwatch(swatch) {
      this.selectedValue = swatch.dataset.swatchValue;
      this.swatches.forEach((item) => item.setAttribute('aria-checked', String(item === swatch)));
      this.refreshTabStop();

      this.showImageFor(this.selectedValue);
      this.updateLinks(this.variantForSwatch(this.selectedValue));
      this.updatePrice(this.selectedValue);
      this.syncQuickBuy();
    }

    variantsForSwatch(value) {
      if (!this.data || value == null) return [];
      return this.data.variants.filter((variant) => variant.options[this.data.swatchIndex] === value);
    }

    variantForSwatch(value) {
      const variants = this.variantsForSwatch(value);
      return variants.find((variant) => variant.available) || variants[0] || null;
    }

    // La foto nueva se descarga antes de cambiarla, asi que no hay destello ni bloque roto;
    // si el comprador pasa de A a B a C, solo C llega a pintarse. Sin foto propia para ese
    // color, la tarjeta vuelve a la foto del producto.
    showImageFor(value) {
      if (!this.image || !this.defaultImage?.src) return;

      const withMedia = this.variantsForSwatch(value).find((variant) => variant.media && this.data.media?.[variant.media]);
      const isOwnMedia = Boolean(withMedia) && String(withMedia.media) !== this.dataset.featuredMediaId;
      const target = isOwnMedia ? this.data.media[withMedia.media] : this.defaultImage;
      const request = ++this.imageRequest;

      const apply = () => {
        if (request !== this.imageRequest || !this.image.isConnected) return;
        if (this.image.getAttribute('src') !== target.src) {
          if (target.srcset) this.image.setAttribute('srcset', target.srcset);
          else this.image.removeAttribute('srcset');
          this.image.setAttribute('src', target.src);
        }
        this.image.setAttribute('alt', target.alt || this.defaultImage.alt || '');
        this.toggleAttribute('data-variant-media', isOwnMedia);
      };

      if (this.loadedSources.has(target.src)) {
        apply();
        return;
      }

      const loader = new Image();
      loader.sizes = this.image.getAttribute('sizes') || '';
      if (target.srcset) loader.srcset = target.srcset;
      loader.src = target.src;
      loader.decode().then(() => {
        this.loadedSources.add(target.src);
        apply();
      }).catch(() => {});
    }

    updateLinks(variant) {
      if (!this.dataset.productUrl) return;
      const url = new URL(this.dataset.productUrl, window.location.origin);
      if (variant) url.searchParams.set('variant', String(variant.id));
      const href = `${url.pathname}${url.search}`;
      this.links.forEach((link) => link.setAttribute('href', href));
    }

    // Precio del color comprometido, con la misma estructura que snippets/price.liquid. Los
    // importes llegan ya formateados por Liquid con el money_format de la tienda.
    updatePrice(value) {
      const wrapper = this.querySelector('[data-price-wrapper]');
      const values = wrapper?.querySelector('.price__values');
      const variants = this.variantsForSwatch(value);
      if (!values || variants.length === 0) return;

      const cheapest = variants.reduce((low, variant) => (variant.cents < low.cents ? variant : low));
      const varies = variants.some((variant) => variant.cents !== cheapest.cents);
      const shown = varies ? cheapest : this.variantForSwatch(value);
      const onSale = Boolean(shown.compare);
      const hiddenLabel = (text) => {
        const label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = text;
        return label;
      };
      const current = document.createElement('span');
      current.dataset.currentPrice = '';
      current.textContent = shown.price;
      const compare = document.createElement('s');
      compare.className = 'price__compare';
      compare.dataset.comparePrice = '';
      compare.textContent = shown.compare || '';
      compare.hidden = !onSale;

      const parts = [];
      if (varies) {
        const from = document.createElement('span');
        from.textContent = this.dataset.labelFrom;
        parts.push(from, current);
        if (onSale) parts.push(hiddenLabel(this.dataset.labelRegularPrice));
      } else if (onSale) {
        parts.push(hiddenLabel(this.dataset.labelSalePrice), current, hiddenLabel(this.dataset.labelRegularPrice));
      } else {
        parts.push(hiddenLabel(this.dataset.labelRegularPrice), current);
      }
      parts.push(compare);
      values.replaceChildren(...parts);

      const saleBadge = wrapper.querySelector('[data-sale-badge]');
      if (saleBadge) saleBadge.hidden = !onSale;
      const soldOutBadge = wrapper.querySelector('[data-sold-out-badge]');
      if (soldOutBadge) soldOutBadge.hidden = variants.some((variant) => variant.available);

      const unit = wrapper.querySelector('[data-unit-price]');
      if (unit) {
        unit.hidden = !shown.unit;
        const unitValue = unit.querySelector('[data-unit-price-value]');
        const unitReference = unit.querySelector('[data-unit-price-reference]');
        if (unitValue) unitValue.textContent = shown.unit || '';
        if (unitReference) unitReference.textContent = shown.unitReference || '';
      }
    }

    // ---------- compra rapida ----------

    // Tambien lo llama el CartDrawer al terminar una adicion: si el comprador cambio de
    // color con la peticion en vuelo, el estado corresponde al color de ahora.
    syncQuickBuy() {
      this.dialog?.removeAttribute('aria-busy');
      if (this.dataset.quickBuyMode === 'direct') this.syncDirect();
      else if (this.dataset.quickBuyMode === 'picker') this.syncPicker();
    }

    syncDirect() {
      const variant = this.variantForSwatch(this.selectedValue);
      if (!variant || !this.idInput || !this.directButton) return;
      if (this.directButton.getAttribute('aria-busy') === 'true') return;

      this.idInput.value = String(variant.id);
      this.directButton.disabled = !variant.available;
      const label = this.directButton.querySelector('[data-add-to-cart-text]');
      if (label) {
        label.textContent = variant.available
          ? this.directButton.dataset.labelAdd
          : this.directButton.dataset.labelSoldOut;
      }
    }

    syncPicker() {
      if (!this.dialog || !this.data || this.data.pickerIndex < 0) return;
      const { swatchIndex, pickerIndex, variants } = this.data;
      const offered = variants.filter((variant) => swatchIndex < 0 || variant.options[swatchIndex] === this.selectedValue);
      this.syncTrigger(offered.some((variant) => variant.available));
      // Si las tallas de este color cuestan distinto, cada talla muestra su precio: la talla
      // es la adicion, asi que el precio tiene que verse antes del toque.
      const pricesVary = offered.some((variant) => variant.cents !== offered[0]?.cents);

      this.dialog.querySelectorAll('.quick-buy__value').forEach((button) => {
        const variant = offered.find((candidate) => candidate.options[pickerIndex] === button.dataset.optionValue);
        const available = Boolean(variant?.available);

        button.dataset.variantId = variant ? String(variant.id) : '';
        if (button.getAttribute('aria-busy') !== 'true') button.disabled = !available;
        if (available) button.removeAttribute('aria-disabled');
        else button.setAttribute('aria-disabled', 'true');

        const state = button.querySelector('[data-quick-buy-state]');
        if (state) {
          state.hidden = available;
          state.textContent = variant ? this.dialog.dataset.labelSoldOut : this.dialog.dataset.labelUnavailable;
        }

        const price = button.querySelector('[data-quick-buy-price]');
        if (price) {
          price.hidden = !(pricesVary && variant);
          price.textContent = pricesVary && variant ? variant.price : '';
        }
      });
    }

    // 5A-003, GPT-AUDIT-005 H2. Un color sin ninguna talla disponible no abre un selector
    // sin salida: el disparador dice "Agotado" y queda inactivo. Al comprometer otro color
    // con existencias vuelve a "Anadir rapido". La tarjeta y su enlace a la ficha siguen
    // accesibles, y la etiqueta de agotado del precio ya la pone updatePrice().
    syncTrigger(hasAvailable) {
      if (!this.trigger) return;
      this.trigger.disabled = !hasAvailable;
      const label = hasAvailable ? this.trigger.dataset.labelQuickAdd : this.trigger.dataset.labelSoldOut;
      if (label) this.trigger.textContent = label;
    }

    bindQuickBuy() {
      this.listen(this.trigger, 'click', () => {
        if (this.isOpen) this.close(true);
        else this.open();
      });

      this.listen(this.dialog, 'click', (event) => {
        if (event.target.closest('[data-quick-buy-close]')) {
          this.close(true);
          return;
        }

        // El clic llega antes que el submit que intercepta el CartDrawer, asi que el id de
        // la talla ya esta en el formulario cuando este lo lee.
        const value = event.target.closest('.quick-buy__value');
        if (value?.dataset.variantId && this.idInput) {
          if (this.form?.dataset.cartAddPending !== 'true') this.idInput.value = value.dataset.variantId;
          return;
        }

        // En movil el <dialog> modal ocupa el fondo: un clic fuera de su caja lo cierra.
        if (event.target === this.dialog && this.dialog.matches(':modal')) {
          const box = this.dialog.getBoundingClientRect();
          const inside = event.clientX >= box.left && event.clientX <= box.right
            && event.clientY >= box.top && event.clientY <= box.bottom;
          if (!inside) this.close(true);
        }
      });

      // Con una talla en vuelo, las demas quedan inactivas: un segundo toque no puede
      // cambiar en silencio la variante pendiente ni lanzar otra alta.
      if (this.form) {
        this.listen(this.form, 'submit', (event) => {
          if (this.form.dataset.cartAddPending === 'true') return;
          this.dialog.setAttribute('aria-busy', 'true');
          this.dialog.querySelectorAll('.quick-buy__value').forEach((button) => {
            if (button !== event.submitter) button.disabled = true;
          });
        });
      }

      // Escape en el modal dispara cancel; se cierra por el mismo camino para devolver el foco.
      this.listen(this.dialog, 'cancel', (event) => {
        event.preventDefault();
        this.close(true);
      });
      this.listen(this.dialog, 'keydown', (event) => this.handlePanelKeys(event));
      this.listen(document, 'pointerdown', (event) => {
        if (!this.isOpen || this.dialog.matches(':modal')) return;
        if (this.dialog.contains(event.target) || this.trigger.contains(event.target)) return;
        this.close(false);
      });
      this.listen(this.mobileQuery, 'change', () => {
        if (this.isOpen) this.close(false);
      });
    }

    enabledValues() {
      return Array.from(this.dialog.querySelectorAll('.quick-buy__value:not([disabled])'));
    }

    handlePanelKeys(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        return;
      }

      const buttons = this.enabledValues();
      const current = buttons.indexOf(event.target);
      if (current === -1) return;

      const rtl = getComputedStyle(this).direction === 'rtl';
      const steps = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else if (event.key in steps) next = (current + steps[event.key] + buttons.length) % buttons.length;
      else return;

      event.preventDefault();
      buttons[next].focus();
    }

    open() {
      if (this.isOpen || !this.dialog || this.trigger?.disabled) return;
      closeOtherDialogs(this);
      this.syncPicker();
      this.clearError();

      const modal = this.mobileQuery.matches;
      if (modal) this.dialog.showModal();
      else this.dialog.show();

      this.setAttribute('data-open', '');
      this.toggleAttribute('data-modal', modal);
      this.trigger.setAttribute('aria-expanded', 'true');
      syncDialogScrollLocks();

      // El foco no sale del panel con Tab, ni en la hoja movil ni sobre la tarjeta; se sale
      // con Escape, con Cerrar o eligiendo talla.
      const first = this.enabledValues()[0] || this.dialog.querySelector('[data-quick-buy-close]');
      first?.focus();
      this.releaseFocusTrap = trapFocus(this.dialog, first);
    }

    close(restoreFocus = false) {
      if (!this.dialog) return;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      if (this.dialog.open) this.dialog.close();

      this.removeAttribute('data-open');
      this.removeAttribute('data-modal');
      this.trigger?.setAttribute('aria-expanded', 'false');
      syncDialogScrollLocks();
      if (restoreFocus) this.trigger?.focus();
    }

    clearError() {
      const error = this.dialog?.querySelector('[data-product-form-error]');
      if (!error) return;
      error.hidden = true;
      error.textContent = '';
    }
  }

  // Phase 2 (GPT-021). Cart drawer deadlines. The recommendations read is a complement:
  // when it is late, the cards the server already rendered stay. The cross-sell add and
  // the note save are never retried: a missed deadline leaves their result uncertain.
  const CART_RECOMMENDATIONS_TIMEOUT = 2000;
  const CART_CROSS_SELL_ADD_TIMEOUT = 10000;
  const CART_NOTE_SAVE_TIMEOUT = 3000;

  class CartDrawer extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.overlay = this.querySelector('[data-cart-drawer-overlay]');
      this.panel = this.querySelector('[data-cart-drawer-panel]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;
      this.requestController = null;
      this.crossSellController = null;
      this.pendingMutations = 0;
      this.syncRevision = 0;
      this.renderedRevision = 0;
      this.syncAfterMutation = false;
      this.overlappingMutations = false;
      this.reconcileAfterMutation = false;
      // Phase 2. While the shopper works an inline option panel, late syncs and
      // recommendation responses must not touch the DOM; a skipped sync runs on release.
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.recommendationGeneration = 0;
      this.recommendationKey = null;
      this.recommendationCache = new Map();
      this.recommendationWatch = null;
      this.crossSellVariantCache = new WeakMap();
      this.crossSellOriginals = new WeakMap();
      this.noteVersion = 0;
      this.noteSavePending = false;

      if (!this.overlay || !this.panel) return;

      this.setClosedState();
      this.listen(document, 'click', (event) => this.handleDocumentClick(event));
      this.listen(document, 'submit', (event) => this.handleAddSubmit(event));
      this.listen(this, 'click', (event) => this.handleDrawerClick(event));
      this.listen(this, 'change', (event) => this.handleDrawerChange(event));
      this.listen(this, 'keydown', (event) => {
        if (event.key !== 'Enter') return;
        // Enter on an option radio would implicitly submit the empty options form and
        // reload the page. Space still selects natively; no key adds to the cart here.
        if (event.target.matches?.('[data-cross-sell-option]')) {
          event.preventDefault();
          return;
        }
        if (!event.target.matches?.('[data-cart-quantity]')) return;
        event.preventDefault();
        event.target.blur();
      });
      this.listen(this, 'submit', (event) => {
        if (event.target.id === `CartCrossSellOptions-${this.dataset.sectionId}`) event.preventDefault();
      });
      this.listen(this, 'focusin', (event) => this.freezeFromOptions(event));
      this.listen(this, 'pointerdown', (event) => this.freezeFromOptions(event));
      this.listen(this, 'input', (event) => {
        if (!event.target.matches('textarea[name="note"]')) return;
        event.target.dataset.dirty = 'true';
        this.noteVersion += 1;
      });
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.crossSellController?.abort();
      this.recommendationWatch?.controller.abort();
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-hidden', 'true');
      this.removeAttribute('data-open');
    }

    handleDocumentClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!link || this.contains(link) || link.target === '_blank' || link.hasAttribute('download')) return;

      const linkUrl = new URL(link.href, window.location.origin);
      const cartUrl = new URL(this.dataset.cartUrl, window.location.origin);
      if (linkUrl.origin !== cartUrl.origin || linkUrl.pathname !== cartUrl.pathname) return;

      event.preventDefault();
      this.open(link);
    }

    handleAddSubmit(event) {
      const form = event.target.closest('[data-cart-add-form]');
      if (!form) return;
      if (event.submitter && event.submitter.name !== 'add') return;

      event.preventDefault();
      this.addItem(form, event.submitter).catch((error) => {
        this.showError(error.message, form);
      });
    }

    handleDrawerClick(event) {
      const closeButton = event.target.closest('[data-cart-drawer-close]');
      if (closeButton) {
        this.close(true);
        return;
      }

      if (event.target.closest('[data-cart-check]')) {
        this.checkCart();
        return;
      }

      const expandButton = event.target.closest('[data-cross-sell-expand]');
      if (expandButton) {
        this.expandCrossSell(expandButton);
        return;
      }

      const cancelButton = event.target.closest('[data-cross-sell-cancel]');
      if (cancelButton) {
        this.cancelCrossSell(cancelButton);
        return;
      }

      // The card's own title and image links also leave the drawer: same note save.
      const viewLink = event.target.closest(
        '[data-cross-sell-view], [data-cross-sell-item] .cart-cross-sell__title a, [data-cross-sell-item] a.cart-cross-sell__media',
      );
      if (viewLink) {
        this.handleCrossSellView(event, viewLink);
        return;
      }

      const crossSellButton = event.target.closest('[data-cross-sell-add]');
      if (crossSellButton) {
        this.addCrossSell(crossSellButton).catch((error) => {
          if (error.name === 'AbortError') return;
          this.showError(error.message);
          if (crossSellButton.isConnected && !crossSellButton.disabled) crossSellButton.focus();
        });
        return;
      }

      const removeButton = event.target.closest('[data-cart-remove]');
      if (!removeButton) return;

      this.changeLine(Number(removeButton.dataset.line), 0).catch((error) => {
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    handleDrawerChange(event) {
      // Option radios are not quantities: a change only recomputes its own card.
      const option = event.target.closest('[data-cross-sell-option]');
      if (option) {
        this.interactionFrozen = true;
        this.updateCrossSellState(option.closest('[data-cross-sell-item]'));
        return;
      }

      const quantityInput = event.target.closest('[data-cart-quantity]');
      if (!quantityInput) return;

      // An empty or malformed field used to fall through parseInt('') || 0 and silently
      // delete the line. Let the browser report it instead, and keep 0 as the one value
      // that is allowed to bypass min and remove the item on purpose.
      if (!quantityInput.checkValidity() && quantityInput.value !== '0') {
        quantityInput.reportValidity();
        return;
      }

      const quantity = Number(quantityInput.value);
      this.changeLine(Number(quantityInput.dataset.line), quantity).catch((error) => {
        // beginMutation() aborts an in-flight section read, so a superseded request must
        // stay silent instead of showing the browser's own English abort text.
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    open(trigger = null, initialFocus = null) {
      if (this.isOpen || !this.isConnected) return;

      // Resolved before the other dialogs close: making a panel inert blurs whatever
      // inside it holds focus, and a cart opened from the mobile menu must hand focus
      // back to the menu trigger rather than to a link that is about to disappear.
      let returnTarget = trigger || document.activeElement;
      const sourceMenu = returnTarget?.closest?.('theme-drawer[data-open]');
      const menuTrigger = sourceMenu?.querySelector('[data-drawer-trigger]');
      if (menuTrigger) returnTarget = menuTrigger;
      // Lo mismo con la compra rapida de una tarjeta: su panel se cierra al abrirse el
      // cajon, asi que el foco vuelve al boton que lo abrio y no a una talla oculta.
      const quickBuy = returnTarget?.closest?.('product-card-variants');
      if (quickBuy?.dialog?.contains(returnTarget) && quickBuy.trigger) returnTarget = quickBuy.trigger;

      closeOtherDialogs(this);

      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-hidden', 'false');
      this.setAttribute('data-open', '');
      document.body.setAttribute('data-drawer-open', '');
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(
        this.panel,
        initialFocus?.isConnected ? initialFocus : this.querySelector('[data-cart-drawer-close]'),
      );
      this.syncCart().catch(() => {});
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();
      // Closing ends any option interaction; the next open re-renders fresh HTML.
      this.collapseCrossSells();
      this.releaseInteraction();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }

    async addItem(form, submitter) {
      // Blocks a second submit while the first is in flight, which otherwise buys the
      // item twice. Switching variant mid-request used to re-enable the button through
      // updateForms; that path now reads this flag and leaves it disabled.
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      const revision = this.beginMutation();
      this.clearMessages(form);
      this.setFormBusy(form, submitter, true);

      try {
        const formData = new FormData(form);
        formData.set('sections', this.renderSectionIds().join(','));
        formData.set('sections_url', `${window.location.pathname}${window.location.search}`);

        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: formData,
        }, this.dataset.errorMessage);
        // Shopify and upstream proxies answer 429/5xx with an HTML error page. Parsing it
        // as JSON throws "Unexpected token '<'" straight at the shopper, so the parse
        // failure is turned into the localized message instead. A deliberate abort keeps
        // its own name, because callers use it to stay silent.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

        await this.renderCartResponse(result, revision);

        // 5A-003, GPT-AUDIT-005 H1. Un 200 no prueba que la linea exista: con una variante
        // que exige plan de venta Shopify devuelve {} (medido en la tienda con F06) y el
        // cajon anunciaba un exito falso. El exito solo se anuncia si la respuesta trae la
        // variante pedida y, cuando fue esta respuesta la que se pinto, si el carrito fresco
        // tiene su linea. Si otra mutacion la adelanto, basta con la respuesta.
        const requestedId = String(formData.get('id') || '');
        const addedLine = this.findLineFor({ variant_id: requestedId });
        const renderedHere = this.renderedRevision === revision;
        if (!this.responseHasVariant(result, requestedId) || (renderedHere && !addedLine)) {
          throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
        }

        const addedItem = Array.isArray(result.items)
          ? result.items.find((item) => String(item.variant_id || item.id) === requestedId)
          : result;
        const productTitle = addedItem?.product_title || addedItem?.title || '';
        const variantTitle = addedItem?.variant_title === 'Default Title'
          ? ''
          : (addedItem?.variant_title || '');
        const itemDescription = [productTitle, variantTitle].filter(Boolean).join(' - ');
        this.showStatus(itemDescription
          ? `${this.dataset.addedMessage} ${itemDescription}`
          : this.dataset.addedMessage);
        // Desde una tarjeta, el foco aterriza en la linea que se acaba de anadir.
        this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
      } finally {
        delete form.dataset.cartAddPending;
        this.setFormBusy(form, submitter, false);
        // Re-applies the availability state of whatever variant is selected now, which
        // may not be the one this request was submitted for.
        const variants = form.closest('variant-selects');
        if (variants?.isConnected) variants.updateForms(variants.currentVariant);
        const card = form.closest('product-card-variants');
        if (card?.isConnected) card.syncQuickBuy();
        this.endMutation();
      }
    }

    // /cart/add.js devuelve la linea anadida ({ variant_id }) o, con items[], { items: [...] }.
    responseHasVariant(result, variantId) {
      if (!variantId) return false;
      const items = Array.isArray(result?.items) ? result.items : [result];
      return items.some((item) => String(item?.variant_id ?? '') === variantId);
    }

    // /cart/add.js devuelve la linea anadida; su enlace lleva ?variant=, igual que item.url.
    findLineFor(result) {
      const variantId = String(result?.variant_id ?? result?.items?.[0]?.variant_id ?? '');
      if (!variantId) return null;
      return Array.from(this.querySelectorAll('.cart-drawer-item__title a[href]')).find((link) => {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        return url.searchParams.get('variant') === variantId;
      }) || null;
    }

    // Phase 2 (GPT-021). The add is never retried and its outcome is classified:
    // - confirmed failure: an HTTP error with a JSON body (422 and the like). The cart did
    //   not change, so the selection stays and focus lands on a usable control.
    // - uncertain: network error, deadline, abort, a body that is not JSON (an HTML 429 or
    //   5xx page) or a 200 that does not list the variant. The POST may have been applied:
    //   the shopper is told, Check cart is offered and endMutation() reconciles with fresh
    //   HTML even while a panel holds interactionFrozen.
    // - success: the option interaction ends and the response is rendered.
    async addCrossSell(button) {
      const variantId = Number(button.dataset.variantId);
      if (!variantId || button.disabled) return;

      const item = button.closest('[data-cross-sell-item]');
      const inPanel = Boolean(button.closest('[data-cross-sell-options]'));
      const revision = this.beginMutation();
      this.clearMessages();
      this.setCrossSellBusy(button, true);
      this.setDrawerBusy(true);
      // The button has an aria-label and turns disabled, so its hidden "Adding" text is
      // never read. The status region announces it; the outcome message replaces it.
      const addingText = button.querySelector('[data-cross-sell-adding]')?.textContent.trim();
      if (addingText) this.showStatus(addingText);
      // Its own controller: crossSellController belongs to the recommendations read and
      // beginMutation() aborts it, which must never cut an add short.
      const controller = new AbortController();
      const deadline = window.setTimeout(() => controller.abort(), CART_CROSS_SELL_ADD_TIMEOUT);
      let outcome = 'uncertain';
      let failureMessage = '';

      try {
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
              items: [{ id: variantId, quantity: 1 }],
              sections: this.renderSectionIds(),
              sections_url: `${window.location.pathname}${window.location.search}`,
            }),
            signal: controller.signal,
          });
          result = await response.json();
        } catch {
          result = null;
        }
        window.clearTimeout(deadline);

        if (response && result !== null && typeof result === 'object') {
          if (!response.ok) {
            outcome = 'failure';
            failureMessage = result.description || result.message || this.dataset.errorMessage;
          } else if (this.responseHasVariant(result, String(variantId))) {
            outcome = 'success';
          }
        }

        if (outcome === 'success') {
          this.interactionFrozen = false;
          this.skippedSync = false;
          // The JSON already confirms the add. A render that fails or is overtaken only
          // leaves the drawer stale, and endMutation() then fetches fresh HTML.
          await this.renderCartResponse(result, revision).catch(() => {});
          this.showStatus(this.dataset.addedMessage);

          const focusTarget = Array.from(this.querySelectorAll('[data-cross-sell-focus]')).find(
            (element) => Number(element.dataset.crossSellFocus) === variantId,
          );
          // La recomendacion ya anadida deja de mostrarse; el foco pasa a su linea del carrito.
          (focusTarget || this.findLineFor({ variant_id: variantId }))?.focus({ preventScroll: true });
        }
      } finally {
        window.clearTimeout(deadline);
        this.setDrawerBusy(false);
        this.setCrossSellBusy(button, false);
        // The busy restore re-enabled the panel button blindly; the selection decides.
        if (inPanel && button.isConnected) this.updateCrossSellState(item);
        if (outcome === 'uncertain') this.reconcileAfterMutation = true;
        this.endMutation();
      }

      if (outcome !== 'success') {
        // The "Adding" announcement is over; the error region takes its place.
        const status = this.querySelector('[data-cart-status]');
        if (status) {
          status.hidden = true;
          status.textContent = '';
        }
      }
      if (outcome === 'failure') {
        this.showError(failureMessage);
        this.focusCrossSellControl(item, button);
      } else if (outcome === 'uncertain') {
        this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
        const uncertain = this.querySelector('[data-cart-uncertain]');
        if (uncertain) uncertain.hidden = false;
        const checkButton = uncertain?.querySelector('[data-cart-check]');
        if (checkButton && this.isOpen) checkButton.focus();
      }
    }

    // After a confirmed failure the selection stays: focus goes to the chosen option, the
    // add button or Cancel, whichever is usable, never to a disabled control.
    focusCrossSellControl(item, button) {
      if (!this.isOpen) return;
      const panel = button.closest('[data-cross-sell-options]');
      const candidates = panel
        ? [panel.querySelector('[data-cross-sell-option]:checked'), button, panel.querySelector('[data-cross-sell-cancel]')]
        : [button, item?.querySelector('.cart-cross-sell__title a')];
      const target = candidates.find((element) => element?.isConnected && !element.disabled && !element.closest('[hidden]'));
      (target || this.querySelector('[data-cart-drawer-close]'))?.focus();
    }

    freezeFromOptions(event) {
      if (event.target.closest?.('[data-cross-sell-options]')) this.interactionFrozen = true;
    }

    // Ends an option interaction. A sync skipped while frozen runs now, unless a mutation
    // is pending (its render or endMutation() brings fresh HTML) or the drawer is closed
    // (open() always syncs).
    releaseInteraction() {
      this.interactionFrozen = false;
      if (!this.skippedSync) {
        this.loadRecommendations();
        return;
      }
      this.skippedSync = false;
      if (this.isConnected && this.isOpen && !this.pendingMutations) this.syncCart().catch(() => {});
    }

    // Check cart, offered after an unconfirmed update: any option interaction ends and a
    // fresh read replaces the drawer body.
    checkCart() {
      // The button is about to hide; focus moves first so it does not fall to <body>.
      this.querySelector('[data-cart-drawer-close]')?.focus();
      this.clearMessages();
      this.collapseCrossSells();
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.syncCart().catch((error) => {
        if (error.name === 'AbortError') return;
        this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
        const uncertain = this.querySelector('[data-cart-uncertain]');
        if (uncertain) uncertain.hidden = false;
      });
    }

    // One expanded card at a time. Another card collapses but keeps its selection; focus
    // stays on Choose options and the next Tab enters the panel.
    expandCrossSell(button) {
      const item = button.closest('[data-cross-sell-item]');
      const panel = item?.querySelector('[data-cross-sell-options]');
      if (!panel) return;
      // A second press closes the panel like a disclosure. Unlike Cancel it keeps the
      // selection; the interaction still ends, since no panel is left open.
      if (button.getAttribute('aria-expanded') === 'true') {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        this.releaseInteraction();
        return;
      }
      this.collapseCrossSells(item);
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      this.interactionFrozen = true;
      this.updateCrossSellState(item);
    }

    cancelCrossSell(control) {
      const item = control.closest('[data-cross-sell-item]');
      if (!item) return;
      const expandButton = item.querySelector('[data-cross-sell-expand]');
      // Focus leaves the panel before it hides, and before the release: a skipped sync may
      // re-render at once, and renderSection() maps this button to the same card.
      expandButton?.focus();
      const panel = item.querySelector('[data-cross-sell-options]');
      if (panel) panel.hidden = true;
      expandButton?.setAttribute('aria-expanded', 'false');
      this.resetCrossSell(item);
      this.releaseInteraction();
    }

    collapseCrossSells(exceptItem = null) {
      this.querySelectorAll('[data-cross-sell-item]').forEach((item) => {
        if (item === exceptItem) return;
        const panel = item.querySelector('[data-cross-sell-options]');
        if (panel) panel.hidden = true;
        item.querySelector('[data-cross-sell-expand]')?.setAttribute('aria-expanded', 'false');
      });
    }

    resetCrossSell(item) {
      item.querySelectorAll('[data-cross-sell-option]').forEach((radio) => {
        radio.checked = false;
      });
      this.updateCrossSellState(item);
    }

    crossSellVariants(panel) {
      if (this.crossSellVariantCache.has(panel)) return this.crossSellVariantCache.get(panel);
      let variants = [];
      try {
        const parsed = JSON.parse(panel.querySelector('[data-cross-sell-variants]')?.textContent || '[]');
        if (Array.isArray(parsed)) {
          variants = parsed.filter((variant) => variant && typeof variant === 'object' && Array.isArray(variant.options));
        }
      } catch {
        variants = [];
      }
      this.crossSellVariantCache.set(panel, variants);
      return variants;
    }

    // Quantity 1 must be valid on its own: available, min <= 1, increment 1, max empty or >= 1.
    isCrossSellPurchasable(variant) {
      if (!variant || variant.available !== true || !variant.id) return false;
      const min = variant.min == null ? 1 : Number(variant.min);
      const increment = variant.increment == null ? 1 : Number(variant.increment);
      const max = variant.max == null ? null : Number(variant.max);
      return min <= 1 && increment === 1 && (max === null || max >= 1);
    }

    // Recomputes one card from its variant JSON. A chip with no purchasable match given the
    // other selected options is marked unavailable (attribute plus hidden text). Add is
    // enabled only for a complete, existing, purchasable combination, which also sets the
    // variant price and image; a complete invalid combination shows the status instead.
    updateCrossSellState(item) {
      const panel = item?.querySelector('[data-cross-sell-options]');
      if (!panel) return;

      const variants = this.crossSellVariants(panel);
      const fieldsets = Array.from(panel.querySelectorAll('[data-option-position]'));
      const positions = fieldsets.map((fieldset) => Number(fieldset.dataset.optionPosition) - 1);
      const selected = fieldsets.map((fieldset) => fieldset.querySelector('[data-cross-sell-option]:checked')?.value ?? null);
      const fits = (variant, skip) => positions.every((position, index) => (
        index === skip || selected[index] === null || variant.options[position] === selected[index]
      ));

      fieldsets.forEach((fieldset, index) => {
        fieldset.querySelectorAll('[data-cross-sell-option]').forEach((radio) => {
          const purchasable = variants.some((variant) => this.isCrossSellPurchasable(variant)
            && variant.options[positions[index]] === radio.value
            && fits(variant, index));
          const chip = radio.closest('label');
          chip?.toggleAttribute('data-unavailable', !purchasable);
          const unavailableText = chip?.querySelector('[data-chip-unavailable]');
          if (unavailableText) unavailableText.hidden = purchasable;
        });
      });

      const complete = fieldsets.length > 0 && selected.every((value) => value !== null);
      const variant = complete ? variants.find((candidate) => fits(candidate, -1)) : null;
      const valid = Boolean(variant) && this.isCrossSellPurchasable(variant);
      const addButton = panel.querySelector('[data-cross-sell-add]');
      const status = panel.querySelector('[data-cross-sell-options-status]');

      if (addButton) {
        addButton.dataset.variantId = valid ? String(variant.id) : '';
        // While a busy state holds the button, the value it restores is what changes.
        if (addButton.dataset.wasDisabled !== undefined) addButton.dataset.wasDisabled = String(!valid);
        else addButton.disabled = !valid;
      }
      if (status) {
        const wasHidden = status.hidden;
        status.hidden = !complete || valid;
        // WCAG 4.1.3. The status appears without a focus change, so the drawer's live region
        // announces it once, when the selection turns complete and invalid.
        if (wasHidden && !status.hidden) this.showStatus(status.textContent.trim());
        if (addButton && status.id) {
          if (status.hidden) addButton.removeAttribute('aria-describedby');
          else addButton.setAttribute('aria-describedby', status.id);
        }
      }
      this.showCrossSellVariant(item, valid ? variant : null);
    }

    // Price and thumbnail follow the chosen variant; without one they return to what the
    // server rendered ("From" price, product image).
    showCrossSellVariant(item, variant) {
      const price = item.querySelector('[data-cross-sell-price]');
      const image = item.querySelector('.cart-cross-sell__media img');
      if (!this.crossSellOriginals.has(item)) {
        this.crossSellOriginals.set(item, {
          price: price?.textContent ?? '',
          src: image?.getAttribute('src') ?? null,
          srcset: image?.getAttribute('srcset') ?? null,
        });
      }
      const original = this.crossSellOriginals.get(item);
      const formatted = variant ? formatMoney(variant.price) : '';
      if (price) price.textContent = formatted || original.price;
      if (!image) return;

      if (variant && typeof variant.image === 'string' && variant.image) {
        image.removeAttribute('srcset');
        image.setAttribute('src', variant.image);
        return;
      }
      if (original.src !== null && image.getAttribute('src') !== original.src) image.setAttribute('src', original.src);
      if (original.srcset !== null && image.getAttribute('srcset') !== original.srcset) {
        image.setAttribute('srcset', original.srcset);
      }
    }

    // A re-render replaced the card that held focus. Land on the same control of the same
    // product when it is still offered (a control inside a panel maps to Choose options),
    // else on the card itself; null lets the caller fall back to the close button.
    crossSellFocusAfterRender(active, nextContent) {
      const item = active?.closest?.('[data-cross-sell-item]');
      if (!item) return null;
      const nextItem = Array.from(nextContent.querySelectorAll('[data-cross-sell-item]'))
        .find((candidate) => candidate.dataset.productId === item.dataset.productId);
      if (!nextItem) return null;

      let control = null;
      if (active.closest('[data-cross-sell-options]')) {
        control = nextItem.querySelector('[data-cross-sell-expand]');
      } else {
        const selector = ['[data-cross-sell-expand]', '[data-cross-sell-view]', '[data-cross-sell-add]']
          .find((candidate) => active.matches(candidate));
        control = selector ? nextItem.querySelector(selector) : null;
      }
      return control && !control.disabled && !control.closest('[hidden]') ? control : nextItem;
    }

    // View product with an unsaved note: save it first, and leave only once the server has
    // the exact draft. Modified clicks and new-tab links keep their native behaviour.
    handleCrossSellView(event, link) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      const note = this.querySelector('textarea[name="note"][data-dirty="true"]');
      if (!note && !this.noteSavePending) return;

      event.preventDefault();
      if (this.noteSavePending) return;
      this.saveNoteAndNavigate(link.href, note).catch(() => {});
    }

    // GPT-021 note protocol. The draft counts as saved only when the server echoes the exact
    // text sent and no keystroke arrived meanwhile (noteVersion). Otherwise it stays dirty,
    // the drawer reconciles (renderSection keeps the dirty draft) and the shopper stays.
    // The note text is never stored locally or logged.
    async saveNoteAndNavigate(href, textarea) {
      this.noteSavePending = true;
      const sentVersion = this.noteVersion;
      const sentNote = textarea.value;
      const controller = new AbortController();
      const deadline = window.setTimeout(() => controller.abort(), CART_NOTE_SAVE_TIMEOUT);
      let confirmed = false;
      this.clearMessages();
      this.showStatus(this.dataset.savingNoteMessage);

      try {
        const response = await fetch(this.dataset.cartUpdateUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ note: sentNote }),
          keepalive: true,
          signal: controller.signal,
        });
        const result = await response.json();
        confirmed = response.ok && result !== null && typeof result === 'object' && (result.note ?? '') === sentNote;
      } catch {
        confirmed = false;
      } finally {
        window.clearTimeout(deadline);
        this.noteSavePending = false;
      }

      if (confirmed && this.noteVersion === sentVersion) {
        const current = this.querySelector('textarea[name="note"]');
        if (current && current.value === sentNote) delete current.dataset.dirty;
        window.location.assign(href);
        return;
      }

      this.clearMessages();
      this.showError(this.dataset.noteUnconfirmedMessage || this.dataset.errorMessage);
      if (this.isConnected) this.syncCart().catch(() => {});
    }

    // Source 2 (Search and Discovery). The server marks the slot as pending when native
    // complementary products were not resolved in its render. One GET per cart state
    // and anchor, cached and never retried for the same key; when it fails, the fallback
    // cards the server already rendered stay. Reads wait until no mutation is pending.
    loadRecommendations() {
      if (!this.isConnected || this.pendingMutations || !this.dataset.recommendationsUrl) return;
      const slot = this.querySelector('[data-cart-cross-sell-slot][data-recommendations-pending]');
      const anchor = slot?.dataset.anchorProductId || '';
      if (!/^\d+$/.test(anchor)) return;
      const key = this.recommendationsKey(slot);
      if (this.recommendationCache.has(key)) {
        this.applyRecommendations(key, this.recommendationCache.get(key));
        return;
      }
      if (this.recommendationKey === key) return;
      this.fetchRecommendations(key, anchor).catch(() => {});
    }

    async fetchRecommendations(key, anchor) {
      this.crossSellController?.abort();
      const controller = new AbortController();
      this.crossSellController = controller;
      this.recommendationKey = key;
      const generation = this.recommendationGeneration;
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_RECOMMENDATIONS_TIMEOUT);
      let html = '';

      try {
        const url = new URL(this.dataset.recommendationsUrl, window.location.origin);
        url.searchParams.set('product_id', anchor);
        url.searchParams.set('intent', 'complementary');
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: controller.signal,
        });
        if (response.ok) {
          const nextSlot = new DOMParser()
            .parseFromString(await response.text(), 'text/html')
            .querySelector('[data-cart-cross-sell-slot]');
          // A slot still pending, or built for another anchor, adds nothing to what is shown.
          if (nextSlot && !nextSlot.hasAttribute('data-recommendations-pending')
            && nextSlot.dataset.anchorProductId === anchor) {
            html = nextSlot.outerHTML;
          }
        }
      } catch (error) {
        // An abort that is not the deadline comes from beginMutation() or a disconnect:
        // that key is dead and nothing is cached for it.
        if (error.name === 'AbortError' && !timedOut) return;
      } finally {
        window.clearTimeout(deadline);
        if (this.crossSellController === controller) this.crossSellController = null;
        if (this.recommendationKey === key) this.recommendationKey = null;
      }

      if (generation !== this.recommendationGeneration) return;
      // Bounded: one entry per revision and anchor is enough to reopen without a new GET.
      if (this.recommendationCache.size >= 8) {
        this.recommendationCache.delete(this.recommendationCache.keys().next().value);
      }
      this.recommendationCache.set(key, html);
      this.applyRecommendations(key, html);
    }

    // Applies only when idle: same revision and anchor, no option interaction, no pending
    // mutation and focus outside the slot. Only the slot is replaced, never the drawer body
    // or footer.
    applyRecommendations(key, html) {
      if (!html || !this.isConnected || this.interactionFrozen || this.pendingMutations) return;
      const slot = this.querySelector('[data-cart-cross-sell-slot][data-recommendations-pending]');
      if (!slot || this.recommendationsKey(slot) !== key) return;
      if (slot.contains(document.activeElement)) {
        this.watchRecommendationsFocus(slot);
        return;
      }
      this.recommendationWatch?.controller.abort();
      this.recommendationWatch = null;
      const nextSlot = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-cross-sell-slot]');
      if (nextSlot) slot.replaceWith(nextSlot);
    }

    // Revision in this tab plus the cart lines as rendered (key and server quantity), so a
    // change made in another tab also invalidates the cache, plus the anchor.
    recommendationsKey(slot) {
      const lines = Array.from(this.querySelectorAll('[data-cart-item-key]')).map((line) => (
        `${line.dataset.cartItemKey}x${line.querySelector('[data-cart-quantity]')?.defaultValue ?? ''}`
      ));
      return `${this.syncRevision}|${lines.join(',')}|${slot.dataset.anchorProductId || ''}`;
    }

    // Focus inside the slot blocks the swap. When focus leaves the slot, the cached result
    // gets another chance on the next tick; loadRecommendations() re-checks key, freeze and
    // pending mutations. One listener per slot, removed when it fires or on disconnect.
    watchRecommendationsFocus(slot) {
      if (this.recommendationWatch?.slot === slot) return;
      this.recommendationWatch?.controller.abort();
      const controller = new AbortController();
      const watch = { slot, controller };
      this.recommendationWatch = watch;
      slot.addEventListener('focusout', (event) => {
        if (event.relatedTarget instanceof Node && slot.contains(event.relatedTarget)) return;
        controller.abort();
        if (this.recommendationWatch === watch) this.recommendationWatch = null;
        window.setTimeout(() => {
          if (this.isConnected) this.loadRecommendations();
        }, 0);
      }, { signal: controller.signal });
    }

    async changeLine(line, quantity) {
      const revision = this.beginMutation();
      this.clearMessages();
      this.setDrawerBusy(true);

      try {
        const response = await fetchCommerce(this.dataset.cartChangeUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            line,
            quantity,
            sections: this.renderSectionIds(),
            sections_url: `${window.location.pathname}${window.location.search}`,
          }),
        }, this.dataset.errorMessage);
        // Shopify and upstream proxies answer 429/5xx with an HTML error page. Parsing it
        // as JSON throws "Unexpected token '<'" straight at the shopper, so the parse
        // failure is turned into the localized message instead. A deliberate abort keeps
        // its own name, because callers use it to stay silent.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

        await this.renderCartResponse(result, revision);
      } finally {
        this.setDrawerBusy(false);
        this.endMutation();
      }
    }

    // Returns the revision this mutation belongs to. Callers hand it back to
    // renderCartResponse so that a response overtaken by a newer mutation is dropped.
    beginMutation() {
      // A360-03. Shopify puede aplicar dos peticiones solapadas en otro orden que el de
      // envio: la respuesta de la ultima no incluye entonces la otra linea.
      if (this.pendingMutations) this.overlappingMutations = true;
      this.pendingMutations += 1;
      this.syncRevision += 1;
      this.requestController?.abort();
      // A mutation also invalidates any recommendations read started for the old cart.
      this.crossSellController?.abort();
      this.recommendationGeneration += 1;
      return this.syncRevision;
    }

    endMutation() {
      this.pendingMutations = Math.max(0, this.pendingMutations - 1);
      if (this.pendingMutations) return;
      this.syncAfterMutation = false;
      const overlapped = this.overlappingMutations;
      this.overlappingMutations = false;
      // Phase 2. An uncertain cross-sell add is reconciled even while an option panel holds
      // interactionFrozen; any other sync waits for the freeze to end.
      const reconcile = this.reconcileAfterMutation;
      this.reconcileAfterMutation = false;
      // A lone mutation that rendered already brought back server-fresh HTML. Overlapping
      // ones may have been applied out of order, and an unrendered latest revision (failed,
      // aborted or overtaken) is stale too: both earn one fresh read.
      if (!overlapped && this.renderedRevision === this.syncRevision) {
        this.loadRecommendations();
        return;
      }
      if (this.isConnected && this.isOpen) this.syncCart({ reconcile }).catch(() => {});
    }

    // Always re-renders on open. Comparing item_count alone missed same-count changes:
    // a line swapped for another in a second tab, a price change, or edited properties.
    async syncCart({ reconcile = false } = {}) {
      if (this.pendingMutations) {
        this.syncAfterMutation = true;
        return;
      }
      // Phase 2. While an option panel is in use a sync must not replace it: the skip is
      // remembered and releaseInteraction() runs it. A reconciling sync goes through.
      if (this.interactionFrozen && !reconcile) {
        this.skippedSync = true;
        return;
      }
      const revision = this.syncRevision;
      const sectionHtml = await this.requestSection();
      if (!this.isConnected || revision !== this.syncRevision || this.pendingMutations) return;
      if (this.interactionFrozen && !reconcile) {
        this.skippedSync = true;
        return;
      }
      this.skippedSync = false;
      if (reconcile) this.interactionFrozen = false;
      this.renderSection(sectionHtml);
      // Si el carrito cambio en otra pestana, la pagina /cart de fondo tambien esta vieja.
      this.renderCartPage(null, revision).catch(() => {});
    }

    async requestSection() {
      this.requestController?.abort();
      this.requestController = new AbortController();

      const url = new URL(this.dataset.cartUrl, window.location.origin);
      url.searchParams.set('section_id', this.dataset.sectionId);
      const response = await fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        signal: this.requestController.signal,
      });

      if (!response.ok) throw new Error(this.dataset.errorMessage);
      return response.text();
    }

    // `revision` is what beginMutation() returned for this request. Shopify renders the
    // section at the moment it applies the change, so when several mutations are in
    // flight a slow response carries older HTML than a fast one. Painting it would show
    // a quantity the server has already moved past; a superseded response is dropped and
    // endMutation() decides whether the latest state still needs a fetch.
    async renderCartResponse(result, revision = this.syncRevision) {
      if (revision !== this.syncRevision) return;
      let sectionHtml = result.sections?.[this.dataset.sectionId];
      if (!sectionHtml) sectionHtml = await this.requestSection();
      if (revision !== this.syncRevision) return;
      // A reconciled mutation render ends any option interaction: it replaces the panel.
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.renderSection(sectionHtml);
      await this.renderCartPage(result.sections, revision);
    }

    // 4F-002. En /cart el cajon y la pagina de carrito muestran la misma compra. Si el
    // cajon cambia una linea y la pagina no se entera, el comprador ve dos carritos
    // distintos hasta que recarga (GPT-AUDIT-002, UX-06). Cada mutacion pide tambien la
    // seccion de la pagina en la misma llamada, asi las dos salen del mismo estado del
    // servidor y no hace falta una segunda peticion.
    cartPageSection() {
      return document.querySelector('[data-cart-page][data-section-id]');
    }

    renderSectionIds() {
      const pageSectionId = this.cartPageSection()?.dataset.sectionId;
      return pageSectionId && pageSectionId !== this.dataset.sectionId
        ? [this.dataset.sectionId, pageSectionId]
        : [this.dataset.sectionId];
    }

    // La pagina se refresca como complemento: si falla, el cajon ya quedo bien pintado y
    // la pagina se corrige con la siguiente mutacion o al recargar, sin mostrar un error.
    async renderCartPage(sections, revision = this.syncRevision) {
      const page = this.cartPageSection();
      if (!page) return;

      const pageSectionId = page.dataset.sectionId;
      let pageHtml = sections?.[pageSectionId];

      if (!pageHtml) {
        try {
          const url = new URL(this.dataset.cartUrl, window.location.origin);
          url.searchParams.set('section_id', pageSectionId);
          const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!response.ok) return;
          pageHtml = await response.text();
        } catch {
          return;
        }
      }

      if (revision !== this.syncRevision) return;
      const nextPage = new DOMParser().parseFromString(pageHtml, 'text/html').querySelector('[data-cart-page]');
      const currentPage = this.cartPageSection();
      if (nextPage && currentPage?.isConnected) currentPage.replaceWith(nextPage);
    }

    renderSection(sectionHtml) {
      if (!sectionHtml) throw new Error(this.dataset.errorMessage);

      const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
      const nextDrawer = documentFragment.querySelector('cart-drawer');
      const nextContent = nextDrawer?.querySelector('[data-cart-drawer-content]');
      const currentContent = this.querySelector('[data-cart-drawer-content]');

      if (!nextDrawer || !nextContent || !currentContent) throw new Error(this.dataset.errorMessage);

      // A re-render replaces the whole drawer body. Carry over an order note the shopper
      // has typed but not yet saved, and keep focus inside the drawer instead of dropping
      // it on document.body, which would strand keyboard and screen-reader users.
      const previousNote = currentContent.querySelector('textarea[name="note"][data-dirty="true"]');
      const nextNote = nextContent.querySelector('textarea[name="note"]');
      if (previousNote && nextNote) {
        nextNote.value = previousNote.value;
        nextNote.dataset.dirty = 'true';
      }

      const active = document.activeElement;
      const restoreFocus = this.isOpen && (currentContent.contains(active) || active === document.body);
      // La pista desplazable vive dentro del bloque que se reemplaza: sin esto, cambiar la
      // cantidad de una linea al fondo de la lista devolveria la pista arriba del todo.
      const previousScroll = currentContent.querySelector('[data-cart-scroll]')?.scrollTop || 0;

      this.recommendationWatch?.controller.abort();
      this.recommendationWatch = null;

      currentContent.replaceWith(nextContent);

      const nextScroll = nextContent.querySelector('[data-cart-scroll]');
      if (nextScroll && previousScroll) nextScroll.scrollTop = previousScroll;

      if (restoreFocus) {
        const restored = active?.id ? nextContent.querySelector(`#${CSS.escape(active.id)}`) : null;
        // El control puede volver deshabilitado desde el servidor: el boton mas se apaga
        // cuando la linea toca el tope de inventario, que el cliente no conoce. Un focus()
        // sobre un control deshabilitado no hace nada y el foco caeria al body, asi que se
        // busca primero el hermano utilizable del mismo stepper.
        const target = restored && !restored.disabled
          ? restored
          : restored?.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])');
        (target || this.crossSellFocusAfterRender(active, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
      }
      this.dataset.itemCount = nextDrawer.dataset.itemCount;
      this.dataset.cartCountLabel = nextDrawer.dataset.cartCountLabel;

      const currentCount = this.querySelector('[data-cart-drawer-count]');
      const nextCount = nextDrawer.querySelector('[data-cart-drawer-count]');
      if (currentCount && nextCount) currentCount.textContent = nextCount.textContent;

      // Records which revision the visible HTML came from. endMutation() compares this
      // against syncRevision to decide whether a deferred sync still has anything to
      // fetch: if every mutation since the sync was requested has rendered, it does not.
      this.renderedRevision = this.syncRevision;

      this.updateHeaderCount();
      this.loadRecommendations();
    }

    updateHeaderCount() {
      const itemCount = Number(this.dataset.itemCount) || 0;

      document.querySelectorAll('a[href]').forEach((link) => {
        const linkUrl = new URL(link.href, window.location.origin);
        const cartUrl = new URL(this.dataset.cartUrl, window.location.origin);
        if (linkUrl.origin !== cartUrl.origin || linkUrl.pathname !== cartUrl.pathname) return;
        if (this.contains(link)) return;

        link.setAttribute('aria-label', this.dataset.cartCountLabel);
        let count = link.querySelector('.site-header__cart-count');

        // El ajuste "Show cart count" apagado no debe encenderse al primer alta.
        if (itemCount > 0 && !count && link.hasAttribute('data-cart-count-enabled')) {
          count = document.createElement('span');
          count.className = 'site-header__cart-count';
          count.setAttribute('aria-hidden', 'true');
          link.append(count);
        }

        if (count) {
          count.textContent = itemCount;
          count.hidden = itemCount === 0;
        }
      });
    }

    setFormBusy(form, submitter, busy) {
      const button = submitter || form.querySelector('[data-add-to-cart]');
      if (!button) return;

      if (busy) button.dataset.wasDisabled = String(button.disabled);
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      button.setAttribute('aria-busy', String(busy));

      const spinner = button.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      if (!busy) delete button.dataset.wasDisabled;
    }

    setDrawerBusy(busy) {
      this.panel.setAttribute('aria-busy', String(busy));
      this.querySelectorAll('[data-cart-quantity], [data-cart-remove], [data-cross-sell-add], [data-cross-sell-expand], [data-cross-sell-cancel]').forEach((control) => {
        if (busy) {
          if (control.dataset.wasDisabled === undefined) {
            control.dataset.wasDisabled = String(control.disabled);
          }
          control.disabled = true;
          return;
        }

        if (control.dataset.wasDisabled === undefined) return;
        control.disabled = control.dataset.wasDisabled === 'true';
        delete control.dataset.wasDisabled;
      });
    }

    setCrossSellBusy(button, busy) {
      if (!button) return;

      if (busy) button.dataset.wasDisabled = String(button.disabled);
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      button.setAttribute('aria-busy', String(busy));
      const spinner = button.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      const adding = button.querySelector('[data-cross-sell-adding]');
      if (adding) adding.hidden = !busy;
      if (!busy) delete button.dataset.wasDisabled;
    }

    clearMessages(form = null) {
      const localError = form?.querySelector('[data-product-form-error]');
      const drawerError = this.querySelector('[data-cart-error]');
      const status = this.querySelector('[data-cart-status]');

      [localError, drawerError, status].forEach((message) => {
        if (!message) return;
        message.hidden = true;
        message.textContent = '';
      });
      // The uncertain notice belongs to the error it explains, so it clears with it.
      const uncertain = this.querySelector('[data-cart-uncertain]');
      if (uncertain) uncertain.hidden = true;
    }

    showError(message, form = null) {
      const output = form?.querySelector('[data-product-form-error]') || this.querySelector('[data-cart-error]');
      if (!output) return;
      output.textContent = message || this.dataset.errorMessage;
      output.hidden = false;
    }

    showStatus(message) {
      const output = this.querySelector('[data-cart-status]');
      if (!output) return;
      // La region se muestra vacia y el texto llega despues: una region viva que aparece ya
      // con contenido no siempre se anuncia (NVDA/JAWS con Chrome). 6B-001.
      output.textContent = '';
      output.hidden = false;
      window.setTimeout(() => {
        output.textContent = message;
      }, 100);
    }
  }

  class FacetFiltersForm extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.gridStorageKey = 'theme:grid-columns';

      this.listen(this, 'submit', (event) => {
        const form = event.target.closest('[data-facet-form]');
        if (!form) return;
        event.preventDefault();
        this.renderForm(form, true);
      });

      this.listen(this, 'change', (event) => {
        if (!event.target.matches('[data-facet-sort]')) return;
        event.target.form?.requestSubmit();
      });

      this.listen(this, 'click', (event) => {
        // Pildoras de filtros activos y "Clear all" (6B-001): son enlaces a url_to_remove que
        // funcionan sin JS; aqui se refrescan por AJAX. Ctrl/Cmd/Shift/clic central siguen
        // abriendo el enlace como el navegador espera.
        const removeLink = event.target.closest('[data-facet-remove], [data-facet-clear-all]');
        if (removeLink) {
          if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
            || event.shiftKey || event.altKey) return;
          event.preventDefault();
          this.renderUrl(removeLink.href, true, '[data-facet-remove], [data-facet-clear-all], [data-results-status]');
          return;
        }

        const button = event.target.closest('[data-grid-view]');
        if (!button) return;
        this.setGridView(button.dataset.gridView, true);
      });

      this.listen(window, 'popstate', () => this.renderUrl(window.location.href, false));
      this.applyStoredGridView();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    renderForm(form, pushState) {
      const url = new URL(form.action, window.location.origin);
      const parameters = new URLSearchParams(new FormData(form));

      Array.from(parameters.entries()).forEach(([key, value]) => {
        if (value === '') parameters.delete(key);
      });

      url.search = parameters.toString();
      this.renderUrl(url, pushState);
    }

    // focusFallback: selector que recibe el foco cuando el elemento enfocado no sobrevive al
    // repintado (la pildora que se acaba de quitar no tiene id ni existe en el HTML nuevo).
    async renderUrl(urlValue, pushState, focusFallback = null) {
      const navigationUrl = new URL(urlValue, window.location.origin);
      // AF-14 (AUDIT-FINAL-001): solo se pinta o se navega dentro de la propia tienda.
      if (navigationUrl.origin !== window.location.origin) return;
      navigationUrl.searchParams.delete('section_id');
      const requestUrl = new URL(navigationUrl);
      requestUrl.searchParams.set('section_id', this.dataset.sectionId);
      const focusedId = document.activeElement?.id;

      this.requestController?.abort();
      this.requestController = new AbortController();
      this.setBusy(true);

      try {
        const response = await fetch(requestUrl, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: this.requestController.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextElement = documentFragment.querySelector('facet-filters-form');
        if (!nextElement) throw new Error('invalid-section');

        this.innerHTML = nextElement.innerHTML;
        this.applyStoredGridView();
        this.announceResultCount();
        if (pushState) window.history.pushState({}, '', navigationUrl);

        if (focusedId && document.getElementById(focusedId)) {
          requestAnimationFrame(() => document.getElementById(focusedId)?.focus());
        } else if (focusFallback) {
          const fallbackTarget = this.querySelector(focusFallback);
          if (fallbackTarget) requestAnimationFrame(() => fallbackTarget.focus());
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        window.location.assign(navigationUrl);
      } finally {
        this.setBusy(false);
      }
    }

    setBusy(busy) {
      const grid = this.querySelector('[data-product-grid]');
      if (grid) grid.setAttribute('aria-busy', String(busy));
    }

    // The result count lives inside the subtree this component replaces, so screen
    // readers lose the node it was announcing. Mirror the text into a region that
    // sits outside the swap and therefore keeps its identity.
    announceResultCount() {
      const liveRegion = this.parentElement?.querySelector(':scope > [data-facet-live-region]');
      if (!liveRegion) return;

      const status = this.querySelector('[data-results-status]');
      liveRegion.textContent = status?.textContent?.trim() || '';
    }

    applyStoredGridView() {
      let storedValue = null;

      try {
        storedValue = window.localStorage.getItem(this.gridStorageKey);
      } catch (_error) {
        storedValue = null;
      }

      const gridView = ['2', '4', 'list'].includes(storedValue)
        ? storedValue
        : this.dataset.defaultGridColumns;
      this.setGridView(gridView, false);
    }

    setGridView(value, persist) {
      const gridView = String(value);
      if (!['2', '4', 'list'].includes(gridView)) return;

      const productList = this.querySelector('[data-product-list]');
      if (!productList) return;

      productList.dataset.gridColumns = gridView;
      this.querySelectorAll('[data-grid-view]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.gridView === gridView));
      });

      if (!persist) return;
      try {
        window.localStorage.setItem(this.gridStorageKey, gridView);
      } catch (_error) {
        // Storage can be unavailable in privacy-restricted browsing contexts.
      }
    }
  }

  class EditorialHero extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.video = this.querySelector('[data-editorial-hero-video]');
      if (!this.video) return;

      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.listen(this.mobileQuery, 'change', () => this.syncPlayback());
      this.listen(this.reducedMotionQuery, 'change', () => this.syncPlayback());
      this.listen(document, 'visibilitychange', () => this.syncPlayback());
      this.syncPlayback();
    }

    disconnectedCallback() {
      this.video?.pause();
      this.removeAttribute('data-video-active');
      super.disconnectedCallback();
    }

    hydrateVideo() {
      if (!this.video || this.video.dataset.sourcesLoaded === 'true') return;

      this.video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
      });
      this.video.dataset.sourcesLoaded = 'true';
      this.video.load();
    }

    async syncPlayback() {
      if (!this.video) return;

      const mobilePlaybackAllowed = !this.mobileQuery.matches
        || this.dataset.enableVideoMobile === 'true';
      const shouldPlay = mobilePlaybackAllowed
        && !this.reducedMotionQuery.matches
        && document.visibilityState !== 'hidden';

      if (!shouldPlay) {
        this.video.pause();
        this.removeAttribute('data-video-active');
        return;
      }

      this.hydrateVideo();
      try {
        await this.video.play();
        this.setAttribute('data-video-active', '');
      } catch (error) {
        this.removeAttribute('data-video-active');
      }
    }
  }

  class EditorialLookbook extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.activeTrigger = null;
      this.activePopover = null;
      this.releaseFocusTrap = null;
      this.triggers = Array.from(this.querySelectorAll('[data-lookbook-trigger]'));

      if (this.triggers.length === 0) return;

      this.listen(this, 'click', (event) => this.handleClick(event));
      this.listen(document, 'pointerdown', (event) => this.handleOutsidePointer(event));
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.activePopover || event.defaultPrevented) return;
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
      });
      this.listen(window, 'resize', () => this.positionPopover());
      this.listen(window, 'scroll', () => this.positionPopover(), {
        capture: true,
        passive: true,
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const hotspot = event.target.closest?.('[data-lookbook-hotspot]');
        const trigger = hotspot?.querySelector('[data-lookbook-trigger]');
        if (trigger) this.open(trigger);
      });
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    handleClick(event) {
      const closeButton = event.target.closest('[data-lookbook-close]');
      if (closeButton) {
        event.preventDefault();
        this.close(true);
        return;
      }

      const trigger = event.target.closest('[data-lookbook-trigger]');
      if (!trigger) return;

      if (trigger === this.activeTrigger) {
        this.close(true);
      } else {
        this.open(trigger);
      }
    }

    handleOutsidePointer(event) {
      if (!this.activePopover) return;
      if (this.activePopover.contains(event.target) || this.activeTrigger?.contains(event.target)) return;
      const trigger = this.activeTrigger;
      this.close(false);
      requestAnimationFrame(() => {
        const focusWasLost = document.activeElement === document.body
          || document.activeElement === document.documentElement;
        if (focusWasLost && trigger?.isConnected) trigger.focus();
      });
    }

    open(trigger) {
      const popoverId = trigger.getAttribute('aria-controls');
      const popover = popoverId ? document.getElementById(popoverId) : null;
      if (!popover || !this.contains(popover)) return;

      this.close(false);
      this.activeTrigger = trigger;
      this.activePopover = popover;
      trigger.setAttribute('aria-expanded', 'true');
      popover.hidden = false;
      popover.inert = false;
      popover.setAttribute('data-open', '');
      this.positionPopover();
      this.releaseFocusTrap = trapFocus(
        popover,
        popover.querySelector('[data-lookbook-close]'),
      );
    }

    close(restoreFocus) {
      if (!this.activePopover || !this.activeTrigger) return;

      const trigger = this.activeTrigger;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      trigger.setAttribute('aria-expanded', 'false');
      this.activePopover.hidden = true;
      this.activePopover.inert = true;
      this.activePopover.removeAttribute('data-open');
      this.activePopover.style.removeProperty('left');
      this.activePopover.style.removeProperty('top');
      this.activePopover = null;
      this.activeTrigger = null;

      if (restoreFocus && trigger.isConnected) trigger.focus();
    }

    positionPopover() {
      if (!this.activePopover || !this.activeTrigger) return;

      const triggerRect = this.activeTrigger.getBoundingClientRect();
      const popoverWidth = this.activePopover.offsetWidth;
      const popoverHeight = this.activePopover.offsetHeight;
      const margin = 16;
      const gap = 12;
      const preferredPosition = this.activePopover.dataset.position || 'right';
      let left = triggerRect.left + (triggerRect.width - popoverWidth) / 2;
      let top = triggerRect.bottom + gap;

      if (preferredPosition === 'top') top = triggerRect.top - popoverHeight - gap;
      if (preferredPosition === 'left') {
        left = triggerRect.left - popoverWidth - gap;
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
      }
      if (preferredPosition === 'right') {
        left = triggerRect.right + gap;
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
      }

      const maxLeft = Math.max(margin, window.innerWidth - popoverWidth - margin);
      const maxTop = Math.max(margin, window.innerHeight - popoverHeight - margin);
      left = Math.min(Math.max(left, margin), maxLeft);
      top = Math.min(Math.max(top, margin), maxTop);

      this.activePopover.style.left = `${Math.round(left)}px`;
      this.activePopover.style.top = `${Math.round(top)}px`;
    }
  }

  class CompleteTheLook extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('[data-bundle-item]'));
      this.submitButton = this.querySelector('[data-complete-look-submit]');
      this.submitLabel = this.querySelector('[data-complete-look-label]');
      this.countOutput = this.querySelector('[data-bundle-count]');
      this.totalOutput = this.querySelector('[data-bundle-total]');
      this.statusOutput = this.querySelector('[data-bundle-status]');
      this.errorOutput = this.querySelector('[data-bundle-error]');
      this.requestController = null;
      this.busy = false;

      if (!this.submitButton) return;

      this.listen(this, 'change', (event) => {
        const item = event.target.closest('[data-bundle-item]');
        if (!item || !event.target.matches('[data-bundle-select], [data-bundle-variant]')) return;
        if (event.target.matches('[data-bundle-variant]')) this.updateItemPrice(item);
        this.clearMessages();
        this.updateSummary();
      });
      this.listen(this.submitButton, 'click', () => {
        this.addSelectedItems().catch((error) => {
          if (error.name === 'AbortError') return;
          this.showError(error.message);
        });
      });

      this.items.forEach((item) => this.updateItemPrice(item));
      this.updateSummary();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    getVariantData(item) {
      const control = item.querySelector('[data-bundle-variant]');
      if (!control || control.disabled || !control.value) return null;

      const source = control instanceof HTMLSelectElement
        ? control.selectedOptions[0]
        : control;
      if (!source) return null;

      return {
        id: Number(control.value),
        price: Number(source.dataset.price) || 0,
        quantity: Math.max(1, Number(source.dataset.quantity) || 1),
        formattedPrice: source.dataset.priceFormatted || '',
        formattedComparePrice: source.dataset.compareFormatted || '',
      };
    }

    getSelectedItems() {
      return this.items.flatMap((item) => {
        const checkbox = item.querySelector('[data-bundle-select]');
        const variant = this.getVariantData(item);
        if (!checkbox?.checked || checkbox.disabled || !variant?.id) return [];
        return [{ ...variant, item }];
      });
    }

    updateItemPrice(item) {
      const variant = this.getVariantData(item);
      if (!variant) return;

      const currentPrice = item.querySelector('[data-current-price]');
      const comparePrice = item.querySelector('[data-compare-price]');
      if (currentPrice) currentPrice.textContent = variant.formattedPrice;
      if (comparePrice) {
        comparePrice.textContent = variant.formattedComparePrice;
        comparePrice.hidden = !variant.formattedComparePrice;
      }
    }

    updateSummary() {
      this.items.forEach((item) => {
        const checkbox = item.querySelector('[data-bundle-select]');
        item.toggleAttribute('data-selected', Boolean(checkbox?.checked && !checkbox.disabled));
      });

      const selectedItems = this.getSelectedItems();
      const count = selectedItems.length;
      const total = selectedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0,
      );
      const formattedTotal = formatMoney(total, this.dataset.moneyFormat);
      // El sustantivo concuerda con el total de piezas del look, no con las seleccionadas:
      // "1 of 3 items selected" (4F-002).
      const countTemplate = this.items.length === 1
        ? this.dataset.selectedOneTemplate
        : this.dataset.selectedManyTemplate;

      if (this.countOutput) {
        this.countOutput.textContent = this.interpolate(countTemplate, {
          count,
          total: this.items.length,
        });
      }
      if (this.totalOutput) this.totalOutput.textContent = formattedTotal;
      if (this.submitLabel) {
        if (count === 0) {
          this.submitLabel.textContent = this.dataset.emptyLabel;
        } else {
          const buttonTemplate = count === 1
            ? this.dataset.addOneTemplate
            : this.dataset.addManyTemplate;
          this.submitLabel.textContent = this.interpolate(buttonTemplate, {
            count,
            total: formattedTotal,
          });
        }
      }
      this.submitButton.disabled = this.busy || count === 0;
    }

    interpolate(template = '', values = {}) {
      return Object.entries(values).reduce(
        (output, [key, value]) => output.replaceAll(`__${key}__`, String(value)),
        template,
      );
    }

    async addSelectedItems() {
      const selectedItems = this.getSelectedItems();
      if (selectedItems.length === 0 || this.busy) return;

      this.clearMessages();
      this.setBusy(true);
      this.requestController?.abort();
      this.requestController = new AbortController();
      const drawer = document.querySelector('cart-drawer');
      const revision = drawer?.beginMutation?.();
      const requestBody = {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      };

      if (drawer?.dataset.sectionId) {
        requestBody.sections = typeof drawer.renderSectionIds === 'function'
          ? drawer.renderSectionIds()
          : [drawer.dataset.sectionId];
        requestBody.sections_url = `${window.location.pathname}${window.location.search}`;
      }

      try {
        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(requestBody),
          signal: this.requestController.signal,
        }, this.dataset.errorMessage);
        // See addItem: an HTML error page must surface as the localized message, not as
        // a JSON SyntaxError, and an abort must stay an abort.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) {
          throw new Error(result?.description || result?.message || this.dataset.errorMessage);
        }

        const canRenderDrawer = drawer
          && typeof drawer.renderCartResponse === 'function'
          && typeof drawer.open === 'function'
          && result.sections;

        if (!canRenderDrawer) {
          window.location.assign(this.dataset.cartUrl);
          return;
        }

        try {
          await drawer.renderCartResponse(result, revision);
        } catch (_error) {
          window.location.assign(this.dataset.cartUrl);
          return;
        }

        drawer.showStatus?.(this.dataset.addedMessage);
        drawer.open(this.submitButton);
        this.showStatus(this.dataset.addedMessage);
      } finally {
        this.setBusy(false);
        drawer?.endMutation?.();
      }
    }

    setBusy(busy) {
      this.busy = busy;
      this.setAttribute('aria-busy', String(busy));
      this.querySelectorAll('[data-bundle-select], select[data-bundle-variant]').forEach((control) => {
        if (busy) {
          control.dataset.wasDisabled = String(control.disabled);
          control.disabled = true;
        } else if (control.dataset.wasDisabled !== undefined) {
          control.disabled = control.dataset.wasDisabled === 'true';
          delete control.dataset.wasDisabled;
        }
      });

      const spinner = this.submitButton.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      this.submitButton.setAttribute('aria-busy', String(busy));
      if (busy) {
        this.submitButton.disabled = true;
      } else {
        this.updateSummary();
      }
    }

    clearMessages() {
      [this.statusOutput, this.errorOutput].forEach((output) => {
        if (!output) return;
        output.hidden = true;
        output.textContent = '';
      });
    }

    showStatus(message) {
      if (!this.statusOutput) return;
      this.statusOutput.textContent = message;
      this.statusOutput.hidden = false;
    }

    showError(message) {
      if (!this.errorOutput) return;
      this.errorOutput.textContent = message || this.dataset.errorMessage;
      this.errorOutput.hidden = false;
    }
  }

  class CuratedShowcase extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.tabs = Array.from(this.querySelectorAll('[data-curated-tab]'));
      this.panels = Array.from(this.querySelectorAll('[data-curated-panel]'));

      if (this.tabs.length === 0 || this.tabs.length !== this.panels.length) return;

      this.tabs.forEach((tab, index) => {
        this.listen(tab, 'click', () => this.activate(index));
        this.listen(tab, 'keydown', (event) => this.handleKeydown(event, index));
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const panel = event.target.closest?.('[data-curated-panel]');
        const panelIndex = this.panels.indexOf(panel);
        if (panelIndex >= 0) this.activate(panelIndex, false);
      });

      const selectedIndex = this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
      this.activate(Math.max(0, selectedIndex), false);
    }

    activate(index, focus = false) {
      if (index < 0 || index >= this.tabs.length) return;

      this.tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      this.panels.forEach((panel, panelIndex) => {
        const selected = panelIndex === index;
        panel.hidden = !selected;
        panel.inert = !selected;
      });

      if (focus) this.tabs[index].focus();
    }

    handleKeydown(event, currentIndex) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = this.tabs.length - 1;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
      }
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.tabs.length;
      this.activate(nextIndex, true);
    }
  }

  class MarqueeBanner extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.toggleButton = this.querySelector('[data-marquee-toggle]');
      this.toggleLabel = this.querySelector('[data-marquee-toggle-label]');

      if (!this.toggleButton) return;

      this.setPaused(false);
      this.listen(this.toggleButton, 'click', () => {
        this.setPaused(!this.hasAttribute('data-paused'));
      });
    }

    setPaused(paused) {
      this.toggleAttribute('data-paused', paused);
      this.toggleButton.setAttribute('aria-pressed', String(paused));
      const label = paused ? this.dataset.playLabel : this.dataset.pauseLabel;
      this.toggleButton.setAttribute('aria-label', label);
      if (this.toggleLabel) this.toggleLabel.textContent = label;
    }
  }

  class AnnouncementBar extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('[data-announcement-item]'));
      this.previousButton = this.querySelector('[data-announcement-previous]');
      this.nextButton = this.querySelector('[data-announcement-next]');
      this.pauseButton = this.querySelector('[data-announcement-pause]');
      this.status = this.querySelector('[data-announcement-status]');
      this.activeIndex = Math.max(0, this.items.findIndex((item) => !item.hidden));
      this.autoRotate = this.dataset.autoRotate === 'true';
      this.interval = Math.max(3000, Number(this.dataset.interval) || 5000);
      this.userPaused = false;
      this.interactionPaused = false;
      this.timer = null;

      if (this.items.length <= 1) return;

      this.listen(this.previousButton, 'click', () => this.changeBy(-1));
      this.listen(this.nextButton, 'click', () => this.changeBy(1));
      this.listen(this.pauseButton, 'click', () => {
        this.userPaused = !this.userPaused;
        this.updatePauseButton();
        this.schedule();
      });
      this.listen(this, 'pointerenter', () => {
        this.interactionPaused = true;
        this.clearTimer();
      });
      this.listen(this, 'pointerleave', () => {
        this.interactionPaused = false;
        this.schedule();
      });
      this.listen(this, 'focusin', () => {
        this.interactionPaused = true;
        this.clearTimer();
      });
      this.listen(this, 'focusout', () => {
        requestAnimationFrame(() => {
          // The frame can land after the Theme Editor has removed this section.
          if (!this.isConnected || this.contains(document.activeElement)) return;
          this.interactionPaused = false;
          this.schedule();
        });
      });
      this.listen(reducedMotionQuery, 'change', () => this.schedule());

      this.setActive(this.activeIndex, false);
      this.updatePauseButton();
      this.schedule();
    }

    disconnectedCallback() {
      this.clearTimer();
      super.disconnectedCallback();
    }

    changeBy(offset) {
      const nextIndex = (this.activeIndex + offset + this.items.length) % this.items.length;
      this.setActive(nextIndex, true);
      this.schedule();
    }

    setActive(index, announce) {
      this.activeIndex = index;
      this.items.forEach((item, itemIndex) => {
        const active = itemIndex === index;
        item.hidden = !active;
        item.setAttribute('aria-hidden', String(!active));
      });

      if (announce && this.status) {
        this.status.textContent = this.items[index]?.textContent.trim() || '';
      }
    }

    updatePauseButton() {
      if (!this.pauseButton) return;

      this.pauseButton.toggleAttribute('data-paused', this.userPaused);
      this.pauseButton.setAttribute(
        'aria-label',
        this.userPaused ? this.pauseButton.dataset.playLabel : this.pauseButton.dataset.pauseLabel,
      );
    }

    schedule() {
      this.clearTimer();
      if (!this.isConnected) return;
      if (!this.autoRotate || this.userPaused || this.interactionPaused || reducedMotionQuery.matches) return;

      this.timer = window.setTimeout(() => {
        this.setActive((this.activeIndex + 1) % this.items.length, false);
        this.schedule();
      }, this.interval);
    }

    clearTimer() {
      if (this.timer === null) return;
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  class FaqAccordion extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('details'));

      this.items.forEach((item) => {
        this.listen(item, 'toggle', () => this.handleToggle(item));
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const item = event.target.closest?.('details');
        if (!item || !this.contains(item)) return;
        item.open = true;
        item.querySelector('summary')?.focus();
      });
    }

    handleToggle(activeItem) {
      if (activeItem.open && this.hasAttribute('data-single-open')) {
        this.items.forEach((item) => {
          if (item !== activeItem) item.open = false;
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4E-001. Indice de anclas con seguimiento del scroll.
  //
  // Dos consumidores, una sola pieza:
  //   - Documentacion: el Liquid ya sirve la lista, porque los ids de ancla son un
  //     ajuste del bloque y el servidor los conoce.
  //   - Paginas legales: los encabezados los escribe el comerciante en el editor de
  //     paginas, asi que no hay ids que emitir y la lista se construye aqui.
  //
  // El elemento nace con [hidden] y solo se muestra al encontrar dos destinos o mas: un
  // indice de una sola entrada no orienta a nadie, y sin JavaScript no puede quedarse en
  // pantalla un desplegable vacio. El contenido al que apunta se lee entero igual.
  // ---------------------------------------------------------------------------
  class AnchorNav extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.list = this.querySelector('[data-anchor-list]');
      this.targets = this.collectTargets();

      if (this.targets.length < 2) return;
      if (this.list && !this.list.children.length) this.buildList();

      this.links = new Map();
      this.querySelectorAll('[data-anchor-link]').forEach((link) => {
        const id = link.getAttribute('href')?.slice(1);
        if (id) this.links.set(id, link);
      });

      if (!this.links.size) return;

      this.hidden = false;
      this.watchTargets();
      // El indice de las paginas legales vive dentro de un <details> abierto: en movil
      // ocupa media pantalla, asi que se cierra solo al saltar a una seccion.
      this.listen(this, 'click', (event) => {
        if (!event.target.closest('[data-anchor-link]')) return;
        const disclosure = this.querySelector('[data-anchor-disclosure]');
        if (disclosure && window.matchMedia('(max-width: 61.99rem)').matches) {
          disclosure.open = false;
        }
      });
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      super.disconnectedCallback();
    }

    collectTargets() {
      const source = this.dataset.anchorSource
        ? document.querySelector(this.dataset.anchorSource)
        : null;

      // Modo servido: los destinos son los que ya apuntan los enlaces del Liquid.
      if (!source) {
        return Array.from(this.querySelectorAll('[data-anchor-link]'))
          .map((link) => document.getElementById(link.getAttribute('href')?.slice(1) || ''))
          .filter(Boolean);
      }

      // Modo construido: se numeran los encabezados y se les da id si no lo traen, que
      // es lo normal en texto pegado desde el editor de paginas.
      const prefix = this.dataset.anchorPrefix || 'AnchorNavSection';
      return Array.from(source.querySelectorAll(this.dataset.anchorSelector || 'h2'))
        .filter((heading) => heading.textContent.trim())
        .map((heading, index) => {
          if (!heading.id) heading.id = `${prefix}-${index + 1}`;
          return heading;
        });
    }

    buildList() {
      const fragment = document.createDocumentFragment();

      this.targets.forEach((target) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${target.id}`;
        link.className = 'anchor-nav__link';
        link.textContent = target.textContent.trim();
        link.setAttribute('data-anchor-link', '');
        item.appendChild(link);
        fragment.appendChild(item);
      });

      this.list.appendChild(fragment);
    }

    watchTargets() {
      if (!('IntersectionObserver' in window)) return;

      this.visible = new Set();

      // -45% abajo: cuenta como "en pantalla" lo que ocupa la mitad superior de la
      // ventana, no lo que acaba de asomar por el borde inferior.
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.visible.add(entry.target.id);
          else this.visible.delete(entry.target.id);
        });
        this.syncCurrent();
      }, { rootMargin: '0px 0px -45% 0px', threshold: 0 });

      this.targets.forEach((target) => this.observer.observe(target));
      this.listen(window, 'scroll', () => this.syncCurrent(), { passive: true });
    }

    // Con varios apartados en pantalla manda el primero, no el ultimo que aviso el
    // observador: el orden en que llegan sus llamadas no es el orden de la pagina.
    syncCurrent() {
      if (this.atBottom()) {
        this.setCurrent(this.targets[this.targets.length - 1].id);
        return;
      }

      const first = this.targets.find((target) => this.visible.has(target.id));
      if (first) this.setCurrent(first.id);
    }

    // El ultimo apartado de un documento suele ser mas corto que el margen inferior del
    // observador, asi que por si solo nunca llegaria a estar "en pantalla" y su entrada
    // del indice quedaria muerta. Al final de la pagina, el ultimo es el que toca.
    atBottom() {
      const scrolled = window.scrollY + window.innerHeight;
      return scrolled >= document.documentElement.scrollHeight - 2;
    }

    setCurrent(id) {
      const link = this.links.get(id);
      if (!link || link === this.currentLink) return;

      this.currentLink?.removeAttribute('aria-current');
      link.setAttribute('aria-current', 'true');
      this.currentLink = link;
    }
  }

  // ---------------------------------------------------------------------------
  // 4E-001. Copiado de un fragmento de la documentacion.
  //
  // El boton nace con [hidden] en el Liquid y solo se revela aqui, cuando consta que el
  // navegador tiene portapapeles. Sin JavaScript, o en un contexto sin permiso, el
  // fragmento se sigue leyendo y seleccionando y no queda un boton inerte en pantalla.
  // ---------------------------------------------------------------------------
  class CopyText extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-copy-trigger]');
      this.label = this.querySelector('[data-copy-label]');
      this.status = this.querySelector('[data-copy-status]');
      this.source = this.dataset.copySource
        ? this.querySelector(this.dataset.copySource) || document.querySelector(this.dataset.copySource)
        : null;

      if (!this.trigger || !this.source || !navigator.clipboard?.writeText) return;

      this.idleLabel = this.label?.textContent || '';
      this.trigger.hidden = false;
      this.listen(this.trigger, 'click', () => this.copy());
    }

    disconnectedCallback() {
      clearTimeout(this.resetTimer);
      super.disconnectedCallback();
    }

    // El estado de exito vive en un atributo, no en clases sueltas: el CSS decide como se
    // ve (marca de verificacion, color) y el JavaScript solo dice que ha pasado.
    setCopied(copied) {
      this.toggleAttribute('data-copied', copied);
      if (this.label && this.dataset.copiedLabel) {
        this.label.textContent = copied ? this.dataset.copiedLabel : this.idleLabel;
      }
      // El anuncio va en una region viva aparte: cambiar solo la etiqueta del boton no se
      // lee en un lector de pantalla si el foco ya estaba en el.
      if (this.status) this.status.textContent = copied ? (this.dataset.copiedLabel || '') : '';
    }

    async copy() {
      try {
        await navigator.clipboard.writeText(this.source.textContent.trim());
      } catch {
        // Un portapapeles denegado no es un error que el comerciante pueda resolver: se
        // deja el texto como estaba y el fragmento sigue ahi para seleccionarlo a mano.
        return;
      }

      this.setCopied(true);

      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => this.setCopied(false), 2000);
    }
  }

  // ---------------------------------------------------------------------------
  // 4E-002. Filtro instantaneo de preguntas frecuentes.
  //
  // Mejora progresiva pura: el campo llega oculto por la utilidad js-only del tema, de
  // modo que sin JavaScript la pagina muestra todas las preguntas y no queda un buscador
  // que no busca. No navega, no recarga y no toca la URL.
  //
  // Se compara pregunta y respuesta, sin acentos ni mayusculas, porque quien escribe
  // "envio" espera encontrar "envío".
  // ---------------------------------------------------------------------------
  const foldText = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  class FaqFilter extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.input = this.querySelector('[data-filter-input]');
      this.status = this.querySelector('[data-filter-status]');
      this.empty = this.querySelector('[data-filter-empty]');
      this.groups = Array.from(document.querySelectorAll('[data-filter-group]'));
      this.items = this.groups.flatMap((group) => Array.from(group.querySelectorAll('details')));

      if (!this.input || !this.items.length) return;

      // El texto se indexa una vez: filtrar en cada pulsacion no deberia costar un
      // recorrido del DOM por pregunta.
      this.index = this.items.map((item) => ({
        item,
        text: foldText(item.textContent || ''),
      }));

      this.listen(this.input, 'input', () => this.schedule());
      // Escape limpia el campo sin sacar el foco de el, que es lo que espera cualquiera
      // que haya usado un buscador.
      this.listen(this.input, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.input.value) return;
        event.preventDefault();
        event.stopPropagation();
        this.input.value = '';
        this.apply();
      });
    }

    disconnectedCallback() {
      clearTimeout(this.debounce);
      super.disconnectedCallback();
    }

    schedule() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => this.apply(), 120);
    }

    apply() {
      const query = foldText(this.input.value.trim());

      if (!query) {
        this.index.forEach(({ item }) => { item.hidden = false; });
        this.groups.forEach((group) => { group.hidden = false; });
        if (this.empty) this.empty.hidden = true;
        if (this.status) this.status.textContent = '';
        return;
      }

      let matches = 0;
      this.index.forEach(({ item, text }) => {
        const hit = text.includes(query);
        item.hidden = !hit;
        if (hit) matches += 1;
      });

      // Una categoria sin resultados se retira entera: dejar su titulo colgando sobre una
      // lista vacia se lee como un fallo de la pagina.
      this.groups.forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll('details')).some((item) => !item.hidden);
      });

      if (this.empty) this.empty.hidden = matches > 0;
      if (this.status) {
        this.status.textContent = (this.dataset.filterCountTemplate || '')
          .replace('[count]', String(matches));
      }
    }
  }

  class PasswordModal extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-password-open]');
      this.overlay = this.querySelector('[data-password-overlay]');
      this.panel = this.querySelector('[data-password-panel]');
      this.closeButton = this.querySelector('[data-password-close]');
      this.passwordInput = this.querySelector('input[name="password"]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.closeButton) return;

      this.setClosedState();
      this.listen(this.trigger, 'click', () => this.open());
      this.listen(this.closeButton, 'click', () => this.close(true));
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });

      if (this.querySelector('[data-password-error]')) {
        // Without the guard, a section removed in the Theme Editor before this frame runs
        // still opens and leaves body[data-modal-open] set with no modal to close it.
        requestAnimationFrame(() => {
          if (this.isConnected) this.open(this.passwordInput);
        });
      }
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-modal', 'false');
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open(initialFocus = null) {
      if (this.isOpen) return;

      const returnTarget = document.activeElement;
      closeOtherDialogs(this);
      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-modal', 'true');
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      document.body.setAttribute('data-modal-open', '');
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(
        this.panel,
        initialFocus || this.passwordInput || this.closeButton,
      );
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel || !this.trigger) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this.overlay;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class LocalizationForm extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.form = this.querySelector('form');
      if (!this.form) return;

      this.listen(this.form, 'submit', () => {
        this.form.setAttribute('aria-busy', 'true');
      });

      this.querySelectorAll('[data-localization-select]').forEach((select) => {
        this.listen(select, 'change', () => this.submitForm());
      });
    }

    submitForm() {
      if (!this.form || this.form.getAttribute('aria-busy') === 'true') return;
      this.form.setAttribute('aria-busy', 'true');

      if (typeof this.form.requestSubmit === 'function') {
        this.form.requestSubmit();
      } else {
        this.form.submit();
      }
    }
  }

  class PredictiveSearch extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-predictive-search-open]');
      this.overlay = this.querySelector('[data-predictive-search-overlay]');
      this.panel = this.querySelector('[data-predictive-search-panel]');
      this.form = this.querySelector('[data-predictive-search-form]');
      this.input = this.querySelector('[data-predictive-search-input]');
      this.results = this.querySelector('[data-predictive-search-results]');
      this.status = this.querySelector('[data-predictive-search-status]');
      this.footer = this.querySelector('[data-predictive-search-footer]');
      this.clearButton = this.querySelector('[data-predictive-search-clear]');
      this.closeButton = this.querySelector('[data-predictive-search-close]');
      this.managedInertElements = [];
      this.options = [];
      this.activeIndex = -1;
      this.searchTimer = null;
      this.requestController = null;
      this.releaseFocusTrap = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.input || !this.results) return;

      this.setOpen(false);
      if (this.clearButton) this.clearButton.hidden = this.input.value.trim().length === 0;
      this.listen(this.trigger, 'click', () => this.setOpen(true));
      if (this.closeButton) {
        this.listen(this.closeButton, 'click', () => this.setOpen(false, true));
      }
      if (this.clearButton) {
        this.listen(this.clearButton, 'click', () => this.clearSearch());
      }
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.setOpen(false, true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.setOpen(false, true);
      });
      this.listen(this.input, 'input', () => this.handleInput());
      this.listen(this.input, 'keydown', (event) => this.handleInputKeydown(event));
      this.listen(this.results, 'pointermove', (event) => {
        const option = event.target.closest('[role="option"]');
        if (!option || !this.results.contains(option)) return;
        this.setActiveOption(this.options.indexOf(option));
      });
    }

    disconnectedCallback() {
      window.clearTimeout(this.searchTimer);
      this.requestController?.abort();
      this.setOpen(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.overlay || !this.panel || !this.input) return;

      if (open) closeOtherDialogs(this);
      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.setAttribute('aria-hidden', String(!open));
      this.panel.inert = !open;
      this.overlay.hidden = !open;
      this.toggleAttribute('data-open', open);
      syncDialogScrollLocks();

      if (open) {
        this.applyBackgroundInert();
        this.releaseFocusTrap = trapFocus(this.panel, this.input);
        this.updateComboboxState();
      } else {
        window.clearTimeout(this.searchTimer);
        this.requestController?.abort();
        this.requestController = null;
        this.releaseFocusTrap?.();
        this.releaseFocusTrap = null;
        this.restoreBackgroundInert();
        this.resetActiveOption();
        this.input.setAttribute('aria-expanded', 'false');
        if (restoreFocus && this.trigger.isConnected) this.trigger.focus();
      }
    }

    handleInput() {
      const query = this.input.value.trim();
      if (this.clearButton) this.clearButton.hidden = query.length === 0;
      this.clearFooter();
      window.clearTimeout(this.searchTimer);
      this.requestController?.abort();
      this.resetActiveOption();

      if (query.length < 2) {
        this.clearResults();
        return;
      }

      this.results.replaceChildren();
      this.results.hidden = true;
      this.results.setAttribute('aria-busy', 'true');
      this.input.setAttribute('aria-expanded', 'false');
      if (this.status) this.status.textContent = this.dataset.loadingText || '';
      this.searchTimer = window.setTimeout(() => this.fetchResults(query), 200);
    }

    async fetchResults(query) {
      this.requestController?.abort();
      const requestController = new AbortController();
      this.requestController = requestController;

      try {
        const endpoint = new URL(this.dataset.predictiveSearchUrl, window.location.origin);
        endpoint.pathname = `${endpoint.pathname.replace(/\/$/, '')}.json`;
        endpoint.searchParams.set('q', query);
        endpoint.searchParams.set('resources[type]', 'product,collection,page,article');
        endpoint.searchParams.set('resources[limit]', '8');
        endpoint.searchParams.set('resources[limit_scope]', 'all');
        endpoint.searchParams.set('resources[options][unavailable_products]', 'last');

        const response = await fetch(endpoint.toString(), {
          headers: { Accept: 'application/json' },
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);

        const payload = await response.json();
        if (this.input.value.trim() !== query) return;
        this.renderResults(payload.resources?.results || {}, query);
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (this.input.value.trim() === query) this.renderResults({}, query);
      } finally {
        if (this.requestController === requestController && this.input.value.trim() === query) {
          this.results.setAttribute('aria-busy', 'false');
          this.requestController = null;
        }
      }
    }

    renderResults(resultGroups, query) {
      const fragment = document.createDocumentFragment();
      let optionIndex = 0;
      let resultCount = 0;
      const groups = [
        ['products', this.dataset.productsHeading],
        ['collections', this.dataset.collectionsHeading],
        ['articles', this.dataset.articlesHeading],
        ['pages', this.dataset.pagesHeading],
      ];

      groups.forEach(([type, heading]) => {
        const items = Array.isArray(resultGroups[type]) ? resultGroups[type] : [];
        if (items.length === 0) return;

        const group = document.createElement('section');
        const headingElement = document.createElement('h2');
        const list = document.createElement('div');
        const headingId = `${this.results.id}-${type}-heading`;
        group.className = `predictive-search__group predictive-search__group--${type}`;
        group.setAttribute('role', 'group');
        group.setAttribute('aria-labelledby', headingId);
        headingElement.id = headingId;
        headingElement.className = 'predictive-search__group-title eyebrow';
        // Dentro de un listbox solo caben option y group: el titulo nombra el grupo por
        // aria-labelledby y no expone su propio rol (WAI-ARIA 1.2, 6A-001).
        headingElement.setAttribute('role', 'presentation');
        headingElement.textContent = heading || '';
        list.className = 'predictive-search__list';

        items.forEach((item) => {
          const option = type === 'products'
            ? this.createProductResult(item)
            : this.createTextResult(item, heading);
          option.id = `${this.results.id}-option-${optionIndex}`;
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', 'false');
          option.tabIndex = -1;
          list.append(option);
          optionIndex += 1;
          resultCount += 1;
        });

        group.append(headingElement, list);
        fragment.append(group);
      });

      // El estado vacio y "Ver todos" no son opciones: van al pie del panel, fuera del
      // listbox, para que este solo contenga option y group (axe aria-required-children).
      const footer = document.createDocumentFragment();
      if (resultCount === 0) {
        const empty = document.createElement('p');
        empty.className = 'predictive-search__empty';
        empty.textContent = this.dataset.noResultsText || '';
        footer.append(empty);
      }

      const viewAll = document.createElement('a');
      viewAll.className = 'predictive-search__view-all button button--secondary';
      viewAll.href = this.createSearchUrl(query);
      viewAll.textContent = (this.dataset.viewAllTemplate || '').replace('[terms]', query);
      footer.append(viewAll);

      this.results.replaceChildren(fragment);
      if (this.footer) {
        this.footer.replaceChildren(footer);
        this.footer.hidden = false;
        this.results.hidden = resultCount === 0;
      } else {
        this.results.append(footer);
        this.results.hidden = false;
      }
      this.options = Array.from(this.results.querySelectorAll('[role="option"]'));
      this.activeIndex = -1;
      this.updateComboboxState();
      if (this.status) this.status.textContent = this.getResultsCountText(resultCount);
    }

    createProductResult(product) {
      const link = this.createResultLink(product.url, 'predictive-search__result predictive-search__result--product');
      const media = document.createElement('span');
      const imageUrl = product.featured_image?.url || product.image;
      media.className = 'predictive-search__media';

      if (imageUrl) {
        const image = document.createElement('img');
        // La API de sugerencias devuelve la URL del original (1800 px o mas). El CDN de
        // Shopify sirve cualquier ancho con ?width=: se piden las densidades 1x, 2x y 3x
        // de una miniatura de 72 px en vez de descargar el original entero (4F-001).
        const sizedUrl = (width) => {
          try {
            const url = new URL(imageUrl, window.location.origin);
            url.searchParams.set('width', String(width));
            return url.toString();
          } catch {
            return imageUrl;
          }
        };
        image.src = sizedUrl(144);
        image.srcset = [72, 144, 216].map((width) => `${sizedUrl(width)} ${width}w`).join(', ');
        image.sizes = '72px';
        image.alt = product.featured_image?.alt || '';
        image.loading = 'lazy';
        image.width = 72;
        image.height = 90;
        media.append(image);
      }

      const details = document.createElement('span');
      const title = document.createElement('span');
      const priceRow = document.createElement('span');
      const currentPrice = Number.parseFloat(product.price);
      const compareAtPrice = Number.parseFloat(product.compare_at_price_min || product.compare_at_price_max || 0);
      details.className = 'predictive-search__details';
      title.className = 'predictive-search__result-title';
      title.textContent = product.title || '';
      priceRow.className = 'predictive-search__price';

      // aria-label no esta permitido en <s> (rol deletion) y el precio rebajado no tenia
      // etiqueta: se anuncian con texto oculto, igual que price.liquid tras af6ee6d (6A-001).
      const onSale = Number.isFinite(compareAtPrice) && compareAtPrice > currentPrice;
      const srLabel = (text) => {
        const label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = `${text} `;
        return label;
      };
      if (Number.isFinite(currentPrice)) {
        const price = document.createElement('span');
        if (onSale && this.dataset.salePriceText) price.append(srLabel(this.dataset.salePriceText));
        price.append(formatMoney(Math.round(currentPrice * 100), this.dataset.moneyFormat));
        priceRow.append(price);
      }
      if (onSale) {
        const regularPrice = document.createElement('s');
        if (this.dataset.regularPriceText) regularPrice.append(srLabel(this.dataset.regularPriceText));
        regularPrice.append(formatMoney(Math.round(compareAtPrice * 100), this.dataset.moneyFormat));
        priceRow.append(regularPrice);
      }

      const availability = document.createElement('span');
      availability.className = 'predictive-search__availability';
      availability.toggleAttribute('data-sold-out', product.available === false);
      availability.textContent = product.available === false
        ? this.dataset.soldOutText || ''
        : this.dataset.inStockText || '';
      details.append(title, priceRow, availability);
      link.append(media, details);
      return link;
    }

    createTextResult(item, heading) {
      const link = this.createResultLink(item.url, 'predictive-search__result predictive-search__result--text');
      const typeLabel = document.createElement('span');
      const title = document.createElement('span');
      typeLabel.className = 'predictive-search__result-type eyebrow';
      typeLabel.textContent = heading || '';
      title.className = 'predictive-search__result-title';
      title.textContent = item.title || '';
      link.append(typeLabel, title);
      return link;
    }

    createResultLink(url, className) {
      const link = document.createElement('a');
      link.className = className;
      try {
        const resultUrl = new URL(url, window.location.origin);
        link.href = resultUrl.origin === window.location.origin ? resultUrl.href : this.dataset.searchUrl;
      } catch (_error) {
        link.href = this.dataset.searchUrl;
      }
      return link;
    }

    createSearchUrl(query) {
      const url = new URL(this.dataset.searchUrl, window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('type', 'product,collection,page,article');
      url.searchParams.set('options[prefix]', 'last');
      return url.toString();
    }

    getResultsCountText(count) {
      if (count === 1) return this.dataset.resultsCountOne || '';
      return (this.dataset.resultsCountOther || '').replace('[count]', String(count));
    }

    handleInputKeydown(event) {
      if (event.isComposing || this.options.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.setActiveOption(this.activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.setActiveOption(this.activeIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.setActiveOption(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        this.setActiveOption(this.options.length - 1);
      } else if (event.key === 'Enter' && this.activeIndex >= 0) {
        event.preventDefault();
        this.options[this.activeIndex].click();
      }
    }

    setActiveOption(index) {
      if (this.options.length === 0 || index < 0) index = this.options.length - 1;
      if (index >= this.options.length) index = 0;

      this.options.forEach((option, optionIndex) => {
        option.setAttribute('aria-selected', String(optionIndex === index));
      });
      this.activeIndex = index;
      const activeOption = this.options[index];
      if (!activeOption) return;
      this.input.setAttribute('aria-activedescendant', activeOption.id);
      activeOption.scrollIntoView({ block: 'nearest' });
    }

    resetActiveOption() {
      this.options.forEach((option) => option.setAttribute('aria-selected', 'false'));
      this.options = [];
      this.activeIndex = -1;
      this.input?.removeAttribute('aria-activedescendant');
    }

    updateComboboxState() {
      if (!this.input) return;
      this.input.setAttribute('aria-expanded', String(this.isOpen && !this.results.hidden));
    }

    clearSearch() {
      this.input.value = '';
      if (this.clearButton) this.clearButton.hidden = true;
      this.requestController?.abort();
      window.clearTimeout(this.searchTimer);
      this.clearResults();
      this.input.focus();
    }

    clearResults() {
      this.resetActiveOption();
      this.results.replaceChildren();
      this.results.hidden = true;
      this.results.setAttribute('aria-busy', 'false');
      this.input.setAttribute('aria-expanded', 'false');
      if (this.status) this.status.textContent = '';
      this.clearFooter();
    }

    clearFooter() {
      if (!this.footer) return;
      this.footer.replaceChildren();
      this.footer.hidden = true;
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;
        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });
        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reflectReducedMotion = ({ matches }) => {
    if (matches) {
      document.documentElement.dataset.reducedMotion = 'true';
    } else {
      delete document.documentElement.dataset.reducedMotion;
    }
  };

  reflectReducedMotion(reducedMotionQuery);
  reducedMotionQuery.addEventListener?.('change', reflectReducedMotion);

  // 5B-001. product-zoom.js se carga aparte, solo en la ficha, y extiende estas piezas en
  // vez de copiarlas.
  window.ThemeCore = {
    initialized: true,
    ThemeElement,
    trapFocus,
    getFocusableElements,
    syncDialogScrollLocks,
  };

  if (!customElements.get('theme-disclosure')) {
    customElements.define('theme-disclosure', ThemeDisclosure);
  }

  if (!customElements.get('theme-drawer')) {
    customElements.define('theme-drawer', ThemeDrawer);
  }

  if (!customElements.get('variant-selects')) {
    customElements.define('variant-selects', VariantSelects);
  }

  if (!customElements.get('product-inventory')) {
    customElements.define('product-inventory', ProductInventory);
  }

  rememberViewedProduct();
  if (!customElements.get('recently-viewed')) {
    customElements.define('recently-viewed', RecentlyViewed);
  }

  if (!customElements.get('product-gallery')) {
    customElements.define('product-gallery', ProductGallery);
  }

  if (!customElements.get('sticky-cart-bar')) {
    customElements.define('sticky-cart-bar', StickyCartBar);
  }

  if (!customElements.get('size-guide-modal')) {
    customElements.define('size-guide-modal', SizeGuideModal);
  }

  if (!customElements.get('gift-card-recipient')) {
    customElements.define('gift-card-recipient', GiftCardRecipient);
  }

  if (!customElements.get('pickup-availability')) {
    customElements.define('pickup-availability', PickupAvailability);
  }

  if (!customElements.get('product-recommendations')) {
    customElements.define('product-recommendations', ProductRecommendations);
  }

  if (!customElements.get('cart-drawer')) {
    customElements.define('cart-drawer', CartDrawer);
  }

  if (!customElements.get('product-card-variants')) {
    customElements.define('product-card-variants', ProductCardVariants);
  }

  if (!customElements.get('facet-filters-form')) {
    customElements.define('facet-filters-form', FacetFiltersForm);
  }

  if (!customElements.get('editorial-lookbook')) {
    customElements.define('editorial-lookbook', EditorialLookbook);
  }

  if (!customElements.get('editorial-hero')) {
    customElements.define('editorial-hero', EditorialHero);
  }

  if (!customElements.get('complete-the-look')) {
    customElements.define('complete-the-look', CompleteTheLook);
  }

  if (!customElements.get('curated-showcase')) {
    customElements.define('curated-showcase', CuratedShowcase);
  }

  if (!customElements.get('marquee-banner')) {
    customElements.define('marquee-banner', MarqueeBanner);
  }

  if (!customElements.get('announcement-bar')) {
    customElements.define('announcement-bar', AnnouncementBar);
  }

  if (!customElements.get('faq-accordion')) {
    customElements.define('faq-accordion', FaqAccordion);
  }

  if (!customElements.get('anchor-nav')) {
    customElements.define('anchor-nav', AnchorNav);
  }

  if (!customElements.get('copy-text')) {
    customElements.define('copy-text', CopyText);
  }

  if (!customElements.get('faq-filter')) {
    customElements.define('faq-filter', FaqFilter);
  }

  if (!customElements.get('password-modal')) {
    customElements.define('password-modal', PasswordModal);
  }

  if (!customElements.get('localization-form')) {
    customElements.define('localization-form', LocalizationForm);
  }

  if (!customElements.get('predictive-search')) {
    customElements.define('predictive-search', PredictiveSearch);
  }

  // ---------------------------------------------------------------------------
  // B2. Motor de scroll reveal.
  //
  // Regla de oro: el contenido nace visible. El CSS solo oculta un elemento pendiente
  // cuando <html> lleva data-reveal-ready, y ese atributo lo pone este codigo unicamente
  // si hay IntersectionObserver, el comerciante no eligio animations: none y el visitante
  // no pidio reducir movimiento. Sin JS, con JS roto o en cualquiera de esos tres casos,
  // la tienda se lee entera y no queda un solo elemento escondido.
  //
  // MOTION-002. Este codigo NO sabe que motor anima, y no debe saberlo. Solo reparte
  // coreografia: marca con data-reveal="" lo que todavia tiene que entrar, publica su
  // --reveal-index, pone data-revealed al cruzar la linea de entrada y cierra con
  // data-reveal="done" cuando el gesto termino. Si anima la animacion CSS scroll-driven
  // o la transicion del fallback lo decide la cascada de base.css, y solo ella: duplicar
  // esa decision en dos lenguajes es exactamente lo que esta migracion elimino.
  //
  // El hero editorial no entra nunca: es el LCP, y animarlo cuesta la puntuacion de
  // rendimiento que la revision de Theme Store mira primero.
  // ---------------------------------------------------------------------------
  const REVEAL_TARGETS = [
    // Encabezados de seccion del homepage. Van primero porque intersectan antes que sus
    // rejillas, asi que el titulo anuncia y las tarjetas responden. Los encabezados de
    // pagina (colección, busqueda, blog, listado) se dejan fuera a proposito: son el h1
    // y estan sobre el pliegue; esconderlos aunque sea 680ms es retrasar contenido primario.
    '.lookbook__header',
    '.curated-showcase__header',
    '.complete-the-look__header',
    '.bento-discovery__header',
    '.product-recommendations__header',
    '.brand-manifesto__statement',
    // Contenido
    '.product-grid__item',
    '.bento-discovery__item',
    '.brand-manifesto__detail',
    '.brand-manifesto__media',
    '.complete-the-look__item',
    '.complete-the-look__media',
    '.curated-showcase__spotlight',
    '.lookbook__media',
    // MOTION-002/T2. Antes decia '.newsletter-section .newsletter__inner', una clase que no
    // existe en ninguna seccion ni snippet del tema: el envoltorio real de newsletter.liquid
    // es .newsletter-section__inner. El selector muerto dejaba la seccion sin entrada.
    '.newsletter-section__inner',
    // 4E-002. Historia de marca. Entra el TEXTO del panel, nunca su imagen: en esa pagina
    // la fotografia del primer bloque es el LCP, y esconderla aunque sea medio segundo es
    // exactamente lo que la regla de oro de 4D-001 prohibe.
    '.main-about__story-text',
    '.main-about__quote',
    '.main-about__value',
    '.main-about__gallery-item',
  ].join(', ');

  // Tope del escalonado. Sin el, una rejilla de 40 productos tardaria mas de dos segundos
  // en terminar de entrar y el escalonado dejaria de leerse como ritmo.
  const REVEAL_STAGGER_CAP = 7;

  // Suelo de la linea de asentamiento, en % del viewport. Si los tokens alargan el recorrido
  // mas alla de lo que cabe (distancia + 7 escalones >= 94), la linea cae a 0 o menos: el
  // rootMargin del observador de asentamiento llega a -100%, su caja raiz colapsa y no
  // dispara nunca, asi que nada se asentaria y cada elemento se desharia al volver a subir.
  // 10% deja una banda de 70-100 px: la cruza hasta el objetivo mas bajo en un fling a 60
  // fps y queda lejos del colapso. Un recorrido que no cabe se corta ahi, y la transicion
  // de B2 lo termina en fundido: el peor caso es un cierre suave, no un elemento perdido.
  const SETTLE_LINE_MIN = 10;

  const initScrollReveal = () => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    if (root.dataset.animations === 'none') return;
    if (reducedMotionQuery.matches) return;

    root.dataset.revealReady = 'true';

    // Las dos lineas de observacion salen de los tokens de base.css, que son su unica
    // fuente: aqui no se repite ni un numero de diseno. La de asentamiento cae donde
    // termina el rango mas largo que puede recorrer un elemento (distancia + tope de
    // escalonado), asi que asentar nunca corta un gesto en curso. Con los valores por
    // defecto: 100 - 6 - (32 + 7 x 4) = 34.
    const tokens = getComputedStyle(root);
    const token = (name, fallback) => {
      const value = parseFloat(tokens.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };
    const enterInset = token('--scroll-enter-inset', 6);
    const revealRange = token('--scroll-reveal-distance', 32)
      + REVEAL_STAGGER_CAP * token('--scroll-reveal-stagger', 4);
    const settleLine = Math.max(SETTLE_LINE_MIN, 100 - enterInset - revealRange);

    const pending = () => document.querySelectorAll('[data-reveal=""]');

    // Asentar es cerrar: el elemento queda fijo, visible, y sale de los dos observadores.
    // Se mueve opacity, nunca visibility, para no alterar el arbol de accesibilidad ni el
    // orden de tabulacion mientras el gesto corre.
    const settle = (node) => {
      node.dataset.reveal = 'done';
      node.setAttribute('data-revealed', '');
      enter.unobserve(node);
      settler.unobserve(node);
    };

    // Fin de recorrido: no queda scroll por delante. Lo cumplen la pagina que no scrollea
    // (plantilla corta, vista previa del editor, estado vacio) y el visitante que toco el
    // final. Ahi ningun scroll vendra a revelar nada: el timeline de vista esta inactivo (o
    // ya no avanza) y el respaldo necesita que el elemento cruce la linea.
    //
    // Se mide contra offsetHeight (alto de LAYOUT de <html>) y no contra scrollHeight: el
    // estado oculto desplaza cada pendiente hacia abajo con translateY, y cuando el pendiente
    // es lo ultimo de la pagina ese desplazamiento desborda el documento y fabrica hasta
    // 64 px de scroll que no existian (medido: 732 px de layout, 785 de scrollHeight). Con
    // scrollHeight la pagina corta pareceria scrollear por culpa del elemento que se intenta
    // rescatar y no se asentaria nunca. En una pagina con pie, ambas medidas coinciden.
    // Tres lecturas numericas; el DOM solo se consulta cuando es verdad.
    const atEnd = () => window.innerHeight + window.scrollY >= root.offsetHeight - 2;
    const settlePending = () => {
      if (!atEnd()) return;
      pending().forEach((node) => settle(node));
    };

    // Linea de entrada. Decora SOLO lo que no se ve todavia: lo que queda por debajo del
    // pliegue, o lo que no tiene caja (un panel de pestana con display: none, que entrara
    // cuando el visitante lo abra). Lo visible se suelta sin tocarlo, asi que no se oculta
    // ni un fotograma. Lo ya decorado recibe data-revealed en cuanto entra.
    const enter = new IntersectionObserver((entries) => {
      // Una lectura por lote y ANTES de escribir atributos: el observador acaba de medir,
      // asi que el layout esta limpio y offsetHeight no fuerza nada. En una pagina que no
      // scrollea la franja de entrada ES la vista: lo que caiga ahi se suelta sin decorar,
      // como lo visible. Decorarlo y asentarlo despues ya seria tarde: data-reveal="" no se
      // cumple sin scroll, y el opacity: 0 de B2 dejaria el elemento invisible en pantalla.
      const ended = atEnd();

      entries.forEach((entry) => {
        const node = entry.target;

        if (entry.isIntersecting) {
          if (node.dataset.reveal === '') node.setAttribute('data-revealed', '');
          enter.unobserve(node);
          return;
        }

        if (node.hasAttribute('data-reveal')) return;

        const box = entry.boundingClientRect;
        const below = box.top >= (entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight);
        const unlaid = box.width === 0 && box.height === 0;
        if ((!below && !unlaid) || ended) {
          enter.unobserve(node);
          return;
        }

        node.setAttribute('data-reveal', '');
        settler.observe(node);
      });
    }, {
      // El inset del token: el elemento arranca cuando de verdad entra en el campo visual,
      // sin anticiparse desde fuera del pliegue. 0.05: basta un asomo para disparar, asi
      // que un elemento alto no espera a estar medio visible.
      rootMargin: `0px 0px -${enterInset}% 0px`,
      threshold: 0.05,
    });

    // Linea de asentamiento: la coreografia termino y el elemento queda fijo. Una sola vez.
    const settler = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.dataset.reveal === '') settle(entry.target);
      });
    }, {
      rootMargin: `0px 0px -${100 - settleLine}% 0px`,
      threshold: 0,
    });

    const register = (scope) => {
      const seen = new Map();

      scope.querySelectorAll(REVEAL_TARGETS).forEach((node) => {
        // Ojo: este guardia hace que un data-reveal escrito a mano en el Liquid NO llegue
        // nunca al observador, y el CSS lo dejaria oculto para siempre. Los objetivos se
        // declaran arriba, en REVEAL_TARGETS, no en las secciones. El hero editorial queda
        // fuera del reveal generico: tiene su propia entrada, sin atributos.
        if (node.hasAttribute('data-reveal') || node.closest('.hero-editorial')) return;

        // El indice se cuenta entre hermanos, para que cada rejilla escalone por su cuenta
        // en vez de heredar el conteo de la seccion anterior.
        const parent = node.parentElement;
        const index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);

        node.style.setProperty('--reveal-index', String(Math.min(index, REVEAL_STAGGER_CAP)));
        enter.observe(node);
      });
    };

    // WCAG 2.4.7 y 2.4.11: el foco no puede aterrizar en algo a medio revelar. Se asienta
    // el contenedor del foco y tambien lo que lo tape, porque los disparadores de hotspot
    // del lookbook son HERMANOS de .lookbook__media, no hijos: sin la prueba de cajas
    // solapadas un hotspot enfocado flotaria sobre una foto todavia recortada.
    document.addEventListener('focusin', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const rect = target.getBoundingClientRect();

      pending().forEach((node) => {
        if (node.contains(target)) {
          settle(node);
          return;
        }

        // Lo que CONTIENE al foco se descarta: el skip link enfoca <main>, y asentar su
        // contenedor revelaria la pagina entera de golpe.
        if (target.contains(node)) return;

        const box = node.getBoundingClientRect();
        const overlaps = box.top < rect.bottom
          && box.bottom > rect.top
          && box.left < rect.right
          && box.right > rect.left;
        if (overlaps) settle(node);
      });
    });

    // Guardia de fin de pagina. En una pagina corta el rango puede no completarse nunca y
    // el elemento se quedaria a medio camino: al tocar el final se asienta lo pendiente.
    window.addEventListener('scroll', settlePending, { passive: true });

    // La misma guardia cuando cambia la geometria, porque el scroll no llega si la pagina
    // dejo de scrollear: el editor de temas conmuta el viewport, el movil rota, el editor
    // quita una seccion. Se observa <html> y no window: su caja sigue al viewport cuando
    // la pagina es corta (min-height: 100% en base.css) y al contenido cuando es larga,
    // asi que una sola observacion cubre los dos lados que deciden si hay recorrido. El
    // callback corre tras el layout, de modo que offsetHeight no fuerza nada. Lo que se
    // asienta aqui venia oculto bajo el pliegue: aparece en fundido, nunca parpadea.
    if ('ResizeObserver' in window) {
      new ResizeObserver(settlePending).observe(root);
    } else {
      window.addEventListener('resize', settlePending, { passive: true });
    }

    register(document);
    // El editor de temas reemplaza secciones enteras: lo que entra tambien debe entrar, y
    // lo que sale deja de observarse para no retener nodos ya descartados.
    document.addEventListener('shopify:section:load', (event) => register(event.target));
    document.addEventListener('shopify:section:unload', (event) => {
      event.target.querySelectorAll('[data-reveal]').forEach((node) => {
        enter.unobserve(node);
        settler.unobserve(node);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // B7. Cabecera condensada al bajar. Solo escribe cuando el estado cambia, asi que el
  // listener pasivo no toca el DOM en la inmensa mayoria de los eventos de scroll.
  //
  // 4F-001. La cabecera es sticky (lo declara header.liquid sobre su seccion). Aqui se
  // publica ademas su altura real en --header-offset, que usan scroll-padding (anclas y
  // foco por teclado nunca quedan debajo de la cabecera, WCAG 2.4.11) y las columnas
  // sticky de ficha, coleccion y documentacion. Si la seccion no es sticky (sin soporte
  // o sin JS) el desplazamiento es 0 y nada cambia de sitio.
  // ---------------------------------------------------------------------------
  const initHeaderScrollState = () => {
    let header = null;
    let scrolled = null;
    let offset = null;

    const sync = () => {
      const next = window.scrollY > 40;
      if (!header || next === scrolled) return;
      scrolled = next;
      header.toggleAttribute('data-header-scrolled', next);
    };

    const publishOffset = () => {
      const stickyBox = header?.parentElement;
      const isSticky = stickyBox && getComputedStyle(stickyBox).position === 'sticky';
      const next = isSticky ? Math.round(stickyBox.getBoundingClientRect().height) : 0;
      if (next === offset) return;
      offset = next;
      document.documentElement.style.setProperty('--header-offset', `${next}px`);
    };

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(publishOffset) : null;

    const bind = () => {
      resizeObserver?.disconnect();
      header = document.querySelector('.site-header');
      scrolled = null;
      if (!header) return;
      if (header.parentElement) resizeObserver?.observe(header.parentElement);
      publishOffset();
      sync();
    };

    bind();
    window.addEventListener('scroll', sync, { passive: true });
    if (!resizeObserver) window.addEventListener('resize', publishOffset, { passive: true });
    // El editor de temas reemplaza la seccion entera al cambiar un ajuste: sin volver a
    // enlazar, el atributo y la medida se aplicarian a un nodo que ya no esta en la pagina.
    document.addEventListener('shopify:section:load', (event) => {
      if (event.target.querySelector?.('.site-header')) bind();
    });
  };

  // ---------------------------------------------------------------------------
  // 4D-002. Stepper de cantidad (menos / mas) del carrito.
  //
  // Delegado en document, no atado a cada boton: el cajon reemplaza su contenido
  // entero en cada mutacion, asi que no hay nodo al que atar un listener que
  // sobreviva al re-render.
  //
  // El boton NO llama a changeLine: escribe el valor y emite un 'change' sobre el
  // campo, que es exactamente lo que hace un visitante al teclear. De ahi en
  // adelante manda el camino ya endurecido y una sola implementacion sirve a las
  // dos superficies:
  //   - En el cajon lo recoge handleDrawerChange -> validacion -> changeLine(),
  //     con la revision por mutacion de 4D-001 que descarta respuestas superadas.
  //   - En la pagina de carrito, que es un formulario sin JavaScript, el campo
  //     queda editado a la espera de "Update cart", igual que si se hubiera escrito.
  // ---------------------------------------------------------------------------
  const readQuantityRules = (input) => {
    const step = Math.abs(Number(input.getAttribute('step'))) || 1;
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));
    return {
      step,
      min: Number.isFinite(min) ? min : 0,
      max: input.getAttribute('max') === null || !Number.isFinite(max) ? Infinity : max,
    };
  };

  // Shopify no acepta cualquier entero: los valores validos son min + n * incremento.
  // Un campo con min 2 e incremento 2 no puede pasar por 5, asi que el boton se mueve
  // por esa rejilla en lugar de sumar y restar a ciegas. Con floor al subir y ceil al
  // bajar, un valor fuera de rejilla (tecleado a mano) cae al escalon correcto.
  const nextQuantity = (input, direction) => {
    const { step, min, max } = readQuantityRules(input);
    const current = Number(input.value);
    const base = Number.isFinite(current) ? current : min;
    const offset = (base - min) / step;
    const index = direction > 0 ? Math.floor(offset) : Math.ceil(offset);
    return Math.min(max, Math.max(min, min + (index + direction) * step));
  };

  // Un boton se apaga exactamente cuando pulsarlo no cambiaria nada. Comparar contra el
  // salto real, y no contra min o max sueltos, es lo que mantiene el estado coherente
  // tambien cuando el valor esta fuera de la rejilla.
  const syncQuantityStepper = (stepper) => {
    const input = stepper.querySelector('[data-quantity-input]');
    if (!input) return;

    const { min } = readQuantityRules(input);
    const current = Number(input.value);
    const value = Number.isFinite(current) ? current : min;

    stepper.querySelectorAll('[data-quantity-button]').forEach((button) => {
      const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
      button.disabled = nextQuantity(input, direction) === value;
    });
  };

  const initQuantitySteppers = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-quantity-button]');
      if (!button || button.disabled) return;

      const stepper = button.closest('[data-quantity-stepper]');
      const input = stepper?.querySelector('[data-quantity-input]');
      if (!input) return;

      const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
      const next = nextQuantity(input, direction);
      if (String(next) === input.value) return;

      // Se anota ANTES de sincronizar: al deshabilitar un elemento enfocado el navegador
      // lo desenfoca en el acto, asi que despues ya no hay forma de saber si el foco
      // estaba aqui. Este orden lo descubrio la prueba del minimo, no la lectura.
      const hadFocus = document.activeElement === button;

      input.value = String(next);
      syncQuantityStepper(stepper);

      // Si el boton recien pulsado toca el limite y se apaga, el foco caeria al body:
      // se pasa al hermano, que es el unico movimiento que le queda al teclado.
      if (hadFocus && button.disabled) {
        stepper.querySelector('[data-quantity-button]:not([disabled])')?.focus();
      }

      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // El servidor ya emite el estado correcto en cada render; esto cubre lo que el
    // servidor no ve: el numero que el visitante escribe a mano ('input') y, en la ficha
    // de producto, la rejilla de cantidades que cambia al elegir otra variante ('change',
    // emitido por updateQuantityRules).
    ['input', 'change'].forEach((type) => {
      document.addEventListener(type, (event) => {
        const input = event.target.closest?.('[data-quantity-input]');
        if (input && type === 'change') {
          const { min, max } = readQuantityRules(input);
          const current = Number(input.value);
          if (Number.isFinite(current)) {
            if (current > max) input.value = String(max);
            else if (current < min) input.value = String(min);
          }
        }
        const stepper = event.target.closest?.('[data-quantity-stepper]');
        if (stepper) syncQuantityStepper(stepper);
      });
    });

    document.querySelectorAll('[data-quantity-stepper]').forEach(syncQuantityStepper);
  };

  // ---------------------------------------------------------------------------
  // 4E-001. Foco en el resultado de un formulario recien enviado.
  //
  // Los formularios nativos de Shopify (contacto, soporte, comentarios, contrasena)
  // recargan la pagina entera al enviarse. El foco vuelve al principio del documento y la
  // region viva no anuncia nada, porque no cambia despues de cargar: el visitante no oye
  // ni ve el resultado de lo que acaba de enviar. El markup ya traia tabindex="-1" en
  // esos mensajes desde su primera version, esperando justo esto.
  // ---------------------------------------------------------------------------
  const initFormMessageFocus = () => {
    const message = document.querySelector('.form-message[tabindex="-1"]');
    if (!message) return;

    // Un frame de margen: el foco se mueve cuando la pagina ya esta compuesta, no a mitad
    // del primer pintado, que es cuando el navegador todavia puede reajustar el scroll.
    requestAnimationFrame(() => {
      if (message.isConnected) message.focus();
    });
  };

  // La regla @view-transition de base.css solo tiene sentido entre paginas del tema.
  // Hacia el checkout, que no participa, el navegador aborta la transicion y deja un
  // InvalidStateError sin capturar en la consola del destino.
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    const url = event.activation?.entry?.url;
    const path = url ? new URL(url).pathname : '';
    if (!url || /^\/(checkouts?|cart\/c)\//.test(path)) event.viewTransition.skipTransition();
  });

  initScrollReveal();
  initHeaderScrollState();
  initQuantitySteppers();
  initFormMessageFocus();
})();
```

---

### <a id="assets-product-zoom-js"></a> assets/product-zoom.js

> **Descripcion:** Motor de zoom de producto accesible y tactil
> **Ruta:** `assets/product-zoom.js` | **Lineas:** 303 | **Tamano:** 12.23 KB

```javascript
/* 5B-001. Zoom de la ficha: <dialog>, Pointer Events y teclado. */
if (window.ThemeCore && !customElements.get('product-zoom')) customElements.define('product-zoom', class extends window.ThemeCore.ThemeElement {
  clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  pointers = new Map();
  gap = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  mid = (a, b) => this.point({ clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 });

  connectedCallback() {
    this.startListening();
    const find = (name) => this.querySelector(`[data-zoom-${name}]`);
    [this.dialog, this.track, this.output, this.counter, this.inButton, this.outButton, this.resetButton, this.closeButton] =
      'dialog track status counter in out reset close'.split(' ').map(find);
    this.section = this.closest('[data-section-id]');
    this.slides = [...this.querySelectorAll('[data-zoom-slide]')];
    this.steps = [...this.querySelectorAll('[data-zoom-step]')];
    if (!this.section || !this.slides.length) return;
    this.resetView();

    const on = (...args) => this.listen(...args);
    on(this.section, 'click', (event) => {
      const trigger = event.target.closest('[data-zoom-open]');
      if (trigger) this.open(+trigger.dataset.zoomOpen || 0, trigger);
    });
    on(this.closeButton, 'click', () => this.dialog.close());
    [[this.inButton, 1.5], [this.outButton, 2 / 3], [this.resetButton, 0]].forEach(([button, factor]) => on(button, 'click', () => this.zoomTo(this.scale * factor)));
    this.steps.forEach((step) => on(step, 'click', () => this.goTo(this.index + Number(step.dataset.zoomStep))));
    on(this.dialog, 'keydown', (event) => this.handleKey(event));
    on(this.dialog, 'close', () => this.handleClose());
    let frame = 0;
    on(this.track, 'scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this.select(this.clamp(Math.round(Math.abs(this.track.scrollLeft) / (this.track.clientWidth || 1)), 0, this.slides.length - 1)));
    });
    ['down', 'move', 'up', 'cancel'].forEach((type) => on(this.track, `pointer${type}`, (event) => this.handlePointer(event)));
    // Dos dedos a 1x: si no, el navegador lo toma como pan-x.
    on(this.track, 'touchmove', (event) => {
      if (event.touches.length > 1 || this.scale > 1) event.preventDefault();
    }, { passive: false });
    on(window, 'resize', () => this.dialog.open && this.layout());
  }

  // A360-11. El evento close llega despues de abortar los listeners: se limpia aqui.
  disconnectedCallback() {
    if (this.dialog?.open) {
      this.dialog.close();
      this.handleClose();
    }
    super.disconnectedCallback();
  }

  open(index, trigger) {
    if (this.dialog.open) return;
    this.opener = trigger;
    this.dialog.showModal();
    this.lock(true);
    this.rtl = getComputedStyle(this.track).direction === 'rtl';
    this.releaseFocus = window.ThemeCore.trapFocus(this.dialog, this.closeButton);
    this.index = -1;
    this.layout();
    this.goTo(index, false);
  }

  lock(open) {
    this.toggleAttribute('data-open', open);
    window.ThemeCore.syncDialogScrollLocks();
  }

  handleClose() {
    this.releaseFocus?.();
    clearTimeout(this.tapTimer);
    this.pointers.clear();
    this.start = this.pinch = null;
    this.resetView();
    this.lock(false);
    this.opener?.focus();
  }

  layout() {
    const { clientWidth: width, clientHeight: height } = this.track;
    this.fits = this.slides.map((slide) => {
      const img = slide.querySelector('img');
      const natural = +img.dataset.width || 1;
      const ratio = +img.dataset.ratio || 1;
      const fit = Math.min(width, height * ratio, natural);
      img.style.width = `${fit}px`;
      img.style.height = `${fit / ratio}px`;
      return { img, width: fit, height: fit / ratio, max: Math.min(3, natural / fit) };
    });
    if (this.index < 0) return;
    this.fit = this.fits[this.index];
    const previous = this.scale;
    this.scale = Math.min(previous, Math.max(1, this.fit.max));
    this.track.scrollLeft = this.offsetOf(this.index);
    this.apply();
    // P2-01: anuncia el zoom reajustado.
    if (this.dialog.open && Math.round(this.scale * 100) !== Math.round(previous * 100)) this.announce();
  }

  offsetOf(index) {
    return index * this.track.clientWidth * (this.rtl ? -1 : 1);
  }

  goTo(index, smooth = true) {
    const target = this.clamp(index, 0, this.slides.length - 1);
    const left = this.offsetOf(target);
    this.scrollTarget = Math.abs(this.track.scrollLeft - left) > 1 ? target : null;
    const smoothly = smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.track.scrollTo({ left, behavior: smoothly ? 'smooth' : 'auto' });
    this.select(target, true);
  }

  select(index, force) {
    if (!force && this.scrollTarget != null) {
      if (index === this.scrollTarget) this.scrollTarget = null;
      return;
    }
    if (index === this.index || !this.fits) return;
    this.resetView();
    this.index = index;
    this.fit = this.fits[index];
    [index, index - 1, index + 1].forEach((slide, order) => this.load(slide, !order));
    this.set(this.steps.map((step) => [step, !this.slides[index + Number(step.dataset.zoomStep)]]), this.steps);
    this.counter.textContent = `${index + 1} / ${this.slides.length}`;
    this.apply();
    this.announce();
  }

  load(index, priority) {
    const slide = this.slides[index];
    const img = slide?.querySelector('img');
    if (!img || img.srcset) return;
    if (priority) img.fetchPriority = 'high';
    if (img.dataset.pending) return;
    img.dataset.pending = 1;
    // sizes viaja en data-sizes: sin srcset en el HTML, un sizes suelto no es valido.
    // Se pone antes que srcset para que el navegador elija el candidato correcto.
    const upgrade = () => {
      if (!img.getAttribute('sizes')) img.setAttribute('sizes', img.dataset.sizes || '100vw');
      img.setAttribute('srcset', img.dataset.srcset);
    };
    const shown = this.section.querySelector(`[data-product-media-id="${slide.dataset.mediaId}"] img`)?.currentSrc;
    if (!shown) return upgrade();
    img.src = shown;
    img.decode().then(upgrade, upgrade);
  }

  resetView() {
    this.scale = 1;
    this.x = this.y = 0;
    if (this.fit) this.apply();
  }

  bounds() {
    const { fit, scale, track } = this;
    return [Math.max(0, (fit.width * scale - track.clientWidth) / 2), Math.max(0, (fit.height * scale - track.clientHeight) / 2)];
  }

  apply() {
    const { fit, scale, dialog } = this;
    if (!fit) return;
    const [boundX, boundY] = this.bounds();
    this.x = this.clamp(this.x, -boundX, boundX);
    this.y = this.clamp(this.y, -boundY, boundY);
    fit.img.style.transform = scale > 1 ? `translate3d(${this.x}px, ${this.y}px, 0) scale(${scale})` : '';
    dialog.toggleAttribute('data-zoomable', fit.max >= 1.25);
    dialog.toggleAttribute('data-zoomed', scale > 1);
    this.set([[this.inButton, fit.max < 1.25 || scale >= fit.max - 0.01], [this.outButton, scale <= 1], [this.resetButton, scale <= 1]]);
  }

  // F01: el foco sale del boton antes de ocultarlo o desactivarlo (si no, cae en body).
  set(states, prefer = []) {
    const next = new Map(states);
    const move = () => [...prefer, this.inButton, this.outButton, ...this.steps, this.closeButton]
      .find((button) => !(next.has(button) ? next.get(button) : button.disabled || button.hidden))?.focus();
    if (next.get(document.activeElement)) move();
    next.forEach((off, button) => {
      button[button === this.resetButton ? 'hidden' : 'disabled'] = off;
    });
    if (this.dialog.open && !this.dialog.contains(document.activeElement)) move();
  }

  zoomTo(next, pointX = 0, pointY = 0) {
    const { fit } = this;
    if (!fit || fit.max < 1.25) return;
    let scale = this.clamp(next, 1, fit.max);
    if (scale < 1.01) scale = 1;
    const ratio = scale / this.scale;
    this.x = pointX - (pointX - this.x) * ratio;
    this.y = pointY - (pointY - this.y) * ratio;
    this.scale = scale;
    // Primer zoom: sizes al ancho ampliado.
    const baseSizes = fit.img.getAttribute('sizes');
    if (scale > 1 && (!baseSizes || baseSizes === (fit.img.dataset.sizes || '100vw'))) {
      fit.img.sizes = `${Math.ceil(fit.width * fit.max)}px`;
    }
    this.apply();
    if (Math.abs(ratio - 1) > 0.001 && !this.pinch) this.announce();
  }

  point({ clientX, clientY }) {
    const rect = this.track.getBoundingClientRect();
    return [clientX - rect.left - rect.width / 2, clientY - rect.top - rect.height / 2];
  }

  follow(event) {
    const [pointX, pointY] = this.point(event);
    const [boundX, boundY] = this.bounds();
    this.x = (-2 * pointX * boundX) / this.track.clientWidth;
    this.y = (-2 * pointY * boundY) / this.track.clientHeight;
    this.apply();
  }

  handlePointer(event) {
    const { type, pointerId: id } = event;
    const { pointers, start, pinch, gap, mid } = this;
    if (type === 'pointerdown') {
      if (event.button) return;
      this.scrollTarget = null;
      pointers.set(id, event);
      this.start = pointers.size === 1 ? { event, x: this.x, y: this.y } : null;
      const [a, b] = pointers.values();
      if (b) this.pinch = { gap: gap(a, b) || 1, scale: this.scale, x: this.x, y: this.y, mid: mid(a, b) };
      if (this.scale > 1 || this.pinch) {
        this.dialog.setAttribute('data-gesture', '');
        this.track.setPointerCapture(id);
      }
    } else if (type === 'pointermove') {
      if (!pointers.has(id)) {
        if (event.pointerType === 'mouse' && this.scale > 1) this.follow(event);
        return;
      }
      pointers.set(id, event);
      const [a, b] = pointers.values();
      if (pinch && b) {
        // Pellizco absoluto: la foto sigue al punto medio.
        const [pointX, pointY] = mid(a, b);
        this.scale = pinch.scale;
        this.x = pinch.x + pointX - pinch.mid[0];
        this.y = pinch.y + pointY - pinch.mid[1];
        this.zoomTo((pinch.scale * gap(a, b)) / pinch.gap, pointX, pointY);
      } else if (start) {
        if (gap(event, start.event) > 8) start.moved = true;
        if (this.scale <= 1) return;
        if (event.pointerType === 'mouse') return this.follow(event);
        this.x = start.x + event.clientX - start.event.clientX;
        this.y = start.y + event.clientY - start.event.clientY;
        this.apply();
      }
    } else if (pointers.delete(id) && !pointers.size) {
      this.start = this.pinch = null;
      this.dialog.removeAttribute('data-gesture');
      if (pinch) this.announce();
      else if (type === 'pointerup' && start && !start.moved && event.timeStamp - start.event.timeStamp < 500) {
        this.tap(event, start.event.target);
      }
    }
  }

  // target es el del pointerdown: con captura, el pointerup llega a la pista.
  tap(event, target) {
    const onImage = target === this.fit.img;
    const toggle = () => this.zoomTo(this.scale > 1 ? 1 : 3, ...this.point(event));
    const close = !onImage && this.scale <= 1;
    const last = this.lastTap;
    clearTimeout(this.tapTimer);
    this.lastTap = null;
    if (event.pointerType === 'mouse') {
      if (onImage) toggle();
      else if (close) this.dialog.close();
    } else if (last && event.timeStamp - last.timeStamp < 300 && this.gap(event, last) < 24) {
      toggle();
    } else {
      this.lastTap = event;
      if (close) this.tapTimer = setTimeout(() => this.dialog.close(), 300);
    }
  }

  handleKey(event) {
    const { key } = event;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const side = this.rtl ? -1 : 1;
    const [panX, panY] = [this.track.clientWidth * 0.15, this.track.clientHeight * 0.15];
    const move = { ArrowLeft: [panX, 0, -side], ArrowRight: [-panX, 0, side], ArrowUp: [0, panY], ArrowDown: [0, -panY] }[key];
    const factor = { '+': 1.5, '=': 1.5, '-': 2 / 3, _: 2 / 3, 0: 0 }[key];
    if (factor != null) this.zoomTo(this.scale * factor);
    else if (key === 'Home' || key === 'End') this.goTo(key === 'End' ? this.slides.length : 0);
    else if (move && this.scale > 1) {
      this.x += move[0];
      this.y += move[1];
      this.apply();
    } else if (move?.[2]) this.goTo(this.index + move[2]);
    else return;
    event.preventDefault();
  }

  announce() {
    this.output.textContent = this.dataset.statusTemplate
      .replace('[index]', this.index + 1)
      .replace('[total]', this.slides.length)
      .replace('[zoom]', Math.round(this.scale * 100));
  }
});
```

---

### <a id="assets-base-css"></a> assets/base.css

> **Descripcion:** Sistema de diseno CSS, variables de movimiento y microinteracciones
> **Ruta:** `assets/base.css` | **Lineas:** 9903 | **Tamano:** 250.06 KB

```css
:root {
  --color-background: #faf8f5;
  --gradient-background: #faf8f5;
  --color-surface: #f3efea;
  --color-surface-subtle: #ede7de;
  --color-foreground: #1c1917;
  --color-foreground-muted: #605a53;
  --color-accent: #786c5e;
  --color-accent-contrast: #ffffff;
  --color-button: #786c5e;
  --color-button-label: #ffffff;
  --color-link: #1c1917;
  --color-border: #e5dfd5;
  --color-border-hairline: #ede7de;
  --color-control-border: #6f6a63;
  --color-shadow: #1c1917;
  --color-sale-badge-bg: #1c1917;
  --color-sale-badge-text: #faf8f5;
  --font-body-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;
  --font-body-style: normal;
  --font-body-weight: 400;
  --font-heading-family: 'Playfair Display', 'Times New Roman', serif;
  --font-heading-style: normal;
  --font-heading-weight: 400;
  --font-letter-spacing-eyebrow: 0.12em;
  --font-letter-spacing-heading: 0;
  --font-body-scale: 1;
  --font-heading-scale: 1.05;
  --page-width: 1300px;
  --page-gutter: 20px;
  --page-gutter-mobile: 16px;
  --page-gutter-desktop: 32px;
  --container-max-width: 1440px;
  /* LEAD-001. Ancho de contenido unico: la misma formula que .container, gobernada por los
     ajustes Ancho de pagina y Margen de pagina. Las secciones editoriales usaban 1440px con
     32px (16px en movil) y su borde izquierdo no coincidia con el del header ni el footer. */
  --content-width: min(100% - (var(--page-gutter) * 2), var(--page-width));
  --section-spacing: 72px;
  --button-radius: 0;
  --radius-input: 0px;
  --border-width: 1px;
  --tap-target-min: 44px;

  /* B0. Una sola familia de duraciones y curvas para todo el tema. Tres curvas y tres
     duraciones bastan: lo que hace que una interfaz se sienta cara es que todo comparta
     el mismo vocabulario de movimiento, no que cada efecto tenga el suyo.

     Reparto por intencion, no por valor:
       fast  realimentacion que sigue al usuario: hover de boton, chevron, cabecera
       base  entrada de superficie: cruce de imagen, reveal, quick add, lineas de carrito
       slow  masas grandes: cajones, modales, escala de imagen en hover

     Calibracion 4D-001 ("Atelier Prime"): el ojo no registraba 320ms ni 12px en pantallas
     grandes. Con la curva expo-out, el 80% del recorrido ocurre en el primer tercio del
     tiempo, asi que 680ms se percibe como una llegada suave y no como lentitud. */
  --motion-fast: 160ms;
  --motion-base: 680ms;
  --motion-slow: 1000ms;
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-move: cubic-bezier(0.65, 0, 0.35, 1);
  /* Distancia y ritmo del scroll reveal. 24px tiene peso sin leerse como carga lenta;
     90ms entre hermanos hace legible la secuencia de una rejilla al hacer scroll. */
  --reveal-shift: 24px;
  --reveal-stagger: 90ms;
  /* Modo Full (motor CSS scroll-driven nativo, bloque B8). El movimiento lee estos tokens
     en vez de fijar sus propios valores: mas recorrido y mas tiempo para que la entrada se
     lea como gesto editorial, con la misma curva expo-out del resto del tema. */
  --motion-expressive: 1200ms;
  --reveal-shift-expressive: 64px;
  --reveal-stagger-expressive: 100ms;
  --parallax-shift: 16%;
  /* Modo Full (MOTION-002): coreografia scroll-driven, bloque B8. Las distancias en vh son
     scroll recorrido. theme.js lee --scroll-enter-inset (%), --scroll-reveal-distance (vh) y
     --scroll-reveal-stagger (vh) para colocar sus lineas de observacion: unidades fijas. */
  --scroll-enter-inset: 6%;
  --scroll-reveal-distance: 32vh;
  --scroll-reveal-stagger: 4vh;
  --scroll-line-stagger: 5vh;
  --scroll-unveil-distance: 40vh;
  --scroll-unveil-settle: 52vh;
  --unveil-scale: 1.18;
  --parallax-scale: 1.06;
  --marquee-drift: 16vw;
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-1: 0.375rem;
  --space-2: 0.75rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --focus-width: 2px;
}

[class^='color-'],
[class*=' color-'] {
  --color-surface: color-mix(in srgb, var(--color-background) 94%, var(--color-foreground));
  --color-surface-subtle: color-mix(in srgb, var(--color-background) 90%, var(--color-foreground));
  --color-foreground-muted: color-mix(in srgb, var(--color-foreground) 78%, var(--color-background));
  --color-accent: var(--color-button);
  --color-accent-contrast: var(--color-button-label);
  --color-border-hairline: color-mix(in srgb, var(--color-border) 58%, var(--color-background));
  --color-control-border: color-mix(in srgb, var(--color-foreground) 60%, var(--color-background));
  --color-sale-badge-bg: var(--color-foreground);
  --color-sale-badge-text: var(--color-background);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  margin: 0;
  overflow-wrap: anywhere;
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
  font-family: var(--font-body-family);
  font-size: calc(1rem * var(--font-body-scale));
  font-style: var(--font-body-style);
  font-weight: var(--font-body-weight);
  line-height: 1.6;
  text-rendering: optimizeLegibility;
}

body[data-drawer-open],
body[data-modal-open] {
  overflow: hidden;
}

img,
picture,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
}

img,
video {
  height: auto;
}

button,
input,
textarea,
select {
  margin: 0;
  color: inherit;
  font: inherit;
}

button,
[type='button'],
[type='submit'],
[type='reset'] {
  cursor: pointer;
  touch-action: manipulation;
}

button:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

a {
  color: var(--color-link, currentColor);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.2em;
}

a:hover {
  text-decoration-thickness: 0.12em;
}

.button:active,
.icon-button:active,
.variant-picker__label:active {
  opacity: 0.72;
}

p,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
blockquote,
figure {
  margin-block-start: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3 {
  margin-block-end: 0;
  font-family: var(--font-heading-family);
  font-style: var(--font-heading-style);
  font-weight: var(--font-heading-weight);
  line-height: 1.05;
  text-wrap: balance;
}

h1,
.h1 {
  font-size: calc(clamp(2.5rem, 9vw, 7rem) * var(--font-heading-scale));
  letter-spacing: var(--font-letter-spacing-heading);
}

h2,
.h2 {
  font-size: calc(clamp(2rem, 5vw, 4.5rem) * var(--font-heading-scale));
  letter-spacing: var(--font-letter-spacing-heading);
}

h3,
.h3 {
  font-size: calc(clamp(1.35rem, 2.5vw, 2rem) * var(--font-heading-scale));
  letter-spacing: var(--font-letter-spacing-heading);
}

h4,
h5,
h6 {
  font-size: calc(1.125rem * var(--font-heading-scale));
}

hr {
  height: 1px;
  border: 0;
  background: var(--color-border);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--space-2);
  border-bottom: 1px solid var(--color-border);
  text-align: start;
}

blockquote {
  margin-inline: 0;
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--color-border);
  font-family: var(--font-heading-family);
  font-size: 1.25em;
}

:focus-visible {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 3px;
}

[hidden] {
  display: none !important;
}

[inert] {
  pointer-events: none;
}

.unstyled-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.container {
  width: min(100% - (var(--page-gutter) * 2), var(--page-width));
  margin-inline: auto;
}

.container--narrow {
  max-width: 54rem;
}

.section {
  padding-block: var(--section-spacing);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.flow > * + * {
  margin-block-start: var(--flow-space, var(--space-4));
}

.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cluster-gap, var(--space-3));
  align-items: center;
}

.lede {
  max-width: 42ch;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  line-height: 1.45;
}

.eyebrow {
  margin-block-end: var(--space-2);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  line-height: 1.2;
  text-transform: uppercase;
}

.rte > *:last-child {
  margin-block-end: 0;
}

.rte a {
  overflow-wrap: break-word;
}

.rte img {
  margin-block: var(--space-5);
}

.rte ul,
.rte ol {
  padding-inline-start: 1.5em;
}

.button {
  display: inline-flex;
  min-height: var(--tap-target-min);
  padding: 0.7rem 1.25rem;
  border: 1px solid var(--color-button);
  border-radius: var(--button-radius);
  align-items: center;
  justify-content: center;
  background: var(--color-button);
  color: var(--color-button-label);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: background-color var(--motion-fast) var(--ease-move), color var(--motion-fast) var(--ease-move);
}

.button:hover {
  background: transparent;
  color: var(--color-foreground);
}

/* Shopify inyecta su propio botón de pago dinámico con un azul de marca que queda en
   3.59:1 contra el blanco de su etiqueta. Se reviste con la paleta del tema para llevarlo
   por encima de 12:1 y que deje de ser la unica violacion de contraste de la PDP. */
.shopify-payment-button__button--unbranded {
  border-radius: var(--button-radius);
  background-color: var(--color-foreground) !important;
  color: var(--color-background) !important;
  /* Misma tipografia que .button para que "Buy it now" no rompa la pareja con Add to cart (6A-001). */
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  text-transform: uppercase;
  transition: background-color var(--motion-fast) var(--ease-move), color var(--motion-fast) var(--ease-move);
}

.shopify-payment-button__button--unbranded:hover:not([disabled]) {
  background-color: color-mix(in srgb, var(--color-foreground) 85%, var(--color-background)) !important;
}

.icon-button {
  display: inline-flex;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0.65rem;
  border: 0;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  background: transparent;
  color: currentColor;
  line-height: 1;
  text-decoration: none;
}

.skip-link {
  position: fixed;
  z-index: 1000;
  inset-block-start: var(--space-3);
  inset-inline-start: var(--space-3);
  padding: 0.75rem 1rem;
  transform: translateY(-200%);
  border: 2px solid currentColor;
  background: var(--color-background);
  color: var(--color-foreground);
}

.skip-link:focus {
  transform: translateY(0);
}

.site-main:focus:not(:focus-visible) {
  outline: 0;
}

.announcement-bar {
  position: relative;
  z-index: 21;
  display: block;
  border-bottom: var(--border-width) solid var(--color-border-hairline);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.announcement-bar__inner {
  display: grid;
  min-height: var(--tap-target-min);
  grid-template-columns: var(--tap-target-min) minmax(0, 1fr) var(--tap-target-min) var(--tap-target-min);
  align-items: stretch;
}

.announcement-bar__viewport {
  display: grid;
  min-width: 0;
  grid-column: 2;
  grid-row: 1;
  place-items: center;
  text-align: center;
}

.announcement-bar__item {
  grid-area: 1 / 1;
  width: 100%;
  margin: 0;
}

.announcement-bar__link,
.announcement-bar__text {
  display: flex;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) var(--space-sm);
  align-items: center;
  justify-content: center;
  color: currentColor;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  line-height: 1.25;
  text-decoration: none;
  text-transform: uppercase;
}

.announcement-bar__control {
  display: inline-grid;
  width: var(--tap-target-min);
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0;
  border: 0;
  grid-row: 1;
  place-items: center;
  background: transparent;
  color: currentColor;
}

.announcement-bar__control--previous svg {
  transform: rotate(90deg);
}

.announcement-bar__control--previous {
  grid-column: 1;
}

.announcement-bar__control--pause {
  grid-column: 3;
}

.announcement-bar__control--next {
  grid-column: 4;
}

.announcement-bar__control--next svg {
  transform: rotate(-90deg);
}

.announcement-bar[data-auto-rotate='false'] .announcement-bar__inner {
  grid-template-columns: var(--tap-target-min) minmax(0, 1fr) var(--tap-target-min);
}

.announcement-bar[data-auto-rotate='false'] .announcement-bar__control--next {
  grid-column: 3;
}

.announcement-bar[data-single-announcement='true'] .announcement-bar__inner {
  grid-template-columns: minmax(0, 1fr);
}

.announcement-bar[data-single-announcement='true'] .announcement-bar__viewport {
  grid-column: 1;
}

.announcement-bar__pause-icon,
.announcement-bar__play-icon {
  position: relative;
  display: block;
  width: 1rem;
  height: 1rem;
}

.announcement-bar__pause-icon::before,
.announcement-bar__pause-icon::after {
  position: absolute;
  width: 2px;
  height: 0.75rem;
  inset-block-start: 0.125rem;
  background: currentColor;
  content: '';
}

.announcement-bar__pause-icon::before {
  inset-inline-start: 0.25rem;
}

.announcement-bar__pause-icon::after {
  inset-inline-end: 0.25rem;
}

.announcement-bar__play-icon::before {
  position: absolute;
  inset: 0.125rem 0.1875rem;
  border-block: 0.375rem solid transparent;
  border-inline-start: 0.625rem solid currentColor;
  content: '';
}

.announcement-bar__control[data-paused='true'] .announcement-bar__pause-icon,
.announcement-bar__control:not([data-paused='true']) .announcement-bar__play-icon {
  display: none;
}

.announcement-bar__control:hover,
.announcement-bar__control:focus-visible,
.announcement-bar__link:hover,
.announcement-bar__link:focus-visible {
  background: var(--color-surface);
}

/* Cabecera sticky (4F-001): se pega la seccion que envuelve a la <header>, solo con JS.
   Ver el comentario de sections/header.liquid; antes era un {% style %} en el body. */
.js .section-header {
  position: sticky;
  top: 0;
  z-index: 150;
}

.site-header {
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.site-header__inner {
  display: grid;
  min-height: 4.75rem;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-2);
}

.site-header__mobile-menu {
  justify-self: start;
}

.site-header__menu-button {
  padding-inline-start: 0;
}

.site-header__desktop-nav {
  display: none;
}

.no-js .site-header__mobile-menu {
  display: none;
}

.no-js .site-header__desktop-nav {
  display: block;
  grid-column: 1 / -1;
  padding-block-end: var(--space-3);
}

.no-js .desktop-nav {
  display: grid;
  gap: var(--space-2) var(--space-4);
}

.no-js .desktop-nav__toggle {
  display: none;
}

.no-js .desktop-nav__panel[hidden] {
  position: static;
  display: block !important;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.no-js .desktop-nav__submenu,
.no-js .desktop-nav__grandchildren {
  display: grid;
  gap: var(--space-1);
}

.no-js .desktop-nav__submenu a,
.no-js .desktop-nav__grandchildren a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  color: currentColor;
}

.site-header__brand {
  display: inline-flex;
  /* Sin logo cargado, la marca se renderiza como texto y el enlace medía 18.4px de alto.
     El minimo la lleva al area tactil de 44px sin alterar la maqueta del header. */
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  max-width: min(45vw, 15rem);
  align-items: center;
  justify-content: center;
  color: currentColor;
  text-decoration: none;
}

/* 5A-003, H-02. El ancho sale del ajuste "Logo width" (--logo-width en header.liquid);
   antes width: auto y un tope de 3rem de alto lo anulaban y el editor no cambiaba nada. El
   alto sigue la proporcion del archivo, sea horizontal, cuadrado o vertical. El ancho es
   fijo y el tope va en max-width: un min() con porcentaje dentro de width hace que la
   columna de la marca se mida con el tamano natural de la foto y no con el ajuste. */
.site-header__logo-image {
  width: var(--logo-width, 140px);
  max-width: 100%;
  height: auto;
}

/* COMP-001 (S-04). Una sola linea con elipsis dejaba "Sartorial Ateli…" a 390 px. El
   nombre pasa a una segunda linea y solo recurre a la elipsis si tampoco cabe en dos; el
   min-height de 4.75rem de la cabecera absorbe las dos lineas sin crecer. overflow-wrap
   normal evita que una palabra se parta: si es mas larga que la columna, termina en "…". */
.site-header__brand-text {
  display: -webkit-box;
  overflow: hidden;
  font-family: var(--font-heading-family);
  font-size: clamp(1.15rem, 4vw, 1.6rem);
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-align: center;
  text-overflow: ellipsis;
  overflow-wrap: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.site-header__actions {
  display: flex;
  justify-self: end;
  align-items: center;
}

.site-header__account {
  --shopify-account-signed-in-avatar-size: 2.25rem;
  /* 5A-003, H-05. El boton del componente toma su minimo de esta variable; sin ella lo
     calcula como 1,57 veces el avatar (50,2 px) y la cabecera movil pierde 6 px. */
  --shopify-account-avatar-size: var(--tap-target-min);
  display: grid;
  min-width: 44px;
  min-height: 44px;
  place-items: center;
}

.site-header__account::part(signed-out-avatar) {
  width: 44px;
  height: 44px;
  padding: 0.65rem;
}

.site-header__cart {
  position: relative;
}

/* 5A-003, H-05. El contador va sobre la esquina del icono, fuera del flujo: dentro del
   enlace le sumaba 10,8 px al carrito y cortaba el nombre de la tienda a 390 px. Con 0
   articulos no se pinta (hidden desde header.liquid y desde CartDrawer). */
.site-header__cart-count {
  position: absolute;
  inset-block-start: var(--space-3xs);
  inset-inline-end: var(--space-3xs);
  display: grid;
  min-width: 1.15rem;
  height: 1.15rem;
  padding-inline: 0.2rem;
  border-radius: 99px;
  place-items: center;
  background: var(--color-button);
  color: var(--color-button-label);
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
}

.drawer-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  background: color-mix(in srgb, var(--color-shadow) 48%, transparent);
}

.drawer-panel {
  width: min(90vw, 25rem);
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-inline-end: 1px solid var(--color-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
  box-shadow: 0 0 2.5rem color-mix(in srgb, var(--color-shadow) 22%, transparent);
}

.drawer-panel__header {
  position: sticky;
  z-index: 1;
  inset-block-start: 0;
  display: flex;
  min-height: 4.75rem;
  padding-inline: var(--page-gutter);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  justify-content: space-between;
  background: var(--color-background);
}

.mobile-nav {
  padding: var(--space-3) var(--page-gutter) var(--space-6);
}

.mobile-nav__link,
.mobile-nav__toggle,
.mobile-nav__submenu a,
.mobile-nav__grandchildren a {
  display: flex;
  width: 100%;
  min-height: 44px;
  padding-block: 0.65rem;
  align-items: center;
  color: currentColor;
  text-decoration: none;
}

.mobile-nav__toggle {
  border: 0;
  justify-content: space-between;
  padding-inline: 0;
  background: transparent;
  text-align: start;
}

.mobile-nav__toggle[aria-expanded='true'] svg,
.desktop-nav__toggle[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

.mobile-nav__toggle svg,
.desktop-nav__toggle svg {
  transition: transform var(--motion-fast) var(--ease-move);
}

.mobile-nav__submenu {
  margin-block: var(--space-1) var(--space-2);
  padding-inline-start: var(--space-3);
  border-inline-start: 1px solid var(--color-border);
}

.mobile-nav__grandchildren {
  padding-inline-start: var(--space-3);
  font-size: 0.9em;
  opacity: 0.78;
}

.page-foundation {
  min-height: min(70vh, 48rem);
  display: grid;
  align-items: center;
}

.site-footer {
  padding-block: clamp(3rem, 8vw, 7rem) var(--space-4);
  border-top: 1px solid var(--color-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.site-footer a {
  color: currentColor;
}

.site-footer__grid {
  display: grid;
  gap: var(--space-6);
}

.site-footer__brand {
  /* COMP-001 (S-03). Sin el minimo, la columna crece hasta la palabra mas larga del
     titulo (break-word no la cuenta como divisible) y da scroll horizontal en movil. */
  min-width: 0;
  max-width: 34rem;
}

/* COMP-001 (S-03). Con el tamano de .h2 (75,6 px) en una columna de 304 px, el
   overflow-wrap: anywhere del body partia "Sartorial" en "Sartori / al". A esta escala el
   nombre corta entre palabras. break-word y no normal: una sola palabra mas ancha que la
   columna se parte como ultimo recurso; con normal se salia y daba 311 px de scroll
   horizontal a 360. El multiplicador mantiene vivo el ajuste "Heading scale". */
.site-footer__title {
  font-size: calc(clamp(1.75rem, 1.2rem + 1.5vw, 2.5rem) * var(--font-heading-scale));
  color: currentColor;
  text-decoration: none;
  overflow-wrap: break-word;
  word-break: normal;
}

.site-footer__menu,
.social-links {
  display: grid;
  gap: var(--space-2);
}

.site-footer__menu a,
.social-links a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  margin-block-start: var(--space-6);
  padding-block-start: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
  align-items: center;
}

/* powered_by_link llega tal cual de Shopify: solo se le da un area tactil de 24 px (WCAG 2.5.8). */
.site-footer__powered-by a {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
}

label {
  display: inline-block;
  margin-block-end: var(--space-1);
  font-weight: 700;
}

input:not([type='checkbox'], [type='radio']),
select,
textarea {
  width: 100%;
  min-height: var(--tap-target-min);
  padding: 0.75rem;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-input);
  background: var(--color-background);
  color: var(--color-foreground);
}

textarea {
  min-height: 8rem;
  resize: vertical;
}

.password-form {
  max-width: 30rem;
  margin-block-start: var(--space-5);
}

.gift-card-page {
  display: grid;
  min-height: 100vh;
  padding: var(--space-4);
  place-items: center;
}

.gift-card {
  width: min(100%, 42rem);
  padding: clamp(1.5rem, 6vw, 4rem);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  box-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--color-shadow) 10%, transparent);
  color: var(--color-foreground);
}

.gift-card__brand {
  display: inline-flex;
  margin-block-end: var(--space-6);
  color: currentColor;
  text-decoration: none;
}

.gift-card__logo {
  width: auto;
  max-height: 3rem;
}

.gift-card__value {
  margin-block: var(--space-3);
  font-family: var(--font-heading-family);
  font-size: clamp(2rem, 8vw, 4rem);
  line-height: 1;
}

.gift-card__code {
  display: inline-block;
  margin-block: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: clamp(1rem, 4vw, 1.35rem);
  letter-spacing: 0.08em;
}

.gift-card__qr {
  width: 160px;
  min-height: 160px;
  margin-block: var(--space-5);
}

.gift-card__qr img,
.gift-card__qr canvas {
  width: 160px;
  height: 160px;
}

.gift-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.gift-card__wallet {
  display: inline-block;
  margin-block-start: var(--space-3);
}

.button--secondary {
  background: transparent;
  color: var(--color-foreground);
}

.button--secondary:hover {
  background: var(--color-button);
  color: var(--color-button-label);
}

.button--full {
  width: 100%;
}

.button[aria-busy='true'] [data-add-to-cart-text] {
  opacity: 1;
}

.button[aria-busy='true'],
.button[aria-busy='true']:disabled,
button[aria-busy='true']:disabled {
  cursor: progress;
  opacity: 1;
}

.button__spinner {
  margin-inline-start: var(--space-1);
}

.icon--spinner {
  animation: theme-spin 800ms linear infinite;
}

@keyframes theme-spin {
  to {
    transform: rotate(360deg);
  }
}

.form-message {
  margin-block: var(--space-2) 0;
  color: var(--color-foreground);
  font-size: 0.875rem;
}

.price {
  display: grid;
  gap: var(--space-1);
  font-variant-numeric: tabular-nums;
}

.price__values,
.price__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-2);
  align-items: baseline;
}

.price__compare {
  opacity: 0.68;
}

.price__unit,
.price__taxes {
  display: block;
  font-size: 0.8rem;
  line-height: 1.4;
  opacity: 0.76;
}

.badge {
  display: inline-flex;
  min-height: 1.75rem;
  padding-inline: 0.55rem;
  border: 1px solid currentColor;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

/* The sale badge is the one piece of merchandising colour on a product card, so it
   consumes the scheme tokens. Sold out stays outlined and recessive, which is what
   keeps the two readable at a glance. */
.badge[data-sale-badge] {
  border-color: var(--color-sale-badge-bg);
  background-color: var(--color-sale-badge-bg);
  color: var(--color-sale-badge-text);
}

.badge[data-sold-out-badge] {
  border-color: currentColor;
  background-color: transparent;
  color: currentColor;
  opacity: 0.8;
}

.product-main {
  padding-block: var(--space-4) var(--section-spacing);
}

.product-main__layout {
  display: grid;
  gap: var(--space-5);
}

.product-gallery {
  display: grid;
  gap: var(--space-2);
  align-content: start;
}

.product-gallery__items {
  display: contents;
}

.product-gallery__item {
  position: relative;
  margin: 0;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-foreground) 5%, var(--color-background));
}

.product-gallery__item[data-selected]::after {
  position: absolute;
  inset: 0;
  border: 1px solid var(--color-foreground);
  content: '';
  pointer-events: none;
}

.product-gallery__image,
.product-gallery__media,
.product-gallery__item video,
.product-gallery__item model-viewer {
  width: 100%;
}

.product-gallery__placeholder {
  min-height: 28rem;
  background: color-mix(in srgb, var(--color-foreground) 7%, var(--color-background));
}

.product-gallery__thumbnails {
  display: grid;
  padding-block-end: var(--space-1);
  grid-auto-columns: 4.5rem;
  grid-auto-flow: column;
  gap: var(--space-1);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.product-gallery__thumbnail {
  display: grid;
  width: 4.5rem;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0;
  overflow: hidden;
  border: var(--border-width) solid var(--color-control-border);
  place-items: center;
  background: var(--color-background);
  color: var(--color-foreground);
  cursor: pointer;
}

.product-gallery__thumbnail[aria-pressed='true'] {
  outline: 2px solid var(--color-foreground);
  outline-offset: -3px;
}

.product-gallery__thumbnail-image {
  display: block;
  width: 100%;
  height: 5.5rem;
  object-fit: cover;
}

.product-main__layout--thumbnails .product-gallery__items {
  display: block;
}

.product-main__layout--thumbnails .product-gallery__item {
  width: 100%;
}

.no-js .product-main__layout--thumbnails .product-gallery__item[hidden] {
  display: block;
}

.no-js .product-gallery__thumbnails {
  display: none;
}

.product-main__details {
  display: block;
  min-width: 0;
}

/* Featured product */

.featured-product.section {
  padding-block: var(--featured-product-padding-top) var(--featured-product-padding-bottom);
}

.featured-product--secondary {
  background: var(--color-surface);
}

.featured-product__layout {
  display: grid;
  gap: var(--space-5);
}

.featured-product__gallery {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: var(--space-2);
}

.featured-product__media {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: var(--border-width) solid var(--color-border-hairline);
  background: color-mix(in srgb, var(--color-foreground) 5%, var(--color-background));
}

.featured-product__media[data-selected] {
  border-color: var(--color-control-border);
}

.featured-product__media .product-gallery__image,
.featured-product__media .product-gallery__media,
.featured-product__media video,
.featured-product__media model-viewer,
.featured-product__placeholder,
.featured-product__placeholder svg {
  display: block;
  width: 100%;
  height: auto;
}

.featured-product__placeholder {
  min-height: 28rem;
  border: var(--border-width) solid var(--color-border-hairline);
  background: var(--color-surface);
}

.featured-product__placeholder svg {
  height: 100%;
  min-height: inherit;
}

.featured-product__details {
  display: block;
  min-width: 0;
}

.featured-product__info {
  --flow-space: var(--space-4);
}

.featured-product__title {
  max-width: 18ch;
  font-size: calc(2.25rem * var(--font-heading-scale));
  line-height: 1.04;
}

.featured-product__price {
  font-size: 1.1rem;
}

.featured-product__description {
  max-width: 64ch;
  padding-block-start: var(--space-4);
  border-top: 1px solid var(--color-border-hairline);
}

@media (min-width: 62rem) {
  .featured-product__layout {
    grid-template-columns: minmax(0, 1.35fr) minmax(20rem, 0.65fr);
    align-items: start;
    gap: clamp(2rem, 5%, 5rem);
  }

  .featured-product__gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .featured-product__media:first-child,
  .featured-product__media:only-child,
  .featured-product__placeholder {
    grid-column: 1 / -1;
  }

  .featured-product__details {
    position: sticky;
    inset-block-start: var(--space-4);
  }

  .featured-product__title {
    font-size: calc(3.75rem * var(--font-heading-scale));
  }
}

.product-main__info {
  --flow-space: var(--space-4);
}

.product-main__vendor {
  margin-block-end: 0;
}

.product-main__title {
  max-width: 18ch;
  font-size: calc(2.35rem * var(--font-heading-scale));
  letter-spacing: 0;
}

/* AF-09 (AUDIT-FINAL-001): con 60+ caracteres, 3rem y 18ch el titulo llegaba a 13 lineas y
   dejaba precio y boton de compra bajo el pliegue a 1280x800. Mismo tipo, cuerpo menor. */
.product-main__title[data-long-title='1'] {
  max-width: 28ch;
  font-size: calc(1.6rem * var(--font-heading-scale));
}

.product-main__price {
  font-size: 1.1rem;
}

.product-main__description {
  max-width: 64ch;
  padding-block-start: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.variant-picker {
  --flow-space: var(--space-3);
}

.variant-picker__group {
  min-width: 0;
  padding: 0;
  border: 0;
}

.variant-picker__legend {
  margin-block-end: var(--space-2);
  font-size: 0.875rem;
  font-weight: 700;
}

.variant-picker__legend span {
  font-weight: 400;
}

.variant-picker__values {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.variant-picker__label {
  display: inline-flex;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  margin: 0;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-border);
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
  text-align: center;
}

.variant-picker__input:checked + .variant-picker__label {
  border-color: var(--color-button);
  background: var(--color-button);
  color: var(--color-button-label);
}

.variant-picker__input:focus-visible + .variant-picker__label {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 3px;
}

.variant-picker__input:disabled + .variant-picker__label {
  cursor: not-allowed;
  opacity: 0.55;
}

.product-form__quantity {
  /* Sin tope de ancho: el stepper es inline-grid y ya se mide por su contenido. El
     max-width de 8rem existia solo para que el campo suelto no se estirase, y de paso
     partia el total de linea en una columna estrecha. */
  display: block;
}

/* La etiqueta global es inline-block porque acompanaba a un campo de ancho completo.
   Junto a un stepper inline-grid se le pondria al lado, asi que aqui vuelve a su linea
   y su margen inferior recupera sentido. */
.product-form__quantity label {
  display: block;
}

.product-form__form,
.product-card__form {
  display: grid;
  gap: var(--space-2);
}

.product-form__dynamic-checkout {
  min-height: 44px;
}

size-guide-modal,
sticky-cart-bar {
  display: block;
}

.size-guide {
  display: grid;
  gap: var(--space-xs);
}

.size-guide__trigger {
  display: inline-flex;
  width: fit-content;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) 0;
  border: 0;
  align-items: center;
  gap: var(--space-xs);
  background: transparent;
  color: currentColor;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: start;
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.size-guide__model-fit-inline {
  margin: 0;
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

.size-guide-modal__overlay {
  position: fixed;
  z-index: 220;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-block-start: var(--space-xl);
  background: color-mix(in srgb, var(--color-shadow) 52%, transparent);
  backdrop-filter: blur(8px);
}

.size-guide-modal__panel {
  display: flex;
  width: 100%;
  max-height: calc(100dvh - var(--space-xl));
  overflow-y: auto;
  overscroll-behavior: contain;
  border-block-start: var(--border-width) solid var(--color-border);
  flex-direction: column;
  background: var(--color-background);
  color: var(--color-foreground);
}

.size-guide-modal__header {
  position: sticky;
  z-index: 1;
  inset-block-start: 0;
  display: flex;
  min-height: 4.75rem;
  padding: var(--space-md) var(--page-gutter);
  border-bottom: var(--border-width) solid var(--color-border-hairline);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  background: var(--color-background);
}

.size-guide-modal__title {
  font-size: 1.5rem;
  letter-spacing: 0;
}

.size-guide-modal__body {
  display: grid;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--page-gutter) max(var(--space-xl), env(safe-area-inset-bottom));
}

.size-guide-modal__fit {
  display: grid;
  gap: var(--space-2xs);
  padding: var(--space-md);
  background: var(--color-surface);
}

.size-guide-modal__fit p {
  margin: 0;
}

.size-guide-modal__unit-switcher {
  display: inline-grid;
  width: fit-content;
  grid-template-columns: repeat(2, minmax(var(--tap-target-min), 1fr));
  border: var(--border-width) solid var(--color-border);
}

.size-guide-modal__unit {
  min-width: 5.5rem;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) var(--space-md);
  border: 0;
  background: transparent;
  color: currentColor;
  font-size: 0.8125rem;
  font-weight: 700;
}

.size-guide-modal__unit[aria-selected='true'] {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.size-guide-modal__measurements,
.size-guide-modal__page-content {
  overflow-x: auto;
}

.size-guide-modal__measurements table,
.size-guide-modal__page-content table {
  min-width: 32rem;
}

.size-guide-modal__measurements > :first-child,
.size-guide-modal__page-content > :first-child {
  margin-block-start: 0;
}

.size-guide-modal__measurements > :last-child,
.size-guide-modal__page-content > :last-child {
  margin-block-end: 0;
}

.sticky-cart-bar {
  position: fixed;
  z-index: 40;
  width: 100%;
  inset-block-end: 0;
  inset-inline-start: 0;
  transform: translateY(100%);
  border-top: var(--border-width) solid var(--color-border-hairline);
  background: var(--color-background);
  box-shadow: 0 -0.75rem 2.5rem color-mix(in srgb, var(--color-shadow) 12%, transparent);
  color: var(--color-foreground);
  pointer-events: none;
  visibility: hidden;
}

.sticky-cart-bar[data-visible] {
  transform: translateY(0);
  pointer-events: auto;
  visibility: visible;
}

.sticky-cart-bar__inner {
  display: grid;
  min-height: 4rem;
  padding: var(--space-xs) var(--page-gutter) max(var(--space-xs), env(safe-area-inset-bottom));
  grid-template-columns: 3rem minmax(0, 1fr) minmax(7.5rem, auto);
  align-items: center;
  gap: var(--space-sm);
}

.sticky-cart-bar__media {
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  background: var(--color-surface);
}

.sticky-cart-bar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sticky-cart-bar__details {
  min-width: 0;
}

.sticky-cart-bar__title,
.sticky-cart-bar__meta {
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sticky-cart-bar__title {
  font-size: 0.8125rem;
  font-weight: 700;
}

.sticky-cart-bar__meta {
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

.sticky-cart-bar__separator[hidden],
.sticky-cart-bar__variant[hidden] {
  display: none;
}

.sticky-cart-bar__submit {
  min-width: 7.5rem;
  min-height: var(--tap-target-min);
  padding-inline: var(--space-sm);
  border-radius: var(--button-radius);
  white-space: nowrap;
}

body[data-sticky-cart-visible] {
  padding-block-end: calc(4rem + env(safe-area-inset-bottom));
}

.collection-main__header {
  max-width: 62rem;
}

.collection-main__title {
  font-size: calc(3rem * var(--font-heading-scale));
  letter-spacing: 0;
}

.collection-main__description {
  max-width: 58ch;
}

.collection-main__body {
  display: grid;
  gap: var(--space-5);
}

.facets__heading {
  justify-content: space-between;
}

.facets__title {
  font-family: var(--font-body-family);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0;
}

.facets__count {
  display: inline-grid;
  min-width: 1.75rem;
  min-height: 1.75rem;
  border: 1px solid var(--color-border);
  place-items: center;
  font-size: 0.75rem;
}

.facet {
  border-bottom: 1px solid var(--color-border);
}

.facet__summary {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  cursor: pointer;
  font-weight: 700;
  list-style: none;
}

.facet__summary::-webkit-details-marker {
  display: none;
}

.facet[open] .facet__summary .icon--chevron {
  transform: rotate(180deg);
}

.facet__content {
  padding-block: 0 var(--space-3);
}

.facet__values {
  display: grid;
  gap: var(--space-1);
}

.facet__value {
  display: grid;
  min-height: 44px;
  margin: 0;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-weight: 400;
}

.facet__value input {
  width: 1.15rem;
  height: 1.15rem;
}

.facet__price-range {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}

.facet__price-input {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-1);
}

.facets__sort,
.facets__actions {
  margin-block-start: var(--space-3);
}

/* Barra de filtros activos (6B-001). Pildoras con el borde de control (>= 3:1 contra el fondo),
   la misma escala tipografica que los chips de variante y 44 px de objetivo tactil. */
.facets__active-filters {
  margin-block-end: var(--space-3);
}

.facets__pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.facets__pills > li {
  min-width: 0;
  max-width: 100%;
}

.facet__pill {
  display: inline-flex;
  min-height: var(--tap-target-min);
  max-width: 100%;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--color-control-border);
  border-radius: var(--button-radius);
  align-items: center;
  gap: 0.5rem;
  color: var(--color-foreground);
  font-size: 0.875rem;
  line-height: 1.2;
  text-decoration: none;
  transition: border-color var(--motion-fast) var(--ease-move);
}

.facet__pill:hover {
  border-color: var(--color-foreground);
}

.facet__pill-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.facet__pill-icon {
  display: inline-flex;
  flex: none;
}

.facets__clear-all {
  display: inline-flex;
  min-height: var(--tap-target-min);
  padding-inline: 0.25rem;
  align-items: center;
  color: var(--color-foreground);
  font-size: 0.875rem;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.collection-products__count {
  margin-block: 0 var(--space-3);
  font-size: 0.875rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5) var(--space-2);
}

.product-grid__item,
.product-card {
  min-width: 0;
}

.product-card {
  display: grid;
  gap: var(--space-3);
}

.product-card__media {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: color-mix(in srgb, var(--color-foreground) 5%, var(--color-background));
  transition: transform var(--motion-base) var(--ease-move), outline var(--motion-fast) var(--ease-enter);
}

.product-card__image {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
  transition: opacity var(--motion-base) var(--ease-enter), transform var(--motion-slow) var(--ease-move);
}

/* Cruce de imagenes: la que se va acelera (ease-exit), la que llega frena (ease-enter).
   La curva la fija el estilo de destino, asi que cada regla describe el estado al que
   se entra: al pasar el cursor la primaria sale y la secundaria entra; al retirarlo,
   al reves. El transform conserva su propia curva en las cuatro reglas. */
.product-card__image--secondary {
  opacity: 0;
  transition: opacity var(--motion-base) var(--ease-exit), transform var(--motion-slow) var(--ease-move);
}

.product-card__media:hover .product-card__image--primary,
.product-card__media:focus-visible .product-card__image--primary {
  opacity: 0;
  transition: opacity var(--motion-base) var(--ease-exit), transform var(--motion-slow) var(--ease-move);
}

.product-card__media:hover .product-card__image--secondary,
.product-card__media:focus-visible .product-card__image--secondary {
  opacity: 1;
  transition: opacity var(--motion-base) var(--ease-enter), transform var(--motion-slow) var(--ease-move);
}

.product-card__media:hover .product-card__image,
.product-card__media:focus-visible .product-card__image {
  transform: scale(1.025);
}

.product-card__media-placeholder {
  display: block;
  width: 100%;
  height: 100%;
}

.product-card__content {
  display: grid;
  gap: var(--space-1);
}

.product-card__vendor {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.product-card__title {
  font-family: var(--font-body-family);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.35;
}

.product-card__title a {
  color: currentColor;
  text-decoration: none;
}

.product-card .price {
  font-size: 0.875rem;
}

.product-card__action {
  margin-block-start: var(--space-2);
}

/* B4. El quick add se asienta al pasar el cursor. Conserva SIEMPRE su espacio en la
   rejilla, asi que no provoca ni un pixel de desplazamiento: solo cambian opacidad y
   transform, las dos propiedades que el compositor resuelve sin relayout. En pantallas
   tactiles, donde no hay hover que dispare nada, se queda visible y directamente
   pulsable. */
@media (hover: hover) and (pointer: fine) {
  html[data-animations='subtle'] .product-card__action,
  html[data-animations='full'] .product-card__action {
    opacity: 0;
    transform: translateY(var(--reveal-shift));
    transition: opacity var(--motion-base) var(--ease-enter),
      transform var(--motion-base) var(--ease-enter);
  }

  html[data-animations='subtle'] .product-card:hover .product-card__action,
  html[data-animations='full'] .product-card:hover .product-card__action,
  html[data-animations='subtle'] .product-card:focus-within .product-card__action,
  html[data-animations='full'] .product-card:focus-within .product-card__action {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 5A. Tarjeta de producto: swatches y compra rapida.
   El elemento que coordina la variante envuelve la tarjeta con display: contents, asi que
   la rejilla de .product-card (y las variantes de bento y curated showcase) siguen viendo
   los mismos hijos de siempre. */
product-card-variants {
  display: contents;
}

/* Abierto, el panel se ancla al bloque de texto: la accion no puede conservar el transform
   del reveal (lo convertiria en el ancla). La especificidad supera la del :focus-within. */
html[data-animations] .product-card product-card-variants[data-open] .product-card__action {
  opacity: 1;
  transform: none;
}

/* Con la foto de un color a la vista, el cruce hacia la segunda imagen del producto
   mostraria otro color: se desactiva hasta volver a la foto del producto. */
product-card-variants[data-variant-media] .product-card__image--secondary {
  display: none;
}

product-card-variants[data-variant-media] .product-card__media:hover .product-card__image--primary,
product-card-variants[data-variant-media] .product-card__media:focus-visible .product-card__image--primary {
  opacity: 1;
}

.product-card__swatches {
  --card-swatch-size: 1.5rem;
  container: card-swatches / inline-size;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* Cada swatch ocupa 44x44 para el toque, pero el circulo mide 24: el margen negativo
     alinea el primer circulo con el borde del titulo. */
  margin-inline-start: calc((var(--tap-target-min) - var(--card-swatch-size)) / -2);
}

.product-card__swatch-group {
  display: flex;
  flex-wrap: wrap;
}

.product-card__swatch-item {
  display: inline-flex;
}

/* Dos swatches y el contador en una tarjeta estrecha (la rejilla movil de dos columnas);
   cuatro desde 260px de tarjeta. Tres swatches mas el contador no caben a 44px cada uno. */
.product-card__swatches .card-swatch--wide-only,
.product-card__swatches .card-swatch-more--wide {
  display: none;
}

@container card-swatches (min-width: 270px) {
  .product-card__swatches .card-swatch--wide-only,
  .product-card__swatches .card-swatch-more--wide {
    display: inline-grid;
  }

  .product-card__swatches .product-card__swatch-item.card-swatch--wide-only {
    display: inline-flex;
  }

  .product-card__swatches .card-swatch-more--narrow {
    display: none;
  }
}

/* Sin swatch nativo: el nombre del valor, en una pieza del mismo alto de toque. */
.card-swatch--text {
  width: auto;
  min-width: var(--tap-target-min);
  max-width: 100%;
  padding-inline: var(--space-2xs);
}

.card-swatch__text {
  display: block;
  max-width: 8rem;
  padding: 0.25rem 0.55rem;
  overflow: hidden;
  border: 1px solid var(--color-control-border);
  border-radius: var(--button-radius);
  font-size: 0.6875rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-swatch--text[aria-checked='true'] .card-swatch__text {
  border-color: var(--color-foreground);
  box-shadow: inset 0 0 0 1px var(--color-foreground);
  font-weight: 700;
}

.card-swatch--text.card-swatch--sold-out .card-swatch__text {
  color: var(--color-foreground-muted);
  text-decoration: line-through;
}

.card-swatch--text:focus-visible .card-swatch__text {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 3px;
}

.card-swatch,
.card-swatch-more {
  display: inline-grid;
  width: var(--tap-target-min);
  height: var(--tap-target-min);
  padding: 0;
  border: 0;
  place-items: center;
  background: transparent;
  color: var(--color-foreground);
  cursor: pointer;
}

/* Solo datos nativos de Shopify (swatch.color o swatch.image). Un valor sin swatch nunca
   recibe un color deducido de su nombre: en la tarjeta muestra el nombre y en el filtro una
   trama neutra junto a la etiqueta visible. */
.card-swatch__color,
.facet__swatch {
  position: relative;
  display: block;
  flex: 0 0 auto;
  border: 1px solid var(--color-control-border);
  border-radius: 50%;
  /* Posicion y tamano van aparte: si el punto focal llega vacio, el fondo no se invalida
     entero, solo vuelve la posicion inicial. */
  background: var(--variant-swatch, repeating-linear-gradient(135deg, var(--color-surface) 0 3px, var(--color-surface-subtle) 3px 6px));
  background-position: var(--variant-swatch-position, center);
  background-repeat: no-repeat;
  background-size: cover;
  transition: transform var(--motion-fast) var(--ease-move), box-shadow var(--motion-fast) var(--ease-move);
}

.card-swatch__color {
  width: var(--card-swatch-size);
  height: var(--card-swatch-size);
}

.card-swatch:hover .card-swatch__color {
  transform: scale(1.08);
}

/* Anillo concentrico: separacion del color del fondo y trazo del texto, 3:1 o mas con
   cualquier esquema porque usa el propio primer plano. */
.card-swatch[aria-checked='true'] .card-swatch__color {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 3px var(--color-foreground);
}

.card-swatch:focus-visible {
  outline: none;
}

.card-swatch:focus-visible .card-swatch__color {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 5px;
}

.card-swatch--sold-out .card-swatch__color {
  opacity: 0.55;
}

.card-swatch--sold-out .card-swatch__color::after,
.facet__swatch-value--empty .facet__swatch::after {
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 1px;
  background: var(--color-foreground);
  content: '';
  transform: rotate(-45deg);
}

.card-swatch-more {
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-foreground-muted);
  text-decoration: none;
}

.card-swatch-more:hover {
  color: var(--color-foreground);
  text-decoration: underline;
}


/* Compra rapida. En escritorio el panel se apoya sobre la base de la imagen, justo encima
   del bloque de texto: no mueve la rejilla ni tapa el boton, el titulo o los swatches. En
   movil el mismo <dialog> se abre modal como hoja inferior. El ancla es el bloque de texto;
   por eso la accion, abierta, pierde su transform (que la convertiria en el ancla). */
.product-card__content {
  position: relative;
}

.js .quick-buy__fallback,
.no-js .quick-buy__trigger {
  display: none;
}

.quick-buy__panel {
  width: auto;
  max-width: none;
  margin: 0;
  padding: var(--space-sm);
  border: var(--border-width) solid var(--color-border);
  background: var(--color-background);
  color: var(--color-foreground);
}

.quick-buy__panel[open] {
  display: grid;
  gap: var(--space-xs);
}

.quick-buy__panel:not(:modal) {
  position: absolute;
  inset: auto 0 calc(100% + var(--space-2));
  z-index: 3;
  box-shadow: 0 -16px 32px -24px color-mix(in srgb, var(--color-shadow) 60%, transparent);
}

.quick-buy__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.quick-buy__title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.quick-buy__close {
  margin: calc(var(--space-sm) * -1) calc(var(--space-sm) * -1) calc(var(--space-sm) * -1) 0;
}

.quick-buy__product {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-foreground-muted);
}

/* Sobre la tarjeta el titulo ya esta a la vista: el del panel queda solo para lectores de
   pantalla, que lo reciben como descripcion del dialogo. */
.quick-buy__panel:not(:modal) .quick-buy__product {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.quick-buy__form {
  display: grid;
  gap: var(--space-xs);
}

.quick-buy__values {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.quick-buy__value {
  position: relative;
  display: inline-flex;
  min-width: var(--tap-target-min);
  max-width: 100%;
  min-height: var(--tap-target-min);
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-control-border);
  border-radius: var(--button-radius);
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  background: transparent;
  color: var(--color-foreground);
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.2;
  text-align: center;
  transition: background-color var(--motion-fast) var(--ease-move), color var(--motion-fast) var(--ease-move);
}

.quick-buy__value-price {
  font-size: 0.75rem;
  opacity: 0.8;
}

.quick-buy__value:hover:not([disabled]),
.quick-buy__value[aria-busy='true'] {
  border-color: var(--color-foreground);
  background: var(--color-foreground);
  color: var(--color-background);
}

.quick-buy__value:focus-visible {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 2px;
}

/* Agotado: trazo diagonal fino y texto atenuado; el lector de pantalla oye "Agotado". */
.quick-buy__value[disabled]:not([aria-busy='true']) {
  border-color: var(--color-border);
  background: linear-gradient(to top left, transparent calc(50% - 0.5px), var(--color-foreground-muted) 50%, transparent calc(50% + 0.5px));
  color: var(--color-foreground-muted);
  cursor: not-allowed;
}

.quick-buy__panel:modal {
  position: fixed;
  inset: auto 0 0;
  width: 100%;
  max-width: 100%;
  max-height: min(85vh, 36rem);
  overflow-y: auto;
  padding: var(--space-md) var(--page-gutter-mobile) calc(var(--space-md) + env(safe-area-inset-bottom, 0px));
  border-width: var(--border-width) 0 0;
}

.quick-buy__panel::backdrop {
  /* Mismo velo que el cajon; ::backdrop no hereda variables en navegadores antiguos, de ahi el respaldo. */
  background: color-mix(in srgb, var(--color-shadow, rgb(28 25 23)) 48%, transparent);
}

@media (prefers-reduced-motion: no-preference) {
  html[data-animations='subtle'] .quick-buy__panel[open],
  html[data-animations='full'] .quick-buy__panel[open] {
    animation: quick-buy-rise var(--motion-base) var(--ease-enter) both;
  }
}

@keyframes quick-buy-rise {
  from {
    opacity: 0;
    transform: translateY(var(--space-xs));
  }
}

/* Filtros con swatch: el checkbox sigue siendo el control real (mismo name y value, misma
   sumision estandar y AJAX); el circulo solo lo viste. */
.facet__values--swatch {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.25rem, 1fr));
  gap: var(--space-xs) var(--space-2xs);
}

.facet__swatch-value {
  position: relative;
  display: grid;
  min-height: var(--tap-target-min);
  padding-block: var(--space-2xs);
  justify-items: center;
  gap: var(--space-2xs);
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1.3;
  text-align: center;
}

.facet__swatch {
  width: 2rem;
  height: 2rem;
}

.facet__swatch-value:hover .facet__swatch {
  transform: scale(1.06);
}

.facet__swatch-input:checked + .facet__swatch {
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-foreground);
}

.facet__swatch-input:checked ~ .facet__swatch-label {
  font-weight: 700;
}

.facet__swatch-input:focus-visible + .facet__swatch {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 6px;
}

.facet__swatch-count {
  color: var(--color-foreground-muted);
  font-size: 0.6875rem;
}

.facet__swatch-value--empty {
  cursor: not-allowed;
}

.facet__swatch-value--empty > :not(input) {
  opacity: 0.45;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  align-items: center;
  justify-content: center;
  margin-block-start: var(--space-6);
}

.pagination__link,
.pagination__ellipsis {
  display: inline-grid;
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem;
  place-items: center;
}

.pagination [aria-current='page'] {
  border: 1px solid currentColor;
}

.cart-page__header {
  justify-content: space-between;
}

.cart-page__header h1 {
  letter-spacing: 0;
}

.cart-items {
  border-top: 1px solid var(--color-border);
}

.cart-item {
  display: grid;
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: var(--space-3);
}

.cart-item__media,
.cart-drawer-item__media {
  display: block;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-foreground) 5%, var(--color-background));
}

.cart-item__image,
.cart-drawer-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__details {
  --flow-space: var(--space-1);
}

.cart-item__title,
.cart-drawer-item__title {
  font-family: var(--font-body-family);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.35;
}

.cart-item__title a,
.cart-drawer-item__title a {
  color: currentColor;
  text-decoration: none;
}

.cart-item__options {
  display: grid;
  gap: 0.15rem;
  margin: 0;
  font-size: 0.8rem;
}

.cart-item__options div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.cart-item__options dt::after {
  content: ':';
}

.cart-item__options dd {
  margin: 0;
}

.cart-item__discounts li,
.cart-summary__discounts li {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.cart-item__price {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  align-items: baseline;
}

/* 4D-002. Stepper de cantidad (menos, campo, mas). Pieza compartida por el cajon y por
   la pagina de carrito. Una sola caja con hilo de 1px: los botones no llevan borde
   propio y se separan del campo con lineas internas, para que el control se lea como
   un objeto y no como tres piezas sueltas. Sin radio ni relleno de color, en la linea
   editorial del tema. */
.quantity-stepper {
  display: inline-grid;
  border: 1px solid var(--color-control-border);
  background: var(--color-background);
  grid-template-columns: var(--tap-target-min) minmax(2.25rem, 1fr) var(--tap-target-min);
}

.quantity-stepper__button {
  display: inline-flex;
  min-width: var(--tap-target-min);
  /* 44 x 44 px exactos en cualquier viewport. Es el criterio 2.5.8 de WCAG 2.2 que
     revisa la Theme Store, no una holgura estetica. */
  min-height: var(--tap-target-min);
  padding: 0;
  border: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-move);
}

.quantity-stepper__button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

/* El anillo de foco se dibuja hacia dentro: con el outline-offset global de 3px
   quedaria por fuera de la caja y pisaria el borde del stepper. */
.quantity-stepper__button:focus-visible,
.quantity-stepper__input:focus-visible {
  outline-offset: -3px;
}

/* El selector va doblado a proposito. La regla global de campos es
   input:not([type='checkbox'], [type='radio']), y :not() suma la especificidad de su
   argumento: (0,1,1) contra los (0,1,0) de una clase suelta. Sin doblar, el campo se
   quedaba con el borde y el relleno de un input normal y el stepper se leia como tres
   cajas apiladas en vez de una sola pieza. */
.quantity-stepper .quantity-stepper__input {
  width: 100%;
  min-height: var(--tap-target-min);
  padding: 0 0.25rem;
  border: 0;
  /* Hilos internos en el borde suave, no en el de control: separan lo justo para que se
     vean tres zonas pulsables sin que el conjunto parezca una tabla. */
  border-inline: 1px solid var(--color-border);
  border-radius: 0;
  background: transparent;
  font-variant-numeric: tabular-nums;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}

/* Las flechas nativas duplicarian el control, y ademas son objetivos tactiles de
   unos 10 px que arruinarian la reticula de 44 px. */
.quantity-stepper__input::-webkit-outer-spin-button,
.quantity-stepper__input::-webkit-inner-spin-button {
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
}

/* Mientras el cajon espera al servidor, setDrawerBusy deshabilita el campo. Eso es una
   espera, no un control muerto, asi que el numero se mantiene legible: el mismo criterio
   que el tema ya aplica a .button[aria-busy='true']:disabled. */
[aria-busy='true'] .quantity-stepper__input:disabled {
  cursor: progress;
  opacity: 1;
}

/* Sin JavaScript los botones no pueden hacer nada, asi que se retiran en vez de quedarse
   como controles muertos. El campo sobrevive y sigue siendo funcional: en la pagina de
   carrito con el boton "Update cart", y en el cajon porque el cajon no existe sin JS. */
.no-js .quantity-stepper__button {
  display: none;
}

.no-js .quantity-stepper {
  /* El ancho que tenia el campo antes del stepper: sin botones, una caja de 50 px seria
     un retroceso frente a la version que este sprint sustituye. */
  grid-template-columns: minmax(5rem, 7rem);
}

.no-js .quantity-stepper .quantity-stepper__input {
  border-inline: 0;
}

.cart-item__controls {
  display: grid;
  grid-column: 2;
  /* max-content para que el stepper entre entero (44 + campo + 44) sin comprimirse. */
  grid-template-columns: max-content auto;
  gap: var(--space-2);
  align-items: end;
}

.cart-item__controls label {
  grid-column: 1 / -1;
  margin-block-end: 0;
}

.cart-page__footer {
  display: grid;
  gap: var(--space-5);
  margin-block-start: var(--space-5);
}

.cart-summary {
  --flow-space: var(--space-2);
}

.cart-summary__discounts {
  display: grid;
  gap: var(--space-1);
}

.cart-summary__discounts li,
.cart-summary__subtotal {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.cart-summary__taxes {
  font-size: 0.8rem;
  opacity: 0.76;
}

.cart-summary__actions {
  display: grid;
  gap: var(--space-2);
}

.cart-drawer {
  position: relative;
  z-index: 200;
}

.cart-drawer__overlay {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  background: color-mix(in srgb, var(--color-shadow) 48%, transparent);
}

.cart-drawer__panel {
  display: flex;
  width: min(100%, 31rem);
  height: 100%;
  min-height: 100dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-inline-start: 1px solid var(--color-border);
  flex-direction: column;
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
  box-shadow: 0 0 2.5rem color-mix(in srgb, var(--color-shadow) 22%, transparent);
}

.cart-drawer__header {
  position: sticky;
  z-index: 2;
  inset-block-start: 0;
  display: flex;
  min-height: 5.5rem;
  padding: var(--space-3) var(--page-gutter);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  background: var(--color-background);
}

.cart-drawer__header .eyebrow {
  margin-block-end: 0.25rem;
}

.cart-drawer__title {
  font-size: 1.65rem;
  letter-spacing: 0;
}

.cart-drawer__content {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.cart-rewards {
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-md) var(--page-gutter);
  border-bottom: var(--border-width) solid var(--color-border-hairline);
  background: var(--color-surface);
}

.cart-rewards__message {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
}

.cart-rewards__track {
  position: relative;
  height: 5px;
  margin-block: var(--space-2xs) var(--space-xs);
  background: var(--color-surface-subtle);
}

.cart-rewards__fill {
  position: absolute;
  width: var(--cart-progress, 0%);
  height: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
  background: var(--color-accent);
  transition: width var(--motion-base) var(--ease-move);
}

.cart-rewards__marker {
  position: absolute;
  width: 0.875rem;
  height: 0.875rem;
  inset-block-start: 50%;
  inset-inline-start: var(--marker-position);
  transform: translate(-50%, -50%);
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  background: var(--color-background);
}

.cart-rewards__marker[data-unlocked] {
  background: var(--color-accent);
}

.cart-rewards__milestones {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
  color: var(--color-foreground);
  font-size: 0.6875rem;
  line-height: 1.35;
}

.cart-rewards__milestones span:last-child {
  text-align: end;
}

.cart-drawer__empty {
  margin: auto;
  padding: var(--space-6) var(--page-gutter);
  text-align: center;
}

.cart-drawer__form {
  display: flex;
  min-height: 100%;
  flex: 1;
  flex-direction: column;
}

.cart-drawer__items {
  padding-inline: var(--page-gutter);
}

.cart-drawer-item {
  position: relative;
  display: grid;
  padding-block: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  grid-template-columns: 5.5rem minmax(0, 1fr) auto;
  gap: var(--space-2);
}

.cart-drawer-item__media {
  aspect-ratio: 4 / 5;
}

.cart-drawer-item__details {
  display: grid;
  align-content: start;
  gap: 0.4rem;
}

.cart-drawer-item__details p,
.cart-drawer-item__title {
  margin: 0;
}

.cart-drawer-item__price {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  font-size: 0.875rem;
}

.cart-drawer-item__stepper {
  /* El stepper es inline-grid, asi que se mide por su contenido; el maximo solo evita
     que el campo se estire en lineas con titulos cortos. */
  max-width: 9rem;
}

.cart-drawer-item__remove {
  align-self: start;
}

.cart-cross-sell {
  display: grid;
  gap: var(--space-md);
  margin: var(--space-md) var(--page-gutter) 0;
  padding: var(--space-md);
  background: var(--color-surface);
}

.cart-cross-sell__heading {
  margin: 0;
  font-family: var(--font-heading-family);
  font-size: 1.25rem;
  line-height: 1.2;
}

.cart-cross-sell__list {
  display: grid;
  gap: var(--space-sm);
}

.cart-cross-sell__item {
  display: grid;
  min-width: 0;
  grid-template-columns: 4rem minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-sm);
}

.cart-cross-sell__item:focus-visible {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 3px;
}

.cart-cross-sell__media {
  width: 4rem;
  height: 4rem;
  overflow: hidden;
  background: var(--color-surface-subtle);
}

.cart-cross-sell__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-cross-sell__details {
  display: grid;
  min-width: 0;
  gap: var(--space-2xs);
}

.cart-cross-sell__title,
.cart-cross-sell__price {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
}

.cart-cross-sell__title {
  /* Fase 2 (GPT-021): un titulo largo se parte en lineas; nunca se recorta. */
  font-weight: 700;
  overflow-wrap: anywhere;
}

.cart-cross-sell__price {
  color: var(--color-foreground-muted);
}

.cart-cross-sell__button {
  min-width: 4.5rem;
  min-height: var(--tap-target-min);
  padding-inline: var(--space-xs);
  border: var(--border-width) solid var(--color-foreground);
  border-radius: var(--button-radius);
  background: var(--color-background);
  color: var(--color-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.cart-cross-sell__button[aria-busy='true'] [data-cross-sell-label] {
  opacity: 1;
}

.cart-cross-sell__button .button__spinner {
  margin-inline-start: var(--space-2xs);
}

/* ---------- Fase 2 (GPT-021). Recomendaciones del cajon: opciones inline ---------- */
/* El panel de opciones ocupa todo el ancho de la tarjeta y crece dentro de
   .cart-drawer__scroll: nunca empuja el pie. Chips de 44 x 44 CSS px como minimo con el
   radio nativo encima (opacidad 0, enfocable); el anillo de foco y la seleccion se pintan
   en el chip. "No disponible" combina borde discontinuo, tachado y texto oculto. */
.cart-cross-sell-slot {
  min-width: 0;
}

/* La lista es un <ul role="list">: sin sangria ni vinetas del navegador. */
.cart-cross-sell__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-cross-sell__list > li {
  min-width: 0;
}

.cart-cross-sell__price {
  overflow-wrap: anywhere;
}

.cart-cross-sell__placeholder {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: var(--color-surface-subtle);
}

.cart-cross-sell__button[aria-expanded='true'] {
  background: var(--color-foreground);
  color: var(--color-background);
}

.cart-cross-sell__link {
  min-height: var(--tap-target-min);
  max-width: 100%;
  padding: var(--space-2xs) var(--space-xs);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}

.cart-cross-sell__options {
  display: grid;
  min-width: 0;
  grid-column: 1 / -1;
  gap: var(--space-sm);
  padding-block-start: var(--space-sm);
  border-top: var(--border-width) solid var(--color-border);
}

.cart-cross-sell__fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.cart-cross-sell__legend {
  max-width: 100%;
  margin-block-end: var(--space-2xs);
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.cart-cross-sell__chips {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.cart-cross-sell__chip {
  position: relative;
  display: inline-flex;
  min-width: var(--tap-target-min);
  max-width: 100%;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) var(--space-sm);
  border: var(--border-width) solid var(--color-control-border);
  border-radius: var(--button-radius);
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  color: var(--color-foreground);
  cursor: pointer;
  font-size: 0.8125rem;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
}

.cart-cross-sell__radio {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  appearance: none;
  cursor: pointer;
}

.cart-cross-sell__chip-label {
  min-width: 0;
}

@media (hover: hover) {
  .cart-cross-sell__chip:hover {
    border-color: var(--color-foreground);
  }
}

.cart-cross-sell__chip[data-unavailable] {
  border-style: dashed;
}

.cart-cross-sell__chip[data-unavailable] .cart-cross-sell__chip-label {
  text-decoration: line-through;
}

.cart-cross-sell__chip:has(.cart-cross-sell__radio:checked) {
  border-color: var(--color-foreground);
  background: var(--color-foreground);
  color: var(--color-background);
}

.cart-cross-sell__chip:has(.cart-cross-sell__radio:focus-visible) {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 2px;
}

/* Sin :has() (navegadores anteriores a 2023) el chip no puede pintarse desde el radio: la
   etiqueta hermana (el input la precede) marca seleccion y foco. */
@supports not selector(:has(*)) {
  .cart-cross-sell__radio:checked + .cart-cross-sell__chip-label {
    font-weight: 700;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.25em;
  }

  .cart-cross-sell__chip[data-unavailable] .cart-cross-sell__radio:checked + .cart-cross-sell__chip-label {
    text-decoration-line: underline line-through;
  }

  .cart-cross-sell__radio:focus-visible + .cart-cross-sell__chip-label {
    outline: var(--focus-width) solid var(--color-foreground);
    outline-offset: 2px;
  }
}

/* Colores forzados (alto contraste): el sistema anula fondos y bordes del tema, asi que la
   seleccion se pinta con Highlight y el foco con CanvasText. Cada selector va en su propia
   regla: un navegador sin :has() descartaria la lista entera. */
@media (forced-colors: active) {
  .cart-cross-sell__chip:has(.cart-cross-sell__radio:checked) {
    border-color: Highlight;
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }

  .cart-cross-sell__radio:checked + .cart-cross-sell__chip-label {
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }

  .cart-cross-sell__chip:has(.cart-cross-sell__radio:focus-visible) {
    outline: 2px solid CanvasText;
    outline-offset: 2px;
  }

  @supports not selector(:has(*)) {
    .cart-cross-sell__radio:focus-visible + .cart-cross-sell__chip-label {
      outline: 2px solid CanvasText;
      outline-offset: 2px;
    }
  }
}

.cart-cross-sell__options-status {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.cart-cross-sell__options-actions {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.cart-cross-sell__cancel {
  display: inline-flex;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0 var(--space-xs);
  border: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--color-foreground);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.cart-drawer__uncertain {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: var(--space-xs);
  padding: 0 var(--page-gutter) var(--space-2);
  background: var(--color-background);
}

.cart-drawer__check {
  max-width: 100%;
}

/* Cajon estrecho (menos de 30rem: el panel ocupa todo el ancho): la accion baja bajo el
   titulo para que titulo, precio y boton no se disputen una sola fila a 320 px. */
@media (max-width: 29.99rem) {
  .cart-cross-sell__item {
    grid-template-columns: 4rem minmax(0, 1fr);
    align-items: start;
  }

  .cart-cross-sell__media {
    grid-row: span 2;
  }

  .cart-cross-sell__item > .cart-cross-sell__button,
  .cart-cross-sell__item > .cart-cross-sell__link {
    grid-column: 2;
    justify-self: start;
  }
}
/* ---------- Fin Fase 2 (GPT-021) ---------- */

.cart-drawer__footer {
  --flow-space: var(--space-3);
  margin-block-start: auto;
  padding: var(--space-4) var(--page-gutter) max(var(--space-4), env(safe-area-inset-bottom));
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.cart-drawer__view-cart {
  display: block;
  min-height: 44px;
  padding: 0.7rem;
  text-align: center;
}

.cart-drawer__message {
  margin: 0;
  padding: var(--space-2) var(--page-gutter);
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
  font-size: 0.875rem;
}

/* Homepage editorial system */

.homepage-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  fill: color-mix(in srgb, var(--color-foreground) 14%, var(--color-surface));
}

.hero-editorial.section {
  padding-block: 0;
  border-bottom: var(--border-width) solid var(--color-border-hairline);
}

.editorial-hero {
  display: block;
}

.hero-editorial__inner {
  display: grid;
  width: var(--content-width);
  margin-inline: auto;
  padding: var(--space-xl) 0;
  grid-template-areas: 'content' 'media';
  gap: var(--space-lg);
}

.hero-editorial__content {
  display: grid;
  grid-area: content;
  align-content: end;
  gap: var(--space-lg);
}

.hero-editorial__intro {
  --flow-space: var(--space-md);
}

.hero-editorial__heading {
  max-width: 11ch;
  font-size: min(3.25rem, calc(2.75rem * var(--font-heading-scale)), 10.5vw);
  letter-spacing: 0;
  line-height: 1.04;
  /* Titulares grandes: nunca partir una palabra para ajustar el ancho (en y es). */
  overflow-wrap: break-word;
}

.hero-editorial__subheading {
  max-width: 38ch;
  color: var(--color-foreground-muted);
  font-size: 1rem;
  line-height: 1.55;
}

.hero-editorial__subheading > :first-child {
  margin-block-start: 0;
}

.hero-editorial__media {
  position: relative;
  grid-area: media;
  height: min(34rem, var(--hero-height-mobile));
  overflow: hidden;
  border: var(--border-width) solid var(--color-border-hairline);
  background: var(--color-surface);
}

.hero-editorial__media picture,
.hero-editorial__poster,
.hero-editorial__placeholder,
.hero-editorial__image,
.hero-editorial__video {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-editorial__image,
.hero-editorial__video {
  object-fit: cover;
}

.hero-editorial__image {
  object-position: var(--hero-focal-point, center);
}

.hero-editorial__video {
  position: absolute;
  z-index: 1;
  inset: 0;
  opacity: 0;
  transition: opacity var(--motion-base) var(--ease-enter);
}

.editorial-hero[data-video-active] .hero-editorial__video {
  opacity: 1;
}

.hero-editorial__overlay {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  inset: 0;
}

.hero-editorial__overlay--scrim {
  background: rgb(0 0 0 / var(--hero-overlay-opacity));
}

.hero-editorial__overlay--gradient_bottom {
  background: linear-gradient(to top, rgb(0 0 0 / var(--hero-overlay-opacity)), transparent 72%);
}

.hero-editorial__actions {
  display: grid;
  gap: var(--space-sm);
}

.hero-editorial__button {
  width: 100%;
  min-height: 52px;
  justify-content: space-between;
  gap: var(--space-md);
  letter-spacing: 0;
}

.hero-editorial--cinematic .hero-editorial__inner {
  position: relative;
  width: 100%;
  max-width: none;
  min-height: var(--hero-height-mobile);
  padding: 0;
  grid-template-areas: 'hero';
}

.hero-editorial--cinematic .hero-editorial__media,
.hero-editorial--cinematic .hero-editorial__content {
  grid-area: hero;
}

.hero-editorial--cinematic .hero-editorial__media {
  height: auto;
  min-height: inherit;
  border: 0;
}

.hero-editorial--cinematic .hero-editorial__content {
  z-index: 3;
  width: min(calc(100% - (2 * var(--page-gutter-mobile))), max(18rem, var(--hero-content-width)));
  margin: var(--page-gutter-mobile);
  align-self: end;
  justify-self: start;
  color: var(--color-foreground);
}

.hero-editorial--cinematic.hero-editorial--x-center .hero-editorial__content {
  justify-self: center;
}

.hero-editorial--cinematic.hero-editorial--x-end .hero-editorial__content {
  justify-self: end;
}

.hero-editorial--cinematic.hero-editorial--y-start .hero-editorial__content {
  align-self: start;
}

.hero-editorial--cinematic.hero-editorial--y-center .hero-editorial__content {
  align-self: center;
}

.hero-editorial--align-center .hero-editorial__content {
  text-align: center;
}

.hero-editorial--align-right .hero-editorial__content {
  text-align: right;
}

.hero-editorial--align-center .hero-editorial__actions,
.hero-editorial--align-right .hero-editorial__actions {
  justify-content: inherit;
}



/* AUDIT-PRESETS-001. Titular y subtitulo tienen max-width: con texto centrado o a la derecha,
   su caja tambien se centra o se alinea a la derecha. Sin esto, en Archive (align-center) el
   subtitulo queda 141 px a la izquierda del eje a 1280 px. */
.hero-editorial--align-center .hero-editorial__heading,
.hero-editorial--align-center .hero-editorial__subheading {
  margin-inline: auto;
}

.hero-editorial--align-right .hero-editorial__heading,
.hero-editorial--align-right .hero-editorial__subheading {
  margin-inline-start: auto;
}

curated-showcase {
  display: block;
}

.curated-showcase.section {
  padding-block: var(--space-3xl);
}

.curated-showcase__inner {
  width: var(--content-width);
  margin-inline: auto;
}

.curated-showcase__header {
  display: grid;
  padding-block-end: var(--space-md);
  border-bottom: var(--border-width) solid var(--color-border-hairline);
  gap: var(--space-lg);
}

.curated-showcase__header .flow {
  --flow-space: var(--space-sm);
}

.curated-showcase__heading,
.bento-discovery__heading {
  max-width: 19ch;
  font-size: calc(2.25rem * var(--font-heading-scale));
  letter-spacing: 0;
  line-height: 1.08;
}

.curated-showcase__subheading,
.bento-discovery__subheading {
  max-width: 42ch;
  color: var(--color-foreground-muted);
  line-height: 1.55;
}

.curated-showcase__subheading > :first-child,
.bento-discovery__subheading > :first-child {
  margin-block-start: 0;
}

.curated-showcase__tabs {
  display: flex;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.curated-showcase__tab {
  position: relative;
  display: inline-flex;
  min-width: max-content;
  min-height: 52px;
  padding: var(--space-xs) var(--space-sm);
  border: 0;
  align-items: center;
  gap: var(--space-xs);
  background: transparent;
  color: var(--color-foreground-muted);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0;
  text-align: start;
  text-transform: uppercase;
}

.curated-showcase__tab::after {
  position: absolute;
  height: 2px;
  inset-block-end: 0;
  inset-inline: var(--space-sm);
  transform: scaleX(0);
  background: currentColor;
  content: '';
  transform-origin: left;
  transition: transform var(--motion-fast) var(--ease-move);
}

.curated-showcase__tab:focus-visible {
  outline-offset: -2px;
}

.curated-showcase__tab:hover,
.curated-showcase__tab[aria-selected='true'] {
  color: var(--color-foreground);
}

.curated-showcase__tab[aria-selected='true']::after {
  transform: scaleX(1);
}

.curated-showcase__panels {
  margin-block-start: var(--space-lg);
}

.curated-showcase__panel {
  display: grid;
  gap: var(--space-xl);
}

.curated-showcase__spotlight {
  display: grid;
  min-width: 0;
  gap: var(--space-md);
}

.curated-showcase__spotlight-media {
  display: block;
  overflow: hidden;
  border: var(--border-width) solid var(--color-border-hairline);
  aspect-ratio: 1 / 1;
  background: var(--color-surface);
}

.curated-showcase__spotlight-image,
.curated-showcase__placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--motion-slow) var(--ease-move);
}

.curated-showcase__spotlight-media:hover .curated-showcase__spotlight-image,
.curated-showcase__spotlight-media:focus-visible .curated-showcase__spotlight-image {
  transform: scale(1.012);
}

.curated-showcase__spotlight-details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--space-xs) var(--space-md);
}

.curated-showcase__spotlight-details .eyebrow {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-foreground-muted);
}

.curated-showcase__spotlight-title {
  font-size: 1.75rem;
  letter-spacing: 0;
  line-height: 1.15;
}

.curated-showcase__spotlight-title a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  color: currentColor;
  text-decoration: none;
}

.curated-showcase__supporting {
  display: grid;
  gap: var(--space-lg);
}

.curated-showcase__supporting .product-card {
  padding-block-start: var(--space-md);
  border-top: var(--border-width) solid var(--color-border-hairline);
  grid-template-columns: minmax(7.5rem, 42%) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-md);
}

.curated-showcase__supporting .product-card__media {
  aspect-ratio: 3 / 4;
}

.curated-showcase__supporting .product-card__title {
  font-family: var(--font-heading-family);
  font-size: 1.25rem;
  font-weight: var(--font-heading-weight);
  line-height: 1.2;
}

.curated-showcase__supporting .product-card__title a,
.bento-discovery__item--product .product-card__title a {
  display: flex;
  min-height: var(--tap-target-min);
  align-items: center;
}

.curated-showcase__placeholder-line,
.bento-discovery__placeholder-line {
  display: block;
  width: 82%;
  height: 0.75rem;
  background: var(--color-surface-subtle);
}

.curated-showcase__placeholder-line--short,
.bento-discovery__placeholder-line--short {
  width: 48%;
}

.curated-showcase__footer {
  display: flex;
  min-height: var(--tap-target-min);
  padding-block-start: var(--space-md);
  border-top: var(--border-width) solid var(--color-border-hairline);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.curated-showcase__footer a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-foreground);
  text-align: end;
  text-decoration: none;
}

.brand-manifesto.section {
  padding-block: var(--space-3xl);
}

.brand-manifesto--surface {
  background: var(--color-surface);
}

.brand-manifesto__inner {
  display: grid;
  width: var(--content-width);
  margin-inline: auto;
  gap: var(--space-2xl);
}

.brand-manifesto__statement {
  display: grid;
  align-content: start;
  gap: var(--space-lg);
}

.brand-manifesto__quote {
  position: relative;
  margin: 0;
  padding-inline-start: var(--space-xl);
}

.brand-manifesto__quote-mark {
  position: absolute;
  inset-block-start: -1.5rem;
  inset-inline-start: 0;
  color: var(--color-foreground-muted);
  font-family: var(--font-heading-family);
  font-size: 4.25rem;
  line-height: 1;
}

.brand-manifesto__quote h2 {
  max-width: 18ch;
  margin: 0;
  font-family: var(--font-heading-family);
  font-size: calc(2.375rem * var(--font-heading-scale));
  font-style: var(--font-heading-style);
  font-weight: var(--font-heading-weight);
  letter-spacing: 0;
  line-height: 1.13;
}

.brand-manifesto__quote footer {
  margin-block-start: var(--space-md);
}

.brand-manifesto__quote cite {
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.brand-manifesto__body {
  max-width: 58ch;
  padding-inline-start: var(--space-xl);
  color: var(--color-foreground-muted);
  line-height: 1.6;
}

.brand-manifesto__button {
  width: fit-content;
  min-height: 48px;
  margin-inline-start: var(--space-xl);
  gap: var(--space-sm);
  letter-spacing: 0;
}

.brand-manifesto__material {
  display: grid;
  align-content: start;
  gap: var(--space-lg);
}

.brand-manifesto__media {
  position: relative;
  overflow: hidden;
  border: var(--border-width) solid var(--color-border-hairline);
  aspect-ratio: 17 / 10;
  background: var(--color-surface-subtle);
}

.brand-manifesto__image,
.brand-manifesto__placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-manifesto__media-label {
  position: absolute;
  min-height: 36px;
  margin: 0;
  padding: var(--space-xs) var(--space-sm);
  inset-block-end: var(--space-xs);
  inset-inline-start: var(--space-xs);
  background: var(--color-foreground);
  color: var(--color-background);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.4;
  text-transform: uppercase;
}

.brand-manifesto__details {
  margin: 0;
  border-top: var(--border-width) solid var(--color-border-hairline);
}

.brand-manifesto__detail {
  display: grid;
  min-height: 52px;
  padding-block: var(--space-xs);
  border-bottom: var(--border-width) solid var(--color-border-hairline);
  grid-template-columns: minmax(5.5rem, 0.8fr) minmax(0, 1.7fr) auto;
  align-items: center;
  gap: var(--space-sm);
}

.brand-manifesto__detail dt,
.brand-manifesto__detail > .brand-manifesto__index {
  color: var(--color-foreground-muted);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.brand-manifesto__detail dd {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
}

/* El indice es un dd (en un dl solo caben dt y dd) pero conserva la medida del span anterior. */
.brand-manifesto__detail > .brand-manifesto__index {
  line-height: inherit;
}

.bento-discovery.section {
  padding-block: var(--space-3xl);
}

.bento-discovery__inner {
  width: var(--content-width);
  margin-inline: auto;
}

.bento-discovery__header {
  display: grid;
  margin-block-end: var(--space-xl);
  gap: var(--space-md);
}

.bento-discovery__grid {
  display: grid;
  gap: var(--space-md);
}

.bento-discovery__item {
  min-width: 0;
}

.bento-card {
  display: grid;
  min-width: 0;
  overflow: hidden;
  border: var(--border-width) solid var(--color-border-hairline);
  background: var(--color-surface);
  color: var(--color-foreground);
  text-decoration: none;
}

.bento-card__media {
  display: block;
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 9 / 8;
  background: var(--color-surface-subtle);
}

.bento-card__image,
.bento-card__placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--motion-slow) var(--ease-move);
}

.bento-card:hover .bento-card__image,
.bento-card:focus-visible .bento-card__image {
  transform: scale(1.012);
}

.bento-card__content {
  display: grid;
  min-height: 4.5rem;
  padding: var(--space-sm) var(--space-md);
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2xs) var(--space-md);
  background: var(--color-foreground);
  color: var(--color-background);
}

.bento-card__eyebrow {
  grid-column: 1 / -1;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bento-card__title {
  font-family: var(--font-heading-family);
  font-size: 1.375rem;
  font-weight: var(--font-heading-weight);
  letter-spacing: 0;
  line-height: 1.15;
}

.bento-card--editorial {
  min-height: 15rem;
  grid-template-rows: auto 1fr;
}

.bento-card--editorial-text {
  grid-template-rows: minmax(15rem, 1fr);
}

.bento-card--editorial-text .bento-card__editorial-copy {
  min-height: 100%;
}

.bento-card__media--editorial {
  aspect-ratio: 16 / 9;
}

.bento-card__editorial-copy {
  display: grid;
  padding: var(--space-lg);
  align-content: center;
  gap: var(--space-sm);
}

.bento-card__editorial-copy .bento-card__eyebrow {
  color: var(--color-foreground-muted);
}

.bento-card__body {
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
  line-height: 1.55;
}

.bento-card__body > :first-child {
  margin-block-start: 0;
}

.bento-card__cta {
  display: inline-flex;
  width: fit-content;
  min-height: var(--tap-target-min);
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.8125rem;
  font-weight: 700;
}

.bento-discovery__item--product .product-card,
.bento-discovery__product-placeholder {
  display: grid;
  height: 100%;
  padding: var(--space-md);
  border: var(--border-width) solid var(--color-border-hairline);
  grid-template-columns: minmax(7.5rem, 42%) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-md);
  background: var(--color-background);
}

.bento-discovery__item--product .product-card__media,
.bento-discovery__product-placeholder .product-card__media {
  aspect-ratio: 3 / 4;
}

.bento-discovery__placeholder-line {
  grid-column: 2;
  align-self: end;
}

.bento-discovery__placeholder-line--short {
  align-self: start;
}

marquee-banner {
  display: block;
}

.marquee-banner {
  border-block: var(--border-width) solid var(--color-border-hairline);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.marquee-banner__inner {
  display: grid;
  min-height: 48px;
  grid-template-columns: minmax(0, 1fr) var(--tap-target-min);
}

.marquee-banner__viewport {
  min-width: 0;
  overflow: hidden;
}

.marquee-banner__track,
.marquee-banner__group {
  display: flex;
  width: max-content;
  min-height: 48px;
  align-items: stretch;
}

.marquee-banner__group {
  flex: none;
}

.marquee-banner__item {
  display: inline-flex;
  min-height: 48px;
  padding-inline: var(--space-lg);
  align-items: center;
  gap: var(--space-lg);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  line-height: 1.2;
  text-transform: uppercase;
  white-space: nowrap;
}

.marquee-banner__item::after {
  width: 0.375rem;
  height: 0.375rem;
  flex: 0 0 auto;
  transform: rotate(45deg);
  background: currentColor;
  content: '';
}

.marquee-banner__toggle {
  position: relative;
  z-index: 1;
  display: grid;
  width: var(--tap-target-min);
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0;
  border: 0;
  border-inline-start: var(--border-width) solid var(--color-border-hairline);
  place-items: center;
  background: var(--color-background);
  color: currentColor;
  cursor: pointer;
}

.marquee-banner__pause-icon,
.marquee-banner__play-icon {
  position: relative;
  display: block;
  width: 1rem;
  height: 1rem;
  grid-area: 1 / 1;
}

.marquee-banner__pause-icon::before,
.marquee-banner__pause-icon::after {
  position: absolute;
  width: 2px;
  height: 0.75rem;
  inset-block-start: 0.125rem;
  background: currentColor;
  content: '';
}

.marquee-banner__pause-icon::before {
  inset-inline-start: 0.25rem;
}

.marquee-banner__pause-icon::after {
  inset-inline-end: 0.25rem;
}

.marquee-banner__play-icon::before {
  position: absolute;
  inset: 0.125rem 0.1875rem;
  border-block: 0.375rem solid transparent;
  border-inline-start: 0.625rem solid currentColor;
  content: '';
}

.marquee-banner:not([data-paused]) .marquee-banner__play-icon,
.marquee-banner[data-paused] .marquee-banner__pause-icon {
  display: none;
}

.marquee-banner:hover .marquee-banner__track,
.marquee-banner:focus-within .marquee-banner__track,
.marquee-banner[data-paused] .marquee-banner__track {
  /* Dos valores para las dos animaciones que el modo full monta sobre el track (B8.2e): se
     detiene la banda y el desplazamiento ligado al scroll sigue. Pausar el segundo lo
     congelaria en el punto de scroll de la pausa y al reanudar saltaria de golpe al valor
     que le toca. Donde solo hay una animacion el segundo valor sobra sin efecto. */
  animation-play-state: paused, running;
}

.marquee-banner__toggle:hover,
.marquee-banner__toggle:focus-visible {
  background: var(--color-surface);
}

@media (min-width: 48rem) {
  .hero-editorial__actions {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  }

  .bento-discovery__header {
    grid-template-columns: minmax(0, 1.4fr) minmax(16rem, 0.6fr);
    align-items: end;
  }

  .bento-discovery__subheading {
    justify-self: end;
    text-align: end;
  }
}

@media (min-width: 62rem) {
  .hero-editorial--split .hero-editorial__inner {
    padding: var(--page-gutter-desktop) 0;
    grid-template-columns: minmax(0, 3fr) minmax(24rem, 2fr);
    grid-template-areas: 'media content';
    gap: var(--space-lg) var(--space-3xl);
  }

  .hero-editorial--split-65_35.hero-editorial--split .hero-editorial__inner {
    grid-template-columns: minmax(0, 13fr) minmax(20rem, 7fr);
  }

  .hero-editorial--split-50_50.hero-editorial--split .hero-editorial__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-editorial--text_first.hero-editorial--split .hero-editorial__inner {
    grid-template-columns: minmax(24rem, 2fr) minmax(0, 3fr);
    grid-template-areas: 'content media';
  }

  .hero-editorial--split-65_35.hero-editorial--text_first.hero-editorial--split .hero-editorial__inner {
    grid-template-columns: minmax(20rem, 7fr) minmax(0, 13fr);
  }

  .hero-editorial--split-50_50.hero-editorial--text_first.hero-editorial--split .hero-editorial__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-editorial--split .hero-editorial__media {
    height: min(51rem, var(--hero-height-desktop));
    min-height: 34rem;
  }

  .hero-editorial--cinematic .hero-editorial__inner {
    min-height: var(--hero-height-desktop);
    padding: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'hero';
    gap: 0;
  }

  .hero-editorial--cinematic .hero-editorial__content {
    width: min(calc(100% - (2 * var(--page-gutter-desktop))), var(--hero-content-width));
    margin: var(--page-gutter-desktop);
  }

  .hero-editorial__heading {
    font-size: calc(4.5rem * var(--font-heading-scale));
    line-height: 1.06;
  }



  /* AUDIT-PRESETS-001. Hero centrado: entre 992 y 1277 px la palabra mas larga no cabe en la
     columna y el bloque se descentra. 6.2vw solo actua en ese tramo (a 1280 px ya vale 79 px).
     Los heroes alineados a la izquierda (Sartorial, Couture, Edition) no cambian. */
  .hero-editorial--align-center .hero-editorial__heading {
    font-size: min(calc(4.5rem * var(--font-heading-scale)), 6.2vw);
  }

  .hero-editorial--split .hero-editorial__actions {
    align-self: start;
  }

  .curated-showcase.section,
  .brand-manifesto.section,
  .bento-discovery.section {
    padding-block: var(--space-4xl);
  }

  .curated-showcase__inner,
  .brand-manifesto__inner,
  .bento-discovery__inner {
    width: var(--content-width);
  }

  .curated-showcase__header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .curated-showcase__heading,
  .bento-discovery__heading {
    font-size: calc(2.875rem * var(--font-heading-scale));
  }

  .curated-showcase__tabs {
    justify-self: end;
  }

  .curated-showcase__panel {
    grid-template-columns: minmax(0, 1.18fr) minmax(25rem, 0.82fr);
    gap: var(--space-xl);
  }

  .curated-showcase__spotlight-media {
    aspect-ratio: 23 / 20;
  }

  .curated-showcase__supporting {
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: var(--space-xl);
  }

  .curated-showcase__supporting .product-card {
    height: 100%;
    padding-block-start: 0;
    grid-template-columns: minmax(12rem, 0.95fr) minmax(0, 1fr);
  }

  .curated-showcase__supporting .product-card__media {
    height: 100%;
    min-height: 18rem;
    aspect-ratio: auto;
  }

  .curated-showcase__footer {
    grid-column: 1 / -1;
  }

  .brand-manifesto__inner {
    grid-template-columns: minmax(0, 1.75fr) minmax(25rem, 1fr);
    align-items: start;
    gap: var(--space-4xl);
  }

  .brand-manifesto__statement {
    min-height: 100%;
    padding-block-start: var(--space-lg);
  }

  .brand-manifesto__quote {
    padding-inline-start: var(--space-4xl);
  }

  .brand-manifesto__quote h2 {
    font-size: calc(3.5rem * var(--font-heading-scale));
    line-height: 1.2;
  }

  .brand-manifesto__quote-mark {
    font-size: 5.75rem;
  }

  .brand-manifesto__body {
    margin-inline-start: var(--space-4xl);
    padding-inline-start: 0;
  }

  .brand-manifesto__button {
    margin-inline-start: var(--space-4xl);
  }

  .brand-manifesto__media {
    aspect-ratio: 30 / 19;
  }

  .bento-discovery__grid {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1fr);
    grid-template-rows: repeat(2, minmax(18rem, 1fr));
    gap: var(--space-xl);
  }

  .bento-discovery__item--featured {
    grid-row: 1 / span 2;
  }

  .bento-discovery__item--featured .bento-card,
  .bento-discovery__item--editorial .bento-card,
  .bento-discovery__item--product > * {
    height: 100%;
  }

  .bento-card--featured {
    grid-template-rows: minmax(0, 1fr) auto;
  }

  .bento-card--featured .bento-card__media {
    height: 100%;
    aspect-ratio: auto;
  }

  .bento-card--editorial {
    grid-template-columns: minmax(0, 1.08fr) minmax(16rem, 0.92fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .bento-card--editorial-text {
    grid-template-columns: minmax(0, 1fr);
  }

  .bento-card__media--editorial {
    height: 100%;
    aspect-ratio: auto;
  }

  .bento-discovery__item--product .product-card,
  .bento-discovery__product-placeholder {
    grid-template-columns: minmax(12rem, 0.85fr) minmax(0, 1.15fr);
  }

  .bento-discovery__item--product .product-card__media,
  .bento-discovery__product-placeholder .product-card__media {
    height: 100%;
    aspect-ratio: auto;
  }
}

@keyframes editorial-marquee {
  from {
    transform: translateX(0);
  }

  /* Un grupo exacto, sean los que sean los que monte el Liquid: el ciclo cierra justo sobre
     la copia siguiente y la banda no da un salto. El fallback 2 permite que esta hoja y el
     Liquid se despliegen en cualquier orden, sin un ciclo roto en el intervalo. */
  to {
    transform: translateX(calc(-100% / var(--marquee-groups, 2)));
  }
}

@media (min-width: 48rem) {
  .size-guide-modal__title {
    font-size: 2rem;
  }

  .size-guide-modal__overlay {
    align-items: center;
    padding: var(--space-xl);
  }

  .size-guide-modal__panel {
    width: min(100%, 65rem);
    max-height: calc(100dvh - (var(--space-xl) * 2));
    border: var(--border-width) solid var(--color-border);
  }

  .size-guide-modal__body {
    padding: var(--space-xl);
  }

  .sticky-cart-bar__inner {
    width: min(100%, var(--container-max-width));
    min-height: 5rem;
    margin-inline: auto;
    padding-inline: var(--page-gutter-desktop);
    grid-template-columns: 3.5rem minmax(0, 1fr) minmax(11rem, auto);
  }

  .sticky-cart-bar__media {
    width: 3.5rem;
    height: 3.5rem;
  }

  .sticky-cart-bar__title {
    font-size: 0.9375rem;
  }

  body[data-sticky-cart-visible] {
    padding-block-end: calc(5rem + env(safe-area-inset-bottom));
  }

  .site-footer__grid {
    grid-template-columns: minmax(0, 2fr) minmax(10rem, 1fr) minmax(10rem, 1fr);
    align-items: start;
  }

  .product-main__title {
    font-size: calc(3rem * var(--font-heading-scale));
  }

  .product-main__title[data-long-title='1'] {
    font-size: calc(1.75rem * var(--font-heading-scale));
  }

  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--space-3);
  }

  .cart-item {
    grid-template-columns: 8rem minmax(0, 1fr) minmax(8rem, 10rem);
  }

  .cart-item__controls {
    grid-column: 3;
    align-self: start;
  }

  .cart-page__footer {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 26rem);
    align-items: start;
  }

  .cart-summary {
    grid-column: 2;
  }
}

@media (min-width: 62rem) {
  .site-header__inner {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: var(--space-4);
  }

  .site-header__mobile-menu {
    display: none;
  }

  .site-header__desktop-nav {
    display: block;
    justify-self: start;
  }

  .desktop-nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    align-items: center;
  }

  .desktop-nav__disclosure {
    position: relative;
    display: block;
  }

  .desktop-nav__link,
  .desktop-nav__toggle {
    display: inline-flex;
    min-height: 44px;
    padding: 0;
    border: 0;
    align-items: center;
    gap: 0.25rem;
    background: transparent;
    color: currentColor;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .desktop-nav__panel {
    position: absolute;
    min-width: 15rem;
    inset-block-start: calc(100% + 0.4rem);
    inset-inline-start: 0;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    background: var(--color-background);
    color: var(--color-foreground);
    box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--color-shadow) 12%, transparent);
  }

  .desktop-nav__submenu,
  .desktop-nav__grandchildren {
    display: grid;
    gap: var(--space-1);
  }

  .desktop-nav__submenu a,
  .desktop-nav__grandchildren a {
    display: flex;
    min-height: var(--tap-target-min, 44px);
    align-items: center;
    color: currentColor;
    text-decoration: none;
  }

  .desktop-nav__grandchildren {
    margin-block-end: var(--space-2);
    padding-inline-start: var(--space-3);
    border-inline-start: 1px solid var(--color-border);
    font-size: 0.875rem;
    opacity: 0.78;
  }

  .product-main__layout {
    grid-template-columns: minmax(0, 1.45fr) minmax(20rem, 0.75fr);
    align-items: start;
    gap: clamp(2rem, 5%, 5rem);
  }

  .product-main__layout--grid .product-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-main__details {
    position: sticky;
    inset-block-start: var(--space-4);
  }

  .collection-main__body {
    grid-template-columns: minmax(14rem, 17rem) minmax(0, 1fr);
    align-items: start;
    gap: var(--space-6);
  }

  .facets {
    position: sticky;
    inset-block-start: var(--space-3);
  }

  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 75rem) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Phase 3B.3 discovery and collection merchandising */
editorial-lookbook,
complete-the-look {
  display: block;
}

.lookbook__inner,
.complete-the-look__inner {
  width: var(--content-width);
  margin-inline: auto;
}

.lookbook__header,
.complete-the-look__header {
  display: grid;
  gap: var(--space-lg);
  margin-block-end: var(--space-xl);
}

.lookbook__heading,
.complete-the-look__heading {
  max-width: 18ch;
  margin: 0;
  font-size: calc(2.25rem * var(--font-heading-scale));
  line-height: 1.12;
}

.lookbook__description,
.complete-the-look__description {
  max-width: 38rem;
  color: var(--color-foreground-muted);
}

.lookbook__stage {
  position: relative;
}

.lookbook__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.lookbook__media picture,
.lookbook__image,
.lookbook__placeholder,
.lookbook__placeholder svg {
  width: 100%;
  height: 100%;
}

.lookbook__image,
.lookbook__placeholder svg {
  object-fit: cover;
}

.lookbook__hotspots {
  position: absolute;
  pointer-events: none;
  inset: 0;
}

.lookbook-hotspot {
  position: absolute;
  width: 48px;
  height: 48px;
  left: clamp(24px, var(--hotspot-x), calc(100% - 24px));
  top: clamp(24px, var(--hotspot-y), calc(100% - 24px));
  margin-top: -24px;
  margin-left: -24px;
}

@media (max-width: 47.99rem) {
  .lookbook-hotspot {
    left: clamp(24px, var(--hotspot-x-mobile, var(--hotspot-x)), calc(100% - 24px));
    top: clamp(24px, var(--hotspot-y-mobile, var(--hotspot-y)), calc(100% - 24px));
  }
}

.lookbook-hotspot__trigger {
  position: relative;
  display: grid;
  width: 48px;
  min-width: 48px;
  height: 48px;
  min-height: 48px;
  padding: 0;
  border: 1px solid var(--color-foreground);
  border-radius: 50%;
  pointer-events: auto;
  place-items: center;
  background: var(--color-background);
  color: var(--color-foreground);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  transition: background-color var(--motion-fast) var(--ease-move), color var(--motion-fast) var(--ease-move);
}

.lookbook-hotspot__trigger::before {
  position: absolute;
  border: 1px solid currentColor;
  border-radius: inherit;
  content: '';
  inset: -1px;
}

.lookbook-hotspot__trigger:hover,
.lookbook-hotspot__trigger[aria-expanded='true'] {
  background: var(--color-foreground);
  color: var(--color-background);
}

.lookbook-hotspot__trigger:focus-visible {
  outline-offset: 2px;
  box-shadow: 0 0 0 6px var(--color-background);
}

.lookbook-popover {
  position: fixed;
  z-index: 120;
  display: grid;
  width: min(20rem, calc(100vw - (var(--page-gutter-mobile) * 2)));
  max-height: calc(100dvh - (var(--page-gutter-mobile) * 2));
  padding: var(--space-3);
  padding-block-start: 3.75rem;
  border: 1px solid var(--color-border);
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: var(--space-3);
  overflow: auto;
  pointer-events: auto;
  background: var(--color-background);
  box-shadow: 0 1.25rem 3rem color-mix(in srgb, var(--color-shadow) 18%, transparent);
  color: var(--color-foreground);
}

.lookbook-popover__close {
  position: absolute;
  inset-block-start: var(--space-1);
  inset-inline-end: var(--space-1);
}

.lookbook-popover__media {
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--color-surface);
}

.lookbook-popover__image,
.lookbook-popover__image-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lookbook-popover__content {
  min-width: 0;
}

.lookbook-popover__content .eyebrow {
  margin-block-end: var(--space-1);
  color: var(--color-foreground-muted);
  font-size: 0.625rem;
}

.lookbook-popover__title {
  margin: 0;
  font-family: var(--font-body-family);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.35;
}

.lookbook-popover .price {
  margin-block-start: var(--space-1);
  font-size: 0.875rem;
}

.lookbook-popover__link {
  display: inline-flex;
  min-height: var(--tap-target-min);
  margin-block-start: var(--space-2);
  align-items: center;
  gap: var(--space-1);
  color: currentColor;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
}

.lookbook__caption,
.complete-the-look__caption {
  margin-block: var(--space-2) 0;
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.lookbook__fallback {
  margin-block-start: var(--space-lg);
}

.lookbook__fallback-list {
  border-block-start: 1px solid var(--color-border-hairline);
}

.lookbook__fallback-list li {
  display: flex;
  min-height: var(--tap-target-min);
  border-block-end: 1px solid var(--color-border-hairline);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.lookbook__fallback-list a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  color: currentColor;
}

.complete-the-look__layout {
  display: grid;
  gap: var(--space-xl);
}

.complete-the-look__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.complete-the-look__media picture,
.complete-the-look__image,
.complete-the-look__placeholder,
.complete-the-look__placeholder svg {
  width: 100%;
  height: 100%;
}

.complete-the-look__image,
.complete-the-look__placeholder svg {
  object-fit: cover;
}

.complete-the-look__commerce {
  display: grid;
  align-content: start;
  gap: var(--space-xl);
}

.complete-the-look__items {
  border-block-start: 1px solid var(--color-border-hairline);
}

.complete-the-look__item {
  display: grid;
  min-width: 0;
  padding-block: var(--space-md);
  border-block-end: 1px solid var(--color-border-hairline);
  grid-template-columns: var(--tap-target-min) 4.5rem minmax(0, 1fr);
  grid-template-areas:
    'check media details'
    '. media price';
  gap: var(--space-xs) var(--space-sm);
  align-items: start;
}

.complete-the-look__check {
  display: grid;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  grid-area: check;
  cursor: pointer;
  place-items: center;
}

.complete-the-look__check input {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  accent-color: var(--color-foreground);
}

.complete-the-look__item-media {
  display: block;
  width: 4.5rem;
  height: 5.5rem;
  overflow: hidden;
  grid-area: media;
  background: var(--color-surface);
}

.complete-the-look__item-image,
.complete-the-look__item-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.complete-the-look__item-details {
  min-width: 0;
  grid-area: details;
}

.complete-the-look__item-title {
  margin: 0;
  font-family: var(--font-body-family);
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.35;
}

.complete-the-look__item-title a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  color: currentColor;
  text-decoration: none;
}

.complete-the-look__variant {
  width: min(100%, 12rem);
  min-height: var(--tap-target-min);
  margin-block-start: var(--space-1);
}

.complete-the-look__product-options-link {
  display: inline-flex;
  min-height: var(--tap-target-min);
  margin-block-start: var(--space-1);
  align-items: center;
  color: currentColor;
  font-size: 0.8125rem;
  font-weight: 700;
  text-underline-offset: 0.25em;
}

.complete-the-look__unavailable {
  margin-block: var(--space-1) 0;
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

.complete-the-look__item-price {
  grid-area: price;
  font-size: 0.875rem;
}

.complete-the-look__item-price .price__values {
  justify-content: flex-start;
}

.complete-the-look__item:not([data-selected]) .complete-the-look__item-media {
  opacity: 0.55;
}

.complete-the-look__item:not([data-selected]) .complete-the-look__item-details,
.complete-the-look__item:not([data-selected]) .complete-the-look__item-price {
  color: var(--color-foreground-muted);
  opacity: 1;
}

.complete-the-look__item[data-product-page-fallback] {
  grid-template-columns: 4.5rem minmax(0, 1fr);
  grid-template-areas:
    'media details'
    'media price';
}

.complete-the-look__item[data-product-page-fallback] .complete-the-look__check {
  display: none;
}

.complete-the-look__item[data-product-page-fallback]:not([data-selected]) .complete-the-look__item-media,
.complete-the-look__item[data-product-page-fallback]:not([data-selected]) .complete-the-look__item-details,
.complete-the-look__item[data-product-page-fallback]:not([data-selected]) .complete-the-look__item-price {
  opacity: 1;
}

.complete-the-look__empty {
  padding: var(--space-xl);
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.complete-the-look__summary {
  display: grid;
  padding: var(--space-lg);
  gap: var(--space-md);
  background: var(--color-surface);
}

.complete-the-look__summary-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-md);
}

.complete-the-look__summary-heading p {
  margin: 0;
}

.complete-the-look__summary-heading .eyebrow {
  margin-block-end: var(--space-xs);
}

.complete-the-look__total {
  flex: none;
  font-family: var(--font-heading-family);
  font-size: 1.5rem;
  font-weight: var(--font-heading-weight);
}

.complete-the-look__submit {
  min-height: 52px;
}

.complete-the-look__submit[aria-busy='true'] [data-complete-look-label] {
  opacity: 1;
}

.complete-the-look__noscript {
  margin: 0;
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.no-js .lookbook__hotspots,
.no-js .complete-the-look__check,
.no-js .complete-the-look__variant,
.no-js .complete-the-look__summary-heading,
.no-js .complete-the-look__submit {
  display: none;
}

.no-js .complete-the-look__item {
  grid-template-columns: 4.5rem minmax(0, 1fr);
  grid-template-areas:
    'media details'
    'media price';
}

.collection-products__toolbar {
  display: flex;
  min-height: var(--tap-target-min);
  margin-block-end: var(--space-md);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.collection-products__toolbar .collection-products__count {
  margin: 0;
}

.collection-grid-switcher {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-xs);
}

.collection-grid-switcher__title {
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

.collection-grid-switcher__button {
  display: grid;
  width: var(--tap-target-min);
  min-width: var(--tap-target-min);
  height: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding: 0;
  border: 1px solid var(--color-border);
  place-items: center;
  background: transparent;
  color: var(--color-foreground);
  cursor: pointer;
}

.collection-grid-switcher__button[aria-pressed='true'] {
  border-color: var(--color-foreground);
  background: var(--color-foreground);
  color: var(--color-background);
}

.collection-grid-switcher__icon {
  display: grid;
  width: 1.25rem;
  height: 1.25rem;
  grid-auto-flow: column;
  gap: 3px;
}

.collection-grid-switcher__icon i {
  display: block;
  width: 100%;
  height: 100%;
  background: currentColor;
}

/*
  On phones the two options are one and two products per row, so the icons drop the
  bars they cannot deliver and each button announces the density it really applies.
*/
.collection-grid-switcher__icon--two i:nth-child(n + 2),
.collection-grid-switcher__icon--four i:nth-child(n + 3) {
  display: none;
}

.collection-grid-switcher__label--wide {
  display: none;
}

.product-grid[data-grid-columns='2'] {
  grid-template-columns: minmax(0, 1fr);
}

.product-grid[data-grid-columns='4'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.product-grid[data-grid-columns='4'] .product-grid__item--promotion {
  grid-column: 1 / -1;
}

/* v1.1.0 PLP list view. Solo se activa con data-grid-columns="list" desde el conmutador. */
.collection-grid-switcher__icon--list {
  grid-auto-flow: row;
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.product-grid[data-grid-columns='list'] {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5) 0;
}

.product-grid[data-grid-columns='list'] .product-card {
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0 var(--space-3);
  align-items: start;
}

.product-grid[data-grid-columns='list'] .product-card__media {
  width: 100%;
  aspect-ratio: 4 / 5;
}

.product-grid[data-grid-columns='list'] .product-card__content {
  min-width: 0;
  align-content: start;
}

.product-grid[data-grid-columns='list'] .product-card__title {
  overflow-wrap: anywhere;
}

@media (min-width: 990px) {
  .product-grid[data-grid-columns='list'] .product-card {
    grid-template-columns: minmax(10rem, 14rem) minmax(0, 1fr);
    gap: 0 var(--space-5);
  }
}

.product-grid__item--promotion {
  min-width: 0;
}

.promotion-tile {
  display: grid;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid var(--color-border-hairline);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.promotion-tile__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--color-surface);
}

.promotion-tile__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promotion-tile__content {
  display: flex;
  min-height: 20rem;
  padding: var(--space-lg);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.promotion-tile__heading {
  max-width: 14ch;
  margin: 0;
  font-size: 1.875rem;
  line-height: 1.2;
}

.promotion-tile__text {
  max-width: 32ch;
}

.promotion-tile__content .promotion-tile__link {
  width: 100%;
  margin-block-start: auto;
}

@media (min-width: 48rem) {
  .lookbook__header,
  .complete-the-look__header {
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    align-items: end;
  }

  .lookbook__description,
  .complete-the-look__description {
    justify-self: end;
  }

  .lookbook__media {
    aspect-ratio: 16 / 10;
  }

  .product-grid[data-grid-columns='2'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-grid[data-grid-columns='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .product-grid[data-grid-columns='4'] .product-grid__item--promotion {
    grid-column: auto;
  }

  .collection-grid-switcher__icon--two i:nth-child(n + 2),
  .collection-grid-switcher__icon--four i:nth-child(n + 3) {
    display: block;
  }

  .collection-grid-switcher__label--small {
    display: none;
  }

  .collection-grid-switcher__label--wide {
    display: inline;
  }
}

@media (min-width: 62rem) {
  .lookbook.section,
  .complete-the-look__section.section {
    padding-block: var(--space-4xl);
  }

  .lookbook__inner,
  .complete-the-look__inner {
    width: var(--content-width);
  }

  .lookbook__heading,
  .complete-the-look__heading {
    font-size: calc(3rem * var(--font-heading-scale));
  }

  .lookbook__media {
    aspect-ratio: 17 / 9;
  }

  .complete-the-look__layout {
    grid-template-columns: minmax(0, 1fr) minmax(28rem, 1.02fr);
    align-items: start;
    gap: var(--space-3xl);
  }

  .complete-the-look__item {
    min-height: 12.5rem;
    grid-template-columns: var(--tap-target-min) 8.25rem minmax(0, 1fr) auto;
    grid-template-areas: 'check media details price';
    gap: var(--space-md);
  }

  .complete-the-look__item-media {
    width: 8.25rem;
    height: 10rem;
  }

  .complete-the-look__item-price {
    min-width: 6rem;
    text-align: end;
  }

  .complete-the-look__item-price .price__values {
    justify-content: flex-end;
  }

  .product-grid[data-grid-columns='2'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-grid[data-grid-columns='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .product-grid[data-grid-columns='4'] .product-grid__item--promotion {
    grid-column: auto;
  }

  .no-js .complete-the-look__item {
    grid-template-columns: 8.25rem minmax(0, 1fr) auto;
    grid-template-areas: 'media details price';
  }

  .complete-the-look__item[data-product-page-fallback] {
    grid-template-columns: 8.25rem minmax(0, 1fr) auto;
    grid-template-areas: 'media details price';
  }
}

/* Commercial compliance components */

gift-card-recipient,
pickup-availability,
product-recommendations {
  display: block;
}

product-recommendations:not([hidden]):empty {
  min-height: 1px;
}

.variant-picker__label--swatch {
  padding-inline-start: var(--space-xs);
}

.variant-picker__swatch {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid var(--color-border-hairline);
  border-radius: 50%;
  flex: 0 0 auto;
  background: var(--variant-swatch) var(--variant-swatch-position, center) / cover no-repeat;
}

.variant-picker__input:checked + .variant-picker__label .variant-picker__swatch {
  border-color: currentColor;
  box-shadow: 0 0 0 2px var(--color-button);
}

.product-form__payment-terms:empty {
  display: none;
}

.selling-plans {
  display: grid;
  gap: var(--space-md);
}

.selling-plans__fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.selling-plans__fieldset > legend,
.selling-plans__no-js > label {
  margin-block-end: var(--space-sm);
  font-size: 0.875rem;
  font-weight: 700;
}

.selling-plans__choices {
  display: grid;
  gap: var(--space-xs);
}

.selling-plans__choice {
  display: grid;
  min-height: 58px;
  margin: 0;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  grid-template-columns: 1.25rem minmax(0, 1fr);
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.selling-plans__choice:has(input:checked) {
  border-color: var(--color-foreground);
  background: var(--color-surface);
}

.selling-plans__choice:has(input:disabled) {
  cursor: not-allowed;
  opacity: 0.58;
}

.selling-plans__choice input {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
}

.selling-plans__choice-copy {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  font-size: 0.875rem;
}

.selling-plans__choice-copy > span {
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
}

.selling-plans__details,
.selling-plans__no-js {
  display: grid;
  gap: var(--space-xs);
  margin-block-start: var(--space-sm);
  padding-inline-start: calc(1.25rem + var(--space-sm) + var(--space-md));
}

.selling-plans__details select,
.selling-plans__no-js select {
  min-height: 52px;
}

.selling-plans__status,
.selling-plans__per-delivery {
  min-height: 1.25rem;
  margin: 0;
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.product-form__line-total {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-xs);
  min-height: 1.5rem;
  margin-block: var(--space-xs) 0;
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

/* LEAD-001. El hueco se reserva siempre: con display: none, el total aparecia al pasar de 1 a 2
   y empujaba ~31px hacia abajo el boton de compra justo cuando el comprador iba a pulsarlo. */
.product-form__line-total[data-empty] {
  visibility: hidden;
}

.product-form__tax-note {
  margin: var(--space-xs) 0 0;
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}

.product-form__line-total [data-line-total-compare] {
  opacity: 0.68;
}

.product-form__line-total [data-line-total-current] {
  color: var(--color-foreground);
  font-weight: 700;
}

.gift-card-recipient {
  padding-block: var(--space-md);
  border-block: 1px solid var(--color-border-hairline);
}

.gift-card-recipient__toggle {
  display: inline-flex;
  min-height: var(--tap-target-min, 44px);
  align-items: center;
  font-weight: 700;
}

.gift-card-recipient__fields {
  margin-block-start: var(--space-md);
  padding-inline-start: calc(1.25rem + var(--space-sm));
}

.gift-card-recipient__fields input,
.gift-card-recipient__fields textarea {
  min-height: 52px;
}

.gift-card-recipient__fields textarea {
  min-height: 8rem;
}

.form-field__error {
  margin: var(--space-xs) 0 0;
  color: var(--color-foreground);
  font-size: 0.8125rem;
  font-weight: 700;
}

.pickup-availability {
  margin-block-start: var(--space-md);
  padding-block-start: var(--space-md);
  border-top: 1px solid var(--color-border-hairline);
}

.pickup-availability__summary {
  display: grid;
  grid-template-columns: 1.75rem minmax(0, 1fr);
  align-items: start;
  gap: var(--space-sm);
}

.pickup-availability__status-icon {
  display: inline-grid;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  place-items: center;
}

.pickup-availability__summary-copy > p,
.pickup-availability__location-status {
  margin: 0;
}

.pickup-availability__summary-copy > p:first-child {
  font-size: 0.875rem;
}

.pickup-availability__time,
.pickup-availability__variant,
.pickup-availability__address,
.pickup-availability__phone {
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.pickup-availability__open,
.pickup-availability__phone {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  color: currentColor;
  font-weight: 700;
  text-underline-offset: 0.25em;
}

.pickup-availability__open {
  padding: var(--space-xs) 0;
  border: 0;
  background: transparent;
}

.pickup-availability__overlay {
  position: fixed;
  z-index: 230;
  display: grid;
  background: color-mix(in srgb, var(--color-shadow) 55%, transparent);
  backdrop-filter: blur(8px);
  inset: 0;
  place-items: stretch end;
}

.js pickup-availability:not([data-open]) .pickup-availability__overlay {
  display: none;
}

.pickup-availability__drawer {
  width: min(100%, 34rem);
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-xl);
  border-inline-start: 1px solid var(--color-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.pickup-availability__drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  padding-block-end: var(--space-lg);
  border-bottom: 1px solid var(--color-border-hairline);
}

.pickup-availability__drawer-header h2,
.pickup-availability__variant {
  margin: 0;
}

.pickup-availability__drawer-header h2 {
  font-size: 1.75rem;
}

.pickup-availability__hours {
  padding-block: var(--space-lg);
  border-bottom: 1px solid var(--color-border-hairline);
}

.pickup-availability__hours p:last-child {
  margin: 0;
  font-size: 0.875rem;
}

.pickup-availability__location {
  padding-block: var(--space-lg);
  border-bottom: 1px solid var(--color-border-hairline);
}

.pickup-availability__location h3 {
  margin-block-end: var(--space-sm);
  font-size: 1.125rem;
}

.pickup-availability__location-status {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.8125rem;
}

.pickup-availability__location-status .pickup-availability__status-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.pickup-availability__address {
  margin-block-start: var(--space-md);
  font-style: normal;
}

.pickup-availability__address p {
  margin: 0;
}

.no-js .pickup-availability__overlay {
  position: static;
  display: block !important;
  margin-block-start: var(--space-lg);
  background: transparent;
  backdrop-filter: none;
}

.no-js .pickup-availability__drawer {
  width: 100%;
  height: auto;
  padding: var(--space-lg) 0 0;
  border-inline-start: 0;
  overflow: visible;
}

.product-recommendations__header {
  max-width: 48rem;
}

.product-recommendations__header h2 {
  font-size: calc(2.25rem * var(--font-heading-scale));
}

.product-recommendations__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2xl) var(--space-md);
}

.collection-main__banner {
  margin: 0;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.collection-main__banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 48rem) {
  .selling-plans__choices {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-recommendations__grid[data-columns='3'],
  .product-recommendations__grid[data-columns='4'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .collection-main__banner {
    aspect-ratio: 21 / 8;
  }
}

@media (min-width: 62rem) {
  .product-recommendations__grid[data-columns='2'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-recommendations__grid[data-columns='3'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .product-recommendations__grid[data-columns='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Content, editorial, and system templates */

faq-accordion,
password-modal,
anchor-nav,
copy-text {
  display: block;
}

.js .no-js-only,
.no-js .js-only {
  display: none !important;
}

.form-message--success,
.form-message--error {
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  /* initFormMessageFocus lleva el foco aqui tras enviar un formulario. El margen evita
     que la cabecera pegajosa tape el mensaje al que se acaba de saltar. */
  scroll-margin-block-start: var(--space-4xl);
}

.form-message--success {
  border-color: var(--color-foreground);
}

.form-message--error {
  border-inline-start: 3px solid var(--color-foreground);
}

.form-message--error p,
.form-message--error ul {
  margin-block-end: var(--space-xs);
}

.form-message--error a {
  color: currentColor;
}

.form-field {
  min-width: 0;
}

.form-field__help {
  margin-block: var(--space-xs) 0;
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.form-checkbox {
  display: grid;
  min-height: var(--tap-target-min);
  margin: 0;
  grid-template-columns: 1.25rem minmax(0, 1fr);
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
}

.form-checkbox input {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
}

.main-page__header {
  max-width: 52rem;
  margin-inline: auto;
  text-align: center;
}

/* Las paginas de utilidad comparten una sola escala de titulo. Sin esta linea, un
   h1 de pagina cae en el clamp de portada (hasta 7rem) y en un portatil el titulo se
   come la pantalla: "Documentation" no cabe en la cabecera y se parte a mitad de
   palabra. */
.main-documentation__title,
.main-support__title,
.main-faq__title,
.main-about__title,
.main-policy__title,
.main-page__title,
.main-contact__title,
.main-blog__title,
.main-list-collections__title,
.main-search__title,
.cart-page__header h1 {
  font-size: calc(2.75rem * var(--font-heading-scale));
}

.main-page__intro {
  max-width: 42rem;
  margin: var(--space-lg) auto 0;
  color: var(--color-foreground-muted);
  font-size: 1.0625rem;
}

.main-page__reading {
  max-width: 52rem;
  margin: var(--space-3xl) auto 0;
  font-size: 1.0625rem;
  line-height: 1.8;
}

.main-page__reading > * + *,
.main-article__reading > * + * {
  margin-block-start: var(--space-lg);
}

.main-page__blocks {
  display: grid;
  gap: var(--space-3xl);
  margin-block-start: var(--space-3xl);
}

.main-page__figure {
  margin: 0;
}

.main-page__figure-media {
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.main-page__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-page__caption,
.main-article__hero figcaption {
  margin-block-start: var(--space-sm);
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.main-page__quote,
.main-article__pull-quote {
  margin: 0;
  padding: var(--space-2xl) var(--space-lg);
  background: var(--color-surface);
  text-align: center;
}

.main-page__quote blockquote,
.main-article__pull-quote blockquote {
  max-width: 48rem;
  margin-inline: auto;
  padding: 0;
  border: 0;
  font-size: 1.75rem;
  line-height: 1.25;
}

.main-page__quote figcaption,
.main-article__pull-quote figcaption {
  margin-block-start: var(--space-lg);
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.main-page__signature {
  max-width: 52rem;
  margin-inline: auto;
  padding-block-start: var(--space-xl);
  border-top: 1px solid var(--color-border-hairline);
}

.main-page__signature-note {
  font-family: var(--font-heading-family);
  font-size: 1.75rem;
  line-height: 1.3;
}

.main-page__signature-name,
.main-page__signature-role {
  margin: 0;
}

.main-page__signature-role {
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

.main-contact__header {
  display: grid;
  gap: var(--space-xl);
  padding-block-end: var(--space-2xl);
  border-bottom: 1px solid var(--color-border-hairline);
}

.main-contact__intro {
  max-width: 48rem;
}

.main-contact__page-content {
  max-width: 56ch;
  color: var(--color-foreground-muted);
}

.main-contact__atelier-facts {
  display: grid;
  gap: var(--space-lg);
  margin: 0;
}

.main-contact__atelier-facts dt {
  margin-block-end: var(--space-xs);
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.main-contact__atelier-facts dd {
  margin: 0;
}

.main-contact__layout {
  display: grid;
  gap: var(--space-3xl);
}

/* LEAD-001. Los h2 de las columnas (formulario y FAQ) heredaban la escala de portada y
   quedaban mas grandes que el h1 de la pagina. Son subtitulos de bloque: escala de seccion. */
.main-contact__layout h2 {
  font-size: calc(clamp(1.5rem, 2.5vw, 2rem) * var(--font-heading-scale));
}

.contact-form,
.support-form,
.comment-form,
.password-newsletter,
.storefront-password-form {
  --flow-space: var(--space-lg);
}

.contact-form input:not([type='checkbox']),
.contact-form select,
.contact-form textarea,
.comment-form input,
.comment-form textarea,
.password-newsletter input,
.storefront-password-form input,
.main-search__form input,
.main-search__form select,
.main-404__search input {
  min-height: 52px;
}

.contact-form textarea,
.comment-form textarea {
  min-height: 10rem;
}

.contact-form__grid,
.support-form__grid,
.comment-form__grid {
  display: grid;
  gap: var(--space-lg);
}

.contact-form__footer,
.support-form__footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.contact-form__submit,
.support-form__submit {
  min-height: 52px;
}

.main-contact__aside {
  display: grid;
  align-content: start;
  gap: var(--space-2xl);
}

.faq-item {
  border-bottom: 1px solid var(--color-border-hairline);
}

.faq-item:first-of-type {
  border-top: 1px solid var(--color-border-hairline);
}

.faq-item__summary {
  display: grid;
  min-height: 64px;
  grid-template-columns: minmax(0, 1fr) var(--tap-target-min);
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  list-style: none;
}

.faq-item__summary::-webkit-details-marker {
  display: none;
}

.faq-item__icon {
  position: relative;
  display: block;
  width: var(--tap-target-min);
  height: var(--tap-target-min);
}

.faq-item__icon::before,
.faq-item__icon::after {
  position: absolute;
  width: 1rem;
  height: 1px;
  inset: 50% auto auto 50%;
  background: currentColor;
  content: '';
  transform: translate(-50%, -50%);
  transition: transform var(--motion-fast) var(--ease-move);
}

.faq-item__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.faq-item[open] .faq-item__icon::after {
  transform: translate(-50%, -50%) rotate(0deg);
}

.faq-item__answer {
  max-width: 58ch;
  padding: 0 var(--space-xl) var(--space-lg) 0;
  color: var(--color-foreground-muted);
}

.main-contact__services {
  padding: var(--space-xl);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.main-contact__service-list,
.main-support__channel-list {
  border-top: 1px solid var(--color-border);
}

.main-contact__service-list li,
.main-support__channel-list li {
  border-bottom: 1px solid var(--color-border);
}

.main-contact__service-link,
.main-support__channel {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  color: currentColor;
  text-decoration: none;
}

.main-contact__service-link strong,
.main-contact__service-link small,
.main-support__channel strong,
.main-support__channel small {
  display: block;
}

.main-contact__service-link small,
.main-support__channel small {
  margin-block-start: var(--space-3xs);
  color: var(--color-foreground-muted);
}

.main-contact__response-note {
  margin: var(--space-lg) 0 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.main-blog__header {
  display: grid;
  gap: var(--space-xl);
}

.main-blog__tags,
.main-search__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.main-blog__tag,
.main-search__tabs a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-border);
  align-items: center;
  justify-content: center;
  color: currentColor;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
}

.main-blog__tag[aria-current='page'],
.main-search__tabs a[aria-current='page'] {
  border-color: var(--color-foreground);
  background: var(--color-foreground);
  color: var(--color-background);
}

.main-blog__featured {
  display: grid;
  border-block: 1px solid var(--color-border-hairline);
}

.main-blog__featured-media,
.article-card__media {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--color-surface);
}

.main-blog__featured-image,
.article-card__image,
.search-content-card__image,
.collection-directory__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-blog__media-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
}

.main-blog__featured-copy {
  padding: var(--space-xl) 0;
}

.main-blog__featured-copy h2 {
  font-size: 2.25rem;
}

.main-blog__featured-copy h2 a,
.article-card__title a,
.main-article__navigation-link,
.search-content-card h2 a,
.collection-directory__content h2 a {
  color: currentColor;
  text-decoration: none;
}

.main-blog__featured-copy h2 a,
.article-card__title a,
.search-content-card h2 a,
.collection-directory__content h2 a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
}

.main-blog__excerpt,
.main-blog__meta,
.article-card__excerpt,
.article-card__date {
  color: var(--color-foreground-muted);
}

.main-blog__featured-link {
  min-height: 52px;
}

.main-blog__latest-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-block-end: var(--space-md);
  border-bottom: 1px solid var(--color-border-hairline);
}

.main-blog__latest-heading p {
  margin: 0;
}

.main-blog__grid {
  display: grid;
  gap: var(--space-2xl) var(--space-xl);
}

.article-card {
  display: grid;
  gap: var(--space-lg);
}

.article-card__content {
  --flow-space: var(--space-sm);
}

.article-card__title {
  font-size: 1.5rem;
}

.article-card__excerpt,
.article-card__date {
  margin-block-end: 0;
  font-size: 0.875rem;
}

.main-article__header {
  max-width: 70rem;
  margin-inline: auto;
  text-align: center;
}

.main-article__title {
  font-size: 2.75rem;
}

.main-article__meta {
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.main-article__hero {
  max-width: 70rem;
  margin: var(--space-2xl) auto 0;
}

.main-article__hero-media {
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.main-article__hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-article__reading {
  max-width: 48rem;
  margin: var(--space-3xl) auto 0;
  font-size: 1.0625rem;
  line-height: 1.8;
}

.main-article__reading h2,
.main-article__reading h3 {
  margin-block-start: var(--space-2xl);
}

.main-article__pull-quote {
  max-width: 70rem;
  margin: var(--space-3xl) auto 0;
}

.main-article__objects {
  max-width: 70rem;
  margin: var(--space-3xl) auto 0;
  padding-block-start: var(--space-xl);
  border-top: 1px solid var(--color-border-hairline);
}

.main-article__product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-md);
  margin-block-start: var(--space-lg);
}

.main-article__navigation {
  display: grid;
  max-width: 70rem;
  margin: var(--space-3xl) auto 0;
  border-block: 1px solid var(--color-border-hairline);
}

.main-article__navigation-link {
  display: grid;
  min-height: 88px;
  padding-block: var(--space-md);
  align-content: center;
  gap: var(--space-xs);
}

.main-article__navigation-link + .main-article__navigation-link {
  border-top: 1px solid var(--color-border-hairline);
}

.main-article__navigation-link .eyebrow {
  margin: 0;
  color: var(--color-foreground-muted);
}

.main-article__comments {
  max-width: 54rem;
  margin: var(--space-3xl) auto 0;
  padding-block-start: var(--space-xl);
  border-top: 1px solid var(--color-border-hairline);
}

.comment-list {
  margin-block-start: var(--space-xl);
}

.comment {
  padding-block: var(--space-lg);
  border-bottom: 1px solid var(--color-border-hairline);
}

.comment__content {
  font-size: 0.9375rem;
}

.comment__meta {
  margin: var(--space-md) 0 0;
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

.comment-form-wrap {
  margin-block-start: var(--space-2xl);
}

.main-search__header {
  max-width: 62rem;
}

.main-search__title {
  font-size: calc(2.75rem * var(--font-heading-scale));
}

.main-search__form {
  display: grid;
  gap: var(--space-xl);
}

.main-search__query-row {
  display: grid;
  gap: var(--space-md);
  align-items: end;
}

.main-search__submit {
  min-height: 52px;
  gap: var(--space-xs);
}

.main-search__filters {
  display: grid;
  gap: 0 var(--space-xl);
  padding: var(--space-lg);
  border: 1px solid var(--color-border-hairline);
}

.main-search__sort-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: var(--space-md);
}

.main-search__sort-bar .facets__sort {
  margin-block-start: 0;
}

.main-404__recommendations-heading {
  margin-block-end: var(--space-md);
  font-size: 1.125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.main-search__count {
  margin: 0;
  padding-block-end: var(--space-md);
  border-bottom: 1px solid var(--color-border-hairline);
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

.search-results-grid {
  display: grid;
  gap: var(--space-2xl) var(--space-md);
  margin-block-start: var(--space-xl);
}

.search-content-card {
  height: 100%;
  border-bottom: 1px solid var(--color-border-hairline);
}

.search-content-card__media {
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--color-surface);
}

.search-content-card__content {
  --flow-space: var(--space-sm);
  padding-block: var(--space-lg);
}

.search-content-card__content h2 {
  font-size: 1.5rem;
}

.search-content-card__content p {
  margin-block-end: 0;
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

.search-content-card__link {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
  font-weight: 700;
}

.main-search__empty,
.main-search__prompt {
  max-width: 48rem;
  padding: var(--space-2xl);
  background: var(--color-surface);
}

.main-404__layout {
  display: grid;
  gap: var(--space-3xl);
}

.main-404__message {
  align-self: start;
}

.main-404__code {
  margin: 0;
  font-family: var(--font-heading-family);
  font-size: 6rem;
  line-height: 0.85;
}

.main-404__message h1 {
  font-size: 2.25rem;
}

.main-404__search {
  margin-block-start: var(--space-xl);
}

.main-404__search-row {
  display: grid;
  gap: var(--space-sm);
}

.main-404__recommendations {
  min-width: 0;
}

.main-404__product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-md);
  margin-block-start: var(--space-lg);
}

.main-password {
  position: relative;
  display: grid;
  min-height: 48rem;
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.main-password__media {
  overflow: hidden;
  min-height: 24rem;
  background: var(--color-foreground);
}

.main-password__image,
.main-password__media-placeholder {
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
}

.main-password__media-placeholder {
  display: block;
  background: var(--color-foreground);
}

.main-password__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: var(--space-lg) var(--page-gutter-mobile) var(--space-3xl);
}

.main-password__access {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.main-password__access-trigger {
  display: inline-flex;
  min-height: var(--tap-target-min);
  padding: var(--space-xs) 0;
  border: 0;
  align-items: center;
  background: transparent;
  color: currentColor;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.main-password__copy {
  max-width: 32rem;
  margin-block-start: var(--space-2xl);
}

.main-password__title {
  font-size: 2.75rem;
}

.main-password__merchant-message,
.password-newsletter__privacy {
  color: var(--color-foreground-muted);
}

.password-newsletter {
  margin-block-start: var(--space-xl);
}

.password-newsletter__privacy {
  margin-block-end: 0;
  font-size: 0.75rem;
}

.main-password__opening-note {
  margin-block-start: var(--space-xl);
  padding-block-start: var(--space-lg);
  border-top: 1px solid var(--color-border-hairline);
}

.main-password__opening-note p:last-child {
  margin: 0;
  font-family: var(--font-heading-family);
  font-size: 1.25rem;
}

.password-modal__overlay {
  position: fixed;
  z-index: 90;
  display: grid;
  background: color-mix(in srgb, var(--color-shadow) 55%, transparent);
  inset: 0;
  place-items: stretch end;
}

.js password-modal:not([data-open]) .password-modal__overlay {
  display: none;
}

.password-modal__panel {
  position: relative;
  width: min(100%, 32rem);
  height: 100%;
  overflow-y: auto;
  padding: var(--space-3xl) var(--space-xl);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.password-modal__close {
  position: absolute;
  inset-block-start: var(--space-sm);
  inset-inline-end: var(--space-sm);
}

.password-modal__content {
  margin-block-start: var(--space-xl);
}

.no-js .password-modal__overlay {
  position: static;
  display: block !important;
  grid-column: 1 / -1;
  padding: var(--space-lg) var(--page-gutter-mobile) var(--space-3xl);
  background: var(--color-surface);
}

.no-js .password-modal__panel {
  width: 100%;
  max-width: 32rem;
  height: auto;
  margin-inline: auto;
  padding: var(--space-xl) 0;
  overflow: visible;
}

.main-list-collections__header {
  max-width: 52rem;
}

.collection-directory {
  display: grid;
  gap: var(--space-2xl) var(--space-md);
}

.collection-directory__card {
  display: grid;
  gap: var(--space-lg);
}

.collection-directory__media {
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--color-border-hairline);
  background: var(--color-surface);
}

.collection-directory__placeholder {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
}

.collection-directory__content {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
}

.collection-directory__content h2,
.collection-directory__content p {
  margin: 0;
}

.collection-directory__content h2 {
  font-size: 1.5rem;
}

.collection-directory__content p {
  flex: 0 0 auto;
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

@media (min-width: 48rem) {
  .main-documentation__title,
  .main-support__title,
  .main-faq__title,
  .main-about__title,
  .main-policy__title,
  .main-page__title,
  .main-contact__title,
  .main-blog__title,
  .main-list-collections__title,
  .main-search__title,
  .cart-page__header h1 {
    font-size: calc(3.5rem * var(--font-heading-scale));
  }

  .contact-form__grid,
  .comment-form__grid,
  .main-search__query-row,
  .main-404__search-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contact-form__footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .main-blog__grid,
  .search-results-grid,
  .collection-directory {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-article__title {
    font-size: 3.5rem;
  }

  .main-article__pull-quote blockquote,
  .main-page__quote blockquote {
    font-size: 2.25rem;
  }

  .main-article__product-grid,
  .main-404__product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-article__navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-article__navigation-link + .main-article__navigation-link {
    padding-inline-start: var(--space-xl);
    border-top: 0;
    border-inline-start: 1px solid var(--color-border-hairline);
    text-align: end;
  }

  .main-search__query-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .main-search__submit,
  .main-404__search-row .button {
    min-width: 10rem;
  }
}

@media (min-width: 62rem) {
  .main-documentation__title,
  .main-support__title,
  .main-faq__title,
  .main-about__title,
  .main-policy__title,
  .main-page__title,
  .main-contact__title,
  .main-blog__title,
  .main-list-collections__title,
  .main-search__title,
  .cart-page__header h1 {
    font-size: calc(4rem * var(--font-heading-scale));
  }

  .main-page__blocks,
  .main-page__reading {
    margin-block-start: var(--space-4xl);
  }

  .main-contact__header {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.42fr);
    align-items: end;
  }

  .main-contact__layout {
    grid-template-columns: minmax(0, 1.2fr) minmax(24rem, 0.88fr);
    gap: var(--space-4xl);
  }

  .main-blog__header {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .main-blog__featured {
    grid-template-columns: minmax(0, 1.4fr) minmax(24rem, 1fr);
  }

  .main-blog__featured-copy {
    padding: var(--space-2xl);
  }

  .main-blog__featured-copy h2 {
    font-size: 3rem;
  }

  .main-blog__grid {
    gap: var(--space-3xl) var(--space-xl);
  }

  .main-article__title {
    font-size: 3.75rem;
  }

  .main-search__filters {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-search__filters .facets__heading,
  .main-search__filters .facets__actions {
    grid-column: 1 / -1;
  }

  .search-results-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--space-xl);
  }

  .main-404__layout {
    grid-template-columns: minmax(18rem, 0.38fr) minmax(0, 1fr);
    align-items: start;
  }

  .main-404__code {
    font-size: 8rem;
  }

  .main-password {
    min-height: 52.5rem;
    grid-template-columns: minmax(0, 1.25fr) minmax(30rem, 1fr);
  }

  .main-password__media {
    min-height: 52.5rem;
  }

  .main-password__content {
    padding: var(--space-lg) var(--page-gutter-desktop) var(--space-3xl);
  }

  .main-password__copy {
    align-self: center;
    margin-block: var(--space-3xl);
  }

  .main-password__title {
    font-size: 3.5rem;
  }

  .collection-directory[data-columns='3'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .collection-directory[data-columns='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Minimalist language switcher (Header & Mobile Drawer) */
.mobile-nav__localization {
  padding: var(--space-md) var(--page-gutter);
  border-block-start: 1px solid var(--color-border-hairline);
}

/* LEAD-001. Sin idiomas ni monedas que elegir, el snippet no pinta nada y quedaba solo la
   linea divisoria flotando al pie del cajon. */
.mobile-nav__localization:not(:has(*)) {
  display: none;
}

.localization-form--header {
  display: none;
}

@media (min-width: 48rem) {
  .localization-form--header {
    display: inline-flex;
    align-items: center;
    margin-inline-end: var(--space-xs);
  }
}

.localization-form__form {
  display: inline-flex;
  align-items: center;
  margin: 0;
}

.localization-form__form[aria-busy='true'] {
  cursor: progress;
  opacity: 0.6;
}

.localization-form__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-body-family);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
}

.localization-form__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  min-width: 44px;
  min-height: 44px;
  background: none;
  border: 0;
  color: var(--color-foreground);
  font: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: default;
  transition: opacity var(--motion-fast) var(--ease-move), color var(--motion-fast) var(--ease-move);
}

.localization-form__item.is-active {
  font-weight: 700;
  opacity: 1;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
}

.localization-form__btn {
  cursor: pointer;
  color: var(--color-foreground-muted);
}

.localization-form__btn:hover,
.localization-form__btn:focus-visible {
  color: var(--color-foreground);
}

.localization-form__divider {
  color: var(--color-foreground-muted);
  opacity: 0.4;
  font-size: 0.7rem;
  user-select: none;
}

/* Selector de moneda con el mismo lenguaje que el toggle EN/ES: texto de 12 px en mayusculas,
   sin caja, chevron de linea como el del menu y objetivo tactil de 44 px. Una raya fina lo
   separa del toggle de idioma. */
.localization-form__country-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: var(--color-foreground);
}

.localization-form__country-wrapper::after {
  content: '';
  position: absolute;
  inset-inline-end: 0.35rem;
  top: 50%;
  width: 0.35rem;
  height: 0.35rem;
  border-inline-end: 1.5px solid currentColor;
  border-block-end: 1.5px solid currentColor;
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.localization-form__toggle + .localization-form__country-wrapper::before {
  content: '';
  width: 1px;
  height: 1rem;
  margin-inline: 0.5rem 0.25rem;
  background: var(--color-border-hairline);
}

.localization-form__country {
  width: auto;
  min-width: 44px;
  min-height: 44px;
  padding: 0.25rem 1.1rem 0.25rem 0.25rem;
  border: 0;
  border-radius: 0;
  appearance: none;
  background: transparent;
  color: inherit;
  font-family: var(--font-body-family);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
}

/* Sin JS el boton de enviar va dentro del mismo contenedor: el chevron dibujado se quita y el
   select vuelve a su flecha nativa para no taparlo. */
.no-js .localization-form__country-wrapper::after {
  content: none;
}

.no-js .localization-form__country {
  appearance: auto;
}

.site-footer__newsletter {
  max-width: 34rem;
}

.site-footer__newsletter-title,
.site-footer__newsletter p {
  margin-block: 0 var(--space-sm);
}

.newsletter-form {
  display: grid;
  gap: var(--space-sm);
}

.newsletter-form__field {
  display: grid;
  gap: var(--space-xs);
}

.newsletter-form__field input,
.newsletter-form__submit {
  min-height: 52px;
}

.site-footer__utilities {
  display: grid;
  margin-block-start: var(--space-2xl);
  padding-block-start: var(--space-lg);
  border-block-start: 1px solid var(--color-border);
  gap: var(--space-xl);
}

.site-footer__utilities .localization-form {
  width: 100%;
}

.site-footer__payment-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  align-items: center;
}

.site-footer__payment-item {
  display: grid;
  min-width: 2.5rem;
  min-height: 1.75rem;
  place-items: center;
}

.site-footer__payment-item svg {
  width: auto;
  height: 1.5rem;
}

.newsletter-section {
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.newsletter-section__inner {
  display: grid;
  gap: var(--space-2xl);
  align-items: end;
}

.newsletter-section__copy {
  max-width: 42rem;
}

.newsletter-section__heading {
  margin: 0;
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.05;
}

.newsletter-section__text {
  max-width: 38rem;
}

.predictive-search,
.predictive-search-no-js {
  display: grid;
  place-items: center;
}

.predictive-search__overlay {
  position: fixed;
  z-index: 130;
  inset: 0;
  background: color-mix(in srgb, var(--color-shadow) 52%, transparent);
}

.predictive-search__panel {
  width: min(100%, 48rem);
  height: 100%;
  margin-inline-start: auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-inline-start: 1px solid var(--color-control-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
  box-shadow: 0 0 3rem color-mix(in srgb, var(--color-shadow) 25%, transparent);
}

.predictive-search__header {
  position: sticky;
  z-index: 2;
  inset-block-start: 0;
  display: flex;
  min-height: 4.75rem;
  padding-inline: var(--page-gutter);
  border-block-end: 1px solid var(--color-border);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  background: var(--color-background);
}

.predictive-search__header p {
  margin: 0;
}

.predictive-search__form {
  padding: var(--space-lg) var(--page-gutter);
  border-block-end: 1px solid var(--color-border);
}

.predictive-search__input-row {
  display: grid;
  border: 1px solid var(--color-control-border);
  grid-template-columns: var(--tap-target-min) minmax(0, 1fr) var(--tap-target-min);
  align-items: center;
  background: var(--color-background);
}

.predictive-search__input-icon,
.predictive-search__clear {
  display: grid;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  border: 0;
  place-items: center;
  background: transparent;
  color: currentColor;
}

.predictive-search__input {
  min-width: 0;
  min-height: 52px;
  padding-inline: 0;
  border: 0 !important;
  outline-offset: 2px;
  background: transparent !important;
}

.predictive-search__submit {
  min-height: 52px;
  grid-column: 1 / -1;
}

.predictive-search__results {
  min-height: 4rem;
  padding: var(--space-lg) var(--page-gutter) 0;
}

.predictive-search__footer {
  padding: 0 var(--page-gutter) var(--space-2xl);
}

.predictive-search__results[hidden] + .predictive-search__footer {
  padding-block-start: var(--space-lg);
}

.predictive-search__group + .predictive-search__group {
  margin-block-start: var(--space-xl);
}

.predictive-search__group-title {
  margin-block: 0 var(--space-sm);
}

.predictive-search__list {
  display: grid;
  gap: var(--space-2xs);
}

.predictive-search__result {
  display: grid;
  min-height: var(--tap-target-min);
  padding: var(--space-xs);
  color: currentColor;
  text-decoration: none;
}

.predictive-search__result:hover,
.predictive-search__result:focus-visible,
.predictive-search__result[aria-selected='true'] {
  background: var(--color-surface);
}

.predictive-search__result--product {
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: var(--space-md);
  align-items: center;
}

.predictive-search__media {
  display: block;
  width: 4.5rem;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--color-surface);
}

.predictive-search__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.predictive-search__details,
.predictive-search__result--text {
  display: grid;
  gap: var(--space-2xs);
}

.predictive-search__result-title {
  font-weight: 700;
}

.predictive-search__price {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  align-items: baseline;
  font-size: 0.875rem;
}

.predictive-search__availability {
  color: var(--color-foreground-muted);
  font-size: 0.75rem;
}

.predictive-search__availability[data-sold-out] {
  color: var(--color-foreground);
  font-weight: 700;
}

.predictive-search__empty {
  margin-block: var(--space-lg);
  color: var(--color-foreground-muted);
}

.predictive-search__view-all {
  width: 100%;
  margin-block-start: var(--space-xl);
  justify-content: center;
}

.predictive-search-no-js {
  position: relative;
}

.predictive-search-no-js > summary {
  list-style: none;
}

.predictive-search-no-js > summary::-webkit-details-marker {
  display: none;
}

.predictive-search-no-js__form {
  position: absolute;
  z-index: 30;
  inset-block-start: calc(100% + var(--space-xs));
  inset-inline-end: 0;
  display: grid;
  width: min(90vw, 24rem);
  padding: var(--space-md);
  border: 1px solid var(--color-control-border);
  gap: var(--space-xs);
  background: var(--color-background);
  box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--color-shadow) 18%, transparent);
}

.product-gallery__view-in-space {
  display: flex;
  width: 100%;
  min-height: var(--tap-target-min);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-control-border);
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  color: var(--color-foreground);
  font-weight: 700;
}

.product-gallery__view-in-space[data-shopify-xr-hidden] {
  display: none;
}

.product-gallery__item model-viewer {
  min-height: clamp(24rem, 62vw, 48rem);
}

@media (min-width: 48rem) {
  .newsletter-form__field {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .newsletter-section__inner {
    grid-template-columns: minmax(0, 1.2fr) minmax(20rem, 0.8fr);
  }

  .predictive-search__input-row {
    grid-template-columns: var(--tap-target-min) minmax(0, 1fr) var(--tap-target-min) auto;
  }

  .predictive-search__submit {
    grid-column: auto;
  }
}

@media (min-width: 62rem) {
  .site-footer__grid {
    grid-template-columns: minmax(14rem, 1fr) minmax(20rem, 1.4fr) minmax(10rem, 0.7fr) minmax(10rem, 0.7fr);
    align-items: start;
  }

  .site-footer__utilities {
    grid-template-columns: minmax(24rem, 1fr) auto;
    align-items: end;
  }
}

@keyframes lookbook-hotspot-pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }

  70%,
  100% {
    opacity: 0;
    transform: scale(1.65);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .lookbook-hotspot__trigger:not([aria-expanded='true'])::before {
    animation: lookbook-hotspot-pulse 2.4s ease-out infinite;
  }

  .marquee-banner__track {
    animation: editorial-marquee var(--marquee-duration, 32s) linear infinite;
  }

  cart-drawer[data-open] .cart-drawer__panel {
    animation: cart-drawer-enter var(--motion-slow) var(--ease-enter) both;
  }

  .sticky-cart-bar {
    transition: transform var(--motion-base) var(--ease-enter), visibility var(--motion-base);
  }

  .announcement-bar__item:not([hidden]) {
    animation: announcement-reveal var(--motion-base) var(--ease-enter) both;
  }
}

@keyframes cart-drawer-enter {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes announcement-reveal {
  from {
    transform: translateY(0.25rem);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-banner__viewport {
    overflow: visible;
  }

  .marquee-banner__track,
  .marquee-banner__group {
    width: 100%;
    flex-wrap: wrap;
    min-width: 0;
  }

  .marquee-banner__item {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .marquee-banner__group[aria-hidden='true'],
  .marquee-banner__toggle {
    display: none;
  }

  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    /* 0s y no 0.01ms: ver la nota de la llave 2 del sistema de movimiento (CLS). */
    transition-duration: 0s !important;
  }
}

@media print {
  .gift-card-page {
    display: block;
    padding: 0;
  }

  .gift-card {
    width: 100%;
    border: 0;
    box-shadow: none;
  }

  .gift-card__actions,
  .gift-card__wallet {
    display: none;
  }
}

/* =========================================================================
   PAGINAS NATIVAS (Sprint 4E-001)
   Documentacion, soporte, preguntas frecuentes, historia de marca y paginas
   legales. Todo se apoya en los tokens ya existentes: ni un color, ni una
   duracion, ni un espacio nuevos.
   ========================================================================= */

/* ---------- Indice de anclas, compartido por documentacion y paginas legales ---------- */
.anchor-nav__disclosure {
  border-block: 1px solid var(--color-border-hairline);
}

.anchor-nav__summary {
  display: grid;
  min-height: var(--tap-target-min);
  grid-template-columns: minmax(0, 1fr) var(--tap-target-min);
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  list-style: none;
  text-transform: uppercase;
}

.anchor-nav__summary::-webkit-details-marker {
  display: none;
}

.anchor-nav__list {
  padding-block: var(--space-xs) var(--space-md);
  counter-reset: anchor-nav;
}

.anchor-nav__link {
  display: grid;
  /* 44 px de alto por entrada: es una lista de navegacion, no una nota al pie. */
  min-height: var(--tap-target-min);
  /* Sangria francesa: un titulo largo que ocupa dos lineas alinea la segunda con la
     primera, no debajo del numero. */
  grid-template-columns: 1.25rem minmax(0, 1fr);
  align-items: center;
  gap: var(--space-xs);
  /* La linea de acento se dibuja con el borde, que no ocupa sitio al aparecer: animar un
     ancho movería el texto de toda la lista al cambiar de apartado. */
  padding-inline-start: var(--space-sm);
  border-inline-start: 2px solid transparent;
  color: var(--color-foreground-muted);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: color var(--motion-fast) var(--ease-move),
    border-color var(--motion-fast) var(--ease-move);
}

.anchor-nav__link::before {
  counter-increment: anchor-nav;
  content: counter(anchor-nav) '.';
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
}

.anchor-nav__link:hover,
.anchor-nav__link[aria-current] {
  color: var(--color-foreground);
}

/* El apartado en pantalla se marca con peso y con una linea de acento, no solo con
   color: el color por si solo no distingue nada para quien no lo percibe. */
.anchor-nav__link[aria-current] {
  border-inline-start-color: var(--color-foreground);
  font-weight: 700;
}

.anchor-nav__link[aria-current]::before {
  opacity: 1;
}

/* ---------- Documentacion ---------- */
.main-documentation__header {
  max-width: 46rem;
}

.main-documentation__layout {
  display: grid;
  gap: var(--space-2xl);
  margin-block-start: var(--space-3xl);
}

.main-documentation__body {
  display: grid;
  /* La medida de lectura vive en la columna, no en cada pieza. Cuando la llevaba cada
     hijo, los <h2> se quedaban sin limite y llegaban al borde del contenedor mientras el
     texto paraba 380 px antes: el apartado no tenia un borde derecho, tenia dos. */
  max-width: 68ch;
  gap: var(--space-2xl);
  min-width: 0;
}

/* Un elemento de rejilla se mide por su contenido minimo salvo que se le diga lo
   contrario. Sin esto, un comando largo dentro de un <pre> estira la columna entera y la
   pagina acaba scrolleando en horizontal en movil, en vez de scrollear el bloque. */
.main-documentation__body > * {
  min-width: 0;
}

.doc-section {
  scroll-margin-block-start: var(--space-3xl);
}

.doc-section__title {
  font-size: calc(clamp(1.5rem, 3vw, 2.125rem) * var(--font-heading-scale));
}

.doc-section__summary {
  margin-block: var(--space-xs) 0;
  color: var(--color-foreground-muted);
}

.doc-section__content {
  margin-block-start: var(--space-md);
  line-height: 1.7;
}

.doc-section__content > * + * {
  margin-block-start: var(--space-md);
}

/* Tarjetas, fragmentos y avisos ya no llevan medida propia: la heredan de la columna,
   que es lo que mantiene recto el borde derecho de todo el apartado. */
.doc-preset {
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.doc-preset__badge {
  margin-block-end: var(--space-xs);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.doc-preset__description {
  margin-block-start: var(--space-xs);
  color: var(--color-foreground-muted);
}

.doc-snippet {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.doc-snippet__bar {
  display: flex;
  min-height: var(--tap-target-min);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-inline-start: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.doc-snippet__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
}

.doc-snippet__copy {
  display: inline-flex;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  padding-inline: var(--space-md);
  border: 0;
  border-inline-start: 1px solid var(--color-border);
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
  transition: background-color var(--motion-fast) var(--ease-move);
}

/* La marca de verificacion no existe hasta que hay algo que confirmar: reservarle sitio
   desplazaria la etiqueta al aparecer. Entra con la escala, que no mueve a nadie. */
.doc-snippet__copy-icon {
  display: none;
  line-height: 0;
}

[data-copied] .doc-snippet__copy-icon {
  display: block;
  animation: doc-copied-in var(--motion-fast) var(--ease-enter) both;
}

@keyframes doc-copied-in {
  from {
    opacity: 0;
    transform: scale(0.6);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

[data-copied] .doc-snippet__copy {
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

.doc-snippet__copy:hover {
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

.doc-snippet__copy:focus-visible {
  outline-offset: -3px;
}

.doc-snippet__code {
  /* El unico sitio del tema con tipografia monoespaciada: un fragmento de codigo se lee
     mal en una serif editorial, y aqui la exactitud importa mas que el tono.

     Y el unico sitio que se sale del overflow-wrap: anywhere global: un comando partido a
     mitad de una ruta o de un flag se copia mal y se lee peor. Aqui el bloque scrollea. */
  overflow-wrap: normal;
  margin: 0;
  padding: var(--space-md);
  overflow-x: auto;
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  tab-size: 2;
}

.doc-callout {
  padding: var(--space-md) var(--space-lg);
  border-inline-start: 3px solid var(--color-border);
  background: var(--color-surface-subtle);
}

.doc-callout--tip {
  border-inline-start-color: var(--color-accent);
}

/* Aviso importante: el unico que lleva el borde a plena intensidad. No se usa color para
   comunicarlo, porque la etiqueta de texto ya dice lo que es. */
.doc-callout--warning {
  border-inline-start-color: var(--color-foreground);
}

.doc-callout__label {
  margin-block-end: var(--space-2xs);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: var(--font-letter-spacing-eyebrow);
  text-transform: uppercase;
}

.doc-callout__text {
  color: var(--color-foreground-muted);
}

/* ---------- Soporte ---------- */
.main-support__header {
  max-width: 46rem;
}

.main-support__sla {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  gap: var(--space-xs);
  padding-inline: var(--space-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.8125rem;
}

.main-support__sla-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-accent);
}

.main-support__layout {
  display: grid;
  gap: var(--space-3xl);
  margin-block-start: var(--space-2xl);
}

/* Los tres apartados de la pagina (formulario, preguntas y canales) comparten la misma
   escala que un apartado de la documentacion. Antes eran <h2> sin clase y caian en el
   clamp de portada: 76 px en un portatil, mas grandes que el propio contenido. */
.main-support__section-title {
  font-size: calc(clamp(1.5rem, 3vw, 2.125rem) * var(--font-heading-scale));
}

.main-support__policies {
  display: grid;
  margin-block-start: var(--space-2xl);
  gap: var(--space-lg);
}

.main-support__policy {
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.main-support__policy-title {
  font-size: 1.125rem;
}

.main-support__policy-items {
  margin-block-start: var(--space-sm);
  color: var(--color-foreground-muted);
  font-size: 0.9375rem;
}

.main-support__policy-items li + li {
  margin-block-start: var(--space-2xs);
}

/* ---------- Preguntas frecuentes ---------- */
.main-faq__header {
  max-width: 42rem;
}

/* El margen va en cada grupo, no en el par adyacente: con el selector "+" el primero se
   quedaba sin separacion y su encabezado de categoria chocaba contra el descendente de la
   ultima linea del h1. .main-faq__groups no existe en el markup; era regla muerta. */
.main-faq__group {
  margin-block-start: var(--space-2xl);
}

.main-faq__category {
  margin-block-end: var(--space-md);
  font-size: calc(clamp(1.375rem, 2.5vw, 1.75rem) * var(--font-heading-scale));
}

.main-faq__category-description {
  margin-block: calc(var(--space-md) * -1) var(--space-md);
  color: var(--color-foreground-muted);
}

.main-faq__cta {
  display: grid;
  gap: var(--space-lg);
  margin-block-start: var(--space-3xl);
  padding: var(--space-xl);
  background: var(--gradient-background, var(--color-background));
  color: var(--color-foreground);
}

.main-faq__cta-title {
  font-size: 1.5rem;
}

/* ---------- Historia de marca ---------- */
.main-about__header {
  max-width: 46rem;
}

.main-about__blocks {
  display: grid;
  gap: var(--space-4xl);
  margin-block-start: var(--space-3xl);
}

.main-about__story-media {
  position: relative;
  overflow: hidden;
  /* El ratio lo fija el bloque, asi que la caja reserva su altura antes de que llegue la
     imagen y la pagina no salta al cargarla. */
  aspect-ratio: var(--about-story-ratio, 21 / 9);
  background: var(--color-surface);
}

.main-about__story-image,
.main-about__gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-about__placeholder {
  display: block;
  width: 100%;
  height: 100%;
}

.main-about__story-text {
  max-width: 62ch;
  margin-block-start: var(--space-lg);
}

.main-about__quote {
  max-width: 34ch;
  margin: 0 auto;
  text-align: center;
}

.main-about__quote-text {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--font-heading-family);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.2;
  text-wrap: balance;
}

.main-about__quote-attribution {
  margin-block-start: var(--space-md);
  font-size: 0.8125rem;
}

.main-about__quote-name,
.main-about__quote-role {
  display: block;
}

.main-about__quote-role {
  color: var(--color-foreground-muted);
}

/* El relato encabeza su propio panel, asi que pesa un punto mas que los otros dos
   apartados, pero sigue siendo un titulo de apartado y no una portada. */
.main-about__story-title {
  font-size: calc(clamp(1.75rem, 3.5vw, 2.5rem) * var(--font-heading-scale));
}

.main-about__values-title,
.main-about__gallery-title {
  margin-block-end: var(--space-lg);
  font-size: calc(clamp(1.375rem, 2.5vw, 1.75rem) * var(--font-heading-scale));
}

.main-about__values-grid {
  display: grid;
  gap: var(--space-xl);
}

.main-about__value {
  padding-block-start: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.main-about__value-title {
  font-size: 1.125rem;
}

.main-about__value-text {
  margin-block-start: var(--space-xs);
  color: var(--color-foreground-muted);
}

.main-about__gallery-grid {
  display: grid;
  gap: var(--space-md);
}

.main-about__gallery-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--color-surface);
}

.main-about__gallery-caption {
  margin-block-start: var(--space-md);
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

/* ---------- Paginas legales ---------- */
.main-policy__header {
  max-width: 46rem;
}

.main-policy__updated {
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
}

.main-policy__layout {
  display: grid;
  gap: var(--space-2xl);
  margin-block-start: var(--space-2xl);
}

.main-policy__body {
  /* 70ch: la medida de lectura de un texto legal largo. Por encima de 75 el ojo pierde el
     principio de la linea siguiente, y este es contenido que la gente lee entero. */
  max-width: 70ch;
  min-width: 0;
  font-size: 1.0625rem;
  line-height: 1.75;
}

.main-policy__body > * + * {
  margin-block-start: var(--space-lg);
}

.main-policy__body h2 {
  margin-block-start: var(--space-2xl);
  font-size: calc(clamp(1.375rem, 2.5vw, 1.75rem) * var(--font-heading-scale));
  scroll-margin-block-start: var(--space-3xl);
}

.main-policy__body h3 {
  margin-block-start: var(--space-xl);
  font-size: 1.1875rem;
}

.main-policy__body h2 + *,
.main-policy__body h3 + * {
  margin-block-start: var(--space-sm);
}

.main-policy__body li + li {
  margin-block-start: var(--space-xs);
}

/* LEAD-001. Politicas que genera Shopify en /policies/* (reembolso, envio, privacidad,
   terminos, contacto). No pasan por main-policy.liquid: su marcado es fijo
   (.shopify-policy__container > __title > h1 + __body > .rte) y Shopify inyecta despues de
   base.css su propio CSS (65ch, titulo centrado). Sin esto heredaban el h1 de portada (7rem,
   partido a mitad de palabra) sin aire arriba ni abajo. .site-main sube la especificidad
   para ganar a ese CSS inyectado; medida, escala y ritmo son los de las paginas legales del
   tema (.main-policy__*). */
.site-main .shopify-policy__container {
  width: min(100% - (var(--page-gutter) * 2), 46rem);
  max-width: none;
  margin-inline: auto;
  padding: var(--space-3xl) 0 var(--space-4xl);
}

.site-main .shopify-policy__title {
  margin-block-end: var(--space-2xl);
  padding-block-end: var(--space-lg);
  border-block-end: var(--border-width) solid var(--color-border-hairline);
  text-align: start;
}

.site-main .shopify-policy__title h1 {
  font-size: calc(clamp(2.25rem, 5vw, 3.5rem) * var(--font-heading-scale));
  overflow-wrap: normal;
  hyphens: manual;
}

.site-main .shopify-policy__body {
  max-width: 70ch;
  font-size: 1.0625rem;
  line-height: 1.75;
}

.site-main .shopify-policy__body .rte > * + * {
  margin-block-start: var(--space-lg);
}

.site-main .shopify-policy__body h2 {
  margin-block-start: var(--space-2xl);
  font-size: calc(clamp(1.375rem, 2.5vw, 1.75rem) * var(--font-heading-scale));
}

.site-main .shopify-policy__body h3 {
  margin-block-start: var(--space-xl);
  font-size: 1.1875rem;
}

.site-main .shopify-policy__body h2 + *,
.site-main .shopify-policy__body h3 + * {
  margin-block-start: var(--space-sm);
}

.site-main .shopify-policy__body li + li {
  margin-block-start: var(--space-xs);
}

@media (max-width: 47.99rem) {
  .site-main .shopify-policy__container {
    padding-block: var(--space-2xl) var(--space-3xl);
  }
}

@media (min-width: 62rem) {
  .main-documentation__layout,
  .main-policy__layout {
    grid-template-columns: minmax(12rem, 0.24fr) minmax(0, 1fr);
    gap: var(--space-4xl);
    align-items: start;
  }

  /* La barra lateral acompana al scroll, pero nunca supera la altura de la ventana: con
     un indice largo, lo que sobra se desplaza dentro de ella en vez de quedar fuera. */
  .main-documentation__nav,
  .main-policy__nav {
    position: sticky;
    top: var(--space-2xl);
    max-height: calc(100vh - (var(--space-2xl) * 2));
    overflow-y: auto;
  }

  .main-support__layout {
    grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
    gap: var(--space-4xl);
    align-items: start;
  }

  .support-form__grid,
  .main-support__policies {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .support-form__footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .main-about__values-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-about__gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-auto-flow: column;
  }

  .main-faq__cta {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}

/* =========================================================================
   REFINAMIENTO DE PAGINAS Y NAVEGACION (Sprint 4E-002)
   ========================================================================= */

/* ---------- Acordeones: apertura sedosa ----------
   Un <details> nativo no renderiza su contenido cuando esta cerrado, asi que una
   transicion de ida nunca tendria fotograma inicial. Una animacion si arranca en el
   momento en que el contenido pasa a existir, que es justo lo que queremos animar. El
   cierre es instantaneo a proposito: retenerlo obligaria a gobernar el atributo open
   desde JavaScript y a pelearse con el teclado. */
html[data-animations='subtle'] .faq-item[open] .faq-item__answer,
html[data-animations='full'] .faq-item[open] .faq-item__answer {
  animation: faq-answer-in var(--motion-base) var(--ease-enter) both;
}

@keyframes faq-answer-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* El mas gira al convertirse en menos. El giro completo se nota sin llamar la atencion,
   porque las dos barras acaban formando la misma figura. */
.faq-item__icon {
  transition: transform var(--motion-base) var(--ease-enter);
}

.faq-item[open] .faq-item__icon {
  transform: rotate(180deg);
}

/* ---------- Buscador instantaneo de preguntas ---------- */
.main-faq__search {
  display: block;
  max-width: 26rem;
  margin-block-start: var(--space-2xl);
}

.main-faq__search-status {
  margin-block: var(--space-xs) 0;
  color: var(--color-foreground-muted);
  font-size: 0.8125rem;
  /* Reserva su linea: sin esto, el conteo de resultados empuja la lista hacia abajo en
     cuanto aparece y toda la pagina da un salto al primer caracter. */
  min-height: 1.2em;
}

.main-faq__search-empty {
  margin-block-start: var(--space-2xl);
  color: var(--color-foreground-muted);
}

/* ---------- Soporte: validacion sutil y tarjetas de alcance ----------
   :user-invalid, no :invalid: el navegador solo lo aplica despues de que la persona haya
   interactuado con el campo, asi que un formulario recien abierto no aparece en rojo
   antes de que nadie escriba nada. */
.support-form .form-field input:user-invalid,
.support-form .form-field select:user-invalid,
.support-form .form-field textarea:user-invalid {
  border-color: var(--color-foreground);
  box-shadow: inset 2px 0 0 var(--color-foreground);
}

.main-support__policy {
  border-color: var(--color-border-hairline);
}

.main-support__policy-items ul {
  padding-inline-start: 0;
  list-style: none;
}

/* Vinete de raya, no de punto: la raya es la marca editorial que el tema ya usa en los
   hilos de separacion, y se alinea con el texto en vez de flotar sobre el. */
.main-support__policy-items li {
  position: relative;
  padding-inline-start: var(--space-md);
}

.main-support__policy-items li::before {
  position: absolute;
  width: 0.5rem;
  height: 1px;
  inset-block-start: 0.7em;
  inset-inline-start: 0;
  background: currentColor;
  content: '';
  opacity: 0.6;
}

/* ---------- Historia de marca: comillas editoriales ---------- */
.main-about__quote-text::before {
  display: block;
  margin-block-end: calc(var(--space-md) * -1);
  color: var(--color-foreground-muted);
  content: '\201C';
  font-family: var(--font-heading-family);
  font-size: 3em;
  line-height: 1;
  opacity: 0.35;
}

/* ---------- Paginas legales: enlaces del texto ---------- */
.main-policy__body a {
  color: currentColor;
  text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: text-decoration-color var(--motion-fast) var(--ease-move);
}

.main-policy__body a:hover {
  text-decoration-color: currentColor;
}

/* ---------- Header: panel desplegable de escritorio ---------- */
@media (min-width: 62rem) {
  .desktop-nav__panel {
    border-color: var(--color-border-hairline);
    box-shadow: 0 1.25rem 2.5rem color-mix(in srgb, var(--color-shadow) 10%, transparent);
  }

  /* Igual que el acordeon: el panel pasa de no existir a existir, asi que lo que entra es
     una animacion, no una transicion. */
  html[data-animations='subtle'] .desktop-nav__disclosure[data-open] .desktop-nav__panel,
  html[data-animations='full'] .desktop-nav__disclosure[data-open] .desktop-nav__panel {
    animation: desktop-nav-panel-in var(--motion-fast) var(--ease-enter) both;
  }
}

@keyframes desktop-nav-panel-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* ---------- Header: menu secundario ---------- */
.site-header__secondary {
  display: none;
}

.drawer-panel__secondary {
  padding: var(--space-lg) var(--page-gutter);
  border-block-start: 1px solid var(--color-border);
}

.drawer-panel__secondary-list {
  display: grid;
}

.drawer-panel__secondary-list a,
.site-header__secondary-list a {
  display: flex;
  min-height: var(--tap-target-min);
  align-items: center;
  color: currentColor;
  text-decoration: none;
}

.drawer-panel__secondary-list a {
  color: var(--color-foreground-muted);
  font-size: 0.9375rem;
}

.drawer-panel__secondary-list a:hover {
  color: var(--color-foreground);
}

@media (min-width: 62rem) {
  /* Solo en escritorio: en movil estos enlaces ya viven al pie del menu lateral, y
     repetirlos en una cabecera estrecha le quitaria sitio al carrito. */
  .site-header__secondary {
    display: block;
    /* El margen va aqui y no como gap del contenedor: los botones de icono vecinos ya se
       separan con su propio relleno de 44 px, y un gap los alejaria de mas. */
    margin-inline-end: var(--space-3);
  }

  .site-header__secondary-list {
    display: flex;
    gap: var(--space-3);
    align-items: center;
  }

  .site-header__secondary-list a {
    color: var(--color-foreground-muted);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: var(--font-letter-spacing-eyebrow);
    text-transform: uppercase;
    transition: color var(--motion-fast) var(--ease-move);
  }

  .site-header__secondary-list a:hover {
    color: var(--color-foreground);
  }
}


/* =========================================================================
   AUDITORIA EN VIVO: CORRECCIONES P0 Y P1 (Sprint 4F-001)
   Referencia: agent-comms/outbox-claude/CLAUDE-AUDIT-LIVE-001-tienda-en-vivo.md
   ========================================================================= */

/* ---------- T1. Checkout acelerado en el carrito ---------- */
/* Los botones viven en un custom element con shadow DOM cerrado: solo se tocan con las
   propiedades que publica Shopify, declaradas sobre el propio elemento como recomienda la
   documentacion (heredadas desde el contenedor perderian frente a sus valores por
   defecto). block-size es la altura en la pila vertical e inline-size la altura en la
   fila horizontal: las dos a la altura tactil del boton Checkout, con su mismo radio y el
   esqueleto de carga en el tono de superficie del esquema. */
.cart__dynamic-checkout {
  width: 100%;
  margin-block-start: var(--space-2);
}

.cart__dynamic-checkout shopify-accelerated-checkout-cart {
  --shopify-accelerated-checkout-button-block-size: var(--tap-target-min);
  --shopify-accelerated-checkout-button-inline-size: var(--tap-target-min);
  --shopify-accelerated-checkout-button-border-radius: var(--button-radius, 0px);
  --shopify-accelerated-checkout-skeleton-background-color: var(--color-surface);
}

/* ---------- T2. Escalera de apilamiento ---------- */
/* La cabecera sticky queda en 150 (header.liquid). Todo modal global va por encima; el
   de contrasena estaba en 90 y la cabecera le habria tapado el boton de cerrar. */
.password-modal__overlay {
  z-index: 240;
}

/* ---------- T8. Consecuencias de la cabecera sticky ---------- */
/* --header-offset lo publica initHeaderScrollState con la altura real de la cabecera;
   vale 0 cuando no es sticky. scroll-padding hace que las anclas y el foco por teclado
   se detengan debajo de la cabecera y no detras de ella (WCAG 2.4.11). */
:root {
  --header-offset: 0px;
}

html {
  scroll-padding-block-start: var(--header-offset);
  /* AF-08 (AUDIT-FINAL-001): la barra fija de compra publica su altura en --sticky-cart-offset. */
  scroll-padding-block-end: var(--sticky-cart-offset, 0px);
}

@media (min-width: 62rem) {
  .product-main__details,
  .featured-product__details {
    inset-block-start: calc(var(--header-offset) + var(--space-4));
  }

  .facets {
    inset-block-start: calc(var(--header-offset) + var(--space-3));
  }

  .main-documentation__nav,
  .main-policy__nav {
    top: calc(var(--header-offset) + var(--space-2xl));
    max-height: calc(100vh - var(--header-offset) - (var(--space-2xl) * 2));
  }
}

/* ---------- T3. Legibilidad del hero cinematografico ---------- */
/* Sobre fotografia no hay gris seguro: el subtitulo usa el color de texto del esquema,
   igual que el titular. Medido antes del cambio: 1.19:1 a 390 px. */
.hero-editorial--cinematic .hero-editorial__subheading {
  color: var(--color-foreground);
}

/* "Gradient behind the text only": un velo que sigue al bloque de texto donde se
   coloque. El texto va siempre sobre la parte opaca del velo (el difuminado empieza
   fuera de la caja del texto) y su opacidad nunca baja de 60 %: es el minimo con el que
   un texto crema de 16 px llega a 4.5:1 incluso sobre blanco puro (con 55 % se queda en
   4.34:1). */
.hero-editorial--cinematic.hero-editorial--overlay-gradient_content {
  --hero-scrim-alpha: max(0.6, var(--hero-overlay-opacity, 0.6));
}

.hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__inner {
  overflow: clip;
}

.hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content {
  position: relative;
  isolation: isolate;
}

/* Un velo radial del doble de alto y de ancho que el bloque de texto, centrado en el. Con
   el tramo opaco hasta el 72 % del radio, las cuatro esquinas del bloque (a 70.7 %) quedan
   dentro de la zona opaca y el difuminado ocurre entero fuera del texto: se lee como luz
   que cae, no como una caja gris. */
.hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content::before {
  position: absolute;
  z-index: -1;
  inset: -50%;
  /* Caida escalonada (curva de salida suave): con dos paradas el borde del velo se leia
     como un arco sobre el techo de la foto. */
  background: radial-gradient(
    closest-side,
    rgb(0 0 0 / var(--hero-scrim-alpha)) 72%,
    rgb(0 0 0 / calc(var(--hero-scrim-alpha) * 0.84)) 77%,
    rgb(0 0 0 / calc(var(--hero-scrim-alpha) * 0.6)) 82%,
    rgb(0 0 0 / calc(var(--hero-scrim-alpha) * 0.36)) 88%,
    rgb(0 0 0 / calc(var(--hero-scrim-alpha) * 0.14)) 94%,
    rgb(0 0 0 / 0) 100%
  );
  content: '';
  pointer-events: none;
}

/* ---------- T4. Galeria de producto sin huecos ---------- */
/* Una sola imagen, o ninguna, ocupa todo el ancho de la galeria. Con un numero impar de
   imagenes la primera abre a todo el ancho y el resto va por parejas, la misma regla que
   ya usa el producto destacado: la ultima fila nunca queda con una celda vacia. */
.product-gallery__item:only-child,
.product-gallery__placeholder {
  grid-column: 1 / -1;
}

@media (min-width: 62rem) {
  .product-main__layout--grid .product-gallery__item:first-child:nth-last-child(odd) {
    grid-column: 1 / -1;
  }
}

/* ---------- T7. Carrusel tactil de la galeria (por debajo de 62rem) ---------- */
/* Hasta 62rem la ficha es de una columna: apilar las imagenes empujaba el titulo y el
   boton de compra tres pantallas abajo. Aqui la galeria es una fila con scroll-snap que
   se desliza sin JavaScript; <product-gallery> anade contador y botones. Todas las
   diapositivas comparten el marco de la primera imagen (--gallery-ratio, acotado en el
   Liquid) y nunca pasan de 55 % del alto de la ventana: en un movil bajo (690 px) el
   titulo del producto sigue entrando en la primera pantalla. */
.product-gallery__pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.product-gallery__counter {
  min-width: 5ch;
  margin: 0;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.product-gallery__step--previous svg {
  transform: rotate(90deg);
}

.product-gallery__step--next svg {
  transform: rotate(-90deg);
}

[dir='rtl'] .product-gallery__step--previous svg {
  transform: rotate(-90deg);
}

[dir='rtl'] .product-gallery__step--next svg {
  transform: rotate(90deg);
}

.product-gallery__step:disabled {
  opacity: 0.35;
  cursor: default;
}

@media (max-width: 61.99rem) {
  .product-main__layout--stack .product-gallery__items,
  .product-main__layout--grid .product-gallery__items {
    display: flex;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
  }

  .js .product-main__layout--stack .product-gallery__items,
  .js .product-main__layout--grid .product-gallery__items {
    scrollbar-width: none;
  }

  .js .product-main__layout--stack .product-gallery__items::-webkit-scrollbar,
  .js .product-main__layout--grid .product-gallery__items::-webkit-scrollbar {
    display: none;
  }

  .product-main__layout--stack .product-gallery__items:focus-visible,
  .product-main__layout--grid .product-gallery__items:focus-visible {
    outline-offset: -3px;
  }

  .product-main__layout--stack .product-gallery__item,
  .product-main__layout--grid .product-gallery__item,
  .product-main__layout--stack .product-gallery__placeholder,
  .product-main__layout--grid .product-gallery__placeholder {
    flex: 0 0 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  /* El borde de "imagen de la variante" sirve en la rejilla de escritorio; en un
     carrusel de una imagen a la vez no marca nada. */
  .product-main__layout--stack .product-gallery__item[data-selected]::after,
  .product-main__layout--grid .product-gallery__item[data-selected]::after {
    content: none;
  }

  .product-main__layout--stack .product-gallery__image,
  .product-main__layout--grid .product-gallery__image {
    height: auto;
    max-height: 55svh;
    aspect-ratio: var(--gallery-ratio, 0.8);
    object-fit: contain;
  }
}

/* ---------- 5B-001. Zoom de imagen de la ficha ---------- */
/* Disparador: la foto entera es el boton (un toque o un clic la amplian) y la lupa de 44 px
   solo lo anuncia. Tras un deslizamiento el navegador no dispara click, asi que no choca
   con el carrusel movil. Sin JavaScript no hay visor y el boton no se muestra. */
.product-gallery__zoom-trigger {
  position: absolute;
  inset: 0;
  display: flex;
  padding: var(--space-2);
  border: 0;
  align-items: flex-end;
  justify-content: flex-end;
  background: transparent;
  color: var(--color-foreground);
  cursor: zoom-in;
}

.no-js .product-gallery__zoom-trigger {
  display: none;
}

.product-gallery__zoom-trigger:focus-visible {
  outline-offset: -5px;
  box-shadow: inset 0 0 0 7px var(--color-background);
}

.product-gallery__zoom-icon {
  display: grid;
  width: var(--tap-target-min);
  height: var(--tap-target-min);
  border-radius: 50%;
  place-items: center;
  background: color-mix(in srgb, var(--color-background) 86%, transparent);
  box-shadow: 0 0.25rem 1rem color-mix(in srgb, var(--color-shadow) 12%, transparent);
}

/* Visor: <dialog> a pantalla completa en la capa superior, con el fondo del esquema de la
   seccion. La pista es un scroll-snap horizontal; con zoom deja de desplazarse y el gesto
   pasa a ser del visor (touch-action: none). El JS fija el tamano de cada foto a 1x. */
.product-zoom {
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: var(--color-background);
  color: var(--color-foreground);
}

.product-zoom[open] {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.product-zoom::backdrop {
  background: var(--color-background);
}

.product-zoom__top,
.product-zoom__bar {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--page-gutter);
}

.product-zoom__top {
  justify-content: space-between;
  padding-block-start: calc(var(--space-1) + env(safe-area-inset-top, 0px));
}

.product-zoom__bar {
  justify-content: center;
  padding-block-end: calc(var(--space-1) + env(safe-area-inset-bottom, 0px));
}

.product-zoom__counter {
  margin: 0;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.product-zoom__actions {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.product-zoom__reset {
  min-height: var(--tap-target-min);
  padding: 0 var(--space-2);
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  text-decoration: underline;
  text-underline-offset: 0.25em;
  text-transform: uppercase;
  cursor: pointer;
}

.product-zoom__track {
  display: flex;
  overflow-x: auto;
  overscroll-behavior: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.product-zoom__track::-webkit-scrollbar {
  display: none;
}

.product-zoom__track:focus-visible {
  outline-offset: -3px;
}

.product-zoom__slide {
  display: grid;
  flex: 0 0 100%;
  margin: 0;
  overflow: hidden;
  place-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  touch-action: pan-x;
}

.product-zoom__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform var(--motion-fast) var(--ease-move);
  user-select: none;
  -webkit-user-drag: none;
}

.product-zoom[data-zoomable] .product-zoom__image {
  cursor: zoom-in;
}

.product-zoom[data-zoomed] .product-zoom__track {
  overflow: hidden;
}

.product-zoom[data-zoomed] .product-zoom__slide {
  touch-action: none;
}

.product-zoom[data-zoomed] .product-zoom__image {
  cursor: zoom-out;
}

/* Durante el pellizco o el arrastre la foto va pegada al dedo, sin transicion. */
.product-zoom[data-gesture] .product-zoom__image {
  transition: none;
  will-change: transform;
}

.product-zoom button:disabled {
  opacity: 0.35;
  cursor: default;
}

.product-zoom__step--previous svg {
  transform: rotate(90deg);
}

.product-zoom__step--next svg {
  transform: rotate(-90deg);
}

[dir='rtl'] .product-zoom__step--previous svg {
  transform: rotate(-90deg);
}

[dir='rtl'] .product-zoom__step--next svg {
  transform: rotate(90deg);
}

html[data-animations='subtle'] .product-zoom[open],
html[data-animations='full'] .product-zoom[open] {
  animation: gallery-media-in var(--motion-fast) var(--ease-enter) both;
}

/* ---------- T5. Buscador: fila estable y una sola cruz ---------- */
/* El boton de borrar sale del flujo cuando esta oculto; sin posiciones explicitas el
   boton de enviar caia en su pista de 44 px y "SEARCH" se apilaba letra a letra. */
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.predictive-search__input-icon {
  grid-row: 1;
  grid-column: 1;
}

/* El campo ocupa tambien la pista del boton de borrar y le reserva sitio con su relleno:
   con el campo vacio no queda un hueco de 44 px entre el texto y SEARCH, y al escribir la
   cruz aparece dentro del campo, no a su lado. */
.predictive-search__input {
  grid-row: 1;
  grid-column: 2 / 4;
  padding-inline-end: var(--tap-target-min);
}

.predictive-search__clear {
  z-index: 1;
  grid-row: 1;
  grid-column: 3;
}

.predictive-search__submit {
  white-space: nowrap;
}

@media (min-width: 48rem) {
  .predictive-search__submit {
    grid-row: 1;
    grid-column: 4;
  }
}

/* ---------- T6. Cajon del carrito en pantallas bajas ---------- */
/* El panel ya no se desplaza entero: cabecera, avisos y pie quedan fijos y solo se
   mueve la pista de lineas y recomendaciones. Si la ventana es tan baja que ni la pista
   minima cabe, el contenido entero pasa a desplazarse como ultimo recurso. */
.cart-drawer__panel {
  min-height: 0;
  overflow: hidden;
}

.cart-drawer__header,
.cart-drawer__message {
  flex-shrink: 0;
}

.cart-drawer__content {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.cart-drawer__form {
  min-height: 0;
}

.cart-drawer__scroll {
  flex: 1 1 auto;
  min-height: 7rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.cart-drawer__footer {
  flex-shrink: 0;
}

.cart-rewards {
  flex-shrink: 0;
}

/* En ventanas bajas (un portatil de 768 px con la barra del navegador se queda en unos
   650) el pie y la barra de envio compactan su aire para que la primera linea del
   carrito se vea entera sin desplazar la pista. */
@media (max-height: 45rem) {
  .cart-drawer__header {
    min-height: 4.5rem;
  }

  .cart-rewards {
    gap: var(--space-xs);
    padding-block: var(--space-sm);
  }

  .cart-drawer__footer {
    --flow-space: var(--space-xs);
    padding-block: var(--space-sm);
  }
}


/* =========================================================================
   FRICCIONES COMERCIALES DE GPT-AUDIT-002 (Sprint 4F-002)
   ========================================================================= */

/* ---------- T1. Sticky ATC: cantidad y total ---------- */
/* La linea de datos pasa a flex para que, si no cabe, se recorte el nombre de la variante
   y nunca "12 x $980.00". El total va en su propia linea: con 12 unidades a 360 px
   ("Total $11,760.00") no cabria junto al resto y se habria cortado justo lo que el
   comprador necesita confirmar antes de pulsar. */
.sticky-cart-bar__meta {
  display: flex;
  align-items: baseline;
  gap: 0.35em;
}

.sticky-cart-bar__variant {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticky-cart-bar__separator,
.sticky-cart-bar__price {
  flex: none;
}

.sticky-cart-bar__total {
  overflow: hidden;
  margin: 0;
  color: var(--color-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Con la linea del total la barra crece unos 12 px: la reserva inferior del documento
   crece con ella para que el final de la pagina no quede escondido debajo. */
body[data-sticky-cart-visible]:has(sticky-cart-bar [data-sticky-total]:not([hidden])) {
  padding-block-end: calc(5rem + env(safe-area-inset-bottom));
}

@media (min-width: 48rem) {
  body[data-sticky-cart-visible]:has(sticky-cart-bar [data-sticky-total]:not([hidden])) {
    padding-block-end: calc(5.75rem + env(safe-area-inset-bottom));
  }
}

/* ---------- T2. Pagina de carrito sin desborde horizontal ---------- */
/* El stepper es inline-grid y su pista central es minmax(2.25rem, 1fr): medido por su
   contenido, el campo numerico aporta su ancho intrinseco (unos 170 px) y el control
   llegaba a 265 px dentro de una columna de 160. Mismo tope que ya usa el cajon. */
.cart-item__stepper {
  max-width: 9rem;
}

/* Cantidad y "Remove" comparten fila si caben y, si no, Remove baja a la siguiente en vez
   de salirse por el borde derecho. */
.cart-item__controls {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  column-gap: var(--space-2);
  row-gap: var(--space-1);
}

.cart-item__controls label {
  flex-basis: 100%;
}

.cart-item__controls > a {
  display: inline-flex;
  min-height: var(--tap-target-min);
  align-items: center;
}

/* ---------- T3. Acordeones de la ficha de producto ---------- */
/* Hilo fino arriba y abajo, titulo en versalitas pequenas como los rotulos del tema y una
   flecha que gira al abrir. Varios seguidos forman una sola lista: sin aire entre ellos y
   sin doble hilo. */
.product-details__accordion {
  border-block: 1px solid var(--color-border-hairline);
}

.product-main__info > .product-details__accordion + .product-details__accordion {
  margin-block-start: 0;
  border-block-start: 0;
}

.product-details__summary {
  display: grid;
  min-height: 3.5rem;
  grid-template-columns: minmax(0, 1fr) var(--tap-target-min);
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  list-style: none;
}

.product-details__summary::-webkit-details-marker {
  display: none;
}

.product-details__heading {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.product-details__icon {
  display: inline-flex;
  justify-content: center;
  transition: transform var(--motion-base) var(--ease-enter);
}

.product-details__accordion[open] .product-details__icon {
  transform: rotate(180deg);
}

.product-details__content {
  max-width: 64ch;
  padding-block-end: var(--space-4);
  color: var(--color-foreground-muted);
  font-size: 0.9375rem;
}

/* Misma entrada que las respuestas del FAQ: el contenido de un <details> no existe
   cerrado, asi que se anima al aparecer y el cierre es instantaneo. */
html[data-animations='subtle'] .product-details__accordion[open] .product-details__content,
html[data-animations='full'] .product-details__accordion[open] .product-details__content {
  animation: faq-answer-in var(--motion-base) var(--ease-enter) both;
}

/* ---------- Cabecera movil con nombre de tienda largo ---------- */
/* Con la marca centrada y tres iconos a la derecha, en 390 px la columna central tiene
   unos 70 px: "LINEA NOVE" pisaba la lupa 26 px (41 px a 360). Por debajo de 48rem la
   marca se alinea a la izquierda junto a un boton de menu solo con icono; la palabra
   "Menu" sigue ahi para lectores de pantalla. Decision aprobada por Johandry en 4F-002. */
@media (max-width: 47.99rem) {
  .site-header__inner {
    grid-template-columns: auto minmax(0, 1fr) auto;
    /* 5A-003. Los 44 px de cada boton ya separan: con el hueco de 12 px "LINEA NOVE"
       seguia cortada a 360 px (le faltaban 12 px medidos en la tienda). */
    column-gap: var(--space-2xs);
  }

  .site-header__brand {
    min-width: 0;
    max-width: 100%;
    justify-self: start;
  }

  .site-header__brand-text {
    font-size: clamp(1.1rem, 4.5vw, 1.5rem);
    /* COMP-001 (S-04). La marca movil va alineada a la izquierda; la segunda linea tambien. */
    text-align: start;
  }

  /* 5A-003. La cabecera movil es fija: sin tope, un logo vertical a 140 px de ancho la
     llevaba a 280 px de alto. El ancho que se pinta es el menor entre el ajuste y el que
     deja el logo en 3rem de alto (max-width: 100 % sigue conteniendolo en la columna), asi
     que la proporcion no se deforma. */
  .site-header__logo-image {
    width: min(var(--logo-width, 140px), calc(3rem * var(--logo-ratio, 1)));
  }

  .site-header__menu-button span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
}

/* =========================================================================
   FAMILIAS FISICAS DE MOVIMIENTO (motion_style)
   - Atelier (Sartorial / Alta costura): expo-out fluido, elevacion sutil.
   - Technical (Imprint / Estudio tecnico): respuesta instantanea, sharp, grafito.
   - Heritage (Archive / Museo y boveda): inercia ceremonial, patina de laton y cursivas.
   ========================================================================= */

html[data-motion-style='atelier'],
:root {
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-move: cubic-bezier(0.65, 0, 0.35, 1);
  --motion-fast: 160ms;
  --motion-base: 680ms;
  --motion-slow: 1000ms;
  --motion-expressive: 1200ms;
  --reveal-shift: 24px;
  --reveal-shift-expressive: 64px;
  --unveil-scale: 1.18;
  --parallax-scale: 1.06;
}

html[data-motion-style='technical'] {
  --ease-exit: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-enter: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-move: cubic-bezier(0.25, 1, 0.5, 1);
  --motion-fast: 90ms;
  --motion-base: 340ms;
  --motion-slow: 540ms;
  --motion-expressive: 640ms;
  --reveal-shift: 14px;
  --reveal-shift-expressive: 32px;
  --unveil-scale: 1.06;
  --parallax-scale: 1.03;
}

html[data-motion-style='heritage'] {
  --ease-exit: cubic-bezier(0.5, 0, 0.75, 0);
  --ease-enter: cubic-bezier(0.22, 0.8, 0.25, 1);
  --ease-move: cubic-bezier(0.45, 0.05, 0.55, 0.95);
  --motion-fast: 220ms;
  --motion-base: 880ms;
  --motion-slow: 1250ms;
  --motion-expressive: 1500ms;
  --reveal-shift: 32px;
  --reveal-shift-expressive: 76px;
  --unveil-scale: 1.25;
  --parallax-scale: 1.08;
}

/* Microinteracciones de hover y foco diferenciadas */
@media (prefers-reduced-motion: no-preference) {
  /* Atelier: elevacion sutil en boton y tarjeta */
  html[data-motion-style='atelier'] .button:hover:not([disabled]) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  html[data-motion-style='atelier'] .product-card:hover .product-card__media {
    transform: translateY(-2px);
  }

  html[data-motion-style='atelier'] .button:focus-visible,
  html[data-motion-style='atelier'] input:focus-visible,
  html[data-motion-style='atelier'] select:focus-visible {
    outline: 2px solid var(--color-foreground);
    outline-offset: 3px;
  }

  /* Technical: inversion rapida con bordes grafito, respuesta tactil instantanea */
  html[data-motion-style='technical'] .button {
    transition: background-color var(--motion-fast) var(--ease-enter),
      color var(--motion-fast) var(--ease-enter),
      border-color var(--motion-fast) var(--ease-enter);
  }

  html[data-motion-style='technical'] .button:hover:not([disabled]) {
    border-color: #2b2b2b;
    background-color: var(--color-foreground);
    color: var(--color-background);
    transform: none;
    box-shadow: 0 0 0 1px #2b2b2b;
  }

  html[data-motion-style='technical'] .product-card:hover .product-card__media {
    outline: 1px solid #333333;
    outline-offset: -1px;
    transform: none;
  }

  html[data-motion-style='technical'] .product-card__title a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  html[data-motion-style='technical'] .button:focus-visible,
  html[data-motion-style='technical'] input:focus-visible,
  html[data-motion-style='technical'] select:focus-visible {
    outline: 2px solid #2b2b2b;
    outline-offset: 2px;
  }

  /* Heritage: patina de laton envejecido y cursivas solemnes */
  html[data-motion-style='heritage'] .button:hover:not([disabled]) {
    border-color: #b5885c;
    color: #b5885c;
    background: transparent;
    transform: none;
  }

  html[data-motion-style='heritage'] .product-card:hover .product-card__title a {
    color: #b5885c;
    font-style: italic;
  }

  html[data-motion-style='heritage'] .site-header__link:hover {
    color: #b5885c;
  }

  html[data-motion-style='heritage'] .button:focus-visible,
  html[data-motion-style='heritage'] input:focus-visible,
  html[data-motion-style='heritage'] select:focus-visible {
    outline: 2px solid #b5885c;
    outline-offset: 3px;
  }
}

/* =========================================================================
   SISTEMA DE MOVIMIENTO (Sprint 4C-002)
   Todo lo de aqui abajo esta gobernado por html[data-animations] y por
   prefers-reduced-motion. Las dos llaves de apagado viven al final del bloque.
   ========================================================================= */

/* B5. Transiciones de pagina nativas. Una sola regla, sin JavaScript y sin librerias.
   Los navegadores que no implementan la API la ignoran por completo. */
@view-transition {
  navigation: auto;
}

/* B2. El estado oculto SOLO existe cuando el motor de reveal confirmo que puede
   ejecutarse. Sin data-reveal-ready en <html> esta regla no aplica y todo se ve. */
html[data-reveal-ready] [data-reveal]:not([data-revealed]) {
  opacity: 0;
  transform: translateY(var(--reveal-shift));
  will-change: opacity, transform;
}

/* La transicion vive SOLO en el estado revelado. Si viviera en [data-reveal] a secas,
   un elemento que ya tenia estilo calculado cuando el motor arranca (la pagina pinto
   antes de llegar al script, cosa habitual) se animaria de visible a oculto en vez de
   ocultarse al instante; sobre el pliegue eso se veia como un parpadeo y anulaba la
   entrada. Ocultar es instantaneo; solo revelar se anima. */
html[data-reveal-ready] [data-reveal][data-revealed] {
  opacity: 1;
  transform: none;
  transition: opacity var(--motion-base) var(--ease-enter),
    transform var(--motion-base) var(--ease-enter);
  transition-delay: calc(var(--reveal-index, 0) * var(--reveal-stagger));
  /* Se retira en cuanto termina: dejar will-change permanente reserva una capa de
     composicion por elemento y penaliza la memoria en rejillas largas. */
  will-change: auto;
}

/* B3. Hero editorial. La imagen NO se anima ni se oculta: es el LCP. Lo unico que se
   mueve es el bloque de texto, y solo en modo full, con una entrada corta que arranca
   ya pintada. */
html[data-animations='full'] .hero-editorial__content {
  /* Texto, no masa: un segundo de titular casi invisible ya seria retrasar contenido
     primario. Base lo asienta en 680ms y solo en modo full. */
  animation: hero-content-settle var(--motion-base) var(--ease-enter) both;
}

@keyframes hero-content-settle {
  from {
    opacity: 0.001;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* B6. Galeria de PDP: la imagen que pasa a estar seleccionada entra con un fundido
   corto en vez de aparecer de golpe al cambiar de variante o de miniatura. */
html[data-animations='subtle'] .product-gallery__item[data-selected] .product-gallery__image,
html[data-animations='full'] .product-gallery__item[data-selected] .product-gallery__image {
  animation: gallery-media-in var(--motion-base) var(--ease-enter) both;
}

@keyframes gallery-media-in {
  from {
    opacity: 0.001;
  }

  to {
    opacity: 1;
  }
}

/* B7. Cabecera condensada. El atributo lo pone initHeaderScrollState.
   4F-001: desde que la cabecera es sticky el estado condensado se ve de verdad. Ya no
   cambia de altura: una cabecera pegada que encoge desplaza todo el contenido de debajo
   a mitad de scroll, y eso es desplazamiento de layout. Cambian sombra y fondo. */
.site-header {
  /* Sigue al scroll del usuario: si tarda lo que una entrada de superficie, se rezaga
     detras del contenido y se lee como lag. Va en fast. */
  transition: box-shadow var(--motion-fast) var(--ease-move),
    background-color var(--motion-fast) var(--ease-move);
}

.site-header[data-header-scrolled] {
  box-shadow: 0 1px 0 color-mix(in srgb, var(--color-foreground) 12%, transparent),
    0 0.75rem 1.5rem -1.25rem color-mix(in srgb, var(--color-shadow) 45%, transparent);
}

/* El desenfoque va en un pseudo-elemento y nunca en la cabecera: un backdrop-filter la
   convertiria en el bloque contenedor de sus descendientes position: fixed, y el menu
   movil y el buscador quedarian encerrados en los 77 px de la cabecera en cuanto se
   hiciera scroll. */
@supports (backdrop-filter: blur(8px)) {
  html[data-animations='full'] .site-header[data-header-scrolled] {
    background: transparent;
  }

  html[data-animations='full'] .site-header[data-header-scrolled]::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background-color: color-mix(in srgb, var(--color-background) 88%, transparent);
    backdrop-filter: blur(8px);
    content: '';
    pointer-events: none;
  }
}

/* B7. Lineas del carrito escalonadas al abrir el drawer. El indice lo emite el Liquid. */
html[data-animations='subtle'] cart-drawer[data-open] .cart-drawer-item,
html[data-animations='full'] cart-drawer[data-open] .cart-drawer-item {
  animation: cart-line-in var(--motion-base) var(--ease-enter) both;
  animation-delay: calc(var(--item-index, 0) * 40ms);
}

@keyframes cart-line-in {
  from {
    opacity: 0.001;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* =========================================================================
   B8 (MOTION-002). Coreografia scroll-driven nativa, en sustitucion del motor GSAP.
   La progresion ya no la calcula JavaScript cuadro a cuadro: la calcula el compositor
   contra la posicion del elemento dentro de su scroller, asi que el movimiento sigue al
   dedo y no a un reloj. theme.js solo marca los objetivos y publica --reveal-index.

   Posicion en la cascada (invariante, ver la cabecera del sistema de movimiento): B8 va
   DESPUES de B2 y ANTES de las dos llaves de apagado. Lo primero deja que el modo full
   sobre-escriba el estado oculto; lo segundo deja que las llaves lo apaguen todo.
   ========================================================================= */

/* B8.0. Comun a los dos motores. Si un elemento pendiente recibe el foco por teclado se
   asienta de golpe: el visitante ya esta en el, y cruzar 1200ms de fundido con el anillo
   de foco dentro se lee como un fallo de pintado y no como una entrada. Especificidad
   (0,5,1): gana a B2 y a B8.1 sea cual sea el orden en que acaben en el archivo. */
html[data-animations][data-reveal-ready] [data-reveal][data-revealed]:focus-within {
  transition: none;
}

/* B8.1. Respaldo donde no hay timelines de scroll. El modo full no se queda en la entrada
   de base: reusa el estado oculto y la transicion de B2 y solo les sube distancia,
   duracion y escalonado a los tokens expresivos. Sin mascara tipografica: una mascara que
   no progresa con el scroll no tendria nada que animar. */
@supports not (animation-timeline: view()) {
  html[data-animations='full'][data-reveal-ready] [data-reveal]:not([data-revealed]) {
    transform: translateY(var(--reveal-shift-expressive));
  }

  html[data-animations='full'][data-reveal-ready] [data-reveal][data-revealed] {
    transition-duration: var(--motion-expressive);
    transition-delay: calc(var(--reveal-index, 0) * var(--reveal-stagger-expressive));
  }
}

/* B8.2. El motor. Dos pruebas y no una: hubo versiones que aceptaban view() pero no la
   sintaxis de dos valores de animation-range, y ahi los rangos se quedaban sin resolver y
   la coreografia entera no arrancaba. La consulta de movimiento reducido envuelve el
   bloque en vez de confiar solo en la llave 2: asi los timelines ni se crean. */
@supports (animation-timeline: view()) and (animation-range: entry 0% entry 100%) {
  @media (prefers-reduced-motion: no-preference) {
    /* a) Bloques. Cada objetivo mide contra si mismo y entra mientras cruza su rango de
       entrada, de modo que la animacion es scroll y no tiempo. El escalonado tambien pasa a
       ser recorrido: --reveal-index (0..7, el tope lo fija theme.js) corre el inicio y el
       final la MISMA distancia, asi todos recorren lo mismo y el hermano siguiente arranca
       mas abajo. La transicion de B2 se retira aqui: dos origenes gobernando opacity y
       transform a la vez dan un resultado que depende del orden de pintado. */
    html[data-animations='full'][data-reveal-ready] [data-reveal=''] {
      view-timeline-name: --reveal;
      view-timeline-inset: 0 var(--scroll-enter-inset);
      animation: scroll-rise auto var(--ease-enter) both;
      animation-timeline: --reveal;
      animation-range-start: entry calc(var(--reveal-index, 0) * var(--scroll-reveal-stagger));
      animation-range-end: entry calc(var(--scroll-reveal-distance) + var(--reveal-index, 0) * var(--scroll-reveal-stagger));
      transition: none;
    }

    /* b) Tipografia con mascara. En los siete encabezados editoriales el contenedor solo
       funde y son sus lineas las que suben, recortadas por el borde del contenedor: el gesto
       de una portada de moda. El clip-path es FIJO, nunca animado, porque animarlo cuesta un
       repintado por cuadro. La holgura lateral de 1rem deja salir las italicas y el anillo de
       foco, que recortados serian un fallo de WCAG 2.4.13.

       El borde superior queda ABIERTO (-100%) y solo se recorta el inferior (0): las lineas
       suben desde abajo, asi que el borde de abajo es el unico que el gesto necesita. No se
       vuelva a inset(0 -1rem): .brand-manifesto__quote-mark es absoluto y cuelga 1.5rem por
       encima de su blockquote, y en escritorio sin eyebrow su borde superior coincide
       EXACTAMENTE con el del contenedor (padding-block-start: var(--space-lg) = 1.5rem,
       medido 0 px de margen). Cualquier ajuste de --space-lg o de esa cota lo decapitaba
       durante toda la entrada. */
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] {
      clip-path: inset(-100% -1rem 0);
      animation-name: scroll-fade;
      animation-range-start: entry 0;
      animation-range-end: entry var(--scroll-reveal-distance);
    }

    /* Las lineas consumen el timeline --reveal del PADRE, que ya lo declara la regla a).
       Dos ramas porque el marcado varia: unos encabezados envuelven sus lineas en .flow o en
       un div de rejilla y otros las cuelgan directamente del contenedor. */
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :not(.flow, div),
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :is(.flow, div) > * {
      animation: scroll-line-rise auto var(--ease-enter) both;
      animation-timeline: --reveal;
      animation-range-start: entry 0;
      animation-range-end: entry var(--scroll-reveal-distance);
    }

    /* Escalonado por linea: tambien recorrido, no tiempo. El final se desplaza lo mismo que
       el inicio, asi las tres lineas recorren identica distancia y la ultima no se comprime.
       A partir de la tercera todas comparten el segundo escalon: un encabezado con cinco
       lineas no debe acabar de entrar medio pliegue despues que la primera. */
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :not(.flow, div):nth-child(2),
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :is(.flow, div) > :nth-child(2) {
      animation-range-start: entry var(--scroll-line-stagger);
      animation-range-end: entry calc(var(--scroll-reveal-distance) + var(--scroll-line-stagger));
    }

    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :not(.flow, div):nth-child(n+3),
    html[data-animations='full'][data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
      .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
      .brand-manifesto__statement, .main-about__quote)[data-reveal=''] > :is(.flow, div) > :nth-child(n+3) {
      animation-range-start: entry calc(2 * var(--scroll-line-stagger));
      animation-range-end: entry calc(var(--scroll-reveal-distance) + 2 * var(--scroll-line-stagger));
    }

    /* .curated-showcase__tabs es un carril con overflow-x: auto, y la regla que prohibe
       desbordar un solo eje lo deja con overflow-y: auto tambien. Mover sus botones 64px
       convierte el carril en scrollable mientras dura la entrada: scrollHeight pasa de 52 a
       116 px, asoma una barra vertical y los botones se van fuera del recorte. Es el unico
       objetivo de linea que vive dentro de un contenedor de scroll. El carril no es
       tipografia sino un control: entra fundiendose con su encabezado y no se mueve.
       [role='tablist'] sube la especificidad a (0,6,1) y gana a la regla de lineas sin
       depender del orden en el archivo. */
    html[data-animations='full'][data-reveal-ready] .curated-showcase__header[data-reveal='']
      > .curated-showcase__tabs[role='tablist'] > * {
      animation-name: none;
    }

    /* c) Unveil. Las cuatro masas fotograficas no suben: se descubren de abajo arriba.
       Especificidad (0,4,1) frente a (0,3,1) del generico, asi que basta sobre-escribir el
       nombre y el rango y se heredan duracion, curva y fill-mode de la regla a). El recorte
       lo contiene el overflow: hidden que ya tenian las cuatro. */
    html[data-animations='full'][data-reveal-ready] :is(.brand-manifesto__media, .complete-the-look__media,
      .lookbook__media, .main-about__gallery-item)[data-reveal=''] {
      animation-name: scroll-unveil;
      animation-range-start: entry 0;
      animation-range-end: entry var(--scroll-unveil-distance);
    }

    /* La foto se asienta mientras el recorte la descubre: dos escalas que terminan juntas.
       .lookbook__media queda FUERA a proposito, porque lleva los hotspots encima en
       coordenadas porcentuales y escalar el fondo los dejaria senalando al sitio equivocado
       durante toda la entrada. svg cubre el placeholder_svg_tag del estado "falta el asset".
       El rango se mide sobre el timeline --reveal del CONTENEDOR y no sobre un view() propio:
       el contenedor tiene overflow: hidden, asi que un view() del hijo mediria contra ese
       recorte y nunca contra el scroller de la pagina. */
    html[data-animations='full'][data-reveal-ready] :is(.brand-manifesto__media, .complete-the-look__media,
      .main-about__gallery-item)[data-reveal=''] :is(img, svg, video) {
      animation: scroll-unveil-settle auto var(--ease-enter) both;
      animation-timeline: --reveal;
      animation-range-start: entry 0;
      animation-range-end: entry var(--scroll-unveil-settle);
    }

    /* d) Hero. El unico movimiento ligado al scroll que vive sobre el pliegue. Lineal a
       proposito: un parallax es scroll, y meterle una curva de entrada lo desacopla del dedo.
       Sin opacidad en ningun fotograma: ese medio es el LCP y no se oculta ni un cuadro.

       El rango arranca en exit 0% y NO restando --header-offset: la cabecera pegada ya esta
       descontada, porque el timeline no mide contra el viewport sino contra la region optima
       de visionado, y html lleva scroll-padding-block-start: var(--header-offset). Restarla
       otra vez adelanta el inicio por debajo del scroll 0 y el progreso nace en 0,124 con una
       cabecera de 77 px: 9,7 px de --color-surface asomando por el borde superior del medio
       antes de que nadie toque la rueda, y justo en el elemento LCP. Con exit 0% el progreso
       nace en 0 y avanza ya en el primer pixel de scroll, que es lo que se buscaba. */
    html[data-animations='full'] .hero-editorial__media {
      view-timeline-name: --hero-media;
    }

    html[data-animations='full'] .hero-editorial__media :is(.hero-editorial__image, .hero-editorial__video) {
      animation: hero-parallax auto linear both;
      animation-timeline: --hero-media;
      animation-range-start: exit 0%;
      animation-range-end: exit 100%;
    }

    /* e) Banda editorial. Dos animaciones sobre el mismo track y compuestas, no una que
       sustituya a la otra: el bucle infinito sigue siendo tiempo (es un desfile, no un
       indicador de progreso) y encima se le suma un desplazamiento ligado al scroll que da
       profundidad al cruzar la seccion. animation-composition: add en la segunda hace que
       los dos translateX se sumen en vez de ganar el ultimo declarado.

       El timeline se declara en el __viewport y NO en el __track: el track vive dentro del
       overflow: hidden del viewport, asi que un view() suyo mediria contra ese recorte.

       var(--marquee-duration, 32s) es el MISMO token y el mismo fallback que usa la regla
       base de .marquee-banner__track, no un numero duplicado: animation-duration necesita un
       valor por animacion de la lista y aqui solo se repite la referencia. */
    html[data-animations='full'] .marquee-banner__viewport {
      view-timeline-name: --marquee;
    }

    html[data-animations='full'] .marquee-banner__track {
      animation-name: editorial-marquee, marquee-drift;
      animation-duration: var(--marquee-duration, 32s), auto;
      animation-timing-function: linear, linear;
      animation-iteration-count: infinite, 1;
      animation-fill-mode: none, both;
      animation-composition: replace, add;
      animation-timeline: auto, --marquee;
      animation-range: normal, cover 0% cover 100%;
    }
  }
}

/* B8.3. Los fotogramas del motor. Ninguno lleva duracion propia: la pone animation-range.

   scroll-fade y scroll-unveil declaran opacity y transform aunque no los cambien, y eso es
   DELIBERADO: no son relleno, no se limpien. Una propiedad solo queda gobernada por el
   origen "animacion" si aparece en los fotogramas. Sin esas declaraciones, un contenedor
   que entra por scroll-unveil seguiria cogiendo el opacity: 0 y el translateY del estado
   oculto de B2 y se quedaria invisible hasta que el JS lo marcara: exactamente el parpadeo
   que este motor viene a quitar. */
@keyframes scroll-rise {
  from {
    opacity: 0;
    transform: translateY(var(--reveal-shift-expressive));
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes scroll-fade {
  from {
    opacity: 0;
    transform: none;
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes scroll-line-rise {
  from {
    transform: translateY(var(--reveal-shift-expressive));
  }

  to {
    transform: none;
  }
}

@keyframes scroll-unveil {
  from {
    clip-path: inset(100% 0 0 0);
    opacity: 1;
    transform: none;
  }

  to {
    clip-path: inset(0);
    opacity: 1;
    transform: none;
  }
}

@keyframes scroll-unveil-settle {
  from {
    transform: scale(var(--unveil-scale));
  }

  to {
    transform: none;
  }
}

@keyframes hero-parallax {
  from {
    transform: translateY(0) scale(1);
  }

  to {
    transform: translateY(var(--parallax-shift)) scale(var(--parallax-scale));
  }
}

@keyframes marquee-drift {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-1 * var(--marquee-drift)));
  }
}

/* ---------- Llave 1: el comerciante apaga el movimiento ---------- */
html[data-animations='none'] *,
html[data-animations='none'] *::before,
html[data-animations='none'] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  /* 0s y no 0.01ms: ver la nota de la llave 2 (CLS). */
  transition-duration: 0s !important;
  transition-delay: 0ms !important;
  scroll-behavior: auto !important;
}

html[data-animations='none'] [data-reveal] {
  opacity: 1 !important;
  transform: none !important;
  /* MOTION-002: la mascara tipografica de B8.2b recorta por el borde del contenedor. Sin
     anularla aqui, apagar el movimiento dejaria las lineas recortadas en su sitio inicial. */
  clip-path: none !important;
}

/* ---------- Llave 2: el visitante pidio reducir movimiento. Gana siempre ---------- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    /* MOTION-002 (CLS en reduce). Las transiciones van a 0s, no a 0.01ms: con
       transition-property en su valor inicial (all), una duracion de 0.01ms convierte
       CUALQUIER cambio de estilo calculado en una transicion de un fotograma que pinta
       primero el valor viejo. Al cargar la fuente web, el max-width en ch del titular
       (11ch pasa de 416 a 594 px con Libre Baskerville) se pintaba un fotograma con los
       glifos nuevos y el ancho viejo: el titular se iba a 4 lineas, el bloque crecia 160 px
       y el velo del hero (inset -50%, el doble del bloque) lo amplificaba: CLS 0.18 en Atelier,
       limite 0.1. Con 0s no hay transicion y el cambio es atomico. Ningun script del tema
       escucha transitionend, asi que 0.01ms no servia para nada. */
    transition-duration: 0s !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    /* MOTION-002: ver la nota de la llave 1. La mascara tambien se anula aqui. */
    clip-path: none !important;
  }

  html[data-motion-style] .button:hover,
  html[data-motion-style] .product-card:hover .product-card__media {
    transform: none !important;
    box-shadow: none !important;
  }

  @view-transition {
    navigation: none;
  }
}

/* ---------- Llave 3: papel. No hay scroll que recorrer ---------- */
/* MOTION-002. Las dos llaves de arriba no cubren este caso: el motor es scroll, y al
   imprimir no hay scroll que recorrer, asi que todo lo pendiente de revelar se queda en
   progreso 0 y hoy sale en blanco. Esto lo asienta en papel sin tocar la pantalla. */
@media print {
  /* Los hijos que B8 anima llevan su propia animation con animation-timeline: no heredan el
     animation: none del contenedor y en papel se quedan en el fotograma 0 (lineas 64 px
     abajo y fuera del clip-path, fotos a scale(1.18) bajo el overflow: hidden). Se listan
     los mismos objetivos que B8.2 y no un * global, para no pisar estilos de impresion
     ajenos. Hero y banda se asientan tambien: en papel no hay scroll ni tiempo que recorrer. */
  html[data-reveal-ready] [data-reveal],
  html[data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
    .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
    .brand-manifesto__statement, .main-about__quote)[data-reveal] > *,
  html[data-reveal-ready] :is(.lookbook__header, .curated-showcase__header,
    .complete-the-look__header, .bento-discovery__header, .product-recommendations__header,
    .brand-manifesto__statement, .main-about__quote)[data-reveal] > :is(.flow, div) > *,
  html[data-reveal-ready] :is(.brand-manifesto__media, .complete-the-look__media,
    .lookbook__media, .main-about__gallery-item)[data-reveal] :is(img, svg, video) {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
    animation: none !important;
  }

  /* Sin opacity: el video del hero nace en 0 y solo se muestra con data-video-active; en
     papel manda el poster. */
  html[data-animations='full'] .hero-editorial__media :is(.hero-editorial__image, .hero-editorial__video),
  html[data-animations='full'] .marquee-banner__track {
    transform: none !important;
    animation: none !important;
  }
}

/* -------------------------------------------------------------------------- */
/* 5C-002. PDP Confianza, Inventario y Recently Viewed                        */
/* -------------------------------------------------------------------------- */

product-inventory {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-foreground);
  font-size: 0.875rem;
  line-height: 1.5;
}

.product-inventory__dot {
  position: relative;
  flex: 0 0 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
}

product-inventory[data-stock-state='low_stock'] .product-inventory__dot::after {
  position: absolute;
  inset: -0.25rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  content: '';
}

html[data-animations='full'] product-inventory[data-stock-state='low_stock'] .product-inventory__dot::after {
  animation: inventory-pulse 2s ease-in-out infinite;
}

@keyframes inventory-pulse {
  50% { transform: scale(1.2); opacity: 0.45; }
}

.product-trust {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: var(--space-2);
  margin: 0;
  color: var(--color-foreground);
  font-size: 0.875rem;
  line-height: 1.5;
}

.product-trust__icon {
  display: inline-flex;
  flex: 0 0 1.25rem;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
}

.product-trust__icon:empty { display: none; }

/* .product-trust anula el margen de flujo: sin esto la nota de envio queda pegada (0 px) al
   boton de pago dinamico o al de compra (6A-001). */
.product-form + .product-trust {
  margin-block-start: var(--space-3);
}

.product-accordion .product-details__heading {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.product-accordion__leading-icon {
  display: inline-flex;
  flex: 0 0 1.125rem;
}

.product-accordion > summary:focus-visible {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 2px;
}

.featured-product__info > .product-accordion + .product-accordion {
  margin-block-start: 0;
  border-block-start: 0;
}

.recently-viewed[hidden] { display: none; }

.recently-viewed__header { max-width: 48rem; }

.recently-viewed__header h2 {
  font-size: calc(2.25rem * var(--font-heading-scale));
}

.recently-viewed__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2xl) var(--space-md);
}

@media (min-width: 48rem) {
  .recently-viewed__grid[data-columns='3'],
  .recently-viewed__grid[data-columns='4'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 62rem) {
  .recently-viewed__grid[data-columns='2'] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .recently-viewed__grid[data-columns='3'] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .recently-viewed__grid[data-columns='4'] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (prefers-reduced-motion: reduce) {
  product-inventory[data-stock-state='low_stock'] .product-inventory__dot::after {
    animation: none;
  }
}

/* -------------------------------------------------------------------------- */
/* 5C-001. Mega Menú Editorial Multicolumna                                   */
/* -------------------------------------------------------------------------- */
/* El panel es el mismo [data-disclosure-panel] de <theme-disclosure>: sin JS nuevo. Con el
   disparador en position: static, el panel se ancla a .site-header (position: relative) y
   ocupa todo el ancho bajo la cabecera; dentro, .container alinea la rejilla con la pagina.
   Las tarjetas llevan loading="lazy" y viven en un panel con hidden: ninguna foto se pide
   hasta abrir. Sin JS el panel se pinta dentro de la cabecera (reglas .no-js de arriba):
   ahi sobran las fotos y solo quedan las columnas. */
.no-js .mega-menu__promos {
  display: none;
}

.no-js .mega-menu__grid {
  width: auto;
}

.no-js .mega-menu__columns,
.no-js .mega-menu__column-list,
.no-js .mega-menu__sublist {
  display: grid;
  gap: var(--space-1);
}

.no-js .mega-menu__view-all,
.no-js .mega-menu__column-title,
.no-js .mega-menu__sublist a {
  display: inline-flex;
  min-height: var(--tap-target-min, 44px);
  align-items: center;
  color: currentColor;
}

@media (min-width: 62rem) {
  .desktop-nav__disclosure--mega {
    position: static;
  }

  .desktop-nav__mega-menu {
    inset-block-start: 100%;
    inset-inline: 0;
    min-width: 0;
    /* Con la cabecera pegada, un menu mas alto que la ventana se recorre dentro del panel. */
    max-height: calc(100dvh - var(--header-offset, 0px) - var(--space-6));
    padding: var(--space-5) 0 var(--space-6);
    overflow-y: auto;
    overscroll-behavior: contain;
    border-inline: 0;
  }

  /* Las tarjetas abren una segunda columna implicita: sin ellas no queda hueco a la derecha. */
  .mega-menu__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-columns: auto;
    grid-auto-flow: column;
    align-items: start;
    column-gap: var(--space-6);
  }

  .mega-menu__columns {
    display: grid;
    align-content: start;
    gap: var(--space-3);
  }

  .mega-menu__view-all,
  .mega-menu__column-title,
  .mega-menu__sublist a,
  .mega-menu__promo-card {
    color: currentColor;
    text-decoration: none;
  }

  .mega-menu__view-all {
    display: inline-flex;
    min-height: var(--tap-target-min, 44px);
    justify-self: start;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-transform: uppercase;
    text-underline-offset: 0.35em;
  }

  .mega-menu__column-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
    gap: var(--space-4) var(--space-5);
  }

  .mega-menu__column {
    display: grid;
    align-content: start;
  }

  .mega-menu__column-title {
    display: flex;
    min-height: var(--tap-target-min, 44px);
    align-items: center;
    border-block-end: 1px solid var(--color-border-hairline);
    font-family: var(--font-heading-family);
    font-size: 1.125rem;
    line-height: 1.2;
  }

  .mega-menu__sublist {
    display: grid;
    padding-block-start: var(--space-1);
  }

  .mega-menu__sublist a {
    display: flex;
    min-height: var(--tap-target-min, 44px);
    align-items: center;
    font-size: 0.875rem;
  }

  .mega-menu__column-title:hover,
  .mega-menu__sublist a:hover,
  .mega-menu__view-all:hover {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.25em;
  }

  .mega-menu__promos {
    display: grid;
    grid-auto-columns: 15rem;
    grid-auto-flow: column;
    gap: var(--space-4);
  }

  .mega-menu__promo-card {
    display: grid;
    min-height: var(--tap-target-min, 44px);
    align-content: start;
    gap: var(--space-1);
  }

  /* Sin foto la tarjeta se queda en dos lineas sueltas pegadas al borde y el panel se lee
     como texto plano. Mismo recurso que .bento-card--editorial-text: la variante reclama la
     caja que ocupaba el medio y la convierte en una placa tipografica centrada. La cota es
     el mismo 15rem de la columna (placa cuadrada, proporcion deliberada) y el fondo es el
     mismo --color-surface que ya usa el hueco de la foto, asi que una fila mixta se lee como
     pareja. Sin bordes, iconos ni degradados: solo tipografia y aire. */
  .mega-menu__promo-card--editorial-text {
    height: 100%;
    min-height: 15rem;
    padding: var(--space-4);
    align-content: center;
    background: var(--color-surface);
  }

  /* Retrato 4:5 fijo: la foto ocupa su hueco antes de llegar y no mueve el texto. */
  .mega-menu__promo-media {
    display: block;
    overflow: hidden;
    margin-block-end: var(--space-1);
    aspect-ratio: 4 / 5;
    background: var(--color-surface);
  }

  .mega-menu__promo-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mega-menu__promo-heading {
    font-family: var(--font-heading-family);
    font-size: 1.125rem;
    line-height: 1.25;
  }

  .mega-menu__promo-subheading {
    font-size: 0.8125rem;
    line-height: 1.45;
  }

  a.mega-menu__promo-card:hover .mega-menu__promo-heading {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  html[data-animations='full'] .mega-menu__promo-image {
    transition: transform var(--motion-slow) var(--ease-move);
  }

  /* El mismo gesto que la foto de la tarjeta de producto. */
  html[data-animations='full'] a.mega-menu__promo-card:hover .mega-menu__promo-image {
    transform: scale(1.025);
  }
}

/* v1.1.0 bloques de PDP por preset: especificaciones tecnicas (Edition) y procedencia (Archive). */
.product-technical-specs,
.product-provenance {
  display: grid;
  gap: var(--space-2);
  margin-block: var(--space-4) 0;
}

.product-technical-specs__heading,
.product-provenance__heading {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-technical-specs__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
}

.product-technical-specs__row {
  display: grid;
  grid-template-columns: minmax(0, 9rem) minmax(0, 1fr);
  gap: var(--space-2);
  font-size: 0.875rem;
}

.product-technical-specs__row dt {
  color: var(--color-foreground-muted);
}

.product-technical-specs__row dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.product-provenance__badge,
.product-provenance__year,
.product-provenance__grade {
  margin: 0;
  font-size: 0.875rem;
}

.product-provenance__grade span {
  color: var(--color-foreground-muted);
  margin-inline-end: var(--space-xs);
}

@media (min-width: 62rem) {
  .product-main__layout--split_screen {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    column-gap: var(--space-5);
  }

  .product-main__layout--split_screen .product-main__details {
    position: sticky;
    top: calc(var(--header-offset, 0px) + var(--space-4));
  }
}
```

---

### <a id="sections-main-product-liquid"></a> sections/main-product.liquid

> **Descripcion:** Pagina de producto principal (PDP) y bloques de lujo
> **Ruta:** `sections/main-product.liquid` | **Lineas:** 1158 | **Tamano:** 56.05 KB

```liquid
{%- liquid
  assign selected_variant = product.selected_or_first_available_variant
  assign selected_selling_plan_allocation = product.selected_selling_plan_allocation
  if selected_selling_plan_allocation == blank and selected_variant.requires_selling_plan
    assign selected_selling_plan_allocation = selected_variant.selling_plan_allocations.first
  endif
  assign selected_selling_plan_id = selected_selling_plan_allocation.selling_plan.id
  assign subscription_selected = false
  if selected_selling_plan_id != blank
    assign subscription_selected = true
  endif

  comment
    5A-003, GPT-AUDIT-005 H1. Una variante que exige plan de venta y no tiene ninguno
    asignado no se puede comprar: Shopify responde 200 a /cart/add sin crear la linea. La
    ficha falla cerrada desde el servidor: sin boton activo, sin pago acelerado y con el
    motivo a la vista. VariantSelects repite la misma regla al cambiar de variante.
  endcomment
  assign plan_required_unavailable = false
  assign can_add_to_cart = selected_variant.available
  if selected_variant.requires_selling_plan and selected_variant.selling_plan_allocations.size == 0
    assign plan_required_unavailable = true
    assign can_add_to_cart = false
  endif
  assign product_form_id = 'product-form-' | append: section.id
  assign default_scheme_id = settings.default_color_scheme.id | default: settings.default_color_scheme | default: 'scheme-1'
  assign section_scheme = section.settings.color_scheme.id | default: section.settings.color_scheme | default: default_scheme_id
  assign product_models = product.media | where: 'media_type', 'model'
  assign selected_media_id = selected_variant.featured_media.id | default: product.featured_media.id

  comment
    Proporcion del carrusel movil (4F-001): la de la primera imagen, acotada entre 2:3 y
    3:2. Todas las diapositivas comparten marco para que el carrusel no cambie de alto al
    deslizar; una imagen de otra proporcion se muestra entera dentro de ese marco.
  endcomment
  assign gallery_ratio = product.media.first.aspect_ratio | default: 0.8 | at_least: 0.667 | at_most: 1.5
  assign gallery_is_carousel = false
  if section.settings.media_layout != 'thumbnails' and product.media.size > 1
    assign gallery_is_carousel = true
  endif

  comment
    5B-001. Zoom de imagen (CLAUDE-AUDIT-OPUS-001, seccion 6). Solo las imagenes se amplian:
    el video y el 3D conservan sus controles. Con el ajuste apagado o sin imagenes no hay
    disparadores, ni visor, ni product-zoom.js.
  endcomment
  assign zoom_images = product.media | where: 'media_type', 'image'
  assign zoom_enabled = false
  if section.settings.enable_media_zoom and zoom_images.size > 0
    assign zoom_enabled = true
  endif
  assign zoom_position = 0
  assign odd_media = product.media.size | modulo: 2
-%}

<section class="section product-main color-{{ section_scheme }}" data-section-id="{{ section.id }}" data-recently-viewed-product-id="{{ product.id }}">
  <div class="container product-main__layout product-main__layout--{{ section.settings.media_layout }}">
    <product-gallery
      class="product-gallery"
      data-layout="{{ section.settings.media_layout }}"
      role="region"
      aria-label="{{ 'products.product.media_gallery' | t }}"
      style="--gallery-ratio: {{ gallery_ratio }};"
    >
      <div class="product-gallery__items" data-gallery-track>
        {%- if product.media.size > 0 -%}
          {%- for media in product.media -%}
            <figure
              class="product-gallery__item"
              data-product-media-id="{{ media.id }}"
              {% if media.id == selected_media_id %}data-selected{% endif %}
              {% if section.settings.media_layout == 'thumbnails' and media.id != selected_media_id %}hidden{% endif %}
            >
              {%- liquid
                # 5B-001, H-07. En la rejilla de escritorio cada foto ocupa media columna de la
                # galeria (unos 30vw); la primera, si el total es impar, ocupa las dos.
                assign media_sizes = '(min-width: 62rem) 60vw, 100vw'
                if section.settings.media_layout == 'grid' and product.media.size > 1
                  unless forloop.first and odd_media == 1
                    assign media_sizes = '(min-width: 62rem) 30vw, 100vw'
                  endunless
                endif
              -%}
              {% render 'product-media', media: media, product: product, prioritize: forloop.first, sizes: media_sizes %}
              {%- if zoom_enabled and media.media_type == 'image' -%}
                {%- assign zoom_position = zoom_position | plus: 1 -%}
                <button
                  class="product-gallery__zoom-trigger"
                  type="button"
                  aria-haspopup="dialog"
                  aria-label="{{ 'products.product.media_zoom.open' | t: index: zoom_position, total: zoom_images.size | escape_once }}"
                  data-zoom-open="{{ zoom_position | minus: 1 }}"
                >
                  <span class="product-gallery__zoom-icon" aria-hidden="true">
                    {%- render 'icon', name: 'search', size: 18 -%}
                  </span>
                </button>
              {%- endif -%}
            </figure>
          {%- endfor -%}
        {%- else -%}
          <div class="product-gallery__placeholder" aria-hidden="true"></div>
        {%- endif -%}
      </div>

      {%- if gallery_is_carousel -%}
        {%- comment -%}
          Paginador del carrusel movil. Nace oculto y solo lo muestra <product-gallery> por
          debajo de 62rem, que es donde la galeria se convierte en carrusel: sin JavaScript
          el carrusel se sigue deslizando con el dedo y no queda ningun boton que no haga
          nada. El contador es visual; el anuncio para lector de pantalla va en el estado.
        {%- endcomment -%}
        <div
          class="product-gallery__pager"
          data-gallery-pager
          data-view-media-template="{{ 'products.product.view_media' | t: number: '[number]' | escape_once }}"
          hidden
        >
          <button
            class="icon-button product-gallery__step product-gallery__step--previous"
            type="button"
            aria-label="{{ 'general.pagination.previous' | t | escape }}"
            data-gallery-step="-1"
          >
            {% render 'icon', name: 'chevron-down', size: 18 %}
          </button>
          <p class="product-gallery__counter" aria-hidden="true">
            <span data-gallery-current>1</span> / {{ product.media.size }}
          </p>
          <button
            class="icon-button product-gallery__step product-gallery__step--next"
            type="button"
            aria-label="{{ 'general.pagination.next' | t | escape }}"
            data-gallery-step="1"
          >
            {% render 'icon', name: 'chevron-down', size: 18 %}
          </button>
          <p class="visually-hidden" aria-live="polite" data-gallery-status></p>
        </div>
      {%- endif -%}

      {%- if section.settings.media_layout == 'thumbnails' and product.media.size > 1 -%}
        <div class="product-gallery__thumbnails" role="group" aria-label="{{ 'products.product.media_thumbnails' | t }}">
          {%- for media in product.media -%}
            <button
              class="product-gallery__thumbnail"
              type="button"
              aria-label="{{ 'products.product.view_media' | t: number: forloop.index | escape_once }}"
              aria-pressed="{% if media.id == selected_media_id %}true{% else %}false{% endif %}"
              data-product-thumbnail
              data-media-id="{{ media.id }}"
            >
              {% render 'responsive-image',
                image: media.preview_image,
                sizes: '72px',
                widths: '72, 144',
                image_class: 'product-gallery__thumbnail-image',
                alt: ''
              %}
            </button>
          {%- endfor -%}
        </div>
        <p class="visually-hidden" aria-live="polite" data-product-gallery-status></p>
      {%- endif -%}
    </product-gallery>

    {%- if product_models.size > 0 -%}
      <script type="application/json" id="ProductModelJSON-{{ section.id }}">
        {{- product_models | json -}}
      </script>
    {%- endif -%}

    <variant-selects
      class="product-main__details"
      data-product-url="{{ product.url }}"
      data-add-to-cart-text="{{ 'products.product.add_to_cart' | t | escape }}"
      data-sold-out-text="{{ 'products.product.sold_out' | t | escape }}"
      data-unavailable-text="{{ 'products.product.unavailable' | t | escape }}"
      data-available-status="{{ 'products.product.variant_available' | t | escape }}"
      data-sold-out-status="{{ 'products.product.variant_sold_out' | t | escape }}"
      data-one-time-text="{{ 'products.product.purchase_options.one_time' | t | escape }}"
      data-selling-plan-unavailable-text="{{ 'products.product.purchase_options.unavailable' | t | escape }}"
      data-per-delivery-template="{{ 'products.product.purchase_options.per_delivery' | t: price: '[price]' | escape_once }}"
      data-money-format="{{ shop.money_format | strip_html | escape }}"
      data-line-total-template="{{ 'products.product.estimated_line_total' | t: quantity: '[quantity]' | escape_once }}"
    >
      <div class="product-main__info flow">
        {%- for block in section.blocks -%}
          {%- case block.type -%}
            {%- when 'vendor' -%}
              {%- if product.vendor != blank -%}
                <p class="product-main__vendor eyebrow" {{ block.shopify_attributes }}>
                  {{- product.vendor | escape -}}
                </p>
              {%- endif -%}

            {%- when 'title' -%}
              <header class="product-main__header" {{ block.shopify_attributes }}>
                <h1 class="product-main__title" data-long-title="{{ product.title.size | divided_by: 61 | floor | at_most: 1 }}">{{ product.title | escape }}</h1>
              </header>

            {%- when 'price' -%}
              <div {{ block.shopify_attributes }}>
                {% render 'price',
                  product: product,
                  variant: selected_variant,
                  use_variant: true,
                  show_badges: true,
                  show_unit_price: true,
                  show_taxes: true,
                  price_class: 'product-main__price'
                %}
              </div>

            {%- when 'variant_picker' -%}
              {%- unless product.has_only_default_variant -%}
                <div class="variant-picker flow" {{ block.shopify_attributes }}>
                  {%- for option in product.options_with_values -%}
                    <fieldset class="variant-picker__group" role="radiogroup">
                      <legend class="variant-picker__legend">
                        {{- option.name | escape -}}:
                        <span data-selected-option="{{ option.position }}">{{ option.selected_value | escape }}</span>
                      </legend>
                      <div class="variant-picker__values">
                        {%- for value in option.values -%}
                          {%- liquid
                            assign option_id = 'option-' | append: section.id | append: '-' | append: option.position | append: '-' | append: forloop.index
                            assign swatch_value = blank
                            assign swatch_focal_point = blank
                            if value.swatch.image
                              assign swatch_image_url = value.swatch.image | image_url: width: 96
                              assign swatch_value = 'url(' | append: swatch_image_url | append: ')'
                              assign swatch_focal_point = value.swatch.image.presentation.focal_point
                            elsif value.swatch.color
                              assign swatch_value = 'rgb(' | append: value.swatch.color.rgb | append: ')'
                            endif
                          -%}
                          <input
                            class="variant-picker__input visually-hidden"
                            type="radio"
                            id="{{ option_id }}"
                            name="options[{{ option.name | escape }}]"
                            value="{{ value | escape }}"
                            data-option-position="{{ option.position }}"
                            {% if value.selected %}checked{% endif %}
                            aria-disabled="{% if value.available %}false{% else %}true{% endif %}"
                            {% unless value.available %}disabled{% endunless %}
                          >
                          <label class="variant-picker__label{% if swatch_value != blank %} variant-picker__label--swatch{% endif %}" for="{{ option_id }}">
                            {%- if swatch_value != blank -%}
                              <span
                                class="variant-picker__swatch"
                                style="--variant-swatch: {{ swatch_value }};{% if swatch_focal_point != blank %} --variant-swatch-position: {{ swatch_focal_point }};{% endif %}"
                                aria-hidden="true"
                              ></span>
                            {%- endif -%}
                            <span>{{ value | escape }}</span>
                            <span data-unavailable-label{% if value.available %} hidden{% endif %}>
                              <span aria-hidden="true">&times;</span>
                              <span class="visually-hidden">{{ 'products.product.option_unavailable' | t }}</span>
                            </span>
                          </label>
                        {%- endfor -%}
                      </div>
                    </fieldset>
                  {%- endfor -%}
                </div>
              {%- endunless -%}

            {%- when 'size_guide' -%}
              {%- liquid
                assign default_guide_title = 'products.product.size_guide' | t
                assign guide_title = block.settings.guide_title | default: default_guide_title
                assign size_guide_id = 'SizeGuide-' | append: section.id | append: '-' | append: block.id
              -%}
              <size-guide-modal
                class="size-guide"
                data-default-unit="cm"
                {{ block.shopify_attributes }}
              >
                <button
                  class="size-guide__trigger"
                  type="button"
                  aria-expanded="false"
                  aria-haspopup="dialog"
                  aria-controls="{{ size_guide_id }}"
                  data-size-guide-open
                >
                  {% render 'icon', name: 'arrow', size: 18 %}
                  <span>{{ guide_title | escape }}</span>
                </button>

                {%- if block.settings.show_model_fit_below and block.settings.model_fit_info != blank -%}
                  <p class="size-guide__model-fit-inline">
                    {{- block.settings.model_fit_info | escape -}}
                  </p>
                {%- endif -%}

                <div class="size-guide-modal__overlay" data-size-guide-overlay hidden>
                  <section
                    id="{{ size_guide_id }}"
                    class="size-guide-modal__panel color-{{ section_scheme }}"
                    role="dialog"
                    aria-modal="true"
                    aria-hidden="true"
                    aria-labelledby="{{ size_guide_id }}-Title"
                    tabindex="-1"
                    data-size-guide-panel
                    inert
                  >
                    <header class="size-guide-modal__header">
                      <h2 id="{{ size_guide_id }}-Title" class="size-guide-modal__title">
                        {{- guide_title | escape -}}
                      </h2>
                      <button
                        class="icon-button"
                        type="button"
                        aria-label="{{ 'general.accessibility.close' | t }}"
                        data-size-guide-close
                      >
                        {% render 'icon', name: 'close', size: 22 %}
                      </button>
                    </header>

                    <div class="size-guide-modal__body">
                      {%- if block.settings.model_fit_info != blank -%}
                        <div class="size-guide-modal__fit">
                          <p class="eyebrow">{{ 'products.product.model_fit' | t }}</p>
                          <p>{{ block.settings.model_fit_info | escape }}</p>
                        </div>
                      {%- endif -%}

                      <div
                        class="size-guide-modal__unit-switcher"
                        role="tablist"
                        aria-label="{{ 'products.product.measurement_units' | t }}"
                      >
                        <button
                          id="{{ size_guide_id }}-TabCm"
                          class="size-guide-modal__unit"
                          type="button"
                          role="tab"
                          aria-selected="true"
                          aria-controls="{{ size_guide_id }}-PanelCm"
                          data-size-guide-unit="cm"
                        >
                          {{- 'products.product.centimeters' | t -}}
                        </button>
                        <button
                          id="{{ size_guide_id }}-TabIn"
                          class="size-guide-modal__unit"
                          type="button"
                          role="tab"
                          aria-selected="false"
                          aria-controls="{{ size_guide_id }}-PanelIn"
                          tabindex="-1"
                          data-size-guide-unit="in"
                        >
                          {{- 'products.product.inches' | t -}}
                        </button>
                      </div>

                      {%- if block.settings.page_content != blank -%}
                        <div class="size-guide-modal__page-content rte">
                          {{- block.settings.page_content.content -}}
                        </div>
                      {%- endif -%}

                      <div
                        id="{{ size_guide_id }}-PanelCm"
                        class="size-guide-modal__measurements rte"
                        role="tabpanel"
                        aria-labelledby="{{ size_guide_id }}-TabCm"
                        tabindex="0"
                        data-size-guide-panel-unit="cm"
                      >
                        {{- block.settings.size_table_cm -}}
                      </div>
                      <div
                        id="{{ size_guide_id }}-PanelIn"
                        class="size-guide-modal__measurements rte"
                        role="tabpanel"
                        aria-labelledby="{{ size_guide_id }}-TabIn"
                        tabindex="0"
                        data-size-guide-panel-unit="in"
                        hidden
                      >
                        {{- block.settings.size_table_in -}}
                      </div>
                    </div>
                  </section>
                </div>
              </size-guide-modal>

            {%- when 'quantity' -%}
              {%- liquid
                assign quantity_min = selected_variant.quantity_rule.min | default: 1
                assign quantity_step = selected_variant.quantity_rule.increment | default: 1
                assign quantity_max = selected_variant.quantity_rule.max
              -%}
              <div class="product-form__quantity" {{ block.shopify_attributes }}>
                <label for="Quantity-{{ section.id }}">{{ 'products.product.quantity' | t }}</label>
                {%- comment -%}
                  El valor inicial es el minimo de la variante seleccionada, asi que el
                  boton de restar nace apagado. Al cambiar de variante manda
                  updateQuantityRules, que emite un change y el stepper se resincroniza.
                {%- endcomment -%}
                <div class="quantity-stepper product-form__stepper" data-quantity-stepper>
                  <button
                    class="quantity-stepper__button"
                    type="button"
                    name="minus"
                    aria-label="{{ 'products.product.decrease_quantity' | t: product: product.title | escape_once }}"
                    aria-controls="Quantity-{{ section.id }}"
                    data-quantity-button="decrease"
                    disabled
                  >
                    {% render 'icon', name: 'minus', size: 16 %}
                  </button>
                  <input
                    id="Quantity-{{ section.id }}"
                    class="quantity-stepper__input"
                    type="number"
                    name="quantity"
                    form="{{ product_form_id }}"
                    value="{{ quantity_min }}"
                    min="{{ quantity_min }}"
                    step="{{ quantity_step }}"
                    {% if quantity_max != blank %}max="{{ quantity_max }}"{% endif %}
                    inputmode="numeric"
                    required
                    data-quantity-input
                  >
                  <button
                    class="quantity-stepper__button"
                    type="button"
                    name="plus"
                    aria-label="{{ 'products.product.increase_quantity' | t: product: product.title | escape_once }}"
                    aria-controls="Quantity-{{ section.id }}"
                    data-quantity-button="increase"
                    {% if quantity_max != blank and quantity_min >= quantity_max %}disabled{% endif %}
                  >
                    {% render 'icon', name: 'plus', size: 16 %}
                  </button>
                </div>
                <p
                  class="product-form__line-total"
                  data-line-total
                  data-empty
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span data-line-total-label></span>
                  <s data-line-total-compare hidden>
                    <span class="visually-hidden">{{ 'products.product.regular_price' | t }}</span>
                    <span data-line-total-compare-value></span>
                  </s>
                  <span data-line-total-current></span>
                </p>
                <p class="product-form__tax-note">
                  {%- if cart.taxes_included -%}
                    {{ 'products.product.taxes_included_shipping_at_checkout' | t }}
                  {%- else -%}
                    {{ 'products.product.taxes_and_shipping_at_checkout' | t }}
                  {%- endif %}
                  {{ 'products.product.discounts_at_checkout' | t }}
                </p>
              </div>

            {%- when 'buy_buttons' -%}
              <div class="product-form" {{ block.shopify_attributes }}>
                {%- form 'product', product,
                  id: product_form_id,
                  class: 'product-form__form',
                  data-cart-add-form: ''
                -%}
                  <input type="hidden" name="id" value="{{ selected_variant.id }}" data-variant-id>

                  <div class="product-form__payment-terms">
                    {{- form | payment_terms -}}
                  </div>

                  {%- if product.selling_plan_groups.size > 0 -%}
                    <div class="selling-plans" data-selling-plans>
                      <fieldset class="selling-plans__fieldset js-only">
                        <legend>{{ 'products.product.purchase_options.legend' | t }}</legend>
                        <div class="selling-plans__choices">
                          <label class="selling-plans__choice">
                            <input
                              type="radio"
                              name="purchase-option-{{ section.id }}"
                              value="one_time"
                              data-purchase-option="one_time"
                              {% unless subscription_selected %}checked{% endunless %}
                              {% if selected_variant.requires_selling_plan %}disabled{% endif %}
                            >
                            <span class="selling-plans__choice-copy">
                              <strong>{{ 'products.product.purchase_options.one_time' | t }}</strong>
                              <span data-one-time-price>{{ selected_variant.price | money }}</span>
                            </span>
                          </label>

                          <label class="selling-plans__choice">
                            <input
                              type="radio"
                              name="purchase-option-{{ section.id }}"
                              value="subscription"
                              data-purchase-option="subscription"
                              {% if subscription_selected %}checked{% endif %}
                              {% if selected_variant.selling_plan_allocations.size == 0 %}disabled{% endif %}
                            >
                            <span class="selling-plans__choice-copy">
                              <strong>{{ 'products.product.purchase_options.subscribe' | t }}</strong>
                              <span data-subscription-price>
                                {%- if selected_selling_plan_allocation != blank -%}
                                  {{- selected_selling_plan_allocation.price | money -}}
                                {%- else -%}
                                  {{- 'products.product.purchase_options.unavailable' | t -}}
                                {%- endif -%}
                              </span>
                            </span>
                          </label>
                        </div>

                        <div class="selling-plans__details" data-selling-plan-details{% unless subscription_selected %} hidden{% endunless %}>
                          <label for="SellingPlan-{{ section.id }}">
                            {{- 'products.product.purchase_options.delivery_schedule' | t -}}
                          </label>
                          <select id="SellingPlan-{{ section.id }}" data-selling-plan-select>
                            {%- for selling_plan_group in product.selling_plan_groups -%}
                              <optgroup label="{{ selling_plan_group.name | escape }}" data-selling-plan-group>
                                {%- for selling_plan in selling_plan_group.selling_plans -%}
                                  {%- liquid
                                    assign plan_allocation = blank
                                    for allocation in selected_variant.selling_plan_allocations
                                      if allocation.selling_plan.id == selling_plan.id
                                        assign plan_allocation = allocation
                                        break
                                      endif
                                    endfor
                                  -%}
                                  <option
                                    value="{{ selling_plan.id }}"
                                    data-selling-plan-option
                                    {% if selling_plan.id == selected_selling_plan_id %}selected{% endif %}
                                    {% if plan_allocation == blank %}disabled hidden{% endif %}
                                  >
                                    {{- selling_plan.name | escape -}}
                                  </option>
                                {%- endfor -%}
                              </optgroup>
                            {%- endfor -%}
                          </select>
                          <p class="selling-plans__status" aria-live="polite" data-selling-plan-status>
                            {%- if selected_selling_plan_allocation != blank -%}
                              {{- selected_selling_plan_allocation.selling_plan.name | escape -}}
                              <span aria-hidden="true"> / </span>
                              {{- selected_selling_plan_allocation.price | money -}}
                            {%- endif -%}
                          </p>
                          <p class="selling-plans__per-delivery" data-selling-plan-per-delivery hidden></p>
                        </div>
                      </fieldset>

                      <input
                        type="hidden"
                        name="selling_plan"
                        value="{{ selected_selling_plan_id }}"
                        data-selling-plan-input
                        disabled
                      >

                      <div class="selling-plans__no-js no-js-only">
                        <label for="SellingPlanNoJs-{{ section.id }}">
                          {{- 'products.product.purchase_options.legend' | t -}}
                        </label>
                        <select id="SellingPlanNoJs-{{ section.id }}" name="selling_plan">
                          {%- unless selected_variant.requires_selling_plan -%}
                            <option value=""{% unless subscription_selected %} selected{% endunless %}>
                              {{- 'products.product.purchase_options.one_time' | t -}}
                            </option>
                          {%- endunless -%}
                          {%- for selling_plan_group in product.selling_plan_groups -%}
                            <optgroup label="{{ selling_plan_group.name | escape }}">
                              {%- for allocation in selected_variant.selling_plan_allocations -%}
                                {%- if allocation.selling_plan_group_id == selling_plan_group.id -%}
                                  <option
                                    value="{{ allocation.selling_plan.id }}"
                                    {% if allocation.selling_plan.id == selected_selling_plan_id %}selected{% endif %}
                                  >
                                    {{- allocation.selling_plan.name | escape -}}
                                    {{- ' / ' -}}
                                    {{- allocation.price | money -}}
                                  </option>
                                {%- endif -%}
                              {%- endfor -%}
                            </optgroup>
                          {%- endfor -%}
                        </select>
                      </div>
                    </div>
                  {%- endif -%}

                  {%- if product.gift_card? -%}
                    {% render 'gift-card-recipient', form: form, section: section %}
                  {%- endif -%}

                  <button
                    class="button button--full product-form__submit"
                    type="submit"
                    name="add"
                    data-add-to-cart
                    {% unless can_add_to_cart %}disabled{% endunless %}
                  >
                    <span data-add-to-cart-text>
                      {%- if selected_variant.available == false -%}
                        {{- 'products.product.sold_out' | t -}}
                      {%- elsif plan_required_unavailable -%}
                        {{- 'products.product.purchase_options.unavailable' | t -}}
                      {%- else -%}
                        {{- 'products.product.add_to_cart' | t -}}
                      {%- endif -%}
                    </span>
                    <span class="button__spinner" data-loading-icon hidden>
                      {% render 'icon', name: 'spinner', size: 18 %}
                    </span>
                  </button>

                  <p
                    class="form-message"
                    data-plan-required-notice
                    {% unless plan_required_unavailable and selected_variant.available %}hidden{% endunless %}
                  >
                    {{- 'products.product.purchase_options.plan_required' | t -}}
                  </p>

                  {%- if block.settings.show_dynamic_checkout -%}
                    <div class="product-form__dynamic-checkout"{% unless can_add_to_cart %} hidden{% endunless %}>
                      {{ form | payment_button }}
                    </div>
                  {%- endif -%}

                  <p class="form-message" role="alert" data-product-form-error hidden></p>
                {%- endform -%}

                {% render 'pickup-availability', product: product, variant: selected_variant, section: section %}
              </div>

            {%- when 'description' -%}
              {%- if product.description != blank -%}
                <div class="product-main__description rte" {{ block.shopify_attributes }}>
                  {{- product.description -}}
                </div>
              {%- endif -%}

            {%- when 'inventory_status' -%}
              {% render 'product-inventory', product: product, variant: selected_variant, block: block %}

            {%- when 'shipping_lead_time' -%}
              {%- liquid
                assign delivery_fallback = 'sections.main_product.blocks.shipping_lead_time.delivery_fallback' | t
                assign delivery_text = block.settings.delivery_text | default: delivery_fallback
              -%}
              <p class="product-trust" {{ block.shopify_attributes }}>
                <span class="product-trust__icon" aria-hidden="true">
                  {%- if block.settings.icon == 'clock' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  {%- elsif block.settings.icon == 'truck' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h12v11H2zM14 9h4l4 4v4h-8z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                  {%- endif -%}
                </span>
                <span>{{ delivery_text | escape }}</span>
              </p>

            {%- when 'trust_badges' -%}
              {%- liquid
                assign returns_fallback = 'sections.main_product.blocks.trust_badges.returns_fallback' | t
                assign returns_text = block.settings.returns_text | default: returns_fallback
              -%}
              <p class="product-trust" {{ block.shopify_attributes }}>
                <span class="product-trust__icon" aria-hidden="true">
                  {%- if block.settings.icon == 'ruler' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 2 7 7L9 22l-7-7L15 2Z"/><path d="m11 6 2 2m-5 1 2 2m-5 1 2 2m4-9 2 2"/></svg>
                  {%- elsif block.settings.icon == 'shield' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                  {%- endif -%}
                </span>
                <span>{{ returns_text | escape }}</span>
              </p>

            {%- when 'collapsible_tab' -%}
              {% render 'product-accordion', block: block %}

            {%- when 'custom_liquid' -%}
              <div class="product-main__custom-liquid" {{ block.shopify_attributes }}>
                {{- block.settings.custom_liquid -}}
              </div>

            {%- when 'technical_specs' -%}
              {% render 'product-technical-specs', block: block %}

            {%- when 'provenance' -%}
              {% render 'product-provenance', block: block, product: product, selected_variant: selected_variant %}

            {%- when '@app' -%}
              {% render block %}
          {%- endcase -%}
        {%- endfor -%}

        <p class="visually-hidden" aria-live="polite" aria-atomic="true" data-variant-status></p>
      </div>

      {%- comment -%}
        AF-07 (AUDIT-FINAL-001): el JSON de variantes no publica el stock exacto. Se limita al
        umbral del bloque de inventario más 1 (o a 1 si no hay bloque): ProductInventory
        (assets/theme.js) calcula el mismo estado y nadie más lee este campo.
      {%- endcomment -%}
      {%- liquid
        assign inventory_block = section.blocks | where: 'type', 'inventory_status' | first
        assign inventory_cap = inventory_block.settings.threshold | default: 0 | plus: 1
      -%}
      <script type="application/json" data-variant-json>
        [
          {%- for variant in product.variants -%}
            {%- liquid
              assign var_compare_money = null
              assign var_compare_cents = null
              if variant.compare_at_price > variant.price
                assign var_compare_money = variant.compare_at_price | money
                assign var_compare_cents = variant.compare_at_price
              endif
            -%}
            {
              "id": {{ variant.id | json }},
              "title": {{ variant.title | json }},
              "available": {{ variant.available | json }},
              "inventory_management": {{ variant.inventory_management | json }},
              "inventory_quantity": {{ variant.inventory_quantity | at_most: inventory_cap | json }},
              "inventory_policy": {{ variant.inventory_policy | json }},
              "options": {{ variant.options | json }},
              "price": {{ variant.price | money | json }},
              "price_cents": {{ variant.price | json }},
              "compare_at_price": {{ var_compare_money | json }},
              "compare_at_price_cents": {{ var_compare_cents | json }},
              "unit_price": {% if variant.unit_price_measurement %}{{ variant.unit_price | money | json }}{% else %}null{% endif %},
              "unit_reference_value": {{ variant.unit_price_measurement.reference_value | json }},
              "unit_reference_unit": {{ variant.unit_price_measurement.reference_unit | json }},
              "featured_media_id": {{ variant.featured_media.id | json }},
              "quantity_min": {{ variant.quantity_rule.min | default: 1 | json }},
              "quantity_increment": {{ variant.quantity_rule.increment | default: 1 | json }},
              "quantity_max": {{ variant.quantity_rule.max | json }},
              "requires_selling_plan": {{ variant.requires_selling_plan | json }},
              "selling_plan_allocations": [
                {%- for allocation in variant.selling_plan_allocations -%}
                  {%- liquid
                    assign alloc_compare_money = null
                    assign alloc_compare_cents = null
                    if allocation.compare_at_price > allocation.price
                      assign alloc_compare_money = allocation.compare_at_price | money
                      assign alloc_compare_cents = allocation.compare_at_price
                    endif
                  -%}
                  {
                    "id": {{ allocation.selling_plan.id | json }},
                    "name": {{ allocation.selling_plan.name | json }},
                    "group_id": {{ allocation.selling_plan_group_id | json }},
                    "price": {{ allocation.price | money | json }},
                    "price_cents": {{ allocation.price | json }},
                    "compare_at_price": {{ alloc_compare_money | json }},
                    "compare_at_price_cents": {{ alloc_compare_cents | json }},
                    "per_delivery_price": {{ allocation.per_delivery_price | money | json }},
                    "unit_price": {% if allocation.unit_price != blank %}{{ allocation.unit_price | money | json }}{% else %}null{% endif %}
                  }{% unless forloop.last %},{% endunless %}
                {%- endfor -%}
              ]
            }{% unless forloop.last %},{% endunless %}
          {%- endfor -%}
        ]
      </script>
    </variant-selects>
  </div>

  {%- comment -%}
    5C-002. El visor va fuera de .product-main__layout: dentro era un hijo mas de la rejilla,
    ocupaba la segunda columna con alto 0 y mandaba la ficha debajo de la galeria.
  {%- endcomment -%}
  {%- if zoom_enabled -%}
    {% render 'product-zoom', product: product, images: zoom_images %}
  {%- endif -%}

  {%- if section.settings.enable_sticky_cart -%}
    {%- liquid
      assign sticky_media = selected_variant.featured_media.preview_image | default: product.featured_media.preview_image
    -%}
    <sticky-cart-bar
      class="sticky-cart-bar color-{{ section_scheme }}"
      data-product-form-id="{{ product_form_id }}"
      data-unavailable-text="{{ 'products.product.unavailable' | t | escape }}"
      data-quantity-price-template="{{ 'products.product.sticky_quantity_price' | t: quantity: '[quantity]', price: '[price]' | escape_once }}"
      data-total-template="{{ 'products.product.sticky_total' | t: total: '[total]' | escape_once }}"
      data-quantity-label-template="{{ 'products.product.sticky_add_quantity_to_cart' | t: product: product.title, quantity: '[quantity]' | escape_once }}"
      {% if product.has_only_default_variant %}data-single-variant{% endif %}
      aria-hidden="true"
      inert
    >
      <div class="sticky-cart-bar__inner">
        <div class="sticky-cart-bar__media" aria-hidden="true">
          {%- if sticky_media != blank -%}
            {% render 'responsive-image',
              image: sticky_media,
              sizes: '56px',
              widths: '56, 112',
              image_class: 'sticky-cart-bar__image',
              alt: product.title
            %}
          {%- endif -%}
        </div>
        <div class="sticky-cart-bar__details">
          <p class="sticky-cart-bar__title">{{ product.title | escape }}</p>
          <p class="sticky-cart-bar__meta">
            <span
              class="sticky-cart-bar__variant"
              data-sticky-variant
              {% if product.has_only_default_variant %}hidden{% endif %}
            >
              {{- selected_variant.title | escape -}}
            </span>
            <span
              class="sticky-cart-bar__separator"
              aria-hidden="true"
              {% if product.has_only_default_variant %}hidden{% endif %}
            > / </span>
            <span class="sticky-cart-bar__price" data-sticky-price>{{ selected_variant.price | money }}</span>
          </p>
          {%- comment -%}
            4F-002. Con cantidad 2 o mas la barra dice cuantas unidades va a anadir y el total
            de la linea, en su propia linea para que nunca se recorte. El total no se calcula
            aqui: se copia del total que ya muestra el bloque de cantidad, asi la barra nunca
            puede discrepar de la ficha.
          {%- endcomment -%}
          <p class="sticky-cart-bar__total" data-sticky-total hidden></p>
        </div>
        <button
          class="button sticky-cart-bar__submit"
          type="button"
          aria-label="{{ 'products.product.sticky_add_to_cart' | t: product: product.title | escape_once }}"
          data-sticky-submit
          {% unless can_add_to_cart %}disabled{% endunless %}
        >
          <span data-sticky-label>
            {%- if selected_variant.available == false -%}
              {{- 'products.product.sold_out' | t -}}
            {%- elsif plan_required_unavailable -%}
              {{- 'products.product.purchase_options.unavailable' | t -}}
            {%- else -%}
              {{- 'products.product.add_to_cart' | t -}}
            {%- endif -%}
          </span>
          <span class="button__spinner" data-loading-icon hidden>
            {% render 'icon', name: 'spinner', size: 18 %}
          </span>
        </button>
      </div>
    </sticky-cart-bar>
  {%- endif -%}
</section>

{% schema %}
{
  "name": "t:sections.main_product.name",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.color_scheme.label",
      "default": "scheme-1"
    },
    {
      "type": "select",
      "id": "media_layout",
      "label": "t:sections.main_product.settings.media_layout.label",
      "options": [
        { "value": "stack", "label": "t:sections.main_product.settings.media_layout.options__1.label" },
        { "value": "grid", "label": "t:sections.main_product.settings.media_layout.options__2.label" },
        { "value": "thumbnails", "label": "t:sections.main_product.settings.media_layout.options__3.label" },
        { "value": "split_screen", "label": "t:sections.main_product.settings.media_layout.options__4.label" }
      ],
      "default": "grid"
    },
    {
      "type": "checkbox",
      "id": "enable_media_zoom",
      "label": "t:sections.main_product.settings.enable_media_zoom.label",
      "info": "t:sections.main_product.settings.enable_media_zoom.info",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "enable_sticky_cart",
      "label": "t:sections.main_product.settings.enable_sticky_cart.label",
      "info": "t:sections.main_product.settings.enable_sticky_cart.info",
      "default": true
    },
    {
      "type": "textarea",
      "id": "pickup_hours_note",
      "label": "t:sections.main_product.settings.pickup_hours_note.label",
      "info": "t:sections.main_product.settings.pickup_hours_note.info"
    }
  ],
  "blocks": [
    {
      "type": "vendor",
      "name": "t:sections.main_product.blocks.vendor.name",
      "limit": 1
    },
    {
      "type": "title",
      "name": "t:sections.main_product.blocks.title.name",
      "limit": 1
    },
    {
      "type": "price",
      "name": "t:sections.main_product.blocks.price.name",
      "limit": 1
    },
    {
      "type": "variant_picker",
      "name": "t:sections.main_product.blocks.variant_picker.name",
      "limit": 1
    },
    {
      "type": "size_guide",
      "name": "t:sections.main_product.blocks.size_guide.name",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "guide_title",
          "label": "t:sections.main_product.blocks.size_guide.settings.guide_title.label",
          "default": "Size Guide & Measurements"
        },
        {
          "type": "text",
          "id": "model_fit_info",
          "label": "t:sections.main_product.blocks.size_guide.settings.model_fit_info.label",
          "default": "Model is 178cm / 5'10\" wearing size S"
        },
        {
          "type": "checkbox",
          "id": "show_model_fit_below",
          "label": "t:sections.main_product.blocks.size_guide.settings.show_model_fit_below.label",
          "default": true
        },
        {
          "type": "page",
          "id": "page_content",
          "label": "t:sections.main_product.blocks.size_guide.settings.page_content.label",
          "info": "t:sections.main_product.blocks.size_guide.settings.page_content.info"
        },
        {
          "type": "richtext",
          "id": "size_table_cm",
          "label": "t:sections.main_product.blocks.size_guide.settings.size_table_cm.label",
          "default": "<p>XS: 84 cm / S: 88 cm / M: 92 cm / L: 96 cm</p>"
        },
        {
          "type": "richtext",
          "id": "size_table_in",
          "label": "t:sections.main_product.blocks.size_guide.settings.size_table_in.label",
          "default": "<p>XS: 33 in / S: 34.5 in / M: 36 in / L: 38 in</p>"
        }
      ]
    },
    {
      "type": "quantity",
      "name": "t:sections.main_product.blocks.quantity.name",
      "limit": 1
    },
    {
      "type": "buy_buttons",
      "name": "t:sections.main_product.blocks.buy_buttons.name",
      "limit": 1,
      "settings": [
        {
          "type": "checkbox",
          "id": "show_dynamic_checkout",
          "label": "t:sections.main_product.blocks.buy_buttons.settings.show_dynamic_checkout.label",
          "info": "t:sections.main_product.blocks.buy_buttons.settings.show_dynamic_checkout.info",
          "default": true
        }
      ]
    },
    {
      "type": "description",
      "name": "t:sections.main_product.blocks.description.name",
      "limit": 1
    },
    {
      "type": "inventory_status",
      "name": "t:sections.main_product.blocks.inventory_status.name",
      "limit": 1,
      "settings": [
        {
          "type": "range",
          "id": "threshold",
          "min": 1,
          "max": 20,
          "step": 1,
          "label": "t:sections.main_product.blocks.inventory_status.settings.threshold.label",
          "info": "t:sections.main_product.blocks.inventory_status.settings.threshold.info",
          "default": 5
        },
        {
          "type": "checkbox",
          "id": "show_count",
          "label": "t:sections.main_product.blocks.inventory_status.settings.show_count.label",
          "default": true
        }
      ]
    },
    {
      "type": "shipping_lead_time",
      "name": "t:sections.main_product.blocks.shipping_lead_time.name",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "delivery_text",
          "label": "t:sections.main_product.blocks.shipping_lead_time.settings.delivery_text.label",
          "info": "t:sections.main_product.blocks.shipping_lead_time.settings.delivery_text.info"
        },
        {
          "type": "select",
          "id": "icon",
          "label": "t:sections.main_product.blocks.shipping_lead_time.settings.icon.label",
          "options": [
            { "value": "none", "label": "t:sections.main_product.blocks.icons.none" },
            { "value": "truck", "label": "t:sections.main_product.blocks.icons.truck" },
            { "value": "clock", "label": "t:sections.main_product.blocks.icons.clock" }
          ],
          "default": "truck"
        }
      ]
    },
    {
      "type": "trust_badges",
      "name": "t:sections.main_product.blocks.trust_badges.name",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "returns_text",
          "label": "t:sections.main_product.blocks.trust_badges.settings.returns_text.label",
          "info": "t:sections.main_product.blocks.trust_badges.settings.returns_text.info"
        },
        {
          "type": "select",
          "id": "icon",
          "label": "t:sections.main_product.blocks.trust_badges.settings.icon.label",
          "options": [
            { "value": "none", "label": "t:sections.main_product.blocks.icons.none" },
            { "value": "shield", "label": "t:sections.main_product.blocks.icons.shield" },
            { "value": "ruler", "label": "t:sections.main_product.blocks.icons.ruler" }
          ],
          "default": "shield"
        }
      ]
    },
    {
      "type": "collapsible_tab",
      "name": "t:sections.main_product.blocks.collapsible_tab.name",
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "t:sections.all.heading.label",
          "default": "Composition & care"
        },
        {
          "type": "richtext",
          "id": "content",
          "label": "t:sections.all.text.label",
          "default": "<p>Describe the fibres, the finish and how to care for the piece.</p>"
        },
        {
          "type": "select",
          "id": "icon",
          "label": "t:sections.main_product.blocks.collapsible_tab.settings.icon.label",
          "options": [
            { "value": "none", "label": "t:sections.main_product.blocks.icons.none" },
            { "value": "bag", "label": "t:sections.main_product.blocks.icons.bag" },
            { "value": "check", "label": "t:sections.main_product.blocks.icons.check" }
          ],
          "default": "none"
        },
        {
          "type": "page",
          "id": "page",
          "label": "t:sections.main_product.blocks.collapsible_tab.settings.page.label",
          "info": "t:sections.main_product.blocks.collapsible_tab.settings.page.info"
        }
      ]
    },
    {
      "type": "custom_liquid",
      "name": "t:sections.featured_product.blocks.custom_liquid.name",
      "settings": [
        {
          "type": "liquid",
          "id": "custom_liquid",
          "label": "t:sections.featured_product.blocks.custom_liquid.settings.custom_liquid.label"
        }
      ]
    },
    {
      "type": "technical_specs",
      "name": "t:sections.main_product.blocks.technical_specs.name",
      "settings": [
        { "type": "text", "id": "heading", "label": "t:sections.main_product.blocks.technical_specs.settings.heading.label", "default": "Technical specifications" },
        { "type": "text", "id": "material", "label": "t:sections.main_product.blocks.technical_specs.settings.material.label", "info": "t:sections.main_product.blocks.technical_specs.settings.material.info" },
        { "type": "text", "id": "gsm", "label": "t:sections.main_product.blocks.technical_specs.settings.gsm.label", "info": "t:sections.main_product.blocks.technical_specs.settings.gsm.info" },
        { "type": "text", "id": "hardware", "label": "t:sections.main_product.blocks.technical_specs.settings.hardware.label", "info": "t:sections.main_product.blocks.technical_specs.settings.hardware.info" },
        { "type": "text", "id": "origin", "label": "t:sections.main_product.blocks.technical_specs.settings.origin.label", "info": "t:sections.main_product.blocks.technical_specs.settings.origin.info" }
      ]
    },
    {
      "type": "provenance",
      "name": "t:sections.main_product.blocks.provenance.name",
      "settings": [
        { "type": "text", "id": "heading", "label": "t:sections.main_product.blocks.provenance.settings.heading.label", "default": "Archival provenance" },
        { "type": "text", "id": "circa_year", "label": "t:sections.main_product.blocks.provenance.settings.circa_year.label", "info": "t:sections.main_product.blocks.provenance.settings.circa_year.info" },
        { "type": "checkbox", "id": "show_unique_piece", "label": "t:sections.main_product.blocks.provenance.settings.show_unique_piece.label", "info": "t:sections.main_product.blocks.provenance.settings.show_unique_piece.info", "default": false },
        {
          "type": "select",
          "id": "condition_grade",
          "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.label",
          "info": "t:sections.main_product.blocks.provenance.settings.condition_grade.info",
          "options": [
            { "value": "not_assessed", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.not_assessed.label" },
            { "value": "grade_1", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_1.label" },
            { "value": "grade_2", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_2.label" },
            { "value": "grade_3", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_3.label" },
            { "value": "grade_4", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_4.label" },
            { "value": "grade_5", "label": "t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_5.label" }
          ],
          "default": "not_assessed"
        },
        { "type": "richtext", "id": "provenance_notes", "label": "t:sections.main_product.blocks.provenance.settings.provenance_notes.label", "info": "t:sections.main_product.blocks.provenance.settings.provenance_notes.info" }
      ]
    },
    {
      "type": "@app"
    }
  ]
}
{% endschema %}
```

---

### <a id="sections-cart-drawer-liquid"></a> sections/cart-drawer.liquid

> **Descripcion:** Drawer de carrito accesible con envios gratis dinamicos
> **Ruta:** `sections/cart-drawer.liquid` | **Lineas:** 459 | **Tamano:** 21.72 KB

```liquid
{%- liquid
  assign default_scheme_id = settings.default_color_scheme.id | default: settings.default_color_scheme | default: 'scheme-1'
  assign section_scheme = section.settings.color_scheme.id | default: section.settings.color_scheme | default: default_scheme_id
  assign active_currency_code = cart.currency.iso_code | default: localization.country.currency.iso_code
  assign rewards_currency_supported = false
  if active_currency_code == shop.currency
    assign rewards_currency_supported = true
  endif
  assign free_shipping_threshold = section.settings.free_shipping_threshold | default: 150 | times: 100
  assign atelier_gift_threshold = section.settings.atelier_gift_threshold | default: 250 | times: 100
  if atelier_gift_threshold < free_shipping_threshold
    assign atelier_gift_threshold = free_shipping_threshold
  endif
  assign rewards_progress = 100
  assign shipping_marker = 100
  if rewards_currency_supported and atelier_gift_threshold > 0
    assign rewards_progress = cart.total_price | times: 100 | divided_by: atelier_gift_threshold | at_most: 100
    assign shipping_marker = free_shipping_threshold | times: 100 | divided_by: atelier_gift_threshold | at_most: 100
  endif
  assign shipping_threshold_money = free_shipping_threshold | money
  assign gift_threshold_money = atelier_gift_threshold | money
  if rewards_currency_supported == false
    assign rewards_message = blank
  elsif cart.total_price < free_shipping_threshold
    assign rewards_remaining = free_shipping_threshold | minus: cart.total_price | money
    assign rewards_message = 'sections.cart.shipping_remaining' | t: amount: rewards_remaining
  elsif cart.total_price < atelier_gift_threshold
    assign rewards_remaining = atelier_gift_threshold | minus: cart.total_price | money
    assign rewards_message = 'sections.cart.shipping_unlocked_gift_remaining' | t: amount: rewards_remaining
  else
    assign rewards_message = 'sections.cart.rewards_unlocked' | t
  endif
-%}

<cart-drawer
  class="cart-drawer color-{{ section_scheme }}"
  data-section-id="{{ section.id }}"
  data-cart-url="{{ routes.cart_url }}"
  data-cart-add-url="{{ routes.cart_add_url }}.js"
  data-cart-change-url="{{ routes.cart_change_url }}.js"
  data-item-count="{{ cart.item_count }}"
  data-cart-count-label="{{ 'sections.header.cart_count' | t: count: cart.item_count | escape_once }}"
  data-error-message="{{ 'sections.cart.error' | t | escape }}"
  data-added-message="{{ 'sections.cart.added' | t | escape }}"
  data-add-failed-message="{{ 'sections.cart.add_failed' | t | escape_once }}"
  data-cart-update-url="{{ routes.cart_update_url }}.js"
  data-recommendations-url="{{ routes.product_recommendations_url }}"
  data-update-unconfirmed-message="{{ 'sections.cart.update_unconfirmed' | t | escape }}"
  data-saving-note-message="{{ 'sections.cart.saving_note' | t | escape }}"
  data-note-unconfirmed-message="{{ 'sections.cart.note_save_unconfirmed' | t | escape }}"
>
  <div class="cart-drawer__overlay" data-cart-drawer-overlay hidden>
    <div
      class="cart-drawer__panel"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="CartDrawerTitle"
      tabindex="-1"
      data-cart-drawer-panel
      inert
    >
      <header class="cart-drawer__header">
        <div>
          <p class="eyebrow" data-cart-drawer-count>{{ 'sections.cart.item_count' | t: count: cart.item_count }}</p>
          <h2 id="CartDrawerTitle" class="cart-drawer__title">{{ 'sections.cart.title' | t }}</h2>
        </div>
        <button
          class="icon-button"
          type="button"
          aria-label="{{ 'general.accessibility.close' | t }}"
          data-cart-drawer-close
        >
          {% render 'icon', name: 'close', size: 22 %}
        </button>
      </header>

      {%- comment -%}
        Los avisos van justo bajo la cabecera y fuera de la zona desplazable: se leen sin
        buscarlos y nunca tapan el pie. JavaScript los localiza por su atributo, no por su
        posicion.
      {%- endcomment -%}
      <p class="cart-drawer__message" role="status" aria-live="polite" data-cart-status hidden></p>
      <p class="cart-drawer__message" role="alert" data-cart-error hidden></p>
      <div class="cart-drawer__uncertain" data-cart-uncertain hidden>
        <button type="button" class="button button--secondary cart-drawer__check" data-cart-check>
          {{- 'sections.cart.check_cart' | t -}}
        </button>
      </div>

      <div class="cart-drawer__content" data-cart-drawer-content>
        {%- if section.settings.enable_tiered_progress and rewards_currency_supported -%}
          <div
            class="cart-rewards"
            style="--cart-progress: {{ rewards_progress }}%; --shipping-marker: {{ shipping_marker }}%;"
            data-cart-rewards
          >
            <p class="cart-rewards__message" role="status" aria-live="polite">
              {{- rewards_message -}}
            </p>
            <div
              class="cart-rewards__track"
              role="progressbar"
              aria-label="{{ 'sections.cart.rewards_progress' | t }}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="{{ rewards_progress }}"
              aria-valuetext="{{ rewards_message | escape_once }}"
            >
              <span class="cart-rewards__fill" aria-hidden="true"></span>
              <span
                class="cart-rewards__marker"
                style="--marker-position: var(--shipping-marker);"
                {% if cart.total_price >= free_shipping_threshold %}data-unlocked{% endif %}
                aria-hidden="true"
              ></span>
              <span
                class="cart-rewards__marker"
                style="--marker-position: 100%;"
                {% if cart.total_price >= atelier_gift_threshold %}data-unlocked{% endif %}
                aria-hidden="true"
              ></span>
            </div>
            <div class="cart-rewards__milestones" aria-hidden="true">
              <span>{{ 'sections.cart.shipping_milestone' | t: amount: shipping_threshold_money }}</span>
              <span>{{ 'sections.cart.gift_milestone' | t: amount: gift_threshold_money }}</span>
            </div>
          </div>
        {%- endif -%}

        {%- if cart.empty? -%}
          <div class="cart-drawer__empty flow">
            <p>{{ 'sections.cart.empty' | t }}</p>
            <a class="button" href="{{ routes.all_products_collection_url }}">
              {{- 'sections.cart.continue_shopping' | t -}}
            </a>
          </div>
        {%- else -%}
          {%- comment -%}
            Formulario vacio y oculto: es el dueno de los radios de opciones de los productos
            complementarios (atributo form). Va antes del formulario del carrito y fuera de el,
            asi no hay formularios anidados y esos radios nunca se envian con el checkout.
          {%- endcomment -%}
          <form id="CartCrossSellOptions-{{ section.id }}" hidden></form>
          <form class="cart-drawer__form" action="{{ routes.cart_url }}" method="post" data-cart-form>
            {%- comment -%}
              Lineas y recomendaciones se desplazan dentro de su propia pista; el pie con el
              subtotal y el Checkout queda fuera de ella y siempre a la vista (4F-001). Antes
              desplazaba el panel entero y, en pantallas bajas, el aviso de estado tapaba el
              boton Checkout.
            {%- endcomment -%}
            <div class="cart-drawer__scroll" data-cart-scroll>
            <div class="cart-drawer__items" role="list">
              {%- for item in cart.items -%}
                <div
                  class="cart-drawer-item"
                  role="listitem"
                  data-cart-item-key="{{ item.key }}"
                  style="--item-index: {{ forloop.index0 }};"
                >
                  <a class="cart-drawer-item__media" href="{{ item.url }}" tabindex="-1" aria-hidden="true">
                    {%- if item.image != blank -%}
                      {% render 'responsive-image',
                        image: item.image,
                        sizes: '96px',
                        widths: '96, 160, 240',
                        image_class: 'cart-drawer-item__image',
                        alt: item.image.alt
                      %}
                    {%- endif -%}
                  </a>

                  <div class="cart-drawer-item__details">
                    <h3 class="cart-drawer-item__title">
                      <a href="{{ item.url }}">{{ item.product.title | escape }}</a>
                    </h3>

                    {%- unless item.product.has_only_default_variant -%}
                      <dl class="cart-item__options">
                        {%- for option in item.options_with_values -%}
                          <div>
                            <dt>{{ option.name | escape }}</dt>
                            <dd>{{ option.value | escape }}</dd>
                          </div>
                        {%- endfor -%}
                      </dl>
                    {%- endunless -%}

                    {%- if item.selling_plan_allocation != nil -%}
                      <p>{{ item.selling_plan_allocation.selling_plan.name | escape }}</p>
                    {%- endif -%}

                    {%- for property in item.properties -%}
                      {%- assign property_first_character = property.first | slice: 0 -%}
                      {%- if property.last != blank and property_first_character != '_' -%}
                        <p>
                          <span>{{ property.first | escape }}:</span>
                          {%- assign property_scheme = property.last | slice: 0, 8 | downcase -%}
                          {%- if property.last contains '/uploads/' and property_scheme == 'https://' -%}
                            <a href="{{ property.last | escape }}" target="_blank" rel="noopener">
                              {{- property.last | split: '/' | last | escape -}}
                              <span class="visually-hidden"> {{ 'general.accessibility.opens_in_new_window' | t }}</span>
                            </a>
                          {%- else -%}
                            {{- property.last | escape -}}
                          {%- endif -%}
                        </p>
                      {%- endif -%}
                    {%- endfor -%}

                    {%- if item.line_level_discount_allocations.size > 0 -%}
                      <ul class="cart-item__discounts unstyled-list" aria-label="{{ 'sections.cart.discount' | t }}">
                        {%- for discount in item.line_level_discount_allocations -%}
                          <li>{% render 'icon', name: 'check', size: 16 %} {{ discount.discount_application.title | escape }}</li>
                        {%- endfor -%}
                      </ul>
                    {%- endif -%}

                    <div class="cart-drawer-item__price">
                      {%- if item.original_line_price != item.final_line_price -%}
                        <s>{{ item.original_line_price | money }}</s>
                      {%- endif -%}
                      <span>{{ item.final_line_price | money }}</span>

                      {%- if item.variant.unit_price_measurement -%}
                        <small class="price__unit">
                          <span class="visually-hidden">{{ 'products.product.unit_price' | t }}</span>
                          {{ item.variant.unit_price | money }}
                          <span aria-hidden="true">/</span>
                          {%- if item.variant.unit_price_measurement.reference_value != 1 -%}
                            {{- item.variant.unit_price_measurement.reference_value -}}
                          {%- endif -%}
                          {{- item.variant.unit_price_measurement.reference_unit -}}
                        </small>
                      {%- endif -%}
                    </div>

                    {%- liquid
                      assign quantity_min = item.variant.quantity_rule.min | default: 1
                      assign quantity_step = item.variant.quantity_rule.increment | default: 1
                      assign quantity_max = item.variant.quantity_rule.max
                      # LEAD-001: con stock controlado y sin venta en negativo, el + se apaga cuando la
                      # linea ya tiene todo lo vendible (p. ej. una pieza 1-de-1). Solo revela lo que el
                      # propio error de Shopify diria al pulsar; misma regla en cart-drawer y main-cart-items.
                      if quantity_max == blank and item.variant.inventory_management == 'shopify' and item.variant.inventory_policy == 'deny' and item.variant.inventory_quantity <= item.quantity
                        assign quantity_max = item.quantity
                      endif
                    -%}
                    <label for="DrawerQuantity-{{ forloop.index }}">{{ 'sections.cart.quantity' | t }}</label>
                    {%- comment -%}
                      El estado disabled de los dos botones lo decide el servidor en cada
                      render, no solo el JavaScript: asi la linea llega correcta desde el
                      primer pintado y tras cada re-render del cajon.
                    {%- endcomment -%}
                    <div class="quantity-stepper cart-drawer-item__stepper" data-quantity-stepper>
                      <button
                        id="DrawerQuantityMinus-{{ forloop.index }}"
                        class="quantity-stepper__button"
                        type="button"
                        name="minus"
                        aria-label="{{ 'sections.cart.decrease_quantity' | t: title: item.title | escape_once }}"
                        aria-controls="DrawerQuantity-{{ forloop.index }}"
                        data-quantity-button="decrease"
                        {% if item.quantity <= quantity_min %}disabled{% endif %}
                      >
                        {% render 'icon', name: 'minus', size: 16 %}
                      </button>
                      <input
                        id="DrawerQuantity-{{ forloop.index }}"
                        class="quantity-stepper__input"
                        type="number"
                        name="updates[]"
                        value="{{ item.quantity }}"
                        min="{{ quantity_min }}"
                        step="{{ quantity_step }}"
                        {% if quantity_max != blank %}max="{{ quantity_max }}"{% endif %}
                        inputmode="numeric"
                        required
                        data-quantity-input
                        data-cart-quantity
                        data-line="{{ forloop.index }}"
                      >
                      <button
                        id="DrawerQuantityPlus-{{ forloop.index }}"
                        class="quantity-stepper__button"
                        type="button"
                        name="plus"
                        aria-label="{{ 'sections.cart.increase_quantity' | t: title: item.title | escape_once }}"
                        aria-controls="DrawerQuantity-{{ forloop.index }}"
                        data-quantity-button="increase"
                        {% if quantity_max != blank and item.quantity >= quantity_max %}disabled{% endif %}
                      >
                        {% render 'icon', name: 'plus', size: 16 %}
                      </button>
                    </div>
                  </div>

                  <button
                    class="icon-button cart-drawer-item__remove"
                    type="button"
                    aria-label="{{ 'sections.cart.remove_item' | t: title: item.title | escape_once }}"
                    data-cart-remove
                    data-line="{{ forloop.index }}"
                  >
                    {% render 'icon', name: 'close', size: 18 %}
                  </button>
                </div>
              {%- endfor -%}
            </div>

            {% render 'cart-drawer-recommendations', section: section, cart: cart %}
            </div>

            <footer class="cart-drawer__footer flow">
              {%- if settings.show_cart_note -%}
                <div class="cart-note">
                  <label for="CartDrawerNote">{{ 'sections.cart.note' | t }}</label>
                  <textarea id="CartDrawerNote" name="note" placeholder="{{ 'sections.cart.note_placeholder' | t | escape }}">{{ cart.note | escape }}</textarea>
                </div>
              {%- endif -%}

              {%- if cart.cart_level_discount_applications.size > 0 -%}
                <ul class="cart-summary__discounts unstyled-list" aria-label="{{ 'sections.cart.discount' | t }}">
                  {%- for discount in cart.cart_level_discount_applications -%}
                    <li>
                      <span>{% render 'icon', name: 'check', size: 16 %} {{ discount.title | escape }}</span>
                      <span>-{{ discount.total_allocated_amount | money }}</span>
                    </li>
                  {%- endfor -%}
                </ul>
              {%- endif -%}

              <div class="cart-summary__subtotal">
                <span>{{ 'sections.cart.subtotal' | t }}</span>
                <strong>{{ cart.total_price | money_with_currency }}</strong>
              </div>

              <p class="cart-summary__taxes">
                {%- if cart.taxes_included -%}
                  {{- 'sections.cart.taxes_included' | t -}}
                {%- else -%}
                  {{- 'sections.cart.taxes_and_shipping_at_checkout' | t -}}
                {%- endif -%}
              </p>

              <noscript>
                <button class="button button--secondary button--full" type="submit" name="update">
                  {{- 'sections.cart.update' | t -}}
                </button>
              </noscript>
              <button class="button button--full" type="submit" name="checkout">
                {{- 'sections.cart.checkout' | t -}}
              </button>
              {%- comment -%}
                Checkout acelerado (Shop Pay, Apple Pay, Google Pay, PayPal). Theme Store lo
                exige en el carrito, y el cajon es un carrito: el Section Rendering API vuelve a
                pintar los botones cada vez que el cajon se re-renderiza. Sin forzar el apilado
                vertical: Shopify los pone en fila si caben y solo los apila si no, y en un
                cajon cada fila de mas es alto que se le quita a la lista de productos.
              {%- endcomment -%}
              {%- if additional_checkout_buttons -%}
                <div class="cart__dynamic-checkout">
                  {{ content_for_additional_checkout_buttons }}
                </div>
              {%- endif -%}
              <a class="cart-drawer__view-cart" href="{{ routes.cart_url }}">
                {{- 'sections.cart.view_cart' | t -}}
              </a>
            </footer>
          </form>
        {%- endif -%}
      </div>

    </div>
  </div>
</cart-drawer>

{% schema %}
{
  "name": "t:sections.cart_drawer.name",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.color_scheme.label",
      "default": "scheme-1"
    },
    {
      "type": "checkbox",
      "id": "enable_tiered_progress",
      "label": "t:sections.cart_drawer.settings.enable_tiered_progress.label",
      "default": false
    },
    {
      "type": "number",
      "id": "free_shipping_threshold",
      "label": "t:sections.cart_drawer.settings.free_shipping_threshold.label",
      "info": "t:sections.cart_drawer.settings.free_shipping_threshold.info",
      "default": 150
    },
    {
      "type": "number",
      "id": "atelier_gift_threshold",
      "label": "t:sections.cart_drawer.settings.atelier_gift_threshold.label",
      "info": "t:sections.cart_drawer.settings.atelier_gift_threshold.info",
      "default": 250
    },
    {
      "type": "checkbox",
      "id": "show_complementary_products",
      "label": "t:sections.cart_drawer.settings.show_complementary_products.label",
      "info": "t:sections.cart_drawer.settings.show_complementary_products.info",
      "default": true
    },
    {
      "type": "text",
      "id": "cross_sell_heading",
      "label": "t:sections.cart_drawer.settings.cross_sell_heading.label",
      "default": "t:sections.cart_drawer.settings.cross_sell_heading.default"
    },
    {
      "type": "checkbox",
      "id": "use_product_metafield",
      "label": "t:sections.cart_drawer.settings.use_product_metafield.label",
      "info": "t:sections.cart_drawer.settings.use_product_metafield.info",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "use_search_discovery",
      "label": "t:sections.cart_drawer.settings.use_search_discovery.label",
      "info": "t:sections.cart_drawer.settings.use_search_discovery.info",
      "default": false
    },
    {
      "type": "collection",
      "id": "cross_sell_collection",
      "label": "t:sections.cart_drawer.settings.cross_sell_collection.label",
      "info": "t:sections.cart_drawer.settings.cross_sell_collection.info"
    }
  ],
  "blocks": [
    {
      "type": "cross_sell_product",
      "name": "t:sections.cart_drawer.blocks.cross_sell_product.name",
      "limit": 2,
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "t:sections.all.product.label",
          "info": "t:sections.cart_drawer.blocks.cross_sell_product.settings.product.info"
        }
      ]
    }
  ]
}
{% endschema %}
```

---

### <a id="sections-main-collection-liquid"></a> sections/main-collection.liquid

> **Descripcion:** Listado de coleccion con filtros nativos Facets
> **Ruta:** `sections/main-collection.liquid` | **Lineas:** 577 | **Tamano:** 27.43 KB

```liquid
{%- liquid
  assign default_scheme_id = settings.default_color_scheme.id | default: settings.default_color_scheme | default: 'scheme-1'
  assign section_scheme = section.settings.color_scheme.id | default: section.settings.color_scheme | default: default_scheme_id
  assign sort_by = collection.sort_by | default: collection.default_sort_by
  assign active_filter_count = 0
  assign default_grid_columns = section.settings.default_grid_columns | default: '4'
  assign collection_banner_image = collection.featured_image
  assign collection_image_alt = collection_banner_image.alt | default: collection.title
  # Filtros que se pintan como swatch aunque Search & Discovery no los marque asi.
  assign facet_swatch_names = 'color,colour,coloris,farbe,material' | split: ','

  for filter in collection.filters
    assign active_filter_count = active_filter_count | plus: filter.active_values.size
    if filter.type == 'price_range'
      if filter.min_value.value != nil or filter.max_value.value != nil
        assign active_filter_count = active_filter_count | plus: 1
      endif
    endif
  endfor
-%}

<div
  class="visually-hidden"
  aria-live="polite"
  aria-atomic="true"
  data-facet-live-region
></div>

<facet-filters-form
  data-section-id="{{ section.id }}"
  data-default-grid-columns="{{ default_grid_columns }}"
>
  <section class="section collection-main color-{{ section_scheme }}" data-facet-section>
    <div class="container flow">
      <header class="collection-main__header flow">
        <p class="eyebrow">{{ 'collections.general.collection' | t }}</p>
        <h1 class="collection-main__title">{{ collection.title | escape }}</h1>
        {%- if collection.description != blank -%}
          <div class="collection-main__description rte">{{ collection.description }}</div>
        {%- endif -%}
      </header>

      {%- if section.settings.show_collection_image and collection.image != blank -%}
        <figure class="collection-main__banner">
          {% render 'responsive-image',
            image: collection_banner_image,
            sizes: '(min-width: 62rem) min(100vw - 4rem, 1400px), 100vw',
            widths: '390, 550, 750, 960, 1200, 1600, 2000, 2400',
            image_class: 'collection-main__banner-image',
            alt: collection_image_alt,
            prioritize: true
          %}
        </figure>
      {%- endif -%}

      <div class="collection-main__body">
        <form class="facets" action="{{ collection.url }}" method="get" data-facet-form>
          <div class="facets__heading cluster">
            <h2 class="facets__title">{{ 'collections.filters.title' | t }}</h2>
            {%- if active_filter_count > 0 -%}
              <span class="facets__count" aria-label="{{ 'collections.filters.active_count' | t: count: active_filter_count }}">
                {{- active_filter_count -}}
              </span>
            {%- endif -%}
          </div>

          {%- for filter in collection.filters -%}
            {%- liquid
              assign filter_is_open = false
              if filter.active_values.size > 0
                assign filter_is_open = true
              elsif filter.type == 'price_range' and filter.min_value.value != nil
                assign filter_is_open = true
              elsif filter.type == 'price_range' and filter.max_value.value != nil
                assign filter_is_open = true
              endif
            -%}
            <details class="facet" {% if filter_is_open %}open{% endif %}>
              <summary class="facet__summary">
                <span>{{ filter.label | escape }}</span>
                {% render 'icon', name: 'chevron-down', size: 16 %}
              </summary>

              <div class="facet__content">
                {%- case filter.type -%}
                  {%- when 'boolean' or 'list' -%}
                    {%- liquid
                      assign filter_label_name = filter.label | downcase | strip
                      assign filter_is_swatch = false
                      if filter.presentation == 'swatch' or filter.presentation == 'image'
                        assign filter_is_swatch = true
                      elsif filter.type == 'list' and facet_swatch_names contains filter_label_name
                        assign filter_is_swatch = true
                      endif
                    -%}
                    {%- if filter_is_swatch -%}
                      <ul class="facet__values facet__values--swatch unstyled-list">
                        {%- for value in filter.values -%}
                          {%- liquid
                            assign filter_handle = filter.param_name | handle
                            assign filter_id = 'Filter-' | append: section.id | append: '-' | append: filter_handle | append: '-' | append: forloop.index
                            assign facet_swatch_css = nil
                            assign facet_swatch_focal = nil
                            if value.swatch.image
                              assign facet_swatch_url = value.swatch.image | image_url: width: 72
                              assign facet_swatch_css = 'url(' | append: facet_swatch_url | append: ')'
                              assign facet_swatch_focal = value.swatch.image.presentation.focal_point
                            elsif value.swatch.color
                              assign facet_swatch_css = 'rgb(' | append: value.swatch.color.rgb | append: ')'
                            elsif value.image
                              assign facet_swatch_url = value.image | image_url: width: 72
                              assign facet_swatch_css = 'url(' | append: facet_swatch_url | append: ')'
                              assign facet_swatch_focal = value.image.presentation.focal_point
                            endif
                            assign facet_value_empty = false
                            if value.count == 0 and value.active == false
                              assign facet_value_empty = true
                            endif
                          -%}
                          <li>
                            <label
                              class="facet__swatch-value{% if facet_value_empty %} facet__swatch-value--empty{% endif %}"
                              for="{{ filter_id }}"
                            >
                              <input
                                class="facet__swatch-input visually-hidden"
                                id="{{ filter_id }}"
                                type="checkbox"
                                name="{{ value.param_name }}"
                                value="{{ value.value | escape }}"
                                aria-label="{{ 'collections.filters.swatch_color' | t: filter: filter.label, value: value.label }}"
                                {% if value.active %}checked{% endif %}
                                {% if facet_value_empty %}disabled{% endif %}
                              >
                              <span
                                class="facet__swatch"
                                {% if facet_swatch_css %}
                                  style="--variant-swatch: {{ facet_swatch_css }};{% if facet_swatch_focal %} --variant-swatch-position: {{ facet_swatch_focal }};{% endif %}"
                                {% endif %}
                                aria-hidden="true"
                              ></span>
                              <span class="facet__swatch-label">{{ value.label | escape }}</span>
                              <span class="facet__swatch-count" aria-hidden="true">{{ value.count }}</span>
                            </label>
                          </li>
                        {%- endfor -%}
                      </ul>
                    {%- else -%}
                      <ul class="facet__values unstyled-list">
                        {%- for value in filter.values -%}
                          {%- liquid
                            assign filter_handle = filter.param_name | handle
                            assign filter_id = 'Filter-' | append: section.id | append: '-' | append: filter_handle | append: '-' | append: forloop.index
                          -%}
                          <li>
                            <label class="facet__value" for="{{ filter_id }}">
                              <input
                                id="{{ filter_id }}"
                                type="checkbox"
                                name="{{ value.param_name }}"
                                value="{{ value.value | escape }}"
                                {% if value.active %}checked{% endif %}
                                {% if value.count == 0 and value.active == false %}disabled{% endif %}
                              >
                              <span>{{ value.label | escape }}</span>
                              <span aria-hidden="true">{{ value.count }}</span>
                            </label>
                          </li>
                        {%- endfor -%}
                      </ul>
                    {%- endif -%}

                  {%- when 'price_range' -%}
                    {%- liquid
                      # Shopify hands these over in cents for every currency, so dividing
                      # is exact. The previous string surgery on money_without_currency
                      # broke on space-separated formats: "1 250,50" lost its decimal
                      # comma and submitted 125050.
                      assign range_max_value = filter.range_max | divided_by: 100.0
                      assign minimum_filter_value = filter.min_value.value | divided_by: 100.0
                      assign maximum_filter_value = filter.max_value.value | divided_by: 100.0
                    -%}
                    <div class="facet__price-range">
                      <div>
                        <label for="Filter-{{ section.id }}-{{ filter.min_value.param_name }}">
                          {{- 'collections.filters.from' | t -}}
                        </label>
                        <div class="facet__price-input">
                          <span aria-hidden="true">{{ cart.currency.symbol }}</span>
                          <input
                            id="Filter-{{ section.id }}-{{ filter.min_value.param_name }}"
                            type="number"
                            name="{{ filter.min_value.param_name }}"
                            min="0"
                            max="{{ range_max_value | escape }}"
                            step="any"
                            {% if filter.min_value.value != nil %}value="{{ minimum_filter_value | escape }}"{% endif %}
                          >
                        </div>
                      </div>
                      <div>
                        <label for="Filter-{{ section.id }}-{{ filter.max_value.param_name }}">
                          {{- 'collections.filters.to' | t -}}
                        </label>
                        <div class="facet__price-input">
                          <span aria-hidden="true">{{ cart.currency.symbol }}</span>
                          <input
                            id="Filter-{{ section.id }}-{{ filter.max_value.param_name }}"
                            type="number"
                            name="{{ filter.max_value.param_name }}"
                            min="0"
                            max="{{ range_max_value | escape }}"
                            step="any"
                            {% if filter.max_value.value != nil %}value="{{ maximum_filter_value | escape }}"{% endif %}
                          >
                        </div>
                      </div>
                    </div>
                {%- endcase -%}
              </div>
            </details>
          {%- endfor -%}

          <div class="facets__sort">
            <label for="SortBy-{{ section.id }}">{{ 'collections.filters.sort_by' | t }}</label>
            <select id="SortBy-{{ section.id }}" name="sort_by" data-facet-sort>
              {%- for option in collection.sort_options -%}
                <option value="{{ option.value }}"{% if option.value == sort_by %} selected{% endif %}>
                  {{- option.name | escape -}}
                </option>
              {%- endfor -%}
            </select>
          </div>

          <div class="facets__actions cluster">
            <button class="button" type="submit">{{ 'collections.filters.apply' | t }}</button>
          </div>
        </form>

        <div class="collection-products" data-product-grid aria-busy="false">
          {%- liquid
            # "Clear all" vive en la barra de filtros activos y conserva el orden elegido.
            assign sort_by_param = sort_by | url_encode
            assign clear_filters_url = collection.url | append: '?sort_by=' | append: sort_by_param
          -%}
          {% render 'facets-active-filters', filters: collection.filters, clear_url: clear_filters_url, section_id: section.id %}

          {%- paginate collection.products by section.settings.products_per_page -%}
            <div class="collection-products__toolbar">
              <p class="collection-products__count" data-results-status tabindex="-1">
                {{- 'collections.general.products_count' | t: count: collection.products_count -}}
              </p>
              <div
                class="collection-grid-switcher js-only"
                role="group"
                aria-label="{{ 'collections.grid.label' | t }}"
              >
                <span class="collection-grid-switcher__title" aria-hidden="true">
                  {{- 'collections.grid.title' | t -}}
                </span>
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="2"
                  aria-pressed="{% if default_grid_columns == '2' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--two" aria-hidden="true">
                    <i></i><i></i>
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--small">
                    {{- 'collections.grid.one_column' | t -}}
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--wide">
                    {{- 'collections.grid.two_columns' | t -}}
                  </span>
                </button>
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="4"
                  aria-pressed="{% if default_grid_columns == '4' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--four" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--small">
                    {{- 'collections.grid.two_columns' | t -}}
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--wide">
                    {{- 'collections.grid.four_columns' | t -}}
                  </span>
                </button>
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="list"
                  aria-pressed="false"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--list" aria-hidden="true">
                    <i></i><i></i><i></i>
                  </span>
                  <span class="visually-hidden">
                    {{- 'collections.grid.list_view' | t -}}
                  </span>
                </button>
              </div>
            </div>

            {%- if collection.products.size > 0 or section.blocks.size > 0 -%}
              <ul
                class="product-grid unstyled-list"
                data-product-list
                data-grid-columns="{{ default_grid_columns }}"
              >
                {%- liquid
                  assign product_cursor = 0
                  assign promotion_append_position = collection.products.size | plus: 1
                  assign total_grid_slots = collection.products.size | plus: section.blocks.size
                -%}
                {%- for grid_position in (1..total_grid_slots) -%}
                  {%- assign promotion_rendered = false -%}
                  {%- for block in section.blocks -%}
                    {%- assign promotion_position = block.settings.position_in_grid | default: 4 | at_most: promotion_append_position -%}
                    {%- if promotion_position == grid_position -%}
                      {%- liquid
                        assign promotion_rendered = true
                        assign promotion_scheme = block.settings.color_scheme.id | default: block.settings.color_scheme | default: section_scheme
                        assign promotion_title_id = 'PromotionTileTitle-' | append: section.id | append: '-' | append: block.id
                        assign promotion_heading_alt = block.settings.heading | strip_html
                        assign promotion_alt = block.settings.image_alt | default: promotion_heading_alt
                      -%}
                      <li class="product-grid__item product-grid__item--promotion" {{ block.shopify_attributes }}>
                        <article
                          class="promotion-tile color-{{ promotion_scheme }}"
                          {% if block.settings.heading != blank %}
                            aria-labelledby="{{ promotion_title_id }}"
                          {% else %}
                            aria-label="{{ 'collections.merchandising.promotion' | t }}"
                          {% endif %}
                        >
                          {%- if block.settings.image != blank -%}
                            <div class="promotion-tile__media">
                              {% render 'responsive-image',
                                image: block.settings.image,
                                sizes: '(min-width: 62rem) 40vw, (min-width: 48rem) 33vw, 100vw',
                                widths: '390, 550, 750, 960',
                                image_class: 'promotion-tile__image',
                                alt: promotion_alt
                              %}
                            </div>
                          {%- endif -%}
                          <div class="promotion-tile__content flow">
                            {%- if block.settings.eyebrow != blank -%}
                              <p class="eyebrow">{{ block.settings.eyebrow | escape }}</p>
                            {%- endif -%}
                            {%- if block.settings.heading != blank -%}
                              <h3 id="{{ promotion_title_id }}" class="promotion-tile__heading">
                                {{- block.settings.heading -}}
                              </h3>
                            {%- endif -%}
                            {%- if block.settings.text != blank -%}
                              <div class="promotion-tile__text rte">{{ block.settings.text }}</div>
                            {%- endif -%}
                            {%- if block.settings.link_label != blank and block.settings.link_url != blank -%}
                              <a class="button button--secondary promotion-tile__link" href="{{ block.settings.link_url | escape }}">
                                <span>{{ block.settings.link_label | escape }}</span>
                                {% render 'icon', name: 'arrow', size: 18 %}
                              </a>
                            {%- endif -%}
                          </div>
                        </article>
                      </li>
                    {%- endif -%}
                  {%- endfor -%}

                  {%- unless promotion_rendered -%}
                    {%- assign grid_product = collection.products[product_cursor] -%}
                    {%- if grid_product != blank -%}
                      {%- liquid
                        assign is_eager_card = false
                        if paginate.current_page == 1 and product_cursor < 4
                          assign is_eager_card = true
                        endif
                      -%}
                      <li class="product-grid__item">
                        {% render 'product-card',
                          card_product: grid_product,
                          eager_image: is_eager_card,
                          show_secondary_image: section.settings.show_secondary_image,
                          show_vendor: section.settings.show_vendor,
                          show_quick_add: section.settings.show_quick_add
                        %}
                      </li>
                      {%- assign product_cursor = product_cursor | plus: 1 -%}
                    {%- endif -%}
                  {%- endunless -%}
                {%- endfor -%}
              </ul>
            {%- endif -%}

            {%- comment -%}
              5A-003, H-09. "Ningun producto coincide" solo tiene sentido con filtros puestos
              (o en una pagina fuera de rango de una coleccion con productos). Una coleccion
              sin productos lo dice y lleva a todo el catalogo, salvo que ya sea ese catalogo.
            {%- endcomment -%}
            {%- if collection.products.size == 0 -%}
              <div class="collection-products__empty flow">
                {%- if active_filter_count > 0 or collection.all_products_count > 0 -%}
                  <p>{{ 'collections.general.no_products' | t }}</p>
                  <a href="{{ clear_filters_url }}" data-facet-clear-all>{{ 'collections.filters.clear_all' | t }}</a>
                {%- else -%}
                  <p>{{ 'collections.general.empty' | t }}</p>
                  {%- if collection.handle != 'all' -%}
                    <a href="{{ routes.all_products_collection_url }}">{{ 'collections.general.browse_all' | t }}</a>
                  {%- endif -%}
                {%- endif -%}
              </div>
            {%- endif -%}

            {%- if paginate.pages > 1 -%}
              <nav class="pagination" aria-label="{{ 'collections.pagination.label' | t }}">
                {%- if paginate.previous -%}
                  <a class="pagination__link" href="{{ paginate.previous.url }}">
                    {{- 'collections.pagination.previous' | t -}}
                  </a>
                {%- endif -%}

                {%- for part in paginate.parts -%}
                  {%- if part.is_link -%}
                    <a class="pagination__link" href="{{ part.url }}">{{ part.title }}</a>
                  {%- elsif part.title == paginate.current_page -%}
                    <span class="pagination__link" aria-current="page">{{ part.title }}</span>
                  {%- else -%}
                    <span class="pagination__ellipsis">{{ part.title }}</span>
                  {%- endif -%}
                {%- endfor -%}

                {%- if paginate.next -%}
                  <a class="pagination__link" href="{{ paginate.next.url }}">
                    {{- 'collections.pagination.next' | t -}}
                  </a>
                {%- endif -%}
              </nav>
            {%- endif -%}
          {%- endpaginate -%}
        </div>
      </div>
    </div>
  </section>
</facet-filters-form>

{% schema %}
{
  "name": "t:sections.main_collection.name",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.color_scheme.label",
      "default": "scheme-1"
    },
    {
      "type": "range",
      "id": "products_per_page",
      "min": 8,
      "max": 48,
      "step": 4,
      "label": "t:sections.main_collection.settings.products_per_page.label",
      "default": 24
    },
    {
      "type": "checkbox",
      "id": "show_collection_image",
      "label": "t:sections.main_collection.settings.show_collection_image.label",
      "default": true
    },
    {
      "type": "select",
      "id": "default_grid_columns",
      "label": "t:sections.main_collection.settings.default_grid_columns.label",
      "info": "t:sections.main_collection.settings.default_grid_columns.info",
      "options": [
        { "value": "2", "label": "t:sections.main_collection.settings.default_grid_columns.options__1.label" },
        { "value": "4", "label": "t:sections.main_collection.settings.default_grid_columns.options__2.label" }
      ],
      "default": "4"
    },
    {
      "type": "checkbox",
      "id": "show_secondary_image",
      "label": "t:sections.all.show_secondary_image.label",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_vendor",
      "label": "t:sections.all.show_vendor.label",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "show_quick_add",
      "label": "t:sections.all.show_quick_add.label",
      "info": "t:sections.all.show_quick_add.info",
      "default": true
    }
  ],
  "max_blocks": 2,
  "blocks": [
    {
      "type": "promotion_tile",
      "name": "t:sections.main_collection.blocks.promotion_tile.name",
      "limit": 2,
      "settings": [
        {
          "type": "range",
          "id": "position_in_grid",
          "min": 1,
          "max": 48,
          "step": 1,
          "label": "t:sections.main_collection.blocks.promotion_tile.settings.position_in_grid.label",
          "info": "t:sections.main_collection.blocks.promotion_tile.settings.position_in_grid.info",
          "default": 4
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "t:sections.all.image.label"
        },
        {
          "type": "text",
          "id": "image_alt",
          "label": "t:sections.all.image_alt.label"
        },
        {
          "type": "text",
          "id": "eyebrow",
          "label": "t:sections.all.eyebrow.label",
          "default": "Atelier note / 01"
        },
        {
          "type": "inline_richtext",
          "id": "heading",
          "label": "t:sections.all.heading.label",
          "default": "Cloth remembers the shape of daily life"
        },
        {
          "type": "richtext",
          "id": "text",
          "label": "t:sections.all.text.label",
          "default": "<p>Follow a material study from fibre to finished form.</p>"
        },
        {
          "type": "text",
          "id": "link_label",
          "label": "t:sections.main_collection.blocks.promotion_tile.settings.link_label.label",
          "default": "Read the story"
        },
        {
          "type": "url",
          "id": "link_url",
          "label": "t:sections.main_collection.blocks.promotion_tile.settings.link_url.label",
          "default": "/collections/all",
          "info": "t:sections.all.link_destination_info"
        },
        {
          "type": "color_scheme",
          "id": "color_scheme",
          "label": "t:sections.all.color_scheme.label",
          "default": "scheme-2"
        }
      ]
    }
  ]
}
{% endschema %}
```

---

### <a id="sections-bento-discovery-liquid"></a> sections/bento-discovery.liquid

> **Descripcion:** Seccion de grilla de descubrimiento editorial
> **Ruta:** `sections/bento-discovery.liquid` | **Lineas:** 296 | **Tamano:** 10.71 KB

```liquid
{%- liquid
  assign default_scheme_id = settings.default_color_scheme.id | default: settings.default_color_scheme | default: 'scheme-1'
  assign section_scheme = section.settings.color_scheme.id | default: section.settings.color_scheme | default: default_scheme_id
-%}

<section
  class="section bento-discovery color-{{ section_scheme }}"
  {% if section.settings.heading != blank %}
    aria-labelledby="BentoDiscoveryTitle-{{ section.id }}"
  {% else %}
    aria-label="{{ 'sections.homepage.bento.region_label' | t }}"
  {% endif %}
>
  <div class="bento-discovery__inner">
    <header class="bento-discovery__header">
      <div>
        {%- if section.settings.eyebrow != blank -%}
          <p class="eyebrow">{{ section.settings.eyebrow | escape }}</p>
        {%- endif -%}
        {%- if section.settings.heading != blank -%}
          <h2 id="BentoDiscoveryTitle-{{ section.id }}" class="bento-discovery__heading">
            {{- section.settings.heading | escape -}}
          </h2>
        {%- endif -%}
      </div>
      {%- if section.settings.subheading != blank -%}
        <div class="bento-discovery__subheading rte">{{ section.settings.subheading }}</div>
      {%- endif -%}
    </header>

    <div class="bento-discovery__grid">
      {%- for block in section.blocks -%}
        {%- case block.type -%}
          {%- when 'card_featured' -%}
            {%- liquid
              assign card_collection = block.settings.collection
              assign card_title = block.settings.heading | default: card_collection.title
              assign card_image = block.settings.image | default: card_collection.image
              assign card_url = block.settings.link | default: card_collection.url | default: routes.all_products_collection_url
              assign card_alt = block.settings.image_alt | default: card_title
            -%}
            <div class="bento-discovery__item bento-discovery__item--featured" {{ block.shopify_attributes }}>
              <a
                class="bento-card bento-card--featured"
                href="{{ card_url }}"
                aria-label="{{ 'sections.homepage.bento.explore' | t: title: card_title | escape_once }}"
              >
                <span class="bento-card__media">
                  {%- if card_image != blank -%}
                    {% render 'responsive-image',
                      image: card_image,
                      sizes: '(min-width: 62rem) 48vw, 100vw',
                      widths: '480, 750, 960, 1200, 1600',
                      image_class: 'bento-card__image',
                      alt: card_alt
                    %}
                  {%- else -%}
                    <span class="bento-card__placeholder" aria-hidden="true">
                      {{- 'collection-1' | placeholder_svg_tag: 'homepage-placeholder' -}}
                    </span>
                  {%- endif -%}
                </span>
                <span class="bento-card__content">
                  {%- if block.settings.eyebrow != blank -%}
                    <span class="bento-card__eyebrow">{{ block.settings.eyebrow | escape }}</span>
                  {%- endif -%}
                  {%- if card_title != blank -%}
                    <span class="bento-card__title">{{ card_title | escape }}</span>
                  {%- endif -%}
                  {% render 'icon', name: 'arrow', size: 20 %}
                </span>
              </a>
            </div>

          {%- when 'card_editorial' -%}
            {%- liquid
              assign editorial_title = block.settings.heading
              assign editorial_alt = block.settings.image_alt | default: editorial_title
            -%}
            <div class="bento-discovery__item bento-discovery__item--editorial" {{ block.shopify_attributes }}>
              {%- if block.settings.link != blank -%}
                <a
                  class="bento-card bento-card--editorial{% if block.settings.image == blank %} bento-card--editorial-text{% endif %}"
                  href="{{ block.settings.link }}"
                  aria-label="{{ 'sections.homepage.bento.explore' | t: title: editorial_title | escape_once }}"
                >
              {%- else -%}
                <div class="bento-card bento-card--editorial{% if block.settings.image == blank %} bento-card--editorial-text{% endif %}">
              {%- endif -%}
                {%- if block.settings.image != blank -%}
                  <div class="bento-card__media bento-card__media--editorial">
                    {% render 'responsive-image',
                      image: block.settings.image,
                      sizes: '(min-width: 62rem) 48vw, 100vw',
                      widths: '480, 750, 960, 1200',
                      image_class: 'bento-card__image',
                      alt: editorial_alt
                    %}
                  </div>
                {%- endif -%}
                <div class="bento-card__editorial-copy">
                  {%- if block.settings.eyebrow != blank -%}
                    <span class="bento-card__eyebrow">{{ block.settings.eyebrow | escape }}</span>
                  {%- endif -%}
                  {%- if editorial_title != blank -%}
                    <span class="bento-card__title">{{ editorial_title | escape }}</span>
                  {%- endif -%}
                  {%- if block.settings.body != blank -%}
                    <div class="bento-card__body rte">{{ block.settings.body }}</div>
                  {%- endif -%}
                  {%- if block.settings.link != blank and block.settings.link_label != blank -%}
                    <span class="bento-card__cta">
                      <span>{{ block.settings.link_label | escape }}</span>
                      {% render 'icon', name: 'arrow', size: 18 %}
                    </span>
                  {%- endif -%}
                </div>
              {%- if block.settings.link != blank -%}
                </a>
              {%- else -%}
                </div>
              {%- endif -%}
            </div>

          {%- when 'card_product' -%}
            <div class="bento-discovery__item bento-discovery__item--product" {{ block.shopify_attributes }}>
              {%- if block.settings.product != blank -%}
                {% render 'product-card',
                  card_product: block.settings.product,
                  card_id_suffix: block.id,
                  show_secondary_image: true,
                  show_vendor: false,
                  show_quick_add: false
                %}
              {%- else -%}
                <div class="bento-discovery__product-placeholder" aria-hidden="true">
                  <div class="product-card__media">
                    {{- 'product-3' | placeholder_svg_tag: 'homepage-placeholder' -}}
                  </div>
                  <span class="bento-discovery__placeholder-line"></span>
                  <span class="bento-discovery__placeholder-line bento-discovery__placeholder-line--short"></span>
                </div>
              {%- endif -%}
            </div>
        {%- endcase -%}
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "t:sections.bento_discovery.name",
  "disabled_on": {
    "groups": ["header", "footer"]
  },
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "t:sections.all.eyebrow.label",
      "default": "DISCOVER BY FORM / 04"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "t:sections.all.heading.label",
      "default": "A wardrobe, a room, a way of living"
    },
    {
      "type": "richtext",
      "id": "subheading",
      "label": "t:sections.all.subheading.label",
      "default": "<p>Three studies. One material language.</p>"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.color_scheme.label",
      "default": "scheme-1"
    }
  ],
  "blocks": [
    {
      "type": "card_featured",
      "name": "t:sections.bento_discovery.blocks.card_featured.name",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "t:sections.all.collection.label"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "t:sections.all.image.label"
        },
        {
          "type": "text",
          "id": "image_alt",
          "label": "t:sections.all.image_alt.label"
        },
        {
          "type": "text",
          "id": "eyebrow",
          "label": "t:sections.all.eyebrow.label",
          "default": "[01] FEATURED COLLECTION"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "t:sections.all.heading.label",
          "default": "Sculptural layers"
        },
        {
          "type": "url",
          "id": "link",
          "label": "t:sections.bento_discovery.blocks.card_featured.settings.link.label",
          "default": "/collections/all",
          "info": "t:sections.all.link_destination_info"
        }
      ]
    },
    {
      "type": "card_editorial",
      "name": "t:sections.bento_discovery.blocks.card_editorial.name",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "t:sections.bento_discovery.blocks.card_editorial.settings.image.label"
        },
        {
          "type": "text",
          "id": "image_alt",
          "label": "t:sections.all.image_alt.label"
        },
        {
          "type": "text",
          "id": "eyebrow",
          "label": "t:sections.all.eyebrow.label",
          "default": "[02] MATERIAL STUDY"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "t:sections.all.heading.label",
          "default": "Carried close"
        },
        {
          "type": "richtext",
          "id": "body",
          "label": "t:sections.all.body.label",
          "default": "<p>An editorial study in proportion, tactility and daily use.</p>"
        },
        {
          "type": "text",
          "id": "link_label",
          "label": "t:sections.all.link_label.label",
          "default": "Explore the story"
        },
        {
          "type": "url",
          "id": "link",
          "label": "t:sections.all.link.label",
          "default": "/collections/all",
          "info": "t:sections.all.link_destination_info"
        }
      ]
    },
    {
      "type": "card_product",
      "name": "t:sections.bento_discovery.blocks.card_product.name",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "t:sections.all.product.label"
        }
      ]
    }
  ],
  "max_blocks": 4,
  "presets": [
    {
      "name": "t:sections.bento_discovery.presets.name",
      "blocks": [
        { "type": "card_featured" },
        { "type": "card_editorial" },
        { "type": "card_product" }
      ]
    }
  ]
}
{% endschema %}
```

---

### <a id="snippets-cart-drawer-recommendations-liquid"></a> snippets/cart-drawer-recommendations.liquid

> **Descripcion:** Recomendaciones complementarias en cart drawer
> **Ruta:** `snippets/cart-drawer-recommendations.liquid` | **Lineas:** 294 | **Tamano:** 13.36 KB

```liquid
{%- comment -%}
  Productos complementarios del cajon del carrito (V1.1.0, fase 2).

  Accepts:
  - section: la seccion cart-drawer (ajustes y bloques)
  - cart: el carrito

  Global: recommendations (solo trae productos cuando la seccion se pinta desde la ruta
  de recomendaciones con intent=complementary).

  Una sola pasada por cuatro fuentes en orden estricto: metafield del producto ancla,
  recomendaciones complementarias de Shopify, bloques del editor y coleccion. Cada fuente
  solo rellena los huecos que quedan, hasta 2 productos unicos, disponibles y fuera del
  carrito. El marcado de la tarjeta existe una sola vez, dentro del bucle de candidatos.
  Sin candidatos no se pinta nada: ni encabezado ni contenedor.
{%- endcomment -%}
{%- if section.settings.show_complementary_products and cart.item_count > 0 -%}
  {%- liquid
    assign default_cross_sell_heading = 'sections.cart.complimentary_additions' | t
    assign cross_sell_heading = section.settings.cross_sell_heading | default: default_cross_sell_heading

    # Ancla: la linea de mayor precio unitario original (antes de descuentos). Empate entre
    # productos: product_id menor; mismo producto: variant_id menor. Las tarjetas regalo y los
    # precios <= 0 no pueden ser ancla, pero si cuentan como productos ya en el carrito.
    assign in_cart_ids = ','
    assign anchor_item = nil
    assign anchor_price = 0
    for item in cart.items
      assign in_cart_ids = in_cart_ids | append: item.product_id | append: ','
      if item.gift_card or item.original_price <= 0
        continue
      endif
      if item.original_price > anchor_price
        assign anchor_item = item
        assign anchor_price = item.original_price
      elsif item.original_price == anchor_price
        if item.product_id < anchor_item.product_id
          assign anchor_item = item
        elsif item.product_id == anchor_item.product_id and item.variant_id < anchor_item.variant_id
          assign anchor_item = item
        endif
      endif
    endfor
    assign anchor_product = anchor_item.product

    assign seen_ids = ','
    assign cross_sell_count = 0
  -%}

  {%- capture add_button_content -%}
    <span data-cross-sell-label>{{ 'sections.cart.add_complementary' | t }}</span>
    <span class="visually-hidden" data-cross-sell-adding hidden>{{ 'sections.cart.adding' | t }}</span>
    <span class="button__spinner" data-loading-icon hidden>
      {% render 'icon', name: 'spinner', size: 16 %}
    </span>
  {%- endcapture -%}

  {%- capture cross_sell_cards -%}
    {%- for source in (1..4) -%}
      {%- liquid
        if cross_sell_count >= 2
          break
        endif
        assign pool = nil
        assign budget = 0
        case source
          when 1
            if section.settings.use_product_metafield and anchor_product
              assign pool = anchor_product.metafields.custom.complementary_products.value
              assign budget = 10
            endif
          when 2
            if section.settings.use_search_discovery and anchor_product and recommendations.performed?
              assign pool = recommendations.products
              assign budget = 10
            endif
          when 3
            assign pool = section.blocks
            assign budget = section.blocks.size
          when 4
            assign pool = section.settings.cross_sell_collection.products
            assign budget = 50
        endcase
      -%}
      {%- for entry in pool limit: budget -%}
        {%- liquid
          if cross_sell_count >= 2
            break
          endif
          assign candidate = entry
          assign card_attributes = ''
          if source == 3
            assign candidate = entry.settings.product
            assign card_attributes = entry.shopify_attributes
          endif
          if candidate == blank or candidate.available != true
            continue
          endif
          assign candidate_token = ',' | append: candidate.id | append: ','
          if in_cart_ids contains candidate_token or seen_ids contains candidate_token
            continue
          endif
          assign seen_ids = seen_ids | append: candidate.id | append: ','
          assign cross_sell_count = cross_sell_count | plus: 1

          # Flujo: direct (variante unica que admite 1 unidad), options (hasta 2 opciones,
          # elegidas en la propia tarjeta) o link (todo lo demas va a la ficha del producto).
          assign card_variant = candidate.selected_or_first_available_variant
          assign variant_min = card_variant.quantity_rule.min | default: 1
          assign variant_increment = card_variant.quantity_rule.increment | default: 1
          assign card_flow = 'link'
          unless candidate.gift_card? or candidate.requires_selling_plan or candidate.selling_plan_groups.size > 0 or candidate.options.size > 2 or candidate.variants.size > 100
            if candidate.has_only_default_variant == false
              assign card_flow = 'options'
            elsif card_variant.available and variant_min <= 1 and variant_increment == 1
              assign card_flow = 'direct'
            endif
          endunless
        -%}
        <li>
          <article
            class="cart-cross-sell__item"
            data-cross-sell-item
            data-product-id="{{ candidate.id }}"
            data-flow="{{ card_flow }}"
            data-cross-sell-focus="{{ card_variant.id }}"
            tabindex="-1"
            {{ card_attributes }}
          >
            <a class="cart-cross-sell__media" href="{{ candidate.url }}" tabindex="-1" aria-hidden="true">
              {%- if candidate.featured_image != blank -%}
                {% render 'responsive-image',
                  image: candidate.featured_image,
                  sizes: '64px',
                  widths: '64, 128',
                  image_class: 'cart-cross-sell__image',
                  alt: candidate.featured_image.alt
                %}
              {%- else -%}
                <span class="cart-cross-sell__placeholder"></span>
              {%- endif -%}
            </a>
            <div class="cart-cross-sell__details">
              <p class="cart-cross-sell__title">
                <a href="{{ candidate.url }}">{{ candidate.title | escape }}</a>
              </p>
              <p class="cart-cross-sell__price" data-cross-sell-price>{% if candidate.price_varies %}{{ 'products.product.price_from' | t }} {% endif %}{{ candidate.price | money }}</p>
            </div>

            {%- if card_flow == 'direct' -%}
              <button
                type="button"
                class="cart-cross-sell__button"
                data-cross-sell-add
                data-variant-id="{{ card_variant.id }}"
                aria-label="{{ 'sections.cart.add_complementary_product' | t: product: candidate.title | escape }}"
              >
                {{- add_button_content -}}
              </button>
            {%- elsif card_flow == 'options' -%}
              <button
                type="button"
                class="cart-cross-sell__button"
                data-cross-sell-expand
                aria-expanded="false"
                aria-controls="CrossSellOptions-{{ section.id }}-{{ candidate.id }}"
                aria-label="{{ 'sections.cart.choose_options_product' | t: product: candidate.title | escape }}"
              >
                {{- 'sections.cart.choose_options' | t -}}
              </button>
              <div
                class="cart-cross-sell__options"
                id="CrossSellOptions-{{ section.id }}-{{ candidate.id }}"
                data-cross-sell-options
                hidden
              >
                {%- comment -%}
                  Los radios pertenecen al formulario vacio CartCrossSellOptions (fuera del
                  formulario del carrito), asi nunca viajan al checkout. Ninguno llega marcado:
                  el comprador elige de forma explicita.
                {%- endcomment -%}
                {%- for option in candidate.options_with_values -%}
                  {%- assign option_position = forloop.index -%}
                  <fieldset class="cart-cross-sell__fieldset" data-option-position="{{ option_position }}">
                    <legend class="cart-cross-sell__legend">
                      {{- 'sections.cart.select_option' | t: option: option.name | escape -}}
                    </legend>
                    <div class="cart-cross-sell__chips">
                      {%- for value in option.values -%}
                        <label class="cart-cross-sell__chip">
                          <input
                            type="radio"
                            class="cart-cross-sell__radio"
                            name="CrossSell-{{ section.id }}-{{ candidate.id }}-{{ option_position }}"
                            value="{{ value | escape }}"
                            form="CartCrossSellOptions-{{ section.id }}"
                            data-cross-sell-option
                          >
                          <span class="cart-cross-sell__chip-label">{{ value | escape }}</span>
                          <span class="visually-hidden" data-chip-unavailable hidden>
                            {{- 'products.product.unavailable' | t -}}
                          </span>
                        </label>
                      {%- endfor -%}
                    </div>
                  </fieldset>
                {%- endfor -%}
                <p
                  class="cart-cross-sell__options-status"
                  id="CrossSellStatus-{{ section.id }}-{{ candidate.id }}"
                  data-cross-sell-options-status
                  hidden
                >
                  {{- 'sections.cart.options_unavailable' | t -}}
                </p>
                <div class="cart-cross-sell__options-actions">
                  <button
                    type="button"
                    class="cart-cross-sell__button"
                    data-cross-sell-add
                    data-variant-id=""
                    disabled
                    aria-label="{{ 'sections.cart.add_complementary_product' | t: product: candidate.title | escape }}"
                  >
                    {{- add_button_content -}}
                  </button>
                  <button type="button" class="cart-cross-sell__cancel" data-cross-sell-cancel>
                    {{- 'sections.cart.cancel_options' | t -}}
                  </button>
                </div>
                <script type="application/json" data-cross-sell-variants>
                  [
                    {%- assign json_separator = '' -%}
                    {%- for option_variant in candidate.variants -%}
                      {{- json_separator -}}
                      {"id":{{ option_variant.id | json }},"available":{{ option_variant.available | json }},"price":{{ option_variant.price | json }},"options":{{ option_variant.options | json }},"image":
                      {%- if option_variant.featured_image != blank -%}
                        {{- option_variant.featured_image | image_url: width: 240 | json -}}
                      {%- else -%}
                        null
                      {%- endif -%}
                      ,"min":{{ option_variant.quantity_rule.min | default: 1 | json }},"max":{{ option_variant.quantity_rule.max | json }},"increment":{{ option_variant.quantity_rule.increment | default: 1 | json }} }
                      {%- assign json_separator = ',' -%}
                    {%- endfor -%}
                  ]
                </script>
              </div>
            {%- else -%}
              <a
                class="button button--secondary cart-cross-sell__link"
                href="{{ candidate.url }}"
                data-cross-sell-view
                aria-label="{{ 'sections.cart.view_product_for' | t: product: candidate.title | escape }}"
              >
                {{- 'sections.cart.view_product' | t -}}
              </a>
            {%- endif -%}
          </article>
        </li>
      {%- endfor -%}
    {%- endfor -%}
  {%- endcapture -%}

  {%- liquid
    # Fuente 2 sin resolver todavia: el JavaScript pide la ruta de recomendaciones para el
    # ancla y sustituye este contenedor. Mientras tanto se ve lo que dieron las demas fuentes.
    assign fetch_pending = false
    if section.settings.use_search_discovery and anchor_product and recommendations.performed? != true and cross_sell_count < 2
      assign fetch_pending = true
    endif
  -%}

  {%- if cross_sell_count > 0 or fetch_pending -%}
    <div
      class="cart-cross-sell-slot"
      data-cart-cross-sell-slot
      data-anchor-product-id="{{ anchor_product.id }}"
      {% if fetch_pending %}data-recommendations-pending{% endif %}
    >
      {%- if cross_sell_count > 0 -%}
        <section class="cart-cross-sell" aria-labelledby="CartCrossSellHeading-{{ section.id }}" data-cart-cross-sell>
          <p class="eyebrow">{{ 'sections.cart.curated_for_order' | t }}</p>
          <h3 id="CartCrossSellHeading-{{ section.id }}" class="cart-cross-sell__heading">
            {{- cross_sell_heading | escape -}}
          </h3>
          <ul class="cart-cross-sell__list" role="list">
            {{- cross_sell_cards -}}
          </ul>
        </section>
      {%- endif -%}
    </div>
  {%- endif -%}
{%- endif -%}
```

---

### <a id="snippets-product-technical-specs-liquid"></a> snippets/product-technical-specs.liquid

> **Descripcion:** Ficha tecnica colapsable con metafields de producto
> **Ruta:** `snippets/product-technical-specs.liquid` | **Lineas:** 43 | **Tamano:** 1.74 KB

```liquid
{%- comment -%}
  Renders product technical specifications block.
  Accepts:
  - block: {Object} Block object with settings and shopify_attributes.

  Usage:
  {% render 'product-technical-specs', block: block %}
{%- endcomment -%}

{%- if block.settings.material != blank or block.settings.gsm != blank or block.settings.hardware != blank or block.settings.origin != blank -%}
  <div class="product-technical-specs" {{ block.shopify_attributes }}>
    {%- if block.settings.heading != blank -%}
      <h3 class="product-technical-specs__heading">{{ block.settings.heading | escape }}</h3>
    {%- endif -%}
    <dl class="product-technical-specs__list">
      {%- if block.settings.material != blank -%}
        <div class="product-technical-specs__row">
          <dt>{{ 'products.product.technical_specs.material' | t }}</dt>
          <dd>{{ block.settings.material | escape }}</dd>
        </div>
      {%- endif -%}
      {%- if block.settings.gsm != blank -%}
        <div class="product-technical-specs__row">
          <dt>{{ 'products.product.technical_specs.gsm' | t }}</dt>
          <dd>{{ block.settings.gsm | escape }}</dd>
        </div>
      {%- endif -%}
      {%- if block.settings.hardware != blank -%}
        <div class="product-technical-specs__row">
          <dt>{{ 'products.product.technical_specs.hardware' | t }}</dt>
          <dd>{{ block.settings.hardware | escape }}</dd>
        </div>
      {%- endif -%}
      {%- if block.settings.origin != blank -%}
        <div class="product-technical-specs__row">
          <dt>{{ 'products.product.technical_specs.origin' | t }}</dt>
          <dd>{{ block.settings.origin | escape }}</dd>
        </div>
      {%- endif -%}
    </dl>
  </div>
{%- endif -%}
```

---

### <a id="snippets-product-provenance-liquid"></a> snippets/product-provenance.liquid

> **Descripcion:** Bloque de procedencia artesanal y origen
> **Ruta:** `snippets/product-provenance.liquid` | **Lineas:** 50 | **Tamano:** 2.34 KB

```liquid
{%- comment -%}
  Renders product provenance block for vintage/archive pieces.
  Accepts:
  - block: {Object} Block object with settings and shopify_attributes.
  - product: {Object} Product Liquid object.
  - selected_variant: {Object} Selected or first available variant.

  Usage:
  {% render 'product-provenance', block: block, product: product, selected_variant: selected_variant %}
{%- endcomment -%}

{%- liquid
  assign unique_piece = false
  if block.settings.show_unique_piece and product.variants.size == 1 and selected_variant.inventory_management != blank and selected_variant.inventory_policy == 'deny'
    assign unique_piece = true
  endif
  assign show_grade = false
  if block.settings.condition_grade != blank and block.settings.condition_grade != 'not_assessed'
    assign show_grade = true
  endif
-%}
{%- if unique_piece or show_grade or block.settings.circa_year != blank or block.settings.provenance_notes != blank -%}
  <div class="product-provenance" {{ block.shopify_attributes }}>
    {%- if block.settings.heading != blank -%}
      <h3 class="product-provenance__heading">{{ block.settings.heading | escape }}</h3>
    {%- endif -%}
    {%- if unique_piece -%}
      <p class="product-provenance__badge">{{ 'products.product.provenance.single_piece' | t }}</p>
    {%- endif -%}
    {%- if block.settings.circa_year != blank -%}
      <p class="product-provenance__year">{{ 'products.product.provenance.circa' | t: year: block.settings.circa_year | escape }}</p>
    {%- endif -%}
    {%- if show_grade -%}
      <p class="product-provenance__grade">
        <span>{{ 'products.product.provenance.condition' | t }}</span>
        {%- case block.settings.condition_grade -%}
          {%- when 'grade_1' -%}{{ 'products.product.provenance.grade_1' | t }}
          {%- when 'grade_2' -%}{{ 'products.product.provenance.grade_2' | t }}
          {%- when 'grade_3' -%}{{ 'products.product.provenance.grade_3' | t }}
          {%- when 'grade_4' -%}{{ 'products.product.provenance.grade_4' | t }}
          {%- when 'grade_5' -%}{{ 'products.product.provenance.grade_5' | t }}
        {%- endcase -%}
      </p>
    {%- endif -%}
    {%- if block.settings.provenance_notes != blank -%}
      <div class="product-provenance__notes rte">{{- block.settings.provenance_notes -}}</div>
    {%- endif -%}
  </div>
{%- endif -%}
```

---

### <a id="snippets-product-card-liquid"></a> snippets/product-card.liquid

> **Descripcion:** Tarjeta de producto con soporte de badges y swatch preview
> **Ruta:** `snippets/product-card.liquid` | **Lineas:** 513 | **Tamano:** 24.04 KB

```liquid
{%- comment -%}
  Renders a reusable product card.

  Accepts:
  - card_product: product object
  - show_secondary_image: reveal the second product image on hover/focus
  - show_vendor: show the product vendor
  - card_id_suffix: optional. Extra key for the card's ids when the same product can appear more
    than once in one section (tabs or blocks). Pass block.id.
  - show_quick_add: show quick add. A single variant adds in one click; a product whose
    only option is its color adds the committed color in one click; a product with one
    size-like option (plus an optional color) opens a size picker where the size itself is the
    explicit add. Anything that cannot be bought safely from the card links to the product page:
    selling plans (required or optional), gift cards, combined listings, more than 250 variants,
    two free-text options or three options.

  Color and material options with a native swatch, or named like one, render as swatches. Hover
  only previews the photo; click, tap or keyboard commits the color and updates photo, link,
  price and the sizes on offer. A value without a native swatch shows its name, never a guessed
  color. Everything else stays in Liquid so the card reads correctly without JavaScript.
{%- endcomment -%}

{%- liquid
  assign card_image = card_product.featured_media.preview_image
  assign secondary_image = card_product.images[1]
  assign card_sizes = '(min-width: 990px) 25vw, 50vw'
  assign card_key = section.id | append: '-' | append: card_product.id
  if card_id_suffix != blank
    assign card_key = card_key | append: '-' | append: card_id_suffix
  endif
  assign quick_add_id = 'quick-add-' | append: card_key
  assign card_title_id = 'CardTitle-' | append: card_key
  assign quick_buy_id = 'QuickBuy-' | append: card_key
  assign quick_buy_title_id = 'QuickBuyTitle-' | append: card_key
  assign quick_buy_product_id = 'QuickBuyProduct-' | append: card_key
  assign swatch_sold_out_id = 'SwatchSoldOut-' | append: card_key
  assign swatch_names = 'color,colour,coloris,farbe,material' | split: ','
  assign size_names = 'size,talla,taille,größe,taglia,tamaño' | split: ','
  assign srcset_widths = '320,480,640,800,960,1200' | split: ','
  assign swatch_limit = 4
  assign current_variant = card_product.selected_or_first_available_variant
  assign variant_total = card_product.variants_count | default: card_product.variants.size

  # Which option becomes swatches (the first color or material one) and which one the size
  # picker offers. picker_position ends at -1 when two options compete for the picker.
  assign swatch_position = 0
  assign picker_position = 0
  assign combined_listing = false
  unless card_product.has_only_default_variant
    for option in card_product.options_with_values
      assign option_name = option.name | downcase | strip
      assign option_has_swatch = false
      for value in option.values
        if value.swatch != blank
          assign option_has_swatch = true
        endif
        # Combined listing: the value belongs to another product. It navigates, never selects.
        if value.product_url != blank
          assign combined_listing = true
        endif
      endfor

      if swatch_position == 0
        if option_has_swatch or swatch_names contains option_name
          assign swatch_position = option.position
          continue
        endif
      endif

      if picker_position == 0
        assign picker_position = option.position
      else
        assign picker_position = -1
      endif
    endfor
  endunless

  assign swatch_index = swatch_position | minus: 1
  assign picker_index = picker_position | minus: 1
  if swatch_position > 0
    assign current_swatch_value = current_variant.options[swatch_index]
  endif

  assign quick_buy_mode = 'none'
  if show_quick_add
    if card_product.available == false
      assign quick_buy_mode = 'sold_out'
    elsif card_product.requires_selling_plan or card_product.selling_plan_groups.size > 0 or card_product.gift_card?
      assign quick_buy_mode = 'options'
    elsif combined_listing or variant_total > 250
      assign quick_buy_mode = 'options'
    elsif card_product.has_only_default_variant or variant_total == 1
      # LEAD-001: opciones con un solo valor (p. ej. una pieza 1-de-1 con Condicion y Talla)
      # siguen siendo una unica variante; pedir "Elegir opciones" era un paso vacio.
      assign quick_buy_mode = 'single'
    elsif card_product.options.size == 1 and swatch_position == 1
      assign quick_buy_mode = 'direct'
    elsif card_product.options.size <= 2 and picker_position > 0
      assign quick_buy_mode = 'picker'
    else
      assign quick_buy_mode = 'options'
    endif
  endif

  # More than 250 variants would serialize a truncated map, and a combined listing has no
  # variant state to share: both keep their swatches as plain links.
  assign card_needs_data = false
  assign swatches_interactive = false
  if combined_listing == false and variant_total <= 250
    if swatch_position > 0
      assign swatches_interactive = true
    endif
    if swatch_position > 0 or quick_buy_mode == 'picker' or quick_buy_mode == 'direct'
      assign card_needs_data = true
    endif
  endif
-%}

<article class="product-card" data-product-id="{{ card_product.id }}">
  <product-card-variants
    class="product-card__variants"
    data-product-url="{{ card_product.url }}"
    data-featured-media-id="{{ card_product.featured_media.id }}"
    data-quick-buy-mode="{{ quick_buy_mode }}"
    data-label-from="{{ 'products.product.price_from' | t }}"
    data-label-sale-price="{{ 'products.product.sale_price' | t }}"
    data-label-regular-price="{{ 'products.product.regular_price' | t }}"
  >
    <a
      class="product-card__media"
      href="{{ card_product.url }}"
      aria-label="{{ card_product.title | escape }}"
      data-card-link
    >
      {%- if card_image != blank -%}
        {% render 'responsive-image',
          image: card_image,
          sizes: card_sizes,
          image_class: 'product-card__image product-card__image--primary',
          eager: eager_image,
          alt: card_product.title
        %}

        {%- if show_secondary_image and secondary_image != blank -%}
          {% render 'responsive-image',
            image: secondary_image,
            sizes: card_sizes,
            image_class: 'product-card__image product-card__image--secondary',
            alt: secondary_image.alt
          %}
        {%- endif -%}
      {%- else -%}
        <span class="product-card__media-placeholder" aria-hidden="true"></span>
      {%- endif -%}
    </a>

    <div class="product-card__content">
      {%- if swatch_position > 0 -%}
        {%- liquid
          assign swatch_option = card_product.options_with_values[swatch_index]
          assign swatch_total = swatch_option.values.size
          assign swatch_selected_visible = false
          for value in swatch_option.values limit: 2
            if value.name == current_swatch_value
              assign swatch_selected_visible = true
            endif
          endfor
        -%}
        {%- comment -%}
          Four swatches fit a card of 260px or more; a narrow card (the two-column mobile grid)
          shows two. The pill always counts exactly what is hidden at that width.
        {%- endcomment -%}
        <div class="product-card__swatches">
          <div
            class="product-card__swatch-group"
            role="{% if swatches_interactive %}radiogroup{% else %}list{% endif %}"
            aria-label="{{ swatch_option.name | escape }}"
            {% if swatches_interactive %}
              data-card-swatches
            {% endif %}
          >
            {%- for value in swatch_option.values limit: swatch_limit -%}
              {%- liquid
                assign swatch_css = nil
                assign swatch_focal = nil
                if value.swatch.image
                  assign swatch_image_url = value.swatch.image | image_url: width: 72
                  assign swatch_css = 'url(' | append: swatch_image_url | append: ')'
                  assign swatch_focal = value.swatch.image.presentation.focal_point
                elsif value.swatch.color
                  assign swatch_css = 'rgb(' | append: value.swatch.color.rgb | append: ')'
                endif

                assign swatch_available = false
                for variant in card_product.variants
                  if variant.options[swatch_index] == value.name and variant.available
                    assign swatch_available = true
                    break
                  endif
                endfor
              -%}
              {%- capture swatch_face -%}
                {%- if swatch_css -%}
                  <span
                    class="card-swatch__color"
                    style="--variant-swatch: {{ swatch_css }};{% if swatch_focal %} --variant-swatch-position: {{ swatch_focal }};{% endif %}"
                    aria-hidden="true"
                  ></span>
                {%- else -%}
                  <span class="card-swatch__text" aria-hidden="true">{{ value.name | escape }}</span>
                {%- endif -%}
              {%- endcapture -%}

              {%- if swatches_interactive -%}
                {%- liquid
                  assign swatch_checked = false
                  if value.name == current_swatch_value
                    assign swatch_checked = true
                  elsif swatch_selected_visible == false and forloop.first
                    assign swatch_checked = 'focusable'
                  endif
                -%}
                <button
                  class="card-swatch{% unless swatch_css %} card-swatch--text{% endunless %}{% unless swatch_available %} card-swatch--sold-out{% endunless %}{% if forloop.index > 2 %} card-swatch--wide-only{% endif %}"
                  type="button"
                  role="radio"
                  aria-checked="{% if swatch_checked == true %}true{% else %}false{% endif %}"
                  tabindex="{% if swatch_checked %}0{% else %}-1{% endif %}"
                  aria-label="{{ 'products.product.color_swatch' | t: option: swatch_option.name, value: value.name }}"
                  {% unless swatch_available %}
                    aria-describedby="{{ swatch_sold_out_id }}"
                  {% endunless %}
                  data-card-swatch
                  data-swatch-value="{{ value.name | escape }}"
                >
                  {{- swatch_face -}}
                </button>
              {%- else -%}
                {%- liquid
                  assign swatch_href = card_product.url
                  if value.product_url != blank
                    assign swatch_href = value.product_url
                  elsif value.variant
                    assign swatch_href = value.variant.url
                  endif
                -%}
                <div class="product-card__swatch-item{% if forloop.index > 2 %} card-swatch--wide-only{% endif %}" role="listitem">
                  <a
                    class="card-swatch{% unless swatch_css %} card-swatch--text{% endunless %}{% unless swatch_available %} card-swatch--sold-out{% endunless %}"
                    href="{{ swatch_href }}"
                    aria-label="{{ 'products.product.color_swatch' | t: option: swatch_option.name, value: value.name }}"
                    {% unless swatch_available %}
                      aria-describedby="{{ swatch_sold_out_id }}"
                    {% endunless %}
                  >
                    {{- swatch_face -}}
                  </a>
                </div>
              {%- endif -%}
            {%- endfor -%}
          </div>

          {%- if swatch_total > 2 -%}
            {%- assign swatch_more_narrow = swatch_total | minus: 2 -%}
            <a
              class="card-swatch-more card-swatch-more--narrow"
              href="{{ card_product.url }}"
              aria-label="{{ 'products.product.more_swatches' | t: count: swatch_more_narrow }}"
              data-card-link
            >
              <span aria-hidden="true">+{{ swatch_more_narrow }}</span>
            </a>
          {%- endif -%}
          {%- if swatch_total > swatch_limit -%}
            {%- assign swatch_more_wide = swatch_total | minus: swatch_limit -%}
            <a
              class="card-swatch-more card-swatch-more--wide"
              href="{{ card_product.url }}"
              aria-label="{{ 'products.product.more_swatches' | t: count: swatch_more_wide }}"
              data-card-link
            >
              <span aria-hidden="true">+{{ swatch_more_wide }}</span>
            </a>
          {%- endif -%}
          <span class="visually-hidden" id="{{ swatch_sold_out_id }}">{{ 'products.product.sold_out' | t }}</span>
        </div>
      {%- endif -%}

      {%- if show_vendor and card_product.vendor != blank -%}
        <p class="product-card__vendor">{{ card_product.vendor | escape }}</p>
      {%- endif -%}

      <h3 class="product-card__title" id="{{ card_title_id }}">
        <a href="{{ card_product.url }}" data-card-link>{{ card_product.title | escape }}</a>
      </h3>

      {% render 'price', product: card_product, show_badges: true, show_unit_price: true %}

      {%- if show_quick_add -%}
        <div class="product-card__action">
          {%- case quick_buy_mode -%}
            {%- when 'single' or 'direct' -%}
              {%- form 'product', card_product,
                id: quick_add_id,
                class: 'product-card__form',
                data-cart-add-form: '',
                data-quick-buy-form: ''
              -%}
                <input type="hidden" name="id" value="{{ current_variant.id }}" data-quick-buy-id>
                <input type="hidden" name="quantity" value="1">
                <button
                  class="button button--full"
                  type="submit"
                  name="add"
                  aria-describedby="{{ card_title_id }}"
                  data-add-to-cart
                  {% if quick_buy_mode == 'direct' %}
                    data-quick-buy-direct
                    data-label-add="{{ 'products.product.add_to_cart' | t }}"
                    data-label-sold-out="{{ 'products.product.sold_out' | t }}"
                  {% endif %}
                  {% unless current_variant.available %}
                    disabled
                  {% endunless %}
                >
                  <span data-add-to-cart-text>
                    {%- if current_variant.available -%}
                      {{- 'products.product.add_to_cart' | t -}}
                    {%- else -%}
                      {{- 'products.product.sold_out' | t -}}
                    {%- endif -%}
                  </span>
                  <span class="button__spinner" data-loading-icon hidden>
                    {% render 'icon', name: 'spinner', size: 18 %}
                  </span>
                </button>
                <p class="form-message" role="alert" data-product-form-error hidden></p>
              {%- endform -%}

            {%- when 'picker' -%}
              {%- liquid
                assign picker_option = card_product.options_with_values[picker_index]
                assign picker_name = picker_option.name | downcase | strip
                if size_names contains picker_name
                  assign picker_label = 'products.product.select_size' | t
                else
                  assign picker_label = picker_option.name | escape
                endif
              -%}
              <button
                class="button button--full quick-buy__trigger"
                type="button"
                aria-expanded="false"
                aria-haspopup="dialog"
                aria-controls="{{ quick_buy_id }}"
                aria-describedby="{{ card_title_id }}"
                data-quick-buy-trigger
                data-label-quick-add="{{ 'products.product.quick_add' | t }}"
                data-label-sold-out="{{ 'products.product.sold_out' | t }}"
              >
                {{- 'products.product.quick_add' | t -}}
              </button>
              <a class="button button--secondary button--full quick-buy__fallback" href="{{ card_product.url }}">
                {{- 'products.product.choose_options' | t -}}
              </a>

              <dialog
                class="quick-buy__panel"
                id="{{ quick_buy_id }}"
                aria-labelledby="{{ quick_buy_title_id }}"
                aria-describedby="{{ quick_buy_product_id }}"
                data-quick-buy-panel
                data-label-sold-out="{{ 'products.product.sold_out' | t }}"
                data-label-unavailable="{{ 'products.product.option_unavailable' | t }}"
              >
                <div class="quick-buy__header">
                  <p class="quick-buy__title" id="{{ quick_buy_title_id }}">{{ picker_label }}</p>
                  <button
                    class="icon-button quick-buy__close"
                    type="button"
                    aria-label="{{ 'general.accessibility.close' | t }}"
                    data-quick-buy-close
                  >
                    {% render 'icon', name: 'close', size: 18 %}
                  </button>
                </div>
                <p class="quick-buy__product" id="{{ quick_buy_product_id }}">{{ card_product.title | escape }}</p>

                {%- form 'product', card_product,
                  id: quick_add_id,
                  class: 'quick-buy__form',
                  data-cart-add-form: '',
                  data-quick-buy-form: ''
                -%}
                  <input type="hidden" name="id" value="{{ current_variant.id }}" data-quick-buy-id>
                  <input type="hidden" name="quantity" value="1">
                  <div class="quick-buy__values" role="group" aria-labelledby="{{ quick_buy_title_id }}">
                    {%- for value in picker_option.values -%}
                      {%- liquid
                        assign picker_variant = nil
                        for variant in card_product.variants
                          if variant.options[picker_index] == value.name
                            if swatch_position == 0 or variant.options[swatch_index] == current_swatch_value
                              assign picker_variant = variant
                              break
                            endif
                          endif
                        endfor

                        assign picker_available = false
                        if picker_variant and picker_variant.available
                          assign picker_available = true
                        endif
                      -%}
                      <button
                        class="quick-buy__value"
                        type="submit"
                        name="add"
                        data-option-value="{{ value.name | escape }}"
                        data-variant-id="{% if picker_variant %}{{ picker_variant.id }}{% endif %}"
                        {% unless picker_available %}
                          disabled aria-disabled="true"
                        {% endunless %}
                      >
                        <span class="quick-buy__value-label">{{ value.name | escape }}</span>
                        <span class="quick-buy__value-price" data-quick-buy-price hidden></span>
                        <span class="visually-hidden" data-quick-buy-state{% if picker_available %} hidden{% endif %}>
                          {%- if picker_variant -%}
                            {{- 'products.product.sold_out' | t -}}
                          {%- else -%}
                            {{- 'products.product.option_unavailable' | t -}}
                          {%- endif -%}
                        </span>
                        <span class="button__spinner" data-loading-icon hidden>
                          {% render 'icon', name: 'spinner', size: 16 %}
                        </span>
                      </button>
                    {%- endfor -%}
                  </div>
                  <p class="form-message" role="alert" data-product-form-error hidden></p>
                {%- endform -%}
              </dialog>

            {%- when 'options' -%}
              <a class="button button--secondary button--full" href="{{ card_product.url }}" data-card-link>
                {{- 'products.product.choose_options' | t -}}
              </a>

            {%- when 'sold_out' -%}
              <button class="button button--full" type="button" disabled>
                {{- 'products.product.sold_out' | t -}}
              </button>
          {%- endcase -%}
        </div>
      {%- endif -%}
    </div>

    {%- if card_needs_data -%}
      <script type="application/json" data-card-variants>
        {
          "swatchIndex": {{ swatch_index }},
          "pickerIndex": {% if picker_position > 0 %}{{ picker_index }}{% else %}-1{% endif %},
          "variants": [
            {%- for variant in card_product.variants -%}
              {%- liquid
                assign variant_compare = nil
                if variant.compare_at_price > variant.price
                  assign variant_compare = variant.compare_at_price | money
                endif
                assign variant_unit = nil
                assign variant_unit_reference = nil
                if variant.unit_price_measurement
                  assign variant_unit = variant.unit_price | money
                  assign variant_unit_reference = variant.unit_price_measurement.reference_unit
                  if variant.unit_price_measurement.reference_value != 1
                    assign variant_unit_reference = variant.unit_price_measurement.reference_value | append: variant_unit_reference
                  endif
                endif
              -%}
              {"id": {{ variant.id }}, "available": {{ variant.available }}, "options": {{ variant.options | json | replace: '<', '\u003c' }}, "media": {% if variant.featured_media %}{{ variant.featured_media.id }}{% else %}null{% endif %}, "cents": {{ variant.price }}, "price": {{ variant.price | money | json }}, "compare": {% if variant_compare %}{{ variant_compare | json }}{% else %}null{% endif %}, "unit": {% if variant_unit %}{{ variant_unit | json }}{% else %}null{% endif %}, "unitReference": {% if variant_unit_reference %}{{ variant_unit_reference | json }}{% else %}null{% endif %}}
              {%- unless forloop.last %},{% endunless -%}
            {%- endfor -%}
          ],
          "media": {
            {%- assign media_seen = ',' -%}
            {%- for variant in card_product.variants -%}
              {%- if variant.featured_media -%}
                {%- assign media_key = ',' | append: variant.featured_media.id | append: ',' -%}
                {%- unless media_seen contains media_key -%}
                  {%- unless media_seen == ',' %},{% endunless -%}
                  {%- liquid
                    assign media_seen = media_seen | append: variant.featured_media.id | append: ','
                    assign variant_image = variant.featured_media.preview_image
                  -%}
                  {%- capture variant_srcset -%}
                    {%- for width in srcset_widths -%}
                      {%- assign width_number = width | plus: 0 -%}
                      {%- if width_number <= variant_image.width -%}
                        {{- variant_image | image_url: width: width_number }} {{ width_number }}w,
                      {%- endif -%}
                    {%- endfor -%}
                  {%- endcapture -%}
                  "{{ variant.featured_media.id }}": {"src": {{ variant_image | image_url: width: 800 | json }}, "srcset": {{ variant_srcset | remove_last: ',' | json }}, "alt": {{ variant.featured_media.alt | json | replace: '<', '\u003c' }}}
                {%- endunless -%}
              {%- endif -%}
            {%- endfor -%}
          }
        }
      </script>
    {%- endif -%}
  </product-card-variants>
</article>
```

---

### <a id="snippets-mega-menu-liquid"></a> snippets/mega-menu.liquid

> **Descripcion:** Mega menu navegacional de lujo
> **Ruta:** `snippets/mega-menu.liquid` | **Lineas:** 210 | **Tamano:** 9.32 KB

```liquid
{%- comment -%}
  5C-001. Desplegable de un enlace de primer nivel del menu de escritorio. Lo pinta
  sections/header.liquid para cada enlace con hijos; aqui vive la decision entre el panel
  clasico y el mega menu, para que la cabecera no crezca en complejidad.

  Mega menu cuando el enlace tiene un bloque mega_menu_promo asociado o tres niveles:
  - una columna por enlace de segundo nivel, encabezada por el propio enlace, con sus
    enlaces de tercer nivel debajo;
  - a la derecha, hasta dos tarjetas del bloque (imagen 4:5 diferida, titulo, subtitulo).
  Si no, el panel clasico de siempre, con el mismo marcado que antes de 5C (sin tercer
  nivel, que ahora siempre abre el mega menu).

  El bloque se asocia por nombre, sin distinguir mayusculas ni acentos: vale el titulo que
  ve el comprador ("Catalogo" en /es) o el handle del enlace, que no cambia de idioma
  ("catalog"). Si dos bloques nombran el mismo enlace, gana el primero.

  Sin JS nuevo: <theme-disclosure> ya abre y cierra, sincroniza aria-expanded, cierra con
  Escape devolviendo el foco al disparador y con un clic fuera. Tab recorre el panel en el
  orden del DOM y sale de el sin trampa.

  Accepts:
  - link: enlace de primer nivel con hijos (link.links != blank)
  - section: la seccion header (id y bloques)
  - index: forloop.index del enlace, para los ids
  - color_scheme_id: esquema de color de la cabecera
{%- endcomment -%}
{%- liquid
  assign promo = nil
  assign link_title = link.title | downcase | strip
  assign link_handle = link.title | handleize
  for block in section.blocks
    if block.type == 'mega_menu_promo' and promo == nil
      assign wanted = block.settings.menu_item | downcase | strip
      assign wanted_handle = block.settings.menu_item | handleize
      if wanted != blank
        if wanted == link_title or wanted_handle == link_handle or wanted_handle == link.handle
          assign promo = block
        endif
      endif
    endif
  endfor

  assign has_third_level = false
  for child_link in link.links
    if child_link.links != blank
      assign has_third_level = true
    endif
  endfor

  assign is_mega = false
  if promo != nil or has_third_level
    assign is_mega = true
  endif
  assign panel_id = 'DesktopMenu-' | append: section.id | append: '-' | append: index
-%}

<theme-disclosure class="desktop-nav__disclosure{% if is_mega %} desktop-nav__disclosure--mega{% endif %}" data-disclosure-arrows>
  <button
    class="desktop-nav__toggle"
    type="button"
    aria-expanded="false"
    aria-controls="{{ panel_id }}"
    data-disclosure-trigger
  >
    <span>{{ link.title | escape }}</span>
    {% render 'icon', name: 'chevron-down', size: 14 %}
  </button>
  {%- if is_mega -%}
    <div
      id="{{ panel_id }}"
      class="desktop-nav__panel desktop-nav__mega-menu color-{{ color_scheme_id }}"
      data-disclosure-panel
      hidden
    >
      <div class="container mega-menu__grid">
        <div class="mega-menu__columns">
          <a class="mega-menu__view-all" href="{{ link.url }}">
            {{- 'general.navigation.view_all' | t: title: link.title -}}
          </a>
          <ul class="mega-menu__column-list unstyled-list" role="list">
            {%- for child_link in link.links -%}
              <li class="mega-menu__column">
                <a class="mega-menu__column-title" href="{{ child_link.url }}">{{ child_link.title | escape }}</a>
                {%- if child_link.links != blank -%}
                  <ul class="mega-menu__sublist unstyled-list" role="list">
                    {%- for grandchild_link in child_link.links -%}
                      <li><a href="{{ grandchild_link.url }}">{{ grandchild_link.title | escape }}</a></li>
                    {%- endfor -%}
                  </ul>
                {%- endif -%}
              </li>
            {%- endfor -%}
          </ul>
        </div>

        {%- if promo != nil -%}
          {%- capture promo_cards -%}
            {%- for n in (1..2) -%}
              {%- liquid
                assign image_key = 'image_' | append: n
                assign heading_key = 'heading_' | append: n
                assign subheading_key = 'subheading_' | append: n
                assign link_key = 'link_' | append: n
                assign card_image = promo.settings[image_key]
                assign card_heading = promo.settings[heading_key]
                assign card_subheading = promo.settings[subheading_key]
                assign card_link = promo.settings[link_key]

                # P1: Localizar URL de tarjeta para preservar el locale en /es/ y mercados
                assign localized_card_link = card_link
                if card_link == '/collections/all'
                  assign localized_card_link = routes.all_products_collection_url
                elsif card_link == '/'
                  assign localized_card_link = routes.root_url
                elsif card_link != blank
                  assign first_char = card_link | slice: 0, 1
                  assign second_char = card_link | slice: 1, 1
                  if first_char == '/' and second_char != '/'
                    assign locale_root = routes.root_url
                    if locale_root != '/' and locale_root != blank
                      assign locale_prefix_check = locale_root | append: '/'
                      assign starts_with_prefix = card_link | slice: 0, locale_prefix_check.size
                      if starts_with_prefix != locale_prefix_check and card_link != locale_root
                        assign localized_card_link = locale_root | append: card_link
                      endif
                    endif
                  endif
                endif

                # Con titulo, la foto acompana al texto del enlace y su alt iria repetido: va
                # vacio. Sin titulo, la foto es el nombre del enlace: su alt o el del menu.
                assign card_alt = ''
                if card_heading == blank
                  assign card_alt = card_image.alt | default: link.title
                endif

                # 5C-002. La caja es 4:5 y la foto la cubre: una apaisada se pinta mas ancha que la
                # tarjeta (1376 x 768 ocupa 2,24 veces sus 15rem). sizes declara ese ancho pintado
                # para que el navegador no elija una copia pequena y la estire.
                assign card_rem = 15
                if card_image.aspect_ratio > 0.8
                  assign card_rem = card_image.aspect_ratio | times: 18.75 | round: 2
                endif
                assign card_sizes = '(min-width: 62rem) ' | append: card_rem | append: 'rem, 100vw'
              -%}
              {%- if card_image != blank or card_heading != blank -%}
                {%- capture card_inner -%}
                  {%- if card_image != blank -%}
                    <span class="mega-menu__promo-media">
                      {{-
                        card_image
                        | image_url: width: 1100
                        | image_tag:
                          class: 'mega-menu__promo-image',
                          loading: 'lazy',
                          widths: '240, 320, 400, 560, 800, 1100',
                          sizes: card_sizes,
                          alt: card_alt
                      -}}
                    </span>
                  {%- endif -%}
                  {%- if card_heading != blank -%}
                    <span class="mega-menu__promo-heading">{{ card_heading | escape }}</span>
                  {%- endif -%}
                  {%- if card_subheading != blank -%}
                    <span class="mega-menu__promo-subheading">{{ card_subheading | escape }}</span>
                  {%- endif -%}
                {%- endcapture -%}
                <li class="mega-menu__promo">
                  {%- if localized_card_link != blank -%}
                    <a class="mega-menu__promo-card{% if card_image == blank %} mega-menu__promo-card--editorial-text{% endif %}" href="{{ localized_card_link | escape }}">{{ card_inner }}</a>
                  {%- else -%}
                    <div class="mega-menu__promo-card{% if card_image == blank %} mega-menu__promo-card--editorial-text{% endif %}">{{ card_inner }}</div>
                  {%- endif -%}
                </li>
              {%- endif -%}
            {%- endfor -%}
          {%- endcapture -%}
          {%- if promo_cards != blank -%}
            <ul
              class="mega-menu__promos unstyled-list"
              role="list"
              aria-label="{{ 'sections.header.mega_menu.featured' | t | escape_once }}"
              {{ promo.shopify_attributes }}
            >
              {{- promo_cards -}}
            </ul>
          {%- endif -%}
        {%- endif -%}
      </div>
    </div>
  {%- else -%}
    <div
      id="{{ panel_id }}"
      class="desktop-nav__panel color-{{ color_scheme_id }}"
      data-disclosure-panel
      hidden
    >
      <ul class="desktop-nav__submenu unstyled-list" role="list">
        <li>
          <a href="{{ link.url }}">{{ 'general.navigation.view_all' | t: title: link.title }}</a>
        </li>
        {%- for child_link in link.links -%}
          <li><a href="{{ child_link.url }}">{{ child_link.title | escape }}</a></li>
        {%- endfor -%}
      </ul>
    </div>
  {%- endif -%}
</theme-disclosure>
```

---

### <a id="listings-sartorial-templates-index-json"></a> listings/sartorial/templates/index.json

> **Descripcion:** Preset 1: Sartorial (Editorial de sastreria y lujo)
> **Ruta:** `listings/sartorial/templates/index.json` | **Lineas:** 149 | **Tamano:** 7.49 KB

```json
{
  "sections": {
    "hero": {
      "type": "hero-editorial",
      "settings": {
        "layout_mode": "split",
        "split_ratio": "65_35",
        "layout_split": "image_first",
        "height_desktop": 85,
        "height_mobile": 70,
        "media_type": "image",
        "image_desktop": "",
        "overlay_style": "gradient_content",
        "overlay_opacity": 40,
        "content_position_x": "start",
        "content_position_y": "end",
        "text_alignment": "left",
        "content_width": 42,
        "heading_tag": "h1",
        "eyebrow": "HAUTE COUTURE / ATELIER SARTORIAL",
        "heading": "The Master Tailor's Cut",
        "subheading": "<p>Sculptural bespoke architecture, hand-finished canvassing, and pure silk faille cut in limited editions.</p>",
        "button_primary_label": "Discover the collection",
        "button_primary_url": "/collections/all",
        "button_secondary_label": "Explore runway lookbook",
        "button_secondary_url": "/collections/tailoring",
        "color_scheme": "scheme-2"
      }
    },
    "marquee": {
      "type": "marquee",
      "blocks": {
        "silk": { "type": "item", "settings": { "text": "PURE MULBERRY SILK & BIELLESE WOOL" } },
        "canvas": { "type": "item", "settings": { "text": "FULL FLOATING HORSEHAIR CANVAS" } },
        "lapel": { "type": "item", "settings": { "text": "HAND-ROLLED LAPELS & PICK-STITCHING" } },
        "editions": { "type": "item", "settings": { "text": "INDIVIDUALLY NUMBERED ATELIER EDITIONS" } }
      },
      "block_order": ["silk", "canvas", "lapel", "editions"],
      "settings": {
        "speed": 36,
        "color_scheme": "scheme-2"
      }
    },
    "collections": {
      "type": "curated-showcase",
      "blocks": {
        "new": { "type": "collection_tab", "settings": { "collection": "new-forms", "tab_label": "New forms" } },
        "permanent": { "type": "collection_tab", "settings": { "collection": "permanent-collection", "tab_label": "Permanent collection" } },
        "tailoring": { "type": "collection_tab", "settings": { "collection": "tailoring", "tab_label": "Tailoring salon" } }
      },
      "block_order": ["new", "permanent", "tailoring"],
      "settings": {
        "eyebrow": "ATELIER EDITIONS / 02",
        "heading": "Selected Haute Couture Silhouettes",
        "show_secondary_image": true,
        "show_vendor": false,
        "color_scheme": "scheme-1"
      }
    },
    "lookbook": {
      "type": "lookbook",
      "blocks": {
        "marker1": { "type": "hotspot", "settings": { "product": "nove-blazer", "horizontal_position": 26, "vertical_position": 34, "horizontal_position_mobile": 28, "vertical_position_mobile": 30, "popover_position": "right" } },
        "marker2": { "type": "hotspot", "settings": { "product": "pleated-wide-trouser", "horizontal_position": 48, "vertical_position": 66, "horizontal_position_mobile": 46, "vertical_position_mobile": 64, "popover_position": "top" } },
        "marker3": { "type": "hotspot", "settings": { "product": "silk-charmeuse-blouse", "horizontal_position": 69, "vertical_position": 38, "horizontal_position_mobile": 68, "vertical_position_mobile": 42, "popover_position": "left" } },
        "marker4": { "type": "hotspot", "settings": { "product": "cashmere-scarf", "horizontal_position": 82, "vertical_position": 72, "horizontal_position_mobile": 78, "vertical_position_mobile": 74, "popover_position": "left" } }
      },
      "block_order": ["marker1", "marker2", "marker3", "marker4"],
      "settings": {
        "eyebrow": "RUNWAY PRESENTATION / SALON 01",
        "heading": "Silhouettes in Haute Couture Motion",
        "description": "<p>Observe the architectural drape, proportion and movement from the runway presentation.</p>",
        "caption": "Haute couture silhouettes photographed in natural salon light.",
        "image_desktop": "",
        "color_scheme": "scheme-1"
      }
    },
    "featured_product": {
      "type": "featured-product",
      "blocks": {
        "title": { "type": "title" },
        "price": { "type": "price" },
        "variant_picker": { "type": "variant_picker" },
        "quantity": { "type": "quantity_selector" },
        "buy_buttons": { "type": "buy_buttons", "settings": { "show_dynamic_checkout": true } },
        "description": { "type": "description" },
        "inventory": { "type": "inventory_status", "settings": { "threshold": 5, "show_count": true } },
        "shipping": { "type": "shipping_lead_time", "settings": { "delivery_text": "Bespoke courier & private salon fitting | Dispatched within 2 business days", "icon": "truck" } }
      },
      "block_order": ["title", "price", "variant_picker", "quantity", "buy_buttons", "inventory", "shipping", "description"],
      "settings": {
        "product": "serra-coat",
        "color_scheme": "scheme-3",
        "secondary_background": false,
        "padding_top": 64,
        "padding_bottom": 64
      }
    },
    "capsule": {
      "type": "complete-the-look",
      "blocks": {
        "piece1": { "type": "bundle_product", "settings": { "product": "nove-blazer" } },
        "piece2": { "type": "bundle_product", "settings": { "product": "silk-charmeuse-blouse" } },
        "piece3": { "type": "bundle_product", "settings": { "product": "pleated-wide-trouser" } }
      },
      "block_order": ["piece1", "piece2", "piece3"],
      "settings": {
        "eyebrow": "SALON ENSEMBLE / LOOK 03",
        "heading": "Complete the Haute Couture Ensemble",
        "description": "<p>Select the full tailored composition: the double-breasted jacket, the silk blouse, and the pleated trouser.</p>",
        "caption": "Bespoke tailoring composition photographed in salon light.",
        "image_desktop": "",
        "color_scheme": "scheme-1"
      }
    },
    "manifesto": {
      "type": "brand-manifesto",
      "blocks": {
        "material": { "type": "detail", "settings": { "label": "Fabrics", "value": "Super 160s Tasmanian Wool & Silk Faille" } },
        "craft": { "type": "detail", "settings": { "label": "Structure", "value": "Hand-stitched full floating horsehair canvas" } },
        "origin": { "type": "detail", "settings": { "label": "Provenance", "value": "Milanese Sartoria & Biella Weavers" } },
        "production": { "type": "detail", "settings": { "label": "Cadence", "value": "Limited series of 20 bespoke executions" } }
      },
      "block_order": ["material", "craft", "origin", "production"],
      "settings": {
        "eyebrow": "THE MASTER TAILOR'S MANIFESTO / 03",
        "quote": "True bespoke luxury lives in the invisible mastery of the cut.",
        "body": "<p>Every lapel is rolled by hand, every horsehair canvas floating freely. We reject industrial shortcuts in pursuit of permanent elegance.</p>",
        "button_label": "Explore tailoring",
        "button_url": "/collections/tailoring",
        "media_label": "ATELIER ARCHIVE / STUDY 07",
        "image": "",
        "use_surface_background": true,
        "color_scheme": "scheme-3"
      }
    },
    "newsletter": {
      "type": "newsletter",
      "settings": {
        "color_scheme": "scheme-3",
        "eyebrow": "PRIVATE SALON CORRESPONDENCE",
        "heading": "The Master Tailor's Gazette",
        "text": "<p>Private salon invitations, fabric allocation releases, and bespoke commission openings.</p>"
      }
    }
  },
  "order": ["hero", "marquee", "collections", "lookbook", "featured_product", "capsule", "manifesto", "newsletter"]
}
```

---

### <a id="listings-imprint-templates-index-json"></a> listings/imprint/templates/index.json

> **Descripcion:** Preset 2: Imprint (Diseno grafico, posters y tipografia)
> **Ruta:** `listings/imprint/templates/index.json` | **Lineas:** 186 | **Tamano:** 7.78 KB

```json
{
  "sections": {
    "hero": {
      "type": "hero-editorial",
      "settings": {
        "layout_mode": "split",
        "split_ratio": "50_50",
        "layout_split": "image_first",
        "height_desktop": 80,
        "height_mobile": 65,
        "media_type": "image",
        "image_desktop": "",
        "overlay_style": "none",
        "overlay_opacity": 0,
        "content_position_x": "start",
        "content_position_y": "end",
        "text_alignment": "left",
        "content_width": 38,
        "heading_tag": "h1",
        "eyebrow": "TECHNICAL STUDIO / SPECIFICATION 01",
        "heading": "Engineered utility, precise discipline",
        "subheading": "<p>Modular gear, aerospace hardware, and weatherproof membrane systems calibrated for daily EDC telemetry.</p>",
        "button_primary_label": "Inspect system inventory",
        "button_primary_url": "/collections/daily-objects",
        "button_secondary_label": "View technical specs",
        "button_secondary_url": "/collections/desk-and-study",
        "color_scheme": "scheme-1"
      }
    },
    "marquee": {
      "type": "marquee",
      "blocks": {
        "cordura": { "type": "item", "settings": { "text": "500D CORDURA® BALLISTIC NYLON" } },
        "ykk": { "type": "item", "settings": { "text": "YKK® AQUAGUARD® WEATHERPROOF CLOSURES" } },
        "hardware": { "type": "item", "settings": { "text": "MIL-SPEC ANODIZED HARDWARE / GRADE 5 TITANIUM" } },
        "molle": { "type": "item", "settings": { "text": "LASER-CUT MOLLE COMPATIBLE TELEMETRY" } }
      },
      "block_order": ["cordura", "ykk", "hardware", "molle"],
      "settings": {
        "speed": 40,
        "color_scheme": "scheme-2"
      }
    },
    "discovery": {
      "type": "bento-discovery",
      "blocks": {
        "collection": {
          "type": "card_featured",
          "settings": {
            "collection": "desk-and-study",
            "eyebrow": "[01] MEMBRANE TELEMETRY",
            "heading": "Aerospace grade EDC systems",
            "link": "/collections/desk-and-study",
            "image": ""
          }
        },
        "product1": {
          "type": "card_product",
          "settings": {
            "product": "leather-desk-mat"
          }
        },
        "product2": {
          "type": "card_product",
          "settings": {
            "product": "milled-brass-paperweight"
          }
        },
        "story": {
          "type": "card_editorial",
          "settings": {
            "link_label": "Inspect blueprint",
            "link": "/collections/leather-goods",
            "eyebrow": "[04] BLUEPRINT ANALYSIS",
            "heading": "Calibrated for extreme endurance",
            "body": "<p>Stress-tested 500D CORDURA nylon, weatherproof YKK AquaGuard closures, and laser-machined anodized hardware.</p>",
            "image": ""
          }
        }
      },
      "block_order": ["collection", "product1", "product2", "story"],
      "settings": {
        "eyebrow": "GRID STUDY / 02",
        "heading": "Collection, product, process",
        "subheading": "<p>A denser view of the working collection.</p>",
        "color_scheme": "scheme-3"
      }
    },
    "collections": {
      "type": "curated-showcase",
      "blocks": {
        "daily": { "type": "collection_tab", "settings": { "collection": "daily-objects", "tab_label": "Daily objects" } },
        "workspace": { "type": "collection_tab", "settings": { "collection": "desk-and-study", "tab_label": "Workspace" } },
        "limited": { "type": "collection_tab", "settings": { "collection": "leather-goods", "tab_label": "Limited studies" } }
      },
      "block_order": ["daily", "workspace", "limited"],
      "settings": {
        "eyebrow": "SYSTEM INVENTORY / 03",
        "heading": "Studio Modular Systems",
        "show_secondary_image": false,
        "show_vendor": false,
        "color_scheme": "scheme-1"
      }
    },
    "featured_product": {
      "type": "featured-product",
      "blocks": {
        "title": { "type": "title" },
        "price": { "type": "price" },
        "variant_picker": { "type": "variant_picker" },
        "quantity": { "type": "quantity_selector" },
        "buy_buttons": { "type": "buy_buttons", "settings": { "show_dynamic_checkout": true } },
        "technical_specs": {
          "type": "technical_specs",
          "settings": {
            "heading": "Technical specifications",
            "material": "500D Ballistic CORDURA® & Ripstop",
            "gsm": "480 GSM Loopback",
            "hardware": "Matte Black YKK® AquaGuard®",
            "origin": "Engineered in Milan Tech Studio"
          }
        },
        "description": { "type": "description" },
        "inventory": { "type": "inventory_status", "settings": { "threshold": 5, "show_count": true } },
        "shipping": { "type": "shipping_lead_time", "settings": { "delivery_text": "Worldwide express courier | Dispatch in 2 business days", "icon": "truck" } }
      },
      "block_order": ["title", "price", "variant_picker", "quantity", "buy_buttons", "technical_specs", "inventory", "shipping", "description"],
      "settings": {
        "product": "structured-tote",
        "color_scheme": "scheme-1",
        "secondary_background": true,
        "padding_top": 64,
        "padding_bottom": 64
      }
    },
    "capsule": {
      "type": "complete-the-look",
      "blocks": {
        "piece1": { "type": "bundle_product", "settings": { "product": "leather-document-folio" } },
        "piece2": { "type": "bundle_product", "settings": { "product": "four-slot-cardholder" } },
        "piece3": { "type": "bundle_product", "settings": { "product": "folded-valet-tray" } }
      },
      "block_order": ["piece1", "piece2", "piece3"],
      "settings": {
        "eyebrow": "EDC MODULAR CAPSULE / 05",
        "heading": "The Complete Utility Rig",
        "description": "<p>A modular rig for daily carry, field telemetry and technical desk deployment.</p>",
        "caption": "A modular arrangement for daily work.",
        "image_desktop": "",
        "color_scheme": "scheme-1"
      }
    },
    "manifesto": {
      "type": "brand-manifesto",
      "blocks": {
        "spec1": { "type": "detail", "settings": { "label": "Membrane", "value": "3-Layer DWR laminated waterproof shell" } },
        "spec2": { "type": "detail", "settings": { "label": "Hardware", "value": "CNC-machined anodized 6061 aluminium & titanium" } },
        "spec3": { "type": "detail", "settings": { "label": "Tolerance", "value": "0.2mm laser cut edge bonding with bar-tack reinforcement" } },
        "spec4": { "type": "detail", "settings": { "label": "Field Test", "value": "Certified IPX-6 water resistance rating" } }
      },
      "block_order": ["spec1", "spec2", "spec3", "spec4"],
      "settings": {
        "eyebrow": "STUDIO PRINCIPLES / 06",
        "quote": "Form follows engineering tolerance.",
        "body": "<p>No decorative ornamentation. Every seam, bar-tack, and zipper is stress-tested to military technical thresholds.</p>",
        "button_label": "Inspect collection",
        "button_url": "/collections/daily-objects",
        "media_label": "TECHNICAL REPORT / 01",
        "image": "",
        "use_surface_background": false,
        "color_scheme": "scheme-3"
      }
    },
    "newsletter": {
      "type": "newsletter",
      "settings": {
        "color_scheme": "scheme-4",
        "eyebrow": "TECHNICAL DISPATCH",
        "heading": "Engineering telemetry & field updates",
        "text": "<p>Specification releases, telemetry logs, and component testing documentation.</p>"
      }
    }
  },
  "order": ["hero", "marquee", "discovery", "collections", "featured_product", "capsule", "manifesto", "newsletter"]
}
```

---

### <a id="listings-archive-templates-index-json"></a> listings/archive/templates/index.json

> **Descripcion:** Preset 3: Archive (Objetos de coleccion y archivo vintage)
> **Ruta:** `listings/archive/templates/index.json` | **Lineas:** 142 | **Tamano:** 7.13 KB

```json
{
  "sections": {
    "hero": {
      "type": "hero-editorial",
      "settings": {
        "layout_mode": "cinematic",
        "split_ratio": "60_40",
        "layout_split": "image_first",
        "height_desktop": 85,
        "height_mobile": 75,
        "media_type": "image",
        "image_desktop": "",
        "enable_video_mobile": false,
        "overlay_style": "scrim",
        "overlay_opacity": 70,
        "content_position_x": "center",
        "content_position_y": "center",
        "text_alignment": "center",
        "content_width": 46,
        "heading_tag": "h1",
        "eyebrow": "CATALOGUE I / THE HOUSE",
        "heading": "Objects with a remembered life",
        "subheading": "<p>A museum vault accession shaped by runway provenance, hand conservation, and historical time.</p>",
        "button_primary_label": "Enter the catalogue",
        "button_primary_url": "/collections/permanent-archive",
        "button_secondary_label": "Restored selection",
        "button_secondary_url": "/collections/restored-pieces",
        "color_scheme": "scheme-2"
      }
    },
    "manifesto": {
      "type": "brand-manifesto",
      "blocks": {
        "grade1": { "type": "detail", "settings": { "label": "Grade I / Mint", "value": "Unworn museum archive accession, original tags intact" } },
        "grade2": { "type": "detail", "settings": { "label": "Grade II / Near Mint", "value": "Runway exhibition only, microscopic surface patina" } },
        "grade3": { "type": "detail", "settings": { "label": "Grade III / Excellent", "value": "Stabilized by master conservator, zero structural flaws" } },
        "grade4": { "type": "detail", "settings": { "label": "Grade IV-V / Authentic", "value": "Historic patina, numbered museum registration certificate" } }
      },
      "block_order": ["grade1", "grade2", "grade3", "grade4"],
      "settings": {
        "eyebrow": "CURATORIAL PROTOCOL / CONSERVATION 02",
        "quote": "What endures carries the indelible record of its creation.",
        "body": "<p>Every archive specimen is examined under raking light, stabilized in our conservation laboratory, and assigned one of the five rigorous archival grades (Grade 1 Mint to Grade 5 Character).</p>",
        "button_label": "Read curatorial notes",
        "button_url": "/collections/permanent-archive",
        "media_label": "PLATE II / CONSERVATION LAB",
        "image": "",
        "use_surface_background": true,
        "color_scheme": "scheme-3"
      }
    },
    "marquee": {
      "type": "marquee",
      "blocks": {
        "circa": { "type": "item", "settings": { "text": "CIRCA 1989–1999 THE PERMANENT ARCHIVE" } },
        "conservation": { "type": "item", "settings": { "text": "MUSEUM GRADE DEACIDIFIED CONSERVATION" } },
        "accession": { "type": "item", "settings": { "text": "CERTIFIED 1-OF-1 ACCESSION REGISTRATION" } },
        "provenance": { "type": "item", "settings": { "text": "PARIS & ANTWERP HISTORICAL RUNWAY PROVENANCE" } }
      },
      "block_order": ["circa", "conservation", "accession", "provenance"],
      "settings": {
        "speed": 44,
        "color_scheme": "scheme-4"
      }
    },
    "collections": {
      "type": "curated-showcase",
      "blocks": {
        "decade80": { "type": "collection_tab", "settings": { "collection": "permanent-archive", "tab_label": "1980s Deconstruction" } },
        "decade90": { "type": "collection_tab", "settings": { "collection": "restored-pieces", "tab_label": "1990s Minimalist Vault" } },
        "decade00": { "type": "collection_tab", "settings": { "collection": "permanent-archive", "tab_label": "2000s Master Tailoring" } }
      },
      "block_order": ["decade80", "decade90", "decade00"],
      "settings": {
        "eyebrow": "INDEX III / THE VAULT BY DECADES",
        "heading": "Historical Archive Entries",
        "show_secondary_image": false,
        "show_vendor": true,
        "color_scheme": "scheme-1"
      }
    },
    "lookbook": {
      "type": "lookbook",
      "blocks": {
        "marker1": { "type": "hotspot", "settings": { "product": "1994-cashmere-cocoon-coat", "horizontal_position": 24, "vertical_position": 42, "horizontal_position_mobile": 26, "vertical_position_mobile": 40, "popover_position": "right" } },
        "marker2": { "type": "hotspot", "settings": { "product": "1999-technical-cotton-trench", "horizontal_position": 46, "vertical_position": 62, "horizontal_position_mobile": 48, "vertical_position_mobile": 60, "popover_position": "top" } },
        "marker3": { "type": "hotspot", "settings": { "product": "1998-bias-cut-silk-slip", "horizontal_position": 78, "vertical_position": 50, "horizontal_position_mobile": 76, "vertical_position_mobile": 48, "popover_position": "left" } }
      },
      "block_order": ["marker1", "marker2", "marker3"],
      "settings": {
        "eyebrow": "PLATE V / CONSERVATION STUDY",
        "heading": "Three objects from the archive record",
        "description": "<p>Each piece is examined under raking light, stabilized by our conservationist, and released in small curated entries.</p>",
        "caption": "Garment study room photographed under raking light.",
        "image_desktop": "",
        "color_scheme": "scheme-1"
      }
    },
    "featured_product": {
      "type": "featured-product",
      "blocks": {
        "title": { "type": "title" },
        "price": { "type": "price" },
        "variant_picker": { "type": "variant_picker" },
        "quantity": { "type": "quantity_selector" },
        "buy_buttons": { "type": "buy_buttons", "settings": { "show_dynamic_checkout": true } },
        "provenance": {
          "type": "provenance",
          "settings": {
            "heading": "Archival provenance",
            "circa_year": "1992",
            "show_unique_piece": true,
            "condition_grade": "grade_1",
            "provenance_notes": "<p>Accession record no. 1992-048. Acquired from private Antwerp runway archive. Museum-grade deacidified preservation.</p>"
          }
        },
        "description": { "type": "description" },
        "inventory": { "type": "inventory_status", "settings": { "threshold": 2, "show_count": true } },
        "shipping": { "type": "shipping_lead_time", "settings": { "delivery_text": "Climate-controlled archival transport | Insured courier", "icon": "truck" } }
      },
      "block_order": ["title", "price", "variant_picker", "quantity", "buy_buttons", "provenance", "inventory", "shipping", "description"],
      "settings": {
        "product": "1990-pinstripe-double-breasted-jacket",
        "color_scheme": "scheme-3",
        "secondary_background": false,
        "padding_top": 64,
        "padding_bottom": 64
      }
    },
    "newsletter": {
      "type": "newsletter",
      "settings": {
        "color_scheme": "scheme-4",
        "eyebrow": "ARCHIVAL GAZETTE",
        "heading": "New vault accession notices",
        "text": "<p>Occasional notices of restored objects, new records and workshop visits.</p>"
      }
    }
  },
  "order": ["hero", "manifesto", "marquee", "collections", "lookbook", "featured_product", "newsletter"]
}
```

---

