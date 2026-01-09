#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 与元数据审计脚本
检查：
1. Metadata 验证（title 和 description）
2. ALT 标签检查
3. Hreflang 检查
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Any

# 所有支持的语言
LANGUAGES = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro']

# 需要检查的页面类型
PAGES = {
    'index': {
        'file': 'index.json',
        'meta_keys': ['meta.title', 'meta.description'],
        'page_path': '/'
    },
    'about': {
        'file': 'about.json',
        'meta_keys': ['meta.title', 'meta.description'],
        'page_path': '/about'
    },
    'contact': {
        'file': 'contact.json',
        'meta_keys': ['meta.title', 'meta.description'],
        'page_path': '/contact'
    },
    'products': {
        'file': 'products.json',
        'meta_keys': ['meta.title', 'meta.description'],
        'page_path': '/products'
    },
    'faq': {
        'file': 'faq.json',
        'meta_keys': ['meta.title', 'meta.description'],
        'page_path': '/faq'
    },
    'nexus-dx1': {
        'file': 'products.json',
        'meta_keys': ['products.nexusMeta.title', 'products.nexusMeta.description'],
        'page_path': '/products/nexus-dx1'
    },
    'msqa-100': {
        'file': 'products.json',
        'meta_keys': ['products.msqaMeta.title', 'products.msqaMeta.description'],
        'page_path': '/products/msqa-100'
    },
    'sqa-6100vet': {
        'file': 'products.json',
        'meta_keys': ['products.sqavetMeta.title', 'products.sqavetMeta.description'],
        'page_path': '/products/sqa-6100vet'
    }
}

def get_nested_value(obj: Any, key_path: str) -> Any:
    """根据键路径获取嵌套值"""
    keys = key_path.split('.')
    current = obj
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return None
    return current

