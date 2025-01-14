"use strict";
// Mock ResizeObserver for tests
class MockResizeObserver {
    constructor(callback) { }
    observe(target) { }
    unobserve(target) { }
    disconnect() { }
}
// Override the global ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver
});
//# sourceMappingURL=setup.js.map