# CLAUDE-AUDIT-THREE-THEMES-MASTER-001

Auditoría maestra independiente de Claude sobre Sartorial y Atelier de Sebas (Contour), con Cucuyo en anexo. Construida sobre CLAUDE-AUDIT-THREE-THEMES-INITIAL-001 y sobre la verificación cruzada contra la auditoría inicial de GPT.

## 0. Encabezado

| Campo | Valor |
|---|---|
| ID | CLAUDE-AUDIT-THREE-THEMES-MASTER-001 |
| Fecha | 2026-10-28 |
| Estado | Versión final tras la revisión independiente R2. |
| Base propia | CLAUDE-AUDIT-THREE-THEMES-INITIAL-001.md (sha256 `d31ced8363b57605d3d7fd5e127f379f7f65215c6c5ca4e1a27bc23a60d88284`), con sus informes A1 a A8, V1 y la revisión independiente R1. |
| Auditoría contrastada | GPT-AUDIT-THREE-THEMES-INITIAL-002, leída solo desde la copia /home/claude/gpt/GPT-AUDIT-THREE-THEMES-INITIAL-002.md (sha256 `98de427290db164567fed40c15e527d861c0992643eaeb5ef95429d0135f7b68`, comprobado antes de leer). No se abrió la auditoría maestra de GPT ni ningún otro archivo de outbox-gpt. |
| Insumos de la verificación cruzada | scratchpad/cross/X0-mapa.md (mapa de 41 afirmaciones G-01 a G-41), V-compra.md, V-a11y.md, V-arquitectura.md, V-comerciante.md, V-themestore.md y los arneses de scratchpad/cross/harness-{compra,a11y,arq,com}. |
| Coordinación y modelos | Sesión principal de Claude Code como orquestador. haiku: fijación de versiones, investigación, inventario (A1) y preparación de archivos (staging). opus: A2, A6, A7, A8, V1, redactor único (INITIAL-001 y este documento), X0, V-comerciante y V-themestore. sonnet: A3, A4, A5, V-a11y y V-arquitectura. fable (esfuerzo high): revisión R1, V-compra y revisión R2. |
| Revisión independiente R2 | Revisor fable, esfuerzo high (scratchpad/audit/R2-revision-fable-master.md). Veredicto: requiere cambios menores. Aplicados los 6 cambios requeridos (modelos en §0, escala de GPT en §8, matiz de TT-03 con su efecto en Compra, inferencia marcada en TT-100, lectura alternativa de Compra para los dos temas, descripción del arnés s2) y las 5 mejoras opcionales (requisito duro de unicidad en §3 y TT-08, release-notes.md en G4, origen del registro del sha256 del ZIP, nota informativa en §12.3, segundo incidente en §10). El borrador se conserva sin cambios en CLAUDE-AUDIT-THREE-THEMES-MASTER-001.draft.md. |
| Alcance | Candidatos comparados: Sartorial v1.0.0 (Sartorial, Imprint, Archive) y Atelier de Sebas = Contour 4.1.0 (Contour, Annex, Maison). Cucuyo 2.0.0 queda en el Anexo A, fuera de recuentos, matriz y comparación entre candidatos. |

**Limitaciones (comunes a todo el documento)**

- Sin tienda, sin demos, sin editor de Shopify, sin Lighthouse, sin axe en tienda, sin tecnología asistiva. Las pruebas nuevas de esta fase son arneses locales: funciones originales copiadas al scratchpad y ejecutadas con Node 22 y jsdom 24.1.3 (p3, s8, c1 y p4); un fixture (s2) que reproduce a mano el cambio de estado de theme.js:771-780 sobre un marcado reducido del Liquid real, sin ejecutar la clase original; y fixtures mínimos con el CSS y el JS reales en Chromium sin interfaz (Playwright). No son páginas renderizadas por Shopify.
- Sin acceso a la carpeta C:\Users\Johan\Documents\Drive\Tema-Shopify-codex ni a STOREFRONT_PASSWORD.
- Las prioridades son juicio de triaje con un criterio explícito (sección 9.1). Ninguna conclusión garantiza la aprobación de Shopify.
- Las recomendaciones no autorizan implementación. Las siete definiciones de metafields propuestas para Sartorial siguen sin aprobar. No se copia ni se propone copiar código de Atelier ni de Cucuyo.

**Transparencia de seguridad.** En esta fase hubo dos incidentes: la salida de un comando de V-arquitectura y, después, la de un comando de la revisión R2 imprimieron cada una, una vez, la contraseña de las demos de Atelier en un registro interno de herramientas. El valor no aparece en ningún informe ni archivo, tampoco en este. Se recomienda rotarla junto con lo que pide TT-31 (detalle en §10).

---

## 1. Fijación de versiones

| Tema | Versión | Qué verificó Claude | Qué no verificó Claude |
|---|---|---|---|
| Sartorial | 1.0.0 (theme_info, autor "Ruiz Digital") | sha256 del ZIP integrado `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3`, **calculado por Claude dos veces** durante la fijación (en el equipo de Johandry y en el contenedor) con el mismo resultado; coincide con el de GPT (G-01). Hashes de base.css (`5d9ed6b2…`), theme.js (`861fe0d6…`) y product-zoom.js (`4828d5a1…`) recalculados de nuevo el 28-oct en el árbol extraído (V-themestore, V-arquitectura); coinciden con los de GPT (G-04). Árbol extraído: 93 archivos y 14 directorios = 107 entradas, coherente con el `entries 107` de GPT (G-06). | HEAD 09f8342 del checkout Tema-Shopify-codex (sin acceso a la carpeta). Tema publicado 189832593651 (sin STOREFRONT_PASSWORD; la lectura API que cita GPT en G-05 no se pudo reproducir). |
| Atelier de Sebas | Contour 4.1.0 (theme_info, autor "Sebastián Ruiz") | `git ls-remote` anónimo el 28-oct a las 10:52Z: main `1576d06b…`, annex `183b4889…`, maison `16f00f74…`, sin cambios desde el 27-oct. Código idéntico entre ramas salvo settings_data.json y cinco plantillas. El repositorio **sigue legible sin credenciales** el 28-oct. | Demos contour-ho5kbo9x, annex-r0zzjfjf y maison-10oym9w0: no visitadas. |
| Cucuyo | 2.0.0 | Instantánea 727c0d4 (clon anónimo del 27-oct a las 12:45). | El 28-oct a las 10:52Z, `git ls-remote` sin credenciales devuelve lo mismo que un repositorio inexistente o privado. Vigencia no confirmada. Ver Anexo A. |

Rechazo de una observación interna: V-themestore (§4) señaló que Claude solo había declarado el sha256 del ZIP. El coordinador confirma que Claude lo calculó dos veces y que coincidió; esa observación se rechaza. Límite de evidencia: esos dos cálculos no dejaron artefacto en el scratchpad y constan solo en el registro del coordinador (A1:9 lo trató como declarado porque no lo vio). Hoy el ZIP ya no está en el contenedor (V-arquitectura no pudo recalcularlo), lo que no cambia el resultado de la fijación.

Archivo no usado: en la raíz de la carpeta conectada hay otro Sartorial-1.0.0.zip (346.291 B, 24-oct). **No se abrió ni se usó.** Ningún hallazgo de este documento procede de él.

Discrepancias que siguen vigentes de INITIAL-001: presets Sartorial, Imprint y Archive (el encargo original decía Atelier, Imprint, Archive; los docs públicos dicen Edition); identificadores internos "atelier" en Sartorial (valor de `motion_style`, bloque `atelier_gallery`, ajuste `atelier_gift_threshold`); "Atelier de Sebas" es Contour, no el tema gratuito Atelier de Shopify ni el antiguo preset de Sartorial; la causa de los rechazos de Atelier sigue **sin verificar** y no se presenta como causa en ningún punto.

---

## 2. Tipos de evidencia

| Etiqueta | Tipo | En esta fase |
|---|---|---|
| EST | Estático: lectura de código, schemas, plantillas y documentos del repo | Hecho |
| EST-web | Páginas oficiales de Shopify y documentación pública, descargadas | Hecho (V-themestore descargó el 28-oct requirements, submit-theme, listings, common-theme-rejections, test-theme y success/updates, texto literal sin resumidor) |
| SIN | Sintético: Theme Check, contraste calculado, conteos por script | Hecho en INITIAL-001; contraste recalculado en V-a11y |
| SIM | Simulación local: funciones originales en jsdom o fixtures en Chromium | Hecho (arneses de la sección B del Anexo) |
| TR | Tienda real | **Ninguna** |
| TA | Tecnología asistiva | **Ninguna** |

Correspondencia con GPT: su E equivale a nuestro EST; su simulación dirigida equivale a SIM; su T y su ausencia de AT coinciden con TR y TA. Ninguna de las dos auditorías tiene evidencia de tienda.

---

## 3. Requisitos oficiales de Shopify (cambios respecto a INITIAL-001)

Las fuentes y la tabla de 22 funciones de INITIAL-001 §3 siguen vigentes. Cambios tras la descarga literal del 28-oct (V-themestore):

