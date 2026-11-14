# CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001

Revisión independiente de la auditoría maestra de Antigravity sobre Sartorial. Solo lectura en todas las fuentes; sin secretos; sin cambios en código, tiendas, Git ni ledger.

| Campo | Valor |
|---|---|
| Fecha | 2026-10-29 |
| Revisor | Claude (Fable 5.1) |
| Documento revisado | `agent-comms/outbox-gemini/GEMINI-AUDIT-MASTER-001.md` (32.434 B, 211 líneas, sha256 `7c4eeabac482f29b…`, mtime 2026-10-30 01:02 hora local del equipo). Emisor declarado: "Gemini 3.8 Flash (Orquestador Antigravity)". No referencia anexos por nombre; único candidato con MASTER/AUDIT posterior al 27-oct en `outbox-gemini` |
| Línea base | `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v2.md`, `GPT-AUDIT-THREE-THEMES-MASTER-001.md`, `GPT-AUDIT-THREE-THEMES-VISUAL-001.md`, `CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md`, `CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md`, `CLAUDE-REVIEW-PLAN-SARTORIAL-002.md`, y como antecedente `inbox-gemini/CLAUDE-BRIEF-ANTIGRAVITY-001.md` (brief del Cerebro) |
| Código contrastado | ZIP integrado en `/home/claude/themes/sartorial-zip` (93 archivos; sin `scripts/`, `docs/`, `.github/`). Para los hallazgos de repositorio (G y H) se leyó el checkout conectado `Tema Shopify` en HEAD `b45e913`, con enmascarado de valores |
| Veredicto | **La auditoría no aporta hallazgos nuevos de tema que cambien el plan v2.** Los 2 P0 y 7 P1 que sustentan el "NO APTO" quedan refutados o rebajados; lo que sobrevive como nuevo son tres puntos P3 (comentarios CSS con nombres viejos, vocabulario "certificada" en el ledger, script gate5 con THEME_ID obsoleto) y una nota de endurecimiento opcional |

Límite: Antigravity dice auditar el SHA `09f8342`; el checkout de coordinación está en `b45e913` y no se sabe sobre qué árbol corrió. Los números de línea de `theme.js` que cita no coinciden con el ZIP integrado (ej. su `theme.js:764-768` es `:797-806` aquí; su `:3833-3837` es `:3872-3875`; su `:5573-5596` es `:5612-5634`; su `:5745-5796` es `:5784-5830`). Se verificó por función y selector, no por línea.

---

## 1. Clasificación de los 31 hallazgos GEM

Escala de la columna "Prioridad propuesta": la de las maestras (P0, P1, P1 condicionado, P2, P3). "Plan" indica si pertenece al plan v2 (defecto de tema), es contenido demo, o queda fuera (repositorio/CI, Atelier, Cucuyo).

