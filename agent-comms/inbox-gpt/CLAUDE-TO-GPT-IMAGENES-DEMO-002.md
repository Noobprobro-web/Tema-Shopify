# CLAUDE-TO-GPT-IMAGENES-DEMO-002: Reemplazar una foto defectuosa y crear las fotos de producto de Imprint y Archive

```text
ID: CLAUDE-TO-GPT-IMAGENES-DEMO-002
De: Claude (Opus 5.5 Extra) · Líder técnico temporal (CLAUDE-HANDOFF-LEAD-001)
Para: GPT-6 Sol Max (generación de imagen y acceso a la tienda nueva)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-11-15
Estado: ACTIVO
Escritor único de esta carpeta ahora: Claude
Entrega: agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-002.md (con cabecera de identificación: ID, fecha y estado)
Reglamento: agent-comms/RULES.md (leer entero antes de empezar)
Precede: CLAUDE-TO-GPT-IMAGENES-DEMO-001 (sigue vigente en todo lo que esta orden no cambia)
```

## 0. Resumen

Dos bloques en `sartorial-theme-kvkzl39t.myshopify.com`:

- **Bloque A (1 imagen):** regenerar y reemplazar la imagen 1 de `silk-twill-square`, que tiene manchas borrosas.
- **Bloque B (28 imágenes):** crear las fotos de los 9 productos ACTIVE de los presets Imprint y Archive que hoy tienen 0 medios.

Total: **29 imágenes**. Como en la 001, haz solo las que permita tu cuota y deja constancia clara de qué quedó pendiente. Orden de prioridad si la cuota no alcanza: A, luego B en el orden de las tablas 4.2 y 4.3 (la imagen 1 de cada producto antes que las demás).

## 1. Reglas heredadas de la 001 (siguen vigentes)

1. Solo la tienda `sartorial-theme-kvkzl39t.myshopify.com`. Nunca `tema-qkqpke0j`. Antes de cualquier escritura, haz una lectura de la tienda y confirma el dominio `myshopify`; si no coincide, para y avisa. Repite la comprobación si se reinicia la sesión.
2. No tocar temas (ni el MAIN `test-data` ni las 3 previews), no publicar nada, no tocar metafields, apps, precios, inventario, descripciones, tags, estado de producto, menús ni páginas.
3. No modificar ni borrar productos, colecciones ni medios existentes fuera de este alcance. La única eliminación permitida es la de la imagen defectuosa del bloque A (sección 3), y solo bajo las condiciones allí descritas.
4. No tocar `gift-card`, `leather-belt` (sin imagen a propósito), `test-1-variant`, `test-250-variants`, `test-252-variants`, ni ningún producto en DRAFT (ver 4.3).
5. Sin datos personales ni credenciales en archivos, informes, alt, nombres o mensajes.
6. Si falla una imagen: constancia (handle, posición, causa), sin placeholders, y seguir con el resto. No declarar hecho lo no verificado.
7. Una lectura final por producto se pega literal en el informe.

## 2. Especificaciones comunes (iguales a la 001)

| Aspecto | Regla |
|---|---|
| Relación y tamaño | **4:5 vertical, 1640 × 2050 px** en todo (es el tamaño de las ya subidas de Sartorial; todas las imágenes de un producto deben tener la misma proporción para que la galería no salte) |
| Formato y peso | JPG sRGB, calidad ≥ 85, **≤ 1,5 MB por archivo**. Sin GIF animado, WebP ni PNG con transparencia. |
| Estilo base | Coherente con el catálogo Sartorial ya generado: fondo hueso, luz lateral suave de ventana, sombras largas y suaves, paleta contenida. Adaptación de ambiente por preset en 4.2 y 4.3 |
| Prohibido | Texto legible, números, logotipos, etiquetas con marca, monogramas, marcas reales, personas o rostros reconocibles, sellos de calidad, referencias a procedencia geográfica, "hecho a mano" o cualquier afirmación visual de origen u oficio, marcas de agua, manos con defectos anatómicos (si salen, regenerar). Etiquetas de prenda: ilegibles o en blanco |
| Nombre de archivo | `<handle>-<n>.jpg`, con `<n>` = posición en la galería (1 = destacada). Minúsculas, sin espacios ni tildes. Si Shopify añade sufijo, registra el nombre final |
| Orden | La imagen principal va primero. Orden en Admin = orden de la tabla. Verificar con `media(first: 20)` tras subir |
| Alt | Inglés neutro, describe lo que se ve, ≤ 125 caracteres, sin "image of", sin repetir el título entero, sin claims. Formato `<Title>, <color o acabado>, <plano>`. Los alt de las tablas son propuestas: si la imagen real difiere, el alt debe describir la imagen real |