| Tema | Texto oficial | Cambio en nuestra auditoría |
|---|---|---|
| Demos | "To build your demo store, create a client transfer store in the Dev Dashboard" y "Dev stores can't be transferred". | **Corrección a A7 (claim d):** el término "transfer store" sí aparece. Las demos deben ser client transfer stores. |
| Demos y paridad | "All theme presets must include at least one demo store"; "Each theme preset install store must match the expectations set by the demo store"; "each preset's install state should mirror its demo". En listings: "For each preset, provide a link to a complete and fully functioning demo store that uses that preset"; "All demo stores must use the same password". | Las demos se piden en el formulario de envío, no en el ZIP, y se revisan en la etapa 5. Por eso pasan a compuerta (sección 4). |
| Lighthouse | "minimum average Lighthouse performance score of 60 … Tests are run using a benchmark dataset" y, aparte, "sections must contain actual images and content". | Se citan las dos frases. Ambas auditorías tenían formulaciones parciales. |
| Notas de versión (§19) | "the theme needs to have a version number and release notes" al enviar; success/updates l. 86 pide un archivo release-notes.md en la raíz del ZIP. | Nueva compuerta G4. Sartorial no trae notas de versión. Ninguna de las dos auditorías lo había planteado como requisito. |
| Precio | "You can price your theme from $100 USD to $500 USD in increments of $10. Gage the amount of settings, level of design, size of the catalog it's built for, and the amount of development…" | 380 USD es válido formalmente; GPT tiene razón en que sigue siendo una hipótesis comercial (G-37). |
| Nombres | Requisito duro (requirements, l. 508 del texto del 28-oct): "Theme and preset names must be unique and distinct from existing themes in the Shopify Theme Store". Guía aparte, en la lista "Increasing clarity and discoverability": "Don't use the same name as an existing theme and preset name". | El requisito duro habla de "existing themes"; si alcanza a un preset de otro tema lo dice solo la guía. Por eso TT-08 queda como riesgo alto, no como incumplimiento demostrado. Límite: "Imprint" y "Archive" solo se comprobaron como nombres de tema (404, A7), no como presets de otros temas. |
| Actualizaciones | success/updates: la raíz de /templates y /sections debe contener el base set y no deben incluirse JSON de demo que el comerciante no deba usar. | Se cita en TT-13 y TT-63. |

---

## 4. Compuertas de envío

Las compuertas son condiciones de proceso que bloquean el envío si no se cumplen. No son defectos de código y no entran en la escala P0 a P3.

| ID | Compuerta | Requisito | Estado | Bloquea el envío |
|---|---|---|---|---|
| G1 | Demo por preset (Sartorial, Imprint, Archive) en client transfer store, misma contraseña, contenido real, instalación igual a la demo | requirements §18 y §20; listings | **No verificado.** Ni el ZIP ni los docs declaran demos, pero Shopify no las pide en el ZIP. Hay indicios en la carpeta conectada (nombres de archivos de septiembre sobre una tienda en vivo y capturas de presets antiguos, no abiertos) que impiden afirmar que no existen, y que tampoco prueban demos conformes. | Sí, si no existe |
| G2 | Lighthouse medido: promedio de rendimiento 60 o más y de accesibilidad 90 o más en home, producto y colección, desktop y móvil, con contenido real | requirements §6 | No medido por ninguna de las dos auditorías | Sí, si no se alcanza |
| G3 | Material del listing y canales públicos: capturas por demo (2000x2496 o 1000x1248, y 750x1334), datos del formulario, documentación pública consistente con FAQ y formulario de soporte verificable | listings; requirements §21 | Pendiente. Afectado por TT-04 (docs con "Edition") y TT-05 (email de soporte en un dominio de titularidad no confirmada) | Sí, para completar la etapa 5 |
| G4 | Número de versión y notas de versión | requirements §19 ("the theme needs to have a version number and release notes"); success/updates l. 86 ("create a markdown file in the root of your theme's ZIP called release-notes.md") | Sartorial no trae release-notes.md ni ningún changelog (A7-09 lo había dejado en P3 sin tratarlo como requisito). Atelier trae RELEASE-NOTES.md, con un nombre distinto del pedido (informativo: Atelier no está en evaluación de envío ahora) | Sí |

Antes, en INITIAL-001, la falta de demos era TT-01 (P0). Ahora es G1. Resultado: **0 P0 confirmados** en esta auditoría, igual que GPT (G-41). El desacuerdo que se conserva está en la sección 8.

---

## 5. Inventario de presets (candidatos)

Ningún preset se observó en una demo. "Observado en demo": no observado en los seis.

| Tema | Preset | Presente en código | Nota de la verificación cruzada |
|---|---|---|---|
| Sartorial | Sartorial | settings_data `presets.Sartorial` (:82); listings/sartorial/templates/{index,collection,product}.json | Hero split 65/35, PDP split_screen (G-12 confirmado) |
| Sartorial | Imprint | `presets.Imprint` (:159); listings/imprint | Hero split 50/50, PDP grid con technical_specs. Comparte 7 de 8 tipos de sección de home con Sartorial |
| Sartorial | Archive | `presets.Archive` (:236, fin :311); listings/archive | Hero cinematic, PDP grid con provenance. Sus 7 tipos de home están todos en Sartorial |
| Atelier | Contour | `presets.Contour`; listings/contour/templates con index y page.about | No tiene product.json ni collection.json propios: hereda los de la raíz (V-comerciante). page.about de Contour y Annex es byte idéntico (sha 3318d3173a) |
| Atelier | Annex | `presets.Annex`; listings/annex con index, collection, product, page.about | Home con wall-comparison, frame-preview, overlap-index, horizontal-scroll |
| Atelier | Maison | `presets.Maison`; listings/maison con index, collection, product, page.about | Home con process-timeline, glaze-library, kiln-log, shop-the-set |

---

## 6. Matriz (5 categorías, dos columnas por categoría)

**Estado oficial**: NE (no evaluado numéricamente, no es cero) en las cinco categorías y en las seis filas, porque ninguna celda tiene evidencia de tienda. Coincide con GPT.

**Lectura estática provisional**: número solo donde el objeto evaluado está en los archivos (Configuración) o donde la cobertura en código es alta (Compra). En Diseño se dan medidas estructurales en lugar de un número. En Móvil y accesibilidad y en Rendimiento se dan hechos sintéticos sin número.

### 6.1 Matriz

| Tema · preset | Diseño: oficial | Diseño: lectura estática | Compra: oficial | Compra: lectura estática | Móvil y a11y: oficial | Móvil y a11y: lectura estática | Comerciante: oficial | Comerciante: lectura estática | Rendimiento: oficial | Rendimiento: lectura estática |
|---|---|---|---|---|---|---|---|---|---|---|
| Sartorial · Sartorial | NE | Home Jaccard: 0,78 con Imprint, 0,88 con Archive. PDP: 1,00 con ambos. Header y tarjeta idénticos | NE | **15** /20 | NE | Anillo base del esquema. Drawer móvil bloquea scroll e inert al cruzar 992 px (TT-104, reproducido). Compare-at 4.05:1 en scheme-4 | NE | **12** /20 | NE | Ver nota de rendimiento |
| Sartorial · Imprint | NE | Home: 0,78 con Sartorial, 0,67 con Archive. PDP 1,00. Claves no de color distintas de Sartorial: 4 | NE | **14** /20 | NE | Anillo de foco 1.33:1 (scheme-2) y 1.13:1 (scheme-4), reproducido en Chromium (TT-02). Más TT-104 | NE | **11** /20 | NE | Igual que Sartorial |
| Sartorial · Archive | NE | Home: 0,88 con Sartorial (el par más cercano). PDP 1,00. Claves no de color distintas de Sartorial: 2 (heading_scale, motion_style) | NE | **15** /20 | NE | Anillo de foco 2.25 a 2.76:1 en esquemas claros (TT-02). Más TT-104 | NE | **11** /20 | NE | Igual que Sartorial |
| Atelier · Contour | NE | Home Jaccard: 0,19 con Annex, 0,12 con Maison. PDP: 0,60 con Annex, 0,75 con Maison (usa la de la raíz). Header y tarjeta idénticos | NE | **11** /20 | NE | Hover de botón 3.33:1 (A4) o 3.55:1 con etiqueta blanca (V-a11y), bajo 4.5 en ambos casos. Borde notify-me 1.01 a 1.49:1. Stepper de cantidad 40x42 px medido | NE | **16** /20 | NE | Ver nota de rendimiento |
| Atelier · Annex | NE | Home: 0,19 con Contour, 0,11 con Maison. PDP: 0,60 con Contour, 0,75 con Maison. Claves no de color distintas: 6 a 8 | NE | **11** /20 | NE | Cuerpo al 80 % (unos 12,2 px). Borde notify-me | NE | **16** /20 | NE | Igual que Contour |
| Atelier · Maison | NE | Home: 0,12 con Contour, 0,11 con Annex. PDP: 0,75 con ambos | NE | **11** /20 | NE | Borde fuerte sobre accent-1 2.63:1 (condicional). Borde notify-me | NE | **16** /20 | NE | Igual que Contour |

Nota de rendimiento (hechos sintéticos, sin número). Sartorial: base.css 259.143 B (50,6 a 51,0 KB gz) y theme.js 248.554 B (57,5 a 57,9 KB gz) en todas las páginas, también password y gift_card; Theme Check `recommended` 0 y `all` 6 errores de tamaño; `node --check` y acorn sin errores. Atelier: CSS 29,1 KB gz por sección, 98 a 112 KB gz de JS inyectado tras el FCP; Theme Check con la config del repo 0 (AssetSizeJavaScript desactivado), `all` 2 errores de tamaño. Ningún Lighthouse.

Cobertura y confianza de la lectura estática: Compra, cobertura alta en código y nula en runtime, confianza media; Configuración, cobertura alta en schemas (G-11 reproduce la base cuantitativa), editor no probado, confianza media-alta.

### 6.2 Regla de la columna Compra

Base: notas de A3 (Sartorial 16, Atelier 11). Regla aplicada a los dos temas por igual:

1. Se resta 1 punto por cada P1 confirmado y visible para el comprador que no estuviera en la base de A3 y que aplique al preset por defecto.
2. Los P2 nuevos no restan por separado: la base de A3 tiene una resolución de un punto y ya descontaba debilidades menores; se anotan en el registro.
3. Los P3 no restan.

