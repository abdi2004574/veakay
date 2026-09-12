"use client";

import { cn } from "@/components/ui/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success";
}

export function Alert({ className, variant = "default", children, ...props }: AlertProps) {
  const variants = {
    default: "border-l-4 border-primary bg-primary/5 text-primary-900 dark:text-primary-100",
    destructive: "border-l-4 border-destructive bg-destructive/5 text-destructive-900 dark:text-destructive-100",
    warning: "border-l-4 border-amber-500 bg-amber-50 text-amber-900 dark:text-amber-100",
    success: "border-l-4 border-green-500 bg-green-50 text-green-900 dark:text-green-100",
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-3 rounded-border p-4",
        variants[variant],
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

