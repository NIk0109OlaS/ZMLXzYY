// 代码生成时间: 2025-10-23 17:40:22
import { createSecretKey, verify, sign } from 'crypto';
import { generate } from 'https://deno.land/x/jwt/mod.ts';

/**
 * JwtTokenManager class that handles JWT token creation and verification.
 */
class JwtTokenManager {
  private secretKey: string;

  constructor(secretKey: string) {
    // Use crypto to generate a secret key
    this.secretKey = secretKey ? secretKey : createSecretKey('utf8').toString('hex');
  }

  /**
   * Generates a JWT token with the provided payload.
   * @param payload - The payload to be included in the JWT token.
   * @returns The JWT token as a string.
   */
  public createToken(payload: Record<string, any>): string {
    try {
      // Generate a JWT token with the payload
      const token = generate({
        payload,
        secret: this.secretKey,
        expiresIn: '1h', // Token expires in 1 hour
      });
      return token;
    } catch (error) {
      // Handle any errors in token generation
      throw new Error('Failed to create JWT token: ' + error.message);
    }
  }

  /**
   * Verifies a JWT token and returns the payload if valid.
   * @param token - The JWT token to be verified.
   * @returns The payload of the JWT token if valid.
   */
  public verifyToken(token: string): Record<string, any> | null {
    try {
      // Verify the JWT token
      const { payload } = verify(token, this.secretKey);
      return payload;
    } catch (error) {
      // Handle any errors in token verification
      throw new Error('Failed to verify JWT token: ' + error.message);
    }
  }
}

// Example usage
const jwtManager = new JwtTokenManager('your-secret-key');

const token = jwtManager.createToken({ username: 'user1' });
console.log('Generated JWT Token:', token);

const payload = jwtManager.verifyToken(token);
if (payload) {
  console.log('Verified JWT Token Payload:', payload);
} else {
  console.log('Invalid JWT Token');
}