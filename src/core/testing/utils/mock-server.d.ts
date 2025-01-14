import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
export declare const createMockServer: () => {
    app: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    close(): Promise<void>;
};
export declare const mockServer: {
    app: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    close(): Promise<void>;
};
export declare const app: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const cleanup: () => Promise<void>;
//# sourceMappingURL=mock-server.d.ts.map