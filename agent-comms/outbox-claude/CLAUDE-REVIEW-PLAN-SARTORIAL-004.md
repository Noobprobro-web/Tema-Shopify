ID: CLAUDE-REVIEW-PLAN-SARTORIAL-004
Estado: Revisión documental de la V4 del plan Sartorial terminada. Veredicto: aprobable con ajustes menores. Ningún ajuste bloquea la aprobación.
Decisión requerida: Johandry puede aprobar la V4. Los ajustes de §6 son de redacción y pueden corregirse en una V4.1 o en la primera R-D, a su elección. Debe saber que A-02 queda sujeta además a autorización técnica de Gemini (Antigravity) en su R-D, por RULES §3.5.
Resumen en 5 líneas:
1. Las 24 instrucciones de CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001 están aplicadas; dos con matiz (M4 por el añadido de Gemini y TT-56 por su ubicación).
2. El diff V3 a V4 no elimina tareas, no cambia severidades ni mueve filas; hay cuatro cambios fuera de instrucción, todos menores.
3. V1, V2 y V3 están intactas: sus sha256 coinciden con los de §1.1 y con registros independientes previos.
4. El documento no contiene contraseñas, cookies ni tokens (conteos a cero; el literal de contraseña de los gate5 aparece 0 veces).
5. Las reglas de gobierno siguen claras y las dependencias nuevas no forman ciclos.
Archivos tocados: agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-004.md (único archivo nuevo).
Desviaciones (Nivel 1 o Nivel 2): Ninguna. Revisión de solo lectura; no se tocó el plan, el tema, git, .secrets ni tiendas.
Hallazgos extra fuera de alcance (sin parche): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): sha256sum de V1 a V4 y de las fuentes; diff V3 V4 (53 bloques, 162 líneas cambiadas, V3 517 líneas y V4 567); grep -c de localizadores antiguos y de patrones de secretos; conteo del literal de contraseña de la línea 5 de ambos gate5 contra V3 y V4 sin imprimirlo. Demuestra integridad documental y trazabilidad; no demuestra que los localizadores de código sigan vigentes en la base que fije 0-01.
Lista de afirmaciones falsables numeradas:
1. sha256 de V3 = ff08f71d318ea7d07d0ecb9c75d7d184fde5ceb0e257b4ba9d120cd0ad85d7fc, igual al de §1.1 de V4 y al de CLAUDE-REVIEW-PLAN-SARTORIAL-003.
2. grep -c en V4 devuelve 0 para `snippets/product-recommendations`, `support.html:254–255`, `2384–2435`, `2990–3030`, `2973–2983`, `circa: ` y `con parche listo`.
3. Ninguna fila de tarea de V3 desaparece en V4 y ninguna prioridad P1, P2 o P3 cambia.
4. El literal de contraseña de `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5` del checkout local aparece 0 veces en V4.

---

# Revisión de la V4 del plan de implementación Sartorial

Objeto: `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.md` (567 líneas, 108.183 bytes, sha256 `03494a8c0d2605931702f00ce694a1f72c3c914822c64a4cdcc9a4dee73971bd`).
Contrastado con: instrucciones V4 (`9ffd1387...`), V3 (`ff08f71d...`), RULES.md, AGENTS.md y las dos revisiones fuente. Las líneas citadas son de la V4.

## 1. Las 24 instrucciones

