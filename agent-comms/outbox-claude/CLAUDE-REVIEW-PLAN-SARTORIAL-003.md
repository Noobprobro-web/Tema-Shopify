# CLAUDE-REVIEW-PLAN-SARTORIAL-003

Tercera revisión independiente: plan GPT-PLAN-IMPLEMENTACION-SARTORIAL-001 versión 3. Solo lectura; no se modificó el plan, el tema, Git ni ninguna tienda; no se abrieron archivos .secrets ni se imprimieron contraseñas.

| Campo | Valor |
|---|---|
| Fecha | 2026-10-30 |
| Revisor | Claude, revisor independiente (no redactó el plan) |
| Plan revisado | agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v3.md (95.669 B, 517 líneas, sha256 ff08f71d318ea7d07d0ecb9c75d7d184fde5ceb0e257b4ba9d120cd0ad85d7fc) |
| Base de contraste | CLAUDE-REVIEW-PLAN-SARTORIAL-001, CLAUDE-REVIEW-PLAN-SARTORIAL-002, CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001, GPT-AUDIT-THREE-THEMES-MASTER-001 (líneas 189 y 244), ZIP integrado en /home/claude/themes/sartorial-zip y, para scripts y docs del repositorio, el checkout conectado en HEAD b45e913 |
| Veredicto | **Lista con cambios menores.** No hay bloqueantes. Las tres correcciones de la revisión 002 y la opcional de copy están aplicadas, los tres P3 de Antigravity tienen tarea, los diez cambios de la revisión 001 siguen presentes. Quedan cinco ajustes menores (uno de gobierno, uno de seguridad, uno de localizador, uno de contrato y uno de trazabilidad) y varios cosméticos |

Nada de este documento autoriza implementación, escrituras en tiendas, commits, pushes ni publicaciones.

---

## 1. Comprobación de los puntos 1 a 3

### 1.1 Cambios de la revisión 002

| Cambio | Estado | Sección V3 | Contraste |
|---|---|---|---|
| B-04: localizador a `saveNoteAndNavigate` y Checkout nativo | **Aplicado** | §4.2 fila B-04 y "B-04 Contrato de nota y navegación"; §11.1 C9; §11.4 C002-1 | Cita `saveNoteAndNavigate:2990-3030`, `handleCrossSellView:2973-2983`, rama de venta cruzada en `handleDrawerClick` y reconoce que `handleDrawerChange:2438-2457` no guarda nota. Checkout: "envía la nota de forma nativa en el mismo form POST", textarea `name=note` en cart-drawer.liquid:318 y submit `name=checkout` en :351, sin helper. Todo verificado en el ZIP. El contrato descrito (dirty, `noteSavePending`, `keepalive`, 3.000 ms, eco exacto, `noteVersion`, `syncCart` en fallo, sin `beginMutation`) coincide con el código |
| C-08: RC-07 como en GPT MASTER §6 | **Aplicado, y ampliado** | §4.1 fila C-08; párrafo RC-07 tras la tabla de §4.3; §9; §11.2; §11.4 C002-2 | GPT MASTER:189 (TT-63 "Se eleva a P1 condicionado") y :244 (RC-07 "P1 condicionado en ambos") verificados. La V3 adopta P1 condicionado, mueve la fila única a Lote A y deja documentado el antecedente P3 de la maestra Claude. Coherente con lo pedido |
| Decisión sobre lecturas `product.metafields.custom.*` | **Aplicado (opción: retirarlas)** | §1 último párrafo; §4.1 A-02 y "A-02 Retiro cerrado"; §9; §11.1 C3; §11.4 C002-3 | Inventario de catorce fuentes exacto contra el ZIP (ver §3). No propone crear metafields ni lectores sustitutos; deja fuera `custom.complementary_products` y recomendaciones nativas. Ver problema M1 sobre quién tomó la decisión y M4 sobre el cambio de contrato |
| Opcional: quitar "ATELIER EDITIONS" de listings/sartorial/templates/index.json:35 y :52 | **Aplicado** | §4.3 C-04-N y párrafo de copy cerrado; §11.4 O1 | Valores completos sustituidos por `SARTORIAL` y `SARTORIAL / 02`; verificado que :35 es `settings.text` y :52 `eyebrow`. Conserva `motion_style: atelier`, `atelier_gallery`, `atelier_gift_threshold` |
| Opcional: R-Demo en dos subentregas | Aplicado | §4.4 y §5.2 R-Demo; §11.4 O2 | Mismo ID y candidato, cierre agregado, siete checkpoints |
| Opcional: citar revisión 001 por número de cambio | Aplicado | §1, §11.1, §11.3 | C1 a C10 y O1 a O6 como localizador principal |

