#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
404 页面多语言支持审计脚本
检查：
1. 是否存在 not-found.tsx 文件
2. 404 页面是否支持多语言
3. 翻译文件中是否有 404 相关文本
"""

import json
import sys
from pathlib import Path

# 设置输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

LANGUAGES = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro']

def check_not_found_files():
    """检查是否存在 not-found.tsx 文件"""
    issues = []
    
    # 检查根目录的 not-found.tsx
    root_not_found = Path('app/not-found.tsx')
    locale_not_found = Path('app/[locale]/not-found.tsx')
    
    if not root_not_found.exists() and not locale_not_found.exists():
        issues.append({
            'type': 'missing_file',
            'severity': 'error',
            'issue': '未找到 not-found.tsx 文件',
            'location': 'app/ 或 app/[locale]/',
            'description': 'Next.js App Router 需要 not-found.tsx 文件来处理 404 错误'
        })
    elif root_not_found.exists() and not locale_not_found.exists():
        issues.append({
            'type': 'wrong_location',
            'severity': 'warning',
            'issue': 'not-found.tsx 在根目录，但应该在 [locale] 目录下以支持多语言',
            'location': 'app/not-found.tsx',
            'description': '建议移动到 app/[locale]/not-found.tsx 以支持多语言 404 页面'
        })
    elif locale_not_found.exists():
        # 检查文件内容
        with open(locale_not_found, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否使用了翻译
        if 'useTranslations' not in content and 'getTranslations' not in content:
            issues.append({
                'type': 'no_translation',
                'severity': 'error',
                'issue': 'not-found.tsx 未使用翻译函数',
                'location': 'app/[locale]/not-found.tsx',
                'description': '404 页面应该使用 next-intl 的翻译函数来显示多语言内容'
            })
        
        # 检查是否使用了 next-intl
        if 'next-intl' not in content:
            issues.append({
                'type': 'no_next_intl',
                'severity': 'error',
                'issue': 'not-found.tsx 未导入 next-intl',
                'location': 'app/[locale]/not-found.tsx',
                'description': '404 页面需要导入 next-intl 以支持多语言'
            })
    
    return issues

def check_404_translations():
    """检查翻译文件中是否有 404 相关文本"""
    issues = []
    
    # 检查英文版本
    en_files = ['index.json', 'faq.json']
    has_404_keys = False
    
    for filename in en_files:
        file_path = Path(f'messages/en/{filename}')
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 检查是否有 404 相关的键
            if 'notFound' in data or '404' in str(data).lower() or 'pageNotFound' in str(data).lower():
                has_404_keys = True
                break
    
    if not has_404_keys:
        issues.append({
            'type': 'missing_translation',
            'severity': 'error',
            'issue': '翻译文件中缺少 404 页面相关文本',
            'location': 'messages/en/',
            'description': '需要在翻译文件中添加 404 页面的标题、描述等文本'
        })
    
    # 检查其他语言
    for lang in LANGUAGES:
        if lang == 'en':
            continue
        
        for filename in en_files:
            file_path = Path(f'messages/{lang}/{filename}')
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # 如果英文有 404 键，检查其他语言是否也有
                if has_404_keys and ('notFound' not in data and '404' not in str(data).lower() and 'pageNotFound' not in str(data).lower()):
                    issues.append({
                        'type': 'missing_translation',
                        'severity': 'warning',
                        'issue': f'{lang} 语言缺少 404 页面翻译',
                        'location': f'messages/{lang}/{filename}',
                        'description': f'需要为 {lang} 语言添加 404 页面翻译'
                    })
    
    return issues

def check_not_found_calls():
    """检查代码中 notFound() 的调用情况"""
    issues = []
    
    # 检查 FAQ 文章页面
    faq_slug_page = Path('app/[locale]/faq/[slug]/page.tsx')
    if faq_slug_page.exists():
        with open(faq_slug_page, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'notFound()' in content:
            # 检查是否有对应的 not-found.tsx
            if not Path('app/[locale]/not-found.tsx').exists():
                issues.append({
                    'type': 'missing_handler',
                    'severity': 'error',
                    'issue': '代码中调用了 notFound() 但缺少 not-found.tsx 文件',
                    'location': 'app/[locale]/faq/[slug]/page.tsx',
                    'description': '当访问无效 slug 时会调用 notFound()，但缺少对应的 404 页面组件'
                })
    
    return issues

def main():
    print("=" * 80)
    print("404 页面多语言支持审计")
    print("=" * 80)
    print()
    
    all_issues = []
    
    # 1. 检查 not-found.tsx 文件
    print("1. 检查 not-found.tsx 文件...")
    file_issues = check_not_found_files()
    all_issues.extend(file_issues)
    print(f"   发现 {len(file_issues)} 个问题")
    
    # 2. 检查翻译文件
    print("\n2. 检查翻译文件中的 404 文本...")
    translation_issues = check_404_translations()
    all_issues.extend(translation_issues)
    print(f"   发现 {len(translation_issues)} 个问题")
    
    # 3. 检查 notFound() 调用
    print("\n3. 检查 notFound() 调用...")
    call_issues = check_not_found_calls()
    all_issues.extend(call_issues)
    print(f"   发现 {len(call_issues)} 个问题")
    
    # 汇总报告
    print("\n" + "=" * 80)
    print("问题汇总")
    print("=" * 80)
    
    if not all_issues:
        print("\n[SUCCESS] 未发现 404 页面相关问题！")
    else:
        error_count = len([i for i in all_issues if i['severity'] == 'error'])
        warning_count = len([i for i in all_issues if i['severity'] == 'warning'])
        
        print(f"\n总计: {len(all_issues)} 个问题")
        print(f"  - 错误: {error_count}")
        print(f"  - 警告: {warning_count}")
        
        print("\n详细问题列表:")
        for i, issue in enumerate(all_issues, 1):
            severity_mark = '[ERROR]' if issue['severity'] == 'error' else '[WARNING]'
            print(f"\n{i}. {severity_mark} [{issue['type'].upper()}]")
            print(f"   问题: {issue['issue']}")
            print(f"   位置: {issue['location']}")
            print(f"   说明: {issue['description']}")
    
    # 保存详细报告
    report_file = Path('404_audit_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(all_issues, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 80)
    print(f"详细报告已保存到: {report_file}")
    print("=" * 80)
    
    return all_issues

if __name__ == '__main__':
    main()
