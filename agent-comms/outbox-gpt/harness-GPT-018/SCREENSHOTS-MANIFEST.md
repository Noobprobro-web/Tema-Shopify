# SCREENSHOTS-MANIFEST: binarios de GPT-018 que NO se copiaron al repositorio

```text
ID: GPT-018-SCREENSHOTS-MANIFEST
Generado: 2026-10-02 por Claude (Opus 5, 1M) durante el rescate GPT-018
Origen: C:\Users\Johan\.codex\worktrees\2482\Tema Shopify  (detached HEAD en 60599ab)
Ruta de origen: agent-comms/outbox-gpt/harness-GPT-018/
Estado de los archivos listados: SOLO EN EL WORKTREE. No hay copia en este repositorio.
```

## Por que existe este archivo

El rescate de GPT-018 trajo al repositorio principal **el registro textual completo** de la
auditoria: informes, manifests, resultados de los arneses y scripts reproducibles. Dejo atras
los binarios, que son las capturas PNG y las fotografias fuente JPG.

No fue un olvido. Son 49.07 MB en 126 archivos. Meterlos en el indice de git es una
decision sobre el peso permanente del repositorio, y esa decision es de Johandry, no de un agente.

> **ADVERTENCIA DE PERDIDA DE DATOS.** Todos los archivos de este manifest siguen existiendo
> **unicamente** dentro del worktree de GPT, que vive bajo `C:\Users\Johan\.codex\`, una ruta
> que el `.gitignore` del proyecto excluye. Son untracked en un worktree en detached HEAD.
> **Si ese worktree se limpia (`git worktree prune`, `git worktree remove`, o un borrado manual
> de `.codex/worktrees/2482/`), estos 126 archivos desaparecen sin recuperacion posible.**
> El sha256 de cada fila permite identificar un archivo si reaparece en otra copia.

## Resumen

| Tipo | Archivos | Peso | Peso medio |
|---|---:|---:|---:|
| `.png` | 105 | 43.17 MB | 421.0 KB |
| `.jpg` | 16 | 5.88 MB | 376.1 KB |
| `.ps1` | 2 | 0.00 MB | 2.1 KB |
| `.html` | 3 | 0.02 MB | 7.6 KB |
| **TOTAL** | **126** | **49.07 MB** | |

### PNG por directorio

| Directorio | PNG | Peso | Contenido |
|---|---:|---:|---|
| `harness-GPT-018/role-01-buyer/` | 37 | 9.73 MB | Rol 01, recorrido de compra en las 3 tiendas demo: home, descubrimiento, PDP, carrito, checkout, campos seguros y errores de red. |
| `harness-GPT-018/role-04-art/concept-only/` | 12 | 27.10 MB | Rol 04, conceptos de direccion de arte no asociados a ninguna variante del catalogo. |
| `harness-GPT-018/role-09-a11y/` | 56 | 6.34 MB | Rol 09, auditoria de accesibilidad: recorridos de teclado y estados de foco en home, PDP y carrito de las 3 tiendas. |

## PNG: lista completa (105 archivos, 43.17 MB)

Rutas relativas a `agent-comms/outbox-gpt/` dentro del worktree.

| # | Ruta | Bytes | sha256 |
|---:|---|---:|---|
| 1 | `harness-GPT-018/role-01-buyer/archive-address-filled.png` | 40264 | `c327422cdc0e2388ac1aff4bf9372b01d81f127e45fcba4f8676a896a6c05cce` |
| 2 | `harness-GPT-018/role-01-buyer/archive-bogus-ready.png` | 84695 | `fc552b7cf936f19c0bbb39bc881a344a698b89ceb40d9f972b7d8fca5c74ab74` |
| 3 | `harness-GPT-018/role-01-buyer/archive-cart-desktop.png` | 77518 | `da561540ce4bf0b58dd19a438fe46dea337350b84d789225393a19cc5101dc9d` |
| 4 | `harness-GPT-018/role-01-buyer/archive-cart-mobile-added.png` | 76660 | `46645932f2fc47ae248a9f3fd20f58f904be72234b6a5ac2011658f42a8df433` |
| 5 | `harness-GPT-018/role-01-buyer/archive-catalog-desktop.png` | 636321 | `6018a67f2752eec12b0d67b982bd6273bff498e5f890b7584690a99634652117` |
| 6 | `harness-GPT-018/role-01-buyer/archive-catalog-mobile.png` | 248209 | `368a4e5538a945731cdc2025867d072e935b61e01ad82977bf888bd503642eec` |
| 7 | `harness-GPT-018/role-01-buyer/archive-checkout.png` | 34302 | `3513b03475628a20d8db5d1db17e3e81cecc21b7923654cb45e2304eaf239082` |
| 8 | `harness-GPT-018/role-01-buyer/archive-home-desktop.png` | 280054 | `6d9e3aa1489acb66cfdd40a50826df2cef6d52b9e17bf78cba2624fff994f669` |
| 9 | `harness-GPT-018/role-01-buyer/archive-home-mobile.png` | 616243 | `225a2ce83bdd498470112418d05c1e25cdad245df3f3a2706ca234289c1af7b3` |
| 10 | `harness-GPT-018/role-01-buyer/archive-menu-mobile.png` | 398369 | `685001e22714cf25291ed62acbaaa688f771818b2485cacdb19ae7b2f100b626` |
| 11 | `harness-GPT-018/role-01-buyer/archive-payment-stage.png` | 67954 | `27d365000d31d8bd601eba912aefa565e6436c4955cd747057e81f14870a4ee6` |
| 12 | `harness-GPT-018/role-01-buyer/archive-pdp-desktop.png` | 804786 | `8ab31f730b5fbe76b0d0485fe4a5c4b0d7834e14228c7180699e72c9572bdffe` |
| 13 | `harness-GPT-018/role-01-buyer/archive-pdp-mobile.png` | 303786 | `ad13feec69424de079bf432e2acdb45deef92565e6c77c42123c61c483c7e4c1` |
| 14 | `harness-GPT-018/role-01-buyer/atelier-address-filled.png` | 39692 | `26a306e7e53b50d383f2c6b0f2b41847711b7adbb2b6b6d28fe009550b678c69` |
| 15 | `harness-GPT-018/role-01-buyer/atelier-cart-desktop.png` | 73044 | `9cc22bc7347d252a9c896a7f53ab6a62fcc14d0baa251d67e0cd7eb90a998265` |
| 16 | `harness-GPT-018/role-01-buyer/atelier-cart-mobile-added.png` | 68575 | `968ada5e601ef479f94a442a35b4615270a79e963e6cde30923a551637a46d75` |
| 17 | `harness-GPT-018/role-01-buyer/atelier-catalog-desktop.png` | 494016 | `39e9e909df6d661dced12f933f98cb0ea0054246393487db76a2f3c2c98fe8d6` |
| 18 | `harness-GPT-018/role-01-buyer/atelier-catalog-mobile.png` | 194800 | `24a6d028a0819ea1f3ac48cd1332e617e9c0e0c67b2842f6bce1dfe227c31c6f` |
| 19 | `harness-GPT-018/role-01-buyer/atelier-checkout.png` | 34100 | `60e99b4091e53ff414b669a3e703d1e2273ea7e8bba90f3b0257f0733dba7169` |
| 20 | `harness-GPT-018/role-01-buyer/atelier-home-desktop.png` | 284844 | `77d16a61d9fbd872e28bc843bf57051efd4aef68a2298a3a8b71537ca37ca824` |
| 21 | `harness-GPT-018/role-01-buyer/atelier-home-mobile.png` | 520420 | `7a64f7f3aa009c8f528ba92df75c5bdec841bf848c46be3b2fa75f0ec5156eea` |
| 22 | `harness-GPT-018/role-01-buyer/atelier-menu-mobile.png` | 272881 | `e2fe7738326239995b37819452ca46b640c42de342a86f111924950ef007c38e` |
| 23 | `harness-GPT-018/role-01-buyer/atelier-payment-stage.png` | 39501 | `ab03947a735141dfd9e6ec1b0243713be4288db0221612417e32b7a3ea53a059` |
| 24 | `harness-GPT-018/role-01-buyer/atelier-pdp-desktop.png` | 615155 | `cab4077dc69d50bb9b96a25098fabf1118a6dd4e30b1ab383f08bafca33d8b5c` |
| 25 | `harness-GPT-018/role-01-buyer/atelier-pdp-mobile.png` | 325515 | `bfa51ffcb3cb2fd227e49517f6e4153721185deddb765695653cbb9adfab6d99` |
| 26 | `harness-GPT-018/role-01-buyer/edition-address-filled.png` | 40166 | `7aa0f178d7cced29d83f8eee4e311b9b241a21bb5bb8ce1476742074ea00bdaf` |
| 27 | `harness-GPT-018/role-01-buyer/edition-cart-desktop.png` | 62802 | `17ecea147f55bfc6b064bdff7491a0ef1386b5f873f03dd69e358f71d86514c2` |
| 28 | `harness-GPT-018/role-01-buyer/edition-cart-mobile-added.png` | 80617 | `e866b2020fd1943a81ffe2fabf269446454884fa620cfb0a3645a187d6e99999` |
| 29 | `harness-GPT-018/role-01-buyer/edition-catalog-desktop.png` | 594488 | `89783140d465f9e01a41642d5b303d3e5433032ed7b73b160a8658fcc9532f14` |
| 30 | `harness-GPT-018/role-01-buyer/edition-catalog-mobile.png` | 117375 | `c2458d1fea962a8ffdca38bee4ddf37b3d31d9c903957eadaec86c17f42caff4` |
| 31 | `harness-GPT-018/role-01-buyer/edition-checkout.png` | 34138 | `cf0e6f4a5b76bfe5af943dede126b69fdaecefaadd893d47888b8be1022f47df` |
| 32 | `harness-GPT-018/role-01-buyer/edition-home-desktop.png` | 231978 | `eedb1170062fadcd9fc18a93cedb3260633b77bca42a00be0e82cafdcc9612cf` |
| 33 | `harness-GPT-018/role-01-buyer/edition-home-mobile.png` | 625296 | `bf2089833235497bd66b3ea062c2b6f91db4b61515b2fcd90dba093eeb13a4d2` |
| 34 | `harness-GPT-018/role-01-buyer/edition-menu-mobile.png` | 521459 | `80c299f40a9ca26128f4b05e968d2b42353323edc2fed6b2e18e0bed91d17e4f` |
| 35 | `harness-GPT-018/role-01-buyer/edition-payment-stage.png` | 39327 | `9b3f9f74078e929f8a95ec38657a5efeb343d018f787147d4d3204bb6686f7a6` |
| 36 | `harness-GPT-018/role-01-buyer/edition-pdp-desktop.png` | 929809 | `83043016d0e0eb1646c4636c233ed17a74e9f2a0941181d2043fe1a545818c9e` |
| 37 | `harness-GPT-018/role-01-buyer/edition-pdp-mobile.png` | 296593 | `86835753c840d96d5f318a3d05cd7867bf411814a7f6d86793d7423785fd08e9` |
| 38 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-01.png` | 2328223 | `912a25be4a6b896eb39f972485ef56c3d282aaf3598cc794bab82c9d9ba0ce83` |
| 39 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-02.png` | 2555709 | `a311ab9048fd630ab51c0953ec044e2347e31f3b0d37fc64e03620b86d32cd30` |
| 40 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-03.png` | 1881348 | `2ef95840c135987df2aed7fe266382f2c400ca5194d7c6bdd2661eb390740198` |
| 41 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-04.png` | 1966271 | `383e12c35cad0911de4c7816c491e9126acf3ae40b2862088cee45ab350c32cd` |
| 42 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-05.png` | 2333446 | `460d510d8c8c780d65f961176d4a71da30ede3bdd87f475977033a1da986e896` |
| 43 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-06.png` | 2349912 | `ca7021a9882782507917627b6c91b31a255f91b6a3c82be68e285191e1aef973` |
| 44 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-07.png` | 2361420 | `edeadac1e74362d05f7b9c0dc771c471c32904ec42b3219ee5cac1138db2f7a2` |
| 45 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-08.png` | 2894455 | `bbe225d436150155d6ac6816ac1f85d43ad3677e8bed93ef778d385b50c844ca` |
| 46 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-09.png` | 2533290 | `6cd87e56d2b832597aabd85146a7a23eb448e240664fad5b2ecb8f347a045705` |
| 47 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-10.png` | 2399336 | `38707579fa071a02a6f9bcb6fd825c0f397051573e029eb65b5da9ec025eca66` |
| 48 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-11.png` | 2426811 | `a1b63c194d6ba0750ec55bc1781aeb1f10dc6e60f1f07dad06d06b91fed290c8` |
| 49 | `harness-GPT-018/role-04-art/concept-only/unverified-concept-12.png` | 2385509 | `d02b4f72fb08032c7af6ebddd361579e2def3640670e6f05f17e23224c575807` |
| 50 | `harness-GPT-018/role-09-a11y/archive-cart-full.png` | 70727 | `e6ca05bb767df9f15d9928f26eefc7ec3d49aa32fd6992df3aefdcce07d5ae50` |
| 51 | `harness-GPT-018/role-09-a11y/archive-full-add-focused.png` | 96912 | `dedea6f7503f0614633031d7e6dec34af6902cb9522eea80c3a62d52e0119eda` |
| 52 | `harness-GPT-018/role-09-a11y/archive-full-after-add.png` | 43808 | `cd878121f286a5089695c4ba4262c38a9b8628bbaca7944017c8bdd9fb575a51` |
| 53 | `harness-GPT-018/role-09-a11y/archive-full-after-remove.png` | 11903 | `56337b05cde6d7c618ad7646eda9f654529957ad3c77e46d3b9012b758ef328e` |
| 54 | `harness-GPT-018/role-09-a11y/archive-full-remove-focused.png` | 51594 | `1226eb7b4097159258e2b0b37571983e2ece0b973bb60bc25e4a30df0d480954` |
| 55 | `harness-GPT-018/role-09-a11y/archive-full-variant-focused.png` | 213717 | `1c6a7ae5de836643c2e61afd3f4560594abe5da8a1934c3bc05f7677ac53dabe` |
| 56 | `harness-GPT-018/role-09-a11y/archive-home-full.png` | 73707 | `bc64ad4c7f23162e72429a5f0ab0be4c99636701878a670a0e2d8f4bb9a8bbaf` |
| 57 | `harness-GPT-018/role-09-a11y/archive-home-reduced-motion.png` | 241522 | `bf2223ceca807bb6e7d51dd5f4293f7080c46593ec356174f28dc5bbbefa8a2d` |
| 58 | `harness-GPT-018/role-09-a11y/archive-menu-mobile-escape.png` | 246640 | `0e9b456d6593c777bdfec240c43daf8ba44ad49b19b3770cd16dad6b484e9116` |
| 59 | `harness-GPT-018/role-09-a11y/archive-menu-mobile-open.png` | 27716 | `0c4818ac082f5ea6dd8b05965f194892fab3b3b36db95bf52ea9bdcb1e23ec46` |
| 60 | `harness-GPT-018/role-09-a11y/archive-pdp-full.png` | 589579 | `20f1a30f087d79283eafc6e913f4ec68dade342efdb97f1788c1a4b782ca3354` |
| 61 | `harness-GPT-018/role-09-a11y/archive-reduced-add-focused.png` | 82529 | `72361148be06db22e856fdc7c19cee86bab99bd45f77f3640dfc4258e327aa02` |
| 62 | `harness-GPT-018/role-09-a11y/archive-reduced-after-add.png` | 42688 | `30b67828aa107396797e70a5d7ea26ea0d5624c9deb1447eeb650b18b485abb6` |
| 63 | `harness-GPT-018/role-09-a11y/archive-reduced-after-remove.png` | 11903 | `56337b05cde6d7c618ad7646eda9f654529957ad3c77e46d3b9012b758ef328e` |
| 64 | `harness-GPT-018/role-09-a11y/archive-reduced-remove-focused.png` | 47453 | `d2220026c195e856de031dde388c673be85eee12d1b1c7cbf19a0e0b11152698` |
| 65 | `harness-GPT-018/role-09-a11y/archive-reduced-variant-focused.png` | 83421 | `9ce85213d6ffab0fb7b9631209c581e35b3995f98404361a6f38da11bb123b3d` |
| 66 | `harness-GPT-018/role-09-a11y/atelier-cart-full.png` | 67005 | `9091f45c7dbae92216c05279a93f9226000e2c45f3cc1b2dc78791ab08184ecd` |
| 67 | `harness-GPT-018/role-09-a11y/atelier-full-add-focused.png` | 132411 | `1ac469dd9438e2a90b00d3bf82de4240074802a8a98b0eabf83ddd579aa32be2` |
| 68 | `harness-GPT-018/role-09-a11y/atelier-full-after-add.png` | 47909 | `464a1392213dd67540ff95b25964dcc11eba7578bb43e9a203dc6dcf1a53e72c` |
| 69 | `harness-GPT-018/role-09-a11y/atelier-full-after-quantity.png` | 31919 | `9af25841e9525126f41116c6a4f32837eb3d6ab630014e6f5adc19326e6a91a9` |
| 70 | `harness-GPT-018/role-09-a11y/atelier-full-after-remove.png` | 11782 | `837e58c69af0f6d65a8b34bad67b61e5a33bcb675478500e88309a0ca2b90b6f` |
| 71 | `harness-GPT-018/role-09-a11y/atelier-full-quantity-focused.png` | 56087 | `0037a84e3957a6d3fa1c8a369c98b6d32f235ba23d54ba3e91b62da83c9c36cd` |
| 72 | `harness-GPT-018/role-09-a11y/atelier-full-remove-focused.png` | 35103 | `6084a8f4d4780cdc4fd79f97bd119c12d318f98a9f8c03a63af0d80d6242ecbe` |
| 73 | `harness-GPT-018/role-09-a11y/atelier-full-variant-focused.png` | 133011 | `5104e5594ea7ff36373fad41c42a0c174f158274ce893089ea394a439f96ab29` |
| 74 | `harness-GPT-018/role-09-a11y/atelier-home-full.png` | 452126 | `25aab1962bcfa34dc06c3f0d227df77e54dd32331c7b1c09b69725b80a9c83e2` |
| 75 | `harness-GPT-018/role-09-a11y/atelier-home-reduced-motion.png` | 265058 | `80f9bfea06438a77837e0f91dc5702737707413303651343b61b859c2fa678fb` |
| 76 | `harness-GPT-018/role-09-a11y/atelier-menu-mobile-escape.png` | 268448 | `c989afa43a3dc0e5b0323a03efe84ac65038d8bb5f93dcd494563bc142cf2d4e` |
| 77 | `harness-GPT-018/role-09-a11y/atelier-menu-mobile-open.png` | 35995 | `516b6a29619d2bf30395dfda5b7bacd7fcb8631a9e2a00c55109c76aae21385b` |
| 78 | `harness-GPT-018/role-09-a11y/atelier-pdp-full.png` | 373001 | `715691b7d13dcb1434fe73015fb1e176902d6a139dbec10c78761210517e42b1` |
| 79 | `harness-GPT-018/role-09-a11y/atelier-reduced-add-focused.png` | 65358 | `e5224c52459eb1b825af29620e4e5fba387dc02ffe3d553451344e1f0506173c` |
| 80 | `harness-GPT-018/role-09-a11y/atelier-reduced-after-add.png` | 34664 | `b036faf3bf82dcdd1e7cb208cc1fa41e65928235fc0769399c238b22b52b9200` |
| 81 | `harness-GPT-018/role-09-a11y/atelier-reduced-after-quantity.png` | 35000 | `6d18c3fff5e89c89d85f1a1e461085c327a438320aff4b7d3804e2c120306757` |
| 82 | `harness-GPT-018/role-09-a11y/atelier-reduced-after-remove.png` | 11782 | `837e58c69af0f6d65a8b34bad67b61e5a33bcb675478500e88309a0ca2b90b6f` |
| 83 | `harness-GPT-018/role-09-a11y/atelier-reduced-quantity-focused.png` | 37639 | `b0e29f81370b46289c33ae4eb8a2c1fef3f22c306a674a4fe5120b287d5a67ee` |
| 84 | `harness-GPT-018/role-09-a11y/atelier-reduced-remove-focused.png` | 34993 | `873b57bf1c0fad32ca443e4ecbcf4d8c3da44ff0790ab54807db668db007d223` |
| 85 | `harness-GPT-018/role-09-a11y/atelier-reduced-variant-focused.png` | 131928 | `713dc67639c931a3238429bc7b09e05cc7e19bed2f585d80bd517d17c16abf80` |
| 86 | `harness-GPT-018/role-09-a11y/edition-cart-full.png` | 56762 | `100b5cf7d50abae2afb36e9db586aab5ea25cbee01ce419af715916bfeb2b801` |
| 87 | `harness-GPT-018/role-09-a11y/edition-full-add-focused.png` | 186824 | `baf147584a443ad6146696ec67b6103eb6610c8f226ec78117d87a916edf064c` |
| 88 | `harness-GPT-018/role-09-a11y/edition-full-after-add.png` | 46602 | `2ee9bf8594a0e4be37df37ce94b0692407d4f371d79e13ab2a1d282ba6ce1677` |
| 89 | `harness-GPT-018/role-09-a11y/edition-full-after-quantity.png` | 28349 | `30955f0a3e654ad2875d179eebfd74bf284de8b63475343a0d0724be69f37b1c` |
| 90 | `harness-GPT-018/role-09-a11y/edition-full-after-remove.png` | 10483 | `dbd1371f179604115edc09679ed439b04e93c6355ad7ccd5af1eef689ec956fb` |
| 91 | `harness-GPT-018/role-09-a11y/edition-full-quantity-focused.png` | 53580 | `e856e9696d8c60896aacb14338b731855a2951612e4a8ff25c3c23f4d1d3b9bf` |
| 92 | `harness-GPT-018/role-09-a11y/edition-full-remove-focused.png` | 34631 | `55ca393a7b0710bd7a73531f07e6177bc66a11844c93f51325758e465d62660d` |
| 93 | `harness-GPT-018/role-09-a11y/edition-full-variant-focused.png` | 190525 | `e62c86d428cfa15dfada617f68e11403918f59a3f6d479567fb5554230d5a5a3` |
| 94 | `harness-GPT-018/role-09-a11y/edition-home-full.png` | 472807 | `551ba79ed4c0e9bc6b1d12b8e58a1c0a6f2cc85f9eb584cb084c168005a63697` |
| 95 | `harness-GPT-018/role-09-a11y/edition-home-reduced-motion.png` | 116648 | `53818802daab9731f00c949a0ac2b37d7d45ba3ae0dd06c199568b4609588b8d` |
| 96 | `harness-GPT-018/role-09-a11y/edition-menu-mobile-escape.png` | 120429 | `f548c0a6092e578919b08551fddb00c45bfe8b466fc401dd30e1726875bfd5c3` |
| 97 | `harness-GPT-018/role-09-a11y/edition-menu-mobile-open.png` | 13575 | `7b2e8398bb528682ba6d79051d5c94448e2b2e4aa35944f2afd9eb44e61f6184` |
| 98 | `harness-GPT-018/role-09-a11y/edition-pdp-full.png` | 707432 | `0eded259d812698ee7ea789aa3912ce9807bb9c4cd702f1e786ea13914915237` |
| 99 | `harness-GPT-018/role-09-a11y/edition-reduced-add-focused.png` | 53040 | `e690f475e24a34db58785070fb49c9e11a933d7169c3fe518736766ef4b7622f` |
| 100 | `harness-GPT-018/role-09-a11y/edition-reduced-after-add.png` | 37817 | `870f3a1b35bfca074770032f32b06c812576f8c476efa1b88f743a0b6b7108e2` |
| 101 | `harness-GPT-018/role-09-a11y/edition-reduced-after-quantity.png` | 38494 | `b0d3f1a64f60f9e20f56093c484669adf0f7c410e540ec67de75e1e0aa831eb3` |
| 102 | `harness-GPT-018/role-09-a11y/edition-reduced-after-remove.png` | 10483 | `dbd1371f179604115edc09679ed439b04e93c6355ad7ccd5af1eef689ec956fb` |
| 103 | `harness-GPT-018/role-09-a11y/edition-reduced-quantity-focused.png` | 42076 | `a5fda01a4f794bc93c5d5ca77e74c677498fbaf37f3a7c5f6128be6956da0d6c` |
| 104 | `harness-GPT-018/role-09-a11y/edition-reduced-remove-focused.png` | 38523 | `640d15a8f6b5333082a054182c9cdfdd408ff3febeb88c9f8d75b2838191f5c4` |
| 105 | `harness-GPT-018/role-09-a11y/edition-reduced-variant-focused.png` | 190401 | `dddec7b43fbf66eb6adc867420adee951bba46fe4be7c8c80b261ad4e9d529cb` |

