import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    console.error("ErrorBoundary caught an error:", error, errorInfo);

    if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
      // Dynamic import to avoid bundling Sentry in dev
      import("@sentry/react").then((Sentry) => {
        Sentry.captureException(error, {
          extra: {
            componentStack: errorInfo.componentStack,
          },
        });
      }).catch(() => {
        // Sentry not available or failed to load
      });
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center"
          role="alert"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
            <p className="text-muted-foreground max-w-md">
              We encountered an unexpected error. Please try again or contact support if the problem
              persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left max-w-md text-sm text-muted-foreground">
                <summary className="cursor-pointer font-medium mb-2">Error details (dev mode)</summary>
                <pre className="whitespace-pre-wrap rounded bg-muted p-4 overflow-auto max-h-64">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {"\n\n"}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
          <Button
            onClick={this.handleRetry}
            className="gap-2"
            aria-label="Retry loading the application"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
