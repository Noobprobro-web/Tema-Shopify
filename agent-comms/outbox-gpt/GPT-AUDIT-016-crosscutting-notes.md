# GPT-AUDIT-016 — Notas transversales verificadas

ID: GPT-AUDIT-016-CROSS
Estado: Auditoría en curso; evidencia transversal para el dictamen final
Decisión requerida: Gemini/Johandry deben resolver bloqueos comerciales y someter a prueba el estado de instalación de los presets.
Resumen en 5 líneas:
1. Shopify exige pasarela de prueba en cada demo, contenido realista y derechos sobre las imágenes.
2. Las URL de docs y soporte configuradas en `theme_info` devuelven 404.
3. Las tres tiendas tienen Privacy policy, pero los endpoints estándar Refund y Shipping policy devuelven 404.
4. El paquete ZIP incluye doce referencias `shopify://shop_images/` en los templates de presets.
5. El enlace `Powered by Shopify` sí lleva `rel="nofollow"` en los tres homepages observados.
Archivos tocados: solo este documento.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación.
Hallazgos extra fuera de alcance (con parche listo): sin parche; se requiere confirmar instalación en tienda limpia y configuración de políticas.
Verificación (comando, resultado y qué demuestra/qué no): abajo.
Lista de afirmaciones falsables numeradas: C1–C5.

## C1. Requisitos oficiales actuales

Fuente primaria: [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), consultada el 2026-09-30. La sección 20 exige un demo por preset, Client Transfer store, Bogus Gateway o Shopify Payments test mode y otras opciones de checkout deshabilitadas. También exige texto auténtico y derechos de uso de los assets. La sección 21 exige documentación del tema y formulario público de soporte antes del lanzamiento. La sección 18 exige que el estado de instalación del preset refleje la demo; aclara que las imágenes de demo no se transfieren al instalar. La sección 22 recomienda que archivos JSON no contengan recursos específicos del Admin de la demo, como rutas `shopify://`.

## C2. Documentación y soporte

`config/settings_schema.json:7-8` declara `https://ruizdigital.com/themes/sartorial/docs` y `https://ruizdigital.com/themes/sartorial/support`. En Chrome, cada URL devolvió literalmente `No encontrada (404)`. La página Contact de una tienda demo es para compradores y no sustituye el formulario público de soporte para comerciantes del tema.

Comando local y salida relevante:

```text
rg -n 'theme_documentation_url|theme_support_url' config/settings_schema.json
7:    "theme_documentation_url": "https://ruizdigital.com/themes/sartorial/docs",
8:    "theme_support_url": "https://ruizdigital.com/themes/sartorial/support"
```

## C3. Políticas de comprador

En las tres demos, `/policies/privacy-policy` renderizó `Privacy policy`. En las tres, `/policies/refund-policy` y `/policies/shipping-policy` renderizaron la página 404 del tema con `Object not found.`. La política de privacidad de Atelier publica un Gmail personal como contacto; se omite la dirección en este informe. No se encontraron enlaces de estas políticas en el footer de las páginas inspeccionadas; el menú de footer expuso solo `Search`. Esto es un problema de confianza comercial. La ausencia de refund/shipping policy no se etiqueta aquí automáticamente como incumplimiento específico de Theme Store; Shopify debe evaluarse contra su requisito exacto.

## C4. Referencias de imagen propias de la demo en ZIP

Comando y salida literal:

```text
rg -n 'shopify://' listings/sartorial listings/edition listings/archive
listings/archive/templates/index.json:12: "image_desktop": "shopify://shop_images/archive-hero.jpg"
listings/sartorial/templates/index.json:12: "image_desktop": "shopify://shop_images/atelier-hero.jpg"
listings/edition/templates/index.json:12: "image_desktop": "shopify://shop_images/edition-hero.jpg"
```

Una lectura de `Sartorial-1.0.0.zip` con `System.IO.Compression.ZipFile` confirmó que contiene los tres `listings/*/templates/index.json` y que estos contienen 4, 5 y 3 referencias `shopify://shop_images/` respectivamente (Sartorial, Edition, Archive). Los presets cromáticos y tipográficos sí existen en `config/settings_data.json` bajo las claves `Sartorial`, `Edition`, `Archive`. La presencia de las referencias de medios es un **riesgo de paridad al instalar**, no prueba por sí sola que Shopify mostrará una imagen rota. Se necesita instalar el ZIP en una tienda limpia y comparar con las demos.

## C5. Enlace Shopify

En los tres homepages inspeccionados, el DOM mostró el link `Powered by Shopify` con `rel="nofollow"`, como pide Shopify. `document.images` no encontró imágenes con `complete=true`, `naturalWidth=0` y `src` presente en la primera carga de cada home. Eso no cubre imágenes diferidas en scroll ni el resto de páginas.

