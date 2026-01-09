#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成翻译审计摘要报告
"""

import json
import sys
from pathlib import Path

# 设置输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def main():
    report_file = Path('translation_audit_report.json')
    
    if not report_file.exists():
        print("Error: translation_audit_report.json not found. Please run check_translations.py first.")
        return
    
    with open(report_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("=" * 80)
    print("Translation Audit Summary Report")
    print("=" * 80)
    print()
    
    total_files = len(data)
    total_languages = 0
    total_issues = {
        'missing_keys': 0,
        'placeholder_issues': 0,
        'html_tag_issues': 0,
        'files_missing': 0,
        'json_errors': 0
    }
    
    files_with_issues = []
    
    for filename, file_results in data.items():
        file_has_issues = False
        file_stats = {
            'missing_keys': 0,
            'placeholder_issues': 0,
            'html_tag_issues': 0,
            'files_missing': 0,
            'json_errors': 0
        }
        
        for lang, results in file_results.items():
            total_languages += 1
            
            if not results.get('file_exists'):
                file_stats['files_missing'] += 1
                total_issues['files_missing'] += 1
                file_has_issues = True
                continue
            
            if 'json_error' in results:
                file_stats['json_errors'] += 1
                total_issues['json_errors'] += 1
                file_has_issues = True
                continue
            
            missing_count = len(results.get('missing_keys', []))
            placeholder_count = len(results.get('placeholder_issues', []))
            html_count = len(results.get('html_tag_issues', []))
            
            if missing_count > 0:
                file_stats['missing_keys'] += missing_count
                total_issues['missing_keys'] += missing_count
                file_has_issues = True
            
            if placeholder_count > 0:
                file_stats['placeholder_issues'] += placeholder_count
                total_issues['placeholder_issues'] += placeholder_count
                file_has_issues = True
            
            if html_count > 0:
                file_stats['html_tag_issues'] += html_count
                total_issues['html_tag_issues'] += html_count
                file_has_issues = True
        
        if file_has_issues:
            files_with_issues.append((filename, file_stats))
    
    # 总体统计
    print("OVERALL STATISTICS")
    print("-" * 80)
    print(f"Files checked: {total_files}")
    print(f"Total language files: {total_languages}")
    print()
    print("ISSUES FOUND:")
    print(f"  - Missing keys: {total_issues['missing_keys']}")
    print(f"  - Placeholder issues: {total_issues['placeholder_issues']}")
    print(f"  - HTML tag issues: {total_issues['html_tag_issues']}")
    print(f"  - Missing files: {total_issues['files_missing']}")
    print(f"  - JSON errors: {total_issues['json_errors']}")
    print()
    
    if total_issues['missing_keys'] == 0 and total_issues['placeholder_issues'] == 0 and \
       total_issues['html_tag_issues'] == 0 and total_issues['files_missing'] == 0 and \
       total_issues['json_errors'] == 0:
        print("=" * 80)
        print("[SUCCESS] ALL CHECKS PASSED!")
        print("=" * 80)
        print()
        print("All translation files:")
        print("  [OK] Have all required keys")
        print("  [OK] Preserve all placeholders correctly")
        print("  [OK] Preserve all HTML tags correctly")
        print("  [OK] Are valid JSON files")
    else:
        print("=" * 80)
        print("[WARNING] ISSUES DETECTED")
        print("=" * 80)
        print()
        
        if files_with_issues:
            print("Files with issues:")
            for filename, stats in files_with_issues:
                print(f"\n  {filename}:")
                if stats['missing_keys'] > 0:
                    print(f"    - {stats['missing_keys']} missing keys")
                if stats['placeholder_issues'] > 0:
                    print(f"    - {stats['placeholder_issues']} placeholder issues")
                if stats['html_tag_issues'] > 0:
                    print(f"    - {stats['html_tag_issues']} HTML tag issues")
                if stats['files_missing'] > 0:
                    print(f"    - {stats['files_missing']} missing files")
                if stats['json_errors'] > 0:
                    print(f"    - {stats['json_errors']} JSON errors")
    
    print()
    print("=" * 80)
    print("For detailed information, see: translation_audit_report.json")
    print("=" * 80)

if __name__ == '__main__':
    main()
