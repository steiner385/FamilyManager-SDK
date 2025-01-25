import { BaseEvent, ValidationResult, ValidationError } from './types';
import { Logger } from '../logging/Logger';

export interface ValidatorConfig {
  validateTimestamp?: boolean;
  validateSchema?: boolean;
  validatePayload?: boolean;
  rules?: ValidationRule[];
}

export interface ValidationRule<T = any> {
  validate: (event: BaseEvent<T>) => Promise<boolean>;
  errorMessage?: string;
}

export class AsyncValidator {
  private config: Required<ValidatorConfig>;
  private rules: ValidationRule[];
  private isRunning: boolean;
  private logger: Logger;

  constructor(config: Partial<ValidatorConfig> = {}) {
    this.logger = Logger.getInstance();
    this.config = {
      validateTimestamp: true,
      validateSchema: true,
      validatePayload: true,
      rules: [],
      ...config
    };
    this.rules = [];
    this.isRunning = false;
  }

  async start(): Promise<void> {
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  async validate<T>(event: BaseEvent<T>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    if (!event.id) {
      errors.push({
        field: 'id',
        message: 'Missing required field: id',
        code: 'MISSING_FIELD'
      });
    }

    if (!event.type) {
      errors.push({
        field: 'type',
        message: 'Invalid event type',
        code: 'INVALID_TYPE'
      });
    }

    if (!event.channel) {
      errors.push({
        field: 'channel',
        message: 'Missing required field: channel',
        code: 'MISSING_FIELD'
      });
    }

    if (this.config.validateTimestamp && (!event.timestamp || event.timestamp < 0)) {
      errors.push({
        field: 'timestamp',
        message: 'Invalid timestamp',
        code: 'INVALID_TIMESTAMP'
      });
    }

    for (const rule of this.rules) {
      try {
        const isValid = await rule.validate(event);
        if (!isValid) {
          errors.push({
            field: 'custom',
            message: rule.errorMessage || 'Custom validation failed',
            code: 'CUSTOM_VALIDATION'
          });
        }
      } catch (error) {
        this.logger.error('Validation rule failed', { error });
        errors.push({
          field: 'custom',
          message: 'Validation rule error',
          code: 'RULE_ERROR'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateBatch<T>(events: BaseEvent<T>[]): Promise<ValidationResult[]> {
    return Promise.all(events.map(event => this.validate(event)));
  }

  addRule<T>(rule: ValidationRule<T>): void {
    this.rules.push(rule);
  }

  updateConfig(config: Partial<ValidatorConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
}