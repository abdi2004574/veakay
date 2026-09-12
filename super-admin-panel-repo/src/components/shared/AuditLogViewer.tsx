import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AuditLogEntry as AuditLog } from '@/features/audit/types';

interface AuditLogViewerProps {
  logs: AuditLog[];
  isLoading?: boolean;
}

export default function AuditLogViewer({
  logs,
  isLoading = false,
}: AuditLogViewerProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!logs.length) {
    return <p className="text-sm text-muted-foreground">No audit log entries.</p>;
  }

  const getActionLabel = (action: string) => {
    return action.replace(/./g, ' ').replace(/_/g, ' ');
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {getActionLabel(log.action)}
              </CardTitle>
              <Badge variant="outline">{format(new Date(log.createdAt), 'PPpp')}</Badge>
            </div>
            <CardDescription>
              By {log.actorUser?.displayName ?? log.actorRole} on {log.targetType}:{log.targetId}
            </CardDescription>
          </CardHeader>
          {log.metadata && (
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
