#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import shutil

# 设置输出编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def rename_chinese_folder():
    """重命名包含中文的文件夹"""
    base_path = r'C:\Users\chan_\Desktop\iSperm\website_backup'
    old_folder_name = '备份'
    new_folder_name = 'backup'
    
    old_path = os.path.join(base_path, old_folder_name)
    new_path = os.path.join(base_path, new_folder_name)
    
    try:
        if os.path.exists(old_path):
            if os.path.exists(new_path):
                print(f"目标文件夹 '{new_folder_name}' 已存在")
            else:
                # 尝试使用 shutil.move
                shutil.move(old_path, new_path)
                print(f"成功将文件夹 '{old_folder_name}' 重命名为 '{new_folder_name}'")
                print(f"  旧路径: {old_path}")
                print(f"  新路径: {new_path}")
        else:
            print(f"文件夹 '{old_folder_name}' 不存在")
            if os.path.exists(new_path):
                print(f"文件夹已重命名为 '{new_folder_name}'")
    except PermissionError as e:
        print(f"权限错误: 无法重命名文件夹")
        print(f"可能原因:")
        print(f"  1. 文件夹正在被其他程序使用（如 Cursor IDE）")
        print(f"  2. 需要关闭 Cursor 并手动重命名")
        print(f"  3. 或者需要管理员权限")
        print(f"\n建议: 请手动将 '{old_folder_name}' 文件夹重命名为 '{new_folder_name}'")
    except Exception as e:
        print(f"错误: {e}")

if __name__ == '__main__':
    rename_chinese_folder()
