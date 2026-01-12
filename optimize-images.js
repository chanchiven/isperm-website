const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 桌面端优化配置
const desktopConfig = {
  // Hero Banner
  'banner (1).webp': { width: 1920, height: 1080, fit: 'cover' },
  'banner (2).webp': { width: 1920, height: 1080, fit: 'cover' },
  'banner (3).webp': { width: 1920, height: 1080, fit: 'cover' },
  
  // 产品封面
  'nexus-dx1-cover.webp': { width: 600, height: 450, fit: 'contain' },
  'msqa-100-cover.webp': { width: 600, height: 450, fit: 'contain' },
  'sqa-6100vet-cover.webp': { width: 600, height: 450, fit: 'contain' },
  
  // Nexus Dx1 产品详情
  'nexus-dx1.webp': { width: 700, height: 394, fit: 'contain' },
  'nexus-dx1-2.webp': { width: 700, height: 394, fit: 'contain' },
  'nexus-dx1-3.webp': { width: 700, height: 394, fit: 'contain' },
  'nexus-dx1-4.webp': { width: 700, height: 394, fit: 'contain' },
  
  // MSQA-100 产品详情
  'MSQA-100/msqa-100-1.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-2.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-3.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-4.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-5.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-6.webp': { width: 800, height: 600, fit: 'contain' },
  'MSQA-100/msqa-100-7.webp': { width: 800, height: 600, fit: 'contain' },
  
  // SQA-6100vet 产品详情
  'sqa-6100vet-1.webp': { width: 700, height: 525, fit: 'contain' },
  'sqa-6100vet-2.webp': { width: 700, height: 525, fit: 'contain' },
  'sqa-6100vet-3.webp': { width: 700, height: 525, fit: 'contain' },
  'sqa-6100vet-4.webp': { width: 700, height: 525, fit: 'contain' },
  
  // About 页面
  'About iSperm.webp': { width: 600, height: 450, fit: 'cover' },
  'About us (1).webp': { width: 600, height: 400, fit: 'cover' },
  'About us (2).webp': { width: 600, height: 400, fit: 'cover' },
  'About Us 2.webp': { width: 600, height: 400, fit: 'cover' },
  'About Us 4.webp': { width: 600, height: 400, fit: 'cover' },
  'About Us 5.webp': { width: 600, height: 400, fit: 'cover' },
  'About Us.webp': { width: 600, height: 400, fit: 'cover' },
  'Zhuang Bin.jpg': { width: 400, height: 500, fit: 'cover' },
  
  // Knowledge Hub 固定高度
  'Knowledge Hub/Human Semen Analysis Standards/Human Semen Analysis Standards.webp': { width: 400, height: 240, fit: 'contain' },
  'WHO6.webp': { width: 400, height: 240, fit: 'contain' },
  'ISO.webp': { width: 400, height: 240, fit: 'contain' },
  'ESHRE.webp': { width: 400, height: 240, fit: 'contain' },
  'ASRM.webp': { width: 400, height: 240, fit: 'contain' },
  
  // Knowledge Hub 自适应高度（使用350px作为推荐值）
  'Knowledge Hub/Bull Breeding Soundness Guide/Bull Breeding Soundness Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Canine Semen Analysis Guide/Canine Semen Analysis Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Poultry Semen Analysis Guide/Poultry Semen Analysis Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Stallion Semen Analysis Guide/Stallion Semen Analysis Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Camelid Andrology Guide/Camelid Andrology Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Fish Semen Analysis Guide/Fish Semen Analysis Guide.webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Ram Breeding Soundness Examination (RBSE)/Ram Breeding Soundness Examination (RBSE).webp': { width: 400, height: 350, fit: 'contain' },
  'Knowledge Hub/Boar Semen Evaluation Guide/Boar Semen Evaluation Guide.webp': { width: 400, height: 350, fit: 'contain' },
  
  // 背景图片
  'Advanced Technology.webp': { width: 1200, height: 800, fit: 'cover' },
  
  // 奖项图片
  'awards/About iSperm.jpg': { width: 600, height: 400, fit: 'cover' },
  'awards/TEAM2.JPG': { width: 600, height: 400, fit: 'cover' },
  'awards/TEAM3.JPG': { width: 600, height: 400, fit: 'cover' },
  'awards/TEAM4.JPG': { width: 600, height: 400, fit: 'cover' },
  'awards/TEAM5.jpg': { width: 600, height: 400, fit: 'cover' },
};

