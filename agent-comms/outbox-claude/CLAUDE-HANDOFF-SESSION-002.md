# CLAUDE-HANDOFF-SESSION-002 — Punto de retome

**Fecha:** 2026-10-02
**Lider tecnico:** Claude (Opus 5) por delegacion de Johandry (CLAUDE-HANDOFF-LEAD-001)
**Estado del repo:** ~83 entradas modificadas, **SIN COMMITEAR**. HEAD = `60599ab`, igual a `origin/master`.

---

## 0. Como retomar

Lee este documento y el informe de sprint `CLAUDE-REPORT-MOTION-002.md`. **No confies en ningun numero de linea** de informes anteriores: se pisaron entre ellos. Deriva todo localizador por grep.

Ruta mas corta al verde, en orden:

1. Renombrado del preset `Edition` -> `Imprint` (decidido, no ejecutado)
2. `npm run gates:static` completo (deberia salir 0 por primera vez)
3. Commit del bloque entero
4. `git push`
5. `shopify theme push` a las 3 demos **sin `--nodelete`**

---

## 1. Autorizaciones vigentes de Johandry

- **Commit y push autorizados** (incluido `shopify theme push` a las demos).
- **Decisiones 2 y 3 delegadas a Claude** (ventana de devoluciones y naming). Ya tomadas, ver seccion 4.

---

## 2. MOTION-002: eliminacion de GSAP (completado, sin verificar en vivo)

### Hecho
- Borrados `assets/gsap.min.js` (72.927 B), `assets/gsap-scrolltrigger.min.js` (44.575 B), `assets/motion.js` (8.235 B) = **125.737 B de JS**.
- Bloque **B8** en `assets/base.css` (~322 lineas): CSS scroll-driven nativo con 9 tokens y 7 keyframes.
- `initScrollReveal` reescrito en `assets/theme.js`, agnostico al motor (no consulta `CSS.supports`).
- `layout/theme.liquid` -11 lineas; `data-motion-engine` eliminado.
- `sections/marquee.liquid` +7 lineas (tercer grupo, token `--marquee-groups`).
- Harness escrito en `agent-comms/outbox-claude/harness-MOTION-002/` (**nunca ejecutado**).

### CIFRA OFICIAL DEL BALANCE (corregida)
Una cifra anterior de "+1,4 KB gzip" circulo y **es falsa**. Medido:

| | gzip | brotli |
|---|---|---|
| `base.css` | +6.241 | +4.877 |
| `theme.js` | +3.165 | +2.718 |
| GSAP fuera | -49.611 | -44.832 |
| **Neto** | **-40.205** | **-37.237** |

Coste anadido real: **9.406 B gzip**. Usa -40.205 B gzip como cifra oficial.

### Dato clave
**GSAP nunca estuvo commiteado.** Los 3 assets estaban untracked y el bloque de `theme.liquid` era trabajo sin commitear. Esto sustituyo un experimento, no retiro una feature desplegada.

### Las 6 correcciones a la spec original
1. **Firefox NO soporta scroll-driven animations.** Ni la 158 Beta lo trae habilitado; sigue tras `layout.css.scroll-driven-animations.enabled`; Bugzilla 1676780 en NEW. Cobertura real **87,22%** (caniuse, ago 2026). Firefox va a la rama de respaldo B8.1.
2. **Hero usa `animation-range-start: exit 0%`**, no `calc(0% - var(--header-offset))`. Con la resta y cabecera de 77px: progreso 0,124 a scroll 0 y 9,7px de fondo sobre el pliegue en el elemento LCP.
3. **El estado oculto fabrica su propio scroll.** `translateY(64px)` desborda el documento: layout 732 -> `scrollHeight` 785. Por eso la guardia de fin de pagina mide contra `root.offsetHeight` y hay un `ResizeObserver` sobre `html`. **NO SIMPLIFICAR NINGUNA DE LAS DOS PIEZAS.**
4. **El marquee cambio de naturaleza:** de velocidad de scroll a posicion (16vw aditivo sobre su bucle de 32s).
5. **Desviacion nivel 1:** en modo `subtle` los elementos visibles al cargar ya no pasan un fotograma ocultos.
6. **Menores:** selector muerto `.newsletter-section .newsletter__inner` -> `.newsletter-section__inner`; `.curated-showcase__tabs` excluido de la animacion de lineas; mascara endurecida a `inset(-100% -1rem 0)` (corregia un recorte REAL en movil 390x844 sin eyebrow); clamp `SETTLE_LINE_MIN = 10`.

