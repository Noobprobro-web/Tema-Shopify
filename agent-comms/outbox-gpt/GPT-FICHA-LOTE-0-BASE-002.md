ID: GPT-FICHA-LOTE-0-BASE-002
Fecha: 2026-11-02 (America/Caracas)
Estado: Ficha offline de identidad y relación con ZIP; base y Lote 0 no aceptados formalmente.
Decisión requerida: Ninguna nueva para continuar la preparación offline de 0-01 y 0-05. Claude debe revisar R-0; Johandry debe aprobar Lote A antes de abrirlo.
Resumen en 5 líneas:
1. HEAD detached de la base aislada es el SHA de base elegido; cuatro rutas modificadas corresponden a tres arreglos y cinco valores de copy.
2. ZIP fuente comprobado: 93 archivos, 91 idénticos byte por byte al árbol; dos diferencias explicadas y comprobadas en el alcance descrito.
3. El ZIP incluye listings/; identificarlo no demuestra que sea un paquete de envío conforme ni reproducibilidad del empaquetado.
4. Los cuatro CMP-01 corresponden canónicamente al commit autorizado; conteos limitados no demuestran ausencia de secretos.
5. M2 tiene confirmación humana; revisiones, pruebas funcionales y R-0 permanecen pendientes.
Archivos tocados: esta ficha nueva; corrección puntual previa al registro M2-003, identificada al final.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta actuación; sin cambios de código ni contratos.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Secciones siguientes y manifiesto incluido; no se ejecutaron scripts del proyecto ni pruebas de tienda.
Lista de afirmaciones falsables numeradas:
1. HEAD, estado y cuatro SHA-256 físicos coinciden con la tabla.
2. Cada archivo del ZIP verificado existe en la base; 91 son idénticos y dos difieren de la manera acotada descrita.
3. Los cuatro archivos CMP-01 tienen blob canónico igual al commit autorizado, sin implicar igualdad física de fin de línea.
4. El inventario de ZIP enumera 93 nombres únicos y su SHA-256 descomprimido; no es un manifiesto exhaustivo de todo el checkout.
5. Esta ficha no prueba funcionamiento, despliegue, emparejamiento con tienda, regeneración del ZIP ni R-0.

# Identidad y estado

Directorio fuente explícito: `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f`. `git status --short --branch`:
```text
## HEAD (no branch)
 M assets/base.css
 M assets/product-zoom.js
 M assets/theme.js
 M listings/sartorial/templates/index.json
```
`git rev-parse HEAD`: `09f834295074402d9b93aa8ead83a732d78e6608`. `git ls-files --others --exclude-standard` no emitió rutas; no afirma ausencia de archivos ignorados. `git merge-base --is-ancestor 09f834295074402d9b93aa8ead83a732d78e6608 HEAD` devolvió 0; aquí HEAD es ese mismo commit, no prueba relación con despliegue ni sustituye R-0. `git diff --check` devolvió 0; no prueba comportamiento.

| Ruta modificada | SHA-256 físico actual |
| --- | --- |
| assets/base.css | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| assets/theme.js | `db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c` |
| assets/product-zoom.js | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |
| listings/sartorial/templates/index.json | `9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768` |

Comando: `Get-FileHash -Algorithm SHA256 -LiteralPath` para las cuatro rutas anteriores. El plan V4.1 fue comprobado previamente con SHA-256 `917ddff1b9c96f62136d1b1070a0568f1f52f3b7bfa5681a80a1dcfb697d1a3d`. Ningún plan o informe anterior fue alterado.

# Relación del árbol y ZIP

ZIP fuente: `C:\Users\Johan\Documents\Drive\Tema Shopify\agent-comms\outbox-gpt\harness-GPT-PACKAGE-INTEGRATED-001-v4\isolated-theme\Sartorial-1.0.0.zip`; `Get-FileHash -Algorithm SHA256` antes de abrirlo y comprobación de bytes en memoria antes de cada análisis: `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3`. No se extrajo, regeneró, publicó ni instaló.

