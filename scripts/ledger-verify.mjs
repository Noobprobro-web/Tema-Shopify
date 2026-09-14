#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const ledgerPath = path.join(rootDir, 'docs', 'requirements-ledger.md');

const CANONICAL_STATES = new Set([
  '`cumplido`',
  '`código completo`',
  '`no verificado`',
  '`ausente`'
]);

function run() {
  if (!fs.existsSync(ledgerPath)) {
    console.error(`❌ Ledger file not found at: ${ledgerPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(ledgerPath, 'utf8');
  const lines = content.split('\n');

  const rows = [];
  let headerCounts = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('| **')) {
      // Temporarily replace escaped pipes \|
      const sanitized = line.replace(/\\\|/g, '__ESCAPED_PIPE__');
      const parts = sanitized.split('|').map(p => p.trim().replace(/__ESCAPED_PIPE__/g, '|'));
      // parts[0] is '', parts[1] is Requisito, parts[2] is Fuente, parts[3] is Estado, parts[4] is Evidencia, parts[5] is Dueño, parts[6] is Sprint
      if (parts.length >= 7) {
        rows.push({
          lineNum: i + 1,
          requisito: parts[1],
          fuente: parts[2],
          estado: parts[3],
          evidencia: parts[4],
          dueno: parts[5],
          sprint: parts[6]
        });
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`📋 SARTORIAL LEDGER VERIFIER`);
  console.log(`========================================\n`);

  console.log(`Total requirement rows found: ${rows.length}`);

  let errors = [];
  const stateCounts = {
    '`cumplido`': 0,
    '`código completo`': 0,
    '`no verificado`': 0,
    '`ausente`': 0
  };

  rows.forEach((row) => {
    if (!CANONICAL_STATES.has(row.estado)) {
      errors.push(`Línea ${row.lineNum}: Estado no canónico "${row.estado}". Permitidos: \`cumplido\`, \`código completo\`, \`no verificado\`, \`ausente\`.`);
    } else {
      stateCounts[row.estado]++;
    }

    if (!row.dueno || row.dueno === '' || row.dueno === '-') {
      errors.push(`Línea ${row.lineNum} ("${row.requisito}"): Falta dueño responsable.`);
    }

    if (!row.evidencia || row.evidencia === '' || row.evidencia === '-') {
      errors.push(`Línea ${row.lineNum} ("${row.requisito}"): Falta evidencia.`);
    }

    // Check file existence for cited paths in evidencia
    const fileMatches = row.evidencia.matchAll(/`([a-zA-Z0-9_\-\.\/]+)(?::[0-9\-]+)?`/g);
    for (const match of fileMatches) {
      const candidatePath = match[1];
      // Only verify relative paths pointing inside known theme folders
      if (candidatePath.includes('/') && !candidatePath.startsWith('http') && !candidatePath.startsWith('t:')) {
        const fullCandidate = path.join(rootDir, candidatePath);
        if (!fs.existsSync(fullCandidate)) {
          // Check if candidate is a glob or listing dir
          if (!candidatePath.includes('*')) {
            errors.push(`Línea ${row.lineNum}: Archivo citado no existe en disco: "${candidatePath}"`);
          }
        }
      }
    }
  });

  console.log(`\nConteo por estado canónico:`);
  console.log(`  - cumplido:        ${stateCounts['`cumplido`']}`);
  console.log(`  - código completo: ${stateCounts['`código completo`']}`);
  console.log(`  - no verificado:   ${stateCounts['`no verificado`']}`);
  console.log(`  - ausente:         ${stateCounts['`ausente`']}`);
  console.log(`  -----------------------------`);
  console.log(`  TOTAL:             ${rows.length}`);

  // Validate that the summary block at top matches exact counts
  const headerMatch = content.match(/CONTEO VIVO:\s*(\d+)\s*CUMPLIDOS DEFINITIVOS\s*\|\s*(\d+)\s*CÓDIGO COMPLETO[^\n]*\|\s*(\d+)\s*PENDIENTES EXTERNOS/i);
  if (headerMatch) {
    const hdrCumplidos = parseInt(headerMatch[1], 10);
    const hdrCodigo = parseInt(headerMatch[2], 10);
    const hdrPendientes = parseInt(headerMatch[3], 10);

    if (hdrCumplidos !== stateCounts['`cumplido`']) {
      errors.push(`Discrepancia en encabezado CONTEO VIVO: declara ${hdrCumplidos} cumplidos pero hay ${stateCounts['`cumplido`']}.`);
    }
    if (hdrCodigo !== stateCounts['`código completo`']) {
      errors.push(`Discrepancia en encabezado CONTEO VIVO: declara ${hdrCodigo} código completo pero hay ${stateCounts['`código completo`']}.`);
    }
    if (hdrPendientes !== (stateCounts['`no verificado`'] + stateCounts['`ausente`'])) {
      errors.push(`Discrepancia en encabezado CONTEO VIVO: declara ${hdrPendientes} pendientes pero hay ${stateCounts['`no verificado`'] + stateCounts['`ausente`']}.`);
    }
  } else {
    errors.push(`Encabezado "CONTEO VIVO:" no encontrado o con formato inesperado.`);
  }

  if (errors.length > 0) {
    console.error(`\n❌ Se encontraron ${errors.length} errores de validación en el ledger:\n`);
    errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    process.exit(1);
  }

  console.log(`\n✅ Ledger 100% consistente y matemáticamente verificado.\n`);
  process.exit(0);
}

run();
