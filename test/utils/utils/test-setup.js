import { Hono } from 'hono';
import { apiRoutes } from '../../routes/api';
import fetch, { Request as NodeRequest, Response as NodeResponse } from 'node-fetch';
// Make Request available globally for tests
global.Request = NodeRequest;
global.Response = NodeResponse;
global.fetch = fetch;
export const setupTestApp = () => {
    const app = new Hono();
    // Add a middleware to log requests in tests
    app.use('*', async (c, next) => {
        console.log(`[TEST] ${c.req.method} ${c.req.url}`);
        await next();
    });
    // Mount the routes at the root level
    app.route('/', apiRoutes);
    // Add a catch-all handler for unmatched routes
    app.all('*', (c) => {
        console.log(`[TEST] No route matched for ${c.req.method} ${c.req.url}`);
        return c.json({ error: 'Not Found' }, 404);
    });
    // Create a wrapper around the app to handle test requests
    const testApp = {
        request: async (input, init) => {
            const request = typeof input === 'string' ? new NodeRequest(input, init) : input;
            const url = new URL(request.url);
            // Remove the hostname part as Hono expects just the path
            const path = url.pathname + url.search;
            // Convert body to string if it exists
            let body;
            if (request.body) {
                body = await request.text();
            }
            // Convert headers to plain object
            const headers = {};
            request.headers.forEach((value, key) => {
                headers[key] = value;
            });
            // Make the request using Hono's request method
            return app.request(path, {
                method: request.method,
                headers,
                body,
            });
        }
    };
    return testApp;
};
//# sourceMappingURL=test-setup.js.map