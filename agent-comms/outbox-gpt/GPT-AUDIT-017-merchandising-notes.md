# GPT-AUDIT-017 — Revalidación post remediación: tallas, cápsula y límite 1 de Archive

ID: GPT-AUDIT-017-MERCHANDISING  
Estado: **PARCIAL**. La demo Atelier ya ofrece tallas y copy inglés; persisten ausencia de guía y galería profunda. **NO APTO para cerrar el caso de pieza única de Archive**: el campo permite 2 cuando anuncia stock 1.  
Decisión requerida: Gemini debe mantener abierto el defecto de cantidad de Archive y asignar corrección a Claude; Johandry/Gemini deben decidir si exigir guía de tallas y más fotografía antes de submission.  
Resumen en 5 líneas:
1. Barrido nuevo de 24/24 PDP Atelier: **87 opciones** en total, descripciones en inglés, opciones coherentes con las prendas.
2. Nove 34–42 y pantalones Pleated/Cigarette 34–42; Nove 38 se agregó al drawer con talla y $1,150 correctos.
3. Cápsula móvil seleccionó Nove 38, blusa 40 y trouser 42; agregó las tres variantes exactas por $2,250 de incremento.
4. Aún hay una sola foto por PDP y ninguna guía de tallas visible en las 24.
5. Archive permite teclear cantidad 2 y muestra `$3,000.00` mientras dice `Low stock: 1 left`, probado en escritorio y 390 px.

Archivos tocados: solo este informe; no se editó tema, código ni `BOARD.md`.  
Desviaciones (Nivel 1 o Nivel 2): ninguna.  
Hallazgos extra fuera de alcance (con parche listo): Archive aún reutiliza `nove-blazer-01.jpg` para su pieza de 1990; no se preparó parche por tratarse de catálogo/activos.  
Verificación (comando, resultado y qué demuestra/qué no): instantáneas DOM y capturas de Chrome en tiendas reales; matriz y pasos literales abajo. `git status --short` antes de escribir mostró cambios ajenos (`.gitignore`, `.playwright-mcp/`, harness de Claude); no se tocaron. No se hizo compra.  
Lista de afirmaciones falsables numeradas: R1–R8.

## Contexto y método

