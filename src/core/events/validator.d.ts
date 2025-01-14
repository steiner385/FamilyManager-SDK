import { BaseEvent, ValidationResult } from './types';
export interface ValidationRule<T = unknown> {
    name: string;
    validate: (event: BaseEvent<T>) => boolean | Promise<boolean>;
    errorMessage: string;
    errorCode: string;
    errorPath: string[];
}
export interface ValidatorConfig {
    validateTimestamp?: boolean;
    validateSchema?: boolean;
    validatePayload?: boolean;
    rules?: ValidationRule[];
}
export declare class AsyncValidator {
    private config;
    private rules;
    private isRunning;
    constructor(config?: ValidatorConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    validate<T>(event: BaseEvent<T>): Promise<ValidationResult>;
    validateBatch<T>(events: BaseEvent<T>[]): Promise<ValidationResult[]>;
    addRule<T>(rule: ValidationRule<T>): void;
    clearRules(): void;
    updateConfig<T>(config: Partial<ValidatorConfig> & {
        rules?: ValidationRule<T>[];
    }): void;
    getRunningState(): boolean;
}
//# sourceMappingURL=validator.d.ts.map