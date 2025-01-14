import { BaseEvent, ValidationResult, ValidationError } from './types';

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

export class AsyncValidator {
  private config: Required<ValidatorConfig>;
  private rules: ValidationRule<unknown>[] = [];
  private isRunning: boolean = false;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      validateTimestamp: config.validateTimestamp ?? true,
      validateSchema: config.validateSchema ?? true,
      validatePayload: config.validatePayload ?? true,
      rules: config.rules ?? []
    };
    this.rules = this.config.rules;
    this.start();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.isRunning = false;
  }

  async validate<T>(event: BaseEvent<T>): Promise<ValidationResult> {
    if (!this.isRunning) {
      return {
        isValid: false,
        errors: [{
          path: ['validator'],
          code: 'VALIDATOR_NOT_RUNNING',
          message: 'Validator is not running'
        }]
      };
    }

    const errors: ValidationError[] = [];

    // Schema validation
    if (this.config.validateSchema) {
      if (!event.id) {
        errors.push({
          path: ['id'],
          code: 'MISSING_FIELD',
          message: 'Missing required field: id'
        });
      }
      if (!event.type || event.type.trim() === '') {
        errors.push({
          path: ['type'],
          code: 'INVALID_TYPE',
          message: 'Invalid event type'
        });
      }
      if (!event.channel) {
        errors.push({
          path: ['channel'],
          code: 'MISSING_FIELD',
          message: 'Missing required field: channel'
        });
      }
      if (event.data === undefined || event.data === null) {
        errors.push({
          path: ['data'],
          code: 'MISSING_FIELD',
          message: 'Missing required field: data'
        });
      }
    }

    // Timestamp validation
    if (this.config.validateTimestamp && (typeof event.timestamp !== 'number' || event.timestamp < 0)) {
      errors.push({
        path: ['timestamp'],
        code: 'INVALID_TIMESTAMP',
        message: 'Invalid timestamp'
      });
    }

    // Run custom validation rules
    for (const rule of this.rules) {
      try {
        const isValid = await Promise.resolve(rule.validate(event));
        if (!isValid) {
          errors.push({
            path: rule.errorPath,
            code: rule.errorCode,
            message: rule.errorMessage
          });
        }
      } catch (error) {
        errors.push({
          path: rule.errorPath,
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown validation error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateBatch<T>(events: BaseEvent<T>[]): Promise<ValidationResult[]> {
    return Promise.all(events.map(event => this.validate<T>(event)));
  }

  addRule<T>(rule: ValidationRule<T>): void {
    this.rules.push(rule as ValidationRule<unknown>);
  }

  clearRules(): void {
    this.rules = [];
  }

  updateConfig<T>(config: Partial<ValidatorConfig> & { rules?: ValidationRule<T>[] }): void {
    this.config = {
      ...this.config,
      ...config,
      rules: config.rules ?? this.config.rules
    };
    if (config.rules) {
      this.rules = config.rules;
    }
  }

  getRunningState(): boolean {
    return this.isRunning;
  }
}
