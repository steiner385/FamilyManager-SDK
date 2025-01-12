import { BaseEvent, ValidationResult } from './types';

export interface ValidationRule<T = unknown> {
  name: string;
  validate: (event: BaseEvent<T>) => boolean | Promise<boolean>;
  errorMessage: string;
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
      return { isValid: false, errors: ['Validator is not running'] };
    }

    const errors: string[] = [];

    // Schema validation
    if (this.config.validateSchema) {
      if (!event.type) {
        errors.push('Invalid event type');
      }
      if (!event.source) {
        errors.push('Missing required field: source');
      }
      if (!event.metadata) {
        errors.push('Missing required metadata');
      }
    }

    // Timestamp validation
    if (this.config.validateTimestamp) {
      if (!event.timestamp || event.timestamp < 0) {
        errors.push('Invalid timestamp');
      }
    }

    // Payload validation
    if (this.config.validatePayload) {
      if (event.payload === undefined || event.payload === null) {
        errors.push('Missing required payload');
      }
    }

    // Run custom validation rules
    for (const rule of this.rules) {
      try {
        const isValid = await Promise.resolve(rule.validate(event));
        if (!isValid) {
          errors.push(rule.errorMessage);
        }
      } catch (error) {
        errors.push(error instanceof Error ? error.message : 'Unknown validation error');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
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
