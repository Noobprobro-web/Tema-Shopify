// Doble de prueba del Shopify CLI para selftest.mjs. No hay red: `theme list`
// devuelve STUB_UNPUBLISHED y `theme pull` copia desde STUB_SOURCE/<themeId>/.
// Registra argv en STUB_LOG para comprobar que no viajan credenciales.
import { appendFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
appendFileSync(process.env.STUB_LOG, `${JSON.stringify(args)}\n`);
const flag = (name) => args[args.indexOf(name) + 1];
if (!process.env.SHOPIFY_FLAG_STORE || !process.env.SHOPIFY_CLI_THEME_TOKEN) process.exit(3);
if (args[0] === 'theme' && args[1] === 'list') {
  const ids = (process.env.STUB_UNPUBLISHED || '').split(',').filter(Boolean);
  process.stdout.write(JSON.stringify([...ids.map((id) => ({ id: Number(id), name: `t${id}`, role: 'unpublished' })), { id: 1, name: 'live', role: 'live' }]));
  process.exit(0);
}
if (args[0] === 'theme' && args[1] === 'pull') {
  const src = path.join(process.env.STUB_SOURCE, flag('--theme'));
  const dest = flag('--path');
  const only = args.flatMap((a, i) => (a === '--only' ? [args[i + 1]] : []));
  mkdirSync(dest, { recursive: true });
  if (only.length === 0) cpSync(src, dest, { recursive: true });
  for (const rel of only) {
    if (existsSync(path.join(src, rel))) {
      mkdirSync(path.dirname(path.join(dest, rel)), { recursive: true });
      cpSync(path.join(src, rel), path.join(dest, rel));
    }
  }
  process.stdout.write('pulled\n');
  process.exit(0);
}
process.exit(4);
