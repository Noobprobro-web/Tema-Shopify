#!/usr/bin/env python3
"""
package-reproducible-zip.py
===========================
Empaquetado determinista y reproducible del tema Sartorial (Lote 0 Base).

Genera el paquete de distribucion Sartorial-1.0.0.zip garantizando determinismo
bit por bit e independencia de plataforma (Windows/Linux/macOS):
- Exactamente 93 archivos del tema (assets, config, layout, locales, sections, snippets, templates, listings).
- Exclusion de directorios de desarrollo y comunicacion (agent-comms, scripts, tests, .git, etc.).
- Normalizacion canonica de fines de linea a LF (\n).
- Marca de tiempo fija normalizada: 2026-11-04 15:42:07 UTC (commit fbdf462).
- Permisos UNIX normalizados: 0o100644 (-rw-r--r--), create_system = 3.
- Nivel de compresion estandar: Deflate nivel 9.
- Orden alfabetico estricto de entradas.

Hash canónico esperado:
  SHA-256: 79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f
  Tamano:  288.969 bytes
"""

import argparse
import hashlib
import os
import subprocess
import sys
import zipfile
from pathlib import Path

# Timestamp canónico fijo: 2026-11-04 15:42:07 UTC
CANONICAL_TIMESTAMP = (2026, 11, 4, 15, 42, 7)
CANONICAL_SHA256 = "79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f"
CRLF_SHA256 = "16467c9f9f769acd91f0e46704776f4d926c815a2f853b76c591c96ac922052d"

THEME_DIRS = ("assets", "config", "layout", "locales", "sections", "snippets", "templates", "listings")

def find_repo_root(start_path: Path) -> Path:
    curr = start_path.resolve()
    for _ in range(10):
        if (curr / ".git").exists() or (curr / "layout" / "theme.liquid").exists():
            return curr
        if curr.parent == curr:
            break
        curr = curr.parent
    return start_path.resolve()

def collect_theme_files_git(repo_root: Path, ref: str = "HEAD"):
    """Intenta recolectar los 93 archivos y sus blobs desde Git."""
    cmd = ["git", "-C", str(repo_root), "ls-tree", "-r", ref]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        return None
    
    theme_prefixes = tuple(f"{d}/" for d in THEME_DIRS)
    entries = []
    for line in res.stdout.strip().split("\n"):
        parts = line.split()
        if len(parts) >= 4 and parts[1] == "blob":
            sha = parts[2]
            path = line.split("\t", 1)[1]
            if path.startswith(theme_prefixes):
                entries.append((path, sha))
    
    if len(entries) != 93:
        return None
    
    entries.sort(key=lambda x: x[0])
    files_data = {}
    for path, sha in entries:
        blob = subprocess.run(
            ["git", "-C", str(repo_root), "cat-file", "blob", sha],
            capture_output=True,
            check=True
        ).stdout
        files_data[path] = blob
    return files_data

def collect_theme_files_disk(repo_root: Path, normalize_lf: bool = True):
    """Recolecta los 93 archivos directamente desde el sistema de archivos."""
    paths = []
    for d in THEME_DIRS:
        dp = repo_root / d
        if dp.is_dir():
            for fp in dp.rglob("*"):
                if fp.is_file():
                    rel = fp.relative_to(repo_root).as_posix()
                    paths.append(rel)
    
    paths.sort()
    files_data = {}
    for rel in paths:
        raw = (repo_root / rel).read_bytes()
        if normalize_lf:
            data = raw.replace(b"\r\n", b"\n")
        else:
            data = raw
        files_data[rel] = data
    return files_data

def build_reproducible_zip(files_map: dict, output_path: Path, fixed_time=CANONICAL_TIMESTAMP) -> tuple:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        output_path.unlink()
    
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for filename in sorted(files_map.keys()):
            content = files_map[filename]
            zinfo = zipfile.ZipInfo(filename=filename, date_time=fixed_time)
            zinfo.compress_type = zipfile.ZIP_DEFLATED
            zinfo.create_system = 3  # Unix
            zinfo.external_attr = 0o100644 << 16  # -rw-r--r--
            zf.writestr(zinfo, content)
    
    raw_bytes = output_path.read_bytes()
    size = len(raw_bytes)
    sha256 = hashlib.sha256(raw_bytes).hexdigest()
    return size, sha256

def main():
    parser = argparse.ArgumentParser(description="Generador reproducible de Sartorial ZIP")
    parser.add_argument("--repo-root", type=str, default=None, help="Ruta raiz del repositorio")
    parser.add_argument("--dest", type=str, default=None, help="Ruta de destino del archivo ZIP")
    parser.add_argument("--crlf-variant", action="store_true", help="Generar variante sin normalizar (CRLF fisico)")
    parser.add_argument("--verify-only", action="store_true", help="Solo verificar reproducibilidad sin persistir archivo")
    args = parser.parse_args()

    repo_root = Path(args.repo_root) if args.repo_root else find_repo_root(Path(__file__).parent)
    print(f"[REPRO-ZIP] Raiz del tema: {repo_root}")

    # Prioridad: blobs de Git para LF canónico, con fallback transparente a disco normalizado
    files_map = None
    if not args.crlf_variant:
        files_map = collect_theme_files_git(repo_root)
        if files_map:
            print("[REPRO-ZIP] Origen de datos: Git blobs canónicos (LF puro)")
        else:
            print("[REPRO-ZIP] Git blobs no disponibles; normalizando sistema de archivos a LF")
            files_map = collect_theme_files_disk(repo_root, normalize_lf=True)
    else:
        print("[REPRO-ZIP] Modo variante CRLF: empaquetando bytes de disco sin alterar")
        files_map = collect_theme_files_disk(repo_root, normalize_lf=False)

    total_files = len(files_map)
    print(f"[REPRO-ZIP] Archivos de tema detectados: {total_files}")
    if total_files != 93:
        print(f"[ERROR] Se esperaban exactamente 93 archivos, encontrados: {total_files}", file=sys.stderr)
        sys.exit(1)

    dest_zip = Path(args.dest) if args.dest else repo_root / ("Sartorial-1.0.0-crlf-variant.zip" if args.crlf_variant else "Sartorial-1.0.0.zip")
    
    size, sha = build_reproducible_zip(files_map, dest_zip)
    print(f"[REPRO-ZIP] Generado: {dest_zip}")
    print(f"[REPRO-ZIP] Tamano:   {size} bytes")
    print(f"[REPRO-ZIP] SHA-256:  {sha}")

    expected = CRLF_SHA256 if args.crlf_variant else CANONICAL_SHA256
    if sha == expected:
        print(f"[REPRO-ZIP] [OK] HASH REPRODUCIBLE VERIFICADO EXITOSAMENTE")
        if args.verify_only and dest_zip.exists():
            dest_zip.unlink()
        sys.exit(0)
    else:
        print(f"[REPRO-ZIP] [FAIL] HASH NO COINCIDE! Esperado: {expected}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()
