ID: GPT-019-OFFICIAL-IMPLEMENTATION-REVIEW
Estado: Revisión documental entregada; sin aceptación de submission.
Decisión requerida: Claude elegir árbol final y verificar paquete/demos; Johandry confirmar naming, derechos y contenido.
Resumen en 5 líneas:
1. Este worktree está atrasado: HEAD/master 60599ab; origin/master local 63d202f (02-10-2026).
2. Claude reporta URLs públicas, soporte E2E, políticas, imágenes base y tres pedidos Bogus ya resueltos.
3. GPT-018 no obliga a instalar las 33 fotos ni los tres heroes exactos; son propuestas comerciales.
4. La nueva implementación de movimiento requiere verificación actual; las demos/reportes previos no certifican automáticamente el ZIP.
5. No hay una nueva corrección de código demostrablemente pendiente del top10 sin revisar el árbol actual; sí requisitos de preparación y evidencia abiertos.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna; no se leyeron fuentes del tema.
Hallazgos extra fuera de alcance (con parche listo): checkout de este worktree anterior a cambios de Claude; ningún parche nuevo.
Verificación (comando, resultado y qué demuestra/qué no): git status --short muestra solo entregables GPT sin tracking; git diff --name-status vacío; git rev-parse HEAD/master/origin/master muestra 60599ab/60599ab/63d202f; git log HEAD..origin/master muestra 080402c, 6e62a7c, 63d202f. git show origin/master:agent-comms/outbox-claude/CLAUDE-REPORT-LEAD-001.md y CLAUDE-REPORT-MOTION-002.md son evidencia documental, no observación nueva en las tiendas. No se hizo fetch; origin/master es una referencia local cuya vigencia remota no se certifica.
Lista de afirmaciones falsables numeradas:
1. El parche URL GPT-018 resulta obsoleto frente al reporte de Claude en origin/master; no reaplicarlo a ciegas.
2. Actualización 7 de LEAD-001 registra pedidos #1001 test PAID en las tres tiendas; la frase histórica cero pedidos ya no sirve como estado actual.
3. MOTION-002 retira GSAP del paquete y declara discrepancia con demos y falta de certificación.

## Qué queda de los diez hallazgos
| GPT-018 | Clasificación y estado | Siguiente paso / responsable |
|---|---|---|
| 1. Fotos por acabado Edition | Recomendación comercial/admin. Shopify exige mostrar la imagen asociada al seleccionar variante, no generar una imagen por cada variante. LEAD-001 actualización 7 mantiene ausencia de fotos por color. | Johandry aprobar/matchear las 33 propuestas contra catálogo actual y asociarlas si decide usarlas; Claude verificar funcionalidad con una variante que sí tenga medio. |
| 2. Una foto por producto | Calidad recomendada. No cuota oficial de fotos por producto. LEAD-001 resuelve coherencia de fotos base (13 Edition y 12 Archive); no dice entregar vistas adicionales. | Johandry ampliar galerías selectivamente; Claude demostrar que múltiples medios se ven correctamente. |
| 3. Agotado destacado Archive | Decisión editorial/admin. Permitido mostrar agotados. LEAD-001 actualización 7 explica que el pedido de prueba agotó la chaqueta y solicita reponer stock. | Johandry reponer a 1 si procede o elegir otra pieza; no parche Liquid. |
| 4. Portada ligada a demo/claim traceable | Paridad de instalación y copy seguro sí importan oficialmente; no se prueba aquí defecto vigente. Metadatos muestran templates/index.json y presets modificados después de HEAD. | Claude revisar instalación del ZIP actual y destinos/defaults; Johandry respaldar o retirar claims. No aplicar cambios basados en líneas del viejo GPT-018. |
| 5. Dos URLs antiguas | Ya resuelto según LEAD-001 actualizaciones 1 y 4: schema público, formulario POST 200, ZIP con URLs públicas. 080402c incluye schema/docs. | Claude confirmar en ZIP final; no reaplicar diff antiguo. |
| 6. Contradicción GSAP/dependencias | Docs veraces y consistentes son oficiales. MOTION-002 cambia a CSS nativo; el diagnóstico antiguo debe actualizarse. | Claude verificar que docs públicos describan el motor final y corregir solo contradicciones vigentes. |
| 7. Guía de transición demo→catálogo | Mejora de onboarding. Documentación disponible sí obligatoria; esa sección exacta no. | Claude añadir guía breve si útil y comprobar instalación real. |
| 8. Explore Lookbook→colección | Recomendación de claridad de copy; no se demuestra enlace roto ni incumplimiento funcional. | Johandry ajustar etiqueta/destino si sigue presente. |
| 9. Hero 1376px | Calidad visual oficial, umbral 2752px de GPT no oficial. La dimensión sola no demuestra rechazo. | Johandry elegir imagen clara al tamaño renderizado; heroes entregados opcionales, no detalle nativo adicional por ampliar. |
| 10. BAUHAUS/STOCKMAN | Derechos de marcas/contenido sí exigidos; no infracción legal demostrada. | Johandry acreditar permiso o sustituir esas imágenes; no está obligado a usar nuestros heroes exactos. |

