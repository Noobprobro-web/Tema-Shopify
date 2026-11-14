# Cambios temporales en temas rc3 (todos unpublished, via themeFilesUpsert / Admin GraphQL del conector Shopify)

Sin secretos. Los temas publicados y los no-rc3 no se tocaron.

## 1. V01 real: `show_vendor` en Sartorial rc3 (190317920560)
- Archivo `templates/collection.json`, seccion `main` (`main-collection`), setting `show_vendor` (es de seccion, no esta en `config/settings_data.json`; `sections/main-collection.liquid:497`).
- Original: `false` (checksumMd5 `77b0a983e16d64e341a2a9560e725f6d`). Puesto a `true` para `06-v01-real-vendor.json`. Restaurado a `false`.
- Estado final: `show_vendor: false`; el contenido devuelto por la API coincide con el original, pero el checksumMd5 es ahora `3926dd01c2ad7de66a9952e5a301904b` (la API normaliza bytes al reescribir). Equivalente en contenido, no byte a byte.

## 2. B-04: `show_cart_note` en Sartorial rc3 (190317920560)
- El cajon solo pinta la nota con `settings.show_cart_note` (`sections/cart-drawer.liquid:315`), `false` por defecto (`config/settings_schema.json:272-276`), y no aparecia en `config/settings_data.json` del tema.
- Cambio: anadida `"show_cart_note": true` al preset `Sartorial` de `config/settings_data.json` (original: checksumMd5 `b75014e6a46516017aa8c02beee30b2c`, size 6870). Restaurado quitando la linea.
- Estado final: contenido igual al original salvo normalizacion; checksumMd5 `27165b6fccacc127006d9d73a1a92918`, size 4157 (el size original reportado era 6870; no se pudo explicar la diferencia y conviene un `shopify theme pull`/diff antes de usar ese tema para algo mas que pruebas).

## 3. C-08: plantillas alternas anadidas (no sustituyen nada) en los 3 rc3
- `templates/product.c08short.json` y `templates/product.c08long.json` en 190317920560, 190317953328 y 190317986096. Solo se alcanzan con `?view=c08short|c08long`.
- NO SE PUDIERON BORRAR: `themeFilesDelete` esta bloqueado por la politica del conector. Quedan 6 archivos de prueba hasta que alguien los borre en el admin (o un `shopify theme push --nodelete` desde el repo no los quita; hay que borrarlos a mano).
