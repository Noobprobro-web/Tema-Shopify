# GPT-018 — Revisión adversarial independiente

Revisor distinto de autores de roles; fecha 2026-10-01 (America/Caracas). No se abrió otra sesión de demos. Se contrastaron informes con JSON, capturas y búsquedas source actuales; ver comandos abajo. Confirmado significa exactamente el alcance de la columna resultado, nunca certificación universal. P0 ninguno demostrado. Filas del ledger cerradas/modificadas: ninguna.

| IDs originales | Intento de refutación / resultado | Estado final y categoría |
|---|---|---|
| BUY-01; M03-04; BM-01 parcial | Una imagen podría corresponder al acabado inicial: captura tote efectivamente negra. Pero recuento independiente confirma 13 productos Edition, 38 variantes, 0 featured_image y 13 imágenes totales. No pueden mostrar fotos distintas de todos sus acabados. | Confirmado P1 contenido/configuración; no fallo JS. |
| BUY-02; M03-01; BM-04 | El abrigo podría mostrar cierre en otra imagen: JSON sólo contiene una, y captura independiente muestra espalda. Guía de talla podría estar dentro de acordeón cerrado, por lo que ausencia absoluta no demostrada. | Confirmado P2 contenido: vista frontal/detalles no disponibles en catálogo; guía visible insuficiente, ausencia global no verificada. |
| M03-05 | Imágenes adicionales podrían existir fuera del endpoint; sólo se afirma medios del catálogo capturado: 49/49 con una imagen. | Confirmado P2 contenido: galerías de catálogo de una sola vista. No contar doble el abrigo en priorización. |
| BUY-03; M03-02 | Agotados son legítimos en archivo vintage y hay otras 11 piezas comprables. Home/PDP registran el agotado destacado. | Confirmado P2 configuración editorial, no bloqueo técnico ni obligación de ocultar vendidos. |
| BUY-04 | Colección puede servir de lookbook; link de discovery lleva a permanent-collection y autor no recorrió su contenido editorial completo. | Confirmado P3 como desajuste de etiqueta/destino de colección; no enlace roto. |
| BUY-05; C2 | Envío gratis puede coexistir con condiciones, y 24h puede ser un máximo distinto de otro plazo por producto. No políticas actuales cotejadas. | No verificado como contradicción; promesas visibles requieren validación por Johandry. |
| M03-03; C1 | Certificados/maker podrían existir fuera de muestra. Ausencia de documento en captura no prueba falsedad. | No verificado como incumplimiento; brecha de respaldo visible sólo en muestra. |
| BM-01 histórico restante | Filenames actuales y tote negro contradicen reutilizar prueba vieja de 10/13 fotos equivocadas. | Refutado como afirmación vigente; correspondencia visual de 49 fotos no verificada. |
| BM-02 | No GET actual desk-and-study documentado. | No verificado; no repetir 404 histórico. |
| BM-03; L5 | Footer actual incluye links de políticas; destinos no revalidados. | No verificado: no asumir ausencia actual de políticas. |
| BM-05; M1 | HTML público conservado muestra docs y Formspree POST; GET200 del rol6. No prueba entrega de email. | Refutado acceso público ausente / mailto exclusivo; recepción ticket no verificada. |
| C3 | Footer compartido puede ser voz intencionada. Texto repetido se observa en 3 capturas. | Confirmado P3 contenido como oportunidad editorial, no defecto objetivo de funcionamiento. |
| C4 | Locales ES no acreditan contenido publicado. Capturas actuales dicen Milan & Paris. | Refutado Kyoto/Milan vigente; i18n completa no verificada. |
| M2 | URL antigua podría redirigir y ZIP definitivo ser otro. Source7–8 sí usa tienda, diff --check pasa. | Confirmado P2 código: discrepancia source con ayuda pública elegida; rotura runtime no verificada. |
| M3 | Shopify puede normalizar referencias de producto; por ello no afirmar crash. URLs string y claim de trazabilidad están literales. | Confirmado P2 contenido inicial/source, instalación vacía no verificada. Requiere decisión de defaults antes de parche. |
| M4 | Sin framework no equivale a sin dependencias; pero frase227 dice explícitamente no third-party code dependencies y221 declara GSAP. | Confirmado P2 contenido público, contradicción literal. |
| M5 | Info contextual local compensa parte de onboarding. Guía pública explica presets pero no importación de catálogo. | Confirmado P2 contenido como brecha de guía demo→tienda propia, no ausencia total de ayuda. |
| F1 | Atelier es nombre demo y Sartorial preset; pueden coexistir sin infracción. | Confirmado sólo diferencia nominal; no defecto ni rename autorizado. |
| F2 | Capturas finales podrían existir fuera del checkout. Las QA actuales tienen dimensiones distintas. | No verificado como falta global; entrega de capturas de listing queda pendiente. |
| F3 | Borrador no promete métricas ni certificación. | Sin hallazgo nuevo; confirmar capacidades frente al bundle final. |
| L1 | Licencia vigente consultada independientemente permite uso comercial sin cargo; mantiene restricciones y avisos. | Refutado bloqueo por tema de pago. Bundle definitivo/licencia incorporada no verificados. |
| L2 | Edition y Editions no son idénticos; parecido no prueba rechazo. | Confirmado P2 riesgo nominal; ninguna infracción demostrada. |
| L3 | Dictamen podría existir fuera del repo. DP-00318 sigue abierto. | Confirmado P2 brecha documental local; no conflicto de marca demostrado. |
| L4 | Permiso podría existir; IA no implica infracción ni exclusividad. | No verificado legalmente; provenance/inspección de nuevos assets pendiente rol4. |
| Checkout | 0 órdenes no prueba fallo tema; automatización no logró campos seguros. | No verificado: tres pagos Bogus pendientes. |
| Alt text | Endpoint omite atributo; fallback local y botones con nombre impiden inferir ausencia por JSON. | Refutado alt vacío universal; cobertura accesible completa no verificada. |

