# GPT-REPORT-016: Sartorial Edition — imágenes de catálogo

```text
ID: GPT-REPORT-016 (respuesta a GPT-TASK-016)
Estado: Entregado para revisión visual y validación comercial; no cierra B-04 ni M-03 todavía.
Decisión requerida: Claude debe aceptar o rechazar cada imagen, verificar la correspondencia con la ficha real y subir las aceptadas; Johandry debe confirmar derechos de uso y que los objetos generados representan el catálogo real antes de declarar M-03 cerrado.
Resumen en 5 líneas:
  1. Se generaron 13 imágenes distintas para los 13 handles de Edition.
  2. Se prepararon JPG 4:5 de 2000 × 2500, sRGB, calidad 89 y menos de 1,5 MB.
  3. Se entregaron alt-text.csv, PROVENANCE.md y hoja de contactos.
  4. Revisión visual preliminar: los 13 objetos son reconocibles y las parejas bolso/bolso y billetera/tarjetero se distinguen.
  5. Los originales de 1122 × 1402 fueron ampliados; falta contrastarlos con el producto físico y con los requisitos de derechos de Shopify.
Archivos tocados: demo-assets/edition/ (13 JPG, alt-text.csv, PROVENANCE.md, contact-sheet.jpg, prepare.py); este informe.
Desviaciones (Nivel 1 o Nivel 2): Ningún archivo de tema, schema, plantilla ni tienda modificado. La conversión a 2000 × 2500 se hizo por ampliación de originales de menor resolución; se declara expresamente.
Hallazgos extra fuera de alcance (con parche listo): La tarea dice que PROVENANCE.md “cierra M-03”; el registro de generación prueba origen, pero no por sí solo derechos sobre diseño/producto ni fidelidad a inventario. Recomendación: mantener M-03 abierto hasta validación del titular.
Verificación (comando, resultado y qué demuestra/qué no): Comando y salida literales abajo. Demuestra formato, dimensiones, perfil, peso, unicidad binaria y cobertura de alt; no demuestra fidelidad física, propiedad intelectual ni calidad de resolución nativa.
Lista de afirmaciones falsables numeradas: 1) Existen 13 JPG. 2) Todos miden 2000 × 2500. 3) Ninguno supera 1,5 MB. 4) Los 13 SHA-256 difieren. 5) Hay 13 alt con handles correspondientes. 6) No se hizo ninguna subida a Shopify.
```

## Entrega

![Hoja de contactos de las 13 imágenes de Sartorial Edition](../../demo-assets/edition/contact-sheet.jpg)

- Imágenes finales: `demo-assets/edition/<handle>-01.jpg` para los 13 handles de `scratch/sartorial_edition_products.csv`.
- Texto alternativo: [`demo-assets/edition/alt-text.csv`](../../demo-assets/edition/alt-text.csv).
- Procedencia y prompts completos: [`demo-assets/edition/PROVENANCE.md`](../../demo-assets/edition/PROVENANCE.md).
- Preparación reproducible: [`demo-assets/edition/prepare.py`](../../demo-assets/edition/prepare.py).
- La carpeta `demo-assets/` está excluida de Git por `.gitignore:15`; se debe transferir como carpeta local, fuera del commit. No se tocó Archive ni se subió ninguna imagen a Shopify.

## Revisión visual preliminar

| Producto | Comprobación observable |
|---|---|
| Structured Tote | Tote negro estructurado, asas cortas, cuerpo liso. |
| East-West Shoulder Bag | Silueta horizontal baja y correa de hombro, distinta de Crossbody. |
| Compact Crossbody | Bolsa pequeña vertical de piel granulada y correa larga. |
| Leather Document Folio | Carpeta plana negra con bolígrafo genérico en presilla lateral visible. |
| Padded Laptop Sleeve | Funda plana acolchada con cremallera de doble cursor. |
| Zip Travel Pouch | Neceser compacto con cierre y fuelle. |
| Slim Bifold Wallet | Billetera plegada entreabierta, distinta del tarjetero. |
| Four-Slot Cardholder | Tarjetero plano con cuatro ranuras frontales visibles. |
| Leather Key Loop | Tira plegada negra y una anilla, sin candado. |
| Leather Desk Mat | Vade negro sobre roble, sin papeles ni dibujos. |
| Folded Valet Tray | Bandeja cuadrada con esquinas plegadas y remachadas. |
| Milled Brass Paperweight | Disco liso de latón sobre papel blanco sin texto. |
| Single Pen Sleeve | Funda negra que envuelve un bolígrafo genérico. |

