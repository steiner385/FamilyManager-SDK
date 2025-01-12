import { useAppSelector, RootState } from '../store';
import { Permission } from '../types/auth';

export function usePermissions() {
  const user = useAppSelector((state: RootState) => state.auth.user);

  const hasPermission = (requiredPermission: Permission): boolean => {
    if (!user) return false;

    switch (requiredPermission) {
      case 'admin':
        return user.role === 'admin';
      case 'user':
        return user.role === 'admin' || user.role === 'user';
      case 'guest':
        return true;
      default:
        return false;
    }
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role
  };
}
