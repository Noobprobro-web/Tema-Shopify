# GPT-TASK-017: Completar la fotografía de Sartorial Archive (piezas #5 a #12)

```text
ID: GPT-TASK-017
De: Claude (Opus 5.5 Extra) · Líder técnico temporal (CLAUDE-HANDOFF-LEAD-001)
Para: GPT-6 Sol Max / Astra (generación de imagen)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-09-30
Estado: ACTIVO
Contexto: Gemini entregó 4 de 12 piezas (GEMINI-TASK-IMAGERY-001) y agotó su cuota. Johandry reasigna las 8 restantes a GPT.
Entrega: demo-assets/archive/ + agent-comms/outbox-gpt/GPT-REPORT-017-archive-imagery.md
```

## 1. Qué hay que hacer
Generar **8 imágenes** que completen el catálogo de Archive. Deben continuar **exactamente** la campaña ya aprobada. Las 4 de Gemini pasaron el QA de Claude y **son la referencia visual obligatoria**:

- `demo-assets/archive/1989-structured-wool-waistcoat-01.jpg`
- `demo-assets/archive/1990-pinstripe-double-breasted-jacket-01.jpg`
- `demo-assets/archive/1991-leather-column-skirt-01.jpg`
- `demo-assets/archive/1992-silk-twill-blouse-01.jpg`

Úsalas como imágenes de referencia de estilo si tu herramienta lo permite. **No las regeneres ni las sobrescribas.**

## 2. Dirección de arte (extraída de las 4 aprobadas)
- **Escena:** galería-museo de indumentaria en penumbra. Muros de yeso envejecido en tonos piedra y ocre, biombos o paneles verde oliva profundo, y suelo de madera oscura u hormigón pulido. Todo desenfocado detrás de la pieza.
- **Soporte:**
  - Prendas: maniquí de costura de **lino crudo liso sin marcas**, con remate superior de nogal torneado. Va sobre un pie de nogal torneado o directamente sobre un **plinto cúbico de nogal**, centrado.
  - Accesorios: mesa o plinto de nogal con paño de lino crudo.
- **Luz:** foco cálido cenital y ligeramente frontal sobre la pieza, con caída a penumbra en los bordes. Tonalidad cálida, con contraste moderado.
- **Encuadre:** vertical, frontal, con la pieza centrada y ocupando el 60-75 % del alto. Cámara a la altura del pecho del maniquí.
- **Prohibido:**
  - Texto legible: cartelas, placas, etiquetas o letreros. Las cartelas de fondo deben quedar ilegibles y desenfocadas, como en las referencias.
  - Logotipos o diseños reconocibles de casas de moda.
  - Personas, caras o manos.
  - Otras prendas en primer plano.
  - Marcas de agua.

## 3. Especificación técnica
- **Formato:** JPG, sRGB, calidad ≥ 85.
- **Proporción y tamaño:** **4:5, exactamente 2000 × 2500 px**.
- **Peso:** ≤ 1,5 MB.
- **Nombre del archivo:** `<handle>-01.jpg`.
- Si el original sale con menos resolución, amplíalo y **decláralo**, como hiciste en GPT-REPORT-016.

## 4. Fichas (fuente: `scratch/sartorial_archive_products.csv`)

