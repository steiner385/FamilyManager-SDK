import { Permission, UserRole } from '../types/auth';
export declare function usePermissions(): {
    hasPermission: (permissionName: string) => boolean;
    hasRole: (role: UserRole) => boolean;
    getPermissions: () => Permission[];
    getUserRole: () => UserRole | null;
    permissions: Permission[];
    userRole: UserRole | undefined;
};
//# sourceMappingURL=usePermissions.d.ts.map