### NO verificado (13 puntos)
Storefront vivo (nada), Safari (nunca se abrio), rama B8.1 (lo que ve Firefox, 13-15% del trafico, nunca ejecutada), vista previa de impresion, Lighthouse/CLS/axe posteriores, recorrido de 40 tabulaciones, los 5 estados degenerados, paridad con las demos (**rota**), view-transition con el motor nuevo.

**Importante:** las "mediciones locales en Chrome sobre fixtures" que cita el sprint estan declaradas por los agentes, **no hay artefacto en el repositorio**. Convertirlas en fixture versionado es trabajo pendiente.

---

## 3. Seguridad (remediado en working tree, sin commitear)

### Hecho
- 22 archivos de codigo pasados a `process.env.STOREFRONT_PASSWORD` con guard que falla ruidosamente.
- 16 `.md` trackeados redactados (contenian la contrasena en prosa).
- `git rm --cached -r scratch` (8 archivos, siguen en disco).
- `git rm --cached` de `harness-AUDIT-360-001/lh-headers.json` (cookies de sesion commiteadas).
- `get-cookies.mjs` arreglado: parseaba la contrasena de otro archivo con regex y tras la migracion enviaba cadena vacia **sin lanzar error**. Ahora lee entorno y escribe en `os.tmpdir()`.
- 55 archivos redactados en `harness-TECH-AUDIT-001/` (54 volcados Lighthouse + `raw-env-and-urls.json`). Metricas intactas, idempotente, sha256 verificado.
- `.gitignore` endurecido: `.env`, `.env.*`, `*.local.json`, `*.cookies.json`, `temp-*.json`, `temp-*.txt`, `*.har`, `*headers.json`, `*cookies.json`, `raw-lighthouse-*.json`.

### Estado real de la exposicion
- **`.mcp.json` NUNCA estuvo trackeado** (ignorado en `.gitignore:22`). Las claves de Figma y Composio no se publicaron por git. Queda un blob suelto **inalcanzable** con la clave de Figma (`10cb7820...`), que se purga con el gc automatico (~2026-10-13) o con `git prune --expire=now`.
- **La contrasena de storefront es `1234`** y SI esta en el historial en el HEAD de 3 archivos trackeados (commits `ea3e3dc`, `1779ec2`). Verificado: `git merge-base --is-ancestor ff3dca1 origin/master` -> exit 0. **Esta en GitHub.**
- Repo privado, 1 colaborador. Se decidio **no reescribir historial**.

### PENDIENTE de seguridad
- **5 scripts con el literal, sin arreglar** en `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/`: `crawl-links.mjs:33`, `run-axe-audit.mjs:7`, `run-cross-verification.mjs:13`, `run-responsive-audit.mjs:7` (patron `|| '1234'`) y `measure-live-cls.mjs:6` (hardcodeada sin override). **Arreglarlos es cosmetico: el harness esta untracked y nunca entro en git.**
- `raw-env-and-urls.json`, esos 5 `.mjs` y los `.md` de esa carpeta **no estan cubiertos por `.gitignore`**: a un `git add -A` de entrar al indice.
- 72 PNG en `screenshots/` no escaneables como texto.

---

## 4. Decisiones tomadas por Claude (delegadas por Johandry)

### Devoluciones y plazos: el repo se alinea a la politica publicada
Regla aplicada: **ningun texto del storefront puede prometer algo mas rapido o mas generoso que la politica publicada.**
Politica real: devoluciones **30 dias**; procesamiento **2 dias habiles**.

Aplicado: 14 cadenas en 11 lineas, 8 archivos. "fourteen days" -> "thirty days" (5); "three business days" -> "two business days" (6, todas eran despacho); "24 hours" -> "2 business days" (3, todas despacho). Conservadas 12 (SLA de soporte, horarios, fallbacks sin plazo).