### 1.2 Tres P3 de Antigravity

| P3 | Estado | Sección V3 | Contraste |
|---|---|---|---|
| Comentarios "Couture/Edition" en assets/base.css:4145 y :9950 (C-04-N) | **Aplicado** | §4.3 C-04-N-P3; §11.5 | Verificado: ZIP :4145 y :9950; checkout b45e913 :4145 y :9945. La V3 distingue las dos referencias. Diff limitado a comentarios |
| docs/requirements-ledger.md:37 "Medición certificada" | **Aplicado** | §4.3 C-04-P3; §7 G3; §11.5 | Verificado en b45e913:37. Reexpresión sin tocar cifras ni estado `cumplido` de la fila |
| gate5 con THEME_ID 166186909939 y URL fija (0-05) | **Aplicado, con alcance ampliado** | §3.3 0-05-P3 y párrafos siguientes; §5.2 R-G; §7 G2; §9; §11.5 | Verificado en b45e913: ambos scripts con `BASE_URL` y `THEME_ID` en :3-4; live-verify :59, :101, :104; complete-verification :52, :86. La V3 va más allá de "marcar no reutilizable": parametriza y elimina el fallback literal. Ver M2 |

### 1.3 Diez cambios de la revisión 001

| Nº | Estado en V3 | Sección |
|---|---|---|
| C1 precondición de base y remedición | Presente | §3 apertura, 3.2, 0-01, R-0, §7 G4 y párrafo final de §7 |
| C2 caso C y prerrequisito de planes | Presente | A-01 y su matriz, 0-03, R-A |
| C3 política de datos A-02 | Presente y cerrada (retiro) | §1, A-02, 0-04, §9 |
| C4 `motion_style` y previews Imprint/Archive | Presente | A-03 y su matriz, 0-02 |
| C5 ocho P2 y exclusión Atelier/Cucuyo | Presente | C-05, C-06, C-07, C-04-P, C-04-N, D-01-N, D-01-L, D-01-V; §1 párrafo 2 |
| C6 release-notes.md como tarea | Presente | C-04-R, G4 |
| C7 escritor único con subagentes | Presente | §2 reglas de concurrencia |
| C8 checkpoints de Claude | Presente | §5.1, §5.2, nota final de §5 |
| C9 ruta de B-04 | Presente y corregida | B-04 |
| C10 C-03 condicionado | Presente | C-03, G2, §8 paso 5 |

Ninguno se perdió ni se deshizo. Las seis opcionales O1 a O6 conservan su decisión de V2 (§11.3).

---

## 2. Problemas encontrados

