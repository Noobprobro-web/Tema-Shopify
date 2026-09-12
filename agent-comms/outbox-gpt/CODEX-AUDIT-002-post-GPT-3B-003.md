# Auditoria posterior a GPT-3B-003

```text
ID: CODEX-AUDIT-002
Estado: REVISION COMPLETADA; REQUIERE DECISION DE GEMINI
Decision requerida: emitir un hotfix cerrado antes de continuar o incorporarlo antes del cierre de Phase 3B.
Commit auditado: f8815f2285b0809e9b5380f6a1191a371e80a4ee
```

## Resumen en 5 lineas

1. La entrega GPT-3B-003 esta completa en Git, sincronizada con `origin/master` y no presenta truncamiento por limite de tokens.
2. `node --check`, parseo JSON/schemas, auditoria de traducciones, Theme Check y smoke responsive vuelven a pasar.
3. Lookbook, compra multiple, Cart Drawer, Promotion Tiles y conmutador de grilla funcionan en la fixture de navegador.
4. Se detectaron tres bordes corregibles en el sprint: selling plans a nivel de variante, catalogos de mas de 250 variantes y nombres accesibles incorrectos en tablet.
5. La auditoria global tambien identifica requisitos obligatorios de Theme Store que deben entrar en un sprint de cumplimiento antes de submission.

## Hallazgos del sprint

### P1 - Selling plans evaluados a nivel de producto

`sections/complete-the-look.liquid` comprueba `product.requires_selling_plan`. Shopify documenta que esa propiedad solo es verdadera cuando todas las variantes requieren un plan. Una variante concreta puede tener `variant.requires_selling_plan == true` mientras el producto devuelve `false`; hoy esa opcion queda habilitada y el POST se envia sin `selling_plan`, por lo que puede fallar.

Correccion recomendada: determinar comprabilidad por variante, deshabilitar las variantes que requieren plan y mantener el enlace al PDP para completar esa compra.

### P1 - Selector limitado por `product.variants`

El bundle itera `bundle_product.variants`. Shopify limita esa coleccion Liquid a 250 elementos y admite productos de hasta 2.048 variantes. En catalogos grandes el selector queda incompleto y la iteracion perjudica TTFB.

Correccion recomendada: disenar una ruta compatible con high-variant products mediante `options_with_values` y renderizado granular, o aplicar un fallback explicito al PDP cuando `variants_count` supere el limite soportado por el bundle.

### P2 - Etiqueta accesible de grilla incorrecta en tablet

Entre 48rem y 61.99rem, CSS representa 2 columnas en modo compacto y 3 en modo denso, pero los botones exponen al lector de pantalla las etiquetas mobile de 1 y 2 columnas. `aria-pressed` es correcto; el nombre de la accion no coincide con el resultado visual.

Correccion recomendada: anadir etiquetas tablet localizadas para 2/3 columnas o usar nombres independientes del numero, como vista compacta y vista densa.

### P3 - Fallback sin JavaScript parcialmente interactivo

El CTA se oculta sin JavaScript, pero checkboxes y selectores permanecen visibles aunque no pueden ejecutar la compra. No bloquea la Theme Store actual, pero contradice la promesa de fallback limpio del informe.

Correccion recomendada: ocultar o desactivar visualmente esos controles bajo `.no-js` y priorizar los enlaces individuales al PDP.

## Brechas globales antes de submission

La aceptacion GEMINI-010 valida el alcance cerrado de GPT-3B-003, no la conformidad final del tema. Antes de Phase 4 deben quedar tareas explicitas para:

- Selector nativo de selling plans en PDP.
- Shop Pay Installments mediante `form | payment_terms`.
- Pickup availability y product recommendations.
- Swatches nativos mediante `product_option_value.swatch.image` y `.swatch.color`.
- Campos de destinatario para productos gift card.
- Salida de `collection.image` en la plantilla de coleccion.
- Datos estructurados de producto para resultados enriquecidos.
- Compatibilidad high-variant en el PDP, que tambien serializa `product.variants`.

Predictive Search y las ocho plantillas con placeholder ya estan asignadas a GPT-3B-004.

## Evidencia repetida

```text
node --check assets/theme.js
PASS

JSON.parse
18 archivos JSON validos

Section schemas
16 schemas validos

Translation key audit
22 archivos Liquid; todas las claves estaticas resuelven

npx shopify theme check
44 archivos inspeccionados; 0 ofensas

Playwright smoke
375, 390 reduced-motion, 768, 1024 y 1440 px: 0 page errors,
0 overflow horizontal, 0 targets auditados menores de 44px; interacciones PASS

Git
HEAD == origin/master == f8815f2; working tree limpio antes de crear este informe
```

## Fuentes oficiales contrastadas

- https://shopify.dev/docs/api/liquid/objects/product
- https://shopify.dev/docs/api/liquid/objects/variant
- https://shopify.dev/docs/api/ajax/reference/cart
- https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products
- https://shopify.dev/docs/storefronts/themes/store/requirements

No se modifico codigo de produccion ni se realizo commit o push.
