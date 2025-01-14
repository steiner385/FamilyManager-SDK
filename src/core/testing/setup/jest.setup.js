import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { jest } from '@jest/globals';
// Polyfill TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// Extend Jest matchers
expect.extend({
    toHaveBeenCalledExactlyOnceWith(received, ...expected) {
        const pass = received.mock.calls.length === 1 &&
            received.mock.calls[0].length === expected.length &&
            received.mock.calls[0].every((arg, i) => this.equals(arg, expected[i]));
        return {
            pass,
            message: () => pass
                ? `Expected function not to have been called exactly once with ${expected}`
                : `Expected function to have been called exactly once with ${expected}`
        };
    }
});
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback) {
        this.callback = callback;
        this.root = null;
        this.rootMargin = '';
        this.thresholds = [];
    }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords() { return []; }
}
window.IntersectionObserver = MockIntersectionObserver;
// Mock ResizeObserver
class MockResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = MockResizeObserver;
// Suppress console errors during tests
const originalError = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is no longer supported')) {
        return;
    }
    originalError.call(console, ...args);
};
// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});
//# sourceMappingURL=jest.setup.js.map