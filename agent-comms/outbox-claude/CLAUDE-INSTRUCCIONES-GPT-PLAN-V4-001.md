# Instrucciones para GPT: plan Sartorial V4

Base: `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v3.md`. Fuentes nuevas: `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-003.md` y `agent-comms/outbox-claude/CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md`.

Crea `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.md` como archivo nuevo. No modifiques V1, V2, V3 ni las revisiones. Conserva todo lo demás de la V3.

## A. Gobierno

1. M1. Registra como decisión de Johandry del 2026-10-30, confirmada por chat: autoriza retirar las lecturas `product.metafields.custom.*` y `sartorial.*` de A-02 y el nuevo copy de C-04-N (`SARTORIAL` y `SARTORIAL / 02`). Cítala con esa fecha en la cabecera "Decisión requerida", §1, §1.2, §9, §11.1 C3, §11.4 C002-3 y el párrafo de copy de C-04-N. Quita "decidido en esta planificación" para esos dos puntos.
2. K5. En la cabecera, cambia "con parche listo" por "sin parche".
3. Añade GEMINI-AUDIT-COMPARATIVA-001 a la tabla de fuentes de §1 con este alcance: sin hallazgos nuevos de Sartorial; su matriz 71/71 y su veredicto "no apto" no son insumo del plan. Añade a §1.1 los sha256 de las tres fuentes nuevas.

## B. Seguridad y base

4. M2. La rotación de la contraseña del storefront sigue siendo tarea de Johandry. Añade a §9: Johandry confirma que la rotación D1 registrada el 2026-10-22 (BOARD de `09f8342`, §15.2) cubrió `tema-qkqpke0j` y las tres demos, o la repite. Ningún agente prueba credenciales antiguas contra tiendas.
5. M2. En 0-05-P3: los dos gate5 se editan una sola vez, sobre la base que fije 0-01 y después de la confirmación de Johandry. Declara que quitar el literal del archivo no lo borra del historial local.
6. En §3.1: el checkout `b45e913` (`sprint/F0` local) es anterior a la reescritura de historial del 2026-10-22 y no desciende de `origin/sprint/F0` (`c4dca23`) ni de `origin/master` (`09f8342`). Ver CMP-01.

## C. Localizadores y contrato

7. M3. En A-02, cambia `snippets/product-recommendations.liquid:6-12,68-71` por `sections/product-recommendations.liquid:6-12,68-71`.
8. M4. Marca A-02 como cambio de contrato de Nivel 2, autorizado por la decisión de M1. La R-D de A-02 lo declara. Añade a C-04-R una línea para `release-notes.md`: especificaciones y procedencia dejan de leer metafields `custom.*` y `sartorial.*`, los valores existentes ya no se muestran y el dato se carga en los settings del bloque.
9. M5. Añade los IDs de origen: C-04-N-P3 = GEM-E-002; C-04-P3 = GEM-G-004; 0-05-P3 = GEM-H-002 y GEM-G-001. Aplícalo en §3.3, §4.3 y §11.5, junto a los números de línea.
10. K1. En C-04-N cita `docs/merchant/support.html:254`, no `:254-255`.
11. K2. En A-02 usa las claves reales de Archive: `circa_year`, `show_unique_piece`, `condition_grade` y `provenance_notes` (`listings/archive/templates/product.json:75-78`; home `listings/archive/templates/index.json:108-111`, claim en `provenance_notes` de `:111`).
12. K3. Añade a A-02: al retirar la heurística de título de `product-provenance.liquid:30-38`, `circa_year` del bloque se aplica a todos los productos de la plantilla; al retirar `is_non_textile` de `product-technical-specs.liquid:46-49`, `gsm` del bloque se muestra también en objetos. R-A prueba los dos efectos con un producto textil y uno no textil.
13. K4. Añade al párrafo de copy de C-04-N, como conservadas a propósito: `listings/sartorial/templates/index.json:19, :53, :70, :107, :128`, `listings/sartorial/templates/collection.json:10` y `templates/index.json:90`. R-C no las reabre. Añade a 0-04: Johandry decide si conserva "Haute Couture" en `index.json:19, :53, :70, :107` como copy demo, porque es una denominación protegida en Francia.
14. K6. Usa los rangos exactos del ZIP integrado: `handleDocumentClick:2357-2371`, `handleDrawerClick:2384-2436`, rama de venta cruzada `:2408-2415`, `handleCrossSellView:2973-2984` (comentario en `:2971-2972`), `saveNoteAndNavigate:2990-3031`. Mantén la revalidación por función.

