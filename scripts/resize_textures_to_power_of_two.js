/**
 * 批量调整纹理图片尺寸为 2 的幂次方
 * 使用 sharp 库处理图片
 * 支持格式: JPG, JPEG, PNG, WebP
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(PROJECT_ROOT, 'public', 'img');

/**
 * 检查数字是否为 2 的幂次方
 */
function isPowerOfTwo(value) {
	return value > 0 && (value & (value - 1)) === 0;
}

/**
 * 获取最接近的 2 的幂次方（向上取整）
 */
function getNextPowerOfTwo(value) {
	if (value <= 0) return 1;
	if (isPowerOfTwo(value)) return value;
	return Math.pow(2, Math.ceil(Math.log2(value)));
}

/**
 * 处理单个图片文件
 */
async function processImage(filePath) {
	try {
		const image = sharp(filePath);
		const metadata = await image.metadata();
		const { width, height, format } = metadata;

		if (!width || !height) {
			console.warn(`⚠️  无法读取图片尺寸: ${path.basename(filePath)}`);
			return { processed: false, reason: '无法读取尺寸' };
		}

		// 检查是否需要调整
		const widthIsPowerOfTwo = isPowerOfTwo(width);
		const heightIsPowerOfTwo = isPowerOfTwo(height);

		if (widthIsPowerOfTwo && heightIsPowerOfTwo) {
			console.log(`✓  ${path.basename(filePath)}: ${width}x${height} (已经是 2 的幂次方)`);
			return { processed: false, reason: '已经是 2 的幂次方' };
		}

		// 计算新的尺寸
		const newWidth = getNextPowerOfTwo(width);
		const newHeight = getNextPowerOfTwo(height);

		console.log(`📐 ${path.basename(filePath)}: ${width}x${height} → ${newWidth}x${newHeight}`);

		// 创建备份
		const backupPath = filePath + '.backup';
		if (!fs.existsSync(backupPath)) {
			fs.copyFileSync(filePath, backupPath);
			console.log(`   💾 已创建备份: ${path.basename(backupPath)}`);
		}

		// 调整尺寸并保存到临时文件
		// 根据图片格式选择背景色
		const supportsTransparency = format === 'png' || format === 'webp';
		const background = supportsTransparency
			? { r: 0, g: 0, b: 0, alpha: 0 } // PNG/WebP 使用透明背景
			: { r: 0, g: 0, b: 0 }; // JPG/JPEG 使用黑色背景

		const tempPath = filePath + '.tmp';
		await image
			.resize(newWidth, newHeight, {
				fit: 'contain', // 保持宽高比，不裁剪
				background: background,
			})
			.toFile(tempPath);

		// 替换原文件
		fs.renameSync(tempPath, filePath);

		console.log(`   ✅ 已调整: ${path.basename(filePath)}`);

		return {
			processed: true,
			original: { width, height },
			new: { width: newWidth, height: newHeight },
		};
	} catch (error) {
		console.error(`❌ 处理失败 ${path.basename(filePath)}:`, error.message);
		return { processed: false, reason: error.message };
	}
}

/**
 * 主函数
 */
async function main() {
	console.log('='.repeat(60));
	console.log('批量调整纹理图片尺寸为 2 的幂次方');
	console.log('支持格式: JPG, JPEG, PNG, WebP');
	console.log('='.repeat(60));
	console.log(`图片目录: ${IMG_DIR}\n`);

	// 检查目录是否存在
	if (!fs.existsSync(IMG_DIR)) {
		console.error(`❌ 目录不存在: ${IMG_DIR}`);
		process.exit(1);
	}

	// 读取所有图片文件
	const files = fs.readdirSync(IMG_DIR).filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
	});

	if (files.length === 0) {
		console.log('未找到图片文件');
		return;
	}

	console.log(`找到 ${files.length} 个图片文件\n`);

	// 处理每个文件
	const results = [];
	for (const file of files) {
		const filePath = path.join(IMG_DIR, file);
		const result = await processImage(filePath);
		results.push({ file, ...result });
		console.log(''); // 空行分隔
	}

	// 统计结果
	const processed = results.filter((r) => r.processed).length;
	const skipped = results.filter((r) => !r.processed && r.reason === '已经是 2 的幂次方').length;
	const failed = results.filter((r) => !r.processed && r.reason !== '已经是 2 的幂次方').length;

	console.log('='.repeat(60));
	console.log('处理完成');
	console.log('='.repeat(60));
	console.log(`总计: ${files.length} 个文件`);
	console.log(`✅ 已调整: ${processed} 个`);
	console.log(`⏭️  已跳过: ${skipped} 个（已经是 2 的幂次方）`);
	console.log(`❌ 失败: ${failed} 个`);
	console.log('\n💡 提示: 原始文件已备份为 .backup 文件');
	console.log('   如需恢复，请删除调整后的文件并重命名备份文件');
}

main().catch((error) => {
	console.error('❌ 脚本执行失败:', error);
	process.exit(1);
});

