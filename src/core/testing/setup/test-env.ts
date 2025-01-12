import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { EventDeliveryStatus, EventBusConfig } from '../../events/types';

// Increase timeout for tests
jest.setTimeout(30000); // 30 seconds

// Capture and log any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock PrismaClient for tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockDeep<PrismaClient>())
}));

// Mock EventBus for tests
jest.mock('../../events/EventBus', () => {
  const createMockEventBus = () => {
    const handlers = new Map();
    let isRunning = false;

    const mockEventBus = {
      isRunning,
      handlers,
      config: undefined as EventBusConfig | undefined,
      publish: jest.fn().mockImplementation(async (channel: string, event: any) => {
        // Ensure bus is running before publishing
        if (!isRunning) {
          await mockEventBus.start();
        }

        // Validate channel and event
        if (!channel) {
          throw new Error('Channel is required for event publishing');
        }

        // Initialize channel if not exists
        if (!handlers.has(channel)) {
          handlers.set(channel, new Set());
        }

        const channelHandlers = handlers.get(channel);
        const errors: string[] = [];

        // Process event through all channel handlers
        for (const handler of channelHandlers) {
          try {
            await handler({
              ...event,
              metadata: {
                ...event.metadata,
                status: 'PENDING',
                channel,
                timestamp: Date.now()
              }
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(errorMessage);
            console.error(`Event handler error in channel ${channel}:`, errorMessage);
          }
        }

        // Determine event delivery status
        return {
          status: errors.length === 0 ? EventDeliveryStatus.Delivered : EventDeliveryStatus.Failed,
          errors: errors.length > 0 ? errors : undefined
        };
      }),
      subscribe: jest.fn().mockImplementation((channel, handler) => {
        if (!handlers.has(channel)) {
          handlers.set(channel, new Set());
        }
        handlers.get(channel).add(handler);
        return () => handlers.get(channel).delete(handler);
      }),
      unsubscribe: jest.fn().mockImplementation((channel, handler) => {
        if (handlers.has(channel)) {
          handlers.get(channel).delete(handler);
        }
      }),
      start: jest.fn().mockImplementation(async () => {
        isRunning = true;
        return Promise.resolve();
      }),
      stop: jest.fn().mockImplementation(async () => {
        isRunning = false;
        handlers.clear();
        return Promise.resolve();
      }),
      restart: jest.fn().mockImplementation(async () => {
        await mockEventBus.stop();
        await mockEventBus.start();
      }),
      getRunningState: jest.fn().mockImplementation(() => isRunning),
      getChannels: jest.fn().mockImplementation(() => Array.from(handlers.keys()))
    };

    return mockEventBus;
  };

  let currentMockEventBus = createMockEventBus();

  const mockEventBusClass = {
    getInstance: jest.fn().mockImplementation((config?: EventBusConfig) => {
      // Ensure bus is started and configured
      if (!currentMockEventBus.isRunning) {
        currentMockEventBus.start();
      }
      
      // Apply configuration if provided
      if (config) {
        currentMockEventBus.config = config;
      }
      
      return currentMockEventBus;
    }),
    resetInstance: jest.fn().mockImplementation(() => {
      currentMockEventBus.stop();
      currentMockEventBus = createMockEventBus();
      currentMockEventBus.start();
    })
  };

  // Reset mock before each test
  beforeEach(() => {
    currentMockEventBus = createMockEventBus();
    currentMockEventBus.start();
  });

  return {
    EventBus: mockEventBusClass,
    getEventBus: jest.fn().mockImplementation(() => currentMockEventBus),
    resetEventBus: jest.fn().mockImplementation(() => {
      currentMockEventBus.stop();
      currentMockEventBus = createMockEventBus();
      currentMockEventBus.start();
    })
  };
});

// Comprehensive Request polyfill
if (typeof globalThis.Request === 'undefined') {
  class Request implements globalThis.Request {
    readonly method: string;
    readonly url: string;
    readonly headers: Headers;
    readonly body: ReadableStream<Uint8Array> | null = null;
    readonly bodyUsed = false;
    readonly cache: RequestCache = 'default';
    readonly credentials: RequestCredentials = 'same-origin';
    readonly mode: RequestMode = 'cors';
    readonly redirect: RequestRedirect = 'follow';
    readonly referrer = 'about:client';
    readonly referrerPolicy: ReferrerPolicy = '';
    readonly keepalive = false;
    readonly signal: AbortSignal = new AbortController().signal;
    readonly destination: RequestDestination = '';
    readonly integrity = '';
    
    constructor(input: string | Request, init: RequestInit = {}) {
      this.method = init.method || (input instanceof Request ? input.method : 'GET');
      this.url = typeof input === 'string' ? input : input.url;
      this.headers = new Headers(init.headers || (input instanceof Request ? input.headers : {}));
      
      // Copy additional properties from input if it's a Request
      if (input instanceof Request) {
        this.cache = input.cache;
        this.credentials = input.credentials;
        this.mode = input.mode;
        this.redirect = input.redirect;
        this.referrer = input.referrer;
        this.referrerPolicy = input.referrerPolicy;
        this.keepalive = input.keepalive;
        this.signal = input.signal;
        this.destination = (input as any).destination || '';
        this.integrity = input.integrity || '';
      }

      // Set properties from init
      if (init.signal) this.signal = init.signal;
      
      // Ensure integrity is set to an empty string if not provided
      this.integrity = (init as any).integrity ?? '';
    }

    clone(): Request {
      const clonedRequest = new Request(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
        mode: this.mode,
        credentials: this.credentials,
        cache: this.cache,
        redirect: this.redirect,
        referrer: this.referrer,
        referrerPolicy: this.referrerPolicy,
        keepalive: this.keepalive,
        signal: this.signal,
        integrity: this.integrity
      });

      // Add destination if it exists
      if (this.destination) {
        (clonedRequest as any).destination = this.destination;
      }

      return clonedRequest;
    }

    bytes(): Promise<Uint8Array> {
      return this.arrayBuffer().then(buffer => new Uint8Array(buffer));
    }

    text(): Promise<string> {
      return Promise.resolve('');
    }

    json(): Promise<any> {
      return Promise.resolve({});
    }

    blob(): Promise<Blob> {
      return Promise.resolve(new Blob());
    }

    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }

    formData(): Promise<FormData> {
      return Promise.resolve(new FormData());
    }
  }

  globalThis.Request = Request as any;
}