| GEM | Sev. AG | Clase | Baseline | Veredicto de verificación | Prioridad propuesta | Plan |
|---|---|---|---|---|---|---|
| B-001 zoom `img` nulo en `layout()` | P0 | **Nuevo** | Ninguno | **Refutado.** `main-product.liquid:47` filtra `zoom_images = product.media \| where: 'media_type', 'image'` y pasa solo eso al snippet (`:788`); `snippets/product-zoom.liquid:42-75` pinta un `<img>` en cada `[data-zoom-slide]` (el propio snippet documenta en `:12` que "video y 3D no se amplían"). El `src` inicial es un GIF en línea, así que la imagen existe en el DOM antes de cualquier carga. El `TypeError` solo ocurre si alguien edita el snippet | P3 opcional (guarda defensiva) | No (no es defecto) |
| G-001 fallback de contraseña en `gate5-*.mjs:5` | P0 | **Ya cubierto** | BRIEF-ANTIGRAVITY-001 (tabla de acciones: rotar contraseña y exportar `STOREFRONT_PASSWORD`, responsable Johandry) | Confirmado que el literal sigue en `b45e913` (línea 5 de ambos scripts, patrón `process.env.STOREFRONT_PASSWORD \|\| '<literal>'`; valor no copiado). No es bloqueante de submission: `scripts/` no entra en el ZIP (verificado: el ZIP no tiene esa carpeta). Es higiene de un repo público | P1 de repositorio, fuera del plan | No (pista F0 del Cerebro) |
| B-002 `getFocusableElements` por cada Tab | P1 | **Nuevo** | Ninguno | **Parcialmente.** `theme.js:18-22` filtra con `getClientRects()` y `trapFocus` lo llama en cada `keydown` Tab (`:28`). Es una lectura de layout por pulsación, no "thrashing" (no hay escrituras intercaladas). Cachear la lista rompería diálogos que se re-renderizan (cart drawer). Sin medición que respalde el P1 | P3, sin acción | No |
| B-003 zoom no llama `closeOtherDialogs` | P1 | **Nuevo** | Ninguno | **Refutado como colisión alcanzable.** Todo drawer y modal aplica `inert` a los hermanos de sus ancestros hasta `body` (`applyBackgroundInert`, `theme.js:335-353` y réplicas), así que el disparador `[data-zoom-open]` de la galería queda inerte mientras otro diálogo está abierto. En sentido inverso, `showModal()` (`product-zoom.js:54`) pone el resto del documento inerte por top layer. La corrección propuesta (registrar `product-zoom[open]` en `DIALOGS_WITH_CLOSE`) no funcionaría: `closeOtherDialogs` llama `dialog.close(false)` y `product-zoom` no tiene método `close` (`:70-75` solo tiene `typeof dialog.close !== 'function'` como guarda, lo saltaría en silencio) | P3, sin acción | No |
| B-004 destructuración sin nulos en `connectedCallback` | P1 | **Nuevo** | Ninguno | **Refutado como defecto.** Los ocho `[data-zoom-*]` existen siempre en el único snippet que crea el componente (`product-zoom.liquid:17,19,21,28,40,91,99,112`). `ThemeElement.listen` (`theme.js:159-165`) sí fallaría con `null`, pero no hay marcado del tema que lo produzca | P3 opcional | No |
| B-005 `set()` sobre botones nulos | P1 | **Nuevo** | Ninguno | **Refutado**, misma razón que B-004 (`product-zoom.js:171-180`) | P3 opcional | No |
| F-001 copy del preset Imprint con claims técnicos | P1 | **Cubierto con diferencia** | V-05 (GPT VISUAL, P2) ya cita "aerospace hardware, weatherproof, 500D nylon, grade 5 titanium y MOLLE"; plan v2 D-01-V y 0-04 (política de contenido de Johandry) | Confirmado el texto en `listings/imprint/templates/index.json:21,32,34,35,51,74,153,154`. Diferencia: AG lo sube a P1 "transgrede lineamientos de Shopify" sin citar la norma. Según `BOARD.md:472`, esos textos los introdujo el propio Antigravity al "neutralizar" marcas registradas | P2 (como V-05) | Contenido demo, ya en D-01-V |
| E-001 "Edition" en `docs/merchant/*.html` | P1 | **Cubierto con diferencia** | TT-04 (P2), LV-27, plan C-04-N (mismos localizadores `docs.html:204`, `support.html:254`) | Confirmado en `b45e913` (una ocurrencia por archivo). Diferencia: P1 frente a P2; son docs públicas del repo, no están en el ZIP | P2 (como TT-04) | Ya en C-04-N |
| H-001 `.gitignore:35` | P1 | **Nuevo** | Ninguno | **Refutado como riesgo.** `*.cookies.json` (:35) y `*cookies.json` (:44) son redundantes, no un hueco. `*headers.json` (:43) y `*cookies.json` sin barra aplican a cualquier subcarpeta, incluidas `harness-*/`. El único volcado `raw-env` rastreado (`agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-env-and-urls.json`) tiene los valores de contraseña redactados (comprobado por patrón, sin imprimir) | P3 (quitar la regla duplicada) | No (repositorio) |
| A-001 `settings_data.json:82-150` redundante/divergente con listings | P2 | **Nuevo** | Ninguno | **Refutado.** `listings/*/` del ZIP solo contiene `templates/` (sin settings), así que no existe "paridad" que comprobar. `current` es idéntico al preset `Sartorial` salvo `cart_type` y `show_cart_note`. Los bordes difieren entre presets por diseño (Sartorial `#8F8574`, Imprint `#949494`, Archive `#8A7860` en scheme-1) | Sin acción | No |
| B-006 `resize` sin debounce en zoom | P2 | **Nuevo** | Ninguno | **Parcialmente.** `product-zoom.js:39` llama `layout()` en cada `resize`, pero solo con el diálogo abierto. `layout()` recorre las diapositivas y escribe estilos; sin medición de impacto | P3 opcional | No |
| B-007 `follow()` sin rAF | P2 | **Nuevo** | Ninguno | **Parcialmente.** `product-zoom.js:205-211` lee `getBoundingClientRect` y escribe transform por `pointermove` de ratón. Los `pointermove` ya llegan coalescidos por frame en navegadores actuales; sin medición | P3 opcional | No |
| B-008 listeners de scroll/resize del lookbook activos siempre | P2 | **Nuevo** | Ninguno | **Refutado en su efecto.** `positionPopover()` retorna en la primera línea si no hay popover activo (`theme.js:3872-3875` registran; la función empieza con `if (!this.activePopover \|\| !this.activeTrigger) return;`). El criterio de aceptación "cero cálculos geométricos con el lookbook cerrado" ya se cumple | Sin acción | No |
| B-009 `focusin` con `getBoundingClientRect` por nodo pendiente | P2 | **Nuevo** | Ninguno | **Parcialmente.** `theme.js:5612-5634` solo recorre nodos `[data-reveal]` aún no asentados y es una salvaguarda deliberada de WCAG 2.4.7/2.4.11 (comentario `:5608-5611`). `settle()` intercala escrituras, así que puede forzar layout por iteración en la primera navegación por teclado. Sin medición | P3, sin acción | No |
| B-010 `announce()` sin guarda | P2 | **Nuevo** | Ninguno | **Refutado como defecto.** `[data-zoom-status]` y `data-status-template` están siempre en el snippet (`product-zoom.liquid:15,112`) | P3 opcional | No |
| B-011 `upgrade()` asigna `srcset` sin validar | P2 | **Nuevo** | Ninguno | **Refutado como defecto.** `data-srcset` se emite siempre (`product-zoom.liquid:64`) | P3 opcional | No |
| B-012 `perDeliveryTemplate` no comprobado | P2 | **Nuevo** | Ninguno | **Refutado como defecto.** El atributo lo emiten las dos secciones que montan el componente (`main-product.liquid:183`, `featured-product.liquid:80`) y la escritura está dentro de `if (this.perDeliveryPrice)` (`theme.js:797-806`) | P3 opcional | No |
| B-013 `initQuantitySteppers` y foco a elementos ocultos | P2 | **Nuevo** | Distinto de RC-08/TT-105 (clamp de `nextQuantity`) | **Refutado.** Tres listeners delegados en `document` (`theme.js:5785,5816`) es delegación normal, no múltiple registro. El foco se pasa al hermano `[data-quantity-button]:not([disabled])` del mismo stepper que acaba de recibir el clic (`:5807-5809`): si el stepper es visible, el hermano lo es | Sin acción | No |
| C-001 inferencia por `product_handle` | P2 | **Cubierto con diferencia** | TT-03 / RC-03 / S-03 (P1 condicionado); plan A-02 (P1) | Confirmado (`snippets/product-technical-specs.liquid:47-56, :67-70`). Diferencia: AG lo baja a P2 y su Decisión 2 Opción B propone "configurar una estructura estándar de metafields (`custom.material`, `custom.dimensions`)", que contradice plan v2 §1 (las siete definiciones no se crean) | P1 (como A-02) | Ya en A-02 |
| C-002 `sizes` de `main-about.liquid:42` | P2 | **Nuevo** | Ninguno | **Refutado.** `.main-about__story-media` ocupa el ancho completo del contenedor (`base.css:7845-7852`, grid de una columna en `.main-about__blocks`), y `sizes: '(min-width: 62rem) min(100vw - 4rem, 1300px), 100vw'` coincide con `page_width` 1300 | Sin acción | No |
| F-002 handles de producto distintos por preset | P2 | **Cubierto con diferencia** | TT-63 ("handles fijos", P3), TT-13 / C-02 (qué instala Shopify) | Confirmado: Sartorial usa `nove-blazer`, `serra-coat`…; Imprint `leather-desk-mat`, `structured-tote`…; Archive `1994-cashmere-cocoon-coat`…. Es por diseño (catálogos demo distintos por preset). Homogeneizar handles iría contra la diferenciación que TT-06/TT-17 piden | P3 (como TT-63) | Ya en C-02/D-01 |
| G-002 Node 20 en CI frente a `.nvmrc` 22.12.0 | P2 | **Ya cubierto** | BRIEF-ANTIGRAVITY-001 (`ci.yml:27`, `.nvmrc`; "CI 25 ejecuciones en rojo") | Confirmado en `b45e913`. AG omite que la CI está en rojo y presenta `gates:static` en verde sin aclarar que es local | P2 de repositorio, fuera del plan | No (F0 del Cerebro) |
| G-003 caret `^4.8.0` en `@shopify/cli` | P2 | **Ya cubierto** | BRIEF (lockfile fija 4.8.0; 4.9.4 añade `AGENTS.md` al paquete) | Confirmado: `package.json:24` `^4.8.0`, `package-lock.json:660` `4.8.0`. Con lockfile y `npm ci` ya es reproducible; la Opción B de su Decisión 3 es el estado actual | P3 | No |
| G-004 "certificada" en `docs/requirements-ledger.md:37` | P2 | **Nuevo** | Regla de vocabulario conocida; la fila no estaba señalada | **Confirmado**: "Medición certificada en tienda real: CLS 0.022…" | P3 documental | Sí, C-04 (docs internas): reescribir como medición fechada |
| A-002 `main-collection.liquid:450` | P3 | **Nuevo** | Ninguno | **Refutado.** La línea es `</facet-filters-form>`, cierre normal del custom element tras `</section>`; no hay nada que "reorganizar" | Sin acción | No |
| B-014 usar `scrollend` | P3 | **Nuevo** | Ninguno | No es defecto: `product-zoom.js:30-33` usa scroll + rAF cancelado, patrón estándar. Mejora progresiva opcional | Sin acción | No |
| B-015 rAF huérfano en galería | P3 | **Nuevo** | Ninguno | **Parcialmente.** `theme.js:420-425` es cancel + rAF por evento, no "cada frame". Un frame pendiente al desmontar llamaría `syncSlide` sobre un nodo desconectado, sin efecto visible | Sin acción | No |
| C-003 `widths` repetidos en `main-page.liquid:37` | P3 | **Nuevo** | Ninguno | Preferencia de estilo, no defecto (`main-page.liquid:37-40`) | Sin acción | No |
| D-001 `:focus-visible` con `var(--color-foreground)` | P3 | **Cubierto con diferencia** | TT-02 / RC-04 / A-03 (P1 condicionado Imprint, P2 Archive) | Confirmado `base.css:283-286`. Diferencia: AG lo deja en P3 y no ve la causa real, las sobreescrituras por `motion_style` (`#2b2b2b` en `:9102-9107`, `#b5885c` en `:9126-9131`) que dan 1,33:1 en Imprint. Su "cero violaciones" coincide con LIVE solo para el preset Sartorial (13,95 a 15,7:1), que es el único desplegado | P1 condicionado (como A-03) | Ya en A-03 |
| E-002 comentarios CSS con "Edition" y "Couture" | P3 | **Nuevo** | C-04-N cubre docs y copy; la revisión 002 sugirió barrer el copy del ZIP, no comentarios | **Confirmado** en `base.css:4145` ("Sartorial, Couture, Edition") y `:9950` ("especificaciones tecnicas (Edition)"); AG cita 9945 | P3 | Sí, añadir al barrido de C-04-N |
| H-002 `BASE_URL` y `THEME_ID` fijos en gate5 | P3 | **Nuevo** | 0-05 inventaría arneses | **Confirmado**: `scripts/gate5-live-verify.mjs:3-4` fijan la URL de desarrollo y `THEME_ID = '166186909939'`, que no es ninguno de los temas actuales (189832593651 main, 189707452659 submission). El script apunta a un tema viejo | P3 | Sí, nota para 0-05 (arnés desactualizado) |

