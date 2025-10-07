// 代码生成时间: 2025-10-07 22:22:49
import { Buffer } from "https://deno.land/std@0.136.0/io/buffer.ts";
import { createHash, createCipheriv, randomBytes } from "https://deno.land/x/<crypto>/mod.ts";

// Define the encryption algorithm and mode
const algorithm = 'aes-256-cbc';

/**
 * Encrypts data using AES-256-CBC with a random initialization vector (IV).
 * @param plaintext - The data to encrypt.
 * @param password - The password used for encryption.
 * @returns An object containing the IV and the encrypted data.
 */
async function encryptData(plaintext: string, password: string): Promise<{ iv: Uint8Array; encryptedData: Uint8Array }> {
  try {
    // Generate a random IV
    const iv = randomBytes(16);

    // Create a hash for the password to be used as a key
    const key = await createHash('sha256').update(password).digest();

    // Create a cipheriv instance with the key and IV
    const cipher = createCipheriv(algorithm, key, iv);

    // Encrypt the data and get the final buffer
    const encrypted = Buffer.concat([await cipher.update(plaintext), await cipher.final()]);

    return { iv, encryptedData: encrypted };
  } catch (e) {
    console.error('Encryption error:', e);
    throw e;
  }
}

/**
 * Decrypts data using AES-256-CBC with the provided IV and password.
 * @param encryptedData - The encrypted data to be decrypted.
 * @param iv - The initialization vector used for decryption.
 * @param password - The password used for decryption.
 * @returns The decrypted plaintext data.
 */
async function decryptData(encryptedData: Uint8Array, iv: Uint8Array, password: string): Promise<string> {
  try {
    // Create a hash for the password to be used as a key
    const key = await createHash('sha256').update(password).digest();

    // Create a decipheriv instance with the key and IV
    const decipher = createDecipheriv(algorithm, key, iv);

    // Decrypt the data and get the final buffer
    const decrypted = Buffer.concat([await decipher.update(encryptedData), await decipher.final()]);

    return decrypted.toString();
  } catch (e) {
    console.error('Decryption error:', e);
    throw e;
  }
}

// Example usage of the encryption and decryption functions
async function main() {
  const password = 'my-password';
  const plaintext = 'Hello, World!';

  try {
    const { iv, encryptedData } = await encryptData(plaintext, password);
    console.log('Encrypted data:', encryptedData.toString('hex'));

    const decrypted = await decryptData(encryptedData, iv, password);
    console.log('Decrypted data:', decrypted);
  } catch (error) {
    console.error('Error in encryption or decryption:', error);
  }
}

main();