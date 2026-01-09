const fs = require('fs');
const path = require('path');

// 从 routing.ts 获取所有支持的语言
const locales = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];

// 英文版本的文件列表（source of truth）
const requiredFiles = ['about.json', 'contact.json', 'faq.json', 'index.json', 'products.json'];

// 递归获取对象的所有键（包括嵌套键）
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// 检查翻译完整性
function checkTranslations() {
  const results = {
    missingFiles: {},
    missingKeys: {},
    extraKeys: {},
    totalLocales: locales.length,
    checkedLocales: 0,
    completeLocales: []
  };

  // 读取英文版本作为参考
  const enFiles = {};
  for (const file of requiredFiles) {
    try {
      const filePath = path.join(__dirname, 'messages', 'en', file);
      const content = fs.readFileSync(filePath, 'utf-8');
      enFiles[file] = JSON.parse(content);
    } catch (error) {
      console.error(`Error reading en/${file}:`, error.message);
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

    // 检查每个必需文件
    for (const file of requiredFiles) {
      const filePath = path.join(localePath, file);
      
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        if (!results.missingFiles[locale]) {
          results.missingFiles[locale] = [];
        }
        results.missingFiles[locale].push(file);
        continue;
      }

      // 检查键值完整性
      try {
        const enContent = enFiles[file];
        const localeContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        const enKeys = getAllKeys(enContent).sort();
        const localeKeys = getAllKeys(localeContent).sort();
        
        const missing = enKeys.filter(key => !localeKeys.includes(key));
        const extra = localeKeys.filter(key => !enKeys.includes(key));
        
        if (missing.length > 0) {
          if (!results.missingKeys[locale]) {
            results.missingKeys[locale] = {};
          }
          results.missingKeys[locale][file] = missing;
        }
        
        if (extra.length > 0) {
          if (!results.extraKeys[locale]) {
            results.extraKeys[locale] = {};
          }
          results.extraKeys[locale][file] = extra;
        }
      } catch (error) {
        console.error(`Error checking ${locale}/${file}:`, error.message);
      }
    }

    results.checkedLocales++;
    
    // 检查该语言是否完整
    const hasAllFiles = requiredFiles.every(file => 
      fs.existsSync(path.join(localePath, file))
    );
    const hasNoMissingKeys = !results.missingKeys[locale] || 
      Object.keys(results.missingKeys[locale]).length === 0;
    
    if (hasAllFiles && hasNoMissingKeys) {
      results.completeLocales.push(locale);
    }
  }

  return results;
}

// 生成报告
function generateReport(results) {
  console.log('\n========================================');
  console.log('翻译完整性检查报告');
  console.log('========================================\n');
  
  console.log(`总语言数: ${results.totalLocales}`);
  console.log(`已检查语言数: ${results.checkedLocales}`);
  console.log(`完整翻译语言数: ${results.completeLocales.length}`);
  console.log(`完整翻译语言: ${results.completeLocales.join(', ') || '无'}\n`);

  // 缺失文件报告
  if (Object.keys(results.missingFiles).length > 0) {
    console.log('❌ 缺失文件:');
    for (const [locale, files] of Object.entries(results.missingFiles)) {
      console.log(`  ${locale}:`);
      for (const file of files) {
        console.log(`    - ${file}`);
      }
    }
    console.log('');
  } else {
    console.log('✅ 所有语言都有必需的文件\n');
  }

  // 缺失键值报告
  if (Object.keys(results.missingKeys).length > 0) {
    console.log('❌ 缺失键值:');
    for (const [locale, files] of Object.entries(results.missingKeys)) {
      console.log(`  ${locale}:`);
      for (const [file, keys] of Object.entries(files)) {
        console.log(`    ${file}:`);
        for (const key of keys) {
          console.log(`      - ${key}`);
        }
      }
    }
    console.log('');
  } else {
    console.log('✅ 所有语言的键值都完整\n');
  }

  // 多余键值报告（警告）
  if (Object.keys(results.extraKeys).length > 0) {
    console.log('⚠️  多余键值（不在英文版本中）:');
    for (const [locale, files] of Object.entries(results.extraKeys)) {
      console.log(`  ${locale}:`);
      for (const [file, keys] of Object.entries(files)) {
        console.log(`    ${file}:`);
        for (const key of keys) {
          console.log(`      - ${key}`);
        }
      }
    }
    console.log('');
  }

  // 总结
  console.log('========================================');
  const incompleteLocales = locales.filter(locale => 
    locale !== 'en' && 
    (!results.completeLocales.includes(locale) || 
     results.missingFiles[locale] || 
     results.missingKeys[locale])
  );
  
  if (incompleteLocales.length === 0) {
    console.log('✅ 所有语言翻译完整！');
  } else {
    console.log(`❌ 需要修复的语言: ${incompleteLocales.join(', ')}`);
  }
  console.log('========================================\n');
}

// 运行检查
const results = checkTranslations();
generateReport(results);

// 导出结果供其他脚本使用
if (require.main === module) {
  // 如果直接运行此脚本，只生成报告
} else {
  module.exports = { checkTranslations, generateReport };
}








