// 代码生成时间: 2025-11-04 09:06:47
import { existsSync, readFileSync, writeFileSync } from 'https://deno.land/std@0.117.0/fs/mod.ts';
import { createHash } from 'https://deno.land/std@0.117.0/hash/mod.ts';
import { Buffer } from 'https://deno.land/std@0.117.0/io/buffer.ts';

// 加密文件
export function encryptFile(inputFilePath: string, outputFilePath: string, key: string): void {
  if (!existsSync(inputFilePath)) {
    throw new Error(`文件 ${inputFilePath} 不存在。`);
  }

  const inputBuffer = new Buffer();
  const content = readFileSync(inputFilePath, { read: inputBuffer });
  const hashedKey = createHash('sha256').update(key).digest();
  const encryptedContent = content.toString().split('').map((c) => String.fromCharCode(c.charCodeAt(0) ^ hashedKey[0])).join('');

  writeFileSync(outputFilePath, new TextEncoder().encode(encryptedContent));
  console.log(`文件 ${inputFilePath} 加密成功，输出到 ${outputFilePath}`);
}

// 解密文件
export function decryptFile(inputFilePath: string, outputFilePath: string, key: string): void {
  if (!existsSync(inputFilePath)) {
    throw new Error(`文件 ${inputFilePath} 不存在。`);
  }

  const inputBuffer = new Buffer();
  const content = readFileSync(inputFilePath, { read: inputBuffer });
  const hashedKey = createHash('sha256').update(key).digest();
  const decryptedContent = content.toString().split('').map((c) => String.fromCharCode(c.charCodeAt(0) ^ hashedKey[0])).join('');

  writeFileSync(outputFilePath, new TextEncoder().encode(decryptedContent));
  console.log(`文件 ${inputFilePath} 解密成功，输出到 ${outputFilePath}`);
}

// 使用示例
// encryptFile('path/to/input.txt', 'path/to/output.txt', 'your-secret-key');
// decryptFile('path/to/encrypted.txt', 'path/to/decrypted.txt', 'your-secret-key');
