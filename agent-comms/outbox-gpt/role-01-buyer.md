ID: GPT-018-ROLE-01
Estado: Auditoría de comprador parcial; transacciones Bogus no completadas.
Decisión requerida: Revalidar pago Bogus manualmente en las tres tiendas; no hay confirmación de órdenes.
Resumen en 5 líneas:
1. Se capturaron las tres tiendas a 1440×1000 y 390×844: home, catálogo, PDP, carrito y checkout móvil.
2. Añadir y abrir checkout funcionó en los tres productos disponibles, con POST add HTTP200.
3. Archive expuso gateway de prueba; campos seguros quedaron skeleton, sin tarjeta introducida ni orden enviada.
4. Fotos únicas y acabados sin foto específica reducen certeza de compra; Archive destaca una pieza agotada.
5. Se descartan como defectos el bloqueo inicial sandbox, selectores fallidos y carrera inicial del harness.
Archivos tocados: agent-comms/outbox-gpt/role-01-buyer.md; harness-GPT-018/role-01-buyer/ (scripts, JSON y capturas); ningún archivo del tema.
Desviaciones (Nivel 1 o Nivel 2): Cobertura parcial explícita: no pago completado, no selector de variante/color recorrido en todas PDP, catálogo abierto por URL directa después de fallar selector Catalog (podría ser botón de submenu; no se declara defecto). No se modifica ledger ni se cierra ninguna fila.
Hallazgos extra fuera de alcance (con parche listo): Ninguno; no hay bug de código confirmado ni parche justificado.
Verificación (comando, resultado y qué demuestra/qué no): Comandos node con loader.mjs para probe.mjs, checkout.mjs atelier/edition/archive, discovery.mjs y resume-bogus.mjs archive. Probe/discovery/resume terminaron exit0; checkout final de cada tienda exit0 y POST add200. Demuestran renderización/navegación y llegada a checkout, NO pago ni conformidad Theme Store completa.
Lista de afirmaciones falsables numeradas:
1. atelier-discovery.json home-images.links contiene EXPLORE LOOKBOOK → /collections/permanent-collection.
2. archive-home.json y archive-pdp.json muestran chaqueta1990 SOLD OUT y destacada en home.
3. edition-products.json conserva exactamente una imagen por producto y acabados de tote Black box calf/Saddle tan/Deep olive.
4. archive-secure-fields.json y archive-bogus-ready.png muestran Test Payment Gateway con instrucciones tarjeta1 aprobación,2 rechazo,3 error.

## Método y alcance real

Leídos contexto, AGENTS/RULES/BOARD, skill playwright-web-testing y helper autorizado. unlock activa pace internamente (pace no exportado); navegador Chrome instalado mediante Playwright del runtime, serial por tienda y reserva exclusiva comunicada al coordinador. La escalación de red fue aceptada después de `ERR_NETWORK_ACCESS_DENIED`. No 429 observado en estas ejecuciones. Navegadores cerrados y reserva liberada.

Evidencias en `harness-GPT-018/role-01-buyer/`. `*-home-desktop.png`, `*-home-mobile.png`, `*-menu-mobile.png`, `*-catalog-desktop.png`, `*-catalog-mobile.png`, `*-pdp-desktop.png`, `*-pdp-mobile.png`; JSON equivalentes contienen URL, texto y controles. Los catálogos son `/collections/all` por navegación directa; móvil menu sí se abrió. No se afirma que se clicaron todas las entradas del menú o CTAs del home. Las screenshots largas pueden mostrar imágenes lazy aún no cargadas fuera viewport; esos espacios NO se diagnostican como imagen rota.

## Hallazgos confirmados para refutación adversarial

