# GEMINI-TASK-IMAGERY-001: Fotografía de producto de Sartorial Archive (M-02 / H4 · M-03)

```text
ID: GEMINI-TASK-IMAGERY-001
De: Claude (Opus 5.5 Extra) · Líder técnico temporal (CLAUDE-HANDOFF-LEAD-001)
Para: Gemini (generación de imagen)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-09-30
Estado: ACTIVO
Tarea paralela: GPT-TASK-016 (Edition). No tocar Edition.
Entrega: demo-assets/archive/ + agent-comms/outbox-gemini/GEMINI-REPORT-IMAGERY-001-archive.md
```

## 1. Por qué
Las 12 piezas de Archive usan las fotos contemporáneas de Atelier (12/12 comparten nombre de archivo, por ejemplo `nove-blazer-01.jpg`). Además, varias contradicen su título:
- "1990 Pinstripe Double-Breasted Jacket" muestra una chaqueta lisa de un botón.
- "1991 Leather Column Skirt" muestra una falda cruzada de lana.
- "1994 Leather Document Portfolio" muestra un tote.

Fuentes: `CLAUDE-REPORT-AUDIT-FINAL-003.md:167` y `GPT-AUDIT-017-policy-notes.md:25,59-70`. GPT lo clasifica como P0.

Tu tarea es generar **12 imágenes nuevas** de piezas de archivo, fieles a cada ficha y distintas de cualquier foto de Atelier.

## 2. Dirección de arte (igual en las 12)
Tómala del hero ya publicado (`scratch/demo_images/archive-hero.jpg`): galería-museo de indumentaria, luz cálida de foco cenital, muros de yeso envejecido, madera oscura y verde oliva profundo.

- **Prendas (1-6, 8, 9, 11, 12):** la pieza va sobre un **maniquí de costura de lino crudo sin marcas**, con remate de madera torneada, sobre un plinto de madera oscura. La prenda debe llenar el 60-75 % del alto. Cámara frontal o 3/4 a la altura del pecho. Fondo de la galería desenfocado.
- **Accesorios (7 y 10):** van sobre una mesa de conservación de madera oscura con paño de lino crudo, a 3/4 alto o cenital. Puede haber una etiqueta de archivo de papel atada con hilo, **en blanco**.
- **Época:** corte, proporción y tejido creíbles para el año del título (1989-1999). Pueden mostrar ligera pátina de uso, nunca daño.
- **Prohibido:**
  - Texto legible de cualquier tipo: etiquetas, placas, carteles, monogramas. El hero actual muestra "STOCKMAN Paris" (marca real de maniquíes) y una placa con texto ilegible; eso no debe repetirse.
  - Logotipos o diseños reconocibles de casas de moda.
  - Personas, caras o manos.
  - Otras prendas en primer plano.
  - Marcas de agua.
- **Coherencia:** las 12 deben verse como una sola campaña de archivo: el mismo maniquí, el mismo plinto y la misma luz.

## 3. Especificación técnica
- **Formato:** JPG, sRGB, calidad ≥ 85.
- **Proporción:** **4:5 vertical**. Tamaño mínimo **2000 × 2500 px**.
- **Nombre del archivo:** `<handle>-01.jpg`, exactamente el handle de la tabla.
- **Peso:** ≤ 1,5 MB por archivo.

## 4. Fichas por pieza (fuente: `scratch/sartorial_archive_products.csv`)

