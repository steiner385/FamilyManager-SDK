import { create } from 'zustand';
import { AuthState, Permission, TokenPayload } from '../types/auth';

interface AuthStore extends AuthState {
  setToken: (token: string | null) => void;
  setUser: (user: TokenPayload | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  permissions: [],
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  logout: () => set({ token: null, user: null, permissions: [], isAuthenticated: false }),
}));
