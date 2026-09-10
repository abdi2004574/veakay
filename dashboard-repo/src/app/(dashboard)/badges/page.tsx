import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BadgesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Badge Management</h1>
        <p className="text-muted-foreground">Manage achievement badges</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Badge Management</CardTitle>
          <CardDescription>Backend integration pending</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will be populated once the backend endpoints are integrated.
            See the API integration checklist in the project requirements.
          </p>
          <div className="mt-4">
            <Badge variant="pending">In Progress</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}