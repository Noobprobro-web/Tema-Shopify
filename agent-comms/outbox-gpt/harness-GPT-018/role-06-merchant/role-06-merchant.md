ID: GPT-018-ROLE-06
Estado: Pasada independiente completada; auditoría estática y GET público, sin instalación real ni envío de formulario.
Decisión requerida: Claude reconciliar source/ZIP definitivo; Johandry revisar onboarding y guía pública.
Resumen en 5 líneas:
1. Docs y soporte GitHub Pages responden 200 sin contraseña.
2. El formulario público usa Formspree POST y estados accesibles; entrega del ticket no probada.
3. El source local conserva URLs antiguas de tienda; diff listo hacia páginas públicas comprobadas.
4. La portada inicial contiene destinos particulares y afirmaciones comerciales que una tienda vacía no aporta.
5. La guía se contradice sobre dependencias y no explica suficientemente la transición de demo a catálogo propio.
Archivos tocados: sólo role-06-merchant/, incluyendo HTML públicos, informe y public-support-urls.diff.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada al tema.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): GET 200 y git apply --check exit 0; no render de tienda nueva, editor Shopify ni ticket enviado.
Lista de afirmaciones falsables numeradas: M1–M5.

Fecha: 2026-10-01, America/Caracas. Snapshot source HEAD 60599ab, detached. Contexto y RULES leídos. ZIP no localizado: `Get-ChildItem -File *.zip` y `rg --files -g '*.zip'` → salida vacía. Por tanto la instalación mental se basa en source, no certifica contenido de un ZIP remoto o más reciente. No se alteran ni cierran filas del ledger.

## M1 — Acceso público y soporte: mejora confirmada

