import { AsyncValidator } from '../validator';
import { createTestEvent } from '../utils/test-helpers';
import { BaseEvent } from '../types';

describe('AsyncValidator', () => {
  let validator: AsyncValidator;

  beforeEach(() => {
    validator = new AsyncValidator({
      validateSchema: true,
      validatePayload: true,
      validateTimestamp: true
    });
  });

  afterEach(() => {
    validator.stop();
  });

  it('should validate valid events', async () => {
    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await validator.validate(event);
    expect(result.isValid).toBe(true);
  });

  it('should reject events without required fields', async () => {
    const invalidEvent = {
      type: 'TEST_EVENT',
      data: { value: 1 }
    } as BaseEvent;

    const result = await validator.validate(invalidEvent);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'id',
      message: 'Missing required field: id',
      code: 'MISSING_FIELD'
    });
    expect(result.errors).toContainEqual({
      field: 'channel',
      message: 'Missing required field: channel', 
      code: 'MISSING_FIELD'
    });
  });

  it('should handle custom validation rules', async () => {
    validator.addRule({
      name: 'checkValue',
      validate: (event: BaseEvent<{ value: number }>) => {
        return event.data.value > 0;
      },
      errorMessage: 'Value must be positive'
    });

    const validEvent = createTestEvent('TEST_EVENT', { value: 1 });
    const invalidEvent = createTestEvent('TEST_EVENT', { value: -1 });

    const validResult = await validator.validate(validEvent);
    expect(validResult.isValid).toBe(true);

    const invalidResult = await validator.validate(invalidEvent);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContainEqual({
      field: 'custom',
      message: 'Value must be positive',
      code: 'CUSTOM_VALIDATION'
    });
  });

  it('should validate multiple events in parallel', async () => {
    const events = Array.from({ length: 10 }, (_, i) => 
      createTestEvent('TEST_TYPE', { value: i + 1 })
    );

    const results = await validator.validateBatch(events);
    expect(results).toHaveLength(events.length);
    expect(results.every(r => r.isValid)).toBe(true);
  });

  it('should update configuration', async () => {
    validator.updateConfig({
      validateSchema: false,
      validatePayload: false
    });

    const event = createTestEvent('TEST_EVENT', { value: 1 });
    const result = await validator.validate(event);
    expect(result.isValid).toBe(true);
  });

  it('should handle invalid event types', async () => {
    const invalidEvent = createTestEvent('', { value: 1 });
    const result = await validator.validate(invalidEvent);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'type',
      message: 'Invalid event type',
      code: 'INVALID_TYPE'
    });
  });

  it('should validate event timestamps', async () => {
    const event = createTestEvent('TEST_EVENT', { value: 1 });
    event.timestamp = -1;

    const result = await validator.validate(event);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'timestamp',
      message: 'Invalid timestamp',
      code: 'INVALID_TIMESTAMP'
    });
  });
});
