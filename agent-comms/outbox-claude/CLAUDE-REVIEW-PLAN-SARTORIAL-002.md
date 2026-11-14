# CLAUDE-REVIEW-PLAN-SARTORIAL-002

Segunda revisión independiente: plan GPT-PLAN-IMPLEMENTACION-SARTORIAL-001 versión 2. Solo lectura; dispositivo sin modificar; sin secretos.

| Campo | Valor |
|---|---|
| Fecha | 2026-10-29 |
| Revisor | Claude (Fable 5.1) |
| Plan revisado | agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v2.md (66.762 B, 423 líneas, copia del dispositivo) |
| Base de contraste | CLAUDE-REVIEW-PLAN-SARTORIAL-001, las dos maestras, los dos anexos (GPT VISUAL, Claude LIVE) y el código del ZIP integrado en /home/claude/themes/sartorial-zip |
| Veredicto | **Aprobar con cambios menores.** Los diez cambios obligatorios están integrados; las seis opcionales tienen decisión explícita; los ocho P2 tienen tarea, dueño y estado; la exclusión de Atelier y Cucuyo es expresa. Quedan tres correcciones puntuales de localizador y redacción, ninguna de alcance |

Nada de este documento autoriza implementación, escrituras en tiendas, commits, pushes ni publicaciones.

---

## 1. Los diez cambios obligatorios

| Nº | Estado | Sección v2 | Justificación y contraste |
|---|---|---|---|
| 1 Precondición del build y remedición | **Resuelto** | §3 (Lote 0), 0-01, §3.2, R-0, R-G, §7 G4 | "No se abre un lote sobre una base que carezca de cualquiera de los tres arreglos"; commit solo con autorización explícita; remedición "después de consolidar todas las correcciones". Localizadores verificados: base.css:7035-7038, theme.js `syncCarouselMode` :444-484 y `applySlide` :508-521, product-zoom.js:249-269 (pointerup en :267). Correcto no congelar hashes históricos |
| 2 Caso C y prerrequisito de planes | **Resuelto** | A-01 matriz, 0-03, R-A | Caso C nombrado; `FormData.getAll('selling_plan')` completo; app y fixtures como dependencia autorizada por Johandry. La corrección que hace la v2 a mi formulación es válida: en una variante `requires_selling_plan` el Liquid no ofrece compra única (main-product.liquid:578 `unless selected_variant.requires_selling_plan`), así que el caso C determinista es el de URL con plan sobre una variante que admite compra única, y el caso de plan obligatorio debe bloquear, no enviar vacío |
| 3 Política de datos A-02 | **Resuelto** | A-02, 0-04, §9 | Defaults de bloque a decisión de Johandry; rama `product.type` (:55-56) en alcance; productos de sartorial-edition como candidatos a revalidar. Ver observación en §3 sobre la ambigüedad de "lecturas existentes de custom.*" |
| 4 motion_style y despliegue de Imprint/Archive | **Resuelto** | A-03, 0-02, §8 paso 3 | Causa correcta: theme.liquid:3, settings_data:157/234/311, base.css:283-285, bloque desde :9058, reglas :9102-9107 y :9126-9131 (verificado). Solo CSS. 0-02 bloquea R-A, G1 y G2 por preset; "antes de cerrar las pruebas que dependen de ellos" |
| 5 Ocho P2 sin estado y exclusión Atelier/Cucuyo | **Resuelto** | §1 párrafo 2; C-05, C-06, C-07, C-04-P, C-04-N, D-01-N, D-01-L, D-01-V | Ver §2 de esta revisión |
| 6 release-notes.md como tarea | **Resuelto** | C-04-R, §7 G4 | Dueño Antigravity, Claude inspecciona el ZIP, "verificar presencia dentro del ZIP, no solo en el repo" |
| 7 Escritor único con subagentes | **Resuelto, más estricto** | §2 reglas de concurrencia | Subagentes también por turnos, aunque tengan archivos disjuntos; GPT integra antes de devolver el turno |
| 8 Checkpoints de Claude | **Resuelto** | §5.1, §5.2, §4.4 R-Demo | Ver §4 de esta revisión |
| 9 Ruta de B-04 | **Parcialmente** | B-04, §4.2 nota | Sección correcta (cart-drawer.liquid:366-368) y exclusión global correcta (theme.js:2358-2368, `this.contains(link)` en :2363). El segundo localizador, theme.js:2438-2457, es `handleDrawerChange` (radios de opción y cantidad), no un guardado de nota: arrastra un error de mi revisión 001, que copió la lista de evidencias de TT-103. La función reutilizable es `saveNoteAndNavigate` (theme.js:2990-3030), invocada por `handleCrossSellView` (:2973-2983). "Checkout" no guarda la nota por JS: el botón `name="checkout"` (cart-drawer.liquid:351) está dentro del mismo `<form>` que la textarea y la envía de forma nativa. Corregir el localizador y la frase "reutilizando la ruta de guardado de Checkout" |
| 10 C-03 condicionado | **Resuelto** | C-03, §7 G2, §8 paso 5, §4.3 nota | Solo se activa por fallo de G2 por preset o en el build final, con diagnóstico; si cumple, diferido documentado |

