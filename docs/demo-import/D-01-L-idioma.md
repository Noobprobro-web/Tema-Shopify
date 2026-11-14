# D-01-L: idioma y tallas de las demos

Plan: `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:303` (LV-25). En `tema-qkqpke0j`, la PDP de `bias-cut-slip-dress` tiene la descripción en español («Seda cortada al sesgo…»), mientras que la interfaz y el `lang` están en inglés. Además, no muestra selector de talla. En la tienda sartorial-atelier el mismo producto tiene tallas 34 a 40, texto en inglés y otro precio. El criterio pide interfaz y contenido coherentes para el mercado definido, y tallas con datos reales. Prohíbe inventar medidas o traducirlas para cerrar el ítem. Johandry valida el idioma y los datos.

## Directiva

Se propone un mercado único en **inglés** para las tres demos. Es el idioma por defecto del tema (`locales/en.default.json`) y el de todo el contenido de los CSV de D-01. El español queda como idioma secundario opcional: solo se publica si se traduce todo el contenido. Las cifras de las descripciones (centímetros, micras, porcentajes) se copian tal cual de la fuente. No se añaden medidas ni tablas de tallas: la guía de tallas es D-02-T.

## Entregable

- Descripciones de Sartorial en inglés en `docs/demo-import/sartorial-products.csv`. Parten de la traducción de `CLAUDE-DEMO-001` §Dos, sin cambiar ninguna cifra; después C-08 retiró las afirmaciones sin respaldo (ver `D-01-catalogo-y-fotos.md`), sin añadir datos. Incluye el vestido: «Silk cut on the bias in four panels, with adjustable straps and a low back…».
- Selector de talla en todos los productos de ropa de Sartorial (opción `Size`). Son valores propuestos, pendientes de confirmar:

| Escala | Productos | Valores en el CSV | Fuente | Estado |
|---|---|---|---|---|
| alpha | Abrigos, chaquetas, punto, camisas, vestidos (incl. `bias-cut-slip-dress`) | XS, S, M, L, XL | CLAUDE-DEMO-001 («XS a XL salvo donde se indica») | Pendiente de Johandry: en sartorial-atelier el vestido usa 34-40 |
| waist | Pantalones y faldas | 24, 26, 28, 30, 32, 34 | CLAUDE-DEMO-001 («24 a 34») | Pendiente: ¿solo pares o todas? |
| belt | Leather Belt | 70, 75, 80, 85 | CLAUDE-DEMO-001 | Pendiente de confirmar |
| two | Oversized Alpaca Knit | 1, 2 | CLAUDE-DEMO-001 («una y dos») | Pendiente de confirmar |

- En Archive, la talla de etiqueta (FR/US) de cada pieza única está **pendiente de verificación por Johandry**; no es un dato confirmado. Los valores de GPT-REPORT-014 se guardan en `data/archive.json` como `label_size_proposed` y no se imprimen: el CSV ya no dice «Label size». No es una opción de variante. Cuando Johandry confirme la talla de una pieza, el campo pasa a `label_size` en esa pieza, se ejecuta `build` y la descripción vuelve a llevar «Single piece. Label size: …».

## Pasos (Johandry)

1. Decide el mercado de cada demo: inglés único (propuesto) o inglés con español.
2. Configuración > Idiomas: el idioma por defecto es inglés. Si el español está publicado y no se va a traducir todo, despublícalo. Esto también afecta a P2-1 de C-08 (traducciones `/es`, tu decisión).
3. Si el español se mantiene, traduce productos, colecciones, páginas y menús con Translate & Adapt. El tema ya trae `locales/es.json` para la interfaz.
4. Fija la escala de tallas real de cada producto de la tabla. Si cambia, edita `size_scales` o el campo `sizes` de `docs/demo-import/data/sartorial.json`, ejecuta `node scripts/demo-import.mjs build` y luego `check`, o pídemelo. Después importa el CSV (paso 2 de `D-01-catalogo-y-fotos.md`).
5. Comprueba la PDP de `bias-cut-slip-dress`: `html lang="en"`, la descripción en inglés, el selector de talla con los valores aprobados y más de una foto (V-07: frente, espalda, lateral y detalle, en `sartorial-photos.csv`).

## Pendiente de Johandry

- Mercado e idioma de cada demo.
- Escala de tallas real de cada producto de Sartorial.
- Talla de etiqueta de cada pieza de Archive, verificada en la etiqueta física (hoy diez piezas con valor propuesto y dos sin talla). Hasta entonces no se publica.
- Medidas para la guía de tallas: es D-02-T, fuera de este entregable.
