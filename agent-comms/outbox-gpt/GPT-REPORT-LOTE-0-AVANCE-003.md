ID: GPT-REPORT-LOTE-0-AVANCE-003
Fecha: 2026-11-02 (America/Caracas)
Estado: AVANCE; Lote 0 abierto. R-D prospectiva pendiente; R-0 no realizada ni aceptada.
Decisión requerida: Ninguna nueva sobre el criterio de contenido C-08. Claude y Antigravity tienen las entradas y acciones indicadas en las secciones 5 y 6.
Resumen en 5 líneas:
1. Johandry resolvió C-08 el 2 de noviembre: retirar o sustituir por contenido neutro las promesas sin respaldo verificable en la propia tienda, sin excepciones ni residuos ocultos.
2. El borrador de handoff está listo para revisión prospectiva de Claude y coordinación de Antigravity; no es directiva ni aceptación.
3. Un lector Terra observó datos Admin de políticas, tarifas, páginas, apps y planes en la tienda de desarrollo, con límites de alcance detallados.
4. Las declaraciones observadas de 14 días y 3 días hábiles no acreditan automáticamente las promesas anteriores de 30 días y 2 días, ni su render actual.
5. No hay fixture con plan utilizable acreditado; R-0 puede registrar esta dependencia abierta con dueño y A-01 no puede cerrarse sin las pruebas correspondientes.
Archivos tocados: este informe nuevo en `agent-comms/outbox-gpt/`; referencias conservadas sin modificación.
Desviaciones (Nivel 1 o Nivel 2): Ninguna implementación o cambio de contrato en este informe.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Preflight local y resultados de lecturas atribuidos a sus ejecutores; este autor no repitió consultas de red.
Lista de afirmaciones falsables numeradas:
1. La decisión C-08 es posterior a AVANCE-002 §7 y resuelve su pregunta; ninguna excepción se mantiene para promesas sin respaldo aplicable verificable en la propia tienda.
2. Las consultas Admin resumidas fueron ejecutadas por el lector Terra, no por el autor de este informe; su alcance no demuestra comportamiento storefront o cumplimiento operativo.
3. Las tarifas consultadas son configuración limitada, no una contradicción universal demostrada de la mención de envío gratis sobre 150.
4. El preflight coincide con HEAD y cuatro cambios esperados; no acredita funcionalidad ni despliegue.
5. R-D y R-0 no están aceptadas y esta ficha no constituye directiva.

# 1. Base y estado documental

En `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f`, el autor ejecutó `git status --short --branch` y `git rev-parse HEAD`:

```text
## HEAD (no branch)
 M assets/base.css
 M assets/product-zoom.js
 M assets/theme.js
 M listings/sartorial/templates/index.json
09f834295074402d9b93aa8ead83a732d78e6608
```

`Get-FileHash -Algorithm SHA256` devolvió:

| Archivo | SHA-256 físico |
| --- | --- |
| `assets/base.css` | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| `assets/theme.js` | `db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c` |
| `assets/product-zoom.js` | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |
| `listings/sartorial/templates/index.json` | `9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768` |

Es una comprobación de identidad local, no de funcionamiento, despliegue o relación con tienda. La comparación previa del ZIP fuente y sus 93 miembros, con 91 iguales por bytes y dos diferencias explicadas, está documentada en `GPT-FICHA-LOTE-0-BASE-002.md` y `GPT-REPORT-LOTE-0-AVANCE-002.md`; no se repitió aquí. La reconstrucción del paquete candidato, las pruebas dirigidas y R-0 permanecen pendientes.

# 2. Decisión C-08 y handoff de revisión

El 2026-11-02 Johandry aprobó C-08 con este criterio: retirar o sustituir por contenido neutro las promesas sin respaldo aplicable verificable en la propia tienda, prefiriendo retirar o sustituir a ocultar; conservar únicamente las acreditadas y el contenido neutro, **sin excepciones**. No dejar la promesa residual en bloques ocultos, defaults, fallbacks, páginas asociadas, CTA o destinos engañosos. Ocultar funcionalmente un bloque realmente vacío es distinto de mantener una promesa oculta. No fabricar otra promesa factual bajo apariencia de texto neutro. La falta de respaldo observado no demuestra falsedad. `GPT-DECISION-LOTE-0-04-C08-001.md` registra íntegramente la decisión y resuelve la pregunta de AVANCE-002 §7.

