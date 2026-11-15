// Sirve assets/ del repo (y harness-COMP-001/.before/assets/) en 127.0.0.1:8765 para sustituir
// base.css en la sesion del navegador. Uso: node harness-COMP-001/serve.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'content-type': p.endsWith('.css') ? 'text/css' : 'text/plain', 'access-control-allow-origin': '*'});
  fs.createReadStream(p).pipe(res);
}).listen(8765, '127.0.0.1', () => console.log('serving', root));
