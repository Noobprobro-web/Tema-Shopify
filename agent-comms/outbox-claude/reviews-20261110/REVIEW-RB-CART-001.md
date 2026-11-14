```text
ID: REVIEW-RB-CART-001
Estado: ACEPTADO CON CONDICIONES como humo R-B de carrito (Sartorial, 190232297715) con datos seguros. RECHAZADO como corrida "completed": el fallo de ruta no tiene diagnóstico posible con este JSON. No cierra ninguna fila del ledger. Condiciones C1 a C4 al final.
Decisión requerida: Gemini/Johandry. (a) No gastar la 5.ª y última corrida diagnóstica --cart hasta aplicar el parche mínimo de §5 (P1-1 y P2-1), que es local y reversible. (b) Decidir si un fallo de ruta ocurrido después de empezar el cierre del contexto debe seguir haciendo fallar la corrida (cambio de política, no lo propongo como mínimo).
Resumen en 5 líneas:
1. JSON válido e higiénico: 0 URLs, 0 '?', 0 cookies/tokens/Bearer, 0 /products/ y 0 /cart. STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN: 0 apariciones, con las dos variables definidas. 64 bloqueos = 33 + 21 + 2 + 3 + 5, igual que warningOccurrences.
2. SECRET_MATCH es un falso positivo del guardián: la regex de nombres (run.mjs:323) incluye `pwd`, así que toma OLDPWD, cuyo valor en este contenedor es "/" (1 carácter). Cualquier pathname contiene "/", así que se redactan TODOS los paths (también los externos) y ningún host. Las corridas del 2026-11-06 sí muestran paths; la read-only de hoy está redactada igual.
3. "GET de producto" es una mala lectura: pageKind es la página en la que estaba el navegador (run.mjs:449-452), no el destino. El destino fue un GET cualquiera al host de la tienda (documento, recurso /cdn/shop, /cart?section_id...). El código genérico sale de safeCode (run.mjs:157-165), que no reconoce TargetClosedError de Playwright 1.63 ni los errores de red de Node que llegan solo en el mensaje. Hipótesis principal: carrera con context.close() (run.mjs:1031). Alternativa: corte de transporte en el proxy. El JSON no permite elegir entre las dos.
4. Los 33 POST MUTATION_BLOCKED son telemetría de plataforma (monorail produce_batch, /api/collect, graphql.json, fec/produce): son los mismos 33 que el Sartorial del 11-06 (16+5+9+2+1). Un aborto por política sale antes del catch (run.mjs:494) y no puede generar un evento stage=fetch. No hay indicio contra el tema ni contra la tienda.
5. Limpieza verificada (clear/update/read 200, itemCount 0, nota vacía, contextClosed, intervención false). No queda carrito huérfano. B-03 sigue en `código completo`. B-04 no tiene fila en el ledger y esta corrida no ejercita su código (P3-1).
Archivos tocados: solo este informe (nuevo). Sin commit ni push. run.mjs sin modificar.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No se ejecutó ningún comando de Shopify ni ninguna petición a la tienda. No se abrió .secrets. Ningún valor de variable se imprimió: solo nombres, longitudes y booleanos de pertenencia calculados en memoria.
Hallazgos extra fuera de alcance (con parche listo): P1-1 y P2-1 tienen parche propuesto en §5 (sin aplicar). P2-2, P2-3 y P3-1 a P3-3 sin parche.
Verificación (comando, resultado y qué demuestra/qué no): python3 -I sobre los 4 JSON RA-RB-cart y 3 read-only, grep/lectura de run.mjs:1-560 y 808-1048, inspección local de node_modules/playwright-core 1.63.0 y enumeración de nombres de variables de entorno (sin valores). Demuestran la higiene, la causa de la redacción y qué código genera el evento. NO demuestran qué petición concreta falló ni si fue carrera o red: no repetí la corrida.
Lista de afirmaciones falsables numeradas: §6.
```

## 1. Validez e higiene del JSON

