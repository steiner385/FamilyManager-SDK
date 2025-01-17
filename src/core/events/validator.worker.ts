import { Logger } from '../logging/Logger';
import { BaseEvent, ValidationResult, ValidationError, PoolEvent } from './types';

type ValidatableEvent<T = unknown> = BaseEvent<T> & Partial<Pick<PoolEvent<T>, 'source'>>;

export class EventValidatorWorker {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  private validateType<T>(event: ValidatableEvent<T>): ValidationError | null {
    if (!event.type || typeof event.type !== 'string') {
      return {
        field: 'type',
        message: 'Event type must be a non-empty string',
        code: 'INVALID_TYPE'
      };
    }
    return null;
  }

  private validateTimestamp<T>(event: ValidatableEvent<T>): ValidationError | null {
    if (!event.timestamp || typeof event.timestamp !== 'number') {
      return {
        field: 'timestamp',
        message: 'Event timestamp must be a valid number',
        code: 'INVALID_TIMESTAMP'
      };
    }
    return null;
  }

  private validateSource<T>(event: ValidatableEvent<T>): ValidationError | null {
    if (event.source && typeof event.source !== 'string') {
      return {
        field: 'source',
        message: 'Event source must be a string when provided',
        code: 'INVALID_SOURCE'
      };
    }
    return null;
  }

  private validateData<T>(event: ValidatableEvent<T>): ValidationError | null {
    if (event.data !== undefined && typeof event.data !== 'object') {
      return {
        field: 'data',
        message: 'Event data must be an object when provided',
        code: 'INVALID_DATA'
      };
    }
    return null;
  }

  private validateTimestampRange<T>(event: ValidatableEvent<T>): ValidationError | null {
    const now = Date.now();
    const maxFuture = now + 1000 * 60 * 60; // 1 hour in the future
    const maxPast = now - 1000 * 60 * 60 * 24 * 7; // 7 days in the past

    if (event.timestamp > maxFuture || event.timestamp < maxPast) {
      return {
        field: 'timestamp',
        message: 'Event timestamp must be within valid range',
        code: 'TIMESTAMP_OUT_OF_RANGE'
      };
    }
    return null;
  }

  private validateTypeFormat<T>(event: ValidatableEvent<T>): ValidationError | null {
    const typePattern = /^[a-z][a-z0-9]*(?:\:[a-z0-9]+)*$/i;
    if (!typePattern.test(event.type)) {
      return {
        field: 'type',
        message: 'Event type format is invalid',
        code: 'INVALID_TYPE_FORMAT'
      };
    }
    return null;
  }

  async validate<T>(event: ValidatableEvent<T>): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    try {
      const validations = [
        this.validateType(event),
        this.validateTimestamp(event),
        this.validateSource(event),
        this.validateData(event),
        this.validateTimestampRange(event),
        this.validateTypeFormat(event)
      ];

      for (const error of validations) {
        if (error) {
          errors.push(error);
        }
      }
    } catch (error) {
      this.logger.error('Validation error', { error, event });
      errors.push({
        field: 'validator',
        message: 'Internal validation error',
        code: 'VALIDATOR_ERROR'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateBatch<T>(events: ValidatableEvent<T>[]): Promise<ValidationResult[]> {
    return Promise.all(events.map(event => this.validate(event)));
  }
}

export const eventValidatorWorker = new EventValidatorWorker();