GET sin cookies a [portada](https://noobprobro-web.github.io/sartorial-docs/), [docs](https://noobprobro-web.github.io/sartorial-docs/docs.html), [soporte](https://noobprobro-web.github.io/sartorial-docs/support.html): `Invoke-WebRequest` → `STATUS 200`, `docs STATUS 200`, `support STATUS 200`. HTML conservado en public-index/docs/support.html. El primer intento restringido falló por socket; lectura autorizada elevada funcionó. No interpretar el fallo de herramienta como caída del sitio.

Soporte: `public-support.html:188` contiene `action="https://formspree.io/f/xyezvvjo" method="POST"`; líneas 194–225 campos requeridos, categoría y status ARIA; 290–297 fetch y comprobación response.ok. El mailto en footer es alternativa, no transporte principal. Refuta el hallazgo histórico de formulario exclusivamente mailto. El éxito real y recepción por soporte quedan no verificados: no se envió nada. Enlaces recíprocos relativos docs.html/support.html corresponden a las dos rutas 200.

## M2 — P2 source: enlaces de ayuda no apuntan a los públicos actuales

Clase: código/config del tema. Dueño: Claude.

`rg -n 'theme_documentation|theme_support' config/settings_schema.json` → líneas 7–8 apuntan a `https://sartorial-atelier.myshopify.com/pages/theme-documentation` y `/pages/theme-support`. No se comprobó de nuevo su acceso remoto: podría existir redirección válida o el ZIP final estar corregido. Hallazgo confirmado sólo como discrepancia source/destino indicado por el usuario, no nuevo P0 runtime.

Parche `public-support-urls.diff` cambia únicamente estas dos URL a las rutas GitHub Pages 200. `git apply --check .../public-support-urls.diff` → exit 0, salida vacía; no aplicado. Antes de integrar, Claude cotejar el source definitivo y no duplicar cambios propios. Consulta de [requisitos Shopify](https://shopify.dev/docs/storefronts/themes/store/requirements): no encontré requisito de dominio propio que prohíba este host; comprobar además la aceptación final del listing. El hosting GitHub Pages no se declara defecto.

## M3 — P2 onboarding: destinos específicos en tienda vacía

Clase: contenido inicial/config de tema. Dueño: Claude para defaults bajo autorización; Johandry para experiencia de instalación.

`rg -n 'the-autumn-series|pages/about|traceable|"product"' templates/index.json` → URL colección :26/:165, About :151/:175, producto oversized-alpaca-knit :181, bundle doppio-trench :250/cashmere-rib-crew :256/wrap-wool-skirt :262 y afirmación `100% traceable natural fibres` :114. En una tienda vacía estos recursos no se crean por importar JSON. `hero-editorial.liquid:53,182` comprueba que URL/label no estén vacíos y renderiza href; no comprueba que exista la colección. Riesgo inferido: CTA de instalación conduce a destino inexistente y claims de material pasan a marca nueva sin respaldo. No se simula una captura ni se afirma fallo runtime probado.

Refutación: Shopify/editor podría normalizar referencias de objetos; Liquid usa placeholders defensivos (`hero-editorial:135–136`, `brand-manifesto:56–57`, `complete-the-look:14,141`). Por ello las referencias no prueban imágenes rotas ni excepción. Destinos string y copy sí están literales.

Acción exacta propuesta: en copia instalable, elegir rutas neutrales existentes `/collections/all` o dejar CTA secundario sin destino hasta configurar; sustituir promesas de trazabilidad por contenido inicial claramente editable; probar instalación real de cada preset. No se entrega diff de defaults porque cambia contrato/narrativa y necesita decisión de producto, no una sustitución mecánica. Comprobar vacío, 1, muchos, largo y faltante antes de aceptación.

## M4 — P2 contenido público: contradicción de dependencias

`public-docs.html:221` afirma GSAP/ScrollTrigger incluidos en Full; `:227` afirma `no third-party code dependencies`. Son afirmaciones incompatibles en la misma página, independientemente de que el source local no incluya GSAP. Refutación: se podría querer decir sin framework de aplicación obligatorio; el texto actual no contiene esa precisión.

Corrección exacta editorial recomendada (hosting docs, no tema): sustituir la segunda frase por `Sartorial includes editorial sections built with native web components. Full motion optionally loads GSAP and ScrollTrigger; None and Subtle do not load these libraries.` Verificar primero que el bundle publicado coincida. No preservar el conteo 33 sin inventario del bundle final. Esta entrega no altera el repo externo de docs.

## M5 — P2 contenido: guía de reconstrucción insuficiente; ayuda local positiva

La guía pública (public-docs.html:180–212) enseña upload y selector de estilo; no advierte ahí que seleccionar estilo no importa productos, fotografías o menús. La sección de cart enumera funciones, no una secuencia para configurar tarifas/regalos (public-docs.html:250–256). Búsqueda `rg -n 'images|demo|shipping|discount|inventory|collection' public-docs.html` encuentra descripciones de funciones pero no procedimiento demo→tienda vacía. Refutación: ayuda contextual del editor compensa parcialmente; no afirmar que toda la ayuda es inexistente.

Prueba positiva: `sections/cart-drawer.liquid:537–545` resuelve labels e info `t:`. `locales/en.default.schema.json:795` explica moneda y tarifa externa de envío; :799 exige descuento automático; :814 explica primera variante disponible del upsell. `:837` recomienda resolución de zoom. No duplicar hallazgo de missing info para estos settings.

Contenido que Johandry debe añadir: checklist por preset (subir imágenes propias, elegir colecciones/productos, configurar menús, políticas y hotspots); explicar ausencia de fotos/catálogo importado; enlazar configuración de shipping y automatic discounts; advertir duplicar tema antes de cambios de preset; tabla de correspondencia sección→recurso. Validar estas instrucciones en editor actual: la ruta del selector de preset no fue probada y no se etiqueta como errónea.

## Criterio de cierre

Docs públicas: acceso confirmado; recepción formulario pendiente por decisión del usuario de no enviar. Instalación: no verificada porque ZIP ausente e instalación prohibida dentro de este rol. No P0 nuevo confirmado aquí. Candidatos para revisor: M2 discrepancia source, M3 defaults específicos, M4 contradicción literal, M5 brecha editorial. No compras, demos, admin ni cambios de código ejecutados.
