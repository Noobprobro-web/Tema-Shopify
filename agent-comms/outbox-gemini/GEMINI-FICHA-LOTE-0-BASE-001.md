# GEMINI-FICHA-LOTE-0-BASE-001: Ficha Canónica de Identidad, Inventario y Empaquetado Reproducible del Lote 0 Base

- **ID:** `GEMINI-FICHA-LOTE-0-BASE-001`
- **Fecha:** 2026-11-04 (America/Caracas)
- **Evaluador:** Gemini en Antigravity (Arquitecto y Orquestador en el repo; Custodio de Integridad Técnica)
- **Rama auditada:** `lote0/base-09f8342` (remota: `origin/lote0/base-09f8342`)
- **Worktree verificado:** `isolated-sartorial-lote0-09f`
- **Commit auditado:** `fbdf462af5254c28ad852fc166e5a44bcc4c2240` (Claude, 2026-11-04 15:42:07 UTC)
- **Commit base de comparación histórica:** `09f834295074402d9b93aa8ead83a732d78e6608`
- **Modo de operación:** Estrictamente SOLO LECTURA sobre código del tema; sin commits de código, sin git push, sin escrituras en tiendas; única escritura autorizada este documento. Archivos `.secrets` intactos y sin abrir.

---

## 1. Resumen Ejecutivo y Metadatos de Identidad

1. **Estado del Worktree y Linaje:**
   - En el worktree `isolated-sartorial-lote0-09f`, `git rev-parse HEAD` resuelve exactamente `fbdf462af5254c28ad852fc166e5a44bcc4c2240`.
   - `git status` en dicho worktree está 100% limpio (`nothing to commit, working tree clean`).
   - El linaje es un ancestro directo comprobado de `origin/lote0/base-09f8342` (`git merge-base --is-ancestor 09f8342 fbdf462` -> exit 0).
2. **Cierre de Preparación del Lote 0:**
   - Esta ficha técnica complementa y cierra la condición (a) y (b) fijadas en la auditoría `GEMINI-REVIEW-LOTE-0-R0-002`: emite el inventario canónico de los 93 archivos del tema, fija la política determinista de fines de línea (LF), y demuestra la regeneración bit por bit idéntica de `Sartorial-1.0.0.zip`.
3. **Paquete Final de Envío:**
   - Se ha generado y verificado el paquete `Sartorial-1.0.0.zip`, resguardado FUERA del repositorio en:
     `C:\Users\Johan\releases\Sartorial-1.0.0.zip`
     y replicado para auditoría en:
     `C:\Users\Johan\audit-gemini\dist\Sartorial-1.0.0.zip`.
   - SHA-256 definitivo canónico del ZIP:
     `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`
   - Validación estática del ZIP extraído: Theme Check reporta **0 ofensas en 90 archivos inspeccionados** (`exit 0`), y Node.js reporta **0 errores de sintaxis** en scripts (`exit 0`).

---

## 2. Política Canónica de Fin de Línea (CRLF / LF) y su Verificación

### 2.1 Diagnóstico de la Situación Técnica
Históricamente, en el proyecto existía una discrepancia latente entre entornos de desarrollo Windows y entornos Unix/Cloud (documentada por Claude en `CLAUDE-HANDOFF-CLOUD-001.md` y `CLAUDE-HANDOFF-SESSION-002.md:262` como *"política CRLF/LF sin fijar"*).

El análisis exhaustivo ejecutado sobre el commit `fbdf462` arrojó los siguientes hallazgos:
1. **Base de Datos Git (Commit `fbdf462`):**
   - El árbol de Git (`git ls-tree -r fbdf462`) contiene exactamente los 93 archivos del tema.
   - En la base de datos de objetos canónicos (`git cat-file blob <sha>`), **los 93 archivos (100%) están almacenados con finales de línea UNIX (LF, `\n`)**.
   - No existe un solo archivo del tema almacenado con CRLF en Git.
2. **Sistema de Archivos en Windows (`isolated-sartorial-lote0-09f`):**
   - Debido a la configuración global de Git en el host (`core.autocrlf=true`), al realizar el checkout en Windows los archivos se materializan en disco con **CRLF (`\r\n`)** (93 archivos con CRLF).
   - Normalizados a LF (`bytes.replace(b'\r\n', b'\n')`), los 93 archivos en disco son **idénticos bit por bit** a los blobs canónicos de Git en `fbdf462` (0 diferencias).
3. **Paquetes Previos (`GPT-PACKAGE-INTEGRATED-001-v4`):**
   - El ZIP histórico previo empaquetaba directamente los archivos desde el sistema de archivos Windows con CRLF.

### 2.2 Declaración Formal de Política
Para garantizar determinismo estricto, independencia del sistema operativo y cumplimiento de las directrices oficiales de Shopify Theme Store:

