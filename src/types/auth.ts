export type UserRole = 'admin' | 'user' | 'guest';

export interface TokenPayload {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  roles: UserRole[];
}

export interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface AuthState {
  token: string | null;
  user: TokenPayload | null;
  isAuthenticated: boolean;
  permissions: Permission[];
}
