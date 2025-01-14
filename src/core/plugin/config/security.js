export class ConfigSecurity {
    setEncryption(encryption) {
        this.encryption = encryption;
    }
    async encryptField(value) {
        if (!this.encryption) {
            return { encrypted: false, value };
        }
        const encrypted = await this.encryption.encrypt(value);
        return { encrypted: true, value: encrypted };
    }
    async decryptField(field) {
        if (!field.encrypted || !this.encryption) {
            return field.value;
        }
        return this.encryption.decrypt(field.value);
    }
}
//# sourceMappingURL=security.js.map