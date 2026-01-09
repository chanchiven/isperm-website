# Update all Knowledge Hub path references in JSON files

$pathMappings = @{
    "/Knowledge Hub/The Professional Guide to Canine Semen Analysis Clinical Standards for Dog Fertility and Reproductive Integrity/The Professional Guide to Canine Semen Analysis Clinical Standards for Dog Fertility and Reproductive Integrity" = "/Knowledge Hub/Canine Semen Analysis Guide/Canine Semen Analysis Guide"
    "/Knowledge Hub/The Professional Guide to Poultry Semen Analysis Clinical Standards for Rooster Fertility/The Professional Guide to Poultry Semen Analysis Clinical Standards for Rooster Fertility" = "/Knowledge Hub/Poultry Semen Analysis Guide/Poultry Semen Analysis Guide"
    "/Knowledge Hub/The Professional Guide to Stallion Semen Analysis Clinical Standards for Equine Breeding Soundness (EBSE)/The Professional Guide to Stallion Semen Analysis Clinical Standards for Equine Breeding Soundness (EBSE)" = "/Knowledge Hub/Stallion Semen Analysis Guide/Stallion Semen Analysis Guide"
    "/Knowledge Hub/The Professional Standard for Camelid Andrology Clinical Evaluation & Digital Analysis Guidelines for Camel Fertility/The Professional Standard for Camelid Andrology Clinical Evaluation & Digital Analysis Guidelines for Camel Fertility" = "/Knowledge Hub/Camelid Andrology Guide/Camelid Andrology Guide"
    "/Knowledge Hub/The Definitive Guide to Bull Breeding Soundness Clinical Standards & Modern Methodology/The Definitive Guide to Bull Breeding Soundness Clinical Standards & Modern Methodology" = "/Knowledge Hub/Bull Breeding Soundness Guide/Bull Breeding Soundness Guide"
    "/Knowledge Hub/Global Standards for Human Semen Analysis A Comparative Guide (WHO 6th, ISO 23162, ESHRE, & ASRM)/Global Standards for Human Semen Analysis A Comparative Guide (WHO 6th, ISO 23162, ESHRE, & ASRM)" = "/Knowledge Hub/Human Semen Analysis Standards/Human Semen Analysis Standards"
    "/Knowledge Hub/Boar Semen Evaluation and Processing Standards and Boar Breeding Soundness Examination (BBSE)/Boar Semen Evaluation and Processing Standards and Boar Breeding Soundness Examination (BBSE)" = "/Knowledge Hub/Boar Semen Evaluation Guide/Boar Semen Evaluation Guide"
}

Write-Host "Starting to update path references in JSON files..."

$jsonFiles = Get-ChildItem -Path "messages" -Filter "*.json" -Recurse
$totalUpdated = 0

foreach ($file in $jsonFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $fileUpdated = $false
    
    foreach ($oldPath in $pathMappings.Keys) {
        $newPath = $pathMappings[$oldPath]
        if ($content -match [regex]::Escape($oldPath)) {
            $content = $content -replace [regex]::Escape($oldPath), $newPath
            $fileUpdated = $true
        }
    }
    
    if ($fileUpdated) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalUpdated++
        Write-Host "  Updated: $($file.FullName)"
    }
}

Write-Host ""
Write-Host "Completed! Updated $totalUpdated JSON files"