Mas 3 escalados resueltos: umbral de `$150` **eliminado del copy** (estaba hardcodeado en USD mientras `sections/cart-drawer.liquid:9` ya tiene `free_shipping_threshold | money` consciente de divisa); SLA de soporte unificado a **two business days**; flujo de cambios reformulado a "to begin a return" (la politica no ofrece cambio gestionado).

### Naming: el preset `Edition` se renombra a `Imprint`
**Motivo:** existe *Editions* de Pixel Union, vivo (`themes.shopify.com/themes/editions` -> HTTP 200), con preset homonimo. La regla de Shopify (`shopify.dev/docs/storefronts/themes/store/requirements`) exige nombres *unique AND distinct*; una letra no es distinto. **El nombre es irreversible tras subir.**

Verificado: **Imprint libre**, **Quarterly libre**, **Folio OCUPADO** (preset de *Borders*, Krown Themes), **Archive LIBRE**, **Sartorial LIBRE**.

Se eligio Imprint sobre Quarterly: "Quarterly" es una cadencia, no una identidad (un merchant sin drops trimestrales acaba con un nombre que describe mal su negocio). La terna *Sartorial / Archive / Imprint* son tres sustantivos coherentes.

**Riesgo residual aceptado:** cobertura de busqueda a nivel de preset ~95%. Confirmar `Imprint` y `Archive` 48h antes de la submission.

**Alcance del renombrado (NO EJECUTADO):** preset en `config/settings_data.json`, carpeta `listings/edition/` -> `listings/imprint/`, locales, y referencias de ruta en `scripts/`. Decidido tambien renombrar la carpeta para coherencia interna, aceptando que la URL de la demo (`sartorial-edition.myshopify.com`) quede como deuda cosmetica documentada.

**Inteligencia competitiva:** *Borders* (Krown) $380 moda premium; *Prestige* (Maestrooo) $400; *Tailor* (Pixel Union) $300. Valida el posicionamiento de $380.

---

## 5. P0 cerrado + causa raiz

**P0:** 14 URIs `shopify://shop_images/` en archivos que viajan en el ZIP (12 en los tres `listings/*/templates/index.json`, 2 en `sections/header-group.json`) sustituidas por cadena vacia. Grep de `shopify://` en las 8 carpetas del tema -> **0**. Las 7 guardas confirmadas: todas caen a `placeholder_svg_tag`.

### CAUSA RAIZ: premisa corregida

**`scripts/capture-presets.mjs` NO regenera presets ni escribe ningun JSON.** Son 71 lineas que lanzan Playwright, hacen login y guardan 6 capturas PNG en `C:/Users/Johan/.gemini/antigravity/brain/...`. El nombre engana. Verificado: `grep writeFile` en `scripts/` -> 0; un solo commit (`fca1807 chore: add preset screenshot capture script`).

**La causa raiz real es `shopify theme pull` + copia manual.** Los volcados sucios siguen en disco ahora mismo, con **22 URIs** listas para reinfectar si alguien copia de ahi a `listings/`:

| archivo (gitignored, sin trackear) | URIs `shopify://shop_images/` |
|---|---|
| `.tmp/sartorial_templates/templates/index.json` | 6 |
| `.tmp/remote-live/templates/index.json` | 6 |
| `.tmp/edition_templates/templates/index.json` | 5 |
| `.tmp/archive_templates/templates/index.json` | 5 |

### Blindaje aplicado (parcial) y el que falta

**Hecho en `scripts/capture-presets.mjs`:** `sanitizeShopFileUris()` recursiva por prefijo de valor (`:36-70`), `writeThemeJson()` como unico camino de escritura sancionado que sanea y luego aborta si el serializado aun contiene el prefijo (`:85-96`), y `assertThemeJsonClean()` como preflight de solo lectura antes de abrir el navegador (`:99-116`). Patron estrecho: `'shopify://shop_images/'` por `startsWith`, nunca regex sobre `shopify://`, asi que `collections/`, `products/` y `apps/` quedan intactos. Prueba: 18/18 PASS, incluida una clave inventada a 5 niveles que ninguna lista de claves habria cubierto.

