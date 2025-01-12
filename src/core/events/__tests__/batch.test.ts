import { EventBatcher } from '../batch';
import { BaseEvent, EventDeliveryStatus } from '../types';
import { createTestEvent } from '../utils/test-helpers';

describe('EventBatcher', () => {
  let batcher: EventBatcher;
  const processBatchMock = jest.fn();

  beforeEach(() => {
    processBatchMock.mockReset();
    processBatchMock.mockResolvedValue([]);

    batcher = new EventBatcher({
      maxSize: 3,
      flushInterval: 100,
      processBatch: processBatchMock
    });
  });

  afterEach(async () => {
    await batcher.stop();
  });

  it('should batch events up to maxBatchSize', async () => {
    await batcher.start();

    const event1 = createTestEvent('test', { value: 1 });
    const event2 = createTestEvent('test', { value: 2 });
    const event3 = createTestEvent('test', { value: 3 });

    await batcher.addEvent(event1);
    expect(batcher.getBatchSize()).toBe(1);
    expect(processBatchMock).not.toHaveBeenCalled();

    await batcher.addEvent(event2);
    expect(batcher.getBatchSize()).toBe(2);
    expect(processBatchMock).not.toHaveBeenCalled();

    await batcher.addEvent(event3);
    expect(batcher.getBatchSize()).toBe(0);
    expect(processBatchMock).toHaveBeenCalledWith([event1, event2, event3]);
  });

  it('should process batch after maxWaitTime', async () => {
    await batcher.start();

    const event = createTestEvent('test', { value: 1 });
    await batcher.addEvent(event);

    expect(batcher.getBatchSize()).toBe(1);
    expect(processBatchMock).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(batcher.getBatchSize()).toBe(0);
    expect(processBatchMock).toHaveBeenCalledWith([event]);
  });

  it('should handle batch processing errors', async () => {
    await batcher.start();

    // Mock the process batch to return failed status
    processBatchMock.mockImplementationOnce(async (events: BaseEvent[]) => {
      return events.map(() => ({
        status: EventDeliveryStatus.Failed,
        errors: ['Processing failed']
      }));
    });

    const event = createTestEvent('test', { value: 1 });
    await batcher.addEvent(event);
    await batcher.flush();

    expect(processBatchMock).toHaveBeenCalledWith([event]);
    expect(processBatchMock).toHaveBeenCalledTimes(1);
  });

  it('should update configuration', async () => {
    await batcher.start();

    batcher.updateConfig({ maxSize: 2 });
    
    const event1 = createTestEvent('test', { value: 1 });
    const event2 = createTestEvent('test', { value: 2 });

    await batcher.addEvent(event1);
    expect(batcher.getBatchSize()).toBe(1);

    await batcher.addEvent(event2);
    expect(batcher.getBatchSize()).toBe(0);
    expect(processBatchMock).toHaveBeenCalledWith([event1, event2]);
  });

  it('should reset batch state', async () => {
    await batcher.start();

    const event = createTestEvent('test', { value: 1 });
    await batcher.addEvent(event);
    expect(batcher.getBatchSize()).toBe(1);

    batcher.reset();
    expect(batcher.getBatchSize()).toBe(0);
  });

  it('should flush batch on demand', async () => {
    await batcher.start();

    const event = createTestEvent('test', { value: 1 });
    await batcher.addEvent(event);
    expect(batcher.getBatchSize()).toBe(1);

    await batcher.flush();
    expect(batcher.getBatchSize()).toBe(0);
    expect(processBatchMock).toHaveBeenCalledWith([event]);
  });
});