Archivo: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-cart-20261111T224633293Z-7da297bc-fa10-4520-a331-394bb1328141.json` (31 234 bytes, sin rastrear). `json.load` sin errores. Claves de primer nivel: schema, mode, scopeResult, executionResult, startedAt, finishedAt, target, limits, checks, sessions, interventionRequired, historicalIncidents.

| Punto | Resultado |
| :--- | :--- |
| Modo y estado | `cart`, `executionResult=failed` y `scopeResult=failed`. Duró de 22:46:33.294Z a 22:46:43.316Z (unos 10 s) |
| Checks | 6, todos passed: storefront_access, cart_pdp_add_one_line, populated_cart_drawer_viewport 390x844 y 1280x800, cart_note_exact_api_echo y final_same_session_cart_cleanup |
| Por qué failed | Solo por `routeOperationFailed=true` (run.mjs:184: basta un `session.routeOperationFailed`) |
| Literales secretos | STOREFRONT_PASSWORD=0 y SHOPIFY_CLI_THEME_TOKEN=0, con las dos definidas en os.environ |
| Patrones | `https?://` 0, `cookie` 0, `_shopify` 0, `token` 0, `shpat_/shptka_/shpca_` 0, `Bearer` 0, `preview_theme_id` 0, `/products/` 0, `/cart` 0, `?` 0. `password` 1, pero es la etiqueta fija `pathClass: "password_auth"` (línea 145 del JSON) |
| Hosts | tema-qkqpke0j.myshopify.com, error-analytics-sessions-production.shopifysvc.com, otlp-http-production.shopifysvc.com, monorail-edge.shopifysvc.com, shop.app y shopify-assets.shopifycdn.com. No hay ninguna otra tienda |
| Pathnames | todos `null` (8/8 networkWarnings y 1/1 routeFailureEvents con `SECRET_MATCH`) |
| Recuentos | blockedRequests=64 = 33 MUTATION_BLOCKED + 21 POST HOST_NOT_ALLOWED (19 fetch + 2 xhr) + 2 PLATFORM_HOST_BLOCKED + 3 ANALYTICS_HOST_BLOCKED + 5 GET HOST_NOT_ALLOWED. warningOccurrences=64 y deniedResourceSummary suma 64. requestDecisions=72 (64 denegadas + 1 auth + 1 validación + 2 redirectHop + 4 cart_post) |
| 429 / intervención | rateLimitEvents=[], interventionRequired=false, blockedWebSockets=0, popupsClosed=0 |

Nota: el ejecutor contó 21 POST externos. En total hay 26 bloqueos externos HOST_NOT_ALLOWED (21 POST y 5 GET a shopify-assets.shopifycdn.com).

Higiene: correcta. La redacción masiva es un exceso de cautela, no una fuga (§2.1).

## 2. Causa del fallo

### 2.1 Por qué el path salió como SECRET_MATCH (falso positivo, causa demostrada)

- `buildInventorySecretGuard` (run.mjs:319-335) recoge el valor de toda variable de entorno cuyo NOMBRE cumpla `/(?:token|password|passwd|pwd|cookie|secret|auth|credential|key)/i` (run.mjs:323). No pone longitud mínima ni lista de exclusión. `matches` usa `candidate.includes(secret)` (run.mjs:331).
- La subcadena `pwd` atrapa `PWD` y `OLDPWD`. En este contenedor, OLDPWD mide 1 carácter y su forma normalizada es exactamente "/". Lo comprobé en memoria con un booleano, sin imprimir el valor. Hay otra variable de 1 carácter cuyo nombre contiene `KEYS` y que está en `/v1/traces`, pero no en `/products/wool-waistcoat`.
- Consecuencia: `safeWarningSource` (run.mjs:342-347) deja pasar los hosts, que no contienen "/", y redacta todos los pathnames. Coincide con el JSON: hosts presentes y paths `null` incluso para hosts externos (`otlp-http-production…`) y para el path "/".
- Comparación: las corridas cart del 2026-11-06 (11:28Z y 15:31Z) traen paths en claro (`/observeonly`, `/v1/metrics`, `/.well-known/shopify/monorail/unstable/produce_batch`, …) y `redactionReason=None`. La read-only de hoy (RA-RB-read-only-20261111T223754…) está redactada al 100 %, igual que esta (8/8 SECRET_MATCH por sesión). El cambio es de entorno: el comentario de run.mjs:190 indica que antes se ejecutaba en Windows. El código del guardián no cambió.
- Efecto: el guardián falla en modo cerrado, así que no hay riesgo de fuga. Pero deja a ciegas cualquier diagnóstico de ruta en este entorno (P1-1).

### 2.2 Qué indica realmente el evento