def check_metadata():
    """检查所有页面的 metadata"""
    issues = []
    base_dir = Path('messages')
    
    for page_name, page_info in PAGES.items():
        filename = page_info['file']
        meta_keys = page_info['meta_keys']
        
        # 检查英文版本（作为参考）
        en_file = base_dir / 'en' / filename
        if not en_file.exists():
            issues.append({
                'type': 'metadata',
                'page': page_name,
                'issue': f'英文文件不存在: {filename}',
                'severity': 'error'
            })
            continue
        
        with open(en_file, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        
        # 检查英文版本是否有所有必需的键
        for key in meta_keys:
            value = get_nested_value(en_data, key)
            if not value or not isinstance(value, str) or len(value.strip()) == 0:
                issues.append({
                    'type': 'metadata',
                    'page': page_name,
                    'key': key,
                    'issue': f'英文版本缺少或为空: {key}',
                    'severity': 'error'
                })
        
        # 检查其他语言
        for lang in LANGUAGES:
            if lang == 'en':
                continue
            
            lang_file = base_dir / lang / filename
            if not lang_file.exists():
                issues.append({
                    'type': 'metadata',
                    'page': page_name,
                    'language': lang,
                    'issue': f'文件不存在: {lang}/{filename}',
                    'severity': 'error'
                })
                continue
            
            try:
                with open(lang_file, 'r', encoding='utf-8') as f:
                    lang_data = json.load(f)
                
                for key in meta_keys:
                    value = get_nested_value(lang_data, key)
                    if not value or not isinstance(value, str) or len(value.strip()) == 0:
                        issues.append({
                            'type': 'metadata',
                            'page': page_name,
                            'language': lang,
                            'key': key,
                            'issue': f'缺少或为空: {key}',
                            'severity': 'error'
                        })
                    else:
                        # 检查是否只是键路径（翻译失败）
                        if value == key or value.startswith(key.split('.')[0] + '.'):
                            issues.append({
                                'type': 'metadata',
                                'page': page_name,
                                'language': lang,
                                'key': key,
                                'issue': f'翻译失败，返回了键路径: {value}',
                                'severity': 'error'
                            })
            except json.JSONDecodeError as e:
                issues.append({
                    'type': 'metadata',
                    'page': page_name,
                    'language': lang,
                    'issue': f'JSON 解析错误: {str(e)}',
                    'severity': 'error'
                })
            except Exception as e:
                issues.append({
                    'type': 'metadata',
                    'page': page_name,
                    'language': lang,
                    'issue': f'读取文件错误: {str(e)}',
                    'severity': 'error'
                })
    
    return issues

def check_alt_tags():
    """检查图片 ALT 标签是否本地化"""
    issues = []
    
    # 检查 FAQ 文章的 alt 属性
    faq_file = Path('messages/en/faq.json')
    if faq_file.exists():
        with open(faq_file, 'r', encoding='utf-8') as f:
            en_faq = json.load(f)
        
        # 获取所有文章的 alt 键
        articles = en_faq.get('articles', {})
        for slug, article_data in articles.items():
            if 'alt' in article_data:
                # 检查其他语言
                for lang in LANGUAGES:
                    if lang == 'en':
                        continue
                    
                    lang_faq_file = Path(f'messages/{lang}/faq.json')
                    if not lang_faq_file.exists():
                        issues.append({
                            'type': 'alt',
                            'article': slug,
                            'language': lang,
                            'issue': 'FAQ 文件不存在',
                            'severity': 'error'
                        })
                        continue
                    
                    try:
                        with open(lang_faq_file, 'r', encoding='utf-8') as f:
                            lang_faq = json.load(f)
                        
                        article = lang_faq.get('articles', {}).get(slug, {})
                        if 'alt' not in article or not article['alt'] or len(article['alt'].strip()) == 0:
                            issues.append({
                                'type': 'alt',
                                'article': slug,
                                'language': lang,
                                'issue': '缺少 alt 属性',
                                'severity': 'error'
                            })
                    except Exception as e:
                        issues.append({
                            'type': 'alt',
                            'article': slug,
                            'language': lang,
                            'issue': f'读取文件错误: {str(e)}',
                            'severity': 'error'
                        })
    
    # 检查硬编码的 alt 属性（在代码中）
    # 这些需要手动检查
    hardcoded_alt_files = [
        'app/[locale]/about/page.tsx',
        'app/[locale]/page.tsx'
    ]
    
    for file_path in hardcoded_alt_files:
        file = Path(file_path)
        if file.exists():
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 查找硬编码的 alt 属性（不包含翻译函数调用）
            alt_pattern = r'alt=["\']([^"\']+)["\']'
            matches = re.finditer(alt_pattern, content)
            for match in matches:
                alt_text = match.group(1)
                # 检查是否使用了翻译函数
                if 't(' not in alt_text and 'getT(' not in alt_text and '${' not in alt_text:
                    issues.append({
                        'type': 'alt',
                        'file': file_path,
                        'issue': f'发现硬编码的 alt 属性: {alt_text[:50]}...',
                        'severity': 'warning'
                    })
    
    return issues

def check_hreflang():
    """检查 hreflang 标签"""
    issues = []
    
    # 检查 layout.tsx 是否有 hreflang 实现
    layout_file = Path('app/[locale]/layout.tsx')
    if layout_file.exists():
        with open(layout_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'hreflang' not in content.lower() and 'alternate' not in content.lower():
            issues.append({
                'type': 'hreflang',
                'issue': 'layout.tsx 中未找到 hreflang 标签实现',
                'severity': 'error'
            })
    
    # 检查是否有 sitemap.xml 包含 hreflang
    sitemap_file = Path('sitemap.xml')
    if sitemap_file.exists():
        with open(sitemap_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'hreflang' in content.lower():
            # 检查是否包含所有语言
            for lang in LANGUAGES:
                if f'hreflang="{lang}"' not in content:
                    issues.append({
                        'type': 'hreflang',
                        'language': lang,
                        'issue': f'sitemap.xml 中缺少 {lang} 的 hreflang',
                        'severity': 'warning'
                    })
        else:
            issues.append({
                'type': 'hreflang',
                'issue': 'sitemap.xml 中未找到 hreflang 标签',
                'severity': 'warning'
            })
    else:
        issues.append({
            'type': 'hreflang',
            'issue': 'sitemap.xml 文件不存在',
            'severity': 'warning'
        })
    
    return issues

def main():
    print("=" * 80)
    print("SEO 与元数据审计报告")
    print("=" * 80)
    print()
    
    all_issues = []
    
    # 1. Metadata 验证
    print("1. 检查 Metadata (title 和 description)...")
    metadata_issues = check_metadata()
    all_issues.extend(metadata_issues)
    print(f"   发现 {len(metadata_issues)} 个问题")
    
    # 2. ALT 标签检查
    print("\n2. 检查 ALT 标签...")
    alt_issues = check_alt_tags()
    all_issues.extend(alt_issues)
    print(f"   发现 {len(alt_issues)} 个问题")
    
    # 3. Hreflang 检查
    print("\n3. 检查 Hreflang 标签...")
    hreflang_issues = check_hreflang()
    all_issues.extend(hreflang_issues)
    print(f"   发现 {len(hreflang_issues)} 个问题")
    
    # 汇总报告
    print("\n" + "=" * 80)
    print("问题汇总")
    print("=" * 80)
    
    if not all_issues:
        print("\n[SUCCESS] 未发现 SEO 问题！")
    else:
        # 按类型分组
        metadata_count = len([i for i in all_issues if i['type'] == 'metadata'])
        alt_count = len([i for i in all_issues if i['type'] == 'alt'])
        hreflang_count = len([i for i in all_issues if i['type'] == 'hreflang'])
        
        print(f"\n总计: {len(all_issues)} 个问题")
        print(f"  - Metadata 问题: {metadata_count}")
        print(f"  - ALT 标签问题: {alt_count}")
        print(f"  - Hreflang 问题: {hreflang_count}")
        
        # 显示详细问题
        print("\n详细问题列表:")
        for i, issue in enumerate(all_issues, 1):
            severity = issue.get('severity', 'warning')
            severity_mark = '[ERROR]' if severity == 'error' else '[WARNING]'
            print(f"\n{i}. {severity_mark} [{issue['type'].upper()}]")
            print(f"   问题: {issue['issue']}")
            if 'page' in issue:
                print(f"   页面: {issue['page']}")
            if 'language' in issue:
                print(f"   语言: {issue['language']}")
            if 'key' in issue:
                print(f"   键: {issue['key']}")
            if 'file' in issue:
                print(f"   文件: {issue['file']}")
            if 'article' in issue:
                print(f"   文章: {issue['article']}")
    
    # 保存详细报告
    report_file = Path('seo_audit_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(all_issues, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 80)
    print(f"详细报告已保存到: {report_file}")
    print("=" * 80)

if __name__ == '__main__':
    main()
