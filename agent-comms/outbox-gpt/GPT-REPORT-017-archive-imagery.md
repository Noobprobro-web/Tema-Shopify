# GPT-REPORT-017: Compleción visual de Sartorial Archive

```text
ID: GPT-REPORT-017 (respuesta a GPT-TASK-017)
Estado: 8 imágenes generadas y preparadas; pendiente QA individual de Claude y verificación comercial del titular. No se cierra B-04 ni M-03.
Decisión requerida: Claude acepta/rechaza cada una, verifica la correspondencia con el catálogo y efectúa la subida; Johandry confirma derechos y que las afirmaciones de antigüedad, conservación y pieza 1-de-1 son demostrables.
Resumen en 5 líneas:
  1. Se completaron las piezas #5 a #12; las cuatro de Gemini permanecen sin cambios.
  2. Los 12 JPG miden 2000 × 2500 px, pesan menos de 1,5 MB y tienen hashes distintos.
  3. Se entregaron 12 alt en inglés, PROVENANCE-GPT.md de las ocho nuevas y hoja de contactos 12/12.
  4. La revisión visual preliminar muestra continuidad de galería, lino, nogal, paneles oliva y foco cálido; los ocho objetos son reconocibles.
  5. Los ocho originales de 1122 × 1402 se ampliaron; las imágenes generadas no acreditan que existan las piezas históricas descritas.
Archivos tocados: demo-assets/archive/ (8 JPG nuevos, alt-text.csv actualizado, PROVENANCE-GPT.md, contact-sheet.jpg, prepare_gpt_archive.py); este informe.
Desviaciones (Nivel 1 o Nivel 2): Ningún cambio en código, schema, plantilla ni tienda. La dimensión solicitada se obtuvo por ampliación; se documenta. No se usó conditioning directo con imágenes de referencia: las cuatro fueron inspeccionadas y traducidas a la dirección de arte de los prompts.
Hallazgos extra fuera de alcance (con parche listo): PROVENANCE.md de Gemini afirma “unrestricted commercial usage rights”; esa frase requiere respaldo y no debe tratarse como licencia certificada. Acción sugerida: sustituirla por una descripción verificable de términos, titular y aprobación después de revisión del responsable. No se modificó ese archivo por estar fuera de esta tarea.
Verificación (comando, resultado y qué demuestra/qué no): Comando y salida literal abajo. Demuestra tamaño, peso y hashes únicos de archivos locales; no demuestra autenticidad de material, fecha, procedencia ni derechos.
Lista de afirmaciones falsables numeradas: 1) Existen 12 JPG. 2) Los ocho nuevos están en 2000 × 2500, sRGB y calidad 89. 3) Los 12 son menores de 1,5 MB. 4) Hay 12 SHA-256 únicos. 5) Los cuatro hashes iniciales de Gemini no cambiaron. 6) Hay 12 alt de 125 caracteres o menos. 7) No se subió nada a Shopify.
```

## Entregables

![Hoja de contactos de las 12 piezas de Sartorial Archive](../../demo-assets/archive/contact-sheet.jpg)

- Ocho JPG nuevos: `demo-assets/archive/<handle>-01.jpg` de 1993 a 1999 según `GPT-TASK-017`.
- [`alt-text.csv`](../../demo-assets/archive/alt-text.csv): 12 filas, conservando el texto de las cuatro primeras y actualizando las ocho restantes.
- [`PROVENANCE-GPT.md`](../../demo-assets/archive/PROVENANCE-GPT.md): tabla de ocho filas, fecha, generador, versión no expuesta, semilla no expuesta, referencias visuales inspeccionadas, ampliación y prompts completos.
- [`prepare_gpt_archive.py`](../../demo-assets/archive/prepare_gpt_archive.py): preparación reproducible de las ocho nuevas, con bloqueo explícito de sobrescritura. No se tocó `PROVENANCE.md` ni los JPG de Gemini.
- `demo-assets/` está excluida del commit por `.gitignore:15`; conservar esta carpeta para la subida manual. No se realizó la subida.

## Puntos de control visual

| Imagen nueva | Observación preliminar | Riesgo residual |
|---|---|---|
| 1993 Wool Tuxedo Trouser | Pantalón negro de tiro alto con franja lateral de satén visible. | La fibra y la fecha no se pueden comprobar visualmente. |
| 1994 Cashmere Cocoon Coat | Volumen redondeado que se estrecha hacia el bajo; sin botones visibles. | El cachemir doble faz no es verificable en imagen generada. |
| 1994 Leather Document Portfolio | Objeto plano de piel coñac, cierre con correa y broche; sin asas. | Dimensiones y existencia física requieren prueba del titular. |
| 1995 Asymmetric Wool Cape | Capa verde sin mangas, largo diagonal manifiesto. | Confirmar que la forma coincide con la ficha real. |
| 1996 Satin Evening Jacket | Chaqueta corta burdeos con brillo de satén, bajo curvo y botones discretos. | Detalle de botones/tejido requiere inspección a tamaño completo. |
| 1997 Printed Silk Square | Pañuelo de estampado abstracto ocre/oliva/marfil, sin letras visibles. | La medida 90 × 90 cm y el dobladillo manual no se prueban por la foto. |
| 1998 Bias-Cut Silk Slip | Vestido largo gris perla, tirantes finos, costuras diagonales y bajo asimétrico. | El corte al bies y la seda real requieren evidencia del objeto. |
| 1999 Technical Cotton Trench | Gabardina beige con solapa de tormenta, cinturón y cierre frontal sin botones visibles. | La composición técnica del algodón no se prueba por imagen. |