| # | Instrucción | Estado | Dónde en V4 |
| --- | --- | --- | --- |
| 1 | M1, decisión de Johandry del 2026-10-30 citada en las siete ubicaciones; quitar "decidido en esta planificación" | Aplicada | Cabecera L4; §1 L55; §1.2 L82; §9 L434 y L438; §11.1 C3 L484; §11.4 C002-3 L525; copy C-04-N L286. También en 0-04 L164, A-02 L187 y C-04-N L277. La frase eliminada aparece 0 veces. |
| 2 | K5, "sin parche" | Aplicada | Cabecera L13. Ver §2.b: además se borró una frase. |
| 3 | GEMINI-AUDIT-COMPARATIVA-001 en fuentes y sha256 de las tres fuentes nuevas | Aplicada | Fuente L49 con el alcance pedido; hashes L65 a L67 (más V3 L63 e instrucción L64). Los cinco coinciden con sha256sum. |
| 4 | M2, confirmación o repetición de la rotación D1 en §9; ningún agente prueba credenciales antiguas | Aplicada | §9 L427. |
| 5 | M2, una sola edición de los dos gate5 tras 0-01 y M2; quitar el literal no lo borra del historial | Aplicada | 0-05-P3 L166; CMP-02 L145; CMP-01 L139. |
| 6 | §3.1, `b45e913` previo a la reescritura y fuera del linaje de `c4dca23` y `09f8342` | Aplicada | §3.1 L124, con remisión a CMP-01. |
| 7 | M3, `sections/product-recommendations.liquid:6-12,68-71` | Aplicada | L230. Ruta antigua: 0 apariciones. |
| 8 | M4, A-02 Nivel 2 declarado en R-D; línea en `release-notes.md` | Aplicada con añadido | A-02 L187 y R-D L370; C-04-R L279; R-C L373. La V4 no dice "autorizado por la decisión de M1": separa la decisión de negocio y exige además autorización técnica previa de Gemini (RULES §3.5). Ver §2.a. |
| 9 | M5, IDs GEM en §3.3, §4.3 y §11.5 | Aplicada | 0-05-P3 L166; C-04-P3 L275; C-04-N-P3 L278; §11.5 L536 a L538, junto a sus números de línea. |
| 10 | K1, `support.html:254` | Aplicada | L277. `:254–255`: 0 apariciones. |
| 11 | K2, claves reales de Archive | Aplicada | L228 (PDP `:75-78`, home `:108-111`, claim en `provenance_notes` de `:111`); L230 distingue `show_unique_piece`. Claves antiguas: 0. |
| 12 | K3, efectos de `circa_year` y `gsm`; R-A con textil y no textil | Aplicada | A-02 L234; R-A L371. |
| 13 | K4, cadenas conservadas; R-C no las reabre; "Haute Couture" a 0-04 | Aplicada | Copy L286; 0-04 L164; §9 L429; R-C L373. |
| 14 | K6, rangos exactos y revalidación por función | Aplicada | B-04 L250 y L255 (comentario `:2971-2972`); C002-1 L523. Rangos antiguos: 0. |
| 15 | CMP-01 | Aplicada | §3.1 L137 a L141; 0-01 L161; R-0 L369; base §3.2 L135. ID GEM-G-001, P1 de repositorio, cuatro archivos, ocho refs, `44a8948`, prohibición de publicar refs, BOARD:16 y comprobación por conteo. |
| 16 | CMP-02 | Aplicada | L143 a L145; 0-05-P3 L166. P3, cuatro SHAs, `node --check` y fallo antes de red sin ejecutar contra tiendas. |
| 17 | TT-56 dentro de E-01 como P3 diferido | Aplicada con matiz | Párrafo en §4.5 L325 (bajo la fila E-01, no dentro de ella) y §9 L430. Contenido completo; ver §5. |
| 18 a 21 | No incorporar GEM-B-001/002, kit de listings, TT de Atelier, SUP-001 a 003 | Aplicadas | §11.6 L559. Ninguno aparece como tarea. |
| 22 | Sin cambios de severidad ni de fila | Aplicada | §11.6 L559; el diff lo confirma (§2). |
| 23 | §11.6 con M1 a M5, K1 a K6, CMP-01, CMP-02 y TT-56 | Aplicada | L540 a L557, 14 filas. |
| 24 | Cabecera RULES completa y sin secretos | Aplicada | L1 a L21 tiene los nueve campos de RULES §1.4 más Versión. Sin secretos (§4). Matiz en §2.c. |

## 2. Diff V3 a V4

53 bloques y 162 líneas cambiadas. Todos los cambios corresponden a las instrucciones o a la actualización natural de V3 a V4, salvo estos:

a) Autorización técnica de Gemini para A-02 (L4, L55, L82, L187, L370, §9 L428 y L434, L484, L525, L567). No estaba en la instrucción, que decía "autorizado por la decisión de M1". Es correcto según RULES §3.5 y AGENTS.md:63 ("Autorizar Nivel 2 técnico por escrito"), así que no lo considero error. Sugerencia: escribir "Gemini (Antigravity)", porque el resto del plan llama Antigravity a ese agente y un lector puede creer que es un tercero.

b) Cabecera "Hallazgos extra" (L13): además de K5, se borró la frase sobre los tres P3 incorporados por orden de Johandry. La información sigue en §11.5; es una pérdida menor.

c) Cabecera "Verificación" (L14) y §12 (L561 a L567): se sustituyó el registro de comandos y salidas de V3 por una descripción sin comandos. RULES §1.3 pide comando y salida literal. No afecta el contenido del plan; mis comprobaciones de §3 y §4 cubren ese hueco.

d) Modelo (§2 L95): pasa de "GPT-6.1 Sol ultra" a "GPT-6.1 Terra ultra" como escritor de V4 y elimina la regla de mantener Sol en futuras asignaciones. Pero 0-05-P3 (L166) y §11.5 (L538) siguen diciendo "delega a Sol". Inconsistencia menor.

No hay tareas eliminadas, severidades cambiadas ni filas movidas. Los añadidos (L45 a L49, L63 a L67, L124, L137 a L145, L234, L325, L426 a L430, L540 a L559) son todos trazables a instrucciones.

Restos de V3 sin actualizar: fila Claude002 en fuentes (L40, "la decisión de esta V3"), afirmación falsable 1 (L16, "V1, V2 y las revisiones", sin V3) y §1.1 L59 (dice Get-FileHash mientras L76 dice contraste delegado). Los hashes son correctos de todos modos.

## 3. Integridad de V1, V2 y V3

