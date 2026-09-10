param(
  [string]$CsvPath = "C:\Users\PARTAHI JASON\Downloads\WIP Dashboard per 9 September 15.43_cleaned.csv"
)

$ErrorActionPreference = 'Stop'
$node = Join-Path $env:LOCALAPPDATA "Programs\cursor\resources\app\resources\helpers\node.exe"
if (-not (Test-Path $node)) {
  $node = (Get-Command node -ErrorAction SilentlyContinue).Source
}
if (-not $node) { throw "Node.js tidak ditemukan. Install Node.js atau jalankan dari Cursor." }

$publicDir = Join-Path $PSScriptRoot "..\public"
if (-not (Test-Path $publicDir)) { New-Item -ItemType Directory -Path $publicDir | Out-Null }
$publicCsv = Join-Path $publicDir "cleaned_data.csv"

$convert = Join-Path $PSScriptRoot "convert-csv.mjs"
& $node $convert $CsvPath $publicCsv
if ($LASTEXITCODE -ne 0) { throw "convert-csv.mjs gagal" }

$script = Join-Path $PSScriptRoot "process-data.js"
$sourceLabel = [System.IO.Path]::GetFileName($CsvPath)
& $node $script $publicCsv $sourceLabel
if ($LASTEXITCODE -ne 0) { throw "process-data.js gagal" }

Write-Host "Copied converted CSV to public/cleaned_data.csv"
