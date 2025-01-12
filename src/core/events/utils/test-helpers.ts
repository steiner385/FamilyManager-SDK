import { BaseEvent, EventHandler } from '../types';

interface MockEventHandler {
  handler: EventHandler;
  receivedEvents: BaseEvent[];
}

export function createTestEvent(type: string, payload: unknown, source: string = 'test-service'): BaseEvent {
  return {
    type,
    source,
    timestamp: Date.now() + performance.now(),
    payload,
    metadata: {}
  };
}

export function createTestEvents(count: number, payload: unknown): BaseEvent[] {
  return Array.from({ length: count }, () => createTestEvent('TEST_TYPE', payload));
}

export function createMockEventHandler(): MockEventHandler {
  const receivedEvents: BaseEvent[] = [];
  const handler: EventHandler = async (event: BaseEvent) => {
    receivedEvents.push(event);
  };
  return { handler, receivedEvents };
}

export function createMockErrorHandler(errorMessage: string): EventHandler {
  return async () => {
    throw new Error(errorMessage);
  };
}
