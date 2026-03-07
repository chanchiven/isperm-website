/**
 * 为 GitHub Pages 生成 HTML 重定向文件
 * GitHub Pages 不支持 _redirects，使用 meta refresh 实现 301 效果
 */

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function createRedirectHtml(targetUrl: string): string {
  const fullUrl = targetUrl.startsWith('http') ? targetUrl : `https://www.isperm.com${targetUrl}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <link rel="canonical" href="${fullUrl}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a>...</p>
  <script>location.replace("${targetUrl.replace(/"/g, '\\"')}");</script>
</body>
</html>
`;
}

const REDIRECTS: [string, string][] = [
  // 旧式 HTML 文件
  ['index.html', '/en/'],
  ['about.html', '/en/about/'],
  ['products.html', '/en/products/'],
  // 旧式产品页
  ['products/SQA-6100vet.html', '/en/products/sqa-6100vet/'],
  // 缺少语言前缀和尾部斜杠的 FAQ
  ['faq/faq-human-semen-standards', '/en/faq/faq-human-semen-standards/'],
  ['faq/faq-bull-breeding-soundness', '/en/faq/faq-bull-breeding-soundness/'],
  ['faq/faq-canine-semen-analysis', '/en/faq/faq-canine-semen-analysis/'],
  ['faq/faq-poultry-semen-analysis', '/en/faq/faq-poultry-semen-analysis/'],
  ['faq/faq-stallion-semen-analysis', '/en/faq/faq-stallion-semen-analysis/'],
  ['faq/faq-camelid-andrology', '/en/faq/faq-camelid-andrology/'],
  ['faq/faq-fish-semen-analysis', '/en/faq/faq-fish-semen-analysis/'],
  ['faq/faq-ram-breeding-soundness', '/en/faq/faq-ram-breeding-soundness/'],
  ['faq/faq-boar-semen-evaluation', '/en/faq/faq-boar-semen-evaluation/'],
  ['faq/who-6th-edition-semen-analysis-standards', '/en/faq/who-6th-edition-semen-analysis-standards/'],
  ['faq/iso-23162-2021-laboratory-competence-guide', '/en/faq/iso-23162-2021-laboratory-competence-guide/'],
  ['faq/eshre-guidelines-clinical-semen-examination', '/en/faq/eshre-guidelines-clinical-semen-examination/'],
  ['faq/asrm-male-infertility-evaluation-protocols', '/en/faq/asrm-male-infertility-evaluation-protocols/'],
];

function main() {
  for (const [fromPath, toUrl] of REDIRECTS) {
    // GitHub Pages: /faq/xxx 无尾部斜杠时查找 faq/xxx/index.html
    const outputPath = fromPath.endsWith('.html')
      ? path.join(PUBLIC_DIR, fromPath)
      : path.join(PUBLIC_DIR, fromPath, 'index.html');

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, createRedirectHtml(toUrl), 'utf-8');
    console.log(`[redirect] ${fromPath} -> ${toUrl}`);
  }
  console.log(`[redirect] Generated ${REDIRECTS.length} redirect files`);
}

main();