Un análisis Python local de `zipfile` recorrió archivos regulares y comparó sus bytes con igual ruta en el checkout. Resultado literal:
```text
files 93 unique 93
root_counts {'assets': 3, 'locales': 3, 'layout': 2, 'sections': 35, 'config': 2, 'snippets': 21, 'templates': 18, 'listings': 9}
exact 91 newline_normalized_only 0 different 2 missing 0
different_paths ['assets/theme.js', 'listings/sartorial/templates/index.json']
missing_paths []
bookkeeping_line_count 1
bookkeeping_line_count 1
bookkeeping_line_count 1
theme_transformation_byte_equal True
five_copy_semantic_transformation_equal=True
```
La comparación exhaustiva se limita a nombres contenidos en el ZIP; no prueba que las demás rutas del checkout deban o no incorporarse. El ZIP incluye `listings/` (nueve archivos) además de siete directorios de tema: no se le atribuye automáticamente la condición de ZIP de envío. Tampoco se usa como prueba de que el paquete futuro sea regenerable.

Para reproducir la relación: verificar el SHA del ZIP antes de leerlo, enumerar `ZipFile.infolist()` excluyendo directorios, comparar `ZipFile.read(nombre)` con `Path(nombre).read_bytes()` desde la base indicada, y comprobar la igualdad después de reemplazar únicamente las tres líneas identificadas en `GPT-REPORT-LOTE-0-BASE-001.md:36` del `theme.js` del ZIP (una ocurrencia de cada una, incluidos sus finales CRLF). Para el JSON, cargar ambas versiones con `json.loads`, cambiar en el objeto del ZIP solo las cinco claves siguientes y comprobar igualdad del objeto completo; la comparación es semántica y no prueba identidad física de formato:

| Sección / clave `settings` | Valor actual aprobado |
| --- | --- |
| hero / eyebrow | `SARTORIAL / 01` |
| collections / heading | `Selected Silhouettes` |
| lookbook / heading | `Silhouettes in Motion` |
| lookbook / caption | cadena vacía |
| capsule / heading | `Complete the Look` |

La tabla de manifiesto más abajo registra hashes descomprimidos del ZIP, no hashes de los dos archivos modificados que difieren. Los arreglos son placeholder newsletter, foco de galería y liberación de gesto zoom; su procedencia y ubicación constan en BASE-001:28–42 y revisión independiente histórica en :119–141. El `theme.js` actual no es byteidéntico al ZIP; faltan las tres asignaciones de bookkeeping ya excluidas. La igualdad de los otros 91 archivos aquí sí es de bytes, no solo tras normalización. En CMP-01, por el contrario, igualdad canónica de Git no implica igualdad física; el checkout Windows puede usar CRLF y el blob LF. La observación de caption y la revisión independiente del copy siguen pendientes; no se repitió QA funcional.

# CMP-01: identidad y conteos limitados

Para cada ruta se comparó `git rev-parse 09f834295074402d9b93aa8ead83a732d78e6608:<ruta>` con `git hash-object --path=<ruta> -- <ruta>`. Se muestra solo identificación, clasificación y conteos, sin contenidos. Conteo `redact` comprende coincidencias insensibles a mayúsculas del patrón `redact(?:ed|ion)?`; `env` cuenta la forma sintáctica de acceso a la variable de proceso indicada por M2. Son búsquedas acotadas, no detectores generales de secretos ni comprobación del literal histórico.

| Ruta | Blob Git canónico 09f = trabajo | Coincidencias `redact` | Accesos `env` |
| --- | --- | ---: | ---: |
| scripts/gate5-live-verify.mjs | `bb843165515fbddd3112cb1b1fbbeb79a14bdad5` | 0 | 1 |
| scripts/gate5-complete-verification.mjs | `3bc7a5030af65b55301ef193862737410017d56c` | 0 | 1 |
| agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md | `0cc08c5f853c262405be6712d475e6908c0a10db` | 2 | 1 |
| agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md | `067a63e4427fbc75a193674ccde942a0eba0c411` | 0 | 1 |

La igualdad se verificó en los cuatro (`canonical_equal=True`), sin edición. `git diff --quiet` sobre estas cuatro rutas devolvió 0. Estos conteos no demuestran ausencia del literal histórico ni de otros secretos: el conteo específico seguro de R-0 queda pendiente para Claude con un método autorizado que no imprima valores; no se accede a una fuente prohibida para obtener el patrón. La aparición textual de un acceso tampoco prueba que se ejecute ni que la variable esté configurada. No se ejecutaron los scripts.

