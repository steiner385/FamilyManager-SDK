import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    permissions: [],
    isAuthenticated: false,
    setToken: (token) => set({ token, isAuthenticated: !!token }),
    setUser: (user) => set({ user }),
    setPermissions: (permissions) => set({ permissions }),
    logout: () => set({ token: null, user: null, permissions: [], isAuthenticated: false }),
}));
//# sourceMappingURL=auth.js.map