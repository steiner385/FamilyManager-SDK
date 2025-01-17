import { EventHandler } from '../../../core/events/types';
/**
 * Core test utilities for user and family management.
 * Module-specific test utilities should be placed in their respective module's test directories.
 */
export declare function createTestUser(data: {
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}): Promise<any>;
export declare function createTestFamily(userId: string): Promise<any>;
export declare function createMockHandler(): {
    handler: EventHandler;
    calls: any[];
};
export declare function waitForEvents(timeout?: number): Promise<void>;
//# sourceMappingURL=test-helpers.d.ts.map