| Nº | Severidad | Localización | Problema | Cambio propuesto |
|---|---|---|---|---|
| M1 | Menor (gobierno) | Cabecera "Decisión requerida", §1.2, §11.1 C3, §11.4 C002-3, párrafo de copy C-04-N | La V3 atribuye el retiro de las catorce fuentes a una "decisión cerrada de Johandry" (§11.1, §11.4), pero la cabecera y §1.2 dicen que queda "decidido en esta planificación". No hay registro de esa decisión en BOARD.md ni en otro archivo de agent-comms (búsqueda hecha); la única fuente sería la devolución adjunta, no accesible. §2 reserva a Johandry las decisiones de datos, políticas y contenido; lo mismo aplica al copy `SARTORIAL / SARTORIAL / 02` | Citar la fuente y fecha de la decisión de Johandry, o reformular como "propuesta cerrada que Johandry confirma en 0-04 antes de emitir la directiva de A-02 y de C-04-N". No cambia el contenido técnico |
| M2 | Menor (seguridad) | §3.3 0-05-P3; §11.5 | 0-05-P3 incorpora eliminar el fallback literal de contraseña en ambos gate5. Ese punto ya pertenece a la pista F0 del Cerebro (rotar la contraseña y exportar `STOREFRONT_PASSWORD`, responsable Johandry). Quitar el literal del archivo no lo saca del historial de Git del repositorio público; sin rotación el riesgo sigue | Añadir que la rotación sigue en manos de Johandry por la pista F0, que 0-05-P3 se coordina con ella para no editar los scripts dos veces y que el saneamiento del archivo no sustituye la rotación |
| M3 | Menor (localizador) | §4.1 "A-02 Retiro cerrado", párrafo "Ambas superficies consumen los snippets" | `snippets/product-recommendations.liquid:6-12,68-71` no existe en el ZIP. El archivo es `sections/product-recommendations.liquid`; las líneas 6-12 (intent complementary/related) y 68-71 (opciones del setting) sí coinciden | Corregir la ruta a `sections/` |
| M4 | Menor (contrato) | §4.1 A-02; §4.3 C-04-R | Retirar las lecturas `custom.*` y `sartorial.*` cambia el comportamiento visible para un comerciante que ya tenga esos metafields con datos: dejan de mostrarse. Es un cambio de contrato que §2 clasifica como Nivel 2, y el plan no lo dice ni lo lleva a las notas de versión | Marcar A-02 como cambio de contrato de Nivel 2 en su R-D y añadir una línea a C-04-R para que `release-notes.md` lo declare |
| M5 | Menor (trazabilidad) | §3.3 0-05-P3; §4.3 C-04-N-P3 y C-04-P3; §11.5 | Los tres P3 se trazan solo por números de línea de los documentos de origen ("Claude:53,98; Gemini:105"), sin los IDs de hallazgo. Los números de línea dependen del renderizador, el mismo problema que la V3 corrigió para la revisión 001 | Añadir los IDs: C-04-N-P3 = GEM-E-002; C-04-P3 = GEM-G-004; 0-05-P3 = GEM-H-002 (con referencia a GEM-G-001 para el literal) |
| K1 | Cosmético | §4.3 C-04-N | Dice que docs/merchant/support.html:254-255 contienen Edition. Solo :254 lo contiene; :255 es la respuesta, sin el término | Citar :254 |
| K2 | Cosmético | §4.1 A-02 | Los settings de Archive se nombran `circa` y `notes`; las claves reales son `circa_year` y `provenance_notes` (listings/archive/templates/product.json:75 y :78) | Usar los nombres reales |
| K3 | Cosmético | §4.1 A-02 | Al retirar la heurística de título en product-provenance.liquid:30-38, `block.settings.circa_year` pasará a aplicarse a todos los productos de la plantilla; al retirar `is_non_textile` en product-technical-specs.liquid:46-49, `block.settings.gsm` se mostrará también en objetos. La regla general ("un valor no vacío requiere dato factual aprobado para todos los productos") lo cubre, pero conviene nombrar estos dos efectos para que R-A los pruebe | Añadir una frase en A-02 |
| K4 | Cosmético | §4.3 párrafo de copy C-04-N | Siguen en el paquete otras cadenas con "Atelier" o "Couture": listings/sartorial/templates/index.json:19 `HAUTE COUTURE / ATELIER SARTORIAL`, :128 `ATELIER ARCHIVE / STUDY 07`, listings/sartorial/templates/collection.json:10 `ATELIER SARTORIAL / 01` y templates/index.json:90 `Atelier objects`. Encajan en la regla "atelier como oficio", pero el plan no las enumera | Enumerarlas como conservadas a propósito, para que R-C no las reabra |
| K5 | Cosmético | Cabecera RULES, campo "Hallazgos extra fuera de alcance (con parche listo)" | El texto dice a la vez "con parche listo" y "no se prepara ni ejecuta un parche" | Quitar "con parche listo" o poner "sin parche" |
| K6 | Cosmético | §4.2 y §4.1 | Rangos con desfase de una línea: `handleCrossSellView` empieza en :2972 (comentario en :2970-2971); `handleDrawerClick` cierra en :2436; `handleDocumentClick` cierra en :2371; la rama de venta cruzada va de :2408 a :2415 | Sin cambio obligatorio; el plan ya exige revalidar por función |

