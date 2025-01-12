import { useState, useCallback } from 'react';

interface UsePermissionsReturn {
  hasPermission: (permission: string) => boolean;
  grantPermission: (permission: string) => void;
  revokePermission: (permission: string) => void;
}

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  const hasPermission = useCallback((permission: string): boolean => {
    return permissions.has(permission);
  }, [permissions]);

  const grantPermission = useCallback((permission: string): void => {
    setPermissions(prev => {
      const next = new Set(prev);
      next.add(permission);
      return next;
    });
  }, []);

  const revokePermission = useCallback((permission: string): void => {
    setPermissions(prev => {
      const next = new Set(prev);
      next.delete(permission);
      return next;
    });
  }, []);

  return {
    hasPermission,
    grantPermission,
    revokePermission
  };
}
