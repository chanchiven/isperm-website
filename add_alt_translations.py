#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为所有语言添加缺失的 alt 翻译键
"""

import json
import sys
from pathlib import Path

# 设置输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

LANGUAGES = ['ar', 'bg', 'de', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'tr', 'uk', 'vi']

# 英文版本的 alt 文本（作为参考）
EN_ALT_TEXTS = {
    'about': {
        'showcase.images.image1.alt': 'iSperm Medical team presenting fully automated CASA system and sperm quality analyzer at exhibition',
        'showcase.images.image2.alt': 'iSperm Medical professionals discussing veterinary semen analyzer and animal breeding solutions',
        'showcase.images.image3.alt': 'iSperm Medical team and events showcasing CASA technology and reproductive health solutions',
        'showcase.images.image4.alt': 'iSperm Medical team presentations and exhibitions featuring automated semen analysis systems',
        'showcase.images.image5.alt': 'iSperm Medical events and team showcasing innovative CASA systems and sperm quality analyzers',
    },
    'index': {
        'about.heroImage.alt': 'iSperm Medical - Leading CASA system and sperm quality analyzer manufacturer for reproductive diagnostics',
    }
}

def add_alt_to_about(lang: str):
    """为 about.json 添加 alt 键"""
    file_path = Path(f'messages/{lang}/about.json')
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 检查是否已有 images 键
    if 'showcase' not in data:
        data['showcase'] = {}
    
    if 'images' not in data['showcase']:
        data['showcase']['images'] = {}
    
    # 添加所有图片的 alt（使用英文版本，实际应该翻译）
    for i in range(1, 6):
        key = f'image{i}'
        if key not in data['showcase']['images']:
            data['showcase']['images'][key] = {
                'alt': EN_ALT_TEXTS['about'][f'showcase.images.{key}.alt']
            }
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ Updated {file_path}")

def add_alt_to_index(lang: str):
    """为 index.json 添加 alt 键"""
    file_path = Path(f'messages/{lang}/index.json')
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 检查是否已有 about.heroImage 键
    if 'about' not in data:
        data['about'] = {}
    
    if 'heroImage' not in data['about']:
        data['about']['heroImage'] = {
            'alt': EN_ALT_TEXTS['index']['about.heroImage.alt']
        }
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ Updated {file_path}")

def main():
    print("为所有语言添加 alt 翻译键...")
    print()
    
    for lang in LANGUAGES:
        print(f"Processing {lang}...")
        add_alt_to_about(lang)
        add_alt_to_index(lang)
        print()
    
    print("完成！")
    print("\n注意：当前使用的是英文版本的 alt 文本。")
    print("建议：为每种语言翻译这些 alt 文本以获得更好的 SEO 和可访问性。")

if __name__ == '__main__':
    main()
