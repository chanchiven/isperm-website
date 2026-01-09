const fs = require('fs');
const path = require('path');

// 从 routing.ts 获取所有支持的语言
const locales = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];

// 英文版本的文件列表（source of truth）
const requiredFiles = ['about.json', 'contact.json', 'faq.json', 'index.json', 'products.json'];

// 深度比较两个对象的结构（忽略数组内容，只比较结构）
function compareStructure(enObj, localeObj, path = '') {
  const issues = [];
  
  // 如果都是 null 或 undefined，结构一致
  if ((enObj === null || enObj === undefined) && (localeObj === null || localeObj === undefined)) {
    return issues;
  }
  
  // 如果一个是 null/undefined，另一个不是，结构不一致
  if ((enObj === null || enObj === undefined) !== (localeObj === null || localeObj === undefined)) {
    issues.push({
      path: path || 'root',
      issue: 'Structure mismatch: one is null/undefined, the other is not',
      enType: typeof enObj,
      localeType: typeof localeObj
    });
    return issues;
  }
  
  // 如果类型不同，结构不一致
  if (typeof enObj !== typeof localeObj) {
    issues.push({
      path: path || 'root',
      issue: 'Type mismatch',
      enType: typeof enObj,
      localeType: typeof localeObj
    });
    return issues;
  }
  
  // 处理数组
  if (Array.isArray(enObj)) {
    if (!Array.isArray(localeObj)) {
      issues.push({
        path: path || 'root',
        issue: 'Type mismatch: expected array',
        enType: 'array',
        localeType: typeof localeObj
      });
      return issues;
    }
    
    // 检查数组长度（如果英文版本有内容，目标语言也应该有）
    if (enObj.length > 0 && localeObj.length === 0) {
      issues.push({
        path: path || 'root',
        issue: `Array is empty but English version has ${enObj.length} items`,
        enLength: enObj.length,
        localeLength: localeObj.length
      });
    }
    
    // 如果数组有内容，比较第一个元素的结构（假设所有元素结构相同）
    if (enObj.length > 0 && localeObj.length > 0) {
      const enFirst = enObj[0];
      const localeFirst = localeObj[0];
      
      if (typeof enFirst === 'object' && enFirst !== null && typeof localeFirst === 'object' && localeFirst !== null) {
        // 递归比较第一个元素的结构
        const nestedIssues = compareStructure(enFirst, localeFirst, path ? `${path}[0]` : '[0]');
        issues.push(...nestedIssues);
      }
    }
    
    return issues;
  }
  
  // 处理对象
  if (typeof enObj === 'object' && enObj !== null) {
    if (typeof localeObj !== 'object' || localeObj === null) {
      issues.push({
        path: path || 'root',
        issue: 'Type mismatch: expected object',
        enType: 'object',
        localeType: typeof localeObj
      });
      return issues;
    }
    
    // 获取所有键
    const enKeys = Object.keys(enObj);
    const localeKeys = Object.keys(localeObj);
    
    // 检查缺失的键
    for (const key of enKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (!(key in localeObj)) {
        issues.push({
          path: fullPath,
          issue: 'Missing key',
          enValue: typeof enObj[key],
          localeValue: 'undefined'
        });
      } else {
        // 递归检查嵌套结构
        const nestedIssues = compareStructure(enObj[key], localeObj[key], fullPath);
        issues.push(...nestedIssues);
      }
    }
    
    // 检查多余的键（警告）
    for (const key of localeKeys) {
      if (!(key in enObj)) {
        issues.push({
          path: path ? `${path}.${key}` : key,
          issue: 'Extra key (not in English version)',
          enValue: 'undefined',
          localeValue: typeof localeObj[key]
        });
      }
    }
  }
  
  return issues;
}

