# Revisión independiente · reanudación B-04 · 2026-11-08

**Dictamen: BLOQUEADA ANTES DE LA PRUEBA FUNCIONAL.** El intento no acredita cumplimiento ni defecto de B-04. Esta revisión es documental: no repite solicitudes a la tienda y no atribuye el resultado al tema ni a una contraseña incorrecta.

## Alcance y evidencia

- Directiva B-04, `CLAUDE-DIRECTIVA-B-04-001.md:312`: la matriz de tienda incluye nota sucia, limpia y oculta, eco exacto, red lenta o interrumpida, edición en vuelo, mutaciones concurrentes, checkout nativo y teclado/lector. Ninguno de esos casos quedó ejecutado.
- Informe de matrices, sección «Reanudación del 2026-11-08», SHA-256 `972baed82eb4b496aac62a9d237bf780258fa8650043b43cd53d11f86bef0c38`.
- Intento B-04 en Sartorial: `matrix-B-04-20261108T152347800Z-74fd6a9e-00d7-4d0b-90a4-43ec8a8b2918.json`, SHA-256 `dbd42c743031906fcff7471ed03b37b79beea8294cd7c74fd7a21a409be4f76e`.
- Acceso Playwright de invitado mediante GET: `matrix-B-04-20261108T152529531Z-9259a93c-838f-4a0b-8d2c-b57522bc9528.json`, SHA-256 `6353ed89e2395c661bfe3296eb3d3d390bbc2dababfd0ec24f0c0ccead84004`.
- Sondeo HTTP GET sin cookies: `storefront-get-only-barrier-20261108.json`, SHA-256 `51f9e3c9d480df93c5ec8bb838078f7a0380d594cd926142dd48582e1126212c`.

## Hallazgos

1. El primer JSON registra un solo check `storefront_access` fallido con `AUTH_RESPONSE_NOT_ACCEPTED`. El runner exige 302/303 para la operación de autenticación; el artefacto no conserva el código HTTP recibido. Por tanto, no identifica la causa ni prueba que la contraseña sea incorrecta. No registra eventos de reintento 429.
2. Ese contexto registra `cartTouched=false`, carrito inicial no verificado, limpieza final `null` y `contextClosed=true`. No se autorizó ni tocó el carrito; no hay una limpieza exitosa que certificar.
3. El segundo JSON registra tres fallos `HARNESS_OPERATION_FAILED` en `storefront_access`, uno por preset. Sus decisiones registradas son GET; los tres contextos declaran `cartTouched=false`, limpieza `null` y cierre. No consta verificación de `Shopify.theme.id` en esos intentos.
4. El sondeo separado, sin cookies, registra para cada uno de los tres IDs dos respuestas 302, clasificadas como destino home y después password. Esto describe la barrera observada para un invitado sin sesión; no valida ni invalida credenciales, ni prueba un defecto del tema.
5. El informe declara que Shopify CLI 4.8.0 confirmó los tres IDs como no publicados y sin procesamiento antes de la reanudación. Los JSON aislados remiten al preflight externo; esta revisión no lo repitió y no identifica el SHA del árbol servido.

La política D28 autoriza una operación de autenticación al endpoint exacto `/password` y reenvíos únicamente tras HTTP 429 (`docs/decisions.md:268,291`). La detención ante incertidumbre de acceso es coherente con D10. B-02, C-01 y la cobertura restante de A-03 y B-01 no se iniciaron en esta reanudación. Las conclusiones parciales anteriores conservan sus límites; ninguna fila del ledger se cierra con esta evidencia.
