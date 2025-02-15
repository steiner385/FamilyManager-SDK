import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { EventValidationService, EventValidator } from '../validator';
import { BaseEvent, ValidationResult } from '../types';

describe('EventValidationService', () => {
  let validationService: EventValidationService;

  beforeEach(() => {
    validationService = EventValidationService.getInstance();
  });

  afterEach(() => {
    // Reset the singleton instance
    (EventValidationService as any).instance = null;
  });

  it('should validate valid events', async () => {
    const event: BaseEvent<{ value: number }> = {
      id: 'test-1',
      type: 'TEST_EVENT',
      channel: 'test',
      source: 'test-source',
      timestamp: Date.now(),
      data: { value: 1 }
    };

    const result = await validationService.validate(event);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject events without required fields', async () => {
    const invalidEvent = {
      type: 'TEST_EVENT',
      data: { value: 1 }
    } as BaseEvent<{ value: number }>;

    const result = await validationService.validate(invalidEvent);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({
      field: 'id',
      code: 'MISSING_ID'
    }));
    expect(result.errors).toContainEqual(expect.objectContaining({
      field: 'channel',
      code: 'MISSING_CHANNEL'
    }));
  });

  it('should handle custom validation rules', async () => {
    const customValidator: EventValidator<{ value: number }> = {
      validate: (event: BaseEvent<{ value: number }>) => {
        if (!event.data) return false;
        return event.data.value > 0;
      },
      errorMessage: 'Value must be positive',
      errorCode: 'INVALID_VALUE'
    };

    validationService.registerValidator('TEST_EVENT', customValidator);

    const validEvent: BaseEvent<{ value: number }> = {
      id: 'test-1',
      type: 'TEST_EVENT',
      channel: 'test',
      source: 'test-source',
      timestamp: Date.now(),
      data: { value: 1 }
    };

    const invalidEvent: BaseEvent<{ value: number }> = {
      id: 'test-2',
      type: 'TEST_EVENT',
      channel: 'test',
      source: 'test-source',
      timestamp: Date.now(),
      data: { value: -1 }
    };

    const validResult = await validationService.validate(validEvent);
    expect(validResult.isValid).toBe(true);

    const invalidResult = await validationService.validate(invalidEvent);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContainEqual(expect.objectContaining({
      field: 'custom',
      message: 'Value must be positive',
      code: 'INVALID_VALUE'
    }));
  });

  it('should validate multiple events in parallel', async () => {
    const events: Array<BaseEvent<{ value: number }>> = Array.from({ length: 10 }, (_, i) => ({
      id: `test-${i}`,
      type: 'TEST_EVENT',
      channel: 'test',
      source: 'test-source',
      timestamp: Date.now(),
      data: { value: i + 1 }
    }));

    const results = await validationService.validateBatch(events);
    expect(results).toHaveLength(events.length);
    expect(results.every(r => r.isValid)).toBe(true);
  });

  it('should handle validator registration and unregistration', async () => {
    const customValidator: EventValidator<{ value: number }> = {
      validate: (event: BaseEvent<{ value: number }>) => {
        if (!event.data) return false;
        return event.data.value > 0;
      },
      errorMessage: 'Value must be positive',
      errorCode: 'INVALID_VALUE'
    };

    validationService.registerValidator('TEST_EVENT', customValidator);
    validationService.unregisterValidator('TEST_EVENT', customValidator);

    const event: BaseEvent<{ value: number }> = {
      id: 'test-1',
      type: 'TEST_EVENT',
      channel: 'test',
      source: 'test-source',
      timestamp: Date.now(),
      data: { value: -1 }
    };

    const result = await validationService.validate(event);
    expect(result.isValid).toBe(true); // Should pass since validator was unregistered
  });
});
