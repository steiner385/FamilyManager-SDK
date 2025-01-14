import { SuperTest, Test } from 'supertest';
import { IncomingMessage, ServerResponse, Server } from 'node:http';
type TestClientType = SuperTest<Test> & {
    request(): SuperTest<Test>;
    close(): Promise<void>;
};
type HonoApp = {
    fetch: (request: Request, env?: unknown) => Promise<Response> | Response;
};
export declare function createTestClient(app: HonoApp): Promise<{
    client: TestClientType;
    server: Server<typeof IncomingMessage, typeof ServerResponse>;
}>;
export {};
//# sourceMappingURL=hono-test-adapter.d.ts.map