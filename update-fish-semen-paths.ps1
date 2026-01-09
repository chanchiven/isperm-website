# 更新所有 JSON 文件中的 Fish Semen Analysis 路径引用

$oldPath = "/Knowledge Hub/The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success/The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success"
$newPath = "/Knowledge Hub/Fish Semen Analysis Guide/Fish Semen Analysis Guide"

Write-Host "开始更新 Fish Semen Analysis 路径引用..."
Write-Host "=" * 60

$jsonFiles = Get-ChildItem -Path "messages" -Filter "*.json" -Recurse
$updatedCount = 0

foreach ($file in $jsonFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldPath)) {
        $content = $content -replace [regex]::Escape($oldPath), $newPath
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $updatedCount++
        Write-Host "  Updated: $($file.FullName)"
    }
}

Write-Host ""
Write-Host "完成！更新了 $updatedCount 个 JSON 文件"
Write-Host "旧路径: $oldPath"
Write-Host "新路径: $newPath"
