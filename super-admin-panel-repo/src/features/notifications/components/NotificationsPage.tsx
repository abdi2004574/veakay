import BroadcastComposer from "./BroadcastComposer";
import NotificationHistory from "./NotificationHistory";
import { PageShell } from "@/components/shared/PageShell";

export default function NotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      description="Send targeted announcements and review broadcast delivery"
    >
      <BroadcastComposer />
      <NotificationHistory />
    </PageShell>
  );
}
