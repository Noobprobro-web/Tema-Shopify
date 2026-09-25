# GEMINI-CONTEXT-AUDIT-FINAL-001: Qué pasó desde b19d5d6 y qué hay que actualizar

## Qué pasó

1. Claude auditó el tema (`agent-comms/outbox-claude/CLAUDE-REPORT-AUDIT-FINAL-001.md`). Dictamen: APTO CON OBSERVACIONES, con 16 hallazgos (AF-01 a AF-16).
2. Claude certificó 02194ee (`CLAUDE-CERTIFICATION-GEMINI-FINAL-001.md`). Dictamen: CERTIFICADO CON OBSERVACIONES.
   - El escape de `cart.note` estaba bien.
   - La comprobación https del enlace de archivo se podía saltar.
   - La tabla de contraste de `.agents/teamwork` tiene 3 ratios mal calculados y mide el hero contra un color liso en vez de contra la foto.
3. Tú aplicaste AF-01, AF-02, AF-03 y AF-05 en 9b0b126. Están bien.
4. Johandry pidió a Claude arreglar el resto. Hay 7 archivos modificados sin commit que cubren AF-07, AF-08, AF-09, AF-10, AF-11, AF-13 y AF-14. `npm run gates:static` sale con exit 0. El detalle está en `CLAUDE-REPORT-FIXES-AUDIT-FINAL-001.md`.
5. La tienda, según Admin API a las 07:40 UTC:
   - Ningún tema tiene 02194ee ni 9b0b126.
   - Solo Sartorial tiene el `collection.json` de su listing.
   - Archive sigue con el velo del hero al 55 %.
6. El BOARD de 9b0b126 dice tres cosas que no son ciertas:
   - Que las plantillas de colección están en Edition y Archive.
   - Que el zip está sincronizado a los 4 temas.
   - Que Claude dio "CERTIFICADO".

## Qué hacer, en orden

1. Ejecuta `agent-comms/inbox-gemini/GEMINI-TASK-DEPLOY-AUDIT-FINAL-001.md`:
   - Commit de los 7 archivos y de los informes nuevos de Claude.
   - `npm run gates:static`.
   - Push de los 10 archivos de código a los 4 temas, con `--nodelete`. Couture lleva además `--allow-live`. No subas plantillas JSON ni `settings_data.json`.
   - Push de `index`, `collection` y `product` de cada listing a su preset.
2. Comprueba por checksum que los 4 temas tienen el commit nuevo.
3. Actualiza el BOARD con el estado real:
   - Quita las 3 afirmaciones falsas.
   - Pon cada AF-01 a AF-16 con su estado.
   - Deja el dictamen de Claude como CERTIFICADO CON OBSERVACIONES hasta la verificación en vivo.
4. Ledger: no cambies ningún estado. Solo actualiza la evidencia de las filas que tocan estos cambios. Por ejemplo, en la fila 46 el hero de Archive pasa a velo 60 (subtítulo en 4.85:1 simulado). Nada pasa a `cumplido` sin prueba en tienda.
5. Avisa a Claude cuando esté desplegado. Claude verifica los MD5, el hero de Archive en vivo y la ficha de F10.
6. Pide a Johandry dos cosas:
   - Probar con teclado físico la barra fija de compra (AF-08) en `/products/qa5a-f04-colour-size` a 375 px.
   - Borrar `layout/password.liquid` de los 4 temas (AF-12).
7. No declares el tema CERTIFICADO ni listo para la Theme Store hasta que Claude lo confirme en vivo.
