#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI 溢出与排版审计脚本
检查 375px（移动端）和 1440px（桌面端）下的布局问题
"""

import re
from pathlib import Path

def check_css_file(css_file: Path):
    """检查 CSS 文件中的布局问题"""
    issues = []
    
    with open(css_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查导航栏
    nav_menu_match = re.search(r'\.nav-menu\s*\{[^}]*\}', content, re.DOTALL)
    if nav_menu_match:
        nav_css = nav_menu_match.group(0)
        # 检查是否有 white-space: nowrap（可能导致溢出）
        if 'white-space: nowrap' in nav_css:
            # 检查是否有对应的溢出处理
            if 'overflow' not in nav_css and 'text-overflow' not in nav_css:
                issues.append({
                    'type': 'navigation',
                    'issue': '导航栏使用了 white-space: nowrap 但缺少溢出处理',
                    'location': 'styles.css - .nav-menu'
                })
    
    # 检查按钮
    btn_matches = re.finditer(r'\.btn[^{]*\{[^}]*\}', content, re.DOTALL)
    for match in btn_matches:
        btn_css = match.group(0)
        if 'white-space: nowrap' in btn_css:
            if 'overflow' not in btn_css and 'text-overflow' not in btn_css:
                issues.append({
                    'type': 'button',
                    'issue': '按钮使用了 white-space: nowrap 但缺少溢出处理',
                    'location': f'styles.css - {match.group(0)[:50]}'
                })
    
    # 检查表格响应式
    if 'table' in content:
        # 检查是否有表格的移动端处理
        if '@media (max-width: 768px)' in content or '@media (max-width: 375px)' in content:
            # 检查表格是否有 overflow-x: auto
            table_sections = re.finditer(r'table[^{]*\{[^}]*\}', content, re.DOTALL)
            has_table_overflow = False
            for table_match in table_sections:
                if 'overflow-x' in table_match.group(0):
                    has_table_overflow = True
                    break
            if not has_table_overflow:
                issues.append({
                    'type': 'table',
                    'issue': '表格缺少移动端溢出处理（overflow-x: auto）',
                    'location': 'styles.css - table styles'
                })
    
    # 检查产品卡片高度对齐
    product_card_match = re.search(r'\.product-card[^{]*\{[^}]*\}', content, re.DOTALL)
    if product_card_match:
        card_css = product_card_match.group(0)
        if 'height: 100%' not in card_css and 'align-items: stretch' not in content:
            issues.append({
                'type': 'product-card',
                'issue': '产品卡片可能缺少高度对齐（height: 100% 或 align-items: stretch）',
                'location': 'styles.css - .product-card'
            })
    
    # 检查 FAQ 卡片高度对齐
    article_card_match = re.search(r'\.article-card[^{]*\{[^}]*\}', content, re.DOTALL)
    if article_card_match:
        article_css = article_card_match.group(0)
        if 'height: 100%' not in article_css:
            issues.append({
                'type': 'faq-card',
                'issue': 'FAQ 卡片可能缺少高度对齐（height: 100%）',
                'location': 'styles.css - .article-card'
            })
    
    # 检查 hyphens: auto
    # 检查 FAQ 文章内容区域
    about_section_match = re.search(r'\.about-section[^{]*article[^{]*\{[^}]*\}', content, re.DOTALL)
    if about_section_match:
        article_css = about_section_match.group(0)
        if 'hyphens' not in article_css:
            issues.append({
                'type': 'hyphens',
                'issue': 'FAQ 文章内容区域缺少 hyphens: auto',
                'location': 'styles.css - .about-section article'
            })
    
    return issues

def check_tsx_files():
    """检查 TSX 文件中的内联样式"""
    issues = []
    
    # 检查导航栏组件
    nav_file = Path('components/Navigation.tsx')
    if nav_file.exists():
        with open(nav_file, 'r', encoding='utf-8') as f:
            content = f.read()
        # 检查是否有内联样式导致溢出
        if 'white-space' in content and 'overflow' not in content:
            issues.append({
                'type': 'navigation',
                'issue': 'Navigation.tsx 中可能有文本溢出风险',
                'location': 'components/Navigation.tsx'
            })
    
    # 检查 FAQ 文章页面
    faq_article_file = Path('app/[locale]/faq/[slug]/page.tsx')
    if faq_article_file.exists():
        with open(faq_article_file, 'r', encoding='utf-8') as f:
            content = f.read()
        # 检查表格的响应式处理
        if 'table' in content.lower():
            if 'overflowX' not in content and 'overflow-x' not in content:
                issues.append({
                    'type': 'table',
                    'issue': 'FAQ 文章页面的表格缺少移动端溢出处理',
                    'location': 'app/[locale]/faq/[slug]/page.tsx'
                })
        # 检查 hyphens
        if 'hyphens' in content:
            # 检查是否有阿拉伯语的特殊处理
            if 'html[dir="rtl"]' not in content and 'html[lang="ar"]' not in content:
                issues.append({
                    'type': 'hyphens',
                    'issue': 'FAQ 文章页面可能需要为阿拉伯语禁用 hyphens',
                    'location': 'app/[locale]/faq/[slug]/page.tsx'
                })
    
    return issues

def main():
    print("=" * 80)
    print("UI 溢出与排版审计报告")
    print("=" * 80)
    print()
    
    css_file = Path('styles.css')
    all_issues = []
    
    if css_file.exists():
        print("检查 CSS 文件...")
        css_issues = check_css_file(css_file)
        all_issues.extend(css_issues)
        print(f"  发现 {len(css_issues)} 个潜在问题")
    else:
        print("警告: styles.css 文件不存在")
    
    print("\n检查 TSX 文件...")
    tsx_issues = check_tsx_files()
    all_issues.extend(tsx_issues)
    print(f"  发现 {len(tsx_issues)} 个潜在问题")
    
    print("\n" + "=" * 80)
    print("问题汇总")
    print("=" * 80)
    
    if not all_issues:
        print("\n[SUCCESS] 未发现明显的布局问题")
        print("\n建议进行手动检查：")
        print("  1. 在浏览器中测试 375px 和 1440px 宽度")
        print("  2. 检查导航栏文本是否溢出")
        print("  3. 检查按钮文本是否溢出")
        print("  4. 检查产品卡片高度是否对齐")
        print("  5. 检查 FAQ 卡片高度是否对齐")
        print("  6. 检查表格在移动端的显示")
        print("  7. 检查长文本的折行效果")
    else:
        print(f"\n发现 {len(all_issues)} 个潜在问题：\n")
        for i, issue in enumerate(all_issues, 1):
            print(f"{i}. [{issue['type'].upper()}] {issue['issue']}")
            print(f"   位置: {issue['location']}\n")
    
    print("=" * 80)
    print("审计完成")
    print("=" * 80)

if __name__ == '__main__':
    main()