Aplicación: Sartorial pierde 1 en los tres presets por TT-100 (plan de venta que se envía mal, P1 nuevo). Imprint pierde 1 más por TT-03: su bloque technical_specs está activo por defecto e imprime "Solid milled brass" en productos con `brass` o `paperweight` en el handle sin que el comerciante toque nada. Archive **no** resta por TT-03 (cambio tras R2): con el listing por defecto (circa_year vacío, condition_grade "not_assessed") el bloque provenance no imprime nada (product-provenance.liquid:30-35, :52); el contenido inventado solo aparece si el comerciante rellena un ajuste de plantilla, lo que es condicional. Resultado: **15 / 14 / 15**. Atelier no tiene P1 nuevos en compra (TT-07 ya estaba en la base; TT-107 es P2): **11**. Sartorial conserva la ventaja en compra, más pequeña.

Lectura alternativa, aplicada a los dos temas por igual: si se restara además 1 punto a cada tema que tenga al menos un P2 nuevo confirmado en el camino de compra (Sartorial: TT-101, TT-102, TT-103; Atelier: TT-107), quedarían Sartorial 14 / 13 / 14 y Atelier 10. La ventaja relativa no cambia. Se deja constancia; la columna usa la regla principal.

### 6.3 Sin total

No hay total. Las cinco categorías tienen estado oficial NE y solo dos tienen lectura numérica provisional. GPT llega a la misma conclusión (G-09).

---

## 7. Verificación cruzada de las 41 afirmaciones de GPT

Veredictos: confirmado, parcialmente confirmado, refutado, no verificable. Fuente del veredicto entre paréntesis.

| G | Afirmación de GPT (resumen) | Veredicto | Evidencia | Cambio resultante |
|---|---|---|---|---|
| G-01 | ZIP 092242fb…; presets Sartorial, Imprint, Archive | Confirmado | Hash calculado por Claude dos veces durante la fijación (§1) | Ninguno |
| G-02 | Atelier de Sebas = Contour 4.1.0, commit 1576d06; no es el Atelier de Shopify | Confirmado | ls-remote 28-oct 10:52Z; settings_schema.json:3-8 (V-themestore) | Se fijan además annex y maison |
| G-03 | Cucuyo no disponible por ahora según Johandry; no evaluado | Confirmado en lo observable hoy | ls-remote 28-oct sin credenciales igual que un repo inexistente (V-themestore §3) | Cucuyo pasa al Anexo A; desacuerdo de alcance en §8 |
| G-04 | Checkout codex HEAD 09f8342 del 27-oct; tres hashes coinciden; git roto | Parcialmente | Hashes recalculados iguales; HEAD y fallo de git no verificables | Ninguno; HEAD sigue sin verificar por Claude |
| G-05 | Tema MAIN 189832593651: 84 rutas, 83 MD5 iguales (lectura API comunicada) | No verificable | Sin acceso a tienda; ningún log ni manifiesto en la carpeta conectada (V-themestore §4) | Se registra como evidencia GPT no verificada (§8) |
| G-06 | ZIP frente a directorio aislado: entries 107, mismatch [] | Parcialmente | 93 archivos + 14 directorios = 107; "mismatch []" no reproducible (V-arquitectura) | Ninguno |
| G-07 | node --check de theme.js y product-zoom.js: exit 0 | Confirmado | Reproducido con Node 22 y vm.Script (V-arquitectura) | Ninguno |
| G-08 | Sin tienda, demos, editor, Lighthouse, axe, AT; docs y soporte públicos no se pudieron abrir | Parcialmente | Los sitios responden 200 el 28-oct; docs.html y support.html son byte iguales a la descarga del 27-oct (V-themestore) | TT-04, TT-05 y TT-32 se apoyan en nuestra descarga |
| G-09 | Matriz NE en todas las celdas, sin total | Confirmado como descripción | Anexo de GPT, l. 163-171 | Adoptamos NE como estado oficial; desacuerdo de método en §8 |
| G-10 | 33/20/23 (Sartorial); 60/43/54 + 2 blocks (Contour); locales | Confirmado | Mismas cifras en INITIAL-001 | Ninguno |
| G-11 | 718 y 1478 referencias `t:`, 0 claves ausentes | Confirmado | schema_refs.py reproduce exactamente; nuestras 663/1366 no incluían settings_schema.json (V-comerciante) | Se corrigen las cifras de §12.3 |
| G-12 | Composiciones de Sartorial, Imprint, Archive; 7 de 8 tipos comunes | Confirmado | diff_presets.py, Jaccard (V-comerciante §2) | TT-17 incorpora las cifras |
| G-13 | Contour más diferenciado internamente; no prueba originalidad de mercado | Confirmado, con matiz | Jaccard de home 0,11 a 0,19; Contour sin PDP ni colección propias | TT-17 y §12.1 incorporan el matiz |
| G-14 | Capacidades de código en ambos temas, no pruebas | Confirmado | INITIAL-001 §7 | Se matizan fortalezas de Sartorial (selector de planes, sin JS, drawer) |
| G-15 | Sartorial explica en ayudas que umbrales y regalos no configuran tarifas ni descuentos | Confirmado | en.default.schema.json:815-816, :819-820 (V-compra, V-comerciante) | **TT-62 corregido**: GPT tenía razón |
| G-16 | S-01: variante sin JS, id puede quedar en A | Confirmado (prioridad distinta) | Sin noscript ni regla no-js; la clase no-js la quita el inline (V-compra) | Nuevo TT-101 (P2; GPT P1) |
| G-17 | S-02: dos valores de selling_plan | Confirmado (efecto en servidor no verificable) | Arnés s2: casos A y B duplican; caso C, determinista, envía el plan rechazado (V-compra) | Nuevo TT-100 (P1 confirmado) |
| G-18 | S-03: "Solid milled brass" por handle | Confirmado | product-technical-specs.liquid:47-54, :69-70 | Coincide con TT-03 |
| G-19 | S-04: cantidad inválida en el tope | Confirmado | Arnés p3; solo alcanzable por el tope de inventario; el navegador bloquea el envío (V-compra) | Nuevo TT-105 (P3; GPT P2) |
| G-20 | S-05: menú móvil oculto conserva bloqueo | Confirmado | Reproducido en Chromium; Escape lo recupera, táctil no (V-a11y) | Nuevo TT-104 (P2) |
| G-21 | S-06: nota del drawer sin guardar al pulsar View cart | Confirmado | Traza theme.js:2363, cart-drawer.liquid:366-368 (V-compra) | Nuevo TT-103 (P2) |
| G-22 | S-07: respuesta perdida con drawer cerrado invita a reintentar | Confirmado | Traza theme.js:147-150, 2380, 3286 (V-compra) | Nuevo TT-102 (P2) |
| G-23 | S-08: anuncio de agotado ambiguo | Confirmado y más amplio | Arnés s8 y Chromium: cualquier variante agotada (V-compra, V-a11y) | Nuevo TT-106 (P3; GPT P2) |
| G-24 | C-01: confirmación de Notify me oculta por ancestro | Confirmado | Arnés c1: visibleToUser false (V-compra) | Nuevo TT-107 (P2; GPT P1) |
| G-25 | C-02: aviso por formulario de contacto | Confirmado | notify-me.liquid:55-69 | Coincide con TT-27 |
| G-26 | C-03: 422 tratado como carrito válido, `rendered: NaN` | Confirmado y reconciliado | Arnés p4: "NaN" en el DOM y contador oculto por is-empty (V-compra) | TT-07 mantiene P1 (GPT P2); reproducción reconciliada |
| G-27 | C-04: mínimo 1 y novalidate en PDP de Contour | Confirmado | main-product.liquid:200 (`novalidate`), :221 (comprobación de la síntesis) | Se añade novalidate a TT-23 |
| G-28 | C-05: umbral de envío mal explicado | Confirmado | en.default.schema.json:4858-4860 | Se añade a TT-25 |
| G-29 | C-06: defaults "30-day returns" y "Made to order" con fallback | Confirmado | trust-badges.liquid:16, :29, :33 (`| default:`) | TT-25 añade que vaciar el ajuste no retira la promesa; prioridad en §8 |
| G-30 | C-07: consentimiento de marketing obligatorio | Confirmado | notify-me.liquid:86-96 | Coincide con TT-27 |
| G-31 | C-08: docs 44 x 44 frente a botón de 40 px | Confirmado, con precisión | Medido 40x42 px en Chromium; no es fallo de 2.5.8 AA (V-a11y) | Se añade a TT-32 |
| G-32 | Nota y bundle silencian errores; el add principal sí contempla error | Confirmado | cart.js:102-107, 331-351, 196-227 | Compatible con TT-21 y TT-22 |
| G-33 | Umbral 150 activo en los tres estilos | Confirmado | settings_data.json de las tres ramas | Coincide con TT-25 |
| G-34 | D-01: documentación de instalación y presets incompleta | Confirmado | page.documentation.json:26; docs/index.html:66-72 y órdenes divergentes (V-themestore) | Se funde en TT-14 (Sartorial) y TT-32 (Atelier) |
| G-35 | D-02: soporte instalado usa el contacto de la tienda | Confirmado | main-support.liquid:9-10, :114 | Coincide con TT-14 |
| G-36 | D-03: guía de tallas con medidas concretas | Confirmado | main-product.liquid:947, 965, 971; show_model_fit_below true (V-comerciante) | Nuevo TT-108 (P3) |
| G-37 | 380 USD es hipótesis comercial | Parcialmente | Correcto; omite la regla de 100 a 500 en pasos de 10 | Se combinan ambas lecturas (§13) |
| G-38 | Sin causa oficial de rechazo de Contour | Confirmado | Coincide con INITIAL-001 §3.4 | Ninguno |
| G-39 | Diferenciación, presets, Lighthouse 60/90 con benchmark | Confirmado | Texto literal del 28-oct | Se citan las dos frases de Lighthouse (§3) |
| G-40 | CSS y JS globales de 259.143 y 248.554 B, exposición | Confirmado | Subconjunto de TT-12 (V-arquitectura) | TT-12 añade password y gift_card |
| G-41 | P0 confirmados: ninguno | Confirmado según su criterio | TT-01 pasa a compuerta G1 | 0 P0 en ambas auditorías |

