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
    expect(result.errors).toContain('Missing required field: id');
    expect(result.errors).toContain('Missing required field: channel');
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
    expect(invalidResult.errors).toContain('Value must be positive');
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
    expect(result.errors).toContain('Invalid event type');
  });

  it('should validate event timestamps', async () => {
    const event = createTestEvent('TEST_EVENT', { value: 1 });
    event.timestamp = -1;

    const result = await validator.validate(event);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid timestamp');
  });
});
