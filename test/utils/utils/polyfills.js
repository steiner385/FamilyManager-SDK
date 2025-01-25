// Polyfills for Web APIs in Node.js test environment
import { EventEmitter } from 'events';
// MessagePort polyfill
if (typeof globalThis.MessagePort === 'undefined') {
    class MessagePort extends EventEmitter {
        constructor() {
            super();
            this._otherPort = null;
        }
        postMessage(message) {
            if (this._otherPort) {
                this._otherPort.emit('message', { data: message });
            }
        }
        start() {
            // No-op for compatibility
        }
        close() {
            this.removeAllListeners();
        }
        addEventListener(type, listener) {
            this.on(type, listener);
        }
        removeEventListener(type, listener) {
            this.off(type, listener);
        }
        dispatchEvent(event) {
            this.emit(event.type, event);
            return true;
        }
        connect(otherPort) {
            this._otherPort = otherPort;
            otherPort._otherPort = this;
        }
    }
    globalThis.MessagePort = MessagePort;
}
// Request polyfill for Node.js test environment
if (typeof globalThis.Request === 'undefined') {
    class Request {
        constructor(input, init) {
            this.body = null;
            this.bodyUsed = false;
            this.method = init?.method || 'GET';
            this.url = typeof input === 'string' ? input : input.url;
            this.headers = new Headers(init?.headers);
        }
        clone() {
            return new Request(this.url, {
                method: this.method,
                headers: this.headers,
            });
        }
        text() {
            return Promise.resolve('');
        }
        json() {
            return Promise.resolve({});
        }
        blob() {
            return Promise.resolve(new Blob());
        }
        arrayBuffer() {
            return Promise.resolve(new ArrayBuffer(0));
        }
    }
    globalThis.Request = Request;
}
// Headers polyfill
if (typeof globalThis.Headers === 'undefined') {
    class Headers {
        constructor(init) {
            this._headers = {};
            if (init) {
                if (Array.isArray(init)) {
                    init.forEach(([key, value]) => {
                        this._headers[key.toLowerCase()] = value;
                    });
                }
                else if (init instanceof Headers) {
                    init.forEach((value, key) => {
                        this._headers[key.toLowerCase()] = value;
                    });
                }
                else {
                    Object.entries(init).forEach(([key, value]) => {
                        this._headers[key.toLowerCase()] = value;
                    });
                }
            }
        }
        append(name, value) {
            this._headers[name.toLowerCase()] = value;
        }
        delete(name) {
            delete this._headers[name.toLowerCase()];
        }
        get(name) {
            return this._headers[name.toLowerCase()] || null;
        }
        has(name) {
            return name.toLowerCase() in this._headers;
        }
        set(name, value) {
            this._headers[name.toLowerCase()] = value;
        }
        forEach(callback) {
            Object.entries(this._headers).forEach(([key, value]) => {
                callback(value, key, this);
            });
        }
        [Symbol.iterator]() {
            return Object.entries(this._headers)[Symbol.iterator]();
        }
    }
    globalThis.Headers = Headers;
}
// Ensure other Web APIs are available
if (typeof globalThis.structuredClone === 'undefined') {
    globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=polyfills.js.map