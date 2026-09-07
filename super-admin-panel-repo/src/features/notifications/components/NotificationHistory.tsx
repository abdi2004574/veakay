import { useQuery } from "@tanstack/react-query";
import { getBroadcastHistory } from "../api/notifications";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

export default function NotificationHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "history"],
    queryFn: getBroadcastHistory,
  });

  const notifications = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Broadcast history and delivery status</p>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Target</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Sent At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-8"><Skeleton className="h-4 w-full" /></td></tr>
            ) : notifications.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No broadcasts yet</td></tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{n.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">{n.target}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(n.sentAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}