// 移动端优化配置
const mobileConfig = {
  // Hero Banner
  'banner (1).webp': { width: 768, height: 1024, fit: 'cover' },
  'banner (2).webp': { width: 768, height: 1024, fit: 'cover' },
  'banner (3).webp': { width: 768, height: 1024, fit: 'cover' },
  
  // 产品封面
  'nexus-dx1-cover.webp': { width: 400, height: 300, fit: 'contain' },
  'msqa-100-cover.webp': { width: 400, height: 300, fit: 'contain' },
  'sqa-6100vet-cover.webp': { width: 400, height: 300, fit: 'contain' },
  
  // Nexus Dx1 产品详情
  'nexus-dx1.webp': { width: 768, height: 432, fit: 'contain' },
  'nexus-dx1-2.webp': { width: 768, height: 432, fit: 'contain' },
  'nexus-dx1-3.webp': { width: 768, height: 432, fit: 'contain' },
  'nexus-dx1-4.webp': { width: 768, height: 432, fit: 'contain' },
  
  // MSQA-100 产品详情
  'MSQA-100/msqa-100-1.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-2.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-3.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-4.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-5.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-6.webp': { width: 768, height: 576, fit: 'contain' },
  'MSQA-100/msqa-100-7.webp': { width: 768, height: 576, fit: 'contain' },
  
  // SQA-6100vet 产品详情
  'sqa-6100vet-1.webp': { width: 768, height: 576, fit: 'contain' },
  'sqa-6100vet-2.webp': { width: 768, height: 576, fit: 'contain' },
  'sqa-6100vet-3.webp': { width: 768, height: 576, fit: 'contain' },
  'sqa-6100vet-4.webp': { width: 768, height: 576, fit: 'contain' },
  
  // About 页面
  'About iSperm.webp': { width: 400, height: 300, fit: 'cover' },
  'About us (1).webp': { width: 400, height: 266, fit: 'cover' },
  'About us (2).webp': { width: 400, height: 266, fit: 'cover' },
  'About Us 2.webp': { width: 400, height: 266, fit: 'cover' },
  'About Us 4.webp': { width: 400, height: 266, fit: 'cover' },
  'About Us 5.webp': { width: 400, height: 266, fit: 'cover' },
  'About Us.webp': { width: 400, height: 266, fit: 'cover' },
  'Zhuang Bin.jpg': { width: 300, height: 375, fit: 'cover' },
  
  // Knowledge Hub 固定高度
  'Knowledge Hub/Human Semen Analysis Standards/Human Semen Analysis Standards.webp': { width: 400, height: 240, fit: 'contain' },
  'WHO6.webp': { width: 400, height: 240, fit: 'contain' },
  'ISO.webp': { width: 400, height: 240, fit: 'contain' },
  'ESHRE.webp': { width: 400, height: 240, fit: 'contain' },
  'ASRM.webp': { width: 400, height: 240, fit: 'contain' },
  
  // Knowledge Hub 自适应高度（移动端使用300px）
  'Knowledge Hub/Bull Breeding Soundness Guide/Bull Breeding Soundness Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Canine Semen Analysis Guide/Canine Semen Analysis Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Poultry Semen Analysis Guide/Poultry Semen Analysis Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Stallion Semen Analysis Guide/Stallion Semen Analysis Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Camelid Andrology Guide/Camelid Andrology Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Fish Semen Analysis Guide/Fish Semen Analysis Guide.webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Ram Breeding Soundness Examination (RBSE)/Ram Breeding Soundness Examination (RBSE).webp': { width: 400, height: 300, fit: 'contain' },
  'Knowledge Hub/Boar Semen Evaluation Guide/Boar Semen Evaluation Guide.webp': { width: 400, height: 300, fit: 'contain' },
  
  // 背景图片
  'Advanced Technology.webp': { width: 800, height: 533, fit: 'cover' },
  
  // 奖项图片
  'awards/About iSperm.jpg': { width: 400, height: 266, fit: 'cover' },
  'awards/TEAM2.JPG': { width: 400, height: 266, fit: 'cover' },
  'awards/TEAM3.JPG': { width: 400, height: 266, fit: 'cover' },
  'awards/TEAM4.JPG': { width: 400, height: 266, fit: 'cover' },
  'awards/TEAM5.jpg': { width: 400, height: 266, fit: 'cover' },
};

