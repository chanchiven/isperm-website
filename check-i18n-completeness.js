const fs = require('fs');
const path = require('path');

// 从 routing.ts 获取所有支持的语言
const locales = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];

// 英文版本的文件列表（source of truth）
const requiredFiles = ['about.json', 'contact.json', 'faq.json', 'index.json', 'products.json'];

// 递归获取对象的所有键（包括嵌套键和数组索引）
function getAllKeys(obj, prefix = '') {
  const keys = new Set();
  
  if (obj === null || obj === undefined) {
    return keys;
  }
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const indexKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
      if (typeof item === 'object' && item !== null) {
        getAllKeys(item, prefix).forEach(k => keys.add(k));
      } else {
        // For arrays of primitives, we don't track individual items
        // but we track the array itself if it has structure
      }
    });
    // Track array as a whole
    keys.add(prefix);
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.add(fullKey);
        
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          getAllKeys(value, fullKey).forEach(k => keys.add(k));
        }
      }
    }
  }
  
  return keys;
}

// 获取键的值（支持嵌套路径）
function getValueByPath(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    
    // Handle array indices in path like "items[0].title"
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      
      if (current && typeof current === 'object' && arrayKey in current) {
        const array = current[arrayKey];
        if (Array.isArray(array) && array[index] !== undefined) {
          current = array[index];
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
  }
  
  return current;
}

// 检查翻译完整性
function checkTranslations() {
  const results = {
    missingFiles: {},
    missingKeys: {},
    extraKeys: {},
    jsonErrors: {},
    totalLocales: locales.length,
    checkedLocales: 0,
    completeLocales: [],
    summary: {
      totalFiles: 0,
      checkedFiles: 0,
      filesWithIssues: 0,
      totalMissingKeys: 0,
      totalExtraKeys: 0
    }
  };

  // 读取英文版本作为参考
  const enFiles = {};
  for (const file of requiredFiles) {
    try {
      const filePath = path.join(__dirname, 'messages', 'en', file);
      const content = fs.readFileSync(filePath, 'utf-8');
      enFiles[file] = JSON.parse(content);
      results.summary.totalFiles++;
    } catch (error) {
      console.error(`❌ Error reading en/${file}:`, error.message);
      results.jsonErrors[`en/${file}`] = error.message;
    }
  }

  // 检查每个语言
  for (const locale of locales) {
    if (locale === 'en') continue; // 跳过英文版本

    const localePath = path.join(__dirname, 'messages', locale);
    
    // 检查目录是否存在
    if (!fs.existsSync(localePath)) {
      results.missingFiles[locale] = requiredFiles;
      continue;
    }

    let localeComplete = true;
    let localeMissingKeys = 0;
    let localeExtraKeys = 0;

    // 检查每个必需文件
    for (const file of requiredFiles) {
      const filePath = path.join(localePath, file);
      
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        if (!results.missingFiles[locale]) {
          results.missingFiles[locale] = [];
        }
        results.missingFiles[locale].push(file);
        localeComplete = false;
        continue;
      }

      // 检查键值完整性
      try {
        const enContent = enFiles[file];
        if (!enContent) {
          continue; // Skip if English file couldn't be read
        }
        
        const localeContentRaw = fs.readFileSync(filePath, 'utf-8');
        const localeContent = JSON.parse(localeContentRaw);
        
        const enKeys = getAllKeys(enContent);
        const localeKeys = getAllKeys(localeContent);
        
        // Find missing keys
        const missing = [];
        for (const key of enKeys) {
          // Check if key exists in locale
          const localeValue = getValueByPath(localeContent, key);
          const enValue = getValueByPath(enContent, key);
          
          // Key is missing if locale doesn't have it OR if it's an object/array that's different structure
          if (localeValue === undefined) {
            // If English value is an object/array, check structure
            if (typeof enValue === 'object' && enValue !== null) {
              if (!localeKeys.has(key)) {
                missing.push(key);
              }
            } else {
              missing.push(key);
            }
          }
        }
        
        // Find extra keys (not in English)
        const extra = [];
        for (const key of localeKeys) {
          if (!enKeys.has(key)) {
            extra.push(key);
          }
        }
        
        if (missing.length > 0) {
          if (!results.missingKeys[locale]) {
            results.missingKeys[locale] = {};
          }
          results.missingKeys[locale][file] = missing;
          localeComplete = false;
          localeMissingKeys += missing.length;
          results.summary.totalMissingKeys += missing.length;
        }
        
        if (extra.length > 0) {
          if (!results.extraKeys[locale]) {
            results.extraKeys[locale] = {};
          }
          results.extraKeys[locale][file] = extra;
          localeExtraKeys += extra.length;
          results.summary.totalExtraKeys += extra.length;
        }
        
        results.summary.checkedFiles++;
      } catch (error) {
        const errorKey = `${locale}/${file}`;
        results.jsonErrors[errorKey] = error.message;
        localeComplete = false;
        console.error(`❌ Error checking ${errorKey}:`, error.message);
      }
    }

    results.checkedLocales++;
    
    // Check if locale is complete
    const hasAllFiles = requiredFiles.every(file => 
      fs.existsSync(path.join(localePath, file))
    );
    const hasNoMissingKeys = !results.missingKeys[locale] || 
      Object.keys(results.missingKeys[locale]).length === 0;
    const hasNoJsonErrors = !Object.keys(results.jsonErrors).some(k => k.startsWith(`${locale}/`));
    
    if (hasAllFiles && hasNoMissingKeys && hasNoJsonErrors) {
      results.completeLocales.push(locale);
    }
  }

  return results;
}

