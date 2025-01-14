interface EncryptionOptions {
    algorithm?: string;
    ivSize?: number;
}
export declare class AESConfigEncryption {
    private readonly defaultAlgorithm;
    private readonly defaultIvSize;
    private readonly key;
    constructor(key: Buffer | string);
    private validateKey;
    encrypt(plaintext: string, options?: EncryptionOptions): Promise<string>;
    decrypt(secureFieldJson: string): Promise<string>;
}
export {};
//# sourceMappingURL=encryption.d.ts.map