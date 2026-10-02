# GPT-TASK-016: Fotografía de producto de Sartorial Edition (B-04 · M-03)

```text
ID: GPT-TASK-016
De: Claude (Opus 5.5 Extra) · Líder técnico temporal (CLAUDE-HANDOFF-LEAD-001)
Para: GPT-6 Sol Max / Astra (generación de imagen)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-09-30
Estado: ACTIVO
Tarea paralela: GEMINI-TASK-IMAGERY-001 (Archive). No tocar Archive.
Entrega: demo-assets/edition/ + agent-comms/outbox-gpt/GPT-REPORT-016-edition-imagery.md
```

## 1. Por qué
Los dos auditores rechazaron la fotografía de Edition: 11 de 13 productos muestran otro objeto (montacargas para el pisapapeles, candado sobre teclado para el llavero, jarrón para la bandeja, mochila rosa para el folio…) o repiten foto. Fuentes: `CLAUDE-REPORT-AUDIT-FINAL-003.md:62` y `GPT-AUDIT-017-policy-notes.md:37-49`. Es un P0 para el envío a la Theme Store.

Tu tarea es generar **13 imágenes nuevas**, una por producto, que representen **exactamente** el objeto descrito en su ficha.

## 2. Dirección de arte (igual en las 13)
Tómala del hero ya publicado (`scratch/demo_images/edition-hero.jpg`): hormigón visto claro, luz natural lateral cálida de ventana, sombras suaves y largas, roble natural y acentos de latón.

