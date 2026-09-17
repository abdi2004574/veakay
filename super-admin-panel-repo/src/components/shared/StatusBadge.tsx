import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CampaignStatus,
  AgencyStatus,
  WithdrawalStatus,
  ReportStatus,
  UserStatus,
  AgencySubscriptionTier,
} from "@/types/common";

type StatusValue =
  | CampaignStatus
  | AgencyStatus
  | WithdrawalStatus
  | ReportStatus
  | UserStatus
  | AgencySubscriptionTier
  | string;

const statusConfig: Record<
  string,
  {
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "success"
      | "warning"
      | "outline";
  }
> = {
  active: { variant: "success" },
  approved: { variant: "success" },
  completed: { variant: "success" },
  confirmed: { variant: "success" },
  paid: { variant: "success" },
  resolved: { variant: "success" },

  pending: { variant: "warning" },
  pending_verification: { variant: "warning" },
  requested: { variant: "warning" },
  in_discussion: { variant: "warning" },
  draft: { variant: "secondary" },
  premium: { variant: "secondary" },
  featured: { variant: "secondary" },
  inactive: { variant: "secondary" },
  suspended: { variant: "warning" },

  flagged: { variant: "destructive" },
  rejected: { variant: "destructive" },
  declined: { variant: "destructive" },
  cancelled: { variant: "destructive" },
  deleted: { variant: "destructive" },
  banned: { variant: "destructive" },

  basic: { variant: "outline" },
};

const variantStyles: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  destructive: "bg-rose-50 text-rose-700 border-rose-200",
  secondary:
    "bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)] border-[var(--vaykae-pink)]/20",
  outline: "text-foreground border-border",
  default: "bg-muted text-muted-foreground border-border",
};

export interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? { variant: "outline" };
  const label = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "capitalize border",
        variantStyles[config.variant],
        className,
      )}
    >
      {label}
    </Badge>
  );
}