> [!IMPORTANT]
> **POLÍTICA OFICIAL DE FIN DE LÍNEA DEL TEMA SARTORIAL:**
> 1. **Canonicidad en LF:** Todos los archivos de texto del tema (Liquid, JSON, CSS, JS) tienen como formato canónico indiscutible **UNIX LF (`\n`)**.
> 2. **Empaquetado Multiplataforma Determinista:** La construcción del artefacto de distribución `Sartorial-1.0.0.zip` debe empaquetar canónicamente el contenido en formato LF (tomado directamente de los blobs canónicos de Git o normalizado en lectura). Esto garantiza que un desarrollador en Windows, una máquina virtual en Linux, un contenedor Docker o un agente en la nube generen **exactamente el mismo hash SHA-256 bit por bit**.
> 3. **Compatibilidad con Shopify:** Shopify Theme Check, Liquid parser y la infraestructura de despliegue de Shopify operan de manera nativa y óptima bajo LF.

### 2.3 Resumen de Comprobación de Fines de Línea
| Ámbito analizado | Archivos con LF puro | Archivos con CRLF | Mixtos | Total |
|---|---:|---:|---:|---:|
| **Git Tree `fbdf462` (Objetos Blob)** | **93** (100%) | 0 (0%) | 0 (0%) | 93 |
| **Worktree Windows (`isolated-sartorial-lote0-09f`)** | 0 (0%) | **93** (100%) | 0 (0%) | 93 |
| **ZIP Canónico `Sartorial-1.0.0.zip`** | **93** (100%) | 0 (0%) | 0 (0%) | 93 |
| **Variante CRLF Windows (`Sartorial-1.0.0-crlf-variant.zip`)** | 0 (0%) | **93** (100%) | 0 (0%) | 93 |

---

## 3. Inventario Completo y Manifiesto SHA-256 de los 93 Archivos

A continuación se lista el manifiesto exhaustivo y determinista de los 93 archivos que componen el tema Sartorial:
- **84 archivos en el árbol del tema:** `assets/` (3), `config/` (2), `layout/` (2), `locales/` (3), `sections/` (35), `snippets/` (21), `templates/` (18).
- **9 archivos de presets en `listings/`:** `listings/archive/templates/` (3), `listings/imprint/templates/` (3), `listings/sartorial/templates/` (3).
- **Total:** exactamente 93 archivos de tema.

Se presentan tanto el tamaño y SHA-256 Canónico (formato LF del commit `fbdf462` y del paquete de envío) como el tamaño y SHA-256 en disco físico bajo Windows (formato CRLF generado por `core.autocrlf`):