## JPG: fotografias fuente (16 archivos, 5.88 MB)

Descargas del CDN de las tiendas demo que el rol 04 uso como referencia para los recolores por
acabado, mas los dos heroes retirados, capturados como evidencia de contenido observable.

| # | Ruta | Bytes | sha256 |
|---:|---|---:|---|
| 1 | `harness-GPT-018/role-01-buyer/edition-tote-original.jpg` | 441912 | `69b02606015c2c0637431baf0181ae72487cd6d7e35657c28076bcfb637c373d` |
| 2 | `harness-GPT-018/role-04-art/hero-current/archive-current.jpg` | 162551 | `1f7c754fb6386ddd6aa1472b8bd98efd04ac972b3d98207d5f58fb849678fd94` |
| 3 | `harness-GPT-018/role-04-art/hero-current/edition-current.jpg` | 156622 | `a515c51c70b29e9d4b2d9a897ac1a30b50cfd95d27e318f8d463b79b87e79104` |
| 4 | `harness-GPT-018/role-04-art/sources/compact-crossbody.jpg` | 493550 | `b31a94f48597d076d496adef5244065c5a256a51e6f225219aa338983e4e24cd` |
| 5 | `harness-GPT-018/role-04-art/sources/east-west-shoulder-bag.jpg` | 279005 | `51cc482785c27b908173c2f5ae5e3368f7ff1e078d259aa39421a8f55ce7671a` |
| 6 | `harness-GPT-018/role-04-art/sources/folded-valet-tray.jpg` | 417970 | `b31f905d7339968d5fb76e28cdcd626a2e5ba974b86e7061d6163a4f5cb415f2` |
| 7 | `harness-GPT-018/role-04-art/sources/four-slot-cardholder.jpg` | 459010 | `93bb54153887595a79365c8bd9b9b27edfdf0865aca7d2a6d312f5006d41f435` |
| 8 | `harness-GPT-018/role-04-art/sources/leather-desk-mat.jpg` | 420418 | `ac6063cf28f6eafd811309d7802b359bba48f6311ac1149c4ae87e2c8bdd5bb7` |
| 9 | `harness-GPT-018/role-04-art/sources/leather-document-folio.jpg` | 402867 | `2ce69f2c0770438736c0036701fc164ac8bfc9b28c1928b3adff6f4cee39547e` |
| 10 | `harness-GPT-018/role-04-art/sources/leather-key-loop.jpg` | 375054 | `651fba7bd7fdf2a940a37dc2c7bcf138f4bc5159a7933e6ff8742b5c376e88fa` |
| 11 | `harness-GPT-018/role-04-art/sources/milled-brass-paperweight.jpg` | 269450 | `5021b6ff9d0da23f97faac66514ed8606cfd76353e7ac4e93cf3fa72a6416f9d` |
| 12 | `harness-GPT-018/role-04-art/sources/padded-laptop-sleeve.jpg` | 551731 | `14f11cbd3ab94e17c406cccc132e3b459506c402464952d08d5f8208de0cb19b` |
| 13 | `harness-GPT-018/role-04-art/sources/single-pen-sleeve.jpg` | 373736 | `4755437a633f50e052852cd71c6b887d3641e744808d7f4a0443d8c5a6b6427f` |
| 14 | `harness-GPT-018/role-04-art/sources/slim-bifold-wallet.jpg` | 426402 | `ff4987ad2ca588ea49d7bf21f006752e03146b80e606b4ff20a8c8d6af928c2f` |
| 15 | `harness-GPT-018/role-04-art/sources/structured-tote.jpg` | 441912 | `69b02606015c2c0637431baf0181ae72487cd6d7e35657c28076bcfb637c373d` |
| 16 | `harness-GPT-018/role-04-art/sources/zip-travel-pouch.jpg` | 489973 | `2f18ccc3f95a8ec942238f9fbaa7feb1cbdd8af81a34a5ce50dbf27165566437` |

