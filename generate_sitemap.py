#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成包含所有18种语言 hreflang 的 sitemap.xml
"""

from datetime import datetime

LANGUAGES = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro']
BASE_URL = 'https://www.isperm.com'

# 主要页面路径（不包含语言前缀）
PAGES = [
    '/',
    '/about',
    '/contact',
    '/products',
    '/faq',
    '/products/nexus-dx1',
    '/products/msqa-100',
    '/products/sqa-6100vet',
]

# FAQ 文章 slugs
FAQ_SLUGS = [
    'faq-human-semen-standards',
    'faq-bull-breeding-soundness',
    'faq-canine-semen-analysis',
    'faq-poultry-semen-analysis',
    'faq-stallion-semen-analysis',
    'faq-camelid-andrology',
    'faq-fish-semen-analysis',
    'faq-ram-breeding-soundness',
    'faq-boar-semen-evaluation',
    'who-6th-edition-semen-analysis-standards',
    'iso-23162-2021-laboratory-competence-guide',
    'eshre-guidelines-clinical-semen-examination',
    'asrm-male-infertility-evaluation-protocols',
]

def generate_hreflang_links(path: str) -> str:
    """生成所有语言的 hreflang 链接"""
    links = []
    for lang in LANGUAGES:
        # 处理路径
        if path == '/':
            url = f"{BASE_URL}/{lang}/"
        else:
            clean_path = path.lstrip('/')
            url = f"{BASE_URL}/{lang}/{clean_path}"
        links.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{url}"/>')
    return '\n'.join(links)

def generate_url_entry(path: str, priority: str = '0.8', changefreq: str = 'monthly') -> str:
    """生成单个 URL 条目"""
    # 使用英文版本作为主要 URL
    if path == '/':
        main_url = f"{BASE_URL}/en/"
    else:
        clean_path = path.lstrip('/')
        main_url = f"{BASE_URL}/en/{clean_path}"
    
    hreflang_links = generate_hreflang_links(path)
    
    # 使用完整的 ISO 8601 格式（包含时间）
    lastmod = datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')
    
    return f'''  <url>
    <loc>{main_url}</loc>
{hreflang_links}
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>'''

def main():
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
'''
    
    # 主要页面
    priorities = {
        '/': '1.0',
        '/about': '0.9',
        '/contact': '0.8',
        '/products': '0.9',
        '/faq': '0.8',
        '/products/nexus-dx1': '0.9',
        '/products/msqa-100': '0.9',
        '/products/sqa-6100vet': '0.9',
    }
    
    for page in PAGES:
        priority = priorities.get(page, '0.8')
        sitemap_content += generate_url_entry(page, priority) + '\n'
    
    # FAQ 文章
    for slug in FAQ_SLUGS:
        path = f'/faq/{slug}'
        sitemap_content += generate_url_entry(path, '0.7') + '\n'
    
    sitemap_content += '</urlset>\n'
    
    # 写入文件
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print("sitemap.xml 已生成，包含所有18种语言的 hreflang 链接")

if __name__ == '__main__':
    main()
