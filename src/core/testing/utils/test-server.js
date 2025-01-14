import { Hono } from 'hono';
import { setupMiddleware } from '../../../config/middleware';
export function createTestServer() {
    const app = new Hono();
    setupMiddleware(app);
    // Add test endpoint
    app.post('/s', async (c) => {
        try {
            const body = await c.req.text();
            const contentType = c.req.header('content-type');
            // Handle JSON content-type explicitly
            if (contentType === 'application/json') {
                try {
                    JSON.parse(body);
                }
                catch {
                    return c.json({
                        success: false,
                        error: {
                            message: 'Invalid JSON content'
                        }
                    }, 400);
                }
            }
            // Try to parse as JSON regardless of content-type
            try {
                const data = JSON.parse(body);
                return c.json({
                    success: true,
                    data
                }, 200);
            }
            catch {
                return c.json({
                    success: false,
                    error: {
                        message: 'Invalid content'
                    }
                }, 400);
            }
        }
        catch (error) {
            return c.json({
                success: false,
                error: {
                    message: 'Server error'
                }
            }, 500);
        }
    });
    return app;
}
//# sourceMappingURL=test-server.js.map