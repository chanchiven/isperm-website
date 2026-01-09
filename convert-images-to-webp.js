const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 图片映射配置
const imageMap = {
  'WHO6.png': 'WHO6.webp',
  'ISO.png': 'ISO.webp',
  'ESHRE.png': 'ESHRE.webp',
  'ASRM.jpg': 'ASRM.webp'
};

const publicDir = path.join(__dirname, 'public');

async function convertToWebP() {
  console.log('开始转换图片为WEBP格式...\n');
  
  for (const [sourceFile, targetFile] of Object.entries(imageMap)) {
    const sourcePath = path.join(publicDir, sourceFile);
    const targetPath = path.join(publicDir, targetFile);
    
    try {
      // 检查源文件是否存在
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  源文件不存在: ${sourceFile}`);
        continue;
      }
      
      // 检查目标文件是否已存在
      if (fs.existsSync(targetPath)) {
        console.log(`⏭️  目标文件已存在，跳过: ${targetFile}`);
        continue;
      }
      
      // 转换图片
      await sharp(sourcePath)
        .webp({ quality: 85 })
        .toFile(targetPath);
      
      console.log(`✅ 成功转换: ${sourceFile} → ${targetFile}`);
    } catch (error) {
      console.error(`❌ 转换失败 ${sourceFile}:`, error.message);
    }
  }
  
  console.log('\n转换完成！');
}

// 运行转换
convertToWebP().catch(console.error);

