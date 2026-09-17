import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, Megaphone } from "lucide-react";

export default function NotificationHistory() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Broadcast history
        </h2>
        <p className="text-sm text-muted-foreground">
          Recent announcements and delivery results
        </p>
      </div>

      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle>Broadcast history unavailable</CardTitle>
              <CardDescription>
                This feature requires backend support for retrieving broadcast history.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="info">
            <Inbox className="h-4 w-4" />
            <AlertTitle>Not yet implemented</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                The backend currently supports sending broadcasts and previewing segment
                reach, but does not provide an endpoint for retrieving broadcast history.
              </p>
              <p className="text-sm">
                Once the backend implements <code className="font-mono text-xs bg-muted px-1 rounded">GET /admin/notifications/broadcast</code>,
                this section will display a table of past broadcasts with delivery status,
                recipient counts, and timestamps.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