// 检查翻译完整性
function checkTranslations() {
  const results = {
    missingFiles: {},
    structureIssues: {},
    jsonErrors: {},
    totalLocales: locales.length,
    checkedLocales: 0,
    completeLocales: [],
    summary: {
      totalFiles: 0,
      checkedFiles: 0,
      filesWithIssues: 0,
      totalIssues: 0
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
    let localeIssues = 0;

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

      // 检查结构完整性
      try {
        const enContent = enFiles[file];
        if (!enContent) {
          continue; // Skip if English file couldn't be read
        }
        
        const localeContentRaw = fs.readFileSync(filePath, 'utf-8');
        const localeContent = JSON.parse(localeContentRaw);
        
        // 使用改进的结构比较
        const issues = compareStructure(enContent, localeContent);
        
        if (issues.length > 0) {
          // 只记录真正的缺失键（不是数组结构问题）
          const realIssues = issues.filter(issue => 
            issue.issue === 'Missing key' || 
            issue.issue === 'Type mismatch' ||
            (issue.issue.includes('empty') && issue.enLength > 0)
          );
          
          if (realIssues.length > 0) {
            if (!results.structureIssues[locale]) {
              results.structureIssues[locale] = {};
            }
            results.structureIssues[locale][file] = realIssues;
            localeComplete = false;
            localeIssues += realIssues.length;
            results.summary.totalIssues += realIssues.length;
            results.summary.filesWithIssues++;
          }
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
    const hasNoIssues = !results.structureIssues[locale] || 
      Object.keys(results.structureIssues[locale]).length === 0;
    const hasNoJsonErrors = !Object.keys(results.jsonErrors).some(k => k.startsWith(`${locale}/`));
    
    if (hasAllFiles && hasNoIssues && hasNoJsonErrors) {
      results.completeLocales.push(locale);
    }
  }

  return results;
}

// 生成详细报告
function generateReport(results) {
  let report = '';
  
  report += '========================================\n';
  report += 'i18n Translation Completeness Report (Advanced)\n';
  report += '========================================\n\n';
  
  report += `Total Locales: ${results.totalLocales}\n`;
  report += `Checked Locales: ${results.checkedLocales}\n`;
  report += `Complete Locales: ${results.completeLocales.length}\n`;
  report += `Complete Locales: ${results.completeLocales.join(', ') || 'None'}\n\n`;
  
  report += `Summary:\n`;
  report += `  Total Files to Check: ${results.summary.totalFiles * (results.totalLocales - 1)}\n`;
  report += `  Files Checked: ${results.summary.checkedFiles}\n`;
  report += `  Files with Issues: ${results.summary.filesWithIssues}\n`;
  report += `  Total Issues Found: ${results.summary.totalIssues}\n\n`;
  
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
  
  // Structure issues
  if (Object.keys(results.structureIssues).length > 0) {
    report += '❌ STRUCTURE ISSUES (Real Missing Keys):\n';
    report += '========================================\n';
    for (const [locale, files] of Object.entries(results.structureIssues)) {
      report += `\n${locale}:\n`;
      for (const [file, issues] of Object.entries(files)) {
        report += `  ${file} (${issues.length} issues):\n`;
        for (const issue of issues) {
          report += `    - ${issue.path}: ${issue.issue}\n`;
          if (issue.enType && issue.localeType) {
            report += `      EN: ${issue.enType}, Locale: ${issue.localeType}\n`;
          }
        }
      }
    }
    report += '\n';
  } else {
    report += '✅ All locales have complete structure (no missing keys)\n\n';
  }
  
  // Final summary
  report += '========================================\n';
  const incompleteLocales = locales.filter(locale => 
    locale !== 'en' && 
    (!results.completeLocales.includes(locale) || 
     results.missingFiles[locale] || 
     results.structureIssues[locale])
  );
  
  if (incompleteLocales.length === 0) {
    report += '✅ ALL TRANSLATIONS COMPLETE!\n';
    report += '   All locales have the same structure as English.\n';
    report += '   Arrays are properly structured.\n';
    report += '   No missing keys found.\n';
  } else {
    report += `❌ LOCALES NEEDING FIXES: ${incompleteLocales.join(', ')}\n`;
    
    // Detailed breakdown by locale
    report += '\nDetailed Breakdown:\n';
    for (const locale of incompleteLocales) {
      report += `\n${locale}:\n`;
      if (results.missingFiles[locale]) {
        report += `  Missing Files: ${results.missingFiles[locale].join(', ')}\n`;
      }
      if (results.structureIssues[locale]) {
        const totalIssues = Object.values(results.structureIssues[locale])
          .reduce((sum, issues) => sum + issues.length, 0);
        report += `  Structure Issues: ${totalIssues} across ${Object.keys(results.structureIssues[locale]).length} file(s)\n`;
      }
    }
  }
  report += '========================================\n';
  
  return report;
}

// Run check and generate report
const results = checkTranslations();
const report = generateReport(results);

console.log(report);

// Save report to file
const reportPath = path.join(__dirname, 'i18n-translation-completeness-report-advanced.txt');
fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`\n📄 Advanced report saved to: ${reportPath}\n`);

// Export for use in other scripts
module.exports = { checkTranslations, generateReport };