| ID | Severidad | Superficie | Observación de comprador y evidencia | Acción exacta propuesta |
|---|---|---|---|---|
| BUY-01 | P1 | Contenido/config catálogo | Edition vende acabados distintos con una única imagen por objeto; tote muestra Black box calf/Saddle tan/Deep olive pero foto negra. `edition-products.json`, `edition-pdp-desktop.png`, URL `/products/structured-tote`. Al elegir un acabado, falta prueba visual de lo que se recibe. | Johandry: Products → producto → añadir fotografía de cada acabado en Media → cada variante → asignar imagen correspondiente. Revalidar que cambiar acabado cambia imagen. No basta renombrar alt ni recolorear una foto sin conservar objeto exacto. |
| BUY-02 | P1 | Contenido catálogo | Serra Coat de $1,890 tiene única foto posterior; PDP móvil muestra espalda y ningún detalle/frente. `atelier-pdp-mobile.png`, `atelier-products.json`, URL `/products/serra-coat`. La descripción promete cierre double-breasted, pero no se puede inspeccionar en esta vista. | Johandry: añadir frente, lateral, cierre, textura y detalle construcción al PDP; incluir medidas y ajuste de tallas36/38/40/42. Es recomendación comercial; no requisito obligatorio universal Shopify. |
| BUY-03 | P2 | Config home Archive | Pieza1990 agotada se mantiene como Spotlight y featured con SOLD OUT y ambas opciones unavailable. `archive-home.json`, `archive-pdp.json`, home y `/products/1990-pinstripe-double-breasted-jacket`. El primer producto que recibe protagonismo no se puede comprar. | Editor Archive → sección featured product y colección Spotlight: elegir trench1999 u otra pieza disponible; mantener piezas vendidas en colección separada de archivo documentado si se desea preservar narrativa. No ocultar todo sold out automáticamente: en vintage puede aportar legitimidad. |
| BUY-04 | P2 | Contenido/enlace home Atelier | CTA «EXPLORE LOOKBOOK» lleva a colección permanente. `atelier-discovery.json` link exacto `/collections/permanent-collection`. Expectativa editorial difiere del destino de grilla de compra. | Editor home → enlace secundario hero: crear/enlazar lookbook auténtico o cambiar CTA a «Explore the permanent collection». |
| BUY-05 | P2 | Copy/config home Atelier | Home featured promete «Complimentary express courier / Dispatched within24h»; PDP Serra Coat dice «Delivery times and costs confirmed at checkout» y returns subject policy. `atelier-home.json`, `atelier-pdp.json`. No contradicción lógica demostrada, pero promesa queda sin precisión consistente entre superficies. | Configurar featured y PDP con la misma promesa verificable; sincronizar coste, regiones, cut-off y política. No afirmar expresamente que shipping gratis está configurado sin admin/checkout probado. |

## Recorrido y transacciones

- Atelier: Serra Coat36, $1,890; añadir→carrito→checkout móvil exitoso (POST200, última captura carrito con producto). Dirección ficticia US10001 completada. Payment no visible en20s y ningún botón visible Continue; Submit era oculto. No se fuerza. `atelier-address-filled.png`, `atelier-payment-stage.json`.
- Edition: Structured Tote Black box calf/Standard, $680; POST200 y checkout. Mismo estado de dirección/shipping sin payment visible al timeout20s. `edition-add-response.json`, `edition-payment-stage.json`, `edition-network-errors.json` (analytics/login ERR_ABORTED, no causalidad probada).
- Archive: trench1999 Restored/FR40US8, $1,690, seleccionado porque chaqueta1990 estaba agotada. POST200 y checkout móvil. `archive-payment-stage.json` sí muestra gateway de prueba y tarjeta1/2/3; reabrir checkout desktop produjo campos de pago skeleton sin input accesible. `archive-secure-fields.json`, `archive-bogus-ready.png`. No tarjeta ni confirmación enviados.

**Órdenes creadas:0. IDs:ninguno.** Autorización de Bogus existente, pero ejecución no lograda. Se clasifica como **verificación pendiente**, no como bug del tema ni configuración de shipping confirmada. El checkout pertenece a plataforma/config tienda; necesitará pasada manual con formulario ya hidratado y gateway test visible. Registrar solo una orden por tienda y verificar etiqueta Test/orderID en admin.

## Descartes y límites

Primer script navegó `/cart` antes finalizar add POST: carrito vacío era carrera de harness; corregido esperando respuesta, no hallazgo. Los errores Catalog (link no hallado) son selector inadecuado no hallazgo. No se comprueba soporte, políticas legales, país/currency multi-market, lector de pantalla ni WCAG desde este rol. No se confirma P0. Antes de submission faltan las tres órdenes de prueba solicitadas, además de resolver/consolidar el resto de roles.

## Salida literal de inventario para refutación

Comando PowerShell: cargar `*-products.json` con ConvertFrom-Json y contar products, images.Count-eq1, variants y variants.featured_image.

```text
atelier products=24 single_image=24 variants=87 variant_image=0
edition products=13 single_image=13 variants=38 variant_image=0
archive products=12 single_image=12 variants=12 variant_image=0
1990 Pinstripe Double-Breasted Jacket available=False
```

Prueba catálogo vigente; no verifica calidad individual de todas fotos. Fuente JSON y captura del tote ya corregida impiden mantener sin revisión la afirmación histórica de «10/13 fotos equivocadas».
