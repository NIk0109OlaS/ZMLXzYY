// 代码生成时间: 2025-10-13 03:44:22
import { copy } from "https://deno.land/std/fs/copy.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { remove } from "https://deno.land/std/fs/remove.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";

interface FileOperationOptions {
  src: string;
  dest: string;
  action: 'copy' | 'remove';
}

/**
 * 执行文件批量操作
 * @param options - 包含源路径、目标路径和操作类型的配置项
 */
async function batchFileOperation(options: FileOperationOptions): Promise<void> {
  try {
    switch (options.action) {
      case 'copy':
        await copyFiles(options.src, options.dest);
        break;
      case 'remove':
        await removeFiles(options.src);
        break;
      default:
        throw new Error(`Unsupported action: ${options.action}`);
    }
  } catch (error) {
    console.error(`Error during batch file operation: ${error}`);
  }
}

/**
 * 复制文件
 * @param src - 源路径
 * @param dest - 目标路径
 */
async function copyFiles(src: string, dest: string): Promise<void> {
  try {
    await ensureDir(dest);
    for await (const entry of walk(src, { includeDirs: false })) {
      const srcPath = entry.path;
      const destPath = `${dest}/${entry.name}`;
      await copy(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  } catch (error) {
    throw new Error(`Error copying files: ${error}`);
  }
}

/**
 * 删除文件
 * @param path - 文件或目录路径
 */
async function removeFiles(path: string): Promise<void> {
  try {
    for await (const entry of walk(path, { includeDirs: true, includeFiles: false })) {
      const dirPath = entry.path;
      await remove(dirPath, { recursive: true });
      console.log(`Removed directory ${dirPath}`);
    }
  } catch (error) {
    throw new Error(`Error removing files: ${error}`);
  }
}

// 示例用法
const options = {
  src: './src',
  dest: './dest',
  action: 'copy'
};

batchFileOperation(options);