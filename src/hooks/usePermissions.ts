import { useCallback } from 'react';
import { useAuthStore } from '../store/auth';
import { Permission, UserRole } from '../types/auth';

export function usePermissions() {
  const { user, permissions } = useAuthStore();

  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!user || !permissions) return false;

    const permission = permissions.find((p: Permission) => p.name === permissionName);
    if (!permission) return false;

    return permission.roles.includes(user.role);
  }, [user, permissions]);

  const hasRole = useCallback((role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  const getPermissions = useCallback((): Permission[] => {
    return permissions || [];
  }, [permissions]);

  const getUserRole = useCallback((): UserRole | null => {
    return user?.role || null;
  }, [user]);

  return {
    hasPermission,
    hasRole,
    getPermissions,
    getUserRole,
    permissions,
    userRole: user?.role,
  };
}