### 1.1 Los "puntos conocidos" de su §4

Los seis primeros vienen del brief del Cerebro (`CLAUDE-BRIEF-ANTIGRAVITY-001`), no de las maestras ni del plan. Estados contrastados en `b45e913`: gate5 literal SIGUE; Node 20/22.12 SIGUE; caret SIGUE (con lockfile); "certificada" SIGUE; handle SIGUE; claims Imprint SIGUE. "README de arnés y JSON de entorno RESUELTO" es cierto en cuanto a valores (el único JSON rastreado tiene placeholders), aunque el archivo sigue en el índice. "Dispersión de archivos ~28 de 84 RESUELTO / NO REPRODUCIBLE" no se entiende ni se puede verificar; el ZIP de 93 archivos ya lo registraron ambas maestras (G-06).

### 1.2 Las afirmaciones en vivo de su §5

Sin herramienta, versión, fecha ni cifras; no son verificables. "Cero violaciones" contradice LV-01 (axe `label-content-name-mismatch`, serious, en el mismo tema 189707452659). La distorsión de LCP por el banner de cookies ya la documentó el propio Antigravity en `GEMINI-REPORT-SUBMISSION-NO-BANNER-001` (27-oct). Nada nuevo para el plan.

### 1.3 Conteo

| Clase | Cantidad | IDs |
|---|---|---|
| Ya cubierto | 3 | G-001, G-002, G-003 |
| Cubierto con diferencia | 5 | F-001, E-001, C-001, F-002, D-001 (todas por prioridad o encuadre) |
| Nuevo | 23 | A-001, A-002, B-001 a B-015, C-002, C-003, E-002, G-004, H-001, H-002 |
| Contradice baseline (además de su clase) | 3 | B-001 (declara un P0 donde las dos maestras y el plan registran 0 P0), D-001 (rebaja a P3 el P1 condicionado de TT-02 y omite la causa `motion_style`), §5 "cero violaciones" frente a LV-01 |