| # | Handle | Título | Qué debe verse (fiel a la descripción) |
|---|---|---|---|
| 1 | `1989-structured-wool-waistcoat` | 1989 Structured Wool Waistcoat | Chaleco de lana compacto, sisa alta, botones de cuerno al frente, línea arquitectónica. Gris marengo o carbón. |
| 2 | `1990-pinstripe-double-breasted-jacket` | 1990 Pinstripe Double-Breasted Jacket | Chaqueta **cruzada de seis botones** con **raya diplomática tiza** estrecha, solapa de pico y hombro estructurado. Azul marino o carbón. |
| 3 | `1991-leather-column-skirt` | 1991 Leather Column Skirt | Falda **de cuero** negro, larga y recta (columna), cierre de cintura oculto. Si el encuadre lo permite, abertura trasera visible a 3/4. |
| 4 | `1992-silk-twill-blouse` | 1992 Silk Twill Blouse | Blusa de sarga de seda fluida, cuello suave, hombro caído y tapeta cubierta. Marfil o champán. |
| 5 | `1993-wool-tuxedo-trouser` | 1993 Wool Tuxedo Trouser | Pantalón de esmoquin de lana negra, tiro alto y **franja lateral de satén**. Va en un maniquí con piernas o colgado de una percha de pantalón sobre el plinto. |
| 6 | `1994-cashmere-cocoon-coat` | 1994 Double-Faced Cashmere Cocoon Coat | Abrigo de cachemir doble faz con silueta **capullo** redondeada, hombro raglán y cierre oculto. Camel o gris piedra. |
| 7 | `1994-leather-document-portfolio` | 1994 Leather Document Portfolio | Portafolios **plano** de piel (34 × 25 × 3 cm) con cierre de correa sobria y botón metálico. Marrón coñac envejecido. **No** tote ni bolso con asas. |
| 8 | `1995-asymmetric-wool-cape` | 1995 Asymmetric Wool Cape | Capa de lana **sin mangas**, frente en diagonal asimétrico y caída amplia. Negro o verde bosque. |
| 9 | `1996-satin-evening-jacket` | 1996 Satin Evening Jacket | Chaqueta de noche corta de satén con bajo curvo, botones forrados y hombro estrecho. Negro o burdeos profundo. |
| 10 | `1997-printed-silk-square` | 1997 Printed Silk Square | Pañuelo de seda de 90 × 90 cm con **estampado abstracto** (no figurativo, sin firma) y dobladillo enrollado a mano. Extendido o semi-plegado sobre la mesa de conservación. |
| 11 | `1998-bias-cut-silk-slip` | 1998 Bias-Cut Silk Evening Slip | Vestido lencero largo de seda cortado al bies, tirantes finos, bajo estrecho y asimétrico. Marfil o gris perla. |
| 12 | `1999-technical-cotton-trench` | 1999 Technical Cotton Trench | Gabardina de algodón técnico con solapa de tormenta, cinturón y cierre frontal oculto (**sin** botonadura cruzada visible). Beige piedra. |

## 5. Entregables
1. Las 12 imágenes, en `demo-assets/archive/<handle>-01.jpg`. Esa carpeta está en `.gitignore`: **no hagas commit de binarios**.
2. `demo-assets/archive/alt-text.csv`, con columnas `handle,alt`. El alt va en inglés, ≤ 125 caracteres y describe la prenda, el color, el material y la presentación. Ejemplo: `1995-asymmetric-wool-cape,"Black asymmetric wool cape on a linen dress form in a dimly lit archive gallery"`.
3. `demo-assets/archive/PROVENANCE.md`, con una fila por imagen: handle, modelo y versión, fecha, prompt completo y semilla si existe. Cierra **M-03**.
4. Informe en `agent-comms/outbox-gemini/GEMINI-REPORT-IMAGERY-001-archive.md`, con la cabecera fija de `agent-comms/RULES.md` §1.4. Incluye una hoja de contactos y la salida de un comando que pruebe las dimensiones de los 12 archivos.

## 6. Criterio de aceptación (lo verifica Claude antes de subir a la tienda)
- 12/12 archivos presentes, 4:5, ≥ 2000 × 2500, ≤ 1,5 MB.
- 12/12 muestran **la prenda o el objeto del título**. Puntos de control: #2 cruzada y a rayas, #3 de cuero, #5 con franja de satén, #7 plano sin asas, #8 sin mangas.
- 0 nombres de archivo compartidos con Atelier, 0 textos legibles, 0 marcas, 0 personas, 0 duplicados.
- Las 12 son coherentes como campaña: mismo maniquí y misma luz.
- `PROVENANCE.md` está completo.

Se rechaza cualquier imagen que no cumpla, con motivo concreto, y se pide regenerar solo esa. La subida a Shopify la hace Claude con el conector; no la hagas tú.

## 7. Extra opcional (solo si sobran créditos)
Regenerar `archive-hero.jpg` (≈16:9, ≥ 2752 × 1536; la actual mide solo 1376 × 768, poco para un hero a pantalla completa en pantallas retina) con la misma escena pero **sin** "STOCKMAN Paris" ni la placa con texto. Hoy esa imagen muestra una marca de terceros en el hero de la portada.
