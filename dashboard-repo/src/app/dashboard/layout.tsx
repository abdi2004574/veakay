import { Sidebar, MobileMenuButton } from "@/components/layout";
import { Header } from "@/components/layout/header";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <MobileMenuButton />
            <Header />
          </div>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}