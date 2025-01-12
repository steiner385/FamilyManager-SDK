import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { ConfigEncryption, EncryptionOptions, SecureField } from './types';
import { ConfigError } from '../errors';

export class AESConfigEncryption implements ConfigEncryption {
  private readonly key: Buffer;
  private readonly defaultAlgorithm: string;

  constructor(key: string | Buffer, options?: EncryptionOptions) {
    this.key = Buffer.isBuffer(key) ? key : Buffer.from(key, 'hex');
    this.defaultAlgorithm = options?.algorithm || 'aes-256-gcm';
  }

  async encrypt(value: string, options?: EncryptionOptions): Promise<string> {
    try {
      const iv = randomBytes(options?.ivSize || 16);
      const cipher = createCipheriv(
        options?.algorithm || this.defaultAlgorithm,
        this.key,
        iv
      );

      const encrypted = Buffer.concat([
        cipher.update(value, 'utf8'),
        cipher.final()
      ]);

      const authTag = cipher.getAuthTag();

      const secureField: SecureField = {
        encrypted: true,
        value: encrypted.toString('base64'),
        metadata: {
          algorithm: options?.algorithm || this.defaultAlgorithm,
          iv: iv.toString('base64'),
          authTag: authTag.toString('base64')
        }
      };

      return JSON.stringify(secureField);
    } catch (error) {
      throw new ConfigError(
        'ENCRYPTION_FAILED',
        'Failed to encrypt configuration value',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  async decrypt(value: string): Promise<string> {
    try {
      const secureField: SecureField = JSON.parse(value);
      
      if (!secureField.encrypted) {
        return secureField.value;
      }

      const { algorithm, iv, authTag } = secureField.metadata || {};
      if (!algorithm || !iv || !authTag) {
        throw new Error('Invalid secure field format');
      }

      const decipher = createDecipheriv(
        algorithm,
        this.key,
        Buffer.from(iv, 'base64')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'base64'));

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(secureField.value, 'base64')),
        decipher.final()
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      throw new ConfigError(
        'DECRYPTION_FAILED',
        'Failed to decrypt configuration value',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }
}
