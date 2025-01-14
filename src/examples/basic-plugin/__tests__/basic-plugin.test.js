import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Logger } from '../../../logger';
import { EventBus } from '../../../events/EventBus';
// Create mock instances with proper types
const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(() => mockLogger),
    configure: jest.fn()
};
const mockEventBus = {
    start: jest.fn().mockImplementation(async () => undefined),
    stop: jest.fn().mockImplementation(async () => undefined),
    subscribe: jest.fn().mockImplementation(async () => () => { }),
    publish: jest.fn().mockImplementation(async () => ({ status: 'success' })),
    getRunningState: jest.fn().mockImplementation(() => true),
    restart: jest.fn().mockImplementation(async () => undefined),
    getStats: jest.fn().mockImplementation(() => ({})),
    clearHistory: jest.fn().mockImplementation(() => undefined),
    getHistory: jest.fn().mockImplementation(() => [])
};
// Mock modules
jest.mock('../../../logger', () => ({
    Logger: jest.fn().mockImplementation(() => mockLogger)
}));
jest.mock('../../../events/EventBus', () => ({
    EventBus: jest.fn().mockImplementation(() => mockEventBus)
}));
beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    Logger.mockImplementation(() => mockLogger);
    EventBus.mockImplementation(() => mockEventBus);
});
// Import after mocks
import { BasicPlugin } from '../index';
describe('BasicPlugin', () => {
    let plugin;
    beforeEach(async () => {
        // Reset mock calls
        jest.clearAllMocks();
        // Create plugin instance
        plugin = new BasicPlugin();
        // Set initial config
        await plugin.updateConfig({
            greeting: 'Test Greeting',
            logLevel: 'info'
        });
    });
    describe('Lifecycle', () => {
        it('should initialize successfully', async () => {
            await plugin.init();
            expect(mockLogger.info).toHaveBeenCalledWith('Initializing basic plugin');
            expect(mockLogger.info).toHaveBeenCalledWith('Configured with greeting: Test Greeting');
        });
        it('should start successfully', async () => {
            await plugin.init();
            // Start plugin
            await plugin.start();
            expect(mockLogger.info).toHaveBeenCalledWith('Starting basic plugin');
            expect(mockEventBus.publish).toHaveBeenCalledWith('basic-plugin.greeting', {
                message: 'Test Greeting'
            });
        });
        it('should stop successfully', async () => {
            await plugin.init();
            await plugin.start();
            // Stop plugin
            await plugin.stop();
            expect(mockLogger.info).toHaveBeenCalledWith('Stopping basic plugin');
        });
    });
    describe('Event Handling', () => {
        beforeEach(async () => {
            await plugin.init();
            await plugin.start();
        });
        it('should handle user.created event', async () => {
            const event = {
                id: '123',
                type: 'user.created',
                data: {
                    userId: 'user-123'
                },
                metadata: {
                    timestamp: Date.now(),
                    source: 'test',
                    version: '1.0'
                }
            };
            // Simulate event
            await plugin['handleEvent'](event);
            expect(mockLogger.info).toHaveBeenCalledWith('New user created', { userId: 'user-123' });
            expect(mockEventBus.publish).toHaveBeenCalledWith('basic-plugin.greeting', {
                message: 'Test Greeting',
                userId: 'user-123'
            });
        });
        it('should handle family.updated event', async () => {
            const event = {
                id: '123',
                type: 'family.updated',
                data: {
                    familyId: 'family-123'
                },
                metadata: {
                    timestamp: Date.now(),
                    source: 'test',
                    version: '1.0'
                }
            };
            // Simulate event
            await plugin['handleEvent'](event);
            expect(mockLogger.info).toHaveBeenCalledWith('Family updated', { familyId: 'family-123' });
        });
        it('should warn on unknown event type', async () => {
            const event = {
                id: '123',
                type: 'unknown.event',
                data: {},
                metadata: {
                    timestamp: Date.now(),
                    source: 'test',
                    version: '1.0'
                }
            };
            // Simulate event
            await plugin['handleEvent'](event);
            expect(mockLogger.warn).toHaveBeenCalledWith('Unhandled event type: unknown.event');
        });
    });
    describe('Configuration', () => {
        beforeEach(async () => {
            // Initialize plugin
            await plugin.init();
            await plugin.start();
        });
        it('should handle configuration updates', async () => {
            const newConfig = {
                greeting: 'Updated Greeting',
                logLevel: 'debug'
            };
            await plugin.updateConfig(newConfig);
            expect(mockLogger.info).toHaveBeenCalledWith(`Updating configuration: ${JSON.stringify(newConfig)}`);
            expect(mockEventBus.publish).toHaveBeenCalledWith('basic-plugin.greeting', {
                message: 'Updated Greeting'
            });
        });
        it('should validate configuration updates', async () => {
            const invalidConfig = {
                greeting: '', // Invalid: empty string
                logLevel: 'info'
            };
            await expect(plugin.updateConfig(invalidConfig)).rejects.toThrow();
        });
    });
    describe('Health Checks', () => {
        it('should report healthy when properly configured', async () => {
            await plugin.updateConfig({
                greeting: 'Test Greeting',
                logLevel: 'info'
            });
            const health = await plugin.getHealth();
            expect(health.status).toBe('healthy');
            expect(health.message).toBe('Plugin is healthy');
            expect(health.metrics).toBeDefined();
        });
        it('should report degraded when missing configuration', async () => {
            // Override config directly to simulate invalid state
            plugin.context.config = {
                logLevel: 'info'
                // greeting is missing
            };
            const health = await plugin.getHealth();
            expect(health.status).toBe('degraded');
            expect(health.message).toBe('Missing greeting configuration');
        });
    });
    // Clean up after all tests
    afterEach(async () => {
        // Ensure plugin is stopped to clean up any intervals
        if (plugin) {
            await plugin.stop().catch(() => {
                // Ignore errors if plugin wasn't started
            });
        }
    });
});
//# sourceMappingURL=basic-plugin.test.js.map