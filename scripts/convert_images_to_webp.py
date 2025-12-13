#!/usr/bin/env python3
"""
图片转 WebP 脚本
将 public/img 目录中的图片文件转换为 WebP 格式
"""
import os
import sys
from pathlib import Path
from PIL import Image
from typing import List, Tuple

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent
IMG_DIR = PROJECT_ROOT / "public" / "img"

# 支持的图片格式
SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png"}

# WebP 质量设置（0-100，100 为最高质量）
WEBP_QUALITY = 85


def get_image_files(img_dir: Path) -> List[Path]:
    """获取所有需要转换的图片文件"""
    image_files = []
    for file_path in img_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_FORMATS:
            image_files.append(file_path)
    return sorted(image_files)


def convert_to_webp(
    input_path: Path, output_path: Path, quality: int = WEBP_QUALITY
) -> Tuple[bool, str]:
    """
    将图片转换为 WebP 格式
    
    Args:
        input_path: 输入文件路径
        output_path: 输出文件路径
        quality: WebP 质量（0-100）
    
    Returns:
        (成功标志, 错误信息)
    """
    try:
        # 打开图片
        with Image.open(input_path) as img:
            # 如果是 PNG 且包含透明度，使用 RGBA 模式
            if input_path.suffix.lower() == ".png" and img.mode in ("RGBA", "LA", "P"):
                # 如果图片是调色板模式，转换为 RGBA
                if img.mode == "P":
                    img = img.convert("RGBA")
                # 保存为 WebP，保留透明度
                img.save(output_path, "WEBP", quality=quality, method=6)
            else:
                # 转换为 RGB 模式（WebP 不支持某些模式）
                if img.mode not in ("RGB", "RGBA"):
                    img = img.convert("RGB")
                # 保存为 WebP
                img.save(output_path, "WEBP", quality=quality, method=6)
        
        return True, ""
    except Exception as e:
        return False, str(e)


def get_file_size(file_path: Path) -> int:
    """获取文件大小（字节）"""
    if file_path.exists():
        return file_path.stat().st_size
    return 0


def format_size(size_bytes: int) -> str:
    """格式化文件大小"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def main():
    """主函数"""
    if not IMG_DIR.exists():
        print(f"错误: 图片目录不存在: {IMG_DIR}")
        sys.exit(1)
    
    # 获取所有图片文件
    image_files = get_image_files(IMG_DIR)
    
    if not image_files:
        print(f"在 {IMG_DIR} 中没有找到需要转换的图片文件")
        sys.exit(0)
    
    print(f"找到 {len(image_files)} 个图片文件，开始转换...")
    print("-" * 80)
    
    total_original_size = 0
    total_webp_size = 0
    success_count = 0
    failed_files = []
    
    for i, input_path in enumerate(image_files, 1):
        # 生成输出文件名（替换扩展名为 .webp）
        output_path = input_path.with_suffix(".webp")
        
        # 获取原始文件大小
        original_size = get_file_size(input_path)
        total_original_size += original_size
        
        print(f"[{i}/{len(image_files)}] 转换: {input_path.name}")
        
        # 转换图片
        success, error_msg = convert_to_webp(input_path, output_path, WEBP_QUALITY)
        
        if success:
            webp_size = get_file_size(output_path)
            total_webp_size += webp_size
            
            # 计算压缩率
            compression_ratio = (1 - webp_size / original_size) * 100 if original_size > 0 else 0
            
            print(f"  ✓ 成功: {format_size(original_size)} → {format_size(webp_size)} "
                  f"({compression_ratio:+.1f}%)")
            success_count += 1
        else:
            print(f"  ✗ 失败: {error_msg}")
            failed_files.append((input_path.name, error_msg))
        
        print()
    
    # 打印总结
    print("-" * 80)
    print("转换完成！")
    print(f"成功: {success_count}/{len(image_files)}")
    
    if success_count > 0:
        total_compression = (1 - total_webp_size / total_original_size) * 100 if total_original_size > 0 else 0
        print(f"总大小: {format_size(total_original_size)} → {format_size(total_webp_size)} "
              f"({total_compression:+.1f}%)")
    
    if failed_files:
        print(f"\n失败的文件 ({len(failed_files)}):")
        for filename, error in failed_files:
            print(f"  - {filename}: {error}")
    
    print("\n提示: WebP 文件已生成，原文件保持不变。")
    print("如需替换原文件，请手动删除原文件并重命名 WebP 文件。")


if __name__ == "__main__":
    main()