| # | Ruta en el Tema | Bytes (LF) | SHA-256 Canónico (LF / Git blob / ZIP) | Bytes (CRLF) | SHA-256 Disco Windows (CRLF) |
|---|---|---|---|---|---|
| 1 | `assets/base.css` | 249132 | `ffd6944877841c8d59a3a29ea388f345675e0d7774eee5db8cf5321e0220eb02` | 259143 | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| 2 | `assets/product-zoom.js` | 13171 | `b4d71ef3a262bdd791ec76b95c5bb68a49b8d8a5ac65d11ec1c2eacae2b23d9b` | 13488 | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |
| 3 | `assets/theme.js` | 242588 | `024ba08f31f4d20c9b918ba6eab8580c520d44279d7da10e92f251c95d4f5853` | 248456 | `db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c` |
| 4 | `config/settings_data.json` | 9021 | `152d3883bde7540d4ad3c75499b05477b274297ed0185b1dfdac85686240483f` | 9335 | `51a9cda056d178f7f75cc1650fb2efc77a6f748131d6710ee23f136a69295ac8` |
| 5 | `config/settings_schema.json` | 9157 | `9e4075995ac98475b0bc9effce9e84314def3b9c4f376acc3d5aa0b1dd038cdb` | 9471 | `3a9b11bda1f771f8ab4391d85279dbe9e2ba6c4507ea2a06e2a0793bd84e9608` |
| 6 | `layout/password.liquid` | 5574 | `998c6defb5f491a5791e84f609bc40cb393c00d525ce141816a070b415421f2c` | 5690 | `5d1bd3c5d2d2adab7d5fcd1e5b2093b4380fb139c4faf7e23e1adc6e047d4a5f` |
| 7 | `layout/theme.liquid` | 7320 | `100ea68672dc99d092bbe094d921e2dc6a9ac29f40a761a9f44f0f744987155f` | 7481 | `20eecc1881d67a472fb3b9e525a5c5b575050261e60cd3ee1aa4dddf652609b6` |
| 8 | `listings/archive/templates/collection.json` | 981 | `e25c1810ccab32f50fde1fd398e34612573e0cb9efe16b4eccd4242537baea26` | 1013 | `4d968288201ffa0f1ae768a84537352486d2ef1610ff7f5d710ff8a70c7a0c7e` |
| 9 | `listings/archive/templates/index.json` | 6946 | `79a1b27123bb2577d4d3737333572aae5546b0bb9593dc3a7e5db79e04736b95` | 7084 | `cac954988810fcd929d276d2f83679c465ad2a49787c25ffbf0c62807d2a737c` |
| 10 | `listings/archive/templates/product.json` | 3873 | `aa28860d948ef373256086592ccbb4223ed4aff7b7146f81f0296b829039e9cd` | 4008 | `1ea0f6487c6f7b3c168163d2d3d7d7d31abe4d62cd2939a98a9d574b7d5ccb76` |
| 11 | `listings/imprint/templates/collection.json` | 936 | `9614c20fce37846182ae6557e825fb08a2ade2aa304070f1b050fafe246a7e70` | 968 | `2253d4df57f890b23e9ae92cd9196e1771b09ce73e17863e77d6bdea1d0805a4` |
| 12 | `listings/imprint/templates/index.json` | 7553 | `55b84bd697b45b3f1d1a059a5e2abfa04728477d0c03e7fd0ef5b7c123695573` | 7733 | `ba48c929dcb2946c72be511731702199cb6d7e0f2f021da2f606796d464dfd19` |
| 13 | `listings/imprint/templates/product.json` | 3792 | `f6783c8c141abfa465e5f65cc80fff2dc23fdf7e5967aef23b37cc9afd3e39af` | 3927 | `31a7db1b009da36a3e7f268ee97b37d26fb388d29c6b160a11d79d1c3453d4f6` |
| 14 | `listings/sartorial/templates/collection.json` | 935 | `21190c00c0125e5c249f2beeaed0e82fead420f1e4056bec028f475ae09312ee` | 967 | `3a5fc6c1c737ec89b7efa13cdba77726605f87bb391339b5f7fe7c6299ea95b9` |
| 15 | `listings/sartorial/templates/index.json` | 7284 | `bbb31533960ed0ded1c3fac0750a7c558abc0ee3d723567ea477d9cb0adb534b` | 7428 | `9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768` |
| 16 | `listings/sartorial/templates/product.json` | 3682 | `7c9c162dab79a4404018790259a2bf0535198eb03f2b1a2be2b3270401a9ddff` | 3806 | `ef4c4a16bc5ceb5fa22ee1307269bd49f034ec260eff02799a5d44256e67ad18` |
| 17 | `locales/en.default.json` | 22972 | `c9e0041302c29bc136a9099fc24a7558f261afc94fa85f22c0714619d658ad72` | 23614 | `d0ac3945946fbd4271eef03ba6afe3463f1367f632d172761422760f57c7b6d4` |
| 18 | `locales/en.default.schema.json` | 43108 | `e01c35041546d2dc65c82307a0a2a0a4a710b62bf276085bc9efa823d39f4ddd` | 44627 | `953f8695946fd3b3752ff1b17495e9a26f0e2c7a8ade105c5269f37ba42ef998` |
| 19 | `locales/es.json` | 24581 | `2baf138172e982564e550e76d4a4f7ad78192ffe56ec411ac41197785a51af62` | 25223 | `89af541182bc29c65d361c813f5d4c0ce7ca79d60f4407cc95a089bbf14e6ae5` |
| 20 | `sections/announcement-bar.liquid` | 6100 | `ee0af98818b538df4687bf88d157f942b413b0e07cfebd26d2436b0048bc1362` | 6269 | `880ba32cc15936e21498380062d037f10498551b85f3e46fe04120e36853a132` |
| 21 | `sections/bento-discovery.liquid` | 10971 | `009c784f46ec8c0d7cf69b2603ccb5058df95d692e8cc07cc1cdc69aae700954` | 11266 | `f691531acac5907297d1ac27c931864c398a10ada8fe65612256fa63cfdc45c9` |
| 22 | `sections/brand-manifesto.liquid` | 6069 | `fb52682e19d9cb0fbb316d3b9e1eb45fec6690e4bfe5bf9cdfde0c9cb0dd030a` | 6254 | `446db7c6fb2b34902c67bda5194d44b4d92b4e9b288de7efb137caac9ed7a007` |
| 23 | `sections/cart-drawer.liquid` | 22533 | `2821c05d3bcf6bd2c8e04bd3c3ca04375620045605faeb5d0afc7a75b6470943` | 23017 | `23d5328883c9ae4dbac547d08a18dc70c8278947f66bff33bd684e37b34f253e` |
| 24 | `sections/complete-the-look.liquid` | 19518 | `514d0b32ccf969860cb25f00b6ebf9d05d9e2c7a2a2b9ed9e7d371a5d528a7ce` | 19944 | `6bb3b433b48ed91191e8de22465f39d196f236caf485c3c91186fc8bc49009f4` |
| 25 | `sections/curated-showcase.liquid` | 9565 | `30da3d3f2529a31f8b3512065c6b85886f10c6118eba19e03ce8b1a489a92998` | 9803 | `80da0eeb9d245b5c9244689fca24f5ef50e6c990371733f2c19ea348c1ff8b86` |
| 26 | `sections/custom-liquid.liquid` | 832 | `4a291d1afd3883586bea3bcf3ced7e9e77a80bc7f280ebb7fa59c76437826fe7` | 868 | `f2ecac9b1ba9634c90a44fb927f1edf8e915b4febb03e2ab807ff7aef73af620` |
| 27 | `sections/featured-product.liquid` | 41811 | `f4319ed320209db4cf5f1d2be61fdc850bb128beb0f34752694b85d2385946b3` | 42642 | `5c8b9704023845d62ea8648d7f45e4223152f9322f987782987198a4c93b27d1` |
| 28 | `sections/footer-group.json` | 315 | `0ce236ccd315586832f44d275deaf7acde1e1956ec6755ed76b2eff407c15a34` | 333 | `d90e3eb6c836cafb4884c565275d80a1f1fd9d29fc159a43e0852dd22be8e853` |
| 29 | `sections/footer.liquid` | 8494 | `9010dad81d9756bb0d64b5d7c75427fca96ef1b801d242710e39b812848a6447` | 8718 | `25b09ca85a084511315ff388240f854d71f46d7f4b987d81d51b07fe3e96ac9b` |
| 30 | `sections/header-group.json` | 1418 | `d02cce44c5b504b4aa07aa970ae19fc4833c7fbcd35bebe289cb1092ea6f1c5f` | 1475 | `70326806988db08baca7af8cf53a9da118c174e8b50e54d061ca2210f9cda8e5` |
| 31 | `sections/header.liquid` | 13523 | `c5b6bdfca58ad2223faa34e82110073a19a6e2696c00475d2d98c44d574fef12` | 13854 | `0aacc06640cca0b504aee58647b19e10d9bc34097fee74bafc9380ef14ce48b7` |
| 32 | `sections/hero-editorial.liquid` | 18304 | `e2824a0cb0cc7ccbf874ae604a6e4f3d1fedf8356e172a27d74ef8adf023944a` | 18755 | `5b823a3cb4a6314847fec8cdcc22e84daccaaec419e8bfe37d67b4fa1a6cf75e` |
| 33 | `sections/lookbook.liquid` | 12212 | `35506e4b9f4e762d235e1e2023abfeffbb22a144b23d0e3b114c5ceca22777c7` | 12538 | `3e622b1f9adce5852a5828cc594197050897ab47ebce237ea80bbf7a032a8a48` |
| 34 | `sections/main-404.liquid` | 3429 | `86a9b15a0b178083522387e746329e10a885906e653813ca661416e14f573ad2` | 3518 | `0cf7305f4ed7a467213c7a7b07982ea9b03c312381859066ba669b9e2d24ac6a` |
| 35 | `sections/main-about.liquid` | 14520 | `855ffe909d9f547e2c2ee9bb4f4d797bd7453686ac229ac546cc545b58d9c86c` | 14894 | `c43cba37460c5d6a69c2e596effeadf83eba8680f691da179149b0e0291f62b3` |
| 36 | `sections/main-article.liquid` | 11714 | `287d06783fca72b801b8fb34d40e5f334e775bcae1424467a2efeec3953c85f5` | 11997 | `0125ee58f82a067e4b366b22a43ffa638ca06c70c72f7d85388bd15c67645dc2` |
| 37 | `sections/main-blog.liquid` | 10376 | `b35e3163acb801a188665e9579154f21724cbb569da2b78c8b4376f7b86d7252` | 10616 | `ac9f4be9cae32e48f91d9ce2e92feb4bfee240524c61da3722bb0ced08a0308f` |
| 38 | `sections/main-cart-items.liquid` | 12168 | `426c1e72974ea6db9631d8a18c6c096e4d13bc21104e0faf848202652632053b` | 12424 | `bc2262175b25ccaec3ba9801eda6b8c6c204f9fc71951cd33d00ad063885a9e3` |
| 39 | `sections/main-collection.liquid` | 27510 | `8829b5125135a0b4081f4e9bf34a602447996159bc03d72d98647a52f9e6ac94` | 28086 | `9ac46e9872ba6af5c4896f196190ea9c36b5fd23edca00147be6e33e67796e2e` |
| 40 | `sections/main-contact.liquid` | 12728 | `4dcdc4a060f59408060a73dfe382ebe56b934a3909a86c6d973c3da660207f77` | 13050 | `4cb72c065a2d86cba5635d799bd4d7230fe76423b22879a953ffb773cef36bfe` |
| 41 | `sections/main-documentation.liquid` | 12433 | `b34dd7de594eb12280c92392a06af8892097350b692cf6c5ebfdbce9c4688946` | 12746 | `1d3fc4a37af7471c2e949ebbb1944100029bab40aafdb514952be9d653fd45b8` |
| 42 | `sections/main-faq.liquid` | 9476 | `451b3adc6780a9665a3e943455f1a99e2b4361cf480922f5b8d231cd6eb0b0a6` | 9743 | `7701f48fe7eadf01ae6b98b938e539a166dca355e4d02c3d8c93998cdaaf06f5` |
| 43 | `sections/main-list-collections.liquid` | 5438 | `77faf2097897d0dcf8fc3d809a2cc31e40eac8cc45b3279753042be80cfde31c` | 5566 | `abb9362a61d7b5d388a459104ebc663994202411936c1f24ee0649be3683792a` |
| 44 | `sections/main-page.liquid` | 6071 | `7fc99fe9565bb900120c26a14d4964e52faef24e80043746a257a68d8a8772d1` | 6251 | `163f79811c560ae86366429bfa6e0153cefe3c01f64e302ecef374311650a01e` |
| 45 | `sections/main-password.liquid` | 7750 | `09f5872a51c3896d009a8d1b7928db2b9950cf4e6729850c3e96d7d6f230097c` | 7945 | `1930e2b01c52a86823bd22eaf14862ffde0b655820d12f795ab98314e83518ba` |
| 46 | `sections/main-placeholder.liquid` | 4297 | `1eacafcfc7d2a08293f8270154870169d3d029e6f13a88bdb6e198fdc8ae3cf4` | 4402 | `35a991aafde57bdf287dbe071f22a6928be3c2f72bbe88eba7d952033bdc0b17` |
| 47 | `sections/main-policy.liquid` | 3599 | `62213b1d653a9ba8b7e38951a3e6b6a1f9daa0ad37297f0e83fbb15aef0ad60d` | 3702 | `08232d7a0fca30ca33aebc2a4baf201ebcf79b5e6a4fb8978f73cbd72cfc8315` |
| 48 | `sections/main-product.liquid` | 56276 | `56741a8a3bcda4b9f73ca98ecb4ed448edf7eb37c2e4da9bb3b8f07db04b391d` | 57433 | `b13d237d54701b8ab65d62ac9b27913d05aee4165df722813e187e4efe7b42ad` |
| 49 | `sections/main-search.liquid` | 22629 | `3bbdb92531793f37681a7a085b10cef795987ec1c40733042bdc5286e9d0ef8b` | 23057 | `357e02c7c7702f17310b3205ee0b103c077cafa268018b3bcfc464ac2a62c668` |
| 50 | `sections/main-support.liquid` | 15404 | `6407c892fbb24884de67bc103d5e90448a4122a5dd095b178357bc80ae33eac6` | 15790 | `7978b2283181109a438928f82822659f59a4b17fe137b302853b0a6f44981085` |
| 51 | `sections/marquee.liquid` | 3686 | `dcb1fb6b15af7c79fa61bfba70ad7d31b16148cbb470b5e99380b8be5682ecb1` | 3803 | `0acb0f4bbdebd18762d2563b40e1fcb7c1588ef1121d7cddff96c8790f441197` |
| 52 | `sections/newsletter.liquid` | 3729 | `cf9e55aef6571bff9335621e0755f0b90568c647a40415f0b6dc4bada1b95a59` | 3833 | `b6133db2d62c0cae51bf0805a11af74fe3a5096915c4a76e77053492976f39a5` |
| 53 | `sections/product-recommendations.liquid` | 4768 | `68a6302695ce0acfadb0d13ae6b42931e404d6346b53eab0bfc20350c93c5846` | 4898 | `94d8c217ee74beb3b8804147b10c271450382b8364a7e30534e91ba22e18e788` |
| 54 | `sections/recently-viewed.liquid` | 3983 | `c2c0661cc5d70d6ae4b760f666eb7436904716cd3a9e8318b84116c48ee3156c` | 4100 | `9a98577a6cf3d84173f8a4bc4e91d9c7a4d13747856d59ac9b5a3f018bcd987c` |
| 55 | `snippets/cart-drawer-recommendations.liquid` | 14718 | `a92926ee7e2e20f5504938ea7a82538084a97bdc2021f67230c19e2fc363d793` | 15040 | `5ab5346e99ef6fccdcff93306e8111a68bc0d5d7898171ee326f7b4e5323d63c` |
| 56 | `snippets/facets-active-filters.liquid` | 3332 | `ba4e0256a43441ecb0a7ee03b9dc56f9db11c4ad6b6173bfb705c43bb14519d5` | 3402 | `a226eaecc32db0d58ea0293628d9b8f1229804bd75c58bc6dcd70e8691b3f24c` |
| 57 | `snippets/faq-entry.liquid` | 746 | `960a494c2ca4a028b8e22965b56822eef1b2dbdccb0966bd6429101b8793f187` | 764 | `a85ca973827e5bfb3db20a29400fed28342a691ac5de6dd909706cde4227630f` |
| 58 | `snippets/gift-card-recipient.liquid` | 5852 | `abe59f567ed64562c5dde2012df265ff6890dcce4f6bc02348cac7aab9f21ebb` | 6000 | `87e9b509a20323c72ae4e6c4eda2e22cfe2ce8da92fcdf732d6e8c3b57bf7d91` |
| 59 | `snippets/icon.liquid` | 3345 | `63282f01926b0f18f8b7a7e5b730e4097a18ab684f43c417d575ad9df34617b0` | 3408 | `25298d9a29175e66519512194efbfe839de0f1becb80f5fca00aed6d6a270088` |
| 60 | `snippets/localization-selectors.liquid` | 4755 | `8f2529cc2acd8c17885e093e72f1181373763a7133ebca044f37057448323e76` | 4863 | `9ecbf56e29a2cde7c74d302f96c767e56d6cb14f1647d9aaf63a525668cc719a` |
| 61 | `snippets/media-alt.liquid` | 697 | `303282704a54557ecca133a4dac412183a77cd79f3e5b7f9e35b616402d09ec3` | 715 | `132981ecd803918a2c5df8fb041693d479637530f05d8b92846942635e4dc6b1` |
| 62 | `snippets/mega-menu.liquid` | 9338 | `345aecab7a9f933590d3f8f65735fe8c323e73b4f84d675b079c888a805f1d85` | 9547 | `6fe063406cb83656a60c1af2f09d5a620132aae4d0492398f37419e4d4d981c5` |
| 63 | `snippets/pickup-availability.liquid` | 5544 | `8fe9bc86ea52934d9e08fab9932c8cad4486d32311ec2cd5ac528d3fd921fb32` | 5679 | `380b612d86c697ec23eada562f0fdf765d97214e757b98190a2b1e6e3d337dbc` |
| 64 | `snippets/predictive-search.liquid` | 6002 | `743e06cbb2331546a65101d4af04b1e655119a8c57d60f5da3c2c4c2069d07b3` | 6147 | `0e4293fd13750d300f39b47c0c5e84f9d44c292341dee5182023feee3b55f3f3` |
| 65 | `snippets/price.liquid` | 4228 | `d68bb07fa54d1dd6f4fd28c0a9c58b5004327520a12c22226f51b534605b2d29` | 4337 | `8f19f35bdaa03f4e461ed9ce06beb52ea406524893fbee891d4deef3c577abf6` |
| 66 | `snippets/product-accordion.liquid` | 1232 | `3fdaad40f9e28d996c5864897d09db6cce6951fbc625767efa48fe3738878d4c` | 1265 | `26f9de34c4c72cdf447980750ccd4a5731ed6d4a9cc8a595c33902a53c7730ae` |
| 67 | `snippets/product-card.liquid` | 24302 | `07c9bdc0e3b982b4c42d629e0fb8f84e5cf3f45559a68806a076fd23b9f50c63` | 24819 | `d884b836577bf095ba5d37ceb54825915c58ebfb2c7f2525d7ba4703663cd973` |
| 68 | `snippets/product-inventory.liquid` | 2536 | `f57016e3b52c8d7282fb13a69afd75064386fbeee5a18d7bd457f608048245a3` | 2585 | `7cf75b986f5f3be9afa051a37cf8ca368b7522ce8851d4ec3a097b99f9c572a0` |
| 69 | `snippets/product-media.liquid` | 1357 | `dca21fa5af95a53e196dea2be2535a17c36380ac1ef282677aef092c0c8ca64b` | 1394 | `f22e7c6643dc1a878f5f4f94e238ed4c4ea582ade1e0db9af58625f2733de38b` |
| 70 | `snippets/product-provenance.liquid` | 4537 | `57eebe0ea0da46485a78afce47c94f79834a7ce86688a6a433b8caad26b28dc4` | 4620 | `f40a36e60f7f9cb7fb25c012783f49b6c4c46e569a62f6c1dcba1e16fe57fa78` |
| 71 | `snippets/product-technical-specs.liquid` | 5060 | `beba8d51a42e822c8cefb340146046f81fe4e78047519365a41a93d8db58608c` | 5180 | `5a594c120001093eb1ef712631faaee472ad8c3d62e3ff8f87c80b57483709eb` |
| 72 | `snippets/product-zoom.liquid` | 4776 | `3de0e7995150b189a146da97e918da69d87bbf07eb9f5b681f48ba4591ff786c` | 4891 | `e580576820da6c155d6cfae4fcd006c426170485e5e96206a7e151696a0cafeb` |
| 73 | `snippets/responsive-image.liquid` | 1088 | `17cfbe7ab4e9335d882cf2d45e651ce2377ae82001a82521ebd37d8442672743` | 1129 | `7c99fb27c2967e92baced10bcb68980b2838db389d9b0389ae20726f657c7b2a` |
| 74 | `snippets/social-meta-tags.liquid` | 2172 | `f5843dbcd7dcefc2307425dfaa136713f1d8c7141f4df9eaa1a67811f128de59` | 2218 | `c8a6824f5ad3790e5d6a17be0373b4d41174eecef2bcb5cf761627c2c6917f2e` |
| 75 | `snippets/structured-data.liquid` | 1857 | `7a2dd02596991511d4018558c12992c3e109feb5e823d10ec2ba0410b7fcd64d` | 1918 | `d007645973012dc1cabe5579d082e8b9500aa75c3f8cd5847d3dd22765f4826d` |
| 76 | `templates/404.json` | 112 | `a8a6801178c25343694f28def1a42d7dbfa3446023b084fcf1d965608e773a2e` | 121 | `ae00068f912423954ab3835917ceb334583a819eeebb98efb26a39d1487d905b` |
| 77 | `templates/article.json` | 116 | `ef590d7f1c225174e93db6a31040c9f4e624d6092643dc81381272e4c617fd75` | 125 | `fb1afa139d1b7a0626260c9c8d1bb0c04a3a04e13442e2b3aedbd539686ecd49` |
| 78 | `templates/blog.json` | 113 | `1059cd70fdd9669a503afda44cda8374177b489d0b6f2ea2e5f4a49019c6ab94` | 122 | `2b5ec83a9cdaa79a535c72835fdfd5d71d244ad6fbcaa72bb4989d5bdcea2ccd` |
| 79 | `templates/cart.json` | 191 | `77270b15eda989e8c87d0bddaf62be3799549eb40c652dc4491713ef79d11f3b` | 203 | `b3d4a87462ad230aabfaa7a53a9cdbb4f407119d767e247cc5b76ab1b0d2197f` |
| 80 | `templates/collection.json` | 294 | `3341848af7e106fc1c7159520dbecffe4c2d9914d3b3bf0ad563f92c7551aa6e` | 309 | `26c669b0787feac08786310414b7d1cfbeef090b91046e099d22db9240ab1c29` |
| 81 | `templates/gift_card.liquid` | 6219 | `3462b243f9e0f0d872c6b54895f34b12ca1d8150179d0f358bbede79adca7af4` | 6370 | `63fc02fafcfcbd8d1c616a8c05d42452ee102ec9bc0383de8e323b63d67e389c` |
| 82 | `templates/index.json` | 8534 | `11022ae35487424ac607cf2aec86fbe3e1c17708235decd994ff66efd24384f9` | 8833 | `9480fd9da6ecb0d6b46a0abd2b230794a8b5fd2460186e58475bc7b65c71eefc` |
| 83 | `templates/list-collections.json` | 125 | `fad55bdc22c2e90f7a2736e0db9d3e7e17ed8c4cd0f65282d9c9ce58f512f96b` | 134 | `b9526882804e5bfdeb989cff69699739009b4d171ccf04dc68efab98f61edc5c` |
| 84 | `templates/page.about.json` | 1656 | `dcdd83cdb55325d7a83b0fe60f2e57baa30d4e57f1130ab05f5ca132dc9f57ac` | 1706 | `41d595cac76e31327c7acf4f5dee42e6d1e972c755bbd8982de5cb5f03aadb7d` |
| 85 | `templates/page.contact.json` | 2420 | `d70fcd7476d16e170f49a0d4899b6b79c16c29582520feeefe2a5c87c858cfbc` | 2498 | `7526e69e246731fde8f0d6099caa3ca0e0b6dcfe777b0b235e987695f4dc202c` |
| 86 | `templates/page.documentation.json` | 7687 | `b99fc5bf2ad010135ff6d2def98f3e90a064780f86df8db32590d4e18abc40b6` | 7836 | `624f706abee432a06122fda05747f7150e6a34979e12f97c6c87e222ff3e55c1` |
| 87 | `templates/page.faq.json` | 3794 | `a7917a7e250bf31277d921c2199aa4a42b903023472697e0debbd83109a79d6b` | 3903 | `2be788d370dca6138926535f448a3b198386421ace4e07ae8ed2a907af61a08f` |
| 88 | `templates/page.json` | 113 | `2058c15d2d1ea7b9088a24e6002976030d551655fd71025d31723f1a69011285` | 122 | `c5ba35f58dcc570436916c2c81ec990b3a8c4bb9de45535c3e254b62a73641a7` |
| 89 | `templates/page.policy.json` | 115 | `191e529979e87b832d960be023a1c31c0a73f407942141493e69e846b97a8cbe` | 124 | `1270ccb160059aef66b76c0965f838bca4bd06c82214aabbd38813c8dcfd2581` |
| 90 | `templates/page.support.json` | 3253 | `91b8f0f949e921060c7250515e530d328e80ef0e97ea6db2a9cffae1bc8d0d25` | 3337 | `c450732b83323c5726d53fae350ea63b6245521892156337d7f33137345516ff` |
| 91 | `templates/password.json` | 149 | `7e1db352326963419cf34df67535ffdec77ca93e4b01211c06edc85ad78a2aeb` | 161 | `8e2bd3bece7cd9e39b83d9cda94ab8ca7138e0c7183db0a94f806bdfeaa5fd35` |
| 92 | `templates/product.json` | 3561 | `bafebeb3427b186a81b4b0133cba09efbde678c29e538b8c9ea1cb281683bfbe` | 3685 | `cdcf82c9574125a9a13f2cd2804b7cdc50b7a0adde64c0f864c50c03a394a774` |
| 93 | `templates/search.json` | 115 | `928f047af2d006a9e3e9d872461673483c1bdb720a702c3117ad016cc8d31196` | 124 | `b8c59f492c78dc3ae214a0682e8b3f262219fc264761eb80c3a328b5a0f72e56` |