| Archivo | sha256 medido | §1.1 de V4 | Registro independiente |
| --- | --- | --- | --- |
| V1 (18.806 B, mtime 2026-10-29 23:18) | `d6942f9a5d5513a334e6a688bf3625da83c5a99330097e971be316995cedcb66` | Coincide | Coincide con V3 |
| V2 (66.762 B, mtime 2026-10-29 23:52) | `3f89faf18494aea3dea1cc06ef4ce2da4cccc2d5f162e24a8f83ab043176499b` | Coincide | Coincide con V3 |
| V3 (95.669 B, mtime 2026-10-30 04:29) | `ff08f71d318ea7d07d0ecb9c75d7d184fde5ceb0e257b4ba9d120cd0ad85d7fc` | Coincide | Coincide con CLAUDE-REVIEW-PLAN-SARTORIAL-003 |

Los mtimes son anteriores a la V4 (2026-10-30 05:06). También coinciden en §1.1 los hashes de las revisiones 001, 002, ANTIGRAVITY-AUDIT-001, GEMINI-AUDIT-MASTER-001, las dos comparativas y la instrucción.

## 4. Secretos

Conteos `grep -c` en V4, sin imprimir coincidencias: 0 para `shpat_`, `shpss_`, `shpca_`, `shppa_`, `shpua_`, `Bearer `, `Authorization:`, `Cookie:`, `Set-Cookie`, `_secure_session`, `storefront_digest`, `_shopify_`, `cart=`, `eyJ`, `api_key`, `access_token`, `client_secret`, `ghp_`, `github_pat_`, `AKIA`, `password=`, `PASSWORD=`, `password:`, `contraseña:`. `sk-` dio 1, en un handle de producto (`...desk-mat`). Cadenas hex de 32 o más que no son sha256: 2, ambas SHAs de git de 40 caracteres (`b45e913...` y `09f8342...`). Cadenas tipo base64 de 32 o más: 60, todas rutas o nombres de archivo. Las 9 líneas que dicen contraseña, password, token o cookie son prosa sobre `STOREFRONT_PASSWORD` y rotación. El literal de contraseña entre comillas de la línea 5 de ambos gate5 del checkout local (`b45e913`) aparece 0 veces en V4 y 0 en V3.

## 5. Reglas y coherencia

Reglas: siguen claras. No copiar código de Atelier ni de Cucuyo (§1 L30; E-01 L323 "ni copia de código ajeno"). No crear ni usar metafields y no tocar definiciones o datos de Shopify (L55, A-02). Johandry autoriza escrituras en tienda, commits, pushes y publicaciones (§2 L88 y L105). Un solo escritor a la vez, incluidos subagentes (§2 L99 y L100). No publicar refs anteriores a la reescritura (CMP-01 L139, 0-01 L161). No implementar hasta la aprobación de V4 (cabecera L3, §1 L28, §8 L410, §9 L426, §12 L567).

Dependencias: la cadena nueva es M2 (Johandry) seguida de 0-01, luego R-0, luego A; 0-05-P3 depende de 0-01 y M2 y alimenta R-G; A-02 depende de R-D con Gemini; TT-56 depende de la decisión de Johandry y de 0-05. No hay ciclos. Aclaración sugerida: decir en 0-01 que, si la base se reconcilia, los cuatro archivos de CMP-01 se toman del linaje reescrito sin edición propia, para que 0-05-P3 siga siendo la única edición y R-0 pueda contar el literal en cero antes de ella.

Responsable, esfuerzo y verificación de lo nuevo o modificado: 0-01 (Antigravity, 0,5 a 1 d, R-0), 0-05-P3 (GPT y Sol, 1 a 2 h, `node --check` y fallo antes de red), A-02 (GPT, ~1 d, R-A con textil y no textil), C-04-N, C-04-N-P3, C-04-P3 y C-04-R tienen los tres. Huecos menores: el esfuerzo de 0-01 no se reestima por el trabajo extra de CMP-01 (linaje y BOARD:16), y TT-56 no indica ejecutor ni esfuerzo para la tarea condicional de Lote C (solo el decisor y la verificación).

## 6. Ajustes menores sugeridos (no bloqueantes)

1. Escribir "Gemini (Antigravity)" donde se exige la autorización Nivel 2 de A-02.
2. Unificar el modelo: Terra en §2 frente a Sol en 0-05-P3 L166 y §11.5 L538.
3. Actualizar los restos de V3: L40, afirmación falsable 1 (L16) y la nota de método de §1.1 (L59 frente a L76).
4. Restaurar en la cabecera la frase borrada sobre los tres P3 y poner comandos con salida en "Verificación", como pide RULES §1.3.
5. Reestimar 0-01 con CMP-01 y dar ejecutor y esfuerzo provisional a TT-56 si Johandry la activa; opcionalmente, mencionar TT-56 en la fila E-01.
6. Aclarar en 0-01 que la reconciliación toma los cuatro archivos del linaje reescrito sin edición propia.

## 7. Límites

Revisión documental. No se revalidaron contra el código los números de línea de K2, K6 ni M3; se verificó que la V4 usa los valores pedidos por la instrucción. Solo se ejecutaron comandos de lectura (`git rev-parse` y `git branch --show-current` para identificar el checkout `b45e913` en `sprint/F0`). No se abrió .secrets, no se tocó ninguna tienda y no se hizo commit ni push.
