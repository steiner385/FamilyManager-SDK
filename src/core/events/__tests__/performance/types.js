import { describe, it, expect, beforeAll } from '@jest/globals';
import '../../../events/performance/metrics';
describe('Performance Types', () => {
    beforeAll(() => {
        // Reset metrics before tests
        global.__PERFORMANCE_METRICS__?.reset();
    });
    it('should define global performance metrics', () => {
        expect(global.__PERFORMANCE_METRICS__).toBeDefined();
        expect(global.__PERFORMANCE_METRICS__?.eventCount).toBe(0);
        expect(global.__PERFORMANCE_METRICS__?.errorCount).toBe(0);
    });
});
//# sourceMappingURL=types.js.map