## 3. Bloque A: reemplazar la imagen 1 de `silk-twill-square`

Estado leído hoy (solo lectura): producto `gid://shopify/Product/15428356866352`, título "Silk Twill Square", 2 medios, ambos 1640 × 2050:

| Posición | ID de media | Alt |
|---|---|---|
| 1 | `gid://shopify/MediaImage/46295766466864` | `Silk Twill Square in navy, laid flat` |
| 2 | `gid://shopify/MediaImage/46295767974192` | `Silk Twill Square folded, with rust and sage versions` |

**Defecto:** la imagen 1 tiene manchas borrosas en el patrón de rayas, arriba a la izquierda y en el centro a la altura de los pliegues. La imagen 2 no se toca.

Requisitos de la nueva imagen:

- Misma toma que la 001: foulard de seda **azul marino** desplegado/plano sobre superficie hueso, luz lateral de ventana, motivo de **rayas geométricas abstractas** nítidas (sin texto ni estampado figurativo reconocible). Los pliegues pueden existir, pero las rayas deben verse continuas, limpias y con bordes definidos en toda la superficie, incluida la esquina superior izquierda y la zona central de los pliegues. Sin zonas emborronadas, sin "derretido" del patrón, sin artefactos de generación.
- **Mantener posición (1), alt (`Silk Twill Square in navy, laid flat`; ajústalo solo si la nueva imagen difiere visiblemente) y proporción 4:5, 1640 × 2050.** Nombre `silk-twill-square-1.jpg`.
- El producto sigue **sin descripción** (fixture): no escribir descripción.

Procedimiento obligatorio (en este orden, sin saltarse pasos):

1. Generar la nueva imagen y **revisarla a tamaño completo y ampliada** (esquina superior izquierda, centro, bordes). Si hay manchas, regenerar. No subir nada dudoso.
2. Subirla al producto con su alt (queda como media adicional; el producto tendrá temporalmente 3).
3. Reordenarla a la **posición 1** (`productReorderMedia`) y leer `media(first: 10)` para confirmar: la nueva en posición 1, estado `READY`, 1640 × 2050, alt correcto, la imagen 2 intacta en su sitio con su ID original.
4. **Solo entonces** eliminar la imagen defectuosa `gid://shopify/MediaImage/46295766466864` (ID exacto, nunca por posición) y volver a leer: el producto debe tener **exactamente 2 medios**, la nueva en posición 1 y `…46295767974192` en posición 2.
5. Si algún paso de verificación falla, **no borrar** la antigua; deja ambas, documenta y avisa.

## 4. Bloque B: fotos de producto de Imprint y Archive

### 4.1 Verificación previa (antes de escribir)

Lectura por handle de los 9 productos de las tablas 4.2 y 4.3: confirmar que existen, que están ACTIVE y que tienen **0 medios** (hoy confirmado por lectura, pero verifícalo tú). Si algún producto ya trae medios, no añadir nada: anótalo en el informe y continúa con el resto. Si falta un handle, no lo crees.

Dirección de arte previa a generar: elige una vez y mantén para cada preset la misma luz, fondo y paleta en todas sus tomas (como en la 001, §2.3). Si tienes acceso a las imágenes de sección ya generadas de Imprint/Archive (GPT-TASK-016/017), úsalas de referencia; si no, sigue las descripciones de abajo.

### 4.2 Imprint (5 productos, 16 imágenes)

**Ambiente Imprint:** estilo base hueso/piedra cálida, con mesa de trabajo de madera clara o piedra, ambiente de oficina/escritorio de cuero artesanal, luz lateral de ventana, profundidad de campo corta. Paleta: cuero negro y coñac, crema, latón mate, verde oliva. Sin portátiles ni móviles con marca (solo siluetas neutras si hacen falta, mejor evitarlos). Manos solo si salen perfectas; preferible ausencia de manos. Los acabados de las fotos deben corresponder a las variantes reales indicadas.

