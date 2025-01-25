import { AESConfigEncryption } from '../../security/encryption';
import { ConfigError } from '../../errors';
import { randomBytes } from 'crypto';

describe('AESConfigEncryption', () => {
  let encryption: AESConfigEncryption;
  const testKey = randomBytes(32);

  beforeEach(() => {
    encryption = new AESConfigEncryption(testKey);
  });

  it('should encrypt and decrypt values correctly', async () => {
    const originalValue = 'test-secret-value';
    
    const encrypted = await encryption.encrypt(originalValue);
    const decrypted = await encryption.decrypt(encrypted);

    expect(decrypted).toBe(originalValue);
    expect(encrypted).not.toBe(originalValue);
    
    // Verify encrypted value is a valid SecureField JSON
    const parsed = JSON.parse(encrypted);
    expect(parsed).toMatchObject({
      encrypted: true,
      value: expect.any(String),
      metadata: {
        algorithm: expect.any(String),
        iv: expect.any(String),
        authTag: expect.any(String)
      }
    });
  });

  it('should handle encryption with custom options', async () => {
    const value = 'test-value';
    const options = {
      algorithm: 'aes-256-gcm',
      ivSize: 12
    };

    const encrypted = await encryption.encrypt(value, options);
    const decrypted = await encryption.decrypt(encrypted);

    expect(decrypted).toBe(value);
    
    const parsed = JSON.parse(encrypted);
    expect(parsed.metadata.algorithm).toBe(options.algorithm);
  });

  it('should throw ConfigError on encryption failure', async () => {
    const invalidKey = 'invalid-key';
    const badEncryption = new AESConfigEncryption(invalidKey);

    await expect(badEncryption.encrypt('test'))
      .rejects
      .toThrow(ConfigError);
  });

  it('should throw ConfigError on decryption failure', async () => {
    const invalidSecureField = JSON.stringify({
      encrypted: true,
      value: 'invalid-base64',
      metadata: {
        algorithm: 'aes-256-gcm',
        iv: 'invalid-iv',
        authTag: 'invalid-tag'
      }
    });

    await expect(encryption.decrypt(invalidSecureField))
      .rejects
      .toThrow(ConfigError);
  });
});
