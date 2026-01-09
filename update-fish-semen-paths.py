#!/usr/bin/env python3
"""
更新所有 JSON 文件中的 Fish Semen Analysis 路径引用
"""

import json
import os
from pathlib import Path

# 旧路径和新路径
OLD_PATH = "/Knowledge Hub/The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success/The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success"
NEW_PATH = "/Knowledge Hub/Fish Semen Analysis Guide/Fish Semen Analysis Guide"

def update_json_file(json_file):
    """更新单个 JSON 文件中的路径"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if OLD_PATH in content:
            content = content.replace(OLD_PATH, NEW_PATH)
            with open(json_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {json_file}: {e}")
        return False

def main():
    """主函数"""
    print("开始更新 Fish Semen Analysis 路径引用...")
    print("=" * 60)
    
    # 查找所有 JSON 文件
    messages_dir = Path("messages")
    json_files = list(messages_dir.rglob("*.json"))
    
    updated_count = 0
    for json_file in json_files:
        if update_json_file(json_file):
            updated_count += 1
            print(f"  Updated: {json_file}")
    
    print(f"\n完成！更新了 {updated_count} 个 JSON 文件")
    print(f"旧路径: {OLD_PATH}")
    print(f"新路径: {NEW_PATH}")

if __name__ == "__main__":
    main()
