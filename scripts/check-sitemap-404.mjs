#!/usr/bin/env node
/**
 * 解析 sitemap.xml 中的所有 URL，并批量检查它们是否返回 404。
 */

const SITEMAP_URL = "https://www.isperm.com/sitemap.xml";

const FETCH_OPTS = {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapChecker/1.0)" },
};

async function fetchSitemap(url) {
  const res = await fetch(url, FETCH_OPTS);
  if (!res.ok) throw new Error(`获取 sitemap 失败: ${res.status}`);
  return res.text();
}

function parseUrls(xml) {
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = locRegex.exec(xml)) !== null) {
    const url = m[1].trim();
    if (url && !url.endsWith(".xml")) urls.push(url);
  }
  return [...new Set(urls)];
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", ...FETCH_OPTS });
    return { url, status: res.status, error: null };
  } catch (e) {
    return { url, status: null, error: e.message };
  }
}

async function main() {
  console.log(`正在获取 sitemap: ${SITEMAP_URL}`);
  const xml = await fetchSitemap(SITEMAP_URL);
  const urls = parseUrls(xml);
  console.log(`共找到 ${urls.length} 个 URL\n`);

  if (!urls.length) {
    console.log("未找到任何 URL");
    return;
  }

  console.log("正在批量检查...");
  const results = await Promise.all(urls.map(checkUrl));

  const notFound = results.filter((r) => r.status === 404);
  const errors = results.filter((r) => r.error);
  const ok = results.filter((r) => r.status && r.status !== 404);

  results.forEach((r, i) => {
    if (r.error) console.log(`  [${i + 1}/${urls.length}] 错误: ${r.url} - ${r.error}`);
    else if (r.status === 404) console.log(`  [${i + 1}/${urls.length}] 404: ${r.url}`);
  });

  console.log("\n" + "=".repeat(50));
  console.log("检查结果汇总");
  console.log("=".repeat(50));
  console.log(`总计: ${urls.length} 个 URL`);
  console.log(`正常: ${ok.length} 个`);
  console.log(`404:  ${notFound.length} 个`);
  console.log(`错误: ${errors.length} 个`);

  if (notFound.length) {
    console.log("\n返回 404 的 URL:");
    notFound.forEach((r) => console.log(`  - ${r.url}`));
  }
  if (errors.length) {
    console.log("\n请求失败的 URL:");
    errors.forEach((r) => console.log(`  - ${r.url}: ${r.error}`));
  }

  process.exit(notFound.length || errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
