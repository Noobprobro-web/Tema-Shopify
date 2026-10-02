# Reanudación del revisor adversarial GPT-018

Estado: pausa técnica para liberar slot de agente, no auditoría terminada. Autor de esta matriz: agente adversarial_astra, distinto de autores de roles. No se escribió todavía GPT-REPORT-018-multiagent-commercial-audit.md.

## Material ya contrastado

- Matriz: `adversarial/matrix.md`, 29 grupos de IDs de roles1/2/3/5/6/7/8, con intentos de refutación, prioridad y alcance confirmado/no verificado/refutado. Mantener distinción riesgo/defecto.
- Informes1/2/3: `agent-comms/outbox-gpt/role-01-buyer.md`, `role-02-benchmark.md`, `role-03-merch.md`.
- Informes5/6/7/8: cada carpeta `harness-GPT-018/role-0N-*/role-0N-*.md`.
- Borrador ficha: `agent-comms/outbox-gpt/GPT-018-theme-store-listing.md`.
- Imágenes: `demo-assets/{atelier,edition,archive}/`;12 PNG existentes =6 originales+6 derivados. PROVENANCE general y por preset. Dimensiones binarios verificadas con System.Drawing: heroes3200×1800 desde1672×941; tote2000×2500 desde1122×1402. No se inspeccionaron visualmente los6 nuevos assets aún. Quedan variantes de otros12 productos Edition por generar según root.
- Parche único localizado: `role-06-merchant/public-support-urls.diff`; git apply --check ejecutado exit0 sin salida; no aplicado. Source config/settings_schema.json7–8 todavía usa URLs tienda; no afirmar enlace remoto roto ni bundle final idéntico.
- Comandos y salidas independientes preservados en matrix.md. Capturas atelier/edition PDP desktop inspeccionadas: abrigo espalda, tote negro. JSON catálogo recalculado 24/13/12 productos todos1foto; Edition38variantes0featured_image.
- Web oficial revisada independientemente: GSAP Standard License actual comercial sin cargo con restricciones/avisos; Shopify Theme Store requirements. Web docs públicas retornó error de herramienta, no se interpreta caída; rol6 conserva HTML GET200.

## Pendiente exacto

1. Esperar informe rol4 (arte) y rol9 (a11y), que root recupera. Leer sus informes, refutar CADA ID contra evidencia acotada; añadir filas a matrix.md. No inventar lector de pantalla ni Full verificado a partir de reduced-motion emulado. No navegador concurrente demos sin reserva.
2. Revisar visualmente imágenes nuevas y completitud catálogo acabado/archivo, provenance y dimensions. Los6 existentes no completan13productos Edition. Ampliación está autorizada explícitamente por Johandry, conservar originales.
3. Consolidar informe requerido con cabecera EXACTA RULES§1.4: ID / Estado / Decisión requerida / Resumen en5líneas / Archivos tocados / Desviaciones(Nivel1o2) / Hallazgos extra fuera de alcance(con parche listo) / Verificación(comando,resultadoyquédemuestra/quén o) / Lista de afirmaciones falsables numeradas. Consultar RULES para literales correctos (no copiar abreviación de este brief).
4. Nueve secciones por rol y veredicto no listo hasta cobertura pendiente resuelta. Top10 sólo hallazgos confirmados, deduplicar BUY/M03; si menos10 decirlo. Separar código→diff, config→pasos admin, contenido→archivos. No elevar claims no respaldados a falsedad, ni Edition/Editions a infracción.
5. Dar acciones Claude: revisar/aplicar diff cuando corresponda al source definitivo; coordinar defaults (no diff aún porque decisión comercial). Johandry: media por acabado, galerías, destacado Archive, CTA lookbook, validar claims/políticas/nombres, prueba soporte, pagos y ES pendientes.
6. No cerrar ledger. No editar tema/BOARD/datos/push. Ownership sólo adversarial/ y final GPT-REPORT-018. No estás solo: preservar salidas de otros y trabajo Claude.

## Límites críticos a conservar

Checkout:0órdenes, sin IDs, verificación pendiente; usuario sí autorizó Bogus pero automatización no logró completar. No bug demostrado. Fuente reporte1.

Alt omitido por JSON NO significa alt vacío. Históricos10/13imágeneserróneas, Kyoto/Milan y docs privados/mailto único NO vigentes demostrados. Marca Edition/Editions es riesgo; DP-003 local abierto no conflicto probado. Capturas final listing no localizadas aquí no prueba ausencia universal. Instalación vacía source inferida; ZIP no localizado. Correspondencia fuente/runtime no asumir, HEAD60599ab del rol6.

Confirmados fuertes actuales: Edition cobertura visual acabados P1; 49productos con1foto P2; destacado Archive agotado P2 editorial; CTAlookbook a colección P3 acotado; contradicción docsGSAP/dependencies P2; defaults concretos y claim source P2; guía reconstrucción demo insuficiente P2; URLs source discrepantes P2 condicional. Evitar inflar top10 con duplicados o pendientes legales.
