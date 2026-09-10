import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KYCPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
        <p className="text-muted-foreground">Know Your Customer verification</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
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