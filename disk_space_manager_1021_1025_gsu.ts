// 代码生成时间: 2025-10-21 10:25:24
import {
  formatBytes,
  FileInfo,
  readDir,
  readdir,
  stat,
} from "https://deno.land/std@${DENO_VERSION}/fs/mod.ts";
import {
  assert,
} from "https://deno.land/std@${DENO_VERSION}/testing/asserts.ts";

// A function to display the space used by each directory
async function displaySpaceUsage(dirPath: string): Promise<void> {
  try {
    // Read the directory
    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const path = `${dirPath}/${entry.name}`;
      // Skip if not a directory
      if (entry.isDirectory) {
        const space = await getDirectorySize(path);
        console.log(`Directory: ${path}, Size: ${formatBytes(space)}`);
      }
    }
  } catch (error) {
    console.error("Error reading directory: ", error);
  }
}

// A function to calculate the size of a directory
async function getDirectorySize(dirPath: string): Promise<number> {
  let size = 0;
  try {
    // Read the directory
    const entries = await readDir(dirPath);
    for await (const entry of entries) {
      if (entry.isDirectory) {
        // Recursively calculate the size of subdirectories
        size += await getDirectorySize(`${dirPath}/${entry.name}`);
      } else {
        // Add the size of files
        const fileInfo = await stat(`${dirPath}/${entry.name}`);
        size += fileInfo.size;
      }
    }
  } catch (error) {
    console.error("Error calculating directory size: ", error);
    throw error;
  }
  return size;
}

// Main function to run the disk space management tool
async function main(): Promise<void> {
  const path = Deno.args[0];
  if (!path) {
    console.error("Please provide a path to check disk space.");
    Deno.exit(1);
  }

  try {
    assert(path); // Ensure the path is provided
    // Display the space usage of the provided directory
    await displaySpaceUsage(path);
  } catch (error) {
    console.error("An error occurred: ", error);
    Deno.exit(1);
  }
}

// Run the main function
main();