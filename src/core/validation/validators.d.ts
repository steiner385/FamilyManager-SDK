import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const userCreateSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["ADMIN", "PARENT", "MEMBER", "CHILD"]>;
}, "strip", z.ZodTypeAny, {
    role: "ADMIN" | "PARENT" | "MEMBER" | "CHILD";
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}, {
    role: "ADMIN" | "PARENT" | "MEMBER" | "CHILD";
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}>;
//# sourceMappingURL=validators.d.ts.map