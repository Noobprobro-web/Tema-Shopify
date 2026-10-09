import { execSync } from 'node:child_process';
import { writeFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';

const outPath = path.resolve('agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-gates-static.txt');

function log(text) {
  console.log(text);
  appendFileSync(outPath, text + '\n', 'utf8');
}

writeFileSync(outPath, '======================================================================\nAUDITORIA ESTATICA: EJECUCION DE COMPUERTAS\n======================================================================\n\n', 'utf8');

log('=== 1. EJECUCION TOP-LEVEL: npm run gates:static ===\n');
try {
  const out = execSync('npm run gates:static', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(out);
  log('\n[RESULTADO] npm run gates:static FINALIZO CON EXITO (0)\n');
} catch (err) {
  log(err.stdout ? err.stdout : '');
  log(err.stderr ? err.stderr : '');
  log(`\n[RESULTADO] npm run gates:static FALLO CON CODIGO DE SALIDA: ${err.status}\n`);
}

const individualGates = [
  'gates:json',
  'gates:hooks',
  'gates:sanity',
  'gates:locales',
  'gates:ledger',
  'gates:syntax',
  'gates:package'
];

log('\n======================================================================');
log('=== 2. EJECUCION INDIVIDUAL DE SUB-COMPUERTAS');
log('======================================================================\n');

for (const gate of individualGates) {
  log(`\n----------------------------------------------------------------------`);
  log(`--- SUB-COMPUERTA: npm run ${gate}`);
  log(`----------------------------------------------------------------------\n`);
  try {
    const out = execSync(`npm run ${gate}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    log(out);
    log(`[RESULTADO] npm run ${gate} -> EXITOSO (0)\n`);
  } catch (err) {
    log(err.stdout ? err.stdout : '');
    log(err.stderr ? err.stderr : '');
    log(`[RESULTADO] npm run ${gate} -> FALLO (${err.status})\n`);
  }
}

log('\n======================================================================');
log('=== 3. ANALISIS DIRECTO DE SHOPIFY THEME CHECK');
log('======================================================================\n');

log('Nota: Theme Check sobre el root incluye carpetas externas como scratch/.');
log('A continuacion la salida directa de shopify theme check:\n');
try {
  const out = execSync('npx shopify theme check', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  log(out);
  log('[RESULTADO] npx shopify theme check -> 0 ofensas\n');
} catch (err) {
  log(err.stdout ? err.stdout : '');
  log(err.stderr ? err.stderr : '');
  log(`[RESULTADO] npx shopify theme check -> Codigo ${err.status}\n`);
}

log('\n=== FIN DE EJECUCION DE COMPUERTAS ESTATICAS ===\n');
