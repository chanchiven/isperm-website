# Batch rename all long Knowledge Hub folders

$basePath = "public\Knowledge Hub"
$renames = @{
    "The Professional Guide to Canine Semen Analysis Clinical Standards for Dog Fertility and Reproductive Integrity" = "Canine Semen Analysis Guide"
    "The Professional Guide to Poultry Semen Analysis Clinical Standards for Rooster Fertility" = "Poultry Semen Analysis Guide"
    "The Professional Guide to Stallion Semen Analysis Clinical Standards for Equine Breeding Soundness (EBSE)" = "Stallion Semen Analysis Guide"
    "The Professional Standard for Camelid Andrology Clinical Evaluation & Digital Analysis Guidelines for Camel Fertility" = "Camelid Andrology Guide"
    "The Definitive Guide to Bull Breeding Soundness Clinical Standards & Modern Methodology" = "Bull Breeding Soundness Guide"
    "Global Standards for Human Semen Analysis A Comparative Guide (WHO 6th, ISO 23162, ESHRE, & ASRM)" = "Human Semen Analysis Standards"
    "Boar Semen Evaluation and Processing Standards and Boar Breeding Soundness Examination (BBSE)" = "Boar Semen Evaluation Guide"
}

Write-Host "Starting to rename Knowledge Hub folders..."

foreach ($oldName in $renames.Keys) {
    $oldPath = Join-Path $basePath $oldName
    $newName = $renames[$oldName]
    $newPath = Join-Path $basePath $newName
    
    if (Test-Path $oldPath) {
        # Rename folder
        Move-Item -Path $oldPath -Destination $newPath -Force
        Write-Host "Renamed folder: $oldName -> $newName"
        
        # Rename files inside folder
        $files = Get-ChildItem $newPath
        foreach ($file in $files) {
            $newFileName = $file.Name -replace [regex]::Escape($oldName), $newName
            # Handle truncated filenames
            if ($newFileName -match "The Professional Guide to Canine Semen Analysis Clinical Standards for Dog Fer") {
                $newFileName = $newFileName -replace "The Professional Guide to Canine Semen Analysis Clinical Standards for Dog Fer", "Canine Semen Analysis Guide"
            }
            if ($newFileName -ne $file.Name) {
                Rename-Item -Path $file.FullName -NewName $newFileName -Force
                Write-Host "  Renamed file: $($file.Name) -> $newFileName"
            }
        }
    } else {
        Write-Host "Folder not found: $oldName"
    }
}

Write-Host "Folder renaming completed!"