**PENDIENTE y recomendado: la reja durable va en `scripts/json-validate.mjs`.** Ese gate (`gates:json`) ya recorre `listings/`, asi que bastan ~10 lineas rechazando `shopify://shop_images/` en carpetas del tema. **El blindaje actual no cubre la via real de reinfeccion**, porque nadie ejecuta `capture-presets.mjs` para regenerar presets: su preflight solo salta si alguien hace capturas. Asignar esta tarea es lo que cierra el P0 de verdad.

### Consecuencias: CERRADAS

**Mega menu sin foto:** modificador `mega-menu__promo-card--editorial-text` en `snippets/mega-menu.liquid:171,173` + `assets/base.css:9327-9333`. Reclama la caja del medio en vez de colapsar: `min-height: 15rem` (reutiliza el `grid-auto-columns: 15rem` de `.mega-menu__promos`, da placa cuadrada), `height: 100%` para igualar altura en fila mixta, fondo `--color-surface` (el mismo token que ya era el lecho de la foto). Cero tokens nuevos, cero bordes, cero iconos, cero degradados, cero transiciones. Medido en navegador: sin overflow, tap target conforme, y el default enviado produce dos placas cuadradas de 240x240 con serif centrada. Contraste peor caso **7.17:1** (scheme-4); en el esquema real de la cabecera, **13.80:1**.

**Encabezado de contacto:** `templates/page.contact.json:25` `"Returns and exchanges"` -> `"Returns"`. Descarto `"Returns and refunds"` porque la respuesta no menciona reembolso y anadir una segunda promesa sin respaldo repetiria el defecto que se corrige.

**PENDIENTE: `templates/page.faq.json:68` sigue diciendo `"title": "Returns and exchanges"`** (titulo de categoria). Quedo fuera de la frontera del agente. Incoherente con el contacto y con la politica publicada.

---

## 6. Gates

`.theme-check.yml` **creado** (110 lineas, `extends: theme-check:recommended` + 18 patrones `ignore`, sintaxis verificada con `--init`, **cero checks desactivados**). Resultado: 787 archivos / 2.487 ofensas / 9 errores -> **88 archivos / 0 ofensas / 0 errores**. Las 2.487 salian todas de `scratch/audit-live-pull/`.

Dos exclusiones deliberadamente NO hechas, documentadas en comentario: `listings/` (viaja en el ZIP, 0 ofensas, excluirlo crearia punto ciego) y `.tmp/` (el sandbox de `gates:sanity` vive ahi; excluirlo haria fallar esa compuerta por razon falsa).

`scripts/json-validate.mjs:21` arreglado: `'scratch'` anadido al `Set` SKIP. `gates:json` exit 1 -> **exit 0**. 618 -> 531 JSON revisados, 75 -> 0 fallos (eran **75, no 12** como decia el informe de Gemini). 87 archivos dejan de validarse, los 87 bajo `scratch/`; `/listings/` intacto en 11.

`assets/theme.js`: eliminado `syncItem` (3 referencias). Era la raiz de los 24 errores vnu (`aria-expanded` sobre `summary`). Quedan 21 `aria-expanded`, todos sobre `button`/`input` con rol valido, **cero sobre `summary`**. Segundo frente en Liquid: **ninguno**.

**Estado esperado:** `gates:static` deberia salir **0** por primera vez. **NO SE HA EJECUTADO COMPLETO** tras estos arreglos.

---

## 7. Ledger

**57 -> 60 filas.** `gates:ledger`: 60 filas, 54 `cumplido` / 6 `codigo completo`, 0 incoherencias, exit 0.

- Fila `prefers-reduced-motion` (antes 55, ahora 56): re-citada por grep, **degradada de `cumplido` a `codigo completo`**.
- 3 filas nuevas en `codigo completo`: **38** Motor de Movimiento Nativo, **57** Axioma Anti-Invisible, **58** Contenido Revelado al Imprimir.

### TRAMPA SISTEMICA
El ledger arrastra **localizadores desplazados de sprints anteriores**: filas 32, 33, 47, 48, 49, 51, 53, 54 y mas. El gate no los detecta porque solo comprueba el rango, no el contenido. **Hay filas certificadas como `cumplido` cuya evidencia apunta a codigo que ya no esta ahi.** Deuda de confianza en el instrumento de certificacion. No abierta a proposito.