## D. Hallazgos que entran al plan

15. CMP-01. ID original: GEM-G-001 (derivado de su reverificación). Severidad propuesta: P1 de repositorio, fuera del ZIP. Evidencia: `b45e913` difiere de su gemelo reescrito `c4dca23` solo en `scripts/gate5-live-verify.mjs:5`, `scripts/gate5-complete-verification.mjs:5`, `agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md` y `agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md`; en `b45e913` los dos gate5 conservan el literal de contraseña. Las ramas locales `sprint/F0`, `master`, `sprint/7B`, `codex/argon-001-integrate-7b`, `backup/ee235e8-preservado`, `fix/argon-recently-viewed-edition`, `worktree-claude` y `worktree-codex` contienen el commit previo a la reescritura `44a8948`. Tarea: ampliar 0-01, Lote 0. La base sale del linaje reescrito o se reconcilia con él antes de cualquier commit. Prohibido publicar refs locales previas a la reescritura. Reconciliar BOARD local (línea 16) con BOARD de `09f8342` §15.2. Verificación: en R-0, Claude comprueba con `git merge-base --is-ancestor` que la base desciende de `09f8342` o `c4dca23` y que esos cuatro archivos no contienen el literal, por conteo y sin imprimirlo. Dependencia: decisión de base de Johandry en 0-01 y confirmación de M2.
16. CMP-02. ID original: GEM-G-001 (derivado). Severidad propuesta: P3. Evidencia: en `09f8342`, `c4dca23`, `f46ee38` y `35b952c`, la línea 5 de `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs` tiene un marcador de redacción sin comillas; `node --check` da SyntaxError. Contradice el modo fail-closed declarado en D2. Tarea: 0-05-P3, misma edición de la línea 5. Verificación: `node --check` de ambos scripts en la base elegida y fallo antes de red si falta `STOREFRONT_PASSWORD`, sin ejecutarlos contra tiendas. Dependencia: 0-01 y M2.
17. TT-56. ID original: TT-56 (Claude MASTER §9.5), también §4.b.1 de la comparativa. Severidad propuesta: P3. Evidencia: `locales/` del ZIP solo tiene `en.default.schema.json`; existe `es.json`, falta `es.schema.json`. No es requisito de Shopify. Tarea: registrar dentro de E-01 como P3 diferido, fuera del camino de envío; si Johandry lo pide, tarea propia en Lote C con su R-D. Verificación: paridad de claves entre `en.default.schema.json` y `es.schema.json` con `scripts/locale-key-inventory.mjs` si 0-05 lo acredita, y revisión del editor en español. Dependencia: decisión de Johandry.

## E. No incorporar

18. GEM-B-001 y GEM-B-002: refutados.
19. Kit de listings con `listing.json` y `preview.png`: Shopify no lo pide.
20. TT-07, TT-08, TT-09, TT-20, TT-25, TT-31 y TT-107: son de Atelier; §1 ya los excluye.
21. SUP-001 a SUP-003: los cubre G2 o no son verificables.
22. No cambies severidades por la comparativa. TT-03 sigue P1, TT-04 sigue P2 y TT-02 sigue según A-03. Los once hallazgos que ya tienen tarea (TT-100, TT-02, TT-03, TT-04, TT-101, TT-104, TT-102, TT-103, TT-12, TT-17 y el residuo de GEM-G-001) no cambian de fila.

## F. Entrega

23. Añade §11.6 con la resolución de M1 a M5, K1 a K6, CMP-01, CMP-02 y TT-56.
24. Usa la cabecera RULES completa. Sin contraseñas, cookies ni tokens en el documento.

No iniciar implementación hasta que Johandry apruebe la V4.