De los 23 nuevos: 12 refutados como defecto (A-001, A-002, B-001, B-003, B-004, B-005, B-008, B-010, B-011, B-012, B-013, C-002), 5 parciales sin medición ni acción (B-002, B-006, B-007, B-009, B-015), 2 preferencias de estilo (B-014, C-003), 3 confirmados P3 (E-002, G-004, H-002), 1 refutado como riesgo con residuo cosmético (H-001).

---

## 2. Calidad del documento

1. **Todas las filas dicen "VERIFICADO" sin evidencia de reproducción**: ningún error de consola, perfil de rendimiento, captura ni comando. Los P0/P1 de JavaScript son lecturas hipotéticas de "si falta el nodo", sin haber abierto el Liquid que lo genera.
2. **El veredicto "NO APTO PARA SUBMISSION" no se sostiene**: sus 2 P0 son un `TypeError` imposible con el marcado del tema (B-001) y un script de pruebas que no viaja en el ZIP (G-001). De los 7 P1, cinco son refutados (B-002 a B-005 como bloqueantes, H-001) y dos ya estaban en el plan con P2 (E-001, F-001).
3. **Evidencia histórica como actual**: audita "SHA 09f8342" cuando el checkout está en `b45e913`; reporta `gates:static` y `gates:package` en verde sin decir que son locales ni que la CI de GitHub lleva en rojo (brief del Cerebro).
4. **Norma de Shopify sin cita**: "Los lineamientos de revisión de Shopify desaprueban declaraciones técnicas sin respaldo empírico en tiendas demo" no existe como regla citable; además, el texto señalado lo escribió el propio Antigravity (`BOARD.md:472`), lo que debería declararse.
5. **Metafields**: la Decisión 2 Opción B propone crear `custom.material` y `custom.dimensions`, en contra de plan v2 §1 y A-02 (las siete definiciones pendientes no se crean ni se usan). La Decisión 5 Opción B reabre la nomenclatura "Edition" ya cerrada como Imprint.
6. **Correcciones que no funcionarían**: B-003 (registrar `product-zoom` en `DIALOGS_WITH_CLOSE` sin método `close`), B-002 (cachear la lista de foco rompería drawers que se re-renderizan).
7. **Vocabulario de garantía**: "Dictamen técnico formal", "Veredicto formal", "mandatorio", "se procederá con la re-evaluación" asumen una autoridad de cierre que RULES reserva a Johandry y al revisor independiente. No autoriza acciones, lo que es correcto, pero el tono es de certificación.
8. **Sin copia de código** ni propuestas de tomar código de Atelier/Cucuyo: correcto. No menciona Atelier ni Cucuyo (alcance solo Sartorial, coherente con el plan).
9. **Localizadores de `theme.js` desfasados** respecto al ZIP integrado (ver límite arriba); no indica sobre qué árbol se numeran.
10. Positivo: el ámbito de áreas A a H está ordenado, las descripciones de mecanismo (B-002, B-006, B-007, B-009) son exactas aunque la severidad no; E-002 y H-002 son observaciones correctas que faltaban.

