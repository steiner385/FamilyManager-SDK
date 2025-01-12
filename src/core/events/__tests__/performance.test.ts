import { EventBus } from '../EventBus';
import { EventDeliveryStatus } from '../types';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { createTestEvent } from '../utils/test-helpers';

jest.mock('../EventBus', () => ({
  EventBus: {
    getInstance: jest.fn(),
    resetInstance: jest.fn(),
  },
}));

describe('Event System Performance Tests', () => {
  let mockEventBus: DeepMockProxy<EventBus>;
  const TEST_CHANNEL = 'test-channel';

  beforeAll(() => {
    mockEventBus = mockDeep<EventBus>();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.registerChannel.mockImplementation(() => {});
    mockEventBus.start.mockResolvedValue();
    mockEventBus.stop.mockResolvedValue();
    mockEventBus.publish.mockResolvedValue({ status: EventDeliveryStatus.Success });
    mockEventBus.subscribe.mockImplementation(() => () => {});
    
    const { EventBus } = jest.requireMock('../EventBus');
    EventBus.getInstance.mockReturnValue(mockEventBus);
  });

  beforeEach(() => {
    // Reset mock states
    jest.clearAllMocks();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.publish.mockResolvedValue({ status: EventDeliveryStatus.Success });
  });

  it('should handle high volume of events efficiently', async () => {
    const eventCount = 1000;
    const events = Array.from({ length: eventCount }, (_, i) => 
      createTestEvent('TEST_EVENT', { index: i })
    );

    const startTime = performance.now();
    await Promise.all(events.map(event => 
      mockEventBus.publish(TEST_CHANNEL, event)
    ));
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const eventsPerSecond = (eventCount / totalTime) * 1000;

    expect(mockEventBus.publish).toHaveBeenCalledTimes(eventCount);
    expect(eventsPerSecond).toBeGreaterThan(100); // At least 100 events/second
  });

  it('should maintain consistent performance with multiple subscribers', async () => {
    const subscriberCount = 5;
    const eventCount = 100;

    // Register multiple subscribers
    const subscribers = Array.from({ length: subscriberCount }, () => 
      jest.fn().mockResolvedValue(undefined)
    );

    subscribers.forEach(subscriber => {
      mockEventBus.subscribe(TEST_CHANNEL, subscriber);
    });

    const events = Array.from({ length: eventCount }, (_, i) => 
      createTestEvent('TEST_EVENT', { index: i })
    );

    const startTime = performance.now();
    await Promise.all(events.map(event => 
      mockEventBus.publish(TEST_CHANNEL, event)
    ));
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const eventsPerSecond = (eventCount / totalTime) * 1000;

    expect(mockEventBus.publish).toHaveBeenCalledTimes(eventCount);
    expect(eventsPerSecond).toBeGreaterThan(50); // At least 50 events/second with multiple subscribers
  });

  it('should handle concurrent event publishing efficiently', async () => {
    const concurrentPublishers = 5;
    const eventsPerPublisher = 100;

    const publishers = Array.from({ length: concurrentPublishers }, (_, publisherId) => {
      return Array.from({ length: eventsPerPublisher }, (_, eventId) => 
        createTestEvent('TEST_EVENT', { publisherId, eventId })
      );
    });

    const startTime = performance.now();
    await Promise.all(
      publishers.flatMap(events =>
        events.map(event => mockEventBus.publish(TEST_CHANNEL, event))
      )
    );
    const endTime = performance.now();

    const totalEvents = concurrentPublishers * eventsPerPublisher;
    const totalTime = endTime - startTime;
    const eventsPerSecond = (totalEvents / totalTime) * 1000;

    expect(mockEventBus.publish).toHaveBeenCalledTimes(totalEvents);
    expect(eventsPerSecond).toBeGreaterThan(100); // At least 100 events/second under concurrent load
  });
});
