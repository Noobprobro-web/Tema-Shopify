# Registro de decision D28 - Sesion 003

- **ID:** D28
- **Fecha:** 2026-11-05
- **Autor:** Johandry

## H-1: contraste del texto en hover de heritage (Archive)

El texto en hover de heritage en Archive (`#b5885c`) tiene un contraste de entre 2,25 y 2,76:1, por debajo del minimo de 4,5:1 (WCAG 1.4.3). Contradice la fila 47 del ledger.

**DECISION: corregirlo.** Se anade como tarea nueva del Lote C, con directiva, R-D, implementacion y revision. Esta decision autoriza el cambio de alcance; si la solucion resulta de Nivel 2, la autoriza su R-D.

## PD-3 de B-04: guardar la nota al pulsar los enlaces de cada linea del cajon

**NO SE AMPLIA.** Queda como limitacion conocida.

## PD-8 de B-03: anadir al carrito en previews

**AUTORIZADO ACOTADO.**

- Solo en previews no publicados de `tema-qkqpke0j`.
- Solo en el carrito de la sesion de prueba.
- Hay que vaciar el carrito al terminar y nunca llegar a pagar.
- No se tocan productos, apps ni configuracion.

## Fixture de suscripcion

**SIGUE PENDIENTE** (lo crea Johandry). El Lote 0 se cierra con C-R0-4 pendiente (D19). A-01 queda en «codigo completo» hasta que exista el fixture.

## Incidente D28-I1 (carrito de prueba)

En la primera ejecucion de gate5 se anadio 1 unidad y una nota al carrito de la sesion de prueba en el preview `tema-qkqpke0j`. El carrito NO se vacio porque el token vivia en la sesion desechable. **Decision de Johandry (2026-11-04): se deja caducar; no se toca.**

**Regla nueva:** gate5 debe vaciar el carrito dentro de la misma sesion de navegador antes de cerrarla, y debe fallar si no lo consigue (`GATE5_CART_NOT_EMPTY`). Implementado en `scripts/gate5-complete-verification.mjs` (`clearCartInSession`, ejecutado en un `finally` antes de cerrar el contexto; comprueba `item_count` 0 y nota vacia).

### Cambios de gate5 asociados (aprobados)

- **Cookie:** se retira la exigencia del nombre `storefront_digest`. Se valida por comportamiento: sin contrasena, `/products.json` redirige a `/password`; con contrasena, `/` y `/products.json` dan 200.
- **Filtro de ruido del proxy** (lista exacta; todo lo demas sigue haciendo fallar la compuerta; sustituye al filtro anterior de `shop.app`/403/404):
  1. `ERR_TUNNEL_CONNECTION_FAILED` cuyo host de recurso NO es el host de la tienda ni `cdn.shopify.com` (host de assets del tema). Si la URL del recurso falta o no se puede analizar, NO se filtra.
  2. Errores de la barra de previews de Shopify (iframe `#PBarNextFrame` y sus recursos): mensaje con `PBarNextFrame`, recurso en `bugsnag.com`/`*.bugsnag.com`, o ruta de recurso con `/shopifycloud/` y `preview`.