| # | handle | Título exacto | Acabados / tamaños reales | Nº img |
|---|---|---|---|---|
| 1 | `leather-desk-mat` | Leather Desk Mat | Finish: Black, Dark umber · Size: Compact (45×30×0,3 cm), Large (60×35×0,3 cm) | 4 |
| 2 | `leather-document-folio` | Leather Document Folio | Finish: Black box calf, Saddle tan · 34×25×3 cm, compatible con A4, separador forrado en tela y trabilla plana para bolígrafo | 4 |
| 3 | `four-slot-cardholder` | Four-Slot Cardholder | Finish: Black box calf, Oxblood, Saddle tan · 10,5×7,5×0,5 cm, cuatro ranuras y bolsillo central | 3 |
| 4 | `folded-valet-tray` | Folded Valet Tray | Finish: Black, Saddle tan, Deep olive · base útil 18×18 cm, borde de 4 cm, cuatro esquinas fijadas | 3 |
| 5 | `milled-brass-paperweight` | Brass Paperweight (el título en tienda es este; el handle conserva "milled-brass") | Finish: Natural brass, Dark patina · disco liso de 6 cm de diámetro y 2 cm de alto | 2 |

Contenido de cada toma (orden = orden en Admin; la 1.ª es la destacada):

**`leather-desk-mat` (4)**
1. Principal: alfombrilla Compact en negro, plano cenital 3/4 sobre mesa de madera clara, centrada, con bordes cosidos visibles y la sombra de la ventana cruzándola. Alt: `Leather Desk Mat in black, seen from above on a wooden desk`
2. Variante: la Large en Dark umber, misma luz y ángulo, con un cuaderno liso cerrado y un bolígrafo de silueta neutra encima como escala (sin teclados ni dispositivos). Alt: `Leather Desk Mat in dark umber, large size, with a closed notebook and a pen`
3. Detalle: esquina y costura del borde, macro con profundidad de campo corta, mostrando el grano del cuero y el dorso de ante visible en el canto doblado. Alt: `Leather Desk Mat, close view of the stitched edge and suede backing`
4. Contexto/escala: escritorio ordenado con la alfombrilla Compact negra, el `milled-brass-paperweight` y una lámpara de silueta lisa sin marca, tomado a media distancia. Alt: `Leather Desk Mat in black on a tidy desk with a brass paperweight and a lamp`

**`leather-document-folio` (4)**
1. Principal: folio cerrado en negro (Black box calf), plano cenital ligeramente inclinado, con la trabilla para bolígrafo visible sin bolígrafo de marca. Alt: `Leather Document Folio in black box calf, closed, seen from above`
2. Variante: folio en Saddle tan, cerrado, mismo plano. Alt: `Leather Document Folio in saddle tan, closed, front view`
3. Interior: folio abierto en negro mostrando el separador forrado en tela, la trabilla plana y hojas A4 en blanco (sin texto). Alt: `Leather Document Folio, open to show the fabric-lined divider and pen loop`
4. Detalle/escala: esquina cosida del folio sobre una hoja A4 en blanco para dar escala, macro del cuero. Alt: `Leather Document Folio, close view of the corner stitching beside a blank A4 sheet`

**`four-slot-cardholder` (3)**
1. Principal: tarjetero en Black box calf, frontal sobre superficie de piedra clara, con 2 o 3 tarjetas lisas en blanco asomando (sin números ni logotipos). Alt: `Four-Slot Cardholder in black box calf with blank cards, front view`
2. Variantes: los tres acabados (Black box calf, Oxblood, Saddle tan) en abanico o en fila escalonada, sin tarjetas. Alt: `Four-Slot Cardholder in black, oxblood and saddle tan, arranged side by side`
3. Detalle/escala: interior abierto en oxblood con las cuatro ranuras y el bolsillo central visibles, junto a una moneda lisa sin relieve legible para escala o junto a un lápiz de silueta neutra. Alt: `Four-Slot Cardholder in oxblood, open to show the four slots and central pocket`

**`folded-valet-tray` (3)**
1. Principal: bandeja en Saddle tan vista 3/4 desde arriba sobre madera clara, con las cuatro esquinas fijadas bien visibles. Alt: `Folded Valet Tray in saddle tan, three-quarter view from above`
2. Contexto/escala: bandeja en negro con un reloj de pulsera de esfera lisa sin marca ni numeración legible, un juego de llaves y una moneda, sobre mesilla. Alt: `Folded Valet Tray in black holding a watch, keys and a coin`
3. Variantes/detalle: bandeja en Deep olive de cerca, mostrando la esquina fijada y el borde de 4 cm. Alt: `Folded Valet Tray in deep olive, close view of a fastened corner`