# BOARD y estado de M2

`agent-comms/BOARD.md` de la base autorizada indica fecha 2026-10-22T20:35:00Z en línea 8 y en línea 16 una afirmación histórica de ocho compuertas; su línea 10 describe un ZIP excluyendo listings/. Esa narrativa se refiere a un estado anterior y no demuestra los cuatro cambios actuales ni el ZIP aquí identificado, que sí incluye listings/. El propio BOARD §15.2 contiene su registro histórico de rotación; M2-001/002 y M2-003 recogen las comunicaciones posteriores de Johandry, incluida la confirmación humana de actualización local del 2026-11-02. No se acredita autenticación o estado técnico de tiendas. La comparación es insumo: Antigravity debe realizar la reconciliación requerida por V4.1:146,166,374; no se ha modificado BOARD ni se declara reconciliado.

# Cobertura y pendientes 0-01

- **Cubierto offline:** HEAD/estado, cuatro hashes, inventario nominativo de ZIP, comparación íntegra de sus miembros frente al checkout, transformaciones acotadas, preservación canónica CMP-01, evidencia histórica y diferencias de fecha/estado de BOARD.
- **Pendiente Antigravity:** reconciliar formalmente BOARD, finalizar ficha de candidato/build de trabajo y envío, decisión de empaquetado y comandos de reconstrucción/regeneración demostrada; producir y conservar diff/manifiesto final del candidato si cambia. Cualquier escritura en tienda o push exige autorización explícita correspondiente; un commit no está autorizado aquí.
- **Pendiente pruebas y aceptación:** pruebas dirigidas de los tres arreglos y revisión independiente del copy, observación de caption en navegador y controles aplicables; fijar identidad de candidato y relación con cualquier entorno antes de atribuir evidencia. No se realizaron aquí pruebas en tienda, navegador, accesibilidad, Lighthouse o funcionalidad, ni gates completos.
- **Pendiente Claude R-0:** verificar SHA/descendencia, los cuatro archivos y conteo seguro específico sin revelar valores, ficha completa y trazabilidad árbol/ZIP, evidencia de fixes y dependencias, y aceptar o devolver. Esta ficha no sustituye R-0. Lote A exige R-0 aceptado y aprobación de Johandry.

Corrección documental previa en `GPT-DECISION-LOTE-0-M2-003.md`: una sola sustitución para tratar C-08 como propuesta de decisión pendiente cuando se presente con evidencia y permitir preparación offline de 0-01/0-05. SHA-256 posterior `9e79aa5f466435f5bd0f1de27f61a875a0c21e087f0ed1e47353bc9112f26b70`, 8316 bytes.

# Manifiesto de archivos del ZIP fuente

SHA-256 sobre bytes descomprimidos. Directorios vacíos excluidos; orden alfabético por ruta. No contiene hashes ni contenido de archivos ajenos al ZIP.