- `pageKind` sale de `session.page.url()` (run.mjs:449-452). Es la página que tenía abierta el navegador, no el destino de la petición. La suite de carrito no sale nunca de la PDP (`goto(..., 'product')` en run.mjs:824, y todo lo demás ocurre en la misma página o por API), así que cualquier evento de esta sesión dirá `product`. **No significa que fallara el GET del documento de producto.** Esa navegación terminó con 2xx y `main` visible, o storefront_access y el resto de checks no habrían pasado (run.mjs:220-226).
- `stage=fetch` + `host` de la tienda + `GET`: el error saltó dentro de `route.fetch` (run.mjs:518-520) para un GET del navegador hacia la tienda. Puede ser un documento, un recurso `/cdn/shop/...`, `/cart?section_id=…`, recomendaciones, etc. La rama externa no aplica: con host de tienda, `isExternalHostFetchFailure` devuelve false (run.mjs:470).
- Los GET permitidos sin redirección no se registran en `requestDecisions` (run.mjs:300), así que el JSON no tiene ningún rastro de esa petición (P2-3).
- `code=HARNESS_OPERATION_FAILED` es el cajón de sastre de `safeCode` (run.mjs:157-165). No es un CheckError, no es `TimeoutError` (además la corrida duró 10 s y el timeout es de 15 s, run.mjs:520) y su mensaje no contenía `net::ERR_*`. `route.fetch` usa el cliente HTTP de Playwright (Node), no la pila de red de Chromium. Por eso nunca produce `net::ERR_*`, y sus errores de socket llegan como texto, sin `error.code`. En playwright-core 1.63.0 local, el cierre de contexto lanza `TargetClosedError` ("Target page, context or browser has been closed" / "Request context disposed.", coreBundle.js:12240-12243 y 26519), que `safeCode` no reconoce (P2-1).

### 2.3 Hipótesis sobre el origen (no decidible con el JSON)

1. **Más probable: carrera en el cierre.** El `finally` de main limpia el carrito por API (run.mjs:1008-1015) y luego ejecuta `context.close()` (run.mjs:1031) sin parar ni esperar a los manejadores de ruta en curso. Si el tema tenía un GET en vuelo cuando se cerró el contexto, `route.fetch` lanza `TargetClosedError` y el catch lo registra como fallo (run.mjs:548-553). Ese GET podía ser un refresco del cajón tras el alta, una imagen diferida al pasar a 1280 o el render de sección. El caso está previsto: el comentario de run.mjs:168-169 habla de "late handlers", y saveReport serializa después del cierre (run.mjs:1034). Encaja con que sea no determinista: el Sartorial del 11-06, con el mismo flujo, no lo tuvo. Los GET a `/cart…` además esperan en la cola de carrito (run.mjs:105-108 y 120-125) detrás de las llamadas de limpieza, lo que agranda la ventana.
2. **Alternativa: corte de transporte** (ECONNRESET o "socket hang up") en el proxy saliente del contenedor. Llegaría también como HARNESS_OPERATION_FAILED porque safeCode solo mira `error.code`.

### 2.4 Lo que NO es

- **No es consecuencia de los 33 POST MUTATION_BLOCKED.** Un bloqueo por política hace `route.abort('blockedbyclient')` y `return` antes del catch, con `stage='policy_abort'` (run.mjs:494). Nunca genera un evento `fetch`. Los 33 son telemetría de plataforma (Shopify analytics / web pixels / Storefront API GraphQL), no POST a `/cart`. Los POST a `/cart/*.js` salen como `CART_POST_ALLOWED` (4 en requestDecisions). El 11-06 el Sartorial tuvo exactamente los mismos 33: 16 + 9 produce_batch, 5 /api/collect, 2 graphql.json y 1 fec/produce.
- Tampoco es una redirección a shop.app (2 PLATFORM_HOST_BLOCKED, uno de ellos `redirectHop`): `validatedRedirect` lanza `PolicyBlocked` (run.mjs:439) y el catch lo excluye expresamente (run.mjs:551).
- **¿Afecta al tema, al arnés o a la tienda?** Al arnés, sea por diagnóstico o por carrera de cierre. No hay evidencia contra el tema ni contra la tienda. Sí hay un riesgo no medido: si el GET fallido fue un render de sección a mitad del flujo, el cajón pudo quedarse con contenido viejo, y el check del cajón solo comprueba la visibilidad (P3-2).

## 3. Seguridad de datos

- `cartInitiallyEmptyVerified=true` antes de la primera mutación (run.mjs:826-830).
- `finalCartCleanup`: attempted, clear 200, update(nota '') 200, read 200, itemCount 0, emptyVerified true y noteEmptyVerified true. El check `final_same_session_cart_cleanup` está en passed (run.mjs:1012-1014 exige las dos verificaciones y escrituras 2xx).
- `contextClosed=true`, `cartTouched=true` e `interventionRequired=false`. Nunca se entró en `holdForManualCleanup`.
- `noteValueStored=false`: el UUID de la nota no se serializó.
- `historicalIncidents` solo arrastra el huérfano de Archive del 2026-11-06 (LEAVE_TO_EXPIRE). Esta corrida no añade otro.

