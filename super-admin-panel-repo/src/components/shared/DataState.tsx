import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PackageSearch, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface LoadingStateProps {
  rows?: number;
  columns?: number;
}

export function LoadingState({ rows = 5, columns = 4 }: LoadingStateProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-10 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data",
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--vaykae-gradient-light)]">
        {icon ?? (
          <PackageSearch className="h-6 w-6 text-[var(--vaykae-pink)]" />
        )}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
        <AlertCircle className="h-6 w-6 text-rose-600" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {message && (
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      )}
      {onRetry && (
        <GradientButton
          variant="primary"
          size="sm"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4" />
          Try again
        </GradientButton>
      )}
    </div>
  );
}
