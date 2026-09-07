import { useMemo } from "react";
import type { UserRole } from "../types/common";

export function usePermissions(role?: UserRole) {
  const permissions = useMemo(() => {
    // Admin panel: all functionality is super_admin only today
    // Extensible if TRD adds tiered admin roles later
    if (role === "super_admin") {
      return {
        users: { read: true, write: true, badge: true },
        agencies: { read: true, write: true, approve: true },
        campaigns: { read: true, flag: true },
        payments: { read: true, refund: true },
        content: { read: true, moderate: true },
        notifications: { broadcast: true },
        audit: { read: true },
        settings: { write: true },
      } as const;
    }
    return {};
  }, [role]);

  return { permissions };
}

export function hasPermission(
  permissions: ReturnType<typeof usePermissions>["permissions"],
  resource: keyof typeof permissions,
  action: string
): boolean {
  return !!permissions[resource]?.[action as keyof (typeof permissions)[typeof resource]];
}