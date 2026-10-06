import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { Toaster } from "./components/ui/use-toast";
import { ThemeProvider } from "./providers/ThemeProvider";
import App from "./App";
import { useAuthStore } from "./stores/auth-store";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/global.css";

// Initialize Sentry only in production with DSN
if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
  // Dynamic import to avoid bundling Sentry in dev
  import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || "0.1.0",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        // Filter out development errors in production build
        if (import.meta.env.DEV) {
          return null;
        }
        return event;
      },
    });
  }).catch(() => {
    // Sentry not available or failed to load
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthHydrator />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

function AuthHydrator() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);
  return null;
}