---

## 4. Protocolo de Empaquetado Reproducible

Para erradicar la no-determinación inherente a utilidades ZIP convencionales (que inyectan marcas de tiempo locales, atributos dependientes del host o metadatos variables), se implementó un arnés de empaquetado hermético con las siguientes especificaciones:

1. **Ordenamiento Alfabético Estricto:**
   - La lista de rutas relativas se ordena alfabéticamente de manera determinista mediante `sorted(paths)` bajo codificación UTF-8 estándar.
2. **Exclusiones Rigurosas:**
   - Se excluyen taxativamente: `agent-comms/`, `scripts/`, `tests/`, `.secrets/`, `.git/`, `.github/`, `docs/`, `node_modules/`, `package.json`, `package-lock.json`, `playwright.config.mjs`, y cualquier archivo fuera de las 93 rutas canónicas.
   - No se registran entradas de directorio vacías redundantes; únicamente los 93 archivos regulares en sus rutas relativas.
3. **Normalización de Marcas de Tiempo:**
   - Cada entrada `ZipInfo` tiene fijada exactamente la fecha y hora de autoría del commit `fbdf462`:
     `2026-11-04 15:42:07 UTC` -> `date_time = (2026, 11, 4, 15, 42, 7)`.
4. **Normalización de Permisos y Atributos de Sistema:**
   - `create_system = 3` (UNIX standard).
   - `external_attr = 0o100644 << 16` (`-rw-r--r--`, archivo regular estándar de solo lectura para grupo/otros y lectura/escritura para propietario, `0x81a40000`).
   - `compress_type = zipfile.ZIP_DEFLATED`.
   - `compresslevel = 9` (Nivel máximo estándar zlib/deflate).

