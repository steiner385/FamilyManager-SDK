import { useCallback } from 'react';
import { useAuthStore } from '../store/auth';
export function usePermissions() {
    const { user, permissions } = useAuthStore();
    const hasPermission = useCallback((permissionName) => {
        if (!user || !permissions)
            return false;
        const permission = permissions.find((p) => p.name === permissionName);
        if (!permission)
            return false;
        return permission.roles.includes(user.role);
    }, [user, permissions]);
    const hasRole = useCallback((role) => {
        if (!user)
            return false;
        return user.role === role;
    }, [user]);
    const getPermissions = useCallback(() => {
        return permissions || [];
    }, [permissions]);
    const getUserRole = useCallback(() => {
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
//# sourceMappingURL=usePermissions.js.map