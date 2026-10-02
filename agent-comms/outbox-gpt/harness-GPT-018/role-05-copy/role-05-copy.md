ID: GPT-018-ROLE-05
Estado: Pasada independiente completada sobre capturas textuales buyer y source; pendiente refutación cruzada.
Decisión requerida: Johandry confirmar políticas y procedencia antes de conservar claims; adoptar copy EN/ES adjunto según hechos.
Resumen en 5 líneas:
1. Archive conserva promesas de procedencia y conservación muy específicas sin respaldo en este paquete de auditoría.
2. El antiguo Kyoto ya no aparece en home runtime: ahora Milan & Paris; no repetir contradicción antigua.
3. PDP muestra título de devoluciones gratuitas junto a copy condicionado a políticas; validar gratuidad antes de publicar.
4. Se entregan once sustituciones EN/ES con destino de admin y condiciones de uso.
5. Locales ES existen; no se certifica traducción publicada ni cobertura total sin recorrido español.
Archivos tocados: role-05-copy/ con informe, seis extracciones TXT y copy-corrections-en-es.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada al tema.
Hallazgos extra fuera de alcance (con parche listo): ninguno; sin .diff de código necesario.
Verificación (comando, resultado y qué demuestra/qué no): JSON buyer → ConvertFrom-Json → propiedad text a TXT; rg sobre TXT/source; no navegación nueva.
Lista de afirmaciones falsables numeradas: C1–C4.

Fecha 2026-10-01. Contexto RULES/brief leído en pasada anterior y vigente. Esta pasada usa evidencia ya capturada por rol1, no observaciones propias de navegador. Cada TXT procede del JSON homónimo de ../role-01-buyer/; URL y HTTP status se conservan en el JSON. Todos los source son snapshot local; no se equiparan a contenido publicado.

## C1 — P2 contenido: especificidad documental de Archive supera evidencia disponible

En `archive-home.txt:31` se declara tradición desde 1987; `:40` certificado museístico numerado; `:44` conservación museo. JSON fuente `archive-home.json:2–4`, URL https://sartorial-archive.myshopify.com/. Texto requiere comprobar hechos, no inferirlos por apariencia. No califico fraude ni historia falsa: no se inspeccionaron certificados/documentación externa. Refutación: podrían existir; aportarlos cerraría la incertidumbre. Candidato confirmado sólo como claims visibles que requieren respaldo, no infracción probada.

Corrección administrable: C4–C8 del archivo adjunto sustituyen por relato editorial neutral si no hay respaldo; Johandry conserva hechos acreditados. No parche de tema porque son contenido comercial por tienda.

## C2 — P2 contenido/config: coherencia de promesas de envío y devolución

`atelier-pdp.txt:27` y `archive-pdp.txt:30` dicen returns subject to store policy; `:32/:35` titulan SHIPPING & COMPLIMENTARY RETURNS. En las tres muestras aparece anuncio gratis sobre $150 (`*-pdp.txt:3`). Esto no es contradicción lógica automática: la política puede ofrecer gratuidad condicionada. Hallazgo es verificación pendiente de promesa y ambigüedad comercial, no incumplimiento confirmado. Refutación requerida: cotejar políticas actuales y checkout, sin usar defaults locales como prueba.

Source separado: `listings/sartorial/templates/index.json:88` promete courier express en 24h, mientras `listings/sartorial/templates/product.json:68` dice tres días. Diferencia podría ser contexto/plazos máximos; debe explicarse por producto si se publica. No afirmar vigente en runtime: PDP buyer usa texto neutral delivery times and costs at checkout.

Copy C1–C3 propone lenguaje compatible con políticas verificadas. No hardcodear cifras nuevas ni beneficios inexistentes.

Muestra runtime adicional confirmada: `edition-pdp.txt:27,29` promete courier mundial/despacho en 24h y devoluciones gratuitas en 30 días. `atelier-home.txt:78` también promete express/24h. Estas promesas sí están publicadas en las capturas buyer; deben cotejarse con políticas capturadas por el rol transaccional. La diferencia respecto de defaults locales de 14 días no prueba contradicción remota, porque no se abrió el acordeón ni se leyó aún la política remota desde este rol.

## C3 — P3 editorial: voz repetida entre presets

Extracciones muestran fórmula `New objects, material studies and private previews, sent with restraint.` en footer común. Archive home además tiene newsletter de novedades antes del mismo footer. Es elección editorial, no bug. La repetición reduce distinción entre sastrería/objetos/archivo: propuesta C9–C11 y elegir una invitación principal por página. Refutación: footer compartido puede buscar consistencia de familia; prioridad P3, no bloqueo.

## C4 — i18n y correcciones históricas descartadas

`locales/es.json` contiene traducciones de UI (por ejemplo líneas 194–208 formulario de contacto) y `locales/en.default.json:86` ya dice sentence case `Complimentary additions`: no repetir defecto antiguo. `archive-home.txt:45,49` dice MILAN & PARIS, no Kyoto; no afirmar contradicción Kyoto/Milan actual. La muestra Atelier Serra Coat está en inglés coherente (atelier-pdp.txt descripción); no extrapolar antiguo 24/24 en español a versión actual.

No recorrido `/es` ni selector de idioma ejecutado; existencia de locales no demuestra traducción de contenido del comerciante. Entrega EN/ES adjunta es propuesta, no localización desplegada. No encontré falta ortográfica crítica demostrada en estas seis muestras; no inventar puntuación global ni cobertura 100%.

## Límites y acciones

No P0/P1 lingüístico confirmado. Claims sin respaldo y promesas pendientes requieren revisor/propietario; mantener separadas de errores objetivos. Archivo EN/ES ofrece reemplazos utilizables sin modificar repositorio comercial ni datos. No se cierran filas de ledger. Para cierre i18n: Johandry publicar traducciones del contenido y revisor recorrer home/PDP/carrito/políticas EN y ES en ambas vistas.
