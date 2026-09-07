import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type {
  CampaignStatus,
  AgencyStatus,
  WithdrawalStatus,
  ReportStatus,
  UserStatus,
  AgencySubscriptionTier,
} from '@/types/common';

type StatusValue =
  | CampaignStatus
  | AgencyStatus
  | WithdrawalStatus
  | ReportStatus
  | UserStatus
  | AgencySubscriptionTier
  | string;

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' }> =
  {
  active: { variant: 'success' },
  approved: { variant: 'success' },
  completed: { variant: 'success' },
  confirmed: { variant: 'success' },
  paid: { variant: 'success' },
  resolved: { variant: 'success' },
  resolved: { variant: 'success' },

  pending: { variant: 'warning' },
  pending_verification: { variant: 'warning' },
  requested: { variant: 'warning' },
  in_discussion: { variant: 'warning' },
  draft: { variant: 'secondary' },
  premium: { variant: 'secondary' },
  featured: { variant: 'secondary' },
  inactive: { variant: 'secondary' },
  suspended: { variant: 'warning' },

  flagged: { variant: 'destructive' },
  rejected: { variant: 'destructive' },
  declined: { variant: 'destructive' },
  cancelled: { variant: 'destructive' },
  deleted: { variant: 'destructive' },
  banned: { variant: 'destructive' },

  basic: { variant: 'outline' },
};

export interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? { variant: 'outline' };
  const label = status.replace(/_/g, ' ').replace(/w/g, (c) => c.toUpperCase());

  return (
    <Badge
      variant={config.variant}
      className={cn('capitalize', className)}
    >
      {label}
    </Badge>
  );
}