**Recuento de veredictos:** 36 confirmados, 4 parcialmente confirmados (G-04, G-06, G-08, G-37), 1 no verificable (G-05), 0 refutados. Total 41.

**Qué aportó GPT que nosotros no teníamos:** nueve hallazgos nuevos (TT-100 a TT-108), la corrección de TT-62, el fallback de TT-25, el novalidate de TT-23 y la divergencia de órdenes de la documentación de Contour. **Qué tenemos solo nosotros:** ver la columna "Crédito" del registro; entre los P1, TT-02, TT-05, TT-08, TT-09 y TT-31.

---

## 8. Desacuerdos conservados

Cada desacuerdo deja las dos posiciones y nuestro razonamiento. No se fuerza la convergencia.

**Diferencia de escala.** GPT usa una escala propia (anexo de su informe, l. 179-186): su P1 es "riesgo comercial, funcional o de confianza significativo, condicionado o demostrado, que merece reproducción y tratamiento prioritario antes de entrega". Es más amplia que nuestro P1 (flujo de compra roto o engaño en un flujo normal, §9.1). D-D, D-E y D-F son sobre todo esa diferencia de escala, no de hechos: los hechos coinciden y los dos los tratamos como prioritarios; GPT los sube porque su P1 incluye riesgos condicionados que merecen reproducción.

| # | Tema | Posición de GPT | Nuestra posición | Razonamiento |
|---|---|---|---|---|
| D-A | Método de la matriz | NE en todas las celdas; un número exige evidencia visual y funcional por preset | NE como estado oficial, más una lectura estática provisional numérica solo en Configuración y Compra, medidas estructurales en Diseño y hechos sintéticos en Móvil y Rendimiento | Coincidimos en el estado oficial y en no dar total. Mantenemos la lectura estática porque los schemas son la experiencia del comerciante y porque en compra la cobertura de código es alta; además conserva información comparativa que GPT no cuantifica. Etiquetada como provisional, no puede leerse como nota final. Retiramos los números de Diseño, Móvil y Rendimiento porque ahí un número sugería una medición que no existe |
| D-B | Demos por preset | No es P0; aparece como límite de acceso, no como bloqueo | No es P0 (cambio respecto a INITIAL-001), pero sí compuerta G1 que bloquea el envío si no existe | Aceptamos el estándar de evidencia: la ausencia no está demostrada y la demo no es propiedad del código. Pero un informe de preparación debe nombrar la compuerta de forma explícita; no basta con listarla entre las limitaciones |
| D-C | Cucuyo | No disponible según Johandry; no evaluado; sin puntuación | Instantánea pública auditada; ahora en anexo, fuera de recuentos, matriz y comparación | No hay contradicción de hechos sino de alcance. Respetamos la indicación de Johandry moviéndolo al anexo; no lo borramos porque la instantánea fue pública y el análisis existe. Johandry puede pedir que se reincorpore o que se retire |
| D-D | C-06 / TT-25 (promesas por defecto de Atelier) | P1 | P2 | El fallback que impide vaciar el texto es real y debe constar, pero el comerciante ve el texto en el editor y puede eliminar el bloque. Nuestro P1 exige flujo de compra roto, engaño sin intervención posible o hecho documentado de riesgo alto; aquí la intervención existe |
| D-E | S-01 / TT-101 (variante sin JS en PDP) | P1 | P2 | Mecanismo confirmado y resultado engañoso, pero la condición (sin JS o theme.js caído) es poco frecuente. GPT pondera la gravedad del resultado; nosotros, también la frecuencia |
| D-F | C-01 / TT-107 (confirmación de Notify me oculta) | P1 | P2 | Bloque opcional para productos agotados; no se pierde ningún pedido |
| D-G | C-03 / TT-07 (cantidad en el carrito de Atelier) | P2 | P1 | Cambiar cantidad es un flujo principal; cualquier respuesta de error o no JSON deja el contador oculto, el campo con la cantidad rechazada y ningún mensaje. No depende de suponer el 422 por stock (D10 de INITIAL-001) |
| D-H | S-04 / TT-105 y S-08 / TT-106 | P2 ambos | P3 ambos | S-04 solo es alcanzable por el tope de inventario y el navegador bloquea el envío. S-08 se atenúa porque el bloque de inventario de las plantillas por defecto sí anuncia "Sold out" y el botón también lo dice |
| D-I | G-05, lectura del tema MAIN | La reporta como evidencia de equivalencia parcial con el ZIP | No verificable por Claude | La propia GPT la atribuye a una lectura API comunicada por coordinación. No hay log ni manifiesto en la carpeta conectada. No se usa como evidencia en este documento |
| D-J | G-40 / TT-12 (peso de CSS y JS de Sartorial) | Sin prioridad; exposición, no lentitud | P2 | Coincidimos en que no hay medición de tiempos. Mantenemos P2 por deuda medible (Theme Check `all`) frente a la compuerta G2 |

Puntos resueltos que ya no son desacuerdo: G-15 frente a TT-62 (GPT tenía razón, TT-62 corregido); G-11 (diferencia de alcance, ambos correctos); G-08 sobre los sitios de documentación (accesibles para nosotros el 27 y el 28-oct); G-26 frente a V1 §8 ("NaN" en el DOM y oculto para el comprador son el mismo hecho).

---

## 9. Registro de hallazgos

### 9.1 Criterio de prioridad

| Nivel | Criterio (igual que INITIAL-001 tras R1) |
|---|---|
| P0 | Incumple un requisito escrito que impide el envío de un tema candidato, demostrado, o rompe la compra de forma generalizada |
| P1 | Rompe un flujo de compra común o engaña al comprador en un flujo normal; barrera de accesibilidad seria en configuración activa por defecto; contenido falso visible al comprador sin intervención; riesgo alto de revisión con un hecho documentado detrás; credencial expuesta en un repositorio legible públicamente |
| P2 | Defecto verificable con impacto acotado o condicional; inconsistencia documental; riesgo de unicidad que depende solo del juicio del revisor; deuda medible; barrera de accesibilidad moderada |
| P3 | Higiene, mantenibilidad, condición inactiva, dato informativo |

IDs estables desde INITIAL-001; los nuevos son TT-100 a TT-108. Crédito: **Solo Claude**; **Ambos** (hallado de forma independiente por las dos auditorías); **GPT primero** (hallado por GPT; verificado por nosotros).

### 9.2 Recuentos (registro principal, sin Cucuyo)

| Prioridad | Cantidad | IDs |
|---|---|---|
| P0 | 0 | (TT-01 pasó a compuerta G1) |
| P1 | 8 | TT-02, TT-03, TT-05, TT-07, TT-08, TT-09, TT-31, TT-100 |
| P2 | 31 | Sartorial: TT-04, TT-06, TT-12 a TT-19, TT-101 a TT-104. Atelier: TT-20 a TT-30, TT-32, TT-33, TT-99, TT-107. Varios: TT-51, TT-52 |
| P3 | 40 | Sartorial: TT-53 a TT-66, TT-105, TT-106, TT-108. Atelier: TT-67 a TT-85. Varios: TT-95 a TT-98 |
| Total | 79 | |

Fuera del registro: Cucuyo, 28 hallazgos en el Anexo A (2 de nivel P1, 17 de nivel P2, 9 de nivel P3 como referencia, sin contar). Por tema: Sartorial 4 P1, 14 P2, 17 P3; Atelier 4 P1, 15 P2, 19 P3; varios temas 2 P2, 4 P3.

Por crédito, los 39 P1 y P2 del registro principal: solo Claude 22 (5 P1: TT-02, TT-05, TT-08, TT-09, TT-31; 17 P2), ambos 11 (2 P1: TT-03, TT-07; 9 P2: TT-12, TT-13, TT-14, TT-17, TT-22, TT-23, TT-25, TT-27, TT-32), GPT primero 6 (1 P1: TT-100; 5 P2: TT-101 a TT-104, TT-107). En P3, GPT primero 3 (TT-105, TT-106, TT-108) y TT-62 corregido a favor de GPT.

### 9.3 P1