// 生成详细报告
function generateDetailedReport(results) {
  let report = '';
  
  report += '========================================\n';
  report += 'i18n Translation Completeness Report\n';
  report += '========================================\n\n';
  
  report += `Total Locales: ${results.totalLocales}\n`;
  report += `Checked Locales: ${results.checkedLocales}\n`;
  report += `Complete Locales: ${results.completeLocales.length}\n`;
  report += `Complete Locales: ${results.completeLocales.join(', ') || 'None'}\n\n`;
  
  report += `Summary:\n`;
  report += `  Total Files to Check: ${results.summary.totalFiles * (results.totalLocales - 1)}\n`;
  report += `  Files Checked: ${results.summary.checkedFiles}\n`;
  report += `  Files with Issues: ${results.summary.filesWithIssues}\n`;
  report += `  Total Missing Keys: ${results.summary.totalMissingKeys}\n`;
  report += `  Total Extra Keys: ${results.summary.totalExtraKeys}\n\n`;
  
  // Missing files
  if (Object.keys(results.missingFiles).length > 0) {
    report += '❌ MISSING FILES:\n';
    report += '========================================\n';
    for (const [locale, files] of Object.entries(results.missingFiles)) {
      report += `\n${locale}:\n`;
      for (const file of files) {
        report += `  - ${file}\n`;
      }
    }
    report += '\n';
  } else {
    report += '✅ All locales have required files\n\n';
  }
  
  // JSON errors
  if (Object.keys(results.jsonErrors).length > 0) {
    report += '❌ JSON PARSING ERRORS:\n';
    report += '========================================\n';
    for (const [file, error] of Object.entries(results.jsonErrors)) {
      report += `\n${file}:\n`;
      report += `  Error: ${error}\n`;
    }
    report += '\n';
  }
  
  // Missing keys
  if (Object.keys(results.missingKeys).length > 0) {
    report += '❌ MISSING KEYS:\n';
    report += '========================================\n';
    for (const [locale, files] of Object.entries(results.missingKeys)) {
      report += `\n${locale}:\n`;
      for (const [file, keys] of Object.entries(files)) {
        report += `  ${file} (${keys.length} missing):\n`;
        for (const key of keys) {
          report += `    - ${key}\n`;
        }
      }
    }
    report += '\n';
  } else {
    report += '✅ All locales have complete keys\n\n';
  }
  
  // Extra keys (warnings)
  if (Object.keys(results.extraKeys).length > 0) {
    report += '⚠️  EXTRA KEYS (not in English):\n';
    report += '========================================\n';
    for (const [locale, files] of Object.entries(results.extraKeys)) {
      report += `\n${locale}:\n`;
      for (const [file, keys] of Object.entries(files)) {
        report += `  ${file} (${keys.length} extra):\n`;
        for (const key of keys) {
          report += `    - ${key}\n`;
        }
      }
    }
    report += '\n';
  }
  
  // Final summary
  report += '========================================\n';
  const incompleteLocales = locales.filter(locale => 
    locale !== 'en' && 
    (!results.completeLocales.includes(locale) || 
     results.missingFiles[locale] || 
     results.missingKeys[locale])
  );
  
  if (incompleteLocales.length === 0) {
    report += '✅ ALL TRANSLATIONS COMPLETE!\n';
  } else {
    report += `❌ LOCALES NEEDING FIXES: ${incompleteLocales.join(', ')}\n`;
    
    // Detailed breakdown by locale
    report += '\nDetailed Breakdown:\n';
    for (const locale of incompleteLocales) {
      report += `\n${locale}:\n`;
      if (results.missingFiles[locale]) {
        report += `  Missing Files: ${results.missingFiles[locale].join(', ')}\n`;
      }
      if (results.missingKeys[locale]) {
        const totalMissing = Object.values(results.missingKeys[locale])
          .reduce((sum, keys) => sum + keys.length, 0);
        report += `  Missing Keys: ${totalMissing} across ${Object.keys(results.missingKeys[locale]).length} file(s)\n`;
      }
    }
  }
  report += '========================================\n';
  
  return report;
}

// Run check and generate report
const results = checkTranslations();
const report = generateDetailedReport(results);

console.log(report);

// Save report to file
const reportPath = path.join(__dirname, 'i18n-translation-completeness-report.txt');
fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`\n📄 Detailed report saved to: ${reportPath}\n`);

// Export for use in other scripts
module.exports = { checkTranslations, generateDetailedReport };
