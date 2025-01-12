import { EventBus } from '../../events/EventBus';
import { EventDeliveryStatus } from '../../events/types';
import { mockDeep } from 'jest-mock-extended';

// Mock EventBus for all tests
jest.mock('../../events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn(),
    resetInstance: jest.fn(),
  },
}));

const mockEventBus = mockDeep<EventBus>();
mockEventBus.start.mockResolvedValue();
mockEventBus.stop.mockResolvedValue();
mockEventBus.getRunningState.mockReturnValue(true);
mockEventBus.publish.mockResolvedValue({ status: EventDeliveryStatus.Delivered });
mockEventBus.subscribe.mockReturnValue(() => {});

beforeAll(() => {
  // Set up EventBus mock
  const { EventBus } = jest.requireMock('../../events/EventBus');
  EventBus.getInstance.mockReturnValue(mockEventBus);
});

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  mockEventBus.getRunningState.mockReturnValue(true);
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();
});
