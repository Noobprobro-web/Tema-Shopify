Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "Sartorial-1.0.0.zip"
$outFile = "agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-zip-contents.txt"

$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entries = $zip.Entries

$fileEntries = @($entries | Where-Object { -not $_.FullName.EndsWith('/') })
$dirEntries = @($entries | Where-Object { $_.FullName.EndsWith('/') })

$totalUncompressed = ($fileEntries | Measure-Object -Property Length -Sum).Sum
$totalCompressed = ($fileEntries | Measure-Object -Property CompressedLength -Sum).Sum
$zipFileInfo = Get-Item $zipPath

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("======================================================================")
$lines.Add("AUDITORIA DE EMPAQUETADO: $zipPath")
$lines.Add("======================================================================")
$lines.Add("Total de entradas en ZIP: $($entries.Count)")
$lines.Add("Archivos: $($fileEntries.Count)")
$lines.Add("Directorios explicitos: $($dirEntries.Count)")
$lines.Add("Tamano descomprimido total: $totalUncompressed bytes ($([Math]::Round($totalUncompressed / 1024, 2)) KB)")
$lines.Add("Tamano comprimido de datos: $totalCompressed bytes ($([Math]::Round($totalCompressed / 1024, 2)) KB)")
$lines.Add("Tamano del archivo ZIP en disco: $($zipFileInfo.Length) bytes ($([Math]::Round($zipFileInfo.Length / 1024, 2)) KB)")
$lines.Add("")
$lines.Add("--- DETALLE DE ENTRADAS ---")
$lines.Add(("{0,-65} {1,14} {2,14}" -f "Ruta en ZIP", "Tamano Original", "Comprimido"))
$lines.Add("-" * 95)

$sortedEntries = $entries | Sort-Object FullName
foreach ($e in $sortedEntries) {
    $lines.Add(("{0,-65} {1,14} {2,14}" -f $e.FullName, $e.Length, $e.CompressedLength))
}

$lines.Add("")
$lines.Add("--- VALIDACION DE REQUISITOS DE SHOPIFY THEME STORE ---")

# 1. Archivos ocultos
$hiddenFiles = @($fileEntries | Where-Object { $_.Name.StartsWith('.') })
if ($hiddenFiles.Count -eq 0) {
    $lines.Add("[PASS] Archivos ocultos (.*): 0 encontrados.")
} else {
    $lines.Add("[FAIL] Archivos ocultos encontrados: $($hiddenFiles.Count)")
    foreach ($h in $hiddenFiles) {
        $lines.Add("       - $($h.FullName)")
    }
}

# 2. Directorios prohibidos
$forbiddenPrefixes = @('node_modules/', '.git/', '.github/', 'agent-comms/', 'docs/', 'scripts/', 'scratch/', 'test-results/', 'playwright-report/', '.tmp/')
$foundForbidden = @($entries | Where-Object {
    $fn = $_.FullName
    $match = $false
    foreach ($p in $forbiddenPrefixes) {
        if ($fn.StartsWith($p)) { $match = $true; break }
    }
    $match
})
if ($foundForbidden.Count -eq 0) {
    $lines.Add("[PASS] Directorios prohibidos (.git, node_modules, scratch, agent-comms, docs, etc.): 0 encontrados.")
} else {
    $lines.Add("[FAIL] Se encontraron entradas en directorios prohibidos: $($foundForbidden.Count)")
    foreach ($f in $foundForbidden) {
        $lines.Add("       - $($f.FullName)")
    }
}

# 3. Archivos de desarrollo en raíz
$forbiddenFiles = @('package.json', 'package-lock.json', '.gitignore', 'README.md', 'playwright.config.js', 'AGENTS.md')
$foundForbiddenFiles = @($fileEntries | Where-Object { $forbiddenFiles -contains $_.FullName })
if ($foundForbiddenFiles.Count -eq 0) {
    $lines.Add("[PASS] Archivos de desarrollo en raiz (package.json, gitignore, configs): 0 encontrados.")
} else {
    $lines.Add("[FAIL] Archivos de desarrollo encontrados en raiz: $($foundForbiddenFiles.Count)")
    foreach ($f in $foundForbiddenFiles) {
        $lines.Add("       - $($f.FullName)")
    }
}

# 4. Raíces válidas según especificación de Shopify Theme Store
$allowedRoots = @('assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'blocks', 'listings')
$rootDirs = @($entries | ForEach-Object { ($_.FullName -split '/')[0] } | Select-Object -Unique)
$invalidRoots = @($rootDirs | Where-Object { $allowedRoots -notcontains $_ })
$lines.Add("Carpetas raiz en el ZIP: $($rootDirs -join ', ')")
if ($invalidRoots.Count -eq 0) {
    $lines.Add("[PASS] Todas las carpetas raiz estan dentro del catalogo permitido por Shopify Theme Store.")
} else {
    $lines.Add("[FAIL] Carpetas raiz no autorizadas: $($invalidRoots -join ', ')")
}

# 5. Límite de tamaño de paquete Shopify (Shopify Theme Store límite es 50 MB)
$maxZipSizeBytes = 50 * 1024 * 1024
if ($zipFileInfo.Length -le $maxZipSizeBytes) {
    $lines.Add("[PASS] Limite de tamano de paquete Shopify (max 50 MB): $($zipFileInfo.Length) bytes ($([Math]::Round($zipFileInfo.Length / 1024 / 1024, 2)) MB) <= 50 MB.")
} else {
    $lines.Add("[FAIL] El paquete supera los 50 MB.")
}

# 6. Presets en /listings/
$listingsEntries = @($entries | Where-Object { $_.FullName.StartsWith('listings/') })
$lines.Add("Entradas en /listings/: $($listingsEntries.Count)")

$zip.Dispose()

$lines | Out-File -FilePath $outFile -Encoding utf8
Write-Host "Auditoria de ZIP completada exitosamente. Escrito en $outFile."
