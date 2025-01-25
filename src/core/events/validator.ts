import { Logger } from '../logging/Logger';
import { BaseEvent, ValidationResult, ValidationError } from './types';

export interface EventValidator<T = unknown> {
  validate: (event: BaseEvent<T>) => boolean | Promise<boolean>;
  errorMessage?: string;
  errorCode?: string;
}

export class EventValidationService {
  private static instance: EventValidationService;
  private logger: Logger;
  private validators: Map<string, Array<EventValidator<any>>>;

  private constructor() {
    this.logger = Logger.getInstance();
    this.validators = new Map();
  }

  public static getInstance(): EventValidationService {
    if (!EventValidationService.instance) {
      EventValidationService.instance = new EventValidationService();
    }
    return EventValidationService.instance;
  }

  registerValidator<T>(type: string, validator: EventValidator<T>): void {
    let validators = this.validators.get(type);
    if (!validators) {
      validators = [];
      this.validators.set(type, validators);
    }
    validators.push(validator as EventValidator<any>);
    this.logger.info(`Validator registered for event type: ${type}`);
  }

  unregisterValidator<T>(type: string, validator: EventValidator<T>): void {
    const validators = this.validators.get(type);
    if (validators) {
      const index = validators.indexOf(validator as EventValidator<any>);
      if (index !== -1) {
        validators.splice(index, 1);
        this.logger.info(`Validator unregistered for event type: ${type}`);
      }
    }
  }

  async validate<T>(event: BaseEvent<T>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Basic validation
    if (!event.id) {
      errors.push({
        field: 'id',
        message: 'Event ID is required',
        code: 'MISSING_ID'
      });
    }

    if (!event.type) {
      errors.push({
        field: 'type',
        message: 'Event type is required',
        code: 'MISSING_TYPE'
      });
    }

    if (!event.channel) {
      errors.push({
        field: 'channel',
        message: 'Event channel is required',
        code: 'MISSING_CHANNEL'
      });
    }

    if (!event.source) {
      errors.push({
        field: 'source',
        message: 'Event source is required',
        code: 'MISSING_SOURCE'
      });
    }

    if (!event.timestamp) {
      errors.push({
        field: 'timestamp',
        message: 'Event timestamp is required',
        code: 'MISSING_TIMESTAMP'
      });
    }

    // Custom validators
    const validators = this.validators.get(event.type);
    if (validators) {
      for (const validator of validators) {
        try {
          const isValid = await validator.validate(event);
          if (!isValid) {
            errors.push({
              field: 'custom',
              message: validator.errorMessage || 'Custom validation failed',
              code: validator.errorCode || 'CUSTOM_VALIDATION_FAILED'
            });
          }
        } catch (error) {
          this.logger.error('Error in custom validator', { error, event });
          errors.push({
            field: 'custom',
            message: 'Custom validator error',
            code: 'VALIDATOR_ERROR'
          });
        }
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
}

export const eventValidationService = EventValidationService.getInstance();
