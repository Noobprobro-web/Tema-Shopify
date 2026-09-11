# Shopify Theme Store Checklist

Checklist inicial basado en los requisitos y buenas practicas publicas de Shopify. Debe revisarse contra la documentacion oficial antes de cada hito importante.

## Producto

- Tema original y diferenciado.
- No es copia ni modificacion superficial de Dawn, Horizon u otro tema.
- Orientado a un merchant target claro.
- Incluye presets utiles y coherentes.
- Experiencia mobile-first.

## Arquitectura

- Estructura Liquid/JSON compatible con Online Store 2.0.
- Secciones configurables y bloques claros.
- Settings entendibles para merchants.
- Snippets reutilizables sin sobreabstraccion.
- Sin dependencia de apps externas para funcionalidades core.

## Performance

- JavaScript minimo y diferido cuando aplique.
- CSS contenido y organizado.
- Imagenes con `width`, `height`, `srcset`/`image_url` segun corresponda.
- Lazy loading en imagenes no criticas.
- No cargar scripts externos innecesarios.
- Evitar layout shifts.

## Accesibilidad

- Contraste suficiente.
- Foco visible.
- Navegacion por teclado.
- Semantica HTML correcta.
- Labels en formularios.
- Estados de error y exito claros.
- Soporte para reduced motion cuando haya animaciones.

## SEO y datos estructurados

- Titulos y metadatos correctos.
- Structured data para producto cuando corresponda.
- Headings jerarquicos.
- Canonicals y URLs correctas mediante objetos Shopify.

## QA

- `shopify theme check` sin errores relevantes.
- Pruebas mobile, tablet y desktop.
- Pruebas en navegadores principales.
- Lighthouse/Core Web Vitals.
- Accesibilidad con axe o equivalente.
- Estados vacios, productos agotados, variantes, descuentos, busqueda sin resultados.