Para retirar o sustituir lo no acreditado no se necesita solicitar de nuevo respaldo comercial: en la preparación de la futura tarea A, el respaldo aplicable verificable permite conservar únicamente lo que cumpla ese criterio. Esta decisión prepara contenido; no autoriza implementar C-08, escribir en tiendas ni abrir Lote A. El soporte al comerciante continúa separado en C-04-P/G3. A-02 tiene su retirada ya decidida y conserva la autorización técnica previa adicional de Antigravity para Nivel 2.

`GPT-HANDOFF-LOTE-0-RD-R0-001.md` contiene el borrador prospectivo de 0-05-P3 y el checklist de base R-0. Está listo para revisión de Claude y coordinación de Antigravity; **no** es directiva emitida o archivada, aprobación R-D, ni aceptación R-0.

# 3. Evidencia delegada Admin: apps, planes y fixtures

El lector Terra informó consultas de solo lectura el 2026-11-02 en `LINEA NOVE` / `tema-qkqpke0j.myshopify.com`. No efectuó escrituras, autenticación, cambio de conexión, carrito, checkout ni guardó archivos. Sus consultas genéricas Admin se validaron con `OPT_OUT_INSTRUMENTATION=true` y resultado `VALID`, schema `2026-07`; el conector valida al ejecutar. El autor de este informe no repitió la red ni presenta esos resultados como consultas propias.

- `sellingPlanGroups(first: 50)` devolvió cero grupos y `hasNextPage=false`. Según el schema consultado, son los grupos de la aplicación que consulta, no un inventario global de los grupos de otras apps.
- `appInstallations(first: 50) { app { title handle } }` devolvió tres instalaciones y `hasNextPage=false`: `ShopifyClaudeConnectorApp`, `Translate & Adapt` y `ShopifyChatGPTMCPApp`. Ninguna se identificó como app de suscripciones por título o handle; esto no certifica de forma absoluta todas las apps o scopes posibles.
- El avance anterior documentó 50 productos consultados sin grupos a nivel de producto, y el fixture `qa5a-f06-subscription` con requisito de plan a nivel producto y su única variante consultada sin grupos. Con las lecturas disponibles **no hay fixture con plan utilizable acreditado**; no se concluye que sea imposible o que no exista ninguna app fuera de la visibilidad observada.

Una preparación técnica posterior puede plantear compra única y productos con plan opcional y obligatorio, al menos dos planes y variantes pertinentes, y verificar publicación/canal y permisos de prueba. Seleccionar o configurar una app o fixtures requeriría autorización específica para la escritura en tienda si se determina que son necesarios. No se instala ni configura nada aquí, ni se pide autorización genérica en este informe. En R-0 la dependencia puede permanecer abierta con responsable; A-01 no se cierra sin sus pruebas aplicables.

# 4. Evidencia delegada Admin: políticas, páginas y tarifas

## 4.1 Políticas y páginas

Según el lector, `shop.shopPolicies { title url updatedAt body }` devolvió solo la política de privacidad; entre esas políticas no se devolvieron políticas legales de devoluciones o envío. Esto no demuestra ausencia de páginas informativas.

`pages(first: 50)` devolvió siete páginas. Entre las relevantes con `publishedAt` informado figuraban `Support` (`/pages/support`), `FAQ` (`/pages/faq`) y `Shipping & returns` (`/pages/policy`). Estas rutas se derivan de handles y no se probaron en storefront. La consulta dirigida `pages(query: "handle:policy OR handle:faq OR handle:support")` mostró cuerpos Admin vacíos para Support y FAQ; ello no prueba que sus plantillas renderizadas estén vacías.

El cuerpo Admin de Policy no estaba vacío, con `updatedAt` `2026-09-21T21:25:43Z`: declara devoluciones gratuitas en 14 días bajo condiciones de etiquetas/uso y exclusión de made-to-order; envío gratis sobre USD 150; despacho de artículos en stock dentro de tres días hábiles; tiempos de made-to-order según ficha y costes/plazos de destino en checkout. Es una declaración observada en Admin, no una prueba de cumplimiento operativo ni de render actual. Esa fuente no acredita por sí sola las afirmaciones antiguas de 30 días o dos días. Tampoco se sustituyen automáticamente los textos por 14 o tres días sin comprobar aplicabilidad y destino: si no se acredita el texto aplicable, la decisión es preparar retiro o contenido neutro.

