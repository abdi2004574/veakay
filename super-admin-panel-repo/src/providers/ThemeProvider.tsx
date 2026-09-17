export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Light-only: force the `dark` class off so no dark theme can apply.
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
  }
  return <>{children}</>;
}
