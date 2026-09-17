import { Suspense, lazy } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/shared/PageShell";

const ProfileForm = lazy(() => import("./ProfileForm"));
const NotificationPreferences = lazy(() => import("./NotificationPreferences"));
const PlatformSettings = lazy(() => import("./PlatformSettings"));

function TabSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Manage your admin profile, notification preferences, and platform settings."
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Suspense fallback={<TabSkeleton />}>
            <ProfileForm />
          </Suspense>
        </TabsContent>

        <TabsContent value="notifications">
          <Suspense fallback={<TabSkeleton />}>
            <NotificationPreferences />
          </Suspense>
        </TabsContent>

        <TabsContent value="platform">
          <Suspense fallback={<TabSkeleton />}>
            <PlatformSettings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
