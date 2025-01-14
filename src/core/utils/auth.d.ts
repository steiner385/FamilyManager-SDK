import { UserRole } from '../types/user-role';
export interface TokenPayload {
    userId: string;
    role: UserRole;
    exp?: number;
}
export declare function setTestTokenVerification(fn: (token: string) => TokenPayload | null): void;
export declare function hashPassword(password: string): string;
export declare function verifyPassword(password: string, hashedPassword: string): boolean;
export declare function generateToken(payload: TokenPayload): string;
export declare function verifyToken(token: string): TokenPayload | null;
//# sourceMappingURL=auth.d.ts.map