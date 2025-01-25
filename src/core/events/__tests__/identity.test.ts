import { EventIdentityManager } from '../identity';
import { BaseEvent } from '../types';

interface TestEvent extends BaseEvent<unknown> {
  id: string;
  channel: string;
}

describe('EventIdentityManager', () => {
  let identityManager: EventIdentityManager;

  beforeEach(() => {
    identityManager = new EventIdentityManager();
  });

  afterEach(() => {
    identityManager.destroy();
  });

  it('should generate unique event IDs', () => {
    const id1 = identityManager.generateId();
    const id2 = identityManager.generateId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
  });

  it('should track event processing status', () => {
    const eventId = identityManager.generateId();
    
    expect(identityManager.isProcessed(eventId)).toBe(false);
    
    identityManager.markProcessed(eventId);
    expect(identityManager.isProcessed(eventId)).toBe(true);
  });

  it('should handle duplicate events', () => {
    const event: TestEvent = {
      id: identityManager.generateId(),
      channel: 'test',
      type: 'test',
      timestamp: Date.now(),
      source: 'test-source',
      payload: { value: 1 }
    };

    expect(identityManager.isDuplicate(event.id)).toBe(false);
    
    identityManager.markProcessed(event.id);
    expect(identityManager.isDuplicate(event.id)).toBe(true);
  });

  it('should clear processed events', () => {
    const id1 = identityManager.generateId();
    const id2 = identityManager.generateId();

    identityManager.markProcessed(id1);
    identityManager.markProcessed(id2);

    expect(identityManager.isProcessed(id1)).toBe(true);
    expect(identityManager.isProcessed(id2)).toBe(true);

    identityManager.clear();

    expect(identityManager.isProcessed(id1)).toBe(false);
    expect(identityManager.isProcessed(id2)).toBe(false);
  });

  it('should handle event expiration', async () => {
    const testManager = new EventIdentityManager({ expirationTime: 100 });
    const eventId = testManager.generateId();

    testManager.markProcessed(eventId);
    expect(testManager.isProcessed(eventId)).toBe(true);

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(testManager.isProcessed(eventId)).toBe(false);
    testManager.destroy();
  });

  it('should generate deterministic IDs for same input', () => {
    const input = 'test-event';
    const id1 = identityManager.generateDeterministicId(input);
    const id2 = identityManager.generateDeterministicId(input);

    expect(id1).toBe(id2);
  });

  it('should handle concurrent event processing', async () => {
    const events = Array.from({ length: 100 }, (_, i) => ({
      id: identityManager.generateId(),
      channel: 'test',
      type: 'test',
      timestamp: Date.now(),
      source: 'test-source',
      payload: { value: i }
    }));

    await Promise.all(
      events.map(async event => {
        if (!identityManager.isDuplicate(event.id)) {
          await Promise.resolve(); // Simulate async processing
          identityManager.markProcessed(event.id);
        }
      })
    );

    events.forEach(event => {
      expect(identityManager.isProcessed(event.id)).toBe(true);
    });
  });
});