### Regla operativa
**Cita filas del ledger por NOMBRE, nunca por numero de linea.** La numeracion se mueve con cada edicion.

### No existe fila de distribucion/empaquetado
La unica afirmacion sobre el ZIP esta incrustada en la celda de evidencia de *Presets Diferenciados (1 a 4)*. El P0 no tiene requisito propio al que ser trazable.

---

## 8. Auditorias de GPT y Gemini: triaje

### GPT-018 (auditoria comercial)
Trabaja en worktree: `C:\Users\Johan\.codex\worktrees\2482\Tema Shopify`, detached en `60599ab`. **Ese commit ES tambien el HEAD del principal**: no se quedo atras en commits sino en trabajo sin commitear.

**Tres de sus cuatro motivos de "NO LISTO" ya no son ciertos:**
- Pedidos Bogus: **existen** (`#1001` PAID $1.150 en Atelier, verificado por conector; LEAD-001 registra uno por tienda).
- Contradiccion GSAP en docs: **resuelta** en repo y en vivo (GitHub Pages devuelve 200 con el texto nuevo).
- Parche de URLs: **ya aplicado** (sin commit). `git apply --check` falla porque el cambio ya esta.

**TRAMPA:** su texto de reemplazo en `role-06-merchant.md:46` dice "Full motion optionally loads GSAP and ScrollTrigger". **NO APLICARLO:** hoy seria falso.

**Falsos positivos:** derechos de fotos CDN (son de GPT-016 con procedencia en `demo-assets/edition/PROVENANCE.md` del principal, 19.490 B); umbral de hero >=2752px (es del brief del usuario, no de Shopify, y su upscale no anade detalle nativo); "Archive destaca prenda agotada" (la causa es el pedido de prueba que consumio la pieza 1-de-1: se repone stock, no se re-merchandisea).

**Entregables rescatados:** 86 archivos de texto copiados al principal en `agent-comms/outbox-gpt/`, sha256 verificado 86/86. Indice en `GPT-018-RESCUE-INDEX.md`.

### TECH-AUDIT-001 (Gemini)
**Su veredicto "APTO TRAS PARCHES" no se sostiene.** Contiene fabricaciones verificadas:
- **Numero inventado:** la tabla de verificacion cruzada dice Archive Home Movil Run1 vs Run3 = 96 vs 96, delta 0,0%. Su propio `raw-lighthouse-summary.json` dice `run1=76`. Delta real **26,3%**.
- **Dos de nueve roles no prueban nada por construccion:** `run-cross-verification.mjs:267-313` compara valores almacenados contra literales iguales a esos valores. Identidad matematica. Sin navegador.
- **"Todos los deltas entre 0,0% y 1,0%" es falso:** maximo real **2800%**, 5 campos marcados INESTABLE por su propio arnes. El umbral real era 10%.
- **La compuerta que falla se presenta como aprobada:** `raw-gates-static.txt:52` registra exit 1; el informe muestra 3 sub-compuertas en verde y omite la de nivel superior.
- **El hallazgo del CLS compara dos entornos:** antes 0,1740 de servidor local; despues 0,0041 del mismo servidor **con el fix inyectado por `page.route()`**. Las tiendas en vivo miden **CLS = 0** en ambos modos, en su propia evidencia.
- **Matriz de 212 requisitos:** 76,4% aserciones desnudas, 151 filas con la misma frase byte a byte, **0 filas citan sus propios 5,2 MB de evidencia**. Aritmetica no cierra (205 vs 209 vs titular 206).
- **Ascendio 2 filas del ledger en silencio** contra `RULES.md:93`, una de ellas a sabiendas.
- **"MANIFEST con checksum":** 0 checksums.
- **"0 enlaces rotos en 2.450":** 161 testeados, 0 externos verificados.
- **79 incomplete de axe nunca mencionados** (52 `aria-valid-attr-value` criticos, 27 `color-contrast` serios). El contraste quedo indeterminado, no despejado.
- **Nunca recomendo eliminar GSAP.** Presento los 125.737 B como desglose neutro.

**Lo que SI vale:** medicion de assets exacta al byte; totales de vnu reproducen exactamente; las 18 filas de Lighthouse reproducen exactamente; 0px de desborde genuino; **el P0 es real y bien acotado**; la causa raiz del CLS es mecanicamente coherente.

