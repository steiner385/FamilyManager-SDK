import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { ConfigError, ConfigErrorCode } from '../errors';
export class AESConfigEncryption {
    constructor(key) {
        this.defaultAlgorithm = 'aes-256-gcm';
        this.defaultIvSize = 16;
        this.key = key;
    }
    validateKey() {
        try {
            const keyBuffer = Buffer.isBuffer(this.key) ? this.key : Buffer.from(this.key);
            if (keyBuffer.length !== 32) {
                throw new Error('Key must be 32 bytes');
            }
            return keyBuffer;
        }
        catch (err) {
            throw new ConfigError(ConfigErrorCode.ENCRYPTION_ERROR, 'Invalid encryption key');
        }
    }
    async encrypt(plaintext, options = {}) {
        try {
            const keyBuffer = this.validateKey();
            const algorithm = options.algorithm || this.defaultAlgorithm;
            const ivSize = options.ivSize || this.defaultIvSize;
            const iv = randomBytes(ivSize);
            const cipher = createCipheriv(algorithm, keyBuffer, iv);
            let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
            ciphertext += cipher.final('base64');
            const secureField = {
                encrypted: true,
                value: ciphertext,
                metadata: {
                    algorithm,
                    iv: iv.toString('base64'),
                    authTag: cipher.getAuthTag().toString('base64')
                }
            };
            return JSON.stringify(secureField);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new ConfigError(ConfigErrorCode.ENCRYPTION_ERROR, `Failed to encrypt data: ${error.message}`);
        }
    }
    async decrypt(secureFieldJson) {
        try {
            const keyBuffer = this.validateKey();
            const secureField = JSON.parse(secureFieldJson);
            if (!secureField.encrypted || !secureField.value || !secureField.metadata) {
                throw new Error('Invalid secure field format');
            }
            const { algorithm, iv, authTag } = secureField.metadata;
            const ivBuffer = Buffer.from(iv, 'base64');
            const authTagBuffer = Buffer.from(authTag, 'base64');
            const decipher = createDecipheriv(algorithm, keyBuffer, ivBuffer);
            decipher.setAuthTag(authTagBuffer);
            let plaintext = decipher.update(secureField.value, 'base64', 'utf8');
            plaintext += decipher.final('utf8');
            return plaintext;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new ConfigError(ConfigErrorCode.DECRYPTION_ERROR, `Failed to decrypt data: ${error.message}`);
        }
    }
}
//# sourceMappingURL=encryption.js.map