| Ruta en ZIP | SHA-256 |
| --- | --- |
| `assets/base.css` | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| `assets/product-zoom.js` | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |
| `assets/theme.js` | `861fe0d606dbaa790f827e3d01cf89b431bdb630064a612608f50accc03aa8f7` |
| `config/settings_data.json` | `51a9cda056d178f7f75cc1650fb2efc77a6f748131d6710ee23f136a69295ac8` |
| `config/settings_schema.json` | `3a9b11bda1f771f8ab4391d85279dbe9e2ba6c4507ea2a06e2a0793bd84e9608` |
| `layout/password.liquid` | `5d1bd3c5d2d2adab7d5fcd1e5b2093b4380fb139c4faf7e23e1adc6e047d4a5f` |
| `layout/theme.liquid` | `20eecc1881d67a472fb3b9e525a5c5b575050261e60cd3ee1aa4dddf652609b6` |
| `listings/archive/templates/collection.json` | `4d968288201ffa0f1ae768a84537352486d2ef1610ff7f5d710ff8a70c7a0c7e` |
| `listings/archive/templates/index.json` | `cac954988810fcd929d276d2f83679c465ad2a49787c25ffbf0c62807d2a737c` |
| `listings/archive/templates/product.json` | `1ea0f6487c6f7b3c168163d2d3d7d7d31abe4d62cd2939a98a9d574b7d5ccb76` |
| `listings/imprint/templates/collection.json` | `2253d4df57f890b23e9ae92cd9196e1771b09ce73e17863e77d6bdea1d0805a4` |
| `listings/imprint/templates/index.json` | `ba48c929dcb2946c72be511731702199cb6d7e0f2f021da2f606796d464dfd19` |
| `listings/imprint/templates/product.json` | `31a7db1b009da36a3e7f268ee97b37d26fb388d29c6b160a11d79d1c3453d4f6` |
| `listings/sartorial/templates/collection.json` | `3a5fc6c1c737ec89b7efa13cdba77726605f87bb391339b5f7fe7c6299ea95b9` |
| `listings/sartorial/templates/index.json` | `40ea66050a3fcf72401903eaa3cf64b03cc84ff3605c6f90e3c4754550b36261` |
| `listings/sartorial/templates/product.json` | `ef4c4a16bc5ceb5fa22ee1307269bd49f034ec260eff02799a5d44256e67ad18` |
| `locales/en.default.json` | `d0ac3945946fbd4271eef03ba6afe3463f1367f632d172761422760f57c7b6d4` |
| `locales/en.default.schema.json` | `953f8695946fd3b3752ff1b17495e9a26f0e2c7a8ade105c5269f37ba42ef998` |
| `locales/es.json` | `89af541182bc29c65d361c813f5d4c0ce7ca79d60f4407cc95a089bbf14e6ae5` |
| `sections/announcement-bar.liquid` | `880ba32cc15936e21498380062d037f10498551b85f3e46fe04120e36853a132` |
| `sections/bento-discovery.liquid` | `f691531acac5907297d1ac27c931864c398a10ada8fe65612256fa63cfdc45c9` |
| `sections/brand-manifesto.liquid` | `446db7c6fb2b34902c67bda5194d44b4d92b4e9b288de7efb137caac9ed7a007` |
| `sections/cart-drawer.liquid` | `23d5328883c9ae4dbac547d08a18dc70c8278947f66bff33bd684e37b34f253e` |
| `sections/complete-the-look.liquid` | `6bb3b433b48ed91191e8de22465f39d196f236caf485c3c91186fc8bc49009f4` |
| `sections/curated-showcase.liquid` | `80da0eeb9d245b5c9244689fca24f5ef50e6c990371733f2c19ea348c1ff8b86` |
| `sections/custom-liquid.liquid` | `f2ecac9b1ba9634c90a44fb927f1edf8e915b4febb03e2ab807ff7aef73af620` |
| `sections/featured-product.liquid` | `5c8b9704023845d62ea8648d7f45e4223152f9322f987782987198a4c93b27d1` |
| `sections/footer-group.json` | `d90e3eb6c836cafb4884c565275d80a1f1fd9d29fc159a43e0852dd22be8e853` |
| `sections/footer.liquid` | `25b09ca85a084511315ff388240f854d71f46d7f4b987d81d51b07fe3e96ac9b` |
| `sections/header-group.json` | `70326806988db08baca7af8cf53a9da118c174e8b50e54d061ca2210f9cda8e5` |
| `sections/header.liquid` | `0aacc06640cca0b504aee58647b19e10d9bc34097fee74bafc9380ef14ce48b7` |
| `sections/hero-editorial.liquid` | `5b823a3cb4a6314847fec8cdcc22e84daccaaec419e8bfe37d67b4fa1a6cf75e` |
| `sections/lookbook.liquid` | `3e622b1f9adce5852a5828cc594197050897ab47ebce237ea80bbf7a032a8a48` |
| `sections/main-404.liquid` | `0cf7305f4ed7a467213c7a7b07982ea9b03c312381859066ba669b9e2d24ac6a` |
| `sections/main-about.liquid` | `c43cba37460c5d6a69c2e596effeadf83eba8680f691da179149b0e0291f62b3` |
| `sections/main-article.liquid` | `0125ee58f82a067e4b366b22a43ffa638ca06c70c72f7d85388bd15c67645dc2` |
| `sections/main-blog.liquid` | `ac9f4be9cae32e48f91d9ce2e92feb4bfee240524c61da3722bb0ced08a0308f` |
| `sections/main-cart-items.liquid` | `bc2262175b25ccaec3ba9801eda6b8c6c204f9fc71951cd33d00ad063885a9e3` |
| `sections/main-collection.liquid` | `9ac46e9872ba6af5c4896f196190ea9c36b5fd23edca00147be6e33e67796e2e` |
| `sections/main-contact.liquid` | `4cb72c065a2d86cba5635d799bd4d7230fe76423b22879a953ffb773cef36bfe` |
| `sections/main-documentation.liquid` | `1d3fc4a37af7471c2e949ebbb1944100029bab40aafdb514952be9d653fd45b8` |
| `sections/main-faq.liquid` | `7701f48fe7eadf01ae6b98b938e539a166dca355e4d02c3d8c93998cdaaf06f5` |
| `sections/main-list-collections.liquid` | `abb9362a61d7b5d388a459104ebc663994202411936c1f24ee0649be3683792a` |
| `sections/main-page.liquid` | `163f79811c560ae86366429bfa6e0153cefe3c01f64e302ecef374311650a01e` |
| `sections/main-password.liquid` | `1930e2b01c52a86823bd22eaf14862ffde0b655820d12f795ab98314e83518ba` |
| `sections/main-placeholder.liquid` | `35a991aafde57bdf287dbe071f22a6928be3c2f72bbe88eba7d952033bdc0b17` |
| `sections/main-policy.liquid` | `08232d7a0fca30ca33aebc2a4baf201ebcf79b5e6a4fb8978f73cbd72cfc8315` |
| `sections/main-product.liquid` | `b13d237d54701b8ab65d62ac9b27913d05aee4165df722813e187e4efe7b42ad` |
| `sections/main-search.liquid` | `357e02c7c7702f17310b3205ee0b103c077cafa268018b3bcfc464ac2a62c668` |
| `sections/main-support.liquid` | `7978b2283181109a438928f82822659f59a4b17fe137b302853b0a6f44981085` |
| `sections/marquee.liquid` | `0acb0f4bbdebd18762d2563b40e1fcb7c1588ef1121d7cddff96c8790f441197` |
| `sections/newsletter.liquid` | `b6133db2d62c0cae51bf0805a11af74fe3a5096915c4a76e77053492976f39a5` |
| `sections/product-recommendations.liquid` | `94d8c217ee74beb3b8804147b10c271450382b8364a7e30534e91ba22e18e788` |
| `sections/recently-viewed.liquid` | `9a98577a6cf3d84173f8a4bc4e91d9c7a4d13747856d59ac9b5a3f018bcd987c` |
| `snippets/cart-drawer-recommendations.liquid` | `5ab5346e99ef6fccdcff93306e8111a68bc0d5d7898171ee326f7b4e5323d63c` |
| `snippets/facets-active-filters.liquid` | `a226eaecc32db0d58ea0293628d9b8f1229804bd75c58bc6dcd70e8691b3f24c` |
| `snippets/faq-entry.liquid` | `a85ca973827e5bfb3db20a29400fed28342a691ac5de6dd909706cde4227630f` |
| `snippets/gift-card-recipient.liquid` | `87e9b509a20323c72ae4e6c4eda2e22cfe2ce8da92fcdf732d6e8c3b57bf7d91` |
| `snippets/icon.liquid` | `25298d9a29175e66519512194efbfe839de0f1becb80f5fca00aed6d6a270088` |
| `snippets/localization-selectors.liquid` | `9ecbf56e29a2cde7c74d302f96c767e56d6cb14f1647d9aaf63a525668cc719a` |
| `snippets/media-alt.liquid` | `132981ecd803918a2c5df8fb041693d479637530f05d8b92846942635e4dc6b1` |
| `snippets/mega-menu.liquid` | `6fe063406cb83656a60c1af2f09d5a620132aae4d0492398f37419e4d4d981c5` |
| `snippets/pickup-availability.liquid` | `380b612d86c697ec23eada562f0fdf765d97214e757b98190a2b1e6e3d337dbc` |
| `snippets/predictive-search.liquid` | `0e4293fd13750d300f39b47c0c5e84f9d44c292341dee5182023feee3b55f3f3` |
| `snippets/price.liquid` | `8f19f35bdaa03f4e461ed9ce06beb52ea406524893fbee891d4deef3c577abf6` |
| `snippets/product-accordion.liquid` | `26f9de34c4c72cdf447980750ccd4a5731ed6d4a9cc8a595c33902a53c7730ae` |
| `snippets/product-card.liquid` | `d884b836577bf095ba5d37ceb54825915c58ebfb2c7f2525d7ba4703663cd973` |
| `snippets/product-inventory.liquid` | `7cf75b986f5f3be9afa051a37cf8ca368b7522ce8851d4ec3a097b99f9c572a0` |
| `snippets/product-media.liquid` | `f22e7c6643dc1a878f5f4f94e238ed4c4ea582ade1e0db9af58625f2733de38b` |
| `snippets/product-provenance.liquid` | `f40a36e60f7f9cb7fb25c012783f49b6c4c46e569a62f6c1dcba1e16fe57fa78` |
| `snippets/product-technical-specs.liquid` | `5a594c120001093eb1ef712631faaee472ad8c3d62e3ff8f87c80b57483709eb` |
| `snippets/product-zoom.liquid` | `e580576820da6c155d6cfae4fcd006c426170485e5e96206a7e151696a0cafeb` |
| `snippets/responsive-image.liquid` | `7c99fb27c2967e92baced10bcb68980b2838db389d9b0389ae20726f657c7b2a` |
| `snippets/social-meta-tags.liquid` | `c8a6824f5ad3790e5d6a17be0373b4d41174eecef2bcb5cf761627c2c6917f2e` |
| `snippets/structured-data.liquid` | `d007645973012dc1cabe5579d082e8b9500aa75c3f8cd5847d3dd22765f4826d` |
| `templates/404.json` | `ae00068f912423954ab3835917ceb334583a819eeebb98efb26a39d1487d905b` |
| `templates/article.json` | `fb1afa139d1b7a0626260c9c8d1bb0c04a3a04e13442e2b3aedbd539686ecd49` |
| `templates/blog.json` | `2b5ec83a9cdaa79a535c72835fdfd5d71d244ad6fbcaa72bb4989d5bdcea2ccd` |
| `templates/cart.json` | `b3d4a87462ad230aabfaa7a53a9cdbb4f407119d767e247cc5b76ab1b0d2197f` |
| `templates/collection.json` | `26c669b0787feac08786310414b7d1cfbeef090b91046e099d22db9240ab1c29` |
| `templates/gift_card.liquid` | `63fc02fafcfcbd8d1c616a8c05d42452ee102ec9bc0383de8e323b63d67e389c` |
| `templates/index.json` | `9480fd9da6ecb0d6b46a0abd2b230794a8b5fd2460186e58475bc7b65c71eefc` |
| `templates/list-collections.json` | `b9526882804e5bfdeb989cff69699739009b4d171ccf04dc68efab98f61edc5c` |
| `templates/page.about.json` | `41d595cac76e31327c7acf4f5dee42e6d1e972c755bbd8982de5cb5f03aadb7d` |
| `templates/page.contact.json` | `7526e69e246731fde8f0d6099caa3ca0e0b6dcfe777b0b235e987695f4dc202c` |
| `templates/page.documentation.json` | `624f706abee432a06122fda05747f7150e6a34979e12f97c6c87e222ff3e55c1` |
| `templates/page.faq.json` | `2be788d370dca6138926535f448a3b198386421ace4e07ae8ed2a907af61a08f` |
| `templates/page.json` | `c5ba35f58dcc570436916c2c81ec990b3a8c4bb9de45535c3e254b62a73641a7` |
| `templates/page.policy.json` | `1270ccb160059aef66b76c0965f838bca4bd06c82214aabbd38813c8dcfd2581` |
| `templates/page.support.json` | `c450732b83323c5726d53fae350ea63b6245521892156337d7f33137345516ff` |
| `templates/password.json` | `8e2bd3bece7cd9e39b83d9cda94ab8ca7138e0c7183db0a94f806bdfeaa5fd35` |
| `templates/product.json` | `cdcf82c9574125a9a13f2cd2804b7cdc50b7a0adde64c0f864c50c03a394a774` |
| `templates/search.json` | `b8c59f492c78dc3ae214a0682e8b3f262219fc264761eb80c3a328b5a0f72e56` |
