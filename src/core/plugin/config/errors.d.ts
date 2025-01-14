export declare enum ConfigErrorCode {
    ENCRYPTION_ERROR = "ENCRYPTION_ERROR",
    DECRYPTION_ERROR = "DECRYPTION_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    STORAGE_ERROR = "STORAGE_ERROR",
    NOT_FOUND = "NOT_FOUND",
    INVALID_CONFIG = "INVALID_CONFIG"
}
export interface ConfigErrorDetails {
    errors?: any[];
    [key: string]: any;
}
export declare class ConfigError extends Error {
    code: ConfigErrorCode;
    details?: ConfigErrorDetails;
    constructor(code: ConfigErrorCode, message: string, details?: ConfigErrorDetails);
}
//# sourceMappingURL=errors.d.ts.map