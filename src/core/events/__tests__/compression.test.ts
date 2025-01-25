import { EventCompressor } from '../compression';
import { BaseEvent } from '../types';

interface TestEvent extends BaseEvent<Record<string, unknown>> {
  // No need to redeclare id and channel as they're already in BaseEvent
}

describe('EventCompressor', () => {
  let compressor: EventCompressor;

  beforeEach(() => {
    compressor = new EventCompressor({
      compressionLevel: 1,
      threshold: 100
    });
  });

  it('should compress event data', async () => {
    const event: TestEvent = {
      id: '1',
      channel: 'test',
      type: 'test',
      timestamp: Date.now(),
      source: 'test-source',
      data: {
        value: 'test'.repeat(50),  // Make sure data is large enough to trigger compression
        number: 123,
        nested: {
          array: Array(50).fill('test'),  // Large array
          object: { key: 'value'.repeat(20) }
        }
      }
    };

    const compressed = await compressor.compress(event.data);
    expect(compressed).toBeDefined();
    expect(typeof compressed).toBe('string');

    const decompressed = await compressor.decompress(compressed as string);
    expect(decompressed).toEqual(event.data);
  });

  it('should not compress small data', async () => {
    const event: TestEvent = {
      id: '1',
      channel: 'test',
      type: 'test',
      timestamp: Date.now(),
      source: 'test-source',
      data: { small: 'data' }
    };

    const result = await compressor.compress(event.data);
    expect(result).toBe(event.data);
  });

  it('should handle batch compression', async () => {
    const events: TestEvent[] = [
      {
        id: '1',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        data: { value: 'test1'.repeat(50) }
      },
      {
        id: '2',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        data: { value: Array(50).fill(123) }
      },
      {
        id: '3',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        data: { value: Array(50).fill('test') }
      },
      {
        id: '4',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        data: { nested: { deep: { value: 'test'.repeat(50) } } }
      }
    ];

    const compressed = await Promise.all(
      events.map(event => compressor.compress(event.data))
    );

    expect(compressed).toHaveLength(4);
    expect(compressed.every(c => typeof c === 'string')).toBe(true);

    const decompressed = await Promise.all(
      compressed.map(c => compressor.decompress(c as string))
    );

    expect(decompressed).toEqual(events.map(e => e.data));
  });
});
