ID: GPT-DOCS-PUBLISH-003
Estado: Publicación confirmada en main y GitHub Pages.
Decisión requerida: Ninguna para publicar.
Resumen en 5 líneas:
- El usuario autorizó commit y publicación con dale.
- main es6194f34d0d6fe087c85e01af44bf9753976caff0.
- El commit modifica exactamente docs.html y support.html.
- Ambos blobs remotos coinciden con docs/merchant local.
- Pages build built para ese commit; ambas URLs HTTP200 y contenido exacto.
Archivos tocados: Este informe solamente durante esta verificación; publicación ya presente al primer check.
Desviaciones: Ninguna; no se creó commit duplicado.
Hallazgos extra fuera de alcance: Ninguno.
Verificación: gh api commits/main; gh api contents; git hash-object; gh api pages/builds/latest; Invoke-WebRequest con comparación de contenido normalizando CRLF.
Lista de afirmaciones falsables numeradas:
1. Commit6194f34d0d6fe087c85e01af44bf9753976caff0: Sync merchant documentation: native CSS motion, mobile layout and support form recovery; files docs.html,support.html.
2. docs blob dea681a85d15e2b3c61fa4256b240c32c5ff799a; support blob9c7c4a3f1b43fdb8ceb273fe22fa9562156d0078. git hash-object de ambos archivos locales produjo los mismos hashes.
3. Pages latest: status built, commit6194f34d0d6fe087c85e01af44bf9753976caff0,error null.
4. https://noobprobro-web.github.io/sartorial-docs/docs.html y support.html devolvieron status200,contentMatches true frente a fuentes locales.
Limitación: No se repitió render de navegador en este turno. Evidencia de320/375/1440 y formulario interceptado en GPT-DOCS-INTEGRATE-002. La igualdad de contenido conecta esas pruebas con lo publicado.
Pendientes manuales: Recepción real en Formspree, Safari móvil, lector de pantalla, POST sin JS y motion None/Subtle/Full/reduced motion en tienda real. No se envió ticket real. No se cierra ninguna fila de ledger.
