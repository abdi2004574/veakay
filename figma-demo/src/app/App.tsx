import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="max-w-[430px] mx-auto min-h-screen bg-background">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}