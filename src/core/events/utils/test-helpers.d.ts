import { BaseEvent, EventHandler } from '../types';
interface MockEventHandler {
    handler: EventHandler;
    receivedEvents: BaseEvent[];
}
export declare function createTestEvent(type: string, data: unknown, source?: string): BaseEvent;
export declare function createTestEvents(count: number, data: unknown): BaseEvent[];
export declare function createMockEventHandler(): MockEventHandler;
export declare function createMockErrorHandler(errorMessage: string): EventHandler;
export {};
//# sourceMappingURL=test-helpers.d.ts.map