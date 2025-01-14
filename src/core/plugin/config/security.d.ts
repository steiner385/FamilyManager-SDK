export interface ConfigEncryption {
    encrypt(value: string): Promise<string>;
    decrypt(value: string): Promise<string>;
}
export interface SecureConfigField {
    encrypted: boolean;
    value: string;
}
export interface EncryptionOptions {
    algorithm?: string;
    keySize?: number;
    iterations?: number;
}
export declare class ConfigSecurity {
    private encryption?;
    setEncryption(encryption: ConfigEncryption): void;
    encryptField(value: string): Promise<SecureConfigField>;
    decryptField(field: SecureConfigField): Promise<string>;
}
//# sourceMappingURL=security.d.ts.map