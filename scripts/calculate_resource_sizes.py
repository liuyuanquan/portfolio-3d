#!/usr/bin/env python3
"""
资源大小计算脚本
读取项目中所有需要加载的资源文件大小，并保存到 JSON 文件中
"""
import os
import json
from pathlib import Path
from typing import Dict, List

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
CONFIG_FILE = PROJECT_ROOT / "src" / "config" / "index.ts"

def get_file_size(file_path: Path) -> int:
    """获取文件大小（字节）"""
    if file_path.exists():
        return file_path.stat().st_size
    return 0

def extract_resource_paths() -> Dict[str, List[str]]:
    """
    从配置文件中提取资源路径
    返回包含字体和纹理路径的字典
    """
    resources = {
        "fonts": [],
        "textures": []
    }
    
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        import re
        
        # 提取字体配置（只提取未注释的行）
        in_fonts_config = False
        for line in lines:
            # 检测 fontsConfig 开始
            if 'fontsConfig' in line and '{' in line:
                in_fonts_config = True
                continue
            
            if in_fonts_config:
                # 检测 fontsConfig 结束
                if line.strip().startswith('}'):
                    break
                
                # 跳过注释行
                stripped = line.strip()
                if stripped.startswith('//') or not stripped:
                    continue
                
                # 提取字体配置
                font_match = re.search(r'(\w+):\s*`\$\{BASE_URL\}([^`]+)`', line)
                if font_match:
                    name = font_match.group(1)
                    path = font_match.group(2).split('//')[0].strip()  # 移除行内注释
                    resources["fonts"].append({
                        "name": name,
                        "path": path
                    })
        
        # 提取预加载纹理路径（只提取未注释的行）
        in_preload_textures = False
        for line in lines:
            # 检测 preloadTextures 开始
            if 'preloadTextures:' in line and '[' in line:
                in_preload_textures = True
                continue
            
            if in_preload_textures:
                # 检测 preloadTextures 结束
                if ']' in line:
                    break
                
                # 跳过注释行
                stripped = line.strip()
                if stripped.startswith('//') or not stripped:
                    continue
                
                # 提取纹理路径
                texture_match = re.search(r'`\$\{BASE_URL\}img/([^`]+)`', line)
                if texture_match:
                    texture_file = texture_match.group(1).split('//')[0].strip()  # 移除行内注释
                    resources["textures"].append(f"img/{texture_file}")
            
    except Exception as e:
        print(f"警告: 无法从配置文件提取路径: {e}")
        print("将使用默认路径...")
        
        # 默认字体路径
        resources["fonts"] = [
            {"name": "lxgw", "path": "json/LXGW WenKai_Regular.json"}
        ]
        
        # 默认纹理路径
        resources["textures"] = [
            "img/earth.jpg",
            "img/BeachBallColor.jpg",
            "img/stone.png",
            "img/woodTexture.jpg",
            "img/project-placeholder.png",
            "img/lensflare0.png",
            "img/spark.png"
        ]
    
    return resources

def calculate_resource_sizes() -> Dict:
    """计算所有资源的大小"""
    result = {
        "fonts": {},
        "textures": {},
        "ammo": {}
    }
    
    # 提取资源路径
    resources = extract_resource_paths()
    
    # 计算字体大小
    print("计算字体文件大小...")
    for font_info in resources["fonts"]:
        font_name = font_info["name"]
        font_path = PUBLIC_DIR / font_info["path"]
        size = get_file_size(font_path)
        result["fonts"][font_name] = {
            "path": font_info["path"],
            "size": size
        }
        print(f"  {font_name}: {size / 1024 / 1024:.2f} MB ({font_path})")
    
    # 计算纹理大小
    print("\n计算纹理文件大小...")
    for texture_file in resources["textures"]:
        texture_path = PUBLIC_DIR / texture_file
        size = get_file_size(texture_path)
        result["textures"][texture_file] = size
        print(f"  {texture_file}: {size / 1024 / 1024:.2f} MB ({texture_path})")
    
    # 计算 Ammo.js 相关文件大小
    print("\n计算 Ammo.js 文件大小...")
    ammo_files = ["ammo/ammo.js", "ammo/ammo.wasm.js", "ammo/ammo.wasm.wasm"]
    total_ammo_size = 0
    for ammo_file in ammo_files:
        ammo_path = PUBLIC_DIR / ammo_file
        size = get_file_size(ammo_path)
        total_ammo_size += size
        result["ammo"][ammo_file] = size
        print(f"  {ammo_file}: {size / 1024 / 1024:.2f} MB ({ammo_path})")
    
    result["ammo"]["total"] = total_ammo_size
    print(f"\nAmmo.js 总大小: {total_ammo_size / 1024 / 1024:.2f} MB")
    
    # 计算总大小
    total_fonts = sum(font["size"] for font in result["fonts"].values())
    total_textures = sum(result["textures"].values())
    total_all = total_fonts + total_textures + total_ammo_size
    
    result["totals"] = {
        "fonts": total_fonts,
        "textures": total_textures,
        "ammo": total_ammo_size,
        "all": total_all
    }
    
    print(f"\n总计:")
    print(f"  字体: {total_fonts / 1024 / 1024:.2f} MB")
    print(f"  纹理: {total_textures / 1024 / 1024:.2f} MB")
    print(f"  Ammo.js: {total_ammo_size / 1024 / 1024:.2f} MB")
    print(f"  总计: {total_all / 1024 / 1024:.2f} MB")
    
    return result

def main():
    """主函数"""
    print("=" * 60)
    print("资源大小计算脚本")
    print("=" * 60)
    print(f"项目根目录: {PROJECT_ROOT}")
    print(f"Public 目录: {PUBLIC_DIR}")
    print()
    
    # 计算资源大小
    resource_sizes = calculate_resource_sizes()
    
    # 保存到 JSON 文件
    output_file = PROJECT_ROOT / "src" / "config" / "resource_sizes.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(resource_sizes, f, indent=2, ensure_ascii=False)
    
    print(f"\n资源大小信息已保存到: {output_file}")
    print("=" * 60)

if __name__ == "__main__":
    main()