## Evidencia independiente reproducida

`git apply --check agent-comms/outbox-gpt/harness-GPT-018/role-06-merchant/public-support-urls.diff` → exit0, sin salida. No aplicado.

`rg -n 'theme_documentation_url|theme_support_url' config/settings_schema.json` → 2 claves, en líneas 7–8; ambas URLs apuntan a `sartorial-atelier.myshopify.com` y ambas cambian en `role-06-merchant/public-support-urls.diff`. La cifra “7/8” fue una lectura incorrecta de los números de línea 7–8; no es un recuento de URLs. `git apply --check agent-comms/outbox-gpt/harness-GPT-018/role-06-merchant/public-support-urls.diff` → exit 0, sin salida; diff no aplicado.

`rg -n 'third-party|GSAP|ScrollTrigger' .../role-06-merchant/public-docs.html` → 221 Full loads GSAP and ScrollTrigger; 227 no third-party code dependencies.

`rg -n 'DP-003' docs/decisions-pending.md` → 18, verificación formal pendiente. `rg -n 'the-autumn-series|traceable|oversized-alpaca-knit' templates/index.json` → 26/165 destinos,114 claim,181 producto específico.

PowerShell ConvertFrom-Json sobre role-01-buyer/*-products.json, conteo independiente:
```
atelier products=24 single_image=24 variants=87 variant_image=0
edition products=13 single_image=13 variants=38 variant_image=0
archive products=12 single_image=12 variants=12 variant_image=0
```

`view_image` independiente de role-01-buyer/atelier-pdp-desktop.png y edition-pdp-desktop.png: abrigo de espalda; tote negro. Cuadros lazy fuera viewport no se califican rotos.

Fuentes primarias consultadas independientemente: https://gsap.com/community/standard-license/ (uso comercial/avisos/restricción constructor visual); https://shopify.dev/docs/storefronts/themes/store/requirements (pruebas, nombres, demos). GET web a docs públicas devolvió error de herramienta; no refuta HTML200 conservado ni demuestra caída.

## Pendiente al escribir esta matriz

Roles4 y9 en recuperación. Incorporar revisión de sus entregas antes de cerrar consolidado. Nunca declarar lector de pantalla probado a partir de árbol accesible o teclado automatizado.

Verificación adicional independiente: `Add-Type -AssemblyName System.Drawing; Get-ChildItem demo-assets -Recurse -Filter *.png` seguido de `Image::FromFile` confirmó 12 PNG: tres heroes nativos1672×941 y finales3200×1800; tres tote nativos1122×1402 y finales2000×2500. Los seis originales están conservados. `demo-assets/PROVENANCE.md:7` declara ampliación autorizada y no detalle nativo; `:9` limita correspondencia física y tamaño. Esto acredita dimensiones, no revisión visual completa ni entrega de los otros12 productos Edition.

## Addendum competitivo actual

Los candidatos históricos de BM no deben publicarse como lista vigente. El paquete actual ofrece una mejora visible del tote y catálogos utilizables hasta checkout; la brecha premium comprobable está en cobertura de vistas y acabados (BUY-01/M03-05), y en el protagonismo del agotado Archive (BUY-03), no en una ausencia general de swatches, galerías o sticky cart. Comparación con las fichas oficiales de Prestige/Be Yours/Impact/Symmetry sólo acredita promesas y precios publicados registrados por rol2; no prueba superioridad de conversión ni experiencia medida de competidores. Los tres presets requieren demostrar capacidad existente con catálogo y contenido coherentes antes de invertir en funciones nuevas.
