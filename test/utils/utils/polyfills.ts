// Polyfills for Web APIs in Node.js test environment
import { EventEmitter } from 'events';

// MessagePort polyfill
if (typeof globalThis.MessagePort === 'undefined') {
  class MessagePort extends EventEmitter implements globalThis.MessagePort {
    private _otherPort: MessagePort | null = null;

    constructor() {
      super();
    }

    postMessage(message: any): void {
      if (this._otherPort) {
        this._otherPort.emit('message', { data: message });
      }
    }

    start(): void {
      // No-op for compatibility
    }

    close(): void {
      this.removeAllListeners();
    }

    addEventListener(type: 'message', listener: (event: { data: any }) => void): void {
      this.on(type, listener);
    }

    removeEventListener(type: 'message', listener: (event: { data: any }) => void): void {
      this.off(type, listener);
    }

    dispatchEvent(event: { type: 'message', data: any }): boolean {
      this.emit(event.type, event);
      return true;
    }

    connect(otherPort: MessagePort): void {
      this._otherPort = otherPort;
      (otherPort as any)._otherPort = this;
    }
  }

  globalThis.MessagePort = MessagePort as any;
}

// Request polyfill for Node.js test environment
if (typeof globalThis.Request === 'undefined') {
  class Request implements globalThis.Request {
    method: string;
    url: string;
    headers: Headers;
    body: ReadableStream<Uint8Array> | null = null;
    bodyUsed = false;
    
    constructor(input: string | Request, init?: RequestInit) {
      this.method = init?.method || 'GET';
      this.url = typeof input === 'string' ? input : input.url;
      this.headers = new Headers(init?.headers);
    }

    clone(): Request {
      return new Request(this.url, {
        method: this.method,
        headers: this.headers,
      });
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
  }

  globalThis.Request = Request as any;
}

// Headers polyfill
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

    forEach(callback: (value: string, key: string, parent: Headers) => void): void {
      Object.entries(this._headers).forEach(([key, value]) => {
        callback(value, key, this);
      });
    }

    [Symbol.iterator]() {
      return Object.entries(this._headers)[Symbol.iterator]();
    }
  }

  globalThis.Headers = Headers as any;
}

// Ensure other Web APIs are available
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

export {};