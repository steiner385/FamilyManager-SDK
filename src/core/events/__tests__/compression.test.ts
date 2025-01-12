import { EventCompressor } from '../compression';
import { BaseEvent } from '../types';

interface TestEvent extends BaseEvent<unknown> {
  id: string;
  channel: string;
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
      payload: {
        value: 'test'.repeat(50),  // Make sure data is large enough to trigger compression
        number: 123,
        nested: {
          array: Array(50).fill('test'),  // Large array
          object: { key: 'value'.repeat(20) }
        }
      }
    };

    const compressed = await compressor.compress(event.payload);
    expect(compressed).toBeDefined();
    expect(typeof compressed).toBe('string');

    const decompressed = await compressor.decompress<typeof event.payload>(compressed as string);
    expect(decompressed).toEqual(event.payload);
  });

  it('should not compress small data', async () => {
    const event: TestEvent = {
      id: '1',
      channel: 'test',
      type: 'test',
      timestamp: Date.now(),
      source: 'test-source',
      payload: { small: 'data' }
    };

    const result = await compressor.compress(event.payload);
    expect(result).toBe(event.payload);
  });

  it('should handle batch compression', async () => {
    const events: TestEvent[] = [
      {
        id: '1',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        payload: { value: 'test1'.repeat(50) }
      },
      {
        id: '2',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        payload: { value: Array(50).fill(123) }
      },
      {
        id: '3',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        payload: { value: Array(50).fill('test') }
      },
      {
        id: '4',
        channel: 'test',
        type: 'test',
        timestamp: Date.now(),
        source: 'test-source',
        payload: { nested: { deep: { value: 'test'.repeat(50) } } }
      }
    ];

    const compressed = await Promise.all(
      events.map(event => compressor.compress(event.payload))
    );

    expect(compressed).toHaveLength(4);
    expect(compressed.every(c => typeof c === 'string')).toBe(true);

    const decompressed = await Promise.all(
      compressed.map(c => compressor.decompress<Record<string, unknown>>(c as string))
    );

    expect(decompressed).toEqual(events.map(e => e.payload));
  });
});
