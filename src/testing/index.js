import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import './types.d.ts';
// Re-export testing utilities
export { screen, fireEvent, waitFor, userEvent };
// Export test functions from Jest
export { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
// Custom render function with default providers
export const render = (ui, options = {}) => {
    const Wrapper = ({ children }) => {
        return children;
    };
    return rtlRender(ui, { wrapper: Wrapper, ...options });
};
// Test bed creation utilities
export const createModuleTestBed = (moduleName) => {
    return {
        initialize: async () => {
            // Module initialization logic
        },
        getState: () => ({}),
        dispatch: (action) => { },
        cleanup: () => { }
    };
};
export const createStateTestBed = (moduleName) => {
    return {
        getState: () => ({}),
        dispatch: (action) => { },
        subscribe: (listener) => () => { }
    };
};
// Event testing utilities
export const mockEventEmitter = () => {
    const listeners = new Map();
    return {
        on: (event, handler) => {
            if (!listeners.has(event)) {
                listeners.set(event, []);
            }
            listeners.get(event)?.push(handler);
        },
        off: (event, handler) => {
            const eventListeners = listeners.get(event) || [];
            const index = eventListeners.indexOf(handler);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        },
        emit: (event, data) => {
            const eventListeners = listeners.get(event) || [];
            eventListeners.forEach(handler => handler(data));
        },
        clear: () => {
            listeners.clear();
        }
    };
};
// Mock data generators
export const createMockData = {
    timestamp: (date) => new Date(date).getTime(),
    user: (overrides = {}) => ({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        ...overrides
    }),
    event: (overrides = {}) => ({
        id: 'test-event-id',
        title: 'Test Event',
        timestamp: new Date().getTime(),
        ...overrides
    })
};
// Test utilities
export const waitForLoadingToFinish = () => waitFor(() => {
    const loaders = [
        ...screen.queryAllByTestId('loading-spinner'),
        ...screen.queryAllByTestId('loading-skeleton')
    ];
    if (loaders.length > 0) {
        throw new Error('Still loading');
    }
}, { timeout: 4000 });
export const findByTestId = async (testId) => {
    await waitForLoadingToFinish();
    return screen.findByTestId(testId);
};
export const queryByTestId = (testId) => {
    return screen.queryByTestId(testId);
};
export const getByTestId = (testId) => {
    return screen.getByTestId(testId);
};
//# sourceMappingURL=index.js.map