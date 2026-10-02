# DEMO-ASSETS-DIVERGENCE: dos arboles `demo-assets/` incompatibles, ambos gitignorados

```text
ID: GPT-018-DEMO-ASSETS-DIVERGENCE
Generado: 2026-10-02 por Claude (Opus 5, 1M) durante el rescate GPT-018
Arbol A (principal): C:\Users\Johan\OneDrive\Documentos\Drive\Tema Shopify\demo-assets
Arbol B (worktree):  C:\Users\Johan\.codex\worktrees\2482\Tema Shopify\demo-assets
Estado de ambos: IGNORADOS por .gitignore (patron `demo-assets/`). Git no protege nada aqui.
Accion ejecutada por este rescate: NINGUNA. Documento de solo lectura.
```

## Veredicto en tres lineas

1. Los dos arboles **no son dos versiones del mismo trabajo**: son dos generaciones distintas y
   en gran medida **complementarias** de activos de demo (GPT-016/017 en el principal, GPT-018
   en el worktree).
2. Solo hay **2 colisiones de ruta** en total, y las dos son `PROVENANCE.md`. **Ninguna imagen
   colisiona de nombre con otra imagen.** La mezcla es mas segura de lo que el triaje temia.
3. Pero la colision es exactamente donde duele: un `cp -r` de cualquier direccion **destruye la
   procedencia del otro lado** y git no lo detendria, porque la carpeta esta ignorada.

## Arbol A: `demo-assets/` del repositorio principal

| Carpeta | Archivos | Peso | Desglose por extension |
|---|---:|---:|---|
| `demo-assets/` | 3 | 1.65 MB | 2 x `.jpg`, 1 x `.csv` |
| `demo-assets/archive/` | 19 | 6.64 MB | 13 x `.jpg`, 3 x `.py`, 2 x `.md`, 1 x `.csv` |
| `demo-assets/capturas/` | 11 | 6.78 MB | 11 x `.png` |
| `demo-assets/edition/` | 17 | 6.75 MB | 14 x `.jpg`, 1 x `.md`, 1 x `.csv`, 1 x `.py` |
| `demo-assets/images/` | 36 | 53.90 MB | 36 x `.jpg` |
| **TOTAL A** | **86** | **75.71 MB** | |

Caracter: entrega de **GPT-016 / GPT-017 / M-03**. Producto final listo para subir: JPEG sRGB a
2000 x 2500, optimizados, con `alt-text.csv` y scripts `.py` de preparacion. Las fechas de
modificacion son 2026-09-14 (`images/`, `capturas/`, raiz) y 2026-10-01 (`edition/`, `archive/`).

Contiene dos carpetas que el worktree **no tiene en absoluto**: `images/` (36 JPG, 53,90 MB, el
catalogo base del tema) y `capturas/` (11 PNG, 6,78 MB, capturas de secciones del storefront).

## Arbol B: `demo-assets/` del worktree de GPT

| Carpeta | Archivos | Peso | Desglose por extension |
|---|---:|---:|---|
| `demo-assets/` | 1 | 0.00 MB | 1 x `.md` |
| `demo-assets/archive/` | 3 | 13.13 MB | 2 x `.png`, 1 x `.md` |
| `demo-assets/atelier/` | 3 | 13.22 MB | 2 x `.png`, 1 x `.md` |
| `demo-assets/edition/` | 57 | 208.97 MB | 44 x `.png`, 12 x `.jpg`, 1 x `.md` |
| **TOTAL B** | **64** | **235.32 MB** | |

Caracter: entrega de **GPT-018, rol 04 (direccion de arte)**. Trabajo en bruto: PNG sin
comprimir, cada par con su `*-original.png` nativo (1122 x 1402 o 1672 x 941) al lado del
derivado ampliado (2000 x 2500 o 3200 x 1800). Todas las fechas son 2026-10-02.

Aporta dos cosas que el principal **no tiene**:

- **`atelier/`** entera. El principal no tiene ninguna carpeta `atelier/`. Son el hero nuevo de
  la tercera tienda demo mas su `PROVENANCE.md`.
- **Heroes nuevos sin marca** para las tres tiendas. Su razon de ser esta documentada: los heroes
  en produccion que reemplazan mostraban texto de marca de terceros (un poster con la palabra
  "BAUHAUS" en Edition, el texto "STOCKMAN Paris" en el maniqui de Archive). Esa evidencia esta
  en `harness-GPT-018/role-04-art/hero-current/`, **ya rescatada** a este repositorio.