| # | Handle | Título | Qué debe verse | Puntos de control |
|---|---|---|---|---|
| 5 | `1993-wool-tuxedo-trouser` | 1993 Wool Tuxedo Trouser | Pantalón de esmoquin de lana negra, tiro alto, pierna recta. Sobre un maniquí de pantalón (forma de cadera y piernas) en lino, o colgado de una percha de nogal sobre el plinto. | **Franja lateral de satén** visible a lo largo de la pierna |
| 6 | `1994-cashmere-cocoon-coat` | 1994 Double-Faced Cashmere Cocoon Coat | Abrigo camel de cachemir doble faz con silueta **capullo** (volumen redondeado que se estrecha en el bajo), hombro raglán y cierre oculto, sin botones visibles. | Silueta redondeada y sin botonadura |
| 7 | `1994-leather-document-portfolio` | 1994 Leather Document Portfolio | Portafolios **plano** de piel color coñac envejecido (34 × 25 × 3 cm), con correa sobria y botón metálico, sobre mesa de nogal con paño de lino. Toma a 3/4 alto. | **Sin asas**, plano, no es un bolso |
| 8 | `1995-asymmetric-wool-cape` | 1995 Asymmetric Wool Cape | Capa de lana negra o verde bosque **sin mangas**, con frente cortado en diagonal (un lado más largo) y caída amplia sobre el maniquí. | Sin mangas; asimetría evidente |
| 9 | `1996-satin-evening-jacket` | 1996 Satin Evening Jacket | Chaqueta de noche corta de satén negro o burdeos profundo, con **bajo curvo**, botones forrados en la misma tela y hombro estrecho. | Brillo de satén; chaqueta corta |
| 10 | `1997-printed-silk-square` | 1997 Printed Silk Square | Pañuelo de seda de 90 × 90 cm con **estampado abstracto** (formas geométricas suaves en ocre, oliva y marfil, sin figuras, letras ni firma) y dobladillo enrollado a mano. Extendido o semi-plegado sobre la mesa de nogal. | Ninguna letra ni firma en el estampado |
| 11 | `1998-bias-cut-silk-slip` | 1998 Bias-Cut Silk Evening Slip | Vestido lencero largo de seda marfil o gris perla cortado al bies, con tirantes finos y un bajo estrecho y **asimétrico**. Va sobre un maniquí de cuerpo entero o con falda larga. | Caída fluida al bies; tirantes finos |
| 12 | `1999-technical-cotton-trench` | 1999 Technical Cotton Trench | Gabardina de algodón técnico color beige piedra, con solapa de tormenta, cinturón anudado y **cierre frontal oculto**. | **Sin** botonadura cruzada visible |

## 5. Entregables
1. Las 8 imágenes, en `demo-assets/archive/<handle>-01.jpg`. **No hagas commit**: la carpeta está en `.gitignore`.
2. `demo-assets/archive/alt-text.csv` **completo, con las 12 filas**: escribe las 8 tuyas y conserva las 4 que añade Claude (ver §6). Columnas `handle,alt`; alt en inglés, ≤ 125 caracteres.
3. `demo-assets/archive/PROVENANCE-GPT.md`, con una fila por cada una de tus 8 imágenes: modelo y versión, fecha, prompt completo, imágenes de referencia usadas y si fue ampliada.
4. `demo-assets/archive/contact-sheet.jpg` con **las 12** piezas (las 4 de Gemini y tus 8) en cuadrícula, para comprobar la coherencia.
5. Informe `agent-comms/outbox-gpt/GPT-REPORT-017-archive-imagery.md` con la cabecera fija de `agent-comms/RULES.md` §1.4 y la salida literal de un comando que pruebe dimensiones, peso y SHA-256 distintos de las 12.

## 6. Nota sobre los archivos de Gemini
`PROVENANCE.md`, `alt-text.csv` y `process_archive_images.py` en `demo-assets/archive/` quedaron en **0 bytes**.
- **No los uses como base.**
- Claude escribe en `alt-text.csv` las 4 filas de las piezas de Gemini antes de que empieces.
- La procedencia de esas 4 sigue siendo responsabilidad de Gemini.

## 7. Criterio de aceptación (lo verifica Claude antes de subir a la tienda)
- 8/8 archivos presentes, 2000 × 2500, ≤ 1,5 MB.
- 8/8 cumplen sus puntos de control de §4.
- La hoja de contactos de las 12 debe verse como una sola campaña: mismo maniquí, misma luz, misma paleta.
- 0 textos legibles, 0 marcas, 0 personas, 0 duplicados.

Se rechaza cualquier imagen que no cumpla, con motivo concreto, y se pide regenerar solo esa. La subida a Shopify la hace Claude; no la hagas tú.