**NO APLICAR `patch-X5-cls-reduced-motion.diff`.** Empaqueta tres decisiones de diseno para arreglar un artefacto de servidor local. Caducaria la fila 47 (contraste certificado con el velo del hero) y su `font-display: optional` puede dejar **el serif de titulares sin pintar** en primera visita lenta.

---

## 9. Conflictos del BOARD sin resolver (4)

| # | BOARD dice | Realidad |
|---|---|---|
| C-01 | "Modo Lean de GSAP ahorra -55,5%" | GSAP no existe. Ahorro lean = 0 B |
| C-02 | "60 de 60 archivos identicos, cero derivas" | **Hay deriva.** Las 3 demos sirven el motor viejo |
| C-03 | "CLS 0,1740 -> 0,0041 via parche" | Medicion del motor GSAP en servidor local |
| C-04 | "Theme Check 351 archivos, 0 ofensas" | No reproducible: 787/2.487 sin config, 88/0 con config |

---

## 10. LA DERIVA QUE INVALIDA MAS TRABAJO

**Las 3 tiendas demo sirven el build con GSAP. El repo y el ZIP son MOTION-002.**

Prueba: `scratch/audit-live-pull/full-*/assets/` tiene **6 archivos** cada una, incluidos los 3 de GSAP; el repo tiene 3. `full-atelier/layout/theme.liquid:3` sigue emitiendo `data-motion-engine="gsap"` y :103-105 cargan los scripts.

Shopify revisa el ZIP y las demos **como un conjunto**. Mientras exista la deriva, toda captura de ficha, todo numero de Lighthouse del BOARD y todo resultado de accesibilidad describe un producto que no es el que se envia.

**Al empujar: NO usar `--nodelete`.** Con esa bandera los 3 assets de GSAP quedarian en las demos como librerias minificadas de terceros huerfanas, visibles para el revisor. Verificar despues que el conteo de assets baja de 6 a 3.

---

## 11. Reparto de trabajo propuesto

| Agente | Trabajo | Frontera |
|---|---|---|
| **GPT** (worktree) | Ficha del Theme Store, docs de merchant, manifests de arte, memo de decision de copy, clearance de nombres, lote GraphQL de asociacion de variantes, script de capturas | Su worktree. **Precondicion: mover el worktree al commit nuevo** |
| **Gemini** (sin worktree) | G-1 re-medicion de performance post-GSAP; G-2 CLS del template por defecto en tienda real (sin `page.route`, tema NO publicado); G-3 arnes de teclado y trampas de foco; G-4 adjudicar los 79 incomplete; G-5 matriz de estados degenerados; G-6 re-derivar la matriz de requisitos | **Solo** `agent-comms/outbox-gemini/<nuevo-id>/`. Prohibido `git add/commit/apply`, `theme push`, y escribir en ledger/BOARD/outbox-claude/`.theme-check.yml`/`harness-TECH-AUDIT-001` |
| **Claude** | Codigo fuente del tema, gates, ledger, seguridad | `assets/`, `layout/`, `sections/`, `config/`, `locales/`, `docs/`, `scripts/` |

**No delegar a Gemini** aplicar sus propios parches: es verificacion circular, prohibida por `RULES.md` seccion 4.7.

G-2, G-3 y G-4 pueden arrancar **ya**, sin esperar al re-despliegue.

---

## 12. Trampas conocidas