---

## 3. Bloque para GPT (plan v2)

Solo lo verificado y no cubierto. Nada de esto cambia prioridades ni lotes existentes.

| ID sugerido | Superficie | Condición | Evidencia | Prioridad | Lote |
|---|---|---|---|---|---|
| C-04-N-b | `assets/base.css` (ZIP) | Comentarios con nombres de preset históricos: "Sartorial, Couture, Edition" y "especificaciones tecnicas (Edition)" | `base.css:4145`, `:9950` (ZIP integrado). Origen: GEM-E-002 | P3 | C, dentro de C-04-N (barrido de nomenclatura; sumar a la sugerencia opcional de la revisión 002 sobre "ATELIER EDITIONS" en `listings/sartorial/templates/index.json:35,52`) |
| C-04-L | `docs/requirements-ledger.md` (repo, no ZIP) | Fila con "Medición certificada en tienda real" | `docs/requirements-ledger.md:37` en `b45e913`. Origen: GEM-G-004 | P3 documental | C, junto a C-04 (docs internas): reescribir como "medición del <fecha> en <tema/ID>" sin "certificada" |
| 0-05-b | `scripts/gate5-live-verify.mjs`, `scripts/gate5-complete-verification.mjs` (repo) | Arnés apunta a URL fija de desarrollo y `THEME_ID = '166186909939'`, que no es main ni submission; además conserva el fallback literal de contraseña ya señalado por el brief | `gate5-live-verify.mjs:3-5`, `gate5-complete-verification.mjs:5` en `b45e913`. Origen: GEM-H-002 y GEM-G-001 | P3 (inventario); el literal de contraseña sigue en la pista F0 del Cerebro, no en este plan | 0, dentro de 0-05 (inventario de arneses: marcar gate5 como no reutilizable sin parametrizar; no ejecutarlo) |
| Nota, sin ID | `assets/product-zoom.js`, `assets/theme.js` | Endurecimiento opcional (guardas de nulidad en zoom; debounce de `resize`) que no corrige ningún fallo alcanzable con el marcado del tema | GEM-B-001/004/005/006/010/011, refutados como defecto en §1 | Sin prioridad | Fuera del camino de envío; solo si Johandry pide endurecimiento genérico, en una directiva propia y nunca en A/B |