const publicDir = path.join(__dirname, 'public');

// 优化单张图片
async function optimizeImage(imagePath, config, outputPath, mode = 'desktop') {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    let pipeline = image.resize({
      width: config.width,
      height: config.height,
      fit: config.fit || 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 } // 白色背景（用于contain模式）
    });
    
    // 根据文件扩展名选择格式和质量
    const ext = path.extname(outputPath).toLowerCase();
    if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: 85 });
    } else if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: 85, compressionLevel: 9 });
    }
    
    // 如果输出路径和输入路径相同，使用临时文件
    const isSameFile = path.resolve(imagePath) === path.resolve(outputPath);
    let finalOutputPath = outputPath;
    
    if (isSameFile) {
      // 使用临时文件
      const tempPath = outputPath + '.tmp_' + Date.now();
      await pipeline.toFile(tempPath);
      
      // 等待一下，确保文件写入完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 删除原文件（重试机制）
      let retries = 5;
      while (retries > 0) {
        try {
          fs.unlinkSync(imagePath);
          break;
        } catch (e) {
          if (e.code === 'EBUSY' || e.code === 'ENOENT') {
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 200));
            } else {
              // 如果删除失败，清理临时文件
              try {
                fs.unlinkSync(tempPath);
              } catch (e2) {
                // 忽略清理错误
              }
              throw new Error(`无法删除原文件: ${e.message}`);
            }
          } else {
            throw e;
          }
        }
      }
      
      // 重命名临时文件
      fs.renameSync(tempPath, outputPath);
    } else {
      await pipeline.toFile(outputPath);
    }
    
    const stats = fs.statSync(outputPath);
    const originalStats = fs.statSync(imagePath);
    const saved = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
    
    return {
      success: true,
      originalSize: originalStats.size,
      newSize: stats.size,
      saved: saved
    };
  } catch (error) {
    // 如果出错且使用了临时文件，清理临时文件
    const tempPath = outputPath + '.tmp';
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // 忽略清理错误
      }
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// 优化桌面端图片（先优化到临时目录，再批量替换）
async function optimizeDesktop() {
  console.log('🖥️  开始优化桌面端图片...\n');
  
  // 创建临时目录
  const tempDir = path.join(__dirname, 'public_desktop_temp');
  if (fs.existsSync(tempDir)) {
    // 清理旧的临时目录
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const results = [];
  const optimizedFiles = []; // 记录成功优化的文件
  
  // 第一步：优化到临时目录
  for (const [relativePath, config] of Object.entries(desktopConfig)) {
    const imagePath = path.join(publicDir, relativePath);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  文件不存在，跳过: ${relativePath}`);
      skipCount++;
      continue;
    }
    
    // 输出到临时目录，保持目录结构
    const tempOutputPath = path.join(tempDir, relativePath);
    const tempOutputDir = path.dirname(tempOutputPath);
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true });
    }
    
    console.log(`📸 正在处理: ${relativePath}`);
    const result = await optimizeImage(imagePath, config, tempOutputPath, 'desktop');
    
    if (result.success) {
      const sizeMB = (result.newSize / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ 优化完成 | 新尺寸: ${config.width}×${config.height} | 大小: ${sizeMB}MB`);
      optimizedFiles.push({ relativePath, tempPath: tempOutputPath, originalPath: imagePath });
      results.push({
        file: relativePath,
        status: 'optimized',
        size: sizeMB + 'MB',
        saved: result.saved + '%'
      });
    } else {
      console.log(`   ❌ 失败: ${result.error}`);
      errorCount++;
      results.push({
        file: relativePath,
        status: 'error',
        error: result.error
      });
    }
  }
  
  // 第二步：批量替换文件
  console.log(`\n🔄 开始替换原文件...`);
  let replaceSuccess = 0;
  let replaceFailed = 0;
  
  for (const { relativePath, tempPath, originalPath } of optimizedFiles) {
    try {
      // 重试替换机制
      let retries = 10;
      let replaced = false;
      
      while (retries > 0 && !replaced) {
        try {
          // 先删除原文件
          if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
          }
          // 复制临时文件到原位置
          const targetDir = path.dirname(originalPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.copyFileSync(tempPath, originalPath);
          replaced = true;
          replaceSuccess++;
          console.log(`   ✅ 已替换: ${relativePath}`);
        } catch (e) {
          if (e.code === 'EBUSY' || e.code === 'EPERM') {
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms
            } else {
              replaceFailed++;
              console.log(`   ⚠️  替换失败（文件被锁定）: ${relativePath}`);
              results.find(r => r.file === relativePath).status = 'optimized_but_not_replaced';
              results.find(r => r.file === relativePath).error = `文件被锁定，优化后的文件保存在: ${tempPath}`;
            }
          } else {
            throw e;
          }
        }
      }
    } catch (error) {
      replaceFailed++;
      console.log(`   ❌ 替换失败: ${relativePath} - ${error.message}`);
      results.find(r => r.file === relativePath).status = 'error';
      results.find(r => r.file === relativePath).error = error.message;
    }
  }
  
  // 清理临时目录（只保留未能替换的文件）
  if (replaceFailed === 0) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`\n🧹 临时文件已清理`);
  } else {
    console.log(`\n⚠️  有 ${replaceFailed} 个文件未能替换，优化后的文件保存在: ${tempDir}`);
  }
  
  successCount = replaceSuccess;
  
  console.log(`\n📊 桌面端优化完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ⏭️  跳过: ${skipCount}`);
  console.log(`   ⚠️  优化但未替换: ${replaceFailed}`);
  console.log(`   ❌ 失败: ${errorCount}`);
  
  return results;
}

