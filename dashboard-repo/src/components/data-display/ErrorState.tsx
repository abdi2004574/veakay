"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: Error | { message?: string };
  onRetry?: () => void;
  message?: string;
}

export function ErrorState({ error, onRetry, message }: ErrorStateProps) {
  const errorMessage = message ?? error?.message ?? "Something went wrong";

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Error</p>
          <p className="text-sm text-muted-foreground max-w-sm">{errorMessage}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