No se propone incorporar: GEM-B-001 como P0, GEM-B-002/003 como P1, GEM-H-001, GEM-A-001, GEM-A-002, GEM-C-002, GEM-B-008, GEM-B-013 (refutados); GEM-F-001, GEM-E-001, GEM-C-001, GEM-D-001, GEM-F-002 (ya en D-01-V, C-04-N, A-02, A-03, C-02 con sus prioridades actuales); GEM-G-001/002/003 (pista del Cerebro, fuera del plan de tema).

---

## 4. Verificación de esta revisión

Lectura completa de GEMINI-AUDIT-MASTER-001 y del plan v2; tablas de hallazgos de las cuatro maestras/anexos y de la revisión 002; `grep` de términos clave en las tres auditorías Claude (INITIAL, MASTER, LIVE) y en `agent-comms/{inbox,outbox}-*` para rastrear el origen de los "puntos conocidos". Código del ZIP leído en `snippets/product-zoom.liquid`, `assets/product-zoom.js` (completo), `assets/theme.js` (bloques `:1-130`, `:335-365`, `:410-430`, `:755-806`, `:3860-3950`, `:5605-5660`, `:5784-5871`), `sections/main-product.liquid:47,85-92,787-789`, `sections/main-about.liquid:36-48`, `sections/main-page.liquid:30-42`, `sections/main-collection.liquid:440-460`, `assets/base.css:280-290,4145,5755-5770,7830-7860,9950`, `config/settings_data.json` (comparación `current` frente a presets por script) y `listings/*/templates/*.json` (handles). En el checkout conectado: `git rev-parse HEAD`, línea 5 de los dos gate5 con el literal sustituido por `<REDACTED>` antes de salir del shell, `ci.yml:27`, `.nvmrc`, `package.json:24`, `package-lock.json:659-661`, `requirements-ledger.md:37`, `.gitignore:30-50`, `git ls-files` filtrado, y comprobación por patrón de que los valores de contraseña del JSON rastreado son placeholders. Ningún valor secreto se leyó en claro ni se copió aquí.

No se ejecutaron Theme Check, Lighthouse, axe, arneses ni se abrió ninguna tienda. No se modificó ningún archivo fuera de este informe.