La campaña es visualmente cercana a las cuatro imágenes iniciales, aunque el yeso y la intensidad del foco varían entre tomas. Claude debe decidir si esa variación supera el umbral de coherencia de la demo y revisar cada JPG completo a tamaño de PDP.

## Verificación reproducible

Comando ejecutado desde la raíz del repositorio:

```powershell
& 'C:\Users\Johan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -c "from pathlib import Path; from PIL import Image; import hashlib; fs=sorted(Path('demo-assets/archive').glob('*-01.jpg')); print('name | dimensions | bytes | sha256'); [(lambda im: print(f'{f.name} | {im.width}x{im.height} | {f.stat().st_size} | {hashlib.sha256(f.read_bytes()).hexdigest()}'))(Image.open(f)) for f in fs]; print('count',len(fs)); print('unique_sha256',len({hashlib.sha256(f.read_bytes()).hexdigest() for f in fs}))"
```

Salida literal:

```text
name | dimensions | bytes | sha256
1989-structured-wool-waistcoat-01.jpg | 2000x2500 | 543574 | 71faf96f088f5d1b436b869ffa51fc8a54998c5f7b5bab508c6dbce13b753be6
1990-pinstripe-double-breasted-jacket-01.jpg | 2000x2500 | 491904 | b27d5b77c8ece9d638eca990eb9f6da810790bc2654a362dd557cdfb0dd4b382
1991-leather-column-skirt-01.jpg | 2000x2500 | 452673 | 802ee23f396eff6978392c849bfde73084bb4e1802fdc09678ee6641a4159ae7
1992-silk-twill-blouse-01.jpg | 2000x2500 | 472782 | ea8b938b5fdecf15b6dea4b1a824235a01f5a8135219ef7950b929240dd1c4dd
1993-wool-tuxedo-trouser-01.jpg | 2000x2500 | 457962 | 004f8e60f6c6ada7ecb963c83afc70533d042e94137def3345dcff3b7540d666
1994-cashmere-cocoon-coat-01.jpg | 2000x2500 | 593949 | 03170959e668bea045689bc8411f10e4a42a2ca05b4c2d0630e87e21dd157488
1994-leather-document-portfolio-01.jpg | 2000x2500 | 797662 | 3b4c23d4021b49271b578e4d017d29658c3d24eb461edf3ab80aff43a0a8e74f
1995-asymmetric-wool-cape-01.jpg | 2000x2500 | 533162 | 6a84a275b0214e69e1e70d85fafb673c618863526a2a38b096d9ec3b6024625d
1996-satin-evening-jacket-01.jpg | 2000x2500 | 548602 | e9e1b09b9423f3ccce298e57a027ab3387c8c1df34b2d1700508bbc15bc450f9
1997-printed-silk-square-01.jpg | 2000x2500 | 663835 | f145bec0aae8de3c1a0e4f61858da82cbf6598154f68b492526c7246f8482193
1998-bias-cut-silk-slip-01.jpg | 2000x2500 | 504424 | 7d1168496a64195f083ba3edd9f0d7412c328736ac06027a84050704c1d16da6
1999-technical-cotton-trench-01.jpg | 2000x2500 | 521049 | cf636d7db788e354f54438ace3ad3bf55df3d1f299f2c0ab99085cd5cc2bc91b
count 12
unique_sha256 12
```

Otra comprobación ejecutada sobre CSV y perfiles:

```text
jpg_count 12 alt_rows 12
all_2000x2500 True
all_under_1_5MB True
unique_sha256 12
alt_max_length 87
handles_match True
gpt_8_srgb_embedded True
```

Los hashes de las primeras cuatro piezas se registraron antes de generar y después de preparar; en ambas lecturas fueron idénticos a los cuatro primeros hashes de la tabla. Los ocho originales nuevos medían 1122 × 1402; por tanto, los 2000 × 2500 son dimensiones finales ampliadas, no detalle óptico nativo.

## Estado de requisitos y publicación

- `B-04`: material local completo, pendiente de aceptación visual de Claude, carga en Shopify y verificación de las 12 tarjetas/PDP en desktop y móvil.
- `M-03`: origen documentado para los ocho archivos nuevos, **no cerrado**. [Shopify exige recursos de demo con derechos adecuados y contenido realista y profesional](https://shopify.dev/docs/storefronts/themes/store/requirements); su [lista de rechazos comunes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections) incluye contenido sin licencia o restringido. Debe revisarse quién ostenta derechos sobre el contenido final.
- Las fichas Archive afirman fechas 1989–1999, condición de museo/restauración, números de registro y piezas únicas. Estas imágenes son generadas a partir de texto y no sirven como prueba de esas afirmaciones. Antes de publicar, el titular debe aportar documentación verificable por pieza o ajustar el copy para describir honestamente una colección conceptual. Esto es un riesgo comercial separado de la calidad de las fotos.
- `docs/requirements-ledger.md`: no se editó ni cerró ninguna fila. La verificación de la tienda real sigue pendiente tras la subida.