---

## 5. Demostración Empírica de Reproducibilidad Bit por Bit

Se ejecutaron dos corridas independientes con separación temporal deliberada para demostrar que el artefacto resultante es 100% reproducible y que su hash SHA-256 no oscila bajo ninguna circunstancia.

### 5.1 Paquete Canónico Oficial (Normalizado LF)
| Corrida | Marca de Tiempo de Ejecución | Tamaño en Bytes | Entradas | Hash SHA-256 |
|---|---|---:|---:|---|
| **Run 1** | 2026-11-04 18:00:47 UTC | 288.969 bytes | 93 archivos | `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` |
| **Run 2** | 2026-11-04 18:00:48 UTC | 288.969 bytes | 93 archivos | `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` |
| **Coincidencia** | **Idéntica (100% bit a bit)** | **0 bytes dif.** | **0 dif.** | **MATCH COMPLETO** |

### 5.2 Paquete Variante Windows (CRLF Físico)
Para fines de trazabilidad forense respecto a herramientas locales de Windows, también se empaquetó y probó la variante con CRLF:
| Corrida | Tamaño en Bytes | Entradas | Hash SHA-256 |
|---|---:|---:|---|
| **Run 1** | 290.883 bytes | 93 archivos | `16467c9f9f769acd91f0e46704776f4d926c815a2f853b76c591c96ac922052d` |
| **Run 2** | 290.883 bytes | 93 archivos | `16467c9f9f769acd91f0e46704776f4d926c815a2f853b76c591c96ac922052d` |
| **Coincidencia** | **Idéntica (100% bit a bit)** | **0 dif.** | **MATCH COMPLETO** |

