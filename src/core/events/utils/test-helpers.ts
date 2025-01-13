import { BaseEvent, EventHandler } from '../types';

interface MockEventHandler {
  handler: EventHandler;
  receivedEvents: BaseEvent[];
}

export function createTestEvent(type: string, data: unknown, source: string = 'test-service'): BaseEvent {
  return {
    id: `test-${Date.now()}`,
    type,
    channel: 'test-channel',
    source,
    timestamp: Date.now() + performance.now(),
    data
  };
}

export function createTestEvents(count: number, data: unknown): BaseEvent[] {
  return Array.from({ length: count }, () => createTestEvent('TEST_TYPE', data));
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