## 4.2 Configuración de tarifas consultada

El lector informó `deliveryProfiles(first: 5)` y consultas de zonas, métodos y condiciones: un perfil general, dos zonas, cuatro métodos activos y sin paginación pendiente dentro de los límites consultados.

| Zona observada | Método | Configuración observada |
| --- | --- | --- |
| Domestic | Standard | USD 8 |
| Domestic | Standard | USD 0 con precio total ≥ USD 70 |
| Domestic | Express | USD 15 |
| Europa | Estándar | USD 0 sin condición listada en la consulta |

Que exista una tarifa gratis desde un umbral menor no vuelve necesariamente falsa la afirmación de envío gratis sobre USD 150. No se acredita que 150 sea el único umbral o aplique a todos los mercados o productos, ni cómo opera el indicador de progreso. Las consultas no prueban checkout actual, todos los países, monedas, mercados, recargos o descuentos, ni un regalo de 250. No se hizo una prueba de aplicación, publicación o frontend. Las tres demos dedicadas no fueron observadas ni sincronizadas en esta lectura.

# 5. Matriz de preparación C-08 bajo la decisión ya tomada

La tabla prepara una directiva futura; no cambia código ni contenido. Los respaldos citados se limitan a la tienda y superficies observadas, con su alcance por validar. No se infiere falsedad de los textos que no quedan acreditados.

| Promesa existente / grupo | Respaldo observado | Límite técnico | Tratamiento para preparar la futura tarea A |
| --- | --- | --- | --- |
| Devoluciones gratuitas 30 días y condiciones | Policy Admin declara 14 días y condiciones. | No acredita 30 días, aplicabilidad a cada producto/mercado ni render; no demuestra falsedad. | Retirar o sustituir por neutro lo no acreditado; conservar solo lo aplicable verificado en la propia tienda. No cambiar automáticamente a 14 días. Comprobar fallbacks, página y CTA. |
| Despacho o entrega en dos días, express mundial, white-glove y otros servicios | Policy Admin declara despacho stock dentro de tres días hábiles y made-to-order según ficha; menciona costes/plazos en checkout. | No acredita dos días ni modalidades específicas, su aplicación o render. | Retirar o sustituir lo no respaldado; no convertir automáticamente a tres días. Revisar fallbacks y destinos. |
| Envío gratuito sobre 150 y regalo 250 | Policy Admin declara gratuidad sobre USD 150; el perfil consultado tiene, entre otras, tarifa doméstica gratis desde USD 70 y tarifa europea gratis sin condición listada. | 150 puede seguir siendo verdadero por encima de un umbral menor; alcance por mercado/producto y funcionamiento del progress bar no están acreditados. Ningún dato observado acredita regalo 250. | Verificar aplicabilidad en tienda de cada promesa; conservar solo lo respaldado, retirar o sustituir lo demás y revisar announcement, drawer, enlaces y destinos. |
| Fabricación, materiales, trazabilidad y series | La lectura de políticas y tarifas no aporta respaldo de materiales o fabricación. | No se concluye que no exista evidencia en otra superficie de la tienda. | Preparar retiro o texto neutro para cada afirmación no respaldada; conservar solo si se verifica respaldo aplicable en la propia tienda. |
| Editorial Imprint: especificaciones y ensayos | Ninguna de las políticas o tarifas consultadas acredita especificaciones o ensayos. | Las demos dedicadas no se observaron. | Retirar o sustituir lo no acreditado; conservar contenido neutro y datos con respaldo aplicable en la propia tienda. |
| Archive: procedencia, conservación y registros | Ninguna política o tarifa consultada acredita procedencia o conservación. | Sin revisión de demos dedicadas o piezas. | Retirar o sustituir afirmaciones no acreditadas, revisando recorridos y destinos. |
| Especificaciones automáticas inferidas | La lectura actual no acredita materiales o procesos inferidos. | No se ejecutó A-02 ni se revisó cada producto. | Coordinar con A-02 ya decidido, sin reabrir su retiro; preparar tratamiento de contenido conforme a la regla y respaldos aplicables. |
| Servicios al comprador, horarios y respuesta | Policy y tarifas no acreditan arreglos, reparación, concierge ni plazos de atención. | Cuerpos Admin FAQ/Support vacíos no prueban render vacío. | Retirar o sustituir promesas no acreditadas, revisar CTA/destinos y conservar información neutra aplicable. Soporte al comerciante aparte C-04-P/G3. |