## Otros archivos fuera de la lista de extensiones rescatadas (5)

El rescate copio `.md`, `.json`, `.txt`, `.diff`, `.csv`, `.mjs` y `.jsonl`. Los siguientes
archivos son textuales pero caen fuera de esa lista, asi que **tambien se quedaron atras**.
Los `.ps1` son los scripts reproducibles del rol 04 que `PROVENANCE.md` cita por nombre
(`resize.ps1`, `validate-manifest.ps1`); los `.html` son copias observadas de las paginas
publicas de documentacion y soporte, evidencia del rol 06.

| Ruta | Bytes | sha256 |
|---|---:|---|
| `harness-GPT-018/role-04-art/resize.ps1` | 2048 | `c8d5073204f8d9ba38e282d5edd67abed60d4d2d3f2c972f8d1665e924c78428` |
| `harness-GPT-018/role-04-art/validate-manifest.ps1` | 2245 | `1d38564dd62a5055ab32aaa4e76dc6dec214bc90deeae1d86fa9e8b4e31f2ec7` |
| `harness-GPT-018/role-06-merchant/public-docs.html` | 11994 | `1d2a7cd9a7b9406be3dd991e4d2110657b8d6bb2959c004b7aac6a41bba7ec5e` |
| `harness-GPT-018/role-06-merchant/public-index.html` | 652 | `f764e3a6e3eff30192bafb25dcbf2094ff73279fd551426f993c9d3cc1759a1e` |
| `harness-GPT-018/role-06-merchant/public-support.html` | 10842 | `4903d9fcc633fbf672afac718092a61789c3523e6554370d8cb2b5e518be8aa1` |

