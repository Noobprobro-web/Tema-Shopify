# GPT-018 Rol comprador: evidencia parcial (no veredicto)

Comando: `node --loader ./agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer/loader.mjs agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer/probe.mjs` (red autorizada mediante escalación). Salida: exit 0.

Cada `*-home.json`, `*-pdp.json` y `*-cart.json` contiene URL, HTTP status 200, body text y controles. Capturas `*-home-desktop.png`, `*-pdp-desktop.png`, `*-pdp-mobile.png` disponibles. Viewports 1440×1000 y 390×844. Probe es inspección, no clic de cada CTA de descubrimiento. Checkout sigue.

- Atelier Serra Coat: $1,890, tallas36/38/40/42, stock disponible. Una descripción Biella/wool/cashmere; Shipping PDP genérico, pero home featured dice complimentary express dispatched24h. `atelier-home.json` y `atelier-pdp.json`.
- Edition Structured Tote: $680, acabados Black box calf / Saddle tan / Deep olive; tamaños Standard/Compact. `edition-pdp.json`. Home set folio Black box calf/Saddle tan; cardholder Black box calf/Oxblood/Saddle tan; tray Black/Saddle tan/Deep olive. `edition-home.json`.
- Archive chaqueta1990 está SOLD OUT y home la mantiene en Spotlight y featured. Home promete maker named every object/museum-grade certificate; descripción PDP solo record AR-1990-01, sin nombre de maker visible. `archive-home.json`, `archive-pdp.json`. Usaré trench1999 disponible para prueba, no la chaqueta.

Descartado: primer carrito vacío tras click fue carrera del harness al navegar antes finalizar POST, NO defecto tema. Corregido esperando respuesta POST `/cart/add`, confirmado HTTP200 Atelier.