## 1.1 Las seis opcionales

| Nº | Estado | Sección v2 | Nota |
|---|---|---|---|
| O1 estimaciones | **Resuelto** | A-01, B-02, B-04, D-01, C-04, §8 | Bandas separadas por técnica, configuración, pruebas y esperas externas |
| O2 TT-105/106/108 en P3 | **Decidido en contra, documentado** | §4.4 D-02-Q/A/T y nota | Mantiene P2 para cantidad y disponibilidad por la devolución GPT. Es una decisión de triaje legítima y queda sin rebaja tácita. Sin objeción |
| O3 reutilizar arneses | **Resuelto condicionalmente** | 0-05, A-03, B-01 | Inventario previo; etiqueta sintético/tienda. Nota: la VM y `$HOME/livetest` sí existen según LIVE §0 (insumos), pero inventariarlos antes de prometerlos es prudente |
| O4 breakpoint por data | **Resuelto** | B-01 | "Fuente coherente del breakpoint" evaluada en R-D |
| O5 IDs de tema en la ficha | **Resuelto** | §3.3 nota final | Los IDs se tratan como pistas a revalidar; correcto |
| O6 Lote E tras el envío | **Resuelto** | E-01, §4.5 | Diferido con motivo |

---

## 2. Los ocho P2 antes sin estado

| Hallazgo | Tarea v2 | Estado / dueño | Observación |
|---|---|---|---|
| TT-15 | C-05 | planificado / GPT | Las siete secciones listadas coinciden con GPT MASTER TT-15. Bien que exija comprobar usos antes de restringir con `enabled_on` |
| TT-19 | C-06 | planificado (verificación) / Antigravity, GPT si hay arreglo | Correcto tratarlo como hipótesis a reproducir o descartar |
| TT-51 | C-07 | planificado / GPT | Localizadores verificados: main-product.liquid:722-779 (loop :724), featured-product.liquid:482-484, theme.js `getVariantData` :614-690; guardas product-card.liquid:94/:113 (`> 250`), complete-the-look.liquid:20-28 (`> 250` con `variants_count`, `>= 250` sin él), cart-drawer-recommendations.liquid:141 (`> 100`). Todo exacto |
| TT-14 (plantillas del vendedor en el ZIP) | C-04-P | planificado / Antigravity propone, GPT ejecuta, Johandry decide | Incluye el claim "Each preset changes theme settings only" |
| LV-25 | D-01-L | planificado / Antigravity, Johandry valida | Idioma y tallas reales |
| LV-26 | D-01-N | planificado / Antigravity | Navegación por preset |
| LV-27 + TT-04 | C-04-N | planificado / Antigravity | docs.html:204 y support.html:254 coinciden con MASTER TT-04. El ZIP no contiene "Edition" como nombre de preset (solo la palabra común "edition" en main-password.liquid:172, main-list-collections.liquid:99 y page.contact.json:18), lo que confirma la afirmación de la v2 |
| V-05 contenido | D-01-V | planificado / Antigravity, GPT si cambia lógica | Correctamente ligado a A-02 como una sola raíz |

