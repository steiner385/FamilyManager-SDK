import { PrismaClient, Prisma } from '@prisma/client';
export declare function getPrismaClient(): PrismaClient;
export declare function disconnectPrisma(): Promise<void>;
export declare function resetPrismaClient(): Promise<void>;
declare const _default: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default _default;
//# sourceMappingURL=prisma.d.ts.map