## Nota de deduplicacion

Los 12 archivos `demo-assets/edition/*-source.jpg` del worktree son **byte a byte identicos** a
12 de los 13 JPG de `harness-GPT-018/role-04-art/sources/` listados arriba. Verificado por
sha256 de los 12. Es decir: si algun dia se rescatan los JPG de este manifest, no hace falta
rescatar ademas los `-source.jpg` del arbol `demo-assets/` del worktree, porque son el mismo
archivo.

`harness-GPT-018/role-01-buyer/edition-tote-original.jpg` y
`harness-GPT-018/role-04-art/sources/structured-tote.jpg` son tambien el mismo archivo
(441.912 B, sha256 identico): ya venian duplicados dentro del propio worktree.

## Opciones para Johandry

1. **No rescatar.** El registro textual ya documenta cada hallazgo; las capturas eran su
   respaldo visual. Se pierden al limpiar el worktree. Barato e irreversible.
2. **Rescatar solo lo citado.** Copiar unicamente las capturas que los informes citan como
   evidencia de un hallazgo concreto, mas los 13 JPG fuente (5,88 MB) que `PROVENANCE.md`
   necesita para ser reproducible. Deja fuera las capturas de recorrido rutinario.
3. **Rescatar todo fuera de git.** Mover los 49.07 MB a un almacenamiento que no sea el
   repositorio (OneDrive, un adjunto de release, Git LFS) y dejar en el repo solo este manifest
   con la ruta nueva anotada. Conserva todo sin cargar el clon.
4. **Rescatar todo dentro de git.** 49.07 MB permanentes en el historial de un tema que se va
   a enviar al Theme Store. No recomendado.

Recomendacion de quien escribe este manifest: **opcion 3**; y la **2** si hay que elegir algo
que viva dentro del repositorio.