- Fecha de revisión: 2026-09-30, tras la remediación indicada en `agent-comms/BOARD.md`. Se abrió pestaña nueva de Chrome para [Atelier](https://sartorial-atelier.myshopify.com/) y otra para [Archive](https://sartorial-archive.myshopify.com/). No se reutilizaron pestañas del usuario.
- Se visitó [catálogo completo de Atelier](https://sartorial-atelier.myshopify.com/collections/all), se extrajeron los 24 handles enlazados en tarjetas y se abrió cada PDP. Para cada una se leyó `.product-main__description`, lista de `.variant-picker__input`, precio visible, cantidad de figuras de galería y presencia de texto visible `size guide` en `main`.
- Escritorio: `window.innerWidth=1536`, `documentElement.clientWidth=1521` en Nove. Móvil simulado: override `390 × 844`; `innerWidth=390`, `clientWidth=375` (scrollbar vertical 15 px), `scrollWidth=375` tras estabilizar la carga en Nove, Pleated Trouser y Archive. Hubo un valor transitorio `scrollWidth=390` inmediatamente después de navegar a Trouser, que bajó a 375 al terminar el render; no se registró como overflow persistente.
- Las acciones de carrito se limitaron a variantes de prueba. La sesión Chrome comparte carrito con otros agentes: antes de la prueba de cápsula apareció un Nove talla 34/$1,150 ajeno a esta prueba. Se dejó intacto. Esta concurrencia **no es un defecto del tema**.

## Afirmaciones falsables y evidencia

| ID | Resultado observado | Cómo refutar / riesgo |
|---|---|---|
| R1 | **24/24 descripciones de producto están en inglés**. Ejemplos: [Nove](https://sartorial-atelier.myshopify.com/products/nove-blazer) comienza `The signature tailoring cut of the house...`; [Pleated Wide Trouser](https://sartorial-atelier.myshopify.com/products/pleated-wide-trouser) comienza `Two inverted pleats...`; [Oversized Alpaca Knit](https://sartorial-atelier.myshopify.com/products/oversized-alpaca-knit) menciona `Size 1 and Size 2` y presenta esas dos opciones. | Reabrir las 24 PDP y comparar `.product-main__description`. Corrige el hallazgo de español de GPT-AUDIT-016. No prueba traducción de todas las páginas ni toggle de idioma. |
| R2 | **87 valores de opción en 24 productos.** Nove: 34/36/38/40/42; Pleated Wide y Cigarette Trouser: 34/36/38/40/42; blouse: 34/36/38/40/42. | Repetir inventario de `.variant-picker__input` por URL. Corrige la ausencia de tallas de GPT-AUDIT-016. |
| R3 | En desktop de Nove, clic en chip **38** cambió radiogroup `Size: 34`→`Size: 38`, URL a `?variant=67663229518048`, mantuvo $1,150 y estado `In stock, ready to ship`. `Add to cart` produjo `Item added to your cart. Nove Blazer - 38`, línea `Size: 38`, subtotal $1,150. Se retiró y se confirmó drawer vacío antes de la prueba siguiente. | Seleccionar otro chip y comprobar URL/valor/línea. El precio constante entre tallas es coherente con los datos actuales; no verifica reacción ante una variante con precio diferente. |
| R4 | En [home Atelier](https://sartorial-atelier.myshopify.com/) móvil, cápsula `Complete the look` ahora muestra un select por cada pieza. Se eligieron Nove **38**, Silk Charmeuse Blouse **40** y Pleated Wide Trouser **42**; total de composición **$2,250** ($1,150+$520+$580). `Add 3 pieces` agregó esas tres líneas exactas al drawer. | Seleccionar esas tallas y repetir. Drawer mostró subtotal $3,400 porque ya había un Nove 34 ajeno/$1,150. El incremento fue $2,250. Se retiraron solo nuestras tres líneas y quedó Nove 34/$1,150. |
| R5 | Móvil 390 px de [Nove](https://sartorial-atelier.myshopify.com/products/nove-blazer) y [Pleated Wide Trouser](https://sartorial-atelier.myshopify.com/products/pleated-wide-trouser) conserva chips, precio y CTA sin overflow persistente. | Reprobar a `innerWidth=390` y medir `documentElement.scrollWidth`. Capturas visuales se observaron en navegador; no se midieron otros dispositivos. |
| R6 | **24/24 PDP siguen con una sola figura de galería y sin guía de tallas visible** (`size guide` no aparece en `main.innerText`). En prendas de $520–$1,890, el cliente puede elegir talla, pero no consultar equivalencias/medidas desde la ficha. | Abrir cada PDP; medir figuras de `[aria-label="Product media gallery"]` y buscar un enlace o texto visible de guía. Es déficit del contenido/configuración demo; no prueba incapacidad del tema. |
| R7 | En desktop y a 390 px, [1990 Pinstripe Double-Breasted Jacket](https://sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket) muestra `$1,500.00`, `Low stock: 1 left` y descripción `Single historical piece, 1 of 1`. Pulsar `+` desde 1 no subió inicialmente la cantidad; **teclear 2 en spinbutton y salir del campo** sí dejó cantidad 2, mostró `Total for 2 $3,000.00` y mantuvo CTA activo. Captura móvil mostró los tres estados simultáneamente. Se restauró a 1 y el `+` quedó deshabilitado. | Repetir entrada directa de 2 y Tab en desktop/móvil. No se intentó añadir 2 al carrito por tratarse de unidad única y carrito compartido. El control de servidor podría recortar la adición, pero no corrige la expectativa errónea de la PDP. |
| R8 | La PDP Archive de 1990 usa `cdn/shop/files/nove-blazer-01.jpg` mientras la PDP contemporánea de Nove en Atelier usa archivo con el mismo nombre y muestra visualmente el mismo blazer. | Comparar `currentSrc` de ambas galerías. La coincidencia de filename y la inspección visual sugieren reutilización; no se efectuó análisis de hash de imagen ni auditoría de derechos. |

## Matriz compacta de variantes Atelier

| Familias observadas | Productos / opciones |
|---|---|
| Tallas numéricas 34–42, subconjuntos 34–40/36–42/36–40 | Nove Blazer 5, Pleated Wide Trouser 5, Cigarette Trouser 5, Silk Charmeuse Blouse 5, Poplin Column Shirt 5, Striped Cotton Shirt 5, Bias-Cut Slip Dress 4, Cropped Tailored Jacket 3, Doppio Trench 4, Pleated Midi Skirt 3, Serra Coat 4, Wool Waistcoat 4, Wrap Wool Skirt 4. |
| Tallas alfabéticas | Cashmere Rib Crew 5, Cocoon Cardigan-Coat 3, Column Knit Dress 4, Fine Merino Turtleneck 4, Hand-Framed Cotton Polo 4, Quilted Silk Liner 3. |
| Medidas especiales | Oversized Alpaca Knit `Size 1 / Size 2`; Leather Belt `75 cm / 85 cm / 95 cm`; Cashmere Scarf `One Size`; Structured Tote `One Size`; Silk Twill Square `90 x 90 cm`. |

Los precios actuales muestreados son Nove $1,150, Pleated Wide $580, Cigarette $520 y blouse $520. El barrido mostró cambios de tarifa respecto a GPT-AUDIT-016 en otros productos: Bias-Cut Slip Dress $780→$680, Structured Tote $940→$680, Wrap Wool Skirt $440→$540. No se determinó si esos cambios fueron deliberados.

## Dictamen de este frente

**Atelier: mejora sustancial y verificable en merchandising.** Tallas, copy inglés y cápsula responden a la promesa de compra. La ausencia de guía de tallas en todas las fichas y las galerías de una sola foto limitan aún la confianza en moda premium. **Archive: cantidad 2 con stock 1 continúa siendo un defecto de PDP reproducible; no debe marcarse resuelto.** No se cierra ninguna fila del ledger mediante este informe.
