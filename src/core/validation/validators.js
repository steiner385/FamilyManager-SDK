import { z } from 'zod';
export const emailSchema = z
    .string()
    .email('Invalid email format');
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');
export const userCreateSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['ADMIN', 'PARENT', 'MEMBER', 'CHILD'])
});
//# sourceMappingURL=validators.js.map