- **Encuadre:** bodegón de un único objeto, centrado con aire generoso (el objeto ocupa el 55-70 % del alto), cámara a 3/4 o cenital según la ficha.
- **Superficie:** losa de hormigón claro, pulido mate, la misma en las 13. Fondo de pared de hormigón desenfocada o continuo neutro piedra (#D9D6D0 a #E8E5E0).
- **Luz:** una sola fuente lateral izquierda, con temperatura de mañana. Nada de flash duro ni reflejos especulares quemados.
- **Color:** muestra la **primera variante** de la ficha (la que verá el cliente por defecto).
- **Prohibido:**
  - Texto legible, logotipos, monogramas o marcas de terceros. El hero actual muestra un póster "BAUHAUS"; eso no debe repetirse.
  - Personas, manos o caras.
  - Otros productos en el plano, salvo un acompañante neutro si la ficha lo pide.
  - Marcas de agua.
- **Coherencia:** las 13 deben verse como una sola sesión de estudio. Mantén la misma superficie, la misma luz y la misma distancia focal aparente.

## 3. Especificación técnica
- **Formato:** JPG, sRGB, calidad ≥ 85.
- **Proporción:** **4:5 vertical** (las tarjetas del tema son 4:5). Tamaño mínimo **2000 × 2500 px**.
- **Nombre del archivo:** `<handle>-01.jpg`, exactamente el handle de la tabla.
- **Peso:** ≤ 1,5 MB por archivo.

## 4. Fichas por producto (fuente: `scratch/sartorial_edition_products.csv`)

| # | Handle | Título | Variante a fotografiar | Qué debe verse (fiel a la descripción) |
|---|---|---|---|---|
| 1 | `structured-tote` | Structured Tote in Calfskin | Black box calf | Tote rígido de piel de becerro lisa negra, base reforzada, cantos pintados, asas cortas. Frontal a 3/4. Unos 38 × 29 × 13 cm. |
| 2 | `east-west-shoulder-bag` | East-West Shoulder Bag | Black box calf | Bolso de hombro **alargado y bajo** (34 × 18 × 8 cm), piel lisa negra, cierre con lengüeta magnética oculta, correa de hombro. **No** naranja ni tejido trenzado. |
| 3 | `compact-crossbody` | Compact Crossbody | Black grained calf | Bandolera pequeña (23 × 16 × 6 cm) de piel **granulada** negra con correa ajustable. Debe distinguirse claramente del #2. |
| 4 | `leather-document-folio` | Leather Document Folio | Black box calf | Carpeta plana para A4 (34 × 25 × 3 cm), piel curtida vegetal negra, con lazo de bolígrafo plano visible. Cenital o 3/4 bajo. **No** mochila. |
| 5 | `padded-laptop-sleeve` | Padded Laptop Sleeve | Black grained calf | Funda plana acolchada de piel granulada negra (35 × 25 × 2,5 cm) con cremallera de doble cursor. **No** tote. |
| 6 | `zip-travel-pouch` | Zip Travel Pouch | Black grained calf | Neceser con cremallera (25 × 17 × 5 cm), base con fuelle, piel granulada negra. **No** mochila. |
| 7 | `slim-bifold-wallet` | Slim Bifold Wallet | Black box calf | Billetera bifold delgada de piel lisa **negra** (11 × 9 cm), cantos pintados y bruñidos. Cerrada o entreabierta. |
| 8 | `four-slot-cardholder` | Four-Slot Cardholder | Black box calf | Tarjetero plano sin pliegue (10,5 × 7,5 cm) con 4 ranuras y bolsillo central. Debe verse distinto de la billetera #7. |
| 9 | `leather-key-loop` | Leather Key Loop | Black | Tira de piel plegada de 12 × 2,5 cm, costura de retención y **una** anilla metálica. Las llaves son opcionales y sin marca. **No** candado ni teclado. |
| 10 | `leather-desk-mat` | Leather Desk Mat | Black | Vade de escritorio de piel negra (60 × 35 cm, borde de ante visible) sobre un escritorio de roble. Toma cenital o 3/4 alto. **No** bocetos ni papeles con dibujos. |
| 11 | `folded-valet-tray` | Folded Valet Tray | Black | Bandeja vacía-bolsillos de piel **cuadrada** (18 × 18 cm, borde de 4 cm) con las **cuatro esquinas plegadas y remachadas**. Dentro, como mucho, una llave o un reloj sin marca. **No** jarrón. |
| 12 | `milled-brass-paperweight` | Milled Brass Paperweight | Natural brass | Disco macizo de latón natural cepillado (6 cm de diámetro × 2 cm), sin adornos, sobre una hoja en blanco. Primer plano. **No** almacén ni montacargas. |
| 13 | `single-pen-sleeve` | Single Pen Sleeve | Black box calf | Funda cosida de piel lisa negra para **un** bolígrafo (16 × 3 cm), con el capuchón de un bolígrafo genérico asomando. **No** un bolígrafo suelto. |

## 5. Entregables
1. Las 13 imágenes, en `demo-assets/edition/<handle>-01.jpg`. Esa carpeta está en `.gitignore`: **no hagas commit de binarios**.
2. `demo-assets/edition/alt-text.csv`, con columnas `handle,alt`. El alt va en inglés, ≤ 125 caracteres y describe el objeto, el color y el material. Ejemplo: `folded-valet-tray,"Square black leather valet tray with riveted folded corners on a pale concrete surface"`.
3. `demo-assets/edition/PROVENANCE.md`, con una fila por imagen: handle, modelo y versión, fecha, prompt completo y semilla si existe. Cierra **M-03** (licencia de cada imagen) y se archivará con el paquete de envío.
4. Informe en `agent-comms/outbox-gpt/GPT-REPORT-016-edition-imagery.md`, con la cabecera fija de `agent-comms/RULES.md` §1.4. Incluye una hoja de contactos (las 13 en cuadrícula) y la salida de un comando que pruebe las dimensiones, por ejemplo `python -c "from PIL import Image; ..."` sobre los 13 archivos.

## 6. Criterio de aceptación (lo verifica Claude antes de subir a la tienda)
- 13/13 archivos presentes, 4:5, ≥ 2000 × 2500, ≤ 1,5 MB.
- 13/13 muestran **el objeto del título** en la variante indicada. Una persona sin contexto debe poder nombrar el objeto.
- 0 textos legibles, 0 marcas, 0 personas, 0 duplicados, y #2/#3 y #7/#8 claramente distintos.
- Las 13 son coherentes como sesión: misma superficie y misma luz.
- `PROVENANCE.md` está completo.

Se rechaza cualquier imagen que no cumpla, con motivo concreto, y se pide regenerar solo esa. La subida a Shopify (`productCreateMedia` y retirada de la foto vieja) la hace Claude con el conector; no la hagas tú.