- **33 pares producto-acabado** de Edition (recolores por variante), que el principal solo cubre
  con una imagen por producto.

## Las 2 colisiones de ruta

| Ruta | Arbol A (principal) | Arbol B (worktree) | Mismo contenido |
|---|---|---|---|
| `demo-assets/archive/PROVENANCE.md` | 18102 B | 940 B | **NO** |
| `demo-assets/edition/PROVENANCE.md` | 19490 B | 2032 B | **NO** |

### sha256 de los `PROVENANCE.md` de cada carpeta homonima

| Arbol | Ruta | Bytes | sha256 |
|---|---|---:|---|
| A principal | `demo-assets/archive/PROVENANCE-GPT.md` | 13693 | `32ba6e82b23d7ccec39157e9e3785fdbfc3e2b7de99f690b50891504f6d5e943` |
| A principal | `demo-assets/archive/PROVENANCE.md` | 18102 | `48ed960582b9afe32efae1725b0f8e61e18aedda6b84fb0cdc032f15a3c36411` |
| A principal | `demo-assets/edition/PROVENANCE.md` | 19490 | `fb95dc833160980b2176ce5826fe0bbd0e1612e0c70325712bb1fab7807c70cb` |
| B worktree | `demo-assets/PROVENANCE.md` | 4803 | `270b155a2cfde643deb5856411e6f1d4f5f58286e0139118c4fdfac8d3e96a83` |
| B worktree | `demo-assets/archive/PROVENANCE.md` | 940 | `f3db1b7e67bc1a5928bf2f172866d0ca9264fd78d355253e51f2b1ec62970b61` |
| B worktree | `demo-assets/atelier/PROVENANCE.md` | 773 | `e9a74c12a7087da938f4cce65be2032aa547fc45d78a0126775f91d9118ebd8a` |
| B worktree | `demo-assets/edition/PROVENANCE.md` | 2032 | `9aeae1e56563cd49eab6a08fb15746ee45f03561aeed694a496284c5b9b423c5` |

Hay **3** archivos de procedencia en el principal y **4** en el worktree. Solo dos rutas coinciden
(`archive/PROVENANCE.md` y `edition/PROVENANCE.md`) y en ambas el contenido difiere por completo.

### Que dice cada uno de los dos pares en colision

**`edition/PROVENANCE.md`**

- *A, 19.490 B*: "Sartorial Edition image provenance", en ingles. Tabla de 13 handles con
  generador, fecha, seed y el prompt completo de cada JPG. Documenta los 14 JPG del principal.
- *B, 2.032 B*: "# Edition", en espanol. Documenta el hero nuevo y los 33 pares por acabado, y
  delega los detalles en `../PROVENANCE.md` (raiz) y en el manifest del arnes. **No menciona ni
  uno** de los 14 JPG de A.

**`archive/PROVENANCE.md`**

- *A, 18.102 B*: "Sartorial Archive Image Provenance (M-03)", tabla de 12 prendas con generador
  (Imagen 3 / gemini-3.1-flash-image), dimensiones, peso y estado de verificacion. Junto a el,
  `archive/PROVENANCE-GPT.md` (13.693 B) cubre los 8 handles generados por OpenAI `image_gen`.
- *B, 940 B*: dos parrafos sobre el hero nuevo de Archive y la inspeccion del retirado. **No
  menciona ninguna de las 12 prendas.**

La conclusion es la que importa: **los dos textos describen conjuntos de imagenes disjuntos.**
Ninguno es una version mas nueva del otro. Sobrescribir uno con el otro no "actualiza" nada: borra
la unica documentacion de 26 imagenes que siguen en su sitio.

## Por que no se toco nada

`demo-assets/` esta en el `.gitignore` del proyecto (linea `demo-assets/`), en **los dos arboles**.
Eso significa tres cosas:

1. `git status` no muestra cambios ahi, asi que un sobrescribo no deja rastro visible.
2. No hay blob en el historial del que recuperar el archivo pisado. **No hay deshacer.**
3. El worktree, ademas, vive bajo `.codex/`, que tambien esta ignorado: su arbol de 235.32 MB
   desaparece completo en cuanto alguien limpie el worktree.

Por eso este rescate se limito a **inventariar y publicar los sha256**. Mover bytes aqui es una
decision de procedencia y de peso de repositorio, no una tarea mecanica.

## Evaluacion de la propuesta del triaje previo