Exclusión de Atelier y Cucuyo: explícita en §1 párrafo 2. Además la v2 corrige un error de mi revisión 001: TT-26 (filtros con carrera) es de Atelier, no de Sartorial; la v2 lo retira de C-01 con razón. Lo que sí es de Sartorial en ese ámbito es V-02 y la observación LIVE §4.1 (primera tarjeta en y=735 con viewport de 664), que C-01 cubre.

---

## 3. Regresiones, afirmaciones nuevas y lenguaje

**Nada correcto de la v1 se perdió.** A-01, A-02, A-03, B-01 a B-05, C-01 a C-04, D-01 a D-03 y E conservan ID; B-02 sube al Lote A con P1 condicionado y se regresa en R-B, lo cual es coherente con el escritor único porque A-01 y B-02 tocan theme.js en turnos secuenciales. V-06 queda en la ficha de identidad de §3.3. TT-18 en C-04, TT-13 en C-02, LV-21/22 en D-03.

**Afirmaciones nuevas contrastadas:**

| Afirmación v2 | Resultado |
|---|---|
| C-03: "No se atribuye carga de theme.js a gift-card: esa atribución fue corregida" | Correcto. templates/gift_card.liquid:27 carga solo base.css; coincide con GPT MASTER TT-12. MASTER Claude TT-12 citaba gift_card.liquid:27 por el CSS, no por el JS |
| C-01: TT-26 pertenece a Atelier | Correcto (MASTER §9.4, bloque Atelier) |
| C-08 (RC-07): "La revisión GPT no asigna prioridad a RC-07" | Imprecisa como está escrita. La devolución GPT adjunta no es accesible para este revisor, pero GPT MASTER §6 sí asigna a RC-07 "P1 condicionado en ambos"; Claude MASTER lo tiene como TT-63 P3 para Sartorial. Proponer P2 es razonable y está marcado como pendiente de ratificar; basta reescribir la frase como "las dos maestras discrepan (P1 condicionado frente a P3); esta V2 propone P2" |
| §2: modelo "GPT-6.1 Sol ultra" para futuras asignaciones | Fuera del alcance técnico de esta revisión; es una declaración de proceso de GPT |
| §6: `node scripts/theme-check-sanity.mjs` y `locale-key-inventory.mjs` | No verificables desde este contenedor (viven en el checkout, no en el ZIP). La v2 ya condiciona su uso a inventario. Sin objeción |
| §3.1: `fc849d5` de la revisión de Gemini "corresponde a otro contexto" | No verificable aquí; no afecta al plan |

**Lenguaje de autorización:** ninguno. §1, §2, §3.1, §4.4, §5.2 R-G y §7 repiten que commit, push, publicación, mutaciones de carrito y escrituras en tienda requieren autorización separada de Johandry. "Los roles ya fueron decididos por su instrucción" es coherente con el contexto comunicado por el coordinador y no autoriza acciones.

**Metafields:** §1 y A-02 excluyen crear o usar las siete definiciones "aunque una definición o valor exista actualmente". Queda una ambigüedad operativa que conviene cerrar en 0-04: los snippets ya leen `product.metafields.custom.*` (product-technical-specs.liquid y product-provenance.liquid:27, :44, :50). La política debe decir de forma expresa si esas lecturas se conservan inactivas (devuelven blank mientras no existan datos) o se retiran del código, porque las dos opciones son cambios distintos de alcance y la directiva de A-02 no puede dejarlo a juicio del implementador.

**Copia de código de Atelier o Cucuyo:** ninguna propuesta. §1 y E-01 lo prohíben.

---

## 4. Checkpoints R-0 a R-G