No se encontraron bloqueantes.

### 2.1 Coherencia interna (punto 4)

| Aspecto | Resultado |
|---|---|
| Dependencias | Sin ciclos. Cadena 0-01 → R-0 → R-D → A → R-A → B → R-B → C → R-C; D prepara desde el inicio y cierra en R-Demo sobre el mismo candidato que llega a R-G. 0-02 bloquea R-A, G1 y G2; 0-03 bloquea el cierre de A-01; 0-05-P3 solo es precondición si se reutilizan los gate5. Los retornos (fallo de G2 que activa C-03, B-04 que excede la conexión del helper) vuelven a R-D, no forman un ciclo. Hueco menor no bloqueante: D-02-Q y D-02-A cambian código después de R-C; R-G lo cubre con "cambio posterior exige regresión pertinente" y G4 con manifest final, sin exigir repetir la instalación de C-02 |
| Responsables y esfuerzo | Todas las tareas de 0, A, B, C, D y E tienen dueño, dependencia y banda; los tres P3 tienen banda propia (15-30 min, 15-30 min, 1-2 h). G2 deja su esfuerzo para después del inventario, de forma explícita |
| Verificación | Cada fila tiene criterio de aceptación y checkpoint que la revisa; R-A, R-B y R-G fijan las mediciones independientes de Claude |
| Trazabilidad | Todas las filas citan IDs de las maestras (TT, RC, S, V, LV, G). Excepción: los tres P3 (M5) |
| Reglas | Claras y repetidas: sin copiar código de Atelier ni Cucuyo (§1, E-01); sin crear ni usar las siete definiciones (§1, A-02, §9); sin escrituras en tienda, commits, pushes ni publicaciones sin autorización de Johandry (§2, §3.1, §5.2, §7); un solo escritor a la vez, incluidos subagentes con archivos disjuntos (§2); sin secretos en informes ni arneses (§5.1, 0-05-P3) |

### 2.2 Observación de contexto (sin cambio en el plan)

El checkout de coordinación en b45e913 no contiene la regla de placeholder del footer (`.site-footer__newsletter .newsletter-form__field input::placeholder`, 0 coincidencias en assets/base.css) ni `pagerHasFocus` en assets/theme.js (0 coincidencias). La precondición de Lote 0 es real: hoy el único árbol verificado con los tres arreglos es el ZIP integrado. 0-01 ya lo trata como decisión de Johandry.

### 2.3 Corrección a una revisión anterior

La revisión 002 citó las lecturas de product-provenance.liquid en :27, :44 y :50. La V3 usa :27, :42 y :49, que son las correctas en el ZIP.

---

## 3. Referencias contrastadas (punto 5)

Contraste contra el ZIP integrado salvo que se indique checkout b45e913. Ninguna cifra difiere por versión 09f8342: el plan cita ZIP o b45e913 de forma expresa.

