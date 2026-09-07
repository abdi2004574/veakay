import type { AuditAction } from "../../types/common";

export interface AuditLogEntry {
  id: string;
  actorUser?: { id: string; displayName: string; email: string };
  actorRole: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogFilters {
  action?: string;
  actorRole?: string;
  targetType?: string;
  cursor?: string;
  limit?: number;
}