**`milled-brass-paperweight` (2)**
1. Principal: disco de latón natural liso sobre madera clara o piedra cálida, vista 3/4 baja, con reflejo cálido de la ventana. Sin grabados, sin marcas ni texto. Alt: `Brass Paperweight in natural brass on a wooden surface`
2. Contexto/variante: la versión Dark patina junto a la natural, apoyadas sobre varias hojas en blanco sin texto, para mostrar escala y uso. Alt: `Brass Paperweight in dark patina beside the natural brass finish, resting on blank sheets`

### 4.3 Archive (4 productos «199x-…», 12 imágenes)

Los cuatro son **prendas** (no objetos), todas con una sola variante (Default Title). Los productos «199x-…» en estado DRAFT (`1989-structured-wool-waistcoat`, `1991-leather-column-skirt`, `1992-silk-twill-blouse`, `1993-wool-tuxedo-trouser`, `1994-leather-document-portfolio`, `1995-asymmetric-wool-cape`, `1996-satin-evening-jacket`, `1997-printed-silk-square`) están **fuera de alcance**; no subirles nada.

**Ambiente Archive:** archivo/estudio vintage de los años 90. Mantén el estilo base hueso y la luz lateral de ventana, pero con aire de archivo de moda: percha de madera oscura o maniquí de lino crudo sin marcas sobre plinto de nogal, pared de yeso envejecido en tonos piedra/ocre, algún panel verde oliva, suelo de madera oscura, ligera penumbra con foco cálido, pliegues y planchado de almacén. Etiquetas **ilegibles o en blanco**; no fechar ni dar procedencia de forma legible. La imagen no debe afirmar autenticidad, época certificada, origen ni "hecho a mano".

| # | handle | Título exacto | Descripción en tienda | Nº img |
|---|---|---|---|---|
| 6 | `1990-pinstripe-double-breasted-jacket` | 1990 Pinstripe Double-Breasted Jacket | Chaqueta de lana estructurada con rayas finas de tiza, solapa en pico y seis botones | 3 |
| 7 | `1994-cashmere-cocoon-coat` | 1994 Double-Faced Cashmere Cocoon Coat | Abrigo cocoon de cachemir doble cara con cierre oculto y hombro redondeado | 3 |
| 8 | `1998-bias-cut-silk-slip` | 1998 Bias-Cut Silk Evening Slip | Combinación de seda al bies sin costuras rígidas, con bajo asimétrico estrecho | 3 |
| 9 | `1999-technical-cotton-trench` | 1999 Technical Cotton Trench | Gabardina limpia de algodón técnico con tapeta, cinturón y cierre frontal oculto | 3 |

**`1990-pinstripe-double-breasted-jacket` (3)**
1. Principal: chaqueta en maniquí de lino crudo sobre plinto de nogal, frontal, rayas finas de tiza nítidas y continuas (cuidado con el moiré/borrosidad), seis botones y solapa en pico claras. Alt: `1990 Pinstripe Double-Breasted Jacket on a form, front view`
2. Detalle: solapa en pico y botonadura, macro con rayas bien definidas, etiqueta ausente o ilegible. Alt: `1990 Pinstripe Double-Breasted Jacket, close view of the peaked lapel and buttons`
3. Contexto/espalda: espalda de la chaqueta en el maniquí, con pared de yeso envejecido de fondo. Alt: `1990 Pinstripe Double-Breasted Jacket, back view on a form`

**`1994-cashmere-cocoon-coat` (3)**
1. Principal: abrigo cocoon en maniquí sobre plinto, frontal, silueta redondeada clara y cierre oculto sin botones visibles. Alt: `1994 Double-Faced Cashmere Cocoon Coat on a form, front view`
2. Detalle: hombro redondeado y textura de cachemir doble cara en el borde (muestra las dos caras del tejido), macro. Alt: `1994 Double-Faced Cashmere Cocoon Coat, close view of the rounded shoulder and cloth`
3. Contexto/escala: abrigo colgado en una percha de madera en un perchero de archivo, con otras prendas lisas desenfocadas al fondo. Alt: `1994 Double-Faced Cashmere Cocoon Coat hanging on a wooden hanger in an archive room`

