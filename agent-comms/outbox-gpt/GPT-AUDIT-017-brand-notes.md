# GPT-AUDIT-017 — Marca, navegación y benchmarks tras remediación

ID: GPT-AUDIT-017-BRAND  
Estado: Revisión visual y de navegación en vivo, 2026-09-30 19:23–19:26 UTC.  
Decisión requerida: Gemini debe resolver los destinos editoriales y el menú informativo antes de declarar cerrado el frente comercial.  
Resumen en 5 líneas:
1. Las tres portadas siguen distinguiéndose: Atelier sastrería, Edition objetos y Archive curaduría histórica.
2. La portada actual de Atelier ya muestra variantes de talla en Serra Coat y en las tres piezas de la cápsula.
3. Edition enlaza desde `Objects for the desk` a una colección que renderiza 404.
4. Archive promete citas privadas en Kyoto y París, mientras su contacto indica showroom en Milán.
5. Contour, Maison y Annex presentan acceso directo a subcolecciones y About us; Sartorial conserva Home/Catalog/Contact y footer casi vacío.
Archivos tocados: solo este documento.  
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación.  
Hallazgos extra fuera de alcance (con parche listo): ninguno; la configuración de navegación y el contenido requieren decisión de Gemini/propietario.  
Verificación (comando, resultado y qué demuestra/qué no): Chrome conectado, DOM y captura visible de seis portadas; clic real de enlace Edition y lectura de contacto Archive. Es una inspección puntual, no Lighthouse, análisis de todos los enlaces ni prueba de derechos de imagen.  
Lista de afirmaciones falsables numeradas: B1–B5.

## B1. Identidad de las tres demos

- [Atelier](https://sartorial-atelier.myshopify.com/) abre con fotografía de campaña de prendas, serif editorial y el titular `Form in quiet movement`. En la portada actual, Serra Coat muestra `Size` 36/38/40/42; la cápsula ofrece 34/36/38/40/42 para Nove Blazer, Silk Charmeuse Blouse y Pleated Wide Trouser. La cápsula indica $2,250 por tres piezas. La portada aún enlaza `Explore lookbook` a `/collections/permanent-collection`, no a la sección de lookbook.
- [Edition](https://sartorial-edition.myshopify.com/) abre con bodegón de bolsos, útiles de escritorio y el titular `Useful forms, precisely considered`; composición dividida y tipografía sans. La retícula `Collection, product, process` hace distinguible su enfoque comercial.
- [Archive](https://sartorial-archive.myshopify.com/) abre con maniquí y prenda oscura, titular `Objects with a remembered life`, tipografía grande y lenguaje de registro. La cápsula no aparece en la portada observada. La página evoca museo y restauración.

Son juicios de percepción basados en lo renderizado. No acreditan autenticidad de producto, procedencia ni derecho de uso de las imágenes.

## B2. Enlace Edition todavía roto

En la portada actual de Edition, la tarjeta `Explore Objects for the desk` tiene destino `/collections/desk-and-study`. Un clic real abrió [esa URL](https://sartorial-edition.myshopify.com/collections/desk-and-study), cuyo `main` mostró `404` y `Object not found.`. Repetir el clic desde la portada falsaría el hallazgo si se crea la colección o cambia el enlace. La página 404 ofrece retorno al catálogo y piezas populares, pero se pierde la intención específica de compra.

## B3. Relato geográfico Archive

La banda editorial de la [portada Archive](https://sartorial-archive.myshopify.com/) dice `PRIVATE APPOINTMENTS IN KYOTO & PARIS`. [Contacto Archive](https://sartorial-archive.myshopify.com/pages/contact) dice `Showroom: By appointment / Milan`. La FAQ de contacto también menciona trabajo `Made-to-order`, terminología que conviene revisar para un inventario de piezas históricas 1 de 1. El número de placa `ACCESSION 1957.34.1` aparece en la portada sin explicación junto a una colección fechada 1989–1999; no se afirma que sea falso, pero necesita contexto editorial verificable.

## B4. Navegación informativa

En las tres portadas Sartorial inspeccionadas, el header mostró Home, Catalog y Contact. El footer mostró Search y Your Privacy Choices; no expuso About, las colecciones nominales, documentación de envíos ni devoluciones. En Chrome también apareció una barra de vista previa de Shopify con selector de país. Esa barra es del Admin/preview y no demuestra que el comprador vea un selector de país o moneda.

## B5. Contraste con benchmarks

| Demo visitada | Señal de marca observada | Rutas visibles en navegación | Lectura comercial |
|---|---|---|---|
| [Contour](https://contour-ho5kbo9x.myshopify.com/) | Hogar editorial, producto por ambientes | Living, New season, Studio objects, About us, Contact | Descubrimiento y confianza más directos que en Atelier. |
| [Maison](https://maison-10oym9w0.myshopify.com/) | Cerámica de taller, proceso y utilidad | Serving & Tea, Tableware, Vases & Vessels, About us, Contact | Taxonomía clara y contexto de oficio frente a Edition. |
| [Annex](https://annex-r0zzjfjf.myshopify.com/) | Arte y ediciones, hero y relato de escasez | Limited Editions, Originals, Photography, About us, Contact | La clasificación da más orientación que Archive. |

La comparación se limita a las portadas y menús observados; estos benchmarks también pueden tener defectos propios. No se infiere una puntuación cuantitativa ni el resultado de una revisión oficial.