# 6. Estado y siguiente entrada por tarea

| Tarea | Estado y siguiente entrada | Responsable del plan |
| --- | --- | --- |
| 0-01 | Ficha offline y comparación disponibles; faltan reconciliación de BOARD, identidad y reconstrucción demostrables de candidato/paquete y pruebas dirigidas de los tres fixes y copy/caption. | Antigravity coordina y es único escritor de BOARD; GPT apoya integración no trivial; Claude revisa. |
| 0-02 | Siete temas de desarrollo inventariados en AVANCE-002; faltan relación con candidato, preset y observación Home/PLP/PDP, así como demos dedicadas. | Antigravity; inventariar y asignar dueño a dependencias abiertas. |
| 0-03 | No hay fixture con plan utilizable acreditado; falta verificar compra única, plan opcional y obligatorio y su uso real. | Antigravity prepara; GPT define matriz; Johandry autoriza específicamente app/fixtures si fueran necesarios. |
| 0-04 | Criterio C-08 decidido sin excepciones; preparar inventario de respaldo en la propia tienda y retiro/neutro para lo no acreditado. Copy aprobado conserva revisión independiente y observación de caption pendientes. | Johandry decidió contenido; Antigravity obtiene/registra; GPT acota impacto. No hace falta nueva decisión para retirar lo ya autorizado cuando corresponda. |
| 0-05 | Metadatos y rutas inventariados, no aptitud; falta acreditar dependencias efectivas, cobertura, build y acceso por revisor. | GPT inventaría; Antigravity facilita; Claude valida uso independiente. |
| 0-05-P3 | Handoff prospectivo listo; Claude debe revisar R-D y Antigravity coordinar ficha y directiva cerrada. No se ha emitido directiva ni editado scripts. | GPT delega técnica a Sol tras directiva apta y precondiciones; Antigravity aporta ficha; Claude revisa independientemente. P3 sin cambio; otro arnés acreditado es alternativa. |

R-0 es revisión formal de Claude, todavía pendiente. Conforme a V4.1:374, previews y app pueden permanecer como dependencias abiertas con inventario y responsable; bloquean el cierre de las tareas A correspondientes, no necesariamente la aceptación de la base. R-0 aceptado no equivale por sí solo al cierre completo de Lote 0. Para abrir Lote A se requiere además aprobación de Johandry tras R-0; A-02 conserva su autorización técnica adicional de Antigravity para Nivel 2. No se levanta una dependencia o gate frontend/Claude por inferencia.

# 7. Trazabilidad de documentos

El autor verificó mediante `Get-FileHash -Algorithm SHA256`:

| Documento | SHA-256 |
| --- | --- |
| `GPT-DECISION-LOTE-0-04-C08-001.md` | `4603c87f914a4314edd0a230125214c62f630048a4d0410f27d2635dbdb001f7` |
| `GPT-HANDOFF-LOTE-0-RD-R0-001.md` | `2b11eb841c2ca335e5ee221f51954312240e072ac9e9710a9a5b0897f0303dc2` |
| `GPT-REPORT-LOTE-0-AVANCE-002.md` | `91b3f7f6daf0aeac02d5fc255067165ea7b566aa84841d1fc7b82f240ddec43a` |
| `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md` | `917ddff1b9c96f62136d1b1070a0568f1f52f3b7bfa5681a80a1dcfb697d1a3d` |

Los hashes identifican documentos medidos, no prueban sus afirmaciones. Informes previos y plan se conservan, aunque registren propuestas o promesas históricas. El hash de este avance se comunica fuera del documento. No hubo nuevas pruebas funcionales, consultas de red, cambios de código, scripts, plan o tiendas durante la redacción.
