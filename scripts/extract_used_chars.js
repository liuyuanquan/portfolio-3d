#!/usr/bin/env node
/**
 * 从源代码中提取实际使用的字符
 * 只提取在文本字符串中实际使用的字符，不包括注释
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'scripts', 'used_chars.txt');

/**
 * 提取字符串字面量中的字符
 */
function extractCharsFromStringLiterals(content) {
    const chars = new Set();
    
    // 匹配字符串字面量：单引号、双引号、模板字符串
    const stringPatterns = [
        /(["'])(?:(?=(\\?))\2.)*?\1/g,  // 单引号和双引号字符串
        /`(?:(?=(\\?))\2.)*?`/g,         // 模板字符串
    ];
    
    for (const pattern of stringPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const str = match[0];
            // 移除引号
            const innerStr = str.slice(1, -1);
            // 提取所有字符
            for (const char of innerStr) {
                chars.add(char);
            }
        }
    }
    
    return chars;
}

/**
 * 从源代码中提取字符
 */
function extractCharsFromCode() {
    const chars = new Set();
    
    // 从配置文件中提取文本
    const configFile = path.join(SRC_DIR, 'config', 'index.ts');
    if (fs.existsSync(configFile)) {
        const content = fs.readFileSync(configFile, 'utf-8');
        const extracted = extractCharsFromStringLiterals(content);
        extracted.forEach(char => chars.add(char));
    }
    
    // 从其他源文件中提取
    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const extracted = extractCharsFromStringLiterals(content);
                    extracted.forEach(char => chars.add(char));
                } catch (e) {
                    console.warn(`警告: 无法读取文件 ${filePath}: ${e.message}`);
                }
            }
        }
    }
    
    walkDir(SRC_DIR);
    
    return chars;
}

function main() {
    console.log('='.repeat(60));
    console.log('提取实际使用的字符');
    console.log('='.repeat(60));
    
    // 提取字符
    console.log('\n步骤 1: 从源代码中提取字符...');
    const chars = extractCharsFromCode();
    
    // 添加 ASCII 字符（数字、字母、基本标点）
    console.log('\n步骤 2: 添加 ASCII 字符...');
    const asciiChars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    for (const char of asciiChars) {
        chars.add(char);
    }
    
    // 添加常用中文标点（如果代码中使用了）
    const chinesePunctuation = ['，', '。', '、', '：', '；', '？', '！', '（', '）', '【', '】', '《', '》', '「', '」', '—', '…', '·'];
    chinesePunctuation.forEach(char => chars.add(char));
    
    // 排序：先 ASCII，再中文
    const sortedChars = Array.from(chars).sort((a, b) => {
        const aCode = a.charCodeAt(0);
        const bCode = b.charCodeAt(0);
        if (aCode < 128 && bCode >= 128) return -1;
        if (aCode >= 128 && bCode < 128) return 1;
        return aCode - bCode;
    });
    
    const result = sortedChars.join('');
    const chineseChars = sortedChars.filter(c => /[\u4e00-\u9fa5]/.test(c));
    
    console.log(`\n提取结果:`);
    console.log(`- 总字符数: ${sortedChars.length}`);
    console.log(`- ASCII 字符数: ${sortedChars.filter(c => c.charCodeAt(0) < 128).length}`);
    console.log(`- 汉字数量: ${chineseChars.length}`);
    console.log(`- 中文标点数量: ${sortedChars.filter(c => /[\u3000-\u303f\uff00-\uffef]/.test(c)).length}`);
    
    if (chineseChars.length > 0) {
        console.log(`\n实际使用的汉字 (${chineseChars.length} 个):`);
        console.log(chineseChars.join(''));
    }
    
    // 保存到文件
    console.log(`\n保存到文件: ${OUTPUT_FILE}`);
    fs.writeFileSync(OUTPUT_FILE, result, 'utf-8');
    
    console.log('\n完成!');
}

main();