// Comprehensive Headers polyfill
if (typeof globalThis.Headers === 'undefined') {
  class Headers implements globalThis.Headers {
    private _headers: Record<string, string> = {};

    constructor(init?: HeadersInit) {
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([key, value]) => {
            this._headers[key.toLowerCase()] = value;
          });
        } else if (init instanceof Headers) {
          init.forEach((value, key) => {
            this._headers[key.toLowerCase()] = value;
          });
        } else {
          Object.entries(init).forEach(([key, value]) => {
            this._headers[key.toLowerCase()] = value as string;
          });
        }
      }
    }

    append(name: string, value: string): void {
      this._headers[name.toLowerCase()] = value;
    }

    delete(name: string): void {
      delete this._headers[name.toLowerCase()];
    }

    get(name: string): string | null {
      return this._headers[name.toLowerCase()] || null;
    }

    has(name: string): boolean {
      return name.toLowerCase() in this._headers;
    }

    set(name: string, value: string): void {
      this._headers[name.toLowerCase()] = value;
    }

    forEach(
      callbackfn: (value: string, key: string, parent: Headers) => void, 
      thisArg?: any
    ): void {
      Object.entries(this._headers).forEach(([key, value]) => {
        callbackfn.call(thisArg, value, key, this);
      });
    }

    [Symbol.iterator]() {
      return Object.entries(this._headers)[Symbol.iterator]();
    }

    entries(): IterableIterator<[string, string]> {
      return Object.entries(this._headers)[Symbol.iterator]();
    }

    keys(): IterableIterator<string> {
      return Object.keys(this._headers)[Symbol.iterator]();
    }

    values(): IterableIterator<string> {
      return Object.values(this._headers)[Symbol.iterator]();
    }

    getSetCookie(): string[] {
      return this.get('set-cookie')?.split(', ') || [];
    }
  }

  globalThis.Headers = Headers as any;
}

export {}; // Ensure this is a module