**`1998-bias-cut-silk-slip` (3)**
1. Principal: combinación de seda en maniquí sobre plinto, frontal, caída al bies con brillo suave de la luz lateral, bajo asimétrico visible. Alt: `1998 Bias-Cut Silk Evening Slip on a form, front view`
2. Detalle: bajo asimétrico y caída de la seda, macro con brillo y pliegues naturales. Alt: `1998 Bias-Cut Silk Evening Slip, close view of the asymmetric hem`
3. Contexto: la prenda doblada con papel de seda en blanco dentro de una caja de archivo abierta sobre una mesa de madera oscura. Alt: `1998 Bias-Cut Silk Evening Slip folded in an archive box with blank tissue`

**`1999-technical-cotton-trench` (3)**
1. Principal: gabardina en maniquí, frontal, cerrada, con cinturón anudado y tapeta visible. Alt: `1999 Technical Cotton Trench on a form, front view with belt`
2. Detalle: tapeta y cierre frontal oculto, macro del tejido de algodón técnico. Alt: `1999 Technical Cotton Trench, close view of the storm flap and concealed closure`
3. Espalda/contexto: espalda de la gabardina en el maniquí en el estudio de archivo. Alt: `1999 Technical Cotton Trench, back view on a form`

## 5. Seguridad y escrituras permitidas

Solo estas escrituras:
1. Bloque A: subir 1 media a `silk-twill-square`, reordenarla, y eliminar el ID `gid://shopify/MediaImage/46295766466864` solo cumpliendo las condiciones de la sección 3.
2. Bloque B: subir medios (con alt, en el orden pedido) a los 9 handles de 4.2 y 4.3. Vía `productCreateMedia` / `productReorderMedia`, o Admin > producto > Media.
3. Opcional y sin criterio de aceptación: asociar la imagen de cada acabado a su variante (`productVariantAppendMedia`), solo si es sencillo.

Prohibido todo lo demás (ver §1). **Avisa con un mensaje corto al terminar el bloque A y de nuevo al terminar el B.**

## 6. Entrega

Informe en `agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-002.md` con cabecera de identificación (ID, fecha y estado):

```text
ID: GPT-IMAGENES-DEMO-002
Estado:
Decisión requerida:
Resumen en 5 líneas:
Archivos tocados:
Desviaciones (Nivel 1 o Nivel 2):
Hallazgos extra fuera de alcance (con parche listo):
Verificación (comando, resultado y qué demuestra/qué no):
Lista de afirmaciones falsables numeradas:
```

Y, en el cuerpo:
1. **Verificación inicial:** dominio leído y estado previo (nº de medios y IDs) de los 10 productos tocados.
2. **Bloque A:** ID de la nueva media, ID eliminado (`…46295766466864`), lectura final de `media(first: 10)` de `silk-twill-square` con posición, ID, alt y dimensiones, y `descriptionHtml` sigue vacío.
3. **Manifiesto B:** `handle → [archivo, id de media, alt, orden, ancho × alto, peso aproximado]`, una fila por imagen (28 esperadas), con nº de medios previos y finales por producto.
4. **Imágenes pendientes o fallidas** por cuota u otra causa: handle, posición y motivo.
5. **Comprobaciones de exclusión:** medios en los 8 productos DRAFT «198x/199x», `leather-belt`, los tres `[TEST]` y `gift-card`: sin cambios respecto de la lectura previa (indica el nº leído).
6. **Estados de ledger:** solo `cumplido`, `código completo`, `no verificado` o `ausente`. No cerrar filas del ledger: lo hace Claude con evidencia.