| Nº | Referencia V3 | Prioridad | Resultado |
|---|---|---|---|
| 1 | product-technical-specs.liquid:20-23 (custom y sartorial material, gsm, hardware, origin) y :26-38 (`custom.technical_specs`) | P1 | Exacto. Ocho fuentes en :20-23 y una en :26-27 |
| 2 | product-provenance.liquid:27 (provenance_date, era, circa_year), :42 (condition_grade), :49 (provenance_notes) | P1 | Exacto. Total de catorce fuentes confirmado: diez `custom.*` y cuatro `sartorial.*`; no hay más lecturas de metafields en los dos snippets |
| 3 | product-technical-specs.liquid:55-56 (rama `product.type`) y :88-120 (render); product-provenance.liquid:20-24 (badge) y :52-78 (render) | P1 | Exacto |
| 4 | main-product.liquid:1121-1124 y featured-product.liquid:773-776 (cuatro settings técnicos sin `default`) | P1 | Exacto |
| 5 | listings/imprint/templates/product.json:75-78, index.json:114-117 vacíos; listings/archive/templates/product.json:75-78 vacíos; archive index.json:111 con "Curated period selection with documented archival provenance" | P1 | Exacto (ver K2 por los nombres de clave) |
| 6 | main-product.liquid:700/703 y featured-product.liquid:451/456 (render de los snippets) | P1 | Exacto |
| 7 | cart-drawer-recommendations.liquid:80 (`custom.complementary_products`) y product-recommendations :6-12, :68-71 | P1 | Líneas exactas; ruta errónea `snippets/` en lugar de `sections/` (M3) |
| 8 | theme.js `handleDocumentClick` :2357-2370 con `this.contains(link)` en :2363; `handleDrawerClick` :2384-2435 y rama :2408-2414; `handleCrossSellView` :2973-2983; `saveNoteAndNavigate` :2990-3030; `renderSection` :3404-3408; `handleDrawerChange` :2438 | P2 | Exacto salvo desfases de una línea (K6). `CART_NOTE_SAVE_TIMEOUT = 3000` en :2261; `keepalive: true`; el helper no llama `beginMutation`/`endMutation` |
| 9 | cart-drawer.liquid form :146-370, textarea :318, checkout :351, View cart :366-368; main-cart-items.liquid form :28-233, nota :183, checkout :216 | P2 | Exacto |
| 10 | listings/sartorial/templates/index.json:35 `INDIVIDUALLY NUMBERED ATELIER EDITIONS` y :52 `ATELIER EDITIONS / 02` | P2 | Exacto |
| 11 | base.css:4145 y :9950 (ZIP), :4145 y :9945 (b45e913) | P3 | Exacto en ambos árboles |
| 12 | base.css:7035-7037 (placeholder del footer) | Base | Exacto (:7035 selector, :7036-7037 declaraciones) |
| 13 | GPT-AUDIT-THREE-THEMES-MASTER-001.md:189 y :244 | P1 | Exacto |
| 14 | gate5-live-verify.mjs:3-5, :59, :101, :104; gate5-complete-verification.mjs:3-5, :52, :86 (b45e913) | P3 | Exacto. Línea 5 comprobada solo en estructura, con el valor sustituido antes de salir del shell |
| 15 | requirements-ledger.md:37; docs/merchant/docs.html:204; support.html:254-255 (b45e913) | P2/P3 | Exacto salvo :255 (K1) |

Hashes de las fuentes de §1.1 de la V3 (V1, V2, revisiones 001, 002, revisión de la auditoría Antigravity y maestra Gemini): recalculados en el dispositivo, todos coinciden.

---

## 4. Cambios necesarios antes de implementar

Ninguno bloquea; los cinco menores conviene integrarlos en la V3 o en la primera directiva R-D correspondiente:

1. **M1.** Citar la fuente de la decisión de Johandry sobre el retiro A-02 y el copy C-04-N, o reformularlas como propuesta cerrada que Johandry confirma en 0-04.
2. **M2.** En 0-05-P3, dejar la rotación de la contraseña en la pista F0 de Johandry, coordinar la edición de los scripts y declarar que quitar el literal no lo elimina del historial.
3. **M3.** Corregir `snippets/product-recommendations.liquid` a `sections/product-recommendations.liquid`.
4. **M4.** Declarar A-02 como cambio de contrato de Nivel 2 y llevarlo a `release-notes.md` vía C-04-R.
5. **M5.** Añadir los IDs GEM-E-002, GEM-G-004 y GEM-H-002 (y GEM-G-001) a los tres P3.

Cosméticos K1 a K6: a criterio de GPT, sin necesidad de nueva revisión.

---

## 5. Límites

Solo lectura de documentos, del ZIP integrado y de líneas puntuales del checkout conectado. No se ejecutó Theme Check, Lighthouse, axe ni ningún arnés, ni se abrió ninguna tienda. La devolución GPT adjunta (ruta en C:\Users\Johan\.codex) no es accesible desde aquí. No se imprimió ni copió ningún valor secreto. Ninguna conclusión garantiza la aprobación de Shopify.
