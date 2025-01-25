export function mockPluginContext(overrides = {}) {
  return {
    eventBus: {
      emit: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    },
    logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
    config: {},
    ...overrides,
  }
}
