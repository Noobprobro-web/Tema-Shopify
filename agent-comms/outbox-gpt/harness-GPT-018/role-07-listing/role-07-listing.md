ID: GPT-018-ROLE-07
Estado: Borrador de ficha y plan de capturas entregados; sin submission.
Decisión requerida: Johandry aprobar nombre/precio y producir capturas finales; Claude verificar paridad de features con paquete final.
Resumen en 5 líneas:
1. Borrador EN diferenciado para Atelier/Sartorial, Edition y Archive.
2. Taglines y highlights verificables por conteo local.
3. Lista de capacidades separa source y runtime.
4. Faltan capturas oficiales en tamaños exactos; QA existente no se presenta como entrega visual final.
5. Evita claims de performance, conversiones, accesibilidad absoluta y fotografías incluidas.
Archivos tocados: GPT-018-theme-store-listing.md, role-07-listing/lengths.txt y este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): strings .Length → lengths.txt; fuentes oficiales consultadas; no ficha publicada.
Lista de afirmaciones falsables numeradas: F1–F3.

F1 P2 contenido: nombre demo Atelier no es nombre del preset source Sartorial (`rg -n ... config/settings_data.json` → 80 Sartorial,100 Edition,120 Archive). Borrador conserva ambos sin renombrar. Refutación: ZIP final podría diferir; no localizado en checkout.

F2 P2 entrega de contenido: capturas QA registradas en runtime-partial.md 1440×1000 y 390×844 requieren rehacerse para dimensiones oficiales indicadas en ficha. No se afirma ausencia de capturas finales fuera de checkout. Dueño Johandry/GPT arte; no diff de código.

F3 Sin bloqueo nuevo: propuesta de copy comprobada por conteo; no acredita capacidades de bundle remoto no inspeccionado. Zoom/search/sticky se dejan condicionadas a confirmación. Edition/Editions remite a rol8, no duplica ni eleva severidad. Claims legales y comerciales de demo no se trasladan a ficha del tema.

La skill shopify-dev fue inspeccionada para pertinencia: se orienta a búsquedas técnicas de APIs; se usó documentación oficial web directa para esta tarea editorial de listing. No se ejecutó telemetría de prompt ni scripts del skill.

Fuente actual: https://shopify.dev/docs/storefronts/themes/store/review-process/listings . Checklist y límites normativos están concentrados en el borrador para evitar divergencia. Ninguna fila ledger cerrada; sin stores/browser/submissions ni cambios de tema.