> Propuesta: mover los activos del worktree a `demo-assets/gpt-018/` en el principal y **anexar**
> (no reemplazar) sus secciones de PROVENANCE.

**La respaldo en su principio y la corrijo en su forma.** El principio (namespace separado +
anexar en lugar de reemplazar) es exactamente lo correcto: elimina las 2 colisiones de un golpe y
no pierde ni un byte de procedencia. Tres correcciones:

**Correccion 1: `gpt-018/` como prefijo plano rompe las rutas que el tema espera.** Las imagenes
de demo se referencian por tienda (`edition/`, `archive/`, `atelier/`). Si todo cae en
`demo-assets/gpt-018/edition/...` hay que reescribir cada referencia. Mejor conservar el eje de
tienda y separar por generacion **dentro** de ella:

```text
demo-assets/edition/PROVENANCE.md        <- A, intacto, + seccion anexada que apunta a gpt-018/
demo-assets/edition/<14 JPG de A>        <- intactos
demo-assets/edition/gpt-018/             <- 56 activos de B + su PROVENANCE.md de 2.032 B
demo-assets/archive/gpt-018/             <- 2 PNG de B + su PROVENANCE.md de 940 B
demo-assets/atelier/gpt-018/             <- 2 PNG de B + su PROVENANCE.md de 773 B  (carpeta nueva)
demo-assets/PROVENANCE-GPT-018.md        <- el PROVENANCE.md raiz de B, renombrado: la raiz de A no tiene uno
```

Asi **ninguna ruta existente cambia** y las 2 colisiones se vuelven 0. El `PROVENANCE.md` de la
raiz del worktree (4.803 B) no colisiona con nada, pero renombrarlo a `PROVENANCE-GPT-018.md`
evita que un futuro `PROVENANCE.md` raiz de otra generacion lo pise. Hay precedente en el propio
repositorio: `archive/PROVENANCE-GPT.md` ya convive con `archive/PROVENANCE.md` por esta razon.

**Correccion 2: "anexar" tiene que ser un puntero, no un copiar y pegar.** Si se pega el texto de
B al final de `edition/PROVENANCE.md` de A, el lector no sabe que afirmacion cubre que archivo.
Los dos textos usan idiomas distintos (ingles / espanol) y describen conjuntos disjuntos. La
seccion anexada debe ser corta y decir solo: que generacion es, que rutas cubre, y donde esta su
procedencia completa. Dos o tres lineas con un enlace relativo a `gpt-018/PROVENANCE.md`.

**Correccion 3: antes de mover, decidir el peso.** El arbol B pesa 235.32 MB, **3.1 veces** el
arbol A entero. Casi todo es PNG sin comprimir y la mitad son los `*-original.png` nativos que
existen solo para no perder el archivo previo al upscale. Antes de mover nada:

- Los 12 `*-source.jpg` de `edition/` **no hay que moverlos**: son byte a byte identicos a 12 JPG
  de `harness-GPT-018/role-04-art/sources/`, que **ya estan rescatados** en este repositorio.
  Verificado por sha256. Eso descuenta 5,09 MB y 12 archivos del traslado.
- Los derivados `*.png` de 2000 x 2500 son candidatos a convertirse a JPEG sRGB q85-89 antes de
  entrar, que es exactamente lo que el arbol A ya hizo con su generacion. Reduce el orden de
  magnitud sin perder el `*-original.png`.
- `demo-assets/` seguira ignorado en cualquier caso, asi que esto no afecta al peso del clon
  **mientras no se decida versionarlo**. El riesgo real no es el peso: es que sigue sin respaldo.

## Recomendacion final, en orden

1. **Primero, respaldo, no reconciliacion.** Copiar el arbol B completo tal cual a un destino
   fuera de `.codex/` (por ejemplo `OneDrive/.../demo-assets-gpt-018-raw/`) **antes** de tocar
   cualquier otra cosa. Mientras B solo exista en el worktree, cada minuto es riesgo. Esto es
   reversible y no decide nada.
2. **Luego, la reconciliacion de la correccion 1**, cuando Johandry confirme que quiere los
   activos de GPT-018 en el repositorio.
3. **Nunca un `cp -r` de un arbol sobre el otro, en ninguna direccion.** Son las 2 rutas de
   `PROVENANCE.md` las que se perderian, y con ellas la procedencia documentada de 26 imagenes
   (arbol A) o de 33 pares producto-acabado y 3 heroes (arbol B).