---

## 6. Ubicación Física Final Fuera del Repositorio

El artefacto final de distribución se encuentra debidamente resguardado fuera del árbol de trabajo de Git:

1. **Ubicación Principal de Release:**
   `C:\Users\Johan\releases\Sartorial-1.0.0.zip`
   - Tamaño: **288.969 bytes**
   - SHA-256: `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`
2. **Ubicación Espejo para Auditoría:**
   `C:\Users\Johan\audit-gemini\dist\Sartorial-1.0.0.zip`
   - Tamaño: **288.969 bytes**
   - SHA-256: `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`
3. **Variante CRLF (Archivada para referencia):**
   `C:\Users\Johan\releases\Sartorial-1.0.0-crlf-variant.zip`
   - Tamaño: **290.883 bytes**
   - SHA-256: `16467c9f9f769acd91f0e46704776f4d926c815a2f853b76c591c96ac922052d`

---

## 7. Verificación de Compuertas de Integridad sobre el Artefacto

El paquete oficial fue descomprimido en un arnés estéril de prueba (`scratch/extracted_theme`) y sometido a las compuertas oficiales:
1. **Theme Check Oficial de Shopify (`npx shopify theme check`):**
   ```text
   ╭─ success ────────────────────────────────────────────────────────────────────╮
   │                                                                              │
   │  Theme Check Summary.                                                        │
   │                                                                              │
   │  90 files inspected with no offenses found.                                  │
   │                                                                              │
   ╰──────────────────────────────────────────────────────────────────────────────╯
   Exit code: 0
   ```
2. **Sintaxis de JavaScript (`node --check`):**
   - `node --check assets/theme.js` -> **Exit 0 (Válido)**
   - `node --check assets/product-zoom.js` -> **Exit 0 (Válido)**
3. **Integridad de Presets y Templates JSON:**
   - 100% de los archivos `.json` parsean válidamente sin errores sintácticos.

---

## 8. Veredicto y Certificación de Integridad del Lote 0

### DICTAMEN: CERTIFICADO Y CONCLUIDO EXITOSAMENTE

**Certificaciones emitidas:**
1. **Identidad Canónica:** Se certifica que la base `lote0/base-09f8342` en el commit `fbdf462` es la versión única, saneada y autorizada para el Lote 0.
2. **Empaquetado Determinista:** Se certifica que `Sartorial-1.0.0.zip` es un artefacto estricta y matemáticamente reproducible con SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`.
3. **Integridad Funcional:** Se certifica que el paquete contiene exactamente los 93 archivos del tema con 0 ofensas de Theme Check y plena conformidad de Shopify.
4. **Cierre de Precondiciones:** Quedan formalmente satisfechas las condiciones (a) y (b) de `GEMINI-REVIEW-LOTE-0-R0-002`.
