#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Translation Audit Script
检查所有语言文件与英文版本的差异：
1. Key 缺失检查
2. 占位符检查
3. HTML 标签检查
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple, Any

# 设置输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 需要检查的语言目录（排除 en）
LANGUAGES = ['ar', 'bg', 'de', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'tr', 'uk', 'vi']

# 需要检查的文件
FILES = ['about.json', 'contact.json', 'faq.json', 'index.json', 'products.json']

# 占位符模式
PLACEHOLDER_PATTERN = re.compile(r'\{[^}]+\}')

# HTML 标签模式
HTML_TAG_PATTERN = re.compile(r'<[^>]+>')

def get_all_keys(obj: Any, prefix: str = '') -> Set[str]:
    """递归获取所有键的完整路径"""
    keys = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            keys.add(full_key)
            if isinstance(value, (dict, list)):
                keys.update(get_all_keys(value, full_key))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, (dict, list)):
                keys.update(get_all_keys(item, prefix))
    return keys

def get_nested_value(obj: Any, key_path: str) -> Any:
    """根据键路径获取嵌套值"""
    keys = key_path.split('.')
    current = obj
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        elif isinstance(current, list):
            try:
                idx = int(key)
                if 0 <= idx < len(current):
                    current = current[idx]
                else:
                    return None
            except ValueError:
                return None
        else:
            return None
    return current

def extract_placeholders(text: str) -> Set[str]:
    """提取文本中的所有占位符"""
    if not isinstance(text, str):
        return set()
    return set(PLACEHOLDER_PATTERN.findall(text))

def extract_html_tags(text: str) -> Set[str]:
    """提取文本中的所有 HTML 标签"""
    if not isinstance(text, str):
        return set()
    return set(HTML_TAG_PATTERN.findall(text))

