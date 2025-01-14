export var ConfigErrorCode;
(function (ConfigErrorCode) {
    ConfigErrorCode["ENCRYPTION_ERROR"] = "ENCRYPTION_ERROR";
    ConfigErrorCode["DECRYPTION_ERROR"] = "DECRYPTION_ERROR";
    ConfigErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ConfigErrorCode["STORAGE_ERROR"] = "STORAGE_ERROR";
    ConfigErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ConfigErrorCode["INVALID_CONFIG"] = "INVALID_CONFIG";
})(ConfigErrorCode || (ConfigErrorCode = {}));
export class ConfigError extends Error {
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.name = 'ConfigError';
        this.details = details;
    }
}
//# sourceMappingURL=errors.js.map