1. **El scratchpad de sesion NO esta aislado entre agentes.** Hubo una colision real de nombres. Exigir prefijo propio en nombres de archivo temporales.
2. **Dos arboles `demo-assets/` incompatibles**, ambos gitignorados. **Solo colisionan 2 rutas y las dos son `PROVENANCE.md`** (`archive/` y `edition/`); ninguna imagen colisiona con otra. Son complementarios. Pero cada texto describe conjuntos **disjuntos**, asi que un `cp -r` en cualquier direccion borra la unica procedencia de 26 imagenes o de 33 pares + 3 heroes. **Reconciliacion propuesta:** `demo-assets/<tienda>/gpt-018/` (deja cero rutas alteradas), el `PROVENANCE.md` raiz a `PROVENANCE-GPT-018.md`, y "anexar" como puntero de 2-3 lineas, no copiar y pegar.
3. **Respaldo ya hecho:** `C:\Users\Johan\sartorial-worktree-backup\` contiene 190 archivos / 284,40 MB con sha256 verificado 190/190, mas `BACKUP-MANIFEST.md` y dos sidecars para `sha256sum -c`. Incluye `atelier/` entera y el `PROVENANCE.md` raiz, que **no existen en el repo principal**. Verificado: de los 64 archivos del lote `demo-assets/`, **ninguno era recuperable desde el principal**. Es una copia unica en el mismo disco fisico: si importan de verdad, hace falta una segunda copia fuera de `C:`.
4. **12 `demo-assets/edition/*-source.jpg` son byte a byte identicos** a 12 JPG en `harness-GPT-018/role-04-art/sources/`: 4,73 MB duplicados.
5. `core.autocrlf=true` sin `.gitattributes`. `theme.js` es CRLF, los `.mjs` son LF. Decidir si el repo quiere un `.gitattributes`.
6. **`.theme-check.yml` esta untracked.** Sin commitearlo la compuerta no es reproducible por nadie mas.

---

## 13. ACCIONES HUMANAS PENDIENTES (Johandry)

| Prioridad | Accion |
|---|---|
| **P0** | **Rotar la contrasena de storefront `1234`** en las 3 demos + `tema-qkqpke0j`. Esta en GitHub. Invalida tambien las cookies de sesion publicadas. Unica mitigacion real |
| **P0** | **Exportar `STOREFRONT_PASSWORD`** (la nueva). Llave de las 4 filas abiertas y de los 13 puntos sin verificar |
| **P1** | **Redesplegar las 3 demos** sin `--nodelete` (cierra la deriva de la seccion 10) |
| **P1** | Rotar el PAT de Figma y la API key de Composio (higiene: nunca se commitearon, pero hay 5 copias en disco y un blob suelto) |
| **P1** | Ejecutar `harness-MOTION-002` y recertificar las filas 38, 56, 57, 58 |
| **P2** | Decidir: changelog para merchants declarando la perdida de la aceleracion del marquee |
| **P2** | Decidir: frase que describa el modo `None`, hoy sin documentar en ninguna superficie |
| **P2** | Sacar el repo de OneDrive (LEAD-001 ya documento una perdida local probablemente causada por eso) |
| **P2** | Reconciliar `demo-assets/` (ver trampa 2) |
| **P3** | Confirmar `Imprint` y `Archive` en el Theme Store 48h antes de la submission |

---

## 14. Estado de los agentes al cortar la sesion

**Los dos completaron. No queda nada en vuelo.**

1. **Respaldo de 284 MB: COMPLETADO.** 190 archivos, sha256 190/190, ambos repos intactos. Ver trampa 3.
2. **Blindaje + mega menu + encabezado de contacto: COMPLETADO.** Ver seccion 5. Dejo dos tareas pequenas pendientes: la reja en `scripts/json-validate.mjs` (~10 lineas, es lo que cierra el P0 de verdad) y `templates/page.faq.json:68`.

### Estado de gates al cerrar la sesion, medido

| comprobacion | resultado |
|---|---|
| `node scripts/json-validate.mjs` | 531 JSON, **0 fallos**, exit 0 |
| `shopify theme check` | **88 archivos, 0 offenses**, exit 0 |
| `node --check scripts/capture-presets.mjs` | exit 0 |
| `JSON.parse(templates/page.contact.json)` | OK |
| llaves de `assets/base.css` | 1464/1464, delta 0 |
| `grep shopify://` en las 8 carpetas del tema | **0** |

`git status --porcelain`: **85 entradas**, todas sin commitear. Ninguna entrada desaparecio ni cambio de estado durante la sesion.

### Las 3 primeras tareas al retomar

1. Reja `shopify://shop_images/` en `scripts/json-validate.mjs` (~10 lineas) — cierra el P0 de forma durable
2. `templates/page.faq.json:68` `"Returns and exchanges"` -> `"Returns"`
3. Renombrado del preset `Edition` -> `Imprint`

Y despues: `npm run gates:static` completo -> commit -> `git push` -> `shopify theme push` sin `--nodelete`.
