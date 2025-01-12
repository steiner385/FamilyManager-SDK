import { 
  render as rtlRender, 
  screen, 
  fireEvent, 
  waitFor 
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import './types';

// Re-export testing utilities
export { 
  screen,
  fireEvent,
  waitFor,
  userEvent
};

// Export test functions from Jest
export const describe = global.describe;
export const it = global.it;
export const expect = global.expect;
export const beforeEach = global.beforeEach;
export const afterEach = global.afterEach;
export const jest = global.jest;

// Custom render function with default providers
export const render = (ui: React.ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return children;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Test bed creation utilities
export const createModuleTestBed = (moduleName: string) => {
  return {
    initialize: async () => {
      // Module initialization logic
    },
    getState: () => ({}),
    dispatch: (action: any) => {},
    cleanup: () => {}
  };
};

export const createStateTestBed = (moduleName: string) => {
  return {
    getState: () => ({}),
    dispatch: (action: any) => {},
    subscribe: (listener: () => void) => () => {}
  };
};

// Event testing utilities
export const mockEventEmitter = () => {
  const listeners = new Map<string, Array<(data: any) => void>>();

  return {
    on: (event: string, handler: (data: any) => void) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)?.push(handler);
    },
    off: (event: string, handler: (data: any) => void) => {
      const eventListeners = listeners.get(event) || [];
      const index = eventListeners.indexOf(handler);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    },
    emit: (event: string, data: any) => {
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
  timestamp: (date: string) => new Date(date).getTime(),
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
export const waitForLoadingToFinish = () =>
  waitFor(
    () => {
      const loaders = [
        ...screen.queryAllByTestId('loading-spinner'),
        ...screen.queryAllByTestId('loading-skeleton')
      ];
      
      if (loaders.length > 0) {
        throw new Error('Still loading');
      }
    },
    { timeout: 4000 }
  );

export const findByTestId = async (testId: string) => {
  await waitForLoadingToFinish();
  return screen.findByTestId(testId);
};

export const queryByTestId = (testId: string) => {
  return screen.queryByTestId(testId);
};

export const getByTestId = (testId: string) => {
  return screen.getByTestId(testId);
};