// 优化移动端图片（生成到mobile目录）
async function optimizeMobile() {
  console.log('\n📱 开始优化移动端图片...\n');
  
  const mobileDir = path.join(publicDir, 'mobile');
  if (!fs.existsSync(mobileDir)) {
    fs.mkdirSync(mobileDir, { recursive: true });
  }
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const results = [];
  
  for (const [relativePath, config] of Object.entries(mobileConfig)) {
    const imagePath = path.join(publicDir, relativePath);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  源文件不存在，跳过: ${relativePath}`);
      skipCount++;
      continue;
    }
    
    // 保持目录结构
    const mobileOutputPath = path.join(mobileDir, relativePath);
    const mobileOutputDir = path.dirname(mobileOutputPath);
    if (!fs.existsSync(mobileOutputDir)) {
      fs.mkdirSync(mobileOutputDir, { recursive: true });
    }
    
    console.log(`📸 正在处理: ${relativePath}`);
    const result = await optimizeImage(imagePath, config, mobileOutputPath, 'mobile');
    
    if (result.success) {
      const sizeMB = (result.newSize / (1024 * 1024)).toFixed(2);
      console.log(`   ✅ 完成 | 新尺寸: ${config.width}×${config.height} | 大小: ${sizeMB}MB`);
      successCount++;
      results.push({
        file: relativePath,
        status: 'success',
        size: sizeMB + 'MB'
      });
    } else {
      console.log(`   ❌ 失败: ${result.error}`);
      errorCount++;
      results.push({
        file: relativePath,
        status: 'error',
        error: result.error
      });
    }
  }
  
  console.log(`\n📊 移动端优化完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ⏭️  跳过: ${skipCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);
  
  return results;
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('🎨 图片尺寸优化工具');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // 先优化桌面端（替换原文件）
    const desktopResults = await optimizeDesktop();
    
    // 然后优化移动端（生成到mobile目录）
    const mobileResults = await optimizeMobile();
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ 所有优化完成！');
    console.log('='.repeat(60));
    
    // 保存优化报告
    const report = {
      timestamp: new Date().toISOString(),
      desktop: {
        total: desktopResults.length,
        success: desktopResults.filter(r => r.status === 'success').length,
        errors: desktopResults.filter(r => r.status === 'error').length,
        results: desktopResults
      },
      mobile: {
        total: mobileResults.length,
        success: mobileResults.filter(r => r.status === 'success').length,
        errors: mobileResults.filter(r => r.status === 'error').length,
        results: mobileResults
      }
    };
    
    fs.writeFileSync(
      path.join(__dirname, '图片优化报告.json'),
      JSON.stringify(report, null, 2),
      'utf-8'
    );
    
    console.log('\n📄 优化报告已保存到: 图片优化报告.json');
    
  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

// 运行
main().catch(console.error);