| Aspecto | Evaluación |
|---|---|
| Entradas | Concretas y separadas en prospectivas (R-D) y retrospectivas (resto): SHA base y árbol entregado, lista permitida frente a tocada, diff, informe RULES §1.4, URLs sin credenciales, filas del ledger (§5.1). Buena la cláusula de R-0 para el caso sin cambios |
| Salidas | Dictamen, afirmaciones falsadas con método, extras sin parche, propuesta de ledger, identidad de lo revisado y condición de bloqueo (§5.1) |
| Quién dispara | Antigravity emite directivas y registra turnos (§2, §6); cada checkpoint tiene momento y bloqueo (§5.2). R-D antes de cada directiva, incluido el Lote 0 |
| Mediciones independientes de Claude | Incluidas: foco/teclado/axe en R-A y R-B, Lighthouse/axe/teclado por preset en R-G, matriz funcional de D-02 en R-Demo (§5.2 y nota final de §5). Claude figura como dueño de la medición de G2 (§7) |
| Regresión posterior a D | Añadida con acierto: D-02 puede tocar compra después de R-A/R-B, por eso R-Demo exige regresión de A-01 y B-02 sobre el mismo candidato que llega a R-G |
| Turno del revisor | Previsto: Claude recibe turno de escritura si redacta en el proyecto (§5) |

Observación menor: R-Demo concentra el cierre de todo el Lote D más la regresión funcional; es un checkpoint grande. Aceptable, siempre que Antigravity pueda partirlo en dos entregas (contenido y funcional) si el volumen lo pide; no requiere cambio de texto.

---

## 5. Estimaciones

Ahora realistas y separadas. A-01 código pequeño reestimado en R-D más 0,5 d configuración y 0,5 d pruebas; B-02 0,5-1 d; B-04 0,25 d más regresión; C-03 solo si se activa; D-01 configuración 2-4 d con activos aparte; C-04 docs internas 1-2 d con web y buzón externos sin fecha inventada; los ocho P2 nuevos con banda propia (0,25-1 d cada uno). Sin total aparente, lo cual es correcto dado el número de decisiones externas. Única banda que podría quedarse corta: C-07 (TT-51) si la "estrategia completa" para más de 250 variantes implica paginar o consultar variantes por sección; la v2 ya dice que la implementación se reestima en R-D.

---

## 6. Veredicto y cambios

**Aprobar con cambios menores.**

### Cambios requeridos (menores)

1. **§4.2 B-04 y nota.** Sustituir el localizador theme.js:2438-2457 por `saveNoteAndNavigate` (theme.js:2990-3030) y el patrón de `handleCrossSellView` (:2973-2983); reescribir "reutilizando la ruta de guardado de Checkout" como "reutilizando `saveNoteAndNavigate`, que ya usa la venta cruzada; el botón Checkout envía la nota de forma nativa por estar en el mismo formulario".
2. **§4.3 C-08 y §11.2.** Reescribir "La revisión GPT no asigna prioridad a RC-07": GPT MASTER §6 le asigna P1 condicionado y Claude MASTER lo tiene como TT-63 P3 para Sartorial; la V2 propone P2 como punto medio pendiente de ratificar.
3. **§3.3 0-04 y A-02.** Añadir a la decisión de política de datos la pregunta explícita sobre las lecturas existentes de `product.metafields.custom.*`: conservarlas inactivas o retirarlas del código. La directiva de A-02 debe recibir esa respuesta.

### Opcionales

- C-04-N: incluir en el barrido de nomenclatura el copy de los presets dentro del ZIP que conserva la identidad antigua ("ATELIER EDITIONS" en listings/sartorial/templates/index.json:35 y :52; MASTER §1 ya anotaba los identificadores internos `atelier` en `motion_style`, `atelier_gallery` y `atelier_gift_threshold`). Decidir con Johandry si "atelier" como palabra de oficio es intencional.
- §5.2 R-Demo: permitir partirlo en dos entregas (contenido y funcional) si Antigravity lo necesita.
- §1.1: las referencias de línea de mi revisión 001 (166-175, 179-184) pueden variar según el renderizador; conviene citar por número de cambio, como ya hace §11.

---

## 7. Límites

Solo lectura de documentos y del ZIP integrado; no se ejecutó ningún arnés ni se abrió ninguna tienda. Los scripts del checkout (`scripts/*.mjs`), la devolución GPT adjunta y la referencia `fc849d5` no son accesibles desde este contenedor. No se imprimió ninguna contraseña ni token. Ninguna conclusión garantiza la aprobación de Shopify.
