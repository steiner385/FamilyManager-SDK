import { AuthState, Permission, TokenPayload } from '../types/auth';
interface AuthStore extends AuthState {
    setToken: (token: string | null) => void;
    setUser: (user: TokenPayload | null) => void;
    setPermissions: (permissions: Permission[]) => void;
    logout: () => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>;
export {};
//# sourceMappingURL=auth.d.ts.map