def check_file(en_file: Path, lang_file: Path, lang: str) -> Dict[str, Any]:
    """检查单个文件的差异"""
    results = {
        'missing_keys': [],
        'placeholder_issues': [],
        'html_tag_issues': [],
        'file_exists': lang_file.exists()
    }
    
    if not lang_file.exists():
        return results
    
    try:
        with open(en_file, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
    except json.JSONDecodeError as e:
        results['json_error'] = str(e)
        return results
    except Exception as e:
        results['error'] = str(e)
        return results
    
    # 获取所有英文键
    en_keys = get_all_keys(en_data)
    lang_keys = get_all_keys(lang_data)
    
    # 1. 检查缺失的键
    missing_keys = en_keys - lang_keys
    if missing_keys:
        results['missing_keys'] = sorted(missing_keys)
    
    # 2. 检查占位符和 HTML 标签
    for key_path in en_keys:
        en_value = get_nested_value(en_data, key_path)
        lang_value = get_nested_value(lang_data, key_path)
        
        if en_value is None or lang_value is None:
            continue
        
        # 只检查字符串值
        if isinstance(en_value, str) and isinstance(lang_value, str):
            # 检查占位符
            en_placeholders = extract_placeholders(en_value)
            lang_placeholders = extract_placeholders(lang_value)
            
            if en_placeholders != lang_placeholders:
                results['placeholder_issues'].append({
                    'key': key_path,
                    'en_placeholders': sorted(en_placeholders),
                    'lang_placeholders': sorted(lang_placeholders),
                    'en_text': en_value[:100] + ('...' if len(en_value) > 100 else ''),
                    'lang_text': lang_value[:100] + ('...' if len(lang_value) > 100 else '')
                })
            
            # 检查 HTML 标签
            en_tags = extract_html_tags(en_value)
            lang_tags = extract_html_tags(lang_value)
            
            if en_tags != lang_tags:
                results['html_tag_issues'].append({
                    'key': key_path,
                    'en_tags': sorted(en_tags),
                    'lang_tags': sorted(lang_tags),
                    'en_text': en_value[:100] + ('...' if len(en_value) > 100 else ''),
                    'lang_text': lang_value[:100] + ('...' if len(lang_value) > 100 else '')
                })
    
    return results

def main():
    """主函数"""
    base_dir = Path('messages')
    en_dir = base_dir / 'en'
    
    all_results = {}
    
    print("=" * 80)
    print("Translation Audit Report")
    print("=" * 80)
    print()
    
    for filename in FILES:
        en_file = en_dir / filename
        if not en_file.exists():
            print(f"[WARNING] English file not found: {en_file}")
            continue
        
        print(f"\n[FILE] Checking: {filename}")
        print("-" * 80)
        
        file_results = {}
        
        for lang in LANGUAGES:
            lang_file = base_dir / lang / filename
            results = check_file(en_file, lang_file, lang)
            file_results[lang] = results
            
            # 显示结果
            issues_found = False
            
            if not results.get('file_exists'):
                print(f"  [X] {lang}: File not found")
                issues_found = True
                continue
            
            if 'json_error' in results:
                print(f"  [X] {lang}: JSON parse error - {results['json_error']}")
                issues_found = True
                continue
            
            if 'error' in results:
                print(f"  [X] {lang}: Error - {results['error']}")
                issues_found = True
                continue
            
            if results['missing_keys']:
                print(f"  [!] {lang}: {len(results['missing_keys'])} missing keys")
                issues_found = True
            
            if results['placeholder_issues']:
                print(f"  [!] {lang}: {len(results['placeholder_issues'])} placeholder issues")
                issues_found = True
            
            if results['html_tag_issues']:
                print(f"  [!] {lang}: {len(results['html_tag_issues'])} HTML tag issues")
                issues_found = True
            
            if not issues_found:
                print(f"  [OK] {lang}: Passed")
        
        all_results[filename] = file_results
    
    # 生成详细报告
    print("\n" + "=" * 80)
    print("Detailed Report")
    print("=" * 80)
    
    for filename, file_results in all_results.items():
        print(f"\n{'=' * 80}")
        print(f"File: {filename}")
        print(f"{'=' * 80}")
        
        for lang, results in file_results.items():
            if not results.get('file_exists'):
                continue
            
            if 'json_error' in results or 'error' in results:
                continue
            
            has_issues = False
            
            # 缺失的键
            if results['missing_keys']:
                has_issues = True
                print(f"\n  [{lang.upper()}] Missing Keys ({len(results['missing_keys'])}):")
                for key in results['missing_keys'][:20]:  # 只显示前20个
                    print(f"      - {key}")
                if len(results['missing_keys']) > 20:
                    print(f"      ... {len(results['missing_keys']) - 20} more keys")
            
            # 占位符问题
            if results['placeholder_issues']:
                has_issues = True
                print(f"\n  [{lang.upper()}] Placeholder Issues ({len(results['placeholder_issues'])}):")
                for issue in results['placeholder_issues'][:10]:  # 只显示前10个
                    print(f"      Key: {issue['key']}")
                    print(f"        EN placeholders: {issue['en_placeholders']}")
                    print(f"        {lang} placeholders: {issue['lang_placeholders']}")
                    print(f"        EN text: {issue['en_text']}")
                    print(f"        {lang} text: {issue['lang_text']}")
                    print()
                if len(results['placeholder_issues']) > 10:
                    print(f"      ... {len(results['placeholder_issues']) - 10} more issues")
            
            # HTML 标签问题
            if results['html_tag_issues']:
                has_issues = True
                print(f"\n  [{lang.upper()}] HTML Tag Issues ({len(results['html_tag_issues'])}):")
                for issue in results['html_tag_issues'][:10]:  # 只显示前10个
                    print(f"      Key: {issue['key']}")
                    print(f"        EN tags: {issue['en_tags']}")
                    print(f"        {lang} tags: {issue['lang_tags']}")
                    print(f"        EN text: {issue['en_text']}")
                    print(f"        {lang} text: {issue['lang_text']}")
                    print()
                if len(results['html_tag_issues']) > 10:
                    print(f"      ... {len(results['html_tag_issues']) - 10} more issues")
            
            if not has_issues:
                print(f"\n  [{lang.upper()}] No issues found")
    
    # 保存详细报告到文件
    report_file = Path('translation_audit_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'=' * 80}")
    print(f"Detailed report saved to: {report_file}")
    print(f"{'=' * 80}")

if __name__ == '__main__':
    main()
