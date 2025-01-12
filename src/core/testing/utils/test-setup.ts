import { Hono } from 'hono';
import { apiRoutes } from '../../routes/api';

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
    request: async (input: Request | string, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url);
      // Remove the hostname part as Hono expects just the path
      const path = url.pathname + url.search;
      return app.request(path, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
    }
  };

  return testApp;
};
