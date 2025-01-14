export interface EncryptionOptions {
    algorithm?: string;
    keySize?: number;
    ivSize?: number;
}
export interface ConfigEncryption {
    encrypt(value: string, options?: EncryptionOptions): Promise<string>;
    decrypt(value: string): Promise<string>;
}
export interface SecureField {
    encrypted: boolean;
    value: string;
    metadata?: {
        algorithm?: string;
        keyId?: string;
        iv?: string;
    };
}
//# sourceMappingURL=types.d.ts.map