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

export class ConfigSecurity {
  private encryption?: ConfigEncryption;
  
  setEncryption(encryption: ConfigEncryption): void {
    this.encryption = encryption;
  }

  async encryptField(value: string): Promise<SecureConfigField> {
    if (!this.encryption) {
      return { encrypted: false, value };
    }
    
    const encrypted = await this.encryption.encrypt(value);
    return { encrypted: true, value: encrypted };
  }

  async decryptField(field: SecureConfigField): Promise<string> {
    if (!field.encrypted || !this.encryption) {
      return field.value;
    }
    
    return this.encryption.decrypt(field.value);
  }
}