#### TT-02 · Sartorial · Imprint (P1) y Archive (P2) · P1 · Solo Claude
- **Condición:** dentro de `@media (prefers-reduced-motion: no-preference)` el anillo de foco de `.button`, `input` y `select` se fija por `motion_style`: `technical` `#2b2b2b`, `heritage` `#b5885c`.
- **Impacto:** Imprint 1.33:1 sobre scheme-2 (#111111) y 1.13:1 sobre scheme-4; Archive 2.25 a 2.76:1 sobre esquemas claros. Con reduced motion vuelve el anillo base.
- **Evidencia (corregida):** base.css:9058-9132, :9102-9107, :9126-9131, :283-286; settings_data.json:157, :234, :311. En scheme-2 están **la barra de anuncios** (header-group.json:20) y **el formulario del footer** (footer-group.json:9; footer.liquid:58-71 con input y `.button`); el header propiamente dicho usa scheme-1 (header-group.json:48). INITIAL-001 decía "header y footer": corregido. En Imprint también listings/imprint/templates/index.json:40, :172 y collection.json:15.
- **Tipo:** EST, SIN, SIM (Chromium, tt02.js: computed `rgb(43,43,43)`, 2 px; con reduced motion, anillo base).
- **Estado:** confirmado.
- **Recomendación y límites:** anillo derivado del token del esquema o anillo doble. Medido contra el color del esquema, no contra imágenes.
- **Cambio:** evidencia corregida; reproducción añadida. GPT no lo reporta (hueco real de su revisión de accesibilidad, V-a11y).

#### TT-03 · Sartorial · Imprint por defecto; Archive y Sartorial de forma condicional · P1 · Ambos (G-18)
- **Condición e impacto:** technical_specs y provenance leen metafields no declarados. **Imprint (por defecto, sin intervención):** su bloque technical_specs está activo y, sin datos, un handle con `brass` o `paperweight` produce "Solid milled brass" y "Precision machined"; en productos textiles se usan los valores del bloque, que son de plantilla e iguales para todos los productos. **Archive (condicional):** su bloque provenance está activo por defecto, pero con el listing tal cual (circa_year vacío, condition_grade "not_assessed", notas vacías) no imprime nada (product-provenance.liquid:52); el "Circa" inventado solo aparece si el comerciante rellena circa_year en el bloque, y entonces se aplica a todos los productos cuyo título contenga "19" o "20" (:30-35). **Sartorial:** igual, si se añade el bloque.
- **Evidencia:** product-technical-specs.liquid:47-49, :53-54, :69-70, :80-84; product-provenance.liquid:29-35, :52; listings/imprint/templates/product.json:71-80; listings/archive/templates/product.json:71-80.
- **Tipo:** EST. **Estado:** confirmado.
- **Recomendación y límites:** mostrar solo datos del producto y ocultar el bloque si faltan. Las siete definiciones de metafields propuestas siguen sin aprobar.
- **Cambio:** tras R2 se precisa que en Archive es condicional; por eso Archive ya no resta en la lectura estática de Compra (§6.2). GPT lo centra en Imprint y el handle; nuestra versión es más amplia.

#### TT-05 · Sartorial · todos · P1 · Solo Claude
- **Condición e impacto:** support.html muestra `support@ruizdigital.com`; ruizdigital.com es un sitio de content marketing con contacto `alex@`; no se demostró quién controla ese buzón ni la cuenta noobprobro-web de los docs. Si no es propio, los tickets se pierden.
- **Evidencia:** support.html:271 (byte igual el 27 y el 28-oct, V-themestore); settings_schema.json:5, :7-8.
- **Tipo:** EST-web, EST. **Estado:** parcialmente confirmado; **riesgo a confirmar con Johandry**.
- **Recomendación:** confirmar la titularidad o usar un buzón verificado (compuerta G3).
- **Cambio:** GPT no pudo abrir los sitios (G-08); nosotros sí.

#### TT-07 · Atelier · Contour, Annex, Maison · P1 · Ambos (G-26, GPT P2)
- **Condición:** `postChange` hace `res.json()` sin mirar `res.ok`. Con un JSON de error sin `item_count`, `updateCartCount(undefined)`; con algo que no es JSON, cae en el `.catch` vacío.
- **Impacto y reproducción reconciliada:** el arnés p4 (cart.js real en jsdom, badge copiado de header.liquid:155 y :288-292, CSS de header.liquid:597, fetch con 422) muestra: antes `textContent "1"`; después `textContent "NaN"` **y** clase `is-empty`, por lo que `display: none`. El comprador no ve "NaN": ve desaparecer el contador como si el carrito estuviera vacío. El texto accesible queda en "1 item", el campo conserva la cantidad rechazada (5 en el drawer, 7 en la página) y no aparece ningún mensaje. La lectura de GPT ("contador inválido", `rendered: NaN`) y la nuestra (oculto) describen el mismo hecho.
- **Evidencia:** cart.js:20-26, :33-39, :152-164 (`.catch` vacío en :162), :296-310 (:309); header.liquid:155, :288-292, :597; harness-compra/p4-output.txt.
- **Tipo:** EST, SIM. **Estado:** camino de código confirmado y reproducido en arnés; respuesta real del servidor ante exceso de stock no documentada ni probada (shopify.dev documenta el 422 por stock solo para add.js).
- **Recomendación:** comprobar `res.ok` e `item_count`, restaurar el valor, mostrar `message` en `role="alert"`.
- **Cambio:** reproducción añadida; prioridad discrepante en §8 (D-G).

#### TT-08 · Atelier · Contour y Maison · P1 · Solo Claude
- **Condición e impacto:** Contour (Responsive) y Maison (Gain) ya existen como presets en la Theme Store; Contour es además el theme_name. Riesgo en la etapa 5; no se presenta como causa de ningún rechazo.
- **Evidencia:** themes.shopify.com/themes/responsive/presets/contour y /themes/gain/presets/maison (V1 §7). Reglas: requisito duro "Theme and preset names must be unique and distinct from existing themes in the Shopify Theme Store" (requirements, l. 508) y guía "Don't use the same name as an existing theme and preset name" (lista "Increasing clarity and discoverability"). El requisito duro habla de temas existentes; que alcance a un preset de otro tema solo lo dice la guía (§3). **Tipo:** EST-web. **Estado:** confirmado (existencia de los presets); aplicación exacta de las reglas a un preset ajeno por confirmar.
- **Recomendación:** nombres sin colisión o confirmación de Shopify. **Cambio:** ninguno.

#### TT-09 · Atelier · Contour, Annex, Maison · P1 · Solo Claude
- **Condición e impacto:** DESIGN.md:15-18 declara el contrato visual "reverse-engineered from fieldstudiesflora.com with Playwright" (paleta, tipografías, header de 48 px, 24 columnas, nav lateral numerada, orden de la tarjeta). Riesgo de originalidad y trade dress. No se afirma copia de código.
- **Evidencia:** DESIGN.md:15, 17-18, 23-43, 50-55; TOKENS.md:7-12, 61. **Tipo:** EST, EST-web. **Estado:** confirmado (lo declarado); similitud visual no evaluada.
- **Recomendación:** redefinir con criterio propio; no distribuir los documentos de extracción. **Cambio:** ninguno.

#### TT-31 · Atelier · repositorio · P1 · Solo Claude
- **Condición:** DEVELOPMENT.md:7 contiene la contraseña de las demos en texto plano; DEVELOPMENT.md:6 dice "(private)", pero el repositorio es legible sin credenciales el 27-oct a las 20:30 y **sigue siéndolo el 28-oct a las 10:52Z** (V-arquitectura, V-themestore). El gmail personal sigue en listings/contour/listing.json:5 (TT-33). .shopifyignore no excluye DEVELOPMENT.md.
- **Impacto:** contraseña y email expuestos mientras el repositorio sea público; el historial de git la conserva. Además, durante esta fase se imprimió dos veces en un registro interno de herramientas, una vez en V-arquitectura y otra en R2 (ver §0 y §10).
- **Evidencia:** DEVELOPMENT.md:4, :6, :7; .shopifyignore; listings/contour/listing.json:5. **Tipo:** EST, EST-web (ls-remote anónimo). **Estado:** confirmado; vigencia de la contraseña no evaluada.
- **Recomendación:** rotar la contraseña de las demos (las tres a la vez), purgarla del historial y decidir la visibilidad del repositorio. No autoriza a ejecutarlo: lo decide el dueño.
- **Cambio:** vigencia del 28-oct y nota de transparencia.

#### TT-100 · Sartorial · tres presets, productos con planes · P1 · GPT primero (S-02); caso C solo Claude
- **Condición:** el `<select name="selling_plan">` del bloque no-JS (main-product.liquid:573-599; featured-product.liquid:325) nunca se deshabilita: solo se oculta con `.js .no-js-only { display: none }` (base.css:5653-5655), y `display: none` no lo saca de FormData. theme.js:771-780 habilita el hidden y :2561 crea el FormData; ninguna línea toca el select.
- **Impacto:** fixture s2 (reproduce a mano el cambio de estado de theme.js:771-780 sobre un marcado reducido del Liquid real; R2 lo comprobó fiel). Caso A (carga sin plan, elige Monthly): `["900",""]`. Caso B (carga con plan, elige Weekly): `["901","900"]`. **Caso C** (la ficha se carga con `?selling_plan=900` o con una variante `requires_selling_plan`, y el comprador elige compra única): `["900"]`, un único valor que es justo el plan que rechazó. El caso C no depende de cómo Shopify resuelva claves repetidas: añade una suscripción cuando el comprador eligió compra única. Que se llegue a esa URL al volver desde el carrito es una **inferencia no documentada**: Sartorial enlaza las líneas con `{{ item.url }}` (cart-drawer.liquid:163, :177), pero shopify.dev no documenta que `line_item.url` incluya `selling_plan`. El caso C es determinista siempre que el parámetro esté en la URL. Qué hace Shopify con dos valores (A y B) no está documentado.
- **Evidencia:** main-product.liquid:2-11, :565-599; featured-product.liquid:313-347; base.css:5653-5655; theme.js:771-780, :778, :2561; harness-compra/s2-output.txt.
- **Tipo:** EST, SIM (fixture). **Estado:** caso C confirmado en el fixture (determinista cuando la URL lleva el plan); la ruta de vuelta desde el carrito con ese parámetro es inferencia; efecto en servidor de A y B no verificable.
- **Recomendación:** `disabled` en el select no-JS cuando hay JS, o moverlo a `<noscript>`.
- **Cambio:** nuevo. Matiza la fortaleza "selector de planes" de INITIAL-001 §7. Resta 1 punto en la lectura estática de Compra de Sartorial.

### 9.4 P2

Formato compacto. Campos completos de los TT heredados en INITIAL-001; aquí se indica solo lo que cambia.

**Sartorial**

- **TT-04 · todos · Solo Claude.** Docs públicos con "Edition" y flujo de instalación por ZIP. Evidencia: docs.html:204, :185-187; support.html:254 (byte iguales el 28-oct). EST-web. Confirmado. Recomendación: corregir antes del envío (G3). Cambio: ninguno.
- **TT-06 · todos · Solo Claude.** Header y tarjeta únicos, iguales en los tres presets; riesgo de unicidad que depende del juicio del revisor. V-comerciante confirma que no hay ajustes de layout de header ni de tarjeta. EST. Confirmado. Cambio: medida estructural en §6.
- **TT-12 · todos · Ambos (G-40).** CSS (259.143 B) y JS (248.554 B) globales también en password.liquid:38, :79 y gift_card.liquid:27. EST, SIN. Confirmado (tamaños); tiempos sin medir. Cambio: GPT es subconjunto; prioridad discrepante (D-J).
- **TT-13 · raíz · Ambos parcial (G-34).** Plantillas raíz que no coinciden con ningún preset; success/updates pide el base set en la raíz y sin JSON de demo. EST, EST-web. Confirmado; efecto en instalación no verificado.
- **TT-14 · todos · Ambos (G-34, G-35).** Plantillas de documentación y soporte del vendedor dentro del ZIP; el soporte usa el contacto de la tienda; page.documentation.json:26 dice "Each preset changes theme settings only" y :75, :142 no explican composiciones por preset ni datos especializados. EST. Confirmado. Cambio: se funde la parte Sartorial de G-34.
- **TT-15 · todos · Solo Claude.** Siete secciones main-* con preset y sin enabled_on, H1 en :22, :31, :31, :49, :13, :24, :47 (vigente, V-arquitectura). EST. Confirmado.
- **TT-16 · todos · Solo Claude.** Catálogo de secciones estrecho, sin padding por sección, footer sin bloques (vigente). EST. Confirmado.
- **TT-17 · Sartorial y Archive (Imprint en home también) · Ambos (G-12).** Jaccard de tipos de home: S-I 0,78, S-A 0,88, I-A 0,67; PDP 1,00 en los tres pares; claves no de color distintas S-A solo 2. La home de Imprint está casi tan cerca de Sartorial como la de Archive. EST, SIN. Confirmado. Cambio: cifras añadidas.
- **TT-18 · todos · Solo Claude.** "blazing-fast" y "WCAG 2.2 AA" en docs.html sin medición; mismo patrón que TT-32 de Atelier (V-a11y). EST-web. Confirmado.
- **TT-19 · todos · Solo Claude.** `<shopify-account menu>` recibe el objeto link_list sin `.handle` (header.liquid:191). EST. Hipótesis (vigente).
- **TT-101 · tres presets, PDP y featured-product · GPT primero (S-01).** Sin JS, o con theme.js caído, los radios (fuera del form y sin atributo `form`) no cambian el `id` oculto: se muestra B y se añade A. No hay `<noscript>` con select de `id`; la clase no-js la quita el inline de theme.liquid:98. Evidencia: main-product.liquid:173, :238-248, :472-477; featured-product.liquid:136-146, :220-226; theme.js:838-844. EST. Confirmado. Recomendación: respaldo que envíe la variante real. Cambio: nuevo; matiza "funciona sin JS" (cierto solo para /cart). Prioridad discrepante (D-E).
- **TT-102 · tres presets · GPT primero (S-07).** Con el drawer cerrado, una respuesta perdida tras un POST aceptado se muestra como error genérico que invita a reintentar, sin reconciliar el carrito; el reintento duplica la cantidad (no el cobro). La clasificación incierta con "Check cart" solo existe en la venta cruzada. Evidencia: theme.js:147-150, :2577-2580, :2380, :2609, :3286; cart-drawer.liquid:43; en.default.json:80. EST. Confirmado por traza. Cambio: nuevo; matiza la fortaleza de INITIAL-001.
- **TT-103 · tres presets · GPT primero (S-06).** La nota del drawer se descarta al pulsar View cart (enlace plano ignorado por handleDocumentClick); sí se guarda en enlaces de venta cruzada y al pulsar Checkout. Evidencia: theme.js:2322-2326, :2363, :2408-2414, :2438-2457, :2973-3030; cart-drawer.liquid:146, :318, :351, :366-368. EST. Confirmado por traza. Cambio: nuevo.
- **TT-104 · tres presets · GPT primero (S-05).** Con el menú móvil abierto, al pasar de 992 px el menú se oculta pero siguen `data-open`, `overflow: hidden` e `inert` en main y nav; no hay escucha de breakpoint. Escape lo recupera; en táctil (girar una tableta) no. Evidencia: base.css:4389-4397, :142-145; theme.js:274-300, :310, :336-360; harness-a11y/g20_g23.js. EST, SIM (Chromium). Confirmado. Cambio: nuevo; matiza el elogio del drawer en INITIAL-001 §7.

**Atelier**

- **TT-20 · todos · Solo Claude.** JS inyectado tras el FCP, AssetSizeJavaScript desactivado, "0 offenses" y DEVELOPMENT.md que dice que GSAP se retiró (vigente, V-arquitectura). EST, SIN. Confirmado.
- **TT-21 · todos · Solo Claude.** Sin selector de planes en PDP; un 200 sin `sections` (variante requires_selling_plan) cae en la rama de éxito sin abrir el drawer ni avisar (cart.js:219-222). Compatible con G-32, que confirma que el add principal sí maneja `data.status`. EST. Confirmado.
- **TT-22 · todos · Ambos (G-32).** Quick add de tarjeta sin elemento de error y bundle que ignora errores (cart.js:331-351); saveNote también (cart.js:102-107). EST. Confirmado.
- **TT-23 · todos · Ambos (G-27).** PDP con `min="1"` fijo, sin max ni step, y formulario con `novalidate` (main-product.liquid:200, :221); product.js no aplica reglas al cambiar de variante. EST. Confirmado. Cambio: novalidate añadido.
- **TT-24 · todos · Solo Claude.** PDP sin zoom ni layouts alternativos; tarjeta y header únicos. EST. Confirmado.
- **TT-25 · Contour, Annex, Maison · Ambos (G-28, G-29, G-33).** Barra de envío gratis activa por defecto a 150 sin guarda de moneda; la ayuda (en.default.schema.json:4858-4860) no advierte que no crea tarifas. **Corrección:** trust-badges.liquid:16, :29, :33 usan `| default: 'Secure checkout'`, `'30-day returns'` y `'Made to order'`, así que **vaciar el ajuste en el editor no retira la promesa**; solo se quita eliminando el bloque. EST. Confirmado. Cambio: fallback y ayuda añadidos; prioridad discrepante (D-D).
- **TT-26 · todos · Solo Claude.** Filtros con carrera, foco perdido, sin anuncio. EST. Confirmado.
- **TT-27 · todos · Ambos (G-25, G-30).** Aviso de reposición por formulario de contacto con consentimiento de marketing obligatorio y textos fijos en inglés. EST. Confirmado.
- **TT-28 · Contour · Solo Claude.** Hover de botón bajo 4.5:1: 3.33:1 según A4, 3.55:1 con etiqueta blanca según V-a11y (base.css:540). EST, SIN. Confirmado en dirección; la cifra exacta depende del color de etiqueta.
- **TT-29 · todos · Solo Claude.** Borde del campo notify-me 1.01 a 1.49:1; foco solo por cambio de borde de 1 px (base-components.css:594-608). EST, SIN. Confirmado.
- **TT-30 · todos (condicional) · Solo Claude.** Video del hero (hero.liquid:56-60) y marquee sin control de pausa. EST. Confirmado.
- **TT-32 · todos · Ambos (G-31, G-34).** Docs sin FAQ; "installs automatically with demo content" (docs/index.html:66-72) frente a "Demo imagery doesn't transfer on install"; "44×44" frente a RELEASE-NOTES.md:33 (24 x 24) y frente al stepper de la ficha, **medido 40x42 px** en Chromium (main-product.liquid:528-529; el de carrito mide 44x46); **los órdenes de home descritos en los docs para Annex y Maison no coinciden con listings/*/templates/index.json** (V-themestore). 40x42 supera el mínimo AA de 2.5.8; el problema es la frase de los docs, no un fallo AA. EST, SIM. Confirmado. Cambio: medición y divergencia de órdenes añadidas.
- **TT-33 · todos · Solo Claude.** listing.json (con gmail personal) y preview.png (unos 14 MB) en /listings (vigente). EST. Confirmado.
- **TT-99 · todos · Solo Claude.** config/metafield_definitions.json (declara `custom.edition_number`), metaobject_definitions.json y demo/ con 4 CSV; .shopifyignore no los excluye (vigente). EST. Confirmado; efecto en empaquetado no verificado. No implica ninguna definición creada ni aprobada.
- **TT-107 · tres presets con Notify me · GPT primero (C-01).** El nodo de éxito `.notify-me__success` está dentro del `form` que theme.js oculta, así que la confirmación nunca se ve y su `role="status"` no se anuncia; el diálogo se cierra a los 3 s. Evidencia: notify-me.liquid:55, :104-107; theme.js:777-781; harness-compra/c1-output.txt (`visibleToUser: false`). EST, SIM. Confirmado. Recomendación: sacar la confirmación del formulario. Cambio: nuevo; distinto de TT-27. Prioridad discrepante (D-F).

**Varios temas**

- **TT-51 · Sartorial y Atelier (Cucuyo en el anexo) · Solo Claude.** Mapa de variantes truncado a 250 en la PDP; la tarjeta de Sartorial sí tiene guarda (product-card.liquid:94, :113) (vigente). EST. Parcialmente confirmado.
- **TT-52 · Atelier (Cucuyo en el anexo) · Solo Claude.** Licencia GSAP 3.13.0 Standard: uso comercial permitido; la prohibición de "tools that allow users to build visual animations without code" viene de la web de GSAP. **Cita corregida:** la atribución está en LICENSE.md:27-31 (el archivo tiene 53 líneas; la cita anterior "91-98" no existía). La prohibición queda como EST-web no recomprobada. Cambio: cita corregida.

### 9.5 P3

Campos completos de los heredados en INITIAL-001. Solo se detallan los nuevos y los que cambian.

| ID | Tema · presets | Hallazgo | Crédito | Cambio |
|---|---|---|---|---|
| TT-53 | Sartorial | Duplicación featured-product y main-product | Solo Claude | Ninguno |
| TT-54 | Sartorial | main-placeholder sin uso; cross_sell sin shopify_attributes | Solo Claude | Ninguno |
| TT-55 | Sartorial | Sin preconnect | Solo Claude | Ninguno |
| TT-56 | Sartorial | Sin es.schema.json | Solo Claude | Ninguno |
| TT-57 | Sartorial | Marquee vacío sin placeholder en el editor | Solo Claude | Ninguno |
| TT-58 | Sartorial · Imprint, Archive | Galería grid no resalta la imagen de la variante | Solo Claude | Ninguno |
| TT-59 | Sartorial | Sidebar de filtros sin overflow; sin cajón móvil | Solo Claude | Ninguno |
| TT-60 | Sartorial | Coste de tarjetas con muchas variantes | Solo Claude | Ninguno |
| TT-61 | Sartorial | "Desde" con compare_at_max | Solo Claude | Ninguno |
| TT-62 | Sartorial | /cart sin barra de envío, estimador ni campo de descuento | Contradicho por G-15; GPT tenía razón | **Corregido:** la ayuda del editor ya dice que el importe no crea tarifas, no añade regalos ni crea descuentos (en.default.schema.json:815-816, :819-820), y enable_tiered_progress viene apagado por defecto. Solo falta mencionarlo en page.documentation.json. Se retira la recomendación anterior |
| TT-63 | Sartorial | Textos de demo con promesas y handles fijos | Solo Claude | Cita success/updates |
| TT-64 | Sartorial · Sartorial | Compare-at 4.05:1 en scheme-4 | Solo Claude | Ninguno |
| TT-65 | Sartorial | Formulario de soporte sin subida de archivo | Solo Claude | Ninguno |
| TT-66 | Sartorial | Nombres de custom elements como Dawn sobre base propia | Solo Claude | Ninguno |
| TT-105 | Sartorial · tres presets | `nextQuantity` recorta a max sin alinear a la rejilla (theme.js:5760); solo alcanzable con el tope de inventario (:1007-1013), porque Shopify no admite un quantity_rule.max fuera de la rejilla; el navegador bloquea el envío por stepMismatch. Arnés p3 | GPT primero (S-04) | Nuevo; GPT P2 (D-H). Matiza "reglas de cantidad completas" |
| TT-106 | Sartorial · tres presets | Para cualquier variante agotada, la región de estado anuncia "This purchase option is unavailable" porque `isPurchaseOptionValid` falla antes de llegar a sold out (theme.js:814-815, :1052-1064); el botón dice "Sold out" y el bloque de inventario por defecto (templates/product.json:26) también lo anuncia. Arnés s8 y Chromium | GPT primero (S-08) | Nuevo; GPT P2 (D-H) |
| TT-108 | Sartorial · bloque opcional size_guide | Guía de tallas con medidas y modelo concretos por defecto (main-product.liquid:947, 965, 971); show_model_fit_below true; ninguna ayuda dice que son de ejemplo | GPT primero (D-03) | Nuevo |
| TT-67 a TT-85 | Atelier | Bucle de variantes, rutas de búsqueda, mantenibilidad, theme blocks sin uso, sin enabled_on, sociales como text, hero doble, precio por petición de sección, drawer sin descuentos de carrito, disponibilidad por combinación, metafields leídos, panel móvil sin role, atajo "/", skip link en nav, Annex al 80 %, accent-1 2.63, support_url, comentarios con Dawn, presets no de moda | Solo Claude | Ninguno |
| TT-95 | Atelier (Cucuyo en el anexo) | HTML dentro de `{% doc %}` con theme-check 3.31 | Solo Claude | Parte de Cucuyo al anexo |
| TT-96 | Atelier y Sartorial (Cucuyo en el anexo) | Salidas sin escape | Solo Claude | Parte de Cucuyo al anexo |
| TT-97 | Sartorial y Atelier (Cucuyo en el anexo) | visible_if sin uso | Solo Claude | Parte de Cucuyo al anexo |
| TT-98 | Atelier (Cucuyo en el anexo) | overflow-x: clip, reflujo no evaluable | Solo Claude | Parte de Cucuyo al anexo |

---

## 10. Seguridad y transparencia

| Punto | Estado |
|---|---|
| Contraseña de demos de Atelier en DEVELOPMENT.md:7 | P1 (TT-31). El repositorio sigue público el 28-oct. Recomendación: rotar y purgar el historial |
| Impresión accidental 1 (verificación cruzada) | La salida de un comando de V-arquitectura imprimió la contraseña una vez en un registro interno de herramientas. No está en ningún informe ni archivo |
| Impresión accidental 2 (revisión R2) | Al comprobar DEVELOPMENT.md:7 con un filtro de enmascarado mal colocado, la salida de un comando de R2 imprimió la contraseña una vez en un registro interno de herramientas. No está en ningún informe ni archivo |
| Consecuencia | Los dos incidentes refuerzan la recomendación de rotar la contraseña de las demos. Ningún paso posterior de esta auditoría necesita abrir DEVELOPMENT.md ni buscar el valor |
| Email personal en listings/contour/listing.json:5 | Expuesto mientras el repositorio sea público (TT-33) |
| Secretos por patrón (tokens, claves) | 0 en los tres árboles (A5) |
| Valores de contraseña en informes | Ninguno en A1 a A8, V1, R1, X0, V-*, R2 ni en este documento (R2 lo comprobó por recuento de la cadena, sin imprimirla) |

---

## 11. Ventajas y debilidades

### Sartorial

Ventajas: flujo de compra amplio (reglas de cantidad, planes, gift card con destinatario, pickup, Shop Pay Installments, checkout acelerado, carrito /cart que funciona sin JS, descuentos y precio unitario); las 22 funciones obligatorias presentes en código; arquitectura JS sólida con custom elements y teardown; schema 100 % `t:` (718 referencias, 0 ausentes según G-11); PDP diferencial (4 layouts, zoom, provenance); base de accesibilidad estructural madura; ayudas del editor honestas sobre umbrales (G-15); sin dependencias de terceros ni GSAP.

Matices nuevos a esas ventajas: el selector de planes envía el plan equivocado en un flujo normal (TT-100); la PDP no funciona sin JS (TT-101); las reglas de cantidad fallan en el tope de inventario (TT-105); la clasificación de resultados inciertos solo cubre la venta cruzada (TT-102); el drawer móvil se rompe al cruzar el breakpoint (TT-104).

Debilidades: compuertas sin cumplir (G1 a G4); anillo de foco bajo 3:1 en Imprint y Archive (TT-02); afirmaciones de material inventadas (TT-03); soporte con titularidad sin confirmar (TT-05); header y tarjeta únicos y presets cercanos entre sí (TT-06, TT-17); catálogo de secciones estrecho (TT-16); CSS y JS globales pesados (TT-12).

### Atelier de Sebas (Contour)

Ventajas: el panel de configuración más rico (54 ajustes globales, 672 de sección, 5 idiomas, 1478 referencias `t:`); diferenciación estructural de home muy superior (Jaccard 0,11 a 0,19); ingeniería de carga cuidada; base Skeleton declarada; accesibilidad estructural sólida.

Debilidades: fallo silencioso al cambiar cantidad (TT-07, reproducido); confirmación de Notify me invisible (TT-107); promesas por defecto que no se pueden vaciar desde el editor (TT-25); riesgos de revisión documentados (TT-08, TT-09); credencial en un repositorio público (TT-31); PDP sin zoom ni planes ni reglas de cantidad (TT-21, TT-23, TT-24); el preset Contour no tiene PDP ni colección propias; documentación que diverge del producto (TT-32).

---

## 12. Comparaciones

### 12.1 Sartorial frente a Atelier (comparación principal)

| Categoría | Estado oficial | Lectura estática Sartorial | Lectura estática Atelier | Lectura |
|---|---|---|---|---|
| Diseño y percepción de valor | NE / NE | Home muy parecida entre presets (0,67 a 0,88); PDP igual en tipos | Home muy distinta entre presets (0,11 a 0,19); PDP más variada pero Contour hereda la raíz | Atelier más diferenciado en archivos. Ninguno de los dos varía header ni tarjeta. Nadie vio una demo |
| Compra | NE / NE | 15 / 14 / 15 | 11 | Sartorial sigue por delante, con menos margen tras TT-100 y los tres P2 nuevos |
| Móvil y accesibilidad | NE / NE | Anillo bajo 3:1 en dos presets; drawer móvil al cruzar breakpoint | Carrito silencioso; confirmación de aviso invisible; hover bajo 4.5 en Contour | No comparable numéricamente sin axe ni AT |
| Configuración y comerciante | NE / NE | 12 / 11 / 11 | 16 | Atelier claramente por delante |
| Rendimiento | NE / NE | CSS 50,6 a 51,0 KB gz y JS 57,5 a 57,9 KB gz globales | CSS 29,1 KB gz, JS 98 a 112 KB gz tras el FCP | Sin Lighthouse no hay ganador |

Lectura: Sartorial es mejor tienda en el código y Atelier mejor herramienta de comerciante y más diferenciado entre presets. Ambos comparten header y tarjeta únicos por preset. Las recomendaciones que mencionan cómo resuelve algo el otro tema describen un patrón; cualquier cambio se escribe desde cero.

### 12.2 Sartorial frente a Cucuyo

Solo a nivel de anexo: ver Anexo A.4. Cucuyo no es candidato y su vigencia no está confirmada.

### 12.3 Los tres, donde hay evidencia comparable

Nota: la columna de Cucuyo es solo informativa (instantánea 727c0d4, vigencia no confirmada) y no forma parte de la comparación entre candidatos.

| Métrica | Sartorial | Atelier | Cucuyo (instantánea, Anexo A) | Fuente |
|---|---|---|---|---|
| Inputs globales | 23 | 54 | 26 | V1 §4; G-10 |
| Secciones / con preset | 33 / 20 | 60 (+2 blocks) / 43 | 35 / 26 | G-10 |
| Referencias `t:` en todos los schemas / ausentes | 718 / 0 | 1478 / 0 | 0 | G-11, V-comerciante (corrige las 663 y 1366 de INITIAL-001, que no contaban settings_schema.json) |
| Cadenas fijas en schemas | 22 (todas `unit`) | 141 | 833 | V-comerciante; A2 |
| Idiomas storefront / editor | en, es / en | 5 / 5 | en / ninguno | A1 |
| Secciones con @app | 2 | 2 | 0 | A2 |
| CSS global gz | 50,6 a 51,0 KB | 29,1 KB | 33,4 a 33,6 KB | A2, A5, V-arquitectura |
| JS por página gz | 57,5 a 62,1 KB | 98 a 112 KB | 66,0 KB | A2, A5 |
| Theme Check `recommended` | 0 | 0 | 1 error, 1 aviso | A2, A5 |
| Sintaxis JS | node --check y acorn sin errores | acorn sin errores | acorn sin errores | G-07, A5 |

---

## 13. Preparación de Sartorial para 380 USD

380 USD cumple la regla de precio (100 a 500 en pasos de 10). Que el precio esté justificado sigue siendo una hipótesis comercial (G-37). **Nada de esto garantiza la aprobación de Shopify.**

**Compuertas (sección 4):** G1 demos por preset en client transfer store (no verificado); G2 Lighthouse medido; G3 material del listing, documentación consistente y soporte verificable; G4 notas de versión.

**P1 de Sartorial a cerrar antes del envío:**

| ID | Hallazgo | Crédito |
|---|---|---|
| TT-02 | Anillo de foco bajo 3:1 en Imprint y Archive | Solo Claude |
| TT-03 | Afirmaciones de material y época inventadas | Ambos |
| TT-05 | Email de soporte en un dominio de titularidad no confirmada | Solo Claude |
| TT-100 | Plan de venta enviado mal (caso C determinista) | GPT primero |

**Riesgos P2 relevantes:** TT-04 (docs con "Edition"), TT-06 y TT-17 (unicidad y presets cercanos), TT-13 (raíz frente a demo), TT-14 y TT-15 (plantillas del vendedor y secciones de página), TT-16 (catálogo de secciones), TT-12 (peso frente a G2), TT-101 a TT-104 (flujos de compra y móvil), TT-18 y TT-19.

**Listo en lo estático:** código original sin huellas de Dawn ni Horizon; 22 funciones presentes en código; nombres con forma válida (una o dos palabras, menos de 30 caracteres, el preset Sartorial con el nombre del tema), con el límite de que Imprint y Archive solo se comprobaron como nombres de tema, no como presets de otros temas; /listings conforme; Theme Check `recommended` en 0; schema completo en inglés; ayudas del editor claras sobre umbrales; sin dependencias de terceros.

---

## 14. No evaluado y puntos ciegos compartidos

**Puntos ciegos que comparten las dos auditorías:** sin tienda; sin demos; sin editor de Shopify; sin Lighthouse; sin axe en tienda; sin tecnología asistiva; sin compra ni checkout reales; sin respuesta real de /cart/change.js ni de Shopify ante dos `selling_plan`; sin instalación limpia por preset.

**No evaluado por Claude:** HEAD 09f8342 del checkout codex; tema publicado 189832593651 (y la lectura API de G-05); el Sartorial-1.0.0.zip de 346.291 B de la raíz de la carpeta (no abierto); titularidad de ruizdigital.com y noobprobro-web; vigencia de la contraseña de las demos; comparación visual con fieldstudiesflora.com; contenido real del ZIP empaquetado de Atelier; texto actual de la licencia GSAP; estado actual del repositorio de Cucuyo.

**Próximos pasos propuestos (recomendaciones, no autorizaciones):** rotar la contraseña de las demos de Atelier; confirmar con Johandry G1 y TT-05; con autorización, instalar cada preset en tienda limpia, ejecutar Lighthouse y axe y pasar NVDA y VoiceOver; reproducir TT-100 y TT-07 en una tienda de prueba; decidir con Johandry si Cucuyo se reincorpora o se retira.

## 15. Notas obligatorias

- Las recomendaciones de este documento no autorizan implementación.
- Las siete definiciones de metafields propuestas para Sartorial **siguen sin aprobar**; ninguna recomendación depende de ellas. El archivo metafield_definitions.json de Atelier (TT-99) no implica ninguna definición creada ni aprobada.
- No se copia ni se propone copiar código de Atelier ni de Cucuyo.
- La causa de los rechazos de Atelier sigue sin verificar.
- Ninguna conclusión garantiza la aprobación de Shopify.

---

## Anexo A. Cucuyo: instantánea 727c0d4 del 27-oct (clon anónimo 12:45), vigencia no confirmada

**Estado.** El análisis procede de un clon anónimo hecho el 27-oct a las 12:45, cuando el repositorio era público. A las 20:30 del 27-oct pedía credenciales y el 28-oct a las 10:52Z `git ls-remote` sin credenciales responde igual que un repositorio inexistente o privado (control con un nombre inventado: misma salida). El commit 727c0d4 es del 2026-10-10, "Update from Shopify for theme cucuyo/main", así que el remoto pudo avanzar. Johandry indicó a GPT que Cucuyo no está disponible por ahora.

**Tratamiento.** Fuera de los recuentos P0 a P3, fuera de la matriz y fuera de la comparación entre candidatos. Cucuyo no es candidato a la Theme Store (TT-86). **Nota para Johandry:** si quieres que este análisis se reincorpore al cuerpo del informe, o que se retire del todo, basta con pedirlo.

### A.1 Hallazgos de la instantánea (niveles de referencia, no contados)

| Nivel de referencia | IDs | Resumen |
|---|---|---|
| P1 (2) | TT-10, TT-11 | Sin app blocks; botón de envío del popup sin nombre accesible (confirmado de nuevo por V-a11y: además invisible, sin icono) |
| P2 (17) | TT-34 a TT-50 | Carrito sin descuentos ni propiedades; formulario de compra mínimo; colección sin filtros; Theme Check falla con su config; orden de CSS que anula 5 ajustes; 27 MB de borradores en assets; GSAP desproporcionado; editor que se rompe tras editar; sin esquemas ni i18n; README contradictorio; plantillas ausentes; main-product añadible en cualquier plantilla; popup con borde 1.00:1 (recalculado por V-a11y); swatches pequeños; texto pequeño; bordes 1.43 a 1.54:1 (recalculado); video sin pausa |
| P3 (9) | TT-86 a TT-94 | No candidato a Theme Store; venta cruzada por colección; media solo imágenes; contenido de cliente en defaults; home sin h1; error del popup sin role; prioridades de carga; sin reglas de corte; comentarios con referencias |

Partes de Cucuyo en hallazgos de varios temas: TT-51 (truncado de variantes en pdp-block.liquid:221-239), TT-52 (GSAP), TT-95 (10 snippets con HTML en `{% doc %}`), TT-96 (salidas sin escape), TT-97 (visible_if), TT-98 (overflow-x: clip).

### A.2 Matriz

No se puntúa. Estado oficial NE en las cinco categorías, igual que GPT.

### A.3 Verificación cruzada

GPT no evaluó Cucuyo (G-03), así que no hay G-NN que contrastar. V-a11y reconfirmó TT-11, TT-46 y TT-49 sobre la instantánea.

### A.4 Sartorial frente a Cucuyo (solo a nivel de anexo)

Contra el listón de un tema comercial, Sartorial supera a la instantánea de Cucuyo en todas las áreas con evidencia estática: compra (Cucuyo sin cantidad, sin checkout acelerado, sin descuentos visibles), comerciante (sin @app, sin esquemas, editor sin i18n), accesibilidad (popup sin nombre, bordes bajo 3:1) y calidad funcional (Theme Check que falla, ajustes anulados). La comparación es asimétrica: Cucuyo es una tienda a medida y muchas ausencias son decisiones del cliente. Esta comparación no entra en la sección 12.1 ni en la matriz.

---

## Anexo B. Arneses de la verificación cruzada

| Archivo | Qué prueba | Salida | Hallazgo |
|---|---|---|---|
| harness-compra/p4-atelier-422.js | cart.js real con badge y fetch 422 | p4-output.txt | TT-07 |
| harness-compra/s2-sartorial-selling-plan.js | Fixture: reproduce a mano el cambio de estado de theme.js:771-780 sobre un marcado reducido del Liquid (hidden y select no-JS), 4 escenarios; no ejecuta la clase original | s2-output.txt | TT-100 |
| harness-compra/p3-sartorial-quantity.js | `nextQuantity` original en el tope | p3-output.txt | TT-105 |
| harness-compra/s8-sartorial-status.js | `updateStatus` original con variante agotada | s8-output.txt | TT-106 |
| harness-compra/c1-atelier-notify.js | clase `NotifyMe` original | c1-output.txt | TT-107 |
| harness-a11y/g20_g23.js, g31.js, tt02.js, contrast.py | Chromium sin interfaz con base.css y theme.js reales; contraste | (consola) | TT-104, TT-106, TT-32, TT-02 |
| harness-com/diff_presets.py, same_type.py, schema_refs.py | Jaccard de presets y referencias de schema | out-*.txt | TT-17, §6, §12.3 |
| harness-arq/p2, parse.mjs, sartorial-zip-tree.sha256 | node --check, vm.Script y manifiesto de 93 archivos | (consola) | G-07, G-06 |

Ubicación: /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/cross/. Comando de los arneses de compra: `node <archivo>` dentro de harness-compra (jsdom 24.1.3). Ningún arnés se ejecutó dentro de los directorios de los temas.