La hoja de contactos permite juzgar coherencia de fondo, luz y ausencia aparente de marcas y texto. La revisión humana de Claude debe inspeccionar cada JPG a tamaño final y contrastar medidas, acabado y detalles con los productos reales. Los píxeles no pueden certificar qué material o dimensiones tendrá el objeto físico.

## Verificación reproducible

Comando ejecutado desde la raíz del repositorio:

```powershell
& 'C:\Users\Johan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -c "from pathlib import Path; from PIL import Image; import csv, hashlib; p=Path('demo-assets/edition'); fs=sorted(p.glob('*[-]01.jpg')); rows=list(csv.DictReader((p/'alt-text.csv').open(encoding='utf-8'))); print('jpg_count',len(fs),'alt_count',len(rows)); print('all_dimensions_2000x2500',all(Image.open(f).size==(2000,2500) for f in fs)); print('all_jpeg',all(Image.open(f).format=='JPEG' for f in fs)); print('all_under_1_5MB',all(f.stat().st_size<=1500000 for f in fs)); print('all_srgb_embedded',all(bool(Image.open(f).info.get('icc_profile')) for f in fs)); print('unique_sha256',len({hashlib.sha256(f.read_bytes()).hexdigest() for f in fs})); print('alt_max_length',max(len(r['alt']) for r in rows)); print('handles_match',sorted(r['handle'] for r in rows)==sorted(f.name[:-7] for f in fs))"
```

Salida literal:

```text
jpg_count 13 alt_count 13
all_dimensions_2000x2500 True
all_jpeg True
all_under_1_5MB True
all_srgb_embedded True
unique_sha256 13
alt_max_length 68
handles_match True
```

Comprobación de resolución original:

```text
raw_count 13
raw_dimensions [(1122, 1402)]
```

La ampliación satisface la dimensión de archivo solicitada, pero no añade el detalle óptico de una captura nativa de 2000 × 2500. Recomiendo comprobar las imágenes en zoom PDP y móvil después de publicarlas; si el producto exige detalle fino, reemplazar por foto física o una generación nativa de mayor resolución.

## Estado de requisitos y derechos

- `B-04`: imágenes preparadas, pendiente aceptación individual, subida, retirada de imágenes antiguas y verificación de tarjetas/PDP en desktop y móvil.
- `M-03`: procedencia documentada; **no verificado** hasta que el titular confirme derechos y correspondencia con los productos. Shopify exige derechos adecuados para todos los recursos de las demos y permiso directo de titulares antes de usar marcas o contenido ajeno: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements). Los [términos de OpenAI](https://openai.com/policies/row-terms-of-use/) asignan el output al usuario entre OpenAI y el usuario en la medida permitida por ley, y advierten que las salidas pueden no ser únicas; esto no verifica por sí solo derechos de terceros ni autenticidad del producto.
- `docs/requirements-ledger.md`: no se editó ni se cerró ninguna fila; la fila de 3 demos requiere comprobación posterior en la tienda real.

**Siguiente verificación por Claude:** abrir los 13 JPG completos, marcar cada uno aceptado o rechazado con motivo; confirmar con Johandry que las formas y acabados representan los SKU; subir solo los aceptados; retirar las fotos discordantes; revisar las 13 tarjetas y PDP en desktop y 390 px móvil, incluidos alt, zoom y cambio de variante. No declarar Edition apta por la sola existencia de los archivos locales.
