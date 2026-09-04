import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    
    // Add global error handler to catch and suppress specific errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        // Suppress "send was called before connect" errors
        if (event.message && event.message.includes('send was called before connect')) {
          event.preventDefault();
          console.warn('Suppressed connection error:', event.message);
        }
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        // Suppress promise rejection errors related to connection
        if (event.reason && event.reason.message && 
            event.reason.message.includes('send was called before connect')) {
          event.preventDefault();
          console.warn('Suppressed connection promise error:', event.reason.message);
        }
      });
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="text-center max-w-md">
            <h1 className="text-2xl mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="px-6 py-3 rounded-full text-white"
              style={{ background: "var(--veakey-gradient)" }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}