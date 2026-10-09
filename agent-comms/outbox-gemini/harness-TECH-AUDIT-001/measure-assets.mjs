import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import path from 'node:path';

const assetsDir = path.resolve('assets');
const outFile = path.resolve('agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-asset-sizes.json');

const files = readdirSync(assetsDir);
const individualAssets = {};

for (const file of files) {
  const fullPath = path.join(assetsDir, file);
  const stat = statSync(fullPath);
  if (!stat.isFile()) continue;

  const content = readFileSync(fullPath);
  const rawBytes = stat.size;
  const gzipBytes = gzipSync(content).length;
  const brotliBytes = brotliCompressSync(content).length;

  individualAssets[file] = {
    type: file.endsWith('.css') ? 'css' : 'js',
    raw_bytes: rawBytes,
    raw_kb: Math.round((rawBytes / 1024) * 100) / 100,
    gzip_bytes: gzipBytes,
    gzip_kb: Math.round((gzipBytes / 1024) * 100) / 100,
    brotli_bytes: brotliBytes,
    brotli_kb: Math.round((brotliBytes / 1024) * 100) / 100
  };
}

// Templates calculation
// Default animations = 'full'
function calculatePage(filesList) {
  const cssFiles = filesList.filter(f => individualAssets[f].type === 'css');
  const jsFiles = filesList.filter(f => individualAssets[f].type === 'js');

  const css = {
    files: cssFiles,
    raw_bytes: cssFiles.reduce((acc, f) => acc + individualAssets[f].raw_bytes, 0),
    gzip_bytes: cssFiles.reduce((acc, f) => acc + individualAssets[f].gzip_bytes, 0),
    brotli_bytes: cssFiles.reduce((acc, f) => acc + individualAssets[f].brotli_bytes, 0)
  };
  css.raw_kb = Math.round((css.raw_bytes / 1024) * 100) / 100;
  css.gzip_kb = Math.round((css.gzip_bytes / 1024) * 100) / 100;
  css.brotli_kb = Math.round((css.brotli_bytes / 1024) * 100) / 100;

  const js = {
    files: jsFiles,
    raw_bytes: jsFiles.reduce((acc, f) => acc + individualAssets[f].raw_bytes, 0),
    gzip_bytes: jsFiles.reduce((acc, f) => acc + individualAssets[f].gzip_bytes, 0),
    brotli_bytes: jsFiles.reduce((acc, f) => acc + individualAssets[f].brotli_bytes, 0)
  };
  js.raw_kb = Math.round((js.raw_bytes / 1024) * 100) / 100;
  js.gzip_kb = Math.round((js.gzip_bytes / 1024) * 100) / 100;
  js.brotli_kb = Math.round((js.brotli_bytes / 1024) * 100) / 100;

  return {
    css,
    js,
    total_raw_bytes: css.raw_bytes + js.raw_bytes,
    total_raw_kb: Math.round(((css.raw_bytes + js.raw_bytes) / 1024) * 100) / 100,
    total_gzip_bytes: css.gzip_bytes + js.gzip_bytes,
    total_gzip_kb: Math.round(((css.gzip_bytes + js.gzip_bytes) / 1024) * 100) / 100,
    total_brotli_bytes: css.brotli_bytes + js.brotli_bytes,
    total_brotli_kb: Math.round(((css.brotli_bytes + js.brotli_bytes) / 1024) * 100) / 100
  };
}

const templates = {
  home_default_animations_full: calculatePage(['base.css', 'theme.js', 'gsap.min.js', 'gsap-scrolltrigger.min.js', 'motion.js']),
  home_lean_animations_subtle_or_none: calculatePage(['base.css', 'theme.js']),
  collection_default_animations_full: calculatePage(['base.css', 'theme.js', 'gsap.min.js', 'gsap-scrolltrigger.min.js', 'motion.js']),
  collection_lean_animations_subtle_or_none: calculatePage(['base.css', 'theme.js']),
  product_default_animations_full: calculatePage(['base.css', 'theme.js', 'gsap.min.js', 'gsap-scrolltrigger.min.js', 'motion.js', 'product-zoom.js']),
  product_lean_animations_subtle_or_none: calculatePage(['base.css', 'theme.js', 'product-zoom.js'])
};

const outputData = {
  measured_at: new Date().toISOString(),
  individual_assets: individualAssets,
  templates_breakdown: templates
};

writeFileSync(outFile, JSON.stringify(outputData, null, 2), 'utf8');
console.log('Asset measurement completed successfully. Written to: ' + outFile);
