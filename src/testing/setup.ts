// Mock ResizeObserver for tests
class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
}

// Override the global ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver
});