## Requisitos oficiales y límites
Fuente primaria vigente consultada: https://shopify.dev/docs/storefronts/themes/store/requirements
- §7 Product page: imagen asociada debe cambiar al seleccionar variante y todos los medios deben ser visibles. Esto no obliga a poblar cada variante del catálogo con otra fotografía.
- §18 y §20: paridad del estado instalado con demos; un preset debe llevar el nombre del tema; nombres distintivos frente a productos/contenido Shopify y temas existentes. Edition→Imprint figura en metadatos de 080402c. Johandry debe validar los nombres finales; el similarity de Edition/Editions del antiguo informe no constituye conflicto jurídico probado.
- §20: pago de prueba habilitado, otros checkout deshabilitados, derechos apropiados de assets y permiso de propietarios antes de usar nombres/marcas/contenidos. Registrar exactamente un pedido por tienda no es una cuota oficial; es evidencia de QA del proyecto, y Claude ya reporta #1001 ×3.
- §21: documentación y formulario públicos, vinculados desde listing, copy gramatical y consistente con ajustes. B-01 no debe reabrirse solo por el HEAD atrasado.
- §12: teclado, foco y alt obligatorios. Lector real y test de instalación son verificaciones útiles/proyecto; no una feature adicional que instalar. No hay cierre documental nuevo de lector real.
- §3: imágenes claras y apropiadas. No exige 33 imágenes, 2000×2500 ni hero de 2752px. Estos valores son encargo local.
- §8: licencias apropiadas de terceros. GSAP se retiró del paquete según MOTION-002; no pagar licencia ni reinstalarlo por el informe antiguo. Las demos aún lo servían en la última evidencia de ese informe; Claude/Johandry deben cerrar paridad y validar estado vigente.

## Entregables GPT y cierre
Las 33 imágenes, sus manifests y los tres heroes son activos opcionales de demo. No van automáticamente en el ZIP ni quedan aprobados por existir PROVENANCE.md. La ficha GPT-018 es borrador: Johandry debe aprobar naming/precio y Claude cotejar features del paquete; preparar capturas y listing final es trabajo de submission, no código.
No declarar NO LISTO por cero pedidos o URLs sin aplicar: esas razones están superadas documentalmente. Tampoco declarar LISTO: MOTION-002 exige mediciones actuales y paridad de demos; commit 6e62a7c corrige reduced motion y 63d202f corrige print/cierra tres filas, pero metadatos no prueban el cumplimiento integral restante.
Cantidad verificable de cambios de código del GPT-018 oficialmente pendientes: cero confirmados nuevos bajo revisión solo documental. Obligaciones abiertas: validar motor/ZIP/demos actuales, derechos/naming, docs actuales y ficha final. Recomendaciones comerciales abiertas: fotos por acabado y más vistas, selección editorial y copy.