## 7. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| 1 | La tienda leída es `sartorial-theme-kvkzl39t.myshopify.com` | Salida pegada de la lectura inicial |
| 2 | `silk-twill-square` tiene exactamente 2 medios; la nueva está en posición 1 (1640 × 2050, alt correcto, `READY`) y `…46295767974192` en posición 2; `…46295766466864` ya no existe | Lectura `media(first: 10)` |
| 3 | La nueva imagen 1 de `silk-twill-square` no presenta manchas ni emborronado en el patrón (esquina superior izquierda y centro incluidos) | Revisión visual a tamaño completo y ampliada, y descripción de lo revisado en el informe |
| 4 | La descripción de `silk-twill-square` sigue vacía | Lectura de `descriptionHtml` |
| 5 | Cada uno de los 9 productos de 4.2 y 4.3 tiene exactamente el nº de imágenes de su tabla (o lo realmente subido, con lo pendiente listado), en el orden pedido y con la principal primero | Lectura `media(first: 10)` por handle |
| 6 | Todas las imágenes nuevas son 4:5, 1640 × 2050, JPG y ≤ 1,5 MB | Dimensiones leídas del medio y peso del archivo |
| 7 | Cada imagen tiene alt en inglés conforme a la sección 2, describe la imagen real y no contiene claims | Lectura del alt y revisión visual |
| 8 | Ninguna imagen contiene texto legible, logotipos, marcas, personas ni rostros, ni manos defectuosas; las etiquetas son ilegibles o están en blanco | Revisión visual, una a una |
| 9 | Nombres `<handle>-<n>.jpg` y `<n>` coincide con el orden | Manifiesto |
| 10 | Estilo coherente: Imprint con ambiente de escritorio de cuero y Archive con ambiente de archivo vintage de los 90; ambos con fondo hueso y luz lateral | Revisión visual del conjunto de cada preset |
| 11 | Los acabados mostrados corresponden a variantes reales (p. ej. el tarjetero en Black box calf/Oxblood/Saddle tan; la bandeja en Black/Saddle tan/Deep olive) | Comparación con la lista de acabados de 4.2 |
| 12 | Sin cambios en temas, metafields, apps, precios, inventario, estado, descripciones ni en productos o medios fuera de alcance; los DRAFT, `leather-belt`, los `[TEST]` y `gift-card` no recibieron medios | Comparación de la lectura previa con la final |
| 13 | El informe usa cabecera de identificación, no contiene credenciales ni datos personales y no cierra filas del ledger | Revisión |

## 8. Lista de verificación previa al reporte (GPT la pasa entera)

- [ ] Dominio de la tienda confirmado por lectura antes de escribir.
- [ ] Bloque A: nueva imagen revisada ampliada antes de subir; subida, reorden y lectura confirmados **antes** de borrar; borrada solo por ID exacto; resultado final de 2 medios.
- [ ] Los 9 productos de B leídos antes (0 medios) y después (nº esperado o pendiente documentado).
- [ ] Todas las imágenes: 4:5, 1640 × 2050, ≤ 1,5 MB, JPG, nombre `<handle>-<n>.jpg`, orden con la principal primero.
- [ ] Cada alt describe la imagen real, ≤ 125 caracteres, en inglés, sin claims de origen, material no verificable ni "handmade".
- [ ] Sin texto, logotipos, marcas reales, personas, ni manos defectuosas en ninguna imagen (revisadas una a una).
- [ ] Rayas y patrones de `silk-twill-square` y `1990-pinstripe-double-breasted-jacket` nítidos y continuos.
- [ ] No se subió nada a los DRAFT, `leather-belt`, `[TEST]`, `gift-card` ni otros productos.
- [ ] No se tocó ningún tema, metafield, app, precio, inventario, descripción ni estado.
- [ ] Mensajes de aviso enviados al terminar A y B.
- [ ] Informe en `agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-002.md` con cabecera de identificación, manifiesto de 28 filas más el Bloque A, pendientes por cuota listados y lecturas finales pegadas literalmente.

## 9. Qué revisará Claude después

1. Cotejar por lectura (no por el relato del informe, RULES.md §4, punto 1) los 29 elementos: estado `READY`, alt, orden y dimensiones.
2. Muestreo visual de al menos una imagen por producto, con especial atención a manchas en patrones de raya, texto accidental, personas, manos y desajuste de color con el alt.
3. Comprobar en tienda real (compuerta 5) que las tarjetas y galerías de Imprint y Archive ya muestran las fotos en escritorio y móvil, y que `silk-twill-square` carga sin salto de proporción.
4. Los cambios en el ledger los hace Claude solo con esa evidencia.

## 10. Notas

- El título en tienda de `milled-brass-paperweight` es "Brass Paperweight"; el handle lo conserva por la importación original. Usa el título real en los alt y no hables de "milled" en ninguna imagen.
- `structured-tote` ya tiene fotos de Sartorial (bolso) en la 001; no se toca aquí.
- Hoy los 9 productos de Imprint y Archive aparecen en las plantillas de los presets, por eso se priorizan sobre los DRAFT. Las fotos de los DRAFT irán en una orden aparte si hace falta.
