import { Context } from 'hono';
import { z } from 'zod';
/**
 * Route definition interface
 */
export interface RouteDefinition {
    /** Route path (e.g., /api/tasks) */
    path: string;
    /** HTTP method */
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    /** Route handler function */
    handler: (c: Context) => Promise<Response>;
    /** Optional middleware functions */
    middleware?: Array<(c: Context, next: any) => Promise<Response | void>>;
    /** Optional route description */
    description?: string;
    /** Optional request body schema */
    requestSchema?: z.ZodSchema;
    /** Optional response schema */
    responseSchema?: z.ZodSchema;
}
/**
 * Route group interface
 */
export interface RouteGroup {
    /** Route group prefix */
    prefix: string;
    /** Routes in this group */
    routes: RouteDefinition[];
}
//# sourceMappingURL=routes.d.ts.map