Riesgo residual: bajo. En la tienda de desarrollo queda un objeto carrito vacío asociado a una cookie de sesión ya descartada, que caduca solo. No hubo checkout, pago ni escrituras de ajustes o catálogo. La telemetría saliente se bloqueó, así que no se envió ningún evento de analytics de terceros. El único dato no limpiable es lo que Shopify registre del lado del servidor por las llamadas a /cart/*.js, que es inherente a PD-8.

## 4. Aporte al ledger (docs/requirements-ledger.md)

- **B-03, fila 67** ("Alta al carrito con respuesta perdida sin duplicar líneas", `código completo`): esta corrida demuestra solo el camino feliz. Un clic en el botón de la PDP Sartorial genera un POST /cart/add.js y deja exactamente 1 línea y 1 unidad (`reconciledAfter429=false`, sin 429). NO demuestra el contrato de B-03: respuesta perdida, 429, reconciliación con `cartBaseline` o `showUnconfirmedAdd`, y Complete the look. Ni Imprint ni Archive. **Sigue en `código completo`.**
- **B-04** (View cart guarda la nota antes de navegar, `0e8a401`): **no tiene fila en el ledger** (grep de `B-04`, `View cart`, `saveNoteAndNavigate` y `nota` en el ledger: 0 resultados fuera de la fila 67). El check `cart_note_exact_api_echo` escribe la nota directamente con `requestViaPolicy POST /cart/update.js` (run.mjs:873-881). Prueba que Shopify devuelve exacta una nota con salto de línea, espacios y emoji, pero no toca el textarea del cajón, `handleCrossSellView` ni `saveNoteAndNavigate`. **No aporta evidencia de B-04.** Estado efectivo: sin fila (P3-1). Si se crea, sería `código completo` y no `cumplido`.
- Ninguna fila cambia de estado. Es una corrida de humo y además está en `failed`.

## 5. Recomendación

**No repetir --cart tal cual.** La 5.ª corrida saldría con los mismos paths redactados y el mismo código genérico, así que se perdería la última corrida autorizada sin poder distinguir entre las hipótesis 1 y 2 de §2.3. Primero hay que aplicar este cambio mínimo y reversible en `run.mjs` (con autorización de Gemini/Johandry, un solo commit revertible). No hace ninguna petición a la tienda y se puede validar en local con `node --check` y una prueba unitaria de `safeCode`/guardián:

1. **Guardián (P1-1), run.mjs:322-325.** Saltar las variables de directorio y dar a las demás una longitud mínima, manteniendo siempre las dos credenciales reales sea cual sea su longitud (STOREFRONT_PASSWORD mide 6):
   ```js
   const ALWAYS_GUARDED = new Set(['STOREFRONT_PASSWORD', 'SHOPIFY_CLI_THEME_TOKEN']);
   // dentro del bucle, antes del filtro por nombre:
   if (/^(?:OLD)?PWD$/.test(name)) continue;
   if (!ALWAYS_GUARDED.has(name) && (!/(?:token|password|passwd|cookie|secret|auth|credential|key)/i.test(name) || !value || value.length < 8)) continue;
   ```
   (Se quita `pwd` de la regex: `passwd` y `password` ya cubren los nombres de credencial.)
2. **Clasificación (P2-1), run.mjs:157-165.** Antes del `return` genérico, reconocer por patrón fijo y sin serializar el mensaje: `error?.name === 'TargetClosedError'` o `/Target page, context or browser has been closed|Request context disposed/` → `'TARGET_CLOSED'`; `/\b(ECONNRESET|ETIMEDOUT|ECONNREFUSED|ENOTFOUND|EAI_AGAIN)\b/` en el mensaje → `NETWORK_<código>`; `/socket hang up/i` → `'NETWORK_SOCKET_HANG_UP'`.
3. **Fase (P2-2), opcional pero barato.** Poner `session.teardownStarted = true` justo antes de `cleanupCart` (run.mjs:1008) y añadir `phase: session.teardownStarted ? 'teardown' : 'workflow'` en `routeEvent` (run.mjs:454). No cambia la política: un fallo en teardown sigue haciendo fallar la corrida. Solo deja ver cuándo ocurrió.

Alternativa sin código para la redacción: lanzar con `env -u OLDPWD -u PWD node …`. Es más frágil (no cubre la otra variable de 1 carácter cuyo nombre contiene `KEYS`) y no resuelve el código genérico. No la recomiendo como sustituto.

Con 1+2(+3), la 5.ª corrida o deja ver el path y `TARGET_CLOSED` en teardown, que es ruido del arnés y se resuelve con `context.unrouteAll({ behavior: 'ignoreErrors' })` antes de `close()` (eso ya sería decisión de Gemini), o deja ver un fallo real en workflow con path, que se investiga como posible defecto del tema.

## Hallazgos

| ID | Sev. | Archivo:línea | Hallazgo |
| :--- | :--- | :--- | :--- |
| P1-1 | P1 | run.mjs:323 (+331, 345) | La regex de nombres incluye `pwd` y no hay longitud mínima. OLDPWD="/" hace que se redacten todos los pathnames en este entorno. Deja ciego el diagnóstico de esta corrida y de la read-only de hoy |
| P2-1 | P2 | run.mjs:157-165 | `safeCode` no reconoce `TargetClosedError` (Playwright 1.63) ni los errores de socket de Node que solo llegan en el mensaje. Todo cae en HARNESS_OPERATION_FAILED |
| P2-2 | P2 | run.mjs:1008-1031 y 548-553 | `context.close()` se ejecuta con manejadores de ruta en vuelo, sin `unrouteAll` ni marca de fase. Probable origen del evento, aunque no está demostrado |
| P2-3 | P2 | run.mjs:300 | Los GET permitidos no se registran, así que la petición fallida no deja ningún rastro aparte del evento |
| P3-1 | P3 | docs/requirements-ledger.md (falta la fila) | B-04 no tiene fila en el ledger. La compuerta 1 no la puede seguir |
| P3-2 | P3 | run.mjs:864-871 | `populated_cart_drawer_viewport` comprueba visibilidad, pero no que el cajón muestre la línea añadida |
| P3-3 | P3 | JSON, requestDecisions[8] y [60] | 2 PLATFORM_HOST_BLOCKED a shop.app (uno vía redirección desde la tienda) que no aparecen en las cart del 11-06. Bloqueo correcto. Conviene identificar el origen cuando los paths vuelvan a ser visibles |

## Condiciones

- **C1.** No registrar esta corrida como `completed` ni como evidencia de cierre de B-03 o B-04.
- **C2.** Antes de la 5.ª corrida --cart, aplicar y validar en local P1-1 y P2-1 (y P2-2 si se aprueba).
- **C3.** Crear la fila B-04 en el ledger en `código completo`, o documentar en `docs/decisions-pending.md` por qué no la tiene.
- **C4.** Etiquetar la read-only de hoy (REVIEW-RA-READONLY-001) con la misma salvedad: sus paths de aviso también están redactados por P1-1.

## 6. Afirmaciones falsables

1. El JSON parsea y contiene 0 coincidencias de `https?://`, `cookie`, `token`, `Bearer`, `?`, `/products/` y `/cart`. La única coincidencia de `password` es `"pathClass": "password_auth"`.
2. STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN aparecen 0 veces, con las dos variables definidas.
3. blockedRequests 64 = 33 + 19 + 2 + 2 + 3 + 5 (MUTATION / POST fetch externos / POST xhr externos / PLATFORM / ANALYTICS / GET externos).
4. En las corridas cart del 2026-11-06 los networkWarnings tienen pathname y `redactionReason=None`. En esta y en la read-only 20261111T223754 todos tienen `SECRET_MATCH`.
5. En este contenedor, OLDPWD tiene longitud 1 y su valor normalizado es "/". Su nombre cumple la regex de run.mjs:323 por `pwd`.
6. `pageKind` se calcula con `session.page.url()` y no con la dirección de la petición (run.mjs:449-452).
7. Los abortos por política retornan antes del catch (run.mjs:494) y no generan eventos de fallo de ruta.
8. El Sartorial del 2026-11-06 11:28Z tuvo 33 MUTATION_BLOCKED y `routeFailureEvents=[]`.
9. `safeCode` no tiene ninguna rama para `TargetClosedError`, y playwright-core 1.63.0 define esa clase con el mensaje "Target page, context or browser has been closed".
10. `finalCartCleanup` muestra emptyVerified y noteEmptyVerified a true, con clear/update/read 200 e itemCount 0.
11. El ledger no tiene ninguna fila que mencione B-04.