## Anexo: inventario completo del arbol B (worktree), por si se limpia

| Ruta | Bytes | sha256 |
|---|---:|---|
| `demo-assets/archive/hero-original.png` | 2224560 | `1714f4509ad5021b35abbf959ff1951be51a8d14f253e4aa40d202d5e2d6c418` |
| `demo-assets/archive/hero.png` | 11541010 | `7e17198e92266d2782bbe5733a31eff033e84aea04a12ce4f83088795a28b8bf` |
| `demo-assets/archive/PROVENANCE.md` | 940 | `f3db1b7e67bc1a5928bf2f172866d0ca9264fd78d355253e51f2b1ec62970b61` |
| `demo-assets/atelier/hero-original.png` | 2100919 | `700de87e1a61cc299567f44d42703b738abefea4973830925a841b45bdc7d71b` |
| `demo-assets/atelier/hero.png` | 11761867 | `e1aa3a159a8b24b0bb64bc970c595a7f70f78200d88a8fa553f5f9ee39e6d69d` |
| `demo-assets/atelier/PROVENANCE.md` | 773 | `e9a74c12a7087da938f4cce65be2032aa547fc45d78a0126775f91d9118ebd8a` |
| `demo-assets/edition/compact-crossbody-black-grained-calf-source.jpg` | 493550 | `b31a94f48597d076d496adef5244065c5a256a51e6f225219aa338983e4e24cd` |
| `demo-assets/edition/compact-crossbody-deep-olive-original.png` | 2088502 | `291e0f61ebbda9384e6d01753fd4161ce1d23a9a13fd0b55cb313f82db4ef711` |
| `demo-assets/edition/compact-crossbody-deep-olive.png` | 7375665 | `1e274948e115572d96d7fd5c8e494414c035ed4b6047c7721f0b1b04c915f670` |
| `demo-assets/edition/compact-crossbody-stone-original.png` | 2206203 | `41665d079b2c105d74e103ae0db2b216c92bd2e1c1a185fdd795667f2de245a3` |
| `demo-assets/edition/compact-crossbody-stone.png` | 7952449 | `bc4919787eae5810678e89eb944ce46051779002762c8db9578298d69f007870` |
| `demo-assets/edition/east-west-shoulder-bag-black-box-calf-source.jpg` | 279005 | `51cc482785c27b908173c2f5ae5e3368f7ff1e078d259aa39421a8f55ce7671a` |
| `demo-assets/edition/east-west-shoulder-bag-oxblood-original.png` | 1680711 | `111787cf33217ce29ba619899f22dc14d594dc91e6f30de2ace4c4f8915ad865` |
| `demo-assets/edition/east-west-shoulder-bag-oxblood.png` | 6145642 | `028b17f47faea812eab28d725a69d91fce69f6c6471bbe558998672fc34aada2` |
| `demo-assets/edition/east-west-shoulder-bag-saddle-tan-original.png` | 1625829 | `56ff2fcc5c6f93d1c97cb61d56686c2a65be58c1436c5475bed83689dac2bd5a` |
| `demo-assets/edition/east-west-shoulder-bag-saddle-tan.png` | 6019129 | `f709a0c428699d36d60b3651285938bdee187de261bcfad2746935a19f7efdd7` |
| `demo-assets/edition/folded-valet-tray-black-source.jpg` | 417970 | `b31f905d7339968d5fb76e28cdcd626a2e5ba974b86e7061d6163a4f5cb415f2` |
| `demo-assets/edition/folded-valet-tray-deep-olive-original.png` | 2055113 | `d05b38fdf1ec18ea67f2df6fd34b21a538b6aae2512dc7558e7cc46d61e214d4` |
| `demo-assets/edition/folded-valet-tray-deep-olive.png` | 7783047 | `b9dcc35bbb9fcbc71d98259f77a3638736d45935f4fe3cc52cb33bbec4491a78` |
| `demo-assets/edition/folded-valet-tray-saddle-tan-original.png` | 2112157 | `74a4da4cbb97d2147f403fa6ca0ccddc8a5fbefca4851b7c82c71c31b88a13f2` |
| `demo-assets/edition/folded-valet-tray-saddle-tan.png` | 8566728 | `3135e7930f289cd6e39de4a3eafc782240b208f8cd119ff2cdf8540faf58bc84` |
| `demo-assets/edition/four-slot-cardholder-black-box-calf-source.jpg` | 459010 | `93bb54153887595a79365c8bd9b9b27edfdf0865aca7d2a6d312f5006d41f435` |
| `demo-assets/edition/four-slot-cardholder-oxblood-original.png` | 2095879 | `1bbcf8135e8f7ca6bf439e795fcefbf0edc9903838275e3574b419f4a9a977d4` |
| `demo-assets/edition/four-slot-cardholder-oxblood.png` | 7475886 | `a5a1931d69db5671998af8b8d0729b2cdc6d1413c9b66fc9770cc1bcb170100a` |
| `demo-assets/edition/four-slot-cardholder-saddle-tan-original.png` | 2168501 | `03621d30fc5c1be0e09c38c2d894bf77194f00a3d5c622e2d35098fab0951b0a` |
| `demo-assets/edition/four-slot-cardholder-saddle-tan.png` | 7876510 | `9784ec622c989d4c5239ee003029cb9da1041274eb01844b673746d4ed5a25fe` |
| `demo-assets/edition/hero-original.png` | 2379089 | `c7f2e04b792fcb2e759577c79ae8a152b7ec54f464f8152b2c8830b4a491b37b` |
| `demo-assets/edition/hero.png` | 12451771 | `13c74c38a927f735bc19151a5531c8214992aba4cef0a7b3b1472dab17e35ccd` |
| `demo-assets/edition/leather-desk-mat-black-source.jpg` | 420418 | `ac6063cf28f6eafd811309d7802b359bba48f6311ac1149c4ae87e2c8bdd5bb7` |
| `demo-assets/edition/leather-desk-mat-dark-umber-original.png` | 1938949 | `8eccc0c5ffa66389a293f5633940abf01dbec021553f0af3b47c9811b42d810f` |
| `demo-assets/edition/leather-desk-mat-dark-umber.png` | 8075067 | `c65fdd929d1ca462b0eab0b790af59a487e1684b86de7d64e3c994857e37541e` |
| `demo-assets/edition/leather-document-folio-black-box-calf-source.jpg` | 402867 | `2ce69f2c0770438736c0036701fc164ac8bfc9b28c1928b3adff6f4cee39547e` |
| `demo-assets/edition/leather-document-folio-saddle-tan-original.png` | 2087174 | `1a7b10e2202fd09348ae12a09ab1dbc66018f8cf1924730b6f132ecd7e16020c` |
| `demo-assets/edition/leather-document-folio-saddle-tan.png` | 7950592 | `e4b889b6caa283260b7eadd3d325e8dbcc5842f687a6084525b334d9dccd1192` |
| `demo-assets/edition/leather-key-loop-black-source.jpg` | 375054 | `651fba7bd7fdf2a940a37dc2c7bcf138f4bc5159a7933e6ff8742b5c376e88fa` |
| `demo-assets/edition/leather-key-loop-deep-olive-original.png` | 1884381 | `e68c4228e905ed45fe895d3c86e596f733d68fb270dbfb5ffe9316361e19ccfd` |
| `demo-assets/edition/leather-key-loop-deep-olive.png` | 6907120 | `11ccf660704baf0b73b101ccda901e13d63c75caded5ef207b8dddb812f31c3c` |
| `demo-assets/edition/leather-key-loop-saddle-tan-original.png` | 1873696 | `9a21781803ddfef3afe8205c0c1dc133563a9484b0e03691864674e774b43d47` |
| `demo-assets/edition/leather-key-loop-saddle-tan.png` | 7099491 | `4c30fefafc613071529141cfb6ecabf7ec780e9dedd59443603fcd74a51d5d4f` |
| `demo-assets/edition/milled-brass-paperweight-dark-patina-original.png` | 1622502 | `a6efc87eff232eebd5fec03552f08028c3ca6ecda127ec10f8b529dffd9b509f` |
| `demo-assets/edition/milled-brass-paperweight-dark-patina.png` | 6064150 | `eb62687f8e3f27a5fab0e58b481da66495c58e376a928a8394655c8357475b2d` |
| `demo-assets/edition/milled-brass-paperweight-natural-brass-source.jpg` | 269450 | `5021b6ff9d0da23f97faac66514ed8606cfd76353e7ac4e93cf3fa72a6416f9d` |
| `demo-assets/edition/padded-laptop-sleeve-black-grained-calf-source.jpg` | 551731 | `14f11cbd3ab94e17c406cccc132e3b459506c402464952d08d5f8208de0cb19b` |
| `demo-assets/edition/padded-laptop-sleeve-dark-umber-original.png` | 2224252 | `bc1430fbee48136d520e1d424d5cd6dd1d090ed018d2ece0b719f31770bf8e80` |
| `demo-assets/edition/padded-laptop-sleeve-dark-umber.png` | 7688850 | `df9a86530b1d339e31dad136756963cdf9c49c6523aedb427cdf879d445ee7ad` |
| `demo-assets/edition/PROVENANCE.md` | 2032 | `9aeae1e56563cd49eab6a08fb15746ee45f03561aeed694a496284c5b9b423c5` |
| `demo-assets/edition/single-pen-sleeve-black-box-calf-source.jpg` | 373736 | `4755437a633f50e052852cd71c6b887d3641e744808d7f4a0443d8c5a6b6427f` |
| `demo-assets/edition/single-pen-sleeve-saddle-tan-original.png` | 1896503 | `8029167488f4e4cecd7e41f22e602665b1a3ce12a0606f3654c578a4ea4c9aa1` |
| `demo-assets/edition/single-pen-sleeve-saddle-tan.png` | 7311421 | `b97aa168fed1c9a6a2a9e401d1e61e422b95c7e8289d939b45bcf543b3eff875` |
| `demo-assets/edition/slim-bifold-wallet-black-box-calf-source.jpg` | 426402 | `ff4987ad2ca588ea49d7bf21f006752e03146b80e606b4ff20a8c8d6af928c2f` |
| `demo-assets/edition/slim-bifold-wallet-saddle-tan-original.png` | 1993230 | `f8a1d973f347f2d7821d8277ba47ace05e4d57c16d0e69a0cf7df184cfcfda93` |
| `demo-assets/edition/slim-bifold-wallet-saddle-tan.png` | 7567208 | `9deeb988e1224e87205a7cb18a98b566bc3b84698c0d08695d01a23b440ec367` |
| `demo-assets/edition/tote-black-box-calf-original.png` | 1944359 | `b2887f05cc6290af63d65f69f8e15b60544103550ea71b0640c46e734525bf26` |
| `demo-assets/edition/tote-black-box-calf.png` | 7839359 | `a97ac34b84d5b1bc6d88ab89c810fa738e026fcfeccbd33798b9f0a4e0d656ae` |
| `demo-assets/edition/tote-deep-olive-original.png` | 2033086 | `fafd48543cda96a61d5390aa6ba599dea8cbf701dd28afd27256f0be98064277` |
| `demo-assets/edition/tote-deep-olive.png` | 7965164 | `8e5ed84c0673adc8560e8f906b20c9a6fd5bd93a088a5d4a4db924aac22540f2` |
| `demo-assets/edition/tote-saddle-tan-original.png` | 2047529 | `459f8ca152ac967061035bc2a8e5ad30072397bb3f93de38df7ed2dcc59e880b` |
| `demo-assets/edition/tote-saddle-tan.png` | 8287571 | `91f849050ee5ecaec8d5987d6ec6e1609abf4fe7cce5e7df2ecac43f537ccf41` |
| `demo-assets/edition/zip-travel-pouch-black-grained-calf-source.jpg` | 489973 | `2f18ccc3f95a8ec942238f9fbaa7feb1cbdd8af81a34a5ce50dbf27165566437` |
| `demo-assets/edition/zip-travel-pouch-deep-olive-original.png` | 2082392 | `ac7aa2e6f349a1ba131a29b5bb71c96f3ce8628c1188c2ee24f28213968ef6e1` |
| `demo-assets/edition/zip-travel-pouch-deep-olive.png` | 7504695 | `3b2daf747deb4fb18d3b9db83e3729fb5aaf868b5ab8086be37ac14bafa74b33` |
| `demo-assets/edition/zip-travel-pouch-saddle-tan-original.png` | 2111774 | `562a8057973c8bb8481f7c6d4d83f92400ad5d5958acfce0ec99dbce9b0c8719` |
| `demo-assets/edition/zip-travel-pouch-saddle-tan.png` | 8100177 | `768b3519bcad01e23ae53e59eafee7afcd0c55f745cc20dc444c5d42d6f85c80` |
| `demo-assets/PROVENANCE.md` | 4803 | `270b155a2cfde643deb5856411e6f1d4f5f58286e0139118c4fdfac8d3e96a83` |

El inventario del arbol A no se reproduce aqui: ese arbol no esta en peligro, sigue en su sitio en
el repositorio principal y su procedencia esta documentada en sus propios 3 archivos PROVENANCE.
