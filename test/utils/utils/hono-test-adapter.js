import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import supertest from 'supertest';
import { Server, createServer } from 'node:http';
import { URL } from 'url';
// Helper function to convert Headers to a plain object
function headersToObject(headers) {
    const headerMap = {};
    headers.forEach((value, key) => {
        headerMap[key] = value;
    });
    return headerMap;
}
async function createHonoRequest(url, method, headers, data) {
    // Create headers with proper typing
    const requestHeaders = new Headers();
    // Add base headers
    Object.entries(headers).forEach(([key, value]) => {
        requestHeaders.set(key.toLowerCase(), value);
    });
    // Convert Headers to Map
    const headerMap = new Map();
    requestHeaders.forEach((value, key) => {
        headerMap.set(key.toLowerCase(), value);
    });
    // Create raw request factory with proper cloning support
    const createRawRequest = (bodyText) => {
        // Create base methods
        const methods = {
            text: async () => bodyText || '',
            json: async () => bodyText ? JSON.parse(bodyText) : {}
        };
        // Create the raw request object with proper cloning
        const rawRequest = {
            method,
            url,
            headers: headerMap,
            ...(bodyText ? { body: bodyText } : {}),
            text: methods.text,
            json: methods.json,
            clone: function () {
                const cloned = {
                    method: this.method,
                    url: this.url,
                    headers: new Map(this.headers),
                    ...(bodyText ? { body: bodyText } : {}),
                    text: methods.text,
                    json: methods.json
                };
                // Bind clone method to cloned instance
                cloned.clone = this.clone.bind(cloned);
                return cloned;
            }
        };
        // Bind methods to the instance
        rawRequest.clone = rawRequest.clone.bind(rawRequest);
        rawRequest.text = methods.text.bind(rawRequest);
        rawRequest.json = methods.json.bind(rawRequest);
        return rawRequest;
    };
    // Create initial raw request
    const initialRawRequest = createRawRequest();
    let currentRawRequest = initialRawRequest;
    // If we have data, prepare it for the request
    if (data) {
        // Always stringify the data to ensure consistent handling
        const bodyText = JSON.stringify(data);
        // Set content type and length headers
        requestHeaders.set('content-type', 'application/json');
        requestHeaders.set('content-length', Buffer.from(bodyText).length.toString());
        // Create base request with proper method and URL
        const baseRequest = new Request(url, {
            method,
            headers: requestHeaders,
            body: bodyText,
            cache: 'no-store'
        });
        // Update current raw request with body
        currentRawRequest = createRawRequest(bodyText);
        // Create extended request object with proper method and URL
        const extendedRequest = Object.defineProperties(baseRequest, {
            method: {
                value: method,
                configurable: true,
                enumerable: true,
                writable: false
            },
            url: {
                value: url,
                configurable: true,
                enumerable: true,
                writable: false
            },
            raw: {
                value: currentRawRequest,
                configurable: true,
                enumerable: true,
                writable: false
            },
            header: {
                value: (name) => requestHeaders.get(name.toLowerCase()),
                configurable: true,
                enumerable: true,
                writable: false
            },
            parseBody: {
                value: async () => data,
                configurable: true,
                enumerable: true,
                writable: false
            },
            _body: {
                value: bodyText,
                configurable: true,
                enumerable: true,
                writable: false
            },
            json: {
                value: async () => data,
                configurable: true,
                enumerable: true,
                writable: false
            },
            text: {
                value: async () => bodyText,
                configurable: true,
                enumerable: true,
                writable: false
            }
        });
        // Convert headers to plain object for logging
        const logHeaderMap = {};
        extendedRequest.headers.forEach((value, key) => {
            logHeaderMap[key] = value;
        });
        // Log request details
        console.log('[Test] Request created:', {
            method: extendedRequest.method,
            url: extendedRequest.url,
            headers: logHeaderMap,
            body: data
        });
        return extendedRequest;
    }
    // Create base request without body
    const baseRequest = new Request(url, {
        method,
        headers: requestHeaders,
        cache: 'no-store'
    });
    // Create extended request object
    const extendedRequest = Object.create(baseRequest, {
        raw: {
            value: currentRawRequest,
            configurable: true,
            enumerable: true,
            writable: false
        },
        header: {
            value: (name) => requestHeaders.get(name.toLowerCase()),
            configurable: true,
            enumerable: true,
            writable: false
        },
        parseBody: {
            value: async () => ({}),
            configurable: true,
            enumerable: true,
            writable: false
        },
        bodyUsed: {
            get() { return baseRequest.bodyUsed; },
            configurable: true,
            enumerable: true
        }
    });
    return extendedRequest;
}
async function waitForServer(maxAttempts = 10, delay = 500) {
    console.log('[Test Client] Waiting for server to be ready...');
    let server = null;
    try {
        // Initialize server first
        const app = new Hono();
        app.get('/_ready', (c) => c.json({ status: 'ok' }));
        const serverInstance = await serve({
            fetch: app.fetch,
            port: 0 // Use any available port
        });
        // Convert Http2Server to standard Server if needed
        server = serverInstance instanceof Server ? serverInstance : createServer();
        const port = server.address().port;
        for (let i = 0; i < maxAttempts; i++) {
            try {
                console.log(`[Test Client] Attempt ${i + 1}/${maxAttempts} to check server readiness`);
                const req = new Request(`http://localhost:${port}/_ready`);
                const response = await fetch(req);
                if (response.status === 200) {
                    const body = await response.json();
                    console.log('[Test Client] Server is ready:', body);
                    return;
                }
                console.log(`[Test Client] Server returned status ${response.status}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.log(`[Test Client] Server not ready (attempt ${i + 1}/${maxAttempts}):`, errorMessage);
            }
            if (i < maxAttempts - 1) {
                console.log(`[Test Client] Waiting ${delay}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error('Server failed to become ready after multiple attempts');
    }
    finally {
        if (server) {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Server close timeout'));
                }, 5000);
                if (server) {
                    server.close((error) => {
                        clearTimeout(timeout);
                        if (error) {
                            console.error('[Test Client] Error closing server:', error);
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        }
    }
}
export async function createTestClient(app) {
    // Wait for server to be ready before creating client
    try {
        await waitForServer();
    }
    catch (error) {
        console.error('Failed to wait for server:', error);
        throw error;
    }
    const handler = async (req, res) => {
        try {
            // Parse URL and create full URL
            const url = new URL(req.url || '', 'http://localhost:3000');
            // Create headers object with lowercase keys
            const headers = {};
            Object.entries(req.headers).forEach(([key, value]) => {
                if (value) {
                    const headerValue = Array.isArray(value) ? value[0] : value;
                    headers[key.toLowerCase()] = headerValue;
                }
            });
            // Ensure authorization header is properly formatted
            if (headers['authorization']) {
                headers['authorization'] = headers['authorization'].toString();
            }
            // Read request body
            let requestBody = '';
            req.on('data', chunk => {
                requestBody += chunk.toString();
            });
            await new Promise((resolve) => {
                req.on('end', () => {
                    if (requestBody) {
                        try {
                            req._data = JSON.parse(requestBody);
                        }
                        catch {
                            req._data = requestBody;
                        }
                    }
                    resolve();
                });
            });
            // Log incoming request details
            console.log('[Test] Incoming request:', {
                method: req.method,
                url: req.url,
                headers: headers,
                data: req._data,
                rawBody: requestBody
            });
            // Create raw headers Map for Hono
            const rawHeaders = new Map();
            Object.entries(headers).forEach(([key, value]) => {
                rawHeaders.set(key.toLowerCase(), value);
            });
            // Create Hono request with enhanced properties
            const honoReq = await createHonoRequest(url.toString(), req.method || 'GET', headers, req._data);
            // Create base methods for raw request
            const methods = {
                text: async () => requestBody || '',
                json: async () => req._data || {}
            };
            // Create raw request object with proper methods
            const rawRequest = {
                method: req.method || 'GET',
                url: url.toString(),
                headers: rawHeaders,
                ...(requestBody ? { body: requestBody } : {}),
                text: methods.text,
                json: methods.json,
                clone: function () {
                    const cloned = {
                        method: this.method,
                        url: this.url,
                        headers: new Map(this.headers),
                        ...(requestBody ? { body: requestBody } : {}),
                        text: methods.text,
                        json: methods.json
                    };
                    // Bind clone method to cloned instance
                    cloned.clone = this.clone.bind(cloned);
                    return cloned;
                }
            };
            // Bind all methods to the instance
            rawRequest.clone = rawRequest.clone.bind(rawRequest);
            rawRequest.text = rawRequest.text.bind(rawRequest);
            rawRequest.json = rawRequest.json.bind(rawRequest);
            // Update honoReq with raw request
            Object.defineProperty(honoReq, 'raw', {
                value: rawRequest,
                configurable: true,
                enumerable: true,
                writable: false
            });
            // Send request to Hono app
            const honoRes = await app.fetch(honoReq);
            // Get response body
            const responseText = await honoRes.text();
            const responseHeaders = headersToObject(honoRes.headers);
            // Log response details
            console.log('[Test] Response details:', {
                status: honoRes.status,
                headers: responseHeaders,
                body: responseText ? JSON.parse(responseText) : null
            });
            // Set response status and headers
            res.statusCode = honoRes.status;
            Object.entries(responseHeaders).forEach(([key, value]) => {
                res.setHeader(key, value);
            });
            // Set response body
            if (responseText) {
                res.setHeader('Content-Type', responseHeaders['content-type'] || 'application/json');
                res.end(responseText);
            }
            else {
                res.end();
            }
        }
        catch (error) {
            // Log detailed error information
            console.error('[Test] Error handling request:', {
                url: req.url,
                method: req.method,
                headers: Object.fromEntries(Object.entries(req.headers)),
                data: req._data,
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            // Set error response headers with CORS
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            // Send detailed error response
            res.end(JSON.stringify({
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error',
                details: error instanceof Error ? error.stack : undefined,
                request: {
                    url: req.url,
                    method: req.method
                }
            }));
        }
    };
    const testClient = supertest(handler);
    testClient.request = () => testClient;
    testClient.close = async () => {
        // Clean up any remaining connections
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Server close timeout'));
            }, 5000);
            const server = handler.server;
            if (server && typeof server.close === 'function') {
                server.close((err) => {
                    clearTimeout(timeout);
                    if (err) {
                        console.error('[Test Client] Error closing server:', err);
                    }
                    resolve();
                });
            }
            else {
                clearTimeout(timeout);
                resolve();
            }
        }).catch(error => {
            console.error('[Test Client] Failed to close test client:', error);
        });
    };
    // Create a local server variable to store the server instance
    const serverInstance = await serve({
        fetch: app.fetch,
        port: 0 // Use any available port
    });
    return {
        client: testClient,
        server: serverInstance
    };
}
//# sourceMappingURL=hono-test-adapter.js.map