#!/usr/bin/env python3
"""
修复 Windows 长路径问题的脚本
重命名 Knowledge Hub 中过长的文件夹名称，并更新所有 JSON 文件中的引用
"""

import os
import json
import shutil
from pathlib import Path

# 需要重命名的文件夹映射（旧名称 -> 新名称）
FOLDER_RENAMES = {
    "The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success": "Fish Semen Analysis Guide"
}

def find_json_files():
    """查找所有需要更新的 JSON 文件"""
    json_files = []
    messages_dir = Path("messages")
    if messages_dir.exists():
        for json_file in messages_dir.rglob("*.json"):
            json_files.append(json_file)
    return json_files

def update_json_references(json_file, old_path, new_path):
    """更新 JSON 文件中的路径引用"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换所有出现的旧路径
        if old_path in content:
            content = content.replace(old_path, new_path)
            with open(json_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {json_file}: {e}")
        return False

def rename_folder(old_name, new_name):
    """重命名文件夹"""
    old_path = Path("public/Knowledge Hub") / old_name
    new_path = Path("public/Knowledge Hub") / new_name
    
    if not old_path.exists():
        print(f"Warning: {old_path} does not exist")
        return False
    
    if new_path.exists():
        print(f"Warning: {new_path} already exists")
        return False
    
    try:
        old_path.rename(new_path)
        print(f"Renamed: {old_name} -> {new_name}")
        return True
    except Exception as e:
        print(f"Error renaming folder: {e}")
        return False

def main():
    """主函数"""
    print("开始修复长路径问题...")
    print("=" * 60)
    
    # 1. 重命名文件夹
    print("\n1. 重命名文件夹...")
    for old_name, new_name in FOLDER_RENAMES.items():
        old_path_str = f"/Knowledge Hub/{old_name}/{old_name}"
        new_path_str = f"/Knowledge Hub/{new_name}/{new_name}"
        
        # 重命名文件夹
        if rename_folder(old_name, new_name):
            # 2. 更新所有 JSON 文件中的引用
            print(f"\n2. 更新 JSON 文件中的路径引用...")
            json_files = find_json_files()
            updated_count = 0
            
            for json_file in json_files:
                if update_json_references(json_file, old_path_str, new_path_str):
                    updated_count += 1
                    print(f"  Updated: {json_file}")
            
            print(f"\n完成！更新了 {updated_count} 个 JSON 文件")
            print(f"旧路径: {old_path_str}")
            print(f"新路径: {new_path_str}")
        else:
            print(f"跳过重命名 {old_name}（文件夹不存在或已重命名）")
    
    print("\n" + "=" * 60)
    print("修复完成！请检查更改并提交。")

if __name__ == "__main__":
    main()
