import { createCipheriv, createDecipheriv, randomBytes, Cipher, Decipher } from 'crypto';
import { ConfigError, ConfigErrorCode } from '../errors';

interface EncryptionMetadata {
  algorithm: string;
  iv: string;
  authTag: string;
}

interface SecureField {
  encrypted: boolean;
  value: string;
  metadata: EncryptionMetadata;
}

interface EncryptionOptions {
  algorithm?: string;
  ivSize?: number;
}

export class AESConfigEncryption {
  private readonly defaultAlgorithm = 'aes-256-gcm';
  private readonly defaultIvSize = 16;
  private readonly key: Buffer | string;

  constructor(key: Buffer | string) {
    this.key = key;
  }

  private validateKey(): Buffer {
    try {
      const keyBuffer = Buffer.isBuffer(this.key) ? this.key : Buffer.from(this.key);
      if (keyBuffer.length !== 32) {
        throw new Error('Key must be 32 bytes');
      }
      return keyBuffer;
    } catch (err) {
      throw new ConfigError(
        ConfigErrorCode.ENCRYPTION_ERROR,
        'Invalid encryption key'
      );
    }
  }

  async encrypt(plaintext: string, options: EncryptionOptions = {}): Promise<string> {
    try {
      const keyBuffer = this.validateKey();
      const algorithm = options.algorithm || this.defaultAlgorithm;
      const ivSize = options.ivSize || this.defaultIvSize;
      const iv = randomBytes(ivSize);
      const cipher = createCipheriv(algorithm, keyBuffer, iv) as Cipher & { getAuthTag(): Buffer };
      
      let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
      ciphertext += cipher.final('base64');

      const secureField: SecureField = {
        encrypted: true,
        value: ciphertext,
        metadata: {
          algorithm,
          iv: iv.toString('base64'),
          authTag: cipher.getAuthTag().toString('base64')
        }
      };

      return JSON.stringify(secureField);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      throw new ConfigError(
        ConfigErrorCode.ENCRYPTION_ERROR,
        `Failed to encrypt data: ${error.message}`
      );
    }
  }

  async decrypt(secureFieldJson: string): Promise<string> {
    try {
      const keyBuffer = this.validateKey();
      const secureField: SecureField = JSON.parse(secureFieldJson);
      
      if (!secureField.encrypted || !secureField.value || !secureField.metadata) {
        throw new Error('Invalid secure field format');
      }

      const { algorithm, iv, authTag } = secureField.metadata;
      const ivBuffer = Buffer.from(iv, 'base64');
      const authTagBuffer = Buffer.from(authTag, 'base64');
      
      const decipher = createDecipheriv(algorithm, keyBuffer, ivBuffer) as Decipher & { setAuthTag(tag: Buffer): void };
      decipher.setAuthTag(authTagBuffer);

      let plaintext = decipher.update(secureField.value, 'base64', 'utf8');
      plaintext += decipher.final('utf8');

      return plaintext;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      throw new ConfigError(
        ConfigErrorCode.DECRYPTION_ERROR,
        `Failed to decrypt data: ${error.message}`
      );
    }
  }
}
